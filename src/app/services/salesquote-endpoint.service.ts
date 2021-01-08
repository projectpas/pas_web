
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
import { SalesOrder } from "../models/sales/SalesOrder.model";
import { SalesOrderView } from "../models/sales/SalesOrderView";
import { SalesOrderFreight } from "../models/sales/SalesOrderFreight";
import { ISalesOrderFreight } from "../models/sales/ISalesOrderFreight";
import { ISalesOrderQuoteCharge } from "../models/sales/ISalesOrderQuoteCharge";
import { SOQuoteMarginSummary } from "../models/sales/SoQuoteMarginSummary";
import {catchError} from 'rxjs/operators';
import { AnalysisComponent } from '../components/work-order/work-order-setup/work-order-summarizedview/components/analysis/analysis.component';
@Injectable()
export class SalesQuoteEndpointService extends EndpointFactory {
  private readonly getNewSalesQuoteInstanceUrl: string = "/api/salesquote/new";
  private readonly saleQuote: string = "/api/salesquote";
  private readonly saleQuoteSettings: string = "api/SOQuoteSettings/delete";
  private readonly soqMarginSummary: string = "/api/SalesQuote/create-quote-margin-data";
  private readonly getSoqMarginSummary: string = "/api/SalesQuote/get-sales-quote-margin-data";
  private readonly saleQuoteChargesSave: string = "/api/SalesQuote/createsalesorderquotecharges";
  private readonly saleQuoteFreightsSave: string = "/api/SalesQuote/createsalesorderquotefreight";
  private readonly _deleteSalesOrderFrignt: string = "/api/salesquote/deletesalesorderquotefreight";
  private readonly _deleteSalesOrderCharge: string = "/api/SalesQuote/deletesalesorderquotecharge";
  private readonly saveCustomerQuotesApprovedEndPointUrl: string = "/api/SalesQuote/soquoteapproval"
  // private readonly searchSalesQuote: string = "/api/salesquote/search";
  private readonly searchSalesQuote: string = "/api/salesquote/salesquotesearch";
  private readonly globalSearchSalesQuote: string = "/api/salesquote/salesquoteglobalsearch";
  private readonly getSalesQuoteDetails: string = "/api/salesquote/get";
  private readonly getSalesQuoteViewDetails: string = "/api/salesquote/getview";
  private readonly getSalesQuoteTotalDetails: string = "/api/salesquote/togetquoteheadermargindetails";
  private readonly getCopyEndpointUrl: string = "/api/salesquote/copy"
  private readonly getVerifyEndpointUrl: string = "/api/salesquote/verify"
  // private readonly getCustomerQuotesListUrl: string = "/api/salesquote/customerquotelistbycustomerid"
  private readonly getCustomerQuotesListUrl: string = "/api/salesquote/soquoteapprovallist"
  // customerquotelistbycustomeridandsalesquoteid/3?salesQuoteId=22
  private readonly getCloseEndointUrl: string = "/api/salesquote/close"
  private readonly getEmailQuoteEndointUrl: string = "/api/salesquote/soqsendmail"
  private readonly getConvertfromquoteEndPoint: string = "/api/salesorder/convertfromquote"
  private readonly saleQuoteDeletePart: string = "/api/salesquote/deletepart";

