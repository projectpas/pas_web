import { MasterCompany } from './mastercompany.model';

export class Site {
	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, siteId?: number,/*actionId?: number,*/ /*description?: string, */masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, isDeleted?: boolean, memo?: string) {

		//this.actionId = actionId;
		//this.description = description;
		this.siteId = siteId;
		this.masterCompanyId = masterCompanyId;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
		this.updatedBy = updatedBy;
		this.masterCompany = masterCompany;
		this.isActive = isActive;
		this.isDeleted = isDeleted;
		this.memo = memo;
		this.countryId= this.countryId;

	}

	//public actionId: number;
	//public description: string;
	//public ataSubChapter1Id: number;
	public siteId: number;
	public name: string;
	public masterCompanyId: number;
	public createdBy: string;
	public updatedBy: string;
	public createdDate: Date;
	public updatedDate: Date;
	public masterCompany?: MasterCompany;
	public isActive: boolean;
	public memo: string;
	public countryId :any;
	public isDeleted: Boolean;
	public postalCode: any;
	public stateOrProvince: any;
	public city: any;
	public address3: any;
	public address2: any;
	public address1: any;
}