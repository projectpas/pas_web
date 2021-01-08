
import { ISalesOrderPickTicket } from './ISalesOrderPickTicket';
import { ISalesOrder } from './ISalesOrder.model';
import { ISalesOrderPart } from './ISalesOrderPart';
import { SalesOrder } from './SalesOrder.model';



export class SalesOrderPickTicketView implements ISalesOrderPickTicket {
    managementStructureHeader: any[];
    salesOrder: ISalesOrder;
    parts: ISalesOrderPart[];
  

    constructor() {

        this.parts = [];
        this.managementStructureHeader = [];
    }

   

}