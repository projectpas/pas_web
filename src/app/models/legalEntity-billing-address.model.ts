import { MasterCompany } from './mastercompany.model';
export class legalEntityBillingAddressModel {
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
        // this.country='';
    }

    public siteName: string;
    public address1: string;
    public address2: string;
    public address3: string;
    public isPrimary: boolean;
    public city: string;
    public stateOrProvince: string;
    public postalCode: string;
    // public country: string;
    public countryId: any;
    
}
