// import { MasterCompany } from './mastercompany.model';
// import { Customer } from './customer.model';
export class CustomerContactModel {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor() {
        this.tag = '',
        this.prefix = ''
        this.firstName = '';
        this.middleName = '';
        this.lastName = '';
        this.suffix = '';
        this.contactTitle = '';
        this.workPhone = '';
        this.email = '';
        this.workPhoneExtn = '';
        this.websiteURL = '';
        this.mobilePhone = '';
        this.alternatePhone = '';
        this.fax = '';
        this.notes = '';
        this.isDefaultContact = false;
        this.contactTagId = 0
    }

    tag: string;
    prefix: string;
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    contactTitle: string;
    workPhone: string;
    email: string;
    workPhoneExtn: string;
    websiteURL: string;
    mobilePhone: string;
    alternatePhone: string;
    fax: string;
    notes: string;
    isDefaultContact: boolean
    contactTagId:number



}