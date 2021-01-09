import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';

import { ReasonService } from '../../services/reason.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { Reason } from '../../models/reason.model';
import * as $ from 'jquery';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { MasterCompany } from '../../models/mastercompany.model';
import { AuditHistory } from '../../models/audithistory.model';
import { AuthService } from '../../services/auth.service';
// import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { MenuItem, LazyLoadEvent } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";
import { validateRecordExistsOrNot, editValueAssignByCondition, getObjectById, selectedValueValidate, getObjectByValue } from '../../generic/autocomplete';
import { ConfigurationService } from '../../services/configuration.service';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';


@Component({
    selector: 'app-reason',
    templateUrl: './reason.component.html',
    styleUrls: ['./reason.component.scss'],
    animations: [fadeInOut]
})
/** Reason component*/
export class ReasonComponent {
    reasonPaginationList: any[] = [];
    totelPages: number;
    pageSize: number = 10;
    reason = [];
    updatedByInputFieldValue: any;
    createdByInputFieldValue: any;
    memoInputFieldValue: any;
    reasonForRemovalInputFieldValue: any;
    reasonCodeInputFieldValue: any;
    event: any;
    matvhMode: any;
    field: any;
    shortNameInputFieldValue: any;
    selectedreason: any;
    allreasn: any[] = [];
    disableSave: boolean = false;
    disableSaveForEdit: boolean = false;
    reason_Name: any = "";
    reasonForRemoval: any = "";
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createdDate: any = "";
    updatedDate: any = "";

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    Active: string = "Active";
    displayedColumns = ['reasonCode', 'reasonForRemoval', 'memo'];
    dataSource: MatTableDataSource<Reason>;
    allReasonsInfo: Reason[] = [];
    private isSaving: boolean;
    disableReason: boolean = false;
    auditHistory: any[] = [];
    private bodyText: string;
    loadingIndicator: boolean;
    closeResult: string;

    selectedColumns: any[];
    cols: any[];
    title: string = "Create";
    id: number;
    errorMessage: any;
    modal: NgbModalRef;
    sourceAction: Reason;
    allComapnies: MasterCompany[] = [];
    selectedcolumn: Reason[];

    reasonName: string;
    filteredBrands: any[];
    localCollection: any[] = [];
    AuditDetails: SingleScreenAuditDetails[];

    public allWorkFlows: Reason[] = [];
    public isEditMode: boolean = false;
    private isDeleteMode: boolean = false;

    pageSearch: { query: any; field: any; };
    first: number;
    rows: number;
    paginatorState: any;
    currentstatus: string = 'Active';


    newReason =
        {
            reasonCode: "",
            reasonForRemoval: "",
            memo: "",
            masterCompanyId: 1,
            isActive: true,
            isDelete: false,
            reasonName: ''
        }
    addNewReason = { ...this.newReason };
    disableSaveForReason: boolean = false;
    disableSaveForReasons: boolean = false;
    reasonList: any;
    reasonForRemovalList: any;
    isEdit: boolean = false;
    selectedRecordForEdit: any;
    disableSaveForReasonCode: boolean = false;
    reasonCodeList: any;
    formData = new FormData();
    existingRecordsResponse: Object;


