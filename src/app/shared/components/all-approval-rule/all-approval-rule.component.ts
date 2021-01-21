import { Component, OnInit, Input } from "@angular/core";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
declare var $ : any;
import { AuditHistory } from '../../../models/audithistory.model';
import { POApprovalService } from "../../../services/po-approval.service";
import { CommonService } from "../../../services/common.service";
import {MessageSeverity,  AlertService } from "../../../services/alert.service";
import { AuthService } from "../../../services/auth.service";
import { formatNumberAsGlobalSettingsModule,
        getValueFromArrayOfObjectById,
        getObjectById,
        getObjectByValue } from "../../../generic/autocomplete";


@Component({
  selector: 'app-all-approval-rule',
  templateUrl: './all-approval-rule.component.html',
  styleUrls: ['./all-approval-rule.component.css'],
  providers: [DatePipe]
})
export class AllApprovalRuleComponent implements OnInit {
    
 @Input() moduleType:any; 
 
 currentDeletedstatus:boolean=false;
 currentStatus: string = 'Active';
  moduleName:any;
  arrayEmplsit:any[] = [];
  enableSaveBtn: boolean = false;
  checked: boolean = true;
  unchecked: boolean = false;
  isView: any;  
  pageIndex: number = 0;
  totalRecords: number = 0;
  totalRecordsemp: number = 0;
  totalPages: number = 0;
  poApprovalData: any[] = [];
  taskNameList: any;
  ruleNumList: any;
  legalEntityList: any;
  approvalAmountList: any;
  memoPopupContent: any;
  approverList: any;
  arrayLegalEntitylsit:any[] = [];
  maincompanylist: any[] = [];
  bulist: any[] = [];
  departmentList: any[] = [];
  divisionlist: any[] = [];
  taskID : number = 3;
  poTaskID: number = 3;
  soqTaskID: number = 6
  rowDataToDelete: any = {};
  employeelist: any;
  isSpinnerVisible: boolean = false;  
  pageSizeemp:number=5;
  pageSize:number=10;
  employeeNames: any = [];
  ApprovalNumber: any;
  ApprovalRuleName: any;
  AmountName: any;
 
  auditHistory: any = [];
  modal; any;
  emplColumns = [
    { field: 'employee', header: 'Employee' },   
    { field: 'seqNo', header: 'Seq No' },  
    
  ]
  newDataObject = {
      "approvalRuleId":0,
      "approvalTaskId":null,
      //"autoApproveId":null,     
      //"actionId":null,
      "ruleNumberId":0,
      //"entityId":null,
      //"operatorId":null,
      "amountId":null,
      "value":null,
      "lowerValue":null,
      "upperValue":null,    
      "companyId":0,
      "buId":0,
      "divisionId":0,
      "departmentId":0,
      "enforceApproval": false,
      "approver": this.employeeNames,
      "managementStructureId":this.currentUserManagementStructureId,
      "memo":"",
      "masterCompanyId":this.currentUserMasterCompanyId,
      "createdBy":this.userName,
      "updatedBy": this.userName,
      "createdDate":new Date(),
      "updatedDate":new Date(),
      "isActive":true,
      "isDeleted":false       
   };
   dropdownSettings = {};
   creatingData: any;     
   headers = [
      { field: 'taskName', header: 'Task Name' },
      { field: 'ruleNo', header: 'Rule No' },     
      { field: 'amount', header: 'Amount' },
      { field: 'value', header: 'Value' },
      { field: 'lowerValue', header: 'Lower Value' },
      { field: 'upperValue', header: 'Upper Value' },
      { field: 'companyName', header: 'Level 01' },
      { field: 'buName', header: 'Level 02' },
      { field: 'deptName', header: 'Level 03' },
      { field: 'divName', header: 'Level 04' }, 
      { field: 'approver', header: 'Approver' },   
      { field: 'createdDate', header: 'Created Date' },
      { field: 'createdBy', header: 'Created By' },
      { field: 'updatedDate', header: 'Updated Date' },
      { field: 'updatedBy', header: 'Updated By' },
  ]
  selectedColumns = this.headers;
  isEdit: boolean = false;
  
