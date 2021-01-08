import { MasterCompany } from './mastercompany.model';

export class WorkScope {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, workScopeId?: number, description?: string, workScopeCode?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean
		, memo?: string) {

        this.workScopeId = workScopeId;
        this.description = description;
        this.workScopeCode = workScopeCode;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
		this.isActive = isActive;
		this.memo = memo;
    }

    public workScopeId: number;
    public description: string;
    public workScopeCode: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public masterCompany: MasterCompany;
	public isActive: boolean;
	public memo: string;
}