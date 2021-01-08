import { MasterCompany } from './mastercompany.model';
import { Customer } from './customer.model';
export class CustomerIntegrationPortalModel {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, CustomerIntegrationPortalId?: number, CustomerId?: number, IntegrationPortalId?: number, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string) {

        this.CustomerIntegrationPortalId = CustomerIntegrationPortalId;
        this.CustomerId = CustomerId;
        this.IntegrationPortalId = IntegrationPortalId;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
    }

    public CustomerIntegrationPortalId: number;
    public CustomerId: number;
    public IntegrationPortalId: number;
    public displayName: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public masterCompany: MasterCompany;
	public Customer: Customer;
}