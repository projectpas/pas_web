import { ISalesSearchParameters } from './ISalesSearchParameters';
export class SalesSearchParameters implements ISalesSearchParameters {
    first: number;
    PageNo: number;
    pageCount: number;
    rows: number;
    limit: number;
    sortOrder: number;
    sortField: number;
    salesQuoteNumber: number;
    customerName: string;
    status: string;
    startDate: string;
    endDate: string;
    columnFilters: {};
    filters: {};
    globalFilter: string
}