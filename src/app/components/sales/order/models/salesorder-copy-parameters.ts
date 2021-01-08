import { ISalesOrderCopyParameters } from './isalesorder-copy-parameters';

export class SalesOrderCopyParameters implements ISalesOrderCopyParameters {
    customerId: number;
    salesOrderId: number;
    copyParts: boolean;
    copyInternalApprovals: boolean;

    constructor() {
        this.copyParts = true;
        this.copyInternalApprovals = true;
    }
}