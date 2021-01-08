import { Component, OnInit, ViewChild } from "@angular/core";
import * as $ from "jquery";
import { SalesQuoteService } from "../../../../services/salesquote.service";
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
import { SalesQuoteView } from "../../../../models/sales/SalesQuoteView";
import { SalesOrderQuotePart } from "../../../../models/sales/SalesOrderQuotePart";
import { SalesOrderQuote } from "../../../../models/sales/SalesOrderQuote";
import { Currency } from "../../../../models/currency.model";
import { CurrencyService } from "../../../../services/currency.service";
import { EmployeeService } from "../../../../services/employee.service";
import { CustomerService } from "../../../../services/customer.service";
import { CommonService } from "../../../../services/common.service";
import { AuthService } from "../../../../services/auth.service";
import { PartDetail } from "../../shared/models/part-detail";
import { formatNumberAsGlobalSettingsModule, listSearchFilterObjectCreation } from "../../../../generic/autocomplete";
import { StocklineViewComponent } from '../../../../shared/components/stockline/stockline-view/stockline-view.component';
import {
  getValueFromObjectByKey,
  getObjectById,
  editValueAssignByCondition,
  getObjectByValue
} from "../../../../generic/autocomplete";

import * as moment from 'moment';
import { MenuItem } from "primeng/api";


@Component({
  selector: "app-sales-quote-analysis",
  templateUrl: "./sales-quote-analysis.component.html",
  styleUrls: ["./sales-quote-analysis.component.css"]
})
export class SalesQuoteAnalysisComponent implements OnInit {
  // @ViewChild("dt",{static:false})
  isEnablePOList: any;
  searchParameters: ISalesSearchParameters;
  sales: any[] = [];
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
  // approvers: any[];
  customerId: any;
  salesQuoteId: any;
  statusList: any = [];
  lazyLoadEventData: any;
  currentStatus: any = "0";
  viewType: any = 'detailedview';
  breadcrumbs: MenuItem[];
  home: any;
  salesOrderQuoteId: any;

