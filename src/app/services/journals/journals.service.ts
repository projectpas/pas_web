import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { JournelsEndpointService } from './journals-endpoint.service';
import { JournalBatch } from '../../models/JournalBatch';
import { AssetStatus } from '../../models/asset-status.model';
import { Subject } from 'rxjs';
import { JournalManual } from '../../models/journal-manual';

@Injectable()
export class JournelService {

    
    manulaBatchCollection: any;
    manulaJournelCollection: any;
    ShowPtab: boolean = true;
    //for steps start
    public alertObj = new Subject<any>();
    public alertChangeObject$ = this.alertObj.asObservable();
    public indexObj = new Subject<any>();
    public indexObjChangeObject$ = this.indexObj.asObservable();
      //for steps End

    constructor(private journelsEndpoint: JournelsEndpointService) {
    }

    getAllBatch() {
        return Observable.forkJoin(
            this.journelsEndpoint.getAllBatch<JournalBatch[]>());
    }

    getBatchById(batchId: number) {
        return Observable.forkJoin(
            this.journelsEndpoint.getBatchById<JournalBatch>(batchId)
        );
    }

    addBatch(batch: JournalBatch) {
        return this.journelsEndpoint.addBatch<JournalBatch>(batch);
    }

    updateBatch(batch: JournalBatch) {
        return this.journelsEndpoint.updateBatch<JournalBatch>(batch);
    }

    removeBatch(batchId: number) {
        return this.journelsEndpoint.removeBatchById(batchId);
    }
    updateActiveBatch(batch: any) {
        return this.journelsEndpoint.getUpdateBatchForActive(batch, batch.id);
    }
    getBatchAudit(batchId: number) {
        return this.journelsEndpoint.getBatchAuditById<any>(batchId);
    }

    //Journel manual Service methods Start

    getAllJournel() {
        return Observable.forkJoin(
            this.journelsEndpoint.getAllJournel<JournalManual[]>());
    }

    getJournelById(journelId: number) {
        return Observable.forkJoin(
            this.journelsEndpoint.getJournelById<JournalManual>(journelId)
        );
    }

    addJournel(journel: JournalManual) {
        return this.journelsEndpoint.addEndpointJournel<JournalManual>(journel);
    }

    updateJournel(journel: JournalManual) {
        return this.journelsEndpoint.updateJournel<JournalManual>(journel);
    }

    removeJournel(journelId: number) {
        return this.journelsEndpoint.removeJournelById(journelId);
    }
    updateActiveJournel(journel: any) {
        return this.journelsEndpoint.getUpdateJournelForActive(journel, journel.id);
    }
    getJournelAudit(journelId: number) {
        return this.journelsEndpoint.getJournelAuditById<any>(journelId);
    }

    getAllBalanceTypes(): any {
        return this.journelsEndpoint.getAllBalanceTypes();
    }

    getAllJournalCategory(): any {
        return this.journelsEndpoint.getAllJournalCategory();
    }

    getAllJournalTypes(): any {
        return this.journelsEndpoint.getAllJournalTypes();
    }

    getJournalCurrencyTypes(): any {
        return this.journelsEndpoint.getJournalCurrencyTypes();
    }
}