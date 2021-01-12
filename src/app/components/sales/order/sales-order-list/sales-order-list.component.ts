import { Component, ViewChild, ElementRef } from "@angular/core";
import { SalesQuoteService } from "../../../../services/salesquote.service";
import { SalesOrderService } from "../../../../services/salesorder.service";
import { ISalesSearchParameters } from "../../../../models/sales/ISalesSearchParameters";
import { SalesSearchParameters } from "../../../../models/sales/SalesSearchParameters";
import {
  AlertService,
  DialogType,
  MessageSeverity
} from "../../../../services/alert.service";
declare var $ : any;
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { ISalesQuote } from "../../../../models/sales/ISalesQuote.model";
import { SalesQuote } from "../../../../models/sales/SalesQuote.model";
import { ISalesOrderQuote } from "../../../../models/sales/ISalesOrderQuote";
import { SalesOrderQuote } from "../../../../models/sales/SalesOrderQuote";
import { ISalesOrder } from "../../../../models/sales/ISalesOrder.model";
import { ISalesOrderView } from "../../../../models/sales/ISalesOrderView";
import { CurrencyService } from "../../../../services/currency.service";
import { EmployeeService } from "../../../../services/employee.service";
import { CustomerService } from "../../../../services/customer.service";
import { CommonService } from "../../../../services/common.service";
import { AuthService } from "../../../../services/auth.service";
import { PartDetail } from "../../shared/models/part-detail";
import { listSearchFilterObjectCreation } from "../../../../generic/autocomplete";
import * as moment from 'moment';
import { DatePipe } from "@angular/common";
import { MenuItem } from "primeng/api";
import { forkJoin } from "rxjs/observable/forkJoin";
import { AuditHistory } from "../../../../models/audithistory.model";

@Component({
  selector: "app-sales-order-list",
  templateUrl: "./sales-order-list.component.html",
  styleUrls: ["./sales-order-list.component.css"]
})
export class SalesOrderListComponent {
  @ViewChild("dt",{static:false})
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
  selectedOnly: boolean = false;
  targetData: any;
  customerDetails: any;
  salesQuote: ISalesQuote;
  salesOrder: ISalesOrder;
  salesOrderObj: ISalesOrder;
  salesOrderQuote: ISalesOrderQuote;
  salesOrderView: ISalesOrderView;
  selectedParts: any[] = [];
  creditTerms: any[];
  percents: any[];
  allCurrencyInfo: any[];
  allEmployeeinfo: any[] = [];
  customerWarningData: any = [];
  accountTypes: any[];
  // approvers: any[];
  statusList: any = [];
  settingsList: any = [];
  lazyLoadEventData: any;
  currentStatus: any = "0";
  viewType: any = 'pnview';
  breadcrumbs: MenuItem[];
  currentDeletedstatus = false;
  home: any;
  isSettingsReceived = false;
  auditHistory: AuditHistory[];
  @ViewChild("filterStatusInput",{static:false}) public filterText: ElementRef;
  clearStatusText: boolean = false;
  selectedSalesOrderToDelete:any;
  customerId: any;
  salesOrderId: any;
  
