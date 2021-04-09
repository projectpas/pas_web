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
@Injectable()
export class ExchangeQuoteEndpointService extends EndpointFactory {
    private readonly getNewExchangeQuoteInstanceUrl: string = environment.baseUrl + "/api/exchangequote/new";
    private readonly exchangequote: string = environment.baseUrl + "/api/exchangequote";
    private readonly searchExchangeQuote: string = environment.baseUrl + "/api/exchangequote/exchangequotesearch";
    private readonly getExchangeQuoteDetails: string = environment.baseUrl + "/api/exchangequote/get";
    private readonly getExchngeQuoteeSetting: string = environment.baseUrl + "/api/exchangequote/getExchangeQuoteSettinglist";
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
}  