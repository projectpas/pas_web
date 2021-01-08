import { ISalesOrder } from './ISalesOrder.model';
import { ISalesOrderPart } from './ISalesOrderPart';

export interface ISalesOrderPickTicket {
    salesOrder: ISalesOrder;
    parts: ISalesOrderPart[];
    managementStructureHeader: any[];
}