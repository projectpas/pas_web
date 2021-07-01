import { fadeInOut } from "../../services/animations";
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService, MessageSeverity } from "../../services/alert.service";
import { AssetAcquisitionType } from "../../models/asset-acquisition-type.model";
import { AssetAcquisitionTypeService } from "../../services/asset-acquisition-type/asset-acquisition-type.service";
// import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AssetAcquisitionTypeAudit} from "../../models/asset-acquisition-type-audit.model";

import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AuthService } from "../../services/auth.service";
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { MasterCompany } from '../../models/mastercompany.model';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AuditHistory } from '../../models/audithistory.model';
import { ConfigurationService } from '../../services/configuration.service';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'asset-acquisition-type',
    templateUrl: './asset-acquisition-type.component.html',
    styleUrls: ['asset-acquisition-type.component.scss'],
    animations: [fadeInOut]
})
export class AssetAcquisitionTypeComponent implements OnInit {

    currentAssetAcquisitionType: AssetAcquisitionType;
    dataSource: MatTableDataSource<AssetAcquisitionType>;
    AssetAcquisitionTypeToUpdate: AssetAcquisitionType;
    AssetAcquisitionTypeToRemove: AssetAcquisitionType;
    AssetAcquisitionTypeList: AssetAcquisitionType[] = [];
    AssetAcquisitionTypeAuditList: AssetAcquisitionTypeAudit[];
    updateMode: boolean;
    selectedData: any;
    formData = new FormData();
    public auditHisory: AuditHistory[] = [];
    private isDeleteMode: boolean = false;
    public isEditMode: boolean = false;
    modal: NgbModalRef;
    public sourceAction: AssetAcquisitionType;
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
    AssetAcquisitionTypeId: number = 0;
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
    recordExists: boolean = false;
    selAssetAcquisitionTypeId: any;
    selectedRow: any;
    currentstatus: string = 'Active';


    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    /** AssetAcquisitionType ctor */

    paginatorState: { rows: number; first: number; };
    totalRecords: number;
    first: number;
    rows: number;
    loading: boolean;
    disposalTypePagination: AssetAcquisitionType[];


    constructor(private alertService: AlertService,
        private commonService: CommonService,
         private AssetAcquisitionTypeService: AssetAcquisitionTypeService,
          private modalService: NgbModal, private authService: AuthService, private breadCrumb: SingleScreenBreadcrumbService, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.sourceAction = new AssetAcquisitionType();
    
    }

