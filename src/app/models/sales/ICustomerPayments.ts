import { IPriority } from "./IPriority";
import { ISalesQuoteType } from "./ISalesQuoteType";
import { ICustomerType } from "./ICustomerType";

export interface ICustomerPayments {
  receiptId: number;
  receiptNo: string;
  bankName: string;
  bankAcctNum: string;
  depositDate: Date;
  acctingPeriod: string;
  amount: number;
  amtApplied: number;
  amtRemaining: number;
  reference: string;
  cntrlNum: string;
  managementStructureId: number;
  openDate: Date;
  status: string;
  postedDate: Date;
  employeeId: number;
  memo: string;
  masterCompanyId: number;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  isActive: boolean;
  isDeleted: boolean;
}