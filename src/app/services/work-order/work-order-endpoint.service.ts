// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { WorkOrder } from '../../models/work-order.model';
import { WOPickTicket } from '../../models/sales/WOPickTicket';

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

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAllWorkOrders());
            });
    }

    // getWorkOrderById<T>(workOrderId: number): Observable<T> {
    //     let endpointUrl = `${this.getById}/${workOrderId}`;

    //     return this.http.get<T>(endpointUrl, this.getRequestHeaders())
    //         .catch(error => {
    //             return this.handleErrorCommon(error, () => this.getWorkOrderById(workOrderId));
    //         });
    // }

    createNewWorkOrder<T>(workOrder: WorkOrder): Observable<T> {


        return this.http.post<T>(`${this.configurations.baseUrl}/api/workOrder/createworkorder`, JSON.stringify(workOrder), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.createNewWorkOrder(workOrder));
        });

    }




    updateNewWorkOrder<T>(workOrder: WorkOrder): Observable<T> {
        return this.http.post<T>(`${this.configurations.baseUrl}/api/workOrder/updateworkorder`, JSON.stringify(workOrder), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.updateNewWorkOrder(workOrder));
        });
    }

    removeWorkOrderById<T>(workOrderId: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${workOrderId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.removeWorkOrderById(workOrderId));
            });
    }

    getAllWorkOrderTypes<T>(): Observable<T> {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workOrderTypes`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getAllWorkOrderTypes());
        });

        //     return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workOrderTypes`, this.getRequestHeaders()).catch(error => {
        //   return this.handleErrorCommon(error, () => this.getAllWorkOrderTypes());
        // let endPointUrl = this.getAllWorkOrderTypesURL;

        // return this.http.get<T>(endPointUrl, this.getRequestHeaders())
        //     .catch(error => {
        //         return this.handleErrorCommon(error, () => this.getAllWorkOrderTypes());
        //     });
    }

    getAllWorkOrderStatus<T>(): Observable<T> {
        let endPointUrl = this.getAllWorkOrderStatusURL;

        return this.http.get<T>(endPointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAllWorkOrderStatus());
            });
    }

    getAllWorkScopes<T>(): Observable<T> {
        let endPointUrl = this.getAllWorkScopesURL;
        return this.http.get<T>(`${this.configurations.baseUrl}/api/WorkOrder/getAllworkScopes`, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAllWorkScopes());
            });
    }

    getAllWorkOrderStages<T>(): Observable<T> {
        let endPointURL = this.getAllWorkOrderStagesURL;
        return this.http.get<T>(endPointURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAllWorkOrderStages());
            });
    }

    getAssetStatusAuditById<T>(workOrderId: number): Observable<T> {
        let endpointUrl = `${this.getAssetAuditById}/${workOrderId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAssetStatusAuditById(workOrderId));
            });
    }
    postLabourEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this.addLabourURL, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.postLabourEndpoint(userObject));
            });
    }

    getWorkOrderStageAndStatus(masterCompanyId?) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderstageandstatus?masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderStageAndStatus(masterCompanyId));
        });
    }


    getWorkFlowByPNandScope(itemMasterId, workScopeId, masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workflownos?partId=${itemMasterId}&workScopeId=${workScopeId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkFlowByPNandScope(itemMasterId, workScopeId, masterCompanyId));
        });
    }

    getNTEandSTDByItemMasterId(itemMasterId, workScopeId, masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/ntestdvalues?itemMasterId=${itemMasterId}&workScopeId=${workScopeId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getNTEandSTDByItemMasterId(itemMasterId, workScopeId, masterCompanyId));
        });
    }

    // get Part Number Bases on Repair Order and Purchase Orders
    getMultipleParts(masterCompanyId?) {
        return this.http.get(`${this.configurations.baseUrl}/api/workOrder/worstocklinepartdetails?masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getMultipleParts(masterCompanyId));
        });
    }

    getRevisedPartNumbers(itemMasterId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workOrder/revisedparts?itemMasterId=${itemMasterId}&mappingType=${1}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getRevisedPartNumbers(itemMasterId));
        });
    }


    getWorkOrderDatesFoRTat(workOrderId, masterCompanyId) {
        // &masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0 }
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/woquotationandshippeddates?workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderDatesFoRTat(workOrderId, masterCompanyId));
        });
    }
    getStockLineByItemMasterId(itemMasterId, conditionId, masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/stocklinedetailsbypartno?itemMasterId=${itemMasterId}&conditionId=${conditionId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getStockLineByItemMasterId(itemMasterId, conditionId, masterCompanyId));
        });
    }

    getPartPublicationByItemMaster(itemMasterId, masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/partpublications?itemMasterId=${itemMasterId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getPartPublicationByItemMaster(itemMasterId, masterCompanyId));
        });
    }

    getSerialNoByStockLineId(stockLineId, conditionId, masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/partserialno?stockLineId=${stockLineId}&conditionId=${conditionId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getSerialNoByStockLineId(stockLineId, conditionId, masterCompanyId));
        });
    }

    getConditionByItemMasterId(itemMasterId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/conditiondetailsbypartno?itemMasterId=${itemMasterId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getConditionByItemMasterId(itemMasterId));
        });
    }

    getWorkOrderList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/workorderlist`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderList(data));
        });
    }
    WorkOrderROlist(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/WorkOrderROlist`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.WorkOrderROlist(data));
        });
    }
    getWorkOrderGlobalSearch(value, pageIndex, pageSize) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/woglobalsearch?filterText=${value}&pageNumber=${pageIndex}&pageSize=${pageSize}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderGlobalSearch(value, pageIndex, pageSize));
        });
    }


    updateWorkOrderStatus(data, login) {
        return this.http.get(`${this.configurations.baseUrl}/api/workOrder/updateworkorderstatus?workOrderId=${data.workOrderId}&status=${data.isActive}&updatedBy=${login}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.updateWorkOrderStatus(data, login));
        });
    }
    deleteWorkOrder(workOrderId, login) {
        return this.http.get(`${this.configurations.baseUrl}/api/workOrder/deleteworkorder?workOrderId=${workOrderId}&updatedBy=${login}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteWorkOrder(workOrderId, login));
        });
    }

    getWorkOrderPartListByWorkOrderId(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderpartlist?workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderPartListByWorkOrderId(workOrderId));
        });;
    }
    createWorkFlowWorkOrder(object) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/updateworkorderworkFlow`, JSON.stringify(object), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.createWorkFlowWorkOrder(object));
        });
    }
    getWorkOrderWorkFlowNumbers(workOrderId, masterCompanyId?) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderworkflownos?workOrderId=${workOrderId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderWorkFlowNumbers(workOrderId, masterCompanyId));
        });
    }
    getbillingCostDataForWoOnly(workOrderWorkflowId, managementStructureId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/worbillingcostdetails?workOrderWorkflowId=${workOrderWorkflowId}&managementStructureId=${managementStructureId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getbillingCostDataForWoOnly(workOrderWorkflowId, managementStructureId));
        });
    }

    getWorkOrderAssetList(isSubWorkOrder, data) {
        if (isSubWorkOrder == true) {
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/subworkorderassetlist`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getWorkOrderAssetList(isSubWorkOrder, data));
            });

        } else {
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/workorderassetlist`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getWorkOrderAssetList(isSubWorkOrder, data));
            });
        }
    }


    createWorkOrderLabor(data, isSubWorkOrder) {
        if (isSubWorkOrder == true) {
            return this.http.post(`${this.configurations.baseUrl}/api/workOrder/createsubworkorderlabor`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.createWorkOrderLabor(data, isSubWorkOrder));
            });
        } else {

            return this.http.post(`${this.configurations.baseUrl}/api/workOrder/createworkorderlabor`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.createWorkOrderLabor(data, isSubWorkOrder));
            });
        }
    }
    createWorkOrderMaterialList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createworkordermaterials`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.createWorkOrderMaterialList(data));
        });
    }

    updateWorkOrderMaterialList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/updateworkordermaterials`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.updateWorkOrderMaterialList(data));
        });
    }
    deleteWorkOrderMaterialListById(workOrderMaterialId, updatedBy) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/deleteworkordermaterial?workOrderMaterialsId=${workOrderMaterialId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteWorkOrderMaterialListById(workOrderMaterialId, updatedBy));
        });

    }

    deleteWorkOrderMaterialStocklineById(workOrderMaterialId, stocklineId, updatedBy) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/deleteworkordermaterialStockline?workOrderMaterialsId=${workOrderMaterialId}&stocklineId=${stocklineId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteWorkOrderMaterialStocklineById(workOrderMaterialId, stocklineId, updatedBy));
        });

    }

    createWorkOrderEquipmentList(data, isSubWorkOrder) {
        if (isSubWorkOrder == true) {
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createsubworkorderasset`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.createWorkOrderEquipmentList(data, isSubWorkOrder));
            });
        } else {
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createworkorderassets`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.createWorkOrderEquipmentList(data, isSubWorkOrder));
            });
        }

    }

    updateWorkOrderEquipmentList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/updateworkorderassets`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.updateWorkOrderEquipmentList(data));
        });

    }

    createWorkOrderChargesList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createworkordercharges`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.createWorkOrderChargesList(data));
        });
    }


    updateWorkOrderChargesList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/updateworkordercharges`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.updateWorkOrderChargesList(data));
        });
    }



    createWorkOrderExclusionList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createworkorderexclusions`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.createWorkOrderExclusionList(data));
        });;
    }

    updateWorkOrderExclusionList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/updateworkorderexclusions`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.updateWorkOrderExclusionList(data));
        });;
    }

    createWorkOrderFreightList(data, isSubWorkOrder) {
        if (isSubWorkOrder == true) {
            return this.http.post(`${this.configurations.baseUrl}/api/workorder/createsubworkorderfreight`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.createWorkOrderFreightList(data, isSubWorkOrder));
            });
        } else {
            return this.http.post(`${this.configurations.baseUrl}/api/workOrder/createworkorderfreight`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.createWorkOrderFreightList(data, isSubWorkOrder));
            });
        }
    }
    updateWorkOrderFreightList(data) {
        return this.http.post(`${this.configurations.baseUrl}/api/workOrder/updateworkorderfreight`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.updateWorkOrderFreightList(data));
        });

    }
    deleteWorkOrderFreightList(workOrderFreightId, updatedBy, isSubWorkOrder) {
        if (isSubWorkOrder == true) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/deletesubworkorderfreight?subWorkOrderFreightId=${workOrderFreightId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.deleteWorkOrderFreightList(workOrderFreightId, updatedBy, isSubWorkOrder));
            });;
        } else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/deleteworkorderfreight?workOrderFreightId=${workOrderFreightId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.deleteWorkOrderFreightList(workOrderFreightId, updatedBy, isSubWorkOrder));
            });;
        }

    }


    getTasks() {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/Task/Get`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getTasks());
        });
    }

    getWorkOrderMaterialList(workFlowWorkOrderId, workOrderId, masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workordermateriallist?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}&masterCompanyId=${masterCompanyId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderMaterialList(workFlowWorkOrderId, workOrderId, masterCompanyId));
        });
    }
    getWorkOrderMaterialListNew(workFlowWorkOrderId, workOrderId, masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workordermateriallistnew?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}&masterCompanyId=${masterCompanyId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderMaterialListNew(workFlowWorkOrderId, workOrderId, masterCompanyId));
        });
    }
    getSubWorkOrderMaterialList(subWOPartNoId, masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subworkordermateriallist?subWOPartNoId=${subWOPartNoId}&masterCompanyId=${masterCompanyId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getSubWorkOrderMaterialList(subWOPartNoId, masterCompanyId));
        });
    }
    deleteWorkOrderMaterialList(workOrderMaterialsId, updatedBy) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/deleteworkordermaterial?workOrderMaterialsId=${workOrderMaterialsId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteWorkOrderMaterialList(workOrderMaterialsId, updatedBy));
        });

    }
    getWorkOrderRolMaterialList(workOrderMaterialsId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/rollupmateriallist?workOrderMaterialId=${workOrderMaterialsId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderRolMaterialList(workOrderMaterialsId));
        });
    }
    getWorkOrderPublicationList(workFlowWorkOrderId, workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkorderpublications?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderPublicationList(workFlowWorkOrderId, workOrderId));
        });
    }

    getWorkOrderChargesList(workFlowWorkOrderId, workOrderId, isDeleted?, masterCompanyId?) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkflowworkorderchargeslist?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}&isDeleted=${isDeleted}&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderChargesList(workFlowWorkOrderId, workOrderId, isDeleted, masterCompanyId));
        });
    }

    deleteWorkOrderChargesByChargesId(workOrderChargeId, updatedBy, isSubWorkOrder) {
        if (isSubWorkOrder == true) {
            return this.http.get(`${this.configurations.baseUrl}/api/workorder/deletesubworkordercharge?subWorkOrderChargesId=${workOrderChargeId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.deleteWorkOrderChargesByChargesId(workOrderChargeId, updatedBy, isSubWorkOrder));
            });
        } else {

            return this.http.get(`${this.configurations.baseUrl}/api/workorder/deleteworkordercharge?workOrderChargeId=${workOrderChargeId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.deleteWorkOrderChargesByChargesId(workOrderChargeId, updatedBy, isSubWorkOrder));
            });
        }

    }

    getWorkOrderExclusionsList(workFlowWorkOrderId, workOrderId) {

        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkflowworkorderexclusionslist?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderExclusionsList(workFlowWorkOrderId, workOrderId));
        });

    }

    deleteWorkOrderExclusionByExclusionId(workOrderExclusionsId, updatedBy) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/deleteworkorderexclusions?workOrderExclusionsId=${workOrderExclusionsId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteWorkOrderExclusionByExclusionId(workOrderExclusionsId, updatedBy));
        });

    }

    getWorkOrderFrieghtsList(workFlowWorkOrderId, workOrderId, isSubWorkOrder, subWOPartNoId, isDeleted, masterCompanyId?) {
        if (isSubWorkOrder == true) {
            //handle  workFlowWorkOrderId also
            return this.http.get(`${this.configurations.baseUrl}/api/workorder/subWorkorderfreightlist?subWOPartNoId=${subWOPartNoId}&isDeleted=${isDeleted}&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getWorkOrderFrieghtsList(workFlowWorkOrderId, workOrderId, isSubWorkOrder, subWOPartNoId, isDeleted, masterCompanyId));
            });
        } else {
            return this.http.get(`${this.configurations.baseUrl}/api/workorder/workorderfreightlist?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}&isDeleted=${isDeleted}&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getWorkOrderFrieghtsList(workFlowWorkOrderId, workOrderId, isSubWorkOrder, subWOPartNoId, isDeleted, masterCompanyId));
            });
        }
    }

    getWorkOrderLaborList(workFlowWorkOrderId, workOrderId, isSubWorkOrder, subWOPartNoId, masterCompanyId) {

        if (isSubWorkOrder == true) {
            //handle  workFlowWorkOrderId also
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/subWorkorderlabourlist?subWOPartNoId=${subWOPartNoId}&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getWorkOrderLaborList(workFlowWorkOrderId, workOrderId, isSubWorkOrder, subWOPartNoId, masterCompanyId));
            });
        } else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/getworkflowworkorderlabourlist?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getWorkOrderLaborList(workFlowWorkOrderId, workOrderId, isSubWorkOrder, subWOPartNoId, masterCompanyId));
            });
        }

    }

    getWorkOrderDirectionList(workFlowWorkOrderId, workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/workorderdirections?wfwoId=${workFlowWorkOrderId}&workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderDirectionList(workFlowWorkOrderId, workOrderId));
        });


    }


    getWorkOrderWorkFlowByWorkFlowWorkOrderId(workFlowWorkOrderId) {

        return this.http.get(`${this.configurations.baseUrl}/api/workorder/workorderworkflowview?workFlowWorkOrderId=${workFlowWorkOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderWorkFlowByWorkFlowWorkOrderId(workFlowWorkOrderId));
        });

    }




    GetWorkflowtranserData(workOrderId) {
        // &masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/GetWorkflowtranserData?workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.GetWorkflowtranserData(workOrderId));
        });
    }

    getWorkOrderById(workOrderId, receivingCustomerId?) {
        // &masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderbyid?workOrderId=${workOrderId}&receivingCustomerId=${receivingCustomerId != undefined ? receivingCustomerId : 0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderById(workOrderId, receivingCustomerId));
        });
    }

    viewWorkOrderHeader(workOrderId, masterCompanyId?) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderheaderview?workOrderId=${workOrderId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.viewWorkOrderHeader(workOrderId, masterCompanyId));
        });
    }
    viewWorkOrderPartNumber(workOrderId, masterCompanyId?) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderpartsview?workOrderId=${workOrderId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.viewWorkOrderPartNumber(workOrderId, masterCompanyId));
        });
    }
    // getSitesbymanagementstructrue(managementStructureId) {
    //     return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/sitesbymanagementstructrue?managementStructureId=${managementStructureId}`, this.getRequestHeaders())
    // }
    getReservedPartsByWorkFlowWOId(WorkFlowWorkOrderId, workOrderId, statusId, updatedBy, type, masterCompanyId) {

        let urlType;
        if (type == false) {
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
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/${urlType}?workFlowWorkOrderId=${WorkFlowWorkOrderId}&workOrderId=${workOrderId}&statusId=${statusId}&updatedBy=${updatedBy}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getReservedPartsByWorkFlowWOId(WorkFlowWorkOrderId, workOrderId, statusId, updatedBy, type, masterCompanyId));
            });

        } else {
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
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/${urlType}?subWOPartNoId=${WorkFlowWorkOrderId}&updatedBy=${updatedBy}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getReservedPartsByWorkFlowWOId(WorkFlowWorkOrderId, workOrderId, statusId, updatedBy, type, masterCompanyId));
            });
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
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/savereserveissuesparts`, JSON.stringify(alternatePart), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.saveReservedPartorIssue(alternatePart));
        });
    }

    assetsCheckInByWorkOrderAssetsId(assetcheckin) {
        //return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/saveassetcheckedin?WorkOrderAssetId=${workOrderAssetId}&checkedInById=${employeeId}&checkedInDate=${checkedInDate}&updatedBy=${updatedBy}`)  
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/saveassetcheckedin`, JSON.stringify(assetcheckin), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.assetsCheckInByWorkOrderAssetsId(assetcheckin));
        });
    }

    assetsCheckOutByWorkOrderAssetsId(assetcheckout) {
        // return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/saveassetcheckedout?WorkOrderAssetId=${workOrderAssetId}&checkedInById=${employeeId}&checkedInDate=${checkedInDate}&updatedBy=${updatedBy}`)  
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/saveassetcheckedout`, JSON.stringify(assetcheckout), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.assetsCheckOutByWorkOrderAssetsId(assetcheckout));
        });
    }

    assetsHistoryByWorkOrderAssetId(workOrderAssetId, isSubWorkOrder) {
        // return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/woassethistory?workOrderAssetId=${workOrderAssetId}`, this.getRequestHeaders())
        if (isSubWorkOrder == true) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subwoassetinventoryhistory?subWorkOrderAssetId=${workOrderAssetId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.assetsHistoryByWorkOrderAssetId(workOrderAssetId, isSubWorkOrder));
            });
        }
        else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/woassetinventoryhistory?workOrderAssetId=${workOrderAssetId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.assetsHistoryByWorkOrderAssetId(workOrderAssetId, isSubWorkOrder));
            });
        }


    }
    deleteWorkOrderAssetByAssetId(workOrderAssetId, updatedBy, isSubWorkOrder) {
        if (isSubWorkOrder == true) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/deletesubworkorderasset?subWorkOrderAssetId=${workOrderAssetId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.deleteWorkOrderAssetByAssetId(workOrderAssetId, updatedBy, isSubWorkOrder));
            });
        } else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/deleteworkorderasset?workOrderAssetId=${workOrderAssetId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.deleteWorkOrderAssetByAssetId(workOrderAssetId, updatedBy, isSubWorkOrder));
            });
        }
    }

    createOrUpdateQuotation(data) {
        return this.http.post(`${this.configurations.baseUrl}/api/workOrder/${(data.workOrderQuoteId == undefined || data.workOrderQuoteId == 0) ? 'createworkorderquote' : 'updateworkorderquote'}`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.createOrUpdateQuotation(data));
        });
    }

    getSubWorkOrderListByWorkOrderId(workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/WorkOrder/subworkorderlist?workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getSubWorkOrderListByWorkOrderId(workOrderId));
        });
    }

    // getSubWorkOrderView(subWorkOrderId) {
    //     return this.http.get<any>(`${this.configurations.baseUrl}/api/WorkOrder/subworkorderdetails?subWorkOrderId=${subWorkOrderId}`, this.getRequestHeaders())
    // }

    getSubWorkOrderHeaderByWorkOrderId(workOrderId, workOrderPartNumberId, masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subworkorderheaderdetails?workOrderId=${workOrderId}&workOrderPartNumberId=${workOrderPartNumberId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getSubWorkOrderHeaderByWorkOrderId(workOrderId, workOrderPartNumberId, masterCompanyId));
        });
    }

    getSubWorkOrderDataBySubWorkOrderId(subWorkOrderId, masterCompanyId?) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subworkorderdetails?subWorkOrderId=${subWorkOrderId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getSubWorkOrderDataBySubWorkOrderId(subWorkOrderId, masterCompanyId));
        });
    }

    createSubWorkOrderHeaderByWorkOrderId(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createsubworkorder`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.createSubWorkOrderHeaderByWorkOrderId(data));
        });
    }

    updateSubWorkOrderHeaderBySubWorkOrderId(data) {
        return this.http.put<any>(`${this.configurations.baseUrl}/api/workOrder/updatesubworkorder`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.updateSubWorkOrderHeaderBySubWorkOrderId(data));
        });
    }

    createBillingByWorkOrderId(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createbillinginvoicing `, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.createBillingByWorkOrderId(data));
        });
    }

    updateBillingByWorkOrderId(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/updatebillinginvoicing`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.updateBillingByWorkOrderId(data));
        });
    }

    searchPartNumberAdvanced<T>(searchParameters: any): Observable<T> {
        return this.http.post<T>(`${this.configurations.baseUrl}/api/workorder/searchpartnumberbycustrestriction`, JSON.stringify(searchParameters), this.getRequestHeaders())
            .catch(err => {
                return this.handleErrorCommon(err, () => this.searchPartNumberAdvanced(searchParameters));
            })
    }
    getExistingWOROList() {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderrolist`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getExistingWOROList());
        });
    }
    createNewWORO(workOrderPartNoId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/wopartdetailsbyid?workOrderPartNoId=${workOrderPartNoId} `, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.createNewWORO(workOrderPartNoId));
        });
    }

    getBillingEditData(workOrderId, workOrderPartNoId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/billinginvoicingdetails?workOrderId=${workOrderId}&workOrderPartNoId=${workOrderPartNoId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getBillingEditData(workOrderId, workOrderPartNoId));
        });
    }



    getPartsDetail(workOrderId, masterCompanyId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/workorderpartsview?workOrderId=${workOrderId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getPartsDetail(workOrderId, masterCompanyId));
        });
    }

    getBuildDetailsFromWorkFlow(partId, workScopeId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/workflownos?partId=${partId}&workScopeId=${workScopeId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getBuildDetailsFromWorkFlow(partId, workScopeId));
        });
    }

    getBuildDetailsFromHistoricalWorkOrder(partId, workScopeId, payLoad) {
        return this.http.post(`${this.configurations.baseUrl}/api/workorder/historicalworkorders`, payLoad).catch(error => {
            return this.handleErrorCommon(error, () => this.getBuildDetailsFromHistoricalWorkOrder(partId, workScopeId, payLoad));
        });
    }

    getBuildDetailsFromHistoricalWorkOrderQuote(partId, workScopeId, payLoad) {
        return this.http.post(`${this.configurations.baseUrl}/api/workorder/historicalworkorderquotes`, payLoad).catch(error => {
            return this.handleErrorCommon(error, () => this.getBuildDetailsFromHistoricalWorkOrderQuote(partId, workScopeId, payLoad));
        });
    }

    getWorkFlowDetails(workFlowId, masterCompanyId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workflow/getworkflow/${workFlowId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkFlowDetails(workFlowId, masterCompanyId));
        });
    }

    getWorkOrderMaterialListForQuote(wfwoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/workordermateriallist?wfwoId=${wfwoId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderMaterialListForQuote(wfwoId));
        });
    }
    getWorkOrderLaborListForQuote(wfwoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkflowworkorderlabourlist?wfwoId=${wfwoId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderLaborListForQuote(wfwoId));
        });
    }
    getWorkOrderChargesListForQuote(wfwoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkflowworkorderchargeslist?wfwoId=${wfwoId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderChargesListForQuote(wfwoId));
        });
    }
    getWorkOrderExclutionsListForQuote(wfwoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getworkflowworkorderexclusionslist?wfwoId=${wfwoId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderExclutionsListForQuote(wfwoId));
        });
    }
    getWorkOrderFreightListForQuote(wfwoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/workorderfreightlist?wfwoId=${wfwoId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderFreightListForQuote(wfwoId));
        });
    }

    saveMaterialListQuote(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createquotematerials`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.saveMaterialListQuote(data));
        });
    }

    saveFreightsListQuote(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createquotefreight`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.saveFreightsListQuote(data));
        });
    }

    saveLaborListQuote(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createquotelabor`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.saveLaborListQuote(data));
        });
    }

    saveChargesQuote(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createquotecharges`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.saveChargesQuote(data));
        });
    }

    saveExclusionsQuote(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createquoteexclusions`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.saveExclusionsQuote(data));
        });
    }

    getPartNosByCustomer(customerId, workOrderId, masterCompanyId?) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderpartdetails?customerId=${customerId}&workOrderId=${workOrderId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getPartNosByCustomer(customerId, workOrderId, masterCompanyId));
        });
    }

    getReceivingCustomerreference(customerId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/receivingcustomerWork/receivingcustomerreference?customerId=${customerId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getReceivingCustomerreference(customerId));
        });
    }
    getDocumentsList(wfWoId, workOrderId, isSubWorkOrder, subWOPartNoId) {
        if (isSubWorkOrder == true) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/subworkorderdocumentslist?subWOPartNoId=${subWOPartNoId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getDocumentsList(wfWoId, workOrderId, isSubWorkOrder, subWOPartNoId));
            });
        } else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workorderdocumentslist?wfwoId=${wfWoId}&workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getDocumentsList(wfWoId, workOrderId, isSubWorkOrder, subWOPartNoId));
            });
        }
    }

    createDocuments(data, isSubWorkOrder) {
        if (isSubWorkOrder == true) {
            const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
            return this.http.post(`${this.configurations.baseUrl}/api/workorder/createsubworkorderdocuments`, data).catch(error => {
                return this.handleErrorCommon(error, () => this.createDocuments(data, isSubWorkOrder));
            });

        } else {
            const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
            return this.http.post(`${this.configurations.baseUrl}/api/workorder/createworkorderdocuments`, data).catch(error => {
                return this.handleErrorCommon(error, () => this.createDocuments(data, isSubWorkOrder));
            });

        }
    }

    getDocumentList(wfwoid, workOrderId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workorderdocumentslist?wfwoId=${wfwoid}&workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getDocumentList(wfwoid, workOrderId));
        });
    }
    deleteWorkOrderDocuments(attachmentId, updatedBy) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/deleteworkorderdocuments?attachmentId=${attachmentId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteWorkOrderDocuments(attachmentId, updatedBy));
        });
    }
    updateWorkOrderDocumentStatus(workOrderDocumentsId, status, updatedBy) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workorderdocumentstatus?workOrderDocumentsId=${workOrderDocumentsId}&status=${status}&updatedBy=${updatedBy} `).catch(error => {
            return this.handleErrorCommon(error, () => this.updateWorkOrderDocumentStatus(workOrderDocumentsId, status, updatedBy));
        });
    }
    //work order tear down
    createworkOrderTearDownData(data, isSubWorkOrder) {
        if (isSubWorkOrder == true) {
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createsubwoteardown `, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.createworkOrderTearDownData(data, isSubWorkOrder));
            });
        } else {
            return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createteardown `, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.createworkOrderTearDownData(data, isSubWorkOrder));
            });
        }
    }
    getworkOrderTearDownData(wfWoId, isSubWorkOrder, masterCompanyId?) {
        if (isSubWorkOrder == true) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/getsubworkorderteardown?subWOPartNoId=${wfWoId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getworkOrderTearDownData(wfWoId, isSubWorkOrder, masterCompanyId));
            });
        } else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/getwoteardown?wowfId=${wfWoId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getworkOrderTearDownData(wfWoId, isSubWorkOrder, masterCompanyId));
            });
        }
    }
    getworkOrderTearDownViewData(wfWoId, isSubWorkOrder) {
        if (isSubWorkOrder == true) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/subworkorderteardownview?subWOPartNoId=${wfWoId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getworkOrderTearDownViewData(wfWoId, isSubWorkOrder));
            });
        } else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/woteardownview?wowfId=${wfWoId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getworkOrderTearDownViewData(wfWoId, isSubWorkOrder));
            });
        }
    }
    getteardownreasonbyid(reasonId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/teardownreason/getteardownreasonbyid/${reasonId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getteardownreasonbyid(reasonId));
        });
    }
    workOrderLabourAnalysisData(workOrderId, workOrderPartNoId, isSubWorkOrder, masterCompanyId) {
        if (isSubWorkOrder) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subwolabouranalysis?subWOPartNoId=${workOrderPartNoId}&masterCompanyId=${masterCompanyId}`).catch(error => {
                return this.handleErrorCommon(error, () => this.workOrderLabourAnalysisData(workOrderId, workOrderPartNoId, isSubWorkOrder, masterCompanyId));
            });
        } else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/labouranalysis?workOrderId=${workOrderId}&workOrderPartNoId=${workOrderPartNoId}&masterCompanyId=${masterCompanyId}`).catch(error => {
                return this.handleErrorCommon(error, () => this.workOrderLabourAnalysisData(workOrderId, workOrderPartNoId, isSubWorkOrder, masterCompanyId));
            });
        }
    }
    workOrderAnalysisData(workOrderId, workOrderPartNoId, isSubWorkOrder, masterCompanyId) {
        if (isSubWorkOrder) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subworkorderanalysis?subWOPartNoId=${workOrderPartNoId}&masterCompanyId=${masterCompanyId}`).catch(error => {
                return this.handleErrorCommon(error, () => this.workOrderAnalysisData(workOrderId, workOrderPartNoId, isSubWorkOrder, masterCompanyId));
            });
        } else {

            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderanalysis?workOrderId=${workOrderId}&workOrderPartNoId=${workOrderPartNoId}&masterCompanyId=${masterCompanyId}`).catch(error => {
                return this.handleErrorCommon(error, () => this.workOrderAnalysisData(workOrderId, workOrderPartNoId, isSubWorkOrder, masterCompanyId));
            });
        }
    }
    // http://localhost:5050/api/teardownreason/getteardownreasonbyid/2
    worOrderTearDownReasonListById(tearDownTypeId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/getteardownreasons?teardownTypeId=${tearDownTypeId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.worOrderTearDownReasonListById(tearDownTypeId));
        });
    }
    getworblist() {
        return this.http.get(`${this.configurations.baseUrl}/api/workOrder/getworblist`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getworblist());
        });
    }

    getLaborOHSettingsByManagementstrucId(id, masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/LaborOHSettings/GetLaborOHSettingsByManagementstrucId/${id}&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getLaborOHSettingsByManagementstrucId(id, masterCompanyId));
        });
    }

    saveOrUpdateWOQuoteSettings(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createworkorderquotesettings`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.saveOrUpdateWOQuoteSettings(data));
        });
    }

    getWOQuoteSettingList() {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/getworkorderQuotesettingslist`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWOQuoteSettingList());
        });
    }

    getWOQuoteSettingHistory(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/woquotesettingshistory/${id}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWOQuoteSettingHistory(id));
        });
    }
    reserveAltPartData(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/holdaltpartsstocklineqty`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.reserveAltPartData(data));
        });
    }
    reserveEqlPartData(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/holdequpartsstocklineqty`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.reserveEqlPartData(data));
        });
    }
    reservereleasestoclineqty(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/releasestoclineqty`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.reservereleasestoclineqty(data));
        });
    }
    getSiteByCustomerId(customerId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/Customer/cusshippingGet/${customerId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getSiteByCustomerId(customerId));
        });
    }
    getShippingBillSiteByCustomerId(customerId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/Customer/cusshippingbillAddressGet/${customerId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getShippingBillSiteByCustomerId(customerId));
        });
    }

    saveWorkOrderShipping(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/createworkordershipping`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.saveWorkOrderShipping(data));
        });
    }

    getShippingForWorkOrderPart(workOrderPartNoId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workordershippingdetails?workOrderPartNoId=${workOrderPartNoId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getShippingForWorkOrderPart(workOrderPartNoId));
        });
    }

    getTearDownTypesFromWOSettings(masterCompanyId, woTypeId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/teardowntypes?masterCompanyId=${masterCompanyId}&workOrderTypeId=${woTypeId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getTearDownTypesFromWOSettings(masterCompanyId, woTypeId));
        });
    }

    // delete master part number in workorder
    deleteMpnByWorkOrderId(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/deletempn`, data, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteMpnByWorkOrderId(data));
        });
    }
    //sub Work Order Mpn grid
    getSubWorkOrderDataForMpnGrid(workOrderMaterialsId, workOrderPartNoId, masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/subworkordermpndetails?workOrderMaterialsId=${workOrderMaterialsId}&workOrderPartNoId=${workOrderPartNoId}&masterCompanyId=${masterCompanyId != undefined ? masterCompanyId : 0}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getSubWorkOrderDataForMpnGrid(workOrderMaterialsId, workOrderPartNoId, masterCompanyId));
        });
    }
    //create Mpn grid sub wo
    createSubWorkOrderGrid(subWorkOrder) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createsubworkorderpartnumbers`, subWorkOrder, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.createSubWorkOrderGrid(subWorkOrder));
        });
    }
    // subwork order mpn grid list bind in edit mode
    getSubWorOrderMpnsById(subWorkOrderId, masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/getsubworkordermpnssbyid?subWorkOrderId=${subWorkOrderId}&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getSubWorOrderMpnsById(subWorkOrderId, masterCompanyId));
        });
    }
    //bind mpn dropdowns for multiple sub wo 
    getMpnDropdownlistSubWo(subWorkOrderId, masterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/bindsubworkordermpns?subWorkOrderId=${subWorkOrderId}&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getMpnDropdownlistSubWo(subWorkOrderId, masterCompanyId));
        });
    }
    //create sub workorder materials
    createSubWorkOrderMaterialList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createsubworkordermaterials`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.createSubWorkOrderMaterialList(data));
        });
    }
    //sub work order material roleups list api
    getSubWoMaterialRoleUps(subWorkOrderMaterialId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/subworollupmateriallist?subWorkOrderMaterialId=${subWorkOrderMaterialId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getSubWoMaterialRoleUps(subWorkOrderMaterialId));
        });
    }
    //delete sub wo materialist
    deleteSubWorkOrderMaterialList(subWorkOrderMaterialId, updatedBy) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/deletesubworkordermaterials?subWorkOrderMaterialId=${subWorkOrderMaterialId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.deleteSubWorkOrderMaterialList(subWorkOrderMaterialId, updatedBy));
        });
    }
    // Release sub wo reserve quantity 
    reservereleaseSubWostoclineqty(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/releasesubwostocklineqty`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.reservereleaseSubWostoclineqty(data));
        });
    }
    // sub wo alt parts
    reserveSubWoAltPartData(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/holdsubwoaltpartsstocklineqty`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.reserveSubWoAltPartData(data));
        });
    }
    // sub wo eql parts
    reserveSubWoEqlPartData(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workorder/holdsubwoequpartsstocklineqty`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.reserveSubWoEqlPartData(data));
        });
    }
    // save sub wo  reseve issue etc save

    saveSubWoReservedPartorIssue(alternatePart) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/savesubworeserveissuesparts`, JSON.stringify(alternatePart), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.saveSubWoReservedPartorIssue(alternatePart));
        });
    }

    //sub work order charges create and update
    createSubWorkOrderChargesList(data) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/createsubworkordercharges`, JSON.stringify(data), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.createSubWorkOrderChargesList(data));
        });
    }
    // Sub work order charges list
    getSubWorkOrderChargesList(subWOPartNoId, isDeleted?, masterCompanyId?) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/subWorkorderchargeslist?subWOPartNoId=${subWOPartNoId}&isDeleted=${isDeleted}&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getSubWorkOrderChargesList(subWOPartNoId, isDeleted, masterCompanyId));
        });
    }

    getMaterialListMPNS(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedmaterialdata?workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getMaterialListMPNS(workOrderId));
        });
    }

    getLabourListMPNS(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summariselLabourdata?workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getLabourListMPNS(workOrderId));
        });
    }

    getLabourAnalysisListMPNS(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedlabouranalysis?workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getLabourAnalysisListMPNS(workOrderId));
        });
    }

    getChargesListMPNS(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedchargesdata?workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getChargesListMPNS(workOrderId));
        });
    }

    getDocumentsListMPNS(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summariseddocumentsdata?workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getDocumentsListMPNS(workOrderId));
        });
    }

    getMemosListMPNS(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedcommunicationmemodata?workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getMemosListMPNS(workOrderId));
        });
    }

    getEmailsListMPNS(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedcommunicationemaildata?workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getEmailsListMPNS(workOrderId));
        });
    }

    getPhonesListMPNS(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedcommunicationphonedata?workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getPhonesListMPNS(workOrderId));
        });
    }

    getTextsListMPNS(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedcommunicationtextdata?workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getTextsListMPNS(workOrderId));
        });
    }

    getFreightsListMPNS(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedfreightdata?workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getFreightsListMPNS(workOrderId));
        });
    }

    getShippingListMPNS(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedshippingdata?workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getShippingListMPNS(workOrderId));
        });
    }

    getShippingData(workOrderShippingId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getwoshippingdetails?workOrderShippingId=${workOrderShippingId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getShippingData(workOrderShippingId));
        });
    }

    getDocumentData(wfwoid) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getwodocumentdetails?workFlowWorkOrderId=${wfwoid}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getDocumentData(wfwoid));
        });
    }

    getChargesDataForSummarisedView(wfwoid) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getchargedetails?workFlowWorkOrderId=${wfwoid}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getChargesDataForSummarisedView(wfwoid));
        });
    }
    getCommunicationMemoForSummarisedView(workOrderId, partNoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/communicationmemodetails?workOrderId=${workOrderId}&workOrderPartNo=${partNoId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getCommunicationMemoForSummarisedView(workOrderId, partNoId));
        });
    }
    getCommunicationMailForSummarisedView(workOrderId, partNoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/communicationemaildetails?workOrderId=${workOrderId}&workOrderPartNo=${partNoId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getCommunicationMailForSummarisedView(workOrderId, partNoId));
        });
    }
    getCommunicationPhoneForSummarisedView(workOrderId, partNoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/communicationphonedetails?workOrderId=${workOrderId}&workOrderPartNo=${partNoId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getCommunicationPhoneForSummarisedView(workOrderId, partNoId));
        });
    }
    getCommunicationTextForSummarisedView(workOrderId, partNoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/communicationtextdetails?workOrderId=${workOrderId}&workOrderPartNo=${partNoId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getCommunicationTextForSummarisedView(workOrderId, partNoId));
        });
    }
    getFreightsDataForSummarisedView(wfwoid) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getfreightdetails?workFlowWorkOrderId=${wfwoid}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getFreightsDataForSummarisedView(wfwoid));
        });
    }
    getBillingandInvoicingDataForSummarisedView(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedbillingandinvoicingdata?workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getBillingandInvoicingDataForSummarisedView(workOrderId));
        });
    }

    getReturnedPartsToCustomer(workOrderId, workOrderPartNumberId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/returnmctoustomer?workOrderId=${workOrderId}&workOrderPartNoId=${workOrderPartNumberId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getReturnedPartsToCustomer(workOrderId, workOrderPartNumberId));
        });
    }
    getWOAnalysisMPNs(woId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedwoanalysis?workOrderId=${woId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWOAnalysisMPNs(woId));
        });
    }
    getQuoteAnalysisMPNs(woId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedauotationanalysis?workOrderId=${woId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getQuoteAnalysisMPNs(woId));
        });
    }
    getBillingAndInvoiceMPNs(workOrderId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/summarisedbillingandinvoicingdata?workOrderId=${workOrderId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getBillingAndInvoiceMPNs(workOrderId));
        });
    }
    getMateialListDetailsForSummarisedData(wfwoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getmaterialdetails?workFlowWorkOrderId=${wfwoId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getMateialListDetailsForSummarisedData(wfwoId));
        });
    }
    getLabourListForDetailedView(wfwoId) {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getlabourdetails?workFlowWorkOrderId=${wfwoId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getLabourListForDetailedView(wfwoId));
        });
    }
    getWorkOrderAssetListForDropDown() {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderassets`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getWorkOrderAssetListForDropDown());
        });
    }
    checkInAseetInventoryList(workOrderAssetId, isSubWorkOrder, masterCompanyId) {
        if (isSubWorkOrder) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/subwocheckinassetinventorylist?subWorkOrderAssetId=${workOrderAssetId}&masterCompanyId=${masterCompanyId}`).catch(error => {
                return this.handleErrorCommon(error, () => this.checkInAseetInventoryList(workOrderAssetId, isSubWorkOrder, masterCompanyId));
            });
        }
        else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/wocheckinassetinventorylist?workOrderAssetId=${workOrderAssetId}&masterCompanyId=${masterCompanyId}`).catch(error => {
                return this.handleErrorCommon(error, () => this.checkInAseetInventoryList(workOrderAssetId, isSubWorkOrder, masterCompanyId));
            });
        }

    }
    checkOutAseetInventoryList(workOrderAssetId, workOrderId, woPartNoId, assetRecordId, createdBy, masterCompanyId, subWorkOrderId, isSubworkOrder) {

        if (isSubworkOrder) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/subwoassetinventorylist?subWorkOrderAssetId=${workOrderAssetId}&subWorkOrderId=${subWorkOrderId}&subWOPartNoId=${woPartNoId}&assetRecordId=${assetRecordId}&createdBy=${createdBy}&masterCompanyId=${masterCompanyId}`).catch(error => {
                return this.handleErrorCommon(error, () => this.checkOutAseetInventoryList(workOrderAssetId, workOrderId, woPartNoId, assetRecordId, createdBy, masterCompanyId, subWorkOrderId, isSubworkOrder));
            });
        } else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/woassetinventorylist?workOrderAssetId=${workOrderAssetId}&workOrderId=${workOrderId}&woPartNoId=${woPartNoId}&assetRecordId=${assetRecordId}&createdBy=${createdBy}&masterCompanyId=${masterCompanyId}`).catch(error => {
                return this.handleErrorCommon(error, () => this.checkOutAseetInventoryList(workOrderAssetId, workOrderId, woPartNoId, assetRecordId, createdBy, masterCompanyId, subWorkOrderId, isSubworkOrder));
            });
        }


    }
    releaseAssetInventoryList(AssetData) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/releasewocheckoutinventory`, AssetData, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.releaseAssetInventoryList(AssetData));
        });
    }
    releasesubwocheckoutinventory(AssetData) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/releasesubwocheckoutinventory`, AssetData, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.releasesubwocheckoutinventory(AssetData));
        });
    }
    saveCheckOutInventory(AssetData) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/savewocheckoutinventory`, AssetData, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.saveCheckOutInventory(AssetData));
        });
    }
    saveCheckInInventory(AssetData) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/savewocheckininventory`, AssetData, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.saveCheckInInventory(AssetData));
        });
    }
    savesubwocheckoutinventory(AssetData) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/savesubwocheckoutinventory`, AssetData, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.savesubwocheckoutinventory(AssetData));
        });
    }
    savesubwocheckininventory(AssetData) {
        return this.http.post<any>(`${this.configurations.baseUrl}/api/workOrder/savesubwocheckininventory`, AssetData, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.savesubwocheckininventory(AssetData));
        });
    }
    getWoAssetInventoryHistory(workOrderAssetId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/woassetinventoryhistory?workOrderAssetId=${workOrderAssetId}`).catch(error => {
            return this.handleErrorCommon(error, () => this.getWoAssetInventoryHistory(workOrderAssetId));
        });
    }
    getChargesHistory(isSubworkOrder, chargeId) {
        if (isSubworkOrder == true) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subWorkorderchargesauditlist?subWorkOrderChargesId=${chargeId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getChargesHistory(isSubworkOrder, chargeId));

            });
        } else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/getworkorderChargesauditlist?workOrderChargesId=${chargeId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getChargesHistory(isSubworkOrder, chargeId));

            });
        }
    }
    getFreightHistory(isSubworkOrder, freightId) {
        if (isSubworkOrder == true) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/subWorkorderfreightauditlist?subWorkOrderFreightId=${freightId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getChargesHistory(isSubworkOrder, freightId));

            });
        } else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/workorderfreightauditlist?workOrderFreightId=${freightId}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getChargesHistory(isSubworkOrder, freightId));

            });
        }
    }
    getShippingDataList(WorkOrderId: number): Observable<any> {

        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/getworkordershippinglist?WorkOrderId=${WorkOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getShippingDataList(WorkOrderId));

        });

        // const URL = `${this.configurations.baseUrl}/api/WorkOrder/getworkordershippinglist?WorkOrderId=${WorkOrderId}`;
        // return this.http
        //   .get<any>(URL, this.getRequestHeaders())
        //   .catch(error => {
        //     return this.handleErrorCommon(error, () => this.getShippingDataList(WorkOrderId));
        //   });
    }


    // api/workOrder/getworkorderChargesauditlist?workOrderChargesId=154
    // api/workOrder/workorderfreightauditlist?workOrderFreightId=154
    // api/workOrder/subWorkorderfreightauditlist?subWorkOrderFreightId=27
    // api/workOrder/subWorkorderchargesauditlist?subWorkOrderChargesId=27

    getquoteMaterialHistory(WorkOrderQuoteMaterialId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/getworkorderquotematerialauditlist?WorkOrderQuoteMaterialId=${WorkOrderQuoteMaterialId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getquoteMaterialHistory(WorkOrderQuoteMaterialId));

        });
    }

    getquoteLaborHistory(WorkOrderQuoteLaborId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/getworkorderquotelaborauditlist?WorkOrderQuoteLaborId=${WorkOrderQuoteLaborId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getquoteLaborHistory(WorkOrderQuoteLaborId));

        });
    }

    getquoteChargesHistory(WorkOrderQuoteChargesId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/getworkorderquotechargesauditlist?WorkOrderQuoteChargesId=${WorkOrderQuoteChargesId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getquoteChargesHistory(WorkOrderQuoteChargesId));

        });
    }

    getquoteFreightsHistory(WorkOrderQuoteFreightId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workOrder/getworkorderquotefreightsauditlist?WorkOrderQuoteFreightId=${WorkOrderQuoteFreightId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getquoteFreightsHistory(WorkOrderQuoteFreightId));

        });
    }
    //material list history

    getMaterialHistory(id, isSubWorkOrder) {
        if (isSubWorkOrder) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/subworkordermaterialauditlist?SubWorkOrderMaterialsId=${id}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getMaterialHistory(id, isSubWorkOrder));
            });
        } else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workordermaterialauditlist?WorkOrderMaterialsId=${id}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getMaterialHistory(id, isSubWorkOrder));
            });
        }
    }



    getMaterialStockHistory(id, isSubWorkOrder) {
        if (isSubWorkOrder) {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workorderstockhistory?workOrderMaterialId=${id}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getMaterialHistory(id, isSubWorkOrder));
            });
        } else {
            return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workorderstockhistory?workOrderMaterialId=${id}`, this.getRequestHeaders()).catch(error => {
                return this.handleErrorCommon(error, () => this.getMaterialHistory(id, isSubWorkOrder));
            });
        }
    }

    transferWorkflow(data) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/copyworkflowdetailstoworkorder?workOrderId=${data.workOrderId}&workflowId=${data.workflowId}&masterCompanyId=${data.masterCompanyId}&workOrderPartNumberId=${data.workOrderPartNumberId}&createdBy=${data.createdBy}&listItem=${data.list}`).catch(error => {
            return this.handleErrorCommon(error, () => this.transferWorkflow(data));
        });
    }

    getPickTicketList(workOrderId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getpickticketapprovelist?workOrderId=${workOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getPickTicketList(workOrderId));
        });
    }

    getStockLineforPickTicket(itemMasterId, conditionId, referenceId, isMPN): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/searchstocklinefrompickticketpop?itemMasterId=${itemMasterId}&conditionId=${conditionId}&referenceId=${referenceId}&isMPN=${isMPN}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getStockLineforPickTicket(itemMasterId, conditionId, referenceId, isMPN));
        });
    }

    savepickticketiteminterface(parts: WOPickTicket): Observable<any> {
        return this.http
            .post(`${this.configurations.baseUrl}/api/workorder/savepickticketiteminterface`, parts, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.savepickticketiteminterface(parts));
            });
    }

    savepickticketiteminterface_mainpart(parts: WOPickTicket): Observable<any> {
        return this.http
            .post(`${this.configurations.baseUrl}/api/workorder/savepickticketiteminterface_mainpart`, parts, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.savepickticketiteminterface(parts));
            });
    }

    getPickTicketEdit(woPickTicketId: number, workOrderId: number, workOrderPartId: number, isMPN: boolean): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getpickticketedit?woPickTicketId=${woPickTicketId}&workOrderId=${workOrderId}&workOrderPartId=${workOrderPartId}&isMPN=${isMPN}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getPickTicketEdit(woPickTicketId, workOrderId, workOrderPartId, isMPN));
        });
    }

    confirmPickTicket(pickticketId: number, confirmById: string, isMPN: boolean): Observable<any> {
        return this.http
            .put(`${this.configurations.baseUrl}/api/workorder/confirmpt/${pickticketId}/?confirmById=${confirmById}&isMPN=${isMPN}`, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.confirmPickTicket(pickticketId, confirmById, isMPN));
            });
    }

    getPickTicketPrint(workOrderId: number, workOrderPartId: number, woPickTicketId: number): Observable<any> {
        return this.http
            .get<any>(`${this.configurations.baseUrl}/api/workorder/getworkorderpickticketforprint?workOrderId=${workOrderId}&workOrderPartId=${workOrderPartId}&woPickTicketId=${woPickTicketId}`, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getPickTicketPrint(workOrderId, workOrderPartId, woPickTicketId));
            });
    }

    getPartPickTicketPrint(workOrderId: number, workOrderPartId: number, woPickTicketId: number): Observable<any> {
        return this.http
            .get<any>(`${this.configurations.baseUrl}/api/workorder/getworkorderpartpickticketforprint?workOrderId=${workOrderId}&workOrderPartId=${workOrderPartId}&woPickTicketId=${woPickTicketId}`, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getPartPickTicketPrint(workOrderId, workOrderPartId, woPickTicketId));
            });
    }

    getPickTicketListMainPart(workOrderId, workFlowWorkOrderId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/workorder/getpickticketapprovelist_mainpart?workOrderId=${workOrderId}&wfwoId=${workFlowWorkOrderId}`, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getPickTicketListMainPart(workOrderId, workFlowWorkOrderId));
        });
    }
}