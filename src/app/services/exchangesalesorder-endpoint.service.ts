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
//import { SalesOrderBillingAndInvoicing } from "../models/sales/salesOrderBillingAndInvoicing";
//import { SalesOrderShipping } from "../models/sales/salesOrderShipping";
//import { SOPickTicket } from "../models/sales/SOPickTicket";
import { environment } from "../../environments/environment";
import { IExchangeSalesSearchParameters } from "../models/exchange/IExchangeSalesSearchParameters";
import { IExchangeSalesOrderListView } from "../models/exchange/IExchangeSalesOrderListView";
import { ExchangeSOPickTicket } from "../models/exchange/ExchangeSOPickTicket";
import { ExchangeSalesOrderShipping } from "../models/exchange/exchangeSalesOrderShipping";
import { IExchangeSalesOrderFreight } from '../models/exchange/IExchangeSalesOrderFreight';
import { IExchangeSalesOrderCharge } from '../models/exchange/IExchangeSalesOrderCharge';
import { ExchangeSalesOrderBillingAndInvoicing } from "../models/exchange/exchangeSalesOrderBillingAndInvoicing";
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
    private readonly getMultiPickTicketForPrint: string = environment.baseUrl + "/api/exchangesalesorder/getMultiSalesOrderPickTicketForPrint";
    private readonly exchangeSalesorderShippingGet: string = environment.baseUrl + "/api/exchangesalesorder/exchangesalesordershippingdetails";
    private readonly salesorderShippingSave: string = environment.baseUrl + "/api/exchangesalesorder/createsalesordershipping";
    private readonly getShippingDataListURL: string = environment.baseUrl + "/api/exchangesalesorder/getsalesordershippinglist";
    private readonly getShippingforEdit: string = environment.baseUrl + "/api/exchangesalesorder/getshippingedit"
    private readonly salesorderSavePackingSlip: string = environment.baseUrl + "/api/exchangesalesorder/SavePackingSlip";
    private readonly getShipingLabelForPrintPrint: string = environment.baseUrl + "/api/exchangesalesorder/getShipingLabelForPrint";
    private readonly updateServiceClass: string = environment.baseUrl + "/api/exchangesalesorder/updateServiceClass";
    private readonly getPackagingSlipForPrint: string = environment.baseUrl + "/api/exchangesalesorder/printPackagingSlip";
    private readonly getMultiPackagingSlipForPrint: string = environment.baseUrl + "/api/exchangesalesorder/printMultiplePackagingSlip";
    private readonly getMultiShipingLabelForPrint: string = environment.baseUrl + "/api/exchangesalesorder/getMultiShipingLabelForPrint";
    private readonly _geExchangeQuoteFreights: string = environment.baseUrl + "/api/exchangesalesorder/exchangesalesorderfreightlist";
    private readonly exchangeQuoteFreightsSave: string = environment.baseUrl + "/api/exchangesalesorder/createexchangesalesorderfreight";
    private readonly _getExchangeQuoteCharges: string = environment.baseUrl + "/api/exchangesalesorder/getexchangesalesorderchargeslist";
    private readonly _deleteExchangeQuoteCharge: string = environment.baseUrl + "/api/exchangesalesorder/deleteexchangesalesordercharge";
    private readonly _deleteExchangeQuoteFrignt: string = environment.baseUrl + "/api/exchangesalesorder/deleteexchangesalesorderfreight";
    private readonly getFreightAudihistory: string = environment.baseUrl + '/api/exchangesalesorder/quote-freight-history';
    private readonly getChargesAudihistory: string = environment.baseUrl + '/api/exchangesalesorder/quote-charges-history';
    private readonly exchangeQuoteChargesSave: string = environment.baseUrl + "/api/exchangesalesorder/createexchangesalesordercharges";
    private readonly getBillingInvoiceListUrl: string = environment.baseUrl + "/api/exchangesalesorder/exchangeSalesorderBillingInvoicelist";
    private readonly salesorderBillingByShipping: string = environment.baseUrl + "/api/exchangesalesorder/billinginvoicingdetailsbyshippingId";
    private readonly salesorderBillingSave: string = environment.baseUrl + "/api/exchangesalesorder/createbillinginvoicing";
    private readonly GetSalesOrderBillingInvoicingByIdURL: string = environment.baseUrl + "/api/exchangesalesorder/GetExchangeSalesOrderBillingInvoicingById";
    private readonly updateSalesOrderBillingInvoicingURL: string = environment.baseUrl + "/api/exchangesalesorder/updateExchangeSalesOrderBillingInvoicing";
    private readonly getSalesOrderBillingInvoicingDataURL: string = environment.baseUrl + "/api/exchangesalesorder/GetExchangeSalesOrderBillingInvoicingData";
    private readonly _getChargesById: string = environment.baseUrl + "/api/exchangesalesorder/GetExchangeSalesOrderChargesBySOId";
    private readonly _getFreightsById: string = environment.baseUrl + "/api/exchangesalesorder/getExchangeSalesOrderFreightsBySOId";
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
    getMultiPickTicketPrint(multiPickTicket: any): Observable<any> {
      const URL = `${this.getMultiPickTicketForPrint}`;
      return this.http
        .post<any>(URL, JSON.stringify(multiPickTicket), this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getMultiPickTicketPrint(multiPickTicket));
        });
    }
    getpickticketHistory(pickticketid) {
      return this.http.get<any>(`${this.configurations.baseUrl}/api/exchangesalesorder/sales-order-pick-ticket-history/?soPickTicketId=${pickticketid}`)
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getpickticketHistory(pickticketid));
        });
    }
    getExchangeSalesOrderShipping(exchangeSalesOrderId: number, partId): Observable<any> {
      const URL = `${this.exchangeSalesorderShippingGet}?exchangeSalesOrderId=${exchangeSalesOrderId}&exchangeSalesOrderPartId=${partId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getExchangeSalesOrderShipping(exchangeSalesOrderId, partId));
        });
    }
    createShipping(shippingInfo: ExchangeSalesOrderShipping): Observable<any> {
      return this.http
        .post(this.salesorderShippingSave, JSON.stringify(shippingInfo), this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.createShipping(shippingInfo));
        });
    }
    getShippingDataList(salesOrderId: number): Observable<any> {
      const URL = `${this.getShippingDataListURL}/${salesOrderId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getShippingDataList(salesOrderId));
        });
    }
    generatePackagingSlip(packagingSlip: any): Observable<any> {
      return this.http
        .post(this.salesorderSavePackingSlip, JSON.stringify(packagingSlip), this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.generatePackagingSlip(packagingSlip));
        });
    }
    getShippingLabelPrint(salesOrderId: number, salesOrderPartId: number, soShippingId: number): Observable<any> {
      const URL = `${this.getShipingLabelForPrintPrint}?salesOrderId=${salesOrderId}&salesOrderPartId=${salesOrderPartId}&soShippingId=${soShippingId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getShippingLabelPrint(salesOrderId, salesOrderPartId, soShippingId));
        });
    }
    updateShipping(serviceClass: string, salesOrderShippingId: number): Observable<any> {
      let url: string = `${this.updateServiceClass}?serviceClass=${serviceClass}&salesOrderShippingId=${salesOrderShippingId}`;
      return this.http
        .put(url, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.updateShipping(serviceClass, salesOrderShippingId));
        });
    }
    getShippingEdit(salesOrderShippingId: number): Observable<any> {
      const URL = `${this.getShippingforEdit}?exchangeSalesOrderShippingId=${salesOrderShippingId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getShippingEdit(salesOrderShippingId));
        });
    }
    getPackagingSlipPrint(salesOrderId: number, salesOrderPartId: number, soPickTicketId: number, packagingSlipId: number): Observable<any> {
      const URL = `${this.getPackagingSlipForPrint}?salesOrderId=${salesOrderId}&salesOrderPartId=${salesOrderPartId}&soPickTicketId=${soPickTicketId}&packagingSlipId=${packagingSlipId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getPackagingSlipPrint(salesOrderId, salesOrderPartId, soPickTicketId, packagingSlipId));
        });
    }
    getMultiPackagingSlipPrint(multiPackagingSlip: any): Observable<any> {
      const URL = `${this.getMultiPackagingSlipForPrint}`;
      return this.http
        .post<any>(URL, JSON.stringify(multiPackagingSlip), this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getMultiPackagingSlipPrint(multiPackagingSlip));
        });
    }
    getMultiShippingLabelPrint(multiShippingLabel: any): Observable<any> {
      const URL = `${this.getMultiShipingLabelForPrint}`;
      return this.http
        .post<any>(URL, JSON.stringify(multiShippingLabel), this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getMultiShippingLabelPrint(multiShippingLabel));
        });
    }
    getExchangeSalesOrderFreights(id, isDeleted) {
      return this.http.get<any>(`${this._geExchangeQuoteFreights}?ExchangeSalesOrderId=${id}&isDeleted=${isDeleted}`, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getExchangeSalesOrderFreights(id, isDeleted));
        });
    }
    createFreight(sexchangeQuoteFreights: IExchangeSalesOrderFreight[]): Observable<any> {
      return this.http
        .post(
          this.exchangeQuoteFreightsSave,
          JSON.stringify(sexchangeQuoteFreights),
          this.getRequestHeaders()
        )
        .catch(error => {
          return this.handleErrorCommon(error, () => this.createFreight(sexchangeQuoteFreights));
        });
    }
    getExchangeSalesOrderCharges(id, isDeleted) {
      return this.http.get<any>(`${this._getExchangeQuoteCharges}?ExchangeSalesOrderId=${id}&isDeleted=${isDeleted}`, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getExchangeSalesOrderCharges(id, isDeleted));
        });
    }
    createExchangeSalesOrderCharge(exchangeQuoteCharges: IExchangeSalesOrderCharge[]): Observable<any> {
      return this.http
        .post(
          this.exchangeQuoteChargesSave,
          JSON.stringify(exchangeQuoteCharges),
          this.getRequestHeaders()
        )
        .catch(error => {
          return this.handleErrorCommon(error, () => this.createExchangeSalesOrderCharge(exchangeQuoteCharges));
        });
    }

    deleteexchangeSalesOrderChargesList(chargeId, userName): Observable<boolean> {
      let endpointUrl = `${this._deleteExchangeQuoteCharge}/${chargeId}?updatedBy=${userName}`;
      return this.http
        .delete<boolean>(endpointUrl, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.deleteexchangeSalesOrderChargesList(chargeId, userName));
        });
    }

    deleteexchangeSalesOrderFreightList(frieghtId, userName): Observable<boolean> {
      let endpointUrl = `${this._deleteExchangeQuoteFrignt}/${frieghtId}?updatedBy=${userName}`;
      return this.http
        .delete<boolean>(endpointUrl, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.deleteexchangeSalesOrderFreightList(frieghtId, userName));
        });
    }

    getExchangeSalesOrderFreightsHistory(id) {
      return this.http.get<any>(`${this.getFreightAudihistory}/?ExchangeSalesOrderFreightId=${id}`, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getExchangeSalesOrderFreightsHistory(id));
        });
    }
    getExchangeSalesOrderChargesHistory(id) {
      return this.http.get<any>(`${this.getChargesAudihistory}/${id}`, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getExchangeSalesOrderChargesHistory(id));
        });
    }
    getBillingInvoiceList(exchangeSalesOrderId: number): Observable<any> {
      const URL = `${this.getBillingInvoiceListUrl}/${exchangeSalesOrderId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getBillingInvoiceList(exchangeSalesOrderId));
        });
    }
    getExchangeSalesOrderBillingByShipping(exchangeSalesOrderId: number, partId, exchangeSalesOrderShippingId: number): Observable<ExchangeSalesOrderBillingAndInvoicing> {
      const URL = `${this.salesorderBillingByShipping}?exchangeSalesOrderId=${exchangeSalesOrderId}&exchangeSalesOrderPartId=${partId}&exchangeSalesOrderShippingId=${exchangeSalesOrderShippingId}`;
      return this.http
        .get<ExchangeSalesOrderBillingAndInvoicing>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getExchangeSalesOrderBillingByShipping(exchangeSalesOrderId, partId, exchangeSalesOrderShippingId));
        });
    }
    createBilling(billingAndInvoicing: ExchangeSalesOrderBillingAndInvoicing) {
      return this.http
        .post(this.salesorderBillingSave, JSON.stringify(billingAndInvoicing), this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.createBilling(billingAndInvoicing));
        });
    }
    GetExchangeSalesOrderBillingInvoicingById(sobillingInvoicingId: number): Observable<any> {
      const URL = `${this.GetSalesOrderBillingInvoicingByIdURL}/${sobillingInvoicingId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.GetExchangeSalesOrderBillingInvoicingById(sobillingInvoicingId));
        });
    }
    updateExchangeSalesOrderBillingInvoicing(sobillingInvoicingId: number, billingInvoicing: any): Observable<any> {
      let url: string = `${this.updateSalesOrderBillingInvoicingURL}/${sobillingInvoicingId}`;
      return this.http
        .put(url, JSON.stringify(billingInvoicing), this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.updateExchangeSalesOrderBillingInvoicing(sobillingInvoicingId, billingInvoicing));
        });
    }
    getExchangeSalesOrderBillingInvoicingData(sobillingInvoicingId: number): Observable<any> {
      const URL = `${this.getSalesOrderBillingInvoicingDataURL}/${sobillingInvoicingId}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getExchangeSalesOrderBillingInvoicingData(sobillingInvoicingId));
        });
    }
    getExchangeSalesOrderChargesById(id, isDeleted) {
      const URL = `${this._getChargesById}?ExchangeSalesOrderId=${id}&isDeleted=${isDeleted}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getExchangeSalesOrderChargesById(id, isDeleted));
        });
    }
    getExchangeSalesOrderFreightsById(id, isDeleted) {
      const URL = `${this._getFreightsById}?ExchangeSalesOrderId=${id}&isDeleted=${isDeleted}`;
      return this.http
        .get<any>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getExchangeSalesOrderFreightsById(id, isDeleted));
        });
    }
}