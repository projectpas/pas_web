import { Component, ViewChild, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { DepriciationMethodService } from '../../services/depriciation-method/depriciation.service';
import { DepriciationMethod } from '../../models/depriciation-method.model';
import { fadeInOut } from '../../services/animations';
import { AuthService } from '../../services/auth.service';
import { SingleScreenAuditDetails } from '../../models/single-screen-audit-details.model';
import { SingleScreenBreadcrumbService } from '../../services/single-screens-breadcrumb.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MasterCompany } from '../../models/mastercompany.model';
import { Itemgroup } from '../../models/item-group.model';
import { ItemGroupService } from '../../services/item-group.service';
import { AuditHistory } from '../../models/audithistory.model';
import { MenuItem, LazyLoadEvent } from 'primeng/api';//bread crumb;
import { ConfigurationService } from '../../services/configuration.service';
import { editValueAssignByCondition, selectedValueValidate, getObjectById } from '../../generic/autocomplete';


import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-depriciation-method',
    templateUrl: './depriciation-method.component.html',
    styleUrls: ['./depriciation-method.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [fadeInOut]
})
/** DepriciationMethod component*/
export class DepriciationMethodComponent implements OnInit, AfterViewInit {
    currentDepriciationmethod: DepriciationMethod;
    dataSource: MatTableDataSource<DepriciationMethod>;
    depriciationMethodList: DepriciationMethod[] = [];
    depriciationToUpdate: DepriciationMethod;
    updateMode: boolean;
    selectedData: any;
    formData = new FormData();
    public auditHisory: AuditHistory[] = [];
    public isDeleteMode: boolean = false;
    public isEditMode: boolean = false;
    modal: NgbModalRef;
    public sourceAction: DepriciationMethod;
    display: boolean = false;
    modelValue: boolean = false;
    allComapnies: MasterCompany[] = [];
    Active: string;
    code: any = "";
    name: any = "";
    depreciationMethod: any = "";
    memo: any = "";
    sequenceNo: any;
    createdBy: any = "";
    updatedBy: any = "";
    createdDate: any = "";
    updatedDate: any = "";
    selectedColumns: any[];
    allreasn: any[] = [];
    allreasn1: any[] = [];
    HasAuditDetails: boolean;
    loadingIndicator: boolean;
    displayedColumns = ['Code', 'Name', 'DepreciationMethod', 'Memo'];
    cols: any[];
    selectedColumn: any;
    memoPopupText: string;
    selectedreason: any;
    selectedreason1: any;
    memoNotes: string = 'This is  memo';
    AuditDetails: SingleScreenAuditDetails[];
    allunitData: any;
    code_Name: any = "";
    localCollection: any[] = [];
    localSequenceList: any[] = [];
    disableSave: boolean = false;
    isSaving: boolean;
    existingRecordsResponse: Object;
    private isDelete: boolean = false;
    auditHistory: any[] = [];
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    codeName: string = "";
    sequenceList: any;
    disableSaveForSequence: boolean = false;
    disableSaveForCondition: boolean;
    disableSaveForEdit: boolean = false;

    currentstatus: string = 'Active';

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    /** DepriciationMethod ctor */

