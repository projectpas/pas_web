import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { ExchangequoteService } from "../../../services/exchangequote.service";
import { IExchangeQuoteSearchParameters } from "../../../models/exchange/IExchangeQuoteSearchParameters";
import { ExchangeQuoteSearchParameters } from "../../../models/exchange/ExchangeQuoteSearchParameters";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { IExchangeQuote } from "../../../models/exchange/IExchangeQuote.model";
import { ExchangeQuote } from "../../../models/exchange/ExchangeQuote.model";
import { IExchangeOrderQuote } from "../../../models/exchange/IExchangeOrderQuote";
import { IExchangeQuoteView } from "../../../models/exchange/IExchangeQuoteView";
import { ExchangeOrderQuote } from "../../../models/exchange/ExchangeOrderQuote";
import { CurrencyService } from "../../../services/currency.service";
import { EmployeeService } from "../../../services/employee.service";
import { AuthService } from "../../../services/auth.service";
import { PartDetail } from "../shared/components/models/part-detail";
import { formatNumberAsGlobalSettingsModule, listSearchFilterObjectCreation } from "../../../generic/autocomplete";
import * as moment from 'moment';
import { MenuItem } from "primeng/api";

@Component({
  selector: 'app-exchange-quote-analysis',
  templateUrl: './exchange-quote-analysis.component.html',
  styleUrls: ['./exchange-quote-analysis.component.scss']
})
export class ExchangeQuoteAnalysisComponent implements OnInit {
  isEnablePOList: any;
  searchParameters: IExchangeQuoteSearchParameters;
  exchanges: any[] = [];
  selected: any;
  modal: NgbModalRef;
  partModal: NgbModalRef;
  headers: any[];
  summaryHeaders: any[];
  columns: any[];
  selectedColumns: any[];
  tempSales = [];
  selectedSummaryColumns: any[];
  selectedColumn: any[];
  totalRecords: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  first = 0;
  showPaginator: boolean = false;
  isSpinnerVisible: boolean = true;
  partColumns: any[];
  pnViewSelected = false;
  customerDetails: any;
  exchangeQuote: IExchangeQuote;
  exchangeOrderQuote: IExchangeOrderQuote;
  exchangeQuoteView: IExchangeQuoteView;
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
  exchangeQuoteId: any;
  isApproverlist: any;
  constructor(private exchangequoteService: ExchangequoteService,
    public employeeService: EmployeeService,
    public currencyService: CurrencyService,
    private authService: AuthService) { }

  ngOnInit() {
    this.isSpinnerVisible = true;
    this.exchangeQuote = new ExchangeQuote();
    this.exchangeOrderQuote = new ExchangeOrderQuote();
    this.searchParameters = new ExchangeQuoteSearchParameters();
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
    this.exchangequoteService
      .getAllExchangeQuoteAnalysis(this.exchangeQuoteId)
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
