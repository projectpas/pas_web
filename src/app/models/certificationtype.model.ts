import { MasterCompany } from './mastercompany.model';

export class CertificationType {


	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(masterCompany?: MasterCompany, CertificationTypeId?: number, CertificationName?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, isDelete?: boolean) {

		this.CertificationTypeId = CertificationTypeId;
		
		this.CertificationName = CertificationName;
		this.masterCompanyId = masterCompanyId;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
		this.updatedBy = updatedBy;
		this.masterCompany = masterCompany;
        this.isActive = isActive;
        this.isDelete = isDelete;
		

	}

	public CertificationTypeId: number;
	public CertificationName: string;
	public masterCompanyId: number;
	public createdBy: string;
	public updatedBy: string;
	public createdDate: Date;
	public updatedDate: Date;
	public masterCompany?: MasterCompany;
    public isActive: boolean;
    public isDelete: boolean;





}