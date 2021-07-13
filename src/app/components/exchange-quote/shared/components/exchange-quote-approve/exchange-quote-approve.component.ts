import { Component, OnInit } from '@angular/core';
import { ExchangequoteService } from "../../../../../services/exchangequote.service";
import { CommonService } from "../../../../../services/common.service";
import { AuthService } from "../../../../../services/auth.service";
//import { MarginSummary } from "../../../../../../models/sales/MarginSummaryForSalesorder";
//import { SOQuoteMarginSummary } from "../../../../../../models/sales/SoQuoteMarginSummary";
@Component({
  selector: 'app-exchange-quote-approve',
  templateUrl: './exchange-quote-approve.component.html',
  styleUrls: ['./exchange-quote-approve.component.scss']
})
export class ExchangeQuoteApproveComponent {
  approvers: any[] = [];
  isSpinnerVisible: boolean = false;
  internalApproversList: any = [];
  apporoverEmailList: string;
  apporoverNamesList: any = [];
  poApprovaltaskId = 7;
  constructor(public exchangequoteService: ExchangequoteService
    , private commonService: CommonService, private authService: AuthService) { }

  ngOnInit() {
  }

  refresh(exchangeQuoteId) {
    this.getApproversListById(exchangeQuoteId);
  }

  getApproversListById(poId) {
    this.isSpinnerVisible = true;
    if (this.poApprovaltaskId == 0) {
      this.commonService.smartDropDownList('ApprovalTask', 'ApprovalTaskId', 'Name', 0).subscribe(response => {
        if (response) {
          response.forEach(x => {
            if (x.label.toUpperCase() == "Exchange Quote Approval") {
              this.poApprovaltaskId = x.value;
            }
          });
          this.getApproversByTask(poId)
        }
      }, err => {
        this.isSpinnerVisible = false;
        const errorLog = err;
        //this.errorMessageHandler(errorLog);		
      });
    }
    else {
      this.getApproversByTask(poId);
    }

  }
  getApproversByTask(poId) {
    this.isSpinnerVisible = true;
    this.exchangequoteService.approverslistbyTaskId(this.poApprovaltaskId, poId).subscribe(res => {
      this.internalApproversList = res;
      this.internalApproversList.map(x => {
        this.apporoverEmailList = x.approverEmails;
        this.apporoverNamesList.push(x.approverName);
      })
      this.isSpinnerVisible = false;
    },
      err => {
        this.isSpinnerVisible = false;
      });
  }

}
