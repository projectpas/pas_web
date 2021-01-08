// export class Address {

//     public siteName: string;
//     public address: AddressNew[];

// }

export class AddressNew {
    public siteName: string;
    public line1: string;
    public line2: string;
    public line3: string;
    public city: string;
    public stateOrProvince: string;
    public postalCode: string;
    public country: any;
    public countryId: any;

    constructor() {
        this.siteName = ''
        this.line1 = ''
        this.line2 = ''
        this.line3 = ''
        this.city = ''
        this.stateOrProvince = ''
        this.postalCode = ''
        this.country = {}
        this.countryId = null
    }
}