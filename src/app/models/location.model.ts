import { MasterCompany } from './mastercompany.model';

export class Location {
    siteID(siteID: any): any {
        throw new Error("Method not implemented.");
    }
	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, locationId?: number,/*actionId?: number,*/ /*description?: string, */masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, memo?: string) {

		//this.actionId = actionId;
		//this.description = description;
		this.locationId = locationId;
		this.masterCompanyId = masterCompanyId;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
		this.updatedBy = updatedBy;
		this.masterCompany = masterCompany;
		this.isActive = isActive;
		this.memo = memo;

	}

	public locationId: number;
	public name: string;
	public masterCompanyId: number;
	public createdBy: string;
	public updatedBy: string;
	public createdDate: Date;
	public updatedDate: Date;
	public masterCompany?: MasterCompany;
	public isActive: boolean;
	public memo: string;


}

export class MyLocation {
    public locationId: number;
    public name: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public masterCompany?: MasterCompany;
    public isActive: boolean;
    public memo: string;
}