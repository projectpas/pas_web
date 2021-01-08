import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import * as $ from 'jquery';
import { MenuItem, LazyLoadEvent } from 'primeng/api';//bread crumb
//  
// import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterCompany } from '../../models/mastercompany.model';
import { GLAccountClassService } from '../../services/glaccountclass.service';

import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { SelectButtonModule } from 'primeng/selectbutton'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'

import { AuditHistory } from '../../models/audithistory.model';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { GLAccountClass } from '../../models/glaccountclass.model';
import { SingleScreenAuditDetails } from '../../models/single-screen-audit-details.model';
import { ConfigurationService } from '../../services/configuration.service';
import { validateRecordExistsOrNot, getObjectById, getObjectByValue, selectedValueValidate, editValueAssignByCondition } from '../../generic/autocomplete';

 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';


@Component({
    selector: 'app-gl-account-class',
    templateUrl: './gl-account-class.component.html',
    styleUrls: ['./gl-account-class.component.scss'],
    animations: [fadeInOut]
})
/** GlAccountClass component*/
export class GlAccountClassComponent implements OnInit {
    event: any;
    glAccountClass = [];
    dataSource: MatTableDataSource<GLAccountClass>;
    GLAccountTypeList: GLAccountClass[] = [];
    GLAccountTypeToUpdate: GLAccountClass;
    updatedByInputFieldValue: any;
    createdByInputFieldValue: any;
    private isDelete: boolean = false;
    matvhMode: any;
    formData = new FormData();
    field: any;
    existingRecordsResponse: Object;
    gLAccountType: string = "";
    auditHistory: any[] = [];
    selectedreason: any;
    glAccountClassNameInputFieldValue: any;
    glAccountData: any[] = [];
    disableSave: boolean;
    disableSaveMsg: boolean = false;
    selectedGlAccountClassName: any;
    auditHisory: any[];
    glaccountclassnamecolle: any[] = [];
     currentstatus: string = 'Active';
   

    cols: any[];
    GLCID: any = "";
    GLAccountType: any = "";
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createdDate: any = "";
    updatedDate: any = "";
    GL_Account_Type: any = "";
    selectedColumns: any[];
    // displayedColumns = ['glcid', 'glaccountclassname', 'createdDate', 'companyName'];
    displayedColumns = [

        // { field: 'glcid', header: 'Credit Term Name' },
        { field: 'glAccountClassName', header: 'Name' },
        { field: 'glAccountClassMemo', header: 'Memo' },
        // { field: 'companyName', header: 'Net Days' },
        // { field: 'memo', header: 'Memo' },

    ];
    allGLAccountClass: any[];
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourceAction: GLAccountClass;
    private bodyText: string;
    code_Name: any = "";
    loadingIndicator: boolean;
    allunitData: any;
    closeResult: string;
    title: string = "Create";
    id: number;
    display: boolean = false;
    modelValue: boolean = false;
    errorMessage: any;
    isEdit: boolean = false;
    allreasn: any[] = [];
    modal: NgbModalRef;
    /** Actions ctor */

    public isEditMode: boolean = false;

    private isDeleteMode: boolean = false;
    glAccountclassName: string;
    selectedData: any;
    codeName: string = "";
    filteredBrands: any[];
    localCollection: any[] = [];
    selectedColumn: any[];
    Active: string = "Active";
    glclassViewFileds: any = {};
    disablesave: boolean = false;
    AuditDetails: SingleScreenAuditDetails[];
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    totalRecords: any;
    pageSearch: { query: any; field: any; };
    first: number;
    rows: number;
    paginatorState: { rows: number; first: number; };
    selectedRecordForEdit: any;
    GLAccountClassTypeList: any;
    newGLAccountClassType =
        {
            glAccountClassName: "",
            glAccountClassMemo: null,
            masterCompanyId: 1,
            isActive: true,
            isDeleted: false

        };
    addnewGLAccountClassType = { ...this.newGLAccountClassType };
    viewRowData: any;
    // totalRecords: number;
    //paginatorState: any;

    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;

    glAccountClassPagination: GLAccountClass[];//added
    loading: boolean;

