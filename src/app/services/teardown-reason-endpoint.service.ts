import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class TeardownReasonEndpointService extends EndpointFactory {


	private readonly _teardownReasonUrl: string = "/api/TeardownReason/GetAll";
    private readonly _teardownReasonNewUrl: string = "/api/TeardownReason/teardownreasonpost";
    private readonly _teardownReasonEditUrl: string = "/api/TeardownReason/teardownreason";
	private readonly _deleteTeardownReason: string = "/api/TeardownReason/teardownreasondelete";
	private readonly _historyTeardownReason: string = "/api/TeardownReason/audithistory";

	get TeardownReasonUrl() { return this.configurations.baseUrl + this._teardownReasonUrl; }

	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

		super(http, configurations, injector);
	}

	getTeardownReasonEndpoint<T>(): Observable<T> {

		return this.http.get<T>(this.TeardownReasonUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getTeardownReasonEndpoint());
			});
	}

	addTeardownReasonEndpoint<T>(TeardownReason: any): Observable<T> {

        return this.http.post<T>(this._teardownReasonNewUrl, JSON.stringify(TeardownReason), this.getRequestHeaders())
			.catch(error => {
                return this.handleError(error, () => this.addTeardownReasonEndpoint(TeardownReason));
			});
	}

	updateTeardownReasonEndpoint<T>(TeardownReason: any): Observable<T> {
        let endpointUrl = `${this._teardownReasonEditUrl}/${TeardownReason.teardownReasonId}`;

        return this.http.post<T>(endpointUrl, JSON.stringify(TeardownReason), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.updateTeardownReasonEndpoint(TeardownReason));
            });
	}

	getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._teardownReasonEditUrl}/${actionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            });
    }


	removeTeardownReasonEndpoint<T>(TeardownReasonId: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this._deleteTeardownReason}/${TeardownReasonId}&updatedBy=${updatedBy}`;

		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
                return this.handleError(error, () => this.removeTeardownReasonEndpoint(TeardownReasonId,updatedBy));
			});
	}

	getDeleteActionEndpoint<T>(actionId: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this._deleteTeardownReason}/${actionId}?updatedBy=${updatedBy}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId, updatedBy));
            });
    }

	getHistoryEndpoint<T>(actionId: number): Observable<T> {
		let endpointUrl = `${this._historyTeardownReason}/${actionId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getHistoryEndpoint(actionId));
			});
    }

}