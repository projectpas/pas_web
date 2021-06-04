//import { ISalesOrderQuoteApproverList } from './ISalesOrderQuoteApproverList';
import { IExchangeSalesOrderView } from './IExchangeSalesOrderView';
import { IPriority } from './IPriority';
import { ISalesQuoteType } from '../sales/ISalesQuoteType';
import { ICustomerType } from '../sales/ICustomerType';
import { ICreditTerm } from '../sales/ICreditTerm';
import { ISalesProbablity } from '../sales/ISalesProbablity';
import { ILeadSource } from '../sales/ILeadSource';
import { IStatus } from "../sales/IStatus";
import { IExchangeSalesOrder } from './IExchangeSalesOrder.model';
import { IExchangeSalesOrderPart } from './IExchangeSalesOrderPart';
import { ExchangeSalesOrder } from './ExchangeSalesOrder.model';
//import { ISalesOrderApproverList } from './ISalesOrderApproverList';
//import { SalesOrderApproverList } from './SalesOrderApproverList';


export class ExchangeSalesOrderView implements IExchangeSalesOrderView {
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

    constructor() {

        this.salesOrder = new ExchangeSalesOrder();

        // this.approverList = this.getDefaultApproversList();

        this.parts = [];

        this.priorities = [];

        this.salesQuoteTypes = [];

        this.customerTypes = [];

        this.creditTerms = [];

        this.leadSources = [];

        this.status = [];
    }
}