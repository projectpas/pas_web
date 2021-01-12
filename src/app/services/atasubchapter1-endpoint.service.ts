
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from 'src/environments/environment';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ATASubChapter1Endpoint extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/ATASubChapter1/Get";
    private readonly _actionsUrlNew: string = "/api/ATASubChapter1/actions";
    private readonly _actionsUrlAuditHistory: string = "/api/ATASubChapter1/ataauditHistoryById";
    private readonly getAtaSubChapterAuditById: string = "/api/ATASubChapter1/audits";
    private readonly getSubChaptersListById: string = environment.baseUrl + "/api/ATASubChapter1/ATASubChapterByATAChapterId";
    private readonly getSubChaptersList: string = environment.baseUrl + "/api/ATASubChapter1/ATASubChapter";

    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getATASubChapter1Endpoint<T>(): Observable<T> {

        return this.http.get<T>(this.actionsUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getATASubChapter1Endpoint());
            });
    }
    getNewATASubChapter1Endpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewATASubChapter1Endpoint(userObject));
            });
    }

    getHistoryATASubChapter1Endpoint<T>(ataSubChapterId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${ataSubChapterId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryATASubChapter1Endpoint(ataSubChapterId));
            });
    }

    getEditATASubChapter1Endpoint<T>(ataSubChapterId?: number): Observable<T> {
        let endpointUrl = ataSubChapterId ? `${this._actionsUrlNew}/${ataSubChapterId}` : this._actionsUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditATASubChapter1Endpoint(ataSubChapterId));
            });
    }

    getUpdateATASubChapter1Endpoint<T>(roleObject: any, ataSubChapterId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${ataSubChapterId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateATASubChapter1Endpoint(roleObject, ataSubChapterId));
            });
    }

    getDeleteATASubChapter1Endpoint<T>(ataSubChapterId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${ataSubChapterId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteATASubChapter1Endpoint(ataSubChapterId));
            });
    }


    getATASubChapterAuditById<T>(ataSubChapterId: number): Observable<T> {
        let endpointUrl = `${this.getAtaSubChapterAuditById}/${ataSubChapterId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getATASubChapterAuditById(ataSubChapterId));
            });
    }

    getAtaSubChaptersListByAtaChapterId<T>(ataChapterId: number): Observable<T> {
        let endpointUrl = `${this.getSubChaptersListById}/${ataChapterId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAtaSubChaptersListByAtaChapterId(ataChapterId));
            });
    }
    getAtaSubChaptersList<T>(): Observable<T> {
        let endpointUrl = `${this.getSubChaptersList}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAtaSubChaptersList());
            });
    }
}