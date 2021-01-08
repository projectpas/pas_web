// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { POROCategory } from '../../models/po-ro-category.model';

@Injectable()
export class POROCategoryEndpoint extends EndpointFactory {

    private readonly getAllURL: string = "/api/poroCategory/getAll";
    private readonly getByIdURL: string = "/api/poroCategory/getById";
    private readonly addURL: string = "/api/poroCategory/add";
    private readonly updateURL: string = "/api/poroCategory/update";
    private readonly removeByIdURL: string = "/api/poroCategory/removeById";
    private readonly updatePOROforActive: string = "/api/poroCategory/UpdatePOROforActive";
    private readonly getAuditById: string = "/api/poroCategory/audits";
    private readonly excelUpload: string = "/api/poroCategory/uploadNodeTypecustomdata";
    private readonly porosearch: string = "/api/poroCategory/search";


    get getAll() { return this.configurations.baseUrl + this.getAllURL; }
    get getById() { return this.configurations.baseUrl + this.getByIdURL; }
    get add() { return this.configurations.baseUrl + this.addURL; }
    get update() { return this.configurations.baseUrl + this.updateURL; }
    get removeById() { return this.configurations.baseUrl + this.removeByIdURL; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getAllPOROCategory<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllPOROCategory());
            });
    }

    getPOROCategoryById<T>(poroCategoryId: number): Observable<T> {
        let endpointUrl = `${this.getById}/${poroCategoryId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getPOROCategoryById(poroCategoryId));
            });
    }

    addPOROCategory<T>(POROCategory: POROCategory): Observable<T> {
        let endpointUrl = this.add;

        return this.http.post<T>(endpointUrl, JSON.stringify(POROCategory), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.addPOROCategory(POROCategory));
            });
    }

    updatePOROCategory<T>(poroCategory: POROCategory): Observable<T> {
        let endpointUrl = this.update;

        return this.http.post<T>(endpointUrl, JSON.stringify(poroCategory), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.updatePOROCategory(poroCategory));
            });
    }

    removePOROCategoryById<T>(poroCategoryId: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${poroCategoryId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.removePOROCategoryById(poroCategoryId));
            });
    }

    getUpdatePORPEndpointforActive<T>(poroCategory: POROCategory): Observable<T> {
        let endpointUrl = `${this.updatePOROforActive}/${poroCategory.poroCategoryId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(poroCategory), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdatePORPEndpointforActive(poroCategory));
            });
    }

    getAudit<T>(poroCategoryId: number): Observable<T> {
        let endpointUrl = `${this.getAuditById}/${poroCategoryId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAudit(poroCategoryId));
            });
    }

    getGLCashFlowClassificationFileUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

    }

    getMaster1099searchEndpoint<T>(paginationOption: any): Observable<T> {
        // let endpointUrl = this.searchUrl;
        return this.http.post<T>(this.porosearch, JSON.stringify(paginationOption), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getMaster1099searchEndpoint(paginationOption));
            });
    }
}