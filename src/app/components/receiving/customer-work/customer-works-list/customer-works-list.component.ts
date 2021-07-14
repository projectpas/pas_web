import { ReceivingCustomerWorkService } from '../../../../services/receivingcustomerwork.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { fadeInOut } from '../../../../services/animations';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { AuditHistory } from '../../../../models/audithistory.model';
import { AuthService } from '../../../../services/auth.service';
import { MasterCompany } from '../../../../models/mastercompany.model';
import { MasterComapnyService } from '../../../../services/mastercompany.service';
import { listSearchFilterObjectCreation } from '../../../../generic/autocomplete';
import { CommonService } from '../../../../services/common.service';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { StocklineService } from '../../../../services/stockline.service';
// declare var $ : any;
declare var $: any;
import { ConfigurationService } from '../../../../services/configuration.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-customer-works-list',
    templateUrl: './customer-works-list.component.html',
    styleUrls: ['./customer-works-list.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe],
})

export class CustomerWorksListComponent implements OnInit {
    private isEditMode: boolean = false;
    loadingIndicator: boolean;
    dataSource: any;
    allRecevinginfo: any[] = [];
    isSaving: boolean;
    isDeleteMode: boolean;
    sourcereceving: any;
    modal: any;
    customerWorkHisory: any[];
    sourceAction: any;
    allComapnies: MasterCompany[];
    customerId: any;
    conditionId: any;
    siteId: any;
    selectedOnly: boolean = false;
    targetData: any;
    warehouseId: any;
    locationId: any;
    showViewProperties: any = {};
    selectedColumn: any;
    Active: string = "Active";
    lazyLoadEventData: any;
    currentStatus: string = 'active';
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number = 0;
    filteredText: string;
    private table: Table;
    auditHisory: any[];
    isSpinnerVisible: boolean = false;
    public departname: any;
    public divsioname: any;
    public biuName: any;
    public compnayname: any;
    currentStatusCW: any = "1";
    moduleName: any = 'ReceivingCustomerWork';
    breadcrumbs: MenuItem[] = [
        { label: 'Receiving' },
        { label: 'Customer Work' },
        { label: 'Customer Work List' }
    ];
    cols = [
        { field: 'customerName', header: 'Cust Name' },
        { field: 'partNumber', header: 'MPN' },
        { field: 'partDescription', header: 'MPN Description' },
        { field: 'serialNumber', header: 'Ser Num', width: "90px" },
        { field: 'stocklineNumber', header: 'Stk Line Num', width: "116px" },
        { field: 'woNumber', header: 'WO Num', width: "90px" },
        { field: 'receivingNumber', header: 'Receiver Num', width: "106px" },
        { field: 'receivedDate', header: "Rec'd Date" },
        { field: 'receivedBy', header: 'Received By' },
        { field: 'levelCode1', header: 'Level 01' },
        { field: 'levelCode2', header: 'Level 02' },
        { field: 'levelCode3', header: 'Level 03' },
        { field: 'levelCode4', header: 'Level 04' },
        { field: 'stageCode', header: 'Stage Code' },
        { field: 'status', header: 'Status' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },
    ];

