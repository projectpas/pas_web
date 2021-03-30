import { Injectable } from '@angular/core';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { InvoicePaymentEndpointService } from './invoice-payment.endpoint-service';

@Injectable()
export class InvoicePaymentService {
    constructor(private invoicePaymentEndpointService: InvoicePaymentEndpointService) { }

    ProcessPayment(paymentData) {
        return this.invoicePaymentEndpointService.processPayment(paymentData);
    }
}