import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';

import { AuthService } from '../../services/auth.service';


import { MasterCompany } from '../../models/mastercompany.model';
import { TagTypeService } from '../../services/tag-type.service';
import { Integration } from '../../models/integration.model';
import { AuditHistory } from '../../models/audithistory.model';
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails } from '../../models/single-screen-audit-details.model';
import { getObjectByValue, validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, getObjectById } from '../../generic/autocomplete';
import { Table } from 'primeng/table';
import { ConfigurationService } from '../../services/configuration.service';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-tag-type',
    templateUrl: './tag-type.component.html',
    styleUrls: ['./tag-type.component.scss'],
    animations: [fadeInOut]
})
/** TagType component*/
export class TagTypeComponent implements OnInit {

    originalData: any=[];
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    headers = [
        
        { field: 'name', header: 'Name' },
        { field: 'description', header: 'Description' },
        { field: 'memo', header: 'Memo' },
    ]
    selectedColumns = this.headers;
    formData = new FormData()
    @ViewChild('dt',{static:false})
    modal: NgbModalRef;
    private table: Table;
    auditHistory: any[] = [];
    disableSaveGroupId: boolean = false;
    existingRecordsResponse: any;
    PortalList: any;
    disableSaveForDescription: boolean = false;
    descriptionList: any;
    disableSaveForDescriptionmsg: boolean = false;
    new = {
        name: "",
        description: "",
        masterCompanyId: 1,
        isActive: true,
        memo: "",
    }
    addNew = { ...this.new };

    currentstatus: string = 'Active';
    selectedRecordForEdit: any;
    viewRowData: any;
    selectedRowforDelete: any; 
    AuditDetails: any; 
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private authService: AuthService,
        private modalService: NgbModal,
        private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder,
        private alertService: AlertService,
        public tagTypeervice: TagTypeService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService) {
       
    }


    ngOnInit(): void {
        this.getList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-tag-type';
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
    columnsChanges() {
        this.refreshList();
    }
    refreshList() {
        this.table.reset();

        // this.table.sortOrder = 0;
        // this.table.sortField = '';

        this.getList();
    }

    //customExcelUpload(event) {
    //    // const file = event.target.files;

    //    // console.log(file);
    //    // if (file.length > 0) {

    //    //     this.formData.append('file', file[0])
    //    //     this.unitofmeasureService.UOMFileUpload(this.formData).subscribe(res => {
    //    //         event.target.value = '';

    //    //         this.formData = new FormData();
    //    //         this.existingRecordsResponse = res;
    //    //         this.getList();
    //    //         this.alertService.showMessage(
    //    //             'Success',
    //    //             `Successfully Uploaded  `,
    //    //             MessageSeverity.success
    //    //         );

    //    //     })
    //    // }

    //}
    //sampleExcelDownload() {
    //    // const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=UnitOfMeasure&fileName=uom.xlsx`;

    //    // window.location.assign(url);
    //}

    getList() {
        this.tagTypeervice.getAllWorkFlows().subscribe(res => {

            this.originalTableData=res[0];
            this.getListByStatus(this.status ? this.status :this.currentstatus)
            // const responseData = res[0];            
            // this.originalData = responseData;
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

    getChange() {
        if (this.disableSaveForDescriptionmsg == false) {
            this.disableSaveForDescription = false;
        }
    }
    //checkGroupDescriptionExists(field, value) {
    //    console.log(this.selectedRecordForEdit);
    //    const exists = validateRecordExistsOrNot(field, value, this.originalData, this.selectedRecordForEdit);
    //    if (exists.length > 0) {
    //        this.disableSaveForDescription = true;
    //    }
    //    else {
    //        this.disableSaveForDescription = false;
    //    }

    //}
    filterDescription(event) {
        this.descriptionList = this.originalData;

        const descriptionData = [...this.originalData.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.descriptionList = descriptionData;
    }
    selectedDescription(object) {
        if (object.description !== this.selectedRecordForEdit) {
            const exists = selectedValueValidate('Name', object, this.selectedRecordForEdit)
            this.disableSaveForDescription = !exists;
            this.disableSaveForDescriptionmsg = !exists;
        }
        else {
            this.disableSaveForDescription = false;
            this.disableSaveForDescriptionmsg = false;
        }
      
    }
    checkGroupDescriptionExists(value) {

        for (let i = 0; i < this.originalData.length; i++) {

            if (value == this.originalData[i].name) {
                const exists = selectedValueValidate('Name', value, this.selectedRecordForEdit)

                this.disableSaveForDescription = !exists;
                this.disableSaveForDescriptionmsg = !exists;

                return;
            }
            else {
                this.disableSaveForDescription = false;
                this.disableSaveForDescriptionmsg = false;
            }

        }

    }
  

    save() {
        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,           
            name: editValueAssignByCondition('name',this.addNew.name),
            description: editValueAssignByCondition('description', this.addNew.description)
        };
        if (!this.isEdit) {
            this.tagTypeervice.newAction(data).subscribe(() => {
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Tag Type Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.tagTypeervice.updateAction(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Tag Type Successfully  `,
                    MessageSeverity.success
                );
            })
        }
    }

    resetForm() {
        this.isEdit = false;
        this.selectedRecordForEdit = undefined;
        this.disableSaveForDescriptionmsg = false;
        this.addNew = { ...this.new };
    }


    edit(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveGroupId = false;
        this.disableSaveForDescription = true;
        this.disableSaveForDescriptionmsg = false;


        this.addNew = {
            ...rowData,        
            name: getObjectByValue('name', rowData.name, this.originalData),
        };
        console.log(this.addNew + 'Helooooooooooooooooo');
        this.selectedRecordForEdit = { ...this.addNew }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.tagTypeervice.updateAction(data).subscribe(() => {
            this.getList();
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
        console.log(this.selectedRowforDelete + 'selectedRowforDelete');

    }
    deleteConformation(value) {
        if (value === 'Yes') {
            this.tagTypeervice.deleteAcion(this.selectedRowforDelete.tagTypeId, this.userName).subscribe(() => {
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Tag Type Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.tagTypeervice.historyintegration(rowData.tagTypeId).subscribe(res => {
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

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=TagType&fileName=TagType.xlsx`;

        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.tagTypeervice.IntegrationCustomUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.existingRecordsResponse = res;
                this.getList();
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
            this.commonService.updatedeletedrecords('TagType',
            'TagTypeId',this.restorerecord.tagTypeId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 
}