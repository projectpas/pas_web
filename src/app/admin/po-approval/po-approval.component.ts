import { Component, OnInit } from "@angular/core";
import { MultiSelectModule } from 'primeng/multiselect';
import { POApprovalService } from "../../services/po-approval.service";
import { CommonService } from "../../services/common.service";
import { MenuItem } from 'primeng/api';
import {MessageSeverity,  AlertService } from "../../services/alert.service";
import { AuthService } from "../../services/auth.service";
import { formatNumberAsGlobalSettingsModule,getValueFromObjectByKey, getObjectByValue } from "../../generic/autocomplete";

@Component({
    selector: "po-approvals",
    templateUrl: './po-approval.component.html',
    styleUrls: ['./po-approval.component.scss']
})
export class PoApprovalComponent implements OnInit
{
    isView: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number = 0;
    poApprovalData: any;
    taskNameList: any;
    ruleNumList: any;
    legalEntityList: any;
    approvalAmountList: any;
    approverList: any;
    arrayLegalEntitylsit:any[] = [];
    newDataObject = {
        "approvalRuleId":0,
        "approvalTaskId":null,
        "autoApproveId":null,
        "actionId":null,
        "ruleNumberId":null,
        "entityId":null,
        "operatorId":null,
        "amountId":null,
        "value":null,
        "lowerValue":null,
        "upperValue":null,
        "approverId":null,
        "memo":"",
        "masterCompanyId":1,
        "createdBy":"admin",
        "updatedBy":"admin",
        "createdDate":new Date(),
        "updatedDate":new Date(),
        "isActive":true,
        "isDeleted":false
         
     };
     dropdownSettings = {};
     creatingData: any;     
     headers = [
        // { field: 'memoId', header: 'Memo Id' },
        { field: 'taskName', header: 'Task Name' },
        { field: 'ruleNo', header: 'Rule No' },
        { field: 'operator', header: 'Operator' },
        { field: 'amount', header: 'Amount' },
        { field: 'value', header: 'Value' },
        { field: 'lowerValue', header: 'Lower Value' },
        { field: 'upperValue', header: 'Upper Value' },
        { field: 'approver', header: 'Approver' }
    ]
    selectedColumns = this.headers;
    isEdit: boolean = false;
    
    constructor(private poapprovalService: POApprovalService,  private authService: AuthService, private commonService: CommonService, private alertService: AlertService){       
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
        this.getPOApprovalData(); 
        this.getTaskNames();
        this.getRuleNumber();
        this.getEnitityList();
        this.getPoAmountList();
        // this.getApproverList();
        this.getPoApprovalList();
        this.creatingData = Object.assign({}, this.newDataObject);
    }

    addNewApproval(){
        this.creatingData = Object.assign({}, this.newDataObject);
    }
    
    getPOApprovalData(){
        this.poapprovalService.getAllPOApprovalData()
        .subscribe(
            (res)=>{
                this.poApprovalData = res;
            }
        )
    }

    async getTaskNames(){
        await this.commonService.smartDropDownList('ApprovalTask', 'ApprovalTaskId', 'Name')
        .subscribe(
            (res)=>{
                this.taskNameList = res;
            }
        )
    }

    async getRuleNumber(){
        await this.commonService.smartDropDownList('ApprovalRuleNo', 'ApprovalRuleNoId', 'RuleNo')
        .subscribe(
            (res)=>{
                this.ruleNumList = res;
            }
        )
    }

    // async getEnitityList(){
    //     // await this.commonService.smartDropDownList('LegalEntity', 'LegalEntityId', 'Name')
    //     // .subscribe(
    //     //     (res)=>{
    //     //         this.legalEntityList = res;
    //     //     }
    //     // )
    //     this.commonService.getLegalEntityIdByMangStrucId(this.authService.currentUser.managementStructureId).subscribe(res=>{
           
    //         this.legalEntityList = res;

    //     })
    // }
    getEnitityList(strText = '') {
		if(this.arrayLegalEntitylsit.length == 0) {			
			this.arrayLegalEntitylsit.push(0); }	
			this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name',strText,true, 20,this.arrayLegalEntitylsit.join()).subscribe(res => {
				this.legalEntityList = res;
			});
    }
    
    filterlegalEntityList(event) {
        if (event.query !== undefined && event.query !== null) {
                    this.getEnitityList(event.query); }
        }

    onEntitySelect()
    {
        this.getEntity(getValueFromObjectByKey('value',this.creatingData.entityId));   
    }
    getEntity(id){ 
        this.commonService.employeesByLegalEntityandMS(id).subscribe(res=>{         
            this.approverList = res.map(x => {
                return {
                    // ...x,
                    value: x.employeeId,
                    label: x.employeeName
                }})
        })
    }
    async getPoAmountList(){
        await this.commonService.smartDropDownList('ApprovalAmount', 'ApprovalAmountId', 'Name')
        .subscribe(
            (res)=>{
                this.approvalAmountList = res;
            }
        )
    }

    // async getApproverList(){
    //     await this.commonService.smartDropDownList('Employee', 'EmployeeId', 'FirstName')
    //     .subscribe(
    //         (res)=>{
    //             this.approverList = res;
    //         }
    //     )
    // }

    savePoApproval(){
        this.creatingData.entityId = getValueFromObjectByKey('value',this.creatingData.entityId); 
        this.poapprovalService.createOrUpdatePOApproval(this.creatingData)
        .subscribe(
            res => {
                this.alertService.showMessage("Success", `Record ${this.isEdit?'Updated':'Created'} successfully`, MessageSeverity.success);
                this.getPoApprovalList()
            }
        )
    }

    getPoApprovalList(){
        this.poapprovalService.getAllPOApprovalData()
        .subscribe(
            (res: any[]) => {
                this.poApprovalData = res;
                this.totalRecords = res.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }
        )
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    edit(data){
        this.isEdit = true;
        this.creatingData = Object.assign({}, this.newDataObject);
        this.poapprovalService.getApprovalById(data.approvalRuleId)
        .subscribe(
            res => {
               
                this.creatingData = res;
                this.arrayLegalEntitylsit.push(this.creatingData.entityId); 	
                this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name','',true, 20,this.arrayLegalEntitylsit.join()).subscribe(res => {
                        this.legalEntityList = res;
                });
                this.getEntity(this.creatingData.entityId);
                this.creatingData.entityId =  getObjectByValue('value',this.creatingData.entityId ,this.legalEntityList);
                this.creatingData.lowerValue = this.creatingData.lowerValue ? formatNumberAsGlobalSettingsModule(this.creatingData.lowerValue, 2) : '0.00';
                this.creatingData.upperValue = this.creatingData.upperValue ? formatNumberAsGlobalSettingsModule(this.creatingData.upperValue, 2) : '0.00';
                this.creatingData.value = this.creatingData.value ? formatNumberAsGlobalSettingsModule(this.creatingData.value, 2) : '0.00';
               
            }
        )
    }


    
    onChangevalue(str) { 
        
        this.creatingData[str] = this.creatingData[str] ? formatNumberAsGlobalSettingsModule(this.creatingData[str], 2) : '0.00';
	
	}
    

    delete(data){
        this.poapprovalService.deleteApprovalById(data.approvalRuleId,"admin")
        .subscribe(
            res => {
                this.alertService.showMessage("Success", `Record Deleted successfully`, MessageSeverity.success);
                this.getPoApprovalList();
            }
        )
    }
    
}