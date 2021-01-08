import { fadeInOut } from "../../services/animations";
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService, MessageSeverity } from "../../services/alert.service";
import { AssetStatus } from "../../models/asset-status.model";
import { AssetStatusService } from "../../services/asset-status/asset-status.service";
// import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AssetStatusAudit} from "../../models/asset-status-audit.model";

import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AuthService } from "../../services/auth.service";
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { MasterCompany } from '../../models/mastercompany.model';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AuditHistory } from '../../models/audithistory.model';
import { ConfigurationService } from '../../services/configuration.service';

 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'asset-status',
    templateUrl: './asset-status.component.html',
    styleUrls: ['asset-status.component.scss'],
    animations: [fadeInOut]
})
export class AssetStatusComponent implements OnInit {

    currentAssetStatus: AssetStatus;
    dataSource: MatTableDataSource<AssetStatus>;
    assetStatusToUpdate: AssetStatus;
    assetStatusToRemove: AssetStatus;
    assetStatusList: AssetStatus[] = [];
    assetStatusAuditList: AssetStatusAudit[];
    updateMode: boolean;
    selectedData: any;
    formData = new FormData();
    public auditHisory: AuditHistory[] = [];
    private isDeleteMode: boolean = false;
    private isEditMode: boolean = false;
    modal: NgbModalRef;
    public sourceAction: AssetStatus;
    display: boolean = false;
    modelValue: boolean = false;
    allComapnies: MasterCompany[] = [];
    Active: string;
    AuditDetails: SingleScreenAuditDetails[];
    memoNotes: string;
    memoPopupText: string;
    code: any = "";
    name: any = "";
    memo: any = "";
    selectedreason: any;
    createdBy: any = "";
    updatedBy: any = "";
    createdDate: any = "";
    allunitData: any;
    code_Name: any = "";
    cols: any[];
    updatedDate: any = "";
    selectedColumns: any[];
    localCollection: any[] = [];
    disableSave: boolean = false;
    isSaving: boolean;
    assetStatusId: number = 0;
    private isDelete: boolean = false;
    codeName: string = "";
    allreasn: any[] = [];
    existingRecordsResponse: Object;
    loadingIndicator: boolean;
    auditHistory: any[] = [];
    isEdit: boolean = false;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    displayedColumns = ['Code', 'Name', 'Memo'];
    disableSaveForEdit: boolean = false;
    currentstatus: string = 'Active';

    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    /** AssetStatus ctor */

    paginatorState: { rows: number; first: number; };
    totalRecords: number;
    first: number;
    rows: number;
    loading: boolean;
    disposalTypePagination: AssetStatus[];


    constructor(private alertService: AlertService,
        private commonService: CommonService, private assetStatusService: AssetStatusService, private modalService: NgbModal, private authService: AuthService, private breadCrumb: SingleScreenBreadcrumbService, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.sourceAction = new AssetStatus();
    
    }

