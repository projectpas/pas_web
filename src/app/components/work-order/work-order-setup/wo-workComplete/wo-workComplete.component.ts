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
  isWOClose:any;
  constructor(private workOrderService: WorkOrderService, private authService: AuthService,
    private alertService: AlertService, private modalService: NgbModal, private cdRef: ChangeDetectorRef, private commonService: CommonService) {
  }
  isSpinnerVisible: boolean = false;
  woSettlements:any=[];
  // woSettlements:any=[
  // {'name':'Mat Required = Mat Issued',value:1},
  // {'name':'Labor Hrs Entered',value:2},
  // {'name':'Put Backs',value:3},
  // {'name':'Margin Reviewed',value:4},
  // {'name':'WO Act vs. WO Qte Reviewed',value:5},
  // {'name':'Cond/Tag Changed',value:6},
  // {'name':'8130 Reviewed',value:7}]
  ngOnChanges() { 
  }
  ngOnInit() {
 this.getWorkCompleteDetails();
  }
aSectionClick(event, currentRecord){
if(event.target.checked==true){
  currentRecord.isMastervalue=true;
  currentRecord.isvalue_NA=false;
  
}
if(currentRecord.isMastervalue==true || currentRecord.isvalue_NA==true){
  currentRecord.closeWO=true;
}
else
  {
    currentRecord.closeWO=false;
  }
this.onchangecheck();
}
bSectionClick(event,currentRecord){
  if(event.target.checked==true){
    currentRecord.isMastervalue=false;
    currentRecord.isvalue_NA=true;
    
  }

  if(currentRecord.isMastervalue==true || currentRecord.isvalue_NA==true){
    currentRecord.closeWO=true;
  }else
  {
    currentRecord.closeWO=false;
  }
  this.onchangecheck();
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
      element.userName=this.authService.currentEmployee.name;
      element.isenableUpdate=false;
      element.sattlement_DateTime=this.toDaysDate;
      if(element.isMastervalue==true || element.isvalue_NA==true){
        element.closeWO=true;
      }
    });
    this.onchangecheck();
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
onchangecheck()
{
  const newData=[...  this.woSettlements];
  const arrayWithFilterObjects= newData.filter((o) => o.closeWO === true);
  if((arrayWithFilterObjects && arrayWithFilterObjects.length)==(newData&&newData.length)){
    this.isWOClose=true;
  }else{
    this.isWOClose=false
  }
}

upDateSettlemts( ){

  const newData=[...  this.woSettlements];
  newData.forEach(element => {
    element.userId=element.userId?element.userId.employeeId:0;
    element.conditionId= element.conditionId ==0 ? null :element.conditionId
    element.updatedDate=this.toDaysDate;
    element.updatedBy= this.userName;
  });
  // newData[0].closeWO=true;
  // newData.forEach(element => {
  //   if(element.closeWO==false){
  //     this.isWOClose=false
  //   }
  // });
  const arrayWithFilterObjects= newData.filter((o) => o.closeWO === true);
  if((arrayWithFilterObjects && arrayWithFilterObjects.length)==(newData&&newData.length)){
    this.isWOClose=true;
  }else{
    this.isWOClose=false
  }
  this.isSpinnerVisible=true;
  this.workOrderService.updateWoSettlements(newData,this.isWOClose).subscribe(res => {
    this.woSettlements.forEach(element => {
      element.userId=this.authService.currentEmployee;
      element.isenableUpdate=false;
      element.sattlement_DateTime=this.toDaysDate;
      if(element.isMastervalue==true || element.isvalue_NA==true){
        element.closeWO=true;
      }
    }); 
    
setTimeout(() => {
  this.isSpinnerVisible=false;
  this.alertService.showMessage('',
    'Work Order Settlements Updated Succesfully',
    MessageSeverity.success
);
this.getWorkCompleteDetails();
}, 1000);
  // currentRecord.isenableUpdate=false;
  this.woSettlements.forEach(element => {
    element.isenableUpdate=false;
  });
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
