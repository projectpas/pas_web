export interface ISalesOrderConversionCritera {
    salesOrderQuoteId: number;

    customerReference: string;

    transferStockline: boolean;

    reserveStockline: boolean;

    transferNotes: boolean;

    transferMemos: boolean;
}