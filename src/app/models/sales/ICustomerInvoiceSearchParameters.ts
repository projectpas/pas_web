export interface ICustomerInvoiceSearchParameters {
    first: number;
    PageNo: number;
    pageCount: number;
    rows: number;
    limit: number;
    sortOrder: number;
    sortField: number;
    columnFilters: {};
    filters: any;
    globalFilter: string;
    customerName: string;
    status: string;
}