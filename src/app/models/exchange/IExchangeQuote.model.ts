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
	customerServiceRepName: string;
	restrictPMA: boolean;
	restrictDER: boolean;
	cogs:number;
	daysForCoreReturn:number;
	employeeId:any;
	isApproved: boolean;
	validForDays:number;
	probabilityId: number;
	leadSourceId: number;
	warningId: number;
	warningName: string;
	companyId: number;
	buId: number;
	divisionId: number;
	departmentId: number;
	memo: string;
	notes: string;
	accountTypeId: number;
	contractReference: string;
	contractReferenceName: string;
}
