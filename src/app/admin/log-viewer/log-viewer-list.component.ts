import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
declare var $: any;
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CurrencyService } from "../../services/currency.service";
import { EmployeeService } from "../../services/employee.service";
import { AuthService } from "../../services/auth.service";
import { listSearchFilterObjectCreation } from "../../generic/autocomplete";
import { DatePipe } from "@angular/common";
import { MenuItem } from "primeng/api";
import { LoggerService } from "../../services/logger.service";
import { ILogSearchParameters } from "../../models/sales/ILogSearchParameters";
import { LogSearchParameters } from "../../models/sales/LogSearchParameters";

@Component({
  selector: "app-log-viewer-list",
  templateUrl: "./log-viewer-list.component.html",
  styleUrls: ["./log-viewer-list.component.css"]
})
export class LogViewerListComponent implements OnInit {
  //@ViewChild("dt", { static: false });
  searchParameters: ILogSearchParameters;
  logs: any[] = [];
  selected: any;
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
  customerDetails: any;
  selectedParts: any[] = [];
  creditTerms: any[];
  percents: any[];
  customerWarningData: any = [];
  accountTypes: any[];
  customerId: any;
  lazyLoadEventData: any;
  breadcrumbs: MenuItem[];
  selectedOnly: boolean = false;
  targetData: any;
  isSettingsReceived = false;
  @ViewChild("filterStatusInput", { static: false }) public filterText: ElementRef;
  clearStatusText: boolean = false;

  constructor(
    private loggerService: LoggerService,
    private modalService: NgbModal,
    public employeeService: EmployeeService,
    public currencyService: CurrencyService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.isSpinnerVisible = true;
    this.breadcrumbs = [
      { label: 'Logs' },
      { label: 'Log List' },
    ];
    this.searchParameters = new LogSearchParameters();

    this.initColumns();
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
      //{ field: "exception", header: "Exception", width: "110px" },
      { field: "message", header: "Message", width: "210px" },
      //{ field: "messageTemplate", header: "MessageTemplate", width: "180px" },
      //{ field: "properties", header: "Properties", width: "160px" },
      { field: "level", header: "Level", width: "60px" },
      { field: "timestamp", header: "Timestamp", width: "60px" }
    ];
    this.selectedColumns = this.headers;
  }

  get currentUserMasterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : null;
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

  globalSearch(val) {
    this.searchParameters.globalFilter = val
    const lazyEvent = this.lazyLoadEventData;
    this.loadData(lazyEvent, val);
  }

  onSearch() {
    this.isSpinnerVisible = true;
    this.loggerService
      .search(this.searchParameters)
      .subscribe((response: any) => {
        if (response[0].results) {
          this.logs = response[0].results
            .map(x => {
              return {
                ...x,
                timestamp: x.timestamp ? this.datePipe.transform(x.timestamp, 'MM/dd/yyyy hh:mm a') : ''
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
    this.modal.close();
  }

  dismissModel() {
    this.modal.close();
  }

  // viewSelectedRow(content, row) {
  //   this.isSpinnerVisible = true;
  //   this.salesOrderId = row.salesOrderId;
  //   this.salesService.getview(row.salesOrderId).subscribe(res => {
  //     this.salesOrderView = res[0];
  //     this.modal = this.modalService.open(content, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
  //     this.isSpinnerVisible = false;
  //   }, error => {
  //     this.isSpinnerVisible = false;
  //   });
  // }

  changeOfStatus(status, viewType) {
    const lazyEvent = this.lazyLoadEventData;
    this.loadData(this.lazyLoadEventData);
  }

  onPaging(event, globalFilter = "") {
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

  convertDate(key, data) {
      return data[key];
  }

  viewdata: any = {};
  getViewData(data) {
    this.viewdata = data;
  }

  closePopupmodel(divid) {
    $("#" + divid + "").modal("hide");
  }

  getColorCodeForMultiple(data) {
    return data['partNumberType'] === 'Multiple' ? 'green' : 'black';
  }

  // exportCSV(dt) {
  //   this.isSpinnerVisible = true;
  //   const isdelete = this.currentDeletedstatus ? true : false;
  //   let PagingData;
  //   PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "StatusId": this.currentStatus, "isDeleted": isdelete,"masterCompanyId": this.currentUserMasterCompanyId, "ViewType": this.viewType }, "globalFilter": "" }

  //   let filters = Object.keys(dt.filters);

  //   filters.forEach(x => {
  //     PagingData.filters[x] = dt.filters[x].value;
  //   });

  //   this.salesService
  //     .search(PagingData).subscribe(res => {
  //       const vList = res[0]['results'].map(x => {
  //         return {
  //           ...x,
  //           openDate: x.openDate ? this.datePipe.transform(x.openDate, 'MMM-dd-yyyy hh:mm a') : '',
  //           quoteDate: x.quoteDate ? this.datePipe.transform(x.quoteDate, 'MMM-dd-yyyy hh:mm a') : '',
  //           requestedDateType: moment(x.requestedDateType).format('MM-DD-YYYY') == '01-01-0001' ? '' : (x.requestedDateType ? this.datePipe.transform(x.requestedDateType, 'MMM-dd-yyyy hh:mm a') : ''),
  //           estimatedShipDateType: moment(x.estimatedShipDateType).format('MM-DD-YYYY') == '01-01-0001' ? '' : (x.estimatedShipDateType ? this.datePipe.transform(x.estimatedShipDateType, 'MMM-dd-yyyy hh:mm a') : ''),
  //           createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
  //           updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
  //         }
  //       });

  //       dt._value = vList;
  //       dt.exportCSV();
  //       dt.value = this.sales;
  //       this.isSpinnerVisible = false;
  //     }, err => {
  //       this.isSpinnerVisible = false;
  //     });
  // }

  closeHistoryModal() {
    $("#soHistory").modal("hide");
  }

  openHistoryPopup(content) {
    this.modal = this.modalService.open(content, { size: 'xl', backdrop: 'static', keyboard: false });
  }

  openDownload(content) {
    this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
  }
}