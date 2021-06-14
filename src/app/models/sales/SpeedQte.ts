import { ISpeedQte } from "./ISpeedQte";
export class SpeedQte implements ISpeedQte {
    speedQuoteId: number;
    speedQuoteTypeId: number;
    openDate: string;
    customerRequestDate: string;
    promisedDate: string;
    estimatedShipDate: string;
    validForDays: number;
    quoteExpireDate: string;
    priorityId: number;
    accountTypeId: number;
    customerId: number;
    customerContactId: number;
    customerReference: string;
    contractReference: string;
    salesPersonId: number;
    agentId: number;
    agentName: string;
    customerSeviceRepId: number;
    probabilityId: number;
    leadSourceId: number;
    leadSourceReference: string;
    creditLimit: number;
    creditTermId: number;
    employeeId: number;
    restrictPMA: boolean;
    restrictDER: boolean;
    quoteApprovedById: number;
    approvedDate: string;
    currencyId: number;
    customerWarningId: number;
    memo: string | null;
    notes: string | null;
    masterCompanyId: number;
    createdBy: string;
    createdOn: string;
    updatedBy: string;
    updatedOn: string;
    isDeleted: boolean;
    statusId: number;
    statusChangeDate: Date;
    speedQuoteNumber: string;
    versionNumber: string;
    managementStructureId: number;
    qtyRequested: number;
    qtyToBeQuoted: number;
    status: string;
    statusName: string;
    isApproved: boolean;
    buId: number;
    divisionId: number;
    departmentId: number;
    customerName: string;
}