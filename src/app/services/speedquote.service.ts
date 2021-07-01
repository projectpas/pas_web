import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Role } from "../models/role.model";
import { ISalesQuoteView } from "../models/sales/ISalesQuoteView";
import { ItemMasterSearchQuery } from "../components/sales/quotes/models/item-master-search-query";
import { IPartJson } from "../components/sales/shared/models/ipart-json";
//import { PartDetail } from "../components/sales/shared/models/part-detail";
import { PartDetail } from "../components/sales/speed-quote/shared/models/part-detail";
import { SalesOrderView } from "../models/sales/SalesOrderView";
import { BehaviorSubject } from "rxjs";
import { formatStringToNumber } from "../generic/autocomplete";
import { SalesOrderQuotePart } from "../models/sales/SalesOrderQuotePart";
import { SpeedQuotePart } from "../models/sales/SpeedQuotePart";
import { ISpeedQuote } from "../models/sales/ISpeedQuote.model";
import { SpeedQuote } from "../models/sales/SpeedQuote.model";
import { ISpeedQuoteView } from "../models/sales/ISpeedQuoteView";
import { SpeedQuoteEndpointService } from "./speedquote-endpoint.service";
import { SpeedQuoteMarginSummary } from "../models/sales/SpeedQuoteMarginSummary";
import { ISpeedQuoteListView } from "../models/sales/ISpeedQuoteListView";
import { SpeedQuotePrintCritera } from "../components/sales/speed-quote/models/speed-quote-print-criteria";
export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = {
  roles: Role[] | string[];
  operation: RolesChangedOperation;
};

@Injectable()
export class SpeedQuoteService {
  salesOrderViewSubj = new BehaviorSubject<SalesOrderView>(null);
  public salesOrderViewSubj$ = this.salesOrderViewSubj.asObservable();

  // Observable string streams
  speedQuote: ISpeedQuote;
  isEditSOQuoteSettingsList = false;
  soQuoteSettingsData;
  listCollection: any;
  isEditMode: boolean = false;
  parts: IPartJson[];
  selectedParts: PartDetail[];
  activeStep = new Subject();
  query: ItemMasterSearchQuery;
  totalFreights = 0;
  totalCharges = 0;
  checkNullValuesList = ['netSalesPriceExtended', 'salesDiscountPerUnit', 'grossSalePrice',
    'grossSalePricePerUnit', 'marginAmountExtended', 'markupExtended', 'markupPerUnit', 'salesPriceExtended',
    'salesDiscountExtended', 'salesPriceExtended', 'taxAmount', 'salesPricePerUnit'];

  constructor(private speedQuoteEndPointSevice: SpeedQuoteEndpointService) {
    this.parts = [];
    this.selectedParts = [];
    this.query = new ItemMasterSearchQuery();
    this.query.partSearchParamters.quantityAlreadyQuoted = 0;
  }

  getSpeedQuteInstance() {
    return Observable.create(observer => {
      observer.next(this.speedQuote);
      observer.complete();
    });
  }

  getSelectedParts() {
    return Observable.create(observer => {
      observer.next(this.selectedParts);
      observer.complete();
    });
  }

