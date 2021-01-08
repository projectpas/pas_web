export class legalEntityInternationalShippingModel {
    constructor() {
        this.exportLicense = "";
        this.startDate = undefined;
        this.amount = '0.00';
        this.isPrimary = false;
        this.description = "";
        this.expirationDate = undefined;
        this.shipToCountryId = null;
        this.countryid=null
    }
    public exportLicense: string;
    public startDate: Date;
    public amount: string;
    public isPrimary: boolean;
    public description: string;
    public expirationDate: Date;
    public shipToCountryId: number;
    public countryid:number;
}

export class legalEntityInternationalShipVia {
    constructor() {
        this.shipVia = '';
        this.shippingAccountInfo = '';
        this.shippingId = '';
        this.shippingURL = '';
        this.memo = '';
        this.isPrimary = false;
        this.shipViaId=null;
        this.countryid=null;
    }
    public shipViaId:number;
    public shipVia: string;
    public shippingAccountInfo: string;
    public shippingId: string;
    public shippingURL: string;
    public memo: string;
    public isPrimary: boolean;
    public countryid:number;

}

