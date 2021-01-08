export interface ISalesOrderCopyParameters {
    customerId: number;
    salesOrderId: number;
    copyParts: boolean;
    copyInternalApprovals: boolean;
}