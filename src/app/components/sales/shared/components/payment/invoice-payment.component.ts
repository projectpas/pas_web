import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NavigationExtras } from "@angular/router";
import { CustomerService } from "../../../../../services/customer.service";
import { CommonService } from "../../../../../services/common.service";
import { InvoiceCheckPayment } from "../../../../../models/invoicePayment/InvoiceCheckPayment";
import { InvoicePaymentService } from "../../../../../services/invoice-payment-service";
import { AuthService } from "../../../../../services/auth.service";
import { MessageSeverity, AlertService } from "../../../../../services/alert.service";
import { forkJoin } from "rxjs";
import { LegalEntityService } from "../../../../../services/legalentity.service";
import { InvoiceWireTransferPayment } from "../../../../../models/invoicePayment/InvoiceWireTransferPayment";
import { InvoiceEFTPayment } from "../../../../../models/invoicePayment/InvoiceEFTPayment";
import { InvoiceCreditDebitCardPayments } from "../../../../../models/invoicePayment/InvoiceCreditDebitCardPayments";

@Component({
  selector: "app-invoice-payment",
  templateUrl: "./invoice-payment.component.html",
  styleUrls: ["./invoice-payment.component.css"]
})
export class AddPaymentComponent implements OnInit {
  @Input('modal-reference') modalReference: NgbModalRef;
  @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
  @Input() customerId;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild("addCheckMemo", { static: false }) addCheckMemo: ElementRef;
  @ViewChild("addWireMemo", { static: false }) addWireMemo: ElementRef;
  @ViewChild("addEFTMemo", { static: false }) addEFTMemo: ElementRef;
  @ViewChild("addCCMemo", { static: false }) addCCMemo: ElementRef;
  checkMemomodal: NgbModalRef;
  wireMemomodal: NgbModalRef;
  eftMemomodal: NgbModalRef;
  ccMemomodal: NgbModalRef;
  objInvoicePayment: any = {};
  enableUpdate: boolean;
  IsSingleOption: boolean = true;
  paymentMethod: number;
  chkPaymentMethod: number = 1;
  chkCheck: boolean;
  chkWireTransfer: boolean;
  chkEFT: boolean;
  chkCC: boolean;
  payment: any = {};
  currencyList: any = [];
  tempCheckMemo: any;
  tempWireMemo: any;
  tempEFTMemo: any;
  tempCCMemo: any;
  chkModuleName: any = "InvoiceCheckPayment";
  isSpinnerVisible: boolean = false;
  chkreferenceId: any;
  customerDetails: any;
  legalEntityData: any;
  legalEntityId: number;

  constructor(public customerService: CustomerService, private commonService: CommonService,
    private invoicePaymentService: InvoicePaymentService,
    private authService: AuthService,
    private alertService: AlertService,
    private legalEntityService: LegalEntityService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.paymentMethod = this.IsSingleOption ? 1 : 2;
    this.getCustomerDetails();
    this.fetchData();
    this.payment.dateProcessed = new Date();
    this.chkreferenceId = 1;
    this.objInvoicePayment.checkPayments = new InvoiceCheckPayment();
    this.objInvoicePayment.invoiceWireTransferPayment = new InvoiceWireTransferPayment();
    this.objInvoicePayment.invoiceEFTPayment = new InvoiceEFTPayment();
    this.objInvoicePayment.invoiceCreditDebitCardPayment = new InvoiceCreditDebitCardPayments();
  }

  arrayCurrencyList: any = [];

