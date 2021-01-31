import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CurrencyService } from "../../../../services/currency.service";
import { EmployeeService } from "../../../../services/employee.service";
import { AuthService } from "../../../../services/auth.service";
import * as moment from 'moment';
import { MenuItem } from "primeng/api";
import { SalesOrderService } from "../../../../services/salesorder.service";
import { listSearchFilterObjectCreation } from "../../../../generic/autocomplete";
import { SalesOrderpickTicketComponent } from "../sales-order-pickTicket/sales-order-pickTicket.component";

@Component({
  selector: "app-sales-order-pick-tickets",
  templateUrl: "./sales-order-pick-tickets.component.html",
  styleUrls: ["./sales-order-pick-tickets.component.css"]
})
export class SalesOrderPickTicketsComponent implements OnInit {
  isEnablePOList: any;
  pickTickes: any[] = [];
  tempSales: any[] = [];
  pnViewSelected = false;
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
  customerId: any;
  statusList: any = [];
  lazyLoadEventData: any;
  currentStatus: any = "0";
  viewType: any = 'detailedview';
  breadcrumbs: MenuItem[];
  home: any;
  salesOrderId: any;
  searchParameters: any;
  
  constructor(
    private salesOrderService: SalesOrderService,
    public employeeService: EmployeeService,
    public currencyService: CurrencyService,
    private authService: AuthService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.isSpinnerVisible = true;
    this.initColumns();
    this.isSpinnerVisible = false;
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  get userId() {
    console.log(this.authService.currentUser);
    return this.authService.currentUser ? this.authService.currentUser.id : 0;
  }

  initColumns() {
    this.headers = [
      { field: "soPickTicketNumber", header: "PT Num", width: "130px" },
      { field: "soPickTicketDate", header: "PT Date", width: "130px" },
      { field: "partNumber", header: "PN", width: "130px" },
      { field: "partDescription", header: "PN Description", width: "130px" },
      { field: "serialNumber", header: "Serial Num", width: "130px" },
      { field: "uom", header: "UOM", width: "130px" },
      { field: "qty", header: "Qty Ordered", width: "130px" },
      { field: "serialNumber", header: "Qty to Pick", width: "130px" },
      { field: "qtyToShip", header: "Qty Picked", width: "130px" },
      { field: "uomName", header: "Qty Remaining", width: "130px" },
      { field: "strStatus", header: "Status", width: "130px" },
      { field: "salesOrderQuoteNumber", header: "SO Quote Num", width: "130px" },
      { field: "woNumber", header: "SO Num", width: "130px" },
      { field: "woNumber", header: "WO Num", width: "130px" },
      { field: "customer", header: "Customer", width: "130px" },
      { field: "woNumber", header: "PO Num", width: "130px" },
      { field: "shipToCity", header: "Ship To City", width: "130px" },
      { field: "shipToCountry", header: "Ship to Country", width: "130px" },
      { field: "woNumber", header: "Picked By", width: "130px" },
      { field: "woNumber", header: "Confirmed By", width: "130px" },
      { field: "memo", header: "Memo", width: "130px" }
    ];
    this.selectedColumns = this.headers;
  }

  refresh(id) {
    this.salesOrderId = id;
    this.onSearch();
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
      ...this.searchParameters.filters,
      viewType: this.viewType
    }

    this.searchParameters.globalFilter = globalFilter;
  }

  // globalSearch(val) {
  //   this.searchParameters.globalFilter = val
  //   const lazyEvent = this.lazyLoadEventData;

  // }

  onSearch() {
    this.isSpinnerVisible = true;
    this.salesOrderService
      .getPickTicketList(this.salesOrderId)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.pickTickes = response[0];
        this.showPaginator = this.totalRecords > 0;
      }, error => {
        this.isSpinnerVisible = false;
      });
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

  convertDate(key, data) {
    if ((key === 'quoteDate' || key === 'updatedDate' || key === 'createdDate' || key === 'soPickTicketDate') && data[key]) {
      return moment(data[key]).format('MM/DD/YYYY');
    } else {
      return data[key];
    }
  }

  printPickTicket(rowData: any) {
    this.modal = this.modalService.open(SalesOrderpickTicketComponent, { size: "lg" });
    let instance: SalesOrderpickTicketComponent = (<SalesOrderpickTicketComponent>this.modal.componentInstance)
    instance.modalReference = this.modal;

    instance.onConfirm.subscribe($event => {
      if (this.modal) {
        this.modal.close();
      }
    });
    instance.salesOrderId = rowData.salesOrderId;
    instance.salesOrderPartId = rowData.salesOrderPartId;
  }
}