  getSpeedQuote(salesQuoteId: number): Observable<ISpeedQuoteView[]> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.getSpeedQuote(salesQuoteId)
    );
  }

  getAllSpeedQuoteSettings(masterCompanyId) {
    return this.speedQuoteEndPointSevice.getAllSpeedQuoteSettings(masterCompanyId);
  }

  setTotalCharges(amount) {
    this.totalCharges = amount;
  }

  setTotalFreights(amount) {
    this.totalFreights = amount;
  }

  resetSalesOrderQuote() {
    this.selectedParts = [];
    this.totalFreights = 0;
    this.totalCharges = 0;
    this.speedQuote = new SpeedQuote();
  }

  getNewSpeedQuoteInstance(customerId: number) {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.getNewSpeedQuoteInstance<ISpeedQuote>(
        customerId
      )
    );
  }

  create(salesquote: ISpeedQuoteView): Observable<ISpeedQuote[]> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.create(salesquote)
    );
  }

  update(salesquote: ISpeedQuoteView): Observable<ISpeedQuote[]> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.update(salesquote)
    );
  }

  sendSpeedQuoteToCustomer(salesQuoteId: number): Observable<any> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.sendQuoteToCustomer(salesQuoteId)
    );
  }

  marshalSpeedQPartToView(selectedPart) {
    let partNumberObj = new PartDetail();
    partNumberObj.itemMasterId = selectedPart.itemMasterId;
    partNumberObj.quantityRequested = selectedPart.quantityRequested;
    //partNumberObj.quantityToBeQuoted = selectedPart.qtyQuoted;
    partNumberObj.conditionId = selectedPart.conditionId;
    partNumberObj.conditionDescription = selectedPart.conditionDescription;
    partNumberObj.currencyId = selectedPart.currencyId;
    partNumberObj.currencyDescription = selectedPart.currencyDescription;
    // partNumberObj.customerRequestDate = new Date(selectedPart.customerRequestDate);
    // partNumberObj.promisedDate = new Date(selectedPart.promisedDate);
    // partNumberObj.estimatedShipDate = new Date(selectedPart.estimatedShipDate);
    // partNumberObj.priorityId = selectedPart.priorityId;
    partNumberObj.partNumber = selectedPart.partNumber;
    //partNumberObj.priorityName = selectedPart.priorityName;
    partNumberObj.statusName = selectedPart.statusName;
    partNumberObj.description = selectedPart.partDescription;
    //partNumberObj.stockLineNumber = selectedPart.stockLineNumber;
    //partNumberObj.customerRef = selectedPart.customerReference;
    partNumberObj.uom = selectedPart.uomName;
    //partNumberObj.pmaStatus = selectedPart.stockType;
    //partNumberObj.qtyAvailable = selectedPart.qtyAvailable;
    //partNumberObj.quantityOnHand = selectedPart.quantityOnHand;
    partNumberObj.speedQuotePartId = selectedPart.speedQuotePartId;
    //partNumberObj.salesPricePerUnit = selectedPart.unitSalePrice;
    partNumberObj.unitSalePrice = selectedPart.unitSalePrice;
    partNumberObj.salesPriceExtended = selectedPart.salesPriceExtended;
    partNumberObj.salesDiscount = selectedPart.discount;
    partNumberObj.salesDiscountPerUnit = selectedPart.discountAmount;
    partNumberObj.netSalesPriceExtended = selectedPart.netSales;
    partNumberObj.masterCompanyId = selectedPart.masterCompanyId;
    partNumberObj.quantityFromThis = selectedPart.qtyQuoted;
    partNumberObj.markUpPercentage = selectedPart.markUpPercentage;
    partNumberObj.createdBy = selectedPart.createdBy;
    partNumberObj.marginAmountExtended = selectedPart.marginAmountExtended;
    partNumberObj.marginPercentageExtended = selectedPart.marginPercentage;
    partNumberObj.markupExtended = selectedPart.markupExtended;
    partNumberObj.unitCost = selectedPart.unitCost;
    partNumberObj.unitCostPerUnit = selectedPart.unitCost;
    partNumberObj.unitCostExtended = selectedPart.unitCostExtended;
    partNumberObj.altOrEqType = selectedPart.altOrEqType;
    partNumberObj.notes = selectedPart.notes;    
    partNumberObj.manufacturerId = selectedPart.manufacturerId;
    partNumberObj.manufacturer = selectedPart.manufacturer;
    partNumberObj.oempmader = selectedPart.type;
    partNumberObj.tat = selectedPart.tat;
    partNumberObj.isEditPart = true;
    partNumberObj.itemNo = selectedPart.itemNo;
    partNumberObj.isPma = selectedPart.isPma;
    partNumberObj.oemPN = selectedPart.oemPN;
    return partNumberObj;
  }

  marshalSpeedQuotePartToSave(selectedPart, userName) {
    this.checkNullValuesList.forEach(key => {
      if (!selectedPart[key]) {
        selectedPart[key] = 0;
      }
    })
    let partNumberObj = new SpeedQuotePart();
    partNumberObj.speedQuotePartId = selectedPart.speedQuotePartId;
    partNumberObj.itemMasterId = selectedPart.itemMasterId;
    partNumberObj.qtyQuoted = selectedPart.quantityToBeQuoted ? formatStringToNumber(selectedPart.quantityToBeQuoted) : 0;
    //partNumberObj.qtyRequested = selectedPart.quantityRequested ? formatStringToNumber(selectedPart.quantityRequested) : 0;
    partNumberObj.quantityRequested = selectedPart.quantityRequested ? formatStringToNumber(selectedPart.quantityRequested) : 0;
    partNumberObj.unitSalePrice = selectedPart.unitSalePrice;
    partNumberObj.masterCompanyId = selectedPart.masterCompanyId;
    if (!selectedPart.createdBy) {
      partNumberObj.createdBy = userName;
    } else {
      partNumberObj.createdBy = selectedPart.createdBy;
    }

    partNumberObj.updatedBy = userName;
    partNumberObj.createdOn = new Date().toDateString();
    partNumberObj.updatedOn = new Date().toDateString();
    //partNumberObj.unitCost = selectedPart.unitCost ? selectedPart.unitCost : 0;
    partNumberObj.altOrEqType = selectedPart.altOrEqType;
    partNumberObj.qtyPrevQuoted = selectedPart.quantityAlreadyQuoted;
    partNumberObj.salesPriceExtended = selectedPart.salesPriceExtended ? formatStringToNumber(selectedPart.salesPriceExtended) : 0;
    partNumberObj.netSalePriceExtended = selectedPart.netSalePriceExtended;
    partNumberObj.unitCost = selectedPart.unitCost ? formatStringToNumber(selectedPart.unitCost) : 0;
    partNumberObj.unitCostExtended = selectedPart.unitCostExtended ? formatStringToNumber(selectedPart.unitCostExtended) : 0;
    partNumberObj.marginAmount = selectedPart.marginAmount ? formatStringToNumber(selectedPart.marginAmount) : 0;
    partNumberObj.marginAmountExtended = selectedPart.marginAmountExtended ? formatStringToNumber(selectedPart.marginAmountExtended) : 0;
    partNumberObj.marginPercentage = selectedPart.marginPercentageExtended ? selectedPart.marginPercentageExtended : 0;
    partNumberObj.conditionId = selectedPart.conditionId;
    partNumberObj.currencyId = selectedPart.currencyId;
    partNumberObj.uom = selectedPart.uom;
    partNumberObj.grossSalePricePerUnit = selectedPart.grossSalePricePerUnit;
    partNumberObj.grossSalePrice = selectedPart.grossSalePrice + selectedPart.misc;
    partNumberObj.notes = selectedPart.notes;
    partNumberObj.itemNo = selectedPart.itemNo;
    partNumberObj.manufacturerId = selectedPart.manufacturerId;
    partNumberObj.manufacturer = selectedPart.manufacturer;
    partNumberObj.type = selectedPart.oempmader;
    partNumberObj.tat = selectedPart.tat;
    partNumberObj.marginAmount = selectedPart.marginAmountPerUnit;
    return partNumberObj;
  }

  getSpeedQuoteHeaderMarginDetails(selectedParts, marginSummary) {
    let sales = 0;
    let productCost = 0;

    if (selectedParts && selectedParts.length > 0) {
      selectedParts.forEach(part => {
        this.checkNullValuesList.forEach(key => {
          if (!part[key]) {
            part[key] = 0;
          }
        })
        const netSalesPriceExtended = parseFloat(part.netSalesPriceExtended == undefined || part.netSalesPriceExtended === '' ? 0 : part.netSalesPriceExtended.toString().replace(/\,/g, ''));
        const unitCostExtended = parseFloat(part.unitCostExtended == undefined || part.unitCostExtended === '' ? 0 : part.unitCostExtended.toString().replace(/\,/g, ''));
        sales = sales + netSalesPriceExtended;
        productCost = productCost + unitCostExtended;
      });

      marginSummary.sales = sales;
      marginSummary.misc = parseFloat(marginSummary.misc == undefined || marginSummary.misc === '' ? 0 : marginSummary.misc.toString().replace(/\,/g, ''));;
      marginSummary.productCost = productCost ? productCost : 0;
      marginSummary.netSales = marginSummary ? this.getNetSalesAmount(marginSummary) : 0;
      marginSummary.marginAmount = marginSummary ? this.getMarginAmount(marginSummary) : 0;
      marginSummary.marginPercentage = marginSummary ? this.getMarginPercentage(marginSummary) : 0;
    }
    return marginSummary;
  }

  getNetSalesAmount(marginSummary) {
    let netSalesAmount: number = 0;
    netSalesAmount = Number(marginSummary.sales) + Number(marginSummary.misc);
    return netSalesAmount;
  }

  getMarginAmount(marginSummary) {
    let marginAmount: number = 0;
    marginAmount = marginSummary.netSales - marginSummary.productCost;
    return marginAmount;
  }

  getMarginPercentage(marginSummary) {
    let marginPercentage: number = 0;
    if (marginSummary.netSales > 0) {
      marginPercentage = (marginSummary.marginAmount / marginSummary.netSales) * 100;
    } else {
      marginPercentage = 0;
    }

    return Number(marginPercentage.toFixed(2));
  }

  createSpeedQuoteMarginSummary(marginSummary: SpeedQuoteMarginSummary) {
    return this.speedQuoteEndPointSevice.createSpeedQuoteMarginSummary(marginSummary);
  }

  initiateQuoteCopying(salesQuoteId: number): Observable<ISpeedQuoteView[]> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.initiateQuoteCopying(salesQuoteId)
    );
  }

  closeSpeedQuote(salesQuoteId: number, updatedBy: string): Observable<ISpeedQuoteView[]> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.closeSpeedQuoteEndPoint(salesQuoteId, updatedBy)
    );
  }

  resetSearchPart() {
    this.parts = [];
    this.query = new ItemMasterSearchQuery();
    this.query.partSearchParamters.quantityAlreadyQuoted = 0;
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
  getSearchPartResult() {
    return Observable.create(observer => {
      observer.next(this.parts);
      observer.complete();
    });
  }
  getItemMasterDataConditionWise(id) {
    return this.speedQuoteEndPointSevice.getItemMasterDataConditionWise(id);
  }
  search(
    speedQuoteSearchParameters
  ): Observable<ISpeedQuoteListView[]> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.search(speedQuoteSearchParameters)
    );
  }

  saveExclusionPart(data) {
    return this.speedQuoteEndPointSevice.saveExclusionPart(data);
  }
  getExclusionList(id) {
    return this.speedQuoteEndPointSevice.getExclusionList(id);
  }
  delete(speedQuoteId: number): Observable<boolean[]> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.delete(speedQuoteId)
    );
  }
  getSpeedQuoteHistory(speedQuoteId) {
    return this.speedQuoteEndPointSevice.getSpeedQuoteHistory(speedQuoteId);
  }
  getview(speedQuoteId: number): Observable<any> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.getview(speedQuoteId)
    );
  }
  deletePart(speedQuotePartId: number): Observable<boolean[]> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.deletePart(speedQuotePartId)
    );
  }
  getSpeedQuotePartHistory(speedQuotePartId) {
    return this.speedQuoteEndPointSevice.getSpeedQuotePartHistory(speedQuotePartId);
  }
  getPrintview(speedQuoteId: number): Observable<any> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.getPrintview(speedQuoteId)
    );
  }
  getExclusionPrintview(speedQuoteId: number): Observable<any> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.getExclusionPrintview(speedQuoteId)
    );
  }
  sendSppedQuoteEmail(speedQuotePrintCritera: SpeedQuotePrintCritera): Observable<SalesOrderView[]> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.sendSppedQuoteEmail(speedQuotePrintCritera)
    );
  }
  deleteExclusion(exclusionPartId: number): Observable<boolean[]> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.deleteExclusion(exclusionPartId)
    );
  }
  //get PDF preview of Quote
  getSQsendmailpdfpreview(speedQuoteId: number): Observable<any> {
    return Observable.forkJoin(
      this.speedQuoteEndPointSevice.getSQsendmailpdfpreview(speedQuoteId)
    );
  }
}