  fetchData() {
    this.arrayCurrencyList.push(0);
    this.isSpinnerVisible = true;
    forkJoin(
      this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', '', true, 20, this.arrayCurrencyList.join()),
      this.legalEntityService.getManagemententity(this.masterCompanyId)
    ).subscribe(result => {
      this.currencyList = result[0];
      this.legalEntityData = result[1];
      this.getLegalEntityId();
      this.glList();
      this.bindCheckPayment();
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  getLegalEntityId() {
    this.legalEntityId = this.legalEntityData[0].find(b =>
      b.managementStructureId == this.currentUserManagementStructureId).legalEntityId;
  }

  getCustomerDetails() {
    this.isSpinnerVisible = true;
    this.customerService.getCustomerCommonDataById(this.customerId).subscribe(res => {
      this.customerDetails = res;
      this.isSpinnerVisible = false;
    }, err => {
      this.isSpinnerVisible = false;
    })
  }

  allGlInfo: any[] = [];
  private glList() {
    this.commonService.getGlAccountList(this.masterCompanyId).subscribe(res => {
      this.allGlInfo = res;
    })
  }

  bindCheckPayment() {
    this.isSpinnerVisible = true;
    this.legalEntityService.getEntityLockboxDataById(this.legalEntityId).subscribe(res => {
      if (res[0] != undefined) {
        this.objInvoicePayment.checkPayments.bankAccount = res[0].payeeName;
        this.objInvoicePayment.checkPayments.glAccountNumber = res[0].glAccountId;
        this.isSpinnerVisible = false;
      }
    }, err => {
      this.isSpinnerVisible = false;
    })
  }

  onDepositeClick() {
  }

  enableSave() {

  }

  onPaymentMethodClick(value) {
    if (value == 1) {
      this.objInvoicePayment.isMultiplePaymentMethod = false;
      this.objInvoicePayment.isCheckPayment = true;
    }
    else {
      this.objInvoicePayment.isMultiplePaymentMethod = true;
      this.chkCheck = true;
    }
  }

  get currentUserManagementStructureId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.managementStructureId
      : null;
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

  onProcessPayment() {
    debugger;

    if (!this.objInvoicePayment.isMultiplePaymentMethod) {
      this.objInvoicePayment.isCheckPayment = this.chkPaymentMethod == 1 ? true : false;
      this.objInvoicePayment.isWireTransfer = this.chkPaymentMethod == 2 ? true : false;
      this.objInvoicePayment.isEFT = this.chkPaymentMethod == 3 ? true : false;
      this.objInvoicePayment.isCCDCPayment = this.chkPaymentMethod == 4 ? true : false;
    }

    if (this.objInvoicePayment.isCheckPayment) {
      this.objInvoicePayment.checkPayments.createdBy = this.userName;
      this.objInvoicePayment.checkPayments.updatedBy = this.userName;
      this.objInvoicePayment.checkPayments.masterCompanyId = this.masterCompanyId;
      this.objInvoicePayment.checkPayments.customerId = this.customerId;
      this.objInvoicePayment.checkPayments.soBillingInvoicingId = 1;
    }
    if (this.objInvoicePayment.isWireTransfer) {
      this.objInvoicePayment.invoiceWireTransferPayment.createdBy = this.userName;
      this.objInvoicePayment.invoiceWireTransferPayment.updatedBy = this.userName;
      this.objInvoicePayment.invoiceWireTransferPayment.masterCompanyId = this.masterCompanyId;
      this.objInvoicePayment.invoiceWireTransferPayment.customerId = this.customerId;
      this.objInvoicePayment.invoiceWireTransferPayment.soBillingInvoicingId = 1;
    }
    if (this.objInvoicePayment.isEFT) {
      this.objInvoicePayment.invoiceEFTPayment.createdBy = this.userName;
      this.objInvoicePayment.invoiceEFTPayment.updatedBy = this.userName;
      this.objInvoicePayment.invoiceEFTPayment.masterCompanyId = this.masterCompanyId;
      this.objInvoicePayment.invoiceEFTPayment.customerId = this.customerId;
      this.objInvoicePayment.invoiceEFTPayment.soBillingInvoicingId = 1;
    }
    if (this.objInvoicePayment.isCCDCPayment) {
      this.objInvoicePayment.invoiceCreditDebitCardPayment.createdBy = this.userName;
      this.objInvoicePayment.invoiceCreditDebitCardPayment.updatedBy = this.userName;
      this.objInvoicePayment.invoiceCreditDebitCardPayment.masterCompanyId = this.masterCompanyId;
      this.objInvoicePayment.invoiceCreditDebitCardPayment.customerId = this.customerId;
      this.objInvoicePayment.invoiceCreditDebitCardPayment.soBillingInvoicingId = 1;
    }

    if (!this.objInvoicePayment.isCheckPayment) {
      this.objInvoicePayment.checkPayments = null;
    }
    if (!this.objInvoicePayment.isWireTransfer) {
      this.objInvoicePayment.invoiceWireTransferPayment = null;
    }
    if (!this.objInvoicePayment.isEFT) {
      this.objInvoicePayment.invoiceEFTPayment = null;
    }
    if (!this.objInvoicePayment.isCCDCPayment) {
      this.objInvoicePayment.invoiceCreditDebitCardPayment = null;
    }

    this.objInvoicePayment.createdBy = this.userName;
    this.objInvoicePayment.updatedBy = this.userName;
    this.objInvoicePayment.masterCompanyId = this.masterCompanyId;
    this.objInvoicePayment.customerId = this.customerId;
    this.objInvoicePayment.soBillingInvoicingId = 1;

    this.isSpinnerVisible = true;
    this.invoicePaymentService.ProcessPayment(this.objInvoicePayment).subscribe(result => {
      this.isSpinnerVisible = false;
      this.alertService.showMessage(
        "Success",
        `Payment Added successfully.`,
        MessageSeverity.success
      );
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  onClose(event: Event): void {
    event.preventDefault();
    this.close.emit(true);
  }

  onTabChange(event) {
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

  /* Check Memo */
  openCheckMemo() {
    this.checkMemomodal = this.modalService.open(this.addCheckMemo, { size: "sm", backdrop: 'static', keyboard: false });
  }

  dismissCheckMemoModel() {
    this.checkMemomodal.close();
  }

  onAddCheckMemo() {
    this.tempCheckMemo = this.objInvoicePayment.checkPayments.memo;
  }

  onSaveCheckMemo() {
    this.objInvoicePayment.checkPayments.memo = this.tempCheckMemo;
    this.dismissCheckMemoModel();
  }
  /* Check Memo */

  /* Wire Transfer Memo */
  openWireMemo() {
    this.wireMemomodal = this.modalService.open(this.addWireMemo, { size: "sm", backdrop: 'static', keyboard: false });
  }

  dismissWireMemoModel() {
    this.wireMemomodal.close();
  }

  onAddWireMemo() {
    this.tempWireMemo = this.objInvoicePayment.invoiceWireTransferPayment.memo;
  }

  onSaveWireMemo() {
    this.objInvoicePayment.invoiceWireTransferPayment.memo = this.tempWireMemo;
    this.dismissWireMemoModel();
  }
  /* Wire Transfer Memo */

  /* EFT Memo */
  openEFTMemo() {
    this.eftMemomodal = this.modalService.open(this.addEFTMemo, { size: "sm", backdrop: 'static', keyboard: false });
  }

  dismissEFTMemoModel() {
    this.eftMemomodal.close();
  }

  onAddEFTMemo() {
    this.tempEFTMemo = this.objInvoicePayment.invoiceEFTPayment.memo;
  }

  onSaveEFTMemo() {
    this.objInvoicePayment.invoiceEFTPayment.memo = this.tempEFTMemo;
    this.dismissEFTMemoModel();
  }
  /* EFT Memo */

  /* Credit Debit Card Memo */
  openCCMemo() {
    this.ccMemomodal = this.modalService.open(this.addCCMemo, { size: "sm", backdrop: 'static', keyboard: false });
  }

  dismissCCMemoModel() {
    this.ccMemomodal.close();
  }

  onAddCCMemo() {
    this.tempCCMemo = this.objInvoicePayment.invoiceCreditDebitCardPayment.memo;
  }

  onSaveCCMemo() {
    this.objInvoicePayment.invoiceCreditDebitCardPayment.memo = this.tempCCMemo;
    this.dismissCCMemoModel();
  }
  /* Credit Debit Card Memo */
}