import { ISalesOrder } from './ISalesOrder.model';
import { IPriority } from './IPriority';
import { ISalesQuoteType } from './ISalesQuoteType';
import { ICustomerType } from './ICustomerType';
import { ICreditTerm } from './ICreditTerm';
import { ISalesProbablity } from './ISalesProbablity';
import { ILeadSource } from './ILeadSource';
import { IStatus } from "./IStatus";
import { ISalesOrderPart } from './ISalesOrderPart';
import { ISalesOrderApproverList } from './ISalesOrderApproverList';


export interface ISalesOrderView {
    salesOrder: ISalesOrder;
    // approverList: ISalesOrderApproverList[];
    parts: ISalesOrderPart[];
    priorities: IPriority[];
    salesQuoteTypes: ISalesQuoteType[];
    customerTypes: ICustomerType[];
    creditTerms: ICreditTerm[];
    salesProbablity: ISalesProbablity[];
    leadSources: ILeadSource[];
    status: IStatus[];
}