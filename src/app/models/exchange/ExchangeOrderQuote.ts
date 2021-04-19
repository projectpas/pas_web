import { IExchangeOrderQuote } from "./IExchangeOrderQuote";

export class ExchangeOrderQuote implements IExchangeOrderQuote {
    exchangeQuoteId: number;
	type: any;
	typeName: string;
	exchangeQuoteNumber: string;
	customerReference: string;
	openDate: Date;
	quoteExpireDate: Date;
	versionNumber: string;
	versionDate: Date;
	priorityId: number;
	statusId: number;
	statusName: string;
	statusChangeDate: Date;
	customerId: number;
	customerName: string;
	customerContactId: number;
	customerCode:string;
	creditLimit: number;
	creditTermId: number;
	creditLimitName: string;
	creditTermName: string;
	balanceDue: number;
	customerRequestDate: Date;
	promiseDate: Date;
	estimateShipDate: Date;
	salesPersonId: number;
	salesPersonName: string;
	approvedById: number;
	approvedByName: string;
	approvedDate: Date;
	masterCompanyId:number;
	managementStructureId:number;
	customerServiceRepId: number;
	createdBy: string;
    createdOn: string;
    updatedBy: string;
	updatedOn: string;
	restrictPMA: boolean;
	restrictDER: boolean;
	cogs:number;
	daysForCoreReturn:number;
	employeeId:number;
    constructor() { }
}