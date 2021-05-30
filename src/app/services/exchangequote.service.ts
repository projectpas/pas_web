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
//import { PartDetail } from "../components/sales/shared/models/part-detail";
import { PartDetail } from "../components/exchange-quote/shared/components/models/part-detail";
import { ItemMasterSearchQuery } from "../components/sales/quotes/models/item-master-search-query";
import { ExchangeQuotePart } from '../models/exchange/ExchangeQuotePart';
import { ExchangeQUoteMarginSummary } from '../models/exchange/ExchangeQUoteMarginSummary';
import { IExchangeQuoteCharge } from '../models/exchange/IExchangeQuoteCharge';
import { IExchangeQuoteFreight } from '../models/exchange/IExchangeQuoteFreight';
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
  totalFreights = 0;
  totalCharges = 0;
  totalcost=0;
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

  getAllExchangeQuoteSettings(masterCompanyId) {
    return this.exchangeQuoteEndpointService.getAllExchangeQuoteSettings(masterCompanyId);
  }

  marshalExchangeQuotePartToSave(selectedPart, userName) {
    // this.checkNullValuesList.forEach(key => {
    //   if (!selectedPart[key]) {
    //     selectedPart[key] = 0;
    //   }
    // })
    let partNumberObj = new ExchangeQuotePart();
    partNumberObj.exchangeQuotePartId = selectedPart.exchangeQuotePartId;
    partNumberObj.stockLineId = selectedPart.stockLineId;
    partNumberObj.stockLineNumber = selectedPart.stockLineNumber;
    partNumberObj.customerRequestDate = selectedPart.customerRequestDate.toDateString();
    partNumberObj.promisedDate = selectedPart.promisedDate.toDateString();
    partNumberObj.estimatedShipDate = selectedPart.estimatedShipDate.toDateString();
    //partNumberObj.priorityId = selectedPart.priorityId;
    partNumberObj.itemMasterId = selectedPart.itemMasterId;
    partNumberObj.fxRate = selectedPart.fixRate;
    partNumberObj.qtyQuoted = selectedPart.quantityToBeQuoted ? formatStringToNumber(selectedPart.quantityToBeQuoted) : 0;
    partNumberObj.qtyRequested = selectedPart.quantityRequested ? formatStringToNumber(selectedPart.quantityRequested) : 0;
    partNumberObj.unitSalePrice = selectedPart.salesPricePerUnit;
    partNumberObj.salesBeforeDiscount = formatStringToNumber(selectedPart.salesPriceExtended);
    partNumberObj.discount = selectedPart.discount ? Number(selectedPart.discount) : 0;
    partNumberObj.discountAmount = selectedPart.salesDiscountPerUnit;
    partNumberObj.netSales = formatStringToNumber(selectedPart.netSalesPriceExtended);
    partNumberObj.masterCompanyId = selectedPart.masterCompanyId;
    partNumberObj.taxType = selectedPart.taxType;
    partNumberObj.taxAmount = selectedPart.taxAmount;
    partNumberObj.taxPercentage = selectedPart.taxPercentage;
    if (!selectedPart.createdBy) {
      partNumberObj.createdBy = userName;
    } else {
      partNumberObj.createdBy = selectedPart.createdBy;
    }

    partNumberObj.idNumber = selectedPart.idNumber;
    partNumberObj.updatedBy = userName;
    partNumberObj.createdOn = new Date().toDateString();
    partNumberObj.updatedOn = new Date().toDateString();
    partNumberObj.unitCost = selectedPart.unitCostPerUnit ? selectedPart.unitCostPerUnit : 0;
    partNumberObj.altOrEqType = selectedPart.altOrEqType;
    partNumberObj.qtyPrevQuoted = selectedPart.quantityAlreadyQuoted;
    partNumberObj.methodType =
      // selectedPart.method === "Stock Line" ? "S" : "I";
      selectedPart.stockLineId != null ? "S" : "I";
    partNumberObj.salesPriceExtended = selectedPart.salesPriceExtended ? formatStringToNumber(selectedPart.salesPriceExtended) : 0;
    partNumberObj.markupExtended = selectedPart.markupExtended ? formatStringToNumber(selectedPart.markupExtended) : 0;
    partNumberObj.markUpPercentage = selectedPart.markUpPercentage ? Number(selectedPart.markUpPercentage) : 0;
    partNumberObj.markupPerUnit = selectedPart.markupPerUnit;
    partNumberObj.salesDiscountExtended = selectedPart.salesDiscountExtended;
    partNumberObj.netSalePriceExtended = selectedPart.netSalePriceExtended;
    partNumberObj.unitCostExtended = selectedPart.unitCostExtended ? formatStringToNumber(selectedPart.unitCostExtended) : 0;
    partNumberObj.marginAmount = selectedPart.marginAmount ? formatStringToNumber(selectedPart.marginAmount) : 0;
    partNumberObj.marginAmountExtended = selectedPart.marginAmountExtended ? formatStringToNumber(selectedPart.marginAmountExtended) : 0;
    partNumberObj.marginPercentage = selectedPart.marginPercentageExtended ? selectedPart.marginPercentageExtended : 0;
    partNumberObj.conditionId = selectedPart.conditionId;
    partNumberObj.currencyId = selectedPart.currencyId;
    partNumberObj.uom = selectedPart.uom;
    partNumberObj.controlNumber = selectedPart.controlNumber;
    partNumberObj.grossSalePrice = selectedPart.grossSalePrice;
    partNumberObj.grossSalePricePerUnit = selectedPart.grossSalePricePerUnit;
    partNumberObj.notes = selectedPart.notes;
    partNumberObj.qtyAvailable = selectedPart.qtyAvailable;
    partNumberObj.customerReference = selectedPart.customerRef;
    partNumberObj.itemNo = selectedPart.itemNo;

    partNumberObj.exchangeCurrencyId=selectedPart.exchangeCurrencyId;
    partNumberObj.loanCurrencyId=selectedPart.loanCurrencyId;
    partNumberObj.exchangeListPrice=formatStringToNumber(selectedPart.exchangeListPrice);
    partNumberObj.entryDate=selectedPart.entryDate;
    partNumberObj.exchangeOverhaulPrice=selectedPart.exchangeOverhaulPrice;
    partNumberObj.exchangeCorePrice=selectedPart.exchangeCorePrice;
    partNumberObj.estOfFeeBilling=selectedPart.estOfFeeBilling;
    partNumberObj.billingStartDate=selectedPart.billingStartDate;
    partNumberObj.exchangeOutrightPrice=selectedPart.exchangeOutrightPrice;
    partNumberObj.exchangeOverhaulCost=selectedPart.exchangeOverhaulCost;
    partNumberObj.daysForCoreReturn=selectedPart.daysForCoreReturn;
    partNumberObj.billingIntervalDays=formatStringToNumber(selectedPart.billingIntervalDays);
    partNumberObj.currencyId=selectedPart.currencyId;
    partNumberObj.currency=selectedPart.currency;
    partNumberObj.depositeAmount=selectedPart.depositeAmount;
    partNumberObj.coreDueDate=selectedPart.coreDueDate;
    partNumberObj.isRemark=selectedPart.isRemark;
    partNumberObj.remarkText=selectedPart.remarkText;
    
    if(selectedPart.exchangeQuoteScheduleBilling.length > 0)
    {
      for(let i=0;i<selectedPart.exchangeQuoteScheduleBilling.length;i++)
      {
        selectedPart.exchangeQuoteScheduleBilling[i].cogs = Number(selectedPart.exchangeQuoteScheduleBilling[i].cogs);
        partNumberObj.exchangeQuoteScheduleBilling.push(selectedPart.exchangeQuoteScheduleBilling[i]);
      }
    }
    return partNumberObj;
  }

  update(salesquote:IExchangeQuoteView): Observable<IExchangeQuote[]> {
    return Observable.forkJoin(
      this.exchangeQuoteEndpointService.update(salesquote)
    );
  }

  marshalExchangeQuotePartToView(selectedPart) {
    let partNumberObj = new PartDetail();
    partNumberObj.itemMasterId = selectedPart.itemMasterId;
    partNumberObj.stockLineId = selectedPart.stockLineId;
    partNumberObj.conditionId = selectedPart.conditionId;
    partNumberObj.conditionDescription = selectedPart.conditionDescription;
    partNumberObj.currencyId = selectedPart.currencyId;
    partNumberObj.currencyDescription = selectedPart.currencyDescription;
    //partNumberObj.priorityId = selectedPart.priorityId;
    partNumberObj.partNumber = selectedPart.partNumber;
    //partNumberObj.priorityName = selectedPart.priorityName;
    //partNumberObj.statusName = selectedPart.statusName;
    partNumberObj.description = selectedPart.partDescription;
    partNumberObj.stockLineNumber = selectedPart.stockLineNumber;
    partNumberObj.exchangeQuotePartId = selectedPart.exchangeQuotePartId;
    partNumberObj.masterCompanyId = selectedPart.masterCompanyId;
    partNumberObj.createdBy = selectedPart.createdBy;
    partNumberObj.serialNumber = selectedPart.serialNumber;
    // partNumberObj.totalSales = selectedPart.totalSales;
    // partNumberObj.idNumber = selectedPart.idNumber;
    // partNumberObj.isApproved = selectedPart.isApproved;
    partNumberObj.customerRequestDate = new Date(selectedPart.customerRequestDate);
    partNumberObj.promisedDate = new Date(selectedPart.promisedDate);
    partNumberObj.estimatedShipDate = new Date(selectedPart.estimatedShipDate);
    partNumberObj.exchangeCurrencyId=selectedPart.exchangeCurrencyId;
    partNumberObj.loanCurrencyId=selectedPart.loanCurrencyId;
    partNumberObj.exchangeListPrice=formatStringToNumber(selectedPart.exchangeListPrice);
    partNumberObj.entryDate=selectedPart.entryDate;
    partNumberObj.exchangeOverhaulPrice=selectedPart.exchangeOverhaulPrice;
    partNumberObj.exchangeCorePrice=selectedPart.exchangeCorePrice;
    partNumberObj.estOfFeeBilling=selectedPart.estOfFeeBilling;
    partNumberObj.billingStartDate=selectedPart.billingStartDate;
    partNumberObj.exchangeOutrightPrice=selectedPart.exchangeOutrightPrice;
    partNumberObj.daysForCoreReturn=selectedPart.daysForCoreReturn;
    partNumberObj.exchangeOverhaulCost=selectedPart.exchangeOverhaulCost;
    partNumberObj.billingIntervalDays=formatStringToNumber(selectedPart.billingIntervalDays);
    partNumberObj.currencyId=selectedPart.currencyId;
    partNumberObj.currency=selectedPart.currency;
    partNumberObj.depositeAmount=selectedPart.depositeAmount;
    partNumberObj.coreDueDate=selectedPart.coreDueDate;
    if(selectedPart.exchangeQuoteScheduleBilling.length>0)
    {
      for(let i=0;i<selectedPart.exchangeQuoteScheduleBilling.length;i++)
      {
        partNumberObj.exchangeQuoteScheduleBilling.push(selectedPart.exchangeQuoteScheduleBilling[i]);
      }
    }
    return partNumberObj;
  }

  approverslistbyTaskId(taskId, id) {
    return this.exchangeQuoteEndpointService.approverslistbyTaskId(taskId, id);
  }

  getExchangeQuoteMarginSummary(exchangeQuoteId) {
    return this.exchangeQuoteEndpointService.getExchangeQuoteMarginSummary(exchangeQuoteId);
  }

  getExchangeQuoteHeaderMarginDetails(selectedParts, marginSummary) {
    // let marginSummary;
    // if (isQuote) {
    //   marginSummary = new SOQuoteMarginSummary();
    // } else {
    //   marginSummary = new MarginSummary();
    // }
    let sales = 0;
    let misc = 0;
    let productCost = 0;
    let exchangefees=0;
    let overhaulprice=0;
    let othercharges=0;
    let totalestrevenue=0;
    let cogsfees=0;
    let overhaulcost=0;
    let othercost=0;
    let marginamount=0;
    let marginpercentage=0;
    let totalestcost=0;
    console.log("marginSummary",marginSummary);
    console.log("selectedParts",selectedParts);
    if (selectedParts && selectedParts.length > 0) {
      selectedParts.forEach(part => {
        // this.checkNullValuesList.forEach(key => {
        //   if (!part[key]) {
        //     part[key] = 0;
        //   }
        // })
        exchangefees=parseFloat(part.exchangeListPrice);
        overhaulprice=parseFloat(part.exchangeOverhaulPrice);
        othercharges=0;
        //const totalestrevenue = parseFloat(parseFloat(exchangefees) + parseFloat(overhaulprice))
        if(part.exchangeQuoteScheduleBilling.length>0){
          cogsfees=parseFloat(part.exchangeQuoteScheduleBilling[0].cogsAmount);
        }
        else{
          cogsfees=0;
        }
        overhaulcost=parseFloat(part.exchangeOverhaulCost);
        othercost=0;
        //const marginamount=(parseFloat(totalestrevenue)-parseFloat(totalestcost));
        //const marginpercentage=(parseFloat(marginamount)/parseFloat(totalestrevenue));
        //const totalestcost=parseFloat(parseFloat(cogsfees) + parseFloat(overhaulcost));
      })
      marginSummary.exchangeFees = exchangefees;
      marginSummary.overhaulPrice = overhaulprice;
      marginSummary.totalEstRevenue = marginSummary ? this.getTotalEstRevenue(marginSummary) : 0;
      marginSummary.cogsFees = cogsfees;
      marginSummary.overhaulCost = overhaulcost;
      marginSummary.totalEstCost = marginSummary ? this.getTotalEstCost(marginSummary) : 0;;
      marginSummary.marginAmount = marginSummary ? this.getMarginAmount(marginSummary) : 0;;
      marginSummary.marginPercentage = marginSummary ? this.getMarginPercentage(marginSummary) : 0;
    }
    return marginSummary;
  }

  getTotalEstRevenue(marginSummary) {
    let totalEstRevenue: number = 0;
    totalEstRevenue = marginSummary.exchangeFees + marginSummary.overhaulPrice + this.totalCharges;
    return totalEstRevenue;
  }

  getMarginAmount(marginSummary) {
    let marginAmount: number = 0;
    marginAmount = marginSummary.totalEstRevenue - marginSummary.totalEstCost;
    return marginAmount;
  }

  getMarginPercentage(marginSummary) {
    let marginPercentage: number = 0;
    marginPercentage = (marginSummary.marginAmount / marginSummary.totalEstRevenue) * 100;
    return marginPercentage;
  }

  getTotalEstCost(marginSummary) {
    let totalEstCost: number = 0;
    totalEstCost = marginSummary.cogsFees + marginSummary.overhaulCost + this.totalcost;
    return totalEstCost;
  }

  createExchangeQuoteMarginSummary(marginSummary: ExchangeQUoteMarginSummary) {
    return this.exchangeQuoteEndpointService.createExchangeQuoteMarginSummary(marginSummary);
  }

  getAllExchangeQuoteAnalysis(id) {
    return this.exchangeQuoteEndpointService.getAllExchangeQuoteAnalysis(id);
  }
  getCustomerQuotesList(exchangeQuoteId) {
    return Observable.forkJoin(
      this.exchangeQuoteEndpointService.getCustomerQuotesList(exchangeQuoteId)
    );
  }
  sentForInternalApproval(data) {
    return this.exchangeQuoteEndpointService.sentForInternalApproval(data);
  }
  getExchangeQuoteCharges(id, isDeleted) {
    return this.exchangeQuoteEndpointService.getExchangeQuoteCharges(id, isDeleted);
  }

  createExchangeQuoteCharge(chargesList: IExchangeQuoteCharge[]): Observable<IExchangeQuote[]> {
    return Observable.forkJoin(
      this.exchangeQuoteEndpointService.createExchangeQuoteCharge(chargesList)
    );
  }
  setTotalCharges(amount) {
    this.totalCharges = amount;
  }
  setTotalFreights(amount) {
    this.totalFreights = amount;
  }
  setTotalcost(amount) {
    this.totalCharges = amount;
  }

  getExchangeQuoteFreights(id, isDeleted) {
    return this.exchangeQuoteEndpointService.getExchangeQuoteFreights(id, isDeleted);
  }

  createFreight(freightsList: IExchangeQuoteFreight[]): Observable<IExchangeQuote[]> {
    return Observable.forkJoin(
      this.exchangeQuoteEndpointService.createFreight(freightsList)
    );
  }

  deleteexchangeQuoteChargesList(chargesId, userName) {
    return Observable.forkJoin(
      this.exchangeQuoteEndpointService.deleteexchangeQuoteChargesList(chargesId, userName)
    );
  }

  deleteexchangeQuoteFreightList(friegntId, userName) {
    return Observable.forkJoin(
      this.exchangeQuoteEndpointService.deleteexchangeQuoteFreightList(friegntId, userName)
    );
  }

  getExchangeQuoteFreightsHistory(id) {
    return this.exchangeQuoteEndpointService.getExchangeQuoteFreightsHistory(id);
  }
  getExchangeQuoteChargesHistory(id) {
    return this.exchangeQuoteEndpointService.getExchangeQuoteChargesHistory(id);
  }

  delete(exchangeQuoteId: number): Observable<boolean[]> {
    return Observable.forkJoin(
      this.exchangeQuoteEndpointService.delete(exchangeQuoteId)
    );
  }

  getExchangeQuoteHistory(exchangeQuoteId) {
    return this.exchangeQuoteEndpointService.getExchangeQuoteHistory(exchangeQuoteId);
  }
  getview(exchangeQuoteId: number): Observable<any> {
    return Observable.forkJoin(
      this.exchangeQuoteEndpointService.getview(exchangeQuoteId)
    );
  }
  getleasingCompany(masterCompanyId?) {
    return this.exchangeQuoteEndpointService.getleasingCompany(masterCompanyId);
  }
}