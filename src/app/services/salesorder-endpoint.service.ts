import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
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
import { catchError } from "rxjs/operators";

@Injectable()
export class SalesOrderEndpointService extends EndpointFactory {
  private readonly getNewSalesOrderInstanceUrl: string = "/api/salesorder/new";
  private readonly salesorder: string = "/api/salesorder";
  private readonly savereserveissuespartsurl: string = "/api/salesorder/savereserveissuesparts"
  private readonly getunreserverstockPartsUrl: string = "/api/salesorder/getunreservedstockpartslist"
  private readonly getholdreservepartUrl: string = "/api/salesorder/getholdstocklinereservedparts"
  private readonly getrelesereservepartUrl: string = "/api/salesorder/releasestocklinereservedparts"
  private readonly getSalesOrderViewDetails: string = "/api/SalesOrder/getview";
  private readonly getSalesOrdePickTicketDetails: string = "/api/SalesOrder/getsalesorderpickticket";

  // private readonly searchSalesOrder: string = "/api/salesorder/search";
  private readonly searchSalesOrder: string = "/api/salesorder/salesordersearch";
  private readonly globalSearchSalesOrder: string = "/api/salesorder/salesorderglobalsearch";
  private readonly getSalesOrderDetails: string = "/api/salesorder/get";
  private readonly getsoconfirmationlist: string = "/api/salesorder/getsoconfirmationlist";
  private readonly getReservedPartsUrl: string = "/api/salesorder/getreservedparts"
  private readonly getIssuedPartsUrl: string = "/api/salesorder/getissuedparts"
  private readonly getSalesQuoteTotalDetails: string = "/api/salesorder/togetheadermargindetails";
  private readonly getreserverstockPartsUrl: string = "/api/salesorder/getreservedstockpartslist"
  private readonly getReservedAndIssuedPartsUrl: string = "/api/salesorder/getreservedissuesparts"
  private readonly getUnreservedPartsUrl: string = "/api/salesorder/getunreservedparts"
  private readonly getUnissuedPartsUrl: string = "/api/salesorder/getunissuedParts"
  private readonly saleOrderDeletePart: string = "/api/salesorder/deletepart";
  private readonly getcommonsalesorderdetailsUrl: string = "/api/salesorder/getcommonsalesorderdetails";
  private readonly getCustomerApprovalListUrl: string = "/api/SalesOrder/soapprovallist";
  private readonly saveCustomerApprovalEndPointUrl = "/api/SalesOrder/savecustomersalesorderapprovelist";
  private readonly getCloseEndPointUrl = "/api/salesorder/close";
  private readonly getCancelEndPointUrl = "/api/salesorder/cancel";
  private readonly getCopyEndPointUrl = "/api/salesorder/copy";
  //*Start savesarvice end point creation implementation --nitin

  private readonly _addDocumentDetails: string = "/api/SalesOrder/SalesOrderDocumentUpload";
  private readonly _getsalesquoteDocslist: string = "/api/SalesOrder/getSalesOrderDocumentDetailList";
  private readonly _getsalesquoteDocumentAttachmentslist: string = "/api/FileUpload/getattachmentdetails";
  private readonly _geSaleQuoteDocumentHistory: string = "/api/SalesOrder/getSaleOrderDocumentAudit";
  private readonly _getSaveFreights: string = " /api/SalesOrder/createsalesorderfreight";
  private readonly _getFreights: string = " /api/SalesOrder/salesorderfreightlist";
  private readonly _getDeleteFreight: string = "/api/SalesOrder/deletesalesorderfreight/";
  private readonly _getSaveCharges: string = "/api/SalesOrder/createsalesordercharges";
  private readonly _getCharges: string = "/api/SalesOrder/gesalesorderchargeslist";
  private readonly _getDeleteCharge: string = "/api/SalesOrder/deletesalesordercharge";
  private readonly _getSoMarginSummary: string = "/api/SalesOrder/create-so-margin-data";
  private readonly _getMarginSummary: string = "/api/SalesOrder/get-sales-margin-data";

