import { IExchangeSalesOrder } from './IExchangeSalesOrder.model';
import { IPriority } from './IPriority';
import { ISalesQuoteType } from '../sales/ISalesQuoteType';
import { ICustomerType } from '../sales/ICustomerType';
import { ICreditTerm } from '../sales/ICreditTerm';
import { ISalesProbablity } from '../sales/ISalesProbablity';
import { ILeadSource } from '../sales/ILeadSource';
import { IStatus } from "../sales/IStatus";
import { IExchangeSalesOrderPart } from './IExchangeSalesOrderPart';
//import { ISalesOrderApproverList } from './ISalesOrderApproverList';


export interface IExchangeSalesOrderView {
    salesOrder: IExchangeSalesOrder;
    // approverList: ISalesOrderApproverList[];
    parts: IExchangeSalesOrderPart[];
    priorities: IPriority[];
    salesQuoteTypes: ISalesQuoteType[];
    customerTypes: ICustomerType[];
    creditTerms: ICreditTerm[];
    salesProbablity: ISalesProbablity[];
    leadSources: ILeadSource[];
    status: IStatus[];
}