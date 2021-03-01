import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { ShelfEndpoint } from "./shelf-endpoint.service";
import { AuthService } from "./auth.service";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { Shelf } from "../models/shelf.model";
import { AuditHistory } from "../models/audithistory.model";
import { SalesQuoteEndpointService } from "./salesquote-endpoint.service";
import { ISalesQuote } from "../models/sales/ISalesQuote.model";
import { ISalesQuoteView } from "../models/sales/ISalesQuoteView";
import { VerifySalesQuoteModel } from "../components/sales/quotes/models/verify-sales-quote-model";
import { ISalesOrderQuote } from "../models/sales/ISalesOrderQuote";
import { ISalesSearchParameters } from "../models/sales/ISalesSearchParameters";
import { ISalesQuoteListView } from "../models/sales/ISalesQuoteListView";
import { SalesOrderQuote } from "../models/sales/SalesOrderQuote";
import { ItemMasterSearchQuery } from "../components/sales/quotes/models/item-master-search-query";
import { IPartJson } from "../components/sales/shared/models/ipart-json";
import { PartDetail } from "../components/sales/shared/models/part-detail";
import { ISalesOrderQuoteApproverList } from "../models/sales/ISalesOrderQuoteApproverList";
import { SalesOrderQuoteApproverList } from "../models/sales/SalesOrderQuoteApproverList";
import { SalesOrderConversionCritera } from "../components/sales/quotes/models/sales-order-conversion-criteria";
import { SalesOrder } from "../models/sales/SalesOrder.model";
import { SalesOrderView } from "../models/sales/SalesOrderView";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { MarginSummary } from "../models/sales/MarginSummaryForSalesorder";
import { ISalesOrderFreight } from "../models/sales/ISalesOrderFreight";
import { ISalesOrderQuoteCharge } from "../models/sales/ISalesOrderQuoteCharge";
import { formatStringToNumber } from "../generic/autocomplete";
import { SalesOrderQuotePart } from "../models/sales/SalesOrderQuotePart";
import { SOQuoteMarginSummary } from "../models/sales/SoQuoteMarginSummary";
import { WorkOrderType } from "../models/work-order-type.model";


export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = {
  roles: Role[] | string[];
  operation: RolesChangedOperation;
};

@Injectable()
export class SalesQuoteService {
  salesOrderViewSubj = new BehaviorSubject<SalesOrderView>(null);
  public salesOrderViewSubj$ = this.salesOrderViewSubj.asObservable();

  // Observable string streams
  salesOrderQuote: ISalesOrderQuote;
  isEditSOQuoteSettingsList = false;
  soQuoteSettingsData;
  // salesOrderView: SalesOrderView;
  listCollection: any;
  isEditMode: boolean = false;
  // approvers: any[];
  // internalApprovers: any[] = []
  parts: IPartJson[];
  selectedParts: PartDetail[];
  activeStep = new Subject();
  query: ItemMasterSearchQuery;
  totalFreights = 0;
  totalCharges = 0;
  checkNullValuesList = ['netSalesPriceExtended', 'salesDiscountPerUnit', 'grossSalePrice',
    'grossSalePricePerUnit', 'marginAmountExtended', 'markupExtended', 'markupPerUnit', 'salesPriceExtended',
    'salesDiscountExtended', 'salesPriceExtended', 'taxAmount', 'salesPricePerUnit']


  constructor(private salesQuoteEndPointSevice: SalesQuoteEndpointService) {
    this.salesOrderQuote = new SalesOrderQuote();
    // this.salesOrderView = new SalesOrderView();
    // this.approvers = [];

    // console.log(this.approvers);
    this.parts = [];
    this.selectedParts = [];
    this.query = new ItemMasterSearchQuery();
    this.query.partSearchParamters.quantityAlreadyQuoted = 0;
  }

