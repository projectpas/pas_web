import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import * as $ from 'jquery';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { ActionService } from '../../services/action.service';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { Action } from '../../models/action.model';
import { AuditHistory } from '../../models/audithistory.model';
import { AuthService } from '../../services/auth.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MasterCompany } from '../../models/mastercompany.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MenuItem } from 'primeng/api';//bread crumb
import { StocklineAdjustReasonService } from '../../services/stockLineAdjustmentReason.service';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails } from '../../models/single-screen-audit-details.model';
import { ConfigurationService } from '../../services/configuration.service';
import { StocklineAdjustmentReason } from '../../models/stocklineadjustmentreason.model';



import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-adjustment-reason',
    templateUrl: './adjustment-reason.component.html',
    styleUrls: ['./adjustment-reason.component.scss'],
    animations: [fadeInOut]
})
/** stockline-adjustment-reason component*/
export class AdjustmentReasonComponent implements OnInit, AfterViewInit {
    public sourceAdjustmentReason: any = {};
    dataSource: MatTableDataSource<StocklineAdjustmentReason>;
    adjustmentReasonList: StocklineAdjustmentReason[] = [];
    selectedActionName: any;
    disableSave: boolean = false;
    private isDelete: boolean = false;
    actionamecolle: any[] = [];
    action_name: any = "";
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createdDate: any = "";
    formData = new FormData();
    updatedDate: any = "";
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    filteredBrands: any[];
    displayedColumns = ['actionId', 'companyName', 'description', 'memo', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    allActions: Action[] = [];
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourceAction: StocklineAdjustmentReason;
    public auditHisory: any;
    selectedColumns: any[];
    private bodyText: string;
    loadingIndicator: boolean;
    closeResult: string;
    selectedColumn: any[];
    auditHistory: any[] = [];
    code_Name: any = "";
    selectedData: any;
    selectedreason: any;
    StockAdjustmentReasonName: any = "";
    ID: any = "";
    cols: any[];
    title: string = "Create";
    id: number;
    errorMessage: any;
    modal: NgbModalRef;
    actionName: string;
    Active: string = "Active";
    length: number;
    allreasn: any[] = [];
    localCollection: any[] = [];
    stocklineAdjustmentReason: any;
    stockAdjustmentReason: string = "";
    adjustmentReasonName: any;
    isActive: any;
    allunitData: any;
    AuditDetails: SingleScreenAuditDetails[];
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    disableSaveForEdit: boolean = false;
    currentstatus: string = 'Active';

    pageSearch: { query: any; field: any; };
    first: number;
    rows: number;
    paginatorState: { rows: number; first: number; };
    totalRecords: number;
    //paginatorState: any;

    /** Actions ctor */

    public isEdit: boolean = false;
    private isDeleteMode: boolean = false;

    /** stockline-adjustment-reason ctor */
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private commonService: CommonService,
        private stocklineAdjustReasonService: StocklineAdjustReasonService,
        private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.sourceAction = new StocklineAdjustmentReason();
    }

