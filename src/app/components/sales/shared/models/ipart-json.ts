import { IItemMasterSale } from "./iitem-master-sale";

export interface IPartJson {
    selected: boolean;
    itemId: number;
    salesOrderPartId: number;
    stockLineId: number;
    partNumber: string;
    alternatePartId: number;
    description: string;
    conditionId: number;
    conditionDescription: string;
    stockLineNumber: string;
    uomDescription: string;
    qtyAvailable: number;
    quantityOnHand: number;
    qtyToOrder: number;
    qtyOnOrder: number;
    itemClassification: any;
    itemGroup: string;
    controlNumber: string;
    idNumber: string;
    serialNumber: string;
    alternateFor: string;
    unitCost: string;
    unitListPrice: string;
    pma: string;
    der: string;
    isOEM: boolean;
    isPMA: boolean;
    isDER: boolean;
    manufacturer: any;
    customerRef: string;
    currency: string;
    coreUnitPrice: string;
    glAccount: any;
    itar: string;
    eccn: string;
    memo: string;
    currencyId: string;
    currencyDescription: string;
    mappingType: number;
    itemMasterSale: IItemMasterSale;
    unitSalePrice: number;
    mfg: string;
    itemClassificationCode: string;
    oempmader: string;
    CustomerRequestDate?: Date;
    PromisedDate?: Date;
    EstimatedShipDate?: Date;
    PriorityId?: number;
    StatusId?: number;
    CustomerReference: string;
    itemMasterId?: number;
    partId?: number;
}