    ngOnInit(): void {
        this.loadData();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/asset-status';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

   
    private loadData() {
        // this.alertService.startLoadingMessage();
        // this.loadingIndicator = true;
        this.assetStatusService.getAll().subscribe(data => {         
            
 
            
            this.originalTableData=data[0].columnData;
            // console.log(data[0].columnData);
            this.getListByStatus(this.status ? this.status :this.currentstatus);
           
            this.allunitData = data[0].columHeaders;
            //console.log(data[0].columHeaders);

            // this.assetStatusList = data[0].columnData;
            // console.log(this.assetStatusList);
            // this.totalRecords = this.assetStatusList.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.cols = [
                console.log(this.allunitData),
                this.selectedColumns = this.allunitData
            ];
            this.selectedData = this.selectedColumns
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
        // Causes the filter to refresh there by updating with recently added data.
        this.applyFilter(this.dataSource.filter);
    }

    public allWorkFlows: AssetStatus[] = [];

    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
        // debugger;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.auditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;
    }

    private onDataLoadFailed(error: any) {
        // alert(error);
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

    eventHandler(event) {
        let value = event.target.value.toLowerCase()
        if (this.selectedreason) {
            if (value == this.selectedreason.toLowerCase()) {
                this.disableSave = true;
            }
            else {
                this.disableSave = false;
            }
        }
    }

    partnmId(event) {
        for (let i = 0; i < this.allreasn.length; i++) {
            if (event == this.allreasn[i][0].codeName) {
                this.disableSave = true;
                this.selectedreason = event;
            }
        }
    }

    filterAssetStatus(event) {
        this.localCollection = [];

        for (let i = 0; i < this.assetStatusList.length; i++) {

            let codeName = this.assetStatusList[i].code
                ;

            if (codeName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                console.log(codeName);
                this.allreasn.push([{
                    "assetStatusId": this.assetStatusList[i].assetStatusId,
                    "codeName": codeName
                }]),
                    this.localCollection.push(codeName);
            }
        }
    }
    
    resetdepriciationmethod(): void {
        this.updateMode = false;
        this.currentAssetStatus = new AssetStatus();
    }

    open(content) {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.disableSave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new AssetStatus();
        this.sourceAction.isActive = true;

        this.codeName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    getmemo() {
     
        this.disableSaveForEdit = false;
    
}
    openEdit(content, row) {

        this.isEditMode = true;
        this.disableSave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = row;
        this.disableSaveForEdit = true;
        this.codeName = row.code;
          
        this.assetStatusId = this.assetStatusId;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    SaveandEditAssetStatus() {
        // debugger;


        this.isSaving = true;
        console.log(this);

        const params = <any>{
            createdBy: this.userName,
            updatedBy: this.userName,
            Code: this.codeName,
            Name: this.sourceAction.name,
            Memo: this.sourceAction.memo,
            assetStatusId: this.sourceAction.assetStatusId,
            IsActive: this.sourceAction.isActive,
            IsDelete: this.isDelete,
            masterCompanyId: 1
        };
        if (this.isEditMode == false) {
            this.assetStatusService.add(params).subscribe(
                role => this.saveSuccessHelper(role),
                error => this.saveFailedHelper(error));
        }
        else {
            params.AssetDisposalTypeId = this.sourceAction.assetStatusId;
            this.assetStatusService.update(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        this.modal.close();
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.assetStatusService.remove(this.sourceAction.assetStatusId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }

    private saveSuccessHelper(role?: AssetStatus) {
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

    private saveCompleted(user?: AssetStatus) {
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

    handleChange(rowData, e) {

        const params = <any>{
            createdBy: this.userName,
            updatedBy: this.userName,
            Code: rowData.code,
            Name: rowData.name,
            Memo: rowData.memo,
            isActive: rowData.isActive,
            IsDelete: false,
            masterCompanyId: 1,
            assetStatusId: rowData.assetStatusId
        };
        if (e.checked == false) {
            this.Active = "In Active";
            this.assetStatusService.update(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }
        else {
            this.Active = "Active";
            this.assetStatusService.update(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

    }

    openView(content, row) {
        console.log(content);
        this.sourceAction = row;
        this.code = row.code;
        this.name = row.name;
        this.memo = row.memo;
        this.createdBy = row.createdBy;
        this.updatedBy = row.updatedBy;
        this.createdDate = row.createdDate;
        this.updatedDate = row.updatedDate;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }


    openDelete(content, row) {
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.code_Name = row.code;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    
     resetAddAssetStatus(): void {
        this.currentAssetStatus = new AssetStatus();
    }

    resetUpdateAssetStatus(): void {
        this.assetStatusToUpdate = new AssetStatus();
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

 
    getAuditHistoryById(rowData) {
        this.assetStatusService.getAssetAudit(rowData.assetStatusId).subscribe(res => {
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
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=AssetStatus&fileName=AssetStatus.xlsx`;

        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.assetStatusService.AssetStatusCustomUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.existingRecordsResponse = res;
                this.getAssetStatusList();
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

    getAssetStatusList() {

        this.loadData();
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
         this.assetStatusList=newarry;
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
              this.assetStatusList = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.assetStatusList= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.assetStatusList= newarry;
			}
        }
        this.totalRecords = this.assetStatusList.length ;
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
            this.commonService.updatedeletedrecords('AssetStatus',
            'AssetStatusId',this.restorerecord.assetStatusId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadData();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 
}