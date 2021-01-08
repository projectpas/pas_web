export interface IMultiPartJson {
    selected:boolean;
    partId:number;
    partNumber: string;
    partDescription: string;
    exist:boolean;
    restricted:boolean;
    conditionType: number;
    qtyAvailable:number;
    qtyOnHand:number;
    qtyRequested:number;
    alternatePartNumber:string;
   
}