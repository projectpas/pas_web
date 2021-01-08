export class WorkOrderType {
    id: number;
    description: string;
    masterCompanyId: number;
}

export class WorkOrderStatus {
    id: number;
    description: string;
    masterCompanyId: number;
}

export class WorkScope {
    workScopeId: number;
    workScopeCode: string;
    description: string;
    memo: string;
    masterCompanyId: number;
    createdBy: string;
    updatedBy: string;
    createdDate: Date;
    updatedDate: Date;
    isActive: boolean;
    isDelete: boolean;
}

export class WorkOrderStage {
    iD: number;
    description: string;
    masterCompanyId: number
    createdBy: string;
    updatedBy: string;
    createdDate: Date
    updatedDate: Date
    isActive: boolean;
    isDelete: boolean;
}