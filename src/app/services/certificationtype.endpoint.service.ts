﻿import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class CertificationTypeEndpoint extends EndpointFactory {


	private readonly _certoificationtypeUrl: string = "/api/CertificationType/Get";
	private readonly _certoificationtypeUrlNew: string = "/api/CertificationType/certificationtypepost";
    private readonly _certoificationtypeUrlAuditHistory: string = "/api/CertificationType/auditHistoryById";

    private readonly getCertificationAuditById: string = "/api/CertificationType/audits";

	get certificationtypeUrl() { return this.configurations.baseUrl + this._certoificationtypeUrl; }

	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

		super(http, configurations, injector);
	}

	getcertificationTypeEndpoint<T>(): Observable<T> {

		return this.http.get<T>(this.certificationtypeUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getcertificationTypeEndpoint());
			});
	}
	getNewCertificationTypeEndpoint<T>(userObject: any): Observable<T> {

		return this.http.post<T>(this._certoificationtypeUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getNewCertificationTypeEndpoint(userObject));
			});
	}

	getEditCertificationTypeEndpoint<T>(EmployeeLicenseTypeId?: number): Observable<T> {
		let endpointUrl = EmployeeLicenseTypeId ? `${this._certoificationtypeUrlNew}/${EmployeeLicenseTypeId}` : this._certoificationtypeUrlNew;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getEditCertificationTypeEndpoint(EmployeeLicenseTypeId));
			});
	}

	getUpdateCertificationTypeEndpoint<T>(roleObject: any, EmployeeLicenseTypeId: number): Observable<T> {
		let endpointUrl = `${this._certoificationtypeUrlNew}/${EmployeeLicenseTypeId}`;

		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdateCertificationTypeEndpoint(roleObject, EmployeeLicenseTypeId));
			});
	}

	getDeleteCertificationTypeEndpoint<T>(EmployeeLicenseTypeId: number): Observable<T> {
		let endpointUrl = `${this._certoificationtypeUrlNew}/${EmployeeLicenseTypeId}`;

		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getDeleteCertificationTypeEndpoint(EmployeeLicenseTypeId));
			});
	}
	getHistoryCertificationTypeEndpoint<T>(EmployeeLicenseTypeId: number): Observable<T> {
		let endpointUrl = `${this._certoificationtypeUrlAuditHistory}/${EmployeeLicenseTypeId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getHistoryCertificationTypeEndpoint(EmployeeLicenseTypeId));
			});
    }
    
    getEmployeeLiceneceAuditById<T>(EmployeeLicenseTypeId: number): Observable<T> {
        let endpointUrl = `${this.getCertificationAuditById}/${EmployeeLicenseTypeId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEmployeeLiceneceAuditById(EmployeeLicenseTypeId));
            });
    }

}