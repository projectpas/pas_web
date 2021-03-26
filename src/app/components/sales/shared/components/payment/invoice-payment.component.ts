import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NavigationExtras } from "@angular/router";
import { CustomerService } from "../../../../../services/customer.service";
import { InvoicePaymentViewModel } from "../../../../../models/invoicePayment/InvoicePaymentViewModel";
import { CommonService } from "../../../../../services/common.service";
import { InvoiceCheckPayment } from "../../../../../models/invoicePayment/InvoiceCheckPayment";
import { InvoicePaymentService } from "../../../../../services/invoice-payment-service";
import { AuthService } from "../../../../../services/auth.service";
import { MessageSeverity, AlertService } from "../../../../../services/alert.service";

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
  tempMemo: any;
  tempMemoLabel: any;
  moduleName: any = "Payment";
  isSpinnerVisible: boolean = false;
  referenceId: any;
  customerDetails: any;

  constructor(public customerService: CustomerService, private commonService: CommonService,
    private invoicePaymentService: InvoicePaymentService,
    private authService: AuthService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.paymentMethod = this.IsSingleOption ? 1 : 2;
    this.getCustomerDetails();
    this.bindCurrency();
    this.payment.dateProcessed = new Date();

    this.objInvoicePayment.checkPayments = new InvoiceCheckPayment();
  }

  arrayCurrencyList: any = [];
  bindCurrency() {
    this.arrayCurrencyList.push(0);
    this.isSpinnerVisible = true;
    this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', '', true, 20, this.arrayCurrencyList.join()).subscribe(response => {
      this.isSpinnerVisible = false;
      this.currencyList = response;
    }, error => {
      this.isSpinnerVisible = false;
    });
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

  onDepositeClick() {
  }

  enableSave() {

  }

  onPaymentMethodClick(value) {
    if (value == 1) {
      //this.IsSingleOption = true;
      this.objInvoicePayment.IsMultiplePaymentMethod = false;
    }
    else {
      this.objInvoicePayment.IsMultiplePaymentMethod = true;
      this.chkCheck = true;
    }
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
      this.objInvoicePayment.checkPayments.soBillingInvoicingId = 11;
    }
    else if (this.objInvoicePayment.isWireTransfer) {
      this.objInvoicePayment.invoiceWireTransferPayment.createdBy = this.userName;
      this.objInvoicePayment.invoiceWireTransferPayment.updatedBy = this.userName;
      this.objInvoicePayment.invoiceWireTransferPayment.masterCompanyId = this.masterCompanyId;
      this.objInvoicePayment.invoiceWireTransferPayment.customerId = this.customerId;
      this.objInvoicePayment.invoiceWireTransferPayment.soBillingInvoicingId = 11;
    }
    else if (this.objInvoicePayment.isEFT) {
      this.objInvoicePayment.invoiceEFTPayment.createdBy = this.userName;
      this.objInvoicePayment.invoiceEFTPayment.updatedBy = this.userName;
      this.objInvoicePayment.invoiceEFTPayment.masterCompanyId = this.masterCompanyId;
      this.objInvoicePayment.invoiceEFTPayment.customerId = this.customerId;
      this.objInvoicePayment.invoiceEFTPayment.soBillingInvoicingId = 11;
    }
    else if (this.objInvoicePayment.isCCDCPayment) {
      this.objInvoicePayment.invoiceCreditDebitCardPayment.createdBy = this.userName;
      this.objInvoicePayment.invoiceCreditDebitCardPayment.updatedBy = this.userName;
      this.objInvoicePayment.invoiceCreditDebitCardPayment.masterCompanyId = this.masterCompanyId;
      this.objInvoicePayment.invoiceCreditDebitCardPayment.customerId = this.customerId;
      this.objInvoicePayment.invoiceCreditDebitCardPayment.soBillingInvoicingId = 11;
    }

    this.objInvoicePayment.createdBy = this.userName;
    this.objInvoicePayment.updatedBy = this.userName;
    this.objInvoicePayment.masterCompanyId = this.masterCompanyId;
    this.objInvoicePayment.customerId = this.customerId;
    this.objInvoicePayment.soBillingInvoicingId = 11;

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

  onAddDescription(value) {
    this.tempMemo = "";

    if (value == "notes") {
      this.tempMemoLabel = "Notes";
      this.tempMemo = this.payment.notes;
    }
    if (value == "memo") {
      this.tempMemoLabel = "Memo";
      this.tempMemo = this.payment.memo;
    }
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
}