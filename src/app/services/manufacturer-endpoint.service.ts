import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class ManufacturerEndpoint extends EndpointFactory {


    private readonly _manufacturerUrl: string = "/api/Manufacturer/Get";
    private readonly _manufacturerUrlNew: string = "/api/Manufacturer/manufacturerpost";
    private readonly _manufacturerUrlAuditHistory: string = "/api/Manufacturer/auditHistoryById";
    private readonly _auditUrl: string = '/api/Manufacturer/audits';
    private readonly excelUpload: string ="/api/Manufacturer/uploadmanufacturercustomdata";
    private readonly getManufacturer: string = "/api/Manufacturer/pagination";
    private readonly searchUrl: string = "/api/Manufacturer/search";

    get glaccountclassUrl() { return this.configurations.baseUrl + this._manufacturerUrl; }
    get paginate() { return this.configurations.baseUrl + this.getManufacturer; }
    get search() { return this.configurations.baseUrl + this.searchUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getManufacturerEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this._manufacturerUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getManufacturerEndpoint());
            }));
    }
    getNewGatecodeEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._manufacturerUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewGatecodeEndpoint(userObject));
            }));
    }

    getEditManufacturerEndpoint<T>(ManufacturerId?: number): Observable<T> {
        let endpointUrl = ManufacturerId ? `${this._manufacturerUrlNew}/${ManufacturerId}` : this._manufacturerUrlNew;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditManufacturerEndpoint(ManufacturerId));
            }));
    }

    getUpdateManufacturerEndpoint<T>(roleObject: any, manufacturerId: number): Observable<T> {
        let endpointUrl = `${this._manufacturerUrlNew}/${manufacturerId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateManufacturerEndpoint(roleObject, manufacturerId));
            }));
    }

    getDeleteManufacturerIdEndpoint<T>(manufacturerId: number): Observable<T> {
        let endpointUrl = `${this._manufacturerUrlNew}/${manufacturerId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteManufacturerIdEndpoint(manufacturerId));
            }));
    }
    getHistoryManufacturerIdEndpoint<T>(manufacturerId: number): Observable<T> {
        let endpointUrl = `${this._manufacturerUrlAuditHistory}/${manufacturerId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistoryManufacturerIdEndpoint(manufacturerId));
            }));
    }

    getManufacturerAuditDetails<T>(Id: number): Observable<T> {
        let endPointUrl = `${this._auditUrl}/${Id}`;
        return this.http.get<any>(endPointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getManufacturerAuditDetails(Id));
            }));
    }

    getManufacturerRecords<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        //let endpointUrl = `${this.getPaginationData}/${data}`;
        return this.http.post<any>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getManufacturerRecords(paginationOption));
            }));
    }
    ManufacturerCustomUpload(file){
        return this.http.post( `${this.configurations.baseUrl}${this.excelUpload}`, file)       
        
    }

    SearchData<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.search;
        //let endpointUrl = `${this.getPaginationData}/${data}`;
        return this.http.post<any>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.SearchData(paginationOption));
            }));
    }

}