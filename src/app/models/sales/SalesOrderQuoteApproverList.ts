import { ISalesOrderQuoteApproverList } from "./ISalesOrderQuoteApproverList";

export class SalesOrderQuoteApproverList implements ISalesOrderQuoteApproverList {
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