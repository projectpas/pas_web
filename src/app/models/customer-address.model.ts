import { MasterCompany } from './mastercompany.model';
import { Customer } from './customer.model';

export class CustomerAddressModel {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, CustomerAddressId?: number, CustomerId?: number, AddressId?: number, symbol?: string, displayName?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string) {

        this.CustomerAddressId = CustomerAddressId;
        this.CustomerId = CustomerId;
        this.AddressId = AddressId;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
		this.updatedBy = updatedBy;

    }

    public CustomerAddressId: number;
    public CustomerId: number;
    public AddressId: number;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public masterCompany: MasterCompany;
	public Customer: Customer;

}