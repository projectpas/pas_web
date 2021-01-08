import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';

import { ConditionService } from '../../services/condition.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { Condition } from '../../models/condition.model';
import * as $ from 'jquery';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { MasterCompany } from '../../models/mastercompany.model';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AuthService } from '../../services/auth.service';
// import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuditHistory } from '../../models/audithistory.model';
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { validateRecordExistsOrNot, getObjectById, getObjectByValue, selectedValueValidate, editValueAssignByCondition } from '../../generic/autocomplete';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-conditions',
    templateUrl: './conditions.component.html',
    styleUrls: ['./conditions.component.scss'],
    animations: [fadeInOut]
})
/** Conditions component*/
export class ConditionsComponent implements OnInit {
    selectedActionName: any;
    actionamecolle: any[] = [];

    AuditDetails: SingleScreenAuditDetails[];
    auditHisory: AuditHistory[];
    selectedColumns: any[];
    id: number;
    errorMessage: any;

    public isEditMode: boolean = false;
    
    private isDeleteMode: boolean = false;
    allComapnies: MasterCompany[];
    private isSaving: boolean;
    modal: NgbModalRef;
    selectedColumn: Condition[];
    formData = new FormData();
    existingRecordsResponse: Object;
    filteredBrands: any[];
    localCollection: any[] = [];
    Active: string = "Active";

    viewRowData: any;
    auditHistory: any;
    selectedRowforDelete: any;
    currentstatus: string = 'Active';


