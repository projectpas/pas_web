import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { PurchaseOrderEndpoint } from './purchase-order-endpoint.service';



@Injectable()
export class PurchaseOrderService {
    constructor(
        private router: Router,
        private http: HttpClient,
        private purchaseOrderEndpoint: PurchaseOrderEndpoint) { let currentUrl = this.router.url; }
    getPurchaseOrdersBasic() {
        return Observable.forkJoin(
            this.purchaseOrderEndpoint.getPurchaseOrderBasicList<any[]>());
    }

    getVendorPOHeaderById(purchaseOrderId) {
        return this.purchaseOrderEndpoint.getVendorPOHeaderById(purchaseOrderId);
    }

    getPurchaseOrderPartsById(purchaseOrderId, workOrderPartNumberId: any) {
        return this.purchaseOrderEndpoint.getPurchaseOrderPartsById(purchaseOrderId, workOrderPartNumberId);
    }

    getPOTotalCostById(purchaseOrderId) {
        return this.purchaseOrderEndpoint.getPOTotalCostById(purchaseOrderId);
    }

    getAllEditID(purchaseOrderId) {
        return this.purchaseOrderEndpoint.getAllEditID(purchaseOrderId);
    }

    getApproversListByTaskIdModuleAmt(taskId, moduleAmount) {
        return this.purchaseOrderEndpoint.getApproversListByTaskIdModuleAmt(taskId, moduleAmount);
    }

    approverslistbyTaskId(taskId, id) {
        return this.purchaseOrderEndpoint.approverslistbyTaskId(taskId, id);
    }


    getPOApprovalListById(purchaseOrderId) {
        return this.purchaseOrderEndpoint.getPOApprovalListById(purchaseOrderId);
    }

    getPartDetailsWithidForSinglePart(partId) {
        return this.purchaseOrderEndpoint.getPartDetailsWithidForSinglePart<any>(partId);
    }


    getPurchaseOrderAllPartsById(purchaseOrderId, employeeID, workOrderPartNumberId) {
        return this.purchaseOrderEndpoint.getPurchaseOrderAllPartsById(purchaseOrderId, employeeID, workOrderPartNumberId);
    }

    getVendorPOAddressById(purchaseOrderId) {
        return this.purchaseOrderEndpoint.getVendorPOAddressById(purchaseOrderId);
    }

    savePurchaseOrderHeader(data) {
        return this.purchaseOrderEndpoint.savePurchaseOrderHeader(data);
    }

    savePurchaseOrderParts(data) {
        return this.purchaseOrderEndpoint.savePurchaseOrderParts(data);
    }

    savePurchaseOrderAddress(data) {
        return this.purchaseOrderEndpoint.savePurchaseOrderAddress(data);
    }

    savePurchaseOrderApproval(data) {
        return this.purchaseOrderEndpoint.savePurchaseOrderApproval(data);
    }

    getPOList(data) {
        return this.purchaseOrderEndpoint.getPOList(data);
    }


    getPOStatus(purchaseOrderId, status, updatedBy) {
        return this.purchaseOrderEndpoint.getPOStatus(purchaseOrderId, status, updatedBy);
    }

    deletePO(purchaseOrderId, updatedBy) {
        return this.purchaseOrderEndpoint.deletePO(purchaseOrderId, updatedBy);
    }

    getPOViewById(purchaseOrderId) {
        return this.purchaseOrderEndpoint.getPOViewById(purchaseOrderId);
    }

    getPOPartsViewById(purchaseOrderId) {
        return this.purchaseOrderEndpoint.getPOPartsViewById(purchaseOrderId);
    }

    getPOHistory(purchaseOrderId) {
        return this.purchaseOrderEndpoint.getPOHistory(purchaseOrderId);
    }

    getVendorPOById(Id: number,) {
        return this.purchaseOrderEndpoint.getVendorPOById<any>(Id);
    }

    saveCreatePOApproval(action: any) {
        return this.purchaseOrderEndpoint.saveCreatePOApproval<any>(action);
    }

    updatePOApproval(action: any) {
        return this.purchaseOrderEndpoint.updatePOApproval<any>(action);
    }

    getPOApproverList(purchaseOrderId) {
        return this.purchaseOrderEndpoint.getPOApproverList(purchaseOrderId);
    }

    getPurchaseOrderSettingMasterData(currentUserMasterCompanyId) {
        return this.purchaseOrderEndpoint.getPurchaseOrderSettingMasterData(currentUserMasterCompanyId);
    }

    savePurchaseOrderSettingMasterDate(data) {
        return this.purchaseOrderEndpoint.savePurchaseOrderSettingMasterDate<any>(data);
    }

    purchaseOrderGlobalSearch(filterText, pageNumber, pageSize, vendorId) {
        return this.purchaseOrderEndpoint.purchaseOrderGlobalSearch(filterText, pageNumber, pageSize, vendorId);
    }















    /*./vendor PO*/

}