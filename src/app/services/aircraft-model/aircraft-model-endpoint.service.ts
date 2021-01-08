// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { AircraftModel } from '../../models/aircraft-model.model';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AircraftModelEndpointService extends EndpointFactory {

    private readonly getAllURL: string = "/api/aircraftmodel/getAll";
    private readonly getByIdURL: string = "/api/aircraftmodel/getById";
    private readonly addURL: string = "/api/aircraftmodel/add";
    private readonly updateURL: string = "/api/aircraftmodel/update";
    private readonly removeByIdURL: string = "/api/aircraftmodel/removeById";
    private readonly updateForActive: string = "/api/aircraftmodel/updateActive";
    private readonly getAuditById: string = "/api/aircraftmodel/audits";
    private readonly getAircraftModel: string = "/api/aircraftmodel/pagination";
    private readonly getModelsListById: string = "/api/aircraftmodel/getModelsByManufacturerId";
    private readonly getLandingPageURL: string = "/api/aircraftmodel/getLandingPage";

    get getAll() { return this.configurations.baseUrl + this.getAllURL; }
    get getById() { return this.configurations.baseUrl + this.getByIdURL; }
    get add() { return this.configurations.baseUrl + this.addURL; }
    get update() { return this.configurations.baseUrl + this.updateURL; }
    get removeById() { return this.configurations.baseUrl + this.removeByIdURL; }
    get paginate() { return this.configurations.baseUrl + this.getAircraftModel; }
    get getLandingPage() { return this.configurations.baseUrl + this.getLandingPageURL; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getAllAircraftModel<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllAircraftModel());
            }));
    }

    getAircraftModelById<T>(aircraftModelId: number): Observable<T> {
        let endpointUrl = `${this.getById}/${aircraftModelId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAircraftModelById(aircraftModelId));
            }));
    }

    addAircraftModel<T>(aircraftModel: AircraftModel): Observable<T> {
        let endpointUrl = this.add;

        return this.http.post<any>(endpointUrl, JSON.stringify(aircraftModel), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addAircraftModel(aircraftModel));
            }));
    }

    updateAircraftModel<T>(aircraftModel: AircraftModel): Observable<T> {
        let endpointUrl = this.update;

        return this.http.post<any>(endpointUrl, JSON.stringify(aircraftModel), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateAircraftModel(aircraftModel));
            }));
    }

    removeAircraftModelById<T>(aircraftModelId: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${aircraftModelId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.removeAircraftModelById(aircraftModelId));
            }));
    }

    getUpdateForActive<T>(roleObject: any, id: number): Observable<T> {
        let endpointUrl = `${this.updateForActive}/${id}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateForActive(roleObject, id));
            }));
    }

    getAudit<T>(aircraftModelId: number): Observable<T> {
        let endpointUrl = `${this.getAuditById}/${aircraftModelId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAudit(aircraftModelId));
            }));
    }


    getAircraftModelListByAircraftManufacturerId<T>(aircraftManufacturerId: string): Observable<T> {
        let endpointUrl = `${this.getModelsListById}/${aircraftManufacturerId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAircraftModelListByAircraftManufacturerId(aircraftManufacturerId));
            }));
    }

    //getAircraftModelsRecords<T>(data: any) Observable<T>{
    //}
    getAircraftModelsRecords<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        //let endpointUrl = `${this.getPaginationData}/${data}`;
        return this.http.post<any>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAircraftModelsRecords(paginationOption));
            }));
    }
    getLandingPageList<T>(): Observable<T> {
        let endpointUrl = this.getLandingPage;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getLandingPageList());
            }));
    }

}