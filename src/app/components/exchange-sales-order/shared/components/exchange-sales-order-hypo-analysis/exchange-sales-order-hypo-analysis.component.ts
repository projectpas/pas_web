import { Component, OnInit } from '@angular/core';
import { IExchangeSalesSearchParameters } from "../../../../../models/exchange/IExchangeSalesSearchParameters";
import { ExchangeSalesSearchParameters } from "../../../../../models/exchange/ExchangeSalesSearchParameters";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { IExchangeQuote } from "../../../../../models/exchange/IExchangeQuote.model";
import { ExchangeQuote } from "../../../../../models/exchange/ExchangeQuote.model";
import { IExchangeOrderQuote } from "../../../../../models/exchange/IExchangeOrderQuote";
import { IExchangeQuoteView } from "../../../../../models/exchange/IExchangeQuoteView";
import { ExchangeOrderQuote } from "../../../../../models/exchange/ExchangeOrderQuote";
import { CurrencyService } from "../../../../../services/currency.service";
import { EmployeeService } from "../../../../../services/employee.service";
import { AuthService } from "../../../../../services/auth.service";
import { PartDetail } from "../../../shared/models/part-detail";
import { formatNumberAsGlobalSettingsModule, listSearchFilterObjectCreation } from "../../../../../generic/autocomplete";
import * as moment from 'moment';
import { MenuItem } from "primeng/api";
import { ExchangeSalesOrderService } from "../../../../../services/exchangesalesorder.service";
@Component({
  selector: 'app-exchange-sales-order-hypo-analysis',
  templateUrl: './exchange-sales-order-hypo-analysis.component.html',
  styleUrls: ['./exchange-sales-order-hypo-analysis.component.scss']
})
export class ExchangeSalesOrderHypoAnalysisComponent implements OnInit {
  isEnablePOList: any;
  searchParameters: IExchangeSalesSearchParameters;
  sales: any[] = [];
  exchanges: any[] = [];
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
  salesQuote: IExchangeQuote;
  salesOrderQuote: IExchangeOrderQuote;
  salesQuoteView: IExchangeQuoteView;
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
  lazyLoadEventData: any;
  currentStatus: any = "0";
  viewType: any = 'detailedview';
  breadcrumbs: MenuItem[];
  home: any;
  salesOrderId: any;
  exchangeQuoteId: any;
  constructor(private exchangeSalesOrderService: ExchangeSalesOrderService,
    public employeeService: EmployeeService,
    public currencyService: CurrencyService,
    private authService: AuthService) { }

  ngOnInit() {
    this.isSpinnerVisible = true;
    this.salesQuote = new ExchangeQuote();
    this.salesOrderQuote = new ExchangeOrderQuote();
    this.searchParameters = new ExchangeSalesSearchParameters();
    this.initColumns();
    this.searchParameters.filters = {
      ...this.searchParameters.filters,
      viewType: this.viewType
    }
    this.isSpinnerVisible = false;
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
      { field: "exchangeFees", header: "Exchange Fees", width: "120px" },
      { field: "overhaulPrice", header: "Overhaul Price", width: "130px" },
      { field: "otherCharges", header: "Other Charges", width: "85px" },
      { field: "totalEstRevenue", header: "Total Est Revenue", width: "130px" },
      { field: "cogsFees", header: "COGS Fees", width: "130px" },
      { field: "overhaulCost", header: "Overhaul Cost", width: "120px" },
      { field: "otherCost", header: "Other Cost", width: "120px" },
      { field: "totalEstCost", header: "Total Est Cost", width: "130px" },
      { field: "marginAmount", header: "Margin Amt", width: "100px" },
      { field: "marginPercentage", header: "Margin Percentage", width: "100px" },
    ];
    this.selectedColumns = this.headers;
  }
  refresh(id) {
    this.exchangeQuoteId = id;
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
      //viewType: this.viewType
    }
    this.searchParameters.globalFilter = globalFilter;
  }

  onSearch() {
    this.isSpinnerVisible = true;
    this.exchangeSalesOrderService
      .getExchangeSalesOrderHypoAnalysis(this.exchangeQuoteId)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.exchanges = response;
        this.totalRecords = response.length;
        this.totalPages = Math.ceil(
          this.totalRecords / this.searchParameters.rows
        );
        this.showPaginator = this.totalRecords > 0;
      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  convertDate(key, data) {
    if ((key === 'updatedDate' || key === 'createdDate') && data[key]) {
      return moment(data[key]).format('MM/DD/YYYY');
    } else {
      return data[key];
    }
  }
}