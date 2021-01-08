export interface IEquipmentList
{
    Id:string;
    AssetId:string;
    AssetType:string;
    AssetDescription:string;
    Quantity:string;
    taskId:string;
	workflowId:string;
    AllowEdit:boolean;
    IsDeleted: boolean;
    Order: number;
}
 