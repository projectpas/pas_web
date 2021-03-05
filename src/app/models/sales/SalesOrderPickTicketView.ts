import { ISalesOrderPickTicket } from './ISalesOrderPickTicket';
import { ISalesOrder } from './ISalesOrder.model';
import { ISalesOrderPart } from './ISalesOrderPart';

export class SalesOrderPickTicketView implements ISalesOrderPickTicket {
    managementStructureHeader: any[];
    salesOrder: ISalesOrder;
    parts: ISalesOrderPart[];

    constructor() {
        this.parts = [];
        this.managementStructureHeader = [];
    }
}