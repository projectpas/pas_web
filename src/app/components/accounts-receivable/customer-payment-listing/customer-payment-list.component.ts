import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CustomerService } from '../../../services/customer.service';
import { listSearchFilterObjectCreation } from '../../../generic/autocomplete';
import { ICustomerInvoiceSearchParameters } from '../../../models/sales/ICustomerInvoiceSearchParameters';
import { CustomerInvoiceSearchParameters } from '../../../models/sales/CustomerInvoiceSearchParameters';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-customer-payment-list',
    templateUrl: './customer-payment-list.component.html',
    styleUrls: ['./customer-payment-list.component.scss']
})
export class CustomerPaymentListComponent {
    breadcrumbs: MenuItem[];
    headers: any[];
    searchParameters: ICustomerInvoiceSearchParameters;
    selectedColumns: any[];
    selectedColumn: any[];
    customerPayments: any[] = [];
    totalRecords: number = 0;
    totalPages: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    showPaginator: boolean = false;
    lazyLoadEventData: any;
    isSpinnerVisible: boolean = false;
    currentStatus: any = "0";

    constructor(private customerService: CustomerService,
        private router: Router) {
    }

    ngOnInit() {
        this.breadcrumbs = [
            { label: 'Accounts' },
            { label: 'Customer Invoice List' },
        ];

        this.searchParameters = new CustomerInvoiceSearchParameters();
        this.initColumns();
        this.currentStatus = "1";
    }

    initColumns() {
        this.headers = [
            { field: "receiptNo", header: "Receipt No", width: "130px" },
            { field: "status", header: "Status", width: "180px" },
            { field: "bankAcct", header: "Bank Acct", width: "130px" },
            { field: "openDate", header: "Open Date", width: "130px" },
            { field: "depositDate", header: "Deposit Date", width: "130px" },
            { field: "acctingPeriod", header: "Accting Period", width: "130px" },
            { field: "reference", header: "Reference", width: "130px" },
            { field: "amount", header: "Amount", width: "180px" },
            { field: "amtApplied", header: "Amt Applied", width: "100px" },
            { field: "amtRemaining", header: "Amt Remaining", width: "100px" },
            { field: "currency", header: "Currency", width: "130px" },
            { field: "cntrlNum", header: "Cntrl Num", width: "130px" },
            { field: "level1", header: "CO", width: "130px" },
            { field: "level2", header: "BU", width: "130px" },
            { field: "level3", header: "Div", width: "130px" },
            { field: "level4", header: "Dept", width: "130px" }
        ];
        this.selectedColumns = this.headers;
    }

    globalSearch(val) {
        this.searchParameters.globalFilter = val
        const lazyEvent = this.lazyLoadEventData;
        this.loadData(lazyEvent, val);
    }

    loadData(event, globalFilter = "") {
        event.filters.statusId = this.currentStatus;
        this.searchParameters.first = parseInt(event.first) / event.rows;
        this.searchParameters.rows = event.rows;
        this.searchParameters.sortOrder = event.sortOrder;
        this.searchParameters.sortField = event.sortField;
        this.lazyLoadEventData = event;
        this.searchParameters.filters = listSearchFilterObjectCreation(
            event.filters
        );

        this.searchParameters.filters = {
            ...this.searchParameters.filters
        }

        this.searchParameters.globalFilter = globalFilter;
        this.onSearch();
    }

    onSearch() {
        this.isSpinnerVisible = true;
        this.customerService
            .customerPaymentSearch(this.searchParameters)
            .subscribe((response: any) => {
                if (response[0].results) {
                    this.customerPayments = response[0].results
                        .map(x => {
                            return {
                                ...x
                            }
                        });

                    this.totalRecords = response[0].totalRecordsCount;
                    this.totalPages = Math.ceil(
                        this.totalRecords / this.searchParameters.rows
                    );
                    this.showPaginator = this.totalRecords > 0;
                }
                this.isSpinnerVisible = false;
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    changeOfStatus(status) {
        const lazyEvent = this.lazyLoadEventData;
        this.currentStatus = status.toString() === '' ? this.currentStatus : status.toString();
        this.loadData(this.lazyLoadEventData);
    }

    convertDate(key, data) {
        if (key === 'requestedDateType' && data[key]) {
            return data['requestedDateType'] !== 'Multiple' ? moment(data['requestedDate']).format('MM-DD-YYYY') : data['requestedDateType'];
        }
        else if (key === 'estimatedShipDateType' && data[key]) {
            return data['estimatedShipDateType'] !== 'Multiple' ? moment(data['estimatedShipDate']).format('MM-DD-YYYY') : data['estimatedShipDateType'];
        } else {
            return data[key];
        }
    }

    onPaging(event, globalFilter = "") {
        event.filters.statusId = this.currentStatus;
        this.searchParameters.first = parseInt(event.first) / event.rows;

        this.searchParameters.rows = event.rows;

        this.searchParameters.sortOrder = event.sortOrder;
        this.searchParameters.sortField = event.sortField;
        this.lazyLoadEventData = event;

        this.searchParameters.filters = listSearchFilterObjectCreation(
            event.filters
        );
        this.searchParameters.filters = {
            ...this.searchParameters.filters
        }

        this.searchParameters.globalFilter = globalFilter;
    }

    openOrderToEdit(row) {
        this.isSpinnerVisible = true;
        let receiptId = row.receiptID;
        this.router.navigateByUrl(
            `accountreceivable/accountreceivablepages/process-customer-payment/${receiptId}`
        );
    }

    viewSelectedRow(viewOrder, rowData) {
    }

    getAuditHistoryById(soHistory, rowData) { }
}