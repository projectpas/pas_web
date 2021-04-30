import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "./endpoint-factory.service";
import { ConfigurationService } from "./configuration.service";
import { IExchangeQuote } from "../models/exchange/IExchangeQuote.model";
import { IExchangeQuoteSearchParameters } from "../models/exchange/IExchangeQuoteSearchParameters";
import { environment } from 'src/environments/environment';
import { IExchangeQuoteView } from "../models/exchange/IExchangeQuoteView";
import { IExchangeOrderQuote } from "../models/exchange/IExchangeOrderQuote";
import{ExchangeQUoteMarginSummary} from '../models/exchange/ExchangeQUoteMarginSummary';
import { IExchangeQuoteCharge } from '../models/exchange/IExchangeQuoteCharge';
import { IExchangeQuoteFreight } from '../models/exchange/IExchangeQuoteFreight';
@Injectable()
export class ExchangeQuoteEndpointService extends EndpointFactory {
    private readonly getNewExchangeQuoteInstanceUrl: string = environment.baseUrl + "/api/exchangequote/new";
    private readonly exchangequote: string = environment.baseUrl + "/api/exchangequote";
    private readonly searchExchangeQuote: string = environment.baseUrl + "/api/exchangequote/exchangequotesearch";
    private readonly getExchangeQuoteDetails: string = environment.baseUrl + "/api/exchangequote/get";
    private readonly getExchngeQuoteeSetting: string = environment.baseUrl + "/api/exchangequote/getExchangeQuoteSettinglist";
    private readonly getExchangeQuoteMarginSummarydetails: string = environment.baseUrl + "/api/exchangequote/get-exchange-quote-margin-data";
    private readonly exchangeQuoteqMarginSummary: string = environment.baseUrl + "/api/exchangequote/create-exchange-quote-margin-data";
    private readonly getExchangeQuoteAnalysis: string = environment.baseUrl + "/api/exchangequote/togetexchangequoteanalysis";
    private readonly getCustomerQuotesListUrl: string = environment.baseUrl + "/api/exchangequote/exchangequoteapprovallist"
    private readonly _getExchangeQuoteCharges: string = environment.baseUrl + "/api/exchangequote/getexchangequotechargeslist";
    private readonly exchangeQuoteChargesSave: string = environment.baseUrl + "/api/exchangequote/createexchangequotecharges";
    private readonly _geExchangeQuoteFreights: string = environment.baseUrl + "/api/exchangequote/exchangequotefreightlist";
    private readonly exchangeQuoteFreightsSave: string = environment.baseUrl + "/api/exchangequote/createexchangequotefreight";
    constructor(
      http: HttpClient,
      configurations: ConfigurationService,
      injector: Injector
    ) {
      super(http, configurations, injector);
    }

