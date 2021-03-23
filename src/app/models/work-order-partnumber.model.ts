export class WorkOrderPartNumber {
 


    constructor() {
        this.workOrderScopeId = null;
        this.promisedDate = new Date();
        this.estimatedShipDate = new Date();
        this.customerRequestDate = new Date();
        this.estimatedCompletionDate = new Date();
        this.customerReference = null;
        this.nte = '';
        this.quantity = 1;
        this.stockLineId = null;
        this.cmmId = 0;
        this.workflowId = 0;
        this.workOrderStageId = 1;
        this.workOrderStatusId = 1;
        this.workOrderPriorityId = 1;
        this.isPMA = false;
        this.isDER = false;
        this.techStationId = 0;
        this.tearDownReport = 0;
        this.tatDaysStandard = 0;
        this.tatDaysCurrent = 0;
        this.technicianId = 0;
        this.mappingItemMasterId = null;
        this.conditionId = null;
        this.masterPartId = null;
        this.stockLineNumber = '';
        this.isActive = true;
        this.isDelete = false;
        this.updatedDate = new Date();
        this.createdDate = new Date();
        this.receivedDate = '';
        this.isMPNContract=false;
        this.contractNo='';
        this.workOrderId=0;
        this.partTechnicianId=0;
    }

    updatedDate: Date;
    createdDate: Date;
    isActive: boolean
    isDelete: boolean
    stockLineNumber: string;
    masterPartId: any;
    workOrderScopeId: number;
    promisedDate: any;
    estimatedShipDate: any;
    customerRequestDate: any;
    estimatedCompletionDate: any;
    customerReference: number;
    isMPNContract:boolean;
    contractNo:string;
    nte: string;
    quantity: number;
    stockLineId: number;
    cmmId: number;
    workflowId: number;
    workOrderStageId: number;
    workOrderStatusId: number;
    workOrderPriorityId: number;
    isPMA: boolean;
    isDER: boolean;
    techStationId: number;
    tearDownReport: number;
    tatDaysCurrent: number;
    tatDaysStandard: number;
    technicianId: number;
    mappingItemMasterId: number;
    conditionId: number;
    receivedDate: string;
    workOrderId: any;
    partTechnicianId:any;
}