    reasonPagination: any = [];//added
    totalRecords: number;
    totalPages: number;
    loading: boolean;
    /** Actions ctor */
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private commonService: CommonService, private configurations: ConfigurationService, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private masterComapnyService: MasterComapnyService, private _fb: FormBuilder, private alertService: AlertService, public reasonService: ReasonService, private dialog: MatDialog) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();

    }

    ngOnInit(): void {
        this.getReasonList();
        this.cols = [
            //{ field: 'reasonId', header: 'Reason Id' },
            { field: 'reasonCode', header: 'Reason Code' },
            { field: 'reasonForRemoval', header: 'Reason For Removal' },
            { field: 'memo', header: 'Memo' }
            //{ field: 'createdBy', header: 'Created By' },
            //{ field: 'updatedBy', header: 'Updated By' },
            //{ field: 'updatedDate', header: 'Updated Date' },
            // { field: 'createdDate', header: 'Created Date' }
        ];
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-reason';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        this.selectedColumns = this.cols;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }



    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    private loadData() {
        // debugger;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.reasonService.getReasonList().subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
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
    private onDataLoadSuccessful(allWorkFlows: Reason[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.totalRecords = allWorkFlows.length;
        this.allReasonsInfo = allWorkFlows;
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

    open(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;
        this.disableSave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new Reason();
        this.sourceAction.isActive = true;
        this.reasonName = "";

        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {



            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    openView(content, row) {

        this.sourceAction = row;
        this.reason_Name = row.reasonCode;
        this.reasonForRemoval = row.reasonForRemoval;
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
    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openDelete(content, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openEdit(content, row) {

        this.isEditMode = true;

        this.isSaving = true;
        this.loadMasterCompanies();

        this.disableSave = false;

        this.sourceAction = row;
        this.reasonName = this.sourceAction.reasonCode;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
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



    itemId(event) {
        for (let i = 0; i < this.allreasn.length; i++) {
            if (event == this.allreasn[i][0].reasonName) {

                this.disableSave = true;
                this.selectedreason = event;
            }

        }
    }





    filterReasons(event) {


        this.localCollection = [];
        for (let i = 0; i < this.allReasonsInfo.length; i++) {
            let reasonName = this.allReasonsInfo[i].reasonCode;
            if (reasonName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.allreasn.push([{
                    "reasonId": this.allReasonsInfo[i].reasonId,
                    "reasonName": reasonName
                }]),
                    this.localCollection.push(reasonName);
            }
        }
    }
    //openHist(content, row) {
    //    this.alertService.startLoadingMessage();
    //    this.loadingIndicator = true;


    //    this.sourceAction = row;



    //    //this.isSaving = true;
    //    // debugger;
    //    this.reasonService.historyReason(this.sourceAction.reasonId).subscribe(
    //        results => this.onHistoryLoadSuccessful(results[0], content),
    //        error => this.saveFailedHelper(error));


    //}
    //private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {

    //    // debugger;
    //    this.alertService.stopLoadingMessage();
    //    this.loadingIndicator = false;

    //    this.auditHisory = auditHistory;


    //    this.modal = this.modalService.open(content, { size: 'lg' });

    //    this.modal.result.then(() => {
    //        console.log('When user closes');
    //    }, () => { console.log('Backdrop click') })


    //}
    editItemAndCloseModel() {

        // debugger;

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.reasonCode = this.reasonName;
            this.sourceAction.masterCompanyId = 1;
            this.reasonService.newReason(this.sourceAction).subscribe(() => {
                this.getReasonList();
                this.alertService.showMessage(
                    'Success',
                    'Added  New Reason Successfully',
                    MessageSeverity.success
                );
            });
        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.reasonCode = this.reasonName;
            this.sourceAction.masterCompanyId = 1;
            this.reasonService.updateReason(this.sourceAction).subscribe(() => {
                this.getReasonList();
                this.alertService.showMessage(
                    'Success',
                    'Updated Reason Successfully',
                    MessageSeverity.success
                );

            });
        }

        this.modal.close();
    }
    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.reasonService.updateReason(this.sourceAction).subscribe(
                response => this.alertService.showMessage(
                    'Success',
                    `Updated Status Successfully  `,
                    MessageSeverity.success),
                error => this.saveFailedHelper(error));
            //alert(e);
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.reasonService.updateReason(this.sourceAction).subscribe(
                //response => this.changeStatusCompleted(this.sourceAction),
                response => this.alertService.showMessage(
                    'Success',
                    `Updated Status Successfully  `,
                    MessageSeverity.success),
                error => this.saveFailedHelper(error));
            //alert(e);
        }

    }



    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.reasonService.deleteReason(this.sourceAction.reasonId).subscribe(() => {

            this.getReasonList();
            this.alertService.showMessage(
                'Success',
                'Deleted Reason Successfully',
                MessageSeverity.success
            );

        });

        this.modal.close();
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    private saveCompleted(user?: Reason) {
        this.isSaving = false;

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", "Reason was deleted successfully", MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", "Reason was edited successfully", MessageSeverity.success);

        }
    }



    private saveSuccessHelper(role?: Reason) {
        this.isSaving = false;
        this.alertService.showMessage("Success", "Reason was created successfully", MessageSeverity.success);


    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    showAuditPopup(template, id): void {
        this.auditAssetStatus(id);
        this.modal = this.modalService.open(template, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    auditAssetStatus(reasonId: number): void {
        this.AuditDetails = [];
        this.reasonService.getReasonAudit(reasonId).subscribe(audits => {
            if (audits.length > 0) {
                this.AuditDetails = audits;
                this.AuditDetails[0].ColumnsToAvoid = ["reasonAuditId", "reasonId", "masterCompanyId", "createdBy", "createdDate", "updatedDate"];
            }
        });
    }

    updatePaginatorState() //need to pass this Object after update or Delete to get Server Side pagination
    {
        this.paginatorState = {
            rows: this.rows,
            first: this.first
        }
        if (this.paginatorState) {
            this.loadReason(this.paginatorState);
        }
    }

    loadReason(event: LazyLoadEvent) //when page initilizes it will call this method
    {
        this.loading = true;
        this.rows = event.rows;
        this.first = event.first;
        //alert(event.sortOrder);//yes
        //alert(event.sortField);//yes
        //event.sortFunction;//undefined
        if (this.field) {
            this.reason.push({
                ReasonCode: this.reasonCodeInputFieldValue,
                ReasonForRemoval: this.reasonForRemovalInputFieldValue,
                Memo: this.memoInputFieldValue,
                CreatedBy: this.createdByInputFieldValue,
                UpdatedBy: this.updatedByInputFieldValue,
                first: this.first,
                page: 10,
                pageCount: 10,
                rows: this.rows,
                limit: 5
            })
            if (this.reason) {
                this.reasonService.getServerPages(this.reason[this.reason.length - 1]).subscribe( //we are sending event details to service
                    pages => {
                        this.reasonPaginationList = pages;
                        this.reasonPagination = this.reasonPaginationList[0].reasonList;
                        this.totalRecords = this.reasonPaginationList[0].totalRecordsCount;
                        this.totelPages = Math.ceil(this.totalRecords / this.rows);
                    });
            }
            else {
            }
        }
        else {
            setTimeout(() => {
                if (this.allReasonsInfo) {
                    this.reasonService.getServerPages(event).subscribe( //we are sending event details to service
                        pages => {
                            this.reasonPaginationList = pages;
                            this.reasonPagination = this.reasonPaginationList[0].reasonList;
                            this.totalRecords = this.reasonPaginationList[0].totalRecordsCount;
                            this.totelPages = Math.ceil(this.totalRecords / this.rows);
                        });
                    this.loading = false;
                }
            }, 1000);
        }

    }

    inputFiledFilter(event, filed, matchMode) {
        this.first = 0;
        this.event = event;
        this.field = filed;
        this.matvhMode = matchMode;

        //alert(filed);
        if (filed == 'reasonCode') {
            this.reasonCodeInputFieldValue = event;
        }
        if (filed == 'reasonForRemoval') {
            this.reasonForRemovalInputFieldValue = event;
        }
        if (filed == 'memo') {
            this.memoInputFieldValue = event;
        }
        //if (filed == 'createdBy') {
        //    this.createdByInputFieldValue = event;
        //}
        //if (filed == 'updatedBy') {
        //    this.updatedByInputFieldValue = event;
        //}
        this.reason.push({
            ReasonCode: this.reasonCodeInputFieldValue,
            ReasonForRemoval: this.reasonForRemovalInputFieldValue,
            Memo: this.memoInputFieldValue,
            //CreatedBy: this.createdByInputFieldValue,
            //UpdatedBy: this.updatedByInputFieldValue,
            first: this.first,
            page: 10,
            pageCount: 10,
            rows: this.rows,
            limit: 5
        })
        if (this.reason) {
            this.reasonService.getServerPages(this.reason[this.reason.length - 1]).subscribe( //we are sending event details to service
                pages => {
                    this.reasonPaginationList = pages;
                    this.reasonPagination = this.reasonPaginationList[0].reasonList;
                    this.totalRecords = this.reasonPaginationList[0].totalRecordsCount;
                    this.totelPages = Math.ceil(this.totalRecords / this.rows);
                });
        }
        else {
        }
    }

    getReasonList() {
        this.reasonService.getAllReasonsList().subscribe(res => {
            // const responseData = res[0];
            // this.uomHeaders = responseData.columHeaders;
            // this.selectedColumns = responseData.columHeaders;

            this.originalTableData = res[0].columnData;
            this.getListByStatus(this.status ? this.status : this.currentstatus)



            // this.reasonPagination = responseData.columnData;
            // this.totalRecords = responseData.totalRecords;
            // this.totelPages = Math.ceil(this.totalRecords / this.pageSize);

        })
    }

    getAuditHistoryById(rowData) {
        this.reasonService.getReasonAudit(rowData.reasonId).subscribe(res => {

            this.auditHistory = res[0].result;
        })
    }

    resetReasonForm() {
        this.isEdit = false;

        this.disableSaveForReasonCode = false;
        this.selectedRecordForEdit = undefined;
        this.addNewReason = { ...this.newReason };
    }
    selectedRSN(object) {
        const exists = selectedValueValidate('reasonCode', object, this.selectedRecordForEdit)

        this.disableSaveForReason = !exists;
    }
    filterReasonCodes(event) {
        this.reasonList = this.reasonPagination;

        const ReasonCodeData = [...this.reasonPagination.filter(x => {
            return x.reasonCode.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.reasonList = ReasonCodeData;
    }
    filterReasonForRemoval(event) {

        this.reasonForRemovalList = this.reasonPagination;

        const ReasonForRemovalData = [...this.reasonPagination.filter(x => {
            return x.reasonForRemoval.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.reasonForRemovalList = ReasonForRemovalData;

    }
    checkReasonCodeExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.reasonPagination, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForReason = true;
            this.disableSaveForReasons = true;
        }
        else {
            this.disableSaveForReason = false;
            this.disableSaveForReasons = false;
        }

    }

    saveReason() {
        const data = {
            ...this.addNewReason, createdBy: this.userName, updatedBy: this.userName,
            reasonCode: editValueAssignByCondition('reasonCode', this.addNewReason.reasonCode),
            reasonForRemoval: editValueAssignByCondition('reasonForRemoval', this.addNewReason.reasonForRemoval),
            memo: editValueAssignByCondition('memo', this.addNewReason.memo)
        };
        if (!this.isEdit) {
            this.reasonService.newReason(data).subscribe(() => {
                this.resetReasonForm();
                this.getReasonList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Reason Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.reasonService.updateReason(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetReasonForm();
                this.getReasonList();
                this.alertService.showMessage(
                    'Success',
                    `Updated Reason Successfully`,
                    MessageSeverity.success
                );
            })
        }
    }
    getmemo() {
        this.disableSaveForEdit = false;
    }

    editReason(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveForEdit = true;
        this.disableSaveForReasonCode = false;
        // this.addNewUOM = rowData;

        this.addNewReason = {
            ...rowData, reasonName: getObjectById('reasonId', rowData.reasonId, this.reasonPagination),
            reasonCode: getObjectById('reasonId', rowData.reasonId, this.reasonPagination)
        };
        this.selectedRecordForEdit = { ...this.addNewReason }

    }
    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=Reason&fileName=reason.xlsx`;

        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.reasonService.reasonFileUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.existingRecordsResponse = res;
                this.getReasonList();
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
            this.reasonPagination = newarry;
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
            this.reasonPagination = newarry;
        } else if (status == 'ALL') {
            this.status = status;
            if (this.currentDeletedstatus == false) {
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
                this.reasonPagination = newarry;
            } else {
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
                this.reasonPagination = newarry;
            }
        }
        this.totalRecords = this.reasonPagination.length;
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
        this.commonService.updatedeletedrecords('Reason',
            'ReasonId', this.restorerecord.reasonId).subscribe(res => {
                this.currentDeletedstatus = true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getReasonList();

                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
    }

    changeStatus(rowData) {}
    columnsChanges() {}
}