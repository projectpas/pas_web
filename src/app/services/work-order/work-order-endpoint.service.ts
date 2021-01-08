// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { WorkOrder } from '../../models/work-order.model';
import {catchError} from 'rxjs/operators';
@Injectable()
export class WorkOrderEndpointService extends EndpointFactory {

    private readonly getAllURL: string = "/api/WorkOrder/getAll";
    private readonly getByIdURL: string = "/api/WorkOrder/getWorkOrderDataByID";
    private readonly addURL: string = "/api/WorkOrder/createworkorder";
    private readonly updateURL: string = "/api/WorkOrder/updateWO";
    private readonly removeByIdURL: string = "/api/WorkOrder/remove";
    private readonly getAssetAuditById: string = "/api/WorkOrder/audits";
    private readonly getAllWorkOrderTypesURL: string = "/api/WorkOrder/workOrderTypes";
    private readonly getAllWorkOrderStatusURL: string = "/api/WorkOrder/workOrderStatus";
    private readonly getAllWorkScopesURL: string = "/api/WorkOrder/getAllworkScopes";
    private readonly getAllWorkOrderStagesURL: string = "/api/WorkOrder/getStages";
    private readonly createQuote: string = "/api/workOrder/createworkorderquote"

    private readonly addLabourURL: string = "/api/WorkOrder/WorkOrderLabourPost";


