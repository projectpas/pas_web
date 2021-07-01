import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from "../../services/animations";
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AssetDepConvention } from "../../models/assetDepConvention.model";
import { AssetDepConventionTypeService } from "../../services/assetDepConventionType/assetDepConventionType.service";
// import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../services/auth.service";
import { SingleScreenAuditDetails } from "../../models/single-screen-audit-details.model";
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AuditHistory } from '../../models/audithistory.model';
import { MasterCompany } from '../../models/mastercompany.model';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { ConfigurationService } from '../../services/configuration.service';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-asset-dep-convention-type',
    templateUrl: './asset-dep-convention-type.component.html',
    styleUrls: ['./asset-dep-convention-type.component.scss'],
    animations: [fadeInOut]
})

export class AssetDepConventionTypeComponent implements OnInit {

    currentAssetDep: AssetDepConvention;
    dataSource: MatTableDataSource<AssetDepConvention>;
    assetDepList: AssetDepConvention[] = [];
    assetDepConventionToUpdate: AssetDepConvention;
    updateMode: boolean;
    selectedData: any;
    HasAuditDetails: boolean;
    formData = new FormData();
    existingRecordsResponse: Object;
    public auditHisory: AuditHistory[] = [];
    private isDeleteMode: boolean = false;
    public isEdit: boolean = false;
    modal: NgbModalRef;
    public sourceAction: AssetDepConvention;
    display: boolean = false;
    modelValue: boolean = false;
    allComapnies: MasterCompany[] = [];
    Active: string;
    code: any = "";
    name: any = "";
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createdDate: any = "";
    updatedDate: any = "";
    selectedColumns: any[];
    allreasn: any[] = [];
    loadingIndicator: boolean;
    displayedColumns = ['Code', 'Name', 'Memo'];
    cols: any[];
    memoPopupText: string;
    selectedreason: any;
    AuditDetails: SingleScreenAuditDetails[];
    allunitData: any;
    code_Name: any = "";
    localCollection: any[] = [];
    auditHistory: any[] = [];
    disableSave: boolean = false;
    isSaving: boolean;
    private isDelete: boolean = false;
    codeName: string = "";

    // isEdit: boolean = false;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;

    currentstatus: string = 'Active';

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    /** DepConvension ctor */

