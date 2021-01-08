
import { MasterCompany } from './mastercompany.model';

export class ItemClassificationModel {
   
   
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, itemClassificationId?: string, itemClassificationCode?: string, itemType?: string, description?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string,
		isActive?: boolean, memo?: string) {

        this.itemClassificationId = itemClassificationId;
        this.itemClassificationCode = itemClassificationCode;
        this.description = description;
		this.itemType = itemType;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.masterCompany = masterCompany;
		this.isActive = isActive;
		this.memo = memo;
    }

    public itemClassificationId: string;
    public itemClassificationCode: string;
    public description: string;
	public itemType: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public masterCompany?: MasterCompany;
	public isActive: boolean;
	public memo: string;
}