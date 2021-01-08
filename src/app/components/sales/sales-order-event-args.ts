import { SalesOrderActionType } from "./sales-order-actions-emuns";
import { SalesOrderConfirmationType } from "./sales-confirmation-type.enum";

export class SalesOrderEventArgs {
    constructor(public actionType: SalesOrderActionType, public confirmType: SalesOrderConfirmationType) { }
}