
import { SalesOrderConversionCritera } from './sales-order-conversion-criteria';

export class VerifySalesQuoteModel {


    // {
    //     "hasOnlyStockline":true,
    //     "canCovertToSalesOrder": true,
    //      "canTransferStockline": true,  
    //      "canReserveStockline" : false, 
    //     "salesOrderConversionCritera":{
    //        "salesOrderQuoteId":59,
    //        "customerReference":null,
    //        "transferStockline":false,
    //        "reserveStockline":false,
    //        "transferNotes":false,
    //        "transferMemos":false
    //     },
    //     "errors":[

    //     ],
    //     "warnings":[

    //     ]
    //  }
    public hasOnlyStockline: Boolean;
    public canCovertToSalesOrder: Boolean;
    public canTransferStockline: Boolean;
    public canReserveStockline: Boolean;
    public salesOrderConversionCritera: SalesOrderConversionCritera;

    constructor() {
        // this.salesOrderConversionCritera = new SalesOrderConversionCritera()
    }


}

export class SOQSettingsModel {
    salesOrderQuoteSettingId: Number;
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
    effectiveDate: Date = new Date();
}

export class SOSettingsModel {
    salesOrderQuoteSettingId: Number;
    typeId: Number;
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
}