import { IPickTicketParameter } from './IPickTicketParameter';

export class PickTicketParameter implements IPickTicketParameter {
    customerId: number;
    referenceId: number;
    copyParts: boolean;
    copyInternalApprovals: boolean;

    constructor() {
        this.copyParts = true;
        this.copyInternalApprovals = true;
    }
}
