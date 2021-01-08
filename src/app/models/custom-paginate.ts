export class CustomPaginate<T>
{

    first: number;
    pageNo: number;
    rows: number;
    sortField: string;
    sortOrder: number;
    resultSetSize: number;
    totalRecordsCount: number;
    globalFilter: string;
    filters: T;
    results: T[];
    totalPages: number;

    constructor() {
        this.first = 0;
        this.rows = 10;
        this.sortField = '';
        this.sortOrder = 1;
        this.results = [];
        this.globalFilter = '';
    }
}