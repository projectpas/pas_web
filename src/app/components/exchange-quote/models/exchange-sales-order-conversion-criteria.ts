
export class ExchangeSalesOrderConversionCritera {
    public exchangeQuoteId: Number;
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