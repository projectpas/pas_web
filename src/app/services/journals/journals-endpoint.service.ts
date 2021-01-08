import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { AssetStatus } from '../../models/asset-status.model';
import { JournalBatch } from '../../models/JournalBatch';
import { JournalManual } from '../../models/journal-manual';
import {catchError} from 'rxjs/operators';
@Injectable()
export class JournelsEndpointService extends EndpointFactory {
    //Urls for Batch
    private readonly getAllBatchURL: string = "/api/Batch/getAllBatch";
    private readonly getBatchByIdURL: string = "/api/Batch/getById";
    private readonly addBatchURL: string = "/api/Batch/addBatch";
    private readonly updateBatchURL: string = "/api/Batch/updateBatch";
    private readonly removeBatchByIdURL: string = "/api/Batch/removeBatchById";
    private readonly updateBatchForActive: string = "/api/Batch/updateBatchActive";
    private readonly getBatchAuditDataById: string = "/api/Batch/auditsBatch";

    //Urls for Journel
    private readonly getAllJournelURL: string = "/api/journals/getAll";
    private readonly getJournelByIdURL: string = "/api/journals/getById";
    private readonly addJournelURL: string = "/api/journals/add";
    private readonly updateJournelURL: string = "/api/journals/update";
    private readonly removeJournelByIdURL: string = "/api/journals/removeById";
    private readonly updateJournelForActive: string = "/api/journals/updateActive";
    private readonly getJournelAuditDataById: string = "/api/journals/audits";
    private readonly allBalanceTypesURL: string = '/api/journals/AllBalanceTypes';
    private readonly allJournalCategoryURL: string = '/api/journals/AllJournalCategory';
    private readonly allJournalTypesURL: string = '/api/journals/AllJournalTypes';
    private readonly allJournalCurrencyTypesURL: string = '/api/Journals/AllJournalCurrencyTypes';


    get getBatchAll() { return this.configurations.baseUrl + this.getAllBatchURL; }
    get getByIdBatch() { return this.configurations.baseUrl + this.getBatchByIdURL; }
    get batchAdd() { return this.configurations.baseUrl + this.addBatchURL; }
    get batchUpdate() { return this.configurations.baseUrl + this.updateBatchURL; }
    get removeByIdBatch() { return this.configurations.baseUrl + this.removeBatchByIdURL; }

    get getJournelAll() { return this.configurations.baseUrl + this.getAllJournelURL; }
    get getByIdJournel() { return this.configurations.baseUrl + this.getJournelByIdURL; }
    get journelAdd() { return this.configurations.baseUrl + this.addJournelURL; }
    get journelUpdate() { return this.configurations.baseUrl + this.updateJournelURL; }
    get removeByIdjournel() { return this.configurations.baseUrl + this.removeJournelByIdURL; }
    get allBalanceTypes() { return this.configurations.baseUrl + this.allBalanceTypesURL; }
    get allJournalCategory() { return this.configurations.baseUrl + this.allJournalCategoryURL; }
    get allJournalTypes() { return this.configurations.baseUrl + this.allJournalTypesURL; }
    get allJournalCurrencyTypes() { return this.configurations.baseUrl + this.allJournalCurrencyTypesURL;  }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    //Batch Controller
    getAllBatch<T>(): Observable<T> {
        let endpointUrl = this.getBatchAll;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllBatch());
            }));
    }

    getBatchById<T>(assetId: number): Observable<T> {
        let endpointUrl = `${this.getByIdBatch}/${assetId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getBatchById(assetId));
            }));
    }

    addBatch<T>(asset: JournalBatch): Observable<T> {
        let endpointUrl = this.batchAdd;

        return this.http.post<any>(endpointUrl, JSON.stringify(asset), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addBatch(asset));
            }));
    }

    updateBatch<T>(assetStatus: JournalBatch): Observable<T> {
        let endpointUrl = this.batchUpdate;

        return this.http.post<any>(endpointUrl, JSON.stringify(assetStatus), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateBatch(assetStatus));
            }));
    }

    removeBatchById<T>(assetId: number): Observable<T> {
        let endpointUrl = `${this.removeByIdBatch}/${assetId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.removeBatchById(assetId));
            }));
    }

    getUpdateBatchForActive<T>(roleObject: any, id: number): Observable<T> {
        let endpointUrl = `${this.updateBatchForActive}/${id}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateBatchForActive(roleObject, id));
            }));
    }

    getBatchAuditById<T>(assetId: number): Observable<T> {
        let endpointUrl = `${this.getBatchAuditDataById}/${assetId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getBatchAuditById(assetId));
            }));
    }

    //Journel Controller

    getAllJournel<T>(): Observable<T> {
        let endpointUrl = this.getJournelAll;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllJournel());
            }));
    }

    getJournelById<T>(journelId: number): Observable<T> {
        let endpointUrl = `${this.getByIdJournel}/${journelId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getJournelById(journelId));
            }));
    }

    addEndpointJournel<T>(journel: JournalManual): Observable<T> {
        let endpointUrl = this.journelAdd;

        return this.http.post<any>(endpointUrl, JSON.stringify(journel), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addEndpointJournel(journel));
            }));
    }

    updateJournel<T>(journel: JournalManual): Observable<T> {
        let endpointUrl = this.journelUpdate;

        return this.http.post<any>(endpointUrl, JSON.stringify(journel), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateJournel(journel));
            }));
    }

    removeJournelById<T>(journelId: number): Observable<T> {
        let endpointUrl = `${this.removeByIdjournel}/${journelId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.removeJournelById(journelId));
            }));
    }

    getUpdateJournelForActive<T>(roleObject: any, id: number): Observable<T> {
        let endpointUrl = `${this.updateJournelForActive}/${id}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateJournelForActive(roleObject, id));
            }));
    }

    getJournelAuditById<T>(journelId: number): Observable<T> {
        let endpointUrl = `${this.getJournelAuditDataById}/${journelId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getJournelAuditById(journelId));
            }));
    }

    getAllBalanceTypes<T>(): Observable<T> {
        let endpointUrl = this.allBalanceTypes;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllBalanceTypes());
            }));
    }

    getAllJournalCategory<T>(): Observable<T> {
        let endpointUrl = this.allJournalCategory;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllJournalCategory());
            }));
    }

    getAllJournalTypes<T>(): Observable<T> {
        let endpointUrl = this.allJournalTypes;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllJournalTypes());
            }));
    }

    getJournalCurrencyTypes<T>(): Observable<T> {
        let endpointUrl = this.allJournalCurrencyTypes;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getJournalCurrencyTypes());
            }));

    }

}