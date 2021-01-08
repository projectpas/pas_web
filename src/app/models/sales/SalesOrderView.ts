import { ISalesOrderQuoteApproverList } from './ISalesOrderQuoteApproverList';
import { ISalesOrderView } from './ISalesOrderView';
import { IPriority } from './IPriority';
import { ISalesQuoteType } from './ISalesQuoteType';
import { ICustomerType } from './ICustomerType';
import { ICreditTerm } from './ICreditTerm';
import { ISalesProbablity } from './ISalesProbablity';
import { ILeadSource } from './ILeadSource';
import { IStatus } from "./IStatus";
import { ISalesOrder } from './ISalesOrder.model';
import { ISalesOrderPart } from './ISalesOrderPart';
import { SalesOrder } from './SalesOrder.model';
import { ISalesOrderApproverList } from './ISalesOrderApproverList';
import { SalesOrderApproverList } from './SalesOrderApproverList';


export class SalesOrderView implements ISalesOrderView {
    salesOrder: ISalesOrder;
    // approverList: ISalesOrderApproverList[];
    parts: ISalesOrderPart[]
    priorities: IPriority[];
    salesQuoteTypes: ISalesQuoteType[];
    customerTypes: ICustomerType[];
    creditTerms: ICreditTerm[];
    salesProbablity: ISalesProbablity[];
    leadSources: ILeadSource[];
    status: IStatus[];

    constructor() {

        this.salesOrder = new SalesOrder();

        // this.approverList = this.getDefaultApproversList();

        this.parts = [];

        this.priorities = [];

        this.salesQuoteTypes = [];

        this.customerTypes = [];

        this.creditTerms = [];

        this.leadSources = [];

        this.status = [];
    }

    // private getDefaultApproversList(): ISalesOrderApproverList[] {

    //     var approverList: ISalesOrderApproverList[] = [];

    //     for (var i = 1; i <= 5; i++) {
    //         approverList.push(new SalesOrderApproverList());
    //     }

    //     return approverList;
    // }

}