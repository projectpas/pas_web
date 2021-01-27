import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { SalesOrderService } from "../../../../services/salesorder.service";
import { ISalesSearchParameters } from "../../../../models/sales/ISalesSearchParameters";
import { SalesSearchParameters } from "../../../../models/sales/SalesSearchParameters";
import {
  AlertService,
  MessageSeverity
} from "../../../../services/alert.service";
declare var $: any;
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { CurrencyService } from "../../../../services/currency.service";
import { EmployeeService } from "../../../../services/employee.service";
import { CommonService } from "../../../../services/common.service";
import { AuthService } from "../../../../services/auth.service";
import { listSearchFilterObjectCreation } from "../../../../generic/autocomplete";
import * as moment from 'moment';
import { DatePipe } from "@angular/common";
import { MenuItem } from "primeng/api";
import { forkJoin } from "rxjs/observable/forkJoin";
import { AuditHistory } from "../../../../models/audithistory.model";
import { ISalesOrderView } from 'src/app/models/sales/ISalesOrderView';

@Component({
  selector: "app-sales-order-list",
  templateUrl: "./sales-order-list.component.html",
  styleUrls: ["./sales-order-list.component.css"]
})
export class SalesOrderListComponent implements OnInit {
  @ViewChild("dt", { static: false })
  isEnablePOList: any;
  searchParameters: ISalesSearchParameters;
  sales: any[] = [];
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
  currentDeletedstatus = false;
  customerDetails: any;
  salesOrderView: ISalesOrderView;
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
  selectedSalesOrderToDelete: any;
  salesOrderId: any;

  constructor(
    private salesService: SalesOrderService,
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
      { label: 'Sales Order' },
      { label: 'Sales Order List' },
    ];
    this.searchParameters = new SalesSearchParameters();

