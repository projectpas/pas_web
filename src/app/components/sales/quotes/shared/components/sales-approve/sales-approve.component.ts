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
import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { CommonService } from "../../../../../../services/common.service";
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
  isSpinnerVisible: boolean= false;
  internalApproversList: any = [];
  apporoverEmailList: string;
  apporoverNamesList: any = [];
  poApprovaltaskId = 6;
  constructor(public salesQuoteService: SalesQuoteService
    ,private commonService: CommonService) {

  }

  refresh(marginSummary: SOQuoteMarginSummary) {
        this.getApproversListById(marginSummary.salesOrderQuoteId);
  }

  getApproversListById(poId) {	
		this.isSpinnerVisible = true;
		if(this.poApprovaltaskId == 0) {
		this.commonService.smartDropDownList('ApprovalTask', 'ApprovalTaskId', 'Name').subscribe(response => { 		        
		if(response) {					
            response.forEach(x => {
                if (x.label.toUpperCase() == "Sales Quote Approval") {
                    this.poApprovaltaskId = x.value;
                }              
			});
			this.getApproversByTask(poId)
		}
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			//this.errorMessageHandler(errorLog);		
		});
		}
		else {
			this.getApproversByTask(poId)
		}
		
	}
	getApproversByTask(poId) {		
		this.isSpinnerVisible = true;
		this.salesQuoteService.approverslistbyTaskId(this.poApprovaltaskId, poId).subscribe(res => {
						 this.internalApproversList = res;
						 this.internalApproversList.map(x => {
							this.apporoverEmailList = x.approverEmails;
							this.apporoverNamesList.push(x.approverName);
						})
						 this.isSpinnerVisible = false;
						},
						err =>{
							 this.isSpinnerVisible = false;
						 });
	}
}