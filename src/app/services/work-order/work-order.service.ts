// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { WorkOrder } from '../../models/work-order.model';
import { WorkOrderType, WorkOrderStatus, WorkScope, WorkOrderStage } from '../../models/work-order-type.model';

import { WorkOrderEndpointService } from '../work-order/work-order-endpoint.service';

@Injectable()
export class WorkOrderService {

    creditTerms: any;
    constructor(private workOrderEndpointService: WorkOrderEndpointService) {
    }

    getAll() {
        return this.workOrderEndpointService.getAllWorkOrders<WorkOrder[]>();
    }

    // getById(workOrderId: number) {
    //     return this.workOrderEndpointService.getWorkOrderById<WorkOrder>(workOrderId);
    // }

    getWorkOrderById(workOrderId, receivingCustomerId) {
        return this.workOrderEndpointService.getWorkOrderById(workOrderId, receivingCustomerId);
    }

    createNewWorkOrder(workOrder) {
        return this.workOrderEndpointService.createNewWorkOrder<any>(workOrder);
    }

    updateNewWorkOrder(workOrder: WorkOrder) {
        return this.workOrderEndpointService.updateNewWorkOrder<any>(workOrder);
    }

    remove(workOrderId: number) {
        return this.workOrderEndpointService.removeWorkOrderById(workOrderId);
    }

    updateActive(assetStatus: any) {
        //return this.assetStatusEndpoint.getUpdateForActive(assetStatus, assetStatus.id);
    }

    getAssetAudit(assetId: number) {
        //return this.assetStatusEndpoint.getAssetStatusAuditById<any>(assetId);
    }

    getAllWorkOrderTypes() {
        return this.workOrderEndpointService.getAllWorkOrderTypes<WorkOrderType[]>();
    }

    getAllWorkOrderStatus() {
        return this.workOrderEndpointService.getAllWorkOrderStatus<WorkOrderStatus[]>();
    }

    getAllWorkScopes() {
        return this.workOrderEndpointService.getAllWorkScopes<WorkScope[]>();
    }

    getAllWorkOrderStages() {
        return this.workOrderEndpointService.getAllWorkOrderStages<WorkOrderStage[]>();
    }
    postLabour(action: any) {
        return this.workOrderEndpointService.postLabourEndpoint<any>(action);
    }

    getWorkOrderStageAndStatus(){
        return this.workOrderEndpointService.getWorkOrderStageAndStatus()
    }

    getWorkFlowByPNandScope(itemMasterId, workScopeId) {
        return this.workOrderEndpointService.getWorkFlowByPNandScope(itemMasterId, workScopeId)
    }
    getNTEandSTDByItemMasterId(itemMasterId, workScopeName) {
        return this.workOrderEndpointService.getNTEandSTDByItemMasterId(itemMasterId, workScopeName)
    }

    getMultipleParts() {
        return this.workOrderEndpointService.getMultipleParts()
    }

    
    getWorkOrderDatesFoRTat(workOrderId) {
        return this.workOrderEndpointService.getWorkOrderDatesFoRTat(workOrderId)
    }
    getRevisedPartNumbers(itemMasterId) {
        return this.workOrderEndpointService.getRevisedPartNumbers(itemMasterId)
    }
    getStockLineByItemMasterId(itemMasterId, conditionId) {
        return this.workOrderEndpointService.getStockLineByItemMasterId(itemMasterId, conditionId);
    }
    getPartPublicationByItemMaster(itemMasterId) {
        return this.workOrderEndpointService.getPartPublicationByItemMaster(itemMasterId);
    }
    getSerialNoByStockLineId(stockLineId, conditionId) {
        return this.workOrderEndpointService.getSerialNoByStockLineId(stockLineId, conditionId)
    }
    getConditionByItemMasterId(itemMasterId) {
        return this.workOrderEndpointService.getConditionByItemMasterId(itemMasterId);
    }
    getWorkOrderList(paginationData) {
        return this.workOrderEndpointService.getWorkOrderList(paginationData);
    }
    getWorkOrderGlobalSearch(value, pageIndex, pageSize) {
        return this.workOrderEndpointService.getWorkOrderGlobalSearch(value, pageIndex, pageSize);
    }

    updateActionforWorkOrder(action, login) {
        return this.workOrderEndpointService.updateWorkOrderStatus(action, login);
    }
    deleteActionforWorkOrder(workOrderId) {
        return this.workOrderEndpointService.deleteWorkOrder(workOrderId);
    }

