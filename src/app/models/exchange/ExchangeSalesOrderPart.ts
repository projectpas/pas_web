import { IExchangeSalesOrderPart } from "./IExchangeSalesOrderPart";
import { ExchangeSalesOrderScheduleBilling } from "../../components/exchange-sales-order/shared/models/exchangeSalesOrderScheduleBilling";
export class ExchangeSalesOrderPart implements IExchangeSalesOrderPart {
    //exchangeQuotepartPartId: number;
    exchangeSalesOrderPartId: number;
    exchangeSalesOrderId: number;
    itemMasterId: number;
    stockLineId: number;
    stockLineNumber: string;
    fxRate: number;
    qtyQuoted: number;
    qtyRequested: number;
    unitSalePrice: number;
    unitCost: number;
    markUpPercentage: number;
    salesBeforeDiscount: number;
    discount: number;
    discountAmount: number;
    netSales: number;
    masterCompanyId: number;
    createdBy: string;
    createdOn: string;
    updatedBy: string;
    updatedOn: string;
    isDeleted: boolean;
    methodType: string;
    serialNumber: string;
    salesPriceExtended: number;
    priorityId: number;
    markupExtended: number;
    salesDiscountExtended: number;
    netSalePriceExtended: number;
    unitCostExtended: number;
    marginAmount: number;
    marginAmountExtended: number;
    marginPercentage: number;
    conditionId: number;
    conditionDescription: string;
    //currencyId: string;
    currencyDescription: string;
    isApproved: boolean;
    uom: string;
    pmaStatus: string;
    markupPerUnit: number;
    controlNumber: string;
    grossSalePrice: number;
    grossSalePricePerUnit: number;
    altOrEqType: string;
    qtyPrevQuoted: number;
    notes: string;
    taxType: string;
    taxAmount: number;
    taxPercentage: number;
    idNumber: string;
    qtyAvailable: number;
    customerReference: string;
    itemNo: number;
    customerRequestDate?: Date;
    promisedDate?: Date;
    estimatedShipDate?: Date;

    exchangeCurrencyId: number;
    loanCurrencyId: number;
    exchangeListPrice: number;
    entryDate: Date;
    exchangeOverhaulPrice: number;
    exchangeCorePrice: number;
    estOfFeeBilling: number;
    billingStartDate: number;
    exchangeOutrightPrice: number;
    daysForCoreReturn: number;
    billingIntervalDays: string;
    exchangeOverhaulCost:number;
    currencyId: number;
    currency: string;
    depositeAmount: number;
    coreDueDate: Date;
    isRemark:boolean;
    remarkText:string;
    exchangeSalesOrderScheduleBilling:ExchangeSalesOrderScheduleBilling[]=[];
}