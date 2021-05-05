import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Role } from "../models/role.model";
import { SalesQuoteEndpointService } from "./salesquote-endpoint.service";
import { ISalesQuote } from "../models/sales/ISalesQuote.model";
import { ISalesQuoteView } from "../models/sales/ISalesQuoteView";
import { VerifySalesQuoteModel } from "../components/sales/quotes/models/verify-sales-quote-model";
import { ISalesOrderQuote } from "../models/sales/ISalesOrderQuote";
import { ISalesSearchParameters } from "../models/sales/ISalesSearchParameters";
import { ISalesQuoteListView } from "../models/sales/ISalesQuoteListView";
import { ItemMasterSearchQuery } from "../components/sales/quotes/models/item-master-search-query";
import { IPartJson } from "../components/sales/shared/models/ipart-json";
import { PartDetail } from "../components/sales/shared/models/part-detail";
import { SalesOrderConversionCritera } from "../components/sales/quotes/models/sales-order-conversion-criteria";
import { SalesOrderView } from "../models/sales/SalesOrderView";
import { BehaviorSubject } from "rxjs";
import { ISalesOrderFreight } from "../models/sales/ISalesOrderFreight";
import { ISalesOrderQuoteCharge } from "../models/sales/ISalesOrderQuoteCharge";
import { formatStringToNumber } from "../generic/autocomplete";
import { SalesOrderQuotePart } from "../models/sales/SalesOrderQuotePart";
import { SOQuoteMarginSummary } from "../models/sales/SoQuoteMarginSummary";
import { WorkOrderType } from "../models/work-order-type.model";
import { SalesOrderQuote } from "../models/sales/SalesOrderQuote";
import { ISpeedQuote } from "../models/sales/ISpeedQuote.model";
import { SpeedQuote } from "../models/sales/SpeedQuote.model";
import { ISpeedQuoteView } from "../models/sales/ISpeedQuoteView";
import { SpeedQuoteEndpointService } from "./speedquote-endpoint.service";
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
  // salesOrderView: SalesOrderView;
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

  marshalSpeedQPartToView(selectedPart) {
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
    partNumberObj.quantityOnHand = selectedPart.quantityOnHand;
    partNumberObj.salesOrderQuotePartId = selectedPart.salesOrderQuotePartId;
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
}