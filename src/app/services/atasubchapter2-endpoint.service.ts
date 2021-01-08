
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ATASubChapter2Endpoint extends EndpointFactory {


	private readonly _actionsUrl: string = "/api/ATASubChapter2/Get";
	private readonly _actionsUrlNew: string = "/api/ATASubChapter2/actions";
	private readonly _actionsUrlAuditHistory: string = "/api/ATASubChapter2/ataauditHistoryById";



	get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

		super(http, configurations, injector);
	}

	getATASubChapter2Endpoint<T>(): Observable<T> {

		return this.http.get<any>(this.actionsUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getATASubChapter2Endpoint());
			}));
	}
	getNewATASubChapter2Endpoint<T>(userObject: any): Observable<T> {

		return this.http.post<T>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getNewATASubChapter2Endpoint(userObject));
			}));
	}

	getHistoryATASubChapter2Endpoint<T>(ataSubChapter2Id: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlAuditHistory}/${ataSubChapter2Id}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getHistoryATASubChapter2Endpoint(ataSubChapter2Id));
			}));
	}

	getEditATASubChapter2Endpoint<T>(ataSubChapter2Id?: number): Observable<T> {
		let endpointUrl = ataSubChapter2Id ? `${this._actionsUrlNew}/${ataSubChapter2Id}` : this._actionsUrlNew;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
		catchError(error => {
				return this.handleError(error, () => this.getEditATASubChapter2Endpoint(ataSubChapter2Id));
			}));
	}

	getUpdateATASubChapter2Endpoint<T>(roleObject: any, ataSubChapter2Id: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlNew}/${ataSubChapter2Id}`;

		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getUpdateATASubChapter2Endpoint(roleObject, ataSubChapter2Id));
			}));
	}

	getDeleteATASubChapter2Endpoint<T>(ataSubChapter2Id: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlNew}/${ataSubChapter2Id}`;

		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getDeleteATASubChapter2Endpoint(ataSubChapter2Id));
			}));
	}

}