import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { EndpointFactory } from "./endpoint-factory.service";
import { ConfigurationService } from "./configuration.service";
import { ISalesQuote } from "../models/sales/ISalesQuote.model";
import { ISalesQuoteView } from "../models/sales/ISalesQuoteView";
import { ISalesOrderQuote } from "../models/sales/ISalesOrderQuote";
import { ISalesSearchParameters } from "../models/sales/ISalesSearchParameters";
import { ISalesQuoteListView } from "../models/sales/ISalesQuoteListView";
import { VerifySalesQuoteModel } from "../components/sales/quotes/models/verify-sales-quote-model";
import { SalesOrderConversionCritera } from "../components/sales/quotes/models/sales-order-conversion-criteria";
import { SalesOrderView } from "../models/sales/SalesOrderView";
import { ISalesOrderFreight } from "../models/sales/ISalesOrderFreight";
import { ISalesOrderQuoteCharge } from "../models/sales/ISalesOrderQuoteCharge";
import { SOQuoteMarginSummary } from "../models/sales/SoQuoteMarginSummary";
import { environment } from "../../environments/environment";

@Injectable()
export class SalesQuoteEndpointService extends EndpointFactory {
  private readonly getNewSalesQuoteInstanceUrl: string = environment.baseUrl + "/api/salesquote/new";
  private readonly saleQuote: string = environment.baseUrl + "/api/salesquote";
  private readonly saleQuoteSettings: string = environment.baseUrl + "/api/SOQuoteSettings/delete";
  private readonly soqMarginSummary: string = environment.baseUrl + "/api/SalesQuote/create-quote-margin-data";
  private readonly getSoqMarginSummary: string = environment.baseUrl + "/api/SalesQuote/get-sales-quote-margin-data";
  private readonly saleQuoteChargesSave: string = environment.baseUrl + "/api/SalesQuote/createsalesorderquotecharges";
  private readonly saleQuoteFreightsSave: string = environment.baseUrl + "/api/SalesQuote/createsalesorderquotefreight";
  private readonly _deleteSalesOrderFrignt: string = environment.baseUrl + "/api/salesquote/deletesalesorderquotefreight";
  private readonly _deleteSalesOrderCharge: string = environment.baseUrl + "/api/SalesQuote/deletesalesorderquotecharge";
  private readonly saveCustomerQuotesApprovedEndPointUrl: string = environment.baseUrl + "/api/SalesQuote/soquoteapproval"
  // private readonly searchSalesQuote: string = "/api/salesquote/search";
  private readonly searchSalesQuote: string = environment.baseUrl + "/api/salesquote/salesquotesearch";
  private readonly globalSearchSalesQuote: string = environment.baseUrl + "/api/salesquote/salesquoteglobalsearch";
  private readonly getSalesQuoteDetails: string = environment.baseUrl + "/api/salesquote/get";
  private readonly getSalesQuoteViewDetails: string = environment.baseUrl + "/api/salesquote/getview";
  private readonly getSalesQuoteTotalDetails: string = environment.baseUrl + "/api/salesquote/togetquoteheadermargindetails";
  private readonly getCopyEndpointUrl: string = environment.baseUrl + "/api/salesquote/copy"
  private readonly getVerifyEndpointUrl: string = environment.baseUrl + "/api/salesquote/verify"
  // private readonly getCustomerQuotesListUrl: string = "/api/salesquote/customerquotelistbycustomerid"
  private readonly getCustomerQuotesListUrl: string = environment.baseUrl + "/api/salesquote/soquoteapprovallist"
  // customerquotelistbycustomeridandsalesquoteid/3?salesQuoteId=22
  private readonly getCloseEndointUrl: string = environment.baseUrl + "/api/salesquote/close"
  private readonly getEmailQuoteEndointUrl: string = environment.baseUrl + "/api/salesquote/soqsendmail"
  private readonly getConvertfromquoteEndPoint: string = environment.baseUrl + "/api/salesorder/convertfromquote"
  private readonly saleQuoteDeletePart: string = environment.baseUrl + "/api/salesquote/deletepart";
  private readonly saleQuoteDeleteMultiplePart: string = environment.baseUrl + "/api/salesquote/deletemultiplepart";

