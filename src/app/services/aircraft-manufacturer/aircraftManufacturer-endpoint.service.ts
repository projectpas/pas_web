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
import { AssetStatus } from '../../models/asset-status.model';
import { AircraftType } from '../../models/AircraftType.model';

@Injectable()
export class AircraftManufacturerEndpointService extends EndpointFactory {

    private readonly getAllURL: string = "/api/aircraftmanufacturer/getAll";
    private readonly getByIdURL: string = "/api/aircraftmanufacturer/getById";
    private readonly addURL: string = "/api/aircraftmanufacturer/add";
    private readonly updateURL: string = "/api/aircraftmanufacturer/update";
    private readonly removeByIdURL: string = "/api/aircraftmanufacturer/removeById";
    private readonly updateForActive: string = "/api/aircraftmanufacturer/updateActive";
    private readonly getAuditById: string = "/api/aircraftmanufacturer/audits";
    private readonly getAircraftManufacturer: string = "/api/aircraftmanufacturer/pagination";

    get getAll() { return this.configurations.baseUrl + this.getAllURL; }
    get getById() { return this.configurations.baseUrl + this.getByIdURL; }
    get add() { return this.configurations.baseUrl + this.addURL; }
    get update() { return this.configurations.baseUrl + this.updateURL; }
    get removeById() { return this.configurations.baseUrl + this.removeByIdURL; }
    get paginate() { return this.configurations.baseUrl + this.getAircraftManufacturer; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getAllAircraftManufacturer<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllAircraftManufacturer());
            });
    }

    getAircraftManufacturerById<T>(aircraftTypeId: number): Observable<T> {
        let endpointUrl = `${this.getById}/${aircraftTypeId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAircraftManufacturerById(aircraftTypeId));
            });
    }

    addAircraftManufacturer<T>(aircraftType: AircraftType): Observable<T> {
        let endpointUrl = this.add;

        return this.http.post<T>(endpointUrl, JSON.stringify(aircraftType), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.addAircraftManufacturer(aircraftType));
            });
    }

    updateAircraftManufacturer<T>(aircraftType: AircraftType): Observable<T> {
        let endpointUrl = this.update;

        return this.http.post<T>(endpointUrl, JSON.stringify(aircraftType), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.updateAircraftManufacturer(aircraftType));
            });
    }

    removeAircraftManufacturerById<T>(aircraftTypeId: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${aircraftTypeId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.removeAircraftManufacturerById(aircraftTypeId));
            });
    }

    getUpdateForActive<T>(roleObject: any, id: number): Observable<T> {
        let endpointUrl = `${this.updateForActive}/${id}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateForActive(roleObject, id));
            });
    }

    getAudit<T>(aircraftManufacturerId: number): Observable<T> {
        let endpointUrl = `${this.getAuditById}/${aircraftManufacturerId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAudit(aircraftManufacturerId));
            });
    }
    getAircraftManufacturerRecords<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        //let endpointUrl = `${this.getPaginationData}/${data}`;
        return this.http.post<T>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAircraftManufacturerRecords(paginationOption));
            });
    }

    getAircraftManufacturerPages<T>(pageSearch: any): Observable<T> {
        let endpointUrl = this.paginate;
        //let endpointUrl = `${this.getPaginationData}/${data}`;
        return this.http.post<T>(endpointUrl, JSON.stringify(pageSearch), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAircraftManufacturerRecords(pageSearch));
            });
    }
}