  constructor(private poapprovalService: POApprovalService, private datePipe: DatePipe, private modalService: NgbModal, private authService: AuthService, private commonService: CommonService, private alertService: AlertService){       
  }

  onSaveChange()
  {
    this.enableSaveBtn = true;
  }

  ngOnInit(){   

    this.dropdownSettings = {
          singleSelection: false,
          idField: 'value',
          textField: 'label',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 1,
          allowSearchFilter: false
      };          
      this.getRuleNumber();    
      this.getPoAmountList();      
      this.creatingData = Object.assign({}, this.newDataObject);
      if(this.moduleType  == 'PO') {
        this.moduleName = 'Purchase Order';       
      }
      else if(this.moduleType  == 'SOQ') {
        this.moduleName = 'Sales Order Quote';       
      }
      else if(this.moduleType  == 'SO') {
        this.moduleName = 'Sales Order';       
      }
      else if(this.moduleType  == 'RO') {
        this.moduleName = 'Repair Order';       
      }
      this.getTaskNames();    	
  }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
        ? this.authService.currentUser.masterCompanyId
        : null;
        }
    get employeeId() {
    return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }
    get userName(): string {	
		return this.authService.currentUser ? this.authService.currentUser.userName : "";		
	}

	get currentUserManagementStructureId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.managementStructureId
		  : null;
    }
    
    filterapprover(event) {	 	
        if (event.query !== undefined && event.query !== null) {
        this.employeedata(event.query,this.creatingData.managementStructureId);
        }
    }
    closeHistoryModal() {
        $("#approvalHistory").modal("hide");
    }

    handleChange(rowData, e) {   
         
        // this.employeeNames.forEach(x => { 
        //     if(x.employeeId == rowData.employeeId) {
        //         x.isActive = e.checked;
        //     } 
        // }); 
        this.onSaveChange();
        this.alertService.showMessage(
                'Success',
                'Approver Status change Successfully',
                MessageSeverity.success
            );           
         }

    // changeStatus(rowData){
    //     this.employeeNames.forEach(x => { 
    //             if(x.employeeId == rowData.employeeId) {
    //                 x.isActive = rowData.isActive;
    //             } 
    //         });
    //         this.onSaveChange();
    //     this.alertService.showMessage(
    //             'Success',
    //             'Approver Status change Successfully',
    //             MessageSeverity.success
    //         );      

    // }


    makePrimary(employeeId){
        this.employeeNames.forEach(x => { 
            if(x.employeeId == employeeId) {
               x.isPrimary = true;
               x.seqNo = 1;
            } else {
                x.isPrimary = false;
            }});
        var seq = 1;    
        this.employeeNames.forEach(x => { 
                if(x.isPrimary == true) {                   
                   x.seqNo = 1;
                } else {
                    seq = seq + 1
                    x.seqNo = seq;
                }}); 
        this.onSaveChange();        
    }

    tagIndex:any;
    tagRowData:any;
    openDeletesemployee(content,rowData, row) {
        this.tagIndex=row;
        this.tagRowData=rowData;
                this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
            }

    onAddApprover() {    
            if(this.employeelist && this.employeelist.value && this.employeelist.value > 0 ) {
                var isPrimaryflag = true;
                var isEmpExists = false;
                var SeqNo = 1;
                
                this.employeeNames.forEach(x => { 
                     if(x.employeeId == this.employeelist.value) {
                        isEmpExists = true;
                     }
                     if(x.isPrimary == true) {
                            isPrimaryflag = false;
                     }});
                if(isEmpExists){
                    this.alertService.showMessage(
                        'Error',
                        'Employee Already Exists',
                         MessageSeverity.error
                    );
                    return;
                }  
                
                if(!isPrimaryflag){
                    SeqNo = Math.max.apply(Math, this.employeeNames.map(function(o) { 
                        return o.seqNo;  
                    })); 
                    SeqNo = SeqNo + 1;
                }
                this.employeeNames.push({
                    approverId:0,
                    isPrimary:isPrimaryflag,
                    approvalRuleId: this.creatingData.approvalRuleId,
                    seqNo: SeqNo,                    
                    employeeId: this.employeelist.value,
                    employee: this.employeelist.label,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    createdDate:new Date(),
                    updatedDate:new Date(),
                    isActive:true,
                    isDeleted:false,  
                });                
                this.employeeNames.map(x => {
                    return {
                        ...x
                    }
                });  
                        
                this.totalRecordsemp = this.employeeNames.length;
                this.alertService.showMessage(
                    'Success',
                    'Employee Added Successfully',
                    MessageSeverity.success
                );
                this.onSaveChange();
            }
           
    }
    onDeleteTagName() {
        this.employeeNames.splice(this.tagIndex, 1);
        this.modal.close();      
        this.alertService.showMessage(
            'Success',
            'Employee Deleted Successfully',
            MessageSeverity.success
        );
      this.onSaveChange();
    }
    dismissModel() {
        this.modal.close();
    }

    onClickMemo() {
        this.memoPopupContent = this.creatingData.memo;
        // this.enableSave();
        //this.memoPopupValue = value;
    }   
    onClickPopupSave() {
        this.creatingData.memo = this.memoPopupContent;
        this.memoPopupContent = '';
        $('#memo-popup').modal("hide");
    }
    closeMemoModel() {
        $('#memo-popup').modal("hide");
    }
    // onClickMemo() {
	// 	this.memoPopupContent = this.creatingData.memo;
	// }
    // closeMemoModel() {
    //     $('#memo-popup-Doc').modal("hide");
    // }
	// onClickPopupSave() {
	
	// 	this.creatingData.memo = this.memoPopupContent;
	// }
	parsedText(text) {
        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }

    getTaxPageCount(totalNoofRecordsT, pageSizeT) {
         if(totalNoofRecordsT && pageSizeT && totalNoofRecordsT > pageSizeT) {
             return Math.ceil(totalNoofRecordsT / pageSizeT);
             } else {
                 return 1;
             } 
             
    }

    getManagementStructureDetails(id,empployid=0,editMSID=0) {
    empployid = empployid == 0 ? this.employeeId : empployid ;
    editMSID = this.isEdit ? editMSID = id : 0;
    this.commonService.getManagmentStrctureData(id,empployid,editMSID).subscribe(response => {
        if(response) {
            const result = response;
            if(result[0] && result[0].level == 'Level1') {
                this.maincompanylist =  result[0].lstManagmentStrcture;	
                this.creatingData.companyId = result[0].managementStructureId;
                this.creatingData.managementStructureId = result[0].managementStructureId;				
                this.creatingData.buId = 0;
                this.creatingData.divisionId = 0;
                this.creatingData.departmentId = 0;	
                this.bulist = [];
                this.divisionlist = [];
                this.departmentList = [];
            } else {
                this.creatingData.companyId = 0;
                this.creatingData.buId = 0;
                this.creatingData.divisionId = 0;
                this.creatingData.departmentId = 0;	
                this.maincompanylist = [];
                this.bulist = [];
                this.divisionlist = [];
                this.departmentList = [];
            }
            
            if(result[1] && result[1].level == 'Level2') {	
                this.bulist = result[1].lstManagmentStrcture;
                this.creatingData.buId = result[1].managementStructureId;
                this.creatingData.managementStructureId = result[1].managementStructureId;
                this.creatingData.divisionId = 0;
                this.creatingData.departmentId = 0;
                this.divisionlist = [];
                this.departmentList = [];
            } else {
                if(result[1] && result[1].level == 'NEXT') {
                    this.bulist = result[1].lstManagmentStrcture;
                }
                this.creatingData.buId = 0;
                this.creatingData.divisionId = 0;
                this.creatingData.departmentId = 0;					
                this.divisionlist = [];
                this.departmentList = []; 
            }

            if(result[2] && result[2].level == 'Level3') {		
                this.divisionlist =  result[2].lstManagmentStrcture;		
                this.creatingData.divisionId = result[2].managementStructureId;		
                this.creatingData.managementStructureId = result[2].managementStructureId;			
                this.creatingData.departmentId = 0;						
                this.departmentList = [];			
            } else {
                if(result[2] && result[2].level == 'NEXT') {
                    this.divisionlist = result[2].lstManagmentStrcture;						
                }
                this.creatingData.divisionId = 0; 
                this.creatingData.departmentId = 0;	
                this.departmentList = [];}

            if(result[3] && result[3].level == 'Level4') {		
                this.departmentList = result[3].lstManagmentStrcture;;			
                this.creatingData.departmentId = result[3].managementStructureId;	
                this.creatingData.managementStructureId = result[3].managementStructureId;				
            } else {
                this.creatingData.departmentId = 0; 
                if(result[3] && result[3].level == 'NEXT') {
                    this.departmentList = result[3].lstManagmentStrcture;						
                }
            }	
           // this.employeedata('',this.creatingData.managementStructureId);	
        }
    },err => {
        this.isSpinnerVisible = false;
        const errorLog = err;
        this.errorMessageHandler(errorLog);		
    });
}

