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
  selector: 'app-exchange-sales-order-analysis',
  templateUrl: './exchange-sales-order-analysis.component.html',
  styleUrls: ['./exchange-sales-order-analysis.component.scss']
})
export class ExchangeSalesOrderAnalysisComponent implements OnInit {
  isEnablePOList: any;
  searchParameters: IExchangeSalesSearchParameters;
  sales: any[] = [];
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
  initSummaryColumns() {
    this.headers = [
      { field: "exchangeSalesOrderNumber", header: "Exch SO Num", width: "120px" },
      { field: "versionNumber", header: "Ver Num", width: "80px" },
      { field: "partNumber", header: "PN", width: "130px" },
      { field: "partDescription", header: "PN Description", width: "180px" },
      { field: "uomName", header: "UOM", width: "100px" },
      { field: "currency", header: "Curr", width: "100px" },
      { field: "qty", header: "Qty", width: "85px" },
      { field: "unitSalePrice", header: "Per Unit", width: "120px" },
      { field: "salesPriceExtended", header: "Ext. Price", width: "120px" },
      { field: "misc", header: "Misc Charges", width: "120px" },
      { field: "totalSales", header: "Total Revenue", width: "130px" },
      { field: "unitCost", header: "Unit Cost", width: "130px" },
      { field: "unitCostExtended", header: "Ext Cost", width: "130px" },
      { field: "marginAmountExtended", header: "Margin Amt", width: "120px", style: "text-align:right" },
      { field: "marginPercentage", header: "Margin %", width: "100px", style: "text-align:right" },
      { field: "freight", header: "Freight", width: "120px", style: "text - align: right" },
      { field: "taxAmount", header: "Tax Amt", width: "120px" },
      { field: "notes", header: "Notes", width: "250px" }
    ];
    this.selectedColumns = this.headers;
  }

