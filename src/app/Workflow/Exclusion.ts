export interface IExclusion{
      Id:string,
      epn:string;
      epnDescription:string; 
      unitCost :string;
      quantity :string;
      extended :string;
      estimatedPercentOccurance:string;  
      memo :string;
      taskId:string;
      workflowId:string;
      AllowEdit:boolean;
      isDeleted: boolean;
      Order: number;
}
