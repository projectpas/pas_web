import { Injectable, Injector } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { EndpointFactory } from "./endpoint-factory.service";
import { ConfigurationService } from "./configuration.service";
import { ISalesOrder } from "../models/sales/ISalesOrder.model";
import { ISalesSearchParameters } from "../models/sales/ISalesSearchParameters";
import { ISalesOrderView } from "../models/sales/ISalesOrderView";
import { PartAction } from "../components/sales/shared/models/part-action";
import { ISalesOrderCustomerApproval } from "../components/sales/order/models/isales-order-customer-approval";
import { ISOFreight } from "../models/sales/ISOFreight";
import { ISalesOrderCharge } from "../models/sales/ISalesOrderCharge";
import { MarginSummary } from "../models/sales/MarginSummaryForSalesorder";
import { SalesOrderBillingAndInvoicing } from "../models/sales/salesOrderBillingAndInvoicing";
import { SalesOrderShipping } from "../models/sales/salesOrderShipping";
import { SOPickTicket } from "../models/sales/SOPickTicket";
import { environment } from "../../environments/environment";
import { ICustomerPayments } from "../models/sales/ICustomerPayments";

@Injectable()
export class CustomerPaymentsEndpointService extends EndpointFactory {
  private readonly customerPaymentUrl: string = environment.baseUrl + "/api/CustomerPayments";

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
}