employeedata(strText = '',manStructID = 0,bindemp = false) {
    if(this.arrayEmplsit.length == 0) {			
    this.arrayEmplsit.push(0); }	
    this.arrayEmplsit.push(this.employeeId == null ? 0 : this.employeeId);
    this.commonService.autoCompleteDropdownsEmployeeByMS(strText,true, 20,this.arrayEmplsit.join(),manStructID).subscribe(res => {
        this.approverList = res;  
        if(bindemp) {
            this.employeeNames.forEach(x => {
                   x.employee = getValueFromArrayOfObjectById('label', 'value', x.employeeId, this.approverList);
                }); 
        }  
    },err => {
        const errorLog = err;
        this.errorMessageHandler(errorLog);		
    })
}

getBUList(legalEntityId) {
    this.creatingData.buId = 0;
    this.creatingData.divisionId = 0;
    this.creatingData.departmentId = 0;	
    this.bulist = [];
    this.divisionlist = [];
    this.departmentList = [];
    if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
        this.creatingData.managementStructureId = legalEntityId;	
        this.creatingData.companyId = legalEntityId;		
        this.commonService.getManagementStructurelevelWithEmployee(legalEntityId,this.employeeId ).subscribe(res => {
            this.bulist = res;
        });
    }
    else {
         this.creatingData.managementStructureId  = 0;
         this.creatingData.companyId = 0;
     }
    this.employeedata('',this.creatingData.managementStructureId);
    this.onSaveChange();
    
}

