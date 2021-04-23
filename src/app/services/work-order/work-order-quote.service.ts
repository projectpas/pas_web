// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { WorkOrderEndpointService } from '../work-order/work-order-endpoint.service';
import { QuoteEndpointService } from './work-order-quote.endpoint.service';
import { masterCompanyId } from 'src/app/common-masterData/mastercompany-details';

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
        return this.workOrderEndpointService.getWorkOrderById(workOrderId);
    }

    getPartsDetail(workOrderId,masterCompanyId) {
        return this.workOrderEndpointService.getPartsDetail(workOrderId,masterCompanyId);
    }

    getWorkOrderWorkFlowNumbers(workOrderId,masterCompanyId) {
        return this.workOrderEndpointService.getWorkOrderWorkFlowNumbers(workOrderId,masterCompanyId);
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

    getWorkFlowDetails(workFlowId,masterCompanyId) {
        return this.workOrderEndpointService.getWorkFlowDetails(workFlowId,masterCompanyId);
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
    getQuoteIdByWfandWorkOrderId(wfwoId, workOrderId,masterCompanyId) {
        return this.quoteEndPointService.getQuoteIdByWfandWorkOrderId(wfwoId, workOrderId,masterCompanyId);
    }
    getQuoteExclusionList(workOrderQuoteId, buildMethodId) {
        return this.quoteEndPointService.getQuoteExclusionList(workOrderQuoteId, buildMethodId);
    }
    getQuoteMaterialList(workOrderQuoteId, buildMethodId,masterCompanyId) {
        return this.quoteEndPointService.getQuoteMaterialList(workOrderQuoteId, buildMethodId,masterCompanyId);
    } 
    getQuoteMaterialListForBilling(workOrderId) {
        return this.quoteEndPointService.getQuoteMaterialListForBilling(workOrderId);
    }
    getQuoteFreightsList(workOrderQuoteId, buildMethodId,masterCompanyId) {
        return this.quoteEndPointService.getQuoteFreightsList(workOrderQuoteId, buildMethodId,masterCompanyId);
    }
    getQuoteFreightsListBilling(workOrderId) {
        return this.quoteEndPointService.getQuoteFreightsListBilling(workOrderId);
    }
    getQuoteChargesList(workOrderQuoteId, buildMethodId,masterCompanyId) {
        return this.quoteEndPointService.getQuoteChargesList(workOrderQuoteId, buildMethodId,masterCompanyId);
    }
    getQuoteChargesListBilling(workOrderId) {
        return this.quoteEndPointService.getQuoteChargesListBilling(workOrderId);
    }
    getQuoteLaborList(workOrderQuoteId, buildMethodId,masterCompanyId) {
        return this.quoteEndPointService.getQuoteLaborList(workOrderQuoteId, buildMethodId,masterCompanyId);
    }
    getQuoteLaborListBilling(workOrderId) {
        return this.quoteEndPointService.getQuoteLaborListBilling(workOrderId);
    }
    getWorkOrderQuoteDetail(workOrderId, workFlowWorkOrderId,masterCompanyId){
        return this.quoteEndPointService.getWorkOrderQuoteDetail(workOrderId, workFlowWorkOrderId,masterCompanyId)
    }
    getWorkOrderQuoteList(payload){
        return this.quoteEndPointService.getWorkOrderQuoteList(payload);
    }
    getWorkOrderQuoteData(workOrderQuoteId) {
        return this.quoteEndPointService.getWorkOrderQuoteData(workOrderQuoteId);
    }
    getSavedQuoteDetails(wfwoid,masterCompanyId){
        return this.quoteEndPointService.getSavedQuoteDetails(wfwoid,masterCompanyId);
    }
    getPartDetails(itemMasterId, conditionId,masterCompanyId){
        return this.quoteEndPointService.getPartDetails(itemMasterId, conditionId,masterCompanyId);
    }
    getPartConditions(itemMasterId){
        return this.quoteEndPointService.getPartConditions(itemMasterId);
    }
    getWOTaskQuote(workOrderPartNoId,masterCompanyId){
        return this.quoteEndPointService.getWOTaskQuote(workOrderPartNoId,masterCompanyId);
    }
    getQuoteSettings(masterCompanyId, woTypeId){
        return this.quoteEndPointService.getQuoteSettings(masterCompanyId, woTypeId);
    }
    getInternalApproversList(approvalTaskId, moduleAmount){
        return this.quoteEndPointService.getInternalApproversList(approvalTaskId, moduleAmount);
    }
    getWOQuoteApprovalList(workOrderQuoteId,masterCompanyId) {
        return this.quoteEndPointService.getWOQuoteApprovalList(workOrderQuoteId,masterCompanyId);
    }

    getWOQuoteAnalysisList(workOrderId,masterCompanyId) {
        return this.quoteEndPointService.getWOQuoteAnalysisList(workOrderId,masterCompanyId);
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