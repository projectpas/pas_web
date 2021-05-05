import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { EndpointFactory } from "./endpoint-factory.service";
import { ConfigurationService } from "./configuration.service";
import { environment } from "../../environments/environment";
import { ISpeedQuoteView } from "../models/sales/ISpeedQuoteView";
import { ISpeedQuote } from "../models/sales/ISpeedQuote.model";

@Injectable()
export class SpeedQuoteEndpointService extends EndpointFactory {
  private readonly getNewSpeedQuoteInstanceUrl: string = environment.baseUrl + "/api/speedquote/new";
  private readonly getSpeedQuoteSetting: string = environment.baseUrl + "/api/SOQuoteSettings/getlist";
  private readonly getSpeedQuoteDetails: string = environment.baseUrl + "/api/speedquote/get";
  private readonly saleQuote: string = environment.baseUrl + "/api/salesquote";
  
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
}