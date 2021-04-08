import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { CustomerService } from "../../../services/customer.service";
import { CustomerPaymentsService } from "../../../services/customer-payment.service";

@Component({
  selector: "app-review-customer-payment",
  templateUrl: "./review-customer-payment.component.html",
  styleUrls: ["./review-customer-payment.component.css"]
})
export class ReviewCustomerPaymentComponent implements OnInit, OnChanges {
  @Input() receiptId;
  objInvoicePayment: any = {};
  isSpinnerVisible: boolean = false;
  openInvoices: any[] = [];
  custheaders: any[];
  headers: any[];
  dataForReview: any;
  isEdit: boolean = false;
  
  constructor(public customerService: CustomerService,
    private customerPaymentsService: CustomerPaymentsService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.custheaders = [
      { field: "name", header: "Customer", width: "130px" },
      { field: "customerCode", header: "Cust Code", width: "130px" },
      { field: "paymentRef", header: "Payment Ref", width: "130px" },
      { field: "amount", header: "Amount", width: "130px" },
      { field: "amountRemaining", header: "Amt Remaining", width: "130px" }
    ];

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
    ];
  }

  ngOnChanges(changes) {
  }

  fetchDataForReview() {
    this.isSpinnerVisible = true;
    this.isEdit = false;
    this.customerPaymentsService.GetCustomerPaymentForReview(this.receiptId).subscribe(data => {
      this.dataForReview = data;
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  arrayCurrencyList: any = [];

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

  editPayment(invoice) {
    invoice.selected = true;
    this.isEdit = true;
  }

  onUpdatePayments() {
    debugger;
    this.dataForReview.paymentsByCustomer
    let totalInvoicePayments: any[] = [];
    
    this.dataForReview.paymentsByCustomer.forEach(payment => {
      let invoices = payment.invoices;
      invoices.forEach(invoice => {
        invoice.bankFeeAmount = invoice.bankFeeAmount ? parseFloat(invoice.bankFeeAmount): 0;
        invoice.discAmount = invoice.discAmount ? parseFloat(invoice.discAmount) : 0;
        invoice.paymentAmount = invoice.paymentAmount ? parseFloat(invoice.paymentAmount) : 0;
        invoice.otherAdjustAmt = invoice.otherAdjustAmt ? parseFloat(invoice.otherAdjustAmt) : 0;
        invoice.createdBy = this.userName;
        invoice.updatedBy = this.userName;
        totalInvoicePayments.push(invoice);
      });
    });

    this.customerPaymentsService.updatePayments(totalInvoicePayments).subscribe(data => {
      this.dataForReview = data;
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  onSavePostPayments() {
    
  }
}