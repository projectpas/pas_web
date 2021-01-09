import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fadeInOut } from '../../services/animations';
import { WorkPerformedService } from '../../services/workperformed.service';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  Table } from 'primeng/table';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";
import { validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, getObjectById, getObjectByValue } from '../../generic/autocomplete';
import { ConfigurationService } from '../../services/configuration.service';

import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';
@Component({
    selector: 'app-work-performed',
    templateUrl: './work-performed.component.html',
    styleUrls: ['./work-performed.component.scss'],
    animations: [fadeInOut]
})
/** Actions component*/
export class WorkPerformedComponent implements OnInit {
    originalData: any=[];
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    headers = [
        { field: 'workPerformedCode', header: 'Work Performed Code' },
        { field: 'description', header: 'Work Performed Description' },
        { field: 'memo', header: 'Memo' },
    ]
    selectedColumns = this.headers;
    formData = new FormData()
    @ViewChild('dt',{static:false})
    modal: NgbModalRef;
    private table: Table;
    auditHistory: any[] = [];
    disableSaveGroupId: boolean = false;
    disableSaveForDescriptionMSG: boolean = false;
    PortalList: any;
    disableSaveForEdit: boolean = false;
    disableSaveWorkperformedMsg: boolean=false;
    disableSaveWorkperformed: boolean = false
    descriptionList: any;
    workPerformedCodeList: any;
    currentstatus: string = 'Active';

    new = {
        workPerformedCode: "",
        description: "",
        masterCompanyId: 1,
        isActive: true,
        memo: "",
    }
    addNew = { ...this.new };
    selectedRecordForEdit: any;
    viewRowData: any;
    selectedRowforDelete: any;
    existingRecordsResponse = [];
    AuditDetails: any;
    
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private authService: AuthService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private commonService: CommonService,
        private _fb: FormBuilder,
        private alertService: AlertService,
        public workperformedService: WorkPerformedService, 
        private configurations: ConfigurationService,
        private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {

    }