getDivisionlist(buId) {
    this.divisionlist = [];
    this.departmentList = [];
    this.creatingData.divisionId = 0;		
    this.creatingData.departmentId = 0;		

    if (buId != 0 && buId != null && buId != undefined) {			
        this.creatingData.managementStructureId = buId;
        this.creatingData.buId = buId;
        this.commonService.getManagementStructurelevelWithEmployee(buId,this.employeeId ).subscribe(res => {
            this.divisionlist = res;
        });       	
     }  else {
         this.creatingData.managementStructureId  = this.creatingData.companyId;		
     }
     this.employeedata('',this.creatingData.managementStructureId);
     this.onSaveChange();

}

getDepartmentlist(divisionId) {
    this.creatingData.departmentId = 0;
    this.departmentList = [];
    if (divisionId != 0 && divisionId != null && divisionId != undefined) {
       this.creatingData.divisionId = divisionId;
       this.creatingData.managementStructureId = divisionId;
       this.commonService.getManagementStructurelevelWithEmployee(divisionId,this.employeeId).subscribe(res => {
        this.departmentList = res;
    });
   
    }
     else {
         this.creatingData.managementStructureId  = this.creatingData.buId;
         this.creatingData.divisionId = 0;
     }
     this.employeedata('',this.creatingData.managementStructureId);
     this.onSaveChange();
}

