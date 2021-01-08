export interface ISalesSearchParameters {
    first: number;
    page: number;
    pageCount: number;
    rows: number;
    limit: number;
    sortOrder: number;
    sortField: number;
    salesQuoteNumber: number;
    columnFilters: {};
    filters: any;
    globalFilter: string;
    customerName: string;
    status: string;
    startDate: string;
    endDate: string;
}