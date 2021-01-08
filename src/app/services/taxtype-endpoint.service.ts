
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class TaxTypeEndpointService extends EndpointFactory {


	private readonly _taxTypeUrl: string = "/api/TaxType/Get";
	private readonly _taxTypeUrlNew: string = "/api/TaxType/taxType";
	private readonly _taxTypeUrlAuditHistory: string = "/api/TaxType/auditHistoryById";
    private readonly getTaxTypeDataAuditById: string = "/api/TaxType/audits";
    private readonly _auditUrl: string = "/api/TaxType/audits";
    private readonly getTaxType: string = "/api/TaxType/pagination";
	private readonly deleteTaxType: string = "/api/TaxType/actions";

	private readonly excelUpload: string = "/api/TaxType/UploadtaxtypeCustomData";

    get paginate() { return this.configurations.baseUrl + this.getTaxType; }
	get taxTypeUrl() { return this.configurations.baseUrl + this._taxTypeUrl; }

	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

		super(http, configurations, injector);
	}

	getTaxTypeEndpoint<T>(): Observable<T> {

		return this.http.get<any>(this.taxTypeUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getTaxTypeEndpoint());
			}));
	}

	getHistoryTaxTypeEndpoint<T>(taxTypeId: number): Observable<T> {
		let endpointUrl = `${this._taxTypeUrlAuditHistory}/${taxTypeId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getHistoryTaxTypeEndpoint(taxTypeId));
			}));
	}


	getNewTaxTypeEndpoint<T>(userObject: any): Observable<T> {

		return this.http.post<any>(this._taxTypeUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getNewTaxTypeEndpoint(userObject));
			}));
	}

	getEditTaxTypeEndpoint<T>(taxTypeId?: number): Observable<T> {
		let endpointUrl = taxTypeId ? `${this._taxTypeUrlNew}/${taxTypeId}` : this._taxTypeUrlNew;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getEditTaxTypeEndpoint(taxTypeId));
			}));
	}

	getUpdateTaxTypeEndpoint<T>(roleObject: any, taxTypeId: number): Observable<T> {
		let endpointUrl = `${this._taxTypeUrlNew}/${taxTypeId}`;

		return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getUpdateTaxTypeEndpoint(roleObject, taxTypeId));
			}));
	}

	getDeleteTaxTypeEndpoint<T>(taxTypeId: number): Observable<T> {
        let endpointUrl = `${this.deleteTaxType}/${taxTypeId}`;

		return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getDeleteTaxTypeEndpoint(taxTypeId));
			}));
	}

    getTaxTypeAuditById<T>(taxTypeId: number): Observable<T> {
        let endpointUrl = `${this.getTaxTypeDataAuditById}/${taxTypeId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getTaxTypeAuditById(taxTypeId));
            }));
    }

    getTaxTypeAuditDetails<T>(Id: number): Observable<T> {
        let endpointUrl = `${this._auditUrl}/${Id}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getTaxTypeAuditDetails(Id));
            }));
    }
    
    getTaxTypeRecords<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        return this.http.post<any>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getTaxTypeRecords(paginationOption));
            }));
	}


	taxtypeCustomUpload(file) {
		return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

	}
}