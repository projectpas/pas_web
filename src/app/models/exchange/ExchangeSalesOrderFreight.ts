import { IExchangeSalesOrderFreight } from "./IExchangeSalesOrderFreight";

export class ExchangeSalesOrderFreight implements IExchangeSalesOrderFreight {
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
    exchangeSalesOrderFreightId: number;
    exchangeSalesOrderId: number;
    exchangeSalesOrderPartId: string;
    markupPercentageId: number;
    markupFixedPrice: number;
    masterCompanyId: number;
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
    constructor() {
        this.shipViaId = null;
        this.length = null;
        this.width = null;
        this.height = null;
        this.weight = null;
        this.memo = '';
        this.amount = null;
        this.uomId = null;
        this.dimensionUOMId = null;
        this.currencyId = null;
        this.exchangeSalesOrderFreightId = 0;
        this.exchangeSalesOrderId = null;
        this.exchangeSalesOrderPartId = null;
        this.markupPercentageId = null;
        this.markupFixedPrice = null;
        this.headerMarkupId = null;
        this.billingAmount = null;
        this.billingMethodId = null;
        this.billingRate = null;
        this.isActive = true;
        this.isDeleted = false;
        this.createdBy = '';
        this.updatedBy = '';
        this.createdDate = new Date();
        this.updatedDate = new Date();
        this.headerMarkupPercentageId = null;
    }
}