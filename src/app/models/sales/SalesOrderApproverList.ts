import { ISalesOrderApproverList } from './ISalesOrderApproverList';

export class SalesOrderApproverList implements ISalesOrderApproverList {
    salesOrderQuoteApproverListId: number;
    salesOrderQuoteId: number;
    employeeId: number;
    firstName: string;
    lastName: string;
    employeeCode: string;
    email: string;
    level: number;
    statusId: number;
    masterCompanyId: number;
    createdBy: string;
    updatedBy: string;
    createdDate: number;
    updatedDate: number;

    constructor() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.employeeCode = '';
    }
}