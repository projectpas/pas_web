import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "./endpoint-factory.service";
import { ConfigurationService } from "./configuration.service";
import { ISalesOrder } from "../models/sales/ISalesOrder.model";
import { ISalesQuote } from "../models/sales/ISalesQuote.model";
import { ISalesQuoteView } from "../models/sales/ISalesQuoteView";
import { ISalesOrderQuote } from "../models/sales/ISalesOrderQuote";
import { ISalesSearchParameters } from "../models/sales/ISalesSearchParameters";
import { ISalesQuoteListView } from "../models/sales/ISalesQuoteListView";
import { ISalesOrderView } from "../models/sales/ISalesOrderView";
import { PartDetail } from "../components/sales/shared/models/part-detail";
import { PartAction } from "../components/sales/shared/models/part-action";
import { SalesOrderReference } from "../models/sales/salesOrderReference";
import { ISalesOrderCustomerApproval } from "../components/sales/order/models/isales-order-customer-approval";
import { ISOFreight } from "../models/sales/ISOFreight";
import { ISalesOrderCharge } from "../models/sales/ISalesOrderCharge";
import { MarginSummary } from "../models/sales/MarginSummaryForSalesorder";
import { SalesOrderBillingAndInvoicing } from "../models/sales/salesOrderBillingAndInvoicing";
import { SalesOrderShipping } from "../models/sales/salesOrderShipping";
import { environment } from 'src/environments/environment';
import { SOPickTicket } from "../models/sales/SOPickTicket";
@Injectable()
export class SalesOrderEndpointService extends EndpointFactory {
  private readonly getNewSalesOrderInstanceUrl: string = environment.baseUrl + "/api/salesorder/new";
  private readonly salesorder: string = environment.baseUrl + "/api/salesorder";
  private readonly savereserveissuespartsurl: string = environment.baseUrl + "/api/salesorder/savereserveissuesparts"
  private readonly getunreserverstockPartsUrl: string = environment.baseUrl + "/api/salesorder/getunreservedstockpartslist"
  private readonly getunreserverstockPartsBySOIdUrl: string = environment.baseUrl + "/api/salesorder/getunreservedstockpartslistBySOId"
  private readonly getholdreservepartUrl: string = environment.baseUrl + "/api/salesorder/getholdstocklinereservedparts"
  private readonly getrelesereservepartUrl: string = environment.baseUrl + "/api/salesorder/releasestocklinereservedparts"
  private readonly getSalesOrderViewDetails: string = environment.baseUrl + "/api/SalesOrder/getview";
  private readonly getSalesOrdePickTicketDetails: string = environment.baseUrl + "/api/SalesOrder/getsalesorderpickticket";
  //private readonly getPickTicketListUrl: string = environment.baseUrl + "/api/SalesOrder/getpickticketlist";
  private readonly getPickTicketListUrl: string = environment.baseUrl + "/api/SalesOrder/getpickticketapprovelist";
  private readonly generateSalesOrdePickTicket: string = environment.baseUrl + "/api/SalesOrder/generatepickticket";
  private readonly savepickticketiteminterfaceUrl: string = environment.baseUrl + "/api/salesorder/savepickticketiteminterface"
  private readonly getSalesOrdePickTicketPrint: string = environment.baseUrl + "/api/SalesOrder/getsalesorderpickticketforprint";
  private readonly getShippingDataListURL: string = environment.baseUrl + "/api/SalesOrder/getsalesordershippinglist";

