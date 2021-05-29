import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
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
    @Output() onInvoiceLoad: EventEmitter<string> = new EventEmitter<string>();
    salesOrderInvoice: any = [];
    endPointURL: any;
    isSpinnerVisible: boolean = false;
    salesOrderCharges: any = [];

    constructor(private salesOrderService: SalesOrderService) {
    }

    ngOnInit() {
        this.endPointURL = environment.baseUrl;
        this.getSalesInvoiceView();
    }

    getSalesInvoiceView() {
        this.isSpinnerVisible = true;
        this.salesOrderService.getSalesOrderBillingInvoicingData(this.salesOrderbillingInvoicingId).subscribe(res => {
            this.salesOrderInvoice = res[0];
            this.getSalesOrderCharges();
            this.onInvoiceLoad.emit(this.salesOrderInvoice.invoiceStatus);
            this.isSpinnerVisible = false;
        }, error => {
            this.isSpinnerVisible = false;
        })
    }

    getSalesOrderCharges() {
        this.isSpinnerVisible = true;
        this.salesOrderService.getSalesOrderChargesById(this.salesOrderId, false).subscribe(res => {
            this.salesOrderCharges = res;
            this.isSpinnerVisible = false;
        }, error => {
            this.isSpinnerVisible = false;
        })
    }

    close() {
        if (this.modalReference) {
            this.modalReference.close();
        }
    }

    getFormattedNotes(notes) {
        if (notes != undefined) {
            return notes.replace(/<[^>]*>/g, '');
        }
    }
}