getDepartmentId(departmentId) {
    if (departmentId != 0 && departmentId != null && departmentId != undefined) {
        this.creatingData.managementStructureId = departmentId;
        this.creatingData.departmentId = departmentId;
    }
     else {
         this.creatingData.managementStructureId  = this.creatingData.divisionId;
         this.creatingData.departmentId = 0;
     }
     this.employeedata('',this.creatingData.managementStructureId);	
     this.onSaveChange();	
}	

errorMessageHandler(log) {
    this.alertService.showMessage(
            'Error',
            log.error,
            MessageSeverity.error
    ); 
}

addNewApproval(){
      this.creatingData = Object.assign({}, this.newDataObject);
      if(this.moduleType  == 'PO') {
        this.moduleName = 'Purchase Order';
        this.creatingData.approvalTaskId = this.taskID;
      }
      if(this.moduleType  == 'SOQ') {
        this.moduleName = 'Sales Order Quote';
        this.creatingData.approvalTaskId = this.taskID;
      }
      if(this.moduleType  == 'RO') {
        this.moduleName = 'Repair Order';
        this.creatingData.approvalTaskId = this.taskID;
      }
      if(this.moduleType  == 'SO') {
        this.moduleName = 'Sales Order';
        this.creatingData.approvalTaskId = this.taskID;
      }
      this.getManagementStructureDetails(this.currentUserManagementStructureId,this.employeeId);
      this.creatingData.managementStructureId = this.currentUserManagementStructureId;	
      this.arrayEmplsit = [];
      this.employeedata('',this.currentUserManagementStructureId);
      this.employeeNames = [];     
      
  }
  
 

  async getTaskNames(){
    this.isSpinnerVisible = true;
      await this.commonService.smartDropDownList('ApprovalTask', 'ApprovalTaskId', 'Name')
      .subscribe(
          (res)=>{
              this.taskNameList = res;
              res.forEach(element => {                  
                if(element.label == 'PO Approval' && this.moduleType == 'PO') {
                    this.taskID = element.value;
                }
                else if(element.label == 'Sales Quote Approval' && this.moduleType == 'SOQ') {
                    this.taskID = element.value;
                }
                else if(element.label == 'RO Approval' && this.moduleType == 'RO') {
                    this.taskID = element.value;
                }
                else if(element.label == 'SO Approval' && this.moduleType == 'SO') {
                    this.taskID = element.value;
                }
            });
                
            this.creatingData.approvalTaskId = this.taskID;
            this.getPoApprovalList(this.taskID);
            
             this.isSpinnerVisible = false;
          }, err => {
              this.isSpinnerVisible = false;
          }
      );
  }

  async getRuleNumber(){
       await this.commonService.smartDropDownList('ApprovalRuleNo', 'ApprovalRuleNoId', 'RuleNo')
       .subscribe(
           (res)=>{
               this.ruleNumList = res;              
           }
       )
   }
  async getPoAmountList(){
      await this.commonService.smartDropDownList('ApprovalAmount', 'ApprovalAmountId', 'Name')
      .subscribe(
          (res)=>{
              this.approvalAmountList = res;
          }
      )
  }
  savePoApproval() {    
      this.creatingData.approver = this.employeeNames;   
      this.creatingData.updatedBy = this.userName;
      this.creatingData.updatedDate = new Date();
      var i  = 0;
      this.employeeNames.forEach(x => { 
        if(x.isActive) { i++;} 
        }); 
      if(this.creatingData.amountId == 5 && 
        this.creatingData.lowerValue &&
         this.creatingData.upperValue &&       
        Number(this.creatingData.lowerValue) > Number(this.creatingData.upperValue))
        {
            this.alertService.showMessage(
                'Error',
                'Upper Value Should be grater than lower Value.',
                MessageSeverity.error
            );
            return;
        }
      if(i==0){
            this.alertService.showMessage(
                'Error',
                'Aleast one Active Approver Required.',
                MessageSeverity.error
            );
            return;}
      if(this.creatingData.amountId == 5) {
        this.creatingData.value = 0.00;
      }else {
        this.creatingData.lowerValue = 0.00;
        this.creatingData.upperValue = 0.00;
      }     
      this.poapprovalService.createapprovalrulecommon(this.creatingData)
      .subscribe(
          res => {
              this.alertService.showMessage("Success", `Record ${this.isEdit?'Updated':'Created'} successfully`, MessageSeverity.success);
              this.getPoApprovalList(this.taskID);
              $("#addNewPOApproval").modal("hide");  
           });        
  }

  getDeleteListByStatus(value){
   this.currentDeletedstatus = value;
   this.getPoApprovalList(this.taskID);
 }
 changeRuleStatus(rowData) {
    this.isSpinnerVisible = true;
    this.poapprovalService.updateActionforActive(rowData.approvalRuleId,rowData.isActive, this.userName).subscribe
    (res => 
        {   this.isSpinnerVisible = false;            
            this.getPoApprovalList(this.taskID);
            this.alertService.showMessage(
                'Success',
                'Approval Rule Status change Successfully',
                MessageSeverity.success
            );           
         }, err => {
             this.isSpinnerVisible = false;
         });    
 }

 getruleByStatus(status) {
     this.currentStatus = status;
     this.getPoApprovalList(this.taskID);
 }

 getPoApprovalList(taskid){
    this.isSpinnerVisible = true;
      this.poapprovalService.getAllApprovalDataByTaskId(taskid,this.currentDeletedstatus,this.currentStatus)
      .subscribe(
          (res: any[]) => {            
              this.poApprovalData  = res.map(x => {
                return {
                    ...x,                    
                    createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a'): '',
                    updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a'): '',
                }
            });  
              this.totalRecords = res.length;
              this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
              this.isSpinnerVisible = false;
          },err =>{ this.isSpinnerVisible = false;}
      )
  }

  pageIndexChange(event) {
      this.pageSize = event.rows;
  }

  getPageCount(totalNoofRecords, pageSize) {
      return Math.ceil(totalNoofRecords / pageSize)
  }

  view(data){
    //$("#viewPOApproval").modal("show");    
    this.isSpinnerVisible = true;
    this.isEdit = true;      
    this.creatingData = Object.assign({}, this.newDataObject);    
    this.poapprovalService.getapprovalrulebyidwithEmployee(data.approvalRuleId)
    .subscribe(res => {                          
            this.creatingData = res;
            this.employeeNames = this.creatingData.approver;
            this.ApprovalRuleName =  getValueFromArrayOfObjectById('label', 'value', this.creatingData.approvalTaskId, this.taskNameList);
            this.ApprovalNumber =  getValueFromArrayOfObjectById('label', 'value', this.creatingData.ruleNumberId, this.ruleNumList);
            this.AmountName =  getValueFromArrayOfObjectById('label', 'value', this.creatingData.amountId, this.approvalAmountList);
            
            this.arrayEmplsit = [];
            this.creatingData.approver.forEach(element => {
              this.arrayEmplsit.push(element.employeeId);
            });            
            this.employeedata('',this.creatingData.managementStructureId,true);
            this.getManagementStructureDetails(this.creatingData.managementStructureId,this.employeeId,this.creatingData.managementStructureId);
            this.creatingData.lowerValue = this.creatingData.lowerValue ? formatNumberAsGlobalSettingsModule(this.creatingData.lowerValue, 2) : 0.00;
            this.creatingData.upperValue = this.creatingData.upperValue ? formatNumberAsGlobalSettingsModule(this.creatingData.upperValue, 2) : 0.00;
            this.creatingData.value = this.creatingData.value ? formatNumberAsGlobalSettingsModule(this.creatingData.value, 2) : 0.00;             
            this.isSpinnerVisible = false;
            this.enableSaveBtn = false;
          },
            err => {
                  this.isSpinnerVisible = true;
            });
}

  edit(data){
      this.isSpinnerVisible = true;
      this.isEdit = true;      
      this.creatingData = Object.assign({}, this.newDataObject);    
      this.poapprovalService.getapprovalrulebyidwithEmployee(data.approvalRuleId)
      .subscribe(res => {                          
              this.creatingData = res;
              this.employeeNames = this.creatingData.approver;
              this.arrayEmplsit = [];
              this.creatingData.approver.forEach(element => {
                this.arrayEmplsit.push(element.employeeId);
              });            
              this.employeedata('',this.creatingData.managementStructureId,true);
              this.getManagementStructureDetails(this.creatingData.managementStructureId,this.employeeId,this.creatingData.managementStructureId);
              this.creatingData.lowerValue = this.creatingData.lowerValue ? formatNumberAsGlobalSettingsModule(this.creatingData.lowerValue, 2) : 0.00;
              this.creatingData.upperValue = this.creatingData.upperValue ? formatNumberAsGlobalSettingsModule(this.creatingData.upperValue, 2) : 0.00;
              this.creatingData.value = this.creatingData.value ? formatNumberAsGlobalSettingsModule(this.creatingData.value, 2) : 0.00;             
              this.isSpinnerVisible = false;
              this.enableSaveBtn = false;
            },
              err => {
                    this.isSpinnerVisible = true;
              });
  }


  
  onChangevalue(str) { 
      
      this.creatingData[str] = this.creatingData[str] ? formatNumberAsGlobalSettingsModule(this.creatingData[str], 2) : 0.00;
      if(str == 'upperValue' &&  
         this.creatingData.lowerValue &&
         this.creatingData.upperValue &&       
        Number(this.creatingData.lowerValue) > Number(this.creatingData.upperValue))
        {
            this.alertService.showMessage(
                'Error',
                'Upper Value Should be grater than lower Value.',
                MessageSeverity.error
            ); 
            this.creatingData.upperValue = 0.00         
        }  
}

