import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { EndpointFactory } from "./endpoint-factory.service";
import { ConfigurationService } from "./configuration.service";
import { environment } from "../../environments/environment";
import { ICustomerPayments } from "../models/sales/ICustomerPayments";

@Injectable()
export class CustomerPaymentsEndpointService extends EndpointFactory {
  private readonly customerPaymentUrl: string = environment.baseUrl + "/api/CustomerPayments";
  private readonly saveCustomerPaymentUrl: string = environment.baseUrl + "/api/CustomerPayments/SavePayments";
  private readonly updateCustomerPaymentUrl: string = environment.baseUrl + "/api/CustomerPayments/UpdateCustomerPayment";
  private readonly getCustomerPaymentDetails: string = environment.baseUrl + "/api/CustomerPayments/get";
  private readonly getCustomerPaymentForReviewendpoint: string = environment.baseUrl + "/api/CustomerPayments/getCustomerPaymentForReview";
  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    injector: Injector) {
    super(http, configurations, injector);
  }

  create(customerPayment: ICustomerPayments): Observable<any> {
    return this.http
      .post(this.customerPaymentUrl, JSON.stringify(customerPayment), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.create(customerPayment));
      });
  }

  getCustomerPayment(customerPaymentId: number): Observable<any> {
    const URL = `${this.getCustomerPaymentDetails}/${customerPaymentId}`;
    return this.http
      .get<ICustomerPayments>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getCustomerPayment(customerPaymentId));
      });
  }

  savePayments(customerPayment: any): Observable<any> {
    return this.http
      .post(this.saveCustomerPaymentUrl, JSON.stringify(customerPayment), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.savePayments(customerPayment));
      });
  }

  getCustomerPaymentForReview<T>(receiptId: number): Observable<T> {
    let url = `${this.getCustomerPaymentForReviewendpoint}/${receiptId}`;
    return this.http.get<T>(url, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getCustomerPaymentForReview(receiptId));
      });
  }

  updatePayments(customerPayment: any): Observable<any> {
    return this.http
      .post(this.updateCustomerPaymentUrl, JSON.stringify(customerPayment), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updatePayments(customerPayment));
      });
  }
}