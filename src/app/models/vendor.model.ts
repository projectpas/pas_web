
import { MasterCompany } from './mastercompany.model';

export class Vendor {
    name: any;
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(masterCompany?: MasterCompany, isActive?: boolean, vendorId?: number,name?: string, vendorName?: string, vendorCode?: string, vendorTypeId?: number, doingBusinessAsName?: string, vendorClassificationId?: number, parent?: number, vendorContractReference?: string, addressId?: number, isVendorAlsoCustomer?: boolean, relatedCustomerId?: number, vendorEmail?: string, isPreferredVendor?: boolean, licenseNumber?: string, vendorURL?: string, isCertified?: boolean, certificationFile?: string, vendorAudit?: boolean, vendorAuditFile?: string, eDI?: boolean, eDIDescription?: string, aeroExchange?: boolean, eeroExchangeDescription?: string, creditLimit?: number, currencyId?: number, discountLevel?: number, is1099Required?: boolean, creditTermsId?: number,
       
        masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string
        , memo?: string, vendorPhone?: string, isAddressForBilling?: boolean, isAddressForShipping?: boolean) {

        this.vendorId = vendorId;
        this.vendorName = vendorName;
        this.name=vendorName ? vendorName :name;
        this.vendorCode = vendorCode;
        this.vendorTypeId = vendorTypeId; 
        this.doingBusinessAsName = doingBusinessAsName; 
        this.vendorClassificationId = vendorClassificationId;
		this.parent = parent; 
		this.vendorPhone = vendorPhone;
        this.vendorContractReference = vendorContractReference;
        this.addressId = addressId;
        this.isVendorAlsoCustomer = isVendorAlsoCustomer;
        this.relatedCustomerId = relatedCustomerId;
        this.vendorEmail = vendorEmail;
        this.isPreferredVendor = isPreferredVendor;
        this.licenseNumber = licenseNumber;
        this.vendorURL = vendorURL;
        this.isCertified = isCertified;
        this.certificationFile = certificationFile;
        this.vendorAudit = vendorAudit;
        this.vendorAuditFile = vendorAuditFile;
        this.eDI = eDI;
        this.eDIDescription = eDIDescription;
        this.aeroExchange = aeroExchange;
        this.eeroExchangeDescription = eeroExchangeDescription;
        this.creditLimit = creditLimit;
        this.currencyId = currencyId;
        this.discountLevel = discountLevel;
        this.is1099Required = is1099Required;
        this.creditTermsId = creditTermsId;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.masterCompany = masterCompany;
        this.memo = memo;
        this.isAddressForBilling = isAddressForBilling;
        this.isAddressForShipping = isAddressForShipping;

    }

    public vendorId: number;
    public vendorName: string;
    public vendorTypeId: number;
    public doingBusinessAsName: string;
    public vendorClassificationId: number;
    public parent: number;
    public vendorContractReference: string;
    public addressId: number;
    public isVendorAlsoCustomer: boolean;
    public relatedCustomerId: number;
    public vendorEmail: string;
    public isPreferredVendor: boolean;
    public licenseNumber: string;
    public vendorURL: string;
    public isCertified: boolean;
    public certificationFile: string;
    public vendorAudit: boolean;
    public vendorAuditFile: string;
    public eDI: boolean;
    public eDIDescription: string;
    public aeroExchange: boolean;
    public eeroExchangeDescription: string;
    public creditLimit: number;
    public currencyId: number;
    public discountLevel: number;
    public is1099Required: boolean;
    public creditTermsId: number;
    public rent: boolean;
    public vendorCode: string;
    public isActive: boolean;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public masterCompany?: MasterCompany;
	public memo: string;
    public vendorPhone: string;

    public isAddressForBilling :boolean;
    public isAddressForShipping : boolean;


}