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
import { DisposalType } from '../../models/disposal-type.model';

@Injectable()
export class DisposalTypeEndpointService extends EndpointFactory {

    private readonly getAllURL: string = "/api/DisposalType/getAll";
    private readonly getByIdURL: string = "/api/DisposalType/getById";
    private readonly addURL: string = "/api/DisposalType/add";
    private readonly updateURL: string = "/api/DisposalType/update";
    private readonly removeByIdURL: string = "/api/DisposalType/removeById";
    private readonly getdisposalTypeHistById: string = "/api/DisposalType/disposaltypeauditdetails";
    private readonly excelUpload: string = "/api/DisposalType/UploadDispTypeCustomData";



    get getAll() { return this.configurations.baseUrl + this.getAllURL; }
    get getById() { return this.configurations.baseUrl + this.getByIdURL; }
    get add() { return this.configurations.baseUrl + this.addURL; }
    get update() { return this.configurations.baseUrl + this.updateURL; }
    get removeById() { return this.configurations.baseUrl + this.removeByIdURL; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getAllDisposalType<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllDisposalType());
            });
    }

    getdisposalTypeById<T>(assetDisposalTypeId: number): Observable<T> {
        let endpointUrl = `${this.getById}/${assetDisposalTypeId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getdisposalTypeById(assetDisposalTypeId));
            });
    }

    addDisposalType<T>(disposalType: DisposalType): Observable<T> {
        let endpointUrl = this.add;

        return this.http.post<T>(endpointUrl, JSON.stringify(disposalType), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.addDisposalType(disposalType));
            });
    }

    updateDisposalType<T>(assetDisposalType: DisposalType): Observable<T> {
        let endpointUrl = this.update;

        return this.http.post<T>(endpointUrl, JSON.stringify(assetDisposalType), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.updateDisposalType(assetDisposalType));
            });
    }

    removeDisposalTypeById<T>(assetDisposalTypeId: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${assetDisposalTypeId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.removeDisposalTypeById(assetDisposalTypeId));
            });
    }

    getDisposalAudit<T>(assetDisposalTypeId: number): Observable<T> {
        let endpointUrl = `${this.getdisposalTypeHistById}/${assetDisposalTypeId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDisposalAudit(assetDisposalTypeId));
            });
    }

    DispTypeCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)


    }

}