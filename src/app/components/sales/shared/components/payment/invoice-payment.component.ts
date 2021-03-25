import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NavigationExtras } from "@angular/router";
import { CustomerService } from "../../../../../services/customer.service";

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
  enableUpdate: boolean;
  IsSingleOption: boolean = true;
  paymentMethod: number;
  chkPaymentMethod: number = 1;
  chkCheck: boolean;
  chkWireTransfer: boolean;
  chkEFT: boolean;
  chkCC: boolean;
  payment: any = {};
  tempMemo: any;
  tempMemoLabel: any;
  moduleName: any = "Payment";
  isSpinnerVisible: boolean = false;
  referenceId: any;
  customerDetails: any;

  constructor(public customerService: CustomerService) {
  }

  ngOnInit() {
    this.paymentMethod = this.IsSingleOption ? 1 : 2;
    this.getCustomerDetails();
    this.payment.dateProcessed = new Date();
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
      this.IsSingleOption = true;
    }
    else {
      this.IsSingleOption = false;
      this.chkCheck = true;
    }
  }

  onProcessPayment() {
    
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