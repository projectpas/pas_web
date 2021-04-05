import { IExchangeOrderQuote } from './IExchangeOrderQuote';
//import { ISalesOrderQuotePart } from './ISalesOrderQuotePart';
import { IPriority } from './IPriority';
import { ICreditTerm } from '../sales/ICreditTerm';
import { IStatus } from "../sales/IStatus";


export interface IExchangeQuoteView {
    //createNewVersion: boolean;
    originalExchangeQuoteId: Number;
    exchangeOrderQuote: IExchangeOrderQuote;
    //parts: ISalesOrderQuotePart[];
    // creditTerms: ICreditTerm[];
    // status: IStatus[];
    // verificationResult;
}