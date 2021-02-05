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
import { SalesOrderEndpointService } from "./salesorder-endpoint.service";
import { ISalesOrder } from "../models/sales/ISalesOrder.model";
import { ISalesQuote } from "../models/sales/ISalesQuote.model";
import { ISalesQuoteView } from "../models/sales/ISalesQuoteView";
import { ISalesOrderView } from "../models/sales/ISalesOrderView";
import { ISalesOrderQuote } from "../models/sales/ISalesOrderQuote";
import { ISalesSearchParameters } from "../models/sales/ISalesSearchParameters";
import { ISalesQuoteListView } from "../models/sales/ISalesQuoteListView";
import { SalesOrderQuote } from "../models/sales/SalesOrderQuote";
import { ItemMasterSearchQuery } from "../components/sales/quotes/models/item-master-search-query";
import { PartDetail } from "../components/sales/shared/models/part-detail";
import { PartAction } from "../components/sales/shared/models/part-action";
import { ReplaySubject, BehaviorSubject } from "rxjs";
import { SalesOrderReference } from "../models/sales/salesOrderReference";
import { WorkOrderService } from "./work-order/work-order.service";
import { ISalesOrderCustomerApproval } from "../components/sales/order/models/isales-order-customer-approval";
import { SalesOrderPart } from "../models/sales/SalesOrderPart";
import { ISOFreight } from "../models/sales/ISOFreight";
import { ISalesOrderCharge } from "../models/sales/ISalesOrderCharge";
import { MarginSummary } from "../models/sales/MarginSummaryForSalesorder";
import { SalesOrderShipping } from "../models/sales/salesOrderShipping";
import { SalesOrderBillingAndInvoicing } from "../models/sales/salesOrderBillingAndInvoicing";
import { formatStringToNumber } from "../generic/autocomplete";

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = {
  roles: Role[] | string[];
  operation: RolesChangedOperation;
};

@Injectable()
export class SalesOrderService {
  salesOrderQuote: ISalesOrderQuote;
  salesOrderReference: SalesOrderReference;
  query: ItemMasterSearchQuery;
  activeStep = new Subject();
  selectedParts: any = [];
  totalFreights = 0;
  totalCharges = 0;
  salesOrderReferenceSubj = new BehaviorSubject<SalesOrderReference>(null);
  isEditSOSettingsList = false;
  soSettingsData;
  public salesOrderReferenceSubj$ = this.salesOrderReferenceSubj.asObservable();
  constructor(private salesOrderEndPointSevice: SalesOrderEndpointService, private workorderservice: WorkOrderService) {
    this.salesOrderQuote = new SalesOrderQuote();
    this.salesOrderReference = new SalesOrderReference();
    this.query = new ItemMasterSearchQuery();
    this.query.partSearchParamters.quantityAlreadyQuoted = 0;
  }
  setReferenceObject(data: SalesOrderReference) {
    this.salesOrderReferenceSubj.next(data);
    this.salesOrderReference = data;
    // this.salesOrderReferenceSubj.complete();
  }
  getSelectedParts() {
    return Observable.create(observer => {
      observer.next(this.selectedParts);
      observer.complete();
    });
  }

  getReferenceObject(): Observable<SalesOrderReference> {
    // this.salesOrderReferenceSubj.next(data);
    // return this.salesOrderReference;
    // this.salesOrderReferenceSubj.complete();
    return this.salesOrderReferenceSubj.asObservable();
  }

  getSalesOrderBilling(salesOrderId, partId) {
    return this.salesOrderEndPointSevice.getSalesOrderBilling(salesOrderId, partId);
  }

  getSalesOrderBillingParts(salesOrderId) {
    return this.salesOrderEndPointSevice.getSalesOrderBillingParts(salesOrderId);
  }

  getSalesOrderShippingParts(salesOrderId) {
    return this.salesOrderEndPointSevice.getSalesOrderShippingParts(salesOrderId);
  }

