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
import { masterCompanyId } from 'src/app/common-masterData/mastercompany-details';
import { WOPickTicket } from '../../models/sales/WOPickTicket';

@Injectable()
export class WorkOrderService {

    creditTerms: any;
    partNumberData:any={};
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

    GetWorkflowtranserData(workOrderId) {
        return this.workOrderEndpointService.GetWorkflowtranserData(workOrderId);
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

    getWorkOrderStageAndStatus(masterCompanyId) {
        return this.workOrderEndpointService.getWorkOrderStageAndStatus(masterCompanyId)
    }

    getWorkFlowByPNandScope(itemMasterId, workScopeId, masterCompanyId) {
        return this.workOrderEndpointService.getWorkFlowByPNandScope(itemMasterId, workScopeId, masterCompanyId)
    }
    getNTEandSTDByItemMasterId(itemMasterId, workScopeId, masterCompanyId) {
        return this.workOrderEndpointService.getNTEandSTDByItemMasterId(itemMasterId, workScopeId, masterCompanyId)
    }

    getMultipleParts(masterCompanyId) {
        return this.workOrderEndpointService.getMultipleParts(masterCompanyId)
    }


    getWorkOrderDatesFoRTat(workOrderId, masterCompanyId) {
        return this.workOrderEndpointService.getWorkOrderDatesFoRTat(workOrderId, masterCompanyId)
    }
    getRevisedPartNumbers(itemMasterId) {
        return this.workOrderEndpointService.getRevisedPartNumbers(itemMasterId)
    }
    getStockLineByItemMasterId(itemMasterId, conditionId, masterCompanyId) {
        return this.workOrderEndpointService.getStockLineByItemMasterId(itemMasterId, conditionId, masterCompanyId);
    }
    getPartPublicationByItemMaster(itemMasterId, masterCompanyId) {
        return this.workOrderEndpointService.getPartPublicationByItemMaster(itemMasterId, masterCompanyId);
    }
    getSerialNoByStockLineId(stockLineId, conditionId, masterCompanyId) {
        return this.workOrderEndpointService.getSerialNoByStockLineId(stockLineId, conditionId, masterCompanyId)
    }
    getConditionByItemMasterId(itemMasterId) {
        return this.workOrderEndpointService.getConditionByItemMasterId(itemMasterId);
    }
    getWorkOrderList(paginationData) {
        return this.workOrderEndpointService.getWorkOrderList(paginationData);
    }
    WorkOrderROlist(paginationData) {
        return this.workOrderEndpointService.WorkOrderROlist(paginationData);
    }
    getWorkOrderGlobalSearch(value, pageIndex, pageSize) {
        return this.workOrderEndpointService.getWorkOrderGlobalSearch(value, pageIndex, pageSize);
    }

    updateActionforWorkOrder(action, login) {
        return this.workOrderEndpointService.updateWorkOrderStatus(action, login);
    }
    deleteActionforWorkOrder(workOrderId, login) {
        return this.workOrderEndpointService.deleteWorkOrder(workOrderId, login);
    }

    getWorkOrderPartListByWorkOrderId(workOrderId) {
        return this.workOrderEndpointService.getWorkOrderPartListByWorkOrderId(workOrderId);
    }

    createWorkFlowWorkOrder(data) {
        return this.workOrderEndpointService.createWorkFlowWorkOrder(data);
    }

    getWorkOrderWorkFlowNumbers(workOrderId, masterCompanyId) {
        return this.workOrderEndpointService.getWorkOrderWorkFlowNumbers(workOrderId, masterCompanyId);
    }
    getbillingCostDataForWoOnly(workOrderWorkflowId, managementStructureId) {
        return this.workOrderEndpointService.getbillingCostDataForWoOnly(workOrderWorkflowId, managementStructureId);
    }

    Getbillinginvoicingdetailsfromquote(workOrderWorkflowId, WorkOrderPartNoId) {
        return this.workOrderEndpointService.Getbillinginvoicingdetailsfromquote(workOrderWorkflowId, WorkOrderPartNoId);
    }

    getWorkOrderBillingByShipping(workOrderId, partId, workOrderShippingId) {
        return this.workOrderEndpointService.getWorkOrderBillingByShipping(workOrderId, partId, workOrderShippingId);
      }

      getBillingInvoiceList(workOrderId: number): Observable<any> {
        return Observable.forkJoin(
          this.workOrderEndpointService.getBillingInvoiceList(workOrderId)
        );
      }

    getWorkOrderAssetList(isSubWorkOrder, data) {
        return this.workOrderEndpointService.getWorkOrderAssetList(isSubWorkOrder, data);
    }
    createWorkOrderLabor(data, isSubWorkOrder) {
        return this.workOrderEndpointService.createWorkOrderLabor(data, isSubWorkOrder);
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
    createWorkOrderEquipmentList(data, isSubWorkOrder) {
        return this.workOrderEndpointService.createWorkOrderEquipmentList(data, isSubWorkOrder);
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

    createWorkOrderFreightList(data, isSubWorkOrder) {
        return this.workOrderEndpointService.createWorkOrderFreightList(data, isSubWorkOrder);
    }

    updateWorkOrderFreightList(data) {
        return this.workOrderEndpointService.updateWorkOrderFreightList(data);
    }
    deleteWorkOrderFreightList(workOrderFreightId, updatedBy, isSubWorkOrder) {
        return this.workOrderEndpointService.deleteWorkOrderFreightList(workOrderFreightId, updatedBy, isSubWorkOrder);
    }

    getAllTasks() {
        return this.workOrderEndpointService.getTasks();
    }
    getWorkOrderMaterialList(workFlowWorkOrderId, workOrderId, masterCompanyId) {
        return this.workOrderEndpointService.getWorkOrderMaterialList(workFlowWorkOrderId, workOrderId, masterCompanyId)
    }
    getWorkOrderMaterialListNew(workFlowWorkOrderId, workOrderId, masterCompanyId) {
        return this.workOrderEndpointService.getWorkOrderMaterialListNew(workFlowWorkOrderId, workOrderId, masterCompanyId)
    }
    getSubWorkOrderMaterialList(subWOPartNoId, masterCompanyId) {
        return this.workOrderEndpointService.getSubWorkOrderMaterialList(subWOPartNoId, masterCompanyId)
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

    getWorkOrderChargesList(workFlowWorkOrderId, workOrderId, isDeleted, masterCompanyId) {
        return this.workOrderEndpointService.getWorkOrderChargesList(workFlowWorkOrderId, workOrderId, isDeleted, masterCompanyId)
    }

    deleteWorkOrderChargesByChargesId(workOrderChargeId, updatedBy, isSubWorkOrder) {
        return this.workOrderEndpointService.deleteWorkOrderChargesByChargesId(workOrderChargeId, updatedBy, isSubWorkOrder)
    }

    getWorkOrderExclusionsList(workFlowWorkOrderId, workOrderId) {
        return this.workOrderEndpointService.getWorkOrderExclusionsList(workFlowWorkOrderId, workOrderId)
    }
    deleteWorkOrderExclusionByExclusionId(workOrderExclusionsId, updatedBy) {
        return this.workOrderEndpointService.deleteWorkOrderExclusionByExclusionId(workOrderExclusionsId, updatedBy)
    }
    getWorkOrderFrieghtsList(workFlowWorkOrderId, workOrderId, isSubWorkOrder, subWOPartNoId, isDeleted, masterCompanyId) {
        return this.workOrderEndpointService.getWorkOrderFrieghtsList(workFlowWorkOrderId, workOrderId, isSubWorkOrder, subWOPartNoId, isDeleted, masterCompanyId)
    }
    getWorkOrderLaborList(workFlowWorkOrderId, workOrderId, isSubWorkOrder, subWOPartNoId, masterCompanyId) {
        return this.workOrderEndpointService.getWorkOrderLaborList(workFlowWorkOrderId, workOrderId, isSubWorkOrder, subWOPartNoId, masterCompanyId)
    }

    getWorkOrderDirectionList(workFlowWorkOrderId, workOrderId) {
        return this.workOrderEndpointService.getWorkOrderDirectionList(workFlowWorkOrderId, workOrderId)
    }

    getWorkOrderWorkFlowByWorkFlowWorkOrderId(workFlowWorkOrderId) {
        return this.workOrderEndpointService.getWorkOrderWorkFlowByWorkFlowWorkOrderId(workFlowWorkOrderId)
    }

    viewWorkOrderHeader(workOrderId, masterCompanyId) {
        return this.workOrderEndpointService.viewWorkOrderHeader(workOrderId, masterCompanyId);
    }
    // getSitesbymanagementstructrue(managementStructureId){
    //     return this.workOrderEndpointService.getSitesbymanagementstructrue(managementStructureId);
    // }
    viewWorkOrderPartNumber(workOrderId) {
        return this.workOrderEndpointService.viewWorkOrderPartNumber(workOrderId);
    }

    getReservedPartsByWorkFlowWOId(WorkFlowWorkOrderId, workOrderId, statusId, updatedBy, type, masterCompanyId) {
        return this.workOrderEndpointService.getReservedPartsByWorkFlowWOId(WorkFlowWorkOrderId, workOrderId, statusId, updatedBy, type, masterCompanyId);
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
    assetsHistoryByWorkOrderAssetId(workOrderAssetId, isSubWorkOrder) {
        return this.workOrderEndpointService.assetsHistoryByWorkOrderAssetId(workOrderAssetId, isSubWorkOrder);
    }
    GetReleaseHistory(ReleaseFromId) {
        return this.workOrderEndpointService.GetReleaseHistory(ReleaseFromId);
    }
    deleteWorkOrderAssetByAssetId(workOrderAssetId, updatedBy, isSubWorkOrder) {
        return this.workOrderEndpointService.deleteWorkOrderAssetByAssetId(workOrderAssetId, updatedBy, isSubWorkOrder);
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
    getSubWorkOrderHeaderByWorkOrderId(workOrderId, workOrderPartNumberId, masterCompanyId) {
        return this.workOrderEndpointService.getSubWorkOrderHeaderByWorkOrderId(workOrderId, workOrderPartNumberId, masterCompanyId);
    }
    searchPartNumberAdvanced(parameters) {
        return this.workOrderEndpointService.searchPartNumberAdvanced(parameters);
    }
    getSubWorkOrderDataBySubWorkOrderId(subWorkOrderId, masterCompanyId) {
        return this.workOrderEndpointService.getSubWorkOrderDataBySubWorkOrderId(subWorkOrderId, masterCompanyId);
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





    getPartsDetail(workOrderId, masterCompanyId) {
        return this.workOrderEndpointService.getPartsDetail(workOrderId, masterCompanyId);
    }

    getBuildDetailsFromWorkFlow(partId, workScopeId) {
        return this.workOrderEndpointService.getBuildDetailsFromWorkFlow(partId, workScopeId);
    }

    getBillingEditData(workOrderId, workOrderPartNoId) {
        return this.workOrderEndpointService.getBillingEditData(workOrderId, workOrderPartNoId);
    }

    getPartNosByCustomer(customerId, workOrderId, masterCompanyId) {
        return this.workOrderEndpointService.getPartNosByCustomer(customerId, workOrderId, masterCompanyId);
    }

    getReceivingCustomerreference(customerId) {
        return this.workOrderEndpointService.getReceivingCustomerreference(customerId);
    }

    getDocumentsList(wfWoId, workOrderId, isSubWorkOrder, subWOPartNoId) {
        return this.workOrderEndpointService.getDocumentsList(wfWoId, workOrderId, isSubWorkOrder, subWOPartNoId);
    }
    createDocuments(data, isSubWorkOrder) {
        return this.workOrderEndpointService.createDocuments(data, isSubWorkOrder);
    }
    getDocumentList(wfwoid, workOrderId) {
        return this.workOrderEndpointService.getDocumentList(wfwoid, workOrderId)
    }
    updateWorkOrderDocumentStatus(workOrderDocumentsId, status, updatedBy) {
        return this.workOrderEndpointService.updateWorkOrderDocumentStatus(workOrderDocumentsId, status, updatedBy);
    }
    deleteWorkOrderDocuments(attachmentId, updatedBy) {
        return this.workOrderEndpointService.deleteWorkOrderDocuments(attachmentId, updatedBy);
    }
    //workorder tear down add
    createworkOrderTearDownData(data, isSubWorkOrder) {
        return this.workOrderEndpointService.createworkOrderTearDownData(data, isSubWorkOrder);
    }

    getworkOrderTearDownData(id, isSubWorkOrder, masterCompanyId) {
        return this.workOrderEndpointService.getworkOrderTearDownData(id, isSubWorkOrder, masterCompanyId);
    }
    getworkOrderTearDownViewData(id, isSubWorkOrder) {
        return this.workOrderEndpointService.getworkOrderTearDownViewData(id, isSubWorkOrder);
    }
    getteardownreasonbyidData(id) {
        return this.workOrderEndpointService.getteardownreasonbyid(id);
    }
    workOrderLabourAnalysisData(workOrderId, workOrderPartNoId, isSubWorkOrder, isDetailView, masterCompanyId) {
        return this.workOrderEndpointService.workOrderLabourAnalysisData(workOrderId, workOrderPartNoId, isSubWorkOrder, isDetailView, masterCompanyId);
    }
    workOrderAnalysisData(workOrderId, workOrderPartNoId, isSubWorkOrder, masterCompanyId) {
        return this.workOrderEndpointService.workOrderAnalysisData(workOrderId, workOrderPartNoId, isSubWorkOrder, masterCompanyId);
    }
    workOrderReleaseFromListData(workOrderId, workOrderPartNoId) {
        return this.workOrderEndpointService.workOrderReleaseFromListData(workOrderId, workOrderPartNoId);
    }
    worOrderTearDownReasonListById(tearDownTypeId) {
        return this.workOrderEndpointService.worOrderTearDownReasonListById(tearDownTypeId);
    }

    AutoCompleteDropdownsTeardownReasons(tearDownTypeId,Idlist,masterCompanyId) {
        return this.workOrderEndpointService.AutoCompleteDropdownsTeardownReasons(tearDownTypeId,Idlist,masterCompanyId);
    }
    getworblist() {
        return this.workOrderEndpointService.getworblist()
    }
    getLaborOHSettingsByManagementstrucId(id, masterCompanyId) {
        return this.workOrderEndpointService.getLaborOHSettingsByManagementstrucId(id, masterCompanyId);
    }

    saveOrUpdateWOQuoteSetting(data) {
        return this.workOrderEndpointService.saveOrUpdateWOQuoteSettings(data);
    }

    getWOQuoteSettingList() {
        return this.workOrderEndpointService.getWOQuoteSettingList();
    }

    getWOQuoteSettingHistory(id) {
        return this.workOrderEndpointService.getWOQuoteSettingHistory(id);
    }

    reserveAltPartData(data) {
        return this.workOrderEndpointService.reserveAltPartData(data);
    }
    reserveEqlPartData(data) {
        return this.workOrderEndpointService.reserveEqlPartData(data);
    }
    reservereleasestoclineqty(data) {
        return this.workOrderEndpointService.reservereleasestoclineqty(data);
    }
    getSiteByCustomerId(customerId) {
        return this.workOrderEndpointService.getSiteByCustomerId(customerId);
    }
    getShippingBillSiteByCustomerId(customerId) {
        return this.workOrderEndpointService.getShippingBillSiteByCustomerId(customerId);
    }
    saveWorkOrderShipping(data) {
        return this.workOrderEndpointService.saveWorkOrderShipping(data);
    }
    getShippingForWorkOrderPart(workOrderPartNoId) {
        return this.workOrderEndpointService.getShippingForWorkOrderPart(workOrderPartNoId);
    }

    getTearDownTypesFromWOSettings(masterCompanyId, woTypeId) {
        return this.workOrderEndpointService.getTearDownTypesFromWOSettings(masterCompanyId, woTypeId);
    }
    deleteMpnByWorkOrderId(data) {
        return this.workOrderEndpointService.deleteMpnByWorkOrderId(data);
    }
    getSubWorkOrderDataForMpnGrid(workOrderMaterialsId, workOrderPartNoId, masterCompanyId) {
        return this.workOrderEndpointService.getSubWorkOrderDataForMpnGrid(workOrderMaterialsId, workOrderPartNoId, masterCompanyId);
    }
    createSubWorkOrderGrid(subWorkOrder) {
        return this.workOrderEndpointService.createSubWorkOrderGrid(subWorkOrder);
    }

    getSubWorOrderMpnsById(subWorkOrderId, masterCompanyId) {
        return this.workOrderEndpointService.getSubWorOrderMpnsById(subWorkOrderId, masterCompanyId);
    }
    getMpnDropdownlistSubWo(subWorkOrderId, masterCompanyId) {
        return this.workOrderEndpointService.getMpnDropdownlistSubWo(subWorkOrderId, masterCompanyId)
    }
    createSubWorkOrderMaterialList(data) {
        return this.workOrderEndpointService.createSubWorkOrderMaterialList(data)
    }
    // createWorkOrderMaterialListNew(data) {
    //     return this.workOrderEndpointService.createWorkOrderMaterialListNew(data)
    // }
    getSubWoMaterialRoleUps(subWorkOrderMaterialId) {
        return this.workOrderEndpointService.getSubWoMaterialRoleUps(subWorkOrderMaterialId)
    }
    deleteSubWorkOrderMaterialList(subWorkOrderMaterialId, updatedBy) {
        return this.workOrderEndpointService.deleteSubWorkOrderMaterialList(subWorkOrderMaterialId, updatedBy)
    }
    reservereleaseSubWostoclineqty(data) {
        return this.workOrderEndpointService.reservereleaseSubWostoclineqty(data);
    }

    reserveSubWoAltPartData(data) {
        return this.workOrderEndpointService.reserveSubWoAltPartData(data);
    }
    reserveSubWoEqlPartData(data) {
        return this.workOrderEndpointService.reserveSubWoEqlPartData(data);
    }
    saveSubWoReservedPartorIssue(alternatePart) {
        return this.workOrderEndpointService.saveSubWoReservedPartorIssue(alternatePart)
    }
    createSubWorkOrderChargesList(data) {
        return this.workOrderEndpointService.createSubWorkOrderChargesList(data);
    }
    getSubWorkOrderChargesList(subWOPartNoId, isDeleted, masterCompanyId) {
        return this.workOrderEndpointService.getSubWorkOrderChargesList(subWOPartNoId, isDeleted, masterCompanyId)
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

    getLabourListMPNS(workOrderId) {
        return this.workOrderEndpointService.getLabourListMPNS(workOrderId);
    }

    getLabourAnalysisListMPNS(workOrderId) {
        return this.workOrderEndpointService.getLabourAnalysisListMPNS(workOrderId);
    }

    getChargesListMPNS(workOrderId) {
        return this.workOrderEndpointService.getChargesListMPNS(workOrderId);
    }

    getDocumentsListMPNS(workOrderId) {
        return this.workOrderEndpointService.getDocumentsListMPNS(workOrderId);
    }

    getMemosListMPNS(workOrderId) {
        return this.workOrderEndpointService.getMemosListMPNS(workOrderId);
    }

    getEmailsListMPNS(workOrderId) {
        return this.workOrderEndpointService.getEmailsListMPNS(workOrderId);
    }

    getPhonesListMPNS(workOrderId) {
        return this.workOrderEndpointService.getPhonesListMPNS(workOrderId);
    }

    getTextsListMPNS(workOrderId) {
        return this.workOrderEndpointService.getTextsListMPNS(workOrderId);
    }

    getFreightsListMPNS(workOrderId) {
        return this.workOrderEndpointService.getFreightsListMPNS(workOrderId);
    }

    getReturnedPartsToCustomer(workOrderId, workOrderPartNumberId) {
        return this.workOrderEndpointService.getReturnedPartsToCustomer(workOrderId, workOrderPartNumberId);
    }

    getShippingListMPNS(workOrderId) {
        return this.workOrderEndpointService.getShippingListMPNS(workOrderId);
    }
    getShippingData(workOrderShippingId) {
        return this.workOrderEndpointService.getShippingData(workOrderShippingId);
    }

    getDocumentData(wfwoid) {
        return this.workOrderEndpointService.getDocumentData(wfwoid);
    }

    getChargesDataForSummarisedView(wfwoid) {
        return this.workOrderEndpointService.getChargesDataForSummarisedView(wfwoid);
    }
    getCommunicationMemoForSummarisedView(workOrderId, partNoId) {
        return this.workOrderEndpointService.getCommunicationMemoForSummarisedView(workOrderId, partNoId);
    }
    getCommunicationMailForSummarisedView(workOrderId, partNoId) {
        return this.workOrderEndpointService.getCommunicationMailForSummarisedView(workOrderId, partNoId);
    }
    getCommunicationPhoneForSummarisedView(workOrderId, partNoId) {
        return this.workOrderEndpointService.getCommunicationPhoneForSummarisedView(workOrderId, partNoId);
    }
    getCommunicationTextForSummarisedView(workOrderId, partNoId) {
        return this.workOrderEndpointService.getCommunicationTextForSummarisedView(workOrderId, partNoId)
    }
    getFreightsDataForSummarisedView(wfwoid) {
        return this.workOrderEndpointService.getFreightsDataForSummarisedView(wfwoid)
    }
    getBillingandInvoicingDataForSummarisedView(workOrderId) {
        return this.workOrderEndpointService.getBillingandInvoicingDataForSummarisedView(workOrderId)
    }

    getWOAnalysisMPNs(woId) {
        return this.workOrderEndpointService.getWOAnalysisMPNs(woId);
    }
    getQuoteAnalysisMPNs(woId) {
        return this.workOrderEndpointService.getQuoteAnalysisMPNs(woId);
    }

    getBillingAndInvoiceMPNs(workOrderId) {
        return this.workOrderEndpointService.getBillingAndInvoiceMPNs(workOrderId);
    }

    getMateialListDetailsForSummarisedData(wfwoId) {
        return this.workOrderEndpointService.getMateialListDetailsForSummarisedData(wfwoId);
    }

    getLabourListForDetailedView(wfwoId) {
        return this.workOrderEndpointService.getLabourListForDetailedView(wfwoId);
    }
    getWorkOrderAssetListForDropDown() {
        return this.workOrderEndpointService.getWorkOrderAssetListForDropDown();
    }
    checkInAseetInventoryList(workOrderAssetId, isSubWorkOrder, masterCompanyId) {
        return this.workOrderEndpointService.checkInAseetInventoryList(workOrderAssetId, isSubWorkOrder, masterCompanyId);
    }
    checkOutAseetInventoryList(workOrderAssetId, workOrderId, woPartNoId, assetRecordId, createdBy, masterCompanyId, subWorkOrderId, isSubworkOrder) {
        return this.workOrderEndpointService.checkOutAseetInventoryList(workOrderAssetId, workOrderId, woPartNoId, assetRecordId, createdBy, masterCompanyId, subWorkOrderId, isSubworkOrder);
    }

    releaseAssetInventoryList(AssetData) {
        return this.workOrderEndpointService.releaseAssetInventoryList(AssetData);
    }
    releasesubwocheckoutinventory(AssetData) {
        return this.workOrderEndpointService.releasesubwocheckoutinventory(AssetData);
    }

    saveCheckOutInventory(AssetData) {
        return this.workOrderEndpointService.saveCheckOutInventory(AssetData);
    }
    saveCheckInInventory(AssetData) {
        return this.workOrderEndpointService.saveCheckInInventory(AssetData);
    }
    savesubwocheckoutinventory(AssetData) {
        return this.workOrderEndpointService.savesubwocheckoutinventory(AssetData);
    }
    savesubwocheckininventory(AssetData) {
        return this.workOrderEndpointService.savesubwocheckininventory(AssetData);
    }

    getWoAssetInventoryHistory(workOrderAssetId) {
        return this.workOrderEndpointService.getWoAssetInventoryHistory(workOrderAssetId);
    }

    getChargesHistory(isSubworkOrder, chargeId) {
        return this.workOrderEndpointService.getChargesHistory(isSubworkOrder, chargeId);
    }
    getFreightHistory(isSubworkOrder, freightId) {
        return this.workOrderEndpointService.getFreightHistory(isSubworkOrder, freightId);
    }
    getShippingDataList(WorkOrderId: number): Observable<any> {
        return Observable.forkJoin(
            this.workOrderEndpointService.getShippingDataList(WorkOrderId)
        );
    }

    generatePackagingSlip(packagingSlip: any): Observable<any> {
        return Observable.forkJoin(
          this.workOrderEndpointService.generatePackagingSlip(packagingSlip)
        );
      }


    getquoteMaterialHistory(id) {
        return this.workOrderEndpointService.getquoteMaterialHistory(id);
    }
    getquoteLaborHistory(id) {
        return this.workOrderEndpointService.getquoteLaborHistory(id);
    }
    getquoteChargesHistory(id) {
        return this.workOrderEndpointService.getquoteChargesHistory(id);
    }
    getquoteFreightsHistory(id) {
        return this.workOrderEndpointService.getquoteFreightsHistory(id);
    }
    getMaterialHistory(id, isSubWorkOrder) {
        return this.workOrderEndpointService.getMaterialHistory(id, isSubWorkOrder);
    }
    getMaterialStockHistory(id, isSubWorkOrder) {
        return this.workOrderEndpointService.getMaterialStockHistory(id, isSubWorkOrder);
    }

    transferWorkflow(data) {
        return this.workOrderEndpointService.transferWorkflow(data);
    }

    getPickTicketList(workOrderId) {
        return this.workOrderEndpointService.getPickTicketList(workOrderId);
    }

    
    GetWorkorderReleaseFromData(workOrderId,workOrderPartNumberId) {
        return this.workOrderEndpointService.GetWorkorderReleaseFromData(workOrderId,workOrderPartNumberId);
    }

    GetWorkorderReleaseEasaFromData(workOrderId,workOrderPartNumberId) {
        return this.workOrderEndpointService.GetWorkorderReleaseEasaFromData(workOrderId,workOrderPartNumberId);
    }

    getStockLineforPickTicket(itemMasterId, conditionId, referenceId, isMPN = false) {
        return this.workOrderEndpointService.getStockLineforPickTicket(itemMasterId, conditionId, referenceId, isMPN);
    }

    savepickticketiteminterface(parts: WOPickTicket): Observable<WOPickTicket[]> {
        return Observable.forkJoin(
            this.workOrderEndpointService.savepickticketiteminterface(parts)
        );
    }

    savepickticketiteminterface_mainpart(parts: WOPickTicket): Observable<WOPickTicket[]> {
        return Observable.forkJoin(
            this.workOrderEndpointService.savepickticketiteminterface_mainpart(parts)
        );
    }

    getPickTicketEdit(woPickTicketId: number, workOrderId: number, workOrderPartId: number, isMPN: boolean = false): Observable<any> {
        return Observable.forkJoin(
            this.workOrderEndpointService.getPickTicketEdit(woPickTicketId, workOrderId, workOrderPartId, isMPN)
        );
    }

    confirmPickTicket(pickticketId: number, confirmById: string, isMPN: boolean = false): Observable<boolean[]> {
        return Observable.forkJoin(
            this.workOrderEndpointService.confirmPickTicket(pickticketId, confirmById, isMPN)
        );
    }

    getPickTicketPrint(workOrderId: number, workOrderPartId: number, woPickTicketId: number): Observable<any> {
        return Observable.forkJoin(
            this.workOrderEndpointService.getPickTicketPrint(workOrderId, workOrderPartId, woPickTicketId)
        );
    }

    getPartPickTicketPrint(workOrderId: number, workOrderPartId: number, woPickTicketId: number): Observable<any> {
        return Observable.forkJoin(
            this.workOrderEndpointService.getPartPickTicketPrint(workOrderId, workOrderPartId, woPickTicketId)
        );
    }

    getPickTicketListMainPart(workOrderId, workFlowWorkOrderId) {
        return this.workOrderEndpointService.getPickTicketListMainPart(workOrderId, workFlowWorkOrderId);
    }


    deleteWorkOrderMaterialStocklineById(workOrderMaterialId, stocklineId, updatedBy) {
        return this.workOrderEndpointService.deleteWorkOrderMaterialStocklineById(workOrderMaterialId, stocklineId, updatedBy);
    }

    getPackagingSlipPrint(WorkOrderId: number, WorkOrderPartNoId: number, woPickTicketId: number, packagingSlipId: number): Observable<any> {
        return Observable.forkJoin(
          this.workOrderEndpointService.getPackagingSlipPrint(WorkOrderId, WorkOrderPartNoId, woPickTicketId, packagingSlipId)
        );
      }

      
  getMultiShippingLabelPrint(workOrderPackagingSlips: any): Observable<any> {
    return Observable.forkJoin(
      this.workOrderEndpointService.getMultiShippingLabelPrint(workOrderPackagingSlips)
    );
  }

  getMultiPackagingSlipPrint(workOrderPackagingSlips: any): Observable<any> {
    return Observable.forkJoin(
      this.workOrderEndpointService.getMultiPackagingSlipPrint(workOrderPackagingSlips)
    );
  }

  getShippingLabelPrint(workOrderId: number, workOrderPartId: number, woShippingId: number): Observable<any> {
    return Observable.forkJoin(
      this.workOrderEndpointService.getShippingLabelPrint(workOrderId, workOrderPartId, woShippingId)
    );
  }

  updateShipping(serviceClass: string, workOrderShippingId: number): Observable<any> {
    return Observable.forkJoin(
      this.workOrderEndpointService.updateShipping(serviceClass, workOrderShippingId)
    );
  }

  CreateUpdateReleasefrom(Releasefrom) {
    return this.workOrderEndpointService.CreateUpdateReleasefrom<any>(Releasefrom);
}

LockedWorkorderpart(Releasefrom) {
    return this.workOrderEndpointService.LockedWorkorderpart<any>(Releasefrom);
}
getWorkOrderBillingInvoicingData(wobillingInvoicingId: number): Observable<any> {
    return Observable.forkJoin(
      this.workOrderEndpointService.getWorkOrderBillingInvoicingData(wobillingInvoicingId)
    );
  }

  getworkOrderChargesById(id, isDeleted) {
    return this.workOrderEndpointService.getworkOrderChargesById(id, isDeleted);
  }

  getWorkOrderBillingInvoicingById(wobillingInvoicingId: number): Observable<any> {
    return Observable.forkJoin(
      this.workOrderEndpointService.getWorkOrderBillingInvoicingById(wobillingInvoicingId)
    );
  }
  
   UpdateWorkOrderBillingInvoicing(wobillingInvoicingId: number, billingInvoicing: any): Observable<any> {
    return Observable.forkJoin(
      this.workOrderEndpointService.UpdateWorkOrderBillingInvoicing(wobillingInvoicingId, billingInvoicing)
    );
  }

  GetWorkOrderPrintFormData(WorkorderId: number,workOrderPartNoId : number): Observable<any> {
    return Observable.forkJoin(
      this.workOrderEndpointService.GetWorkOrderPrintFormData(WorkorderId,workOrderPartNoId)
    );
  }

  GetWorkOrderPartlistFormData(WorkorderId: number,workOrderPartNoId : number): Observable<any> {
    return Observable.forkJoin(
      this.workOrderEndpointService.GetWorkOrderPartlistFormData(WorkorderId,workOrderPartNoId)
    );
  }

  GetWorkOrderQoutePrintFormData(WorkorderId: number,workOrderPartNoId : number ,workflowWorkorderId : number): Observable<any> {
    return Observable.forkJoin(
      this.workOrderEndpointService.GetWorkOrderQoutePrintFormData(WorkorderId,workOrderPartNoId,workflowWorkorderId)
    );
  }

}