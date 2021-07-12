import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { EndpointFactory } from "./endpoint-factory.service";
import { ConfigurationService } from "./configuration.service";
import { environment } from "../../environments/environment";
import { ISpeedQuoteView } from "../models/sales/ISpeedQuoteView";
import { ISpeedQuote } from "../models/sales/ISpeedQuote.model";
import { SpeedQuoteMarginSummary } from "../models/sales/SpeedQuoteMarginSummary";
import { SpeedQuotePrintCritera } from "../components/sales/speed-quote/models/speed-quote-print-criteria";
@Injectable()
export class SpeedQuoteEndpointService extends EndpointFactory {
  private readonly getNewSpeedQuoteInstanceUrl: string = environment.baseUrl + "/api/speedquote/new";
  private readonly getSpeedQuoteSetting: string = environment.baseUrl + "/api/speedquote/getlist";
  private readonly getSpeedQuoteDetails: string = environment.baseUrl + "/api/speedquote/get";
  private readonly saleQuote: string = environment.baseUrl + "/api/speedquote";
  private readonly soqMarginSummary: string = environment.baseUrl + "/api/speedquote/create-quote-margin-data";
  private readonly getEmailQuoteEndointUrl: string = environment.baseUrl + "/api/speedquote/soqsendmail";
  private readonly getCopyEndpointUrl: string = environment.baseUrl + "/api/speedquote/copy";
  private readonly getCloseEndointUrl: string = environment.baseUrl + "/api/speedquote/close";
  private readonly getItemMasterDataConditionWiseURL : string = environment.baseUrl + "/api/itemMaster/getItemMasterDataConditionWise";
  private readonly searchSpeedQuote: string = environment.baseUrl + "/api/speedquote/speedquotesearch";
  private readonly createexclusionpart: string = environment.baseUrl + "/api/speedquote/createexclusionpart";
  private readonly _getExclusionPartList: string = environment.baseUrl + "/api/speedquote/getexclusionpartlist";
  private readonly getSpeedQuoteViewDetails: string = environment.baseUrl + "/api/speedquote/getview";
  private readonly speedQuoteDeletePart: string = environment.baseUrl + "/api/speedquote/deletepart";
  private readonly getSpeedQuotePartDateHistory: string = environment.baseUrl + "/api/speedquote/getSpeedQuotePartHistory";
  private readonly getSpeedQuotePrintViewDetails: string = environment.baseUrl + "/api/speedquote/getprintview";
  private readonly getSpeedQuoteExclusionPrintViewDetails: string = environment.baseUrl + "/api/speedquote/getexclusionprintview";
  private readonly sendSpeedQuoteEmailURL: string = environment.baseUrl + "/api/speedquote/sendspeedquoteemail"
  private readonly exclusionDeletePart: string = environment.baseUrl + "/api/speedquote/deleteexclusionpart";
  private readonly getSQsendemailpdfpreview: string = environment.baseUrl + "/api/speedquote/sqsendmailpdfpreview";
  private readonly getitemMasterUnitPriceEndointUrl: string = environment.baseUrl + "/api/speedquote/getitemmasterunitprice";
  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    injector: Injector
  ) {
    super(http, configurations, injector);
  }

  getNewSpeedQuoteInstance<ISpeedQuote>(
    customerId: number
  ): Observable<ISpeedQuote> {
    const URL = `${this.getNewSpeedQuoteInstanceUrl}/${customerId}`;
    return this.http
      .get<ISpeedQuote>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getNewSpeedQuoteInstance(customerId)
        );
      });
  }

  getSpeedQuote(speedQuoteId: number): Observable<any> {
    const URL = `${this.getSpeedQuoteDetails}/${speedQuoteId}`;
    return this.http
      .get<ISpeedQuote>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSpeedQuote(speedQuoteId));
      });
  }

  createSpeedQuoteMarginSummary(marginSummary: SpeedQuoteMarginSummary) {
    return this.http
      .post(
        this.soqMarginSummary,
        JSON.stringify(marginSummary),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.createSpeedQuoteMarginSummary(marginSummary));
      });
  }

  getAllSpeedQuoteSettings<T>(masterCompanyId): Observable<T> {
    let endPointUrl = `${this.getSpeedQuoteSetting}?masterCompanyId=${masterCompanyId}`;
    return this.http.get<T>(endPointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAllSpeedQuoteSettings(masterCompanyId));
      });
  }

  create(salesQuote: ISpeedQuoteView): Observable<any> {
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

  update(salesQuote: ISpeedQuoteView): Observable<any> {
    let url: string = `${this.saleQuote}/${salesQuote.speedQuote.speedQuoteId}`;
    return this.http
      .put(url, JSON.stringify(salesQuote), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.create(salesQuote));
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

  initiateQuoteCopying(speedQuoteId: number): Observable<any> {
    const URL = `${this.getCopyEndpointUrl}/${speedQuoteId}`;
    return this.http
      .get(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.initiateQuoteCopying(speedQuoteId));
      });
  }

  closeSpeedQuoteEndPoint(salesQuoteId: number, updatedBy: string): Observable<any> {
    const URL = `${this.getCloseEndointUrl}/${salesQuoteId}?updatedBy=${updatedBy}`;
    return this.http
      .put(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.closeSpeedQuoteEndPoint(salesQuoteId, updatedBy));
      });
  }

  getItemMasterDataConditionWise(itemMasterId: number,mastercompanyid:number): Observable<any> {
    const URL = `${this.getItemMasterDataConditionWiseURL}/${itemMasterId}?mastercompanyid=${mastercompanyid}`;
    return this.http
      .get(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getItemMasterDataConditionWise(itemMasterId,mastercompanyid));
      });
  }
  search(
    speedQuoteSearchParameters
  ): Observable<any> {
    return this.http
      .post(
        this.searchSpeedQuote,
        JSON.stringify(speedQuoteSearchParameters),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.search(speedQuoteSearchParameters)
        );
      });
  }

  saveExclusionPart<T>(param: any): Observable<any> {
    let body = JSON.stringify(param);
    return this.http.post(this.createexclusionpart, body, this.getRequestHeaders())
      .map((response: Response) => {
        return <any>response;

      }).catch(error => {
        return this.handleErrorCommon(error, () => this.saveExclusionPart<T>(param));
      });
  }
  getExclusionList(id) {
    return this.http.get<any>(`${this._getExclusionPartList}?SpeedQuoteId=${id}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getExclusionList(id));
      });
  }
  delete(speedQuoteId: number): Observable<boolean> {
    let endpointUrl = `${this.saleQuote}/${speedQuoteId}`;
    return this.http
      .delete<boolean>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.delete(speedQuoteId));
      });
  }
  getSpeedQuoteHistory(speedQuoteId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/speedquote/getSpeedQuoteHistory/?speedQuoteId=${speedQuoteId}`)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSpeedQuoteHistory(speedQuoteId));
      });
  }
  getview(speedQuoteId: number): Observable<any> {
    const URL = `${this.getSpeedQuoteViewDetails}/${speedQuoteId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getview(speedQuoteId));
      });
  }
  deletePart(speedQuotePartId: number): Observable<boolean> {
    let endpointUrl = `${this.speedQuoteDeletePart}/${speedQuotePartId}`;
    return this.http
      .delete<boolean>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.deletePart(speedQuotePartId));
      });
  }
  getSpeedQuotePartHistory(speedQuotePartId) {
    const URL = `${this.getSpeedQuotePartDateHistory}/${speedQuotePartId}`;
    return this.http.get<any>(URL)
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getSpeedQuotePartHistory(speedQuotePartId));
      });
  }
  getPrintview(speedQuoteId: number): Observable<any> {
    const URL = `${this.getSpeedQuotePrintViewDetails}/${speedQuoteId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPrintview(speedQuoteId));
      });
  }
  getExclusionPrintview(speedQuoteId: number): Observable<any> {
    const URL = `${this.getSpeedQuoteExclusionPrintViewDetails}/${speedQuoteId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getExclusionPrintview(speedQuoteId));
      });
  }
  sendSppedQuoteEmail(speedQuotePrintCritera: SpeedQuotePrintCritera): Observable<any> {
    const URL = `${this.sendSpeedQuoteEmailURL}`;
    return this.http
      .post(URL, speedQuotePrintCritera, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.sendSppedQuoteEmail(speedQuotePrintCritera));
      });
  }
  deleteExclusion(exclusionPartId: number): Observable<boolean> {
    let endpointUrl = `${this.exclusionDeletePart}/${exclusionPartId}`;
    return this.http
      .delete<boolean>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.deleteExclusion(exclusionPartId));
      });
  }
  getSQsendmailpdfpreview(speedQuoteId: number): Observable<any> {
    const URL = `${this.getSQsendemailpdfpreview}/${speedQuoteId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getExclusionPrintview(speedQuoteId));
      });
  }
  getItemMasterUnitPrice(itemMasterId: number, conditionId: number): Observable<any> {
    const URL = `${this.getitemMasterUnitPriceEndointUrl}/${itemMasterId}?conditionId=${conditionId}`;
    return this.http
      .get<any>(URL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getItemMasterUnitPrice(itemMasterId, conditionId));
      });
  }
}