import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { listSearchFilterObjectCreation } from '../../../generic/autocomplete';
import { Subject } from 'rxjs';
import { StocklineService } from '../../../services/stockline.service';



@Component({
    selector: 'app-stock-line-report-view',
    templateUrl: './stock-line-report-view.component.html',
    styleUrls: ['./stock-line-report-view.component.scss']
})
export class StockLineReportViewComponent implements OnInit {

    public stockLineReportList: any[];
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: any;
    totalPages: number;

    private onDestroy$: Subject<void> = new Subject<void>();
    constructor(private router: ActivatedRoute, private stocklineService: StocklineService) { }
    ngOnInit() {

    }

    headers = [
        { field: 'partNumber', header: 'Part Number' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'serialNumber', header: 'S.No' },
        { field: 'stocklineNumber', header: 'Stock Line Number' },
        { field: 'condition', header: 'Condition' },
        { field: 'vendorName', header: 'Vendor Name' },
        { field: 'vendorCode', header: 'Vendor Code' },
        { field: 'quantity', header: 'Quantity' },
        { field: 'qtyAdjusted', header: 'Qty Adjusted' },
        { field: 'poUnitCost', header: 'PO Unit Cost' },
        { field: 'unitPrice', header: 'Unit Price' },
        { field: 'extendedPrice', header: 'Extended Price' },
        { field: 'wareHouse', header: 'Ware House' },
        { field: 'shelf', header: 'Shelf' },
        { field: 'bin', header: 'Bin' },
        { field: 'accountCode', header: 'Account Code' },
        { field: 'purchaseOrderNumber', header: 'PO No' },
        { field: 'repairOrderNumber', header: 'RO No' },
        { field: 'repairOrderUnitCost', header: 'RO Unit Cost' },
        { field: 'receivedDate', header: 'Received Date' },
        { field: 'receiverNumber', header: 'Receiver No' },
        { field: 'reconciliationNumber', header: 'Reconciliation No' },

        
    ]

    loadData(event) {
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.getStockLineReportViewList(event);
    }

    getStockLineReportViewList(data) {
        console.log(data);
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.stocklineService.getStockLineReportViewList(PagingData).pipe(takeUntil(this.onDestroy$)).subscribe((res: any[]) => {
            this.stockLineReportList = res;
            if (res.length > 0) {
                this.totalRecords = res[0].totalRecords;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }

        })
    }

    downloadStockLineReport() {
        
        this.stocklineService.downloadStockLineReport();
    }

    //downloadStockLineReport(event) {

    //    const pageIndex = parseInt(event.first) / event.rows;;
    //    this.pageIndex = pageIndex;
    //    this.pageSize = event.rows;
    //    event.first = pageIndex;
    //    this.downloadStockLineReportList(event);
    //}

    //downloadStockLineReportList(data) {
    //    console.log(data);
    //    const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
    //    this.stocklineService.downloadStockLineReport(PagingData);
    //}
}