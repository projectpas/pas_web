import { MasterCompany } from './mastercompany.model';
import { Customer } from './customer.model';
export class CustomerBillingAddressModel {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(
    ) {
        this.siteName = '';
        this.address1 = '';
        this.address2 = '';
        this.address3 = '';
        this.isPrimary = false;
        this.city = '';
        this.stateOrProvince = '';
        this.postalCode = '';
        this.countryId = '';
        this.country='';
        // this.CustomerBillingAddressId = CustomerBillingAddressId;
        // this.CustomerId = CustomerId;
        // this.AddressId = AddressId;
        // this.IsPrimary = IsPrimary;
        // this.SiteName = SiteName;
        // this.displayName = displayName;
        // this.masterCompanyId = masterCompanyId;
        // this.createdBy = createdBy;
        // this.createdDate = createdDate;
        // this.updatedDate = updatedDate;
        // this.updatedBy = updatedBy;
    }

    public siteName: string;
    public address1: string;
    public address2: string;
    public address3: string;
    public isPrimary: boolean;
    public city: string;
    public stateOrProvince: string;
    public postalCode: string;
    public countryId: any;
    public country :string
}
//     public CustomerBillingAddressId: number;
//     public CustomerId: number;
//     public AddressId: number;
//     public IsPrimary: boolean;
//     public SiteName: string;
//     public displayName: string;
//     public masterCompanyId: number;
//     public createdBy: string;
//     public updatedBy: string;
//     public createdDate: Date;
//     public updatedDate: Date;
//     public masterCompany: MasterCompany;
// 	public Customer: Customer;
// }