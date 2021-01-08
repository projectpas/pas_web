export interface  IDirections
{
      id:string;
      action:string;
      description :string;
      sequence :string;
      memo :string;
      taskId:string;
      workflowId:string;
      AllowEdit:boolean;
      isDeleted: boolean;
      Order: number;
}