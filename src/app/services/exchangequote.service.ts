import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Role } from "../models/role.model";
import { ExchangeQuoteEndpointService } from "./exchangequote-endpoint.service";
import { IExchangeQuote } from "../models/exchange/IExchangeQuote.model";
import { IExchangeQuoteView } from "../models/exchange/IExchangeQuoteView";
import { IExchangeOrderQuote } from "../models/exchange/IExchangeOrderQuote";
import { BehaviorSubject } from "rxjs";
import { formatStringToNumber } from "../generic/autocomplete";
export type RolesChangedOperation = "add" | "delete" | "modify";
import { IExchangeQuoteSearchParameters } from "../models/exchange/IExchangeQuoteSearchParameters";
import { IExchangeQuoteListView } from "../models/exchange/IExchangeQuoteListView";
export type RolesChangedEventArg = {
  roles: Role[] | string[];
  operation: RolesChangedOperation;
};

@Injectable({
  providedIn: 'root'
})
export class ExchangequoteService {

  exchangeOrderQuote: IExchangeOrderQuote;

constructor(private exchangeQuoteEndpointService: ExchangeQuoteEndpointService) { }

getNewExchangeQuoteInstance(customerId: number) {
  return Observable.forkJoin(
    this.exchangeQuoteEndpointService.getNewExchangeQuoteInstance<IExchangeQuote>(
      customerId
    )
  );
}

create(exchangeQuote: IExchangeQuoteView): Observable<IExchangeOrderQuote[]> {
  return Observable.forkJoin(
    this.exchangeQuoteEndpointService.create(exchangeQuote)
  );
}

search(
  exchangeQuoteSearchParameters: IExchangeQuoteSearchParameters
): Observable<IExchangeQuoteListView[]> {
  return Observable.forkJoin(
    this.exchangeQuoteEndpointService.search(exchangeQuoteSearchParameters)
  );
}

}
