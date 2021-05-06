export class WOPickTicket {
    salesOrderId: number;
    salesOrderPartId:number;
    stockLineNumber:string;
    qty:number;
    qtyToShip:number;
    //qtyPicked:number;
    partNumber: string;
    partDescription:string;
    soPickTicketNumber:string;
    soPickTicketDate:Date
    soPickTicketId:number;
    memo:string;
    pickedById:number;
    confirmedById:number;
    //isConfirmed:boolean;
    qtyRemaining:number;
  
    constructor() { }
  }
  