  constructor(
    private salesQuoteService: SalesQuoteService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router,
    private customerService: CustomerService,
    public employeeService: EmployeeService,
    private commonservice: CommonService,
    public currencyService: CurrencyService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isSpinnerVisible = true;
    this.salesQuote = new SalesQuote();
    this.salesOrderQuote = new SalesOrderQuote();
    this.searchParameters = new SalesSearchParameters();
    // this.getStatusList();
    this.initColumns();
    this.searchParameters.filters = {
      ...this.searchParameters.filters,
      viewType: this.viewType
    }
    this.isSpinnerVisible = false;
    // this.breadcrumbs = [
    //   { label: 'Sales Order Quote' },
    //   { label: 'Quote List' },
    // ];
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
      { field: "salesOrderQuoteNumber", header: "SO Quote Num", width: "120px" },
      { field: "versionNumber", header: "Quote Ver Num", width: "130px" },
      { field: "quoteDate", header: "Quote Date", width: "130px" },
      { field: "partNumber", header: "PN", width: "130px" },
      { field: "partDescription", header: "PN Description", width: "180px" },
      { field: "stockLineNumber", header: "Stk Line Num", width: "150px" },
      { field: "serialNumber", header: "Ser Num", width: "120px" },
      { field: "conditionDescription", header: "Cond", width: "100px" },
      { field: "uomName", header: "UOM", width: "100px" },
      { field: "qtyQuoted", header: "Qty Quoted", width: "100px" },
      { field: "status", header: "Status", width: "100px" },
      { field: "currency", header: "Curr", width: "100px" },
      { field: "markupPerUnit", header: "MarkUp Amt", width: "120px" },
      { field: "grossSalePricePerUnit", header: "Gross Price/Unit", width: "140px" },
      { field: "discountAmount", header: "Disc. Amt", width: "120px" },
      { field: "markupExtended", header: "MarkUp Amt", width: "120px" },
      { field: "grossSalePrice", header: "Gross Sales Amt", width: "120px" },
      { field: "salesDiscountExtended", header: "Disc. Amt", width: "120px" },
      { field: "netSales", header: "Net Sales Amt", width: "130px" },
      { field: "misc", header: "Misc Amt", width: "120px" },
      { field: "totalSales", header: "Product Revenue", width: "130px" },
      { field: "unitCost", header: "Unit Cost", width: "130px" },
      { field: "unitCostExtended", header: "Extended Cost", width: "130px" },
      { field: "marginAmountExtended", header: "Margin Amt", width: "120px", style: "text-align:right" },
      { field: "marginPercentage", header: "Margin %", width: "100px", style: "text-align:right" },
      {
        field: "freight", header: "Freight", width: "120px", style: "text - align: right"
      },
      { field: "taxAmount", header: "Tax Amt", width: "120px" },
      { field: "totalRevenue", header: "Total Revenue", width: "130px" },
      { field: "notes", header: "Notes", width: "120px" },
    ];
    this.selectedColumns = this.headers;
  }

  initSummaryColumns() {
    this.headers = [
      { field: "salesOrderQuoteNumber", header: "SO Quote Num", width: "120px" },
      { field: "versionNumber", header: "Quote Ver Num", width: "130px" },
      { field: "partNumber", header: "PN", width: "130px" },
      { field: "partDescription", header: "PN Description", width: "180px" },
      { field: "uomName", header: "UOM", width: "100px" },
      { field: "qtyQuoted", header: "Qty Quoted", width: "100px" },
      { field: "currency", header: "Curr", width: "100px" },
      { field: "markupExtended", header: "MarkUp Amt", width: "120px" },
      { field: "grossSalePrice", header: "Gross Sales Amt", width: "120px" },
      { field: "salesDiscountExtended", header: "Disc. Amt", width: "120px" },
      { field: "netSales", header: "Net Sales Amt", width: "130px" },
      { field: "misc", header: "Misc Amt", width: "120px" },
      { field: "totalSales", header: "Product Revenue", width: "130px" },
      { field: "unitCostExtended", header: "Prod Cost", width: "130px" },
      { field: "marginAmountExtended", header: "Prod Margin Amt", width: "120px", style: "text-align:right" },
      { field: "marginPercentage", header: " Prod Margin %", width: "100px", style: "text-align:right" },
      {
        field: "freight", header: "Freight", width: "120px", style: "text - align: right"
      },
      { field: "taxAmount", header: "Tax Amt", width: "120px" },
      { field: "totalRevenue", header: "Total Revenue", width: "130px" },
    ];
    this.selectedColumns = this.headers;
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

  refresh(id) {
    this.salesOrderQuoteId = id;
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

    // this.onSearch();
  }

  globalSearch(val) {
    this.searchParameters.globalFilter = val
    const lazyEvent = this.lazyLoadEventData;
    // this.loadData(lazyEvent, val);

  }
  onSearch() {
    //this.alertService.startLoadingMessage();
    this.isSpinnerVisible = true;
    this.salesQuoteService
      .getAllSalesOrderQuoteAnalysis(this.salesOrderQuoteId)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.sales = response;
        if (this.sales.length > 0) {
          this.sales.forEach((sale, i) => {
            this.sales[i]['totalRevenue'] = this.calculateProductRevenue(sale, i);
            this.sales[i]['totalSales'] = this.calculateTotalRevenue(sale, i);
          })
        }
        this.totalRecords = response.length;
        this.totalPages = Math.ceil(
          this.totalRecords / this.searchParameters.rows
        );
        this.showPaginator = this.totalRecords > 0;
        //this.alertService.stopLoadingMessage();
        // this.isSpinnerVisible = false;
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
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

  onDataLoadFailed(log) {
    const errorLog = log;
    var msg = '';
    if (errorLog.message) {
      if (errorLog.error && errorLog.error.errors.length > 0) {
        for (let i = 0; i < errorLog.error.errors.length; i++) {
          msg = msg + errorLog.error.errors[i].message + '<br/>'
        }
      }
      this.alertService.showMessage(
        errorLog.error.message,
        msg,
        MessageSeverity.error
      );
    }
    else {
      this.alertService.showMessage(
        'Error',
        log.error,
        MessageSeverity.error
      );
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

  convertDate(key, data) {
    if ((key === 'quoteDate' || key === 'updatedDate' || key === 'createdDate') && data[key]) {
      return moment(data[key]).format('MM-DD-YYYY');
    } else {
      return data[key];
    }
  }

  getColorCodeForMultiple(data) {
    return data['partNumberType'] === 'Multiple' ? 'green' : 'black';
  }

  calculateTotalRevenue(part: PartDetail, i) {
    return this.sales[i].netSales + this.sales[i].misc;

  }

  calculateProductRevenue(part, i) {
    return this.sales[i].netSales + this.sales[i].misc + this.sales[i].freight + this.sales[i].taxAmount;
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
        uniquePart.qtyQuoted = this.getSum(uniquePart.qtyQuoted, part.qtyQuoted);
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
    // let uniquePartsFiltered = [];
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

}
