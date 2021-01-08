
import { MasterCompany } from './mastercompany.model';

export class Itemgroup {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, itemGroupId?: number, itemGroupCode?: string, Sequence?: string, description?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, memo?: string, itemGroup?: string) {

        this.itemGroupId = itemGroupId;
        this.itemGroupCode = itemGroupCode;
        this.description = description;
        this.Sequence = Sequence;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.masterCompany = masterCompany;
		this.isActive = isActive;
        this.memo = memo;
        this.itemGroup = itemGroup;
    }

    public itemGroupId: number;
    public itemGroupCode: string;
    public description: string;
    public Sequence: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public masterCompany?: MasterCompany;
	public isActive: boolean;
    public memo: string;
    public itemGroup: string;
}