    getWorkOrderPartListByWorkOrderId(workOrderId) {
        return this.workOrderEndpointService.getWorkOrderPartListByWorkOrderId(workOrderId);
    }

    createWorkFlowWorkOrder(data) {
        return this.workOrderEndpointService.createWorkFlowWorkOrder(data);
    }

    getWorkOrderWorkFlowNumbers(workOrderId) {
        return this.workOrderEndpointService.getWorkOrderWorkFlowNumbers(workOrderId);
    }
    getbillingCostDataForWoOnly(workOrderWorkflowId,managementStructureId) {
        return this.workOrderEndpointService.getbillingCostDataForWoOnly(workOrderWorkflowId,managementStructureId);
    }
    
    getWorkOrderAssetList(isSubWorkOrder,data) {
        return this.workOrderEndpointService.getWorkOrderAssetList(isSubWorkOrder,data);
    } 
    createWorkOrderLabor(data,isSubWorkOrder) {
        return this.workOrderEndpointService.createWorkOrderLabor(data,isSubWorkOrder);
    }

    createWorkOrderMaterialList(data) {
        return this.workOrderEndpointService.createWorkOrderMaterialList(data);
    }
    updateWorkOrderMaterialList(data) {
        return this.workOrderEndpointService.updateWorkOrderMaterialList(data);
    }
    deleteWorkOrderMaterialListById(workOrderMaterialId, updatedBy) {
        return this.workOrderEndpointService.deleteWorkOrderMaterialListById(workOrderMaterialId, updatedBy);
    }
    createWorkOrderEquipmentList(data,isSubWorkOrder) {
        return this.workOrderEndpointService.createWorkOrderEquipmentList(data,isSubWorkOrder);
    }
    updateWorkOrderEquipmentList(data) {
        return this.workOrderEndpointService.updateWorkOrderEquipmentList(data);
    }
    createWorkOrderChargesList(data) {
        return this.workOrderEndpointService.createWorkOrderChargesList(data);
    }

    updateWorkOrderChargesList(data) {
        return this.workOrderEndpointService.updateWorkOrderChargesList(data);
    }

    createWorkOrderExclusionList(data) {
        return this.workOrderEndpointService.createWorkOrderExclusionList(data);
    }
    updateWorkOrderExclusionList(data) {
        return this.workOrderEndpointService.updateWorkOrderExclusionList(data);
    }

    createWorkOrderFreightList(data,isSubWorkOrder){
        return this.workOrderEndpointService.createWorkOrderFreightList(data,isSubWorkOrder);
    }

    updateWorkOrderFreightList(data){
        return this.workOrderEndpointService.updateWorkOrderFreightList(data);
    }
    deleteWorkOrderFreightList(workOrderFreightId , updatedBy,isSubWorkOrder){
        return this.workOrderEndpointService. deleteWorkOrderFreightList(workOrderFreightId , updatedBy,isSubWorkOrder);
    }

    getAllTasks() {
        return this.workOrderEndpointService.getTasks();
    }
    getWorkOrderMaterialList(workFlowWorkOrderId, workOrderId) {
        return this.workOrderEndpointService.getWorkOrderMaterialList(workFlowWorkOrderId, workOrderId)
    } 
    getSubWorkOrderMaterialList(subWOPartNoId) {
        return this.workOrderEndpointService.getSubWorkOrderMaterialList(subWOPartNoId)
    } 
    deleteWorkOrderMaterialList(workOrderMaterialsId, updatedBy) {
        return this.workOrderEndpointService.deleteWorkOrderMaterialList(workOrderMaterialsId, updatedBy)
    } 
    getWorkOrderRolMaterialList(workOrderMaterialsId) {
        return this.workOrderEndpointService.getWorkOrderRolMaterialList(workOrderMaterialsId)
    } 
    
    getWorkOrderPublicationList(workFlowWorkOrderId, workOrderId) {
        return this.workOrderEndpointService.getWorkOrderPublicationList(workFlowWorkOrderId, workOrderId)
    }

    getWorkOrderChargesList(workFlowWorkOrderId, workOrderId,isDeleted) {
        return this.workOrderEndpointService.getWorkOrderChargesList(workFlowWorkOrderId, workOrderId,isDeleted)
    }

