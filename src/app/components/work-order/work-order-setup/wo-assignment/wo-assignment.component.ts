import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
declare var $: any;
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonService } from "../../../../services/common.service";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { AuditComponentComponent } from '../../../../../app/shared/components/audit-component/audit-component.component';
@Component({
  selector: 'app-wo-assignment',
  templateUrl: './wo-assignment.component.html',
  styleUrls: ['./wo-assignment.component.scss'],
  encapsulation: ViewEncapsulation.None

})
/** WorkOrderDocuments component*/
export class WorkOrderAssignmentComponent implements OnChanges, OnInit {
  @Input() isWorkOrder;
  @Output() refreshData = new EventEmitter();
  @Input() isView: boolean = false;
  @Input() workOrderId;
  @Input() workFlowWorkOrderId;
  @Input() workOrderPartNoId;
  toDaysDate :any= new Date();
  modal: NgbModalRef;
  isEdit: boolean = false;
  settlementList:any=[];
  loginUser:any={};
  conditionList:any=[];
  isWOClose:any;
  constructor(private workOrderService: WorkOrderService, private authService: AuthService,
    private alertService: AlertService, private modalService: NgbModal, private cdRef: ChangeDetectorRef, private commonService: CommonService) {
  }
  isSpinnerVisible: boolean = false;
  woSettlements:any=[];
  ngOnChanges() { 
  }
  ngOnInit() {
  }
enableSave(){
}
getPNDetails(currentRecord){

}
memoIndex:any;
textAreaInfo:any;
disableEditor: any = true;
onAddTextAreaInfo(currentRecord, index) {
    this.disableEditor = true;
    this.memoIndex = index;
    this.textAreaInfo = currentRecord.memo;
}
onSaveTextAreaInfo(memo) {
    if (memo) {
        this.textAreaInfo = memo;
        this.woSettlements[this.memoIndex].memo = this.textAreaInfo;
        if(this.woSettlements[this.memoIndex].workOrderSettlementName =='Mat Required = Mat Issued'){
          this.woSettlements[this.memoIndex].isenableUpdate=true;
        }
    }
    this.disableEditor = true;
    $("#textarea-popup").modal("hide");
    // this.disableUpdateButton = false;
}
onCloseTextAreaInfo() {
    this.disableEditor = true;
    $("#textarea-popup").modal("hide");
}
editorgetmemo(ev) {
  this.disableEditor = false;
}
get currentUserMasterCompanyId(): number {
  return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
}
getConditionsList() {
  this.isSpinnerVisible = true;
  let conditionIds = [];
  if ( this.woSettlements &&  this.woSettlements.length !=0) {
      this.woSettlements.forEach(acc => {
          conditionIds.push(acc.conditionId);
      })
  }else{
      conditionIds.push(0)
  }
  this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description', '', true,  0, conditionIds,this.currentUserMasterCompanyId)
      .subscribe(res => {
          this.isSpinnerVisible = false;
          this.conditionList = res
      }, error => {
          this.isSpinnerVisible = false;
      });
}

checkValidation() {
  var result = true;
if(this.woSettlements &&    this.woSettlements.length !=0){
  this.woSettlements.forEach(
      data => {
        if (data.isenableUpdate==true) { 
             result = false;
         
        }
      })
}
  return result;
}

getAuditHistoryById(rowData) {
  this.isSpinnerVisible=true;
    this.workOrderService.getWorkCompleteHistory(rowData.workOrderSettlementDetailId).subscribe(res => {
      this.isSpinnerVisible=false;
      this.historyData = res.reverse();
      this.auditHistoryHeaders=this.auditHistoryHeaders;
 
this.triggerHistory();
    },err=>{
      this.isSpinnerVisible=false;
    })
}
historyData:any=[];
isCloseWo:boolean=false;
auditHistoryHeaders = [
  { field: 'isMastervalue', header: 'Task Action' ,isRequired:false,isCheckbox:true,isDate:false},
  { field: 'workOrderSettlementName', header: 'Task' ,isRequired:false,isCheckbox:false,isDate:false},
  { field: 'conditionName', header: 'Condition',isRequired:false,isCheckbox:false,isDate:false },
  { field: 'isvalue_NA', header: 'NA',isRequired:false,isCheckbox:true,isDate:false },
  { field: 'memo', header: 'Memo',isRequired:false,isCheckbox:false,isDate:false },
  { field: 'userName', header: 'User',isRequired:false,isCheckbox:false,isDate:false },
  { field: 'createdDate', header: 'Date/Time',isRequired:false,isCheckbox:false,isDate:true }, 
  { field: 'createdDate', header: 'Created Date',isRequired:false,isCheckbox:false,isDate:true },
  { field: 'createdBy', header: 'Created By',isRequired:false,isCheckbox:false,isDate:false },
  { field: 'updatedDate', header: 'Updated Date',isRequired:false,isCheckbox:false,isDate:true },
  { field: 'updatedBy', header: 'Updated By',isRequired:false,isCheckbox:false,isDate:false },
]
triggerHistory(){

  this.modal = this.modalService.open(AuditComponentComponent, { size: 'lg', backdrop: 'static', keyboard: false,windowClass: 'assetMange' });
    this.modal.componentInstance.auditHistoryHeader = this.auditHistoryHeaders;
    this.modal.componentInstance.auditHistory = this.historyData;

  }
  // closeWo(){
  //   $('#closeWoPopUp').modal('hide');   
  // }
  closeWo(ev){ 
    if (ev.target.checked) {
        $('#closeWoPopUp').modal('show'); 

    }else{
        $('#closeWoPopUp').modal('show');   
    }  
}
get userName(): string {
  return this.authService.currentUser ? this.authService.currentUser.userName : "";
}
closeSaveWorkOrder( ){ 
  
  this.workOrderService.closeWoSettlements(this.workOrderId,this.workOrderPartNoId,this.userName).subscribe(res => 
  {
  })

}
}
