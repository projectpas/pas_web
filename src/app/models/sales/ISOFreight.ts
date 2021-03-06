export interface ISOFreight {
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
    salesOrderFreightId: number;
    salesOrderQuoteId: number;
    salesOrderId: number;
    salesOrderPartId: string;
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
    masterCompanyId: number;
}
