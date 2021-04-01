import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ICustomerPayments } from "../models/sales/ICustomerPayments";
import { CustomerPaymentsEndpointService } from "./customer-payments-endpoint.service";

@Injectable()
export class CustomerPaymentsService {
  constructor(private customerPaymentsEndpointService: CustomerPaymentsEndpointService) {
  }

  create(salesOrder: ICustomerPayments): Observable<ICustomerPayments[]> {
    return Observable.forkJoin(
      this.customerPaymentsEndpointService.create(salesOrder)
    );
  }
}