    deleteWorkOrderChargesByChargesId(workOrderChargeId, updatedBy,isSubWorkOrder) {
        return this.workOrderEndpointService.deleteWorkOrderChargesByChargesId(workOrderChargeId, updatedBy,isSubWorkOrder)
    }

    getWorkOrderExclusionsList(workFlowWorkOrderId, workOrderId) {
        return this.workOrderEndpointService.getWorkOrderExclusionsList(workFlowWorkOrderId, workOrderId)
    }
    deleteWorkOrderExclusionByExclusionId(workOrderExclusionsId, updatedBy) {
        return this.workOrderEndpointService.deleteWorkOrderExclusionByExclusionId(workOrderExclusionsId, updatedBy)
    }
    getWorkOrderFrieghtsList(workFlowWorkOrderId, workOrderId,isSubWorkOrder,subWOPartNoId){
        return this.workOrderEndpointService.getWorkOrderFrieghtsList(workFlowWorkOrderId, workOrderId,isSubWorkOrder,subWOPartNoId)
    }
    getWorkOrderLaborList(workFlowWorkOrderId, workOrderId,isSubWorkOrder,subWOPartNoId) {
        return this.workOrderEndpointService.getWorkOrderLaborList(workFlowWorkOrderId, workOrderId,isSubWorkOrder,subWOPartNoId)
    }

    getWorkOrderDirectionList(workFlowWorkOrderId, workOrderId) {
        return this.workOrderEndpointService.getWorkOrderDirectionList(workFlowWorkOrderId, workOrderId)
    }

    getWorkOrderWorkFlowByWorkFlowWorkOrderId(workFlowWorkOrderId) {
        return this.workOrderEndpointService.getWorkOrderWorkFlowByWorkFlowWorkOrderId(workFlowWorkOrderId)
    }

    viewWorkOrderHeader(workOrderId) {
        return this.workOrderEndpointService.viewWorkOrderHeader(workOrderId);
    } 
    // getSitesbymanagementstructrue(managementStructureId){
    //     return this.workOrderEndpointService.getSitesbymanagementstructrue(managementStructureId);
    // }
    viewWorkOrderPartNumber(workOrderId) {
        return this.workOrderEndpointService.viewWorkOrderPartNumber(workOrderId);
    }

    getReservedPartsByWorkFlowWOId(WorkFlowWorkOrderId,workOrderId, statusId,updatedBy,type) {
        return this.workOrderEndpointService.getReservedPartsByWorkFlowWOId(WorkFlowWorkOrderId,workOrderId, statusId,updatedBy,type);
    }
    saveReservedPartorIssue(alternatePart) {
        return this.workOrderEndpointService.saveReservedPartorIssue(alternatePart)
    }
    assetsCheckInByWorkOrderAssetsId(assetcheckin) {
        return this.workOrderEndpointService.assetsCheckInByWorkOrderAssetsId(assetcheckin);
    }
    assetsCheckOutByWorkOrderAssetsId(assetcheckout) {
        return this.workOrderEndpointService.assetsCheckOutByWorkOrderAssetsId(assetcheckout);
    }
    assetsHistoryByWorkOrderAssetId(workOrderAssetId){
        return this.workOrderEndpointService.assetsHistoryByWorkOrderAssetId(workOrderAssetId);
    }
    deleteWorkOrderAssetByAssetId(workOrderAssetId, updatedBy,isSubWorkOrder) {
        return this.workOrderEndpointService.deleteWorkOrderAssetByAssetId(workOrderAssetId, updatedBy,isSubWorkOrder);
    }

    createQuote(data) {
        return this.workOrderEndpointService.createOrUpdateQuotation(data);
    }

    getSubWorkOrderListByWorkOrderId(workOrderId) {
        return this.workOrderEndpointService.getSubWorkOrderListByWorkOrderId(workOrderId);
    }

    getSubWorkOrderView(subWorkOrderId) {
        return this.workOrderEndpointService.getSubWorkOrderDataBySubWorkOrderId(subWorkOrderId);
    }

    // subWorkOrder 
    getSubWorkOrderHeaderByWorkOrderId(workOrderId, workOrderPartNumberId) {
        return this.workOrderEndpointService.getSubWorkOrderHeaderByWorkOrderId(workOrderId, workOrderPartNumberId);
    }

    getSubWorkOrderDataBySubWorkOrderId(subWorkOrderId) {
        return this.workOrderEndpointService.getSubWorkOrderDataBySubWorkOrderId(subWorkOrderId);
    }


