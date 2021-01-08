// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { InterCompanySetup } from '../models/intercompany-setup.model';

@Injectable()
export class InterCompanySetupEndPointService extends EndpointFactory {

    private readonly _getAllUrl: string = "/api/InterCompanySetup/getAll";
    private readonly _getByIdUrl: string = "/api/InterCompanySetup/getById";
    private readonly _addUrl: string = "/api/InterCompanySetup/add";
    private readonly _updateUrl: string = "/api/InterCompanySetup/update";
    private readonly _removeByIdUrl: string = "/api/InterCompanySetup/removeById";
    private readonly _getAuditById: string = "/api/InterCompanySetup/audits";

    get getAllUrl() { return this.configurations.baseUrl + this._getAllUrl; }
    get getAddUrl() { return this.configurations.baseUrl + this._addUrl; }
    get getUpdateUrl() { return this.configurations.baseUrl + this._updateUrl; }
    get getRemoveUrl() { return this.configurations.baseUrl + this._removeByIdUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getInterCompanySetupList<T>(): Observable<T> {
        let endPointUrl = this.getAllUrl;
        return this.http.get<T>(endPointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getInterCompanySetupList());
            });
    }

    addInterCompanySetup<T>(interCompanySetupDetails: InterCompanySetup): Observable<T> {
        let endPointUrl = this.getAddUrl;
        return this.http.post<T>(endPointUrl, JSON.stringify(interCompanySetupDetails), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.addInterCompanySetup(interCompanySetupDetails));
            });
    }

    updateInterCompanySetup<T>(interCompanySetupDetails: InterCompanySetup): Observable<T> {
        let endPointUrl = this.getUpdateUrl;
        return this.http.post<T>(endPointUrl, JSON.stringify(interCompanySetupDetails), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.updateInterCompanySetup(interCompanySetupDetails));
            });
    }

    removeInterCompanySetup<T>(Id: number): Observable<T> {
        let endPointUrl = `${this.getRemoveUrl}/${Id}`;
        return this.http.get<T>(endPointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.removeInterCompanySetup(Id));
            });
    }
}