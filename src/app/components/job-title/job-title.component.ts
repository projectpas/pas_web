import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { JobTitleService } from '../../services/job-title.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { validateRecordExistsOrNot, editValueAssignByCondition, getObjectById, selectedValueValidate, getObjectByValue } from '../../generic/autocomplete';
import { Table } from 'primeng/table';
import { ConfigurationService } from '../../services/configuration.service';
import { CommonService } from '../../services/common.service';


import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';


@Component({
    selector: 'app-job-title',
    templateUrl: './job-title.component.html',
    styleUrls: ['./job-title.component.scss'],
    animations: [fadeInOut]
})
/** Vendor Classification component*/
export class JobTitleComponent implements OnInit {
    jobTitleData: any=[];
    viewRowData: any;
    selectedRowforDelete: any;
    newJobTitle =
        {
            description: "",
            masterCompanyId: 1,
            isActive: true,
            isDeleted: false,
            memo: ""
        }
    addNewJobTitle = { ...this.newJobTitle };
    disableSaveForJobTitle: boolean = false;
    jobTitleList: any;
    isEdit: boolean = false;
    totalRecords: any;
    disableSaveForEdit: boolean = false;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    currentstatus: string = 'Active';

    jobTitleHeaders = [
        { field: 'description', header: 'Job Title' },
        { field: 'memo', header: 'Memo' },
    ]
    selectedColumns = this.jobTitleHeaders;
    formData = new FormData()
    @ViewChild('dt',{static:false})
    modal: NgbModalRef;
    private table: Table;
    auditHistory: any[] = [];
    existingRecordsResponse: Object;
    selectedRecordForEdit: any;
    AuditDetails: any;
    
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private commonService: CommonService,
        private modalService: NgbModal,
        private configurations: ConfigurationService, 
        private authService: AuthService, private alertService: AlertService, 
        private jobTitleService: JobTitleService) {

    }

    ngOnInit(): void {
        this.getJobTitleList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-job-title';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    }


    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }
    customExcelUpload(event) {

        const file = event.target.files;

        if (file.length > 0) {

            this.formData.append('ModuleName', 'JobTitle')
            this.formData.append('file', file[0])
            this.commonService.smartExcelFileUpload(this.formData).subscribe(res => {

                this.formData = new FormData();
                this.getJobTitleList();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );

            })
        }
    }

    columnsChanges() {
        this.refreshList();
    }
    getmemo() {
     
        this.disableSaveForEdit = false;
    
}

    refreshList() {
        this.table.reset();
        this.getJobTitleList();
    }

     

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=JobTitle&fileName=JobTitle.xlsx`;
        window.location.assign(url);
    }

    getJobTitleList() {
        this.jobTitleService.getAllJobTitleList().subscribe(res => {

            this.originalTableData=res[0];
            this.getListByStatus(this.status ? this.status :this.currentstatus)

            // const responseData = res[0];
            // this.jobTitleData = responseData;
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

    checkJobTitleExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.jobTitleData, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForJobTitle = true;
        }
        else {
            this.disableSaveForJobTitle = false;
        }

    }

    filterJobTitles(event) {
        this.jobTitleList = this.jobTitleData;

        const jobTitleData = [...this.jobTitleData.filter(x => {
            return x.description.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.jobTitleList = jobTitleData;
    }

    selectedJobTitle(object) {
        const exists = selectedValueValidate('description', object, this.selectedRecordForEdit)
        this.disableSaveForJobTitle = !exists;
    }

    saveJobTitle() {
        const data = {
            ...this.addNewJobTitle, createdBy: this.userName, updatedBy: this.userName,
            description: editValueAssignByCondition('description', this.addNewJobTitle.description)
        };
        if (!this.isEdit) {
            this.jobTitleService.newJobTitle(data).subscribe(() => {
                this.resetJobTitleForm();
                this.getJobTitleList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Job Title Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.jobTitleService.updateAction(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetJobTitleForm();
                this.getJobTitleList();
                this.alertService.showMessage(
                    'Success',
                    `Updated Job Title Successfully`,
                    MessageSeverity.success
                );
            })
        }
    }

    resetJobTitleForm() {
        this.isEdit = false;
        this.disableSaveForJobTitle = false;
        this.selectedRecordForEdit = undefined;
        this.addNewJobTitle = { ...this.newJobTitle };
    }


    editJobTitle(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveForEdit = true;
        this.disableSaveForJobTitle = false;

        this.addNewJobTitle = {
            ...rowData, description: getObjectById('jobTitleId', rowData.jobTitleId, this.jobTitleData)
        };
        this.selectedRecordForEdit = { ...this.addNewJobTitle }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.jobTitleService.updateAction(data).subscribe(() => {
            // this.getvendorClassificationList();
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
            this.jobTitleService.deleteAcion(this.selectedRowforDelete.jobTitleId).subscribe(() => {
                this.getJobTitleList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Job Title Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.jobTitleService.getJobTitleAudit(rowData.jobTitleId).subscribe(res => {
            this.auditHistory = res[0].result;
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
         this.jobTitleData=newarry;
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
              this.jobTitleData = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.jobTitleData= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.jobTitleData= newarry;
			}
        }
        this.totalRecords = this.jobTitleData.length ;
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
            this.commonService.updatedeletedrecords('JobTitle',
            'JobTitleId',this.restorerecord.jobTitleId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getJobTitleList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
    
 

}