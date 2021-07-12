export interface IExchangeSalesOrderCharge {
    chargesTypeId: number;
    vendorId: number;
    quantity: number;
    markupPercentageId: number;
    description: string;
    unitCost: number;
    extendedCost: number;
    markupFixedPrice: string;
    billingMethodId: number;
    headerMarkupId: number;
    exchangeSalesOrderChargesId: number;
    exchangeSalesOrderId: number;
    exchangeSalesOrderPartId: string;
    billingRate: number;
    billingAmount: number;
    refNum: number;
    masterCompanyId: number;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: string;
    updatedBy: string;
    updatedDate?: Date;
    createdDate?: Date;
    headerMarkupPercentageId: number;
}