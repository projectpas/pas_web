import { ILogSearchParameters } from './ILogSearchParameters';
export class LogSearchParameters implements ILogSearchParameters {
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
    exception: string;
    message: string;
    messageTemplate: string;
    properties: string;
    level: string;
    timestamp: string;
}