import { Injectable, Injector } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { EndpointFactory } from "./endpoint-factory.service";
import { ConfigurationService } from "./configuration.service";
//import { ISalesOrder } from "../models/sales/ISalesOrder.model";
import { IExchangeSalesOrder } from "../models/exchange/IExchangeSalesOrder.model";
import { ISalesSearchParameters } from "../models/sales/ISalesSearchParameters";
//import { ISalesOrderView } from "../models/sales/ISalesOrderView";
import { IExchangeSalesOrderView } from "../models/exchange/IExchangeSalesOrderView";
import { PartAction } from "../components/exchange-sales-order/shared/models/part-action";
import { ISalesOrderCustomerApproval } from "../components/sales/order/models/isales-order-customer-approval";
import { ISOFreight } from "../models/sales/ISOFreight";
import { ISalesOrderCharge } from "../models/sales/ISalesOrderCharge";
import { MarginSummary } from "../models/sales/MarginSummaryForSalesorder";
import { SalesOrderBillingAndInvoicing } from "../models/sales/salesOrderBillingAndInvoicing";
import { SalesOrderShipping } from "../models/sales/salesOrderShipping";
//import { SOPickTicket } from "../models/sales/SOPickTicket";
import { environment } from "../../environments/environment";
import { IExchangeSalesSearchParameters } from "../models/exchange/IExchangeSalesSearchParameters";
import { IExchangeSalesOrderListView } from "../models/exchange/IExchangeSalesOrderListView";
import { ExchangeSOPickTicket } from "../models/exchange/ExchangeSOPickTicket";
@Injectable()
export class ExchangeSalesOrderEndpointService extends EndpointFactory {
    private readonly getNewSalesOrderInstanceUrl: string = environment.baseUrl + "/api/exchangesalesorder/new";
    private readonly salesorder: string = environment.baseUrl + "/api/exchangesalesorder";
    private readonly savereserveissuespartsurl: string = environment.baseUrl + "/api/exchangesalesorder/savereserveissuesparts"
    private readonly getExchangeSalesOrderSetting: string = environment.baseUrl + "/api/exchangesalesorder/getExchangeSalesOrderSettinglist"
    private readonly getSalesOrderDetails: string = environment.baseUrl + "/api/exchangesalesorder/get";
    private readonly searchExchangeQuote: string = environment.baseUrl + "/api/exchangesalesorder/exchangesalesordersearch";
    private readonly getreserverstockPartsByExchangeSOIdUrl: string = environment.baseUrl + "/api/exchangesalesorder/getreservedstockpartslistByExchangeSOId"
    private readonly getunreserverstockPartsByExchangeSOIdUrl: string = environment.baseUrl + "/api/exchangesalesorder/getunreservedstockpartslistByExchangeSOId"
    private readonly getrelesereservepartUrl: string = environment.baseUrl + "/api/exchangesalesorder/releasestocklinereservedparts"
    private readonly getPickTicketListUrl: string = environment.baseUrl + "/api/exchangesalesorder/getpickticketapprovelist";
    private readonly getstocklineforPickTicketUrl: string = environment.baseUrl + "/api/exchangesalesorder/searchstocklinefrompickticketpop"
    private readonly savepickticketiteminterfaceUrl: string = environment.baseUrl + "/api/exchangesalesorder/savepickticketiteminterface"
    private readonly confirmpickticketUrl = environment.baseUrl + "/api/exchangesalesorder/confirmpt";
    private readonly getPickTicketforEdit: string = environment.baseUrl + "/api/exchangesalesorder/getpickticketedit"
    private readonly getSalesOrdePickTicketPrint: string = environment.baseUrl + "/api/exchangesalesorder/getsalesorderpickticketforprint";
    constructor(
        http: HttpClient,
        configurations: ConfigurationService,
        injector: Injector) {
        super(http, configurations, injector);
    }

