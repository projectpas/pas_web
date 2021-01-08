
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class ChargeEndpoint extends EndpointFactory {




	private readonly _actionsUrl: string = "/api/Charge/Get";
	private readonly _actionsCurrency: string = "/api/Charge/GetCurrency";
	private readonly _actionsPO: string = "/api/Charge/GetPurchaseOrder";
	private readonly _actionsVendor: string = "/api/Charge/GetVendorNames";
	private readonly _actionsIntegrationPortal: string = "/api/Charge/GetIntegrationPortalNames";
    private readonly _workflowActionsNewUrl: string = "/api/Charge/ChargePost";
    private readonly _actionsUrlAuditHistory: string = "/api/Charge/auditHistoryById";
    private readonly getChargeAuditDataById: string = "/api/Charge/audits";
    private readonly getCharge: string = "/api/Charge/pagination";

	get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }
	get actionsCurrency() { return this.configurations.baseUrl + this._actionsCurrency; }
	get actionPO() { return this.configurations.baseUrl + this._actionsPO; }
	get actionVendor() { return this.configurations.baseUrl + this._actionsVendor; }
	get actionIntegrationPortal() { return this.configurations.baseUrl + this._actionsIntegrationPortal; }
    get paginate() { return this.configurations.baseUrl + this.getCharge; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getChargeEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.actionsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getChargeEndpoint());
            }));
	}

	getCurrencyEndpoint<T>(): Observable<T> {

		return this.http.get<any>(this.actionsCurrency, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getCurrencyEndpoint());
			}));
	}
	getPOEndpoint<T>(): Observable<T> {

		return this.http.get<any>(this.actionPO, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getPOEndpoint());
			}));
	}
	getVendorEndpoint<T>(): Observable<T> {

		return this.http.get<any>(this.actionVendor, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getVendorEndpoint());
			}));
	}
	getIntegrationPortalEndpoint<T>(): Observable<T> {

		return this.http.get<any>(this.actionIntegrationPortal, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getIntegrationPortalEndpoint());
			}));
	}
	

    getNewGatecodeEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._workflowActionsNewUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewGatecodeEndpoint(userObject));
            }));
    }

    getEditChargeEndpoint<T>(chargeId?: number): Observable<T> {
        let endpointUrl = chargeId ? `${this._workflowActionsNewUrl}/${chargeId}` : this._workflowActionsNewUrl;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditChargeEndpoint(chargeId));
            }));
    }

    getUpdateChargeEndpoint<T>(roleObject: any, chargeId: number): Observable<T> {
        let endpointUrl = `${this._workflowActionsNewUrl}/${chargeId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateChargeEndpoint(roleObject, chargeId));
            }));
    }

    getDeleteChargeEndpoint<T>(chargeId: number,updatedBy: string): Observable<T> {
        let endpointUrl = `${this._workflowActionsNewUrl}/${chargeId}?updatedBy=${updatedBy}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () =>
                 this.getDeleteChargeEndpoint(chargeId,updatedBy));
            }));
    }
    getHistoryChargeEndpoint<T>(chargeId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${chargeId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistoryChargeEndpoint(chargeId));
            }));
    }

    getChargeAuditById<T>(chargeId: number): Observable<T> {
        let endpointUrl = `${this.getChargeAuditDataById}/${chargeId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getChargeAuditById(chargeId));
            }));
    }

    getChargeRecords<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        //let endpointUrl = `${this.getPaginationData}/${data}`;
        return this.http.post<any>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getChargeRecords(paginationOption));
            }));
    }


}