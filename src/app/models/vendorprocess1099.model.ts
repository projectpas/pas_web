
import { MasterCompany } from './mastercompany.model';

export class VendorProcess1099 {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(masterCompany?: MasterCompany, master1099Id?: number, description?: string, memo?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, isDeleted?: boolean) {

        this.master1099Id = master1099Id;
        this.description = description;
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

    public master1099Id: number;
    public description: string;
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