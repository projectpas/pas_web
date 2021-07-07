import { IExchangeSalesOrderShippingLabel } from "./IExchangeSalesOrderShippingLabel";

export class ExchangeSalesOrderShippingLabelView implements IExchangeSalesOrderShippingLabel {
    SOShippingLabelViewModel: any[];
    
    constructor() {
        this.SOShippingLabelViewModel = [];
    }
}