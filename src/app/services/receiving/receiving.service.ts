﻿
import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Role } from '../../models/role.model';
import { AuthService } from '../auth.service';
import { ReceivingEndpointService } from './receiving-endpoint.service';
import { PurchaseOrder } from '../../components/receiving/po-ro/receivng-po/PurchaseOrder.model';
import { ReceiveParts } from '../../components/receiving/repair-order/receiving-ro/RepairOrder.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class ReceivingService {
    selectedPurchaseorderCollection: PurchaseOrder;
    purchaseOrder: PurchaseOrder;
    purchaseOrderId: number;
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();
    public assetrowSelection: any;
    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService, private receivingEndpoing: ReceivingEndpointService
    ) { }

    getAll() {
        return Observable.forkJoin(
            this.receivingEndpoing.getAllReceivingData<any[]>());
    }

    addReceivingData(receivingData: any) {
        return this.receivingEndpoing.addReceivingData<any>(receivingData);
    }

    getReceivingData(receivingData?: number) {
        return this.receivingEndpoing.editReceivingData<any>(receivingData);
    }


    updateReceivingData(receivingData: any) {
        return this.receivingEndpoing.updateReceivingData<any>(receivingData);
    }


    deleteReceivingData(receivingDataId: number) {

        return this.receivingEndpoing.deleteReceivingData(receivingDataId);
    }

    getItemMasterDataById(itemid: any) {
        return Observable.forkJoin(
            this.receivingEndpoing.getItemMasterDataById<any[]>(itemid));
    }

    getPurchaseOrderDataById(receivingId: any,employeeId = 0) {
        return Observable.forkJoin(
            this.receivingEndpoing.getReceivingPODataById<PurchaseOrder>(receivingId,employeeId));
    }

    getPurchaseOrderDataForEditById(receivingId: any,employeeId = 0) {
        return Observable.forkJoin(
            this.receivingEndpoing.getReceivingPODataForEditById<any>(receivingId,employeeId));
    }

    getAllRecevingEditID(purchaseOrderId){   
        return this.receivingEndpoing.getAllRecevingEditID(purchaseOrderId);            
    }

    getPurchaseOrderDataForViewById(receivingId: any) {

        return Observable.forkJoin(
            this.receivingEndpoing.getReceivingPurchaseForView<any>(receivingId));
    }

    addPartStocklineMapper(mapperData: any) {
        return this.receivingEndpoing.addPartStocklineMapper<any>(mapperData);
    }

    getReceivingRODataById(repairOrderId){
        return this.receivingEndpoing.getReceivingRODataById(repairOrderId);
    }

    getReceivingPOHeaderById(repairOrderId){
        return this.receivingEndpoing.getReceivingPOHeaderById(repairOrderId);
    }
    

    getReceivingPOPartsForViewById(repairOrderId){
        return this.receivingEndpoing.getReceivingPOPartsForViewById(repairOrderId);
    }

    getReceivingROHeaderById(repairOrderId){
        return this.receivingEndpoing.getReceivingROHeaderById(repairOrderId);
    }

    getReceivingROPartById(repairOrderId ,employeeId = 0){
        return this.receivingEndpoing.getReceivingROPartById(repairOrderId,employeeId);
    }

    receiveParts(receiveParts: ReceiveParts[]) {
        return this.receivingEndpoing.receiveParts<any>(receiveParts);
    }

    getReceivingROPartsForViewById(repairOrderId){
        return this.receivingEndpoing.getReceivingROPartsForViewById(repairOrderId);
    }

    getReceivingROPartsForEditById(repairOrderId,employeeId = 0){
        return this.receivingEndpoing.getReceivingROPartsForEditById(repairOrderId,employeeId);
    }

    updateStockLine(receiveParts: ReceiveParts[]) {
        return this.receivingEndpoing.updateStockLine<any>(receiveParts);
    }

    createStockLine(purchaseOrderId: number) {
        return this.receivingEndpoing.CreateStockLine(purchaseOrderId);
    }

    deleteStockLineDraft(stockLineDraftId, quantity) {
        return this.receivingEndpoing.deleteStockLineDraft(stockLineDraftId, quantity);
    }

    CreateStockLineForRepairOrder(repairOrderId: number) {
        return this.receivingEndpoing.CreateStockLineForRepairOrder(repairOrderId);
    }

    getAllRecevingROEditID(repairOrderId){   
        return this.receivingEndpoing.getAllRecevingROEditID(repairOrderId);            
    }

    getReceivedPOPartsForView(purchaseOrderId){
        return this.receivingEndpoing.getReceivedPOPartsForView(purchaseOrderId);
    }

    getReceivedROPartsForView(repairOrderId){
        return this.receivingEndpoing.getReceivedROPartsForView(repairOrderId);
    }

}