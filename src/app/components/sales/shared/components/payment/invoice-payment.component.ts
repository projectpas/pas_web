import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { SalesOrderActionType } from "../../../sales-order-actions-emuns";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { SalesOrderEventArgs } from "../../../sales-order-event-args";
import { NavigationExtras } from "@angular/router";

@Component({
  selector: "app-invoice-payment",
  templateUrl: "./invoice-payment.component.html",
  styleUrls: ["./invoice-payment.component.css"]
})
export class AddPaymentComponent implements OnInit {
  @Input('modal-reference') modalReference: NgbModalRef;
  @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  enableUpdate: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  onDepositeClick() {

  }

  enableSave() {

  }

  onClose(event: Event): void {
    event.preventDefault();
    this.close.emit(true);
  }
}