  getSalesOrderShipping(salesOrderId, partId) {
    return this.salesOrderEndPointSevice.getSalesOrderShipping(salesOrderId, partId);
  }

  getNewSalesOrderInstance(customerId: number) {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getNewSalesOrderInstance<ISalesOrderView>(
        customerId
      )
    );
  }
  create(salesOrder: ISalesOrderView): Observable<ISalesOrder[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.create(salesOrder)
    );
  }

  createBilling(salesOrderBilling: SalesOrderBillingAndInvoicing) {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.createBilling(salesOrderBilling)
    );
  }

  createShipping(salesOrderShipping: SalesOrderShipping): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.createShipping(salesOrderShipping)
    );
  }

  update(salesquote: ISalesOrderView): Observable<ISalesOrder[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.update(salesquote)
    );
  }

  search(
    salesQuoteSearchParameters: ISalesSearchParameters
  ): Observable<ISalesQuoteListView[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.search(salesQuoteSearchParameters)
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


  globalSearch(
    salesQuoteSearchParameters: ISalesSearchParameters
  ): Observable<ISalesQuoteListView[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.globalSearch(salesQuoteSearchParameters)
    );
  }

  delete(salesOrderId: number): Observable<boolean[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.delete(salesOrderId)
    );
  }

  deletePart(salesOrderPartId: number): Observable<boolean[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.deletePart(salesOrderPartId)
    );
  }

  getSalesOrder(salesOrderId: number): Observable<ISalesOrderView[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getSalesOrder(salesOrderId)
    );
  }
  getsoconfirmationlist(): Observable<ISalesOrderView[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getSalesOrderConformation()
    );
  }
  getReservedParts(salesOrderId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getReservedParts(salesOrderId)
    );
  }
  getReservestockpartlists(salesOrderId: number, itemMasterId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getReservestockpartlists(salesOrderId, itemMasterId)
    );
  }

  getReservestockpartlistsBySOId(salesOrderId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getReservestockpartlistsBySOId(salesOrderId)
    );
  }

  getIssuedParts(salesOrderId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getIssuedParts(salesOrderId)
    );
  }
  GetTotal(salesOrderId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.GetTotal(salesOrderId)
    );
  }
  getReservedAndIssuedParts(salesOrderId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getReservedAndIssuedParts(salesOrderId)
    );
  }
  getUnreservedParts(salesOrderId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getUnreservedParts(salesOrderId)
    );
  }
  getUnissuedParts(salesOrderId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getUnissuedParts(salesOrderId)
    );
  }
  getcommonsalesorderdetails(salesOrderId: number, salesOrderPartId: number): Observable<SalesOrderReference[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getcommonsalesorderdetails(salesOrderId, salesOrderPartId)
    );
  }
  getunreservedstockpartslist(salesOrderId: number, itemMasterId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getunreservedstockpartslist(salesOrderId, itemMasterId)
    );
  }
  getunreservedstockpartslistBySOId(salesOrderId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getunreservedstockpartslistBySOId(salesOrderId)
    );
  }
  getholdstocklinereservedparts(salesOrderId: number, salesOrderPartId: number, stockLineId: number, quantityRequested: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getholdstocklinereservedparts(salesOrderId, salesOrderPartId, stockLineId, quantityRequested)
    );
  }
  releasestocklinereservedparts(salesOrderId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.releasestocklinereservedparts(salesOrderId)
    );
  }
  savereserveissuesparts(parts: PartAction): Observable<PartAction[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.savereserveissuesparts(parts)
    );
  }

  getview(salesOrderId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getview(salesOrderId)
    );
  }
  getPickTicket(salesOrderId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getPickTicket(salesOrderId)
    );
  }

  generatePickTicket(salesOrderId: number, salesOrderPartId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.generatePickTicket(salesOrderId, salesOrderPartId)
    );
  }

  getPickTicketList(salesOrderId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getPickTicketList(salesOrderId)
    );
  }
  getCustomerApprovalList(salesOrderId: number): Observable<ISalesOrderCustomerApproval[][]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getCustomerApprovalList(salesOrderId)
    );
  }

  approveParts(parts: ISalesOrderCustomerApproval[]): Observable<boolean[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.approveParts(parts)
    );
  }
  sentForInternalApproval(data) {
    return this.salesOrderEndPointSevice.sentForInternalApproval(data);
  }
  close(salesOrderId: number,updatedBy:string): Observable<boolean[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.close(salesOrderId,updatedBy)
    );
  }

  cancel(salesOrderId: number,updatedBy:string): Observable<boolean[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.cancel(salesOrderId,updatedBy)
    );
  }

  copy(salesOrderId: number): Observable<ISalesOrderView[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.copy(salesOrderId)
    );
  }

  //start SalesOrderQuoteDocument--nitin

  documentUploadAction(action: any) {
    return this.salesOrderEndPointSevice.getDocumentUploadEndpoint<any>(action);
  }
  getDocumentList(salesQuoteId) {
    return this.salesOrderEndPointSevice.getDocumentList(salesQuoteId)
  }
  toGetUploadDocumentsList(attachmentId, salesQuoteId, moduleId) {
    return this.salesOrderEndPointSevice.GetUploadDocumentsList(attachmentId, salesQuoteId, moduleId);
  }
  getSalesQuoteDocumentAuditHistory(id) {
    return this.salesOrderEndPointSevice.getSalesQuoteDocumentAuditHistory(id);
  }
  changeofTab(activeIndex) {
    this.activeStep.next(activeIndex);
  }

  deletesalesOrderFreightList(friegntId, userName) {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.deleteFrieght(friegntId, userName)
    );
  }

  deletesalesOrderChargesList(chargesId, userName) {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.deleteCharge(chargesId, userName)
    );
  }

  createFreight(freightsList: ISOFreight[]): Observable<ISalesOrderQuote[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.createFreight(freightsList)
    );
  }

  createSOQCharge(chargesList: ISalesOrderCharge[]): Observable<ISalesOrderQuote[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.createCharges(chargesList)
    );
  }

  getSalesOrderFreights(id, isDeleted) {
    return this.salesOrderEndPointSevice.getSalesOrderFreights(id, isDeleted);
  }

  getSalesQuoteCharges(id, isDeleted) {
    return this.salesOrderEndPointSevice.getSalesOrderCharges(id, isDeleted);
  }

  createSOMarginSummary(marginSummary: MarginSummary) {
    return this.salesOrderEndPointSevice.createSOMarginSummary(marginSummary);
  }

  getSOMarginSummary(salesOrderId) {
    return this.salesOrderEndPointSevice.getSOMarginSummary(salesOrderId);
  }

  marshalSOPartToSave(selectedPart, userName) {
    let partNumberObj = new SalesOrderPart();
    partNumberObj.stockLineId = selectedPart.stockLineId;
    partNumberObj.stockLineNumber = selectedPart.stockLineNumber;
    partNumberObj.itemMasterId = selectedPart.itemMasterId;
    partNumberObj.fxRate = selectedPart.fixRate;
    partNumberObj.qty = selectedPart.quantityFromThis;
    partNumberObj.unitSalePrice = selectedPart.salesPricePerUnit;
    partNumberObj.salesBeforeDiscount = selectedPart.salesPriceExtended ? formatStringToNumber(selectedPart.salesPriceExtended) : 0; //selectedPart.salesPriceExtended;
    partNumberObj.discount = selectedPart.salesDiscount ? Number(selectedPart.salesDiscount) : 0;
    partNumberObj.discountAmount = selectedPart.salesDiscountPerUnit;
    partNumberObj.netSales = selectedPart.netSalesPriceExtended ? formatStringToNumber(selectedPart.netSalesPriceExtended) : 0; //selectedPart.netSalesPriceExtended;
    partNumberObj.masterCompanyId = selectedPart.masterCompanyId;
    partNumberObj.notes = selectedPart.notes;
    if (!selectedPart.createdBy) {
      partNumberObj.createdBy = userName;
    } else {
      partNumberObj.createdBy = selectedPart.createdBy;
    }
    partNumberObj.updatedBy = userName;
    partNumberObj.createdOn = new Date().toDateString();
    partNumberObj.updatedOn = new Date().toDateString();
    partNumberObj.unitCost = selectedPart.unitCostPerUnit ? selectedPart.unitCostPerUnit : 0;
    partNumberObj.methodType =
      selectedPart.method === "Stock Line" ? "S" : "I";

    partNumberObj.salesPriceExtended = selectedPart.salesPriceExtended ? formatStringToNumber(selectedPart.salesPriceExtended) : 0; //selectedPart.salesPriceExtended;
    partNumberObj.markupExtended = selectedPart.markupExtended ? formatStringToNumber(selectedPart.markupExtended) : 0; //selectedPart.markupExtended;
    partNumberObj.markUpPercentage = selectedPart.markUpPercentage ? Number(selectedPart.markUpPercentage) : 0;
    partNumberObj.altOrEqType = selectedPart.altOrEqType;
    partNumberObj.salesDiscountExtended = selectedPart.salesDiscountExtended;
    partNumberObj.netSalePriceExtended = selectedPart.netSalePriceExtended;
    partNumberObj.unitCostExtended = selectedPart.unitCostExtended ? formatStringToNumber(selectedPart.unitCostExtended) : 0; //selectedPart.unitCostExtended;
    partNumberObj.marginAmount = selectedPart.marginAmount ? formatStringToNumber(selectedPart.marginAmount) : 0; //selectedPart.marginAmount;
    partNumberObj.marginAmountExtended = selectedPart.marginAmountExtended ? formatStringToNumber(selectedPart.marginAmountExtended) : 0; //selectedPart.marginAmountExtended;
    partNumberObj.marginPercentage = selectedPart.marginPercentagePerUnit ? selectedPart.marginPercentagePerUnit : 0;
    partNumberObj.conditionId = selectedPart.conditionId;
    partNumberObj.currencyDescription = selectedPart.currencyDescription;
    partNumberObj.currencyId = selectedPart.currencyId;
    partNumberObj.qty = selectedPart.quantityFromThis;
    partNumberObj.salesOrderPartId = selectedPart.salesOrderPartId;
    partNumberObj.salesOrderId = selectedPart.salesOrderId;
    partNumberObj.salesOrderQuoteId = selectedPart.salesOrderQuoteId;
    partNumberObj.salesOrderQuotePartId = selectedPart.salesOrderQuotePartId;
    partNumberObj.itar = selectedPart.itar;
    partNumberObj.eccn = selectedPart.eccn;
    partNumberObj.qtyRequested = selectedPart.quantityRequested ? formatStringToNumber(selectedPart.quantityRequested) : 0; //selectedPart.quantityRequested;
    partNumberObj.customerRequestDate = selectedPart.customerRequestDate.toDateString();
    partNumberObj.promisedDate = selectedPart.promisedDate.toDateString();
    partNumberObj.statusId = selectedPart.statusId;
    partNumberObj.priorityId = selectedPart.priorityId;
    partNumberObj.estimatedShipDate = selectedPart.estimatedShipDate.toDateString();
    partNumberObj.customerReference = selectedPart.customerRef;
    partNumberObj.uom = selectedPart.uom;
    partNumberObj.salesQuoteNumber = selectedPart.salesQuoteNumber;
    partNumberObj.quoteVesrion = selectedPart.quoteVesrion;
    partNumberObj.quoteDate = selectedPart.quoteDate;
    partNumberObj.markupPerUnit = selectedPart.markupPerUnit;
    partNumberObj.controlNumber = selectedPart.controlNumber;
    partNumberObj.grossSalePrice = selectedPart.grossSalePrice;
    partNumberObj.grossSalePricePerUnit = selectedPart.grossSalePricePerUnit;
    partNumberObj.taxType = selectedPart.taxType;
    partNumberObj.taxAmount = selectedPart.taxAmount;
    partNumberObj.idNumber = selectedPart.idNumber;
    partNumberObj.taxPercentage = selectedPart.taxPercentage;
    return partNumberObj;
  }
  marshalSOPartToView(selectedPart, salesOrderObj) {
    let partNumberObj = new PartDetail();
    partNumberObj.itemMasterId = selectedPart.itemMasterId;
    partNumberObj.stockLineId = selectedPart.stockLineId;
    partNumberObj.fixRate = selectedPart.fxRate;
    partNumberObj.quantityFromThis = selectedPart.qty;
    partNumberObj.conditionId = selectedPart.conditionId;
    partNumberObj.conditionDescription = selectedPart.conditionDescription;
    partNumberObj.currencyId = selectedPart.currencyId;
    partNumberObj.currencyDescription = selectedPart.currencyDescription;
    partNumberObj.customerRequestDate = new Date(selectedPart.customerRequestDate);
    partNumberObj.estimatedShipDate = new Date(selectedPart.estimatedShipDate);
    partNumberObj.promisedDate = new Date(selectedPart.promisedDate);
    partNumberObj.partNumber = selectedPart.partNumber;
    partNumberObj.description = selectedPart.partDescription;
    partNumberObj.stockLineNumber = selectedPart.stockLineNumber;
    partNumberObj.statusName = selectedPart.statusName;
    partNumberObj.priorityName = selectedPart.priorityName;
    partNumberObj.pmaStatus = selectedPart.stockType;
    // if (selectedPart.isOEM) partNumberObj.pmaStatus = "OEM";
    // if (selectedPart.isPMA) partNumberObj.pmaStatus = "PMA";
    // if (selectedPart.isDER) partNumberObj.pmaStatus = "DER";
    partNumberObj.salesOrderQuotePartId = selectedPart.salesOrderQuotePartId;
    partNumberObj.salesOrderPartId = selectedPart.salesOrderPartId;
    partNumberObj.salesPricePerUnit = selectedPart.unitSalePrice;
    partNumberObj.salesPriceExtended = selectedPart.salesBeforeDiscount;
    partNumberObj.salesDiscount = selectedPart.discount;
    partNumberObj.salesDiscountPerUnit = selectedPart.discountAmount;
    partNumberObj.netSalesPriceExtended = selectedPart.netSales;
    partNumberObj.masterCompanyId = selectedPart.masterCompanyId;
    partNumberObj.quantityFromThis = selectedPart.qty;
    partNumberObj.markUpPercentage = selectedPart.markUpPercentage;
    partNumberObj.quantityRequested = selectedPart.qtyRequested;
    partNumberObj.markupExtended = selectedPart.markupExtended;
    partNumberObj.method = selectedPart.method;
    partNumberObj.methodType = selectedPart.methodType;
    partNumberObj.serialNumber = selectedPart.serialNumber;
    partNumberObj.marginAmountExtended = selectedPart.marginAmountExtended;
    partNumberObj.marginPercentagePerUnit = selectedPart.marginPercentage;
    partNumberObj.unitCostPerUnit = selectedPart.unitCost;
    partNumberObj.unitCostExtended = selectedPart.unitCostExtended;
    partNumberObj.taxCode = selectedPart.taxCode;
    partNumberObj.taxAmount = selectedPart.taxAmount;
    partNumberObj.freight = selectedPart.freight;
    partNumberObj.misc = selectedPart.misc;
    partNumberObj.totalSales = selectedPart.totalSales;
    partNumberObj.salesOrderPartId = selectedPart.salesOrderPartId;
    partNumberObj.salesOrderId = selectedPart.salesOrderId;
    partNumberObj.uom = selectedPart.uom;
    partNumberObj.salesQuoteNumber = salesOrderObj.salesOrderQuoteNumber;
    partNumberObj.quoteVesrion = salesOrderObj.salesOrderQuoteVersionNumber;
    if (partNumberObj.quoteVesrion) {
      partNumberObj.quoteDate = selectedPart.quoteDate;
    }
    partNumberObj.qtyReserved = selectedPart.qtyReserved;
    partNumberObj.qtyAvailable = selectedPart.qtyAvailable;
    partNumberObj.idNumber = selectedPart.idNumber;
    partNumberObj.isApproved = selectedPart.isApproved;
    partNumberObj.customerRef = salesOrderObj.customerReference;
    partNumberObj.priorityId = selectedPart.priorityId;
    partNumberObj.salesOrderQuoteId = selectedPart.salesOrderQuoteId;
    partNumberObj.itar = selectedPart.itar;
    partNumberObj.eccn = selectedPart.eccn;
    partNumberObj.markupPerUnit = selectedPart.markupPerUnit;
    partNumberObj.controlNumber = selectedPart.controlNumber;
    partNumberObj.grossSalePrice = selectedPart.grossSalePrice;
    partNumberObj.grossSalePricePerUnit = selectedPart.grossSalePricePerUnit;
    partNumberObj.altOrEqType = selectedPart.altOrEqType;
    partNumberObj.taxType = selectedPart.taxType;
    partNumberObj.taxAmount = selectedPart.taxAmount;
    partNumberObj.taxPercentage = selectedPart.taxPercentage;
    partNumberObj.createdBy = selectedPart.createdBy;
    partNumberObj.notes = selectedPart.notes;
    return partNumberObj;
  }

  deleteSoSetting(salesOrdersettingsId: number, updatedBy): Observable<boolean[]> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.deleteSoSetting(salesOrdersettingsId, updatedBy)
    );
  }
  getAllSalesOrderSettings() {
    return this.salesOrderEndPointSevice.getAllSalesOrderSettings();
  }
  saveOrUpdateSOSetting(data) {
    return this.salesOrderEndPointSevice.saveOrUpdateSOSettings(data);
  }
  getSOSettingHistory(id) {
    return this.salesOrderEndPointSevice.getSOSettingHistory(id);
  }

  getAllSalesOrderAnalysis(id) {
    return this.salesOrderEndPointSevice.getAllSalesOrderAnalysis(id);
  }

  getSOFreightsHistory(id) {
    return this.salesOrderEndPointSevice.getSOFreightsHistory(id);
  }

  getSOChargesHistory(id) {
    return this.salesOrderEndPointSevice.getSOChargesHistory(id);
  }

  getSOHistory(salesOrderId) {
    return this.salesOrderEndPointSevice.getSOHistory(salesOrderId)
  }

  approverslistbyTaskId(taskId, id) {
    return this.salesOrderEndPointSevice.approverslistbyTaskId(taskId, id);
  }

  deleteMultiplePart(salesOrderPartIds: any) {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.deleteMultiplePart(salesOrderPartIds)
    );
  }

  GetSalesOrderPartsViewById(salesOrderId) {
    return this.salesOrderEndPointSevice.getSalesOrderPartsViewById(salesOrderId)
  }

  updatePickTicket(data) {
    return this.salesOrderEndPointSevice.updatePickTicket(data);
  }

  getpickticketHistory(pickticketid) {
    return this.salesOrderEndPointSevice.getpickticketHistory(pickticketid)
  }

  getStockLineforPickTicket(itemMasterId: number, conditionId: number): Observable<any> {
    return Observable.forkJoin(
      this.salesOrderEndPointSevice.getStockLineforPickTicket(itemMasterId, conditionId)
    );
  }
  //ed --nitin
}
