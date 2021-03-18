import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ISalesSearchParameters } from '../../../models/sales/ISalesSearchParameters';

@Component({
    selector: 'app-customer-invoice-list',
    templateUrl: './customer-invoice-list.component.html',
    styleUrls: ['./customer-invoice-list.component.scss']
})
export class CustomerInvoiceListComponent {
    breadcrumbs: MenuItem[];
    headers: any[];
    searchParameters: ISalesSearchParameters;
    selectedColumns: any[];
    selectedColumn: any[];
    customerInvoices: any[] = [];
    totalRecords: number = 0;
    totalPages: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    showPaginator: boolean = false;
    lazyLoadEventData: any;
    
    constructor() {
    }

    ngOnInit() {
        this.breadcrumbs = [
            { label: 'Accounts' },
            { label: 'Customer Invoice List' },
        ];

        this.initColumns();
    }

    initColumns() {
        this.headers = [
            { field: "documentType", header: "Document Type", width: "120px" },
            { field: "custName", header: "Cust Name", width: "180px" },
            { field: "custNum", header: "Cust Num", width: "130px" },
            { field: "docNum", header: "Doc Num", width: "130px" },
            { field: "invDate", header: "Inv Date", width: "130px" },
            { field: "wosoNum", header: "WO/SO Num", width: "130px" },
            { field: "custRef", header: "Cust Ref", width: "130px" },
            { field: "currencyCode", header: "Currency Code", width: "180px" },
            { field: "fxRate", header: "FX Rate", width: "100px" },
            { field: "originalAmount", header: "Original Amount", width: "100px" },
            { field: "remainingAmount", header: "Remaining Amount", width: "130px" },
            { field: "invDueDate", header: "Inv Due Date", width: "130px" },
            { field: "dsi", header: "DSI", width: "130px" },
            { field: "dso", header: "DSO", width: "180px" },
            { field: "amountPastDue", header: "Amount Past Due", width: "130px" },
            { field: "arBal", header: "AR Bal", width: "130px" },
            { field: "creditLimit", header: "Credit Limit", width: "130px" },
            { field: "creditTerm", header: "Credit Term", width: "130px" },
            { field: "co", header: "CO", width: "130px" },
            { field: "bu", header: "BU", width: "130px" },
            { field: "div", header: "Div", width: "130px" },
            { field: "dept", header: "Dept", width: "130px" }
        ];
        this.selectedColumns = this.headers;
    }

    globalSearch(val) {
        this.searchParameters.globalFilter = val
        const lazyEvent = this.lazyLoadEventData;
        this.loadData(lazyEvent, val);
    }

    loadData(event, globalFilter = "") { }
}