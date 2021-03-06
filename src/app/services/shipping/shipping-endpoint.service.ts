﻿import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../configuration.service';
import { Observable } from 'rxjs';
import { EndpointFactory } from '../endpoint-factory.service';
import { PurchaseOrderPart, PurchaseOrder, StockLine, ReceiveParts, StockLineDraft } from '../../components/receiving/po-ro/receivng-po/PurchaseOrder.model';

@Injectable()
export class ShippingEndpoint extends EndpointFactory {

    private readonly _shippingReferenceUrl: string = "/api/Shipping/GetShippingReference";
    private readonly _shippingViaUrl: string = "/api/Shipping/getShippingVia";
    private readonly _shippingAccountUrl: string = "/api/Shipping/getShippingAccount";
    private readonly _receivePartsUrl: string = "/api/receivingPart/receiveParts";
    private readonly _updateStockLinesUrl: string = "/api/receivingPart/updateStockLines";

    get ShippingRefenceURL() { return this.configurations.baseUrl + this._shippingReferenceUrl; }
    get ShippingViaURL() { return this.configurations.baseUrl + this._shippingViaUrl; }
    get ShippingAccountURL() { return this.configurations.baseUrl + this._shippingAccountUrl; }
    get ReceivePartsURL() { return this.configurations.baseUrl + this._receivePartsUrl; }
    get UpdateStockLinesURL() { return this.configurations.baseUrl + this._updateStockLinesUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    getAllShippingReference<T>(): Observable<T> {

        return this.http.get<T>(this.ShippingRefenceURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAllShippingReference<T>());
            });
    }

    getAllShippingVia<T>(): Observable<T> {

        return this.http.get<T>(this.ShippingViaURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAllShippingVia<T>());
            });
    }

    getAllShippingAccount<T>(): Observable<T> {

        return this.http.get<T>(this.ShippingAccountURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAllShippingAccount<T>());
            });
    }

    receiveParts<T>(receiveParts: ReceiveParts[]): Observable<T> {
        var ary = [];
        for (let part of receiveParts) {
            let receiveParts = {
                'itemMasterId': part.itemMasterId,
                'isSerialized': part.isSerialized,
                'isSameDetailsForAllParts': part.isSameDetailsForAllParts,
                'purchaseOrderPartRecordId': part.purchaseOrderPartRecordId,
                'repairOrderPartRecordId':0,
                'altEquiPartNumberId':0, 
                'mappingType':0,
                'quantityRejected': part.quantityRejected,
                'quantityActuallyReceived': part.quantityActuallyReceived,
                'stockLines': part.stockLines,
                'timeLife': part.timeLife
            };

            ary.push(receiveParts);
        }
        return this.http.post<T>(this.ReceivePartsURL, JSON.parse(JSON.stringify(ary)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.receiveParts(receiveParts));
            });

    }

    updateStockLine<T>(receiveParts: ReceiveParts[]): Observable<T> {
        var listObj = [];
        for (let part of receiveParts) {
            let stockLines: StockLineDraft[] = [];
            part.stockLines.forEach(SL => {
                var stockLine = new StockLineDraft();
                stockLine.stockLineNumber = SL.stockLineNumber;
                stockLine.owner = SL.owner;
                stockLine.ownerType = SL.ownerType;
                stockLine.ownerName = SL.ownerName;
                stockLine.obtainFromName = SL.obtainFromName;
                stockLine.traceableToName = SL.traceableToName;
                stockLine.taggedBy = SL.taggedBy;
                stockLine.certifiedById = SL.certifiedById;
                stockLine.certifiedTypeId  = SL.certifiedTypeId;
                stockLine.taggedByType = SL.taggedByType;
                stockLine.taggedByName = SL.taggedByName;                
                stockLine.tagType = SL.tagType;
                stockLine.tagTypeId = SL.tagTypeId;
                stockLine.certType = SL.certType;
                stockLine.certTypeId = SL.certTypeId;
                stockLine.unitOfMeasureId = SL.unitOfMeasureId;
                stockLine.obtainFrom = SL.obtainFrom;
                stockLine.obtainFromType = SL.obtainFromType;
                stockLine.traceableTo = SL.traceableTo;
                stockLine.traceableToType = SL.traceableToType;                
                stockLine.engineSerialNumber = SL.engineSerialNumber;
                stockLine.shippingAccount = SL.shippingAccount;
                stockLine.shippingReference = SL.shippingReference;
                stockLine.shippingViaId = SL.shippingViaId;
                stockLine.partCertificationNumber = SL.partCertificationNumber;
                stockLine.stockLineDraftId = SL.stockLineDraftId;
                stockLine.conditionId = SL.conditionId;
                stockLine.quantityRejected = SL.quantityRejected;
                stockLine.purchaseOrderUnitCost = SL.purchaseOrderUnitCost;
                stockLine.purchaseOrderExtendedCost = SL.purchaseOrderExtendedCost;
                stockLine.manufacturingTrace = SL.manufacturingTrace;
                stockLine.manufacturerLotNumber = SL.manufacturerLotNumber;
                stockLine.manufacturingDate = SL.manufacturingDate;
                stockLine.manufacturingBatchNumber = SL.manufacturingBatchNumber;
                stockLine.certifiedDate = SL.certifiedDate;
                stockLine.certifiedBy = SL.certifiedBy;
                stockLine.tagDate = SL.tagDate;
                stockLine.expirationDate = SL.expirationDate;
                stockLine.certifiedDueDate = SL.certifiedDueDate;
                stockLine.managementStructureEntityId = SL.managementStructureEntityId;
                stockLine.siteId = SL.siteId;
                stockLine.warehouseId = SL.warehouseId;
                stockLine.locationId = SL.locationId;
                stockLine.shelfId = SL.shelfId;
                stockLine.binId = SL.binId;
                stockLine.isDeleted = SL.isDeleted;
                stockLine.purchaseOrderId = SL.purchaseOrderId;
                stockLine.masterCompanyId = SL.masterCompanyId;
                stockLine.createdDate = SL.createdDate;
                stockLine.updatedDate = new Date();
                stockLine.isActive = SL.isActive;   
                stockLine.createdBy = SL.createdBy;   
                stockLine.updatedBy = SL.updatedBy; 
                if (stockLine.stockLineNumber && stockLine.stockLineNumber.length > 0 ) {
                } else {
                    stockLines.push(stockLine);
                }
            });            
            let Obj = {
                'purchaseOrderPartRecordId': part.purchaseOrderPartRecordId,
                //'managementStructureEntityId': part.managementStructureEntityId,
                'repairOrderPartRecordId' : 0,
                'quantityRejected' : 0,
                'itemMasterId':0,
                'altEquiPartNumberId':0,
                'mappingType':0,
                'isSerialized':false,
                'isSameDetailsForAllParts' : false,
                'stockLines': stockLines,
                'timeLife': part.timeLife,
            };
            listObj.push(Obj);
        }        
        return this.http.post<T>(this.UpdateStockLinesURL, JSON.parse(JSON.stringify(listObj)), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateStockLine(receiveParts));
        });

    }
}