  constructor(
    private salesQuoteService: SalesQuoteService,
    private salesOrderService: SalesOrderService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router,
    private customerService: CustomerService,
    public employeeService: EmployeeService,
    private commonservice: CommonService,
    public currencyService: CurrencyService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.isSpinnerVisible = true;
    this.salesQuote = new SalesQuote();
    //this.headerValue = new HeaderValue();
    this.salesOrderQuote = new SalesOrderQuote();
    this.searchParameters = new SalesSearchParameters();
    this.getStatusList();
    this.initColumns();
    this.initPartColumns();
    this.searchParameters.filters = {
      ...this.searchParameters.filters,
      viewType: this.viewType
    }
    this.breadcrumbs = [
      { label: 'Sales Order' },
      { label: 'Order List' },
    ];

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

  getDeleteListByStatus(value) {
    this.currentDeletedstatus = value;
    this.pageIndex = this.searchParameters.rows > 10 ? this.searchParameters.first / this.searchParameters.rows : 0;
    this.pageSize = this.searchParameters.rows;
    this.searchParameters.first = this.pageIndex;
    if (value == true) {
      this.searchParameters.filters = { ...this.searchParameters.filters, isDeleted: this.currentDeletedstatus };
      this.isSpinnerVisible = true;
      //this.onSearch();
      this.loadData(this.searchParameters);
    } else {
      this.currentDeletedstatus = false;
      this.searchParameters.filters = { ...this.searchParameters.filters, isDeleted: this.currentDeletedstatus };
      this.isSpinnerVisible = true;
      //this.onSearch();
      this.loadData(this.searchParameters);
    }
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
      { field: "createdBy", header: "CreatedBy", width: "130px" },
      { field: "updatedDate", header: "Updated Date", width: "130px" },
      { field: "updatedBy", header: "UpdatedBy", width: "130px" }

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

  loadData(event, gloabalFilter = "") {
    const isdelete = this.currentDeletedstatus ? true : false;
    event.filters.isDeleted = isdelete;
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
      viewType: this.viewType
    }
    this.searchParameters.globalFilter = gloabalFilter;

    if (this.isSettingsReceived) {
      this.onSearch();
    }
  }

  globalSearch(val) {
    this.searchParameters.globalFilter = val
    const lazyEvent = this.lazyLoadEventData;
    this.loadData(lazyEvent, val);
  }

  getStatusList() {
    forkJoin(this.commonservice.smartDropDownList("MasterSalesOrderQuoteStatus", "Id", "Name"),
      this.salesOrderService.getAllSalesOrderSettings()).subscribe(res => {
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

  onSearch() {
    this.isSpinnerVisible = true;
    let params: ISalesSearchParameters = new SalesSearchParameters();
    params.first = this.searchParameters.first;
    params.page = this.searchParameters.page;
    params.rows = this.searchParameters.rows;
    params.limit = this.searchParameters.limit;
    params.sortOrder = this.searchParameters.sortOrder;
    params.sortField = this.searchParameters.sortField;
    params.salesQuoteNumber = this.searchParameters.salesQuoteNumber;
    params.columnFilters = this.searchParameters.columnFilters;
    params.filters = this.searchParameters.filters;
    params.globalFilter = this.searchParameters.globalFilter;
    params.customerName = this.searchParameters.customerName;
    params.status = this.searchParameters.status;
    params.startDate = this.searchParameters.startDate;
    params.endDate = this.searchParameters.endDate;

    this.salesOrderService
        .search(params)
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
      viewType: this.viewType
    }
    this.searchParameters.globalFilter = globalFilter;
  }

  dismissModel() {
    this.modal.close();
  }

  dismissViewModel() {
    this.modal.close();
  }

  dismissPartViewModel() {
    this.partModal.close();
  }

  openDelete(content, rowData) {
    this.selected = rowData.salesOrderId;
    this.selectedSalesOrderToDelete = rowData.salesOrderNumber;
    this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
    this.modal.result.then(
      () => { },
      () => { }
    );
  }

  deleteQuote(): void {
    this.isSpinnerVisible = true;
    this.salesOrderService.delete(this.selected).subscribe(response => {
      this.isSpinnerVisible = false;
      this.modal.close();
      this.alertService.showMessage(
        "Success",
        `Order removed successfully.`,
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
    this.salesOrderService.getview(row.salesOrderId).subscribe(res => {
      this.salesOrderView = res[0];
      this.modal = this.modalService.open(content, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
      this.modal.result.then(
        () => {
        },
        () => {
        }
      );
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    });
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
    PagingData = { "filters": { "statusId": "0", "viewType": "pnview", "isDeleted": this.currentDeletedstatus }, "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "globalFilter": "" };
    // let PagingData: ISalesSearchParameters = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "status": this.currentStatus, "isDeleted": isdelete }, "globalFilter": "" }
    let filters = Object.keys(dt.filters);
    filters.forEach(x => {
      PagingData.filters[x] = dt.filters[x].value;
    });

    this.salesOrderService
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
        this.isSpinnerVisible = false;
      }, err => {
            this.isSpinnerVisible = false;
      });
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

  getAuditHistoryById(content,rowData) {
    this.isSpinnerVisible = true;
    this.salesOrderService.getSOHistory(rowData.salesOrderId).subscribe(res => {
        //this.auditHistory = res;
                        this.auditHistory  = res.map(x => {
                          return {
                              ...x,                    
                              createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy h:mm a'): '',
                              updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy h:mm a'): '',
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


  closeHistoryModal() {
    $("#soHistory").modal("hide");
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

  clearText(currentStatus) {
    this.clearStatusText = true;
    if (currentStatus != "0" && this.filterText != undefined) {
        this.filterText.nativeElement.value = '';
    }
  }
}