    create(exchangesalesOrder: IExchangeSalesOrderView): Observable<any> {
        return this.http
            .post(this.salesorder, JSON.stringify(exchangesalesOrder), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.create(exchangesalesOrder));
            });
    }
    update(exchangesalesOrder: IExchangeSalesOrderView): Observable<any> {
        let url: string = `${this.salesorder}/${exchangesalesOrder.salesOrder.exchangeSalesOrderId}`;
        return this.http
          .put(url, JSON.stringify(exchangesalesOrder), this.getRequestHeaders())
          .catch(error => {
            return this.handleErrorCommon(error, () => this.update(exchangesalesOrder));
          });
    }
    getAllExchangeSalesOrderSettings<T>(masterCompanyId): Observable<T> {
        let endPointUrl = `${this.getExchangeSalesOrderSetting}?masterCompanyId=${masterCompanyId}`;
    
        return this.http.get<T>(endPointUrl, this.getRequestHeaders())
          .catch(error => {
            return this.handleErrorCommon(error, () => this.getAllExchangeSalesOrderSettings(masterCompanyId));
          });
    }
    getNewSalesOrderInstance<IExchangeSalesOrderView>(customerId: number): Observable<IExchangeSalesOrderView> {
        const URL = `${this.getNewSalesOrderInstanceUrl}/${customerId}`;
        return this.http
          .get<IExchangeSalesOrderView>(URL, this.getRequestHeaders())
          .catch(error => {
            return this.handleErrorCommon(error, () => this.getNewSalesOrderInstance(customerId));
          });
    }
    getSalesOrder(exchangeSalesOrderId: number): Observable<any> {
        const URL = `${this.getSalesOrderDetails}/${exchangeSalesOrderId}`;
        return this.http
          .get<IExchangeSalesOrder>(URL, this.getRequestHeaders())
          .catch(error => {
            return this.handleErrorCommon(error, () => this.getSalesOrder(exchangeSalesOrderId));
          });
    }
    search(exchangeSalesOrderSearchParameters: IExchangeSalesSearchParameters): Observable<any> {
        let params = JSON.stringify(exchangeSalesOrderSearchParameters);
        return this.http.post(this.searchExchangeQuote, params, this.getRequestHeaders())
          .catch(error => {
            return this.handleErrorCommon(error, () => this.search(exchangeSalesOrderSearchParameters));
          });
    }
    getReservestockpartlistsBySOId(salesOrderId: number): Observable<PartAction> {
      const URL = `${this.getreserverstockPartsByExchangeSOIdUrl}?salesorderid=${salesOrderId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getReservestockpartlistsBySOId(salesOrderId));
        });
    }
    getunreservedstockpartslistBySOId(salesOrderId: number): Observable<PartAction> {
      const URL = `${this.getunreserverstockPartsByExchangeSOIdUrl}?salesorderid=${salesOrderId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getunreservedstockpartslistBySOId(salesOrderId));
        });
    }
    releasestocklinereservedparts(salesOrderId: number): Observable<any> {
      const URL = `${this.getrelesereservepartUrl}?salesorderid=${salesOrderId}`;
      return this.http
        .post<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.releasestocklinereservedparts(salesOrderId));
        });
    }
    savereserveissuesparts(parts: PartAction): any {
      let url: string = `${this.savereserveissuespartsurl}`;
      return this.http
        .post(url, parts, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.savereserveissuesparts(parts));
        });
    }
    getPickTicketList(salesOrderId: number): Observable<any> {
      const URL = `${this.getPickTicketListUrl}/${salesOrderId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getPickTicketList(salesOrderId));
        });
    }
    getStockLineforPickTicket(itemMasterId: number, conditionId: number, salesOrderId: number): Observable<PartAction> {
      const URL = `${this.getstocklineforPickTicketUrl}?itemMasterId=${itemMasterId}&conditionId=${conditionId}&salesOrderId=${salesOrderId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getStockLineforPickTicket(itemMasterId, conditionId, salesOrderId));
        });
    }
    savepickticketiteminterface(parts: ExchangeSOPickTicket): Observable<any> {
      let url: string = `${this.savepickticketiteminterfaceUrl}`;
      return this.http
        .post(url, parts, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.savepickticketiteminterface(parts));
        });
    }
    confirmPickTicket(pickticketId: number, confirmById: string): Observable<any> {
      const URL = `${this.confirmpickticketUrl}/${pickticketId}?confirmById=${confirmById}`;
      return this.http
        .put(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.confirmPickTicket(pickticketId, confirmById));
        });
    }
    getPickTicketEdit(soPickTicketId: number, exchangeSalesOrderId: number, exchangeSalesOrderPartId: number): Observable<PartAction> {
      const URL = `${this.getPickTicketforEdit}?soPickTicketId=${soPickTicketId}&exchangeSalesOrderId=${exchangeSalesOrderId}&exchangeSalesOrderPartId=${exchangeSalesOrderPartId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getPickTicketEdit(soPickTicketId, exchangeSalesOrderId, exchangeSalesOrderPartId));
        });
    }
    getPickTicketPrint(salesOrderId: number, salesOrderPartId: number, soPickTicketId: number): Observable<any> {
      const URL = `${this.getSalesOrdePickTicketPrint}?salesOrderId=${salesOrderId}&salesOrderPartId=${salesOrderPartId}&soPickTicketId=${soPickTicketId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getPickTicketPrint(salesOrderId, salesOrderPartId, soPickTicketId));
        });
    }
    getpickticketHistory(pickticketid) {
      return this.http.get<any>(`${this.configurations.baseUrl}/api/exchangesalesorder/sales-order-pick-ticket-history/?soPickTicketId=${pickticketid}`)
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getpickticketHistory(pickticketid));
        });
    }
}