    get getAll() { return this.configurations.baseUrl + this.getAllURL; }
    get getById() { return this.configurations.baseUrl + this.getByIdURL; }
    get add() { return this.configurations.baseUrl + this.addURL; }
    get update() { return this.configurations.baseUrl + this.updateURL; }
    get removeById() { return this.configurations.baseUrl + this.removeByIdURL; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getAllWorkOrders<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllWorkOrders());
            }));
    }

    // getWorkOrderById<T>(workOrderId: number): Observable<T> {
    //     let endpointUrl = `${this.getById}/${workOrderId}`;

    //     return this.http.get<T>(endpointUrl, this.getRequestHeaders())
    //         .catch(error => {
    //             return this.handleError(error, () => this.getWorkOrderById(workOrderId));
    //         });
    // }

    createNewWorkOrder<T>(workOrder: WorkOrder): Observable<T> {


        return this.http.post<T>(`${this.configurations.baseUrl}/api/workOrder/createworkorder`, JSON.stringify(workOrder), this.getRequestHeaders())

    }




    updateNewWorkOrder<T>(workOrder: WorkOrder): Observable<T> {
        return this.http.post<T>(`${this.configurations.baseUrl}/api/workOrder/updateworkorder`, JSON.stringify(workOrder), this.getRequestHeaders())
    }

    removeWorkOrderById<T>(workOrderId: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${workOrderId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.removeWorkOrderById(workOrderId));
            }));
    }

    getAllWorkOrderTypes<T>(): Observable<T> {
        let endPointUrl = this.getAllWorkOrderTypesURL;

        return this.http.get<any>(endPointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllWorkOrderTypes());
            }));
    }

    getAllWorkOrderStatus<T>(): Observable<T> {
        let endPointUrl = this.getAllWorkOrderStatusURL;

        return this.http.get<any>(endPointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllWorkOrderStatus());
            }));
    }

    getAllWorkScopes<T>(): Observable<T> {
        let endPointUrl = this.getAllWorkScopesURL;
        return this.http.get<any>(endPointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllWorkScopes());
            }));
    }

    getAllWorkOrderStages<T>(): Observable<T> {
        let endPointURL = this.getAllWorkOrderStagesURL;
        return this.http.get<any>(endPointURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllWorkOrderStages());
            }));
    }

    getAssetStatusAuditById<T>(workOrderId: number): Observable<T> {
        let endpointUrl = `${this.getAssetAuditById}/${workOrderId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAssetStatusAuditById(workOrderId));
            }));
    }
    postLabourEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this.addLabourURL, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.postLabourEndpoint(userObject));
            }));
    }

    getWorkOrderStageAndStatus() {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderstageandstatus`, this.getRequestHeaders())
    }


    getWorkFlowByPNandScope(itemMasterId, workScopeId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workflownos?partId=${itemMasterId}&workScopeId=${workScopeId}`, this.getRequestHeaders())
    }

    getNTEandSTDByItemMasterId(itemMasterId, workScopeName) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/ntestdvalues?itemMasterId=${itemMasterId}&workScope=${workScopeName}`, this.getRequestHeaders())
    }

    // get Part Number Bases on Repair Order and Purchase Orders
    getMultipleParts() {
        return this.http.get(`${this.configurations.baseUrl}/api/workOrder/worstocklinepartdetails`, this.getRequestHeaders())
    }
    
    getRevisedPartNumbers(itemMasterId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workOrder/revisedparts?itemMasterId=${itemMasterId}&mappingType=${1}`, this.getRequestHeaders())
    }

    
    getWorkOrderDatesFoRTat(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/woquotationandshippeddates?workOrderId=${workOrderId}`, this.getRequestHeaders())
    }
    getStockLineByItemMasterId(itemMasterId, conditionId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/stocklinedetailsbypartno?itemMasterId=${itemMasterId}&conditionId=${conditionId}`, this.getRequestHeaders())
    }

    getPartPublicationByItemMaster(itemMasterId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/partpublications?itemMasterId=${itemMasterId}`, this.getRequestHeaders())
    }

    getSerialNoByStockLineId(stockLineId, conditionId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/partserialno?stockLineId=${stockLineId}&conditionId=${conditionId}`, this.getRequestHeaders())
    }

    getConditionByItemMasterId(itemMasterId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/conditiondetailsbypartno?itemMasterId=${itemMasterId}`, this.getRequestHeaders())
    }

    getWorkOrderList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/workorderlist`, JSON.stringify(data), this.getRequestHeaders())
    }
    getWorkOrderGlobalSearch(value, pageIndex, pageSize) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/woglobalsearch?filterText=${value}&pageNumber=${pageIndex}&pageSize=${pageSize}`)
    }


    updateWorkOrderStatus(data, login) {
        return this.http.get(`${this.configurations.baseUrl}/api/workOrder/updateworkorderstatus?workOrderId=${data.workOrderId}&status=${data.isActive}&updatedBy=${login}`, this.getRequestHeaders())
    }
    deleteWorkOrder(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workOrder/deleteworkorder?workOrderId=${workOrderId}`, this.getRequestHeaders())
    }

    getWorkOrderPartListByWorkOrderId(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderpartlist?workOrderId=${workOrderId}`, this.getRequestHeaders());
    }
    createWorkFlowWorkOrder(object) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/updateworkorderworkFlow`, JSON.stringify(object), this.getRequestHeaders())
    }
    getWorkOrderWorkFlowNumbers(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderworkflownos?workOrderId=${workOrderId}`, this.getRequestHeaders())
    }
    getbillingCostDataForWoOnly(workOrderWorkflowId,managementStructureId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/worbillingcostdetails?workOrderWorkflowId=${workOrderWorkflowId}&managementStructureId=${managementStructureId}`, this.getRequestHeaders())
    }

    getWorkOrderAssetList(workFlowWorkOrderId, workOrderId,subWOPartNoId,isSubWorkOrder) {
        if(isSubWorkOrder==true){
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subworkorderassetlist?subWOPartNoId=${subWOPartNoId}`, this.getRequestHeaders())
        }else{
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderassetlist?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}`, this.getRequestHeaders())
        }
    }

    createWorkOrderLabor(data,isSubWorkOrder) {
        if(isSubWorkOrder==true){
            return this.http.post(`${this.configurations.baseUrl}/api/workOrder/createsubworkorderlabor`, JSON.stringify(data), this.getRequestHeaders())
        }else{

            return this.http.post(`${this.configurations.baseUrl}/api/workOrder/createworkorderlabor`, JSON.stringify(data), this.getRequestHeaders())
        }
    }
    createWorkOrderMaterialList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createworkordermaterials`, JSON.stringify(data), this.getRequestHeaders())
    }

    updateWorkOrderMaterialList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/updateworkordermaterials`, JSON.stringify(data), this.getRequestHeaders())
    }
    deleteWorkOrderMaterialListById(workOrderMaterialId, updatedBy) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/deleteworkordermaterial?workOrderMaterialsId=${workOrderMaterialId}&updatedBy=${updatedBy}`, this.getRequestHeaders())

    }



    createWorkOrderEquipmentList(data,isSubWorkOrder) {
        if(isSubWorkOrder==true){
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createsubworkorderasset`, JSON.stringify(data), this.getRequestHeaders())
        }else{
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createworkorderassets`, JSON.stringify(data), this.getRequestHeaders())
        }
        
    }

    updateWorkOrderEquipmentList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/updateworkorderassets`, JSON.stringify(data), this.getRequestHeaders())

    }

    createWorkOrderChargesList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createworkordercharges`, JSON.stringify(data), this.getRequestHeaders())
    }


    updateWorkOrderChargesList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/updateworkordercharges`, JSON.stringify(data), this.getRequestHeaders())
    }



    createWorkOrderExclusionList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createworkorderexclusions`, JSON.stringify(data), this.getRequestHeaders());
    }

    updateWorkOrderExclusionList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/updateworkorderexclusions`, JSON.stringify(data), this.getRequestHeaders());
    }

    createWorkOrderFreightList(data,isSubWorkOrder) {
        if(isSubWorkOrder==true){
            return this.http.post(`${this.configurations.baseUrl}/api/workorder/createsubworkorderfreight`, JSON.stringify(data), this.getRequestHeaders())
        }else{
        return this.http.post(`${this.configurations.baseUrl}/api/workOrder/createworkorderfreight`, JSON.stringify(data), this.getRequestHeaders())
    }
    }
    updateWorkOrderFreightList(data) {
        return this.http.post(`${this.configurations.baseUrl}/api/workOrder/updateworkorderfreight`, JSON.stringify(data), this.getRequestHeaders())

    }
    deleteWorkOrderFreightList(workOrderFreightId, updatedBy,isSubWorkOrder) {
        if(isSubWorkOrder==true){
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/deletesubworkorderfreight?subWorkOrderFreightId=${workOrderFreightId}&updatedBy=${updatedBy}`, this.getRequestHeaders());
        }else{
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/deleteworkorderfreight?workOrderFreightId=${workOrderFreightId}&updatedBy=${updatedBy}`, this.getRequestHeaders());
        }

    }


    getTasks() {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/Task/Get`, this.getRequestHeaders())
    } 

    getWorkOrderMaterialList(workFlowWorkOrderId, workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workordermateriallist?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}`)
    }
    getSubWorkOrderMaterialList(subWOPartNoId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subworkordermateriallist?subWOPartNoId=${subWOPartNoId}`)
    }
    deleteWorkOrderMaterialList(workOrderMaterialsId, updatedBy) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/deleteworkordermaterial?workOrderMaterialsId=${workOrderMaterialsId}&updatedBy=${updatedBy}`, this.getRequestHeaders())

    }
    getWorkOrderRolMaterialList(workOrderMaterialsId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/rollupmateriallist?workOrderMaterialId=${workOrderMaterialsId}`, this.getRequestHeaders())
    }
    getWorkOrderPublicationList(workFlowWorkOrderId, workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkorderpublications?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}`, this.getRequestHeaders())
    }

    getWorkOrderChargesList(workFlowWorkOrderId, workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkflowworkorderchargeslist?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}`, this.getRequestHeaders())
    }

    deleteWorkOrderChargesByChargesId(workOrderChargeId, updatedBy,isSubWorkOrder) {
        if(isSubWorkOrder==true){
            return this.http.get(`${this.configurations.baseUrl}/api/workorder/deletesubworkordercharge?subWorkOrderChargesId=${workOrderChargeId}&updatedBy=${updatedBy}`, this.getRequestHeaders())
        }else{

            return this.http.get(`${this.configurations.baseUrl}/api/workorder/deleteworkordercharge?workOrderChargeId=${workOrderChargeId}&updatedBy=${updatedBy}`, this.getRequestHeaders())
        }

    }

    getWorkOrderExclusionsList(workFlowWorkOrderId, workOrderId) {

        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkflowworkorderexclusionslist?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}`, this.getRequestHeaders())

    }

    deleteWorkOrderExclusionByExclusionId(workOrderExclusionsId, updatedBy) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/deleteworkorderexclusions?workOrderExclusionsId=${workOrderExclusionsId}&updatedBy=${updatedBy}`, this.getRequestHeaders())

    }

    getWorkOrderFrieghtsList(workFlowWorkOrderId, workOrderId,isSubWorkOrder,subWOPartNoId) {
        if(isSubWorkOrder==true){
            //handle  workFlowWorkOrderId also
            return this.http.get(`${this.configurations.baseUrl}/api/workorder/subWorkorderfreightlist?subWOPartNoId=${subWOPartNoId}`, this.getRequestHeaders())
        }else{
            return this.http.get(`${this.configurations.baseUrl}/api/workorder/workorderfreightlist?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}`, this.getRequestHeaders())
        }
    }

    getWorkOrderLaborList(workFlowWorkOrderId, workOrderId,isSubWorkOrder,subWOPartNoId) {
        
        if(isSubWorkOrder==true){
            //handle  workFlowWorkOrderId also
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/subWorkorderlabourlist?subWOPartNoId=${subWOPartNoId}`, this.getRequestHeaders())
        }else{
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/getworkflowworkorderlabourlist?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}`, this.getRequestHeaders())
        }

    }

    getWorkOrderDirectionList(workFlowWorkOrderId, workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/workorderdirections?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}`, this.getRequestHeaders())


    }


    getWorkOrderWorkFlowByWorkFlowWorkOrderId(workFlowWorkOrderId) {

        return this.http.get(`${this.configurations.baseUrl}/api/workorder/workorderworkflowview?workFlowWorkOrderId=${workFlowWorkOrderId}`, this.getRequestHeaders())

    }


 

    getWorkOrderById(workOrderId, receivingCustomerId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderbyid?workOrderId=${workOrderId}&receivingCustomerId=${receivingCustomerId}`, this.getRequestHeaders())
    }

    viewWorkOrderHeader(workOrderId) { 
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderheaderview?workOrderId=${workOrderId}`, this.getRequestHeaders())
    }
    viewWorkOrderPartNumber(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderpartsview?workOrderId=${workOrderId}`, this.getRequestHeaders())
    }
    // getSitesbymanagementstructrue(managementStructureId) {
    //     return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/sitesbymanagementstructrue?managementStructureId=${managementStructureId}`, this.getRequestHeaders())
    // }
    getReservedPartsByWorkFlowWOId(WorkFlowWorkOrderId,workOrderId,statusId,updatedBy,type) {

        let urlType;
        if(type==false){
            if (statusId == 1) {
                urlType = 'getreservedparts'
            } else if (statusId == 2) {
                urlType = 'getissuedparts'
            } else if (statusId == 3) {
                urlType = 'getreservedissuesparts'
            } else if (statusId == 4) {
                urlType = 'getunissuedParts'
            } else if (statusId == 5) {
                urlType = 'getunreservedparts'
            }
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/${urlType}?workFlowWorkOrderId=${WorkFlowWorkOrderId}&workOrderId=${workOrderId}&statusId=${statusId}&updatedBy=${updatedBy}`, this.getRequestHeaders())

        }else{
        if (statusId == 1) {
            urlType = 'subworeservedparts'
        } else if (statusId == 2) {
            urlType = 'subwoissuedparts'
        } else if (statusId == 3) {
            urlType = 'subworeservedissuedparts'
        } else if (statusId == 4) {
            urlType = 'subwounissuedparts'
        } else if (statusId == 5) {
            urlType = 'subwounreservedparts'
        }
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/${urlType}?subWOPartNoId=${WorkFlowWorkOrderId}&updatedBy=${updatedBy}`, this.getRequestHeaders())
    }
        

        // if (statusId == 1)
        //     return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/getreservedparts?workFlowWorkOrderId=${WorkFlowWorkOrderId}&statusId=${statusId}`)
        // else if (statusId == 2)
        //     return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/getissuedparts?workFlowWorkOrderId=${WorkFlowWorkOrderId}&statusId=${statusId}`)
        // else if (statusId == 3)
        //     return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/getreservedissuesparts?workFlowWorkOrderId=${WorkFlowWorkOrderId}&statusId=${statusId}`)
        // else if (statusId == 4)
        //     return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/getunissuedParts?workFlowWorkOrderId=${WorkFlowWorkOrderId}&statusId=${statusId}`)
        // else if (statusId == 5)
        //     return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/getunreservedparts?workFlowWorkOrderId=${WorkFlowWorkOrderId}&statusId=${statusId}`)
        // else
        //     return null;
    }

    saveReservedPartorIssue(alternatePart) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/savereserveissuesparts`, JSON.stringify(alternatePart), this.getRequestHeaders());
    }

    assetsCheckInByWorkOrderAssetsId(assetcheckin) {
        //return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/saveassetcheckedin?WorkOrderAssetId=${workOrderAssetId}&checkedInById=${employeeId}&checkedInDate=${checkedInDate}&updatedBy=${updatedBy}`)  
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/saveassetcheckedin`, JSON.stringify(assetcheckin), this.getRequestHeaders());
    }

    assetsCheckOutByWorkOrderAssetsId(assetcheckout) {
        // return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/saveassetcheckedout?WorkOrderAssetId=${workOrderAssetId}&checkedInById=${employeeId}&checkedInDate=${checkedInDate}&updatedBy=${updatedBy}`)  
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/saveassetcheckedout`, JSON.stringify(assetcheckout), this.getRequestHeaders());
    }

    assetsHistoryByWorkOrderAssetId(workOrderAssetId) {
        // return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/woassethistory?workOrderAssetId=${workOrderAssetId}`, this.getRequestHeaders())
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/woassetinventoryhistory?workOrderAssetId=${workOrderAssetId}`, this.getRequestHeaders())
    }
    deleteWorkOrderAssetByAssetId(workOrderAssetId, updatedBy,isSubWorkOrder) {
        if(isSubWorkOrder==true){
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/deletesubworkorderasset?workOrderAssetId=${workOrderAssetId}&updatedBy=${updatedBy}`, this.getRequestHeaders())
        }else{
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/deleteworkorderasset?workOrderAssetId=${workOrderAssetId}&updatedBy=${updatedBy}`, this.getRequestHeaders())
        }
    }

    createOrUpdateQuotation(data) {
        return this.http.post(`${this.configurations.baseUrl}/api/workOrder/${(data.workOrderQuoteId == undefined || data.workOrderQuoteId == 0) ? 'createworkorderquote' : 'updateworkorderquote'}`, JSON.stringify(data), this.getRequestHeaders())
    }

    getSubWorkOrderListByWorkOrderId(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/WorkOrder/subworkorderlist?workOrderId=${workOrderId}`, this.getRequestHeaders())
    }

    // getSubWorkOrderView(subWorkOrderId) {
    //     return this.http.get<any>(`${this.configurations.baseUrl}/api/WorkOrder/subworkorderdetails?subWorkOrderId=${subWorkOrderId}`, this.getRequestHeaders())
    // }

    getSubWorkOrderHeaderByWorkOrderId(workOrderId, workOrderPartNumberId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subworkorderheaderdetails?workOrderId=${workOrderId}&workOrderPartNumberId=${workOrderPartNumberId}`)
    }

    getSubWorkOrderDataBySubWorkOrderId(subWorkOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subworkorderdetails?subWorkOrderId=${subWorkOrderId}`, this.getRequestHeaders())
    }

    createSubWorkOrderHeaderByWorkOrderId(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createsubworkorder`, JSON.stringify(data), this.getRequestHeaders())
    }

    updateSubWorkOrderHeaderBySubWorkOrderId(data) {
        return this.http.put<any>(`${this.configurations.baseUrl}/api/workOrder/updatesubworkorder`, JSON.stringify(data), this.getRequestHeaders());
    }

    createBillingByWorkOrderId(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createbillinginvoicing `, JSON.stringify(data), this.getRequestHeaders())
    }

    updateBillingByWorkOrderId(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/updatebillinginvoicing`, JSON.stringify(data), this.getRequestHeaders())
    }
    getExistingWOROList() {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderrolist`, this.getRequestHeaders())
    }
    createNewWORO(workOrderPartNoId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/wopartdetailsbyid?workOrderPartNoId=${workOrderPartNoId} `, this.getRequestHeaders())
    }

    getBillingEditData(workOrderId, workOrderPartNoId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/billinginvoicingdetails?workOrderId=${workOrderId}&workOrderPartNoId=${workOrderPartNoId}`, this.getRequestHeaders())
    }



    getPartsDetail(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/workorderpartsview?workOrderId=${workOrderId}`)
    }

    getBuildDetailsFromWorkFlow(partId, workScopeId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/workflownos?partId=${partId}&workScopeId=${workScopeId}`)
    }

    getBuildDetailsFromHistoricalWorkOrder(partId, workScopeId, payLoad) {
        return this.http.post(`${this.configurations.baseUrl}/api/workorder/historicalworkorders`, payLoad)
    }

    getBuildDetailsFromHistoricalWorkOrderQuote(partId, workScopeId, payLoad) {
        return this.http.post(`${this.configurations.baseUrl}/api/workorder/historicalworkorderquotes`, payLoad)
    }

    getWorkFlowDetails(workFlowId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workflow/getworkflow/${workFlowId}`)
    }

    getWorkOrderMaterialListForQuote(wfwoId) { 
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/workordermateriallist?wfwoId=${wfwoId}`);
    }
    getWorkOrderLaborListForQuote(wfwoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkflowworkorderlabourlist?wfwoId=${wfwoId}`);
    }
    getWorkOrderChargesListForQuote(wfwoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkflowworkorderchargeslist?wfwoId=${wfwoId}`);
    }
    getWorkOrderExclutionsListForQuote(wfwoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkflowworkorderexclusionslist?wfwoId=${wfwoId}`);
    }
    getWorkOrderFreightListForQuote(wfwoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/workorderfreightlist?wfwoId=${wfwoId}`);
    }

    saveMaterialListQuote(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createquotematerials`, JSON.stringify(data), this.getRequestHeaders());
    }

    saveFreightsListQuote(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createquotefreight`, JSON.stringify(data), this.getRequestHeaders());
    }

    saveLaborListQuote(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createquotelabor`, JSON.stringify(data), this.getRequestHeaders());
    }

    saveChargesQuote(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createquotecharges`, JSON.stringify(data), this.getRequestHeaders());
    }

    saveExclusionsQuote(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createquoteexclusions`, JSON.stringify(data), this.getRequestHeaders());
    }

    getPartNosByCustomer(customerId, workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderpartdetails?customerId=${customerId}&workOrderId=${workOrderId}`, this.getRequestHeaders())
    }

    getReceivingCustomerreference(customerId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/receivingcustomerWork/receivingcustomerreference?customerId=${customerId}`, this.getRequestHeaders())
    }
    getDocumentsList(wfWoId, workOrderId,isSubWorkOrder,subWOPartNoId) {
        if(isSubWorkOrder==true){
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/subworkorderdocumentslist?subWOPartNoId=${subWOPartNoId}`, this.getRequestHeaders());
        }else{
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workorderdocumentslist?wfwoId=${wfWoId}&workOrderId=${workOrderId}`, this.getRequestHeaders());
        }
    }

    createDocuments(data,isSubWorkOrder) {
        if(isSubWorkOrder==true){
            const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
            return this.http.post(`${this.configurations.baseUrl}/api/workorder/createsubworkorderdocuments`, data);

        }else{
            const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
            return this.http.post(`${this.configurations.baseUrl}/api/workorder/createworkorderdocuments`, data);

        }
    }

    getDocumentList(wfwoid, workOrderId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workorderdocumentslist?wfwoId=${wfwoid}&workOrderId=${workOrderId}`)
    }
    deleteWorkOrderDocuments(attachmentId, updatedBy) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/deleteworkorderdocuments?attachmentId=${attachmentId}&updatedBy=${updatedBy}`, this.getRequestHeaders())
    }
    updateWorkOrderDocumentStatus(workOrderDocumentsId, status, updatedBy) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workorderdocumentstatus?workOrderDocumentsId=${workOrderDocumentsId}&status=${status}&updatedBy=${updatedBy} `)
    }
    //work order tear down
    createworkOrderTearDownData(data,isSubWorkOrder) {
        if(isSubWorkOrder==true){
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createsubwoteardown `, JSON.stringify(data), this.getRequestHeaders())
        }else{
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createteardown `, JSON.stringify(data), this.getRequestHeaders())
        }
    }
    getworkOrderTearDownData(wfWoId,isSubWorkOrder) {
        if(isSubWorkOrder==true){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/getsubworkorderteardown?subWOPartNoId=${wfWoId}`, this.getRequestHeaders());
    }else{
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/getwoteardown?wowfId=${wfWoId}`, this.getRequestHeaders());
    }
}
    getworkOrderTearDownViewData(wfWoId,isSubWorkOrder){
        if(isSubWorkOrder==true){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/subworkorderteardownview?subWOPartNoId=${wfWoId}`, this.getRequestHeaders());
       }else{
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/woteardownview?wowfId=${wfWoId}`, this.getRequestHeaders());
    }
}
    getteardownreasonbyid(reasonId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/teardownreason/getteardownreasonbyid/${reasonId}`, this.getRequestHeaders());
    }
    workOrderLabourAnalysisData(workOrderId, workOrderPartNoId,isSubWorkOrder){
        if(isSubWorkOrder){
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subwolabouranalysis?subWOPartNoId=${workOrderPartNoId}`);
        }else{
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/labouranalysis?workOrderId=${workOrderId}&workOrderPartNoId=${workOrderPartNoId}`);
        }
    } 
    workOrderAnalysisData(workOrderId, workOrderPartNoId,isSubWorkOrder){
        if(isSubWorkOrder){
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subworkorderanalysis?subWOPartNoId=${workOrderPartNoId}`);
        }else{

            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderanalysis?workOrderId=${workOrderId}&workOrderPartNoId=${workOrderPartNoId}`);
        }
    }        
    // http://localhost:5050/api/teardownreason/getteardownreasonbyid/2
    worOrderTearDownReasonListById(tearDownTypeId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/getteardownreasons?teardownTypeId=${tearDownTypeId}`, this.getRequestHeaders());
    }
    getworblist() {
        return this.http.get(`${this.configurations.baseUrl}/api/workOrder/getworblist`, this.getRequestHeaders())
    }

    getLaborOHSettingsByManagementstrucId(id){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/LaborOHSettings/GetLaborOHSettingsByManagementstrucId/${id}`, this.getRequestHeaders());
    }

    saveOrUpdateWOQuoteSettings(data){
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createworkorderquotesettings`, JSON.stringify(data), this.getRequestHeaders());
    }

    getWOQuoteSettingList(){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/getworkorderQuotesettingslist`, this.getRequestHeaders());    }

    getWOQuoteSettingHistory(id){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/woquotesettingshistory/${id}`, this.getRequestHeaders());   
     }
        reserveAltPartData(data){
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/holdaltpartsstocklineqty`, JSON.stringify(data), this.getRequestHeaders());
        }
        reserveEqlPartData(data){
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/holdequpartsstocklineqty`, JSON.stringify(data), this.getRequestHeaders());
        }
        reservereleasestoclineqty(data){
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/releasestoclineqty`, JSON.stringify(data), this.getRequestHeaders());
        }
        getSiteByCustomerId(customerId){
            return this.http.get<any>(`${this.configurations.baseUrl}/api/Customer/cusshippingGet/${customerId}`, this.getRequestHeaders());    
        }

        saveWorkOrderShipping(data){
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createworkordershipping`, JSON.stringify(data), this.getRequestHeaders());
        }

        getShippingForWorkOrderPart(workOrderPartNoId){
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workordershippingdetails?workOrderPartNoId=${workOrderPartNoId}`, this.getRequestHeaders());    
        }

        getTearDownTypesFromWOSettings(masterCompanyId, woTypeId){
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/teardowntypes?masterCompanyId=${masterCompanyId}&workOrderTypeId=${woTypeId}`); 
        }

    // delete master part number in workorder
    deleteMpnByWorkOrderId(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/deletempn`,data, this.getRequestHeaders())
    }
    //sub Work Order Mpn grid
    getSubWorkOrderDataForMpnGrid(workOrderMaterialsId,workOrderPartNoId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/subworkordermpndetails?workOrderMaterialsId=${workOrderMaterialsId}&workOrderPartNoId=${workOrderPartNoId}`); 
    }
    //create Mpn grid sub wo
    createSubWorkOrderGrid(subWorkOrder) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createsubworkorderpartnumbers`,subWorkOrder, this.getRequestHeaders())
    }
    // subwork order mpn grid list bind in edit mode
    getSubWorOrderMpnsById(subWorkOrderId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/getsubworkordermpnssbyid?subWorkOrderId=${subWorkOrderId}`, this.getRequestHeaders()); 
    }
    //bind mpn dropdowns for multiple sub wo 
    getMpnDropdownlistSubWo(subWorkOrderId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/bindsubworkordermpns?subWorkOrderId=${subWorkOrderId}`, this.getRequestHeaders()); 
    }
    //create sub workorder materials
    createSubWorkOrderMaterialList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createsubworkordermaterials`, JSON.stringify(data), this.getRequestHeaders())
    }
    //sub work order material roleups list api
    getSubWoMaterialRoleUps(subWorkOrderMaterialId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/subworollupmateriallist?subWorkOrderMaterialId=${subWorkOrderMaterialId}`, this.getRequestHeaders()); 
    }
    //delete sub wo materialist
    deleteSubWorkOrderMaterialList(subWorkOrderMaterialId, updatedBy) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/deletesubworkordermaterials?subWorkOrderMaterialId=${subWorkOrderMaterialId}&updatedBy=${updatedBy}`, this.getRequestHeaders())
    }
    // Release sub wo reserve quantity 
    reservereleaseSubWostoclineqty(data){
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/releasesubwostocklineqty`, JSON.stringify(data), this.getRequestHeaders());
    }
// sub wo alt parts
reserveSubWoAltPartData(data){
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/holdsubwoaltpartsstocklineqty`, JSON.stringify(data), this.getRequestHeaders());
    }
    // sub wo eql parts
    reserveSubWoEqlPartData(data){
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/holdsubwoequpartsstocklineqty`, JSON.stringify(data), this.getRequestHeaders());
    }
    // save sub wo  reseve issue etc save

    saveSubWoReservedPartorIssue(alternatePart) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/savesubworeserveissuesparts`, JSON.stringify(alternatePart), this.getRequestHeaders());
    }

    //sub work order charges create and update
    createSubWorkOrderChargesList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createsubworkordercharges`, JSON.stringify(data), this.getRequestHeaders())
    }
    // Sub work order charges list
    getSubWorkOrderChargesList(subWOPartNoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/subWorkorderchargeslist?subWOPartNoId=${subWOPartNoId}`, this.getRequestHeaders())
    }

    getMaterialListMPNS(workOrderId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedmaterialdata?workOrderId=${workOrderId}`);
    }

    getLabourListMPNS(workOrderId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summariselLabourdata?workOrderId=${workOrderId}`);
    }

    getLabourAnalysisListMPNS(workOrderId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedlabouranalysis?workOrderId=${workOrderId}`)
    }

    getChargesListMPNS(workOrderId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedchargesdata?workOrderId=${workOrderId}`)
    }

    getDocumentsListMPNS(workOrderId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summariseddocumentsdata?workOrderId=${workOrderId}`)
    }

    getMemosListMPNS(workOrderId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedcommunicationmemodata?workOrderId=${workOrderId}`)
    }

    getEmailsListMPNS(workOrderId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedcommunicationemaildata?workOrderId=${workOrderId}`)
    }

    getPhonesListMPNS(workOrderId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedcommunicationphonedata?workOrderId=${workOrderId}`)
    }

    getTextsListMPNS(workOrderId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedcommunicationtextdata?workOrderId=${workOrderId}`)
    }

    getFreightsListMPNS(workOrderId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedfreightdata?workOrderId=${workOrderId}`)
    }

    getShippingListMPNS(workOrderId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedshippingdata?workOrderId=${workOrderId}`);
    }

    getShippingData(workOrderShippingId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getwoshippingdetails?workOrderShippingId=${workOrderShippingId}`)
    }

    getDocumentData(wfwoid){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getwodocumentdetails?workFlowWorkOrderId=${wfwoid}`)
    }

    getChargesDataForSummarisedView(wfwoid){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getchargedetails?workFlowWorkOrderId=${wfwoid}`);
    }
    getCommunicationMemoForSummarisedView(workOrderId, partNoId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/communicationmemodetails?workOrderId=${workOrderId}&workOrderPartNo=${partNoId}`);
    }
    getCommunicationMailForSummarisedView(workOrderId, partNoId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/communicationemaildetails?workOrderId=${workOrderId}&workOrderPartNo=${partNoId}`);
    }
    getCommunicationPhoneForSummarisedView(workOrderId, partNoId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/communicationphonedetails?workOrderId=${workOrderId}&workOrderPartNo=${partNoId}`);
    }
    getCommunicationTextForSummarisedView(workOrderId, partNoId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/communicationtextdetails?workOrderId=${workOrderId}&workOrderPartNo=${partNoId}`);
    }
    getFreightsDataForSummarisedView(wfwoid){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getfreightdetails?workFlowWorkOrderId=${wfwoid}`);
    }
    getBillingandInvoicingDataForSummarisedView(workOrderId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedbillingandinvoicingdata?workOrderId=${workOrderId}`);
    }

    getReturnedPartsToCustomer(workOrderId, workOrderPartNumberId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/returnmctoustomer?workOrderId=${workOrderId}&workOrderPartNoId=${workOrderPartNumberId}`)
    }
    getWOAnalysisMPNs(woId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedwoanalysis?workOrderId=${woId}`)
    }
    getQuoteAnalysisMPNs(woId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedauotationanalysis?workOrderId=${woId}`)
    }
    getBillingAndInvoiceMPNs(workOrderId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedbillingandinvoicingdata?workOrderId=${workOrderId}`)
    }
    getMateialListDetailsForSummarisedData(wfwoId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getmaterialdetails?workFlowWorkOrderId=${wfwoId}`);
    }
    getLabourListForDetailedView(wfwoId){
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getlabourdetails?workFlowWorkOrderId=${wfwoId}`);
    }
    getWorkOrderAssetListForDropDown(){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderassets`, this.getRequestHeaders());
    }
    checkInAseetInventoryList(workOrderAssetId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/wocheckinassetinventorylist?workOrderAssetId=${workOrderAssetId}`);
    }
    checkOutAseetInventoryList(workOrderAssetId,workOrderId,woPartNoId,assetRecordId,createdBy,masterCompanyId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/woassetinventorylist?workOrderAssetId=${workOrderAssetId}&workOrderId=${workOrderId}&woPartNoId=${woPartNoId}&assetRecordId=${assetRecordId}&createdBy=${createdBy}&masterCompanyId=${masterCompanyId}`)
    }
    releaseAssetInventoryList(AssetData){
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/releasewocheckoutinventory`, AssetData, this.getRequestHeaders());
    }
    saveCheckOutInventory(AssetData){
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/savewocheckoutinventory`, AssetData, this.getRequestHeaders());
    }
    saveCheckInInventory(AssetData){
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/savewocheckininventory`, AssetData, this.getRequestHeaders());
    }
    getWoAssetInventoryHistory(workOrderAssetId){
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/woassetinventoryhistory?workOrderAssetId=${workOrderAssetId}`);
    }
}
