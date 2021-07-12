import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuItem } from "primeng/api";
import { IExchangeQuoteSearchParameters } from "../../../models/exchange/IExchangeQuoteSearchParameters";
import { ExchangeQuoteSearchParameters } from "../../../models/exchange/ExchangeQuoteSearchParameters";
import { ExchangequoteService } from "../../../services/exchangequote.service";
import {
  AlertService,
  MessageSeverity
} from "../../../services/alert.service";
declare var $: any;
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { CurrencyService } from "../../../services/currency.service";
import { EmployeeService } from "../../../services/employee.service";
import { CommonService } from "../../../services/common.service";
import { AuthService } from "../../../services/auth.service";
import { listSearchFilterObjectCreation } from "../../../generic/autocomplete";
import * as moment from 'moment';
import { DatePipe } from "@angular/common";
import { forkJoin } from "rxjs/observable/forkJoin";
import { AuditHistory } from "../../../models/audithistory.model";
import { IExchangeQuoteView } from "../../../models/exchange/IExchangeQuoteView";
@Component({
  selector: 'app-exchange-quote-list',
  templateUrl: './exchange-quote-list.component.html',
  styleUrls: ['./exchange-quote-list.component.scss']
})
export class ExchangeQuoteListComponent implements OnInit {
  breadcrumbs: MenuItem[];
  searchParameters: IExchangeQuoteSearchParameters;
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
  statusList: any = [];
  currentDeletedstatus = false;
  lazyLoadEventData: any;
  currentStatus: any = "0";
  clearStatusText: boolean = false;
  exchanges: any[] = [];
  @ViewChild("filterStatusInput", { static: false }) public filterText: ElementRef;
  exchangeQuoteId: any;
  selected: any;
  selectedQuoteToDelete: any;
  modal: NgbModalRef;
  auditHistory: AuditHistory[];
  exchangeQuoteView: IExchangeQuoteView;
  constructor(private exchangequoteService: ExchangequoteService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router,
    public employeeService: EmployeeService,
    private commonservice: CommonService,
    public currencyService: CurrencyService,
    private authService: AuthService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.breadcrumbs = [
      { label: 'Exchange Quote' },
      { label: 'Exchange Quote List' },
    ];
    this.searchParameters = new ExchangeQuoteSearchParameters();
    this.initColumns();
    this.getStatusList();
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  get userId() {
    return this.authService.currentUser ? this.authService.currentUser.id : 0;
  }

  get currentUserMasterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : null;
  }

  initColumns() {
    this.headers = [
      { field: "exchangeQuoteNumber", header: "Exch Num", width: "120px" },
      { field: "customerName", header: "Cust Name", width: "180px" },
      { field: "customerReference", header: "Customer Ref", width: "130px" },
      { field: "versionNumber", header: "Quote Ver Num", width: "130px" },
      //{ field: "quoteExpireDate", header: "Quote Exp Date", width: "130px" },
      { field: "partNumberType", header: "PN", width: "130px" },
      { field: "partDescriptionType", header: "PN Description", width: "180px" },
      { field: "status", header: "Status", width: "100px" },
      { field: "priorityType", header: "Priority", width: "100px" },
      { field: "openDate", header: "Open Date", width: "130px" },
      //{ field: "customerRequestDateType", header: "Request Date", width: "130px" },
      //{ field: "estimateShipDateType", header: "Est. Ship Date", width: "130px" },
      //{ field: "salesPerson", header: "Sales Person", width: "180px" },
      { field: "createdDate", header: "Created Date", width: "130px" },
      { field: "createdBy", header: "Created By", width: "130px" },
      { field: "updatedDate", header: "Updated Date", width: "130px" },
      { field: "updatedBy", header: "Updated By", width: "130px" }
    ];
    this.selectedColumns = this.headers;
  }
  arrayStatuslist: any[] = [];
  getStatusList() {
    if (this.arrayStatuslist.length == 0) {
      this.arrayStatuslist.push(0);
    }
    forkJoin(this.commonservice.autoSuggestionSmartDropDownList("ExchangeStatus", "ExchangeStatusId", "Name", '', true, 20, this.arrayStatuslist.join(), this.currentUserMasterCompanyId),
      //this.salesService.getAllSalesOrderSettings()
      ).subscribe(res => {
        this.statusList = res[0];
        this.currentStatus = "1";
        this.searchParameters.filters = {
          ...this.searchParameters.filters,
          isDeleted: this.currentDeletedstatus,
          //viewType: this.viewType
        }
        //this.isSettingsReceived = true;
        this.changeOfStatus(this.currentStatus);
      }, error => {
        //this.isSettingsReceived = true;
        this.isSpinnerVisible = false;
      });
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

    this.searchParameters.filters = {
      ...this.searchParameters.filters,
      isDeleted: this.currentDeletedstatus,
      //viewType: this.viewType
    }

    this.searchParameters.filters.masterCompanyId = this.currentUserMasterCompanyId;
    this.searchParameters.globalFilter = globalFilter;
    //if (this.isSettingsReceived) {
      this.onSearch();
    //}
  }

