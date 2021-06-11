export class SpeedQuoteExclusion {
    exclusionPartId:number;
    speedQuoteId:number;
    itemMasterId: number;
    partNumberId: any;
    description:string;
    partNumber1:string;
    pn:string;
    speedQuotePartId:number;
    exitemMasterId: number;
    exPartNumber:string;
    exPartDescription:string;
    exStockType:string;
    exQuantity:number;
    exUnitPrice:number;
    exExtPrice:number;
    exOccurance:number;
    exCurr:number;
    exNotes:string;
    isEditPart:boolean;
    itemNo:number;
    // partNumberObj: {};


    constructor() {
        this.exclusionPartId = 0;
        this.speedQuoteId = 0;
        this.itemMasterId = null;
        this.partNumberId = null;
        this.description = null;
        this.partNumber1 = null;
        this.pn = null;
        this.speedQuotePartId = null;
        this.exitemMasterId = 0;
        this.exPartNumber = null;
        this.exPartDescription = null;
        this.exStockType = null;
        this.exQuantity = 0;
        this.exUnitPrice = 0.00;
        this.exExtPrice = 0.00;
        this.exOccurance = null;
        this.exCurr = null;
        this.exNotes = null;
        this.isEditPart = false;
        this.itemNo = 0;
    }
}