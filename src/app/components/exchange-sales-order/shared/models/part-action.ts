export class PartAction {
    exchangeSalesOrderReservePartId: number;
    exchangeSalesOrderId: number;
    exchangeSalesOrderPartId: number;
    stockLineId: number;
    itemMasterId: number;
    partNumber: string;
    partDescription: string;
    masterCompanyId: number;
    equPartId: number;
    equPartNumber: null
    altPartNumber: null
    altPartId: number;
    quantityOnHand: number;
    quantityAvailable: number;
    conditionId: number;
    condition: string;
    isAltPart: boolean
    altPartMasterPartId: number;
    quantity: number;
    quantityReserved: number;
    quantityIssued: number;
    quantityOnOrder: number;
    quantityToReceive: number;
    qtyToReserve: number;
    qtyToIssued: number;
    qtyToReserveAndIssue: number;
    qtyToUnReserve: number;
    qtyToUnIssued: number;
    issuedById: number;
    issuedDate: Date;
    reservedById: number;
    reservedDate: Date;
    isActive: boolean
    isDeleted: boolean;
    createdBy: string;
    updatedBy: string;
    oemDer: string;
    stockType: string;
    isEquPart: boolean;
    equPartMasterPartId: number;
    partStatusId: number;
    soReservedAltParts: PartAction[];
    soReservedEquParts: PartAction[];
    qtyToShip: number;
    qtyInvoiced: number;
    invoiceDate: Date;
    invoiceNumber: string;
    shipReference: string;
}