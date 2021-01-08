
import { MasterCompany } from './mastercompany.model';
import { CustomerClassification } from './customer-classification.model';
import { CustomerAddressModel } from './customer-address.model';
import { CustomerBillingAddressModel } from './customer-billing-address.model';
import { CustomerIntegrationPortalModel } from './customer-integration-portal.model';
import { CustomerShippingModel } from './customer-shipping.model';
import { CreditTerms } from './credit-terms.model';

//import { customerclassification } './CustomerClassification.model';
export class Customer {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(masterCompany?: MasterCompany, crediTerms?: CreditTerms, customerId?: number, name?: string, CustomerCode?: string,
        customerCode?: string,IsInternalCustomer?: boolean, DoingBuinessAsName?: string, CoreDueIn?: number, Parent?: number, CustomerClassificationId?: number, ContractReference?: string,
        PriorityCustomerId?: number,
        IsPBHCustomer?: boolean, PBHCustomerMemo?: string, RestrictPMA?: boolean, RestrictPMAMemo?: string, RestrictBER?: boolean,
        RestrictBERMemo?: string,
        CustomerURL?: string, AddrressId?: number, IsCustomerAlsoVendor?: boolean, RelatedVendorId?: number, Notes?: string,
        MarkUpPercent?: string, CreditLimit?: number,
        CreditTermsId?: number, AllowNettingOfAPAR?: boolean, IsTaxExempt?: boolean, TaxCertificate?: number, TaxRateStateOrProvince?: number,
        TaxOtherType?: number, EDI?: boolean, EDIDescription?: string, AllowProformaBilling?: boolean,
        AllowPartialBilling?: boolean, CurrencyId?: number, PrimarySalesPersonLastName?: string, PrimarySalesPersonFirstName?: string,
        PrimarySalesPersonMiddleName?: string, SecondarySalesPersonFirstName?: string, SecondarySalesPersonLastName?: string, SecondarySalesPersonMiddleName?: string,
        CSRName?: string, AgentName?: string, ExportLicenseRequired?: boolean,
		MasterCompanyId?: number, IsActive?: boolean, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean
		) {










        this.CustomerId = customerId;
        this.customerId = customerId;
        this.Name = name;
        this.name = name;
        this.CustomerCode = CustomerCode;
        this.customerCode = customerCode;

        this.IsInternalCustomer = IsInternalCustomer;
        this.DoingBuinessAsName = DoingBuinessAsName;
        this.CoreDueIn = CoreDueIn;
        this.Parent = Parent;
        this.CustomerClassificationId = CustomerClassificationId;
        this.ContractReference = ContractReference;
        this.PriorityCustomerId = PriorityCustomerId;
        this.IsPBHCustomer = IsPBHCustomer;
        this.PBHCustomerMemo = PBHCustomerMemo;
        this.RestrictPMA = RestrictPMA;
        this.RestrictPMAMemo = RestrictPMAMemo;
        this.RestrictBER = RestrictBER;
        this.RestrictBERMemo = RestrictBERMemo;
        this.CustomerURL = CustomerURL;
        this.AddrressId = AddrressId;
        this.IsCustomerAlsoVendor = IsCustomerAlsoVendor;
        this.RelatedVendorId = RelatedVendorId;
        this.Notes = Notes;
        this.MarkUpPercent = MarkUpPercent;
        this.CreditLimit = CreditLimit;
        this.CreditTermsId = CreditTermsId;
        this.AllowNettingOfAPAR = AllowNettingOfAPAR;
        this.CurrencyId = CurrencyId;
        this.PrimarySalesPersonLastName = PrimarySalesPersonLastName;
        this.PrimarySalesPersonFirstName = PrimarySalesPersonFirstName;
        this.PrimarySalesPersonMiddleName = PrimarySalesPersonMiddleName;
        this.SecondarySalesPersonFirstName = SecondarySalesPersonFirstName;
        this.SecondarySalesPersonLastName = SecondarySalesPersonLastName;
        this.SecondarySalesPersonMiddleName = SecondarySalesPersonMiddleName;
        this.masterCompany = masterCompany;
        this.creditTerms = crediTerms;
		this.isActive = isActive;
    }

    public CustomerId: number;
    public customerId: number;
    public Name: string;
    public name: string;
    public CustomerCode: string;
    public customerCode?: string
    public IsInternalCustomer: boolean;
    public DoingBuinessAsName: string;
    public CoreDueIn: number;
    public Parent: number;
    public CustomerClassificationId: number;
    public ContractReference: string;
    public PriorityCustomerId: number;
    public IsPBHCustomer: boolean;
    public PBHCustomerMemo: string;
    public RestrictPMA: boolean;
    public RestrictPMAMemo: string;
    public RestrictBER: boolean;
    public RestrictBERMemo: string;
    public CustomerURL: string;
    public AddrressId: number;
    public IsCustomerAlsoVendor: boolean;
    public RelatedVendorId: number;
    public Notes: string;
    public MarkUpPercent: string;
    public CreditLimit: number;
    public CreditTermsId: number;
    public AllowNettingOfAPAR: boolean;
    public CurrencyId: number;
    public PrimarySalesPersonLastName: string;
    public PrimarySalesPersonFirstName?: string;
    public PrimarySalesPersonMiddleName?: string;
    public SecondarySalesPersonFirstName?: string;
    public SecondarySalesPersonLastName?: string;
    public SecondarySalesPersonMiddleName?: string;

    public masterCompany?: MasterCompany;
    public customerClassification?: CustomerClassification;
    public customeraddress?: CustomerAddressModel;
    public customerBillingAddressModel: CustomerBillingAddressModel;
    public customerIntegrationPortalModel: CustomerIntegrationPortalModel;
    public customerShippingModel: CustomerShippingModel;
    public creditTerms?: CreditTerms;
	public isActive: boolean;
}