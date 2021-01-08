export interface IExpertise
{
    Id : string;
    ExpertiseType : string;
    EstimatedHours : string;
    LabourDirectRate : string;
    LabourDirectCost : string;
    OHeadBurden : string;
    OHCost : string;
    LabourAndOHCost : string;
    taskId:string;
    workflowId:string;
    AllowEdit:boolean;
    IsDeleted: boolean;
    Order: number;
}