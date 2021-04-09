import { Component, OnInit, Input, EventEmitter } from "@angular/core";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ISalesOrderCopyParameters } from "../models/isalesorder-copy-parameters";
import { SalesOrderCopyParameters } from "../models/salesorder-copy-parameters";
import { NavigationExtras } from "@angular/router";

@Component({
  selector: "app-sales-order-copy",
  templateUrl: "./sales-order-copy.component.html",
  styleUrls: ["./sales-order-copy.component.scss"]
})
export class SalesOrderCopyComponent implements OnInit {
  @Input('modal-reference') modalReference: NgbModalRef;
  @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
  salesOrderCopyParameters: ISalesOrderCopyParameters;

  constructor() {
    this.salesOrderCopyParameters = new SalesOrderCopyParameters();
  }

  ngOnInit() {

  }

  close() {
    if (this.modalReference) {
      this.modalReference.close();
    }
  }

  copy() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        cp: this.salesOrderCopyParameters.copyParts,
        cia: this.salesOrderCopyParameters.copyInternalApprovals
      }
    };

    this.onConfirm.emit(navigationExtras);
  }
}