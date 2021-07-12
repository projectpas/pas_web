import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NavigationExtras } from "@angular/router";
import { ExchangeSalesOrderService } from "../../../../../services/exchangesalesorder.service";
import { environment } from "../../../../../../environments/environment";
@Component({
  selector: 'app-exchange-sales-order-print-invoice',
  templateUrl: './exchange-sales-order-print-invoice.component.html',
  styleUrls: ['./exchange-sales-order-print-invoice.component.scss']
})
export class ExchangeSalesOrderPrintInvoiceComponent implements OnInit {
  @Input('modal-reference') modalReference: NgbModalRef;
  @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
  @Input() salesOrderId: number;
  @Input() salesOrderbillingInvoicingId: number;
  @Output() onInvoiceLoad: EventEmitter<string> = new EventEmitter<string>();
  salesOrderInvoice: any = [];
  endPointURL: any;
  isSpinnerVisible: boolean = false;
  salesOrderCharges: any = [];
  salesOrderFreights: any = [];
  constructor(private exchangeSalesOrderService: ExchangeSalesOrderService) { }

  ngOnInit() {
    this.endPointURL = environment.baseUrl;
    this.getSalesInvoiceView();
  }
  getSalesInvoiceView() {
    this.isSpinnerVisible = true;
    this.exchangeSalesOrderService.getExchangeSalesOrderBillingInvoicingData(this.salesOrderbillingInvoicingId).subscribe(res => {
      this.salesOrderInvoice = res[0];
      this.getSalesOrderCharges();
      this.getSalesOrderFreights();
      this.onInvoiceLoad.emit(this.salesOrderInvoice.invoiceStatus);
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    })
  }

  getSalesOrderCharges() {
    this.isSpinnerVisible = true;
    this.exchangeSalesOrderService.getExchangeSalesOrderChargesById(this.salesOrderId, false).subscribe(res => {
      this.salesOrderCharges = res;
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    })
  }

  getSalesOrderFreights() {
    this.isSpinnerVisible = true;
    this.exchangeSalesOrderService.getExchangeSalesOrderFreightsById(this.salesOrderId, false).subscribe(res => {
      this.salesOrderFreights = res;
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