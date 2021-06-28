import { IExchangeSalesOrderPickTicket } from './IExchangeSalesOrderPickTicket';
import { IExchangeSalesOrder } from './IExchangeSalesOrder.model';
import { IExchangeSalesOrderPart } from './IExchangeSalesOrderPart';

export class ExchangeSalesOrderPickTicketView implements IExchangeSalesOrderPickTicket {
    managementStructureHeader: any[];
    salesOrder: IExchangeSalesOrder;
    parts: IExchangeSalesOrderPart[];

    constructor() {
        this.parts = [];
        this.managementStructureHeader = [];
    }
}