    paginatorState: { rows: number; first: number; };
    totalRecords: number;
    first: number;
    rows: number;
    loading: boolean;
    depreciationMethodPagination: DepriciationMethod[];

    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private commonService: CommonService, private alertService: AlertService, private authService: AuthService, private depriciationMethodService: DepriciationMethodService, private modalService: NgbModal, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.sourceAction = new DepriciationMethod();
    }

    ngOnInit(): void {
        this.loadData();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-depriciation-method';
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
        this.depriciationMethodService.getAll().subscribe(data => {

            this.originalTableData = data[0].columnData;
            this.getListByStatus(this.status ? this.status : this.currentstatus)

            this.allunitData = data[0].columHeaders;
            // this.depriciationMethodList = data[0].columnData;
            // console.log(this.depriciationMethodList);
            // this.totalRecords = this.depriciationMethodList.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.cols = [
                console.log(this.allunitData),
                this.selectedColumns = this.allunitData
            ];
            this.selectedData = this.selectedColumns;
            // this.alertService.stopLoadingMessage();
            this.localSequenceList = [];
            for (let i = 0; i < this.depriciationMethodList.length; i++) {
                let codeName = this.depriciationMethodList[i].sequenceNo;
                this.allreasn1.push([{
                    "sequenceNo": this.depriciationMethodList[i].sequenceNo,
                    "codeName": codeName
                }]);
                this.localSequenceList.push(codeName);
            }
        });
    }

    private loadMasterCompanies() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    getmemo() {

        this.disableSaveForEdit = false;

    }
    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    private refresh() {
        // Causes the filter to refresh there by updating with recently added data.
        this.applyFilter(this.dataSource.filter);
    }

    public allWorkFlows: DepriciationMethod[] = [];

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
            //if (event == this.allreasn[i][0].codeName) {
            if ((event == this.allreasn[i][0].codeName && !this.isEditMode) ||
                (event == this.allreasn[i][0].codeName && this.isEditMode == true
                    && this.allreasn[i][0].assetDepreciationMethodId != this.sourceAction.assetDepreciationMethodId)
            ) {
                this.disableSave = true;
                this.selectedreason = event;
                return;
            }
        }
        this.disableSave = false;
    }

    eventHandler1(event) {
        /*
        let value = event.target.value.toLowerCase();
        if (this.selectedreason1) {
            if (value == this.selectedreason1) {
                this.disableSaveForSequence = true;
            }
            else {
                this.disableSaveForSequence = false;
            }
        }*/
    }

    partnmId1(event) {
        for (let i = 0; i < this.allreasn1.length; i++) {
            if ((event == this.allreasn1[i][0].codeName && !this.isEditMode) ||
                (event == this.allreasn1[i][0].codeName && this.isEditMode == true
                    && this.allreasn1[i][0].assetDepreciationMethodId != this.sourceAction.assetDepreciationMethodId)
            ) {
                this.disableSaveForSequence = true;
                this.selectedreason1 = event;
                return;
            }
        }
        this.selectedreason1 = "";
        this.disableSaveForSequence = false;
    }

    onBlurCheck(event) {
        console.log(event.target.value);
        let value = event.target.value;
        for (let i = 0; i < this.depriciationMethodList.length; i++) {
            if ((value == this.depriciationMethodList[i].sequenceNo && !this.isEditMode) ||
                (value == this.depriciationMethodList[i].sequenceNo && this.isEditMode == true
                    && this.depriciationMethodList[i].assetDepreciationMethodId != this.sourceAction.assetDepreciationMethodId)
            ) {
                this.disableSaveForSequence = true;
                this.selectedreason1 = value;
                return;
            }
        }
        this.selectedreason1 = "";
        this.disableSaveForSequence = false;
    }

    filterDepreciationMethod(event) {
        this.localCollection = [];
        for (let i = 0; i < this.depriciationMethodList.length; i++) {
            let codeName = this.depriciationMethodList[i].code;
            if (codeName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.allreasn.push([{
                    "assetDepreciationMethodId": this.depriciationMethodList[i].assetDepreciationMethodId,
                    "codeName": codeName
                }]),
                    this.localCollection.push(codeName);
            }
        }
    }

    filterSequenceNo(event) {
        this.localSequenceList = [];
        for (let i = 0; i < this.depriciationMethodList.length; i++) {
            let codeName = this.depriciationMethodList[i].sequenceNo;
            if (codeName.toString().indexOf(event.query.toLowerCase()) == 0) {
                this.allreasn1.push([{
                    "sequenceNo": this.depriciationMethodList[i].sequenceNo,
                    "codeName": codeName
                }]),
                    this.localSequenceList.push(codeName);
            }
        }
    }

    filterSequence(event) {
        this.sequenceList = this.depriciationMethodList;

        const capabilityTypeData = [...this.depriciationMethodList.filter(x => {
            if (x.sequenceNo !== null && x.sequenceNo !== 0 && x.sequenceNo != undefined) {

                //if (x.sequenceNo == event)
                //    return x;
                x.sequenceNo = x.sequenceNo
                return x.sequenceNo.toString().toLowerCase().includes((event.query.toLowerCase()))
            }
        })]
        this.sequenceList = capabilityTypeData;

    }

    selectedSequence(object) {
        const exists = selectedValueValidate('sequenceNo', object, this.sourceAction)
        this.disableSaveForSequence = !exists;
    }

    checkSequenceExists(value) {


        this.disableSaveForSequence = false;
        for (let i = 0; i < this.depriciationMethodList.length; i++) {

            if ((this.isEditMode == true && this.sourceAction.sequenceNo == this.depriciationMethodList[i].sequenceNo
                && this.sourceAction.assetDepreciationMethodId != this.depriciationMethodList[i].assetDepreciationMethodId)
                || (value == this.depriciationMethodList[i].sequenceNo && !this.isEditMode)
            ) {
                this.disableSaveForSequence = true;

                return;
            }

        }

    } getChange() {
        this.disableSaveForCondition = false;

    }

    resetdepriciationmethod(): void {
        this.updateMode = false;
        this.currentDepriciationmethod = new DepriciationMethod();
    }
    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    open(content) {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.disableSave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.disableSaveForCondition = false;
        this.disableSaveForSequence = false;
        this.sourceAction = new DepriciationMethod();
        this.sourceAction.isActive = true;
        this.codeName = "";
        this.sequenceNo = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openEdit(content, row) {
        this.isEditMode = true;
        this.disableSave = false;
        this.disableSaveForCondition = true;
        this.disableSaveForSequence = false;
        this.disableSaveForEdit = true;
        this.isSaving = true;
        this.loadMasterCompanies();
        //this.sourceAction = { ...row, sequenceNo: getObjectById('sequenceNo', row.assetDepreciationMethodId, this.depriciationMethodList) };
        this.sourceAction = { ...row };
        this.codeName = this.sourceAction.code;
        this.sequenceNo = this.sourceAction.sequenceNo;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    SaveandEditDepreciationMethod() {
        // debugger;
        this.isSaving = true;
        const params = <any>{
            createdBy: this.userName,
            updatedBy: this.userName,
            AssetDepreciationMethodCode: this.codeName,
            AssetDepreciationMethodName: this.sourceAction.name,
            AssetDepreciationMemo: this.sourceAction.memo,
            SequenceNo: this.sequenceNo,
            AssetDepreciationMethodBasis: this.sourceAction.depreciationMethod,
            IsActive: this.sourceAction.isActive,
            IsDeleted: this.isDelete,
            masterCompanyId: 1
        };
        if (this.isEditMode == false) {
            this.depriciationMethodService.add(params).subscribe(
                role => this.saveSuccessHelper(role),
                error => this.saveFailedHelper(error));
        }
        else {
            params.AssetDepreciationMethodId = this.sourceAction.assetDepreciationMethodId;
            this.depriciationMethodService.update(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        this.modal.close();
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.depriciationMethodService.remove(this.sourceAction.assetDepreciationMethodId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }

    handleChange(rowData, e) {

        const params = <any>{
            createdBy: this.userName,
            updatedBy: this.userName,
            AssetDepreciationMethodId: rowData.assetDepreciationMethodId,
            AssetDepreciationMethodCode: rowData.code,
            AssetDepreciationMethodName: rowData.name,
            AssetDepreciationMemo: rowData.memo,
            SequenceNo: rowData.sequenceNo,
            AssetDepreciationMethodBasis: rowData.depreciationMethod,
            IsActive: rowData.isActive,
            IsDeleted: this.isDelete,
            masterCompanyId: 1
        };
        if (e.checked == false) {
            this.Active = "In Active";
            this.depriciationMethodService.update(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }
        else {
            this.Active = "Active";
            this.depriciationMethodService.update(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

    }

    private saveSuccessHelper(role?: DepriciationMethod) {
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

    private saveCompleted(user?: DepriciationMethod) {
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

    openView(content, row) {
        this.sourceAction = row;
        this.code = row.code;
        this.name = row.name;
        this.depreciationMethod = row.depreciationMethod;
        this.memo = row.memo;
        this.sequenceNo = row.sequenceNo;
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


    getAuditHistoryById(rowData) {
        this.depriciationMethodService.getAssetDepriciationMethodAudits
            (rowData.assetDepreciationMethodId).subscribe(res => {
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
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=DepreciationMethod&fileName=DepMethod.xlsx`;

        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.depriciationMethodService.DepMethodCustomUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.existingRecordsResponse = res;
                this.getDepMethodList();
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

    getDepMethodList() {

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
            this.depriciationMethodList = newarry;
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
            this.depriciationMethodList = newarry;
        } else if (status == 'ALL') {
            this.status = status;
            if (this.currentDeletedstatus == false) {
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
                this.depriciationMethodList = newarry;
            } else {
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
                this.depriciationMethodList = newarry;
            }
        }
        this.totalRecords = this.depriciationMethodList.length;
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
        this.commonService.updatedeletedrecords('AssetDepreciationMethod',
            'AssetDepreciationMethodId', this.restorerecord.assetDepreciationMethodId).subscribe(res => {
                this.currentDeletedstatus = true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadData();

                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
    }

    SaveandEditDepreciaionMethod() {}
    changeStatus(rowData) {}
    updatedepriciationmethod() {}
}