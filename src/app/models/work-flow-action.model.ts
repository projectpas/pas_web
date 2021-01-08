

export class WorkFlowAction {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(workflowActionId: number, description?: string, masterCompanyId?: string) {

        this.workflowActionId = workflowActionId;
        this.description = description;
        this.masterCompanyId = masterCompanyId;
    }
    
    public workflowActionId: number;
    public description: string;
    public masterCompanyId: string;
}