    ngOnInit(): void {
        this.loadData();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/asset-acquisition-type';
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
        this.AssetAcquisitionTypeService.getAll().subscribe(data => {
             this.allunitData = data[0].columHeaders;
            // this.AssetAcquisitionTypeList = data[0].columnData;
            // console.log(this.AssetAcquisitionTypeList);
            // this.totalRecords = this.AssetAcquisitionTypeList.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

            this.originalTableData=data[0].columnData;
            this.getListByStatus(this.status ? this.status :this.currentstatus)

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

    public allWorkFlows: AssetAcquisitionType[] = [];

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
            console.log(191);
            if (value == this.selectedreason.toLowerCase() &&
                ((this.isEditMode && this.selAssetAcquisitionTypeId != this.selectedRow.assetAcquisitionTypeId)
                || !this.isEditMode ) )
            {
                this.disableSave = true;
                this.recordExists = true;
            }
            else {
                this.disableSave = false;
                this.recordExists = false;
            }
        }
    }

    onBlurCheck(event) {
        //console.log(this.allreasn);
        console.log(event);
        for (let i = 0; i < this.allreasn.length; i++) {
            this.selectedreason = event.target.value;
            this.recordExists = false;
            if (event.target.value == this.allreasn[i][0].codeName) {
                this.selAssetAcquisitionTypeId = this.allreasn[i][0].AssetAcquisitionTypeId;
                if ((this.isEditMode && this.selAssetAcquisitionTypeId != this.AssetAcquisitionTypeId
                    || !this.isEditMode)) {
                    this.disableSave = true;
                    this.recordExists = true;
                    return;
                }
                console.log(this.allreasn[i][0]);
            }
        }
        this.disableSave = false;
        this.recordExists = false;
    }

    partnmId(event) {
        //console.log(this.allreasn);
        console.log(event);
        for (let i = 0; i < this.allreasn.length; i++) {
            if (event == this.allreasn[i][0].codeName) {
                this.selectedreason = event;
                this.recordExists = false;
                console.log(this.allreasn[i][0]);
                this.selAssetAcquisitionTypeId = this.allreasn[i][0].AssetAcquisitionTypeId;
                if ((this.isEditMode && this.selAssetAcquisitionTypeId != this.AssetAcquisitionTypeId
                    || !this.isEditMode)) {
                    this.disableSave = true;
                    this.recordExists = true;
                    return;
                }
                console.log(this.allreasn[i][0]);
            }
        }
        this.disableSave = false;
        this.recordExists = false;
    }

    filterAssetAcquisitionType(event) {
        this.localCollection = [];

        for (let i = 0; i < this.AssetAcquisitionTypeList.length; i++) {

            let codeName = this.AssetAcquisitionTypeList[i].code
                ;

            if (codeName != null && codeName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                console.log(codeName);
                this.allreasn.push([{
                    "AssetAcquisitionTypeId": this.AssetAcquisitionTypeList[i].assetAcquisitionTypeId,
                    "codeName": codeName
                }]),
                    this.localCollection.push(codeName);
            }
        }
    }
    
    resetdepriciationmethod(): void {
        this.updateMode = false;
        this.currentAssetAcquisitionType = new AssetAcquisitionType();
    }

    open(content) {
        this.recordExists = false;
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.disableSave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new AssetAcquisitionType();
        this.sourceAction.isActive = true;

        this.codeName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openEdit(content, row) {
        this.recordExists = false;
        this.isEditMode = true;
        this.disableSave = true;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = { ...row };
        this.selectedRow = { ...row };
        this.codeName = row.code;
          
        this.AssetAcquisitionTypeId = this.sourceAction.assetAcquisitionTypeId;
        console.log('281', this.sourceAction);
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    SaveandEditAssetAcquisitionType() {
        this.isSaving = true;
        console.log(this.sourceAction);

        const params = <any>{
            createdBy: this.userName,
            updatedBy: this.userName,
            Code: this.codeName,
            Name: this.sourceAction.name,
            Memo: this.sourceAction.memo,
            //AssetAcquisitionTypeId: this.sourceAction.assetAcquisitionTypeId,
            IsActive: this.sourceAction.isActive,
            IsDeleted: this.isDelete,
            masterCompanyId: 1
        };
        if (this.isEditMode == false) {
            this.AssetAcquisitionTypeService.add(params).subscribe(
                role => this.saveSuccessHelper(role),
                error => this.saveFailedHelper(error));
        }
        else {
            params.AssetAcquisitionTypeId = this.sourceAction.assetAcquisitionTypeId;
            this.AssetAcquisitionTypeService.update(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        this.modal.close();
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.AssetAcquisitionTypeService.remove(this.sourceAction.assetAcquisitionTypeId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }

    private saveSuccessHelper(role?: AssetAcquisitionType) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Asset Acquisition Type created successfully`, MessageSeverity.success);
        this.loadData();
        this.alertService.stopLoadingMessage();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    private saveCompleted(user?: AssetAcquisitionType) {
        this.isSaving = false;
        if (this.isDelete == true) {
            this.alertService.showMessage("Success", `Asset Acquisition Type deleted successfully`, MessageSeverity.success);
            this.isDelete = false;
        }
        else {
            this.alertService.showMessage("Success", `Asset Acquisition Type updated successfully`, MessageSeverity.success);
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
            IsDeleted: false,
            masterCompanyId: 1,
            AssetAcquisitionTypeId: rowData.assetAcquisitionTypeId
        };
        if (e.checked == false) {
            this.Active = "In Active";
            this.AssetAcquisitionTypeService.update(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }
        else {
            this.Active = "Active";
            this.AssetAcquisitionTypeService.update(params).subscribe(
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
    
     resetAddAssetAcquisitionType(): void {
        this.currentAssetAcquisitionType = new AssetAcquisitionType();
    }

    resetUpdateAssetAcquisitionType(): void {
        this.AssetAcquisitionTypeToUpdate = new AssetAcquisitionType();
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

 
    getAuditHistoryById(rowData) {
        this.AssetAcquisitionTypeService.getAssetAudit(rowData.assetAcquisitionTypeId).subscribe(res => {
            console.log(res);
            console.log(res[0].result);
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

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=AssetAcquisitionType&fileName=AssetAcquisitionType.xlsx`;

        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.AssetAcquisitionTypeService.AssetAcquisitionTypeCustomUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.existingRecordsResponse = res;
                this.getAssetAcquisitionTypeList();
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
         this.AssetAcquisitionTypeList=newarry;
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
              this.AssetAcquisitionTypeList = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.AssetAcquisitionTypeList= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.AssetAcquisitionTypeList= newarry;
			}
        }
        this.totalRecords = this.AssetAcquisitionTypeList.length ;
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
            this.commonService.updatedeletedrecords('AssetAcquisitionType',
            'AssetAcquisitionTypeId',this.restorerecord.assetAcquisitionTypeId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadData();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }

    getAssetAcquisitionTypeList() {

        this.loadData();
    }

    enableSave() {
        if (!this.recordExists)
            this.disableSave = false;
        else
            this.disableSave = true;
    }

    changeStatus(rowData) {}
}