export interface ICharges{
    Id :string;
    Type :string;
    Description:string;
    Quantity :string;
    UnitCost :string;
    ExtendedCost :string;
    UnitPrice :string;
    ExtendedPrice :string;
    Currency :string;
    Fixrate :string;
    VendorName:string;
    VendorPriceOrUnit :string;
    taskId:string;
    workflowId:string;
    AllowEdit:boolean;
    IsDeleted:boolean;
    Order: number;
}