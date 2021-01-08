
import { MasterCompany } from './mastercompany.model';

export class AddressModel {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(masterCompany?: MasterCompany, addressId?: number, line1?: string,
        line2?: string, line3?: string,
        postalCode?: string, country?: string,
        recordCreateDate?: Date,
        recordModifiedDate?: Date,
        city?: string, stateOrProvince?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, memo?: string) {

        this.addressId = addressId;
        this.line1 = line1;
        this.line2 = line2;
        this.country = country;
        this.postalCode = postalCode;
        this.recordModifiedDate = recordModifiedDate;
        this.stateOrProvince = stateOrProvince;
        this.city = city;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.masterCompany = masterCompany;
        this.isActive = isActive;
        this.memo = memo;
    }

    public addressId: number;
    public line1: string;
    public line2: string;
    public line3?: string;
    public country: string;
    public recordModifiedDate?: Date;
    public stateOrProvince: string;
    public postalCode: string;
    public city: string;
    public masterCompanyId?: number;
    public createdBy?: string;
    public updatedBy?: string;
    public createdDate?: Date;
    public updatedDate?: Date;
    public masterCompany?: MasterCompany;
    public isActive?: boolean;
    public memo?: string;
}