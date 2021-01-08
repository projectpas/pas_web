
import { MasterCompany } from './mastercompany.model';

export class VendorClassification {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(masterCompany?: MasterCompany, vendorClassificationId?: number, classificationName?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, isDeleted?: boolean, memo?: string) {

        this.vendorClassificationId = vendorClassificationId;
        this.classificationName = classificationName;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.masterCompany = masterCompany;
        this.isActive = isActive;
        this.isDeleted = isDeleted;
		this.memo = memo;
    }

    public vendorClassificationId: number;
    public classificationName: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public masterCompany?: MasterCompany;
    public isActive: boolean;
    public isDeleted: boolean;
	public memo: string;


}