    createSubWorkOrderHeaderByWorkOrderId(data) {
        return this.workOrderEndpointService.createSubWorkOrderHeaderByWorkOrderId(data);
    }
    updateSubWorkOrderHeaderBySubWorkOrderId(data) {
        return this.workOrderEndpointService.updateSubWorkOrderHeaderBySubWorkOrderId(data);
    }


    createBillingByWorkOrderId(data) {
        return this.workOrderEndpointService.createBillingByWorkOrderId(data);
    }
    updateBillingByWorkOrderId(data) {
        return this.workOrderEndpointService.updateBillingByWorkOrderId(data);
    }

    getExistingWOROList() {
        return this.workOrderEndpointService.getExistingWOROList();
    }

    createNewWORO(workOrderPartNoId) {
        return this.workOrderEndpointService.createNewWORO(workOrderPartNoId);
    }





    getPartsDetail(workOrderId) {
        return this.workOrderEndpointService.getPartsDetail(workOrderId);
    }

    getBuildDetailsFromWorkFlow(partId, workScopeId) {
        return this.workOrderEndpointService.getBuildDetailsFromWorkFlow(partId, workScopeId);
    }

    getBillingEditData(workOrderId, workOrderPartNoId) {
        return this.workOrderEndpointService.getBillingEditData(workOrderId, workOrderPartNoId);
    }

    getPartNosByCustomer(customerId, workOrderId) {
        return this.workOrderEndpointService.getPartNosByCustomer(customerId, workOrderId);
    }
    
    getReceivingCustomerreference(customerId) {
        return this.workOrderEndpointService.getReceivingCustomerreference(customerId);
    }

    getDocumentsList(wfWoId, workOrderId,isSubWorkOrder,subWOPartNoId){
        return this.workOrderEndpointService.getDocumentsList(wfWoId, workOrderId,isSubWorkOrder,subWOPartNoId);
    }
    createDocuments(data,isSubWorkOrder){
        return this.workOrderEndpointService.createDocuments(data,isSubWorkOrder);
    } 
    getDocumentList(wfwoid, workOrderId){
        return this.workOrderEndpointService.getDocumentList(wfwoid, workOrderId)
    }
    updateWorkOrderDocumentStatus(workOrderDocumentsId,status, updatedBy){
        return this.workOrderEndpointService.updateWorkOrderDocumentStatus(workOrderDocumentsId,status, updatedBy);
    }
    deleteWorkOrderDocuments(attachmentId, updatedBy){
        return this.workOrderEndpointService.deleteWorkOrderDocuments(attachmentId, updatedBy);
    }
    //workorder tear down add
    createworkOrderTearDownData(data,isSubWorkOrder) {
        return this.workOrderEndpointService.createworkOrderTearDownData(data,isSubWorkOrder);
    }

    getworkOrderTearDownData(id,isSubWorkOrder){
        return this.workOrderEndpointService.getworkOrderTearDownData(id,isSubWorkOrder);
    }
    getworkOrderTearDownViewData(id,isSubWorkOrder){
        return this.workOrderEndpointService.getworkOrderTearDownViewData(id,isSubWorkOrder);
    }
    getteardownreasonbyidData(id){
        return this.workOrderEndpointService.getteardownreasonbyid(id);
    }
    workOrderLabourAnalysisData(workOrderId, workOrderPartNoId,isSubWorkOrder){
        return this.workOrderEndpointService.workOrderLabourAnalysisData(workOrderId, workOrderPartNoId,isSubWorkOrder);
    }
    workOrderAnalysisData(workOrderId, workOrderPartNoId,isSubWorkOrder){
        return this.workOrderEndpointService.workOrderAnalysisData(workOrderId,workOrderPartNoId,isSubWorkOrder);
    }
    worOrderTearDownReasonListById(tearDownTypeId){
        return this.workOrderEndpointService.worOrderTearDownReasonListById(tearDownTypeId);
    }
    getworblist(){
        return this.workOrderEndpointService.getworblist()   
    }
    getLaborOHSettingsByManagementstrucId(id) {
        return this.workOrderEndpointService.getLaborOHSettingsByManagementstrucId(id);
    }

    saveOrUpdateWOQuoteSetting(data){
        return this.workOrderEndpointService.saveOrUpdateWOQuoteSettings(data);
    }

    getWOQuoteSettingList(){
        return this.workOrderEndpointService.getWOQuoteSettingList();
    }

