import { Component, ViewChild } from "@angular/core";
import { SalesQuoteService } from "../../../../services/salesquote.service";
import { SalesOrderService } from "../../../../services/salesorder.service";
import { ISalesSearchParameters } from "../../../../models/sales/ISalesSearchParameters";
import { SalesSearchParameters } from "../../../../models/sales/SalesSearchParameters";
import {
  AlertService,
  DialogType,
  MessageSeverity
} from "../../../../services/alert.service";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { ISalesQuote } from "../../../../models/sales/ISalesQuote.model";
import { SalesQuote } from "../../../../models/sales/SalesQuote.model";
import { ISalesOrderQuote } from "../../../../models/sales/ISalesOrderQuote";
import { ISalesQuoteView } from "../../../../models/sales/ISalesQuoteView";
import { SalesOrderQuote } from "../../../../models/sales/SalesOrderQuote";
import { ISalesOrder } from "../../../../models/sales/ISalesOrder.model";
import { SalesOrder } from "../../../../models/sales/SalesOrder.model";
import { SalesQuoteView } from "../../../../models/sales/SalesQuoteView";
import { ISalesOrderView } from "../../../../models/sales/ISalesOrderView";
import { SalesOrderView } from "../../../../models/sales/SalesOrderView";
import { Currency } from "../../../../models/currency.model";
import { CurrencyService } from "../../../../services/currency.service";
import { EmployeeService } from "../../../../services/employee.service";
import { CustomerService } from "../../../../services/customer.service";
import { CommonService } from "../../../../services/common.service";
import { AuthService } from "../../../../services/auth.service";
import { PartDetail } from "../../shared/models/part-detail";
import { listSearchFilterObjectCreation } from "../../../../generic/autocomplete";
import { StocklineViewComponent } from '../../../../shared/components/stockline/stockline-view/stockline-view.component';
import {
  getValueFromObjectByKey,
  getObjectById,
  editValueAssignByCondition,
  getObjectByValue
} from "../../../../generic/autocomplete";
import { MenuItem } from "primeng/api";

@Component({
  selector: "sales-order-confirmation-list",
  templateUrl: "./sales-order-confirmation-list.component.html",
  styleUrls: ["./sales-order-confirmation-list.component.css"]
})
export class SalesOrderConfirmationListComponent {
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
  isSpinnerVisible: boolean = false;
  partColumns: any[];

  customerDetails: any;
  salesQuote: ISalesQuote;
  salesOrder: ISalesOrder;
  salesOrderObj: ISalesOrder;
  salesOrderQuote: ISalesOrderQuote;
  salesOrderconfirmation: any;
  salesOrderView: ISalesOrderView;
  selectedParts: any[] = [];
  creditTerms: any[];
  percents: any[];
  allCurrencyInfo: any[];
  allEmployeeinfo: any[] = [];
  customerWarningData: any = [];
  accountTypes: any[];
  approvers: any[];
  statusList: any = [];
  lazyLoadEventData: any;
  currentStatus: any = "0";
  home: any;
  breadcrumbs: MenuItem[];


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
    private authService: AuthService
  ) {
    this.breadcrumbs = [
      { label: 'Sales Order' },
      { label: ' Confirmation List' },
    ];

  }

  ngOnInit() {


    this.initColumns();
    this.isSpinnerVisible = true;
    this.salesOrderService.getsoconfirmationlist()
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.sales = response[0];

      }, error => this.onDataLoadFailed(error));


  }

  private onDataLoadFailed(error: any) {
    this.isSpinnerVisible = false;
    this.alertService.showMessage("Sales Order", error, MessageSeverity.error);
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
      { field: "soConformationNumber", header: "SO Conf Num", width: "130", type: "text" },
      { field: "customerName", header: "SO Num", width: "110px", type: "text" },
      { field: "openDate", header: "SO Date", width: "110px", type: "date" },
      { field: "partNumber", header: "PN", width: "110px", type: "text" },
      { field: "partDescription", header: "PN Description", width: "120px", type: "text" },
      { field: "serialNumber", header: "Serial Num", width: "110px", type: "text" },
      { field: "uom", header: "UOM", width: "80px", type: "text" },
      { field: "qty", header: "Qty Ordered", width: "110px", type: "text" },
      { field: "qtyReserved", header: "Qty Confirmed", width: "110px", type: "text" },
      { field: "confirmedBy", header: "Confirmed By", width: "110px", type: "text" },
      { field: "estimatedShipDate", header: "Est Ship Date", width: "110px", type: "date" },
      // { field: "estimatedShipDate", header: "Qty Previously Confirmed", width: "100px", type: "date" },
      // { field: "salesOrderNumber", header: "Qty Not Confirmed", width: "100px", type: "text" },
      { field: "salesOrderNumber", header: "SO Num", width: "110px", type: "text" },
      { field: "customerName", header: "Customer", width: "110px", type: "text" },
      { field: "customerMemo", header: "Memo", width: "130px", type: "text" }

    ];
    this.selectedColumns = this.headers;
  }

  dismissModel() {
    this.modal.close();
  }

  loadData(event) {
    event.filters.statusId = this.currentStatus;

    this.searchParameters.first = parseInt(event.first) / event.rows;

    this.searchParameters.rows = event.rows;

    this.searchParameters.sortOrder = event.sortOrder;
    this.lazyLoadEventData = event;

    this.searchParameters.filters = listSearchFilterObjectCreation(
      event.filters
    );

    this.searchParameters.globalFilter = ""

    this.onSearch();
  }
  onSearch() {
    //this.alertService.startLoadingMessage();
    this.isSpinnerVisible = true;
    this.salesOrderService
      .search(this.searchParameters)
      .subscribe((response: any) => {
        this.sales = response[0].results;

        this.totalRecords = response[0].totalRecordsCount;
        this.totalPages = Math.ceil(
          this.totalRecords / this.searchParameters.rows
        );
        this.showPaginator = this.totalRecords > 0;
        this.isSpinnerVisible = false;
        //this.alertService.stopLoadingMessage();
      }, error => this.onDataLoadFailed(error));
  }
  globalSearch(val) {
    this.searchParameters.globalFilter = val

    this.salesOrderService
      .globalSearch(this.searchParameters)
      .subscribe((response: any) => {
        this.sales = response[0].results;
        this.totalRecords = response[0].totalRecordsCount;
        this.totalPages = Math.ceil(
          this.totalRecords / this.searchParameters.rows
        );
        this.showPaginator = this.totalRecords > 0;
        this.isSpinnerVisible = false;
        //this.alertService.stopLoadingMessage();
      }, error => this.onDataLoadFailed(error));

  }



  viewSelectedRow(content, row) {
    //this.alertService.startLoadingMessage();
    this.isSpinnerVisible = true;
    this.salesOrderService.getview(row.salesOrderId).subscribe(res => {
      console.log(res, "view res+++")
      this.salesOrderView = res[0];
      this.modal = this.modalService.open(content, { size: "lg", backdrop: 'static', keyboard: false });
      this.modal.result.then(
        () => {
          console.log("When user closes");
        },
        () => {
          console.log("Backdrop click");
        }
      );
      this.isSpinnerVisible = false;
      //this.alertService.stopLoadingMessage();
    }, error => this.onDataLoadFailed(error));
  }


}
