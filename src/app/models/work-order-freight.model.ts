

export class Freight {
    taskId: number;
    // carrierId: number;
    shipViaId: number;
    length: number;
    width: number;
    height: number;
    weight: number;
    memo: string;
    amount: number;
    uomId: number;
    dimensionUOMId: number;
    currencyId: number;
    isShowDelete:boolean
    // isFixedFreight: boolean;
    // fixedAmount: number;
    constructor() {
        this.taskId = null;
        // this.carrierId = null;
        this.shipViaId = null;
        this.length = null;
        this.width = null;
        this.height = null;
        this.weight = null;
        this.memo = ''
        this.amount = null;
        this.uomId = null;
        this.dimensionUOMId = null;
        this.currencyId = null;
        this.isShowDelete=true;
        // this.isFixedFreight = false;
        // this.fixedAmount = null;
    }

}