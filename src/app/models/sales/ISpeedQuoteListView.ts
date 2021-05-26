export interface ISpeedQuoteListView {
    speedQuoteId: number;
    quoteDate: string;
    versionNumber: string;
    customerId: number;
    customerName: string;
    customerCode: string;
    status: string;
    salesPrice: number;
    cost: number;
    numberOfItems: number;
    createdDate: Date;
    updatedDate: Date;
    createdBy: string;
    updatedBy: string;
}