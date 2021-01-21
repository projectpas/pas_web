// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { AuthService } from './auth.service';
import { ConfigurationService } from './configuration.service';
import { AlertService, MessageSeverity } from '../services/alert.service';
import { environment } from 'src/environments/environment';


@Injectable()
export class EndpointFactory {
    static readonly apiVersion: string = "1";

    private readonly _loginUrl: string = "/connect/token";

    private get loginUrl() { return environment.baseUrl + this._loginUrl; }

    private taskPauser: Subject<any>;
    private isRefreshingLogin: boolean;

    private _authService: AuthService;
    private _alertService: AlertService;

    private get alertService() {
        if (!this._alertService) {
            this._alertService = this.injector.get(AlertService);
        }

        return this._alertService;
    }

    private get authService() {
        if (!this._authService) {
            this._authService = this.injector.get(AuthService);
        }

        return this._authService;
    }

    constructor(protected http: HttpClient, protected configurations: ConfigurationService, private injector: Injector) {

    }

    getLoginEndpoint<T>(userName: string, password: string,masterCompanyId:number): Observable<T> {

        let header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

        let params = new HttpParams()
            .append('username', userName)
            .append('password', password)
            .append('masterCompanyId',masterCompanyId.toString())
            .append('client_id', 'quickapp_spa')
            .append('grant_type', 'password')
            .append('scope', 'openid email phone profile offline_access roles quickapp_api');

        return this.http.post<T>(this.loginUrl, params, { headers: header });
    }

    employeeDetailsByEmpId(id){       
            const url = `${this.configurations.baseUrl}/api/Employee/GetloginUserInfo/${id}`;
        return this.http.get<any>(url,this.getRequestHeaders());
    }

    getRefreshLoginEndpoint<T>(): Observable<T> {
        let header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

        let params = new HttpParams()
            .append('refresh_token', this.authService.refreshToken)
            .append('client_id', 'quickapp_spa')
            .append('grant_type', 'refresh_token');

        return this.http.post<T>(this.loginUrl, params, { headers: header })
            .catch(error => {
                return this.handleError(error, () => this.getRefreshLoginEndpoint());
            });
    }

    getRequestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
        let headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.authService.accessToken,
            'Content-Type': 'application/json',
            'Accept': `application/vnd.iman.v${EndpointFactory.apiVersion}+json, application/json, text/plain, */*`,
            'App-Version': ConfigurationService.appVersion,
            'Access-Control-Allow-Origin':'*'
        });

        return { headers: headers };
    }

    handleError(error, continuation: () => Observable<any>) {
        if (error.status == 401) {
            if (this.isRefreshingLogin) {
                return this.pauseTask(continuation);
            }

            this.isRefreshingLogin = true;

            return this.authService.refreshLogin()
                .mergeMap(data => {
                    this.isRefreshingLogin = false;
                    this.resumeTasks(true);

                    return continuation();
                })
                .catch(refreshLoginError => {
                    this.isRefreshingLogin = false;
                    this.resumeTasks(false);

                    if (refreshLoginError.status == 401 || (refreshLoginError.url && refreshLoginError.url.toLowerCase().includes(this.loginUrl.toLowerCase()))) {
                        this.authService.reLogin();
                        return Observable.throw('session expired');
                    }
                    else {
                        return Observable.throw(refreshLoginError || 'server error');
                    }
                });
        }

        if (error.status == 422) {
            var keys = Object.keys(error.error);
            var msg = '';
            keys.forEach((value, index) => {
                if (error.error[value] != undefined) {
                    msg = msg + error.error[value] + '<br/>';
                }
            });
            return Observable.throw(msg);
        }

        if (error.status == 400) {
            var keys = Object.keys(error.error);
            var msg = '';
            keys.forEach((value, index) => {
                if (error.error[value] != undefined) {
                    msg = msg + error.error[value] + '<br/>';
                }
            });
            return Observable.throw(msg);
        }

        if (error.status == 500) {
            var keys = Object.keys(error.error);
            var msg = '';
            keys.forEach((value, index) => {
                if (error.error[value] != undefined) {
                    msg = msg + error.error[value] + '<br/>';
                }
            });
            return Observable.throw(msg);
        }
       
        if (error.url && error.url.toLowerCase().includes(this.loginUrl.toLowerCase())) {
            this.authService.reLogin();

            return Observable.throw((error.error && error.error.error_description) ? `session expired (${error.error.error_description})` : 'session expired');
        }
        else {
            return Observable.throw(error);
        }
    }

    handleErrorCommon(error, continuation: () => Observable<any>) {
        if (error.status == 401) {
            if (this.isRefreshingLogin) {
                return this.pauseTask(continuation);
            }

            this.isRefreshingLogin = true;

            return this.authService.refreshLogin()
                .mergeMap(data => {
                    this.isRefreshingLogin = false;
                    this.resumeTasks(true);

                    return continuation();
                })
                .catch(refreshLoginError => {
                    this.isRefreshingLogin = false;
                    this.resumeTasks(false);

                    if (refreshLoginError.status == 401 || (refreshLoginError.url && refreshLoginError.url.toLowerCase().includes(this.loginUrl.toLowerCase()))) {
                        this.authService.reLogin();
                        return Observable.throw('session expired');
                    }
                    else {
                        return Observable.throw(refreshLoginError || 'server error');
                    }
                });
        }

        if (error.status == 422) {
            this.showErrorMessage(error, "Validation Error");
            return Observable.throw(error);
        }

        if (error.status == 400) {
            this.showErrorMessage(error, "Validation Error");
            return Observable.throw(error);
        }

        if (error.status == 500) {
           this.showErrorMessage(error, "Error")
            return Observable.throw(error);
        }
        if (error.url && error.url.toLowerCase().includes(this.loginUrl.toLowerCase())) {
            this.authService.reLogin();

            return Observable.throw((error.error && error.error.error_description) ? `session expired (${error.error.error_description})` : 'session expired');
        }
        else {
            return Observable.throw(error);
        }
    }

    private showErrorMessage(error, errorType) {
        var keys = Object.keys(error.error);
        var msg = '';
        keys.forEach((value, index) => {
            if (error.error[value] != undefined) {
                //msg = msg + error.error[value] + '<br/>';
                msg = msg + error.error[value];
            }
        });
        this.alertService.showMessage(
            errorType,
            msg,
            MessageSeverity.error
        );
        setTimeout(() => this.alertService.stopLoadingMessage(), 10000);
    }

    private pauseTask(continuation: () => Observable<any>) {
        if (!this.taskPauser) {
            this.taskPauser = new Subject();
        }

        return this.taskPauser.switchMap(continueOp => {
            return continueOp ? continuation() : Observable.throw('session expired');
        });
    }

    private resumeTasks(continueOp: boolean) {
        setTimeout(() => {
            if (this.taskPauser) {
                this.taskPauser.next(continueOp);
                this.taskPauser.complete();
                this.taskPauser = null;
            }
        });
    }
}