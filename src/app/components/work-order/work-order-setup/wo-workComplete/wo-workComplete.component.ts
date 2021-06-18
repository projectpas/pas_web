import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
declare var $: any;
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonService } from "../../../../services/common.service";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';

// import { formatNumberAsGlobalSettingsModule } from 'src/app/generic/autocomplete';
@Component({
  selector: 'app-wo-workComplete',
  templateUrl: './wo-workComplete.component.html',
  styleUrls: ['./wo-workComplete.component.scss'],
  encapsulation: ViewEncapsulation.None

})
/** WorkOrderDocuments component*/
export class WorkOrderWorkCompleteComponent implements OnChanges, OnInit {
  @Input() isWorkOrder;
  @Output() refreshData = new EventEmitter();
  @Input() isView: boolean = false;
  @Input() workOrderId;
  @Input() workFlowWorkOrderId;
  modal: NgbModalRef;
  isEdit: boolean = false;
  result:any={};
  constructor(private workOrderService: WorkOrderService, private authService: AuthService,
    private alertService: AlertService, private modalService: NgbModal, private cdRef: ChangeDetectorRef, private commonService: CommonService) {
  }

  isSpinnerVisible: boolean = false;
  woSettlements:any=[
  {'name':'Mat Required = Mat Issued',value:1},
  {'name':'Labor Hrs Entered',value:2},
  {'name':'Put Backs',value:3},
  {'name':'Margin Reviewed',value:4},
  {'name':'WO Act vs. WO Qte Reviewed',value:5},
  {'name':'Cond/Tag Changed',value:6},
  {'name':'8130 Reviewed',value:7}]
  
  ngOnChanges() { 
  }
  ngOnInit() {
//  this.getWOActualVsSummaryData();
  }
//   getWOActualVsSummaryData(){
//     this.isSpinnerVisible=true;
//     this.workOrderService.getWoWorkCompleteData(this.workOrderId,this.workFlowWorkOrderId).subscribe(res => {

// this.isSpinnerVisible=false;

// this.result=res;
//     },err=>{
//       this.isSpinnerVisible=false;
//     })
// }
aSectionClick(event){

}
bSectionClick(event){

}
enableSave(){
  
}
}