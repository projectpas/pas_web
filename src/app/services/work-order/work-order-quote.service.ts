// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



import { WorkOrderEndpointService } from '../work-order/work-order-endpoint.service';
import { QuoteEndpointService } from './work-order-quote.endpoint.service';

@Injectable()
export class WorkOrderQuoteService {

    creditTerms: any;
    employeesOriginalData: any[];
    constructor(private workOrderEndpointService: WorkOrderEndpointService,
        public quoteEndPointService: QuoteEndpointService) {
    }

    createOrUpdateQuotation(data) {
        return this.workOrderEndpointService.createOrUpdateQuotation(data);
    }

    getWorkOrderById(workOrderId) {
        return this.workOrderEndpointService.getWorkOrderById(workOrderId,0);
    }

    getPartsDetail(workOrderId) {
        return this.workOrderEndpointService.getPartsDetail(workOrderId);
    }

    getWorkOrderWorkFlowNumbers(workOrderId) {
        return this.workOrderEndpointService.getWorkOrderWorkFlowNumbers(workOrderId);
    }

    getBuildDetailsFromWorkFlow(partId, workScopeId) {
        return this.workOrderEndpointService.getBuildDetailsFromWorkFlow(partId, workScopeId);
    }
    getBuildDetailsFromHistoricalWorkOrder(partId, workScopeId, payLoad) {
        return this.workOrderEndpointService.getBuildDetailsFromHistoricalWorkOrder(partId, workScopeId, payLoad);
    }
    getBuildDetailsFromHistoricalWorkOrderQuote(partId, workScopeId, payLoad) {
        return this.workOrderEndpointService.getBuildDetailsFromHistoricalWorkOrderQuote(partId, workScopeId, payLoad);
    }

    getWorkFlowDetails(workFlowId) {
        return this.workOrderEndpointService.getWorkFlowDetails(workFlowId);
    }

    getWorkOrderMaterialListForQuote(wfwoId) {
        return this.workOrderEndpointService.getWorkOrderMaterialListForQuote(wfwoId);
    }

    getWorkOrderLaborListForQuote(wfwoId) {
        return this.workOrderEndpointService.getWorkOrderLaborListForQuote(wfwoId);
    }

    getWorkOrderChargesListForQuote(wfwoId) {
        return this.workOrderEndpointService.getWorkOrderChargesListForQuote(wfwoId);
    }

    getWorkOrderExclutionsListForQuote(wfwoId) {
        return this.workOrderEndpointService.getWorkOrderExclutionsListForQuote(wfwoId);
    }

    getWorkOrderFreightListForQuote(wfwoId) {
        return this.workOrderEndpointService.getWorkOrderFreightListForQuote(wfwoId);
    }

    saveMaterialListQuote(data) {
        return this.workOrderEndpointService.saveMaterialListQuote(data);
    }

    saveFreightsListQuote(data) {
        return this.workOrderEndpointService.saveFreightsListQuote(data);
    }

    saveLaborListQuote(data) {
        return this.workOrderEndpointService.saveLaborListQuote(data);
    }

    saveChargesQuote(data) {
        return this.workOrderEndpointService.saveChargesQuote(data);
    }

    saveExclusionsQuote(data) {
        return this.workOrderEndpointService.saveExclusionsQuote(data);
    }
    getQuoteIdByWfandWorkOrderId(wfwoId, workOrderId) {
        return this.quoteEndPointService.getQuoteIdByWfandWorkOrderId(wfwoId, workOrderId);
    }
    getQuoteExclusionList(workOrderQuoteId, buildMethodId) {
        return this.quoteEndPointService.getQuoteExclusionList(workOrderQuoteId, buildMethodId);
    }
    getQuoteMaterialList(workOrderQuoteId, buildMethodId) {
        return this.quoteEndPointService.getQuoteMaterialList(workOrderQuoteId, buildMethodId);
    } 
    getQuoteMaterialListForBilling(workOrderId) {
        return this.quoteEndPointService.getQuoteMaterialListForBilling(workOrderId);
    }
    getQuoteFreightsList(workOrderQuoteId, buildMethodId) {
        return this.quoteEndPointService.getQuoteFreightsList(workOrderQuoteId, buildMethodId);
    }
    getQuoteFreightsListBilling(workOrderId) {
        return this.quoteEndPointService.getQuoteFreightsListBilling(workOrderId);
    }
    getQuoteChargesList(workOrderQuoteId, buildMethodId) {
        return this.quoteEndPointService.getQuoteChargesList(workOrderQuoteId, buildMethodId);
    }
    getQuoteChargesListBilling(workOrderId) {
        return this.quoteEndPointService.getQuoteChargesListBilling(workOrderId);
    }
    getQuoteLaborList(workOrderQuoteId, buildMethodId) {
        return this.quoteEndPointService.getQuoteLaborList(workOrderQuoteId, buildMethodId);
    }
    getQuoteLaborListBilling(workOrderId) {
        return this.quoteEndPointService.getQuoteLaborListBilling(workOrderId);
    }
    getWorkOrderQuoteDetail(workOrderId, workFlowWorkOrderId){
        return this.quoteEndPointService.getWorkOrderQuoteDetail(workOrderId, workFlowWorkOrderId)
    }
    getWorkOrderQuoteList(payload){
        return this.quoteEndPointService.getWorkOrderQuoteList(payload);
    }
    getWorkOrderQuoteData(workOrderQuoteId) {
        return this.quoteEndPointService.getWorkOrderQuoteData(workOrderQuoteId);
    }
    getSavedQuoteDetails(wfwoid){
        return this.quoteEndPointService.getSavedQuoteDetails(wfwoid);
    }
    getPartDetails(itemMasterId, conditionId){
        return this.quoteEndPointService.getPartDetails(itemMasterId, conditionId);
    }
    getPartConditions(itemMasterId){
        return this.quoteEndPointService.getPartConditions(itemMasterId);
    }
    getWOTaskQuote(workOrderPartNoId){
        return this.quoteEndPointService.getWOTaskQuote(workOrderPartNoId);
    }
    getQuoteSettings(masterCompanyId, woTypeId){
        return this.quoteEndPointService.getQuoteSettings(masterCompanyId, woTypeId);
    }
    getInternalApproversList(approvalTaskId, moduleAmount){
        return this.quoteEndPointService.getInternalApproversList(approvalTaskId, moduleAmount);
    }
    getWOQuoteApprovalList(workOrderQuoteId) {
        return this.quoteEndPointService.getWOQuoteApprovalList(workOrderQuoteId);
    }

    getWOQuoteAnalysisList(workOrderId) {
        return this.quoteEndPointService.getWOQuoteAnalysisList(workOrderId);
    }
    sentForInternalApproval(data){
        return this.quoteEndPointService.sentForInternalApproval(data);
    }
    submitForApproval(data){
        return this.quoteEndPointService.submitForApproval(data);
    }
    getTotals(workOrderQuoteId){
        return this.quoteEndPointService.getTotals(workOrderQuoteId);
    }
} 