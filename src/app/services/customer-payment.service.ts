import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ICustomerPayments } from "../models/sales/ICustomerPayments";
import { CustomerPaymentsEndpointService } from "./customer-payments-endpoint.service";

@Injectable()
export class CustomerPaymentsService {
  isEditARSettingsList = false;
  arSettingsData;

  constructor(private customerPaymentsEndpointService: CustomerPaymentsEndpointService) {
  }

  create(customerPayments: ICustomerPayments): Observable<ICustomerPayments[]> {
    return Observable.forkJoin(
      this.customerPaymentsEndpointService.create(customerPayments)
    );
  }

  update(customerPayments: ICustomerPayments): Observable<ICustomerPayments[]> {
    return Observable.forkJoin(
      this.customerPaymentsEndpointService.update(customerPayments)
    );
  }

  getCustomerPayment(customerPaymentId: number): Observable<ICustomerPayments[]> {
    return Observable.forkJoin(
      this.customerPaymentsEndpointService.getCustomerPayment(customerPaymentId)
    );
  }

  savePayments(salesOrder: any): Observable<ICustomerPayments[]> {
    return Observable.forkJoin(
      this.customerPaymentsEndpointService.savePayments(salesOrder)
    );
  }

  GetCustomerPaymentForReview(receiptId: number) {
    return this.customerPaymentsEndpointService.getCustomerPaymentForReview(receiptId);
  }

  updatePayments(salesOrder: any): Observable<any[]> {
    return Observable.forkJoin(
      this.customerPaymentsEndpointService.updatePayments(salesOrder)
    );
  }

  deleteARSetting(salesOrdersettingsId: number, updatedBy): Observable<boolean[]> {
    return Observable.forkJoin(
      this.customerPaymentsEndpointService.deleteARSetting(salesOrdersettingsId, updatedBy)
    );
  }

  getAllARSettings() {
    return this.customerPaymentsEndpointService.getAllARSettings();
  }

  saveOrUpdateARSetting(data) {
    return this.customerPaymentsEndpointService.saveOrUpdateARSettings(data);
  }

  getARSettingHistory(id) {
    return this.customerPaymentsEndpointService.getARSettingHistory(id);
  }
}