    ngOnInit(): void {
        this.loadData();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-adjustment-reason';
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
        this.stocklineAdjustReasonService.getStockLineAdjustmentReasonList().subscribe(data => {

            this.originalTableData = data[0].columnData;
            this.getListByStatus(this.status ? this.status : this.currentstatus)

            this.allunitData = data[0].columHeaders;
            // this.adjustmentReasonList = data[0].columnData;
            // console.log(this.adjustmentReasonList);
            // this.totalRecords = this.adjustmentReasonList.length;
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
        this.applyFilter(this.dataSource.filter);
    }

    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;

    }

    private onDataLoadSuccessful(allWorkFlows: any[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.totalRecords = allWorkFlows.length;
        this.allActions = allWorkFlows;


    }

    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    private onHistoryLoadSuccessful(auditHistory: any, content) {

        // debugger;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.auditHisory = auditHistory;


        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });

        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })


    }

    open(content) {
        this.isEdit = false;
        this.isDeleteMode = false;
        this.disableSave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new StocklineAdjustmentReason();
        this.sourceAction.isActive = true;
        this.stockAdjustmentReason = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openDelete(content, row) {
        this.isEdit = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.code_Name = row.stockAdjustmentReason;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        console.log(content);
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    getmemo() {
        this.disableSaveForEdit = false;
    }

    openEdit(content, row) {
        this.isEdit = true;
        this.disableSave = false;
        this.isSaving = true;
        this.disableSaveForEdit = true;
        this.loadMasterCompanies();
        this.sourceAction = row;
        this.stockAdjustmentReason = row.stockAdjustmentReason;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    handleChange(rowData, e) {

        const params = <any>{
            createdBy: this.userName,
            updatedBy: this.userName,
            AdjustmentReasonId: rowData.iD,
            Description: rowData.stockAdjustmentReason,
            Memo: rowData.memo,
            isActive: rowData.isActive,
            IsDeleted: false,
            masterCompanyId: 1
        };

        if (e.checked == false) {
            this.Active = "In Active";
            this.stocklineAdjustReasonService.updateStocklineAdjReason(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }
        else {
            this.Active = "Active";
            this.stocklineAdjustReasonService.updateStocklineAdjReason(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
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
            if (event == this.allreasn[i][0].stockAdjustmentReason) {
                this.disableSave = true;
                this.selectedreason = event;
            }
        }
    }

    filterStockAdjReason(event) {

        this.localCollection = [];
        for (let i = 0; i < this.adjustmentReasonList.length; i++) {
            let stockAdjustmentReason = this.adjustmentReasonList[i].stockAdjustmentReason;
            if (stockAdjustmentReason.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.allreasn.push([{
                    "adjustmentReasonId": this.adjustmentReasonList[i].iD,
                    "stockAdjustmentReason": stockAdjustmentReason
                }]),
                    this.localCollection.push(stockAdjustmentReason)

            }
        }
    }
    openView(content, row) {

        this.sourceAdjustmentReason = row;
        this.StockAdjustmentReasonName = row.stockAdjustmentReason;
        this.ID = row.iD;
        this.memo = row.memo;
        this.isActive = row.isActive;
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

    openHist(contentHist, rowData) {
        //this.alertService.startLoadingMessage();
        //this.loadingIndicator = true;


        this.sourceAdjustmentReason = rowData;


        //this.workFlowtService.historyAcion(this.sourceAction.actionId).subscribe(
        //    results => this.onHistoryLoadSuccessful(results[0], contentHist),
        //    error => this.saveFailedHelper(error));


    }

    editItemAndCloseModel() {


        this.isSaving = true;

        const params = <any>{
            createdBy: this.userName,
            updatedBy: this.userName,
            Description: this.stockAdjustmentReason,
            AdjustmentReasonId: this.sourceAction.iD,
            Memo: this.sourceAction.memo,

            IsActive: this.sourceAction.isActive,
            IsDeleted: this.isDelete,
            masterCompanyId: 1
        };

        if (this.isEdit == false) {

            this.stocklineAdjustReasonService.newStocklineAdjReason(params).subscribe(
                role => this.saveSuccessHelper(role),
                error => this.saveFailedHelper(error));
        }
        else {
            params.iD = this.sourceAction.iD;
            this.stocklineAdjustReasonService.updateStocklineAdjReason(params).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }


        this.modal.close();
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.stocklineAdjustReasonService.deleteStockLineAdjustmentReason(this.sourceAction.iD).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEdit = false;
        this.modal.close();
    }

    private saveCompleted(user?: StocklineAdjustmentReason) {
        this.isSaving = false;

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);

        }

        this.loadData();
    }

    private saveSuccessHelper(role?: Action) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);

        this.loadData();

    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }


    getAuditHistoryById(rowData) {
        this.stocklineAdjustReasonService.getStockAdjReasonAudit(rowData.iD).subscribe(res => {
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
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=StocklineAdjustmentReason&fileName=StocklineAdjustmentReason.xlsx`;

        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.stocklineAdjustReasonService.stockLineAdjustmentCustomUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                //this.existingRecordsResponse = res;
                this.getLStockAdjustmentReasonist();
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

    getLStockAdjustmentReasonist() {

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
            this.adjustmentReasonList = newarry;
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
            this.adjustmentReasonList = newarry;
        } else if (status == 'ALL') {
            this.status = status;
            if (this.currentDeletedstatus == false) {
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
                this.adjustmentReasonList = newarry;
            } else {
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
                this.adjustmentReasonList = newarry;
            }
        }
        this.totalRecords = this.adjustmentReasonList.length;
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
        this.commonService.updatedeletedrecords('StocklineAdjustmentReason',
            'AdjustmentReasonId', this.restorerecord.iD).subscribe(res => {
                this.currentDeletedstatus = true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadData();

                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
    }

    changeStatus(rowData) {}
}