  //*Start savesarvice end point creation implementation --nitin
  private readonly _addSalesOrderQuoteFileUpload: string = "/api/salesquote/SalesQuoteGeneralDocumentUpload";
  private readonly _addDocumentDetails: string = "/api/salesquote/SalesQuoteDocumentUpload";
  private readonly _getsalesquoteDocslist: string = "/api/salesquote/getSalesQuoteDocumentDetailList";
  private readonly _getsalesquoteDocumentAttachmentslist: string = "/api/FileUpload/getattachmentdetails";
  private readonly _geSaleQuoteDocumentHistory: string = "/api/salesquote/getSaleQuoteDocumentAudit";
  private readonly _geSaleQuoteFreights: string = "api/SalesQuote/salesorderquotefreightlist";
  private readonly _geSaleQuoteCharges: string = "api/SalesQuote/gesalesorderquotechargeslist";
  private readonly _savequoteHeader: string = "/api/salesquote/saveSalesQuoteHeader";
  private readonly getAllSalesOrderTypesURL: string = "/api/WorkOrder/workOrderTypes";
  private readonly saveSOQSetting: string = "/api/SOQuoteSettings/save";
  private readonly getSalesOrderQuoteSetting: string = "/api/SOQuoteSettings/getlist";
  private readonly _geSaleQuoteSettingsHistory: string = "api/SOQuoteSettings/getauditdatabyid";
  private readonly getSalesOrderQuoteAnalysis: string = "/api/SalesQuote/togetsoquoteanalysis";
  private readonly getFreightAudihistory:string='api/SalesQuote/quote-freight-history';
  private readonly getChargesAudihistory:string='api/salesquote/quote-charges-history';
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
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getSOQHistory(salesOrderQuoteId));
      }));
  }

  getSOQPartHistory(salesOrderQuotePartId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/SalesQuote/getsalequoteparthistory/${salesOrderQuotePartId}`)
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getSOQPartHistory(salesOrderQuotePartId));
      }));
  }

  getNewSalesQuoteInstance<ISalesQuote>(
    customerId: number
  ): Observable<ISalesQuote> {
    const URL = `${this.getNewSalesQuoteInstanceUrl}/${customerId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getNewSalesQuoteInstance(customerId)
        );
      }));
  }

  createSOQMarginSummary(marginSummary: SOQuoteMarginSummary) {
    return this.http
      .post(
        this.soqMarginSummary,
        JSON.stringify(marginSummary),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () => this.createSOQMarginSummary(marginSummary));
      }));
  }

  getAllSalesOrderTypes<T>(): Observable<T> {
    let endPointUrl = this.getAllSalesOrderTypesURL;

    return this.http.get<any>(endPointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getAllSalesOrderTypes());
      }));
  }

  getAllSalesOrderQuoteAnalysis<T>(id): Observable<T> {
    let endPointUrl = `${this.getSalesOrderQuoteAnalysis}/${id}`;;

    return this.http.get<any>(endPointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getAllSalesOrderQuoteAnalysis(id));
      }));
  }

  getAllSalesOrderQuoteSettings<T>(): Observable<T> {
    let endPointUrl = this.getSalesOrderQuoteSetting;

    return this.http.get<any>(endPointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getAllSalesOrderQuoteSettings());
      }));
  }

  // saveOrUpdateSOQuoteSettings(data) {
  //   return this.http.post<any>(`${this.configurations.baseUrl}/api/SOQuoteSettings/save`, JSON.stringify(data), this.getRequestHeaders());
  // }

  saveOrUpdateSOQuoteSettings(data) {
    return this.http
      .post(
        this.saveSOQSetting,
        JSON.stringify(data),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () => this.saveOrUpdateSOQuoteSettings(data));
      }));
  }

  getSOQMarginSummary(salesOrderQuoteId: number): Observable<SOQuoteMarginSummary> {
    const URL = `${this.getSoqMarginSummary}/${salesOrderQuoteId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getSOQMarginSummary(salesOrderQuoteId));
      }));
  }

  create(salesQuote: ISalesQuoteView): Observable<ISalesOrderQuote> {
    return this.http
      .post<any>(
        this.saleQuote,
        JSON.stringify(salesQuote),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleErrorCommon(error, () => this.create(salesQuote));
      }));
  }

  createFreight(salesOrderFreights: ISalesOrderFreight[]): Observable<ISalesOrderQuote> {
    return this.http
      .post<any>(
        this.saleQuoteFreightsSave,
        JSON.stringify(salesOrderFreights),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () => this.createFreight(salesOrderFreights));
      }));
  }

  createCharges(salesOrderCharges: ISalesOrderQuoteCharge[]): Observable<ISalesOrderQuote> {
    return this.http
      .post<any>(
        this.saleQuoteChargesSave,
        JSON.stringify(salesOrderCharges),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () => this.createCharges(salesOrderCharges));
      }));
  }

  saveCustomerQuotesApprovedEndPoint(data): Observable<any> {
    return this.http
      .post<any>(
        this.saveCustomerQuotesApprovedEndPointUrl,
        data,
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () => this.saveCustomerQuotesApprovedEndPoint(data));
      }));
  }
  sentForInternalApproval(data) {
    return this.http.post<any>(`${this.configurations.baseUrl}/api/salesquote/soquoteapproval`, JSON.stringify(data), this.getRequestHeaders());
  }
  update(salesQuote: ISalesQuoteView): Observable<ISalesOrderQuote> {
    let url: string = `${this.saleQuote}/${salesQuote.salesOrderQuote.salesOrderQuoteId}`;
    return this.http
      .put<any>(url, JSON.stringify(salesQuote), this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.create(salesQuote));
      }));
  }

  search(
    salesQuoteSearchParameters
  ): Observable<ISalesQuoteListView> {
    return this.http
      .post<any>(
        this.searchSalesQuote,
        JSON.stringify(salesQuoteSearchParameters),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.search(salesQuoteSearchParameters)
        );
      }));
  }

  globalSearch(
    salesQuoteSearchParameters: ISalesSearchParameters
  ): Observable<ISalesQuoteListView> {
    return this.http
      .post<any>(
        this.globalSearchSalesQuote,
        JSON.stringify(salesQuoteSearchParameters),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.globalSearch(salesQuoteSearchParameters)
        );
      }));
  }

  delete(salesQuoteId: number): Observable<boolean> {
    let endpointUrl = `${this.saleQuote}/${salesQuoteId}`;
    return this.http
      .delete<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.delete(salesQuoteId));
      }));
  }

  deleteSoqSetting(salesQuoteSettingId: number, updatedBy): Observable<boolean> {
    let endpointUrl = `${this.saleQuoteSettings}?settingsId=${salesQuoteSettingId}&updatedBy=${updatedBy}`;
    return this.http
      .delete<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.deleteSoqSetting(salesQuoteSettingId, updatedBy));
      }));
  }

  deletePart(salesQuotePartId: number): Observable<boolean> {
    let endpointUrl = `${this.saleQuoteDeletePart}/${salesQuotePartId}`;
    return this.http
      .delete<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.deletePart(salesQuotePartId));
      }));
  }

  deleteFrieght(frieghtId, userName): Observable<boolean> {
    let endpointUrl = `${this._deleteSalesOrderFrignt}/${frieghtId}?updatedBy=${userName}`;
    return this.http
      .delete<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.deleteFrieght(frieghtId, userName));
      }));
  }

  deleteSOQcharge(chargeId, userName): Observable<boolean> {
    let endpointUrl = `${this._deleteSalesOrderCharge}/${chargeId}?updatedBy=${userName}`;
    return this.http
      .delete<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.deleteSOQcharge(chargeId, userName));
      }));
  }

  getSalesQuote(salesQuoteId: number): Observable<ISalesQuoteView> {
    const URL = `${this.getSalesQuoteDetails}/${salesQuoteId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getSalesQuote(salesQuoteId));
      }));
  }
  getview(salesQuoteId: number): Observable<any> {
    const URL = `${this.getSalesQuoteViewDetails}/${salesQuoteId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getview(salesQuoteId));
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
  getCustomerQuotesList(salesQuoteId: number): Observable<ISalesQuoteView> {

    const URL = `${this.getCustomerQuotesListUrl}/${salesQuoteId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getCustomerQuotesList(salesQuoteId));
      }));
  }
  initiateQuoteCopying(salesQuoteId: number): Observable<ISalesQuoteView> {
    const URL = `${this.getCopyEndpointUrl}/${salesQuoteId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.initiateQuoteCopying(salesQuoteId));
      }));
  }

  verifySalesOrderConversionEndPoint(salesQuoteId: number): Observable<VerifySalesQuoteModel> {
    const URL = `${this.getVerifyEndpointUrl}/${salesQuoteId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.verifySalesOrderConversionEndPoint(salesQuoteId));
      }));
  }

  closeSalesOrderQuoteEndPoint(salesQuoteId: number): Observable<ISalesQuoteView> {
    const URL = `${this.getCloseEndointUrl}/${salesQuoteId}`;
    return this.http
      .put<any>(URL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.closeSalesOrderQuoteEndPoint(salesQuoteId));
      }));
  }
  convertfromquoteEndPoint(salesQuoteConversionCriteria: SalesOrderConversionCritera): Observable<SalesOrderView> {
    const URL = `${this.getConvertfromquoteEndPoint}`;
    return this.http
      .post<any>(URL, salesQuoteConversionCriteria, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.convertfromquoteEndPoint(salesQuoteConversionCriteria));
      }));
  }

  sendQuoteToCustomer(salesQuoteId: number) {
    const URL = `${this.getEmailQuoteEndointUrl}/${salesQuoteId}`;
    return this.http
      .post(URL, {}, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.sendQuoteToCustomer(salesQuoteId));
      }));
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
  }
  getSOQuoteSettingHistory(id) {
    return this.http.get<any>(`${this._geSaleQuoteSettingsHistory}/${id}`, this.getRequestHeaders())
  }
  saveSalesQuoteHeader<T>(param: any): Observable<any> {
    let body = JSON.stringify(param);
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
    return this.http.post<any>(this._savequoteHeader, body, this.getRequestHeaders())
      .map((response: Response) => {
        return <any>response;

      }).pipe(catchError((error: any) => observableThrowError(error.json().error || 'Server error')));
  }
  getSalesQuoteFreights(id) {
    return this.http.get<any>(`${this._geSaleQuoteFreights}?SalesOrderQuoteId=${id}`, this.getRequestHeaders())
  }
  getSalesQuoteCharges(id) {
    return this.http.get<any>(`${this._geSaleQuoteCharges}?SalesOrderQuoteId=${id}`, this.getRequestHeaders())
    }

    getInternalApproversList(approvalTaskId, moduleAmount) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/approvalRule/approverslist?approvalTaskId=${approvalTaskId}&moduleAmount=${moduleAmount}`);
    }
  //end nitin
  getSOQFreightsHistory(id) {
    return this.http.get<any>(`${this.getFreightAudihistory}/?SalesOrderQuoteFreightId=${id}`, this.getRequestHeaders())
  }
  getSOQChargesHistory(id) {
    return this.http.get<any>(`${this.getChargesAudihistory}/${id}`, this.getRequestHeaders())
  }
}
