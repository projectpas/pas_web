import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
declare var $: any;
import { WorkOrderService } from '../../../services/work-order/work-order.service';
import { Table } from 'primeng/table';
import { AuthService } from '../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { Router } from '@angular/router';
import { listSearchFilterObjectCreation, getObjectById } from '../../../generic/autocomplete';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { CommonService } from '../../../services/common.service';
import { Documents } from '../../../models/work-order-documents.modal';
import {
    WorkOrderLabor
} from '../../../models/work-order-labor.modal';
import { Billing } from '../../../models/work-order-billing.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from "@angular/common";
import { SingleScreenAuditDetails } from 'src/app/models/single-screen-audit-details.model';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-work-order-list',
    templateUrl: './work-order-list.component.html',
    styleUrls: ['./work-order-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [fadeInOut]
})

/** WorkOrderList component*/
export class WorkOrderListComponent implements OnInit {
    /** WorkOrderList ctor */
    breadcrumbs: MenuItem[];
    workOrderData: any;
    isLoader: boolean = true;
    isView: boolean = true;
    isWorkOrder = true;
    pageSize: number = 50;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number = 0;
    documents: Documents[] = [];
    editMode: boolean = false;
    paramsData: any = {};
    isWorkOrderView: boolean = true;
    @Input() isSubWorkOrder = false;
    @Input() isWorkOrderMainView = false;
    @Input() workOrderId: any;
    @Output() closeView = new EventEmitter();
    @ViewChild('dt', { static: false })
    private table: Table;
    lazyLoadEventData: any;
    workFlowWorkOrderId: any
    headers = [
        { field: 'workOrderNum', header: 'WO NO' },
        { field: 'partNoType', header: 'MPN' },
        { field: 'pnDescriptionType', header: 'MPN Description' },
        { field: 'workScopeType', header: 'Work Scope' },
        { field: 'priorityType', header: 'Priority' },
        { field: 'customerName', header: 'Customer Name' },
        { field: 'customerType', header: 'Customer Type' },
        { field: 'openDate', header: 'Open Date' },
        { field: 'customerRequestDateType', header: 'Cust Req Date' },
        { field: 'promisedDateType', header: 'Promise Date' },
        { field: 'estimatedShipDateType', header: 'Est. Ship Date' },
        { field: 'estimatedCompletionDateType', header: 'Shipped Date' },
        { field: 'stageType', header: 'Stage Code' },
        { field: 'workOrderStatusType', header: 'Status' },
        { field: "createdDate", header: "Created Date", width: "130px" },
        { field: "createdBy", header: "CreatedBy", width: "130px" },
        { field: "updatedDate", header: "Updated Date", width: "130px" },
        { field: "updatedBy", header: "UpdatedBy", width: "130px" }
    ]
    selectedColumns = this.headers;
    workFlowId: any;
    workOrderDirectionList: Object;
    otherOptions = [
        { label: 'Other Options', value: '' },
        { label: 'Freight', value: 'freight' },
        { label: 'ContactGrid', value: 'contactGrid' },
        { label: 'Accounting', value: 'accounting' },
        { label: 'Charges', value: 'charges' },
        { label: 'Exclusion', value: 'exclusion' },
    ]
    selectedOtherSubTask: string = ''
    activeIndex: number;
    otherOptionShow: boolean = false;
    currentStatus = 'open';
    viewType: any = 'mpn';
    isGlobalFilter: boolean = false;
    filterText: any = '';
    filteredText: any = '';
    private onDestroy$: Subject<void> = new Subject<void>();
    isSpinnerVisible: boolean = false;
    rowDataToDelete: any = {};
    currentDeletedstatus: boolean = false;
    customerWarningListId: any;
    warningMessage: string;
    restrictMessage: string;
    modal: NgbModalRef;
    warningID: any;
    restrictID: any;
    editData: any;
    labor = new WorkOrderLabor();
    billing: Billing;
    moduleName: any;
    workOrderDetails: any;
    subWorkOrderId: any = 0;
    freight: any;
    AuditDetails = SingleScreenAuditDetails;
    home: any;
    restorerecord: any = {};
    customerWarningsList: any;
    constructor(private workOrderService: WorkOrderService,
        private route: Router,
        private authService: AuthService,
        private alertService: AlertService,
        private commonService: CommonService,
        private modalService: NgbModal,
        private datePipe: DatePipe
    ) {
        this.moduleName = 'Work Order';
        this.breadcrumbs = [
            { label: 'Work Order' },
            { label: 'Work Order List' },
        ];
    }

