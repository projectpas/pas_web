export class SOPickTicket {
    salesOrderId: number;
    salesOrderPartId:number;
    stockLineNumber:string;
    qty:number;
    qtyToShip:number;
    partNumber: string;
    partDescription:string;
    soPickTicketNumber:string;
    soPickTicketDate:Date
    soPickTicketId:number;
    memo:string;
    pickedById:number;
    confirmedById:number;
  
    constructor() { }
  }
  