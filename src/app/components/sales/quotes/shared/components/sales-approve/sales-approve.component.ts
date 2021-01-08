import { Component, Input, ViewChild, ElementRef } from "@angular/core";
// import { ISalesOrderQuoteApproverList } from '../../../../../../models/sales/ISalesOrderQuoteApproverList';
// import { SalesOrderQuoteApproverList } from '../../../../../../models/sales/SalesOrderQuoteApproverList';
// import { ISalesOrderQuote } from "../../../../../../models/sales/ISalesOrderQuote";
// import { SalesQuoteService } from "../../../../../../services/salesquote.service";
// import { EmployeeService } from '../../../../../../services/employee.service';
// import { AuthService } from '../../../../../../services/auth.service';
// import { ISalesQuote } from "../../../../../../models/sales/ISalesQuote.model";
// import { ISalesQuoteView } from "../../../../../../models/sales/ISalesQuoteView";
// import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
// import { AlertService, MessageSeverity } from "../../../../../../services/alert.service";
// import { ISalesOrderView } from "../../../../../../models/sales/ISalesOrderView";
// import { SalesOrderService } from "../../../../../../services/salesorder.service";
import { WorkOrderQuoteService } from "../../../../../../services/work-order/work-order-quote.service";
// import { ActivatedRoute } from "@angular/router";
// import { WorkOrderService } from "../../../../../../services/work-order/work-order.service";
import { MarginSummary } from "../../../../../../models/sales/MarginSummaryForSalesorder";
import { SOQuoteMarginSummary } from "../../../../../../models/sales/SoQuoteMarginSummary";


@Component({
  selector: "app-sales-approve",
  templateUrl: "./sales-approve.component.html",
  styleUrls: ["./sales-approve.component.css"]
})
export class SalesApproveComponent {
  approvers: any[] = [];
  constructor(public workOrderService: WorkOrderQuoteService) {

  }

  refresh(marginSummary: SOQuoteMarginSummary) {
    this.workOrderService.getInternalApproversList(6, marginSummary.netSales)
      .subscribe(
        (res) => {
          this.approvers = res;
        }
      )
  }
}