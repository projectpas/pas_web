import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
declare var $: any;
import { SalesQuoteService } from "../../../../services/salesquote.service";
import { ISalesSearchParameters } from "../../../../models/sales/ISalesSearchParameters";
import { SalesSearchParameters } from "../../../../models/sales/SalesSearchParameters";
import {
    AlertService,
    MessageSeverity
} from "../../../../services/alert.service";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { ISalesQuote } from "../../../../models/sales/ISalesQuote.model";
import { SalesQuote } from "../../../../models/sales/SalesQuote.model";
import { ISalesOrderQuote } from "../../../../models/sales/ISalesOrderQuote";
import { ISalesQuoteView } from "../../../../models/sales/ISalesQuoteView";
import { SalesOrderQuote } from "../../../../models/sales/SalesOrderQuote";
import { CurrencyService } from "../../../../services/currency.service";
import { EmployeeService } from "../../../../services/employee.service";
import { CustomerService } from "../../../../services/customer.service";
import { CommonService } from "../../../../services/common.service";
import { AuthService } from "../../../../services/auth.service";
import { listSearchFilterObjectCreation } from "../../../../generic/autocomplete";
import * as moment from 'moment';
import { MenuItem } from "primeng/api";
import { forkJoin } from "rxjs/observable/forkJoin";
import { DatePipe } from "@angular/common";
import { AuditHistory } from "../../../../models/audithistory.model";

@Component({
    selector: "app-sales-quote-list",
    templateUrl: "./sales-quote-list.component.html",
    styleUrls: ["./sales-quote-list.component.css"]
})
export class SalesQuoteListComponent implements OnInit {
    @ViewChild("dt", { static: false })
    isEnablePOList: any;
    searchParameters: ISalesSearchParameters;
    sales: any[] = [];
    selected: any;
    selectedQuoteToDelete: any;
    modal: NgbModalRef;
    partModal: NgbModalRef;
    headers: any[];
    columns: any[];
    selectedColumns: any[];
    selectedColumn: any[];
    totalRecords: number = 0;
    totalPages: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    showPaginator: boolean = false;
    isSpinnerVisible: boolean = true;
    partColumns: any[];
    currentDeletedstatus = false;
    customerDetails: any;
    salesQuote: ISalesQuote;
    salesOrderQuote: ISalesOrderQuote;
    salesQuoteView: ISalesQuoteView;
    selectedParts: any[] = [];
    creditTerms: any[];
    percents: any[];
    allCurrencyInfo: any[];
    allEmployeeinfo: any[] = [];
    customerWarningData: any = [];
    accountTypes: any[];
    customerId: any;
    salesQuoteId: any;
    statusList: any = [];
    settingsList: any = [];
    lazyLoadEventData: any;
    currentStatus: any = "0";
    viewType: any = 'pnview';
    breadcrumbs: MenuItem[];
    auditHistory: AuditHistory[];
    home: any;
    selectedOnly: boolean = false;
    targetData: any;
    isSettingsReceived = false;
    @ViewChild("filterStatusInput", { static: false }) public filterText: ElementRef;
    clearStatusText: boolean = false;
    salesOrderQuoteId: any;

    constructor(
        private salesQuoteService: SalesQuoteService,
        private alertService: AlertService,
        private modalService: NgbModal,
        private router: Router,
        public employeeService: EmployeeService,
        private commonservice: CommonService,
        public currencyService: CurrencyService,
        private authService: AuthService,
        private datePipe: DatePipe
    ) { }

    ngOnInit() {
        this.isSpinnerVisible = true;
        this.breadcrumbs = [
            { label: 'Sales Order Quote' },
            { label: 'Sales Order Quote List' },
        ];
        this.salesQuote = new SalesQuote();
        this.salesOrderQuote = new SalesOrderQuote();
        this.searchParameters = new SalesSearchParameters();

        this.initColumns();
        this.getStatusList();
    }

    closeDeleteModal() {
        $("#downloadConfirmation").modal("hide");
    }

