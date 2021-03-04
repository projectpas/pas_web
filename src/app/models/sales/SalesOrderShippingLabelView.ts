import { ISalesOrderShippingLabel } from "./ISalesOrderShippingLabel";

export class SalesOrderShippingLabelView implements ISalesOrderShippingLabel {
    SOShippingLabelViewModel: any[];
    
    constructor() {
        this.SOShippingLabelViewModel = [];
    }
}