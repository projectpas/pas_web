import { ISalesOrderCustomerApproval } from './isales-order-customer-approval';

export class SalesOrderCustomerApproval implements ISalesOrderCustomerApproval {
    salesOrderId: number;
    salesOrderNumber: string;
    version: number;
    versionNumber: string;
    salesOrderPartId: number;
    itemMasterId: number;
    partNumber: string;
    partDescription: string;
    openDate?: Date;
    createdOn?: Date;
    approvedDate?: Date;
    statusChangeDate: Date;
    salesOrderCustomerApproverId?: number;
    approvedContactId?: number;
    approver: string;
    approvedName: string;
    title: string;
    approvalDate?: Date;
    memo: string;
    statusId: number;
    stockLineId: number;
    methodType: string;
    createdBy: string;
    updatedBy: string;
    masterCompanyId: number;
    customerSentDate?: Date;
    internalApprovedBy: string;
    internalApprovedDate?: Date;
    internalMemo: string;
    internalSentDate?: Date;
    marginAmount: number;
    marginAmountExtended: number;
    customerApprovedDate?: Date;
    salesOrderQuotePartId: number;
    actionStatus: string;
}