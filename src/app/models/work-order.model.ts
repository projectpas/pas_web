export class WorkOrder {
    iD: number;
    workOrderNum: string;
    isSinglePN: boolean;
    workOrderTypeId: number;
    openDate: Date;
    //customerRequestDate: Date;
    //promiseDate: Date;
    //estimatedCompletionDate: Date;
    //estimatedShipDate: Date;
    //quantity: number;
    customerId: number;
    isContractAvl: boolean;
    contract: string;
    customerContactId: number;
    creditTermsId: number;
    creditLimit: number;
    workOrderPriorityId: number;
    workOrderStatusId: number;
    employeeId: number;
    salesPerson: string;
    masterCompanyId: number;
}