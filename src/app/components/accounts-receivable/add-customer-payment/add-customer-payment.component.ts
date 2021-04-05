import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NavigationExtras } from "@angular/router";
import { CommonService } from "../../../services/common.service";
import { AuthService } from "../../../services/auth.service";
import { MessageSeverity, AlertService } from "../../../services/alert.service";
import { forkJoin } from "rxjs";
import { InvoiceWireTransferPayment } from "../../../models/invoicePayment/InvoiceWireTransferPayment";
import { InvoiceEFTPayment } from "../../../models/invoicePayment/InvoiceEFTPayment";
import { InvoiceCreditDebitCardPayments } from "../../../models/invoicePayment/InvoiceCreditDebitCardPayments";
import { CustomerService } from "../../../services/customer.service";
import { InvoicePaymentService } from "../../../services/invoice-payment-service";
import { InvoiceCheckPayment } from "../../../models/invoicePayment/InvoiceCheckPayment";
import { LegalEntityService } from "../../../services/legalentity.service";
import { editValueAssignByCondition } from "../../../generic/autocomplete";
import { NgForm } from "@angular/forms";
import { CustomerReceiptInfo } from "../../../models/invoicePayment/CustomerReceiptInfo";
import { CustomerPaymentsService } from "../../../services/customer-payment.service";

@Component({
  selector: "app-add-customer-payment",
  templateUrl: "./add-customer-payment.component.html",
  styleUrls: ["./add-customer-payment.component.css"]
})
export class AddCustomerPaymentComponent implements OnInit {
  @Input('modal-reference') modalReference: NgbModalRef;
  @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
  @Input() customerId;
  @Input() customerPayment;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild("addCheckMemo", { static: false }) addCheckMemo: ElementRef;
  @ViewChild("addWireMemo", { static: false }) addWireMemo: ElementRef;
  //@ViewChild("addEFTMemo", { static: false }) addEFTMemo: ElementRef;
  @ViewChild("addCCMemo", { static: false }) addCCMemo: ElementRef;
  @ViewChild('checkForm', { static: false }) checkForm: NgForm;
  @ViewChild('wireForm', { static: false }) wireForm: NgForm;
  checkMemomodal: NgbModalRef;
  wireMemomodal: NgbModalRef;
  eftMemomodal: NgbModalRef;
  ccMemomodal: NgbModalRef;
  objInvoicePayment: any = {};
  enableUpdate: boolean;
  IsSingleOption: boolean = true;
  paymentMethod: number;
  paymentType: number = 1;
  id: number;
  //invoicePayment: IInvoicePayments;
  customerReceipt: CustomerReceiptInfo;
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
  openInvoices: any[] = [];
  headers: any[];
  selectedCustomer: any;
  customerallListOriginal: any;
  isCustomerNameAlreadyExists: boolean = false;
  customerNames: { customerId: any; name: any; }[];
  arrayCustlist: any[] = [];
  customerListOriginal: any;
  selectedParentId: any;
  paymentInfoFilled: boolean = false;
  tradeReceivableGL: any;
  miscReceiptsGL: any;
  selectall: any;
  totalPaymentAmount: number;
  combinedPaymentRef: string;

