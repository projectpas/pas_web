
import { MasterCompany } from './mastercompany.model';

export class Action {
	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, taskId?: number, description?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, memo?: string) {

        this.taskId = taskId;
        this.description = description;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
		this.masterCompany = masterCompany;
		this.isActive = isActive;
		this.memo = memo;

    }

    public taskId: number;
    public description: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
	public masterCompany?: MasterCompany;
	public isActive: boolean;
	public memo: string;



        
}