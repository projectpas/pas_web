import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { fadeInOut } from '../../services/animations';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
// import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeExpertiseService } from '../../services/employeeexpertise.service';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { getObjectByValue, validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, getObjectById } from '../../generic/autocomplete';
import { Table } from 'primeng/table';
import { ConfigurationService } from '../../services/configuration.service';


import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';



@Component({
    selector: 'app-employee-expertise',
    templateUrl: './employee-expertise.component.html',
    styleUrls: ['./employee-expertise.component.scss'],
    animations: [fadeInOut]
})
/** EmployeeExpertise component*/
export class EmployeeExpertiseComponent implements OnInit {
    originalData: any=[];
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    headers = [
        { field: 'description', header: ' Employee Expertise ' },
        { field: 'memo', header: 'Memo' },
        { field: 'isWorksInShop', header: 'Shop Employee' },
        
    ]
    selectedColumns = this.headers;
    formData = new FormData()
    @ViewChild('dt',{static:false})
    modal: NgbModalRef;
    private table: Table;
    auditHistory: any[] = [];
    disableSaveEmpExpertise: boolean = false;
    EmpExpertiseList: any;
    disableSaveForEdit: boolean = false;
    AuditDetails: any;
    new = {
        description: "",
        masterCompanyId: 1,
        isActive: true,
        memo: "",
        isWorksInShop:false
    }
    addNew = { ...this.new };
    currentstatus: string = 'Active';

    selectedRecordForEdit: any;
    viewRowData: any;
    selectedRowforDelete: any;
    // originalData: any;
    existingRecordsResponse: any;
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private authService: AuthService,
        private modalService: NgbModal,
        private commonService: CommonService,
        private alertService: AlertService,
        public employeeService: EmployeeExpertiseService,
        private configurations: ConfigurationService) {


    }

    ngOnInit(): void {
        this.getList();
        // this.loadData();
        // this.cols = [
        //    // { field: 'itemGroupId', header: 'IGID' },

        //     // { field: 'createdBy', header: 'Created By' },
        //     // { field: 'updatedBy', header: 'Updated By' },
        //     //{ field: 'updatedDate', header: 'Updated Date' },
        //     //{ field: 'createdDate', header: 'Created Date' }
        // ];
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-employee-expertise';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        // this.selectedColumns = this.cols;
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

    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    customExcelUpload(event) {
         const file = event.target.files;

         console.log(file);
         if (file.length > 0) {

             this.formData.append('file', file[0])
             this.employeeService.EmployeeExpertiseFileUpload(this.formData).subscribe(res => {
                 event.target.value = '';

                 this.formData = new FormData();
                 this.existingRecordsResponse = res;

                 var result = this.existingRecordsResponse[0].uploadStatus;
                 if (result == "Duplicate") {

                     this.alertService.showMessage(
                         'Duplicate',
                         `Duplicate Records found `,
                         MessageSeverity.success
                     );
                 }
                 if (result === "Success") {
                     this.alertService.showMessage(
                         'Success',
                         `Success Records found `,
                         MessageSeverity.success
                     );
                 }

                 if (result === "Failed") {
                     this.alertService.showMessage(
                         'Failed',
                         `Failed `,
                         MessageSeverity.success
                     );
                 }   
                 this.getList();
             })
         }

    }
    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=EmployeeExpertise&fileName=employeeExpertise.xlsx`;

        window.location.assign(url);
    }

    getmemo() {
     
        this.disableSaveForEdit = false;
    
}
    getList() {
        this.employeeService.getWorkFlows().subscribe(res => {

            this.originalTableData=res[0];
            this.getListByStatus(this.status ? this.status :this.currentstatus)


            // const responseData = res[0];
            // // this.uomHeaders = responseData.columHeaders;
            // // this.selectedColumns = responseData.columHeaders;
            // this.originalData = responseData;
            // this.totalRecords = responseData.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
    }
    changePage(event: { first: any; rows: number }) {
        console.log(event);
        // this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }


    checkEmployeeExpertiseExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.originalData, this.selectedRecordForEdit);
        console.log(exists);
        if (exists.length > 0) {
            this.disableSaveEmpExpertise = true;
        }
        else {
            this.disableSaveEmpExpertise = false;
        }

    }
    filterEmployeeExpertise(event) {
        this.EmpExpertiseList = this.originalData;

        const EmpExpertiseData = [...this.originalData.filter(x => {
            return x.description.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.EmpExpertiseList = EmpExpertiseData;
    }
    selectedEmpExpertise(object) {
        const exists = selectedValueValidate('description', object, this.selectedRecordForEdit)

        this.disableSaveEmpExpertise = !exists;
    }



    save() {
        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
            description: editValueAssignByCondition('description', this.addNew.description),
            // unitName: editValueAssignByCondition('description', this.addNew.unitName)
        };
        if (!this.isEdit) {
            this.employeeService.newAction(data).subscribe(() => {
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added Employee Expertise  Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.employeeService.updateAction(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  Employee Expertise  Successfully  `,
                    MessageSeverity.success
                );
            })
        }
    }

    resetForm() {
        this.isEdit = false;
        this.selectedRecordForEdit = undefined;
        this.disableSaveEmpExpertise = false;
        this.addNew = { ...this.new };
    }


    edit(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveEmpExpertise = false;
        this.disableSaveForEdit = true;


        this.addNew = {
            ...rowData,
            description: getObjectById('employeeExpertiseId', rowData.employeeExpertiseId, this.originalData),
        };
        this.selectedRecordForEdit = { ...this.addNew }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.employeeService.updateAction(data).subscribe(() => {
            // this.getUOMList();
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
            this.employeeService.deleteAcion(this.selectedRowforDelete.employeeExpertiseId).subscribe(() => {
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted  Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.employeeService.historyAcion(rowData.employeeExpertiseId).subscribe(res => {
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
            this.commonService.updatedeletedrecords('EmployeeExpertise',
            'EmployeeExpertiseId',this.restorerecord.employeeExpertiseId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
}