    getWOQuoteSettingHistory(id){
        return this.workOrderEndpointService.getWOQuoteSettingHistory(id);
    }

    reserveAltPartData(data){
        return this.workOrderEndpointService.reserveAltPartData(data);
    }
    reserveEqlPartData(data){
        return this.workOrderEndpointService.reserveEqlPartData(data);
    }
    reservereleasestoclineqty(data){
        return this.workOrderEndpointService.reservereleasestoclineqty(data);
    }
    getSiteByCustomerId(customerId){
        return this.workOrderEndpointService.getSiteByCustomerId(customerId);
    }
    saveWorkOrderShipping(data){
        return this.workOrderEndpointService.saveWorkOrderShipping(data);
    }
    getShippingForWorkOrderPart(workOrderPartNoId){
        return this.workOrderEndpointService.getShippingForWorkOrderPart(workOrderPartNoId);
    }

    getTearDownTypesFromWOSettings(masterCompanyId, woTypeId){
        return this.workOrderEndpointService.getTearDownTypesFromWOSettings(masterCompanyId, woTypeId);
    }
    deleteMpnByWorkOrderId(data){
        return this.workOrderEndpointService.deleteMpnByWorkOrderId(data);
    }
    getSubWorkOrderDataForMpnGrid(workOrderMaterialsId,workOrderPartNoId){
        return this.workOrderEndpointService.getSubWorkOrderDataForMpnGrid(workOrderMaterialsId,workOrderPartNoId);
    }
    createSubWorkOrderGrid(subWorkOrder){
        return this.workOrderEndpointService.createSubWorkOrderGrid(subWorkOrder);
    }

    getSubWorOrderMpnsById(subWorkOrderId){
        return this.workOrderEndpointService.getSubWorOrderMpnsById(subWorkOrderId);
    }
    getMpnDropdownlistSubWo(subWorkOrderId){
        return this.workOrderEndpointService.getMpnDropdownlistSubWo(subWorkOrderId)
    } 
    createSubWorkOrderMaterialList(data){
        return this.workOrderEndpointService.createSubWorkOrderMaterialList(data)
    }
    getSubWoMaterialRoleUps(subWorkOrderMaterialId){
        return this.workOrderEndpointService.getSubWoMaterialRoleUps(subWorkOrderMaterialId)
    }
    deleteSubWorkOrderMaterialList(subWorkOrderMaterialId, updatedBy) {
        return this.workOrderEndpointService.deleteSubWorkOrderMaterialList(subWorkOrderMaterialId, updatedBy)
    }
    reservereleaseSubWostoclineqty(data){
        return this.workOrderEndpointService.reservereleaseSubWostoclineqty(data);
    }

    reserveSubWoAltPartData(data){
        return this.workOrderEndpointService.reserveSubWoAltPartData(data);
    }
    reserveSubWoEqlPartData(data){
        return this.workOrderEndpointService.reserveSubWoEqlPartData(data);
    }
    saveSubWoReservedPartorIssue(alternatePart) {
        return this.workOrderEndpointService.saveSubWoReservedPartorIssue(alternatePart)
    }
    createSubWorkOrderChargesList(data) {
        return this.workOrderEndpointService.createSubWorkOrderChargesList(data);
    }
    getSubWorkOrderChargesList(subWOPartNoId) {
        return this.workOrderEndpointService.getSubWorkOrderChargesList(subWOPartNoId)
    }

    // createWorkOrderFreightList(data){
    //     return this.workOrderEndpointService.createWorkOrderFreightList(data);
    // }

    // deleteWorkOrderFreightList(workOrderFreightId , updatedBy){
    //     return this.workOrderEndpointService. deleteWorkOrderFreightList(workOrderFreightId , updatedBy);
    // }

    getMaterialListMPNS(workOrderId) {
        return this.workOrderEndpointService.getMaterialListMPNS(workOrderId);
    }

    getLabourListMPNS(workOrderId){
        return this.workOrderEndpointService.getLabourListMPNS(workOrderId);
    }

    getLabourAnalysisListMPNS(workOrderId){
        return this.workOrderEndpointService.getLabourAnalysisListMPNS(workOrderId);
    }

    getChargesListMPNS(workOrderId){
        return this.workOrderEndpointService.getChargesListMPNS(workOrderId);
    }

    getDocumentsListMPNS(workOrderId){
        return this.workOrderEndpointService.getDocumentsListMPNS(workOrderId);
    }

