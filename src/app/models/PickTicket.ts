export class PickTicket {
    referenceId: number;
    moduleId:number;
    orderPartId:number;
    stockLineNumber:string;
    qty:number;
    qtyToShip:number;
    //qtyPicked:number;
    partNumber: string;
    partDescription:string;
    PickTicketNumber:string;
    PickTicketDate:Date
    PickTicketId:number;
    memo:string;
    pickedById:number;
    confirmedById:number;
    //isConfirmed:boolean;
    qtyRemaining:number;
  
    constructor() { }
}
