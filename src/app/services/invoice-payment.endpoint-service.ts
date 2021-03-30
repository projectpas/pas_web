import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class InvoicePaymentEndpointService extends EndpointFactory {
    private readonly processPaymentendpoint: string = "/api/invoicepayments/post-payment";

    get processPaymentUrl() { return this.configurations.baseUrl + this.processPaymentendpoint; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    processPayment(parts: any): Observable<any> {
        let url: string = `${this.processPaymentUrl}`;
        return this.http
            .post(url, parts, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.processPayment(parts));
            });
    }
}