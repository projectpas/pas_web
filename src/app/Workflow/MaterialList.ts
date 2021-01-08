export interface IMaterialList {
    Id:string;
    PN: string;
    Description: string;
    Condition: string;
    MandatoryOrSupplemental: string;
    ItemClassification: string;
    Quantity: string;
    UOM: string;
    UnitCost: string;
    ExtraCost: string;
    Price: string;
    Memo: string;
    Deferred: string;
    taskId:string;
    workflowId:string;
    AllowEdit:boolean;
    IsDeleted:boolean;
    Order: number;
}