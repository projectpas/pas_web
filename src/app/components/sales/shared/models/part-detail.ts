export class PartDetail {
  salesOrderPartId: number;
  partNumber: string;
  stockLineNumber: string;
  description: string;
  conditionId: number;
  conditionDescription: string;
  classification: string;
  itemClassification: any;
  itemGroup: any;
  quantityRequested: number;
  quantityAlreadyQuoted: number;
  quantityToBeQuoted: number;
  quantityFromThis: number;
  quantityAvailableForThis: number;
  uomName: string;
  currency: any;
  currencyId: string;
  currencyDescription: string;
  fixRate: number;
  partType: string;
  markUpPercentage: number;
  salesDiscount: number;
  itemMasterId: number;
  partId: number;
  stockLineId: number;
  masterCompanyId: number;
  method: string;
  methodType: string;
  serialNumber: string;
  pmaStatus: string;
  idNumber: string;
  salesPricePerUnit: number;
  markupPerUnit: number;
  salesDiscountPerUnit: number;
  netSalesPricePerUnit: number;
  unitCostPerUnit: number;
  marginAmountPerUnit: number;
  marginPercentagePerUnit: number;
  salesPriceExtended: number;
  markupExtended: number;
  salesDiscountExtended: number;
  netSalesPriceExtended: number;
  unitCostExtended: number;
  marginAmountExtended: number;
  marginPercentageExtended: number;
  marginPercentage: number;
  taxCode: string;
  taxType: string;
  taxAmount: number;
  taxPercentage: number;
  freight: number;
  misc: number;
  totalSales: number;
  isApproved: boolean;
  salesOrderId: number;
  salesOrderQuoteId: number;
  salesOrderQuotePartId: number;
  qtyReserved: number;
  qtyAvailable: number;
  qtyToShip: number;
  qtyShipped: number;
  qtyInvoiced: number;
  invoiceDate: Date;
  invoiceNumber: string;
  shipReference: string;
  salesQuoteNumber: string;
  customerRef: string;
  priority: string;
  quoteDate?: Date;
  quoteVesrion: string;
  itar: string;
  eccn: string;
  customerRequestDate?: Date;
  promisedDate?: Date;
  estimatedShipDate?: Date;
  priorityId?: number;
  statusId?: number;
  CustomerReference: string;
  statusName: string;
  priorityName: string;
  controlNumber: string;
  grossSalePrice: number;
  grossSalePricePerUnit: number;
  altOrEqType: string;
  quantityOnHand: number;
  notes: string;
  createdBy: string;
  itemNo: number;
  qty: number;

  constructor() { }

  get QuantityToBeQuoted(): number {
    return this.quantityToBeQuoted;
  }

  set QuantityToBeQuoted(value: number) {
    this.quantityToBeQuoted = value;
  }

  get SalesPricePerUnit(): number {
    return this.salesPricePerUnit;
  }

  set SalesPricePerUnit(value: number) {
    this.salesPricePerUnit = value;
  }

  get MarkupPerUnit(): number {
    return this.markupPerUnit;
  }

  set MarkupPerUnit(value: number) {
    this.markupPerUnit = value;
  }

  get SalesDiscountPerUnit(): number {
    return this.salesDiscountPerUnit;
  }

  set SalesDiscountPerUnit(value: number) {
    this.salesDiscountPerUnit = value;
  }

  get NetSalesPricePerUnit(): number {
    return this.netSalesPricePerUnit;
  }

  set NetSalesPricePerUnit(value: number) {
    this.netSalesPricePerUnit = value;
  }

  get UnitCostPerUnit(): number {
    return this.unitCostPerUnit;
  }

  set MarginAmountPerUnit(value: number) {
    this.marginAmountPerUnit = value;
  }

  get MarginPercentagePerUnit(): number {
    return this.marginAmountPerUnit;
  }

  set MarginPercentagePerUnit(value: number) {
    this.marginAmountPerUnit = value;
  }

  get SalesPriceExtended(): number {
    return this.salesPriceExtended;
  }

  set SalesPriceExtended(value: number) {
    this.salesDiscountExtended = value;
  }

  get MarkupExtended(): number {
    return this.markupExtended;
  }

  set MarkupExtended(value: number) {
    this.markupExtended = value;
  }

  get SalesDiscountExtended(): number {
    return this.salesDiscountExtended;
  }

  set SalesDiscountExtended(value: number) {
    this.salesDiscountExtended = value;
  }

  get NetSalesPriceExtended(): number {
    return this.netSalesPriceExtended;
  }

  set NetSalesPriceExtended(value: number) {
    this.netSalesPriceExtended = value;
  }

  get UnitCostExtended(): number {
    return this.unitCostExtended;
  }

  set UnitCostExtended(value: number) {
    this.unitCostExtended = value;
  }

  get MarginAmountExtended(): number {
    return this.marginAmountExtended;
  }

  set MarginAmountExtended(value: number) {
    this.marginAmountExtended = value;
  }

  get MarginPercentageExtended(): number {
    return this.marginPercentageExtended;
  }

  set MarginPercentageExtended(value: number) {
    this.marginPercentageExtended = value;
  }

  get MarkUpPercentage(): number {
    return this.markUpPercentage;
  }

  set MarkUpPercentage(value: number) {
    this.markUpPercentage = value;
  }

  get SalesDiscount(): number {
    return this.salesDiscount;
  }

  set SalesDiscount(value: number) {
    this.salesDiscount = value;
  }
}
