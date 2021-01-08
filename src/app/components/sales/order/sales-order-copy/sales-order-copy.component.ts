import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ISalesOrderCopyParameters } from "../models/isalesorder-copy-parameters";
import { SalesOrderCopyParameters } from "../models/salesorder-copy-parameters";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";

@Component({
  selector: "app-sales-order-copy",
  templateUrl: "./sales-order-copy.component.html",
  styleUrls: ["./sales-order-copy.component.scss"]
})
export class SalesOrderCopyComponent implements OnInit {
  @Input('modal-reference') modalReference: NgbModalRef;
  @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
  salesOrderCopyParameters: ISalesOrderCopyParameters;

  constructor(private modalService: NgbModal,
    private router: Router) {
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