
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators'
@Injectable()
export class ShipViaEndpoint extends EndpointFactory {
    private readonly _shipViaAddurl: string = "/api/ShipVia/add";
    private readonly _shipViaUpdateurl: string = "/api/ShipVia/update";
    private readonly _shipViaDeleteurl: string = "/api/ShipVia/delete";
    private readonly _shipViaStatusurl: string = "/api/ShipVia/statusupdate";
    private readonly _shipViaAuditurl: string = "/api/ShipVia/auditHistoryById";
    private readonly _actionUrlAll: string = "/api/ShipVia/Get";
    private readonly excelUpload: string = "/api/fileupload/uploadcustomfile";
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    
    getAllShipViaListEndpoint<T>(): Observable<T> {
        return this.http.get<any>(this._actionUrlAll, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllShipViaListEndpoint());
            }));
    }
    getNewShipviaEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<any>(this._shipViaAddurl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewShipviaEndpoint(userObject));
            }));
    }

    getUpdateShipviaEndpoint<T>(roleObject: any, shippingViaId: number): Observable<T> {
        let endpointUrl = `${this._shipViaUpdateurl}/${shippingViaId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateShipviaEndpoint(roleObject, shippingViaId));
            }));
    }
    getShipviaStatusEndpoint<T>(actionId: number, status, updatedBy: string): Observable<T> {
        let endpointUrl = `${this._shipViaStatusurl}/?id=${actionId}&status=${status}&updatedBy=${updatedBy}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getShipviaStatusEndpoint(actionId, status, updatedBy));
            }));
    }
    getDeleteShipviaEndpoint<T>(actionId: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this._shipViaDeleteurl}/${actionId}?updatedBy=${updatedBy}`;
        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteShipviaEndpoint(actionId, updatedBy));
            }));
    }
    
    getShipViaAuditEndpoint<T>(id: number): Observable<T> {
        let endpointUrl = `${this._shipViaAuditurl}/${id}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getShipViaAuditEndpoint(id));
            }));
    }

    shipviaCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)
    }
}