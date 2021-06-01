import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NavigationExtras } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { WorkOrderService } from "src/app/services/work-order/work-order.service";

@Component({
    selector: "app-work-order-print-invoice",
    templateUrl: "./work-order-print-invoice.component.html",
    styleUrls: ["./work-order-print-invoice.component.scss"]
})
export class WorkOrderPrintInvoiceComponent implements OnInit {
    @Input('modal-reference') modalReference: NgbModalRef;
    @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
    @Input() workOrderId: number;
    @Input() workOrderbillingInvoicingId: number;
    @Output() onInvoiceLoad: EventEmitter<string> = new EventEmitter<string>();
    workOrderInvoice: any = [];
    endPointURL: any;
    isSpinnerVisible: boolean = false;
    workOrderCharges: any = [];

    constructor(private workOrderService: WorkOrderService) {
    }

    ngOnInit() {
        this.endPointURL = environment.baseUrl;
        this.getworkInvoiceView();
    }

    getworkInvoiceView() {
        this.isSpinnerVisible = true;
        this.workOrderService.getWorkOrderBillingInvoicingData(this.workOrderbillingInvoicingId).subscribe(res => {
            this.workOrderInvoice = res[0];
           // this.getWorkOrderCharges();
            this.onInvoiceLoad.emit(this.workOrderInvoice.invoiceStatus);
            this.isSpinnerVisible = false;
        }, error => {
            this.isSpinnerVisible = false;
        })
    }

    getWorkOrderCharges() {
        this.isSpinnerVisible = true;
        this.workOrderService.getworkOrderChargesById(this.workOrderId, false).subscribe(res => {
            this.workOrderCharges = res;
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