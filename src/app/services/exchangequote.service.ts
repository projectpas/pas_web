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
import { ExchangeQuote } from "../models/exchange/ExchangeQuote.model";
import { IPartJson } from "../components/sales/shared/models/ipart-json";
import { PartDetail } from "../components/sales/shared/models/part-detail";
import { ItemMasterSearchQuery } from "../components/sales/quotes/models/item-master-search-query";
export type RolesChangedEventArg = {
  roles: Role[] | string[];
  operation: RolesChangedOperation;
};

@Injectable({
  providedIn: 'root'
})
export class ExchangequoteService {

exchangeOrderQuote: IExchangeOrderQuote;
parts: IPartJson[];
selectedParts: PartDetail[];
activeStep = new Subject();
query: ItemMasterSearchQuery;

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

resetExchangeQuote() {
  // this.approvers = [];
  // this.initializeApprovals();
  this.selectedParts = [];
  this.exchangeOrderQuote = new ExchangeQuote();
}

getExchangeQuoteInstance() {
  return Observable.create(observer => {
    observer.next(this.exchangeOrderQuote);
    observer.complete();
  });
}

getExchangeQuote(exchangeQuoteId: number): Observable<IExchangeQuoteView[]> {
  return Observable.forkJoin(
    this.exchangeQuoteEndpointService.getExchangeQuote(exchangeQuoteId)
  );
}

resetSearchPart() {
  this.parts = [];
  this.query = new ItemMasterSearchQuery();
  this.query.partSearchParamters.quantityAlreadyQuoted = 0;
}

getSearchPartResult() {
  return Observable.create(observer => {
    observer.next(this.parts);
    observer.complete();
  });
}

getSearchPartObject() {
  return Observable.create(observer => {
    observer.next(this.query);
    observer.complete();
  });
}

updateSearchPartResult(parts) {
  this.parts = parts;
}

updateSearchPartObject(query) {
  this.query = query;
}

getSelectedParts() {
  return Observable.create(observer => {
    observer.next(this.selectedParts);
    observer.complete();
  });
}

getAllExchangeQuoteSettings() {
  return this.exchangeQuoteEndpointService.getAllExchangeQuoteSettings();
}

}