changePage(event: { first: any; rows: number }) {
    this.pageSizeemp = event.rows;
    // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
}
  
closeDeleteModal() {
    $("#poApprovalDelete").modal("hide");
}
delete(rowData){
    this.rowDataToDelete = rowData;
    $("#poApprovalDelete").modal("show");
}

Restore(rowData){
    this.rowDataToDelete = rowData;
    $("#poApprovalRestore").modal("show");
}

closeRestore() {
    $("#poApprovalRestore").modal("hide");
}

RestorePoApproval(){
    const {approvalRuleId}=this.rowDataToDelete;
    this.poapprovalService.restoreApprovalById(approvalRuleId,this.userName)
    .subscribe(
        res => {
            this.alertService.showMessage("Success", `Rule Resored successfully`, MessageSeverity.success);
            this.getPoApprovalList(this.taskID);
        }
    )
}

getColorCodeForHistory(i, field, value) {
    const data = this.auditHistory;
    const dataLength = data.length;
    if (i >= 0 && i <= dataLength) {
        if ((i + 1) === dataLength) {
            return true;
        } else {
            return data[i + 1][field] === value
        }
    }
}

getAuditHistoryById(data) {
    this.isSpinnerVisible = true;
    this.poapprovalService.getApprovalRuleHistorycommon(data.approvalRuleId).subscribe(res => {         
        this.auditHistory = res;
        this.isSpinnerVisible = false;
    }, err => {
        this.isSpinnerVisible = false;  
    });
}



  deletePoApproval(){
      const {approvalRuleId}=this.rowDataToDelete;
      this.poapprovalService.deleteApprovalById(approvalRuleId,this.userName)
      .subscribe(
          res => {
              this.alertService.showMessage("Success", `Rule Deleted successfully`, MessageSeverity.success);
              this.getPoApprovalList(this.taskID);
          }
      )
  }
  
  handleChanges(rowData, $event) {}
}
