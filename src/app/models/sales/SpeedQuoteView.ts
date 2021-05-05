import { ISalesOrderQuotePart } from './ISalesOrderQuotePart';
import { IPriority } from './IPriority';
import { ISalesQuoteType } from './ISalesQuoteType';
import { ICustomerType } from './ICustomerType';
import { ICreditTerm } from './ICreditTerm';
import { ISalesProbablity } from './ISalesProbablity';
import { ILeadSource } from './ILeadSource';
import { IStatus } from "./IStatus";
import { ISpeedQuoteView } from './ISpeedQuoteView';
import { ISpeedQte } from './ISpeedQte';

export class SpeedQuoteView implements ISpeedQuoteView {
    createNewVersion: boolean;
    originalSalesOrderQuoteId: Number;
    speedQuote: ISpeedQte;
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