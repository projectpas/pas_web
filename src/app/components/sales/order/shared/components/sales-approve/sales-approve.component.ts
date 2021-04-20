import { Component } from "@angular/core";
import { SalesOrderService } from "../../../../../../services/salesorder.service";
import { MarginSummary } from "../../../../../../models/sales/MarginSummaryForSalesorder";
import { ApprovalTaskEnum } from "../../../../quotes/models/approval-task-enum";

@Component({
    selector: "app-sales-order-approve",
    templateUrl: "./sales-approve.component.html",
    styleUrls: ["./sales-approve.component.css"]
})
export class SalesOrderApproveComponent {
    approvers: any[];
    isSpinnerVisible = false;

    constructor(public salesOrderService: SalesOrderService) {
    }

    refresh(marginSummary: MarginSummary) {
        this.isSpinnerVisible = true;
        this.salesOrderService.approverslistbyTaskId(ApprovalTaskEnum.SOApproval, marginSummary.salesOrderId)
            .subscribe(
                (res) => {
                    this.approvers = res;
                    this.isSpinnerVisible = false;
                }, error => {
                    this.isSpinnerVisible = false;
                })
    }
}