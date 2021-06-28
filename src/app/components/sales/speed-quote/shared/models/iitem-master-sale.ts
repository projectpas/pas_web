export interface IItemMasterSale {
    itemMasterPurchaseSaleId: number;
    itemMasterId: number;
    condition: string;
    uomId: number;
    currencyId: number;
    fxRate: number;
    baseSalePrice: number;
    discountPercentage: number;
    discountAmount: number;
    unitSalePrice: number;
}