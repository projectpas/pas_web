import { IPriority } from "./IPriority";
import { ISalesQuoteType } from "../sales/ISalesQuoteType";
import { ICustomerType } from "../sales/ICustomerType";

export interface IExchangeSalesOrder {
  exchangeSalesOrderId: number;
  exchangeSalesOrderNumber: string;
  typeId: number;
  openDate: string;
  customerRequestDate: string;
  promisedDate: string;
  estimatedShipDate: string;
  shippedDate: string;
  numberOfItems: number;
  priorityId: number;
  accountTypeId: number;
  customerId: number;
  customerName: string;
  customerCode: string;
  customerContactId: number;
  customerContactName: string;
  customerReferenceId: number;
  customerReference: string;
  contractReferenceId: number;
  contractReferenceName: string;
  contractReference: string;
  salesPersonId: number;
  salesPersonName: string;
  agentId: number;
  agentName: string;
  customerSeviceRepId: number;
  customerServiceRepName: string;
  employeeId: number;
  eployeeName: string;
  restrictPMA: boolean;
  restrictDER: boolean;
  approvedById: number;
  approvedByName: string;
  approvedDate: string;
  currencyId: number;
  customerWarningId: number;
  warningName: string;
  creditLimit: number;
  creditTermId: number;
  managementStructureId: number;
  totalSalesAmount: number;
  customerHold: number;
  depositAmount: number;
  balanceDue: number;
  statusId: number;
  statusName: string;
  statusChangeDate: Date;
  memo: string;
  notes: string;
  shipToSiteName: string;
  shipToAddress1: string;
  shipToAddress2: string;
  shipToAddress3: string;
  shipToCity: string;
  shipToState: string;
  shipToPostalCode: string;
  shipToCountry: string;
  shipToCountryId: number;
  billToCountryId: number
  shipToContactId: number;
  shipToContactName: string;
  shipViaId: number;
  shipViaName: string;
  shipViaShippingAccountInfo: string;
  shippingId: string;
  shippingURL: string;
  shipViaMemo: string;
  shipViaShippingURL: string;
  billToSiteName: string;
  billToAddress1: string;
  billToAddress2: string;
  billToAddress3: string;
  billToCity: string;
  billToState: string;
  billToPostalCode: string;
  billToCountry: string;
  billToContactId: number;
  billToContactName: string;
  billToMemo: string;
  shipToUserTypeId: number;
  shipToUserId: number;
  shipToAddressId: number;
  billToUserTypeId: number;
  billToUserId: number;
  billToAddressId: number;
  masterCompanyId: number;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  isDeleted: boolean;
  exchangeQuoteId: number;
  exchangeQuoteNumber: string;
  priorities: IPriority[];
  salesQuoteTypes: ISalesQuoteType[];
  customerTypes: ICustomerType[];
  // creditTerms: ICreditTerm[];
  // salesProbablity: ISalesProbablity[];
  // leadSources: ILeadSource[];
  isApproved: boolean;
  sOPickTicketNumber: string;
  sOPickTicketBarcode: string;
  salesOrderQuoteVersionNumber: string;
  buId: number;
  divisionId: number;
  departmentId: number;
}