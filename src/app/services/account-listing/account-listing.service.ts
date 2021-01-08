
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';




//import { AccountListingEndpointService } from './account-listing-endpoint.service';
import { map } from 'rxjs/operators';
import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';

import {catchError} from 'rxjs/operators';
@Injectable()
export class AccountListingService extends EndpointFactory {

   private readonly createGlAccountUrl: string = "/api/GlAccount/add";
   private readonly updateGlAccountUrl: string = "/api/GlAccount/update";
   private readonly editGlAccountUrl: string = "/api/GlAccount/getById";
    private readonly getGlAccountUrl: string = "/api/GlAccount/GLAccountList";
   //private readonly getGlAccountByIdUrl: string = "/api/nodesetup/getById";
   private readonly getGlAccountByIdUrl: string = "/api/GlAccount/getById";
   //private readonly getLedgerNamesUrl: string = "/api/nodesetup/getAll";
   private readonly getLedgerNamesUrl: string = "/api/ManagementStrcture/LedgerNames";
   private readonly getLeafNodeUrl: string = "/api/nodesetup/getAllLeafNode";
    private readonly getEntitiesByParentIdUrl: string = "/api/Legalentity/childentitiesbyparentid";
    private readonly deleteglIdUrl: string = "/api/GlAccount/DeleteGLAccount";
    private readonly glaccountstatus: string = "/api/GlAccount/GlAccountstatus";
    private readonly glaccountsearch: string = "/api/GlAccount/glaccountglobalsearch";

    private readonly _glCashFlowClassificationsUrlAuditHistory: string = "/api/GlAccount/auditHistoryById";

   get createGlAccountUri() { return this.configurations.baseUrl + this.createGlAccountUrl; }
   get updateGlAccountUri() { return this.configurations.baseUrl + this.updateGlAccountUrl; }
   get editGlAccountUri() { return this.configurations.baseUrl + this.editGlAccountUrl; }
   get getGlAccountUri() { return this.configurations.baseUrl + this.getGlAccountUrl; }
   get getGlAccountByIdUri() { return this.configurations.baseUrl + this.getGlAccountByIdUrl; }
   get getLedgerNamesUri() { return this.configurations.baseUrl + this.getLedgerNamesUrl; }
   get getLeafNodeUri() { return this.configurations.baseUrl + this.getLeafNodeUrl; }
    get getEntitiesByParentIdUri() { return this.configurations.baseUrl + this.getEntitiesByParentIdUrl; }
    get deleteglIdUri() { return this.configurations.baseUrl + this.deleteglIdUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

   
    public getAll(serverSidePagesData: any): Observable<any> {
        //return this.http.get('dist/assets/data/accountlisting.json').pipe(map((response: any) => response)); 
        return this.http.post<any>(this.getGlAccountUri, JSON.stringify(serverSidePagesData), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAll(serverSidePagesData));
            }));
      //return this.http.get(`${this.getGlAccountUri}`).pipe(map((response: any) => response)); 
        //return forkJoin(this.accountListEndpointservice.getData<any[]>());
    }

    public getLedgerData(): Observable<any> {
        //return this.http.get('dist/assets/data/accountlisting.json').pipe(map((response: any) => response)); 
      return this.http.get(`${this.getLedgerNamesUri}`).pipe(map((response: any) => response)); 
        //return forkJoin(this.accountListEndpointservice.getData<any[]>());
    }

    public getLeafNodeData(): Observable<any> {
        //return this.http.get('dist/assets/data/accountlisting.json').pipe(map((response: any) => response)); 
      return this.http.get(`${this.getLeafNodeUri}`).pipe(map((response: any) => response)); 
        //return forkJoin(this.accountListEndpointservice.getData<any[]>());
    }

    public getGlAccountById(nodeId): Observable<any> {
        //return this.http.get('dist/assets/data/accountlisting.json').pipe(map((response: any) => response)); 
      return this.http.get(`${this.getGlAccountByIdUri}/${nodeId}`).pipe(map((response: any) => response)); 
        //return forkJoin(this.accountListEndpointservice.getData<any[]>());
    }

    public getEntitiesByParentId(parentId): Observable<any> {
        //return this.http.get('dist/assets/data/accountlisting.json').pipe(map((response: any) => response)); 
        return this.http.get(`${this.getEntitiesByParentIdUri}/${parentId}`).pipe(map((response: any) => response));
        //return forkJoin(this.accountListEndpointservice.getData<any[]>());
    }

    createGlAccount1(data: any): Observable<any> {
        let body = JSON.stringify(data);
       // alert(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        return this.http.post(this.createGlAccountUri, body, this.getRequestHeaders())
            .pipe(map((response: HttpResponseBase) => {
                return <any>response;

            }),catchError((error: HttpErrorResponse) => observableThrowError(error)));
    }

    createGlAccount<T>(userObject: any): Observable<T> {
    //    alert(JSON.stringify(userObject));

        return this.http.post<any>(this.createGlAccountUri, JSON.stringify(userObject), this.getRequestHeaders())
                .pipe(catchError(error => {
                    return this.handleError(error, () => this.createGlAccount(userObject));
                }));
        }
   // }


    getGlobalEntityRecords<T>(pageSearch: any): Observable<T> {
        let endpointUrl = this.getGlAccountUrl;
        return this.http.post<any>(endpointUrl, JSON.stringify(pageSearch), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getGlobalEntityRecords(pageSearch));
            }));
    }

    updatestatusactive<T>(userObject: any): Observable<T> {
        //    alert(JSON.stringify(userObject));
        let endpointUrl = `${this.glaccountstatus}?glAccountId=${userObject.glAccountId}&status=${userObject.isActive}&updatedBy=${userObject.updatedBy}`;
        return this.http.get<any>(endpointUrl,  this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updatestatusactive(userObject));
            }));
    }
   // }

    updateGlAccount(data: any): Observable<any> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        return this.http.post(this.updateGlAccountUri, body, this.getRequestHeaders())
            .pipe(map((response: HttpResponseBase) => {
                return <any>response;

            }),catchError((error: HttpErrorResponse ) => observableThrowError(error)));
    }

    public editGlAccountById(accountId): Observable<any> {
        //return this.http.get('dist/assets/data/accountlisting.json').pipe(map((response: any) => response)); 
        return this.http.get(`${this.editGlAccountUri}/${accountId}`).pipe(map((response: any) => response)); 
        //return forkJoin(this.accountListEndpointservice.getData<any[]>());
    }

    public deleteGlAccountById(accountId): Observable<any> {         
        //return this.http.get(`${this.deleteglIdUri}/${accountId}`).pipe(map((response: any) => response));     

        let deleteglIdUrl = `${this.deleteglIdUri}/${accountId}`;

        return this.http.delete(deleteglIdUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.deleteGlAccountById(accountId));
            }));
    }



    public getHistory(accountId): Observable<any> {
        let endpointUrl = `${this._glCashFlowClassificationsUrlAuditHistory}/${accountId}`;

        return this.http.get(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistory(accountId));
            }));
    }
    
}