  initColumns() {
    this.headers = [
      { field: "exchangeSalesOrderNumber", header: "Exch SO Num", width: "120px" },
      { field: "versionNumber", header: "Ver Num", width: "80px" },
      { field: "partNumber", header: "PN", width: "130px" },
      { field: "partDescription", header: "PN Description", width: "180px" },
      { field: "stockLineNumber", header: "Stk Line Num", width: "110px" },
      { field: "exchangeQuoteNumber", header: "Exch Qte Num", width: "120px" },
      { field: "quoteDate", header: "Qte Date", width: "85px" },
      { field: "serialNumber", header: "Ser Num", width: "120px" },
      { field: "conditionDescription", header: "Cond", width: "100px" },
      { field: "uomName", header: "UOM", width: "100px" },
      { field: "status", header: "Status", width: "80px" },
      { field: "currency", header: "Curr", width: "80px" },
      { field: "qty", header: "Qty", width: "80px" },
      { field: "unitSalePrice", header: "Per Unit", width: "120px" },
      { field: "salesPriceExtended", header: "Ext. Price", width: "120px" },
      { field: "misc", header: "Misc Charges", width: "120px" },
      { field: "totalSales", header: "Total Revenue", width: "130px" },
      { field: "unitCost", header: "Unit Cost", width: "130px" },
      { field: "unitCostExtended", header: "Ext Cost", width: "130px" },
      { field: "marginAmountExtended", header: "Margin Amt", width: "120px", style: "text-align:right" },
      { field: "marginPercentage", header: "Margin %", width: "100px", style: "text-align:right" },
      { field: "freight", header: "Freight", width: "120px", style: "text - align: right" },
      { field: "taxAmount", header: "Tax Amt", width: "120px" },
      { field: "notes", header: "Notes", width: "250px" }
    ];
    this.selectedColumns = this.headers;
  }
  refresh(id) {
    this.salesOrderId = id;
    this.onSearch();
  }
  parsedText(text) {
    if (text) {
      const dom = new DOMParser().parseFromString(
        '<!doctype html><body>' + text,
        'text/html');
      const decodedString = dom.body.textContent;
      return decodedString;
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
    this.searchParameters.filters = {
      ...this.searchParameters.filters,
      viewType: this.viewType
    }

    this.searchParameters.globalFilter = globalFilter;
  }

  globalSearch(val) {
    this.searchParameters.globalFilter = val
    const lazyEvent = this.lazyLoadEventData;
  }

  onSearch() {
    this.isSpinnerVisible = true;
    this.exchangeSalesOrderService
      .getAllExchangeSalesOrderAnalysis(this.salesOrderId)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.sales = response;
        if (this.sales.length > 0) {
          this.sales.forEach((sale, i) => {
            this.sales[i]['totalRevenue'] = this.calculateProductRevenue(sale, i);
            this.sales[i]['totalSales'] = this.calculateTotalRevenue(sale, i);
            this.sales[i]['marginAmountExtended'] = this.calculateMarginAmount(sale, i);
            this.sales[i]['marginPercentage'] = this.calculateMarginPercentage(sale, i);
          })
        }
        this.totalRecords = response.length;
        this.totalPages = Math.ceil(
          this.totalRecords / this.searchParameters.rows
        );
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

  convertDate(key, data) {
    if ((key === 'quoteDate' || key === 'updatedDate' || key === 'createdDate') && data[key]) {
      return moment(data[key]).format('MM/DD/YYYY');
    } else {
      return data[key];
    }
  }

  getColorCodeForMultiple(data) {
    return data['partNumberType'] === 'Multiple' ? 'green' : 'black';
  }

  calculateMarginPercentage(part: PartDetail, i) {
    return ((this.sales[i].marginAmountExtended / (this.sales[i]['totalRevenue'])) * 100).toFixed(2);
  }

  calculateMarginAmount(part: PartDetail, i) {
    //return (this.sales[i].marginAmountExtended + this.sales[i].misc).toFixed(2);
    return (this.sales[i]['totalRevenue'] - this.sales[i].unitCostExtended).toFixed(2);
  }

  calculateTotalRevenue(part: PartDetail, i) {
    //return (this.sales[i].netSales + this.sales[i].misc).toFixed(2);
    return (this.sales[i].salesPriceExtended + this.sales[i].misc).toFixed(2);
  }

  calculateProductRevenue(part, i) {
    //return this.sales[i].netSales + this.sales[i].misc; // + this.sales[i].freight + this.sales[i].taxAmount;
    return this.sales[i].salesPriceExtended + this.sales[i].misc;
  }

  getPercentage(key) {
    if (this.sales && this.sales.length > 0) {
      let percentage = this.getTotalAmount(key);
      return (percentage / this.sales.length).toFixed(2);
    }
  }

  getTotalAmount(key) {
    let total = 0;
    if (this.sales && this.sales.length > 0) {
      this.sales.forEach(
        (part) => {
          total += Number(this.sumAmount(part, key));
        }
      )
    }
    total.toFixed(2);
    return this.formateCurrency(total);
  }

  sumAmount(part, key) {
    let total = 0;
    if (part[key]) {
      total += Number(part[key].toString().replace(/\,/g, ''));
    }
    return total.toFixed(2);
  }

  formateCurrency(amount) {
    return amount ? formatNumberAsGlobalSettingsModule(amount, 2) : '0.00';
  }

  changeOfStatus(part, viewType) {
    if (viewType == 'detailedview') {
      this.initColumns();
      this.sales = JSON.parse(JSON.stringify(this.tempSales));
      this.pnViewSelected = false;

    } else {
      this.initSummaryColumns();
      this.tempSales = JSON.parse(JSON.stringify(this.sales));
      this.pnViewSelected = true;
      this.filterParts(this.sales);
    }
  }

  filterParts(tempSales) {
    this.sales = [];
    let uniqueParts = this.getUniqueParts(tempSales, 'partNumber');
    if (uniqueParts.length > 0) {
      uniqueParts.forEach((part, i) => {
        let childParts = tempSales.filter(selectedPart => selectedPart.partNumber == part.partNumber)
        if (childParts && childParts.length > 0) {
          uniqueParts[i] = this.calculateSummarizedRow(childParts, part);
          uniqueParts[i].childParts = childParts;
        }
      });
      this.sales = uniqueParts;
    }
    this.totalRecords = this.sales.length;
    this.totalPages = Math.ceil(
      this.totalRecords / this.searchParameters.rows
    );
    this.showPaginator = this.totalRecords > 0;
  }

  calculateSummarizedRow(parts, uniquePart) {
    uniquePart = parts[0];
    if (parts.length > 1) {
      parts.splice(0, 1);
      parts.forEach(part => {
        uniquePart.qty = this.getSum(uniquePart.qty, part.qty);
        uniquePart.markupExtended = this.getSum(uniquePart.markupExtended, part.markupExtended);
        uniquePart.grossSalePrice = this.getSum(uniquePart.grossSalePrice, part.grossSalePrice);
        uniquePart.salesDiscountExtended = this.getSum(uniquePart.salesDiscountExtended, part.salesDiscountExtended);
        uniquePart.netSales = this.getSum(uniquePart.netSales, part.netSales);
        uniquePart.misc = this.getSum(uniquePart.misc, part.misc);
        uniquePart.totalSales = this.getSum(uniquePart.totalSales, part.totalSales);
        uniquePart.unitCostExtended = this.getSum(uniquePart.unitCostExtended, part.unitCostExtended);
        uniquePart.marginAmountExtended = this.getSum(uniquePart.marginAmountExtended, part.marginAmountExtended);
        uniquePart.marginPercentage = this.getSum(uniquePart.marginPercentage, part.marginPercentage);
        uniquePart.freight = this.getSum(uniquePart.freight, part.freight);
        uniquePart.taxAmount = this.getSum(uniquePart.taxAmount, part.taxAmount);
        uniquePart.totalRevenue = this.getSum(uniquePart.totalRevenue, part.totalRevenue);
      })
      uniquePart.marginPercentage = uniquePart.marginPercentage / parts.length + 1;
    }
    return uniquePart;
  }

  getSum(num1, num2) {
    return Number(num1) + Number(num2);
  }

  getUniqueParts(myArr, prop1) {
    let uniqueParts = JSON.parse(JSON.stringify(myArr));
    uniqueParts.reduceRight((acc, v, i) => {
      if (acc.some(obj => v[prop1] === obj[prop1])) {
        uniqueParts.splice(i, 1);
      } else {
        acc.push(v);
      }
      return acc;
    }, []);
    return uniqueParts;
  }

  getUnFormattedTotalAmount(key) {
    let total = 0;
    if (this.sales && this.sales.length > 0) {
      this.sales.forEach(
        (part) => {
          total += Number(this.sumAmount(part, key));
        }
      )
    }
    return total;
  }

  getTotalMarginPercentage() {
    let totalRevenue = this.getUnFormattedTotalAmount('totalSales');
    let totalMarginAmt = this.getUnFormattedTotalAmount('marginAmountExtended');

    return ((totalMarginAmt / totalRevenue) * 100).toFixed(2);
  }
}
