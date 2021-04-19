//import { IPriority } from "../sales/IPriority";

export interface IExchangeQuote {
//export interface IExchangOrdereQuote {
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
	restrictPMA: boolean;
	restrictDER: boolean;
	cogs:number;
	daysForCoreReturn:number;
	employeeId:number;
}
