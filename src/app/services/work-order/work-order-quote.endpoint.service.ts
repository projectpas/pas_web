import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { masterCompanyId } from 'src/app/common-masterData/mastercompany-details';


@Injectable()
export class QuoteEndpointService extends EndpointFactory {
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    } 

    getQuoteIdByWfandWorkOrderId(wfwoId, workOrderId,masterCompanyId) {
        // &masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/getworkorderquote?wfwoId=${wfwoId}&workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getQuoteIdByWfandWorkOrderId(wfwoId, workOrderId,masterCompanyId));
          });
    }
    getQuoteExclusionList(workOrderQuoteId, buildMethodId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/quoteexclusions?workOrderQuoteDetailsId=${workOrderQuoteId}&buildMethodId=${buildMethodId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getQuoteExclusionList(workOrderQuoteId, buildMethodId));
          });
    }
    getQuoteMaterialList(workOrderQuoteId, buildMethodId,masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/quotematerials?workOrderQuoteDetailsId=${workOrderQuoteId}&buildMethodId=${buildMethodId}&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getQuoteMaterialList(workOrderQuoteId, buildMethodId,masterCompanyId));
          });
    }
    getQuoteMaterialListForBilling(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/materialbillinglist?workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getQuoteMaterialListForBilling(workOrderId));
          });
    }
    getQuoteFreightsList(workOrderQuoteId, buildMethodId,masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/quotefreights?workOrderQuoteDetailsId=${workOrderQuoteId}&buildMethodId=${buildMethodId}&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getQuoteFreightsList(workOrderQuoteId, buildMethodId,masterCompanyId));
          });
    }
    getQuoteFreightsListBilling(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/billingfreightchrages?workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getQuoteFreightsListBilling(workOrderId));
          });
    }
    getQuoteChargesList(workOrderQuoteId, buildMethodId,masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/quotecharges?workOrderQuoteDetailsId=${workOrderQuoteId}&buildMethodId=${buildMethodId}&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getQuoteChargesList(workOrderQuoteId, buildMethodId,masterCompanyId));
          });
    }
    getQuoteChargesListBilling(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/billingcharges?workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getQuoteChargesListBilling(workOrderId));
          });
    }
    getQuoteLaborList(workOrderQuoteId, buildMethodId,masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/quotelabor?workOrderQuoteDetailsId=${workOrderQuoteId}&buildMethodId=${buildMethodId}&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getQuoteLaborList(workOrderQuoteId, buildMethodId,masterCompanyId));
          });
    }
    getQuoteLaborListBilling(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/labourbillinglist?workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getQuoteLaborListBilling(workOrderId));
          });
    }
    getWorkOrderQuoteDetail(workOrderId, workFlowWorkOrderId,masterCompanyId?) {
        // &masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkorderquote?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderQuoteDetail(workOrderId, workFlowWorkOrderId,masterCompanyId));
          });
    }
    getWorkOrderQuoteList(payload) {
        return this.http.post(`${this.configurations.baseUrl}/api/workorder/woquotelist`, payload).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderQuoteList(payload));
          });
    }
    getWorkOrderQuoteData(workOrderQuoteId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/woquoteview?workOrderQuoteId=${workOrderQuoteId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderQuoteData(workOrderQuoteId));
          });
    }
    getSavedQuoteDetails(wfwoid,masterCompanyId?) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/buildmethoddetails?workflowWorkorderId=${wfwoid}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getSavedQuoteDetails(wfwoid,masterCompanyId));
          });
    }
    getPartDetails(itemMasterId, conditionId,masterCompanyId) {
        return this.http.get(`${this.configurations.baseUrl}/api/common/partpurchasesaledetails?itemMasterId=${itemMasterId}&condition=${conditionId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getPartDetails(itemMasterId, conditionId,masterCompanyId));
          });
    }
    getPartConditions(itemMasterId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/common/partconditions?itemMasterId=${itemMasterId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getPartConditions(itemMasterId));
          });
    }
    getWOTaskQuote(workOrderPartNoId,masterCompanyId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/wotasklevelcharges?workOrderPartNoId=${workOrderPartNoId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWOTaskQuote(workOrderPartNoId,masterCompanyId));
          });
    }
    getQuoteSettings(masterCompanyId, woTypeId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workorderquotesettings?masterCompanyId=${masterCompanyId}&workOrderTypeId=${woTypeId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getQuoteSettings(masterCompanyId, woTypeId));
          });
    }
    getInternalApproversList(approvalTaskId, moduleAmount){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/approvalRule/approverslist?approvalTaskId=${approvalTaskId}&moduleAmount=${moduleAmount}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getInternalApproversList(approvalTaskId, moduleAmount));
          });
    }
    getWOQuoteApprovalList(workOrderQuoteId,masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/woquoteapprovallist?workOrderQuoteId=${workOrderQuoteId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWOQuoteApprovalList(workOrderQuoteId,masterCompanyId));
          });
    }

    getWOQuoteAnalysisList(workOrderId,masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/summarisedauotationanalysis?workOrderId=${workOrderId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWOQuoteAnalysisList(workOrderId,masterCompanyId));
          });
    }

    sentForInternalApproval(data){
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/workorderquoteapproval`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.sentForInternalApproval(data));
          });
    }

    submitForApproval(data){
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createworkorderapproval`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.submitForApproval(data));
          });
    }

    getTotals(workOrderQuoteId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/woquotationtotalvalues?workOrderQuoteId=${workOrderQuoteId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getTotals(workOrderQuoteId));
          });;
    }

    getWOQSettingMasterData(currentUserMasterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/getWOQSetting?masterCompanyId=${currentUserMasterCompanyId}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getWOQSettingMasterData(currentUserMasterCompanyId));
            });
    }
}
