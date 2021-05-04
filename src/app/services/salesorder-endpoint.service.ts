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
  private readonly getSalesOrderPrintViewDetails: string = environment.baseUrl + "/api/SalesOrder/getprintview";
  private readonly getSalesOrdePickTicketDetails: string = environment.baseUrl + "/api/SalesOrder/getsalesorderpickticket";
  private readonly getPickTicketListUrl: string = environment.baseUrl + "/api/SalesOrder/getpickticketapprovelist";
  private readonly generateSalesOrdePickTicket: string = environment.baseUrl + "/api/SalesOrder/generatepickticket";
  private readonly savepickticketiteminterfaceUrl: string = environment.baseUrl + "/api/salesorder/savepickticketiteminterface"
  private readonly getSalesOrdePickTicketPrint: string = environment.baseUrl + "/api/SalesOrder/getsalesorderpickticketforprint";
  private readonly getShippingDataListURL: string = environment.baseUrl + "/api/SalesOrder/getsalesordershippinglist";
  private readonly getBillingInvoiceListUrl: string = environment.baseUrl + "/api/SalesOrder/salesorderBillingInvoicelist";
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
  private readonly _getChargesById: string = environment.baseUrl + "/api/SalesOrder/GetSalesOrderChargesBySOId";
  private readonly _getDeleteCharge: string = environment.baseUrl + "/api/SalesOrder/deletesalesordercharge";
  private readonly _getSoMarginSummary: string = environment.baseUrl + "/api/SalesOrder/create-so-margin-data";
  private readonly _getMarginSummary: string = environment.baseUrl + "/api/SalesOrder/get-sales-margin-data";
  private readonly salesorderBillingSave: string = environment.baseUrl + "/api/SalesOrder/createbillinginvoicing";
  private readonly salesorderShippingSave: string = environment.baseUrl + "/api/SalesOrder/createsalesordershipping";
  private readonly salesorderSavePackingSlip: string = environment.baseUrl + "/api/SalesOrder/SavePackingSlip";
  private readonly salesorderBillingGet: string = environment.baseUrl + "/api/SalesOrder/billinginvoicingdetailsbysopartId";
  private readonly salesorderBillingByShipping: string = environment.baseUrl + "/api/SalesOrder/billinginvoicingdetailsbyshippingId";
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
  private readonly getShipingLabelForPrintPrint: string = environment.baseUrl + "/api/SalesOrder/getShipingLabelForPrint";
  private readonly getMultiShipingLabelForPrint: string = environment.baseUrl + "/api/SalesOrder/getMultiShipingLabelForPrint";
  private readonly getPackagingSlipForPrint: string = environment.baseUrl + "/api/SalesOrder/printPackagingSlip";
  private readonly updateServiceClass: string = environment.baseUrl + "/api/SalesOrder/updateServiceClass";
  private readonly getSalesOrderBillingInvoicingPdfURL: string = environment.baseUrl + "/api/SalesOrder/GetSalesOrderBillingInvoicingPdf";
  private readonly getSalesOrderBillingInvoicingDataURL: string = environment.baseUrl + "/api/SalesOrder/GetSalesOrderBillingInvoicingData";
  private readonly GetSalesOrderBillingInvoicingByIdURL: string = environment.baseUrl + "/api/SalesOrder/GetSalesOrderBillingInvoicingById";
  private readonly updateSalesOrderBillingInvoicingURL: string = environment.baseUrl + "/api/SalesOrder/updateSalesOrderBillingInvoicing";
  //**End  savesarvice end point creation implementation --nitin

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    injector: Injector) {
    super(http, configurations, injector);
  }

  createSOMarginSummary(marginSummary: MarginSummary) {
    return this.http
      .post(this._getSoMarginSummary, JSON.stringify(marginSummary), this.getRequestHeaders())
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

  getNewSalesOrderInstance<ISalesOrderView>(customerId: number): Observable<ISalesOrderView> {
    const URL = `${this.getNewSalesOrderInstanceUrl}/${customerId}`;
    return this.http
      .get<ISalesOrderView>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getNewSalesOrderInstance(customerId));
      });
  }

  create(salesOrder: ISalesOrderView): Observable<any> {
    return this.http
      .post(this.salesorder, JSON.stringify(salesOrder), this.getRequestHeaders())
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
      .post(this.salesorderBillingSave, JSON.stringify(billingAndInvoicing), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.createBilling(billingAndInvoicing));
      });
  }

  createShipping(shippingInfo: SalesOrderShipping): Observable<any> {
    return this.http
      .post(this.salesorderShippingSave, JSON.stringify(shippingInfo), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.createShipping(shippingInfo));
      });
  }

  generatePackagingSlip(packagingSlip: any): Observable<any> {
    return this.http
      .post(this.salesorderSavePackingSlip, JSON.stringify(packagingSlip), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.generatePackagingSlip(packagingSlip));
      });
  }

  update(salesOrder: ISalesOrderView): Observable<any> {
    let url: string = `${this.salesorder}/${salesOrder.salesOrder.salesOrderId}`;
    return this.http
      .put(url, JSON.stringify(salesOrder), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.update(salesOrder));
      });
  }

  search(salesQuoteSearchParameters: ISalesSearchParameters): Observable<any> {
    let params = JSON.stringify(salesQuoteSearchParameters);
    return this.http.post(this.searchSalesOrder, params, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.search(salesQuoteSearchParameters));
      });
  }

  globalSearch(salesQuoteSearchParameters: ISalesSearchParameters): Observable<any> {
    return this.http
      .post(this.globalSearchSalesOrder, JSON.stringify(salesQuoteSearchParameters), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.globalSearch(salesQuoteSearchParameters));
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

  getSalesOrder(salesOrderId: number): Observable<any> {
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

  getSalesOrderBillingByShipping(salesOrderId: number, partId, salesOrderShippingId: number): Observable<SalesOrderBillingAndInvoicing> {
    const URL = `${this.salesorderBillingByShipping}?salesOrderId=${salesOrderId}&salesOrderPartId=${partId}&salesOrderShippingId=${salesOrderShippingId}`;
    return this.http
      .get<SalesOrderBillingAndInvoicing>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrderBillingByShipping(salesOrderId, partId, salesOrderShippingId));
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

  getSalesOrderConformation(): Observable<any> {
    const URL = `${this.getsoconfirmationlist}`;
    return this.http
      .get<ISalesOrder>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrderConformation());
      });
  }

  getReservedParts(salesOrderId: number): Observable<any> {
    const URL = `${this.getReservedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<ISalesOrder>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getReservedParts(salesOrderId));
      });
  }

  getIssuedParts(salesOrderId: number): Observable<any> {
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

  getReservedAndIssuedParts(salesOrderId: number): Observable<any> {
    const URL = `${this.getReservedAndIssuedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<ISalesOrder>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getReservedAndIssuedParts(salesOrderId));
      });
  }

  getUnreservedParts(salesOrderId: number): Observable<any> {
    const URL = `${this.getUnreservedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<ISalesOrder>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getUnreservedParts(salesOrderId));
      });
  }

  getUnissuedParts(salesOrderId: number): Observable<any> {
    const URL = `${this.getUnissuedPartsUrl}?salesorderid=${salesOrderId}`;
    return this.http
      .get<ISalesOrder>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getUnissuedParts(salesOrderId));
      });
  }

  getcommonsalesorderdetails(salesOrderId: number, salesOrderPartId: number): Observable<any> {
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

  getPrintview(salesOrderId: number): Observable<any> {
    const URL = `${this.getSalesOrderPrintViewDetails}/${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPrintview(salesOrderId));
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

  getBillingInvoiceList(salesOrderId: number): Observable<any> {
    const URL = `${this.getBillingInvoiceListUrl}/${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getBillingInvoiceList(salesOrderId));
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

  approveParts(data: ISalesOrderCustomerApproval[]): Observable<any> {
    return this.http
      .post(this.saveCustomerApprovalEndPointUrl, data, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.approveParts(data));
      });
  }

  sentForInternalApproval(data) {
    return this.http.post<any>(`${this.configurations.baseUrl}/api/salesorder/soapproval`, JSON.stringify(data), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.approveParts(data));
      });
  }

  close(salesOrderId: number, updatedBy: string): Observable<any> {
    const URL = `${this.getCloseEndPointUrl}/${salesOrderId}?updatedBy=${updatedBy}`;
    return this.http
      .put(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.close(salesOrderId, updatedBy));
      });
  }

  cancel(salesOrderId: number, updatedBy: string): Observable<any> {
    const URL = `${this.getCancelEndPointUrl}/${salesOrderId}?updatedBy=${updatedBy}`;
    return this.http
      .put(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.cancel(salesOrderId, updatedBy));
      });
  }

  copy(salesOrderId: number): Observable<any> {
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
    return this.http.post<T>(`${this._addDocumentDetails}`, file).catch(error => {
      return this.handleErrorCommon(error, () => this.getDocumentUploadEndpoint(file));
    });
  }

  getDocumentList(salesQuoteId) {
    return this.http.get<any>(`${this._getsalesquoteDocslist}/${salesQuoteId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getDocumentList(salesQuoteId));
    })
  }

  GetUploadDocumentsList(attachmentId, salesquoteId, moduleId) {
    return this.http.get<any>(`${this._getsalesquoteDocumentAttachmentslist}?attachmentId=${attachmentId}&referenceId=${salesquoteId}&moduleId=${moduleId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetUploadDocumentsList(attachmentId, salesquoteId, moduleId));
    })
  }

  getSalesQuoteDocumentAuditHistory(id) {
    return this.http.get<any>(`${this._geSaleQuoteDocumentHistory}/${id}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesQuoteDocumentAuditHistory(id));
      });
  }

  createFreight(salesOrderFreights: ISOFreight[]): Observable<any> {
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

  createCharges(salesOrderCharges: ISalesOrderCharge[]): Observable<any> {
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
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrderFreights(id, isDeleted));
      });
  }

  getSalesOrderCharges(id, isDeleted) {
    return this.http.get<any>(`${this._getCharges}?SalesOrderId=${id}&isDeleted=${isDeleted}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrderCharges(id, isDeleted));
      });
  }

  getSalesOrderChargesById(id, isDeleted) {
    const URL = `${this._getChargesById}?SalesOrderId=${id}&isDeleted=${isDeleted}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrderChargesById(id, isDeleted));
      });
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

  getAllSalesOrderSettings<T>(masterCompanyId): Observable<T> {
    let endPointUrl = `${this.getSalesOrderSetting}?masterCompanyId=${masterCompanyId}`;

    return this.http.get<T>(endPointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAllSalesOrderSettings(masterCompanyId));
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
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSOSettingHistory(id));
      });
  }

  getSOFreightsHistory(id) {
    return this.http.get<any>(`${this.getFreightAudihistory}/?SalesOrderFreightId=${id}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSOFreightsHistory(id));
      })
  }

  getSOChargesHistory(id) {
    return this.http.get<any>(`${this.getChargesAudihistory}/${id}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSOChargesHistory(id));
      });
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
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrderPartsViewById(salesOrderId));
      });
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

  getStockLineforPickTicket(itemMasterId: number, conditionId: number, salesOrderId: number): Observable<PartAction> {
    const URL = `${this.getstocklineforPickTicketUrl}?itemMasterId=${itemMasterId}&conditionId=${conditionId}&salesOrderId=${salesOrderId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getStockLineforPickTicket(itemMasterId, conditionId, salesOrderId));
      });
  }

  savepickticketiteminterface(parts: SOPickTicket): Observable<any> {
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

  getPickTicketPrint(salesOrderId: number, salesOrderPartId: number, soPickTicketId: number): Observable<any> {
    const URL = `${this.getSalesOrdePickTicketPrint}?salesOrderId=${salesOrderId}&salesOrderPartId=${salesOrderPartId}&soPickTicketId=${soPickTicketId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPickTicketPrint(salesOrderId, salesOrderPartId, soPickTicketId));
      });
  }

  getPickTicketEdit(soPickTicketId: number, salesOrderId: number, salesOrderPartId: number): Observable<PartAction> {
    const URL = `${this.getPickTicketforEdit}?soPickTicketId=${soPickTicketId}&salesOrderId=${salesOrderId}&salesOrderPartId=${salesOrderPartId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPickTicketEdit(soPickTicketId, salesOrderId, salesOrderPartId));
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

  getShippingLabelPrint(salesOrderId: number, salesOrderPartId: number, soShippingId: number): Observable<any> {
    const URL = `${this.getShipingLabelForPrintPrint}?salesOrderId=${salesOrderId}&salesOrderPartId=${salesOrderPartId}&soShippingId=${soShippingId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getShippingLabelPrint(salesOrderId, salesOrderPartId, soShippingId));
      });
  }

  getMultiShippingLabelPrint(multiPackagingLabel: any): Observable<any> {
    const URL = `${this.getMultiShipingLabelForPrint}`;
    return this.http
      .post<any>(URL, JSON.stringify(multiPackagingLabel), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getMultiShippingLabelPrint(multiPackagingLabel));
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

  downloadPDF(url) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get(url, { headers: headers, responseType: 'blob' }).catch(error => {
      return this.handleErrorCommon(error, () => this.downloadPDF(url));
    });
  }

  getSalesOrderBillingInvoicingPdf(sobillingInvoicingId: number): Observable<any> {
    const URL = `${this.getSalesOrderBillingInvoicingPdfURL}/${sobillingInvoicingId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrderBillingInvoicingPdf(sobillingInvoicingId));
      });
  }

  getSalesOrderBillingInvoicingData(sobillingInvoicingId: number): Observable<any> {
    const URL = `${this.getSalesOrderBillingInvoicingDataURL}/${sobillingInvoicingId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesOrderBillingInvoicingData(sobillingInvoicingId));
      });
  }

  GetSalesOrderBillingInvoicingById(sobillingInvoicingId: number): Observable<any> {
    const URL = `${this.GetSalesOrderBillingInvoicingByIdURL}/${sobillingInvoicingId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.GetSalesOrderBillingInvoicingById(sobillingInvoicingId));
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

  updateSalesOrderBillingInvoicing(sobillingInvoicingId: number, billingInvoicing: any): Observable<any> {
    let url: string = `${this.updateSalesOrderBillingInvoicingURL}/${sobillingInvoicingId}`;
    return this.http
      .put(url, JSON.stringify(billingInvoicing), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.updateSalesOrderBillingInvoicing(sobillingInvoicingId, billingInvoicing));
      });
  }
  //end nitin
}