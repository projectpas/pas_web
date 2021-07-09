import { Component, OnInit, ViewChild, Input } from '@angular/core';
import * as $ from "jquery";
import { ExchangequoteService } from "../../../../../services/exchangequote.service";
import {
  AlertService,
  DialogType,
  MessageSeverity
} from "../../../../../services/alert.service";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CurrencyService } from "../../../../../services/currency.service";
import { EmployeeService } from "../../../../../services/employee.service";
import { CustomerService } from "../../../../../services/customer.service";
import { CommonService } from "../../../../../services/common.service";
import { AuthService } from "../../../../../services/auth.service";
import{ExchangeQUoteMarginSummary} from '../../../../../models/exchange/ExchangeQUoteMarginSummary';
import { forkJoin } from "rxjs/observable/forkJoin";
import { ExchangeQuotePartNumberComponent } from "../../../shared/components/exchange-quote-part-number/exchange-quote-part-number.component";
import { ExchangeQuoteApproveComponent } from "../../../shared/components/exchange-quote-approve/exchange-quote-approve.component";
import { ExchangeQuoteCustomerApprovalComponent } from "../../../shared/components/exchange-quote-customer-approval/exchange-quote-customer-approval.component";
import{ExchangeQuoteAnalysisComponent} from '../../../../exchange-quote/exchange-quote-analysis/exchange-quote-analysis.component';
import {ExchangeQuoteChargesComponent} from "../../../../exchange-quote/shared/components/exchange-quote-charges/exchange-quote-charges.component";
import {ExchangeQuoteFreightComponent} from "../../../../exchange-quote/shared/components/exchange-quote-freight/exchange-quote-freight.component";
@Component({
  selector: 'app-exchange-quote-view',
  templateUrl: './exchange-quote-view.component.html',
  styleUrls: ['./exchange-quote-view.component.scss']
})
export class ExchangeQuoteViewComponent implements OnInit {
  @Input() exchangeQuoteId: any;
  @Input() customerId;
  @Input() exchangeQuoteView: any;
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
  managementStructure: any = {};
  moduleName: any = "ExchangeQuote";
  partColumns: any[];
  marginSummary: ExchangeQUoteMarginSummary = new ExchangeQUoteMarginSummary();
  customerDetails: any;
  exchangeQuote: any;
  exchangeOrderQuote: any = {};
  selectedParts: any[] = [];
  creditTerms: any[];
  percents: any[];
  allCurrencyInfo: any[];
  customerWarningData: any = [];
  accountTypes: any[];
  partModal: NgbModalRef;
  SalesOrderQuoteId: any;
  managementStructureId: any;
  customerContactList: any = [];
  freight = [];
  charge = [];
  salesOrderFreightList = [];
  markupList:any = [];
  buildMethodDetails = [];
  isSpinnerVisible = false;
  @ViewChild(ExchangeQuoteApproveComponent,{static:false}) public exchangeQuoteApproveComponent: ExchangeQuoteApproveComponent;
  @ViewChild(ExchangeQuoteCustomerApprovalComponent,{static:false}) public exchangeQuoteCustomerApprovalComponent: ExchangeQuoteCustomerApprovalComponent;
  @ViewChild(ExchangeQuoteFreightComponent,{static:false}) public exchangeQuoteFreightComponent: ExchangeQuoteFreightComponent;
  @ViewChild(ExchangeQuoteChargesComponent,{static:false}) public exchangeQuoteChargesComponent: ExchangeQuoteChargesComponent;
  //@ViewChild(SalesQuoteDocumentsComponent,{static:false}) public salesQuoteDocumentsComponent: SalesQuoteDocumentsComponent;
  @ViewChild(ExchangeQuoteAnalysisComponent,{static:false}) public exchangeQuoteAnalysisComponent: ExchangeQuoteAnalysisComponent;
  constructor(private exchangequoteService: ExchangequoteService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private customerService: CustomerService,
    public employeeService: EmployeeService,
    private commonservice: CommonService,
    public currencyService: CurrencyService,
    private authService: AuthService) { }

  ngOnInit() {
    this.exchangeQuote = this.exchangeQuoteView.exchangeOrderQuote;
    this.exchangequoteService.selectedParts = this.marshallParts(this.exchangeQuoteView.parts);
    this.customerId = this.exchangeQuoteView.exchangeOrderQuote.customerId;
    this.getRequiredData();
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }
  get masterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : 1;
  }

  getRequiredData() {
    this.isSpinnerVisible = true;
    this.managementStructureId = this.exchangeQuote.managementStructureId;
    let probabilityId = this.exchangeQuote.probabilityId ? this.exchangeQuote.probabilityId : 0;
    forkJoin(
      this.customerService.getContacts(this.exchangeQuoteView.exchangeOrderQuote.customerId),
      this.commonservice.autoSuggestionSmartDropDownList("[Percent]", "PercentId", "PercentValue", '', true, 200, [probabilityId].join(),this.masterCompanyId),
      this.exchangequoteService.getExchangeQuoteMarginSummary(this.exchangeQuoteView.exchangeOrderQuote.exchangeQuoteId)).subscribe(result => {
        this.isSpinnerVisible = false;
        this.setAllCustomerContact(result[0]);
        //this.setManagementStructureCodes(result[1]);
        this.markupList = result[1];
        if (result[2]) {
          this.marginSummary = result[2];
        }
      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  marshallParts(parts) {
    let selectedPartsTemp = [];
    if (parts && parts.length > 0) {
      parts.forEach((part, i) => {
        let selectedPart = parts[i];
        let partNumberObj = this.exchangequoteService.marshalExchangeQuotePartToView(selectedPart);
        selectedPartsTemp.push(partNumberObj);
      })
      return selectedPartsTemp;
    }
  }
  // viewSelectedStockLine(rowData) {
  //   this.partModal = this.modalService.open(StocklineViewComponent, { size: 'lg', backdrop: 'static', keyboard: false });
  //   this.partModal.componentInstance.stockLineId = rowData.stockLineId;
  //   this.partModal.result.then(() => {
  //   }, () => { })
  // }

  get userId() {
    return this.authService.currentUser ? this.authService.currentUser.id : 0;
  }

  get currentUserManagementStructureId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.managementStructureId
      : null;
  }

  setAllCustomerContact(res) {
    if (res[0] && res[0].length > 0) {
      this.customerContactList = res[0];
      for (let i = 0; i < this.customerContactList.length; i++) {
        this.customerContactList[i]['contactName'] = this.customerContactList[i].firstName + " " + this.customerContactList[i].lastName;
      }
    } else {
      this.customerContactList = [];
    }
  }

  onTabChange(event) {
    if (event.index == 1) {
      this.exchangeQuoteApproveComponent.refresh(this.marginSummary);
    }
    if (event.index == 2) {
      this.exchangeQuoteCustomerApprovalComponent.refresh(this.marginSummary, this.exchangeQuoteView.exchangeOrderQuote.exchangeQuoteId, true, this.customerContactList);
    }
    if (event.index == 4) {
      this.exchangeQuoteFreightComponent.refresh(true);
    }
    if (event.index == 5) {
      this.exchangeQuoteChargesComponent.refresh(true);
    }
    // if (event.index == 6) {
    //   this.salesQuoteDocumentsComponent.refresh();
    // }
    if (event.index == 6) {
      this.exchangeQuoteAnalysisComponent.refresh(this.exchangeQuoteView.exchangeOrderQuote.exchangeQuoteId);
    }
  }
}
