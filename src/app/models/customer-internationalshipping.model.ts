export class CustomerInternationalShippingModel {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor() {

        this.exportLicense = "";
        this.startDate = null;
        this.amount = null;
        this.isPrimary = false;
        this.description = "";
        this.expirationDate = undefined;
        this.shipToCountryId = null;


    }
    public exportLicense: string;
    public startDate: Date;
    public amount: number;
    public isPrimary: boolean;
    public description: string;
    public expirationDate: Date;
    public shipToCountryId: number;


    // public long InternationalShippingId { get; set; }
    // public long CustomerId { get; set; }
    // public string ExportLicense { get; set; }
    // public DateTime StartDate { get; set; }
    // public decimal? Amount { get; set; }
    // public bool IsPrimary { get; set; }
    // public string Description { get; set; }
    // public DateTime ExpirationDate { get; set; }
    // public long ShipToCountryId { get; set; }
    // public bool IsShippingViaDetails { get; set; }
    // public int MasterCompanyId { get; set; }
    // public string CreatedBy { get; set; }
    // public string UpdatedBy { get; set; }
    // public DateTime CreatedDate { get; set; }
    // public DateTime UpdatedDate { get; set; }
    // public bool IsActive { get; set; }
    // public bool IsDeleted { get; set; }

    // [NotMapped]
    // public string ShipToCountry { get; set; }

}

export class CustomerInternationalShipVia{
    constructor(){

        this.shipVia = '';
        this.shipViaId = null;
        this.shippingAccountInfo = '';
        this.shippingId = '';
        this.shippingURL = '';
        this.memo = '';
        this.isPrimary = false;
        this.ShippingViaId = 0;

    }
    public shipVia : string;
    public shipViaId : number;
    public ShippingViaId : number;
    public shippingAccountInfo:string;
    public shippingId: string;
    public shippingURL: string;
    public memo: string;
    public isPrimary: boolean;
    

}

