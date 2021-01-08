

export class MasterCompany {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(masterCompanyId?: number, emailAddress?: string, address?:string,isActive?: boolean, companyName?: string, TaxId?: string, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string) {

        this.masterCompanyId = masterCompanyId;
        this.isActive = isActive;
        this.companyName = companyName;
        this.taxId = TaxId;
        this.emailAddress = emailAddress;
        this.address = address;

        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
   

    }

    public masterCompanyId: number;
    public companyName: string;
    public taxId: string;
    public isActive?: boolean;
    public emailAddress: string;
    public address: string;

    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;

}