    paginatorState: { rows: number; first: number; };
    totalRecords: number;
    first: number;
    rows: number;
    loading: boolean;
    disposalTypePagination: AssetDepConvention[];

    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private commonService: CommonService, private alertService: AlertService, private assetDepConventionTypeService: AssetDepConventionTypeService, private modalService: NgbModal, private authService: AuthService, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.sourceAction = new AssetDepConvention();
    }

    ngOnInit(): void {
        this.loadData();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-asset-dep-convention-type';
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
        this.assetDepConventionTypeService.getAll().subscribe(data => {

            this.originalTableData = data[0].columnData;
            this.getListByStatus(this.status ? this.status : this.currentstatus)

            this.allunitData = data[0].columHeaders;
            // this.assetDepList = data[0].columnData;
            // console.log(this.assetDepList);
            // this.totalRecords = this.assetDepList.length;
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

    public allWorkFlows: AssetDepConvention[] = [];

    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
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

    filterDepConvension(event) {
        this.localCollection = [];

        for (let i = 0; i < this.assetDepList.length; i++) {

            let codeName = this.assetDepList[i].code
                ;

            if (codeName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                console.log(codeName);
                this.allreasn.push([{
                    "AssetDepConventionId": this.assetDepList[i].assetDepConventionId,
                    "codeName": codeName
                }]),
                    this.localCollection.push(codeName);
            }
        }
    }

    resetAssetDepConventionType(): void {
        this.updateMode = false;
        this.currentAssetDep = new AssetDepConvention();
    }
    dismissModel() {
        this.isDeleteMode = false;
        this.isEdit = false;
        this.modal.close();
    }

    open(content) {
        this.isDeleteMode = false;
        this.isEdit = false;
        this.disableSave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new AssetDepConvention();
        this.sourceAction.isActive = true;

        this.codeName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openEdit(content, row) {

        this.isEdit = true;
        this.disableSave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = row;

        this.codeName = row.code;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    SaveandEditDepConvension() {
        this.isSaving = true;
        console.log(this);

        const params = <any>{
            createdBy: this.userName,
            updatedBy: this.userName,
            AssetDepConventionCode: this.codeName,
            AssetDepConventionName: this.sourceAction.name,
            AssetDepConventionMemo: this.sourceAction.memo,

            IsActive: this.sourceAction.isActive,
            IsDeleted: this.isDelete,
            masterCompanyId: 1
        };
        if (this.isEdit == false) {
            this.assetDepConventionTypeService.add(params).subscribe(
                role => this.saveSuccessHelper(role),
                error => this.saveFailedHelper(error));
        }
        else {
            params.AssetDepConventionId = this.sourceAction.assetDepConventionId;
            this.assetDepConventionTypeService.update(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        this.modal.close();
    }

    removeAssetDepConventionType() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.assetDepConventionTypeService.remove(this.sourceAction.assetDepConventionId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }

    private saveSuccessHelper(role?: AssetDepConvention) {
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

    private saveCompleted(user?: AssetDepConvention) {
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
            AssetDepConventionId: rowData.assetDepConventionId,
            AssetDepConventionCode: rowData.code,
            AssetDepConventionName: rowData.name,
            AssetDepConventionMemo: rowData.memo,
            isActive: rowData.isActive,
            IsDeleted: false,
            masterCompanyId: 1
        };
        if (e.checked == false) {
            this.Active = "In Active";
            this.assetDepConventionTypeService.update(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }
        else {
            this.Active = "Active";
            this.assetDepConventionTypeService.update(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

    }

    openView(content, row) {
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
        this.isEdit = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.code_Name = row.code;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    getAuditHistoryById(rowData) {
        this.assetDepConventionTypeService.getAudit(rowData.assetDepConventionId).subscribe(res => {
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
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=DepreciationConvention&fileName=AssetDepConvention.xlsx`;

        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.assetDepConventionTypeService.AssetDepConvCustomUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.existingRecordsResponse = res;
                this.getAssetDepConvList();
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

    getAssetDepConvList() {

        this.loadData();
    }
    getDeleteListByStatus(value) {
        if (value) {
            this.currentDeletedstatus = true;
        } else {
            this.currentDeletedstatus = false;
        }
        this.getListByStatus(this.status ? this.status : this.currentstatus)
    }

    originalTableData: any = [];
    currentDeletedstatus: boolean = false;
    status: any = "Active";
    getListByStatus(status) {
        const newarry = [];
        if (status == 'Active') {
            this.status = status;
            if (this.currentDeletedstatus == false) {
                this.originalTableData.forEach(element => {
                    if (element.isActive == true && element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableData.forEach(element => {
                    if (element.isActive == true && element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
            }
            this.assetDepList = newarry;
        } else if (status == 'InActive') {
            this.status = status;
            if (this.currentDeletedstatus == false) {
                this.originalTableData.forEach(element => {
                    if (element.isActive == false && element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableData.forEach(element => {
                    if (element.isActive == false && element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
            }
            this.assetDepList = newarry;
        } else if (status == 'ALL') {
            this.status = status;
            if (this.currentDeletedstatus == false) {
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
                this.assetDepList = newarry;
            } else {
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
                this.assetDepList = newarry;
            }
        }
        this.totalRecords = this.assetDepList.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    restorerecord: any = {}
    restoreRecord() {
        this.commonService.updatedeletedrecords('AssetDepConvention',
            'AssetDepConventionId', this.restorerecord.assetDepConventionId).subscribe(res => {
                this.currentDeletedstatus = true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadData();

                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
    }

    changeStatus(rowData) {}
}