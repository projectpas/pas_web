import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { RepairOrderEndpoint } from './repair-order-endpoint.service';



@Injectable()
export class RepairOrderService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private repairOrderEndpoint: RepairOrderEndpoint) { let currentUrl = this.router.url; }

  getRepairOrderBasicList() {
    return this.repairOrderEndpoint.getRepairOrderBasicList();
  }

  saveRepairOrder(data) {
      return this.repairOrderEndpoint.saveRepairOrder(data);
  } 

  saveRepairOrderParts(data) {
    return this.repairOrderEndpoint.saverRepairOrderParts(data);    
  }

  getRepairOrderAllPartsById(repairOrderId, employeeID, workOrderPartNumberId) {
    return this.repairOrderEndpoint.getRepairOrderAllPartsById(repairOrderId, employeeID, workOrderPartNumberId);
 }
 
  getRepairOrderPartsById(Id: number, workOrderPartNumberId) {
    return Observable.forkJoin(this.repairOrderEndpoint.getRepairOrderPartsById<any>(Id, workOrderPartNumberId));
  }
  
  getROList(data) {
    return Observable.forkJoin(
        this.repairOrderEndpoint.getROList(data));
  } 
 
  getROViewById(repairOrderId) {
    return this.repairOrderEndpoint.getROViewById(repairOrderId);
  }

  getROPartsViewById(repairOrderId) {
    return this.repairOrderEndpoint.getROPartsViewById(repairOrderId);
  }

  
  getROApprovalListById(repairOrderId) {
    return this.repairOrderEndpoint.getROApprovalListById(repairOrderId);
  }
   
  approverslistbyTaskId(taskId, id) {
    return this.repairOrderEndpoint.approverslistbyTaskId(taskId, id);
  }

  getVendorROHeaderById(repairOrderId) {
    return this.repairOrderEndpoint.getVendorROHeaderById(repairOrderId);
  }
  
  getroPartsById(repairOrderId,workOrderPartNoId) {
    return this.repairOrderEndpoint.getroPartsById(repairOrderId,workOrderPartNoId);
  }

  getROHistory(repairOrderId) {
    return this.repairOrderEndpoint.getROHistory(repairOrderId);
  }

  deleteRO(repairOrderId, updatedBy) {
    return this.repairOrderEndpoint.deleteRO(repairOrderId, updatedBy);
  }
  
  getApproversListByTaskIdModuleAmt(taskId, moduleAmount) {
    return this.repairOrderEndpoint.getApproversListByTaskIdModuleAmt(taskId, moduleAmount);
  }

  saveRepairOrderApproval(data) {
    return this.repairOrderEndpoint.saveRepairOrderApproval(data);
  }

  
  getVendorROAddressById(repairOrderId) {
    return this.repairOrderEndpoint.getVendorROAddressById(repairOrderId);
  }

  
  saveRepairOrderAddress(data) {
    return this.repairOrderEndpoint.saveRepairOrderAddress(data);
  }

  getROApproverList(repairOrderId) {
    return this.repairOrderEndpoint.getROApproverList(repairOrderId);
  }

  getROTotalCostById(repairOrderId) {
    return this.repairOrderEndpoint.getROTotalCostById(repairOrderId);
  }

  saveRepaireOrderSettings(data) {
    return this.repairOrderEndpoint.saveRepaireOrderSettings<any>(data);
  }
  
  getRepairOrderSettingMasterData(masterCompanyId) {
    return this.repairOrderEndpoint.getRepairOrderSettingMasterData(masterCompanyId);
  }

  getAllEditID(reairOrderId) {
    return this.repairOrderEndpoint.getAllEditID(reairOrderId);
}

  ///////
/*****
  getRepairOrdersBasic() {
    return Observable.forkJoin(
      this.repairOrderEndpoint.getRepairOrderBasicList<any[]>());
  }

  
  getVendorROById(Id: number, ) {
    return this.repairOrderEndpoint.getVendorROById<any>(Id);
  }

  saveCreateROApproval(action: any) {
    return this.repairOrderEndpoint.saveCreateROApproval<any>(action);
  }

  updateROApproval(action: any) {
    return this.repairOrderEndpoint.updateROApproval<any>(action);
  }

  

  getRepairOrderPartsById(repairOrderId, workOrderPartNumberId: any) {
    return this.repairOrderEndpoint.getRepairOrderPartsById(repairOrderId, workOrderPartNumberId);
  }

  getROStatus(repairOrderId, status, updatedBy) {
    return this.repairOrderEndpoint.getROStatus(repairOrderId, status, updatedBy);
  }
  repairOrderGlobalSearch(filterText, pageNumber, pageSize, vendorId) {
    return this.repairOrderEndpoint.repairOrderGlobalSearch(filterText, pageNumber, pageSize, vendorId);
  }

  
 */

}