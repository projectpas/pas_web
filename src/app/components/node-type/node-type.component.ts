﻿import { Component, ViewChild, OnInit } from '@angular/core';
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
import { NodeTypeService } from '../../services/node-Type.service';
// import { DataTableModule } from 'primeng/datatable'; 
import { TableModule, Table } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { SelectButtonModule } from 'primeng/selectbutton'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'
// import { Action } from 'rxjs/scheduler/Action';
import { AuditHistory } from '../../models/audithistory.model';
import { MenuItem, LazyLoadEvent } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails } from '../../models/single-screen-audit-details.model';
import { validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, getObjectByValue, getObjectById } from '../../generic/autocomplete';
import { ConfigurationService } from '../../services/configuration.service';
import { listSearchFilterObjectCreation } from '../../generic/autocomplete';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-node-type',
    templateUrl: './node-type.component.html',
    styleUrls: ['./node-type.component.scss'],
    animations: [fadeInOut]
})
/** nodeType component*/
//export class NodeTypeComponent {
//    /** nodeType ctor */
//    constructor() {

//    }
//}

export class NodeTypeComponent implements OnInit {
    originalData: any = [];
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    headers = [
        { field: 'nodeTypeName', header: 'Node Type Name' },
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
 disableSaveForEdit: boolean = false;
    currentstatus: string = 'Active';

    new = {
        nodeTypeName: "",
        description: "",
        masterCompanyId: 1,
        isActive: true,
        isDelete: 0,
        memo: "",
    }
    addNew = { ...this.new };
    selectedRecordForEdit: any;
    viewRowData: any;
    selectedRowforDelete: any;
    // existingRecordsResponse = []
    lazyLoadEventData: any;
    loadingIndicator: boolean;
    disableSaveGLCFNameSave: boolean = false;
    AuditDetails: any;
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
         private authService: AuthService,
         private commonService: CommonService,
          private modalService: NgbModal,
        private activeModal: NgbActiveModal, private _fb: FormBuilder, 
        private alertService: AlertService, private dialog: MatDialog,
        private masterComapnyService: MasterComapnyService,
         private glCashFlowClassificationService: NodeTypeService,
        private configurations: ConfigurationService) {

    }
    ngOnInit() {
        //	this.getList();
this.loadAllSiteData(event);
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-node-type';
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

        //  this.getList();
    }

    customExcelUpload(event) {
        const file = event.target.files;
        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.glCashFlowClassificationService.getGLCashFlowClassificationFileUpload(this.formData).subscribe(res => {
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
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=NodeType&fileName=NodeType.xlsx`;

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
        this.glCashFlowClassificationService.search(PagingData).subscribe(
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
        const exists = validateRecordExistsOrNot(field, value, this.originalData, this.selectedRecordForEdit);
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
            return x.nodeTypeName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.glCashFlowList = glCashFlowData;
    }
    selectedGLCFName(object) {
        const exists = selectedValueValidate('nodeTypeName', object, this.selectedRecordForEdit)
        this.disableSaveGLCFName = !exists;
        this.disableSaveGLCFNameSave = !exists;
    }

    save() {
        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
            nodeTypeName: editValueAssignByCondition('nodeTypeName', this.addNew.nodeTypeName),
        };
        if (!this.isEdit) {
            this.glCashFlowClassificationService.newGlCashFlowClassification(data).subscribe(() => {
                this.resetForm();
                this.loadAllSiteData(this.constantFilters());
                this.alertService.showMessage(
                    'Success',
                    `Added New Node Type Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.glCashFlowClassificationService.updateCashFlowClassification(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetForm();
                this.loadAllSiteData(this.constantFilters());
                this.alertService.showMessage(
                    'Success',
                    `Updated Node Type Successfully`,
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
    getmemo() {
       this.disableSaveForEdit=false
    }

    edit(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveGLCFName = false;
        this.disableSaveGLCFNameSave = false;
this.disableSaveForEdit=true;
        this.addNew = {
            ...rowData,
            nodeTypeName: getObjectById('nodeTypeId', rowData.nodeTypeId, this.originalData),
        };
        this.selectedRecordForEdit = { ...this.addNew }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.glCashFlowClassificationService.updateCashFlowClassification(data).subscribe(() => {
            //this.loadAllSiteData(this.constantFilters());
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
            this.glCashFlowClassificationService.deleteCashFlowClassification(this.selectedRowforDelete.nodeTypeId, this.userName).subscribe(() => {
                this.loadAllSiteData(this.constantFilters());
                this.alertService.showMessage(
                    'Success',
                    `Deleted Node Type Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.glCashFlowClassificationService.historyGlCashFlowClassification(rowData.nodeTypeId).subscribe(res => {
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
            this.commonService.updatedeletedrecords('NodeType',
            'NodeTypeId',this.restorerecord.nodeTypeId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadAllSiteData(this.lazyLoadEventData);
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 


}