  //*Start savesarvice end point creation implementation --nitin
  private readonly _addSalesOrderQuoteFileUpload: string = environment.baseUrl + "/api/salesquote/SalesQuoteGeneralDocumentUpload";
  private readonly _addDocumentDetails: string = environment.baseUrl + "/api/salesquote/SalesQuoteDocumentUpload";
  private readonly _getsalesquoteDocslist: string = environment.baseUrl + "/api/salesquote/getSalesQuoteDocumentDetailList";
  private readonly _getsalesquoteDocumentAttachmentslist: string = environment.baseUrl + "/api/FileUpload/getattachmentdetails";
  private readonly _geSaleQuoteDocumentHistory: string = environment.baseUrl + "/api/salesquote/getSaleQuoteDocumentAudit";
  private readonly _geSaleQuoteFreights: string = environment.baseUrl + "/api/SalesQuote/salesorderquotefreightlist";
  private readonly _geSaleQuoteCharges: string = environment.baseUrl + "/api/SalesQuote/gesalesorderquotechargeslist";
  private readonly _savequoteHeader: string = environment.baseUrl + "/api/salesquote/saveSalesQuoteHeader";
  private readonly getAllSalesOrderTypesURL: string = environment.baseUrl + "/api/WorkOrder/workOrderTypes";
  private readonly saveSOQSetting: string = environment.baseUrl + "/api/SOQuoteSettings/save";
  private readonly getSalesOrderQuoteSetting: string = environment.baseUrl + "/api/SOQuoteSettings/getlist";
  private readonly _geSaleQuoteSettingsHistory: string = environment.baseUrl + "/api/SOQuoteSettings/getauditdatabyid";
  private readonly getSalesOrderQuoteAnalysis: string = environment.baseUrl + "/api/SalesQuote/togetsoquoteanalysis";
  private readonly getFreightAudihistory: string = environment.baseUrl + '/api/SalesQuote/quote-freight-history';
  private readonly getChargesAudihistory: string = environment.baseUrl + '/api/salesquote/quote-charges-history';
  private readonly getAllSOQEditIDUrl: string = environment.baseUrl + '/api/SalesQuote/getAllSOQEditID';
  private readonly _geSaleQuoteParts: string = environment.baseUrl + "/api/SalesQuote/gesalesorderquotepartslist";
  //**End  savesarvice end point creation implementation --nitin

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    injector: Injector
  ) {
    super(http, configurations, injector);
  }


  getSOQHistory(salesOrderQuoteId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/salesquote/getSalesOrderQuoteHistory/?salesOrderQuoteId=${salesOrderQuoteId}`)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSOQHistory(salesOrderQuoteId));
      });
  }

  getSOQPartHistory(salesOrderQuotePartId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/SalesQuote/getsalequoteparthistory/${salesOrderQuotePartId}`)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSOQPartHistory(salesOrderQuotePartId));
      });
  }

  getNewSalesQuoteInstance<ISalesQuote>(
    customerId: number
  ): Observable<ISalesQuote> {
    const URL = `${this.getNewSalesQuoteInstanceUrl}/${customerId}`;
    return this.http
      .get<ISalesQuote>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getNewSalesQuoteInstance(customerId)
        );
      });
  }

  createSOQMarginSummary(marginSummary: SOQuoteMarginSummary) {
    return this.http
      .post(
        this.soqMarginSummary,
        JSON.stringify(marginSummary),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.createSOQMarginSummary(marginSummary));
      });
  }

  getAllSalesOrderTypes<T>(): Observable<T> {
    let endPointUrl = this.getAllSalesOrderTypesURL;

    return this.http.get<T>(endPointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAllSalesOrderTypes());
      });
  }

  getAllSalesOrderQuoteAnalysis<T>(id): Observable<T> {
    let endPointUrl = `${this.getSalesOrderQuoteAnalysis}/${id}`;;

    return this.http.get<T>(endPointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAllSalesOrderQuoteAnalysis(id));
      });
  }

  getAllSalesOrderQuoteSettings<T>(masterCompanyId): Observable<T> {
    //let endPointUrl = this.getSalesOrderQuoteSetting;
    let endPointUrl = `${this.getSalesOrderQuoteSetting}?masterCompanyId=${masterCompanyId}`;
    return this.http.get<T>(endPointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAllSalesOrderQuoteSettings(masterCompanyId));
      });
  }

  saveOrUpdateSOQuoteSettings(data) {
    return this.http
      .post(
        this.saveSOQSetting,
        JSON.stringify(data),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.saveOrUpdateSOQuoteSettings(data));
      });
  }

  getSOQMarginSummary(salesOrderQuoteId: number): Observable<SOQuoteMarginSummary> {
    const URL = `${this.getSoqMarginSummary}/${salesOrderQuoteId}`;
    return this.http
      .get<SOQuoteMarginSummary>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSOQMarginSummary(salesOrderQuoteId));
      });
  }

  create(salesQuote: ISalesQuoteView): Observable<any> {
    return this.http
      .post(
        this.saleQuote,
        JSON.stringify(salesQuote),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.create(salesQuote));
      });
  }

  createFreight(salesOrderFreights: ISalesOrderFreight[]): Observable<any> {
    return this.http
      .post(
        this.saleQuoteFreightsSave,
        JSON.stringify(salesOrderFreights),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.createFreight(salesOrderFreights));
      });
  }

  createCharges(salesOrderCharges: ISalesOrderQuoteCharge[]): Observable<any> {
    return this.http
      .post(
        this.saleQuoteChargesSave,
        JSON.stringify(salesOrderCharges),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.createCharges(salesOrderCharges));
      });
  }

  saveCustomerQuotesApprovedEndPoint(data): Observable<any> {
    return this.http
      .post(
        this.saveCustomerQuotesApprovedEndPointUrl,
        data,
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.saveCustomerQuotesApprovedEndPoint(data));
      });
  }

  sentForInternalApproval(data) {
    return this.http.post<any>(`${this.configurations.baseUrl}/api/salesquote/soquoteapproval`, JSON.stringify(data), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.sentForInternalApproval(data));
      });
  }

  update(salesQuote: ISalesQuoteView): Observable<any> {
    let url: string = `${this.saleQuote}/${salesQuote.salesOrderQuote.salesOrderQuoteId}`;
    return this.http
      .put(url, JSON.stringify(salesQuote), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.create(salesQuote));
      });
  }

  search(
    salesQuoteSearchParameters
  ): Observable<any> {
    return this.http
      .post(
        this.searchSalesQuote,
        JSON.stringify(salesQuoteSearchParameters),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.search(salesQuoteSearchParameters)
        );
      });
  }

  globalSearch(
    salesQuoteSearchParameters: ISalesSearchParameters
  ): Observable<any> {
    return this.http
      .post(
        this.globalSearchSalesQuote,
        JSON.stringify(salesQuoteSearchParameters),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.globalSearch(salesQuoteSearchParameters)
        );
      });
  }

  delete(salesQuoteId: number): Observable<boolean> {
    let endpointUrl = `${this.saleQuote}/${salesQuoteId}`;
    return this.http
      .delete<boolean>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.delete(salesQuoteId));
      });
  }

  deleteSoqSetting(salesQuoteSettingId: number, updatedBy): Observable<boolean> {
    let endpointUrl = `${this.saleQuoteSettings}?settingsId=${salesQuoteSettingId}&updatedBy=${updatedBy}`;
    return this.http
      .delete<boolean>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.deleteSoqSetting(salesQuoteSettingId, updatedBy));
      });
  }

  deletePart(salesQuotePartId: number): Observable<boolean> {
    let endpointUrl = `${this.saleQuoteDeletePart}/${salesQuotePartId}`;
    return this.http
      .delete<boolean>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.deletePart(salesQuotePartId));
      });
  }

  deleteFrieght(frieghtId, userName): Observable<boolean> {
    let endpointUrl = `${this._deleteSalesOrderFrignt}/${frieghtId}?updatedBy=${userName}`;
    return this.http
      .delete<boolean>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.deleteFrieght(frieghtId, userName));
      });
  }

  deleteSOQcharge(chargeId, userName): Observable<boolean> {
    let endpointUrl = `${this._deleteSalesOrderCharge}/${chargeId}?updatedBy=${userName}`;
    return this.http
      .delete<boolean>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.deleteSOQcharge(chargeId, userName));
      });
  }

  getSalesQuote(salesQuoteId: number): Observable<any> {
    const URL = `${this.getSalesQuoteDetails}/${salesQuoteId}`;
    return this.http
      .get<ISalesQuote>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesQuote(salesQuoteId));
      });
  }

  getview(salesQuoteId: number): Observable<any> {
    const URL = `${this.getSalesQuoteViewDetails}/${salesQuoteId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getview(salesQuoteId));
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

  getCustomerQuotesList(salesQuoteId: number): Observable<any> {
    const URL = `${this.getCustomerQuotesListUrl}/${salesQuoteId}`;
    return this.http
      .get<ISalesQuote>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getCustomerQuotesList(salesQuoteId));
      });
  }

  initiateQuoteCopying(salesQuoteId: number): Observable<any> {
    const URL = `${this.getCopyEndpointUrl}/${salesQuoteId}`;
    return this.http
      .get(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.initiateQuoteCopying(salesQuoteId));
      });
  }

  verifySalesOrderConversionEndPoint(salesQuoteId: number): Observable<any> {
    const URL = `${this.getVerifyEndpointUrl}/${salesQuoteId}`;
    return this.http
      .get(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.verifySalesOrderConversionEndPoint(salesQuoteId));
      });
  }

  closeSalesOrderQuoteEndPoint(salesQuoteId: number, updatedBy: string): Observable<any> {
    const URL = `${this.getCloseEndointUrl}/${salesQuoteId}?updatedBy=${updatedBy}`;
    return this.http
      .put(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.closeSalesOrderQuoteEndPoint(salesQuoteId, updatedBy));
      });
  }

  convertfromquoteEndPoint(salesQuoteConversionCriteria: SalesOrderConversionCritera, currentEmployeeId: number): Observable<any> {
    const URL = `${this.getConvertfromquoteEndPoint}?currentEmployeeId=${currentEmployeeId}`;
    return this.http
      .post(URL, salesQuoteConversionCriteria, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.convertfromquoteEndPoint(salesQuoteConversionCriteria, currentEmployeeId));
      });
  }

  sendQuoteToCustomer(salesQuoteId: number) {
    const URL = `${this.getEmailQuoteEndointUrl}/${salesQuoteId}`;
    return this.http
      .post(URL, {}, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.sendQuoteToCustomer(salesQuoteId));
      });
  }

  //start SalesOrderQuoteDocument--nitin
  SalesOrderQuoteGeneralDocumentUploadEndpoint<T>(file: any, salesquoteId, moduleId, moduleName, uploadedBy, masterCompanyId): Observable<T> {
    const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    return this.http.post<T>(`${this._addSalesOrderQuoteFileUpload}?referenceId=${salesquoteId}&moduleId=${moduleId}&moduleName=${moduleName}&uploadedBy=${uploadedBy}&masterCompanyId=${masterCompanyId}`, file);
  }
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
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesQuoteDocumentAuditHistory(id));
      });
  }

  getSOQuoteSettingHistory(id) {
    return this.http.get<any>(`${this._geSaleQuoteSettingsHistory}/${id}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSOQuoteSettingHistory(id));
      });
  }

  saveSalesQuoteHeader<T>(param: any): Observable<any> {
    let body = JSON.stringify(param);
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
    return this.http.post(this._savequoteHeader, body, this.getRequestHeaders())
      .map((response: Response) => {
        return <any>response;
      }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getSalesQuoteFreights(id, isDeleted) {
    return this.http.get<any>(`${this._geSaleQuoteFreights}?SalesOrderQuoteId=${id}&isDeleted=${isDeleted}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesQuoteFreights(id, isDeleted));
      });
  }

  getSalesQuoteCharges(id, isDeleted) {
    return this.http.get<any>(`${this._geSaleQuoteCharges}?SalesOrderQuoteId=${id}&isDeleted=${isDeleted}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesQuoteCharges(id, isDeleted));
      });
  }

  getInternalApproversList(approvalTaskId, moduleAmount) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/approvalRule/approverslist?approvalTaskId=${approvalTaskId}&moduleAmount=${moduleAmount}`)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getInternalApproversList(approvalTaskId, moduleAmount));
      });
  }

  //end nitin
  getSOQFreightsHistory(id) {
    return this.http.get<any>(`${this.getFreightAudihistory}/?SalesOrderQuoteFreightId=${id}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSOQFreightsHistory(id));
      });
  }

  getSOQChargesHistory(id) {
    return this.http.get<any>(`${this.getChargesAudihistory}/${id}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSOQChargesHistory(id));
      });
  }

  getAllSOQEditID(salesOrderQuoteId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/${this.getAllSOQEditIDUrl}?salesOrderQuoteId=${salesOrderQuoteId}`)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAllSOQEditID(salesOrderQuoteId));
      });
  }

  saveSalesOrderQuoteAddress<T>(param: any): Observable<any> {
    let url = `${this.configurations.baseUrl}/api/SalesQuote/createsoqaddress`;
    let body = JSON.stringify(param);
    return this.http.post(url, body, this.getRequestHeaders())
      .map((response: Response) => {
        return <any>response;

      }).catch(error => {
        return this.handleErrorCommon(error, () => this.saveSalesOrderQuoteAddress<T>(param));
      });
  }

  approverslistbyTaskId(taskId, id) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/approvalrule/approverslistbyTaskId?approvalTaskId=${taskId}&id=${id}`)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.approverslistbyTaskId(taskId, id));
      });
  }

  deleteMultiplePart(salesOrderQuotePartIds: any) {
    return this.http
      .post(
        this.saleQuoteDeleteMultiplePart,
        JSON.stringify(salesOrderQuotePartIds),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.deleteMultiplePart(salesOrderQuotePartIds));
      });
  }

  getSalesQuoteParts(id, isDeleted) {
    return this.http.get<any>(`${this._geSaleQuoteParts}?SalesOrderQuoteId=${id}&isDeleted=${isDeleted}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSalesQuoteParts(id, isDeleted));
      });
  }

  GetSalesOrderQuoteSummarisedHistoryByPN(itemMasterId: number, isTwelveMonth: boolean) {
    return this.http.get(`${this.configurations.baseUrl}/api/SalesQuote/GetSalesOrderQuoteSummarisedHistoryByPN?ItemMasterId=${itemMasterId}&IsTwelveMonth=${isTwelveMonth}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetSalesOrderQuoteSummarisedHistoryByPN(itemMasterId, isTwelveMonth));
    });
  }
}