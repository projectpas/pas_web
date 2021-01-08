import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';


@Injectable()
export class QuoteEndpointService extends EndpointFactory {
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    getQuoteIdByWfandWorkOrderId(wfwoId, workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/getworkorderquote?wfwoId=${wfwoId}&workOrderId=${workOrderId}`, this.getRequestHeaders())
    }
    getQuoteExclusionList(workOrderQuoteId, buildMethodId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/quoteexclusions?workOrderQuoteDetailsId=${workOrderQuoteId}&buildMethodId=${buildMethodId}`, this.getRequestHeaders())
    }
    getQuoteMaterialList(workOrderQuoteId, buildMethodId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/quotematerials?workOrderQuoteDetailsId=${workOrderQuoteId}&buildMethodId=${buildMethodId}`, this.getRequestHeaders())
    }
    getQuoteMaterialListForBilling(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/materialbillinglist?workOrderId=${workOrderId}`, this.getRequestHeaders())
    }
    getQuoteFreightsList(workOrderQuoteId, buildMethodId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/quotefreights?workOrderQuoteDetailsId=${workOrderQuoteId}&buildMethodId=${buildMethodId}`, this.getRequestHeaders())
    }
    getQuoteFreightsListBilling(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/billingfreightchrages?workOrderId=${workOrderId}`, this.getRequestHeaders())
    }
    getQuoteChargesList(workOrderQuoteId, buildMethodId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/quotecharges?workOrderQuoteDetailsId=${workOrderQuoteId}&buildMethodId=${buildMethodId}`, this.getRequestHeaders())
    }
    getQuoteChargesListBilling(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/billingcharges?workOrderId=${workOrderId}`, this.getRequestHeaders())
    }
    getQuoteLaborList(workOrderQuoteId, buildMethodId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/quotelabor?workOrderQuoteDetailsId=${workOrderQuoteId}&buildMethodId=${buildMethodId}`, this.getRequestHeaders())
    }
    getQuoteLaborListBilling(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/labourbillinglist?workOrderId=${workOrderId}`, this.getRequestHeaders())
    }
    getWorkOrderQuoteDetail(workOrderId, workFlowWorkOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkorderquote?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}`);
    }
    getWorkOrderQuoteList(payload) {
        return this.http.post(`${this.configurations.baseUrl}/api/workorder/woquotelist`, payload);
    }
    getWorkOrderQuoteData(workOrderQuoteId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/woquoteview?workOrderQuoteId=${workOrderQuoteId}`);
    }
    getSavedQuoteDetails(wfwoid) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/buildmethoddetails?workflowWorkorderId=${wfwoid}`);
    }
    getPartDetails(itemMasterId, conditionId) {
        return this.http.get(`${this.configurations.baseUrl}/api/common/partpurchasesaledetails?itemMasterId=${itemMasterId}&condition=${conditionId}`);
    }
    getPartConditions(itemMasterId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/common/partconditions?itemMasterId=${itemMasterId}`);
    }
    getWOTaskQuote(workOrderPartNoId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/wotasklevelcharges?workOrderPartNoId=${workOrderPartNoId}`);
    }
    getQuoteSettings(masterCompanyId, woTypeId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workorderquotesettings?masterCompanyId=${masterCompanyId}&workOrderTypeId=${woTypeId}`);
    }
    getInternalApproversList(approvalTaskId, moduleAmount){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/approvalRule/approverslist?approvalTaskId=${approvalTaskId}&moduleAmount=${moduleAmount}`);
    }
    getWOQuoteApprovalList(workOrderQuoteId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/woquoteapprovallist?workOrderQuoteId=${workOrderQuoteId}`);
    }

    getWOQuoteAnalysisList(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/summarisedauotationanalysis?workOrderId=${workOrderId}`);
    }

    sentForInternalApproval(data){
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/workorderquoteapproval`, JSON.stringify(data), this.getRequestHeaders());
    }

    submitForApproval(data){
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createworkorderapproval`, JSON.stringify(data), this.getRequestHeaders());
    }

    getTotals(workOrderQuoteId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/woquotationtotalvalues?workOrderQuoteId=${workOrderQuoteId}`);
    }
}