  constructor(public customerService: CustomerService, private commonService: CommonService,
    private invoicePaymentService: InvoicePaymentService,
    private customerPaymentsService: CustomerPaymentsService,
    private authService: AuthService,
    private alertService: AlertService,
    private legalEntityService: LegalEntityService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.paymentMethod = this.IsSingleOption ? 1 : 2;
    this.paymentType = 1;
    this.fetchData();
    this.payment.dateProcessed = new Date();
    this.chkreferenceId = 1;
    this.objInvoicePayment.checkPayments = new InvoiceCheckPayment();
    this.objInvoicePayment.invoiceWireTransferPayment = new InvoiceWireTransferPayment();
    this.objInvoicePayment.invoiceEFTPayment = new InvoiceEFTPayment();
    this.objInvoicePayment.invoiceCreditDebitCardPayment = new InvoiceCreditDebitCardPayments();

    this.headers = [
      { field: "documentType", header: "Doc Type", width: "130px" },
      { field: "docNum", header: "Doc Num", width: "130px" },
      { field: "invoiceDate", header: "Doc Date", width: "130px" },
      { field: "originalAmount", header: "Original Amount", width: "100px" },
      { field: "remainingAmount", header: "Remaining Amount", width: "130px" },
      { field: "paymentAmount", header: "Payment", width: "130px" },
      { field: "discAmount", header: "Disc Amount", width: "130px" },
      { field: "discType", header: "Disc Type", width: "130px" },
      { field: "bankFeeAmount", header: "Bank Fee Amount", width: "130px" },
      { field: "bankFeeType", header: "Bank Fee Type", width: "130px" },
      { field: "otherAdjustAmt", header: "Other Adjust Amt", width: "130px" },
      { field: "reason", header: "Reason", width: "130px" },
      { field: "newRemainingBal", header: "New Remaining Bal", width: "130px" },
      { field: "glARAccount", header: "GL AR Account", width: "130px" },
      { field: "currencyCode", header: "Curr", width: "180px" },
      { field: "fxRate", header: "FX Rate", width: "100px" },
      { field: "wosoNum", header: "WO/SO Num", width: "130px" },
      { field: "paymentStatus", header: "Status", width: "130px" },
      { field: "dsi", header: "DSI", width: "130px" },
      { field: "dso", header: "DSO", width: "180px" },
      { field: "amountPastDue", header: "Amount Past Due", width: "130px" },
      { field: "arBalance", header: "AR Bal", width: "130px" },
      { field: "creditTermName", header: "Credit Term", width: "130px" },
      { field: "cntrlNum", header: "Cntrl Num", width: "130px" },
      { field: "employee", header: "Employee", width: "180px" },
      { field: "level1", header: "CO", width: "130px" },
      { field: "level2", header: "BU", width: "130px" },
      { field: "level3", header: "Div", width: "130px" },
      { field: "level4", header: "Dept", width: "130px" }
      // { field: "customerCode", header: "Cust Num", width: "130px" },
      // { field: "customerReference", header: "Cust Ref", width: "130px" },
      // { field: "invDueDate", header: "Inv Due Date", width: "130px" },
      // { field: "creditLimit", header: "Credit Limit", width: "130px" }      
    ];
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
      //this.openInvoices = result[2][0];
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
      this.customerDetails.amount = this.totalPaymentAmount;
      this.customerDetails.amountRem = this.totalPaymentAmount;
      this.customerDetails.paymentRef = this.combinedPaymentRef;
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

  onPaymentTypeClick(value) {
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
      //this.objInvoicePayment.isEFT = this.chkPaymentMethod == 3 ? true : false;
      this.objInvoicePayment.isCCDCPayment = this.chkPaymentMethod == 3 ? true : false;
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
    // if (this.objInvoicePayment.isEFT) {
    //   this.objInvoicePayment.invoiceEFTPayment.createdBy = this.userName;
    //   this.objInvoicePayment.invoiceEFTPayment.updatedBy = this.userName;
    //   this.objInvoicePayment.invoiceEFTPayment.masterCompanyId = this.masterCompanyId;
    //   this.objInvoicePayment.invoiceEFTPayment.customerId = this.customerId;
    //   this.objInvoicePayment.invoiceEFTPayment.soBillingInvoicingId = 1;
    // }
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
    // if (!this.objInvoicePayment.isEFT) {
    //   this.objInvoicePayment.invoiceEFTPayment = null;
    // }
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

  enableCustSearch() {
    this.totalPaymentAmount = 0;
    let checkAmount = parseFloat(this.objInvoicePayment.checkPayments.amount);
    let wireTransferAmount = parseFloat(this.objInvoicePayment.invoiceWireTransferPayment.amount);
    let creditDebitCardAmount = parseFloat(this.objInvoicePayment.invoiceCreditDebitCardPayment.amount);

    let checkRef: any;
    let wireRef: any;
    let ccRef: any;

    if ((!this.objInvoicePayment.isMultiplePaymentMethod && this.chkPaymentMethod == 1) ||
      (this.objInvoicePayment.isMultiplePaymentMethod && this.objInvoicePayment.isCheckPayment)) {
      this.totalPaymentAmount += checkAmount;

      checkRef = this.objInvoicePayment.checkPayments.checkNumber;
    }
    if ((!this.objInvoicePayment.isMultiplePaymentMethod && this.chkPaymentMethod == 2) ||
      (this.objInvoicePayment.isMultiplePaymentMethod && this.objInvoicePayment.isWireTransfer)) {
      this.totalPaymentAmount += wireTransferAmount;

      wireRef = this.objInvoicePayment.invoiceWireTransferPayment.referenceNo;
    }
    if ((!this.objInvoicePayment.isMultiplePaymentMethod && this.chkPaymentMethod == 3) ||
      (this.objInvoicePayment.isMultiplePaymentMethod && this.objInvoicePayment.isCCDCPayment)) {
      this.totalPaymentAmount += creditDebitCardAmount;

      ccRef = this.objInvoicePayment.invoiceCreditDebitCardPayment.referenceNo;
    }

    this.combinedPaymentRef = (checkRef ? checkRef : '') + (wireRef ? (' ' + wireRef) : '') + (ccRef ? (' ' + ccRef) : '');
    this.paymentInfoFilled = true;
  }

  checkCustomerNameExist(value) {
    // this.changeName = true;
    this.isCustomerNameAlreadyExists = false;
    // this.disableSaveCustomerName = false;
    if (value != this.selectedCustomer) {
      if (this.customerallListOriginal != undefined && this.customerallListOriginal != null) {
        for (let i = 0; i < this.customerallListOriginal.length; i++) {
          if (this.objInvoicePayment.custName == this.customerallListOriginal[i].name || value == this.customerallListOriginal[i].name) {
            this.isCustomerNameAlreadyExists = true;
            //this.disableSaveCustomerName = true;
            return;
          }
        }
      }
    }
  }

  selectedCustomerName() {
    this.isSpinnerVisible = true;
    const value = editValueAssignByCondition('value', this.objInvoicePayment.name);
    this.customerId = value;
    this.getCustomerDetails();

    this.customerService.getOpenInvoiceListByCustomerId(this.customerId).subscribe(response => {
      this.openInvoices = response[0];
      this.isSpinnerVisible = false;
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  async loadcustomerData(strText = '') {
    if (this.arrayCustlist.length == 0) {
      this.arrayCustlist.push(0);
    }

    await this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arrayCustlist.join(), this.masterCompanyId).subscribe(response => {
      this.customerListOriginal = response.map(x => {
        return {
          name: x.label, value: x.value
        }
      })
      this.customerallListOriginal = response.map(x => {
        return {
          name: x.label, value: x.value
        }
      })
      this.customerNames = response;

    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  filterCustomerNames(event) {
    if (event.query !== undefined && event.query !== null) {
      this.loadcustomerEditData(event.query);
    }
  }

  async loadcustomerEditData(strText = '') {
    if (this.arrayCustlist.length == 0) {
      this.arrayCustlist.push(0);
    }

    await this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arrayCustlist.join(), this.masterCompanyId).subscribe(response => {

      this.customerListOriginal = response.map(x => {
        return {
          name: x.label, value: x.value //, customerId: x.value
        }
      })
      this.customerallListOriginal = response.map(x => {
        return {
          name: x.label, value: x.value //, customerId: x.value
        }
      })
      this.customerNames = response;
      this.customerNames = this.customerallListOriginal.reduce((acc, obj) => {
        return acc.filter(x => x.value !== this.selectedParentId)
      }, this.customerallListOriginal)
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  onChangeAmount(event, paymentList) {
    let totalAmount = parseFloat(this.customerDetails ? this.customerDetails.amount : 0);
    let checkAmountEntered = (paymentList.checkPayments.amount !== undefined ? paymentList.checkPayments.amount : 0);
    let wireAmountEntered = (paymentList.invoiceWireTransferPayment.amount !== undefined ? paymentList.invoiceWireTransferPayment.amount : 0);
    let ccAmountEntered = (paymentList.invoiceCreditDebitCardPayment.amount !== undefined ? paymentList.invoiceCreditDebitCardPayment.amount : 0);

    totalAmount = parseFloat(checkAmountEntered) + parseFloat(wireAmountEntered) + parseFloat(ccAmountEntered);

    if (this.customerDetails) { this.customerDetails.amount = totalAmount; }
    this.UpdateRemAmount();
  }

  UpdateRemAmount() {
    let total: number = 0;

    this.openInvoices.forEach(e => {
      total = total + parseFloat(e.paymentAmount);
    });

    if (this.customerDetails) {
      this.customerDetails.amountRem = +parseFloat(this.customerDetails.amount) - total;
    }
  }

  onChangePaymentAmount(event, paymentList) {
    let paymentAmount = event.target.value;
    paymentList["paymentAmount"] = paymentAmount;
    let remInvAmount = parseFloat(paymentList["remainingAmount"] ? paymentList["remainingAmount"] : 0);
    let dicsAmount = parseFloat(paymentList["discAmount"] ? paymentList["discAmount"] : 0);
    let bankFeeAmount = parseFloat(paymentList["bankFeeAmount"] ? paymentList["bankFeeAmount"] : 0);
    let otherAdjustAmt = parseFloat(paymentList["otherAdjustAmt"] ? paymentList["otherAdjustAmt"] : 0);

    paymentList["newRemainingBal"] = +remInvAmount - parseFloat(paymentAmount) - dicsAmount - bankFeeAmount - otherAdjustAmt;

    this.UpdateRemAmount();
  }

  onChangeDiscAmount(event, paymentList) {
    let discAmount = event.target.value;
    paymentList["discAmount"] = discAmount;
    let remInvAmount = parseFloat(paymentList["remainingAmount"] ? paymentList["remainingAmount"] : 0);
    let otherAdjustAmt = parseFloat(paymentList["otherAdjustAmt"] ? paymentList["otherAdjustAmt"] : 0);
    let bankFeeAmount = parseFloat(paymentList["bankFeeAmount"] ? paymentList["bankFeeAmount"] : 0);
    let paymentAmount = parseFloat(paymentList["paymentAmount"] ? paymentList["paymentAmount"] : 0);

    paymentList["newRemainingBal"] = +remInvAmount - paymentAmount - parseFloat(discAmount) - bankFeeAmount - otherAdjustAmt;

    this.UpdateRemAmount();
  }

  onChangeBankFee(event, paymentList) {
    let bankFeeAmount = event.target.value;
    paymentList["bankFeeAmount"] = bankFeeAmount;
    let remInvAmount = parseFloat(paymentList["remainingAmount"] ? paymentList["remainingAmount"] : 0);
    let dicsAmount = parseFloat(paymentList["discAmount"] ? paymentList["discAmount"] : 0);
    let paymentAmount = parseFloat(paymentList["paymentAmount"] ? paymentList["paymentAmount"] : 0);
    let otherAdjustAmt = parseFloat(paymentList["otherAdjustAmt"] ? paymentList["otherAdjustAmt"] : 0);

    paymentList["newRemainingBal"] = +remInvAmount - paymentAmount - dicsAmount - parseFloat(bankFeeAmount) - otherAdjustAmt;

    this.UpdateRemAmount();
  }

  onChangeOtherAdjustAmt(event, paymentList) {
    let otherAdjustAmt = event.target.value;
    paymentList["otherAdjustAmt"] = otherAdjustAmt;
    let remInvAmount = parseFloat(paymentList["remainingAmount"] ? paymentList["remainingAmount"] : 0);
    let dicsAmount = parseFloat(paymentList["discAmount"] ? paymentList["discAmount"] : 0);
    let bankFeeAmount = parseFloat(paymentList["bankFeeAmount"] ? paymentList["bankFeeAmount"] : 0);
    let paymentAmount = parseFloat(paymentList["paymentAmount"] ? paymentList["paymentAmount"] : 0);

    paymentList["newRemainingBal"] = +remInvAmount - paymentAmount - dicsAmount - bankFeeAmount - parseFloat(otherAdjustAmt);

    this.UpdateRemAmount();
  }

  selectAllApproval(type, isSelected) {
    this.openInvoices.forEach(
      (x, i) => {
        // let disableEdit = this.getPartToDisableOrNot(x);
        // if (disableEdit) {
        x.selected = !isSelected;
        //}
      }
    );
  }

  checkIfInvoiceSelected() {
    let selectedFound: boolean = false;
    this.openInvoices.forEach(
      (x, i) => {
        if (x.selected) {
          selectedFound = true;
        }
      }
    );

    if (selectedFound) {
      return true;
    }
    else {
      return false;
    }
  }

  clearCustSearch() {
    this.customerDetails = {};
    this.openInvoices = [];
  }

  checkFormValid() {
    if (((!this.objInvoicePayment.isMultiplePaymentMethod && this.chkPaymentMethod == 1) ||
      (this.objInvoicePayment.isMultiplePaymentMethod && this.objInvoicePayment.isCheckPayment)) && (this.checkForm && this.checkForm.valid)) {
      return false;
      // if (((!this.objInvoicePayment.isMultiplePaymentMethod && this.chkPaymentMethod == 2) ||
      //   (this.objInvoicePayment.isMultiplePaymentMethod && this.objInvoicePayment.isWireTransfer)) && (this.wireForm && this.wireForm.valid)) {
      //   return false;
      // }
      // else
      //   return true;
    }
    else
      return true;
  }

  onSubmit() {
    let haveError = false;
    if (haveError) {
      // let content = this.errorMessagePop;
      // this.errorModal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
      // this.display = true;
    }
    else {
      //this.display = false;
      this.isSpinnerVisible = true;
      debugger;
      this.customerReceipt = new CustomerReceiptInfo();

      let selectedInvoices = this.openInvoices.filter(a => a.selected == true);

      this.customerReceipt.invoices = selectedInvoices;
      this.customerReceipt.checkPayments = this.objInvoicePayment.checkPayments;
      this.customerReceipt.wirePayments = this.objInvoicePayment.invoiceWireTransferPayment;
      this.customerReceipt.ccPayments = this.objInvoicePayment.invoiceCreditDebitCardPayment;

      this.customerReceipt.customerPayments = this.customerPayment;
      
      if (this.id) {
      } else {
        // this.customerPaymentsService.create(this.customerReceipt).subscribe(data => {
        //   this.isSpinnerVisible = false;
        //   this.alertService.showMessage(
        //     "Success",
        //     `Payment information updated successfully for Customer`,
        //     MessageSeverity.success
        //   );
        // }, error => {
        //   this.isSpinnerVisible = false;
        // });
      }
    }
  }

  getPartToDisableOrNot(part) {
    return true;
  }

  getAllPartsToDisableOrNot() { }
}