import { Component, Input, ViewChild, ElementRef } from "@angular/core";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { StocklineService } from "../../../../../services/stockline.service";
import { CustomPaginate } from "../../../../../models/custom-paginate";
import { StocklineListSalesFilter } from "../../../../../models/sales/StocklineListSalesFilter";
import { listSearchFilterObjectCreation } from "../../../../../generic/autocomplete";
import { StocklineViewComponent } from "../../../../../shared/components/stockline/stockline-view/stockline-view.component";
import { StocklineHistoryComponent } from "../../../../../shared/components/stockline/stockline-history/stockline-history.component";

@Component({
    selector: "app-sales-stockline-part-details-view",
    templateUrl: "./sales-stockline-part-details-view.component.html",
    styleUrls: ["./sales-stockline-part-details-view.component.scss"]
})
export class SalesStockLineDetailsViewComponent {
    @Input() id: number;
    @Input() conditionId: number;
    @Input('part-number') partNumber: string;
    @Input('modal-ref') modal: NgbModalRef;
    modalRef: NgbModalRef;

    loading: boolean = true;
    table: any = {
        value: [],
        first: 0,
        rows: 0,
        columns: [],
        selectedColumns: [],
        selectedColumn: null,
        showPaginator: true,
        totalRecords: 0,
        pageSize: 0,
        totalPages: 0
    }

    customPaginate: CustomPaginate<StocklineListSalesFilter> = new CustomPaginate<StocklineListSalesFilter>();

    columns: any[];

    headers = [
        { field: "partNumber", header: "PN" },
        { field: "partDescription", header: "PN Description" },
        { field: "itemCategory", header: "Item Category", width: "200px", type: "text" },
        { field: "itemGroup", header: "Item Group" },
        { field: "stocklineNumber", header: "SL Num" },
        { field: "serialNumber", header: "Serial Num" },
        { field: "controlId", header: "Control Id" },
        { field: "controlNumber", header: "Control Num" },
        { field: "condition", header: "Cond" },
        { field: "quantityOnHand", header: "Qty On Hand" },
        { field: "quantityAvailable", header: "Qty Avail" },
        { field: "glAccountName", header: "GL Acct" },
        { field: "unitSalesPrice", header: "Unit Sale Price" },
        { field: "saleUnitCost", header: "Sale Unit Cost" }
    ];

    selectedColumns = this.headers;
    showPaginator: boolean = true;

    constructor(
        private modalService: NgbModal,
        private service: StocklineService,
    ) {

        this.customPaginate.filters = new StocklineListSalesFilter();
    }

    ngOnInit() {
        this.loading = true;
    }

    loadData(event) {
        this.loading = true;
        this.customPaginate = { ...event, filters: listSearchFilterObjectCreation(event.filters), globalFilter: '' };
        this.customPaginate.filters.itemMasterId = this.id;
        this.customPaginate.filters.conditionId = this.conditionId;
        this.service.getStockLineSalesListingEndpoint(this.customPaginate).subscribe(response => {
            var result: CustomPaginate<StocklineListSalesFilter> = new CustomPaginate<StocklineListSalesFilter>();
            result = response != null ? { ...response } : result;
            if (result && result.results && result.results.length > 0) {
                this.customPaginate.results = result.results;
                this.customPaginate.totalRecordsCount = result.totalRecordsCount;
                this.customPaginate.resultSetSize = result.resultSetSize;
                this.customPaginate.totalPages = Math.ceil(result.totalRecordsCount / result.rows);
                this.loading = false;
            } else {
                this.customPaginate.totalPages = 0;
                this.loading = false;
            }
        });
    }

    close() {
        if (this.modal) {
            this.modal.close();
        }
    }

    viewStockLine(stockLine: any): void {
        this.modalRef = this.modalService.open(StocklineViewComponent, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modalRef.componentInstance.stockLineId = stockLine.stockLineId;
        this.modalRef.result.then(
            () => { }, () => { }
        );
    }

    viewStockLineHistory(stockLine: any): void {
        this.modalRef = this.modalService.open(StocklineHistoryComponent, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modalRef.componentInstance.stockLineId = stockLine.stockLineId;
        this.modalRef.componentInstance.stockLineNumber = stockLine.stocklineNumber;

        this.modalRef.result.then(
            () => { }, () => { }
        );
    }
}
