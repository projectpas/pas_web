import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class GLAccountClassEndpoint extends EndpointFactory {


    private readonly _glaccountclassUrl: string = "/api/GlAccountClass/get";
	private readonly _glaccountclassUrlNew: string = "/api/GlAccountClass/glaccountclasspost";
    private readonly _glaccountclassUrlAuditHistory: string = "/api/GlAccountClass/auditHistoryById";
    private readonly getGlById: string = "/api/GlAccountClass/GLAccountClassauditdetails";
    private readonly getGlAccount: string = "/api/GlAccountClass/pagination";
	private readonly excelUpload: string = "/api/GlAccountClass/UploadGlAccountClassCustomData";
	private readonly exportData: string = "/api/GlAccount/ExportGLAccountList";

	get glaccountclassUrl() { return this.configurations.baseUrl + this._glaccountclassUrl; }
    get paginate() { return this.configurations.baseUrl + this.getGlAccount; }

	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

		super(http, configurations, injector);
	}

	getGLAccountclassEndpoint<T>(): Observable<T> {

		return this.http.get<any>(this.glaccountclassUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getGLAccountclassEndpoint());
			}));
	}
	getNewGatecodeEndpoint<T>(userObject: any): Observable<T> {

		return this.http.post<any>(this._glaccountclassUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getNewGatecodeEndpoint(userObject));
			}));
	}

	getEditGLAccountClassEndpoint<T>(GLAccountClassId?: number): Observable<T> {
		let endpointUrl = GLAccountClassId ? `${this._glaccountclassUrlNew}/${GLAccountClassId}` : this._glaccountclassUrlNew;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getEditGLAccountClassEndpoint(GLAccountClassId));
			}));
	}

	getUpdateGLAccountClassEndpoint<T>(roleObject: any, glAccountClassId: number): Observable<T> {
		let endpointUrl = `${this._glaccountclassUrlNew}/${glAccountClassId}`;

		return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getUpdateGLAccountClassEndpoint(roleObject, glAccountClassId));
			}));
	}

	getDeleteGLAccountClassIdEndpoint<T>(glAccountClassId: number): Observable<T> {
		let endpointUrl = `${this._glaccountclassUrlNew}/${glAccountClassId}`;

		return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getDeleteGLAccountClassIdEndpoint(glAccountClassId));
			}));
	}
	getHistoryGLAccountClassIdEndpoint<T>(glAccountClassId: number): Observable<T> {
		let endpointUrl = `${this._glaccountclassUrlAuditHistory}/${glAccountClassId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getHistoryGLAccountClassIdEndpoint(glAccountClassId));
			}));
    }
    getGlAccountAudit<T>(glAccountClassId: number): Observable<T> {
        let endpointUrl = `${this.getGlById}/${glAccountClassId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getGlAccountAudit(glAccountClassId));
            }));
    }
    
    getGlAccountRecords<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        return this.http.post<any>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getGlAccountRecords(paginationOption));
            }));
    }

    GLAccountClassCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)


	}
	downloadAllGlList<T>(glAccountClassId): Observable<T> {
		let url = this.exportData;
		return this.http.post<any>(url, glAccountClassId, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.downloadAllGlList(glAccountClassId));
			}));
	}
}