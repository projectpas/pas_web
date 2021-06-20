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
  @Input() workOrderPartNoId;
  toDaysDate :any= new Date();
  modal: NgbModalRef;
  isEdit: boolean = false;
  settlementList:any=[];
  loginUser:any={};
  conditionList:any=[];
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
 this.getWorkCompleteDetails();
  }
aSectionClick(event, currentRecord){
console.log("ev",event)
if(event.target.checked==true){
  currentRecord.isMastervalue=true;
  currentRecord.isvalue_NA=false;
}
}
bSectionClick(event,currentRecord){
  if(event.target.checked==true){
    currentRecord.isMastervalue=false;
    currentRecord.isvalue_NA=true;
  }
}
enableSave(){
}
getPNDetails(currentRecord){

}
getWorkCompleteDetails(){
    this.isSpinnerVisible=true;
    this.workOrderService.getWoSettlementDetails(this.workOrderId,this.workOrderPartNoId,this.workFlowWorkOrderId).subscribe(res => {
  
    this.woSettlements=res;
    this.getConditionsList();
   if(this.woSettlements && this.woSettlements.length !=0){
    this.woSettlements.forEach(element => {
      element.userId=this.authService.currentEmployee;
      element.isenableUpdate=false;
    });
   }
    this.isSpinnerVisible=false;
    },err=>{
    this.isSpinnerVisible=false;
    })
}
isenableUpdate:any;
editRow(currentRecord){
  currentRecord.isenableUpdate=true;
}
upDateRow(currentRecord){
  this.isSpinnerVisible=true;
  const newData={...currentRecord}
  newData.userId=newData.userId?newData.userId.employeeId:0;
  this.workOrderService.updateWoSettlements(newData).subscribe(res => {
  this.isSpinnerVisible=false;
  currentRecord.isenableUpdate=false;
  this.settlementList=res;
  },err=>{
  this.isSpinnerVisible=false;
  })
}
openMaterialAudit(data){

}

parsedText(text) {
  if (text) {
      const dom = new DOMParser().parseFromString(
          '<!doctype html><body>' + text,
          'text/html');
      const decodedString = dom.body.textContent;
      return decodedString;
  }
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
}