    ngOnInit(): void {
        this.getList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-work-performed';
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

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    columnsChanges() {
        this.refreshList();
    }
    refreshList() {
        this.table.reset();

        // this.table.sortOrder = 0;
        // this.table.sortField = '';

        this.getList();
    }

    customExcelUpload(event) {
        // const file = event.target.files;

        // console.log(file);
        // if (file.length > 0) {

        //     this.formData.append('file', file[0])
        //     this.unitofmeasureService.UOMFileUpload(this.formData).subscribe(res => {
        //         event.target.value = '';

        //         this.formData = new FormData();
        //         this.existingRecordsResponse = res;
        //         this.getList();
        //         this.alertService.showMessage(
        //             'Success',
        //             `Successfully Uploaded  `,
        //             MessageSeverity.success
        //         );

        //     })
        // }

    }
    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=WorkPerformed&fileName=workperformed.xlsx`;

        window.location.assign(url);
    }
    getmemo(){
        this.disableSaveForEdit=false;
    };

    getList() {
        this.workperformedService.getWorkPerformedList().subscribe(res => {
            // const responseData = res[0];
            // this.originalData = responseData;

            this.originalTableData=res[0];
            this.getListByStatus(this.status ? this.status :this.currentstatus)

            // this.totalRecords = responseData.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
    }
    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);

        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }


    //checkGroupDescriptionExists(field, value) {
    //    console.log(this.selectedRecordForEdit);
    //    const exists = validateRecordExistsOrNot(field, value, this.originalData, this.selectedRecordForEdit);
    //    if (exists.length > 0) {
    //        this.disableSaveWorkperformedMsg = true;
    //       // this.disableSaveForDescriptionMSG = true;
    //        this.disableSaveForDescription = true;
    //    }
    //    else {
    //        this.disableSaveWorkperformedMsg = false;
    //       // this.disableSaveForDescriptionMSG = false;
    //        this.disableSaveForDescription = false;
    //    }

    //}

    checkGroupDescriptionExists1(field, value) {
        console.log(this.selectedRecordForEdit);
        const exists = validateRecordExistsOrNot(field, value, this.originalData, this.selectedRecordForEdit);
        if (exists.length > 0) {
         //   this.disableSaveWorkperformedMsg = true;
            this.disableSaveForDescriptionMSG = true;
           
        }
        else {
          //  this.disableSaveWorkperformedMsg = false;
            this.disableSaveForDescriptionMSG = false;
           
        }
    }

    filterDescription(event) {
        this.descriptionList = this.originalData;

        const descriptionData = [...this.originalData.filter(x => {
            return x.description.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.descriptionList = descriptionData;
    }
    selectedDescription(object) {
        const exists = selectedValueValidate('description', object, this.selectedRecordForEdit)

        this.disableSaveForDescriptionMSG = !exists;
    }
  
    checkGroupworkPerformedExists(field,value){
        const existed = validateRecordExistsOrNot(field,value,this.originalData,this.selectedRecordForEdit);
        if (existed.length > 0) {
            this.disableSaveWorkperformedMsg = true;
            //this.disableSaveForDescriptionMSG = true;
        }
        else {
          //  this.disableSaveWorkperformed = false;
            this.disableSaveWorkperformedMsg = false;
            //this.disableSaveForDescriptionMSG = false;
        }
    }
    filterWorkperformed(event){
        this.workPerformedCodeList = this.originalData;

        const workPerformed = [...this.originalData.filter(x => {
            return x.workPerformedCode.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.workPerformedCodeList = workPerformed;
    }
    selectedWorkperformed(object){
        const existed = selectedValueValidate('workPerformedCode',object,this.selectedRecordForEdit)
        this.disableSaveWorkperformed = !existed;
    }
    save() {
        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
            workPerformedCode: editValueAssignByCondition('workPerformedCode', this.addNew.workPerformedCode), 
            description: editValueAssignByCondition('description',this.addNew.description)      
            
        };
        if (!this.isEdit) {
            this.workperformedService.newWorkPerformed(data).subscribe(() => {
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Work Performed Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.workperformedService.updateWorkPerformed(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Work Performed Successfully  `,
                    MessageSeverity.success
                );
            })
        }
    }

    onBlur(event) {
        const value = event.target.value;

        this.disableSaveWorkperformedMsg = false;
        for (let i = 0; i < this.originalData.length; i++) {
            let workPerformedCode = this.originalData[i].workPerformedCode;
            let workPerformedId = this.originalData[i].workPerformedId;
            if (workPerformedCode.toLowerCase() == value.toLowerCase()) {
                if (this.isEdit || !this.isEdit) {
                    this.disableSaveWorkperformedMsg = true;
                }
                else if (workPerformedId != this.selectedRecordForEdit.glAccountClassId) {
                    this.disableSaveWorkperformedMsg = true;

                }
                else {

                    this.disableSaveWorkperformedMsg = false;
                }
                console.log('workPerformedCode :', workPerformedCode);
                break;
            }
        }

    }

    resetForm() {
        this.isEdit = false;
        this.selectedRecordForEdit = undefined;
        this.addNew = { ...this.new };
    }


    edit(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveWorkperformedMsg = false;
        this.disableSaveForEdit = true;
        this.disableSaveForDescriptionMSG = false;
        this.addNew = {
            ...rowData,           
            description: getObjectByValue('description', rowData.description, this.originalData),
            workPerformedCode: getObjectByValue('workPerformedCode',rowData.workPerformedCode,this.originalData),
        };
        this.selectedRecordForEdit = { ...this.addNew }

    }
    

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.workperformedService.updateWorkPerformed(data).subscribe(() => {
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully  `,
                MessageSeverity.success
            );
        })

    }
    viewSelectedRow(rowData) {
        console.log(rowData);
        this.viewRowData = rowData;
    }
    resetViewData() {
        this.viewRowData = undefined;
    }
    delete(rowData) {
        this.selectedRowforDelete = rowData;

    }
    deleteConformation(value) {
        if (value === 'Yes') {
            this.workperformedService.deleteWorkPerformed(
                this.selectedRowforDelete.workPerformedId).subscribe(() => {
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Work Performed Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.workperformedService.getWorkPerformedAudit(rowData.workPerformedId).subscribe(res => {
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
         this.originalData=newarry;
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
              this.originalData = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.originalData= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.originalData= newarry;
			}
        }
        this.totalRecords = this.originalData.length ;
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
            this.commonService.updatedeletedrecords('WorkPerformed',
            'WorkPerformedId',this.restorerecord.workPerformedId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
   
}