import { Component, OnInit, Input, EventEmitter } from "@angular/core";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NavigationExtras } from "@angular/router";
import { SalesOrderService } from "../../../../../../services/salesorder.service";
import { environment } from "../../../../../../../environments/environment";

@Component({
    selector: "app-sales-order-print-invoice",
    templateUrl: "./sales-order-print-invoice.component.html",
    styleUrls: ["./sales-order-print-invoice.component.scss"]
})
export class SalesOrderPrintInvoiceComponent implements OnInit {
    @Input('modal-reference') modalReference: NgbModalRef;
    @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
    @Input() salesOrderId: number;
    @Input() salesOrderbillingInvoicingId: number;
    salesOrderInvoice: any = [];
    endPointURL: any;

    constructor(private salesOrderService: SalesOrderService) {
    }

    ngOnInit() {
        this.endPointURL = environment.baseUrl;
        this.getSalesInvoiceView();
    }

    getSalesInvoiceView() {
        this.salesOrderService.getSalesOrderBillingInvoicingPdf(this.salesOrderbillingInvoicingId).subscribe(res => {
            this.salesOrderInvoice = res[0];
        })
    }

    close() {
        if (this.modalReference) {
            this.modalReference.close();
        }
    }
}