import { Component, OnInit, ViewChild, Input } from "@angular/core";
import * as $ from "jquery";
import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { ISalesSearchParameters } from "../../../../../../models/sales/ISalesSearchParameters";
import { SalesSearchParameters } from "../../../../../../models/sales/SalesSearchParameters";
import {
  AlertService,
  DialogType,
  MessageSeverity
} from "../../../../../../services/alert.service";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { ISalesQuote } from "../../../../../../models/sales/ISalesQuote.model";
import { SalesQuote } from "../../../../../../models/sales/SalesQuote.model";
import { ISalesOrderQuote } from "../../../../../../models/sales/ISalesOrderQuote";
import { ISalesQuoteView } from "../../../../../../models/sales/ISalesQuoteView";
import { SalesQuoteView } from "../../../../../../models/sales/SalesQuoteView";
import { SalesOrderQuotePart } from "../../../../../../models/sales/SalesOrderQuotePart";
import { SalesOrderQuote } from "../../../../../../models/sales/SalesOrderQuote";
import { Currency } from "../../../../../../models/currency.model";
import { CurrencyService } from "../../../../../../services/currency.service";
import { EmployeeService } from "../../../../../../services/employee.service";
import { CustomerService } from "../../../../../../services/customer.service";
import { CommonService } from "../../../../../../services/common.service";
import { AuthService } from "../../../../../../services/auth.service";
import { PartDetail } from "../../../../shared/models/part-detail";
import { listSearchFilterObjectCreation } from "../../../../../../generic/autocomplete";
import { StocklineViewComponent } from '../../../../../../shared/components/stockline/stockline-view/stockline-view.component';
import {
  getValueFromObjectByKey,
  getObjectById,
  editValueAssignByCondition,
  getObjectByValue
} from "../../../../../../generic/autocomplete";
import { SalesCustomerApprovalsComponent } from "../sales-customer-approvals/sales-customer-approvals.component";
import { SalesApproveComponent } from "../sales-approve/sales-approve.component";
import { MarginSummary } from "../../../../../../models/sales/MarginSummaryForSalesorder";
import { SalesOrderQuoteFreightComponent } from "../../../../shared/components/sales-order-quote-freight/sales-order-quote-freight.component";
import { SalesOrderQuoteChargesComponent } from "../../../../shared/components/sales-order-quote-charges/sales-order-quote-charges.component";
import { SOQuoteMarginSummary } from "../../../../../../models/sales/SoQuoteMarginSummary";
import { forkJoin } from "rxjs";
import { SalesQuoteDocumentsComponent } from "../../../sales-document/salesQuote-document.component";

@Component({
  selector: "app-sales-quote-view",
  templateUrl: "./sales-quote-view.component.html",
  styleUrls: ["./sales-quote-view.component.scss"]
})
export class SalesQuoteViewComponent implements OnInit {

  @ViewChild(SalesApproveComponent,{static:false}) public salesApproveComponent: SalesApproveComponent;
  @ViewChild(SalesCustomerApprovalsComponent,{static:false}) public salesCustomerApprovalsComponent: SalesCustomerApprovalsComponent;
  @ViewChild(SalesOrderQuoteFreightComponent,{static:false}) public salesOrderQuoteFreightComponent: SalesOrderQuoteFreightComponent;
  @ViewChild(SalesOrderQuoteChargesComponent,{static:false}) public salesOrderQuoteChargesComponent: SalesOrderQuoteChargesComponent;
  @ViewChild(SalesQuoteDocumentsComponent,{static:false}) public salesQuoteDocumentsComponent: SalesQuoteDocumentsComponent;
  @Input() salesQuoteId: any;
  @Input() customerId;
  @Input() salesQuoteView: any;
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

  partColumns: any[];
  marginSummary: SOQuoteMarginSummary = new SOQuoteMarginSummary();
  customerDetails: any;
  salesQuote: any;
  salesOrderQuote: any = {};
  selectedParts: any[] = [];
  creditTerms: any[];
  percents: any[];
  allCurrencyInfo: any[];
  allEmployeeinfo: any[] = [];
  customerWarningData: any = [];
  accountTypes: any[];
  partModal: NgbModalRef;
  SalesOrderQuoteId: any;
  managementStructureId: any;
  customerContactList: any = [];
  freight = [];
  charge = [];
  salesOrderFreightList = [];
  markupList = [];
  buildMethodDetails = [];
  isSpinnerVisible = false;

