import { ICustomerInvoiceSearchParameters } from "./ICustomerInvoiceSearchParameters";

export class CustomerInvoiceSearchParameters implements ICustomerInvoiceSearchParameters {
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