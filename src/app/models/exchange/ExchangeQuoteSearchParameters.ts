import { IExchangeQuoteSearchParameters } from './IExchangeQuoteSearchParameters';
export class ExchangeQuoteSearchParameters implements IExchangeQuoteSearchParameters {
    first: number;
    PageNo: number;
    pageCount: number;
    rows: number;
    limit: number;
    sortOrder: number;
    sortField: number;
    exchangeQuoteNumber: number;
    customerName: string;
    status: string;
    startDate: string;
    endDate: string;
    columnFilters: {};
    filters: {};
    globalFilter: string
}