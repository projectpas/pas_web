import { MasterCompany } from './mastercompany.model';

export class Manufacturer {
	glaccountclassname: string;


	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, manufacturerId?: number, Comments?: string, name?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, memo?: string) {

        this.ManufacturerId = manufacturerId;
        this.Name = name;
        this.manufacturerId = manufacturerId;
        this.name = name;

		this.Comments = Comments;
		this.masterCompanyId = masterCompanyId;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
		this.updatedBy = updatedBy;
		this.masterCompany = masterCompany;
		this.isActive = isActive;
		this.memo = memo;

	}

	public ManufacturerId: number;	
    public Name: string;
    public manufacturerId: number;
    public name: string;
	public masterCompanyId: number;
	public Comments: string;
	public createdBy: string;
	public updatedBy: string;
	public createdDate: Date;
	public updatedDate: Date;
	public masterCompany?: MasterCompany;
	public isActive: boolean;
	public memo: string;




}