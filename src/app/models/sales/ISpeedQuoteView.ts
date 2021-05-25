import { ISalesOrderQuotePart } from './ISalesOrderQuotePart';
import { ISpeedQuotePart } from './ISpeedQuotePart';
import { IPriority } from './IPriority';
import { ISalesQuoteType } from './ISalesQuoteType';
import { ICustomerType } from './ICustomerType';
import { ICreditTerm } from './ICreditTerm';
import { ISalesProbablity } from './ISalesProbablity';
import { ILeadSource } from './ILeadSource';
import { IStatus } from "./IStatus";
import { ISpeedQte } from './ISpeedQte';

export interface ISpeedQuoteView {
    createNewVersion: boolean;
    originalSalesOrderQuoteId: Number;
    speedQuote: ISpeedQte;
    parts: ISpeedQuotePart[];
    priorities: IPriority[];
    salesQuoteTypes: ISalesQuoteType[];
    customerTypes: ICustomerType[];
    creditTerms: ICreditTerm[];
    salesProbablity: ISalesProbablity[];
    leadSources: ILeadSource[];
    status: IStatus[];
    verificationResult;
}