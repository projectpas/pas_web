
//import { SalesOrderConversionCritera } from './sales-order-conversion-criteria';

export class VerifyExchangeQuoteModel {
    public hasOnlyStockline: Boolean;
    public canCovertToExchangeOrder: Boolean;
    public canTransferStockline: Boolean;
    public canReserveStockline: Boolean;
    //public exchangeOrderConversionCritera: SalesOrderConversionCritera;

    constructor() {
    }


}

export class ExchangeQuoteSettingsModel {
    exchangeQuoteSettingId: Number;
    quoteTypeId: Number;
    validDays: Number;
    masterCompanyId: Number;
    createdBy: String;
    updatedBy: String;
    createdDate: Date = new Date();
    updatedDate: Date = new Date();
    isActive: Boolean = true;
    isDeleted: Boolean = false;
    prefix: String;
    sufix: String;
    startCode: Number;
    currentNumber: Number;
    defaultStatusId: Number;
    defaultPriorityId: Number;
    soqListViewId: Number;
    soqListStatusId: Number;
    isApprovalRule: Boolean = false;
}