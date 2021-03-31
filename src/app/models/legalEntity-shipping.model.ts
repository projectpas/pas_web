

    export class legalEntityShippingModel
    {
        constructor() {
            this.siteName = "";
            this.address1 = "";
            this.address2 = "";
            this.address3 = "";
            this.city = "";
            this.stateOrProvince = "";
            this.postalCode = "";
            // this.country = "";
            this.countryId = "";
            this.legalEntityId = null;
            this.vendorId = null;
            this.isPrimary = false;
            this.contactTagId = 0
            this.tagName ="";
        }

        public siteName: string;
        public address1: string;
        public address2: string;
        public address3: string;
        public city: string;
        public stateOrProvince: string;
        public postalCode: string;
        // public country: string;
        public countryId: any;
        public legalEntityId: number;
        public vendorId: number;
        public isPrimary: boolean;
        public contactTagId : number;
        public tagName:string
    }
