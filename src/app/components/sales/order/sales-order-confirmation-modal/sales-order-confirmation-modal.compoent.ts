import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SalesOrderConfirmationType } from "../../sales-confirmation-type.enum";
import { SalesOrderActionType } from "../../sales-order-actions-emuns";
import { SalesOrderEventArgs } from "../../sales-order-event-args";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-sales-order-confirmation-modal",
    templateUrl: "./sales-order-confirmation-modal.compoent.html",
    styleUrls: []
})
export class SalesOrderConfirmationModalComponent implements OnInit {

    @Input('header-title') header: string;
    @Input('body-text') body: string;
    @Input('sales-order-action-type') salesOrderActionType: SalesOrderActionType;
    @Input('modal-ref') modalRef: NgbModalRef;
    @Output('onConfirm') onConfirm: EventEmitter<SalesOrderEventArgs> = new EventEmitter<SalesOrderEventArgs>();
    salesOrderConfirmationType = SalesOrderConfirmationType;
    constructor() {
    }

    ngOnInit() {

    }

    onClick(confirmationType: SalesOrderConfirmationType): void {
        let eventArgs = new SalesOrderEventArgs(this.salesOrderActionType, confirmationType);
        this.onConfirm.emit(eventArgs);
        if (this.modalRef) {
            this.modalRef.close();
        }
    }

}
