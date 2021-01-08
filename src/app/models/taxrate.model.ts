
import { MasterCompany } from './mastercompany.model';

export class TaxRate {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(masterCompany?: MasterCompany, taxRateId?: number, taxTypeId?: string, taxRate?: number, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, isDeleted?: boolean, memo?: string) {

        this.taxRateId = taxRateId;
        this.taxTypeId = taxTypeId;
        this.taxRate = taxRate;
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

    public taxRateId: number;
    public taxTypeId: string;
    public taxRate: number;
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