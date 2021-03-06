import { ISalesOrderQuote } from './ISalesOrderQuote';
import { ISalesOrderQuoteApproverList } from './ISalesOrderQuoteApproverList';
import { ISalesQuoteView } from './ISalesQuoteView';
import { ISalesOrderQuotePart } from './ISalesOrderQuotePart';
import { IPriority } from './IPriority';
import { ISalesQuoteType } from './ISalesQuoteType';
import { ICustomerType } from './ICustomerType';
import { ICreditTerm } from './ICreditTerm';
import { ISalesProbablity } from './ISalesProbablity';
import { ILeadSource } from './ILeadSource';
import { IStatus } from "./IStatus";


export class SalesQuoteView implements ISalesQuoteView {
    createNewVersion: boolean;
    originalSalesOrderQuoteId: Number;
    salesOrderQuote: ISalesOrderQuote;
    // approverList: ISalesOrderQuoteApproverList[];
    parts: ISalesOrderQuotePart[]
    priorities: IPriority[];
    salesQuoteTypes: ISalesQuoteType[];
    customerTypes: ICustomerType[];
    creditTerms: ICreditTerm[];
    salesProbablity: ISalesProbablity[];
    leadSources: ILeadSource[];
    status: IStatus[];
    verificationResult;
}