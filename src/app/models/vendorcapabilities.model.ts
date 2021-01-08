import { MasterCompany } from './mastercompany.model';

export class VendorCapabilities {
	glaccountclassname: string;


	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, VendorCapabilityId?: number, CapabilityId?: number, CapabilityName?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, isDelete?: boolean, memo?: string) {

		this.VendorCapabilityId = VendorCapabilityId;
		this.CapabilityId = CapabilityId;
		this.CapabilityName = CapabilityName;
		this.masterCompanyId = masterCompanyId;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
		this.updatedBy = updatedBy;
		this.masterCompany = masterCompany;
		this.isActive = isActive;
		this.isDelete = isDelete;
		this.memo = memo;

	}

	public VendorCapabilityId: number;
	public CapabilityId: number;
	public masterCompanyId: number;
	public CapabilityName: string;
	public createdBy: string;
	public updatedBy: string;
	public createdDate: Date;
	public updatedDate: Date;
	public masterCompany?: MasterCompany;
	public isActive: boolean;
	public isDelete: boolean;
	public memo: string;




}