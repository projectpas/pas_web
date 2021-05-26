export interface ISpeedQuotePart {
    speedQuotePartId: number;
    speedQuoteId: number;
    itemMasterId: number;
    qtyQuoted: number;
    qtyRequested: number;
    unitSalePrice: number;
    unitCost: number;
    masterCompanyId: number;
    createdBy: string;
    createdOn: string;
    updatedBy: string;
    updatedOn: string;
    isDeleted: boolean;
    salesPriceExtended: number;
    netSalePriceExtended: number;
    unitCostExtended: number;
    marginAmount: number;
    marginAmountExtended: number;
    marginPercentage: number;
    conditionId: number;
    conditionDescription: string;
    currencyId: string;
    currencyDescription: string;
    isApproved: boolean;
    uom: string;
    pmaStatus: string;
    grossSalePrice: number;
    grossSalePricePerUnit: number;
    altOrEqType: string;
    qtyPrevQuoted: number;
    notes: string;
    itemNo:number;
    manufacturerId:number;
    manufacturer:string;
    type:string;
    tat:number;
  }
  