    getMemosListMPNS(workOrderId){
        return this.workOrderEndpointService.getMemosListMPNS(workOrderId);
    }

    getEmailsListMPNS(workOrderId){
        return this.workOrderEndpointService.getEmailsListMPNS(workOrderId);
    }

    getPhonesListMPNS(workOrderId){
        return this.workOrderEndpointService.getPhonesListMPNS(workOrderId);
    }

    getTextsListMPNS(workOrderId){
        return this.workOrderEndpointService.getTextsListMPNS(workOrderId);
    }

    getFreightsListMPNS(workOrderId){
        return this.workOrderEndpointService.getFreightsListMPNS(workOrderId);
    }

    getReturnedPartsToCustomer(workOrderId, workOrderPartNumberId){
        return this.workOrderEndpointService.getReturnedPartsToCustomer(workOrderId, workOrderPartNumberId);
    }

    getShippingListMPNS(workOrderId){
        return this.workOrderEndpointService.getShippingListMPNS(workOrderId);
    }
    getShippingData(workOrderShippingId){
        return this.workOrderEndpointService.getShippingData(workOrderShippingId);
    }

    getDocumentData(wfwoid){
        return this.workOrderEndpointService.getDocumentData(wfwoid);
    }

    getChargesDataForSummarisedView(wfwoid){
        return this.workOrderEndpointService.getChargesDataForSummarisedView(wfwoid);
    }
    getCommunicationMemoForSummarisedView(workOrderId, partNoId){
        return this.workOrderEndpointService.getCommunicationMemoForSummarisedView(workOrderId, partNoId);
    }
    getCommunicationMailForSummarisedView(workOrderId, partNoId){
        return this.workOrderEndpointService.getCommunicationMailForSummarisedView(workOrderId, partNoId);
    }
    getCommunicationPhoneForSummarisedView(workOrderId, partNoId){
        return this.workOrderEndpointService.getCommunicationPhoneForSummarisedView(workOrderId, partNoId);
    }
    getCommunicationTextForSummarisedView(workOrderId, partNoId){
        return this.workOrderEndpointService.getCommunicationTextForSummarisedView(workOrderId, partNoId)
    }
    getFreightsDataForSummarisedView(wfwoid){
        return this.workOrderEndpointService.getFreightsDataForSummarisedView(wfwoid)
    }
    getBillingandInvoicingDataForSummarisedView(workOrderId){
        return this.workOrderEndpointService.getBillingandInvoicingDataForSummarisedView(workOrderId)
    }

    getWOAnalysisMPNs(woId){
        return this.workOrderEndpointService.getWOAnalysisMPNs(woId);
    }
    getQuoteAnalysisMPNs(woId){
        return this.workOrderEndpointService.getQuoteAnalysisMPNs(woId);
    }

    getBillingAndInvoiceMPNs(workOrderId){
        return this.workOrderEndpointService.getBillingAndInvoiceMPNs(workOrderId);
    }

    getMateialListDetailsForSummarisedData(wfwoId){
        return this.workOrderEndpointService.getMateialListDetailsForSummarisedData(wfwoId);
    }

    getLabourListForDetailedView(wfwoId){
        return this.workOrderEndpointService.getLabourListForDetailedView(wfwoId);
    }
    getWorkOrderAssetListForDropDown() {
        return this.workOrderEndpointService.getWorkOrderAssetListForDropDown();
    }
    checkInAseetInventoryList(workOrderAssetId){
        return this.workOrderEndpointService.checkInAseetInventoryList(workOrderAssetId);
    }
    checkOutAseetInventoryList(workOrderAssetId,workOrderId,woPartNoId,assetRecordId,createdBy,masterCompanyId){
        return this.workOrderEndpointService.checkOutAseetInventoryList(workOrderAssetId,workOrderId,woPartNoId,assetRecordId,createdBy,masterCompanyId);
    }

    releaseAssetInventoryList(AssetData){
        return this.workOrderEndpointService.releaseAssetInventoryList(AssetData);
    }
    saveCheckOutInventory(AssetData) {
        return this.workOrderEndpointService.saveCheckOutInventory(AssetData);
    }
    saveCheckInInventory(AssetData){
        return this.workOrderEndpointService.saveCheckInInventory(AssetData);
    }
    getWoAssetInventoryHistory(workOrderAssetId){
        return this.workOrderEndpointService.getWoAssetInventoryHistory(workOrderAssetId);
    }
} 


