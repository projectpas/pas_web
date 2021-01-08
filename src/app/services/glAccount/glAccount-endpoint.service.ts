import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';
import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { GlAccount } from '../../models/GlAccount.model';

@Injectable()
export class GlAccountEndpointService extends EndpointFactory {

    private readonly getAllURL: string = "/api/GlAccount/getAllGLAccount";
    private readonly getByIdURL: string = "/api/GlAccount/getById";
    private readonly addURL: string = "/api/GlAccount/add";
    private readonly updateURL: string = "/api/GlAccount/update";
    private readonly removeglId: string = "/api/GlAccount/removeGlaccountId";
    private readonly getAllGlAccount: string = "/api/GlAccount/GLAccountList"

    private readonly getMiscdataURL: string = '/api/GlAccount/getMiscData';

    get getAll() { return this.configurations.baseUrl + this.getAllURL; }
    get getById() { return this.configurations.baseUrl + this.getByIdURL; }
    get add() { return this.configurations.baseUrl + this.addURL; }
    get update() { return this.configurations.baseUrl + this.updateURL; }
    get removeglaccount() { return this.configurations.baseUrl + this.removeglId; }

    get getMiscdata() { return this.configurations.baseUrl + this.getMiscdataURL; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getAllGlAccounts<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllGlAccounts());
            }));
    }

    getGlAccountById<T>(glAccountId: number): Observable<T> {
        let endpointUrl = `${this.getById}/${glAccountId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getGlAccountById(glAccountId));
            }));
    }

    addGlAccount<T>(data: any): Observable<T> {
        // let endpointUrl = this.add;
        //alert(JSON.stringify(data));
        return this.http.post<any>(this.add, JSON.stringify(data), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addGlAccount(data));
            }));
    }

    updateGlAccount<T>(glAccount: GlAccount): Observable<T> {
        let endpointUrl = this.update;

        return this.http.post<any>(endpointUrl, JSON.stringify(glAccount), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateGlAccount(glAccount));
            }));
    }

    removeGlAccountById<T>(glAccountId: number): Observable<T> {
        let endpointUrl = `${this.removeglaccount}/${glAccountId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.removeGlAccountById(glAccountId));
            }));
    }
    getMiscData<T>(): Observable<T> {
        let endpointUrl = this.getMiscdata;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getMiscData());
            }));
    }


    //deleteAssetType<T>(glaccountId: number): Observable<T> {
    //    let endpointUrl = `${this.removeglaccountById}/${glaccountId}`;

    //    return this.http.get<T>(endpointUrl, this.getRequestHeaders())
    //        .catch(error => {
    //            return this.handleError(error, () => this.deleteAssetType(glaccountId));
    //        });
    //}


    glAccountEndpoint<T>(paginationOption: any): Observable<T> {
        return this.http.post<any>(this.getAllGlAccount, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.glAccountEndpoint(paginationOption));
            }));
    }
}