    sourceViewforDocumentAudit: any = [];
    documentTableColumns: any[] = [
        { field: "docName", header: "Name" },
        { field: "docDescription", header: "Description" },
        { field: "docMemo", header: "Memo" },

        { field: "fileName", header: "File Name" },
        { field: "fileSize", header: "File Size" },

        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'CreatedBy' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'UpdatedBy' },
        { field: 'download', header: 'Actions' },
    ];

    selectedColumns = this.cols;
    viewCustWorkInfo: any = {};
    selectedRowForDelete: any = {};
    managementStructure: any = {};
    timeLifeInfo: any = {};
    customerWorkDocumentsList: any = [];
    customerWarningListId: any;
    warningMessage: string;
    restrictMessage: string;
    editData: any;
    restrictID: any;
    warningID: any;
    isEditCustomer: boolean = false;
    isAddWorkOrder: boolean = false;
    currentDeletedstatus: boolean = false;
    lazyLoadEventDataInput: any;
    filterText: any = '';
    allCustomerFinanceDocumentsListOriginal: any = [];
    restorerecord: any = {};
    rcId: any;
    dateObject: any = {};

    constructor(private receivingCustomerWorkService: ReceivingCustomerWorkService,
        private datePipe: DatePipe, private masterComapnyService: MasterComapnyService, private _route: Router, private authService: AuthService, private alertService: AlertService, private modalService: NgbModal, private commonService: CommonService, private stocklineService: StocklineService, private configurations: ConfigurationService) {
        this.dataSource = new MatTableDataSource();
        this.receivingCustomerWorkService.isEditMode = false;
    }

    ngOnInit() {
        this.getCustomerWarningsList()
    }

    dateFilterForTable(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.customerWorkDocumentsList = this.allCustomerFinanceDocumentsListOriginal;
            const data = [...this.customerWorkDocumentsList.filter(x => {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.customerWorkDocumentsList = data;
        } else {
            this.customerWorkDocumentsList = this.allCustomerFinanceDocumentsListOriginal;
        }
    }

    dateFilterForReceivingCustomerList(date, field) {
        this.dateObject = {}
        date = moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
        if (date != "" && moment(date, 'MM/DD/YYYY', true).isValid()) {
            if (field == 'createdDate') {
                this.dateObject = { 'createdDate': date }
            } else if (field == 'updatedDate') {
                this.dateObject = { 'updatedDate': date }
            }
            else if (field == 'workflowCreateDate') {
                this.dateObject = { 'workflowCreateDate': date }
            }
            else if (field == 'workflowExpirationDate') {
                this.dateObject = { 'workflowExpirationDate': date }
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, woFilter: this.currentStatusCW, ...this.dateObject };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        } else {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, woFilter: this.currentStatusCW, ...this.dateObject };
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate) {
                delete this.lazyLoadEventDataInput.filters.createdDate;
            }
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate) {
                delete this.lazyLoadEventDataInput.filters.updatedDate;
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, woFilter: this.currentStatusCW, ...this.dateObject };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        }
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    public navigateTogeneralInfo() {
        this.receivingCustomerWorkService.isEditMode = false;
        this.receivingCustomerWorkService.enableExternal = false;
        this._route.navigateByUrl('receivingmodule/receivingpages/app-customer-work-edit');
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get employeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;

        event.filters = { ...event.filters, woFilter: this.currentStatusCW }
        if (this.filterText == '') {
            this.getList(event);
        } else {
            this.globalSearch(this.filterText);
        }
    }

    getList(data) {
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete
        data.filters.masterCompanyId = this.currentUserMasterCompanyId;
        data.filters.employeeId = this.employeeId;
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.isSpinnerVisible = true;
        this.receivingCustomerWorkService.getCustomerWorkAll(PagingData).subscribe(res => {
            this.allRecevinginfo = res['results'].map(x => {
                return {
                    ...x,
                    createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                    updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                    receivedDate: x.receivedDate ? this.datePipe.transform(x.receivedDate, 'MM/dd/yyyy') : '',
                }
            });

            if (res.results.length > 0) {
                this.totalRecords = res.totalRecordsCount;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            } else {
                this.totalRecords = 0;
                this.totalPages = 0;
            }
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        })
    }

    getCustWorkStatus(value) {
        this.currentStatusCW = value;
        this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters, woFilter: value }
        this.getList(this.lazyLoadEventData);
    }

    openView(rowData) {
        this.viewCustWorkInfo = {};
        this.timeLifeInfo = {};
        this.customerWorkDocumentsList = [];
        const { receivingCustomerWorkId } = rowData;
        this.rcId = rowData.receivingCustomerWorkId;
        this.isSpinnerVisible = true;
        this.receivingCustomerWorkService.getCustomerWorkdataById(receivingCustomerWorkId).subscribe(res => {
            this.isSpinnerVisible = false;
            this.viewCustWorkInfo = {
                ...res,
                tagDate: res.tagDate ? new Date(res.tagDate) : '',
                mfgDate: res.mfgDate ? new Date(res.mfgDate) : '',
                expDate: res.expDate ? new Date(res.expDate) : '',
                timeLifeDate: res.timeLifeDate ? new Date(res.timeLifeDate) : '',
            }
            if (res.timeLifeCyclesId != null && res.timeLifeCyclesId != 0 && res.timeLifeCyclesId != undefined) {
                this.getTimeLifeOnEdit(res.timeLifeCyclesId);
            }
        },
            err => {
                this.isSpinnerVisible = false;
            });
    }

    viewSelectedRowdbl(rowData) {
        this.openView(rowData);
        $('#cusView').modal('show');
    }

    getManagementStructureCodes(id) {
        this.commonService.getManagementStructureCodes(id).subscribe(res => {
            if (res.Level1) {
                this.managementStructure.level1 = res.Level1;
            } else {
                this.managementStructure.level1 = '-';
            }
            if (res.Level2) {
                this.managementStructure.level2 = res.Level2;
            } else {
                this.managementStructure.level2 = '-';
            }
            if (res.Level3) {
                this.managementStructure.level3 = res.Level3;
            } else {
                this.managementStructure.level3 = '-';
            }
            if (res.Level4) {
                this.managementStructure.level4 = res.Level4;
            } else {
                this.managementStructure.level4 = '-';
            }
        })
    }

    getTimeLifeOnEdit(timeLifeId) {
        this.stocklineService.getStockLineTimeLifeList(timeLifeId).subscribe(res => {
            this.timeLifeInfo = res[0];
        });
    }

    openHist(content, row) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.sourcereceving = row;
        this.isSaving = true;

        this.receivingCustomerWorkService.historyReason(this.sourcereceving.chargeId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => this.saveFailedHelper(error));
    }

    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.auditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, windowClass: 'assetMange' });
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    exportCSV(dt) {
        this.isSpinnerVisible = true;
        const isdelete = this.currentDeletedstatus ? true : false;
        let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "woFilter": this.currentStatusCW, "isDeleted": isdelete, "masterCompanyId": this.currentUserMasterCompanyId, "employeeId": this.employeeId }, "globalFilter": "" }
        let filters = Object.keys(dt.filters);
        filters.forEach(x => {
            PagingData.filters[x] = dt.filters[x].value;
        })
        this.receivingCustomerWorkService.getCustomerWorkAll(PagingData).subscribe(res => {
            dt._value = res['results'].map(x => {
                return {
                    ...x,
                    createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                    updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
                    receivedDate: x.receivedDate ? this.datePipe.transform(x.receivedDate, 'MMM-dd-yyyy') : '',
                }
            });
            dt.exportCSV();
            dt.value = this.allRecevinginfo;
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    closeDeleteModal() {
        $("#downloadConfirmation").modal("hide");
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.isDeleteMode = true;
        this.sourcereceving.isdelete = false;
        this.sourcereceving.updatedBy = this.userName;
        this.receivingCustomerWorkService.deleteReason(this.sourcereceving.receivingCustomerWorkId, this.userName).subscribe(
            response => this.saveCompleted(this.sourcereceving),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }

    openDelete(content, row) {
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.selectedRowForDelete = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    private saveCompleted(user?: any) {
        this.isSaving = false;
        this.getList(this.lazyLoadEventData);
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
        }
    }

    toggleIsActive(rowData, e) {
        if (e.checked == false) {
            this.sourcereceving = rowData;
            this.sourcereceving.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourcereceving.isActive == false;
            this.receivingCustomerWorkService.updateActionforActive(this.sourcereceving.receivingCustomerWorkId, this.sourcereceving.isActive, this.userName).subscribe(
                response => this.saveCompleted(this.sourcereceving),
                error => this.saveFailedHelper(error));
        }
        else {
            this.sourcereceving = rowData;
            this.sourcereceving.updatedBy = this.userName;
            this.Active = "Active";
            this.sourcereceving.isActive == true;
            this.receivingCustomerWorkService.updateActionforActive(this.sourcereceving.receivingCustomerWorkId, this.sourcereceving.isActive, this.userName).subscribe(
                response => this.saveCompleted(this.sourcereceving),
                error => this.saveFailedHelper(error));
        }
    }

    openHistory(content, rowData) {
        this.alertService.startLoadingMessage();
        this.receivingCustomerWorkService.getAuditHistory(rowData.receivingCustomerWorkId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results[0], content),
            error => this.saveFailedHelper(error));
    }

    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.customerWorkHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, windowClass: 'assetMange' });
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.customerWorkHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    globalSearch(value) {
        this.pageIndex = 0;
        this.filteredText = value;
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.filterText = value;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, woFilter: this.currentStatusCW };
        this.getList(this.lazyLoadEventDataInput);
    }

    getDeleteListByStatus(value) {
        this.currentDeletedstatus = true;
        if (value == true) {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, woFilter: this.currentStatusCW };
            this.getList(this.lazyLoadEventDataInput);
        } else {
            this.currentDeletedstatus = false;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, woFilter: this.currentStatusCW };
            this.getList(this.lazyLoadEventDataInput);
        }
    }

    restoreRecord() {
        this.commonService.updatedeletedrecords('ReceivingCustomerWork', 'ReceivingCustomerWorkId', this.restorerecord.receivingCustomerWorkId).subscribe(res => {
            this.getDeleteListByStatus(true)
            this.modal.close();
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        })
    }

    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }


    refreshList() {
        if (this.filteredText != "" && this.filteredText != null && this.filteredText != undefined) {
            this.globalSearch(this.filteredText);
        }
        else {
            this.table.reset();
        }
    }

    enableDateFilter(el) {
        if (el.value === '') { el.classList.add("hidePlaceHolder"); }
        else el.classList.remove("hidePlaceHolder");
    }

    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }

    setEditArray: any = []
    getCustomerWarningsList(): void {
        // const strText='Receive MPN'; 
        const strText = 'Create WO for MPN';
        this.setEditArray.push(0);
        const mcId = this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
        this.commonService.autoSuggestionSmartDropDownList('CustomerWarningType', 'CustomerWarningTypeId', 'Name', strText, true, 0, this.setEditArray.join(), 0).subscribe(res => {
            res.forEach(element => {
                if (element.label == 'Create WO for MPN') {
                    this.customerWarningListId = element.value;
                    return;
                }
            });
        })
    }
    openEdits(row) {
        this.editData = row;
        this.isEditCustomer = true;
        const { receivingCustomerWorkId } = row
        this._route.navigateByUrl(`receivingmodule/receivingpages/app-customer-work-setup/edit/${receivingCustomerWorkId}`);
    }

    gotoWorkOrder(rowData) {
        this.editData = rowData;
        this.isAddWorkOrder = true;
        this.customerWarnings(rowData.customerId);
        //    this._route.navigateByUrl(`/workordersmodule/workorderspages/app-work-order-receivingcustworkid/${rowData.receivingCustomerWorkId}`);
    }

    gotoCustomer(rowData) {
        this._route.navigateByUrl(`customersmodule/customerpages/app-customer-edit/${rowData.customerId}`);
    }

    customerWarnings(customerId) {
        if (this.customerWarningListId == undefined) {
            this.getCustomerWarningsList();
        } else {
            if (customerId && this.customerWarningListId) {
                this.warningMessage = '';
                this.validateWarnings(customerId, this.customerWarningListId);
            }
        }
    }
    validateWarnings(customerId, id) {
        let cusId = (customerId.customerId) ? customerId.customerId : customerId;
        this.commonService.customerWarnings(cusId, id, this.currentUserMasterCompanyId).subscribe((res: any) => {
            if (res) {
                this.warningMessage = res.warningMessage;
                this.warningID = res.customerWarningId;
                this.restrictID = 0;
                if (res.customerWarningId != 0) {
                    this.showAlertWarningMessage();
                } else {
                    this.customerResctrictions(customerId, this.warningMessage, id);
                }
            }
        },
            err => {
                this.handleError(err);
            })
    }
    handleError(err) {
        this.isSpinnerVisible = false;
    }
    customerResctrictions(customerId, warningMessage, id) {
        let cusId = (customerId.customerId) ? customerId.customerId : customerId;
        this.restrictMessage = '';
        this.commonService.customerResctrictions(cusId, id, this.currentUserMasterCompanyId).subscribe((res: any) => {
            if (res) {
                this.restrictMessage = res.restrictMessage;
                this.restrictID = res.customerWarningId;
                if (this.warningID != 0 && this.restrictID == 0) {
                    this.showAlertWarningMessage();
                } else if (this.warningID == 0 && this.restrictID != 0) {
                    this.showAlertMessage();
                } else if (this.warningID != 0 && this.restrictID != 0) {
                    this.showAlertMessage();
                } else {
                    const { receivingCustomerWorkId } = this.editData;
                    if (this.isEditCustomer == true && this.restrictID == 0) {
                        this._route.navigateByUrl(`receivingmodule/receivingpages/app-customer-work-setup/edit/${receivingCustomerWorkId}`);
                    } else if (this.isAddWorkOrder == true && this.restrictID == 0) {
                        this._route.navigateByUrl(`/workordersmodule/workorderspages/app-work-order-receivingcustworkid/${receivingCustomerWorkId}`);
                    }
                }
            }
        },
            err => {
                this.handleError(err);
            })
    }

    showAlertWarningMessage() {
        $('#warningMesg').modal("show");
    }
    showAlertMessage() {
        $('#warnRestrictMesg').modal("show");
    }
    notmoveclick() {
        $('#warningMesg').modal("hide");
        $('#warnRestrictMesg').modal("hide");
        this.warningMessage = '';
        this.restrictMessage = '';
    }

    WarnRescticModel() {
        $('#warnRestrictMesg').modal("hide");
        $('#warningMesg').modal("hide");
        this.warningMessage = '';
        this.restrictMessage = '';
        const { receivingCustomerWorkId } = this.editData;
        if (this.isEditCustomer == true && this.restrictID == 0) {
            this._route.navigateByUrl(`receivingmodule/receivingpages/app-customer-work-setup/edit/${receivingCustomerWorkId}`);
        } else if (this.isAddWorkOrder == true && this.restrictID == 0) {
            this._route.navigateByUrl(`/workordersmodule/workorderspages/app-work-order-receivingcustworkid/${receivingCustomerWorkId}`);
        }
        this.isAddWorkOrder = false;
        this.isEditCustomer = false;
    }

    openHistoryDoc(rowData) {
        this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
            res => {
                this.sourceViewforDocumentAudit = res;
            })
    }

    dismissDocumentPopupModel(type) {
        this.closeMyModel(type);
    }

    closeMyModel(type) {
        $(type).modal("hide");
    }

    getColorCodeForHistoryDoc(i, field, value) {
        const data = this.sourceViewforDocumentAudit;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    parsedText(text) {

        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }
}