  constructor(
    private salesQuoteService: SalesQuoteService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private customerService: CustomerService,
    public employeeService: EmployeeService,
    private commonservice: CommonService,
    public currencyService: CurrencyService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.salesQuote = this.salesQuoteView.salesOrderQuote;
    this.salesQuoteService.selectedParts = this.marshallParts(this.salesQuoteView.parts);
    this.customerId = this.salesQuoteView.salesOrderQuote.customerId;
    this.getRequiredData();
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  getRequiredData() {
    this.isSpinnerVisible = true;
    this.managementStructureId = this.salesQuote.managementStructureId;
    forkJoin(
      this.employeeService.getEmployeeCommonData(this.managementStructureId),
      this.customerService.getContacts(this.salesQuoteView.salesOrderQuote.customerId),
      this.commonservice.getManagementStructureNameandCodes(this.managementStructureId),
      this.commonservice.smartDropDownList("[Percent]", "PercentId", "PercentValue"),
      this.salesQuoteService.getSOQMarginSummary(this.salesQuoteView.salesOrderQuote.salesOrderQuoteId)).subscribe(result => {
        this.isSpinnerVisible = false;
        this.onempDataLoadSuccessful(result[0][0]);
        this.setAllCustomerContact(result[1]);
        this.setManagementStructureCodes(result[2]);
        this.markupList = result[3];
        if (result[4]) {
          this.marginSummary = result[4];
        }
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      });
  }

  marshallParts(parts) {
    let selectedPartsTemp = [];
    if (parts && parts.length > 0) {
      parts.forEach((part, i) => {
        let selectedPart = parts[i];
        let partNumberObj = this.salesQuoteService.marshalSOQPartToView(selectedPart);
        selectedPartsTemp.push(partNumberObj);
      })
      return selectedPartsTemp;
    }
  }

  viewSelectedStockLine(rowData) {

    this.partModal = this.modalService.open(StocklineViewComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    this.partModal.componentInstance.stockLineId = rowData.stockLineId;
    this.partModal.result.then(() => {
    }, () => { })

  }

  get userId() {
    return this.authService.currentUser ? this.authService.currentUser.id : 0;
  }

  get currentUserManagementStructureId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.managementStructureId
      : null;
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

  private onempDataLoadSuccessful(getEmployeeCerficationList: any[]) {
    this.allEmployeeinfo = getEmployeeCerficationList;
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
      this.salesApproveComponent.refresh(this.marginSummary);
    }
    if (event.index == 2) {
      this.salesCustomerApprovalsComponent.refresh(this.marginSummary, this.salesQuoteView.salesOrderQuote.salesOrderQuoteId, true, this.customerContactList);
    }
    if (event.index == 4) {
      this.salesOrderQuoteFreightComponent.refresh(true);
    }
    if (event.index == 5) {
      this.salesOrderQuoteChargesComponent.refresh(true);
    }
    if (event.index == 6) {
      this.salesQuoteDocumentsComponent.refresh();
    }
  }

  verifySalesQuoteConversion(event) {

  }

  onPartsApprovedEvent(event) {

  }

  setManagementStructureCodes(res) {
    if (res.Level1) {
      this.managementStructure.level1 = res.Level1;
    } else {
      this.managementStructure.level1 = '-';
    }
    if (res.Level2) {
      this.managementStructure.level2 = res.Level2;
    } else {
      this.managementStructure.level2 = '-';
    }
    if (res.Level3) {
      this.managementStructure.level3 = res.Level3;
    } else {
      this.managementStructure.level3 = '-';
    }
    if (res.Level4) {
      this.managementStructure.level4 = res.Level4;
    } else {
      this.managementStructure.level4 = '-';
    }
  }
  saveSalesOrderFreightsList(e) {
  }

  updateSalesOrderFreightsList(e) {

  }

  getFreightList(e) {
  }

  saveSalesOrderChargesList(e) {
  }

  updateSalesOrderChargesList(e) {

  }

  getChargesList() {
  }

}
