import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { PageHeaderComponent } from '../../../shared/page-header.component';
import * as $ from 'jquery';
import { WorkOrderService } from '../../../services/work-order/work-order.service';
import { Table } from 'primeng/table';
import { AuthService } from '../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { Router } from '@angular/router';
import { listSearchFilterObjectCreation, getObjectById } from '../../../generic/autocomplete';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { WorkOrderQuoteService } from '../../../services/work-order/work-order-quote.service';
import { CommonService } from '../../../services/common.service';
import { Documents } from '../../../models/work-order-documents.modal';
import {
    WorkOrderLabor
} from '../../../models/work-order-labor.modal';
import { Billing } from '../../../models/work-order-billing.model';

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
    workOrderData: any;
    isLoader: boolean = true;
    isView: boolean = true;
    isWorkOrder = true;
    pageSize: number = 50;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number = 0;
    documents: Documents[] = [];
    taskList: any = [];
    editMode: boolean = false;
    paramsData: any = {};
    isWorkOrderView: boolean = true;
    @Input() isSubWorkOrder = false;
    @Input() isWorkOrderMainView = false;
    @Input() workOrderId: any;
    @Output() closeView = new EventEmitter();

    @ViewChild('dt',{static:false})
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
    ]
    selectedColumns = this.headers;
    // pageIndex: number = 0;
    // totalRecords: any;
    // totalPages: number;
    workOrderPartListData: any;
    workOrderPartListDataKeys: string[];
    viewWorkOrderHeader: any;
    viewWorkOrderMPN: any;
    workOrderAssetList: any;
    workOrderMaterialList: Object;
    workOrderPublicationList: Object;
    workOrderChargesList: Object;
    workOrderExclusionsList: Object;
    workOrderLaborList: Object;
    mpnPartNumbersList: any;
    quoteDetailsId: any;
    // workOrderId: any;
    workFlowId: any;
    showTableGrid: boolean = false;
    showMPN: boolean = false;
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
    private onDestroy$: Subject<void> = new Subject<void>();

    isSpinnerVisible: boolean = false;
    customerWarningListId: any;
    warningMessage: string;
    restrictMessage: string;
    warningID: any;
    restrictID: any;
    editData: any;
    materialStatus: any;
    savedWorkOrderData: any;
    documentsDestructuredData: any;
    communicationOptionShow: boolean = false;
    selectedCommunicationOption: string = "";
    workOrderFreightList: any;
    workFlowObject = {
        materialList: [],
        equipments: [],
        charges: [],
        exclusions: []
    }
    legalEntityList: any;
    currencyList: any;
    employeesOriginalData: any;
    isEditBilling: boolean = false;
    workOrderQuoteId: any;
    buildMethodDetails: any;
    quoteChargesList: any;
    quoteFreightsList: any;
    quoteMaterialList: any;
    quoteLaborList: any;
    labor = new WorkOrderLabor();
    billing: Billing;
    workOrderPartNumberId: any;
    moduleName:any;
    workOrderDetails: any;
    showTabsGrid: boolean;
    showGridMenu: boolean;
    subWorkOrderId: any = 0;
    constructor(private workOrderService: WorkOrderService,
        private route: Router,
        private authService: AuthService,
        private alertService: AlertService,
        private quoteService: WorkOrderQuoteService,
        private commonService: CommonService,
    ) {
        this.moduleName = 'Work Order';
    }
    ngOnInit() {
        this.getWorkOrderDefaultSetting();
        this.getCustomerWarningsList();
        this.getTaskList();
        this.getLegalEntity();
        this.getCurrency();
        this.getAllEmployees()
        // this.getAllWorkOrderList()
        console.log('sample');
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

    // { field: 'partNoType', header: 'MPN' },
    // { field: 'pnDescriptionType', header: 'MPN Description' },
    // { field: 'workScopeType', header: 'Work Scope' },
    // { field: 'priorityType', header: 'Priority' },
    // { field: 'customerName', header: 'Customer Name' },
    // { field: 'customerType', header: 'Customer Type' },
    // { field: 'openDate', header: 'Open Date' },
    // { field: 'customerRequestDateType', header: 'Cust Req Date' },
    // { field: 'promisedDateType', header: 'Promise Date' },
    // { field: 'estimatedShipDateType', header: 'Est. Ship Date' },
    // { field: 'estimatedCompletionDateType', header: 'Shipped Date' },
    // { field: 'stageType', header: 'Stage Code' },
    // { field: 'workOrderStatus', header: 'Status' },

    getLegalEntity() {
        this.commonService.getLegalEntityList().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.legalEntityList = res;
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }

    getCurrency() {
        this.commonService.smartDropDownList('Currency', 'CurrencyId', 'symbol').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.currencyList = res;
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }

    getAllEmployees() {
        this.commonService.smartDropDownList('Employee', 'EmployeeId', 'FirstName').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.employeesOriginalData = res.map(x => {
                return {
                    ...x,
                    employeeId: x.value,
                    name: x.label
                }
            });
        })
    }

    getTaskList() {
        this.workOrderService.getAllTasks()
            .pipe(takeUntil(this.onDestroy$)).subscribe(
                (taskList) => {
                    this.taskList = taskList;
                },
                err => {
                    // this.isSpinnerVisible = false;
                    this.errorHandling(err);
                }
            )
    }


    getWorkOrderDefaultSetting() {
        this.commonService.workOrderDefaultSettings(1, 1).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            console.log("work order default settings", res);
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
            console.log("res check", this.viewType, this.currentStatus);
            this.changeOfStatus(this.currentStatus, this.viewType)
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
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
            // return data['estimatedCompletionDateType'] !== 'Multiple' ? moment(data['estimatedCompletionDate']).format('MM-DD-YYYY') : data['estimatedCompletionDate'];
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
        // debugger;
        // console.log("data checked data",key,data);
        if (key === 'openDate' && data[key]) {
            return moment(data['openDate']).format('MM-DD-YYYY');
        }
        else if (key === 'customerRequestDateType' && data[key]) {
            return data['customerRequestDateType'] !== 'Multiple' ? moment(data['customerRequestDate']).format('MM-DD-YYYY') : data['customerRequestDateType'];
        }
        else if (key === 'promisedDateType' && data[key]) {
            return data['promisedDateType'] !== 'Multiple' ? moment(data['promisedDate']).format('MM-DD-YYYY') : data['promisedDateType'];
        }
        else if (key === 'estimatedShipDateType' && data[key]) {
            return data['estimatedShipDateType'] !== 'Multiple' ? moment(data['estimatedShipDate']).format('MM-DD-YYYY') : data['estimatedShipDateType'];
        } else if (key === 'estimatedCompletionDateType' && data[key]) {
            return data['estimatedCompletionDateType'] !== 'Multiple' ? moment(data['estimatedCompletionDate']).format('MM-DD-YYYY') : data['estimatedCompletionDateType'];
        } else {
            return data[key];
        }
    }
    // rowData['partNoType'] != 'Multiple' &&
    // rowData['workScopeType'] != 'Multiple' && rowData['priorityType'] != 'Multiple'&&
    // rowData['pnDescriptionType'] != 'Multiple' && rowData['stageType'] != 'Multiple' &&
    // rowData['customerRequestDateType'] != 'Multiple' && rowData['estimatedShipDateType'] != 'Multiple' &&
    // rowData['customerRequestDateType'] != 'Multiple' && rowData['estimatedCompletionDateType'] != 'Multiple'


    columnsChanges() {
        this.refreshList();
    }
    refreshList() {
        this.table.reset();
        // this.getList();
        // this.table.sortOrder = 0;
        // this.table.sortField = '';


    }

    loadData(event) {
        console.log(event)
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
            this.globalSearch()
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
        console.log(data);
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.workOrderService.getWorkOrderList(PagingData).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.workOrderData = res;
            if (res.length > 0) {
                this.totalRecords = res[0].totalRecords;
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
    otherOptionSelected(value) {
        this.selectedOtherSubTask = value;
        this.otherOptionShow = false;
    }
    otherCommunicationOptionSelected(value) {
        this.selectedCommunicationOption = value;
        this.communicationOptionShow = false;
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    pageIndexChange(event) {
        this.pageSize = event.rows;
    }
    globalSearch(value?) {

        // this.inputGlobalSearch = value;
        if (!this.isGlobalFilter) {
            this.pageIndex = 0;
        }
        this.isGlobalFilter = true;
        this.workOrderService.getWorkOrderGlobalSearch(value, this.pageIndex, this.pageSize).subscribe(res => {
            this.workOrderData = res;
            if (res.length > 0) {
                this.totalRecords = res[0].totalRecords;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }
    openViewOnDbl(rowData) {
        this.view(rowData);
        $('#viewWorkOrder').modal('show');
    }

    async view(rowData) {
        console.log("view", rowData)
        this.paramsData['workOrderId'] = rowData.workOrderId;
        this.workOrderId = rowData.workOrderId;
        // const { workFlowWorkOrderId } = rowData;
        // const workOrderId = 46;
        // const workFlowWorkOrderId = 0;

        await this.workOrderService.viewWorkOrderHeader(this.workOrderId).subscribe(res => {
            this.workOrderDetails = res;
            this.viewWorkOrderHeader = res;
            this.showTabsGrid = true;
            this.showGridMenu = true;
            this.workFlowWorkOrderId = res.workFlowWorkOrderId
            this.workOrderPartNumberId = res.woPartNoId;
            this.billingCreateOrEdit();
            if (res.singleMPN === "Single MPN") {
                this.showMPN = false;
                this.getAllTabsData(res.workFlowWorkOrderId, 0);
                this.checkQuoteAvailability(rowData.workOrderId, res.workFlowWorkOrderId);

            } else {
                this.showMPN = true;
            }
            this.workFlowId = res.workFlowId;
            this.savedWorkOrderData = {
                workOrderId: this.workOrderId,
                workFlowId: this.workFlowId,
                workFlowWorkOrderId: this.workFlowWorkOrderId
            }
            this.getQuoteIdByWfandWorkOrderId(this.workFlowWorkOrderId, this.workOrderId);
            this.getDocumentsByWorkOrderId();

        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })

        await this.workOrderService.viewWorkOrderPartNumber(this.workOrderId).subscribe(res => {
            this.viewWorkOrderMPN = res;
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })

        console.log(rowData);
        // data-toggle="modal" data-target="#view"


        // this.workOrderId = 0;
        this.getWorkOrderWorkFlowNos(this.workOrderId)




    }

    billingCreateOrEdit() {
        this.workOrderService.getBillingEditData(this.workOrderId, this.workOrderPartNumberId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            // Edit
            this.billing = {
                ...res,
                shipDate: new Date(res.shipDate),
                printDate: new Date(res.printDate),
                woOpenDate: new Date(res.openDate),
                invoiceDate: new Date(res.invoiceDate),
                soldToCustomerId: { customerId: res.soldToCustomerId, customerName: res.soldToCustomer },
                shipToCustomerId: { customerId: res.shipToCustomerId, customerName: res.shipToCustomer },
                customerRef: res.customerReference,
                woType: res.workOrderType,
                shipAccountInfo: res.shippingAccountinfo
            }
            this.isEditBilling = true;
        }, error => {
            this.getWorkOrderDetailsFromHeader()
        })
    }

    getWorkOrderDetailsFromHeader() {
        this.workOrderService.viewWorkOrderHeader(this.workOrderId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            const data = res;
            // console.log("billinfdgd",res);
            // create
            this.billing = new Billing();
            this.billing = {
                ...this.billing,
                customerRef: data.customerReference,
                employeeName: data.employee,
                woOpenDate: new Date(data.openDate),
                salesPerson: data.salesperson,
                woType: data.workOrderType,
                creditTerm: data.creditTerm,
                workScope: "0",
                managementStructureId: data.managementStructureId

            }
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }

    getQuoteIdByWfandWorkOrderId(wfwoid, woid) {
        this.quoteService.getQuoteIdByWfandWorkOrderId(wfwoid, woid).pipe(takeUntil(this.onDestroy$)).subscribe(res => {

            if (res) {
                this.workOrderQuoteId = res.quoteDetailId;
                this.quoteService.getSavedQuoteDetails(wfwoid)
                    .subscribe(
                        res => {
                            this.buildMethodDetails = res;
                            this.getQuoteCostingData(res['buildMethodId']);
                            this.billing['materialCost'] = res['materialFlatBillingAmount'];
                            this.billing['laborOverHeadCost'] = res['laborFlatBillingAmount'];
                            this.billing['miscChargesCost'] = res['chargesFlatBillingAmount'] + res['freightFlatBillingAmount'];

                        },
                        err => {
                            // this.isSpinnerVisible = false;
                            this.errorHandling(err);
                        }
                    )
            }
            else {
                this.quoteChargesList = [];
                this.quoteMaterialList = [];
                this.quoteLaborList = [];
                this.billing = undefined;
            }

        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }

    getQuoteCostingData(buildMethodId) {
        this.getQuoteMaterialListByWorkOrderQuoteId(buildMethodId);
        this.getQuoteFreightsListByWorkOrderQuoteId(buildMethodId);
        this.getQuoteChargesListByWorkOrderQuoteId(buildMethodId);
        this.getQuoteLaborListByWorkOrderQuoteId(buildMethodId);
    }


    async getQuoteMaterialListByWorkOrderQuoteId(buildMethodId) {
        // console.log("this.check work order id",this.workOrderGeneralInformation.workorderid,this.workOrderId);
        await this.quoteService.getQuoteMaterialList(this.workOrderQuoteId, buildMethodId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.quoteMaterialList = res;
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }
    async getQuoteFreightsListByWorkOrderQuoteId(buildMethodId) {
        await this.quoteService.getQuoteFreightsList(this.workOrderQuoteId, buildMethodId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.quoteFreightsList = res;

        }   ,
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }
    async getQuoteChargesListByWorkOrderQuoteId(buildMethodId) {
        await this.quoteService.getQuoteChargesList(this.workOrderQuoteId, buildMethodId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.quoteChargesList = res;
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }
    async getQuoteLaborListByWorkOrderQuoteId(buildMethodId) {
        await this.quoteService.getQuoteLaborList(this.workOrderQuoteId, buildMethodId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            if (res) {
                // this.workOrderLaborList = res;
                let wowfId = this.workFlowWorkOrderId;
                if (res) {
                    let laborList = this.labor.workOrderLaborList;
                    this.quoteLaborList = { ...res, workOrderLaborList: laborList };
                    this.quoteLaborList.dataEnteredBy = getObjectById('value', res.dataEnteredBy, this.employeesOriginalData);
                    this.quoteLaborList.workFlowWorkOrderId = wowfId;
                    if (!this.quoteLaborList.workOrderLaborList || !this.quoteLaborList.workOrderLaborList[0]) {
                        this.quoteLaborList["workOrderLaborList"] = [{}]
                    }
                    this.taskList.forEach((tl) => {
                        this.quoteLaborList.workOrderLaborList[0][tl['description'].toLowerCase()] = [];
                        res.laborList.forEach((rt) => {
                            if (rt['taskId'] == tl['taskId']) {
                                // if(this.labor.workOrderLaborList[0][tl['description'].toLowerCase()][0] && this.labor.workOrderLaborList[0][tl['description'].toLowerCase()][0]['expertiseId'] == null && this.labor.workOrderLaborList[0][tl['description'].toLowerCase()][0]['employeeId'] == null){
                                //   this.labor.workOrderLaborList[0][tl['description'].toLowerCase()] = [];
                                // }
                                let labor = {}
                                labor = { ...rt, employeeId: { 'label': rt.employeeName, 'value': rt.employeeId } }
                                this.quoteLaborList.workOrderLaborList[0][tl['description'].toLowerCase()].push(labor);
                            }
                        })
                    })
                }
            }
            else {
                this.taskList.forEach((tl) => {
                    this.quoteLaborList.workOrderLaborList[0][tl['description'].toLowerCase()] = [];
                });
            }

        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }

    getDocumentsByWorkOrderId() {
        // this.workFlowWorkOrderId, this.workOrderId
        // 89,102
        if (this.workFlowWorkOrderId !== 0 && this.workOrderId) {
            this.documentsDestructuredData = [];
            // false ,0 is to handle subworkorder data purpose to handel apis in Endpoint
            this.workOrderService.getDocumentsList(this.workFlowWorkOrderId, this.workOrderId,false,0).subscribe(res => {
                let arr = [];

                const data = res.map(x => {
                    for (var i = 0; i < x.attachmentDetails.length; i++) {
                        const y = x.attachmentDetails;
                        arr.push({
                            ...x,
                            fileName: y[i].fileName,
                            fileCreatedDate: y[i].createdDate,
                            fileCreatedBy: y[i].createdBy,
                            fileUpdatedBy: y[i].updatedBy,
                            fileUpdatedDate: y[i].updatedDate,
                            fileSize: y[i].fileSize,
                            link: y[i].link,
                            attachmentDetailId: y[i].attachmentDetailId

                        })
                    }
                })
                this.documentsDestructuredData = arr;
            }, err => {
                this.documentsDestructuredData = [];
                this.errorHandling(err);
            })
         
        }
    }


    selectedMPN: any;
    getWorkOrderWorkFlowNos(workOrderId) {
        if (workOrderId) {
            this.workOrderService.getWorkOrderWorkFlowNumbers(workOrderId).subscribe(res => {

                this.mpnPartNumbersList = res.map(x => {
                    return {
                        value: { workflowId: x.workflowId, workFlowWorkOrderId: x.value },
                        label: x.partNumber
                    }
                })
                if (this.mpnPartNumbersList && this.mpnPartNumbersList.length > 0) {
                    console.log("this check part numbers", this.mpnPartNumbersList);
                    this.selectedMPN = this.mpnPartNumbersList[0].value;
                    this.workFlowWorkOrderId = this.mpnPartNumbersList[0].value.workFlowWorkOrderId;
                    console.log("this workFlowWorkOrderId", this.workFlowWorkOrderId);
                    this.changeofMPN(this.mpnPartNumbersList[0].value);
                }
                // if (this.viewWorkOrderHeader.singleMPN === 'Single MPN') {
                //     const data = this.mpnPartNumbersList;

                //     if (data.length === 1) {
                //         this.getAllTabsData(data[0].value.workFlowWorkOrderId, this.workOrderId);
                //         this.showTableGrid = true;
                //     }
                // }
                // else {
                //     this.showTableGrid = true;
                // }

            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
        }

    }

    changeofMPN(object) {
        console.log("change mpn object", object);
        this.workFlowId = object.workflowId;
        this.getAllTabsData(object.workFlowWorkOrderId, this.workOrderId);
        this.checkQuoteAvailability(this.workOrderId, object.workFlowWorkOrderId);
        this.workFlowWorkOrderId = object.workFlowWorkOrderId;
    }

    getAllTabsData(workFlowWorkOrderId, workOrderId) {
        this.getEquipmentByWorkOrderId(workFlowWorkOrderId, workOrderId);
        this.getMaterialListByWorkOrderId(workFlowWorkOrderId, workOrderId);
        this.getPublicationListByWorkOrderId(workFlowWorkOrderId, workOrderId);
        this.getChargesListByWorkOrderId(workFlowWorkOrderId, workOrderId);
        this.getExclusionListByWorkOrderId(workFlowWorkOrderId, workOrderId);
        this.getLaborListByWorkOrderId(workFlowWorkOrderId, workOrderId);
        this.getDirectionByWorkOrderId(workFlowWorkOrderId, workOrderId);
        this.getWorkOrderFrieghtsList(workFlowWorkOrderId, workOrderId);
        this.showTableGrid = true;
        this.activeIndex = 0;
        console.log('Testing');

        // $('#viewWorkOrder').modal('show');

    }


    getEquipmentByWorkOrderId(workFlowWorkOrderId, workOrderId) {
        console.log(workFlowWorkOrderId, workOrderId);

        // if (workFlowWorkOrderId || workFlowWorkOrderId === 0) {
        // this.workFlowWorkOrderId = this.workFlowWorkOrderData.workFlowWorkOrderId;
        if (workFlowWorkOrderId) {
            this.workOrderService.getWorkOrderAssetList(workFlowWorkOrderId, workOrderId,0,false).subscribe(
                result => {
                    console.log(result);
                    this.workOrderAssetList = result;
                },
                err => {
                    // this.isSpinnerVisible = false;
                    this.errorHandling(err);
                }
            )
        }

    }

    // getMaterialListByWorkOrderId(workFlowWorkOrderId, workOrderId) {
    //     if (workFlowWorkOrderId) {
    //         this.workOrderService.getWorkOrderMaterialList(workFlowWorkOrderId, workOrderId).subscribe(res => {

    //             this.workOrderMaterialList = res;
    //             this.materialStatus = res[0].partStatusId;
    //         })

    //     }
    // }
    getMaterialListByWorkOrderId(workFlowWorkOrderId, workOrderId) {
        console.log("this is checked", this.workFlowWorkOrderId, this.workOrderId);
        if (this.workFlowWorkOrderId !== 0 && this.workOrderId) {
            this.workOrderService.getWorkOrderMaterialList(this.workFlowWorkOrderId, this.workOrderId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                if (res.length > 0) {
                    res.forEach(element => {
                        element.isShowPlus = true;
                        if (element.currency) element.currency = element.currency.symbol;
                    });
                    this.workOrderMaterialList = res;
                    this.materialStatus = res[0].partStatusId;
                    console.log("material llist", this.workOrderMaterialList)
                }
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
        }
    }




    getPublicationListByWorkOrderId(workFlowWorkOrderId, workOrderId) {

        if (workFlowWorkOrderId) {
            this.workOrderService.getWorkOrderPublicationList(workFlowWorkOrderId, workOrderId).subscribe(res => {
                this.workOrderPublicationList = res;
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })

        }
    }

    getChargesListByWorkOrderId(workFlowWorkOrderId, workOrderId) {

        if (workFlowWorkOrderId) {
            this.workOrderService.getWorkOrderChargesList(workFlowWorkOrderId, workOrderId).subscribe(res => {
                this.workOrderChargesList = res;
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })

        }

    }

    getExclusionListByWorkOrderId(workFlowWorkOrderId, workOrderId) {

        if (workFlowWorkOrderId) {
            this.workOrderService.getWorkOrderExclusionsList(workFlowWorkOrderId, workOrderId).subscribe(res => {
                this.workOrderExclusionsList = res;
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })

        }

    }

    getWorkOrderFrieghtsList(workFlowWorkOrderId, workOrderId) {
        if (workFlowWorkOrderId) {
            // ,false,0 handle for sub work order handle both apis in end point
            this.workOrderService.getWorkOrderFrieghtsList(workFlowWorkOrderId, workOrderId, false, 0).subscribe(res => {
                this.workOrderFreightList = res;
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })

        }
    }

    getLaborListByWorkOrderId(workFlowWorkOrderId, workOrderId) {

        if (workFlowWorkOrderId) {
            // false, 0 is For Sub Work Order 
            this.workOrderService.getWorkOrderLaborList(workFlowWorkOrderId, workOrderId,false,0).subscribe(res => {
                if(res && res.laborList){

                    this.workOrderLaborList = res.laborList;
                }

            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })

        }

    }

    getDirectionByWorkOrderId(workFlowWorkOrderId, workOrderId) {
        if (workFlowWorkOrderId) {
            this.workOrderService.getWorkOrderDirectionList(workFlowWorkOrderId, workOrderId).subscribe(res => {
                this.workOrderDirectionList = res;
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })

        }
    }


    gettearDownData() {
        this.workFlowWorkOrderId = this.workFlowWorkOrderId;
        console.log("work Idasda", this.workFlowWorkOrderId);
    }






    changeStatus(rowData) {
        this.workOrderService.updateActionforWorkOrder(rowData, this.userName).subscribe(res => {
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })

    }

    delete(rowData) {
        this.workOrderService.deleteActionforWorkOrder(rowData.workOrderId).subscribe(res => {
            this.getAllWorkOrderList(this.lazyLoadEventData);
            this.alertService.showMessage("Success", `Successfully Deleted Record`, MessageSeverity.success);

        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }

    getWorkOrderPartListByWorkOrderId(rowData) {
        const { workOrderId } = rowData;
        this.workOrderService.getWorkOrderPartListByWorkOrderId(workOrderId).subscribe(res => {
            if (res.length > 0) {
                this.workOrderPartListDataKeys = Object.keys(res[0]);
                this.workOrderPartListData = res;
            }
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })

    }

    showOtherOptions() {
        this.otherOptionShow = !this.otherOptionShow;
    }
    showOtherCommunicationOptions() {
        this.communicationOptionShow = !this.communicationOptionShow;
    }

    checkQuoteAvailability(workOrderId, wfwoid) {
        this.quoteService.getQuoteIdByWfandWorkOrderId(wfwoid, workOrderId).subscribe(
            (res) => {
                if (res) {
                    this.quoteDetailsId = res.workOrderQuote.workOrderQuoteId;
                }
                else {
                    this.quoteDetailsId = undefined;
                }
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            }
        )
    }

    edit(rowData) {
        this.editData = rowData;
        const { workOrderId } = rowData;
        const { customerId } = rowData;
        this.editMode = true;
        // this.customerWarnings(customerId);
        // const {workOrderId} =this.editData;
        this.workOrderService.getWorkOrderById(workOrderId, 0).subscribe(res => {
            this.route.navigate([`workordersmodule/workorderspages/app-work-order-edit/${workOrderId}`]);
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })

    }
    customerWarningsList: any;
    getCustomerWarningsList(): void {
        this.commonService.smartDropDownList('CustomerWarningType', 'CustomerWarningTypeId ', 'Name').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            // this.customerWarningsList = res;
            res.forEach(element => {
                if (element.label == 'Create WO for MPN') {
                    this.customerWarningListId = element.value;
                    return;
                }
            });
        })
    }
    customerWarnings(customerId) {
        if (customerId && this.customerWarningListId) {
            this.warningMessage = '';
            this.commonService.customerWarnings(customerId, this.customerWarningListId).subscribe((res: any) => {
                console.log("reasons list", res);
                // this.customerResctrictions(customerId,res)	
                if (res) {
                    this.warningMessage = res.warningMessage;
                    this.warningID = res.customerWarningId;
                }
                this.customerResctrictions(customerId, this.warningMessage);

            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
        }
    }
    customerResctrictions(customerId, warningMessage) {
        this.restrictMessage = '';
        if (customerId && this.customerWarningListId) {
            this.commonService.customerResctrictions(customerId, this.customerWarningListId).subscribe((res: any) => {
                console.log("reasons list22", res);
                if (res) {
                    this.restrictID = res.customerWarningId;
                    this.restrictMessage = res.restrictMessage;
                    // this.receivingForm.customerCode = null;   
                    // this.receivingForm.customerId = null;    
                    // this.receivingForm.customerId=null;  
                    // this.receivingForm.customerContactId=null;
                    // this.receivingForm.customerPhone=null;

                }
                if (this.warningID != 0 && this.restrictID == 0) {
                    this.showAlertMessage(warningMessage, this.restrictMessage);
                } else if (this.warningID == 0 && this.restrictID != 0) {
                    this.showAlertMessage(warningMessage, this.restrictMessage);
                } else if (this.warningID != 0 && this.restrictID != 0) {
                    this.showAlertMessage(warningMessage, this.restrictMessage);
                } else if (this.warningID == 0 && this.restrictID == 0) {
                    // this.editCall();
                }
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
        }
    }
    showAlertMessage(warningMessage, restrictMessage) {
        console.log("alert mesages", this.warningMessage);
        console.log("restrict mesages", this.restrictMessage);
        $('#warnRestrictMesg').modal("show");
        // this.modal.close();
    }


    WarnRescticModel() {
        if (this.restrictID == 0) {
            // this.editCall();
        }
        $('#warnRestrictMesg').modal("hide");
        this.warningMessage = '';
        this.restrictMessage = '';

    }
    // editCall(){
    //     const {workOrderId} =this.editData;
    //     this.workOrderService.getWorkOrderById(workOrderId, 0).subscribe(res => {
    //         this.route.navigate([`workordersmodule/workorderspages/app-work-order-edit/${workOrderId}`]);
    //     })
    // }
    errorHandling(err){
        if(err['error']['errors']){
            err['error']['errors'].forEach(x=>{
                this.alertService.showMessage(
                    this.moduleName,
                    x['message'],
                    MessageSeverity.error
                );
            })
        }
        else{
            this.alertService.showMessage(
                this.moduleName,
                'Saving data Failed due to some input error',
                MessageSeverity.error
            );
        }
    }
    handleError(err){
        if(err['error']['errors']){
            err['error']['errors'].forEach(x=>{
                this.alertService.showMessage(
                    this.moduleName,
                    x['message'],
                    MessageSeverity.error
                );
            })
        }
        else{
            this.alertService.showMessage(
                this.moduleName,
                'Failed due to some error',
                MessageSeverity.error
            );
        }
    }
} 