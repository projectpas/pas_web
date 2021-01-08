import { MasterCompany } from './mastercompany.model';

export class WorkPerformed {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, workPerformedId?: number, isActive?: boolean, description?: string, workPerformedCode?: string, memo?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string) {

        this.workPerformedId = workPerformedId;
        this.description = description; 
        this.memo = memo; 
        this.masterCompanyId = masterCompanyId;
        this.workPerformedCode = workPerformedCode;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
		this.isActive = isActive;
    }

    public workPerformedId: number;
    public description: string;
    public memo: string;
    public isActive?: boolean;
    public masterCompany: MasterCompany;
    public workPerformedCode: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
	public updatedDate: Date;
}