    get userName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.userName
            : "";
    }

    get userId() {
        return this.authService.currentUser ? this.authService.currentUser.id : 0;
    }

    initColumns() {
        this.headers = [
            { field: "customerName", header: "Customer Name", width: "160px" },
            { field: "salesOrderQuoteNumber", header: "Quote Num", width: "120px" },
            { field: "quoteDate", header: "Quote Date", width: "120px" },
            { field: "partNumberType", header: "PN", width: "130px" },
            { field: "partDescriptionType", header: "PN Description", width: "200px" },
            { field: "salesOrderNumber", header: "SO Num", width: "120px" },
            { field: "status", header: "Qte Status", width: "100px" },
            { field: "customerType", header: "Customer Type", width: "120px" },
            { field: "versionNumber", header: "Quote Ver Num", width: "120px" },
            { field: "quoteAmount", header: "Quote Amount", width: "110px", style: "text-align:right" },
            { field: "soAmount", header: "SO Amount", width: "110px", style: "text-align:right" },
            { field: "priorityType", header: "Priority", width: "100px" },
            { field: "customerReference", header: "Cust Ref", width: "130px" },
            { field: "salesPerson", header: "Salesperson", width: "150px" },
            { field: "createdDate", header: "Created Date", width: "120px" },
            { field: "createdBy", header: "CreatedBy", width: "130px" },
            { field: "updatedDate", header: "Updated Date", width: "120px" },
            { field: "updatedBy", header: "UpdatedBy", width: "130px" }
        ];
        this.selectedColumns = this.headers;
    }

    getDeleteListByStatus(value) {
        this.currentDeletedstatus = value;
        this.pageIndex = this.searchParameters.rows > 10 ? this.searchParameters.first / this.searchParameters.rows : 0;
        this.pageSize = this.searchParameters.rows;
        this.searchParameters.first = this.pageIndex;

        if (this.currentDeletedstatus == true) {
            this.searchParameters.filters = { ...this.searchParameters.filters, isDeleted: this.currentDeletedstatus };
            this.isSpinnerVisible = true;
            this.onSearch();
        } else {
            this.searchParameters.filters = { ...this.searchParameters.filters, isDeleted: this.currentDeletedstatus };
            this.isSpinnerVisible = true;
            this.onSearch();
        }
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
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

        if (this.clearStatusText) {
            this.searchParameters.filters.status = '';
            this.clearStatusText = false;
        }

        this.searchParameters.filters.masterCompanyId = this.currentUserMasterCompanyId;

        this.searchParameters.filters = {
            ...this.searchParameters.filters,
            isDeleted: this.currentDeletedstatus,
            viewType: this.viewType
        }

        this.searchParameters.globalFilter = globalFilter;
        if (this.isSettingsReceived) {
            this.onSearch();
        }
    }

    globalSearch(val) {
        this.searchParameters.globalFilter = val
        const lazyEvent = this.lazyLoadEventData;
        this.loadData(lazyEvent, val);
    }
    onSearch() {
        this.isSpinnerVisible = true;
        this.salesQuoteService
            .search(this.searchParameters)
            .subscribe((response: any) => {
                if (response[0].results) {
                    this.sales = response[0].results
                        .map(x => {
                            return {
                                ...x,
                                quoteDate: x.quoteDate ? this.datePipe.transform(x.quoteDate, 'MM/dd/yyyy') : '',
                                createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                                updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
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

    closeModal() {
        //$("#downloadConfirmation").modal("hide");
        this.modal.close();
    }

    dismissModel() {
        this.modal.close();
    }

    openDelete(content, rowData) {
        this.selected = rowData.salesOrderQuoteId;
        this.selectedQuoteToDelete = rowData.salesOrderQuoteNumber;
        this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
    }

    deleteQuote(): void {
        this.isSpinnerVisible = true;
        this.salesQuoteService.delete(this.selected).subscribe(response => {
            this.isSpinnerVisible = false;
            this.modal.close();
            this.alertService.showMessage(
                "Success",
                `Quote removed successfully.`,
                MessageSeverity.success
            );
            this.onSearch();
        }, error => {
            this.isSpinnerVisible = false;
        });
    }

    openQuoteToEdit(row) {
        this.isSpinnerVisible = true;
        this.salesOrderQuoteId = row.salesOrderQuoteId;
        let customerId = row.customerId;
        this.router.navigateByUrl(
            `salesmodule/salespages/sales-quote-edit/${customerId}/${this.salesOrderQuoteId}`
        );
    }

    viewSelectedRow(content, row) {
        this.isSpinnerVisible = true;
        this.salesQuoteService.getview(row.salesOrderQuoteId).subscribe(res => {
            this.salesQuoteView = res[0];
            this.modal = this.modalService.open(content, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
            this.isSpinnerVisible = false;
        }, error => {
            this.isSpinnerVisible = false;
        });
    }

    getStatusList() {
        forkJoin(this.commonservice.smartDropDownList("MasterSalesOrderQuoteStatus", "Id", "Name"),
            this.salesQuoteService.getAllSalesOrderQuoteSettings(this.currentUserMasterCompanyId)).subscribe(res => {
                this.statusList = res[0];
                this.settingsList = res[1];
                if (this.settingsList.length > 0) {
                    if (this.settingsList[0].soqListViewId == 1) {
                        this.viewType = 'pnview';
                    } else {
                        this.viewType = 'soqview';
                    }
                    this.currentStatus = this.settingsList[0].soqListStatusId.toString();
                }
                this.searchParameters.filters = {
                    ...this.searchParameters.filters,
                    isDeleted: this.currentDeletedstatus,
                    viewType: this.viewType
                }
                this.isSettingsReceived = true;
                this.changeOfStatus(this.currentStatus, this.viewType);
            }, error => {
                this.isSettingsReceived = true;
                this.isSpinnerVisible = false;
            });
    }

    changeOfStatus(status, viewType) {
        const lazyEvent = this.lazyLoadEventData;
        this.currentStatus = status.toString() === '' ? this.currentStatus : status.toString();

        this.viewType = viewType === '' ? this.viewType : viewType;
        this.loadData(this.lazyLoadEventData);
    }

    clearText(currentStatus) {
        this.clearStatusText = true;
        if (currentStatus != "0" && this.filterText != undefined) {
            this.filterText.nativeElement.value = '';
        }
    }

    mouseOverData(key, data) {
        if (key === 'partNumberType') {
            return data['partNumber']
        } else if (key === 'partDescriptionType') {
            return data['partDescription']
        } else if (key === 'priorityType') {
            return data['priority']
        }
        else if (key === 'quoteDate' && data[key]) {
            return moment(data['quoteDate']).format('MM-DD-YYYY');
        } else if (key === 'createdDate' && data[key]) {
            return moment(data['createdDate']).format('MM-DD-YYYY');
        } else if (key === 'updatedDate' && data[key]) {
            return moment(data['updatedDate']).format('MM-DD-YYYY');
        }
        else {
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
            ...this.searchParameters.filters,
            isDeleted: this.currentDeletedstatus,
            viewType: this.viewType
        }

        this.searchParameters.globalFilter = globalFilter;

    }

    convertDate(key, data) {
        // if ((key === 'quoteDate' || key === 'updatedDate' || key === 'createdDate') && data[key]) {
        //   return moment(data[key]).format('MM-DD-YYYY');
        // } else {
        //   return data[key];
        // }
        return data[key];
    }

    getColorCodeForMultiple(data) {
        return data['partNumberType'] === 'Multiple' ? 'green' : 'black';
    }

    exportCSV(dt) {
        this.isSpinnerVisible = true;
        const isdelete = this.currentDeletedstatus ? true : false;
        let PagingData;
        //PagingData = { "filters": { "statusId": "0", "viewType": "pnview", "isDeleted": this.currentDeletedstatus }, "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "globalFilter": "" };
        PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "StatusId": this.currentStatus, "isDeleted": isdelete, "ViewType": this.viewType, "masterCompanyId": this.currentUserMasterCompanyId }, "globalFilter": "" }
        let filters = Object.keys(dt.filters);
        filters.forEach(x => {
            PagingData.filters[x] = dt.filters[x].value;
        });

        this.salesQuoteService
            .search(PagingData).subscribe(res => {
                const vList = res[0]['results'].map(x => {
                    return {
                        ...x,
                        quoteDate: x.quoteDate ? this.datePipe.transform(x.quoteDate, 'MMM-dd-yyyy') : '',
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                        updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
                    }
                });

                dt._value = vList;
                dt.exportCSV();
                dt.value = this.sales;
                this.modal.close();
                this.isSpinnerVisible = false;
            }, err => {
                this.isSpinnerVisible = false;
            });

    }
    closeHistoryModal() {
        this.modal.close();
    }

    openHistoryPopup(content) {
        this.modal = this.modalService.open(content, { size: 'xl', backdrop: 'static', keyboard: false });
    }

    getAuditHistoryById(rowData) {
        this.isSpinnerVisible = true;
        this.salesQuoteService.getSOQHistory(rowData.salesOrderQuoteId).subscribe(res => {
            this.auditHistory = res;
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }
    getColorCodeForHistory(i, field, value) {
        const data = this.auditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    restorerecord: any = {}

    restoreRecord() {
        this.commonservice.updatedeletedrecords('SalesOrderQuote', 'SalesOrderQuoteId', this.restorerecord.salesOrderQuoteId).subscribe(res => {
            this.getDeleteListByStatus(true)
            this.modal.close();
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        }, err => {
            this.isSpinnerVisible = false;
        });
    }
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openDownload(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
}
