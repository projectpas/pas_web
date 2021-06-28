import { IExchangeSalesSearchParameters } from './IExchangeSalesSearchParameters';
export class ExchangeSalesSearchParameters implements IExchangeSalesSearchParameters {
    first: number;
    PageNo: number;
    pageCount: number;
    rows: number;
    limit: number;
    sortOrder: number;
    sortField: number;
    exchangeSalesOrderNumber: number;
    customerName: string;
    status: string;
    startDate: string;
    endDate: string;
    columnFilters: {};
    filters: {};
    globalFilter: string
}