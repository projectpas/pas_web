import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Role } from "../models/role.model";
import { ExchangeSalesOrderEndpointService } from "./exchangesalesorder-endpoint.service";
import { IExchangeSalesOrder } from "../models/exchange/IExchangeSalesOrder.model";
import { IExchangeSalesOrderView } from "../models/exchange/IExchangeSalesOrderView";
import { ItemMasterSearchQuery } from "../components/sales/quotes/models/item-master-search-query";
import { PartDetail } from "../components/exchange-sales-order/shared/models/part-detail";
import { PartAction } from "../components/sales/shared/models/part-action";
import { IPartJson } from "../components/exchange-sales-order/shared/models/ipart-json";
import { formatStringToNumber } from "../generic/autocomplete";
import { ExchangeSalesOrderPart } from '../models/exchange/ExchangeSalesOrderPart';
import { IExchangeSalesSearchParameters } from "../models/exchange/IExchangeSalesSearchParameters";
import { IExchangeSalesOrderListView } from "../models/exchange/IExchangeSalesOrderListView";
export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = {
    roles: Role[] | string[];
    operation: RolesChangedOperation;
};
@Injectable({
    providedIn: 'root'
})
export class ExchangeSalesOrderService {
    //salesOrderQuote: ISalesOrderQuote;
    //salesOrderReference: SalesOrderReference;
    parts: IPartJson[];
    selectedParts: PartDetail[];
    activeStep = new Subject();
    query: ItemMasterSearchQuery;
    //activeStep = new Subject();
    //selectedParts: any = [];
    totalFreights = 0;
    totalCharges = 0;
    //salesOrderReferenceSubj = new BehaviorSubject<SalesOrderReference>(null);
    isEditSOSettingsList = false;
    soSettingsData;
    //public salesOrderReferenceSubj$ = this.salesOrderReferenceSubj.asObservable();
    constructor(
        private exchangeSalesOrderEndpointService:ExchangeSalesOrderEndpointService) {
    }

    create(exchangesalesOrder: IExchangeSalesOrderView): Observable<IExchangeSalesOrder[]> {
        return Observable.forkJoin(
          this.exchangeSalesOrderEndpointService.create(exchangesalesOrder)
        );
    }
    update(salesquote: IExchangeSalesOrderView): Observable<IExchangeSalesOrder[]> {
        return Observable.forkJoin(
          this.exchangeSalesOrderEndpointService.update(salesquote)
        );
    }
    getSelectedParts() {
        return Observable.create(observer => {
          observer.next(this.selectedParts);
          observer.complete();
        });
    }
    resetSearchPart() {
        this.parts = [];
        this.query = new ItemMasterSearchQuery();
        this.query.partSearchParamters.quantityAlreadyQuoted = 0;
    }
    getAllExchangeSalesOrderSettings(masterCompanyId) {
        return this.exchangeSalesOrderEndpointService.getAllExchangeSalesOrderSettings(masterCompanyId);
    }
    getNewSalesOrderInstance(customerId: number) {
        return Observable.forkJoin(
          this.exchangeSalesOrderEndpointService.getNewSalesOrderInstance<IExchangeSalesOrderView>(
            customerId
          )
        );
    }
    getSalesOrder(exchangeSalesOrderId: number): Observable<IExchangeSalesOrderView[]> {
        return Observable.forkJoin(
          this.exchangeSalesOrderEndpointService.getSalesOrder(exchangeSalesOrderId)
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
    updateSearchPartResult(parts) {
        this.parts = parts;
    }
    
    updateSearchPartObject(query) {
        this.query = query;
    }
    marshalExchangeSalesOrderPartToSave(selectedPart, userName) {
        // this.checkNullValuesList.forEach(key => {
        //   if (!selectedPart[key]) {
        //     selectedPart[key] = 0;
        //   }
        // })
        let partNumberObj = new ExchangeSalesOrderPart();
        partNumberObj.exchangeSalesOrderPartId = selectedPart.exchangeSalesOrderPartId;
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
        
        if(selectedPart.exchangeSalesOrderScheduleBilling.length > 0)
        {
          for(let i=0;i<selectedPart.exchangeSalesOrderScheduleBilling.length;i++)
          {
            selectedPart.exchangeSalesOrderScheduleBilling[i].cogs = Number(selectedPart.exchangeSalesOrderScheduleBilling[i].cogs);
            partNumberObj.exchangeSalesOrderScheduleBilling.push(selectedPart.exchangeSalesOrderScheduleBilling[i]);
          }
        }
        return partNumberObj;
      }

      marshalExchangeSalesOrderPartToView(selectedPart) {
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
        partNumberObj.exchangeSalesOrderPartId = selectedPart.exchangeSalesOrderPartId;
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
        if(selectedPart.exchangeSalesOrderScheduleBilling.length>0)
        {
          for(let i=0;i<selectedPart.exchangeSalesOrderScheduleBilling.length;i++)
          {
            partNumberObj.exchangeSalesOrderScheduleBilling.push(selectedPart.exchangeSalesOrderScheduleBilling[i]);
          }
        }
        return partNumberObj;
      }

      search(
        exchangeSalesOrderSearchParameters: IExchangeSalesSearchParameters
      ): Observable<IExchangeSalesOrderListView[]> {
        return Observable.forkJoin(
          this.exchangeSalesOrderEndpointService.search(exchangeSalesOrderSearchParameters)
        );
      }
}