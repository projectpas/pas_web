import { IExchangeQuoteCharge } from "./IExchangeQuoteCharge";

export class ExchangeQuoteCharge implements IExchangeQuoteCharge {
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
    exchangeQuoteChargesId: number;
    exchangeQuoteId: number;
    exchangeQuotePartId: string;
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
    constructor() {
        this.exchangeQuoteChargesId = 0;
        this.isDeleted = false;
        this.isActive = true;
    }
}
