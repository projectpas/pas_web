import { PartDetail } from "../../components/sales/shared/models/part-detail";

export class SummaryPart {
    partNumber: string;
    quantityRequested = 0;
    currencyId: string;
    currencyDescription: string;
    fixRate = 0;
    partDescription: string;
    uom: string;
    customerRef: string;
    freight = 0;
    misc = 0;
    netSalesPriceExtended = 0;
    salesDiscountExtended = 0;
    grossSalePrice = 0;
    taxAmount = 0;
    unitCostExtended = 0;
    marginAmountExtended = 0;
    marginPercentageExtended = 0;
    totalSales = 0;
    quantityToBeQuoted = 0;
    pmaStatus: string;
    quantityAlreadyQuoted = 0;
    childParts: PartDetail[] = [];
    hidePart: boolean = false;
    partId: number;
    conditionId: number;
    qtyAvailable: number = 0;
    quantityOnHand: number = 0;
}