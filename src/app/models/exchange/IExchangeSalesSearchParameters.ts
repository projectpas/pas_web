export interface IExchangeSalesSearchParameters {
    first: number;
    PageNo: number;
    pageCount: number;
    rows: number;
    limit: number;
    sortOrder: number;
    sortField: number;
    exchangeSalesOrderNumber: number;
    columnFilters: {};
    filters: any;
    globalFilter: string;
    customerName: string;
    status: string;
    startDate: string;
    endDate: string;
}