  // private readonly searchSalesOrder: string = "/api/salesorder/search";
  private readonly searchSalesOrder: string = environment.baseUrl + "/api/salesorder/salesordersearch";
  private readonly globalSearchSalesOrder: string = environment.baseUrl + "/api/salesorder/salesorderglobalsearch";
  private readonly getSalesOrderDetails: string = environment.baseUrl + "/api/salesorder/get";
  private readonly getsoconfirmationlist: string = environment.baseUrl + "/api/salesorder/getsoconfirmationlist";
  private readonly getReservedPartsUrl: string = environment.baseUrl + "/api/salesorder/getreservedparts"
  private readonly getIssuedPartsUrl: string = environment.baseUrl + "/api/salesorder/getissuedparts"
  private readonly getSalesQuoteTotalDetails: string = environment.baseUrl + "/api/salesorder/togetheadermargindetails";
  private readonly getreserverstockPartsUrl: string = environment.baseUrl + "/api/salesorder/getreservedstockpartslist"
  private readonly getreserverstockPartsBySOIdUrl: string = environment.baseUrl + "/api/salesorder/getreservedstockpartslistBySOId"
  private readonly getReservedAndIssuedPartsUrl: string = environment.baseUrl + "/api/salesorder/getreservedissuesparts"
  private readonly getUnreservedPartsUrl: string = environment.baseUrl + "/api/salesorder/getunreservedparts"
  private readonly getUnissuedPartsUrl: string = environment.baseUrl + "/api/salesorder/getunissuedParts"
  private readonly saleOrderDeletePart: string = environment.baseUrl + "/api/salesorder/deletepart";
  private readonly getcommonsalesorderdetailsUrl: string = environment.baseUrl + "/api/salesorder/getcommonsalesorderdetails";
  private readonly getCustomerApprovalListUrl: string = environment.baseUrl + "/api/SalesOrder/soapprovallist";
  private readonly saveCustomerApprovalEndPointUrl = environment.baseUrl + "/api/SalesOrder/savecustomersalesorderapprovelist";
  private readonly getCloseEndPointUrl = environment.baseUrl + "/api/salesorder/close";
  private readonly getCancelEndPointUrl = environment.baseUrl + "/api/salesorder/cancel";
  private readonly getCopyEndPointUrl = environment.baseUrl + "/api/salesorder/copy";
  private readonly saleOrderDeleteMultiplePart: string = environment.baseUrl + "/api/salesorder/deletemultiplepart";
  //*Start savesarvice end point creation implementation --nitin

  private readonly _addDocumentDetails: string = environment.baseUrl + "/api/SalesOrder/SalesOrderDocumentUpload";
  private readonly _getsalesquoteDocslist: string = environment.baseUrl + "/api/SalesOrder/getSalesOrderDocumentDetailList";
  private readonly _getSalesOrderPartsViewByIdUrl: string = environment.baseUrl + "/api/SalesOrder/GetSalesOrderPartsViewById";
  private readonly _getsalesquoteDocumentAttachmentslist: string = environment.baseUrl + "/api/FileUpload/getattachmentdetails";
  private readonly _geSaleQuoteDocumentHistory: string = environment.baseUrl + "/api/SalesOrder/getSaleOrderDocumentAudit";
  private readonly _getSaveFreights: string = environment.baseUrl + "/api/SalesOrder/createsalesorderfreight";
  private readonly _getFreights: string = environment.baseUrl + "/api/SalesOrder/salesorderfreightlist";
  private readonly _getDeleteFreight: string = environment.baseUrl + "/api/SalesOrder/deletesalesorderfreight/";
  private readonly _getSaveCharges: string = environment.baseUrl + "/api/SalesOrder/createsalesordercharges";
  private readonly _getCharges: string = environment.baseUrl + "/api/SalesOrder/gesalesorderchargeslist";
  private readonly _getDeleteCharge: string = environment.baseUrl + "/api/SalesOrder/deletesalesordercharge";
  private readonly _getSoMarginSummary: string = environment.baseUrl + "/api/SalesOrder/create-so-margin-data";
  private readonly _getMarginSummary: string = environment.baseUrl + "/api/SalesOrder/get-sales-margin-data";

