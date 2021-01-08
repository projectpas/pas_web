
export class SalesOrderConversionCritera {


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
    public salesOrderQuoteId: Number;
    public customerReference: String;
    public transferStockline: Boolean;
    public canReserveStockline: Boolean;
    public reserveStockline: Boolean;
    public transferNotes: Boolean;
    public transferMemos: Boolean;
    public transferFreight: Boolean;
    public transferCharges: Boolean;


    constructor() {
    }


}