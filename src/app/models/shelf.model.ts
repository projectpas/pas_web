import { MasterCompany } from './mastercompany.model';

export class Shelf {
	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, shelfId?: number,/*actionId?: number,*/ /*description?: string, */masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, memo?: string) {

		//this.actionId = actionId;
		//this.description = description;
		this.shelfId = shelfId;
		this.masterCompanyId = masterCompanyId;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
		this.updatedBy = updatedBy;
		this.masterCompany = masterCompany;
		this.isActive = isActive;
		this.memo = memo;

	}

	//public actionId: number;
	//public description: string;
	//public ataSubChapter1Id: number;
	public shelfId: number;
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