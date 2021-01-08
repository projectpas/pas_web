export class EntityGeneralInformation {

    "legalEntityId": Number;
    "name": string;
    "ledgerName": string;
    "description": string;
    "doingLegalAs": string;
    "addressId": Number;
    "faxNumber": string;
    "phoneNumber1": string;
    "functionalCurrencyId": Number;
    "reportingCurrencyId": Number;
    "isBalancingEntity": boolean;
    "cageCode": string;
    "faaLicense": string;
    "taxId": string;
    "parentId": Number;
    "masterCompanyId": Number;
    "isActive": boolean;
    "isDeleted": boolean;
    "createdBy": string;
    "updatedBy": string;
    "createdDate": Date;
    "updatedDate": Date;
    "address1": string;
    "address2": string;
    "poBox": string;
    "country": string;
    "postalCode": string;
    "achId": Number;
    "recordModifiedDate": string;
    "city": string;
    "stateOrProvince": string;
    "nice_name": string;

    constructor() {
        this.legalEntityId = null;
        this.achId = 0;
        this.name = "";
        this.ledgerName = "";
        this.description = "";
        this.doingLegalAs = "";
        this.addressId = 0;
        this.faxNumber = "";
        this.phoneNumber1 = "";
        this.functionalCurrencyId = 0;
        this.reportingCurrencyId = 0;
        this.isBalancingEntity = true;
        this.cageCode = "";
        this.faaLicense = "";
        this.taxId = "";
        this.parentId = 0;
        this.masterCompanyId = 0;
        this.isActive = true;
        this.isDeleted = false;
        this.createdBy = "";
        this.updatedBy = "";
        this.updatedDate = new Date();
        this.createdDate = new Date();
        this.address1 = "";
        this.address2 = "";
        this.poBox = "";
        this.country = "";
        this.postalCode = "";
        this.recordModifiedDate = "";
        this.city = "";
        this.stateOrProvince = "";
        this.nice_name = "";
    }


}