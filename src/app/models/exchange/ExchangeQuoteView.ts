import { IExchangeOrderQuote } from './IExchangeOrderQuote';
import { IExchangeQuotePart } from './IExchangeQuotePart';
import { IPriority } from './IPriority';
import { ICreditTerm } from '../sales/ICreditTerm';
import { IStatus } from "../sales/IStatus";
import { IExchangeQuoteView } from './IExchangeQuoteView';


export class ExchangeQuoteView implements IExchangeQuoteView {
    //createNewVersion: boolean;
    originalExchangeQuoteId: Number;
    exchangeOrderQuote: IExchangeOrderQuote;
    parts: IExchangeQuotePart[];
    // creditTerms: ICreditTerm[];
    // status: IStatus[];
    // verificationResult;
}