    this.initColumns();
    this.initPartColumns();
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
      { field: "salesOrderNumber", header: "SO Num", width: "120px" },
      { field: "customerName", header: "Customer Name", width: "180px" },
      { field: "customerReference", header: "Customer Ref", width: "130px" },
      { field: "salesOrderQuoteNumber", header: "Quote Num", width: "130px" },
      { field: "versionNumber", header: "Quote Ver Num", width: "130px" },
      { field: "quoteDate", header: "Quote Date", width: "130px" },
      { field: "partNumberType", header: "PN", width: "130px" },
      { field: "partDescriptionType", header: "PN Description", width: "180px" },
      { field: "status", header: "Status", width: "100px" },
      { field: "priorityType", header: "Priority", width: "100px" },
      { field: "openDate", header: "Open Date", width: "130px" },
      { field: "requestedDateType", header: "Request Date", width: "130px" },
      { field: "estimatedShipDateType", header: "Est. Ship Date", width: "130px" },
      { field: "salesPerson", header: "Sales Person", width: "180px" },
      { field: "createdDate", header: "Created Date", width: "130px" },
      { field: "createdBy", header: "Created By", width: "130px" },
      { field: "updatedDate", header: "Updated Date", width: "130px" },
      { field: "updatedBy", header: "Updated By", width: "130px" }

    ];
    this.selectedColumns = this.headers;
  }

  initPartColumns() {
    this.partColumns = [
      { field: "partNumber", header: "PartNumber", width: "200px" },
      { field: "description", header: "Description", width: "200px" },
      { field: "stockLineNumber", header: "Stock Line Number", width: "200px" },
      { field: "method", header: "Method", width: "200px" },
      { field: "serialNumber", header: "Serial Number", width: "200px" },
      { field: "stockLineId", header: "Stock Line Num", width: "200px" },
      { field: "idNumber", header: "ID Num", width: "200px" },
      { field: "pmaStatus", header: "OEM/PMA/DE", width: "200px" },
      { field: "conditionType", header: "Cond Type", width: "200px" },
      { field: "currency", header: "Currency", width: "200px" },
      { field: "fixRate", header: "fx Rate", width: "200px" },
      { field: "quantityFromThis", header: "Qty Quoted", width: "200px" },
      { field: "salesPricePerUnit", header: "Unit Sale Price", width: "200px" },
      { field: "markUpPercentage", header: "Mark Up %", width: "200px" },
      { field: "markupExtended", header: "Mark Up Amount", width: "200px" },
      { field: "salesDiscount", header: "Discount %", width: "200px" },
      { field: "salesDiscountPerUnit", header: "Disc Amount", width: "200px" },
      { field: "netSalesPriceExtended", header: "Net Sales", width: "200px" },
      { field: "unitCostPerUnit", header: "Unit Cost", width: "200px" },
      { field: "unitCostExtended", header: "Extended Cost", width: "200px" },
      { field: "marginAmountExtended", header: "Margin ($)", width: "200px" },
      {
        field: "marginPercentageExtended",
        header: "Margin (%)",
        width: "200px"
      }
    ];
  }
  
  auditHistoryHeader = [
    { field: 'salesOrderQuoteNumber', header: 'Quote Num', isRequired:0 },
    { field: 'status', header: 'Status', isRequired:1 },     
    { field: 'salesOrderNumber', header: 'SO Num', isRequired:1 },
    { field: 'customerName', header: 'Customer Name', isRequired:1 },
    { field: 'customerType', header: 'Customer Type', isRequired:1 },
    { field: 'customerReference', header: 'Cust Ref', isRequired:1 },
    { field: 'priority', header: 'Priority', isRequired:0 },
    { field: 'salesPerson', header: 'Salesperson', isRequired:1 },
    { field: 'createdDate', header: 'Created Date', isRequired:1 },
    { field: 'createdBy', header: 'Created By', isRequired:1 },
    { field: 'updatedDate', header: 'Updated Date', isRequired:1 },
    { field: 'updatedBy', header: 'Updated By', isRequired:1 },
    { field: 'isDeleted', header: 'Is Deleted', isRequired:0 }
  ]

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
    this.salesService
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
    this.selected = rowData.salesOrderId;
    this.selectedSalesOrderToDelete = rowData.salesOrderNumber;
    this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
  }

  deleteQuote(): void {
    this.isSpinnerVisible = true;
    this.salesService.delete(this.selected).subscribe(response => {
      this.isSpinnerVisible = false;
      this.modal.close();
      this.alertService.showMessage(
        "Success",
        `Sales Order removed successfully.`,
        MessageSeverity.success
      );
      this.onSearch();
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  openOrderToEdit(row) {
    this.isSpinnerVisible = true;
    const { salesOrderId } = row;
    let customerId = row.customerId;
    this.router.navigateByUrl(
      `salesmodule/salespages/sales-order-edit/${customerId}/${salesOrderId}`
    );
  }

  viewSelectedRow(content, row) {
    this.isSpinnerVisible = true;
    this.salesOrderId = row.salesOrderId;
    this.salesService.getview(row.salesOrderId).subscribe(res => {
      this.salesOrderView = res[0];
      this.modal = this.modalService.open(content, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  getStatusList() {
    forkJoin(this.commonservice.smartDropDownList("MasterSalesOrderQuoteStatus", "Id", "Name"),
      this.salesService.getAllSalesOrderSettings()).subscribe(res => {
        this.statusList = res[0];
        this.settingsList = res[1];
        if (this.settingsList.length > 0) {
          if (this.settingsList[0].soListViewId == 1) {
            this.viewType = 'pnview';
          } else {
            this.viewType = 'soview';
          }
          this.currentStatus = this.settingsList[0].soListStatusId.toString();
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
    } else if (key === 'openDate' && data[key]) {
      return moment(data['openDate']).format('MM-DD-YYYY');
    } else if (key === 'createdDate' && data[key]) {
      return moment(data['createdDate']).format('MM-DD-YYYY');
    } else if (key === 'updatedDate' && data[key]) {
      return moment(data['updatedDate']).format('MM-DD-YYYY');
    } else if (key === 'requestedDateType' && data[key]) {
      return this.convertmultipleDates(data['requestedDate']);
    } else if (key === 'estimatedShipDateType' && data[key]) {
      return this.convertmultipleDates(data['estimatedShipDate']);
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
    if (key === 'requestedDateType' && data[key]) {
      return data['requestedDateType'] !== 'Multiple' ? moment(data['requestedDate']).format('MM-DD-YYYY') : data['requestedDateType'];
    }
    else if (key === 'estimatedShipDateType' && data[key]) {
      return data['estimatedShipDateType'] !== 'Multiple' ? moment(data['estimatedShipDate']).format('MM-DD-YYYY') : data['estimatedShipDateType'];
    } else {
      return data[key];
    }
  }

  getColorCodeForMultiple(data) {
    return data['partNumberType'] === 'Multiple' ? 'green' : 'black';
  }

  exportCSV(dt) {
    this.isSpinnerVisible = true;
    const isdelete = this.currentDeletedstatus ? true : false;
    let PagingData;
    PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "StatusId": this.currentStatus, "isDeleted": isdelete, "ViewType": this.viewType }, "globalFilter": "" }
    
    let filters = Object.keys(dt.filters);
    
    filters.forEach(x => {
      PagingData.filters[x] = dt.filters[x].value;
    });

    this.salesService
      .search(PagingData).subscribe(res => {
        const vList = res[0]['results'].map(x => {
          return {
            ...x,
            openDate: x.openDate ? this.datePipe.transform(x.openDate, 'MMM-dd-yyyy hh:mm a') : '',
            quoteDate: x.quoteDate ? this.datePipe.transform(x.quoteDate, 'MMM-dd-yyyy hh:mm a') : '',
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
    $("#soHistory").modal("hide");
  }

  openHistoryPopup(content) {
    this.modal = this.modalService.open(content, { size: 'xl', backdrop: 'static', keyboard: false });
  }

  getAuditHistoryById(content, rowData) {
    this.isSpinnerVisible = true;
    this.salesService.getSOHistory(rowData.salesOrderId).subscribe(res => {
      this.auditHistory = res.map(x => {
        return {
          ...x,
          createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy h:mm a') : '',
          updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy h:mm a') : '',
        }
      });
      this.isSpinnerVisible = false;
      this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
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
    this.commonservice.updatedeletedrecords('SalesOrder', 'SalesOrderId', this.restorerecord.salesOrderId).subscribe(res => {
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