  private readonly salesorderBillingSave: string = "/api/SalesOrder/createbillinginvoicing";
  private readonly salesorderShippingSave: string = "/api/SalesOrder/createsalesordershipping";
  private readonly salesorderBillingGet: string = "/api/SalesOrder/billinginvoicingdetailsbysopartId";
  private readonly salesorderShippingGet: string = "/api/SalesOrder/salesordershippingdetails";
  private readonly getSalesOrderSetting: string = "api/SOSettings/getlist"
  private readonly saveSalesOrderSettigns: string = "api/SOSettings/save";
  private readonly deleteSalesOrderSettings: string = "api/SOSettings/delete";
  private readonly getSalesOrderSettingsAuditHistory: string = "api/SOSettings/getauditdatabyid";
  private readonly getSalesOrderAnalysis: string = "/api/SalesOrder/togetsoanalysis";
  private readonly salesorderBillingPartsGet: string = "api/SalesOrder/GetSalesOrderPartsBillingView";
  private readonly salesorderShippingPartsGet: string = "api/SalesOrder//GetSalesOrderPartsShippingView";

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
      ).pipe(
      catchError(error => {
        return this.handleError(error, () => this.createSOMarginSummary(marginSummary));
      }));
  }

  getSOMarginSummary(salesOrderId: number): Observable<MarginSummary> {
    const URL = `${this._getMarginSummary}/${salesOrderId}`;

    return this.http
      .get<any>(URL, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getSOMarginSummary(salesOrderId));
      }));
  }

  getNewSalesOrderInstance<ISalesOrderView>(
    customerId: number
  ): Observable<ISalesOrderView> {
    const URL = `${this.getNewSalesOrderInstanceUrl}/${customerId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () =>
          this.getNewSalesOrderInstance(customerId)
        );
      }));
  }

  create(salesOrder: ISalesOrderView): Observable<ISalesOrder> {
    return this.http
      .post<any>(
        this.salesorder,
        JSON.stringify(salesOrder),
        this.getRequestHeaders()
      ).pipe(
      catchError(error => {
        return this.handleError(error, () => this.create(salesOrder));
      }));

  }

  getAllSalesOrderAnalysis<T>(id): Observable<T> {
    let endPointUrl = `${this.getSalesOrderAnalysis}/${id}`;;

    return this.http.get<any>(endPointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getAllSalesOrderAnalysis(id));
      }));
  }

    createBilling(billingAndInvoicing: SalesOrderBillingAndInvoicing) {
    return this.http
      .post(
        this.salesorderBillingSave,
        JSON.stringify(billingAndInvoicing),
        this.getRequestHeaders()
      )
        .pipe(catchError(error => {
        return this.handleErrorCommon(error, () => this.createBilling(billingAndInvoicing));
      }));
  }

  createShipping(shippingInfo: SalesOrderShipping): Observable<any> {
    return this.http
      .post(
        this.salesorderShippingSave,
        JSON.stringify(shippingInfo),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () => this.createShipping(shippingInfo));
      }));
  }

  update(salesOrder: ISalesOrderView): Observable<ISalesOrder> {
    let url: string = `${this.salesorder}/${salesOrder.salesOrder.salesOrderId}`;
    return this.http
      .put<any>(url, JSON.stringify(salesOrder), this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.create(salesOrder));
      }));
  }

  search(
    salesQuoteSearchParameters: ISalesSearchParameters
  ): Observable<ISalesQuoteListView> {
    return this.http
      .post<any>(
        this.searchSalesOrder,
        JSON.stringify(salesQuoteSearchParameters),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.search(salesQuoteSearchParameters)
        );
      }));
  }

  globalSearch
    (
      salesQuoteSearchParameters: ISalesSearchParameters
    ): Observable<ISalesQuoteListView> {
    return this.http
      .post<any>(
        this.globalSearchSalesOrder,
        JSON.stringify(salesQuoteSearchParameters),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.globalSearch(salesQuoteSearchParameters)
        );
      }));
  }
  delete(salesOrderId: number): Observable<boolean> {
    let endpointUrl = `${this.salesorder}/${salesOrderId}`;
    return this.http
      .delete<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.delete(salesOrderId));
      }));
  }

  deletePart(salesOrderPartId: number): Observable<boolean> {
    let endpointUrl = `${this.saleOrderDeletePart}/${salesOrderPartId}`;
    return this.http
      .delete<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.deletePart(salesOrderPartId));
      }));
  }

  getSalesOrder(salesOrderId: number): Observable<ISalesOrderView> {
    const URL = `${this.getSalesOrderDetails}/${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getSalesOrder(salesOrderId));
      }));
  }

  getSalesOrderBilling(salesOrderId: number, partId): Observable<SalesOrderBillingAndInvoicing> {
    const URL = `${this.salesorderBillingGet}?salesOrderId=${salesOrderId}&salesOrderPartId=${partId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getSalesOrderBilling(salesOrderId, partId));
      }));
  }

  getSalesOrderShippingParts(salesOrderId: number) {
    const URL = `${this.salesorderShippingPartsGet}/${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getSalesOrderShippingParts(salesOrderId));
      }));
  }

  getSalesOrderBillingParts(salesOrderId: number) {
    const URL = `${this.salesorderBillingPartsGet}/${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getSalesOrderBillingParts(salesOrderId));
      }));
  }

  getSalesOrderShipping(salesOrderId: number, partId): Observable<any> {
    const URL = `${this.salesorderShippingGet}?salesOrderId=${salesOrderId}&salesOrderPartId=${partId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getSalesOrderShipping(salesOrderId, partId));
      }));
  }

  getSalesOrderConformation(): Observable<ISalesOrderView> {
    const URL = `${this.getsoconfirmationlist}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getSalesOrderConformation());
      }));
  }

  getReservedParts(salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getReservedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getReservedParts(salesOrderId));
      }));
  }

  getIssuedParts(salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getIssuedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getIssuedParts(salesOrderId));
      }));
  }
  GetTotal(salesQuoteId: number): Observable<any> {
    const URL = `${this.getSalesQuoteTotalDetails}/${salesQuoteId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.GetTotal(salesQuoteId));
      }));
  }
  getReservestockpartlists(salesOrderId: number, itemMasterId: number): Observable<PartAction> {
    const URL = `${this.getreserverstockPartsUrl}?salesorderid=${salesOrderId}&itemmasterid=${itemMasterId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getReservestockpartlists(salesOrderId, itemMasterId));
      }));
  }

  getReservedAndIssuedParts(salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getReservedAndIssuedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getReservedAndIssuedParts(salesOrderId));
      }));
  }

  getUnreservedParts(salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getUnreservedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getUnreservedParts(salesOrderId));
      }));
  }

  getUnissuedParts(salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getUnissuedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getUnissuedParts(salesOrderId));
      }));
  }

  getcommonsalesorderdetails(salesOrderId: number, salesOrderPartId: number): Observable<SalesOrderReference> {
    const URL = `${this.getcommonsalesorderdetailsUrl}?salesorderid=${salesOrderId}&salesorderpartid=${salesOrderPartId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getcommonsalesorderdetails(salesOrderId, salesOrderPartId));
      }));
  }
  getunreservedstockpartslist(salesOrderId: number, itemMasterId: number): Observable<PartAction> {
    const URL = `${this.getunreserverstockPartsUrl}?salesorderid=${salesOrderId}&itemmasterid=${itemMasterId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getunreservedstockpartslist(salesOrderId, itemMasterId));
      }));
  }
  releasestocklinereservedparts(salesOrderId: number): Observable<any> {
    const URL = `${this.getrelesereservepartUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.releasestocklinereservedparts(salesOrderId));
      }));
  }
  getholdstocklinereservedparts(salesOrderId: number, salesOrderPartId: number, stockLineId: number, quantityRequested: number): Observable<PartAction> {
    const URL = `${this.getholdreservepartUrl}?salesorderid=${salesOrderId}&salesorderpartid=${salesOrderPartId}&stocklineid=${stockLineId}&quantityrequested=${quantityRequested}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getholdstocklinereservedparts(salesOrderId, salesOrderPartId, stockLineId, quantityRequested));
      }));
  }
  savereserveissuesparts(parts: PartAction): Observable<PartAction> {
    let url: string = `${this.savereserveissuespartsurl}`;
    return this.http
      .post<any>(url, parts, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.savereserveissuesparts(parts));
      }));
  }
  getview(salesOrderId: number): Observable<any> {
    const URL = `${this.getSalesOrderViewDetails}/${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getview(salesOrderId));
      }));
  }
  getPickTicket(salesOrderId: number): Observable<any> {
    const URL = `${this.getSalesOrdePickTicketDetails}/${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getview(salesOrderId));
      }));
  }

  getCustomerApprovalList(salesOrderId: number): Observable<ISalesOrderCustomerApproval[]> {
    const URL = `${this.getCustomerApprovalListUrl}/${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getCustomerApprovalList(salesOrderId));
      }));
  }

  approveParts(data: ISalesOrderCustomerApproval[]): Observable<boolean> {
    return this.http
      .post<any>(
        this.saveCustomerApprovalEndPointUrl,
        data,
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () => this.approveParts(data));
      }));
  }
  sentForInternalApproval(data) {
    return this.http.post<any>(`${this.configurations.baseUrl}/api/salesorder/soapproval`, JSON.stringify(data), this.getRequestHeaders());
  }

  close(salesOrderId: number): Observable<boolean> {
    const URL = `${this.getCloseEndPointUrl}/${salesOrderId}`;
    return this.http
      .put<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.close(salesOrderId));
      }));
  }

  cancel(salesOrderId: number): Observable<boolean> {
    const URL = `${this.getCancelEndPointUrl}/${salesOrderId}`;
    return this.http
      .put<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.cancel(salesOrderId));
      }));
  }

  copy(salesOrderId: number): Observable<ISalesOrderView> {
    const URL = `${this.getCopyEndPointUrl}/${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.copy(salesOrderId));
      }));
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
      .post<any>(
        this._getSaveFreights,
        JSON.stringify(salesOrderFreights),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () => this.createFreight(salesOrderFreights));
      }));
  }

  createCharges(salesOrderCharges: ISalesOrderCharge[]): Observable<ISalesOrderQuote> {
    return this.http
      .post<any>(
        this._getSaveCharges,
        JSON.stringify(salesOrderCharges),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () => this.createCharges(salesOrderCharges));
      }));
  }

  getSalesOrderFreights(id, partId) {
    return this.http.get<any>(`${this._getFreights}?SalesOrderId=${id}&SalesOrderPartId=${partId}`, this.getRequestHeaders())
  }
  getSalesOrderCharges(id, partId) {
    return this.http.get<any>(`${this._getCharges}?SalesOrderId=${id}&SalesOrderPartId=${partId}`, this.getRequestHeaders())
  }

  deleteFrieght(frieghtId, userName): Observable<boolean> {
    let endpointUrl = `${this._getDeleteFreight}/${frieghtId}?updatedBy=${userName}`;
    return this.http
      .delete<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.deleteFrieght(frieghtId, userName));
      }));
  }

  deleteCharge(chargeId, userName): Observable<boolean> {
    let endpointUrl = `${this._getDeleteCharge}/${chargeId}?updatedBy=${userName}`;
    return this.http
      .delete<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.deleteCharge(chargeId, userName));
      }));
  }


  getAllSalesOrderSettings<T>(): Observable<T> {
    let endPointUrl = this.getSalesOrderSetting;

    return this.http.get<any>(endPointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getAllSalesOrderSettings());
      }));
  }

  saveOrUpdateSOSettings(data) {
    return this.http
      .post(
        this.saveSalesOrderSettigns,
        JSON.stringify(data),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () => this.saveOrUpdateSOSettings(data));
      }));
  }

  deleteSoSetting(salesOrderSettingId: number, updatedBy): Observable<boolean> {
    let endpointUrl = `${this.deleteSalesOrderSettings}?settingsId=${salesOrderSettingId}&updatedBy=${updatedBy}`;
    return this.http
      .delete<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.deleteSoSetting(salesOrderSettingId, updatedBy));
      }));
  }
  getSOSettingHistory(id) {
    return this.http.get<any>(`${this.getSalesOrderSettingsAuditHistory}/${id}`, this.getRequestHeaders())
  }
  //end nitin
}
