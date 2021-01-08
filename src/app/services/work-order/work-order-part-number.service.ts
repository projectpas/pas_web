// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



import { WorkOrderPartNumber } from '../../models/work-order-partnumber.model';
import { WorkOrderType, WorkOrderStatus, WorkScope, WorkOrderStage } from '../../models/work-order-type.model';

import { WorkOrderPartNumberEndpointService } from '../work-order/work-order-part-number-endpoint.service';

@Injectable()
export class WorkOrderPartNumberService {

    constructor(private workOrderPartNumberEndpointService: WorkOrderPartNumberEndpointService) {
    }

    getAll() {
        return this.workOrderPartNumberEndpointService.getAllWorkOrders<WorkOrderPartNumber[]>();
    }

    getById(workOrderId: number) {
        return this.workOrderPartNumberEndpointService.getWorkOrderById<WorkOrderPartNumber>(workOrderId);
    }

    add(workOrder: WorkOrderPartNumber) {
        return this.workOrderPartNumberEndpointService.addWorkOrder<WorkOrderPartNumber>(workOrder);
    }

    update<T>(workOrder: WorkOrderPartNumber) {
        return this.workOrderPartNumberEndpointService.updateWorkOrder<T>(workOrder);
    }

    remove(workOrderId: number) {
        return this.workOrderPartNumberEndpointService.removeWorkOrderById(workOrderId);
    }

    updateActive(assetStatus: any) {
        //return this.assetStatusEndpoint.getUpdateForActive(assetStatus, assetStatus.id);
    }

    getAssetAudit(assetId: number) {
        //return this.assetStatusEndpoint.getAssetStatusAuditById<any>(assetId);
    }
}