  // initializeApprovals() {
  //   this.approvers.push(new SalesOrderQuoteApproverList());
  //   this.approvers.push(new SalesOrderQuoteApproverList());
  //   this.approvers.push(new SalesOrderQuoteApproverList());
  //   this.approvers.push(new SalesOrderQuoteApproverList());
  //   this.approvers.push(new SalesOrderQuoteApproverList());
  //   console.log(this.approvers);
  // }
  getNewSalesQuoteInstance(customerId: number) {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.getNewSalesQuoteInstance<ISalesQuote>(
        customerId
      )
    );
  }

  getTotalCharges() {
    return this.totalCharges;
  }

  getTotalFreights() {
    return this.totalFreights;
  }

  setTotalFreights(amount) {
    this.totalFreights = amount;
  }

  setTotalCharges(amount) {
    this.totalCharges = amount;
  }

  getNewSalesOrderQuteInstance() {
    return Observable.create(observer => {
      observer.next(this.salesOrderQuote);
      observer.complete();
    });
  }

  getSalesOrderQuteInstance() {
    return Observable.create(observer => {
      observer.next(this.salesOrderQuote);
      observer.complete();
    });
  }

  // setSalesOrderInstance(salesOrderViewData: SalesOrderView){
  //   this.salesOrderViewSubj.next(salesOrderViewData);
  //   this.salesOrderViewSubj.complete();
  // }

  // getSalesOrderInstance(){
  //   return Observable.create(observer => {
  //     observer.next(this.salesOrderView);
  //     observer.complete();
  //   })
  // }

  //   getSalesOrderInstance(): Observable<SalesOrderView>{
  //     return this.salesOrderViewSubj.asObservable();
  // }

  resetSalesOrderQuote() {
    // this.approvers = [];
    // this.initializeApprovals();
    this.selectedParts = [];
    this.totalFreights = 0;
    this.totalCharges = 0;
    this.salesOrderQuote = new SalesOrderQuote();
  }

  getSelectedParts() {
    return Observable.create(observer => {
      observer.next(this.selectedParts);
      observer.complete();
    });
  }

  // getSalesOrderQuteApprovers() {
  //   return Observable.create(observer => {
  //     if (this.approvers.length < 1) this.initializeApprovals();
  //     observer.next(this.approvers);
  //     observer.complete();
  //   });
  // }
  // updateApprovers(data) {
  //   this.internalApprovers = data;
  // }
  getCustomerQuotesList(salesQuoteId) {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.getCustomerQuotesList(salesQuoteId)
    );
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

  resetSearchPart() {
    this.parts = [];
    this.query = new ItemMasterSearchQuery();
    this.query.partSearchParamters.quantityAlreadyQuoted = 0;
  }

  updateSearchPartResult(parts) {
    this.parts = parts;
  }

  updateSearchPartObject(query) {
    this.query = query;
  }

  create(salesquote: ISalesQuoteView): Observable<ISalesOrderQuote[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.create(salesquote)
    );
  }

  createSOQMarginSummary(marginSummary: SOQuoteMarginSummary) {
    return this.salesQuoteEndPointSevice.createSOQMarginSummary(marginSummary);
  }

  getSOQMarginSummary(salesOrderQuoteId) {
    return this.salesQuoteEndPointSevice.getSOQMarginSummary(salesOrderQuoteId);
  }

  saveCustomerQuotesApproved(data) {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.saveCustomerQuotesApprovedEndPoint(data)
    );
  }
  
  sentForInternalApproval(data) {
    return this.salesQuoteEndPointSevice.sentForInternalApproval(data);
  }

  update(salesquote: ISalesQuoteView): Observable<ISalesOrderQuote[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.update(salesquote)
    );
  }

  search(
    salesQuoteSearchParameters
  ): Observable<ISalesQuoteListView[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.search(salesQuoteSearchParameters)
    );
  }

  globalSearch(
    salesQuoteSearchParameters: ISalesSearchParameters
  ): Observable<ISalesQuoteListView[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.globalSearch(salesQuoteSearchParameters)
    );
  }

  delete(salesQuoteId: number): Observable<boolean[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.delete(salesQuoteId)
    );
  }

  deleteSoqSetting(salesQuotesettingsId: number, updatedBy): Observable<boolean[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.deleteSoqSetting(salesQuotesettingsId, updatedBy)
    );
  }

  deletePart(salesQuotePartId: number): Observable<boolean[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.deletePart(salesQuotePartId)
    );
  }

  getSalesQuote(salesQuoteId: number): Observable<ISalesQuoteView[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.getSalesQuote(salesQuoteId)
    );
  }

  getview(salesQuoteId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.getview(salesQuoteId)
    );
  }
  GetTotal(salesQuoteId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.GetTotal(salesQuoteId)
    );
  }
  initiateQuoteCopying(salesQuoteId: number): Observable<ISalesQuoteView[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.initiateQuoteCopying(salesQuoteId)
    );
  }
  verifySalesOrderConversion(salesQuoteId: number): Observable<VerifySalesQuoteModel[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.verifySalesOrderConversionEndPoint(salesQuoteId)
    );
  }

  closeSalesOrderQuote(salesQuoteId: number, updatedBy: string): Observable<ISalesQuoteView[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.closeSalesOrderQuoteEndPoint(salesQuoteId, updatedBy)
    );
  }
  convertfromquote(salesQuoteConversionCriteria: SalesOrderConversionCritera): Observable<SalesOrderView[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.convertfromquoteEndPoint(salesQuoteConversionCriteria)
    );
  }

  sendQuoteToCustomer(salesQuoteId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.sendQuoteToCustomer(salesQuoteId)
    );
  }

  //start SalesOrderQuoteDocument--nitin
  SalesOrderQuoteGeneralDocumentUploadEndpoint(action: any, salesquoteId, moduleId, moduleName, uploadedBy, masterCompanyId) {
    return this.salesQuoteEndPointSevice.SalesOrderQuoteGeneralDocumentUploadEndpoint(action, salesquoteId, moduleId, moduleName, uploadedBy, masterCompanyId);

  }
  documentUploadAction(action: any) {
    return this.salesQuoteEndPointSevice.getDocumentUploadEndpoint<any>(action);
  }
  getDocumentList(salesQuoteId) {
    return this.salesQuoteEndPointSevice.getDocumentList(salesQuoteId)
  }
  toGetUploadDocumentsList(attachmentId, salesQuoteId, moduleId) {
    return this.salesQuoteEndPointSevice.GetUploadDocumentsList(attachmentId, salesQuoteId, moduleId);
  }

  getSOQuoteSettingHistory(id) {
    return this.salesQuoteEndPointSevice.getSOQuoteSettingHistory(id);
  }
  getSalesQuoteDocumentAuditHistory(id) {
    return this.salesQuoteEndPointSevice.getSalesQuoteDocumentAuditHistory(id);
  }
  changeofTab(activeIndex) {
    this.activeStep.next(activeIndex);
  }
  saveSalesQuoteHeader(action: any) {

    return this.salesQuoteEndPointSevice.saveSalesQuoteHeader<any>(action);
  }

  deletesalesOrderFreightList(friegntId, userName) {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.deleteFrieght(friegntId, userName)
    );
  }

  deletesalesOrderChargesList(chargesId, userName) {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.deleteSOQcharge(chargesId, userName)
    );
  }

  createFreight(freightsList: ISalesOrderFreight[]): Observable<ISalesOrderQuote[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.createFreight(freightsList)
    );
  }

  createSOQCharge(chargesList: ISalesOrderQuoteCharge[]): Observable<ISalesOrderQuote[]> {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.createCharges(chargesList)
    );
  }

  getSalesQuoteFreights(id, isDeleted) {
    return this.salesQuoteEndPointSevice.getSalesQuoteFreights(id, isDeleted);
  }

  getSalesQuoteCharges(id, isDeleted) {
    return this.salesQuoteEndPointSevice.getSalesQuoteCharges(id, isDeleted);
  }

  getSalesQuoteHeaderMarginDetails(selectedParts, marginSummary) {
    // let marginSummary;
    // if (isQuote) {
    //   marginSummary = new SOQuoteMarginSummary();
    // } else {
    //   marginSummary = new MarginSummary();
    // }
    let sales = 0;
    let misc = 0;
    let productCost = 0;

    if (selectedParts && selectedParts.length > 0) {
      selectedParts.forEach(part => {
        this.checkNullValuesList.forEach(key => {
          if (!part[key]) {
            part[key] = 0;
          }
        })
        // const miscAmt = parseFloat(part.misc == undefined || part.misc === '' ? 0 : part.misc.toString().replace(/\,/g, ''));
        const netSalesPriceExtended = parseFloat(part.netSalesPriceExtended == undefined || part.netSalesPriceExtended === '' ? 0 : part.netSalesPriceExtended.toString().replace(/\,/g, ''));
        const unitCostExtended = parseFloat(part.unitCostExtended == undefined || part.unitCostExtended === '' ? 0 : part.unitCostExtended.toString().replace(/\,/g, ''));
        sales = sales + netSalesPriceExtended;
        // misc = misc + miscAmt;
        productCost = productCost + unitCostExtended;
      })
      marginSummary.sales = sales;
      marginSummary.misc = parseFloat(marginSummary.misc == undefined || marginSummary.misc === '' ? 0 : marginSummary.misc.toString().replace(/\,/g, ''));;
      marginSummary.productCost = productCost ? productCost : 0;
      marginSummary.netSales = marginSummary ? this.getNetSalesAmount(marginSummary): 0;
      marginSummary.marginAmount = marginSummary ? this.getMarginAmount(marginSummary) : 0;
      marginSummary.marginPercentage = marginSummary ? this.getMarginPercentage(marginSummary) : 0;
    }
    return marginSummary;
  }

  getNetSalesAmount(marginSummary) {
    let netSalesAmount: number = 0;
    netSalesAmount = marginSummary.sales + marginSummary.misc;
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

  marshalSOQPartToSave(selectedPart, userName) {
    this.checkNullValuesList.forEach(key => {
      if (!selectedPart[key]) {
        selectedPart[key] = 0;
      }
    })
    let partNumberObj = new SalesOrderQuotePart();
    partNumberObj.salesOrderQuotePartId = selectedPart.salesOrderQuotePartId;
    partNumberObj.stockLineId = selectedPart.stockLineId;
    partNumberObj.stockLineNumber = selectedPart.stockLineNumber;
    partNumberObj.customerRequestDate = selectedPart.customerRequestDate.toDateString();
    partNumberObj.promisedDate = selectedPart.promisedDate.toDateString();
    partNumberObj.estimatedShipDate = selectedPart.estimatedShipDate.toDateString();
    partNumberObj.priorityId = selectedPart.priorityId;
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
    return partNumberObj;
  }

  getAllSalesOrderTypes() {
    return this.salesQuoteEndPointSevice.getAllSalesOrderTypes<WorkOrderType[]>();
  }

  getAllSalesOrderQuoteSettings() {
    return this.salesQuoteEndPointSevice.getAllSalesOrderQuoteSettings();
  }

  getAllSalesOrderQuoteAnalysis(id) {
    return this.salesQuoteEndPointSevice.getAllSalesOrderQuoteAnalysis(id);
  }

  saveOrUpdateSOQuoteSetting(data) {
    return this.salesQuoteEndPointSevice.saveOrUpdateSOQuoteSettings(data);
  }

  marshalSOQPartToView(selectedPart) {
    let partNumberObj = new PartDetail();
    partNumberObj.itemMasterId = selectedPart.itemMasterId;
    partNumberObj.stockLineId = selectedPart.stockLineId;
    partNumberObj.fixRate = selectedPart.fxRate;
    partNumberObj.quantityFromThis = selectedPart.qtyQuoted;
    partNumberObj.quantityRequested = selectedPart.qtyRequested;
    partNumberObj.quantityToBeQuoted = selectedPart.qtyQuoted;
    partNumberObj.conditionId = selectedPart.conditionId;
    partNumberObj.conditionDescription = selectedPart.conditionDescription;
    partNumberObj.currencyId = selectedPart.currencyId;
    partNumberObj.currencyDescription = selectedPart.currencyDescription;
    partNumberObj.customerRequestDate = new Date(selectedPart.customerRequestDate);
    partNumberObj.promisedDate = new Date(selectedPart.promisedDate);
    partNumberObj.estimatedShipDate = new Date(selectedPart.estimatedShipDate);
    partNumberObj.priorityId = selectedPart.priorityId;
    partNumberObj.partNumber = selectedPart.partNumber;
    partNumberObj.priorityName = selectedPart.priorityName;
    partNumberObj.statusName = selectedPart.statusName;
    partNumberObj.description = selectedPart.partDescription;
    partNumberObj.stockLineNumber = selectedPart.stockLineNumber;
    partNumberObj.customerRef = selectedPart.customerReference;
    partNumberObj.uom = selectedPart.uomName;
    partNumberObj.pmaStatus = selectedPart.stockType;
    partNumberObj.qtyAvailable = selectedPart.qtyAvailable;
    // if (selectedPart.isOEM) partNumberObj.pmaStatus = "OEM";
    // if (selectedPart.isPMA) partNumberObj.pmaStatus = "PMA";
    // if (selectedPart.isDER) partNumberObj.pmaStatus = "DER";
    partNumberObj.salesOrderQuotePartId =
      selectedPart.salesOrderQuotePartId;
    partNumberObj.salesPricePerUnit = selectedPart.unitSalePrice;
    partNumberObj.salesPriceExtended = selectedPart.salesBeforeDiscount;
    partNumberObj.salesDiscount = selectedPart.discount;
    partNumberObj.salesDiscountPerUnit = selectedPart.discountAmount;
    partNumberObj.netSalesPriceExtended = selectedPart.netSales;
    partNumberObj.masterCompanyId = selectedPart.masterCompanyId;
    partNumberObj.quantityFromThis = selectedPart.qtyQuoted;
    partNumberObj.markUpPercentage = selectedPart.markUpPercentage;
    partNumberObj.createdBy = selectedPart.createdBy;
    partNumberObj.markupExtended = selectedPart.markupExtended;
    partNumberObj.method = selectedPart.method;
    partNumberObj.methodType = selectedPart.methodType;
    partNumberObj.serialNumber = selectedPart.serialNumber;
    partNumberObj.marginAmountExtended = selectedPart.marginAmountExtended;
    partNumberObj.marginPercentageExtended = selectedPart.marginPercentage;
    partNumberObj.markupExtended = selectedPart.markupExtended;
    partNumberObj.unitCostPerUnit = selectedPart.unitCost;
    partNumberObj.unitCostExtended = selectedPart.unitCostExtended;
    partNumberObj.taxCode = selectedPart.taxCode;
    partNumberObj.taxAmount = selectedPart.taxAmount;
    partNumberObj.freight = selectedPart.freight;
    partNumberObj.misc = selectedPart.misc;
    partNumberObj.totalSales = selectedPart.totalSales;
    partNumberObj.idNumber = selectedPart.idNumber;
    partNumberObj.isApproved = selectedPart.isApproved;
    partNumberObj.markupPerUnit = selectedPart.markupPerUnit;
    partNumberObj.salesDiscountExtended = selectedPart.salesDiscountExtended;
    partNumberObj.controlNumber = selectedPart.controlNumber;
    partNumberObj.grossSalePrice = selectedPart.grossSalePrice;
    partNumberObj.grossSalePricePerUnit = selectedPart.grossSalePricePerUnit;
    partNumberObj.quantityAlreadyQuoted = selectedPart.qtyPrevQuoted;
    partNumberObj.altOrEqType = selectedPart.altOrEqType;
    partNumberObj.notes = selectedPart.notes;
    partNumberObj.taxType = selectedPart.taxType;
    partNumberObj.taxAmount = selectedPart.taxAmount;
    partNumberObj.taxPercentage = selectedPart.taxPercentage;
    partNumberObj.itemNo = selectedPart.itemNo;
    return partNumberObj;
  }

  getSOQHistory(salesOrderQuoteId) {
    return this.salesQuoteEndPointSevice.getSOQHistory(salesOrderQuoteId);
  }
  getSOQPartHistory(salesOrderQuotePartId) {
    return this.salesQuoteEndPointSevice.getSOQPartHistory(salesOrderQuotePartId);
  }

  getInternalApproversList(approvalTaskId, moduleAmount) {
    return this.salesQuoteEndPointSevice.getInternalApproversList(approvalTaskId, moduleAmount);
  }



  getSOQFreightsHistory(id) {
    return this.salesQuoteEndPointSevice.getSOQFreightsHistory(id);
  }
  getSOQChargesHistory(id) {
    return this.salesQuoteEndPointSevice.getSOQChargesHistory(id);
  }

  getAllSOQEditID(salesOrderQuoteId) {
    return this.salesQuoteEndPointSevice.getAllSOQEditID(salesOrderQuoteId);
  }

  saveSalesOrderQuoteAddress(data) {
    return this.salesQuoteEndPointSevice.saveSalesOrderQuoteAddress(data);
  }

  approverslistbyTaskId(taskId, id) {
    return this.salesQuoteEndPointSevice.approverslistbyTaskId(taskId, id);
  }

  deleteMultiplePart(salesOrderQuotePartIds: any) {
    return Observable.forkJoin(
      this.salesQuoteEndPointSevice.deleteMultiplePart(salesOrderQuotePartIds)
    );
  }
}
