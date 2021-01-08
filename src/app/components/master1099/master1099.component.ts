import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { ActionService } from '../../services/action.service';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
//import { GlCashFlowClassification } from '../../models/glcashflowclassification.model';
import { AuthService } from '../../services/auth.service';


import { MasterCompany } from '../../models/mastercompany.model';
import { Master1099Service } from '../../services/master-1099.service';

import { TableModule, Table } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { SelectButtonModule } from 'primeng/selectbutton'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'

import { AuditHistory } from '../../models/audithistory.model';
import { MenuItem, LazyLoadEvent } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails } from '../../models/single-screen-audit-details.model';
import { validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, getObjectByValue, getObjectById } from '../../generic/autocomplete';
import { ConfigurationService } from '../../services/configuration.service';
import { listSearchFilterObjectCreation } from '../../generic/autocomplete';

 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-master1099',
    templateUrl: './master1099.component.html',
    styleUrls: ['./master1099.component.scss'],
    animations: [fadeInOut]
})
/** master1099 component*/
//export class Master1099Component {
//    /** master1099 ctor */
//    constructor() {

//    }
//}

export class Master1099Component implements OnInit {
    originalData: any = [];
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    headers = [
        { field: 'name', header: 'Master 1099 Name' },
        { field: 'description', header: 'Description' },
        { field: 'memo', header: 'Memo' },
    ];
    selectedColumns = this.headers;
    formData = new FormData()
    @ViewChild('dt',{static:false})
    modal: NgbModalRef;
    private table: Table;
    auditHistory: any[] = [];
    disableSaveGLCFName: boolean = false;
    glCashFlowList: any;
    descriptionList: any;
    existingRecordsResponse: Object;
    new = {
        name: "",
        description: "",
        masterCompanyId: 1,
        isActive: true,
        isDelete: 0,
        memo: "",
    }
    addNew = { ...this.new };
    currentstatus: string = 'Active';
    selectedRecordForEdit: any;
    viewRowData: any;
    selectedRowforDelete: any;
    // existingRecordsResponse = []
    lazyLoadEventData: any;
    loadingIndicator: boolean;
    disableSaveGLCFNameSave: boolean = false;

    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private commonService: CommonService,
         private authService: AuthService, private modalService: NgbModal,
        private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, private dialog: MatDialog,
        private masterComapnyService: MasterComapnyService, private master1099Services: Master1099Service, private configurations: ConfigurationService) {

    }
    ngOnInit() {
        //	this.getList();

        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-master-1099';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);

		/*this.loadData();
				
		*/
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
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

        //  this.getList();
    }
    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }

    customExcelUpload(event) {
        const file = event.target.files;
        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.master1099Services.master1099FileUpload(this.formData).subscribe(res => {
                event.target.value = '';
                this.formData = new FormData();
                this.existingRecordsResponse = res;
                this.loadAllSiteData(this.constantFilters());
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
                //$('#duplicateRecords').modal('show');
                //document.getElementById('duplicateRecords').click();
            })
        }

    }

    //changePage(event: { first: any; rows: number }) {
    //    console.log(event);
    //    const pageIndex = (event.first / event.rows);
    //    this.pageSize = event.rows;
    //    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    //}
    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=master1099&fileName=1099.xlsx`;

        window.location.assign(url);
    }

    loadAllSiteData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.loadingIndicator = true;
        if (event.globalFilter == null) {
            event.globalFilter = ""
        }
        const PagingData = { ...event, filters: listSearchFilterObjectCreation(event.filters) }
        this.master1099Services.search(PagingData).subscribe(
            results => {

                this.originalTableData=results[0]['results'];
                this.getListByStatus(this.status ? this.status :this.currentstatus)
                // this.originalData = results[0]['results'];
                // this.totalRecords = results[0]['totalRecordsCount']
                // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            },
            error => this.onDataLoadFailed(error)
        );
    }

    //OnDataLoadFailed
    private onDataLoadFailed(error: any) {
        // alert(error);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }

    constantFilters() {
        return {
            first: 0,
            rows: 10,
            sortField: undefined,
            sortOrder: 1,
            filters: "",
            globalFilter: "",
            multiSortMeta: undefined
        }
    }
    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        // this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }


    checkGLCFNameExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.glCashFlowList, this.isEdit);
        if (exists.length > 0) {
            this.disableSaveGLCFName = true;
            this.disableSaveGLCFNameSave = true;
        }
        else {
            this.disableSaveGLCFName = false;
            this.disableSaveGLCFNameSave = false;
        }

    }
    filterGLCFName(event) {
        this.glCashFlowList = this.originalData;

        const glCashFlowData = [...this.originalData.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.glCashFlowList = glCashFlowData;
    }
    selectedGLCFName(object) {

        const exists = selectedValueValidate('name', object, this.isEdit)
        this.disableSaveGLCFName = !exists;
        this.disableSaveGLCFNameSave = !exists;
    }

    save() {
        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
            name: editValueAssignByCondition('name', this.addNew.name),
        };
        if (!this.isEdit) {
            this.master1099Services.newGlCashFlowClassification(data).subscribe(() => {
                this.resetForm();
                this.loadAllSiteData(this.constantFilters());
                this.alertService.showMessage(
                    'Success',
                    `Added New Master 1099 Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.master1099Services.updateMaster1099(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetForm();
                this.loadAllSiteData(this.constantFilters());
                this.alertService.showMessage(
                    'Success',
                    `Updated Master 1099 Successfully`,
                    MessageSeverity.success
                );
            })
        }

    }

    resetForm() {
        this.isEdit = false;
        this.selectedRecordForEdit = undefined;
        this.addNew = { ...this.new };
        this.disableSaveGLCFName = false;
        this.disableSaveGLCFNameSave = false;
    }
    getmemo($event) {
        if (this.disableSaveGLCFName == false) {
            this.disableSaveGLCFName = false;
            this.disableSaveGLCFNameSave = false;
        }
    }

    edit(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveGLCFName = false;
        this.disableSaveGLCFNameSave = true;

        this.addNew = {
            ...rowData,
            name: getObjectById('master1099Id', rowData.master1099Id, this.originalData),
        };
        this.selectedRecordForEdit = { ...this.addNew }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.master1099Services.updateMaster1099(data).subscribe(() => {
            //   this.loadAllSiteData(this.constantFilters());
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully`,
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
            this.master1099Services.deleteMaster1099(this.selectedRowforDelete.master1099Id).subscribe(() => {
                this.loadAllSiteData(this.constantFilters());
                this.alertService.showMessage(
                    'Success',
                    `Deleted Master 1099 Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.master1099Services.historyGlCashFlowClassification(rowData.master1099Id).subscribe(res => {
            this.auditHistory = res[0];
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
            this.commonService.updatedeletedrecords('Master1099',
            'Master1099Id',this.restorerecord.master1099Id, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadAllSiteData(this.lazyLoadEventData);
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }

}