    getNewExchangeQuoteInstance<IExchangeQuote>(
      customerId: number
    ): Observable<IExchangeQuote> {
      const URL = `${this.getNewExchangeQuoteInstanceUrl}/${customerId}`;
      return this.http
        .get<IExchangeQuote>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () =>
            this.getNewExchangeQuoteInstance(customerId)
          );
        });
    }

    create(exchangeQuote: IExchangeQuoteView): Observable<IExchangeOrderQuote> {
      return this.http
        .post(
          this.exchangequote,
          JSON.stringify(exchangeQuote),
          this.getRequestHeaders()
        )
        .catch(error => {
          return this.handleErrorCommon(error, () => this.create(exchangeQuote));
        });
    }

    search(exchangeQuoteSearchParameters: IExchangeQuoteSearchParameters): Observable<any> {
      let params = JSON.stringify(exchangeQuoteSearchParameters);
      return this.http.post(this.searchExchangeQuote, params, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.search(exchangeQuoteSearchParameters));
        });
    }

    getExchangeQuote(exchangeQuoteId: number): Observable<any> {
      const URL = `${this.getExchangeQuoteDetails}/${exchangeQuoteId}`;
      return this.http
        .get<IExchangeQuote>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getExchangeQuote(exchangeQuoteId));
        });
    }

    getAllExchangeQuoteSettings<T>(): Observable<T> {
      let endPointUrl = this.getExchngeQuoteeSetting;
      return this.http.get<T>(endPointUrl, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getAllExchangeQuoteSettings());
        });
    }

    update(exchangeQuote: IExchangeQuoteView): Observable<IExchangeQuote> {
      let url: string = `${this.exchangequote}/${exchangeQuote.exchangeOrderQuote.exchangeQuoteId}`;
      return this.http
        .put(url, JSON.stringify(exchangeQuote), this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.create(exchangeQuote));
        });
    }

    approverslistbyTaskId(taskId, id) {
      return this.http.get<any>(`${this.configurations.baseUrl}/api/approvalrule/approverslistbyTaskId?approvalTaskId=${taskId}&id=${id}`)
        .catch(error => {
          return this.handleErrorCommon(error, () => this.approverslistbyTaskId(taskId, id));
        });
    }

    getExchangeQuoteMarginSummary(exchangeQuoteId: number): Observable<ExchangeQUoteMarginSummary> {
      const URL = `${this.getExchangeQuoteMarginSummarydetails}/${exchangeQuoteId}`;
      return this.http
        .get<ExchangeQUoteMarginSummary>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getExchangeQuoteMarginSummary(exchangeQuoteId));
        });
    }

    createExchangeQuoteMarginSummary(marginSummary: ExchangeQUoteMarginSummary) {
      return this.http
        .post(
          this.exchangeQuoteqMarginSummary,
          JSON.stringify(marginSummary),
          this.getRequestHeaders()
        )
        .catch(error => {
          return this.handleErrorCommon(error, () => this.createExchangeQuoteMarginSummary(marginSummary));
        });
    }

    getAllExchangeQuoteAnalysis<T>(id): Observable<T> {
      let endPointUrl = `${this.getExchangeQuoteAnalysis}/${id}`;;
  
      return this.http.get<T>(endPointUrl, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getAllExchangeQuoteAnalysis(id));
        });
    }
    getCustomerQuotesList(exchangeQuoteId: number): Observable<any> {
      const URL = `${this.getCustomerQuotesListUrl}/${exchangeQuoteId}`;
      return this.http
        .get<IExchangeQuote>(URL, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getCustomerQuotesList(exchangeQuoteId));
        });
    }
    sentForInternalApproval(data) {
      return this.http.post<any>(`${this.configurations.baseUrl}/api/exchangequote/exchangequoteapproval`, JSON.stringify(data), this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.sentForInternalApproval(data));
        });
    }
    getExchangeQuoteCharges(id, isDeleted) {
      return this.http.get<any>(`${this._getExchangeQuoteCharges}?ExchangeQuoteId=${id}&isDeleted=${isDeleted}`, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getExchangeQuoteCharges(id, isDeleted));
        });
    }
    createExchangeQuoteCharge(exchangeQuoteCharges: IExchangeQuoteCharge[]): Observable<any> {
      return this.http
        .post(
          this.exchangeQuoteChargesSave,
          JSON.stringify(exchangeQuoteCharges),
          this.getRequestHeaders()
        )
        .catch(error => {
          return this.handleErrorCommon(error, () => this.createExchangeQuoteCharge(exchangeQuoteCharges));
        });
    }

    getExchangeQuoteFreights(id, isDeleted) {
      return this.http.get<any>(`${this._geExchangeQuoteFreights}?ExchangeQuoteId=${id}&isDeleted=${isDeleted}`, this.getRequestHeaders())
        .catch(error => {
          return this.handleErrorCommon(error, () => this.getExchangeQuoteFreights(id, isDeleted));
        });
    }
    createFreight(sexchangeQuoteFreights: IExchangeQuoteFreight[]): Observable<any> {
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
}  