    ngOnInit() {
        this.breadcrumbs = [
            { label: 'Work Order ' },
            { label: 'Work Order List' },
        ];
        this.getWorkOrderDefaultSetting();
        this.getCustomerWarningsList();
        if (this.isWorkOrderMainView) {
            this.view({ workOrderId: this.workOrderId })
        }
    }
    ngOnDestroy(): void {
        this.onDestroy$.next();
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
    getWorkOrderDefaultSetting() {
        this.commonService.workOrderDefaultSettings(1, 1).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            if (res && res[0]) {
                if (res[0].woListDefault == 'WO View') {
                    this.viewType = 'wp';
                } else if (res[0].woListDefault == 'MPN View') {
                    this.viewType = 'mpn';
                }
                this.currentStatus = res[0].woListStatusDefault.toLowerCase();
            } else {
                this.currentStatus = 'open';
                this.viewType = 'mpn';
            }
            this.changeOfStatus(this.currentStatus, this.viewType)
        },
            err => {
                this.isSpinnerVisible = false;
            })
    }
    getColorCodeForMultiple(data) {
        return data['partNoType'] === 'Multiple' ? 'green' : 'black';
    }

    mouseOverData(key, data) {
        if (key === 'partNoType') {
            return data['partNos']
        } else if (key === 'pnDescriptionType') {
            return data['pnDescription']
        } else if (key === 'workScopeType') {
            return data['workScope']
        } else if (key === 'priorityType') {
            return data['priority']
        } else if (key === 'customerType') {
            return data['customer']
        }
        else if (key === 'openDate' && data[key]) {
            return moment(data['openDate']).format('MM-DD-YYYY');
        }
        else if (key === 'customerRequestDateType' && data[key]) {

            return this.convertmultipleDates(data['customerRequestDate']);
        }
        else if (key === 'promisedDateType' && data[key]) {
            return this.convertmultipleDates(data['promisedDate']);
        } else if (key === 'estimatedShipDateType' && data[key]) {
            return this.convertmultipleDates(data['estimatedShipDate']);
        } else if (key === 'stageType') {
            return data['stage']
        } else if (key === 'estimatedCompletionDateType' && data[key]) {
            return this.convertmultipleDates(data['estimatedCompletionDate']);
        } else if (key === 'workOrderStatusType') {
            return data['workOrderStatus']
        }
        else {
            return data[key]
        }
    }

    convertmultipleDates(value) {
        const arrDates = [];
        const arr = value.split(',');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                arrDates.push(moment(arr[i]).format('MM-DD-YYYY'));
            }
        }
        return arrDates;
    }

    convertDate(key, data) {
        if (key === 'openDate' && data[key]) {
            return moment(data['openDate']).format('MM/DD/YYYY');
        }
        else if (key === 'customerRequestDateType' && data[key]) {
            return data['customerRequestDateType'] !== 'Multiple' ? moment(data['customerRequestDate']).format('MM/DD/YYYY') : data['customerRequestDateType'];
        }
        else if (key === 'promisedDateType' && data[key]) {
            return data['promisedDateType'] !== 'Multiple' ? moment(data['promisedDate']).format('MM/DD/YYYY') : data['promisedDateType'];
        }
        else if (key === 'estimatedShipDateType' && data[key]) {
            return data['estimatedShipDateType'] !== 'Multiple' ? moment(data['estimatedShipDate']).format('MM/DD/YYYY') : data['estimatedShipDateType'];
        } else if (key === 'estimatedCompletionDateType' && data[key]) {
            return data['estimatedCompletionDateType'] !== 'Multiple' ? moment(data['estimatedCompletionDate']).format('MM/DD/YYYY') : data['estimatedCompletionDateType'];
        } else if (key === 'createdDate' && data[key]) {
            return moment(data['createdDate']).format('MM/DD/YYYY h:m a');
        } else if (key === 'updatedDate' && data[key]) {
            return moment(data['updatedDate']).format('MM/DD/YYYY h:m a');
        } else {
            return data[key];
        }
    }

    columnsChanges() {
        this.refreshList();
    }

    refreshList() {
        this.table.reset();
    }

    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        if (this.viewType && this.currentStatus) {
            this.lazyLoadEventData.filters = {
                ...this.lazyLoadEventData.filters,
                workOrderStatus: this.lazyLoadEventData.filters.workOrderStatus == undefined ? this.currentStatus : this.lazyLoadEventData.filters.workOrderStatus,
                viewType: this.viewType
            }
        }

        if (!this.isGlobalFilter) {   
            this.getAllWorkOrderList(event);         
        } else {
            this.globalSearch(this.filterText)
        }
    }

    changeOfStatus(status, viewType) {        
        const lazyEvent = this.lazyLoadEventData;
        this.currentStatus = status === '' ? this.currentStatus : status;
        this.viewType = viewType === '' ? this.viewType : viewType;
        this.isSpinnerVisible = true;
        this.getAllWorkOrderList({
            ...lazyEvent,
            filters: {
                ...lazyEvent.filters,
                workOrderStatus: this.currentStatus,
                viewType: this.viewType
            }
        })
    }

    fieldSearch(field) {
        this.isGlobalFilter = false;
        if (field === 'workOrderStatus') {
            this.currentStatus = 'open';
        }
    }

    getAllWorkOrderList(data) {
        this.isSpinnerVisible = true;
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete;
        data.filters.masterCompanyId= this.currentUserMasterCompanyId;
        data.filters.employeeId= this.employeeId;

        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.workOrderService.getWorkOrderList(PagingData).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.workOrderData = res['results'].map(x => {
                return {
                    ...x,
                    //createdDate : x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a'): '',
                    //updatedDate : x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a'): '',

                    openDate: x.openDate ? this.datePipe.transform(x.openDate, 'MMM-dd-yyyy') : '',
                    estimatedShipDate: x.estimatedShipDate ? this.datePipe.transform(x.estimatedShipDate, 'MMM-dd-yyyy hh:mm a') : '',
                    estimatedShipDateType: x.estimatedShipDateType ? this.datePipe.transform(x.estimatedShipDateType, 'MMM-dd-yyyy hh:mm a') : '',
                    estimatedCompletionDate: x.estimatedCompletionDate ? this.datePipe.transform(x.estimatedCompletionDate, 'MMM-dd-yyyy hh:mm a') : '',
                    estimatedCompletionDateType: x.estimatedCompletionDateType ? this.datePipe.transform(x.estimatedCompletionDateType, 'MMM-dd-yyyy hh:mm a') : '',
                    customerRequestDate: x.customerRequestDate ? this.datePipe.transform(x.customerRequestDate, 'MMM-dd-yyyy hh:mm a') : '',
                    customerRequestDateType: x.customerRequestDateType ? this.datePipe.transform(x.customerRequestDateType, 'MMM-dd-yyyy hh:mm a') : '',
                    promisedDate: x.promisedDate ? this.datePipe.transform(x.promisedDate, 'MMM-dd-yyyy hh:mm a') : '',
                    promisedDateType: x.promisedDateType ? this.datePipe.transform(x.promisedDateType, 'MMM-dd-yyyy hh:mm a') : '',
                    createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                    updatedDate : x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
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

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    globalSearch(value) {
        this.pageIndex = 0;
        this.filteredText = value;
        if (this.filteredText != "" && this.filteredText != null && this.filteredText != undefined) {
            this.isGlobalFilter = true;
        }
        else
        {
            this.isGlobalFilter = false;
        }        
        const pageIndex = parseInt(this.lazyLoadEventData.first) / this.lazyLoadEventData.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventData.rows;
        this.lazyLoadEventData.first = pageIndex;
        this.lazyLoadEventData.globalFilter = value;
        this.filterText = value;
        this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters, woFilter: this.currentStatus };
        this.getAllWorkOrderList(this.lazyLoadEventData);
    }

    openViewOnDbl(rowData) {
        this.view(rowData);
        $('#viewWorkOrder').modal('show');
    }

    async view(rowData) {
        this.paramsData['workOrderId'] = rowData.workOrderId;
        this.workOrderId = rowData.workOrderId;
    }
    changeStatus(rowData) {
        this.isSpinnerVisible = true;
        this.workOrderService.updateActionforWorkOrder(rowData, this.userName).subscribe(res => {
            this.isSpinnerVisible = false;
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        },
            err => {
                this.isSpinnerVisible = false;
            })
    }

    edit(rowData) {
        this.editData = rowData;
        const { workOrderId } = rowData;
        const { customerId } = rowData;
        this.editMode = true;
        this.isSpinnerVisible = true;
        this.workOrderService.getWorkOrderById(workOrderId, 0).subscribe(res => {
            this.isSpinnerVisible = false;
            this.route.navigate([`workordersmodule/workorderspages/app-work-order-edit/${workOrderId}`]);
        },
            err => {
                this.isSpinnerVisible = false;
            })
    }
    
    getCustomerWarningsList(): void {
        this.commonService.smartDropDownList('CustomerWarningType', 'CustomerWarningTypeId ', 'Name').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            res.forEach(element => {
                if (element.label == 'Create WO for MPN') {
                    this.customerWarningListId = element.value;
                    return;
                }
            }, error => {

                this.isSpinnerVisible = false;
            });
        })
    }

    customerWarnings(customerId) {
        if (customerId && this.customerWarningListId) {
            this.warningMessage = '';
            this.isSpinnerVisible = true;
            this.commonService.customerWarnings(customerId, this.customerWarningListId).subscribe((res: any) => {
                this.isSpinnerVisible = false;
                if (res) {
                    this.warningMessage = res.warningMessage;
                    this.warningID = res.customerWarningId;
                }
                this.customerResctrictions(customerId, this.warningMessage);

            },
                err => {
                    this.isSpinnerVisible = false;
                })
        }
    }

    customerResctrictions(customerId, warningMessage) {
        this.restrictMessage = '';
        if (customerId && this.customerWarningListId) {
            this.isSpinnerVisible = true;
            this.commonService.customerResctrictions(customerId, this.customerWarningListId).subscribe((res: any) => {
                this.isSpinnerVisible = false;
                if (res) {
                    this.restrictID = res.customerWarningId;
                    this.restrictMessage = res.restrictMessage;
                }
                if (this.warningID != 0 && this.restrictID == 0) {
                    this.showAlertMessage(warningMessage, this.restrictMessage);
                } else if (this.warningID == 0 && this.restrictID != 0) {
                    this.showAlertMessage(warningMessage, this.restrictMessage);
                } else if (this.warningID != 0 && this.restrictID != 0) {
                    this.showAlertMessage(warningMessage, this.restrictMessage);
                } else if (this.warningID == 0 && this.restrictID == 0) {
                }
            },
                err => {
                    this.isSpinnerVisible = false;
                })
        }
    }

    showAlertMessage(warningMessage, restrictMessage) {
        $('#warnRestrictMesg').modal("show");
    }

    WarnRescticModel() {
        if (this.restrictID == 0) {
        }
        $('#warnRestrictMesg').modal("hide");
        this.warningMessage = '';
        this.restrictMessage = '';
    }

    openDownload(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    closeModal() {
        this.modal.close();
    }

    dismissModel() {
        this.modal.close();
    }

    exportCSV(dt) {
        let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "workOrderStatus": this.currentStatus }, "globalFilter": "" }
        let filters = Object.keys(dt.filters);
        filters.forEach(x => {
            PagingData.filters[x] = dt.filters[x].value;
        });
        this.workOrderService
            .getWorkOrderList(PagingData).subscribe(res => {
                const vList = res['results'].map(x => {
                    return {
                        ...x,
                        openDate: x.openDate ? this.datePipe.transform(x.openDate, 'MMM-dd-yyyy') : '',
                        estimatedShipDate: x.estimatedShipDate ? this.datePipe.transform(x.estimatedShipDate, 'MMM-dd-yyyy hh:mm a') : '',
                        estimatedShipDateType: x.estimatedShipDateType ? this.datePipe.transform(x.estimatedShipDateType, 'MMM-dd-yyyy hh:mm a') : '',
                        estimatedCompletionDate: x.estimatedCompletionDate ? this.datePipe.transform(x.estimatedCompletionDate, 'MMM-dd-yyyy hh:mm a') : '',
                        estimatedCompletionDateType: x.estimatedCompletionDateType ? this.datePipe.transform(x.estimatedCompletionDateType, 'MMM-dd-yyyy hh:mm a') : '',
                        customerRequestDate: x.customerRequestDate ? this.datePipe.transform(x.customerRequestDate, 'MMM-dd-yyyy hh:mm a') : '',
                        customerRequestDateType: x.customerRequestDateType ? this.datePipe.transform(x.customerRequestDateType, 'MMM-dd-yyyy hh:mm a') : '',
                        promisedDate: x.promisedDate ? this.datePipe.transform(x.promisedDate, 'MMM-dd-yyyy hh:mm a') : '',
                        promisedDateType: x.promisedDateType ? this.datePipe.transform(x.promisedDateType, 'MMM-dd-yyyy hh:mm a') : '',
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                    }
                });

                dt._value = vList;
                dt.exportCSV();
                dt.value = this.workOrderData;
                this.modal.close();
            }, err => {
            });
    }

    delete(rowData) {
        this.rowDataToDelete = rowData;
    }

    deleteWO() {
        this.isSpinnerVisible = false;
        this.workOrderService.deleteActionforWorkOrder(this.rowDataToDelete.workOrderId).subscribe(res => {
            this.getAllWorkOrderList(this.lazyLoadEventData);
            this.isSpinnerVisible = false;
            this.alertService.showMessage("Success", `Records Was Deleted Successfully.`, MessageSeverity.success);

        },err => {
                this.isSpinnerVisible = false;
            })
    }

    closeDeleteModal() {
        $("#woDelete").modal("hide");
    }

    getDeleteListByStatus(value) {
        this.currentDeletedstatus = true;
        this.pageIndex = this.lazyLoadEventData.rows > 10 ? parseInt(this.lazyLoadEventData.first) / this.lazyLoadEventData.rows : 0;
        this.pageSize = this.lazyLoadEventData.rows;
        this.lazyLoadEventData.first = this.pageIndex;
        if (value == true) {
            this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters, status: this.currentStatus };
            this.isSpinnerVisible = true;
            this.getAllWorkOrderList(this.lazyLoadEventData);
        } else {
            this.currentDeletedstatus = false;
            this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters, status: this.currentStatus };
            this.isSpinnerVisible = true;
            this.getAllWorkOrderList(this.lazyLoadEventData);
        }
    }

    restoreRecord() {
        this.commonService.updatedeletedrecords('WorkOrder', 'WorkOrderId', this.restorerecord.workOrderId).subscribe(res => {
            this.getDeleteListByStatus(true)
            this.modal.close();
            this.alertService.showMessage("Success", `Record was Restored Successfully.`, MessageSeverity.success);
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
} 