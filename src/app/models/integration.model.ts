
import { MasterCompany } from './mastercompany.model';

export class Integration {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(integrationPortalId?: number, isActive?: boolean, Portalurl?: string, description?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string
		, memo?: string) {

        this.integrationPortalId = integrationPortalId;
        this.description = description;
        this.isActive = isActive;
        this.Portalurl = Portalurl;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
		this.isActive = isActive;
		this.memo = memo;
    }

    public integrationPortalId: number;
    public description: string;
    public  isActive : boolean;
    public Portalurl: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
	public memo: string;


}