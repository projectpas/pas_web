import { ISalesSearchParameters } from './ISalesSearchParameters';
export class SalesSearchParameters implements ISalesSearchParameters {
    first: number;
    page: number;
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