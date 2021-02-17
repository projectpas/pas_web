import { IPriority } from "./IPriority";
import { ISalesQuoteType } from "./ISalesQuoteType";
import { ICustomerType } from "./ICustomerType";
import { ICreditTerm } from "./ICreditTerm";
import { ISalesProbablity } from "./ISalesProbablity";
import { ILeadSource } from "./ILeadSource";
import { IStatus } from "./IStatus";

export interface ISalesQuote {
  salesOrderQuoteId: number;
  quoteTypeId: number;

  openDate: Date;

  customerRequestDate: Date;

  customerPromisedDate: Date;

  estimatedShipDate: Date;

  shippedDate: Date;

  numberOfItems: number;

  validForDays: number;

  quoteExpiryDate: Date;

  priorityId: number;

  accountTypeId: number;

  customerId: number;

  customerName: string;

  customerEmail: string;

  customerCode: string;

  customerContactId: number;

  customerContactName: string;

  customerReferenceId: number;

  customerReferenceName: string;

  contractReferenceId: number;
  masterCompanyId: number;

  contractReferenceName: string;

  salesPersonId: number;

  salesPersonName: string;

  agentId: number;

  agentName: string;

  customerServiceRepId: number;

  customerServiceRepName: string;

  probabilityId: number;

  leadSourceId: number;

  creditLimit: number;

  creditLimitTermsId: number;

  employeeId: any;

  employeeName: string;

  restrictPMA: boolean;

  restrictDER: boolean;

  quoteApprovedById: number;

  quoteApprovedByName: string;

  approvedDate: Date;

  currencyId: number;

  warningId: number;

  warningName: string;

  memo: string;

  notes: string;

  statusId: number;

  statusChangeDate: Date;

  companyId: number;

  buId: number;

  divisionId: number;

  departmentId: number;

  managementStructureId: number;

  salesOrderQuoteNumber: string;

  salesOrderNumber: string;

  versionNumber: string;

  totalSalesAmount: number;

  customerHold: number;

  depositAmount: number;

  balanceDue: number;

  priorities: IPriority[];

  salesQuoteTypes: ISalesQuoteType[];

  // customerTypes: ICustomerType[];

  // creditTerms: ICreditTerm[];

  // salesProbablity: ISalesProbablity[];

  leadSources: ILeadSource[];

  status: IStatus[];

  qtyRequested: number;

  qtyToBeQuoted: number;

  statusName: string;

  isApproved: boolean;
}
