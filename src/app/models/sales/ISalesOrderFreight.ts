export interface ISalesOrderFreight {
    shipViaId: number;
    length: number;
    width: number;
    height: number;
    weight: number;
    memo: string;
    amount: number;
    uomId: number;
    dimensionUOMId: number;
    currencyId: number;
    salesOrderQuoteFreightId: number;
    salesOrderQuoteId: number;
    salesOrderQuotePartId: string;
    markupPercentageId: number;
    markupFixedPrice: number;
    headerMarkupId: number;
    billingMethodId: number;
    billingRate: number;
    billingAmount: number;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: string;
    updatedBy: string;
    updatedDate?: Date;
    createdDate?: Date;
    headerMarkupPercentageId: number;
}
