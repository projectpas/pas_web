import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class StocklineAdjustmentReasonEndpoint extends EndpointFactory {
    private readonly _actionsUrl: string = "/api/StockLineAdjustmentReason/GetAll";

    private readonly _stockLineAdjustmentReasonDelete: string = "/api/StockLineAdjustmentReason/stockLineAdjustmentReasonDelete";
    private readonly _stockLineAdjustmentReasonNew: string = "/api/StockLineAdjustmentReason/stockLineAdjustmentReasonpost";
    private readonly getstockAdjReasonById: string = "/api/StockLineAdjustmentReason/stockAdjReasonauditdetails";
    private readonly excelUpload: string = "/api/StockLineAdjustmentReason/stockLineAdjustmentCustomUpload";
    //private readonly _stockLineAdjustmentReasonSave: string = "/api/StockLineAdjustmentReason/stockLineAdjustmentReasonpost"; // Which will be specified in the Controller

    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }
    getStockLineAdjustmentReasonEndpoint<T>(): Observable<T> {
        return this.http.get<any>(this.actionsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getStockLineAdjustmentReasonEndpoint());
            }));
    }
    getNewStocklineAdjReasonEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._stockLineAdjustmentReasonNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewStocklineAdjReasonEndpoint(userObject));
            }));
    }
    getUpdateStocklineAdjReasonEndpoint<T>(roleObject: any, adjustmentReasonId: number): Observable<T> {
        let endpointUrl = `${this._stockLineAdjustmentReasonNew}/${adjustmentReasonId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateStocklineAdjReasonEndpoint(roleObject, adjustmentReasonId));
            }));
    }
    getDeleteStocklineAdjustmentReasonEndpoint<T>(iD: number): Observable<T> {
         let endpointUrl = `${this._stockLineAdjustmentReasonDelete}/${iD}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteStocklineAdjustmentReasonEndpoint(iD));
            }));
    }
    getStockAdjReasonAudit<T>(iD: number): Observable<T> {
        let endpointUrl = `${this.getstockAdjReasonById}/${iD}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getStockAdjReasonAudit(iD));
            }));
    }

    stockLineAdjustmentCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file);
    }
    //saveStocklineAdjustmentReasonEndpoint<T>(userObject: any): Observable<T> {

    //    return this.http.post<T>(this._stockLineAdjustmentReasonSave, JSON.stringify(userObject), this.getRequestHeaders())
    //        .catch(error => {
    //            return this.handleError(error, () => this.saveStocklineAdjustmentReasonEndpoint(userObject));
    //        });
    //}

}