  private readonly salesorderBillingSave: string = environment.baseUrl + "/api/SalesOrder/createbillinginvoicing";
  private readonly salesorderShippingSave: string = environment.baseUrl + "/api/SalesOrder/createsalesordershipping";
  private readonly salesorderBillingGet: string = environment.baseUrl + "/api/SalesOrder/billinginvoicingdetailsbysopartId";
  private readonly salesorderShippingGet: string = environment.baseUrl + "/api/SalesOrder/salesordershippingdetails";
  private readonly getSalesOrderSetting: string = environment.baseUrl + "/api/SOSettings/getlist"
  private readonly saveSalesOrderSettigns: string = environment.baseUrl + "/api/SOSettings/save";
  private readonly deleteSalesOrderSettings: string = environment.baseUrl + "/api/SOSettings/delete";
  private readonly getSalesOrderSettingsAuditHistory: string = environment.baseUrl + "/api/SOSettings/getauditdatabyid";
  private readonly getSalesOrderAnalysis: string = environment.baseUrl + "/api/SalesOrder/togetsoanalysis";
  private readonly salesorderBillingPartsGet: string = environment.baseUrl + "/api/SalesOrder/GetSalesOrderPartsBillingView";
  private readonly salesorderShippingPartsGet: string = environment.baseUrl + "/api/SalesOrder//GetSalesOrderPartsShippingView";
  private readonly getFreightAudihistory: string = environment.baseUrl + '/api/SalesOrder/sales-order-freight-history';
  private readonly getChargesAudihistory: string = environment.baseUrl + '/api/SalesOrder/sales-order-charges-history';
  private readonly updatepickticket: string = environment.baseUrl + "/api/SalesOrder/updatepickticket";
  private readonly getstocklineforPickTicketUrl: string = environment.baseUrl + "/api/salesorder/searchstocklinefrompickticketpop"
  private readonly confirmpickticketUrl = environment.baseUrl + "/api/salesorder/confirmpt";
  private readonly getPickTicketforEdit: string = environment.baseUrl + "/api/salesorder/getpickticketedit"
  private readonly getShippingforEdit: string = environment.baseUrl + "/api/salesorder/getshippingedit"
  //**End  savesarvice end point creation implementation --nitin


  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    injector: Injector
  ) {
    super(http, configurations, injector);
  }


  createSOMarginSummary(marginSummary: MarginSummary) {
    return this.http
      .post(
        this._getSoMarginSummary,
        JSON.stringify(marginSummary),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.createSOMarginSummary(marginSummary));
      });
  }

  getSOMarginSummary(salesOrderId: number): Observable<MarginSummary> {
    const URL = `${this._getMarginSummary}/${salesOrderId}`;
    return this.http
      .get<MarginSummary>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSOMarginSummary(salesOrderId));
      });
  }

  getNewSalesOrderInstance<ISalesOrderView>(
    customerId: number
  ): Observable<ISalesOrderView> {
    const URL = `${this.getNewSalesOrderInstanceUrl}/${customerId}`;
    return this.http
      .get<ISalesOrderView>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getNewSalesOrderInstance(customerId)
        );
      });
  }

  create(salesOrder: ISalesOrderView): Observable<ISalesOrder> {
    return this.http
      .post(
        this.salesorder,
        JSON.stringify(salesOrder),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.create(salesOrder));
      });
  }

  getAllSalesOrderAnalysis<T>(id): Observable<T> {
    let endPointUrl = `${this.getSalesOrderAnalysis}/${id}`;;

    return this.http.get<T>(endPointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAllSalesOrderAnalysis(id));
      });
  }

    createBilling(billingAndInvoicing: SalesOrderBillingAndInvoicing) {
    return this.http
      .post(
        this.salesorderBillingSave,
        JSON.stringify(billingAndInvoicing),
        this.getRequestHeaders()
      )
        .catch(error => {
        return this.handleErrorCommon(error, () => this.createBilling(billingAndInvoicing));
      });
  }

  createShipping(shippingInfo: SalesOrderShipping): Observable<any> {
    return this.http
      .post(
        this.salesorderShippingSave,
        JSON.stringify(shippingInfo),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.createShipping(shippingInfo));
      });
  }

  update(salesOrder: ISalesOrderView): Observable<ISalesOrder> {
    let url: string = `${this.salesorder}/${salesOrder.salesOrder.salesOrderId}`;
    return this.http
      .put(url, JSON.stringify(salesOrder), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.update(salesOrder));
      });
  }

  search(
    salesQuoteSearchParameters :ISalesSearchParameters
  ): Observable<ISalesQuoteListView> {
    let params = JSON.stringify(salesQuoteSearchParameters);
    return this.http
      .post(
        this.searchSalesOrder,
        params,
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.search(salesQuoteSearchParameters)
        );
      });
  }

  globalSearch
    (
      salesQuoteSearchParameters: ISalesSearchParameters
    ): Observable<ISalesQuoteListView> {
    return this.http
      .post(
        this.globalSearchSalesOrder,
        JSON.stringify(salesQuoteSearchParameters),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.globalSearch(salesQuoteSearchParameters)
        );
      });
  }
  delete(salesOrderId: number): Observable<boolean> {
    let endpointUrl = `${this.salesorder}/${salesOrderId}`;
    return this.http
      .delete<boolean>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.delete(salesOrderId));
      });
  }

  deletePart(salesOrderPartId: number): Observable<boolean> {
    let endpointUrl = `${this.saleOrderDeletePart}/${salesOrderPartId}`;
    return this.http
      .delete<boolean>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.deletePart(salesOrderPartId));
      });
  }

  getSalesOrder(salesOrderId: number): Observable<ISalesOrderView> {
    const URL = `${this.getSalesOrderDetails}/${salesOrderId}`;
    return this.http
      .get<ISalesOrder>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrder(salesOrderId));
      });
  }

  getSalesOrderBilling(salesOrderId: number, partId): Observable<SalesOrderBillingAndInvoicing> {
    const URL = `${this.salesorderBillingGet}?salesOrderId=${salesOrderId}&salesOrderPartId=${partId}`;
    return this.http
      .get<SalesOrderBillingAndInvoicing>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrderBilling(salesOrderId, partId));
      });
  }

  getSalesOrderShippingParts(salesOrderId: number) {
    const URL = `${this.salesorderShippingPartsGet}/${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrderShippingParts(salesOrderId));
      });
  }

  getSalesOrderBillingParts(salesOrderId: number) {
    const URL = `${this.salesorderBillingPartsGet}/${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrderBillingParts(salesOrderId));
      });
  }

  getSalesOrderShipping(salesOrderId: number, partId): Observable<any> {
    const URL = `${this.salesorderShippingGet}?salesOrderId=${salesOrderId}&salesOrderPartId=${partId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrderShipping(salesOrderId, partId));
      });
  }

  getSalesOrderConformation(): Observable<ISalesOrderView> {
    const URL = `${this.getsoconfirmationlist}`;
    return this.http
      .get<ISalesOrder>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrderConformation());
      });
  }

  getReservedParts(salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getReservedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<ISalesOrder>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getReservedParts(salesOrderId));
      });
  }

  getIssuedParts(salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getIssuedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<ISalesOrder>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getIssuedParts(salesOrderId));
      });
  }
  GetTotal(salesQuoteId: number): Observable<any> {
    const URL = `${this.getSalesQuoteTotalDetails}/${salesQuoteId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.GetTotal(salesQuoteId));
      });
  }
  getReservestockpartlists(salesOrderId: number, itemMasterId: number): Observable<PartAction> {
    const URL = `${this.getreserverstockPartsUrl}?salesorderid=${salesOrderId}&itemmasterid=${itemMasterId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getReservestockpartlists(salesOrderId, itemMasterId));
      });
  }

  getReservestockpartlistsBySOId(salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getreserverstockPartsBySOIdUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getReservestockpartlistsBySOId(salesOrderId));
      });
  }

  getReservedAndIssuedParts(salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getReservedAndIssuedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<ISalesOrder>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getReservedAndIssuedParts(salesOrderId));
      });
  }

  getUnreservedParts(salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getUnreservedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<ISalesOrder>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getUnreservedParts(salesOrderId));
      });
  }

  getUnissuedParts(salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getUnissuedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<ISalesOrder>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getUnissuedParts(salesOrderId));
      });
  }

  getcommonsalesorderdetails(salesOrderId: number, salesOrderPartId: number): Observable<SalesOrderReference> {
    const URL = `${this.getcommonsalesorderdetailsUrl}?salesorderid=${salesOrderId}&salesorderpartid=${salesOrderPartId}`;
    return this.http
      .get<ISalesOrder>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getcommonsalesorderdetails(salesOrderId, salesOrderPartId));
      });
  }
  getunreservedstockpartslist(salesOrderId: number, itemMasterId: number): Observable<PartAction> {
    const URL = `${this.getunreserverstockPartsUrl}?salesorderid=${salesOrderId}&itemmasterid=${itemMasterId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getunreservedstockpartslist(salesOrderId, itemMasterId));
      });
  }
  getunreservedstockpartslistBySOId(salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getunreserverstockPartsBySOIdUrl}?salesorderid=${salesOrderId}`;
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
  getholdstocklinereservedparts(salesOrderId: number, salesOrderPartId: number, stockLineId: number, quantityRequested: number): Observable<PartAction> {
    const URL = `${this.getholdreservepartUrl}?salesorderid=${salesOrderId}&salesorderpartid=${salesOrderPartId}&stocklineid=${stockLineId}&quantityrequested=${quantityRequested}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getholdstocklinereservedparts(salesOrderId, salesOrderPartId, stockLineId, quantityRequested));
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
  
  getview(salesOrderId: number): Observable<any> {
    const URL = `${this.getSalesOrderViewDetails}/${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getview(salesOrderId));
      });
  }

  getPickTicket(salesOrderId: number): Observable<any> {
    const URL = `${this.getSalesOrdePickTicketDetails}/${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getview(salesOrderId));
      });
  }

  generatePickTicket(salesOrderId: number, salesOrderPartId: number): Observable<any> {
    const URL = `${this.generateSalesOrdePickTicket}/${salesOrderId}/${salesOrderPartId}`;
    return this.http
      .post<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.generatePickTicket(salesOrderId, salesOrderPartId));
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

  getCustomerApprovalList(salesOrderId: number): Observable<ISalesOrderCustomerApproval[]> {
    const URL = `${this.getCustomerApprovalListUrl}/${salesOrderId}`;
    return this.http
      .get<ISalesOrderCustomerApproval[]>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getCustomerApprovalList(salesOrderId));
      });
  }

  approveParts(data: ISalesOrderCustomerApproval[]): Observable<boolean> {
    return this.http
      .post(
        this.saveCustomerApprovalEndPointUrl,
        data,
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.approveParts(data));
      });
  }
  sentForInternalApproval(data) {
    return this.http.post<any>(`${this.configurations.baseUrl}/api/salesorder/soapproval`, JSON.stringify(data), this.getRequestHeaders());
  }

  close(salesOrderId: number,updatedBy:string): Observable<boolean> {
    const URL = `${this.getCloseEndPointUrl}/${salesOrderId}?updatedBy=${updatedBy}`;
    return this.http
      .put(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.close(salesOrderId,updatedBy));
      });
  }

  cancel(salesOrderId: number,updatedBy:string): Observable<boolean> {
    const URL = `${this.getCancelEndPointUrl}/${salesOrderId}?updatedBy=${updatedBy}`;
    return this.http
      .put(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.cancel(salesOrderId,updatedBy));
      });
  }

  copy(salesOrderId: number): Observable<ISalesOrderView> {
    const URL = `${this.getCopyEndPointUrl}/${salesOrderId}`;
    return this.http
      .get(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.copy(salesOrderId));
      });
  }

  //start SalesOrderQuoteDocument--nitin

  getDocumentUploadEndpoint<T>(file: any): Observable<T> {
    const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    return this.http.post<T>(`${this._addDocumentDetails}`, file);
  }
  getDocumentList(salesQuoteId) {
    return this.http.get<any>(`${this._getsalesquoteDocslist}/${salesQuoteId}`, this.getRequestHeaders())
  }
  GetUploadDocumentsList(attachmentId, salesquoteId, moduleId) {
    return this.http.get<any>(`${this._getsalesquoteDocumentAttachmentslist}?attachmentId=${attachmentId}&referenceId=${salesquoteId}&moduleId=${moduleId}`, this.getRequestHeaders())
  }
  getSalesQuoteDocumentAuditHistory(id) {
    return this.http.get<any>(`${this._geSaleQuoteDocumentHistory}/${id}`, this.getRequestHeaders())
  }

  createFreight(salesOrderFreights: ISOFreight[]): Observable<ISalesOrderQuote> {
    return this.http
      .post(
        this._getSaveFreights,
        JSON.stringify(salesOrderFreights),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.createFreight(salesOrderFreights));
      });
  }

  createCharges(salesOrderCharges: ISalesOrderCharge[]): Observable<ISalesOrderQuote> {
    return this.http
      .post(
        this._getSaveCharges,
        JSON.stringify(salesOrderCharges),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.createCharges(salesOrderCharges));
      });
  }

  getSalesOrderFreights(id, isDeleted) {
    return this.http.get<any>(`${this._getFreights}?SalesOrderId=${id}&isDeleted=${isDeleted}`, this.getRequestHeaders())
  }
  getSalesOrderCharges(id, isDeleted) {
    return this.http.get<any>(`${this._getCharges}?SalesOrderId=${id}&isDeleted=${isDeleted}`, this.getRequestHeaders())
  }

  deleteFrieght(frieghtId, userName): Observable<boolean> {
    let endpointUrl = `${this._getDeleteFreight}/${frieghtId}?updatedBy=${userName}`;
    return this.http
      .delete<boolean>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.deleteFrieght(frieghtId, userName));
      });
  }

  deleteCharge(chargeId, userName): Observable<boolean> {
    let endpointUrl = `${this._getDeleteCharge}/${chargeId}?updatedBy=${userName}`;
    return this.http
      .delete<boolean>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.deleteCharge(chargeId, userName));
      });
  }


  getAllSalesOrderSettings<T>(): Observable<T> {
    let endPointUrl = this.getSalesOrderSetting;

    return this.http.get<T>(endPointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAllSalesOrderSettings());
      });
  }

  saveOrUpdateSOSettings(data) {
    return this.http
      .post(
        this.saveSalesOrderSettigns,
        JSON.stringify(data),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.saveOrUpdateSOSettings(data));
      });
  }

  deleteSoSetting(salesOrderSettingId: number, updatedBy): Observable<boolean> {
    let endpointUrl = `${this.deleteSalesOrderSettings}?settingsId=${salesOrderSettingId}&updatedBy=${updatedBy}`;
    return this.http
      .delete<boolean>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.deleteSoSetting(salesOrderSettingId, updatedBy));
      });
  }
  getSOSettingHistory(id) {
    return this.http.get<any>(`${this.getSalesOrderSettingsAuditHistory}/${id}`, this.getRequestHeaders())
  }

  getSOFreightsHistory(id) {
    return this.http.get<any>(`${this.getFreightAudihistory}/?SalesOrderFreightId=${id}`, this.getRequestHeaders())
  }

    getSOChargesHistory(id) {
        return this.http.get<any>(`${this.getChargesAudihistory}/${id}`, this.getRequestHeaders())
    }

  getSOHistory(salesOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/salesorder/getSalesOrderHistory/?salesOrderId=${salesOrderId}`)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSOHistory(salesOrderId));
      });
  }

  approverslistbyTaskId(taskId, id) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/approvalrule/approverslistbyTaskId?approvalTaskId=${taskId}&id=${id}`)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.approverslistbyTaskId(taskId, id));
      });
  }

  deleteMultiplePart(salesOrderPartIds: any) {
    return this.http
      .post(
        this.saleOrderDeleteMultiplePart,
        JSON.stringify(salesOrderPartIds),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.deleteMultiplePart(salesOrderPartIds));
      });
  }

  getSalesOrderPartsViewById(salesOrderId) {
    return this.http.get<any>(`${this._getSalesOrderPartsViewByIdUrl}/${salesOrderId}`, this.getRequestHeaders())
  }

  updatePickTicket(data) {
    return this.http
      .post(
        this.updatepickticket,
        JSON.stringify(data),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updatePickTicket(data));
      });
  }

  getpickticketHistory(pickticketid) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/salesorder/sales-order-pick-ticket-history/?soPickTicketId=${pickticketid}`)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getpickticketHistory(pickticketid));
      });
  }

  getStockLineforPickTicket(itemMasterId: number, conditionId: number,salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getstocklineforPickTicketUrl}?itemMasterId=${itemMasterId}&conditionId=${conditionId}&salesOrderId=${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getStockLineforPickTicket(itemMasterId, conditionId,salesOrderId));
      });
  }

  savepickticketiteminterface(parts: SOPickTicket): Observable<SOPickTicket> {
    let url: string = `${this.savepickticketiteminterfaceUrl}`;
    return this.http
      .post(url, parts, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.savepickticketiteminterface(parts));
      });
  }

  confirmPickTicket(pickticketId: number,confirmById:string): Observable<boolean> {
    const URL = `${this.confirmpickticketUrl}/${pickticketId}?confirmById=${confirmById}`;
    return this.http
      .put(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.confirmPickTicket(pickticketId,confirmById));
      });
  }

  getPickTicketPrint(salesOrderId: number,salesOrderPartId:number,soPickTicketId: number): Observable<any> {
    //const URL = `${this.getSalesOrdePickTicketPrint}/${salesOrderId}&`;
    const URL = `${this.getSalesOrdePickTicketPrint}?salesOrderId=${salesOrderId}&salesOrderPartId=${salesOrderPartId}&soPickTicketId=${soPickTicketId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPickTicketPrint(salesOrderId,salesOrderPartId,soPickTicketId));
      });
  }

  getPickTicketEdit(soPickTicketId: number,salesOrderId: number,salesOrderPartId: number): Observable<PartAction> {
    const URL = `${this.getPickTicketforEdit}?soPickTicketId=${soPickTicketId}&salesOrderId=${salesOrderId}&salesOrderPartId=${salesOrderPartId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPickTicketEdit(soPickTicketId,salesOrderId,salesOrderPartId));
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

  getShippingEdit(salesOrderShippingId: number): Observable<any> {
    const URL = `${this.getShippingforEdit}?salesOrderShippingId=${salesOrderShippingId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getShippingEdit(salesOrderShippingId));
      });
  }
  //end nitin
}
