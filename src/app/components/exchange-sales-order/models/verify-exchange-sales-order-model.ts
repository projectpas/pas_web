
//import { SalesOrderConversionCritera } from './sales-order-conversion-criteria';

export class VerifyExchangeSalesOrderModel {
    public hasOnlyStockline: Boolean;
    public canCovertToSalesOrder: Boolean;
    public canTransferStockline: Boolean;
    public canReserveStockline: Boolean;
    //public salesOrderConversionCritera: SalesOrderConversionCritera;

    constructor() {
    }


}

export class ExchangeSOQSettingsModel {
    exchangeQuoteSettingId: Number;
    quoteTypeId: Number;
    typeid:number;
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
    soListViewId: Number;
    soListStatusId: Number;
    isApprovalRule: Boolean = false;
    effectiveDate: Date = new Date();
    cogs:number;
    dayForCoreReturn:number;
}

export class ExchangeSOSettingsModel {
    exchangeSalesOrderSettingId: Number;
    typeId: Number;
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
    soListViewId: Number;
    soListStatusId: Number;
    isApprovalRule: Boolean = false;
    effectiveDate: Date = new Date();
    cogs:number;
    dayForCoreReturn:number;
}