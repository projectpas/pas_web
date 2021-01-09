import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';

import { DefaultMessageService } from '../../services/defaultmessage.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { DefaultMessage } from '../../models/defaultmessage.model';
import * as $ from 'jquery';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { MasterCompany } from '../../models/mastercompany.model';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AuthService } from '../../services/auth.service';
// import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuditHistory } from '../../models/audithistory.model';
import { MenuItem, LazyLoadEvent } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails } from '../../models/single-screen-audit-details.model';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';


@Component({
    selector: 'app-default-message',
    templateUrl: './default-message.component.html',
    styleUrls: ['./default-message.component.scss'],
    animations: [fadeInOut]
})
/** Currency component*/
export class DefaultMessageComponent implements OnInit, AfterViewInit {
    defaultMessage = [];
    updatedByInputFieldValue: any;
    createdByInputFieldValue: any;
    event: any;
    memoInputFieldValue: any;
    defaultMessageCodeInputFieldValue: any;
    matvhMode: any;
    field: any;
    descriptionInputFieldValue: any;
    defaultMessage_Name: any = "";
    description: any = "";
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createdDate: any = "";
    updatedDate: any = "";
    auditHisory: AuditHistory[];
    /** Currency ctor */

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    modal: NgbModalRef;

    displayedColumns = ['defaultMessageId', 'defaultMessageCode', 'description', 'memo', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<DefaultMessage>;
    allDefaultMessageInfo: DefaultMessage[] = [];
    sourceAction: DefaultMessage;
    disableSaveForEdit: boolean = false;
    loadingIndicator: boolean;
    selectedActionName: any;
    disableSave: boolean;
    actionamecolle: any[] = [];

    actionForm: FormGroup;
    title: string = "Create";
    id: number;
    errorMessage: any;
    cols: any[];
    selectedColumns: any[];
    public isEdit: boolean = false;
    public isDeleteMode: boolean = false;
    allComapnies: MasterCompany[];
    public isSaving: boolean;

    selectedColumn: DefaultMessage[];
    messageName: string;
    filteredBrands: any[];
    localCollection: any[] = [];
    AuditDetails: SingleScreenAuditDetails[];

    pageSearch: { query: any; field: any; };
    first: number;
    rows: number;
    paginatorState: any;
    pageSize: number = 10;
    totalPages: number;
    currentstatus: string = 'Active';


    defaultMessagePagination: DefaultMessage[];//added
    totalRecords: number;
    loading: boolean;

    /** Currency ctor */
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private authService: AuthService, private _fb: FormBuilder,
        private alertService: AlertService,
        private masterComapnyService: MasterComapnyService,
        private commonService: CommonService,
        private modalService: NgbModal,
        public defaultmessageService: DefaultMessageService, private dialog: MatDialog) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();

    }
    ngOnInit(): void {
        this.loadData();
        this.cols = [
            //{ field: 'currencyId', header: 'Currency ID' },
            { field: 'defaultMessageCode', header: 'Default Message Name' },
            { field: 'description', header: 'Default Message  Description' },
            { field: 'memo', header: 'Memo' },
            // { field: 'createdBy', header: 'Created By' },
            // { field: 'updatedBy', header: 'Updated By' },     
            // { field: 'updatedDate', header: 'Updated Date' },
            // { field: 'createdDate', header: 'Created Date' }
        ];
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-default-message';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        this.selectedColumns = this.cols;

    }
    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.defaultmessageService.updateDefaultMessage(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
            //alert(e);
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.defaultmessageService.updateDefaultMessage(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
            //alert(e);
        }

    }

    Active: string = "Active";
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getmemo() {

        this.disableSaveForEdit = false;

    }
    private loadData() {
        // debugger;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.defaultmessageService.getDefaultMessageList().subscribe(
            results => this.onDataLoadSuccessful(results[0]),

            error => this.onDataLoadFailed(error)
        );

    }
    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    private refresh() {
        // Causes the filter to refresh there by updating with recently added data.
        this.applyFilter(this.dataSource.filter);
    }
    private onDataLoadSuccessful(getDefaultMessageList: DefaultMessage[]) {
        // alert('success');
        this.defaultmessageService.getDefaultMessageList().subscribe(res => {
            this.originalTableData = res[0];
            this.getListByStatus(this.status ? this.status : this.currentstatus)
        });

        // this.alertService.stopLoadingMessage();
        // this.loadingIndicator = false;
        // this.totalRecords = getDefaultMessageList.length;
        // this.dataSource.data = getDefaultMessageList;

        // this.allDefaultMessageInfo = getDefaultMessageList;
        // console.log(this.allDefaultMessageInfo);
    }

    private onDataLoadFailed(error: any) {
        // alert(error);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }
    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;

    }


    open(content) {

        this.isEdit = false;
        this.isDeleteMode = false;
        this.disableSave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new DefaultMessage();
        this.sourceAction.isActive = true;
        this.messageName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {



            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }


    openDelete(content, row) {

        this.isEdit = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.defaultMessage_Name = row.defaultMessageCode;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    private loadMasterCompanies() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

    }
    openEdit(content, row) {

        this.isEdit = true;
        this.disableSave = false;
        this.isSaving = true;
        this.disableSaveForEdit = true;
        this.loadMasterCompanies();



        this.sourceAction = row;
        this.messageName = this.sourceAction.defaultMessageCode;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openHist(content, row) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.sourceAction = row;
        this.isSaving = true;
        this.defaultmessageService.historyDefaultMessage(this.sourceAction.defaultMessageId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => this.saveFailedHelper(error));



    }
    openView(content, row) {

        this.sourceAction = row;
        this.defaultMessage_Name = row.defaultMessageCode;
        this.description = row.description;
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
    eventHandler(event) {
        let value = event.target.value.toLowerCase();
        if (this.selectedActionName) {
            if (value == this.selectedActionName.toLowerCase()) {
                //alert("Action Name already Exists");
                this.disableSave = true;
            }
            else {
                this.disableSave = false;
            }
        }
    }
    partnmId(event) {
        //debugger;
        for (let i = 0; i < this.actionamecolle.length; i++) {
            if (event == this.actionamecolle[i][0].messageName) {
                //alert("Action Name already Exists");
                this.disableSave = true;
                this.selectedActionName = event;
            }
        }
    }


    filterMessageName(event) {

        this.localCollection = [];
        for (let i = 0; i < this.allDefaultMessageInfo.length; i++) {
            let messageName = this.allDefaultMessageInfo[i].defaultMessageCode;
            if (messageName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.actionamecolle.push([{
                    "defaultMessageId": this.allDefaultMessageInfo[i].defaultMessageId,
                    "messageName": messageName
                }]),
                    this.localCollection.push(messageName);
            }
        }
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


    editItemAndCloseModel() {
        // debugger;

        this.isSaving = true;

        if (this.isEdit == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.defaultMessageCode = this.messageName;
            this.sourceAction.masterCompanyId = 1;
            this.defaultmessageService.newDefaultMessage(this.sourceAction).subscribe(
                role => this.saveSuccessHelper(role),
                error => this.saveFailedHelper(error));
        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.defaultMessageCode = this.messageName;
            this.sourceAction.masterCompanyId = 1;
            this.defaultmessageService.updateDefaultMessage(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        this.modal.close();
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.defaultmessageService.deleteDefaultMessage(this.sourceAction.defaultMessageId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEdit = false;
        this.modal.close();
    }

    private saveCompleted(user?: DefaultMessage) {
        this.isSaving = false;

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);

        }
        this.loadData();
        // this.updatePaginatorState();
    }

    private saveSuccessHelper(role?: DefaultMessage) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
        this.loadData();
        //this.updatePaginatorState();

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

    showAuditPopup(template, defaultMessageId): void {
        this.auditDefault(defaultMessageId);
        this.modal = this.modalService.open(template, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    auditDefault(defaultMessageId: number): void {
        this.AuditDetails = [];
        this.defaultmessageService.getAudit(defaultMessageId).subscribe(audits => {
            if (audits.length > 0) {
                this.AuditDetails = audits;
                this.AuditDetails[0].ColumnsToAvoid = ["defaultMessageAuditId", "defaultMessageId", "masterCompanyId", "createdBy", "createdDate", "updatedDate"];
            }
        });
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
            this.allDefaultMessageInfo = newarry;
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
            this.allDefaultMessageInfo = newarry;
        } else if (status == 'ALL') {
            this.status = status;
            if (this.currentDeletedstatus == false) {
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
                this.allDefaultMessageInfo = newarry;
            } else {
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
                this.allDefaultMessageInfo = newarry;
            }
        }
        this.totalRecords = this.allDefaultMessageInfo.length;
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
        this.commonService.updatedeletedrecords('DefaultMessage',
            'DefaultMessageId', this.restorerecord.defaultMessageId).subscribe(res => {
                this.currentDeletedstatus = true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadData();

                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
    }

    // updatePaginatorState() //need to pass this Object after update or Delete to get Server Side pagination
    // {
    //     this.paginatorState = {
    //         rows: this.rows,
    //         first: this.first
    //     }
    //     if (this.paginatorState) {
    //         this.loadDefaultMessage(this.paginatorState);
    //     }
    // }

    // loadDefaultMessage(event: LazyLoadEvent) //when page initilizes it will call this method
    // {
    //     this.loading = true;
    //     this.rows = event.rows;
    //     this.first = event.first;
    //     setTimeout(() => {
    //         if (this.allDefaultMessageInfo) {
    //             this.defaultmessageService.getServerPages(event).subscribe( //we are sending event details to service
    //                 pages => {
    //                     if (pages.length > 0) {
    //                         this.defaultMessagePagination = pages[0];
    //                     }
    //                 });
    //             this.loading = false;
    //         }
    //     }, 1000);
    // }

    // inputFiledFilter(event, filed, matchMode) {

    //     this.event = event;
    //     this.field = filed;
    //     this.matvhMode = matchMode;

    //     if (filed == 'defaultMessageCode') {
    //         this.defaultMessageCodeInputFieldValue = event;
    //     }
    //     if (filed == 'description') {
    //         this.descriptionInputFieldValue = event;
    //     }
    //     if (filed == 'memo') {
    //         this.memoInputFieldValue = event;
    //     }

    //     if (filed == 'createdBy') {
    //         this.createdByInputFieldValue = event;
    //     }
    //     if (filed == 'updatedBy') {
    //         this.updatedByInputFieldValue = event;
    //     }
    //     this.defaultMessage.push({
    //         DefaultMessageCode: this.defaultMessageCodeInputFieldValue,
    //         Description: this.descriptionInputFieldValue,
    //         Memo: this.memoInputFieldValue,
    //         CreatedBy: this.createdByInputFieldValue,
    //         UpdatedBy: this.updatedByInputFieldValue,
    //         first: this.first,
    //         page: 10,
    //         pageCount: 10,
    //         rows: this.rows,
    //         limit: 5
    //     })
    //     if (this.defaultMessage) {
    //         this.defaultmessageService.getServerPages(this.defaultMessage[this.defaultMessage.length - 1]).subscribe( //we are sending event details to service
    //             pages => {
    //                 if (pages.length > 0) {
    //                     this.defaultMessagePagination = pages[0];
    //                 }
    //             });
    //     }
    //     else {
    //     }
    // }

    openEdits(rowData) {}
    changeStatus(rowData) {}
}