    conditionData: any=[];
    conditionList: any;
    conditionHeaders = [

        { field: 'description', header: 'Condition Name' },
        { field: 'memo', header: 'Memo' },

    ];
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    @ViewChild('dt',{static:false})
    private table: Table;
    selectedRecordForEdit: any;
    newCondition =
        {
            description: "",
            masterCompanyId: 1,
            isActive: true,
            isDeleted: false,
            memo: ""
        };
    addNewCondition = { ...this.newCondition };
    disableSaveForEdit: boolean;
    disableSaveForConditionMsg: boolean;
    /** Currency ctor */
    constructor(public router: Router,
        private commonService: CommonService,       
         private breadCrumb: SingleScreenBreadcrumbService,
          private authService: AuthService, private _fb: FormBuilder,
           private alertService: AlertService, 
           private masterComapnyService: MasterComapnyService,
            private modalService: NgbModal, public conditionService: ConditionService, private dialog: MatDialog) {


    }
    ngOnInit(): void {
        this.selectedColumns = this.conditionHeaders;
        this.getConditionList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-conditions';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }
    columnsChanges() {
        this.refreshList();
    }
    private getConditionList() {
        this.conditionService.getAllConditionList().subscribe(res => {
            this.originalTableData=res[0].columnData;
            this.getListByStatus(this.status ? this.status :this.currentstatus)

            // const respData = res[0];
            // this.conditionData = respData.columnData;
            // this.totalRecords = respData.totalRecords;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        });
    }

    onBlur(event) {
        //console.log(event.target.value);
        //console.log(this.addNew);

        const value = event.target.value;
        this.disableSaveForConditionMsg = false;
        for (let i = 0; i < this.conditionData.length; i++) {
            let description = this.conditionData[i].description;
            let conditionId = this.conditionData[i].conditionId;
            if (description.toLowerCase() == value.toLowerCase()) {
                if (!this.isEditMode  || this.isEditMode) {
                    this.disableSaveForConditionMsg = true;
                }
                else if (conditionId != this.selectedRecordForEdit.conditionId) {
                    this.disableSaveForConditionMsg = true;
                }
                else {
                    this.disableSaveForConditionMsg = false;
                }
                console.log('description :', description);
                break;
            }
        }

    }

    resetConditionForm() {
        this.isEditMode = false;
        this.disableSaveForConditionMsg = false;

        this.selectedRecordForEdit = undefined;
        this.addNewCondition = { ...this.newCondition };
    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.conditionService.updateCondition(data).subscribe(() => {
            // this.getUOMList();
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully  `,
                MessageSeverity.success
            );
        })

    }

    /*checkConditionExist(value) {

        this.isCustomerNameAlreadyExists = false;
        this.disableSaveCustomerName = false;
        for (let i = 0; i < this.customerListOriginal.length; i++) {

            if (this.generalInformation.name == this.customerListOriginal[i].name || value == this.customerListOriginal[i].name) {
                this.isCustomerNameAlreadyExists = true;
                // this.disableSave = true;
                this.disableSaveCustomerName = true;
                this.selectedActionName = event;
                return;
            }

        }

    }*/

    filterConditions(event) {
        this.conditionList = this.conditionData;

        const CONDITIONData = [...this.conditionData.filter(x => {
            return x.description.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.conditionList = CONDITIONData;
    }


    getmemo($event) {
        this.disableSaveForEdit = false;
    };

    checkConditionExists(field, value) {
        for (var i = 0; i < this.conditionData.length; i++) {
            if (value.toLowerCase() == this.conditionData[i].description.toLowerCase()) {
                this.disableSaveForConditionMsg = true;
            } else {
                this.disableSaveForConditionMsg = false;
            }
        }

        /*console.log("field:", field);
        console.log("value::", value);
        const exists = validateRecordExistsOrNot(field, value, this.conditionData, this.selectedRecordForEdit);
        console.log("this.conditionData::", this.conditionData)
        console.log("this.conditionData::", this.selectedRecordForEdit)
        console.log("exists:", exists);
        if (exists.length > 0) {
            console.log("COndition Success!!")
           // this.disableSaveForCondition = true;
        }
        else {
            console.log("COndition failss!!")
           // this.disableSaveForCondition = false;
        } */

    }
    selectedCondition(object) {
       
        const exists = selectedValueValidate('description', object, this.selectedRecordForEdit);
        this.disableSaveForConditionMsg = !exists;
    }


    refreshList() {
        this.table.reset();
        this.getConditionList();
    }

    delete(rowData) {
        this.selectedRowforDelete = rowData;

    }
    deleteConformation(value) {
        if (value === 'Yes') {
            this.conditionService.deleteCondition(this.selectedRowforDelete.conditionId).subscribe(() => {
                this.getConditionList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Condition Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    viewSelectedRow(rowData) {
        console.log(rowData);
        this.viewRowData = rowData;
    }

    resetViewData() {
        this.viewRowData = undefined;
    }
    edit(rowData) {
        console.log(rowData);
        this.isEditMode = true;
        this.disableSaveForEdit = true;
        this.disableSaveForConditionMsg = false;
        this.addNewCondition = { ...rowData, description: getObjectById('conditionId', rowData.conditionId, this.conditionData) };
        this.selectedRecordForEdit = { ...this.addNewCondition }
        console.log(this.addNewCondition);
    }

    saveCondition() {
        if (this.conditionData.findIndex(x => x.description == this.addNewCondition.description) > -1) {
            this.alertService.showMessage("Failed", "Condition " + this.addNewCondition.description + " already exists.", MessageSeverity.error);
            return;
        }
        const data = {
            ...this.addNewCondition, createdBy: this.userName, updatedBy: this.userName,
            description: editValueAssignByCondition('description', this.addNewCondition.description)
        };
        if (!this.isEditMode) {
            this.conditionService.newAddCondition(data).subscribe(() => {
                this.resetConditionForm();
                this.getConditionList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Condition Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.conditionService.updateCondition(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEditMode = false;
                this.resetConditionForm();
                this.getConditionList();
                this.alertService.showMessage(
                    'Success',
                    `Updated Condition Successfully`,
                    MessageSeverity.success
                );
            })
        }
    }


    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }




    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }


    getAuditHistoryById(rowData) {
        this.conditionService.getConditionAudit(rowData.conditionId).subscribe(res => {
            this.auditHistory = res;
        })
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

    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        // this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.conditionService.ConditionCustomUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.existingRecordsResponse = res;
                this.getConditionList();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );

                // $('#duplicateRecords').modal('show');
                // document.getElementById('duplicateRecords').click();

            })
        }

    }

    getDeleteListByStatus(value){
        if(value){
            this.currentDeletedstatus=true;
        }else{
            this.currentDeletedstatus=false;
        }
        this.getListByStatus(this.status ? this.status : this.currentstatus)
            }
            
	originalTableData:any=[];
    currentDeletedstatus:boolean=false;
    status:any="Active";
    getListByStatus(status) {
        const newarry=[];
        if(status=='Active'){ 
            this.status=status;
			if(this.currentDeletedstatus==false){
			   this.originalTableData.forEach(element => {
				if(element.isActive ==true && element.isDeleted ==false){
				newarry.push(element);
				}
			   });
	       }else{
		        this.originalTableData.forEach(element => {
				if(element.isActive ==true && element.isDeleted ==true){
			     newarry.push(element);
				}
			   });
	   }
         this.conditionData=newarry;
        }else if(status=='InActive' ){
            this.status=status;
			if(this.currentDeletedstatus==false){
				this.originalTableData.forEach(element => {
				 if(element.isActive ==false && element.isDeleted ==false){
				 newarry.push(element);
				 }
				});
			}else{
				 this.originalTableData.forEach(element => {
				 if(element.isActive ==false && element.isDeleted ==true){
				  newarry.push(element);
				 }
				});
		}
              this.conditionData = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.conditionData= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.conditionData= newarry;
			}
        }
        this.totalRecords = this.conditionData.length ;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
		}
        restore(content, rowData) {
            this.restorerecord = rowData;
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
            this.modal.result.then(() => {
                console.log('When user closes');
            }, () => { console.log('Backdrop click') })
        }
        restorerecord:any={}
        restoreRecord(){  
            this.commonService.updatedeletedrecords('Condition',
            'ConditionId',this.restorerecord.conditionId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getConditionList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }

}