    /** GlAccountClass ctor */
    constructor(private breadCrumb: SingleScreenBreadcrumbService, 
        private commonService: CommonService,
        private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public glAccountService: GLAccountClassService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService) {
        //this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.sourceAction = new GLAccountClass();
    }
    ngOnInit(): void {
        this.loadData();
        this.selectedColumns = this.displayedColumns;
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-gl-account-class';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    private loadData() {

        // this.alertService.startLoadingMessage();
        // this.loadingIndicator = true;
         this.glAccountService.getGlAccountClassList().subscribe(data => {
            // const respData = data[0];
            // this.allunitData = data;

            this.originalTableData=data[0].columnData;
            this.getListByStatus(this.status ? this.status :this.currentstatus)
            //  this.originalTableData=data[0];
            // this.getListByStatus(this.status ? this.status :this.currentstatus)



            // this.GLAccountTypeList = respData.columnData;
            // this.totalRecords = respData.totalRecords;
            // console.log(this.totalRecords);
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            // console.log(this.totalPages);
            // this.alertService.stopLoadingMessage();
        });
    }

    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        // this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    private loadMasterCompanies() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

    }
    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }
    private refresh() {
        this.applyFilter(this.dataSource.filter);
    }

    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;

    }
    private onDataLoadSuccessful(allWorkFlows: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.totalRecords = allWorkFlows.length;
        this.allGLAccountClass = allWorkFlows;

    }
    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    validateRecordExistsOrNot(field: string, currentInput: any, originalData: any) {
        console.log(field, currentInput, originalData)
        if ((field !== '' || field !== undefined) && (currentInput !== '' || currentInput !== undefined) && (originalData !== undefined)) {
            const data = originalData.filter(x => {
                return x[field].toLowerCase() === currentInput.toLowerCase()
            })
            return data;
        }
    }

    open(content) {
        alert('hitest');
        this.disableSave = true;
        this.disableSaveMsg = true;
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new GLAccountClass();
        this.sourceAction.isActive = true;
        this.gLAccountType = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    resetForm() {
        this.isEdit = false;
        this.selectedRecordForEdit = undefined;
        this.addnewGLAccountClassType = { ...this.newGLAccountClassType };
    }

    openView(rowData) {
       
        console.log(rowData);
        this.viewRowData = rowData;
    }
    openDelete(content, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.code_Name = row.gLAccountType;
        //this.GLCID = row.gLCID ;	
        //this.GL_Account_Type = row.gLAccountType;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        console.log(content);
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openEdit(row) {
        console.log(row);
        this.disableSave = true;
        this.disableSaveMsg = false;
        this.isEdit = true;
        // this.isSaving = true;
        this.addnewGLAccountClassType = { ...row, glAccountClassName: getObjectById('glAccountClassId', row.glAccountClassId, this.GLAccountTypeList) };
        this.selectedRecordForEdit = { ...this.addnewGLAccountClassType }
        console.log(this.addnewGLAccountClassType);
    }

    handleChange(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.glAccountService.updateGlAccountClass(data).subscribe(() => {
            // this.getUOMList();
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully  `,
                MessageSeverity.success
            );
        })       
    }

    eventHandler(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.GLAccountTypeList, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveMsg = true;
            this.disableSave = true;
        }
        else {
            this.disableSaveMsg = false;
            this.disableSave = false;
        }
    }

    partnmId(object) {
        const exists = selectedValueValidate('glAccountClassName', object, this.selectedRecordForEdit)
        this.disableSave = !exists;
        this.disableSaveMsg = !exists;
        //for (let i = 0; i < this.allreasn.length; i++) {
        //    if (event == this.allreasn[i][0].gLAccountType) {
        //        this.disableSave = true;
        //        this.selectedreason = event;
        //    }
        //}
    }

    filterGlAccountclass(event) {
        this.GLAccountClassTypeList = this.GLAccountTypeList;
        const GLAccount = [...this.GLAccountTypeList.filter(x => {
            return x.glAccountClassName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.GLAccountClassTypeList = GLAccount;
    }

    editItemAndCloseModel() {

        this.isSaving = true;
        console.log(this);

        const data = {
            ...this.addnewGLAccountClassType, createdBy: this.userName, updatedBy: this.userName,
            name: editValueAssignByCondition('name', this.addnewGLAccountClassType.glAccountClassName)

        };

        if (!this.isEdit) {
            this.glAccountService.newGlAccountClass(data).subscribe(() => {
                // this.resetCreditTermsForm();
               this. resetForm();
                this.loadData();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Credit Term Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.glAccountService.updateGlAccountClass(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                // this.resetCreditTermsForm();
                this.resetForm();
                this.loadData();
                this.alertService.showMessage(
                    'Success',
                    `Updated Credit Term Successfully`,
                    MessageSeverity.success
                );
            })
        }

    }

    getChange() {
        if (this.disableSaveMsg == false ) {
            this.disableSave = false;
        }
    }

    onBlur(event) {
        const value = event.target.value;

         this.disableSaveMsg = false;
        for (let i = 0; i < this.GLAccountTypeList.length; i++) {
            let glAccountClassName = this.GLAccountTypeList[i].glAccountClassName;
            let glAccountId = this.GLAccountTypeList[i].glAccountClassId;
            if (glAccountClassName.toLowerCase() == value.toLowerCase()) {
                if (this.isEditMode || !this.isEditMode) {
                    this.disableSaveMsg = true;
                    this.disableSave = true;
                }
                else if (glAccountId != this.selectedRecordForEdit.glAccountClassId) {
                    this.disableSaveMsg = true;
                    this.disableSave = false;

                }
                else {

                    this.disableSaveMsg = false;
                    this.disableSave = false;
                }
                console.log('glAccountClassName :', glAccountClassName);
                break;
            }
        }

    }


    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.glAccountService.deleteGlAccountClass(this.sourceAction.glAccountClassId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }



    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.viewRowData = undefined;
    }

    private saveSuccessHelper(role?: GLAccountClass) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
        this.loadData();
        
        this.alertService.stopLoadingMessage();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    private saveCompleted(user?: GLAccountClass) {
        this.isSaving = false;
        if (this.isDelete == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDelete = false;
        }
        else {
           
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
        }
        this.loadData();
    }

    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.auditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })


    }

    getAuditHistoryById(rowData) {
        this.glAccountService.getGlAudit(rowData.glAccountClassId).subscribe(res => {
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
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=GLAccountClass&fileName=GLAccountClass.xlsx`;

        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.glAccountService.GLAccountClassCustomUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.existingRecordsResponse = res;
                this.getGLAccountClassList();
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
         this.GLAccountTypeList=newarry;
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
              this.GLAccountTypeList = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.GLAccountTypeList= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.GLAccountTypeList= newarry;
			}
        }
        this.totalRecords = this.GLAccountTypeList.length ;
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
            this.commonService.updatedeletedrecords('GLAccountClass',
            'GLAccountClassId',this.restorerecord.glAccountClassId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadData();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 

    getGLAccountClassList() {

       // this.loadData();
    }

}


