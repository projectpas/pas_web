// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { WorkOrder } from '../../models/work-order.model';
import { WorkOrderPartNumber } from '../../models/work-order-partnumber.model';
import {catchError} from 'rxjs/operators';
@Injectable()
export class WorkOrderPartNumberEndpointService extends EndpointFactory {

    private readonly getAllURL: string = "/api/WorkOrderPartNumber/getAll";
    private readonly getByIdURL: string = "/api/WorkOrderPartNumber/get";
    private readonly addURL: string = "/api/WorkOrderPartNumber/add";
    private readonly updateURL: string = "/api/WorkOrderPartNumber/update";
    private readonly removeByIdURL: string = "/api/WorkOrderPartNumber/remove";
    private readonly getAssetAuditById: string = "/api/WorkOrderPartNumber/audits";


    get getAll() { return this.configurations.baseUrl + this.getAllURL; }
    get getById() { return this.configurations.baseUrl + this.getByIdURL; }
    get add() { return this.configurations.baseUrl + this.addURL; }
    get update() { return this.configurations.baseUrl + this.updateURL; }
    get removeById() { return this.configurations.baseUrl + this.removeByIdURL; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getAllWorkOrders<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllWorkOrders());
            }));
    }

    getWorkOrderById<T>(workOrderId: number): Observable<T> {
        let endpointUrl = `${this.getById}/${workOrderId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getWorkOrderById(workOrderId));
            }));
    }

    addWorkOrder<T>(workOrderPartNumber: WorkOrderPartNumber): Observable<T> {
        debugger;
        let endpointUrl = this.add;

        return this.http.post<any>(endpointUrl, JSON.stringify(workOrderPartNumber), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addWorkOrder(workOrderPartNumber));
            }));
    }

    updateWorkOrder<T>(workOrderPartNumber: WorkOrderPartNumber): Observable<T> {
        let endpointUrl = this.update;

        return this.http.post<any>(endpointUrl, JSON.stringify(workOrderPartNumber), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateWorkOrder(workOrderPartNumber));
            }));
    }

    removeWorkOrderById<T>(workOrderId: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${workOrderId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.removeWorkOrderById(workOrderId));
            }));
    }

    getAssetStatusAuditById<T>(workOrderId: number): Observable<T> {
        let endpointUrl = `${this.getAssetAuditById}/${workOrderId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAssetStatusAuditById(workOrderId));
            }));
    }

}