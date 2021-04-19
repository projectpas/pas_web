import { PartSearchParamters } from "./part-search-parameters";

export class ItemMasterSearchQuery {
    public first: number;
    public page: number;
    public pageCount: number;
    public rows: number;
    public limit: number;
    public sortOrder: number;
    public sortField: string;
    public partSearchParamters: PartSearchParamters;
    public multiPartSearchParamters:PartSearchParamters[];

    constructor() {
        this.partSearchParamters = new PartSearchParamters();
        this.init();
    }

    private init() {
        this.first = 0;
        this.rows = 10;
        this.limit = 5;
        this.pageCount = 10;
        this.page = 10;
    }
}
