export class WorkOrderLabor {
    public iD: number;
    public workOrderId: number;
    public dataEnteredBy: string;
    public laborExpertiseId: number;
    public employeeId: number;
    public actionId: number;
    public hours: number;
    public actionsCompletedByOneTech: boolean;
    public useTargeHoursFromWorkflow: boolean;
    public assignHoursBySpecificAction: boolean;
    public assignTotalHoursToWorkOrder: boolean;
    public memo: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public isActive: boolean;
    public isDelete: boolean;
}