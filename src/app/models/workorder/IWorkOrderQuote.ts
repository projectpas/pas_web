import { IPriority } from "./../sales/IPriority";
import { ILeadSource } from "./../sales/ILeadSource";
import { IStatus } from "./../sales/IStatus";

export interface IWOrkOrderQuote {
  workOrderQuoteId: number;
  workOrderTypeId: number;
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
  workOrderQuoteNumber: string;
  workOrderNumber: string;
  versionNumber: string;
  customerHold: number;
  depositAmount: number;
  balanceDue: number;
  priorities: IPriority[];
  leadSources: ILeadSource[];
  status: IStatus[];
  qtyRequested: number;
  qtyToBeQuoted: number;
  statusName: string;
  isApproved: boolean;
}