export interface ISalesOrderQuoteCharge {
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
    salesOrderQuoteChargesId: number;
    salesOrderQuoteId: number;
    salesOrderQuotePartId: string;
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
