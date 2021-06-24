import { IExchangeSalesOrder } from './IExchangeSalesOrder.model';
import { IExchangeSalesOrderPart } from './IExchangeSalesOrderPart';

export interface IExchangeSalesOrderPickTicket {
    salesOrder: IExchangeSalesOrder;
    parts: IExchangeSalesOrderPart[];
    managementStructureHeader: any[];
}