  onSearch() {
    this.isSpinnerVisible = true;
    this.exchangequoteService
      .search(this.searchParameters)
      .subscribe((response: any) => {
        if (response[0].results) {
          this.exchanges = response[0].results
            .map(x => {
              return {
                ...x,
                quoteExpireDate: x.quoteExpireDate ? this.datePipe.transform(x.quoteExpireDate, 'MM/dd/yyyy') : '',
                createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                customerRequestDateType: moment(x.customerRequestDateType).format('MM-DD-YYYY') == '01-01-0001' ? '' : (x.customerRequestDateType && x.customerRequestDateType != 'Multiple' ? this.datePipe.transform(x.customerRequestDateType, 'MMM-dd-yyyy hh:mm a') : ''),
                estimateShipDateType: moment(x.estimateShipDateType).format('MM-DD-YYYY') == '01-01-0001' ? '' : (x.estimateShipDateType && x.estimateShipDateType != 'Multiple' ? this.datePipe.transform(x.estimateShipDateType, 'MMM-dd-yyyy hh:mm a') : '')
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

    //this.viewType = viewType === '' ? this.viewType : viewType;
    this.loadData(this.lazyLoadEventData);
  }

  getColorCodeForMultiple(data) {
    return data['partNumberType'] === 'Multiple' ? 'green' : 'black';
  }

  mouseOverData(key, data) {
    if (key === 'partNumberType') {
      return data['partNumber']
    } else if (key === 'partDescriptionType') {
      return data['partDescription']
    } else if (key === 'priorityType') {
      return data['priority']
    }
    else if (key === 'quoteExpireDatequoteDate' && data[key]) {
      return moment(data['quoteExpireDatequoteDate']).format('MM-DD-YYYY');
    } else if (key === 'openDate' && data[key]) {
      return moment(data['openDate']).format('MM-DD-YYYY');
    } else if (key === 'createdDate' && data[key]) {
      return moment(data['createdDate']).format('MM-DD-YYYY');
    } else if (key === 'updatedDate' && data[key]) {
      return moment(data['updatedDate']).format('MM-DD-YYYY');
    } else if (key === 'customerRequestDateType' && data[key]) {
      return this.convertmultipleDates(data['customerRequestDateType']);
    } else if (key === 'estimateShipDateType' && data[key]) {
      return this.convertmultipleDates(data['estimateShipDateType']);
    } else {
      return data[key]
    }
  }

  convertmultipleDates(value) {
    const arrDates = [];
    const arr = value.split(',');
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        arrDates.push(moment(arr[i]).format('MM-DD-YYYY'));
      }
    }
    return arrDates;
  }

  convertDate(key, data) {
    if (key === 'customerRequestDateType' && data[key]) {
      return data['customerRequestDateType'] !== 'Multiple' ? moment(data['customerRequestDateType']).format('MM-DD-YYYY') : data['customerRequestDateType'];
    }
    else if (key === 'estimateShipDateType' && data[key]) {
      return data['estimateShipDateType'] !== 'Multiple' ? moment(data['estimateShipDateType']).format('MM-DD-YYYY') : data['estimateShipDateType'];
    } else {
      return data[key];
    }
  }

  clearText(currentStatus) {
    this.clearStatusText = true;
    if (currentStatus != "0" && this.filterText != undefined) {
      this.filterText.nativeElement.value = '';
    }
  }

  openExchangeQuoteToEdit(row) {
    this.isSpinnerVisible = true;
    const { exchangeQuoteId } = row;
    let customerId = row.customerId;
    this.router.navigateByUrl(
      `exchangemodule/exchangepages/exchange-quote-edit/${customerId}/${exchangeQuoteId}`
    );
  }

  openDelete(content, rowData) {
    this.selected = rowData.exchangeQuoteId;
    this.selectedQuoteToDelete = rowData.exchangeQuoteNumber;
    this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
  }

  deleteQuote(): void {
    this.isSpinnerVisible = true;
    this.exchangequoteService.delete(this.selected).subscribe(response => {
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

  restorerecord: any = {}

    restoreRecord() {
        this.commonservice.updatedeletedrecords('ExchangeQuote', 'ExchangeQuoteId', this.restorerecord.exchangeQuoteId).subscribe(res => {
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

  exportCSV(dt) {
    this.isSpinnerVisible = true;
    const isdelete = this.currentDeletedstatus ? true : false;
    let PagingData;
    PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "StatusId": this.currentStatus, "isDeleted": isdelete, "ViewType": '', "masterCompanyId": this.currentUserMasterCompanyId }, "globalFilter": "" }
    let filters = Object.keys(dt.filters);
    filters.forEach(x => {
        PagingData.filters[x] = dt.filters[x].value;
    });

    this.exchangequoteService
        .search(PagingData).subscribe(res => {
            const vList = res[0]['results'].map(x => {
                return {
                    ...x,
                    createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                    updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
                }
            });

            dt._value = vList;
            dt.exportCSV();
            dt.value = this.exchanges;
            this.modal.close();
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        });
  }

  closeHistoryModal() {
    this.modal.close();
  }

  getAuditHistoryById(rowData) {
    this.isSpinnerVisible = true;
    this.exchangequoteService.getExchangeQuoteHistory(rowData.exchangeQuoteId).subscribe(res => {
        this.auditHistory = res;
        this.isSpinnerVisible = false;
    }, err => {
        this.isSpinnerVisible = false;
    });
  }

  openHistoryPopup(content) {
    this.modal = this.modalService.open(content, { size: 'xl', backdrop: 'static', keyboard: false });
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
  dismissModel() {
    this.modal.close();
  }

  viewSelectedRow(content, row) {
    this.isSpinnerVisible = true;
    this.exchangequoteService.getview(row.exchangeQuoteId).subscribe(res => {
        this.exchangeQuoteView = res[0];
        this.modal = this.modalService.open(content, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
        this.isSpinnerVisible = false;
    }, error => {
        this.isSpinnerVisible = false;
    });
}
}
