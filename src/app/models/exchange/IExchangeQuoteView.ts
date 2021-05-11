import { IExchangeOrderQuote } from './IExchangeOrderQuote';
import { IExchangeQuotePart } from './IExchangeQuotePart';
import { IPriority } from './IPriority';
import { ICreditTerm } from '../sales/ICreditTerm';
import { IStatus } from "../sales/IStatus";


export interface IExchangeQuoteView {
    //createNewVersion: boolean;
    originalExchangeQuoteId: Number;
    exchangeOrderQuote: IExchangeOrderQuote;
    parts: IExchangeQuotePart[];
    // creditTerms: ICreditTerm[];
    // status: IStatus[];
    verificationResult;
}