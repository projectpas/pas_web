import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CustomerService } from '../../../services/customer.service';
import { listSearchFilterObjectCreation } from '../../../generic/autocomplete';
import { ICustomerInvoiceSearchParameters } from '../../../models/sales/ICustomerInvoiceSearchParameters';
import { CustomerInvoiceSearchParameters } from '../../../models/sales/CustomerInvoiceSearchParameters';
import * as moment from 'moment';

@Component({
    selector: 'app-customer-invoice-list',
    templateUrl: './customer-invoice-list.component.html',
    styleUrls: ['./customer-invoice-list.component.scss']
})
export class CustomerInvoiceListComponent {
    breadcrumbs: MenuItem[];
    headers: any[];
    searchParameters: ICustomerInvoiceSearchParameters;
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
    isSpinnerVisible: boolean = false;
    currentStatus: any;

    constructor(private customerService: CustomerService) {
    }

    ngOnInit() {
        this.breadcrumbs = [
            { label: 'Accounts' },
            { label: 'Customer Invoice List' },
        ];

        this.searchParameters = new CustomerInvoiceSearchParameters();
        this.initColumns();
    }

    initColumns() {
        this.headers = [
            { field: "documentType", header: "Document Type", width: "130px" },
            { field: "custName", header: "Cust Name", width: "180px" },
            { field: "customerCode", header: "Cust Num", width: "130px" },
            { field: "docNum", header: "Doc Num", width: "130px" },
            { field: "invoiceDate", header: "Inv Date", width: "130px" },
            { field: "wosoNum", header: "WO/SO Num", width: "130px" },
            { field: "customerReference", header: "Cust Ref", width: "130px" },
            { field: "currencyCode", header: "Currency Code", width: "180px" },
            { field: "fxRate", header: "FX Rate", width: "100px" },
            { field: "originalAmount", header: "Original Amount", width: "100px" },
            { field: "remainingAmount", header: "Remaining Amount", width: "130px" },
            { field: "invDueDate", header: "Inv Due Date", width: "130px" },
            { field: "dsi", header: "DSI", width: "130px" },
            { field: "dso", header: "DSO", width: "180px" },
            { field: "amountPastDue", header: "Amount Past Due", width: "130px" },
            { field: "arBalance", header: "AR Bal", width: "130px" },
            { field: "creditLimit", header: "Credit Limit", width: "130px" },
            { field: "creditTermName", header: "Credit Term", width: "130px" },
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

    loadData(event, globalFilter = "") {
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
            .customerInvoiceSearch(this.searchParameters)
            .subscribe((response: any) => {
                if (response[0].results) {
                    this.customerInvoices = response[0].results
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
}