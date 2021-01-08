import { Component, Input, ElementRef, ViewChild } from "@angular/core";
import { ISalesOrderView } from "../../../../../../models/sales/ISalesOrderView";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ISalesQuote } from "../../../../../../models/sales/ISalesQuote.model";
import { AlertService, MessageSeverity } from "../../../../../../services/alert.service";
import { SalesOrderService } from "../../../../../../services/salesorder.service";
import { EmployeeService } from "../../../../../../services/employee.service";
import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { AuthService } from "../../../../../../services/auth.service";
import { WorkOrderQuoteService } from "../../../../../../services/work-order/work-order-quote.service";
import { ActivatedRoute } from "@angular/router";
import { ISalesQuoteView } from "../../../../../../models/sales/ISalesQuoteView";
import { ISalesOrder } from "../../../../../../models/sales/ISalesOrder.model";
import { MarginSummary } from "../../../../../../models/sales/MarginSummaryForSalesorder";

@Component({
    selector: "app-sales-order-approve",
    templateUrl: "./sales-approve.component.html",
    styleUrls: ["./sales-approve.component.css"]
})
export class SalesOrderApproveComponent {

    approvers: any[];
    constructor(public workOrderService: WorkOrderQuoteService) {

    }

    refresh(marginSummary: MarginSummary) {
        this.workOrderService.getInternalApproversList(5, marginSummary.netSales)
            .subscribe(
                (res) => {
                    this.approvers = res;
                }
            )
    }
}