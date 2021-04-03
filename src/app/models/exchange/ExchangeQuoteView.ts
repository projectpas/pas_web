import { IExchangeOrderQuote } from './IExchangeOrderQuote';
//import { ISalesOrderQuotePart } from './ISalesOrderQuotePart';
import { IPriority } from './IPriority';
import { ICreditTerm } from '../sales/ICreditTerm';
import { IStatus } from "../sales/IStatus";
import { IExchangeQuoteView } from './IExchangeQuoteView';


export class ExchangeQuoteView implements IExchangeQuoteView {
    //createNewVersion: boolean;
    originalExchangeQuoteId: Number;
    exchangeOrderQuote: IExchangeOrderQuote;
    //parts: ISalesOrderQuotePart[];
    // creditTerms: ICreditTerm[];
    // status: IStatus[];
    // verificationResult;
}