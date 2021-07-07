import { Component, OnInit, Input, Output,ViewChild,ElementRef, EventEmitter, SimpleChanges } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
declare var $: any;
import { WorkOrderPartNumber } from '../../../../models/work-order-partnumber.model';
import { Customer } from '../../../../models/customer.model';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { addressesForm } from '../../../../models/work-order-address.model';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { EmployeeService } from '../../../../services/employee.service';
import { VendorService } from '../../../../services/vendor.service';
import { Documents } from '../../../../models/work-order-documents.modal';
import { WorkOrderQuote } from '../../../../models/work-order-quote.modal';
import { WorkOrderLabor, AllTasks } from '../../../../models/work-order-labor.modal';
import { CommonService } from '../../../../services/common.service';
import { getValueFromObjectByKey, getObjectById, editValueAssignByCondition, getValueFromArrayOfObjectById, getValueByFieldFromArrayofObject, formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { AuthService } from '../../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkFlowtService } from '../../../../services/workflow.service';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Billing } from '../../../../models/work-order-billing.model';
import * as moment from 'moment';
import { WorkOrderQuoteService } from '../../../../services/work-order/work-order-quote.service';
import { CustomerViewComponent } from '../../../../shared/components/customer/customer-view/customer-view.component';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { SalesOrderService } from '../../../../services/salesorder.service';
import { SalesOrderReference } from '../../../../models/sales/salesOrderReference';
import { SalesOrderReferenceStorage } from '../../../sales/shared/sales-order-reference-storage';
import { DBkeys } from '../../../../services/db-Keys';
import { MenuItem } from 'primeng/api';
import { AppModuleEnum } from "../../../../enum/appmodule.enum";
import { SalesQuoteService } from '../../../../services/salesquote.service';

@Component({
    selector: 'app-work-order-add',
    templateUrl: './work-order-add.component.html',
    styleUrls: ['./work-order-add.component.scss'],
    animations: [fadeInOut],
    providers: [SalesOrderService]
})

export class WorkOrderAddComponent implements OnInit {
    @ViewChild("confirmCMMInfo", { static: false }) confirmCMMInfo: ElementRef;
    @ViewChild("confirmCMMInfoCreate", { static: false }) confirmCMMInfoCreate: ElementRef;
    @ViewChild("modalWorkScope", { static: false }) modalWorkScope: ElementRef;
    
    workOrderModule = "WorkOrder";
    subWorkOrderModule = "SubWorkOrder";
    breadcrumbs: MenuItem[];
    @Input() isView: boolean = false;
    @Input() isEdit: boolean = false;
    @Input() workOrderTypes;
    @Input() workOrderStatusList: any = [];
    @Input() creditTerms;
    @Input() jobTitles;
    @Input() employeesOriginalData;
    @Input() techStationList;
    @Input() salesPersonOriginalList;
    @Input() salesAgentsOriginalList;
    @Input() csrOriginalList;
    @Input() technicianOriginalList;
    @Input() technicianByExpertiseTypeList;
    @Input() workOrderStagesList;
    @Input() priorityList;
    @Input() partNumberOriginalData: any = [];
    @Input() workOrderGeneralInformation;
    @Input() isSubWorkOrder: boolean = false;
    @Input() subWorkOrderDetails;
    @Input() showTabsGrid = false;
    @Input() workOrderId;
    @Input() conditionList;
    @Input() workorderSettings;
    @Input() workFlowWorkOrderId = 0;
    @Input() showGridMenu = false;
    @Output() getLatestDefaultSettingByWorkOrderTypeId = new EventEmitter();
    @Input() isListView: boolean = false;
    @Input() subWoMpnGridUpdated = false;
    @Input() triggerSubWoMpn = false;
    //@Output() onWorkOrderPrintLoad = new EventEmitter();
    technicianOriginalList1: any = [];
    isRecCustomer: boolean;
    selectedCustomer: Customer;
    selectedEmployee: any;
    selectedsalesPerson: any;
    customerNamesList: any;
    filteredCustomerNames: any[];
    customerCodes: any[];
    filteredCustomerCode: any[];
    employeeNames: any[];
    filteredEmployeeNames: any[];
    customersOriginalData: any;
    contactInfo: any;
    sourceVendor: any;
    mpnFlag: boolean;
    isDetailedView: boolean;
    selectedRadioButtonValue: boolean;
    moduleName: string;
    worflowId = [];
    selectedWorkFlowId: number;
    isContract = true;
    gridActiveTab: String = 'workFlow';
    subTabWorkFlow: String = '';
    addresses: addressesForm;
    documents: Documents[] = [];
    quote: WorkOrderQuote;
    labor = new WorkOrderLabor();
    freight = [];
    isWorkOrder: boolean = true;
    data: any;
    saveTearDownData: any = [];
    workFlowList: any;
    moduleId: any;
    tearDownReportList = [{
        label: 'Station 2',
        value: 20
    }]
    WorkOrderMPN = { ...new WorkOrderPartNumber() };
    employeeList: any[];
    salesPersonList: any[];
    partNumberList: any;
    technicianList: any[];
    cmmList: any;
    cmmListNew: any;
    savedWorkOrderData: any;
    workFlowWorkOrderData: any;
    workOrderAssetList: any = [];
    workOrderMaterialList: any = [];
    documentsDestructuredData: any = [];
    mpnPartNumbersList: any = [];
    stockLineList: any;
    workOrderWorkFlowOriginalData: any;
    isDisabledSteps: boolean = false;
    workFlowId: any = null;
    editWorkFlowData: any;
    modal: NgbModalRef;
    modalRef: NgbModalRef;
    modalRefCreate: NgbModalRef;
    modalWorkScopeModel:NgbModalRef
    workFlowObject = {
        materialList: [],
        equipments: [],
        charges: [],
        exclusions: []
    }
    materialStatus: any;
    workOrderLaborList: any;
    taskList: any;
    subTabOtherOptions: any = '';
    workOrderChargesList: Object;
    workOrderExclusionsList: Object;
    isEditLabor: boolean = false;
    billing: Billing;
    loginDetailsForCreate: any;
    workOrderPartNumberId: any;
    isEditBilling: boolean = false;
    isWorkOrderMainView: boolean = false;
    mainWorkOrderId: any = 0;
    quoteData: any;
    workOrderQuoteId: any;
    quoteExclusionList: any = [];
    quoteMaterialList: any = [];
    quoteFreightsList: any = [];
    quoteChargesList: any = [];
    quoteLaborList = new WorkOrderLabor();
    workScope: any;
    subTabMainComponent: any = '';
    mpnGridData: any;
    showTabsMPNGrid: boolean = false;
    businessUnitList: any;
    divisionList: any;
    departmentList: any;
    currentWarningMessage: any;
    managementStructure = {
        companyId: null,
        buId: null,
        divisionId: null,
        departmentId: null,
    }
    revisedPartId: any;
    csrList: any;
    customerReferencelist: { label: string; value: number; }[];
    private onDestroy$: Subject<void> = new Subject<void>();
    workOrderFreightList: Object;
    requiredFileds: boolean = true;
    selectedMPN: any;
    worOrderStatus: any;
    workOrderStatusvalue: any;
    workOrderNumberStatus: any;
    disableSaveForEdit: boolean = false;
    statusId: any;
    allValuesSame;
    statusArray = [];
    quoteCreatedDate: any;
    quoteShippedDate: any;
    quoteApprovedDate: any;
    days1: any = 0;
    days2: any = 0;
    isValidScope: boolean = true;
    customerContactInfo: any = [];
    customerContactList: any = [];
    customerPhoneInfo: any = [];
    defaultsettingGeneralInformation: any;
    myCustomerContact: any;
    recCustomerId: any;
    hideWOHeader: boolean = false;
    salesOrderReferenceData: SalesOrderReference;
    masterParterIdForSalesOrderReference: any;
    customerWarningListId: any;
    warningMessage: any;
    restrictMessage: any;
    createQuoteListID: any;
    customerBillingListID: any;
    isCustomerAction: boolean = false;
    isQuoteAction: boolean = false;
    isBillAction: boolean = false;
    restrictID: any;
    warningID: any;
    isQuoteActionTab: boolean = false;
    showQuoteDetails: boolean = false;
    selectedPartNumber: any;
    isEditWorkordershowMsg: any = false;
    enumcall: boolean;
    buildMethodDetails: any;
    selectedCommunicationTab: any = '';
    sourcePoApproval: any = {};
    shipToAddress = {};
    shipViaList = [];
    shipToCusData = [];
    vendorSelected = [];
    companySiteList_Shipping = [];
    managementValidCheck: boolean;
    shipToUserTypeValidCheck: boolean;
    shipToSiteNameValidCheck: boolean;
    shipViaValidCheck: boolean;
    billToUserTypeValidCheck: boolean;
    billToSiteNameValidCheck: boolean;
    enableAddSaveBtn: boolean;
    customerNames: any[];
    allCustomers: any;
    shipToSelectedvalue: any;
    shipToContactData: any = [];
    firstNamesShipTo: any[] = [];
    vendorNames: any[];
    allActions: any[] = [];
    legalEntityList_ForBilling: Object;
    legalEntityList_ForShipping: Object;
    legalEntity: any;
    managementStructureId: any;
    isDeleteMpnPart: boolean = false;
    currentDeletedMpnIndex: any;
    quotestatusofCurrentPart: any;
    isSpinnerVisible: boolean = false;
    subWOPartNoId: any = 0;
    defaultTab = 'materialList';
    isViewForApprovedPart: boolean = false;
    customerId: any;
    arrayCustomerIdList: any[] = [];
    mpnDropdownList: any = [];
    workScopesList: any = [];
    setEditArray: any = [];
    msId: any;
    disableSaveForPart: boolean = true;
    tempMemo: any;
    type: any;
    customerWarningsList: any;
    isbillingNotCreated = false;
    freightsArr: any = [];
    result: any = {};
    equipmentArr: any = [];
    array: any = [];
    currentIndex: any;
    selectedMPNSubWo: any;
    moduleNamee: any;
    disableForMemo: boolean = false;
    wflowitems: any = [];
    showWorkflowLabel: any = 'View WF';
    currentDate = new Date();
    taskName: any;
    isAllowLaberSave: boolean = false;
    constructor(
        private alertService: AlertService,
        private workOrderService: WorkOrderService,
        private employeeService: EmployeeService,
        private commonService: CommonService,
        private authService: AuthService,
        private acRouter: ActivatedRoute,
        private router: Router,
        private workFlowtService: WorkFlowtService,
        private modalService: NgbModal,
        private quoteService: WorkOrderQuoteService,
        private salesOrderReferenceStorage: SalesOrderReferenceStorage,
        public vendorService: VendorService,
        private salesQuoteService: SalesQuoteService,
    ) {
        this.moduleName = 'Work Order';

    }

    ngOnInit() {
        this.wflowitems = [
            {
                label: 'View WF', command: () => {
                    this.showWorkflowLabel = 'View WF';
                    this.subTabWorkFlowChange('viewworkFlow');
                }
            },
            {
                label: 'Edit Existing WF', command: () => {
                    this.showWorkflowLabel = 'editworkFlow';
                    this.subTabWorkFlowChange('editworkFlow');
                }
            }
        ];
        this.moduleId = AppModuleEnum.WorkOrder;
        this.salesOrderReferenceData = this.salesOrderReferenceStorage.salesOrderReferenceData;
        if (this.salesOrderReferenceData) {
            this.woDealerChange(DBkeys.WORK_ORDER_TYPE_INTERNAL_ID)
            this.commonService.getCustomerNameandCode("", this.workOrderGeneralInformation.workOrderTypeId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.customerNamesList = res;
                for (let i = 0; i < this.customerNamesList.length; i++) {
                    if (this.customerNamesList[i].customerId == this.salesOrderReferenceData.customerId) {
                        this.workOrderGeneralInformation.customerId = this.customerNamesList[i];
                        this.selectCustomer(this.customerNamesList[i], this.workOrderGeneralInformation, 'onInIt');
                    }
                }
            },
                err => {
                    this.handleError(err);
                })
        }

        if (this.isEdit == undefined) {
            this.isEdit = false;
        }

        if (this.isEdit == true) {
            this.disableSaveForEdit = true;
            this.isDetailedView = false;
        } else {
            this.disableSaveForEdit = false;
            this.isDetailedView = true;
        }
        this.recCustomerId = this.acRouter.snapshot.params['rcustid'];
        this.getTaskList();
        this.createModeData();
        this.workOrderService.creditTerms = this.creditTerms;
        this.mpnFlag = true;
        this.selectedCustomer = new Customer();
        if (!this.isSubWorkOrder) { // subWorkOrder false
            this.modifyWorkorderdata();
            this.moduleNamee = this.workOrderModule;
        } else {
            this.moduleNamee = this.subWorkOrderModule;
            this.getAllCustomerContact(this.subWorkOrderDetails.customerId, 'edit');
            this.workOrderId = this.workOrderId;
            this.mainWorkOrderId = this.subWorkOrderDetails.workOrderid;
            this.subWorkOrderDetails.subWorkOrderId = this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId;
            this.savedWorkOrderData = {
                workOrderId: this.workOrderId,
                workFlowWorkOrderId: this.workFlowWorkOrderId
            }

        }
        if (!this.isSubWorkOrder) {
            this.workOrderStatus('onload');
        }
        if (!this.isEdit && this.workOrderGeneralInformation) {
            this.workOrderGeneralInformation.partNumbers.forEach(
                x => {
                    if (x.customerRequestDate) {
                        x.estimatedCompletionDate = x.customerRequestDate;
                        x.estimatedShipDate = x.customerRequestDate;
                        x.promisedDate = x.customerRequestDate;
                    }
                    if (x.workOrderScopeId == 0) {
                        x.workOrderScopeId = '';
                    }
                }
            )
        }
        this.workOrderGeneralInformation.workOrderNumber = this.workOrderGeneralInformation.workOrderNumber ? this.workOrderGeneralInformation.workOrderNumber : 'Creating';
        if (this.isEdit == false) {
            this.breadcrumbs = [
                { label: 'Work Order' },
                { label: 'Create Work Order' },
            ];
        } else {
            this.breadcrumbs = [
                { label: 'Work Order' },
                { label: 'Edit Work Order' },
            ];
        }
        setTimeout(() => {
            this.getAllEmployees('');
            // this.getAllWorkScpoes('');
            this.getConditionsList('');
            this.getAllTecStations('');
            this.getAllPriority('');
        }, 1000);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.workOrderStatusList) {
            this.workOrderStatusList = this.workOrderStatusList
        }
        if (changes.subWoMpnGridUpdated) {
            this.subWoMpnGridUpdated = changes.subWoMpnGridUpdated.currentValue;
            if (this.subWoMpnGridUpdated == true) {
                this.dropdownlistSubWoMpn();
            }
        }
        if (changes.workorderSettings) {
            this.workorderSettings = this.workorderSettings;
        }

        if (this.workOrderGeneralInformation && this.workOrderGeneralInformation.creditLimit) {
            this.workOrderGeneralInformation.creditLimit = (this.workOrderGeneralInformation.creditLimit) ? formatNumberAsGlobalSettingsModule(this.workOrderGeneralInformation.creditLimit, 2) : '0.00';
        }
        if (this.isEdit == undefined) {
            this.isEdit = false;
        }
        if (!this.isEdit && this.workOrderGeneralInformation) {
            this.workOrderGeneralInformation.partNumbers.forEach(
                x => {
                    if (x.customerRequestDate) {
                        x.estimatedCompletionDate = x.customerRequestDate;
                        x.estimatedShipDate = x.customerRequestDate;
                        x.promisedDate = x.customerRequestDate;
                    }
                    if (x.workOrderScopeId == 0) {
                        x.workOrderScopeId = '';
                    }
                }
            )
        }
        if (!this.isSubWorkOrder) {
            this.moduleNamee = this.workOrderModule;
        } else {
            this.moduleNamee = this.subWorkOrderModule;
        }
    }

    dropdownlistSubWoMpn() {
        this.workOrderService.getMpnDropdownlistSubWo(this.workOrderId, this.currentUserMasterCompanyId).subscribe(res => {
            this.mpnDropdownList = res.map(x => {
                return {
                    value:
                    {
                        datas: x,
                        partNumber: x.partNumber,
                        subWOPartNoId: x.subWOPartNoId,
                        subWorkOrderScopeId: x.subWorkOrderScopeId,
                        workFlowId: x.workflowId
                    },
                    label: x.partNumber + "-" + x.subWOPartNoId
                }
            });
            if (this.mpnDropdownList && this.mpnDropdownList.length != 0) {

                this.changeofMPNForSubWo(this.mpnDropdownList[0].value);
                this.selectedMPNSubWo = this.mpnDropdownList[0].value;

            }
        },
            err => {
                this.handleError(err);
            })
    }

    changeofMPNForSubWo(data) {
        this.workOrderService.partNumberData = data;
        this.workFlowId = (data.workFlowId != 0 || data.workFlowId != null) ? data.workFlowId : 0;
        this.subWOPartNoId = data.subWOPartNoId;
        this.workOrderPartNumberId = data.subWOPartNoId;
        this.savedWorkOrderData.workFlowId = data.workFlowId;
        this.selectedPartNumber = data.datas;
        if (this.workFlowId != null) {
            this.gridActiveTab = "workFlow";
            this.subTabWorkFlow = "viewworkFlow";
            this.showWorkflowLabel = 'View WF';
            this.subTabWorkFlowChange('viewworkFlow');
        } else {
            this.gridActiveTab = 'materialList';
            this.gridTabChange(this.gridActiveTab)
        }
    }
    expriryarray: any = [];
    modifyWorkorderdata() {
        if (!this.isEdit) { // create new WorkOrder
            this.isEditLabor = true;
            //             if (this.recCustomerId == 0 || this.recCustomerId == undefined || this.recCustomerId == null) {
            //                 // this.getCustomerWarningsList();
            //                 // this.customerWarnings(this.workOrderGeneralInformation.customerDetails.customerId)
            //                 if (this.workOrderGeneralInformation.customerDetails && this.workOrderGeneralInformation.customerDetails.customerId) {
            //                     this.customerWarnings(this.workOrderGeneralInformation.customerDetails.customerId);
            //                 }
            //             }
            this.addMPN();
            this.getAllGridModals();
            this.getEmployeeData();
            this.isRecCustomer = false;
            this.workOrderStatusvalue = "open";
            this.expriryarray = [];
            this.workOrderGeneralInformation.partNumbers.forEach(
                x => {
                    if (x.customerRequestDate) {
                        x.estimatedCompletionDate = (x.customerRequestDate) ? new Date(x.estimatedCompletionDate) : new Date(x.customerRequestDate);
                        x.estimatedShipDate = (x.estimatedShipDate) ? new Date(x.estimatedShipDate) : new Date(x.customerRequestDate);
                        x.promisedDate = (x.promisedDate) ? new Date(x.promisedDate) : new Date(x.customerRequestDate);
                    }
                    if (x.workOrderScopeId == 0) {
                        x.workOrderScopeId = '';
                    }

                }
            )
        } else { // edit WorkOrder
            if (this.recCustomerId != 0 || this.recCustomerId != undefined || this.recCustomerId != null) {
                // this.getCustomerWarningsList();
                if (this.workOrderGeneralInformation && this.workOrderGeneralInformation.customerDetails) {
                    this.customerWarnings(this.workOrderGeneralInformation.customerDetails.customerId)
                }
            }
            //for tat calculation get data
            this.isEditWorkordershowMsg = true;
            // if (this.isView == false && (this.recCustomerId == 0 || this.recCustomerId == undefined || this.recCustomerId == null)) {
            //     this.customerWarnings(this.workOrderGeneralInformation.customerDetails.customerId)
            // }
            this.getWorkOrderDatesFoRTat();
            // check this in differnt scenarios
            if (this.recCustomerId == 0 || this.recCustomerId == undefined || this.recCustomerId == null) {
                this.getWorkOrderQuoteDetail(this.workOrderGeneralInformation.workOrderId, this.workOrderGeneralInformation.workFlowWorkOrderId);
            }
            const data = this.workOrderGeneralInformation;
            // if(!this.isSubWorkOrder){
            this.getAllCustomerContact(this.workOrderGeneralInformation.customerDetails.customerId, 'edit');
            // }
            this.workOrderId = data.workOrderId;
            if (this.workOrderGeneralInformation.partNumbers[0].workflowId == null) {
                // if(this.workOrderGeneralInformation.isSinglePN){
                this.workFlowWorkOrderId = this.workOrderGeneralInformation.partNumbers[0].workFlowWorkOrderId;
                // }
                // this.gridTabChange('materialList');
            }
            if (this.workOrderGeneralInformation.isSinglePN == true) {
                this.workOrderService.partNumberData = this.workOrderGeneralInformation.partNumbers[0];
            }
            this.gridActiveTab = 'materialList'
            this.gridTabChange('materialList');
            this.isRecCustomer = data.isRecCustomer;
            this.workOrderGeneralInformation = {
                ...data,
                workOrderTypeId: String(data.workOrderTypeId),
                customerId: data.customerDetails,
                customerPhoneNo: data.customerPhoneNo != null ? data.customerPhoneNo : data.customerDetails.customerPhone,
                partNumbers: data.partNumbers.map((x, index) => {
                    x.masterPartId= x.woPart,
                    // x.technicianName='Suresh-33 Reddy';
                    this.getAllWorkScpoes('',x,index);
                    this.getStockLineByItemMasterId(x.masterPartId, x.conditionId, index);
                    this.calculatePartTat(x);
                    this.getPartPublicationByItemMasterId(x, x.masterPartId, index);
                  setTimeout(() => {
                    this.getWorkFlowByPNandScope(null, x, 'onload', index);
                  },600);
                    if (this.workorderSettings) {
                        x.workOrderStageId = x.workOrderStageId ? x.workOrderStageId : this.workorderSettings.defaultStageCodeId;
                        x.workOrderPriorityId = x.workOrderPriorityId ? x.workOrderPriorityId : this.workorderSettings.defaultPriorityId;
                        x.workOrderStatusId = x.workOrderStatusId ? x.workOrderStatusId : this.workorderSettings.defaultStatusId;
                    }
                    x.workOrderStageId = x.workOrderStageId ? x.workOrderStageId : 0;
                    x.workOrderPriorityId = x.workOrderPriorityId ? x.workOrderPriorityId : 0;
                   
                    return {
                        ...x,

                        partTechnicianId: { name: x.technicianName, employeeId: x.technicianId },
                        // partTechnicianId: getObjectById('employeeId', x.technicianId, this.technicianByExpertiseTypeList),
                        mappingItemMasterId: getObjectById('mappingItemMasterId', x.mappingItemMasterId, x.revisedParts),
                        masterPartId: x.woPart,
                        customerRequestDate: x.customerRequestDate ? new Date(x.customerRequestDate) : null,
                        receivedDate: x.receivedDate ? new Date(x.receivedDate) : new Date(this.currentDate),
                        estimatedCompletionDate: (x.estimatedCompletionDate) ? new Date(x.estimatedCompletionDate) : new Date(x.customerRequestDate),
                        estimatedShipDate: (x.estimatedShipDate) ? new Date(x.estimatedShipDate) : new Date(x.customerRequestDate),
                        promisedDate: (x.promisedDate) ? new Date(x.promisedDate) : new Date(x.customerRequestDate),
                    }
                })
            }
            if (this.workOrderGeneralInformation && this.workOrderGeneralInformation.creditLimit) {
                this.workOrderGeneralInformation.creditLimit = (this.workOrderGeneralInformation.creditLimit) ? formatNumberAsGlobalSettingsModule(this.workOrderGeneralInformation.creditLimit, 2) : '0.00';
            }

            this.workFlowWorkOrderId = data.workFlowWorkOrderId;
            if (data.isSinglePN) {
                this.workFlowId = data.partNumbers[0].workflowId;
                this.workOrderPartNumberId = data.partNumbers[0].id;
                this.workScope = data.partNumbers[0].workScope;
                this.showTabsGrid = true;
                this.showGridMenu = true;
                if (this.workFlowId != null) {
                    this.showWorkflowLabel = 'View WF';
                    this.subTabWorkFlowChange('viewworkFlow')
                }
            } else {
                this.showTabsGrid = true;
                this.showTabsMPNGrid = true;
            }
            this.savedWorkOrderData = this.workOrderGeneralInformation;
            this.getWorkOrderWorkFlowNos();
            if (this.isRecCustomer)
                this.showTabsGrid = false;
            this.getEmployeeData();
        }

if(this.router.url.includes('workordersmodule/workorderspages/app-work-order-receivingcustworkid')){
    this.triggherWorkScopeData(this.workOrderGeneralInformation.partNumbers[0],0);
}else{
    this.showWaringForPublication();
}
        this.showWaringForWorkflow();
    }
    removePublication(currentRecord, index) {
        setTimeout(() => {
            // currentRecord.cMMId=0;
            this.disableSaveForPart = false;
        }, 2000);
    }

    removeWorkflow(currentRecord, index) {
        setTimeout(() => {
            // currentRecord.workflowId=0;
            this.disableSaveForPart = false;
        }, 2000);
    }

    getEmployeeData() {
        this.workOrderGeneralInformation.woEmployee = this.authService.currentEmployee.name;
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }

    checkworkscope() {
        var result = false;
        if (this.workOrderGeneralInformation && this.workOrderGeneralInformation.partNumbers) {
            this.workOrderGeneralInformation.partNumbers.forEach(
                x => {
                    if (x.workOrderScopeId == 0) {
                        result = true;
                    }
                }
            )
        }
        return result;
    }

    checkTechnician() {
        var result = false;
        if (this.workOrderGeneralInformation && this.workOrderGeneralInformation.partNumbers) {
            this.workOrderGeneralInformation.partNumbers.forEach(
                x => {
                    if (x.partTechnicianId == 0 || (typeof x.partTechnicianId == 'object' && x.partTechnicianId.employeeId == null)) {
                        result = true;
                    }
                    if (x.workOrderStageId == 0 || x.workOrderStageId == null) {
                        result = true;
                    }
                    if (x.workOrderPriorityId == 0 || x.workOrderPriorityId == null) {
                        result = true;
                    }
                }
            )
        }
        return result;
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
    }

    createModeData() {
        this.loginDetailsForCreate = {
            masterCompanyId: this.authService.currentUser.masterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
            createdDate: new Date(),
            updatedDate: new Date(),
            isActive: true,
            isDeleted: false
        }
    }

    // create all Forms in the Grid
    getAllGridModals() {
        this.gridActiveTab = 'workFlow';
        this.addresses = new addressesForm();
        this.documents = [new Documents()];
        this.quote = new WorkOrderQuote();
        this.labor = new WorkOrderLabor();
        this.billing = new Billing();

        // adding Form Object Dynamically
        // this.generateLaborForm();
    }

    filterCustomerName(event) {
        const value = event.query.toLowerCase()
        if (this.arrayCustomerIdList.length == 0) {
            this.arrayCustomerIdList.push(0);
        }
        if (this.isRecCustomer) {
            this.commonService.getReceivingCustomers(value, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.customerNamesList = res;
            },
                err => {
                    // this.isSpinnerVisible = false;
                    this.handleError(err);
                })
        }
        else {
            this.commonService.autoCompleteSmartDropDownCustomerList(this.workOrderGeneralInformation.workOrderTypeId, value, true, 20, this.arrayCustomerIdList.join(), this.currentUserMasterCompanyId).subscribe(res => {
                const responseData = res;
                this.isSpinnerVisible = false;
                this.customerNamesList = res;
            })
        }
    }

    selectedCustomerType() {
        this.clearautoCompleteInput(this.workOrderGeneralInformation, 'customerId');
    }

    selectCustomer(object, currentRecord, type) {
        this.isCustomerAction = true;
        this.isBillAction = false;
        this.isQuoteAction = false;
        this.isEditWorkordershowMsg = false;
        this.isQuoteActionTab == false;
        this.showQuoteDetails = false;
        if (this.isView == false && type == 'formHtml') {
            this.customerWarnings(object.customerId);
        }
        currentRecord.creditLimit = object.creditLimit ? formatNumberAsGlobalSettingsModule(object.creditLimit, 2) : '0.00';
        currentRecord.creditTermsId = object.creditTermsId;
        currentRecord.creditTerms = object.creditTerms;
        this.myCustomerContact = object.customerContact;
        currentRecord.customerPhoneNo = object.customerPhoneNo;
        currentRecord.csrId = object.csrId;
        currentRecord.salesPersonId = object.salesPersonId;
        currentRecord.csr = object.csrId ? { 'employeeId': object.csrId, 'name': object.csrName } : "";
        currentRecord.salesPerson = object.salesPersonId ? { 'employeeId': object.salesPersonId, 'name': object.salesPerson } : "";
        // currentRecord.csr = getObjectById('employeeId', object.csrId, this.csrOriginalList);
        // currentRecord.salesPerson = getObjectById('employeeId', object.salesPersonId, this.salesAgentsOriginalList);

        if (this.workOrderGeneralInformation) {
            this.workOrderGeneralInformation.partNumbers.forEach(
                x => {

                    x.masterPartId = undefined;
                    x.description = '';
                    x.revisedPartNo = '';

                    x.description = '';
                    x.revisedPartNo = '';

                    x.serialNumber = '';
                    x.quantity = 1;
                    x.tatDaysStandard = 0;
                    x.tatDaysCurrent = 0;
                    x.nte = 0;

                    x.stockLineNumber = '';
                    x.contractNo = '';

                    x.customerReference = '';
                    x.itemGroup = '';

                    x.receivedDate = undefined;
                    x.customerRequestDate = new Date();
                    x.promisedDate = new Date();
                    x.estimatedCompletionDate = new Date();
                    x.estimatedShipDate = new Date();
                    x.workOrderStageId = 0;
                    x.workOrderStatusId
                    x.partTechnicianId = undefined;
                    x.techStationId = 0;
                    x.workOrderScopeId = 0;
                    x.workOrderPriorityId = 0;
                    x.conditionId = 0;
                    x.cMMId = 0;
                    x.workflowId = 0;
                    x.level1 = '';
                    x.level2 = '';
                    x.level3 = '';
                    x.level4 = '';
                    x.isDER = false;
                    x.isPMA = false;


                }
            )
        }

        var index = 0;
        this['cmmPublicationList' + index] = [];
        this['dynamicWorkflowList' + index] = [];
        // this['cmmPublicationList']=[];

        if (this.workOrderGeneralInformation.workOrderTypeId == 1) // Customer
        {
            this.getPartNosByCustomer(object.customerId, 0);
        }
        else
            this.getPartNosByCustomer(object.customerId, 0);
        this.getAllCustomerContact(object.customerId, 'select');
    }
    // this.getMultiplePartsNumbers();
    selectEmployee(data, currentRecord) {
    }

    viewCustomerDetails(customerId) {
        this.modal = this.modalService.open(CustomerViewComponent, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.componentInstance.customerId = customerId;
    }


    getMaterialListHandle() {
        this.gridActiveTab == '';
        this.gridActiveTab == 'materialList';
        if (this.isSubWorkOrder == true) {
            this.getMaterialListByWorkOrderIdForSubWO();
        } else {
            // this.getMaterialListByWorkOrderId();
            //new one
            this.getNewMaterialListByWorkOrderId();
        }
    }

    resetSelectedTab() {
        this.gridActiveTab = '';
    }

    // Change of Table Grid
    gridTabChange(value) {
        this.defaultTab = '';
        setTimeout(() => {
            this.defaultTab = 'materialList';
        }, 0)
        this.gridActiveTab = '';
        setTimeout(() => {
            this.gridActiveTab = value;
        }, 0)
        this.subTabWorkFlow = '';
        this.subTabOtherOptions = '';
        this.subTabMainComponent = '';
        if (value != 'communication') {
            this.selectedCommunicationTab = '';
        }
        if (value == 'materialList') {
            if (this.isSubWorkOrder == true) {
                this.getMaterialListByWorkOrderIdForSubWO();
            } else {
                // this.getMaterialListByWorkOrderId();
                // new one
                this.getNewMaterialListByWorkOrderId();
            }
        }
        if (value === 'labor') {
            this.getWorkFlowLaborList();
        }
        if (value === 'equipment') {
            // this.getEquipmentByWorkOrderId();
        }
        if (value !== 'billorInvoice') {
            this.billing = undefined;
        }
        if (value == 'billorInvoice') {
            this.isBillAction = true;
            this.isQuoteAction = false;
            this.isCustomerAction = false;
            this.showQuoteDetails = false;
            this.isEditWorkordershowMsg = false;
            this.billingCreateOrEdit();
            const { customerId } = this.workOrderGeneralInformation.customerId;
        }
        if (value == 'pickticket') {
            this.isSpinnerVisible = true;
            this.workOrderService.getPickTicketListMainPart(this.workOrderId, this.workFlowWorkOrderId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                const data = res;
                this.managementStructureId = res.managementStructureId;
            },
                err => {
                    this.isSpinnerVisible = false;
                });
        }
        if (value == 'shipping') {
            this.isSpinnerVisible = true;
            this.workOrderService.viewWorkOrderHeader(this.workOrderId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                const data = res;
                this.managementStructureId = res.managementStructureId;
            },
                err => {
                    this.handleError(err);
                    // this.isSpinnerVisible = false;
                });
        }
        if (value == 'quote') {
            this.onClickQuoteTab();
            this.isBillAction = false;
            this.isQuoteAction = false;
            this.isCustomerAction = false;
            this.isEditWorkordershowMsg = false;
            const { customerId } = this.workOrderGeneralInformation.customerId;
            if (this.isView == false) {
                this.customerWarnings(customerId);
            }
        }
        if (value == 'workOrderMain') {
            this.isWorkOrderMainView = true;
            if (this.isSubWorkOrder == true) {
                this.mainWorkOrderId = this.subWorkOrderDetails.workOrderId;
            }
        }
        if (value == 'tearDown') {
            if (this.isView == false) {
                this.callTearDownAPi();
            }
        }
        let a = document.getElementsByClassName('card-body')[1];
        if (a) {
            a.scrollIntoView();
        }
    }

    callTearDownAPi() {
        if (this.isSubWorkOrder == true) {
            this.workFlowWorkOrderId = this.subWOPartNoId;
        }
        if (this.workFlowWorkOrderId > 0) {
            this.isSpinnerVisible = true;
            this.workOrderService.getworkOrderTearDownData(this.workFlowWorkOrderId, this.isSubWorkOrder, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.saveTearDownData = res;
            },
                err => {
                    this.handleError(err);
                    // this.isSpinnerVisible = false;
                });
        }
    }

    toggleDisplayMode(): void {
        this.isDetailedView = !this.isDetailedView;
    }

    // Handles type of the WorkOrder Dealer
    woDealerChange(value) {
        this.workOrderGeneralInformation.workOrderTypeId = value;
        this.getLatestDefaultSettingByWorkOrderTypeId.emit(value);
    }
    SingleMpnValid() {
        this.workOrderGeneralInformation.partNumbers = [];
        const workOrderSettingsAdded = new WorkOrderPartNumber();
        this.workOrderGeneralInformation.partNumbers.push(workOrderSettingsAdded);
        this.array = [];

        var index = 0;
        this['cmmPublicationList' + index] = [];
        this['dynamicWorkflowList' + index] = [];
    }
    // added new MPN
    addMPN() {

        if (!this.workOrderGeneralInformation.isSinglePN && this.workorderSettings) {
            const workOrderSettingsAdded = new WorkOrderPartNumber();
            workOrderSettingsAdded.workOrderStageId = this.workorderSettings.defaultStageCodeId;
            workOrderSettingsAdded.workOrderPriorityId = this.workorderSettings.defaultPriorityId;
            this.workOrderGeneralInformation.partNumbers.push(workOrderSettingsAdded);
        } else {
            const workOrderSettingsAdded = new WorkOrderPartNumber();
            if (this.salesOrderReferenceData) {
                workOrderSettingsAdded.masterPartId = {
                    itemMasterId: this.salesOrderReferenceData.itemMasterId,
                    partNumber: this.salesOrderReferenceData.partNumber,
                    managementStructureId: this.salesOrderReferenceData.managementStructureId,
                    description: this.salesOrderReferenceData.partDescription
                };
                workOrderSettingsAdded.quantity = this.salesOrderReferenceData.quantity;
            }
            this.workOrderGeneralInformation.partNumbers.push(workOrderSettingsAdded);
            if (this.salesOrderReferenceData) {
                this.onSelectedPartNumber(workOrderSettingsAdded.masterPartId, this.workOrderGeneralInformation.partNumbers[0], 0, 'onload')
            }
        }
    }

    // subtab in grid change
    subTabWorkFlowChange(value) {
        this.subTabWorkFlow = value;
        if (value === 'editworkFlow') {
            this.editWorkFlowData = undefined;
            // this.isSpinnerVisible = true; 
            this.workFlowtService.currentWorkFlowId = this.workFlowId;
            this.workFlowtService.enableUpdateMode = true;
            // this.workFlowtService.getWorkFlowDataByIdForEdit(this.workFlowId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            //     this.isSpinnerVisible = false;
            //     this.workFlowtService.listCollection = res[0];
            //     this.workFlowtService.enableUpdateMode = true;
            //     this.workFlowtService.currentWorkFlowId = res[0].workflowId;
            //     this.editWorkFlowData = res;
            // },
            //     err => {
            //         this.handleError(err);
            //     })
        }
        this.gridActiveTab = '';
        this.subTabOtherOptions = '';
        this.subTabMainComponent = '';
    }

    openDelete(content, index) {
        this.currentIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    dismissModel() {
        this.modal.close();
    }

    deleteMPN() {
        if (this.showTabsGrid == true && this.workOrderGeneralInformation.partNumbers[this.currentIndex].workOrderId != 0) {
            this.isDeleteMpnPart = true;
            const data = {
                workOrderId: this.workOrderGeneralInformation.partNumbers[this.currentIndex].workOrderId,
                workOrderPartNoId: this.workOrderGeneralInformation.partNumbers[this.currentIndex].id,
                workFlowWorkOrderId: this.workOrderGeneralInformation.partNumbers[this.currentIndex].workFlowWorkOrderId ? this.workOrderGeneralInformation.partNumbers[this.currentIndex].workFlowWorkOrderId : 0,
                receivingCustomerWorkId: this.workOrderGeneralInformation.partNumbers[this.currentIndex].receivingCustomerWorkId ? this.workOrderGeneralInformation.partNumbers[this.currentIndex].receivingCustomerWorkId : 0,
                stockLineId: this.workOrderGeneralInformation.partNumbers[this.currentIndex].stockLineId ? this.workOrderGeneralInformation.partNumbers[this.currentIndex].stockLineId : 0,
                updatedBy: this.userName
            }
            this.workOrderService.deleteMpnByWorkOrderId(data).subscribe(res => {
                this.currentDeletedMpnIndex = this.currentIndex;
                this.workOrderGeneralInformation.partNumbers.splice(this.currentIndex, 1);
                this.alertService.showMessage(
                    this.moduleName,
                    'Deleted Succesfully',
                    MessageSeverity.success
                );
                this.getWorkOrderWorkFlowNos();
            },
                err => {
                    this.handleError(err);
                })
        } else {
            this.workOrderGeneralInformation.partNumbers.splice(this.currentIndex, 1);
        }
        this.modal.close();
    }

    workOrderStatus(from) {
        this.allValuesSame = this.workOrderGeneralInformation.partNumbers.every((val, i, arr) => val.workOrderStatusId === arr[0].workOrderStatusId);
        if (this.allValuesSame) {
            this.statusId = this.workOrderGeneralInformation.partNumbers[0].workOrderStatusId;
            this.workOrderGeneralInformation.workOrderStatusId = this.statusId;
        } else {
            this.statusId = 1;
            this.workOrderGeneralInformation.workOrderStatusId = this.statusId;
        }
        setTimeout(() => {
            if (this.workOrderStatusList && this.workOrderStatusList.length > 0) {
                this.workOrderStatusList.forEach(element => {
                    if (element.value == this.statusId) {
                        this.workOrderNumberStatus = element.label;
                        this.workOrderGeneralInformation.workOrderStatusId = this.statusId;
                    }
                });
            } else {
                this.workOrderNumberStatus = 'Open';
                this.workOrderGeneralInformation.workOrderStatusId = 1;
            }
            if (from == 'onload') {
                if (this.workOrderNumberStatus == 'Closed') {
                    this.isView = true;
                }
            }
        }, 1000);
    }
    dismissModelTask() {
        $('#confirmationSave').modal('hide');
    }

    validationForMpnParts(): any {



        // partTechnicianId:{name:x.technicianName,employeeId:x.technicianId},
        // // partTechnicianId: getObjectById('employeeId', x.technicianId, this.technicianByExpertiseTypeList),
        // mappingItemMasterId: getObjectById('mappingItemMasterId', x.mappingItemMasterId, x.revisedParts),
        // masterPartId: x.woPart,
        // customerRequestDate: x.customerRequestDate ? new Date(x.customerRequestDate) : null,
        // receivedDate: x.receivedDate ? new Date(x.receivedDate) : null,
        // estimatedCompletionDate: (x.estimatedCompletionDate) ? new Date(x.estimatedCompletionDate) : new Date(x.customerRequestDate),
        // estimatedShipDate: (x.estimatedShipDate) ? new Date(x.estimatedShipDate) : new Date(x.customerRequestDate),
        // promisedDate: (x.promisedDate) ? new Date(x.promisedDate) : new Date(x.customerRequestDate),
        // x.workOrderStageId =x.workOrderStageId?x.workOrderStageId : this.workorderSettings.defaultStageCodeId;
        // x.workOrderPriorityId = x.workOrderPriorityId? x.workOrderPriorityId:this.workorderSettings.defaultPriorityId;


    }


    clearautoCompleteInput(currentRecord, field) {
        // currentRecord[field] = null;
    }
    clearautoCompleteTechinician(currentRecord, field) {
        currentRecord[field] = null;
        currentRecord.partTechnicianId = 0;
    }
    clearautoCompletePartNum(currentRecord, field) {
        // currentRecord[field] = null;
        currentRecord.itemMasterId = undefined;
        currentRecord.description = "";
        currentRecord.revisedPartNo = "";
        currentRecord.serialNumber = "";
        currentRecord.receivedDate = undefined;
        currentRecord.customerRequestDate = undefined;
        currentRecord.promisedDate = new Date();
        currentRecord.estimatedShipDate = undefined;

        currentRecord.estimatedCompletionDate = new Date();
        currentRecord.workOrderStageId = 0;
        currentRecord.workOrderStatusId = 0;
        currentRecord.partTechnicianId = 0;
        currentRecord.techStationId = 0;


        currentRecord.workOrderScopeId = 0;
        currentRecord.workOrderPriorityId = 0;
        currentRecord.conditionId = 0;
        currentRecord.cMMId = 0;
        currentRecord.workflowId = 0;

        currentRecord.itemGroup = "";
        currentRecord.isMPNContract = false;
        currentRecord.contractNo = "";
        currentRecord.stockLineNumber = "";
        currentRecord.nte = "";

        currentRecord.isPMA = false;
        currentRecord.isDER = false;
        currentRecord.tatDaysCurrent = 0;
        currentRecord.tatDaysStandard = 0;
    }
    isValidationfailed: boolean = false;
    dismissCmm(){
        // $('#confirmCMMInfo').modal('hide');
        this.modalRef.close();
        this.router.navigate([`workordersmodule/workorderspages/app-work-order-list`]);
    }
    dismissCmmClose(){
        // $('#confirmCMMInfo').modal('hide');
        this.modalRef.close();
    }
    dismissCreateCMM(){
        this.modalRefCreate.close();
        this.router.navigate([`workordersmodule/workorderspages/app-work-order-list`]);
    }
    dismissCreatepub(){
        this.modalRefCreate.close(); 
    }
    allowtoSaveWO(){
        this.triggerSaveApi();
    }
    newWorkOrder:any={};
    saveWorkOrder(): void {
        this.mpnPartNumbersList = [];
        // const generalInfo = this.workOrderGeneralInformation;
        if (this.workOrderGeneralInformation.creditLimit <= 0) {
            $('#confirmationSave').modal('show');
            return
        }
        this.isValidationfailed = false;

        const generalInfo = this.workOrderGeneralInformation;
        this.workOrderGeneralInformation.partNumbers.map(x => {
    
            if (!x.workOrderStageId || x.workOrderStage == 0) {
                this.alertService.showMessage('Work Order', 'Stage is required', MessageSeverity.error);
                this.isValidationfailed = true;
    
            }
            if (!x.workOrderPriorityId || x.workOrderPriorityId == 0) {
                this.alertService.showMessage('Work Order', 'Priority is required', MessageSeverity.error);
                this.isValidationfailed = true;
            }
            if (!x.estimatedShipDate || x.estimatedShipDate == undefined) {
                this.alertService.showMessage('Work Order', 'Est. Ship Date is required', MessageSeverity.error);
                this.isValidationfailed = true;
            }
            if (!x.estimatedCompletionDate || x.estimatedCompletionDate == undefined) {
                this.alertService.showMessage('Work Order', 'Est. Comp Date is required', MessageSeverity.error);
                this.isValidationfailed = true;
            }
            if (!x.promisedDate || x.promisedDate == undefined) {
                this.alertService.showMessage('Work Order', 'Promised Date is required', MessageSeverity.error);
                this.isValidationfailed = true;
            }
            if (!x.receivedDate || x.receivedDate == undefined) {
                this.alertService.showMessage('Work Order', '  Recd  Date is required', MessageSeverity.error);
                this.isValidationfailed = true;
            }
            if (!x.customerRequestDate || x.customerRequestDate == undefined) {
                this.alertService.showMessage('Work Order', 'Cust Req Date is required', MessageSeverity.error);
                this.isValidationfailed = true;
            }
            if (!x.conditionId || x.conditionId == undefined) {
                this.alertService.showMessage('Work Order', 'Condition is required', MessageSeverity.error);
                this.isValidationfailed = true;
            }
            if (!x.workOrderScopeId || x.workOrderScopeId == undefined) {
                this.alertService.showMessage('Work Order', 'Work Scope is required', MessageSeverity.error);
                this.isValidationfailed = true;
            }
            if (!x.partTechnicianId.employeeId || x.partTechnicianId.employeeId == null) {
                this.alertService.showMessage('Work Order', 'Tech Name is required', MessageSeverity.error);
                this.isValidationfailed = true;
            }
            if (!x.masterPartId.itemMasterId || x.masterPartId.itemMasterId == undefined || x.masterPartId.itemMasterId == null) {
                this.alertService.showMessage('Work Order', 'MPN is required', MessageSeverity.error);
                this.isValidationfailed = true;
            }
        })
        if (this.isValidationfailed == false) {
            this.newWorkOrder = {}
            this.newWorkOrder = {
                ...generalInfo,
                customerId: editValueAssignByCondition('customerId', generalInfo.customerId),
                woEmployee: { employeeId: this.authService.currentEmployee.employeeId, Name: this.userName },
                employeeId: this.authService.currentEmployee.employeeId,
                salesPersonId: generalInfo.salesPerson ? generalInfo.salesPerson.employeeId : generalInfo.salesPersonId,
                csrId: generalInfo.csr ? generalInfo.csr.employeeId : generalInfo.csrId,
                customerContact: getValueFromObjectByKey('contactName', this.myCustomerContact),
                masterCompanyId: this.authService.currentUser.masterCompanyId,
                customerContactId: getValueFromObjectByKey('customerContactId', this.myCustomerContact),
                createdBy: generalInfo.createdBy ? generalInfo.createdBy : this.userName,
                updatedBy: this.userName,
                revisedPartId: this.revisedPartId == 0 ? null : this.revisedPartId,
    
                partNumbers: generalInfo.partNumbers.map(x => {
                    return {
                        ...x,
                        masterPartId: editValueAssignByCondition('itemMasterId', x.masterPartId),
                        itemMasterId: editValueAssignByCondition('itemMasterId', x.masterPartId),
                        workOrderStageId: editValueAssignByCondition('workOrderStageId', x.workOrderStageId),
                        mappingItemMasterId: editValueAssignByCondition('mappingItemMasterId', x.mappingItemMasterId),
                        technicianId: editValueAssignByCondition('employeeId', x.partTechnicianId),
                        createdBy: generalInfo.createdBy ? generalInfo.createdBy : this.userName,
                        updatedBy: this.userName,
                        workOrderId: this.workOrderGeneralInformation.workOrderId ? this.workOrderGeneralInformation.workOrderId : 0,
                        cMMId: x.cMMId == 0 || x.cMMId == undefined ? null : x.cMMId,
                        masterCompanyId: this.currentUserMasterCompanyId,
                        workflowId: x.workflowId == 0 || x.workflowId == undefined ? null : x.workflowId,
                        revisedPartId: this.workOrderGeneralInformation.revisedPartId ? this.workOrderGeneralInformation.revisedPartId : null,
                    }
                })
            };
    
            if (this.isEdit && this.isRecCustomer === false) {
                this.isSpinnerVisible = true;
                // if(this.workOrderNumberStatus=='Closed'){
                //     data1.workOrderStatusId=this.statusId
                // }
                this.workOrderService.updateNewWorkOrder(this.newWorkOrder).pipe(takeUntil(this.onDestroy$)).subscribe(
                    result => {
                        this.isValidationfailed = false
                        this.isSpinnerVisible = false;
                        this.disableSaveForEdit = true;
                        this.disableSaveForPart = true;
                        // this.workOrderStatus();
                        if (this.workOrderNumberStatus == 'Closed') {
                            this.isView = true;
                        }
                        this.saveWorkOrderGridLogic(result);
                        this.alertService.showMessage(
                            this.moduleName,
                            'Work Order Updated Succesfully',
                            MessageSeverity.success
                        );
                    },
                    err => {
                        this.handleError(err);
                    }
                );
            } else {
                const newData=[...  this.newWorkOrder.partNumbers];
                const arrayWithFilterObjects= newData.filter((x) => x.cMMId ===null);
                this.workOrderGeneralInformation.partNumbers.map((x, index) => {
                    if (x.publicatonExpirationDate) {
                        if ((new Date(x.publicatonExpirationDate)) < (new Date())) {
                            this.isPublicationExpired=true;
                            this.publicationNos.push(x.publicationNo);
                            // $('#warningForCmmPublication').modal('show');
                        }
                    }
                });
                if((arrayWithFilterObjects && arrayWithFilterObjects.length !=0)){
                    // $('#confirmCMMInfo').modal('show');
                    var modelName=this.confirmCMMInfo;
                    this.modalRef = this.modalService.open(modelName, { size: 'sm' });
                }else if(this.isPublicationExpired==true){
                    // console.log("this.publicationNos",this.publicationNos)
                    var modelName=this.confirmCMMInfoCreate;
                    this.modalRefCreate = this.modalService.open(modelName, { size: 'sm' });
                }else{
                    this.triggerSaveApi();
                }
            }
        }
    }
    publicationNos:any=[];
triggerSaveApi(){
    this.isSpinnerVisible = true;
    this.workOrderService.createNewWorkOrder(this.newWorkOrder).pipe(takeUntil(this.onDestroy$)).subscribe(
        result => {
            this.isValidationfailed = false
            this.isSpinnerVisible = false;
            this.isEdit = true;
            this.disableSaveForPart = true;
            this.router.navigate([`workordersmodule/workorderspages/app-work-order-edit/${result.workOrderId}`]);
            this.saveWorkOrderGridLogic(result)
            if (window.location.href.includes('app-work-order-receivingcustworkid')) {
                window.history.replaceState({}, '', `/workordersmodule/workorderspages/app-work-order-edit/${result.workOrderId}`);
            }
            this.alertService.showMessage(
                this.moduleName,
                'Work Order Added Succesfully',
                MessageSeverity.success
            );
        },
        err => {
            this.handleError(err);
        }
    );
}


    createQuote() {
        this.isQuoteAction = true;
        this.isBillAction = false;
        this.isCustomerAction = false;
        this.isQuoteActionTab == false;
        this.showQuoteDetails = false;
        this.isEditWorkordershowMsg = false;
        const { customerId } = this.workOrderGeneralInformation.customerId;
        if (!this.workOrderQuoteId) {
            this.customerWarnings(customerId)
        } else {
            // window.open(` /workordersmodule/workorderspages/app-work-order-quote?workorderid=${this.workOrderId}`);

            this.router.navigateByUrl(
                `workordersmodule/workorderspages/app-work-order-quote?workorderid=${this.workOrderId}`
            );

        }
    }

    saveWorkOrderGridLogic(result) {
        this.savedWorkOrderData = result;
        this.getWorkFlowData();
        this.workOrderId = result.workOrderId;
        this.workOrderGeneralInformation.workOrderNumber = result.workOrderNum;
        if (this.workFlowWorkOrderId !== 0) {
            this.isDisabledSteps = true;
        }
        this.getWorkOrderWorkFlowNos();
        if (this.workOrderGeneralInformation.isSinglePN == true) {
            this.showTabsGrid = true;  // Show Grid Boolean
            this.workOrderPartNumberId = result.partNumbers[0].id;
            this.workFlowId = result.partNumbers[0].workflowId;


            this.workFlowWorkOrderId = result.workFlowWorkOrderId;
            this.workScope = result.partNumbers[0].workScope;
            this.showGridMenu = true;

            this.getWorkFlowTabsData();
            if (this.workFlowId != null) {
                this.isWorkOrder = true;
                this.showWorkflowLabel = 'View WF';
                this.subTabWorkFlowChange('viewworkFlow');
            }
        } else {
            this.showTabsGrid = true;  // Show Grid Boolean
            this.showTabsMPNGrid = true;
        }
    }

    checkPartExist(val, type, index) {
        if (type == true) {
            this.workOrderGeneralInformation.partNumbers.forEach(element => {
                this.array.push(element.masterPartId.itemMasterId)
            });
        } else {
            if (this.array && this.array.length == 0) {
                this.array.push(val.itemMasterId);
                return;
            } else {
                if (this.array && this.array.length > 0 && this.array.includes(val.itemMasterId)) {
                    const workOrderSettingsAdded1 = new WorkOrderPartNumber();
                    workOrderSettingsAdded1.workOrderStageId = this.workorderSettings.defaultStageCodeId;
                    workOrderSettingsAdded1.workOrderPriorityId = this.workorderSettings.defaultPriorityId;
                    this.workOrderGeneralInformation.partNumbers[index] = workOrderSettingsAdded1;
                } else {
                    this.array.push(val.itemMasterId);
                }
            }
        }
    }

    onSelectedPartNumber(object, currentRecord, index, from) {
        if (from == 'html') {
            currentRecord.masterCompanyId=this.currentUserMasterCompanyId;
            currentRecord.workOrderScopeId = object.workOderScopeId;
            if (this.workorderSettings) {
                currentRecord.conditionId = (this.workorderSettings.defaultConditionId != 0 && this.workorderSettings.defaultConditionId != null) ? this.workorderSettings.defaultConditionId : object.conditionId;
                this.triggherWorkScopeData(currentRecord,index);
            }
            this.getAllWorkScpoes('',currentRecord,index);
        }
        currentRecord.workOrderScopeId = currentRecord.workOrderScopeId ? currentRecord.workOrderScopeId : object.workOderScopeId;
        if (!this.workOrderGeneralInformation.isSinglePN) {
            this.checkPartExist(object, this.isEdit, index)
        }
        if (!this.isEdit) {
            currentRecord.promisedDate = new Date();
            currentRecord.estimatedCompletionDate = new Date();
            currentRecord.estimatedShipDate = new Date();
            currentRecord.isMPNContract = false;
            currentRecord.technicianId = 0;
            if (this.workorderSettings) {
                currentRecord.workOrderStageId = this.workorderSettings.defaultStageCodeId;
                currentRecord.workOrderPriorityId = this.workorderSettings.defaultPriorityId;
            }
            currentRecord.techStationId = 0;
            currentRecord.partTechnicianId = 0;
        }
        if (!this.workOrderGeneralInformation.isSinglePN) {
        }
        const { masterPartId } = object;
        this['cmmPublicationList' + index] = [];
        this['dynamicWorkflowList' + index] = [];
        this.getPartPublicationByItemMasterId(currentRecord, masterPartId, index);
        // currentRecord.masterPartId=object.itemMasterId;
        // getWorkFlowByPNandScope(workOrderPartNumber);
        this.getWorkFlowByPNandScope(null, currentRecord, 'onload', index);
        currentRecord.description = object.partDescription
        currentRecord.isPMA = object.pma == null ? false : object.pma;
        currentRecord.isDER = object.der == null ? false : object.der;
        currentRecord.isMPNContract = object.isMPNContract === null ? false : object.isMPNContract;
        currentRecord.revisedPartNo = object.revisedPartNo;
        currentRecord.serialNumber = object.serialNumber;
        currentRecord.stockLineId = object.stockLineId;
        // currentRecord.conditionId = object.conditionId;
        currentRecord.condition = object.condition;
        currentRecord.stockLineNumber = object.stockLineNumber;
        currentRecord.itemGroup = object.itemGroup;
        currentRecord.receivingCustomerWorkId = object.receivingCustomerWorkId;
        currentRecord.customerReference = object.reference;
        currentRecord.receivedDate = new Date(object.receivedDate);
        currentRecord.customerRequestDate = new Date(object.custReqDate);
        this.revisedPartId = object.revisedPartId;
        currentRecord.managementStructureId = object.managementStructureId;
        currentRecord.level1 = object.level1;
        currentRecord.level2 = object.level2;
        currentRecord.level3 = object.level3;
        currentRecord.level4 = object.level4;
        if (!this.isEdit) {
            let currentdate: any = new Date();
            currentRecord.tatDaysCurrent = moment(currentdate).diff(currentRecord.receivedDate, 'days');
        }
        else {
            this.calculatePartTat(currentRecord);
        }
    }

    onSelectedTechnician(object, currentRecord) {
        if (object.employeeId != undefined && object.employeeId > 0) {
            this.commonService.getTechnicianStation(object.employeeId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                currentRecord.techStationId = res.stationId;
            },
                err => {
                    this.handleError(err);
                });
        }
    }

    getStockLineByItemMasterIdOnChangePN(workOrderPart, index) {
        this.getStockLineByItemMasterId(workOrderPart.masterPartId, workOrderPart.conditionId, index);
    }

    async getStockLineByItemMasterId(itemMasterId, conditionId, index) {
        itemMasterId = editValueAssignByCondition('itemMasterId', itemMasterId)
        if (itemMasterId !== 0 && conditionId !== null) {
            this.isSpinnerVisible = true;
            await this.workOrderService.getStockLineByItemMasterId(itemMasterId, conditionId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this['stockLineList' + index] = res.map(x => {
                    return {
                        label: x.stockLineNumber,
                        value: x.stockLineId,
                    }
                });
            },
                err => {
                    this.handleError(err);
                })
        }
    }

    getDynamicVariableData(variable, index) {
        return this[variable + index]
    }

    async getPartPublicationByItemMasterId(currentRecord, itemMasterId, index) {
        this.isSpinnerVisible = true;
        await this.workOrderService.getPartPublicationByItemMaster(itemMasterId.itemMasterId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.isSpinnerVisible = false;
            this.cmmList = [];
            this.cmmListNew = [];
            this.cmmListNew = res;
            this.cmmList = res.map(x => {
                return {
                    value: x.publicationRecordId,
                    label: x.publicationId,
                    expirationDate: x.expirationDate
                }
            });
            this['cmmPublicationList' + index] = []
            this['cmmPublicationList' + index] = this.cmmList;
            if (this.cmmList && this['cmmPublicationList' + index].length > 0) {
                currentRecord.cMMId = this['cmmPublicationList' + index][0].value;
                this.workOrderGeneralInformation.partNumbers[index].cMMId = this['cmmPublicationList' + index][0].value;
                this.workOrderGeneralInformation.partNumbers[index].publicationNo = this['cmmPublicationList' + index][0].label;
                if (this.cmmListNew && this.cmmListNew[0].expirationDate) {
                    this.workOrderGeneralInformation.partNumbers[index].publicatonExpirationDate = this.cmmListNew[0].expirationDate;
                    // this.showWaringForPublication();
                }
            }
        },
            err => {
                this.handleError(err);
            })
    }
    onSelectPublication(event, currentRecord, i) {
        if (this['cmmPublicationList' + i] && this['cmmPublicationList' + i].length != 0) {
            this['cmmPublicationList' + i].forEach(element => {
                if (element.value == event.value) {
                    this.workOrderGeneralInformation.partNumbers[i].publicatonExpirationDate = element.expirationDate;
                    this.workOrderGeneralInformation.partNumbers[i].publicationNo = element.label;
                }
            });
        }
        if (this.workOrderGeneralInformation.partNumbers && this.workOrderGeneralInformation.partNumbers[i].publicatonExpirationDate) {
            this.showWaringForPublication();
        }
    }
    selectedCondition(value, currentRecord, index,) {
        this.conditionList.forEach(element => {
            if (element.value == value) {
                currentRecord.condition = element.label;
                this.workOrderGeneralInformation.partNumbers[index].condition = element.label;
            }
        });
        this.workOrderStatus('onCondition');
    }

    selectedStage(value, currentRecord, index,) {
        this.workOrderStagesList.forEach(element => {
            if (element.workOrderStageId == value) {
                currentRecord.workOrderStatusId = element.workOrderStausId;
                this.workOrderGeneralInformation.partNumbers[index].workOrderStatusId = element.workOrderStausId;
            }
        });
        this.workOrderStatus('onStage');
    }

    filterRevisedPartNumber(event, index) {
        this['revisedPartNumberList' + index] = this['revisedPartOriginalData' + index]
        if (event.query !== undefined && event.query !== null) {
            const partNumbers = [...this['revisedPartOriginalData' + index].filter(x => {

                return x.revisedPartNo.toLowerCase().includes(event.query.toLowerCase())
            })]
            this['revisedPartNumberList' + index] = partNumbers;
        }
    }

    getSerialNoByStockLineId(workOrderPart) {
        const { stockLineId } = workOrderPart;
        const { conditionId } = workOrderPart;
        workOrderPart.serialNumber = '';

        if ((stockLineId !== null && stockLineId !== 0) && (conditionId !== null && conditionId !== 0)) {
            this.isSpinnerVisible = true;
            this.workOrderService.getSerialNoByStockLineId(stockLineId, conditionId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                if (res) {
                    workOrderPart.serialNumber = res.serialNumber;
                }
            },
                err => {
                    this.handleError(err);
                })
        }
    }

    onSelectWorkflow(event, currentRecord, i) {
        if (this['dynamicWorkflowList' + i] && this['dynamicWorkflowList' + i].length != 0) {
            this['dynamicWorkflowList' + i].forEach(element => {
                if (element.value == event.value) {
                    this.workOrderGeneralInformation.partNumbers[i].workflowExpirationDate = element.expirationDate;
                    this.workOrderGeneralInformation.partNumbers[i].workFlowNo = element.label;
                }
            });
        }
        currentRecord.disabledForWorkflow = false;
        this.workOrderGeneralInformation.partNumbers[i].disabledForWorkflow = false;
        if (this.workOrderGeneralInformation.partNumbers && this.workOrderGeneralInformation.partNumbers[i].workflowExpirationDate) {
            this.showWaringForWorkflow();
        }
    }
    workOrderScopeName:any;
    PartNumber:any;
    workScopeIndex:any;
    allowtoSaveWorkScope(){
        this.modalWorkScopeModel.close();
    }
    dismissWorkSocpe(){
        this.workOrderGeneralInformation.partNumbers[this.workScopeIndex].workOrderScopeId=undefined;
        this.modalWorkScopeModel.close();
    }
    triggherWorkScopeData(workOrderPart,index){
        workOrderPart.masterCompanyId=this.currentUserMasterCompanyId;
        // console.log("workOrderPart",workOrderPart)
        this.commonService.getDataWorkScopeByItemMasterCaps(workOrderPart,'isWO').subscribe(res => {
            // console.log('res',res);
            this.workScopeObjDetails={};
            this.workScopeObjDetails=res;
            if(this.workScopeObjDetails && this.workScopeObjDetails.isVerified==false){ 
                this.workScopeIndex=index;
                this.PartNumber=workOrderPart.masterPartId.partNumber;
                this.workScopesList.forEach(element => {
                    if(element.value==workOrderPart.workOrderScopeId){
                        this.workOrderScopeName=element.label;
                   return;
                    }
                });
                let modelName3=this.modalWorkScope;
                let ngbModalOptions: NgbModalOptions = {
                    backdrop : 'static',
                    keyboard : false,
                    size: 'sm'
              };
                this.modalWorkScopeModel = this.modalService.open(modelName3, ngbModalOptions); 
            }
        });
    }
    workScopeObjDetails:any={}
    getWorkFlowByPNandScope(value, workOrderPart, form, index) {
        // console.log("part",workOrderPart)
        if (value != null && form == 'html') {
            workOrderPart.workOrderScopeId = value;
            workOrderPart.masterCompanyId=this.currentUserMasterCompanyId
        //  console.log("wo part",workOrderPart)
        
        workOrderPart.workOrderScopeId = (workOrderPart.workOrderScopeId != undefined || workOrderPart.workOrderScopeId != null) ? workOrderPart.workOrderScopeId : 0;
        this.triggherWorkScopeData(workOrderPart,index);
    }
        const itemMasterId = editValueAssignByCondition('itemMasterId', workOrderPart.masterPartId);
        const { workOrderScopeId } = workOrderPart;
        if ((itemMasterId !== 0 && itemMasterId !== null) && (workOrderScopeId !== null && workOrderScopeId !== 0)) {
            this.isSpinnerVisible = true;
            this.workOrderService.getWorkFlowByPNandScope(itemMasterId, workOrderScopeId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                if (res && res.length != 0) {
                    this.workFlowList = res.map(x => {
                        return {
                            ...x,
                            label: x.workFlowNo,
                            value: x.workFlowId
                        }
                    })
                    this['dynamicWorkflowList' + index] = [];
                    this['dynamicWorkflowList' + index] = this.workFlowList;
                    if (this['dynamicWorkflowList' + index] && this['dynamicWorkflowList' + index].length != 0) {
                        this.workFlowId = this.workFlowList[0].value;
                        this.workOrderGeneralInformation.partNumbers[index].workflowId = this.workFlowList[0].value;
                        if (res && res[0].expirationDate) {
                            this.workOrderGeneralInformation.partNumbers[index].workflowExpirationDate = res[0].expirationDate;
                            this.showWaringForWorkflow();
                        }
                    }
                    // workOrderPart.workflowId = this.workFlowList[0].value;


                    // if(this.cmmList[0].workflowExpirationDate){
                    //     this.workOrderGeneralInformation.partNumbers[index].workflowExpirationDate = this.cmmList[0].workflowExpirationDate;


                    //     this.showWaringForPubWorkflow();
                    //     }


                } else {
                    this.workFlowList = [];
                }
            }, err => {
                this.handleError(err);
            })
        }
        this.getNTEandSTDByItemMasterId(itemMasterId, workOrderPart, index);

    }

    getNTEandSTDByItemMasterId(itemMasterId, currentRecord, index) {
        if (currentRecord.workOrderScopeId !== null && currentRecord.workOrderScopeId !== '' && currentRecord.workOrderScopeId > 0) {
            const label = getValueFromArrayOfObjectById('label', 'value', currentRecord.workOrderScopeId, this.workScopesList);
            if (itemMasterId !== undefined && currentRecord.workOrderScopeId !== undefined) {
                this.isSpinnerVisible = true
                this.workOrderService.getNTEandSTDByItemMasterId(itemMasterId, currentRecord.workOrderScopeId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                    this.isSpinnerVisible = false;
                    if (res !== null) {
                        this.workOrderGeneralInformation.partNumbers[index].nte = res.nteHours;
                        this.workOrderGeneralInformation.partNumbers[index].tatDaysStandard = res.stdHours;
                        // currentRecord.nte = res.nteHours;
                        // currentRecord.tatDaysStandard = res.stdHours;
                    }
                },
                    err => {
                        this.handleError(err);
                    })
            }
        }
    }

    getWorkFlowData() {
        this.selectedWorkFlowId = this.savedWorkOrderData.partNumbers[0].workflowId;
        if (this.selectedWorkFlowId != null) {
            this.isSpinnerVisible = true;
            this.workFlowtService.getWorkFlowDataByIdForEdit(this.selectedWorkFlowId, this.currentUserMasterCompanyId)
                .pipe(takeUntil(this.onDestroy$)).subscribe(
                    (workFlowData) => {
                        this.isSpinnerVisible = false;
                        this.employeeService.workFlowIdData = workFlowData;
                    },
                    err => {
                        this.handleError(err);
                    }
                )
        }
    }
    changeofMPN(data) {
        this.quotestatusofCurrentPart = data.quoteStatus;
        this.selectedPartNumber = data;
        // if(this.workOrderGeneralInformation.isSinglePN==true){
        this.workOrderService.partNumberData = data.datas;
        // }
        this.mpnGridData = data.datas;
        this.workFlowId = data.workflowId,
            this.workFlowWorkOrderId = data.workOrderWorkFlowId;
        this.workOrderPartNumberId = data.workOrderPartNumberId;
        this.workScope = data.workscope;
        this.showGridMenu = true;
        this.getWorkFlowTabsData();
        // if (this.workFlowId != null) {
        //     this.showWorkflowLabel='View WF';
        //     this.subTabWorkFlowChange('viewworkFlow')
        // }
    }

    getWorkFlowTabsData() {
        if (this.gridActiveTab === 'materialList') {
            this.gridTabChange('materialList');
        } else if (this.gridActiveTab === 'labor') {
            this.gridTabChange('labor');
        }
        else if (this.gridActiveTab === 'equipment') {
            this.gridTabChange('equipment');
        }
        else if (this.gridActiveTab === 'main') {
            this.gridTabChange('main');
        }
        else if (this.gridActiveTab === 'billorInvoice') {
            this.gridTabChange('billorInvoice');
        }
        else if (this.gridActiveTab === 'quote') {
            this.gridTabChange('quote');
        }
        else if (this.gridActiveTab === 'pickticket') {
            this.gridTabChange('pickticket');
        }
        else if (this.gridActiveTab === 'shipping') {
            this.gridTabChange('shipping');
        }
        else if (this.gridActiveTab === 'subWO') {
            this.gridTabChange('subWO');
        }
        else if (this.gridActiveTab === 'communication') {
            this.gridTabChange('communication');
            let temp = this.selectedCommunicationTab;
            this.selectedCommunicationTab = '';
            this.selectedCommunicationTab = temp;
        }
        else if (this.gridActiveTab === 'documents') {
            this.gridTabChange('documents');
        }
        else if (this.gridActiveTab === 'workComplete') {
            this.gridTabChange('workComplete');
        }
        else if (this.gridActiveTab === 'woanalysis') {
            this.gridTabChange('woanalysis');
        }
        else if (this.gridActiveTab === 'laboranalysis') {
            this.gridTabChange('laboranalysis');
        }
        else if (this.gridActiveTab === 'tearDown') {
            this.gridTabChange('tearDown');
        }
        else if (this.gridActiveTab === 'otherOptions') {
            let temp = this.subTabOtherOptions;
            this.subTabOtherOptions = '';
            this.subTabOtherOptions = temp;
            this.otherOptionTabSelected(this.subTabOtherOptions);
            this.gridTabChange('otherOptions');
        }
    }

    closeWorkOrderMainView(value) {
        this.isWorkOrderMainView = value;
    }

    savedWorkFlowData(workFlowDataObject) {
        this.isSpinnerVisible = true;
        if (this.isSubWorkOrder == true) {
            workFlowDataObject.isSubWorkOrder = true;
            workFlowDataObject.subWorkOrderId = this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId;
            workFlowDataObject.workOrderId = this.subWorkOrderDetails.workOrderId;
            workFlowDataObject.subWOPartNoId = this.subWOPartNoId;
        }
        delete workFlowDataObject.customerName;
        if (workFlowDataObject.equipments && workFlowDataObject.equipments.length != 0) {
            workFlowDataObject.equipments.forEach(element => {
                element.partNumber = element.partNumber.name
            });
        }
        workFlowDataObject.masterCompanyId = workFlowDataObject.masterCompanyId ? workFlowDataObject.masterCompanyId : this.currentUserMasterCompanyId;
        workFlowDataObject.publication.forEach(element => { element.allDashNumbers = ""; })
        this.workOrderService.createWorkFlowWorkOrder(workFlowDataObject).subscribe(res => {
            this.isSpinnerVisible = false;
            this.workFlowWorkOrderData = res;
            this.workFlowWorkOrderId = res.workFlowWorkOrderId;
            if (this.workFlowWorkOrderId !== 0) {
                this.isDisabledSteps = true;
            }
            this.getWorkOrderWorkFlowNos();
            this.alertService.showMessage(
                '',
                'Work Order Work Flow Saved Succesfully',
                MessageSeverity.success
            );
            setTimeout(
                () => {
                    this.workOrderGeneralInformation.partNumbers.map(
                        (workorderpn, index) => {
                            this.getWorkFlowByPNandScope(null, workorderpn, 'onload', index);
                        }
                    )
                    this.editWorkFlowData = undefined;
                    this.isSpinnerVisible = true;
                    this.workFlowtService.getWorkFlowDataByIdForEdit(this.workFlowId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                        this.isSpinnerVisible = false;
                        this.workFlowtService.listCollection = res[0];
                        this.workFlowtService.enableUpdateMode = true;
                        this.workFlowtService.currentWorkFlowId = res.workflowId;
                        this.editWorkFlowData = res;
                    },
                        err => {
                            this.handleError(err);
                        })
                },
                0
            )
        },
            err => {
                this.handleError(err);
            })
    }
    closeModel() {
        this.isShowSummary = false;
    }
    //for multiple mpn controll dropdown bellow all tabs
    getWorkOrderWorkFlowNos() {
        if (this.workOrderId) {
            this.isSpinnerVisible = true;
            this.workOrderService.getWorkOrderWorkFlowNumbers(this.workOrderId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false
                this.workOrderWorkFlowOriginalData = res;
                if (this.isEdit && res.length === 1 && this.workOrderGeneralInformation.isSinglePN == true) {
                    this.workFlowId = res[0].workflowId;
                    this.selectedPartNumber = res[0];
                }
                this.mpnPartNumbersList = res.map(x => {
                    return {
                        value:
                        {
                            datas: x,
                            workOrderWorkFlowId: x.value,
                            workOrderNo: x.label,
                            masterPartId: x.masterPartId,
                            workflowId: x.workflowId,
                            workflowNo: x.workflowNo,
                            partNumber: x.partNumber,
                            workOrderPartNumberId: x.workOrderPartNumberId,
                            workScope: x.workscope,
                            managementStructureId: x.managementStructureId,
                            quoteStatus: x.quoteStatus
                        },
                        label: x.partNumber
                    }
                })
                if (this.mpnPartNumbersList && this.mpnPartNumbersList.length > 0) {
                    this.selectedMPN = this.mpnPartNumbersList[0].value;
                    if (!this.workOrderGeneralInformation.isSinglePN) {
                        this.changeofMPN(this.mpnPartNumbersList[0].value);
                    }
                    else {
                        this.quotestatusofCurrentPart = this.mpnPartNumbersList[0].value.quoteStatus;

                    }
                    // if (this.workFlowId == null) {
                    this.workFlowWorkOrderId = this.mpnPartNumbersList[0].value.workOrderWorkFlowId;
                    if (this.isSubWorkOrder == true) {
                        this.getMaterialListByWorkOrderIdForSubWO();
                    } else {
                        // this.getMaterialListByWorkOrderId();
                        // nw one
                        this.getNewMaterialListByWorkOrderId();
                    }
                    // }
                }
            },
                err => {
                    this.handleError(err);
                })
        }
    }

    getmemo($event) {
        this.disableSaveForEdit = false;
    }
    //new form for material list
    saveMaterials(data) {
        if (this.isSubWorkOrder == true) {
            this.isSpinnerVisible = true;
            const newData = {
                ...data,
                workOrderId: this.subWorkOrderDetails.workOrderId,
                workFlowWorkOrderId: this.workFlowWorkOrderId,
                subWOPartNoId: this.subWOPartNoId,
                subWorkOrderMaterialsId: data.subWorkOrderMaterialsId ? data.subWorkOrderMaterialsId : 0,
                subWorkOrderId: this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId,
                extendedCost: data.extendedCost ? data.extendedCost : 0,
                unitCost: data.unitCost ? data.unitCost : 0,
                // partNumber: data.partItem.partName,
                isActive: true,
                isDeleted: false,
                createdBy: this.userName,
                updatedBy: this.userName,
                createdDate: new Date(),
                updatedDate: new Date(),
                masterCompanyId: this.authService.currentUser.masterCompanyId,
                taskId: (typeof data.taskId == 'object') ? data.taskId.taskId : data.taskId
            }
            this.workOrderService.createSubWorkOrderMaterialList([newData]).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.materialList = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Saved Sub Work Order MaterialList Succesfully',
                    MessageSeverity.success
                );
                this.getMaterialListByWorkOrderIdForSubWO();
            },
                err => {
                    this.handleError(err);
                })
        } else {

            const newData = {
                ...data,
                workOrderId: this.workOrderId,
                workFlowWorkOrderId: this.workFlowWorkOrderId == 0 ? null : this.workFlowWorkOrderId,
                masterCompanyId: this.authService.currentUser.masterCompanyId,
                extendedCost: data.extendedCost ? data.extendedCost : 0,
                unitCost: data.unitCost ? data.unitCost : 0,
                // partNumber: data.partItem.partName,
                taskId: (typeof data.taskId == 'object') ? data.taskId.taskId : data.taskId,
                stockLineId: data.stockLineId == 0 ? null : data.stockLineId,
                isActive: true,
                isDeleted: false,
                createdBy: this.userName,
                updatedBy: this.userName,
                createdDate: new Date(),
                updatedDate: new Date(),
                quantity: data.quantity ? data.quantity : 0,
                provisionId: data.provisionId ? data.provisionId : 0
            }
            this.isSpinnerVisible = true;
            this.workOrderService.createWorkOrderMaterialList([newData]).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.materialList = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Saved Work Order MaterialList Succesfully',
                    MessageSeverity.success
                );
                // newMaterial list get
                this.getNewMaterialListByWorkOrderId();
                // old material list get
                // this.getMaterialListByWorkOrderId();
            },
                err => {
                    this.handleError(err);
                })
        }
    }
    isSubWorkorderCheck(data) {
        if (data == true) {
            this.isSubWorkOrder = true;
        }
    }
    //new form for material list
    updateMaterials(data) {
        if (this.isSubWorkOrder == true) {
            const newData = {
                ...data,
                workOrderId: this.subWorkOrderDetails.workOrderId,
                workFlowWorkOrderId: this.workFlowWorkOrderId,
                subWOPartNoId: this.subWOPartNoId,
                subWorkOrderMaterialsId: data.subWorkOrderMaterialsId ? data.subWorkOrderMaterialsId : 0,
                masterCompanyId: this.authService.currentUser.masterCompanyId,
                subWorkOrderId: this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId,
                extendedCost: data.extendedCost ? data.extendedCost : 0,
                unitCost: data.unitCost ? data.unitCost : 0,
                isActive: true,
                isDeleted: false,
                createdBy: this.userName,
                updatedBy: this.userName,
                createdDate: new Date(),
                updatedDate: new Date(),
                // partNumber: data.partItem.partName,
                taskId: (typeof data.taskId == 'object') ? data.taskId.taskId : data.taskId
            }
            this.isSpinnerVisible = true;
            this.workOrderService.updatesubworkordermaterials([newData]).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.materialList = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Updated Sub Work Order MaterialList Succesfully',
                    MessageSeverity.success
                );
                this.getMaterialListByWorkOrderIdForSubWO();
            },
                err => {
                    this.handleError(err);
                })
        } else {
            const newData = {
                ...data,
                workOrderId: this.workOrderId,
                workFlowWorkOrderId: this.workFlowWorkOrderId == 0 ? null : this.workFlowWorkOrderId,
                masterCompanyId: this.authService.currentUser.masterCompanyId,
                extendedCost: data.extendedCost ? data.extendedCost : 0,
                unitCost: data.unitCost ? data.unitCost : 0,
                // partNumber: data.partItem.partName,
                taskId: (typeof data.taskId == 'object') ? data.taskId.taskId : data.taskId,
                stockLineId: data.stockLineId == 0 ? null : data.stockLineId,
                isActive: true,
                isDeleted: false,
                createdBy: this.userName,
                updatedBy: this.userName,
                createdDate: new Date(),
                updatedDate: new Date(),
                quantity: data.quantity ? data.quantity : 0,
                provisionId: data.provisionId ? data.provisionId : 0
            }

            this.isSpinnerVisible = true;
            this.workOrderService.updateWorkOrderMaterialList([newData]).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.materialList = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Updated Work Order MaterialList Succesfully',
                    MessageSeverity.success
                );
                // newMaterial list get
                this.getNewMaterialListByWorkOrderId();
            },
                err => {
                    this.handleError(err);
                })
        }
    }


    workOrderMaterial: any = [];
    getNewMaterialListByWorkOrderId() {
        if (this.workFlowWorkOrderId !== 0 && this.workOrderId) {
            this.workOrderMaterialList = [];
            this.isSpinnerVisible = true;
            this.workOrderService.getWorkOrderMaterialList(this.workFlowWorkOrderId, this.workOrderId, this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.salesQuoteService.selectedParts = [];
                if (res && res.length > 0) {
                    res.forEach(element => {
                        this.getValues(element)
                        element.isShowPlus = true;
                        if (element.defered == 'No') {
                            element.defered = false;
                        } else {
                            element.defered = true;
                        }
                    });
                    this.workOrderMaterial = res;
                    this.workOrderMaterial.forEach(element => {
                        element.currency = element.currency;
                        element.unitCost = element.unitCost ? formatNumberAsGlobalSettingsModule(element.unitCost, 2) : '0.00';
                        element.extendedCost = element.extendedCost ? formatNumberAsGlobalSettingsModule(element.extendedCost, 2) : '0.00';
                    });
                    if (this.gridActiveTab === 'billorInvoice') {
                        this.quoteMaterialList = res;
                    }
                    this.materialStatus = res[0].partStatusId;
                    this.salesQuoteService.selectedParts = [];
                    this.salesQuoteService.selectedParts = this.workOrderMaterial;

                    this.filterParts();
                }
            },
                err => {
                    this.handleError(err);
                })
        }
    }

    getMaterialListByWorkOrderIdForSubWO() {
        this.workOrderMaterialList = [];
        this.workOrderService.getSubWorkOrderMaterialList(this.subWOPartNoId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.salesQuoteService.selectedParts = [];
            if (res && res.length > 0) {
                res.forEach(element => {
                    this.getValues(element)
                    element.isShowPlus = true;
                    if (element.defered == 'No') {
                        element.defered = false;
                    } else {
                        element.defered = true;
                    }
                });
                this.workOrderMaterial = [];
                this.workOrderMaterial = res;
                this.workOrderMaterial.forEach(element => {
                    element.currency = element.currency;
                    element.unitCost = element.unitCost ? formatNumberAsGlobalSettingsModule(element.unitCost, 2) : '0.00';
                    element.extendedCost = element.extendedCost ? formatNumberAsGlobalSettingsModule(element.extendedCost, 2) : '0.00';
                });
                this.materialStatus = res[0].partStatusId;
                // this.salesQuoteService.selectedParts = this.workOrderMaterial;
                this.salesQuoteService.selectedParts = [];
                this.salesQuoteService.selectedParts = this.workOrderMaterial;
                this.filterParts();
            }
        },
            err => {
                this.handleError(err);
            })
    }
    summaryParts: any = [];
    totalRecords: number;
    pageLinks: any;
    filterParts() {
        this.summaryParts = [];
        let uniqueParts = this.getUniqueParts(this.workOrderMaterial, 'partNumber', 'conditionCodeId', 'stockType');
        if (uniqueParts.length > 0) {
            uniqueParts.forEach((part, i) => {
                let childParts = this.workOrderMaterial.filter(selectedPart => selectedPart.stockLineId != 0 && selectedPart.partNumber == part.partNumber && selectedPart.conditionCodeId == part.conditionCodeId && selectedPart.stockType == part.stockType)
                if (childParts && childParts.length > 0) {
                    //   uniqueParts[i] = this.calculateSummarizedRow(childParts, part);
                    uniqueParts[i].childParts = childParts;
                } else {
                    uniqueParts[i].childParts = [];
                }
            });
            uniqueParts.map((x, xindex) => {
                if (x.childParts && x.childParts.length != 0) {
                    x.childParts.map((y, yindex) => {
                        y.line = (xindex + 1) + '.' + (yindex + 1);
                        y.stocklineUnitCost = y.stocklineUnitCost ? formatNumberAsGlobalSettingsModule(y.stocklineUnitCost, 2) : '0.00';
                        y.stocklineExtendedCost = y.stocklineExtendedCost ? formatNumberAsGlobalSettingsModule(y.stocklineExtendedCost, 2) : '0.00';
                    })
                }
            })
            this.workOrderMaterialList = uniqueParts;
        }
        this.totalRecords = this.workOrderMaterialList.length;
        this.pageLinks = Math.ceil(
            this.totalRecords / 10
        );
        // this.checkUpdateOrsaveButton();
    }
    getUniqueParts(myArr, prop1, prop2, prop3) {
        let uniqueParts = JSON.parse(JSON.stringify(myArr));
        uniqueParts.reduceRight((acc, v, i) => {
            if (acc.some(obj => v[prop1] === obj[prop1] && v[prop2] === obj[prop2] && v[prop3] === obj[prop3])) {
                uniqueParts.splice(i, 1);
            } else {
                acc.push(v);
            }
            return acc;
        }, []);
        return uniqueParts;
    }
    //old material list save
    saveWorkOrderMaterialList(data) {
        if (this.isSubWorkOrder == true) {
            const materialArr = data.materialList.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.subWorkOrderDetails.workOrderId,
                    workFlowWorkOrderId: this.workFlowWorkOrderId,
                    subWOPartNoId: this.subWOPartNoId,
                    subWorkOrderMaterialsId: 0,
                    subWorkOrderId: this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId,
                    extendedCost: x.extendedCost ? x.extendedCost : 0,
                    unitCost: x.unitCost ? x.unitCost : 0,
                    partNumber: x.partItem.partName,
                    taskId: (typeof x.taskId == 'object') ? x.taskId.taskId : x.taskId
                }
            })
            this.isSpinnerVisible = true;
            this.workOrderService.createSubWorkOrderMaterialList(materialArr).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.materialList = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Saved Sub Work Order MaterialList Succesfully',
                    MessageSeverity.success
                );
                this.getMaterialListByWorkOrderIdForSubWO();
            },
                err => {
                    this.handleError(err);
                })
        } else {
            const materialArr = data.materialList.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.workOrderId, workFlowWorkOrderId: this.workFlowWorkOrderId,
                    AltPartMasterPartId: null,
                    materialMandatoriesId: x.materialMandatoriesId,
                    extendedCost: x.extendedCost ? x.extendedCost : 0,
                    unitCost: x.unitCost ? x.unitCost : 0,
                    partNumber: x.partItem.partName,
                    taskId: (typeof x.taskId == 'object') ? x.taskId.taskId : x.taskId
                }
            })
            this.isSpinnerVisible = true;
            this.workOrderService.createWorkOrderMaterialList(materialArr).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.materialList = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Saved Work Order MaterialList Succesfully',
                    MessageSeverity.success
                );
                this.getMaterialListByWorkOrderId();
            },
                err => {
                    this.handleError(err);
                })
        }
    }

    updateWorkOrderMaterialList(data) {
        if (this.isSubWorkOrder == true) {
            const materialArr = data.materialList.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.subWorkOrderDetails.workOrderId,
                    workFlowWorkOrderId: this.workFlowWorkOrderId,
                    subWorkOrderId: this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId,
                    extendedCost: x.extendedCost ? x.extendedCost : 0,
                    unitCost: x.unitCost ? x.unitCost : 0,
                    partNumber: x.partItem.partName
                }
            })
            this.isSpinnerVisible = true;
            this.workOrderService.createSubWorkOrderMaterialList(materialArr).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.materialList = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Updated Sub Work Order MaterialList Succesfully',
                    MessageSeverity.success
                );
                this.getMaterialListByWorkOrderIdForSubWO();
            },
                err => {
                    this.handleError(err);
                })
        } else {
            const materialArr = data.materialList.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.workOrderId, workFlowWorkOrderId: this.workFlowWorkOrderId,
                    extendedCost: x.extendedCost ? x.extendedCost : 0,
                    unitCost: x.unitCost ? x.unitCost : 0,
                    partNumber: x.partItem.partName
                }
            })
            this.isSpinnerVisible = true;
            this.workOrderService.updateWorkOrderMaterialList(materialArr).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.materialList = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Updated Work Order MaterialList Succesfully',
                    MessageSeverity.success
                );
                this.getMaterialListByWorkOrderId();
            },
                err => {
                    this.handleError(err);
                })
        }
    }

    getMaterialListByWorkOrderId() {
        if (this.workFlowWorkOrderId !== 0 && this.workOrderId) {
            this.workOrderMaterialList = [];
            this.isSpinnerVisible = true;
            this.workOrderService.getWorkOrderMaterialList(this.workFlowWorkOrderId, this.workOrderId, this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                if (res.length > 0) {
                    res.forEach(element => {
                        this.getValues(element)
                        element.isShowPlus = true;
                        if (element.defered == 'No') {
                            element.defered = false;
                        } else {
                            element.defered = true;
                        }
                    });
                    this.workOrderMaterialList = res;
                    this.workOrderMaterialList.forEach(element => {
                        element.currency = element.currency;
                        element.unitCost = element.unitCost ? formatNumberAsGlobalSettingsModule(element.unitCost, 2) : '0.00';
                        element.extendedCost = element.extendedCost ? formatNumberAsGlobalSettingsModule(element.extendedCost, 2) : '0.00';
                    });
                    if (this.gridActiveTab === 'billorInvoice') {
                        this.quoteMaterialList = res;
                    }
                    this.materialStatus = res[0].partStatusId;
                }
            },
                err => {
                    this.handleError(err);
                })
        }
    }

    // formWorkerOrderLaborJson(data) {

    //     return this.result;
    // }
    saveworkOrderLabor(data) {
        this.isAllowLaberSave = false;
        if (this.isSubWorkOrder) {
            data.subWorkOrderLaborHeaderId = 0;
            data.subWOPartNoId = this.subWOPartNoId,
                data.workOrderId = this.subWorkOrderDetails.workOrderId,
                data.subWorkOrderId = this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId
        }
        if (this.isSubWorkOrder == true) {
            this.result = {
                "subWorkOrderLaborHeaderId": data['subWorkOrderLaborHeaderId'] ? data['subWorkOrderLaborHeaderId'] : 0,
                "subWorkOrderId": data['subWorkOrderId'] ? data['subWorkOrderId'] : this.subWorkOrderDetails.subWorkOrderId,
                "subWOPartNoId": data['subWOPartNoId'] ? data['subWOPartNoId'] : this.subWorkOrderDetails.subWOPartNoId,
                "workFlowWorkOrderId": this.workFlowWorkOrderId,
                "workOrderId": data['workOrderId'],
                "dataEnteredBy": data['dataEnteredBy'],
                "expertiseId": data['expertiseId'],
                "employeeId": data['employeeId'],
                "isTaskCompletedByOne": data['isTaskCompletedByOne'],
                "workFloworSpecificTaskorWorkOrder": data['workFloworSpecificTaskorWorkOrder'],
                "workOrderHoursType": (data['workFloworSpecificTaskorWorkOrder'] == 'specificTasks') ? 1 : 2,
                "hoursorClockorScan": data['hoursorClockorScan'],
                "masterCompanyId": this.authService.currentUser.masterCompanyId,
                "CreatedBy": "admin",
                "UpdatedBy": "admin",
                "IsActive": true,
                "isDeleted": data['IsDeleted'],
                "workOrderLaborHeaderId": data['workOrderLaborHeaderId'],
                "totalWorkHours": data['totalWorkHours'],
                "labourMemo": data['labourMemo'],
                "LaborList": [
                ],
                "WorkOrderQuoteTask": data['WorkOrderQuoteTask'],

            }
            data.WorkOrderQuoteTask.forEach(element => {
                element.subWorkOrderLaborId = element.subWorkOrderLaborId ? element.subWorkOrderLaborId : 0;
                element.subWorkOrderLaborHeaderId = element.subWorkOrderLaborHeaderId ? element.subWorkOrderLaborHeaderId : 0;
            });
        } else {
            this.result = {
                "workFlowWorkOrderId": this.workFlowWorkOrderId,
                "workOrderId": data['workOrderId'],
                "dataEnteredBy": data['dataEnteredBy'],
                "expertiseId": data['expertiseId'],
                "employeeId": data['employeeId'],
                "isTaskCompletedByOne": data['isTaskCompletedByOne'],
                "workFloworSpecificTaskorWorkOrder": data['workFloworSpecificTaskorWorkOrder'],
                "workOrderHoursType": (data['workFloworSpecificTaskorWorkOrder'] == 'specificTasks') ? 1 : 2,
                "hoursorClockorScan": data['hoursorClockorScan'],
                "masterCompanyId": this.authService.currentUser.masterCompanyId,
                "CreatedBy": "admin",
                "UpdatedBy": "admin",
                "IsActive": true,
                "isDeleted": data['IsDeleted'],
                "workOrderLaborHeaderId": data['workOrderLaborHeaderId'],
                "totalWorkHours": data['totalWorkHours'],
                "labourMemo": data['labourMemo'],
                "LaborList": [

                ],
                "WorkOrderQuoteTask": data['WorkOrderQuoteTask']
            }
        }
        for (let labList in data.workOrderLaborList) {
            for (let labSubList of data.workOrderLaborList[labList]) {
                if (labSubList && labSubList['expertiseId'] != null) {
                    labSubList.masterCompanyId = this.currentUserMasterCompanyId;
                    labSubList.directLaborOHCost = labSubList.directLaborOHCost ? labSubList.directLaborOHCost : 0;
                    labSubList.totalCost = labSubList.totalCost ? labSubList.totalCost : 0;
                    labSubList.burdaenRatePercentageId = labSubList.burdaenRatePercentageId != 0 ? labSubList.burdaenRatePercentageId : null
                    this.result.LaborList.push(labSubList);
                    this.result.expertiseId = labSubList['expertiseId'];
                    this.result.employeeId = labSubList['employeeId'];
                }
            }
        }
        //         if(this.result &&  this.result.LaborList && this.result.LaborList.length==0){
        //             this.isAllowLaberSave=true;
        //  this.alertService.showMessage(
        //             this.moduleName,
        //             'Add Atleast one Task',
        //             MessageSeverity.warn
        //         );
        //         return;
        //         }
        if (this.result && this.result.LaborList && this.result.LaborList.length != 0) {
            this.isAllowLaberSave = false;
            this.taskName = '';
            this.result.LaborList.forEach(element => {
                this.taskList.forEach(subel => {
                    if (subel.taskId == element.taskId) {
                        this.taskName = subel.description;
                    }
                });
                if (element.expertiseId == undefined || element.expertiseId == null || element.expertiseId == '') {
                    this.alertService.showMessage(
                        this.taskName,
                        'Add Expertise',
                        MessageSeverity.warn
                    );
                    this.isAllowLaberSave = true;
                    return;
                }
                if ((element.burdaenRatePercentageId == 0 || element.burdaenRatePercentageId == undefined || element.burdaenRatePercentageId == null || element.burdaenRatePercentageId == '') && element.burdenRateAmount == 0) {
                    this.alertService.showMessage(
                        this.taskName,
                        'Set Burdaen Rate Percentage or Burden Rate Amount From Settings',
                        MessageSeverity.warn
                    );
                    this.isAllowLaberSave = true;
                    return;
                }



                if (element.employeeId == undefined || element.employeeId == null || element.employeeId == '') {
                    this.alertService.showMessage(
                        this.taskName,
                        'Add Employee Name',
                        MessageSeverity.warn
                    );
                    this.isAllowLaberSave = true;
                    return;
                }
                if (Number(element.hours.toString().split(',').join('')) == undefined || Number(element.hours.toString().split(',').join('')) == null || element.hours == '' || Number(element.hours.toString().split(',').join('')) <= 0) {
                    this.alertService.showMessage(
                        this.taskName,
                        'Add Hours',
                        MessageSeverity.warn
                    );
                    this.isAllowLaberSave = true;
                    return;
                }
                if (Number(element.adjustments.toString().split(',').join('')) > 0 && element.memo == '') {
                    this.alertService.showMessage(
                        this.taskName,
                        'Add Memo',
                        MessageSeverity.warn
                    );
                    this.isAllowLaberSave = true;
                    return;
                }
            });
        }


        // this.formWorkerOrderLaborJson(data)
        if (this.isAllowLaberSave == false) {
            this.isSpinnerVisible = true;
            this.workOrderService.createWorkOrderLabor(this.result, this.isSubWorkOrder).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.isAllowLaberSave = false;
                this.islaborCreated = true;
                this.alertService.showMessage(
                    this.moduleName,
                    'Saved Work Order Labor Succesfully',
                    MessageSeverity.success
                );
            },
                err => {
                    this.handleError(err);
                })
        }
    }

    openCurrency(content) {
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
    }
    saveWorkOrderChargesList(data) {
        if (this.isSubWorkOrder == true) {
            const chargesArr = data.charges.map(x => {
                return {
                    ...x,
                    referenceNo: x.refNum,
                    chargesTypeId: x.workflowChargeTypeId,
                    chargeId: x.workflowChargeTypeId,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.subWorkOrderDetails.workOrderId,
                    workFlowWorkOrderId: this.workFlowWorkOrderId,
                    subWOPartNoId: this.subWOPartNoId,
                    subWorkOrderId: this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId,
                    taskId: (typeof x.taskId == 'string') ? x.taskId : x.taskId.taskId
                }
            })
            this.isSpinnerVisible = true;
            this.workOrderService.createSubWorkOrderChargesList(chargesArr).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.charges = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Saved Sub Work Order Charges Succesfully',
                    MessageSeverity.success
                );
                this.getChargesListByWorkOrderId();
            },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err)
                })
        } else {
            const chargesArr = data.charges.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.workOrderId, workFlowWorkOrderId: this.workFlowWorkOrderId,
                    taskId: (typeof x.taskId == 'string') ? x.taskId : x.taskId.taskId
                }
            })
            this.isSpinnerVisible = true;
            this.workOrderService.createWorkOrderChargesList(chargesArr).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.charges = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Saved Work Order Charges  Succesfully',
                    MessageSeverity.success
                );
                this.getChargesListByWorkOrderId();
            },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err)
                })
        }
    }

    updateWorkOrderChargesList(data) {
        if (this.isSubWorkOrder == true) {
            const chargesArr = data.charges.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.subWorkOrderDetails.workOrderId,
                    workFlowWorkOrderId: this.workFlowWorkOrderId,
                    subWOPartNoId: this.subWOPartNoId,
                    subWorkOrderId: this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId
                }
            })
            this.isSpinnerVisible = true;
            this.workOrderService.createSubWorkOrderChargesList(chargesArr).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.charges = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Updated Sub Work Order Charges Succesfully',
                    MessageSeverity.success
                );
                this.getChargesListByWorkOrderId();
            },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err)
                })
        } else {
            const chargesArr = data.charges.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.workOrderId, workFlowWorkOrderId: this.workFlowWorkOrderId
                }
            })
            this.isSpinnerVisible = true;
            this.workOrderService.updateWorkOrderChargesList(chargesArr).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.charges = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Updated Work Order Charges Succesfully',
                    MessageSeverity.success
                );
                this.getChargesListByWorkOrderId();
            },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err)
                })
        }
    }


    saveReservedPartorIssue(alternatePartData) {
        alternatePartData.masterCompanyId = alternatePartData.masterCompanyId ? alternatePartData.masterCompanyId : this.currentUserMasterCompanyId;
        this.gridActiveTab == '';
        this.gridActiveTab == 'materialList';
        if (this.isSubWorkOrder == true) {
            this.isSpinnerVisible = true;
            this.workOrderService.saveSubWoReservedPartorIssue(alternatePartData).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    this.moduleName,
                    'Parts Data Updated successfully',
                    MessageSeverity.success
                );
                this.getMaterialListByWorkOrderIdForSubWO();
            },
                err => {
                    this.isSpinnerVisible = false;
                    this.handleError(err);
                })
        } else {
            this.isSpinnerVisible = true;
            this.workOrderService.saveReservedPartorIssue(alternatePartData).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    this.moduleName,
                    'Parts Data Updated successfully',
                    MessageSeverity.success
                );
                // this.getMaterialListByWorkOrderId();

                // new one
                this.getNewMaterialListByWorkOrderId();
            },
                err => {
                    this.isSpinnerVisible = false;
                    this.handleError(err);
                })
        }
    }
    getValues(element) {
        if (element.stockLineNumber) {
            if (element.stockLineNumber.indexOf(',') > -1) {
                element.isMultipleStockLine = 'Multiple';
            } else {
                element.isMultipleStockLine = 'Single';
            }
        }
        if (element.controlNo) {
            if (element.controlNo.indexOf(',') > -1) {
                element.isMultipleControlNo = 'Multiple';
            } else {
                element.isMultipleControlNo = 'Single';
            }
        }
        if (element.controlId) {
            if (element.controlId.indexOf(',') > -1) {
                element.isMultiplecontrolId = 'Multiple';
            } else {
                element.isMultiplecontrolId = 'Single';
            }
        }
        if (element.receiver) {
            if (element.receiver.indexOf(',') > -1) {
                element.isMultiplereceiver = 'Multiple';
            } else {
                element.isMultiplereceiver = 'Single';
            }
        }
    }

    clearLaborList() {
        if (this.taskList && this.taskList.length > 0) {
            for (let task of this.taskList) {
                this.labor.workOrderLaborList[0][task.description.toLowerCase()] = [];
            }
        }
    }
    refreshLabor(value) {
        this.getWorkFlowLaborList();
    }
    islaborCreated: boolean = false;
    getWorkFlowLaborList() {
        this.clearLaborList();
        if ((this.workFlowWorkOrderId !== 0 || this.workFlowWorkOrderId !== undefined) && this.workOrderId) {
            this.isSpinnerVisible = true;
            this.workOrderService.getWorkOrderLaborList(this.workFlowWorkOrderId, this.workOrderId, this.isSubWorkOrder, this.subWOPartNoId, this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                if (res && res.response == 'Record not Exist with these details. !') {
                    this.getMarkup();
                    this.islaborCreated = false;
                } else {
                    this.islaborCreated = true;
                    this.data = {};
                    this.data = res;
                    if (res) {
                        this.workOrderLaborList = {
                            ...this.data,
                            workFlowWorkOrderId: getObjectById('value', this.data.workFlowWorkOrderId, this.workOrderWorkFlowOriginalData),
                            employeeId: { employeeId: this.data.employeeId, name: this.data.employeeName, value: this.data.employeeId, label: this.data.employeeName },
                            dataEnteredBy: { value: this.data.dataEnteredBy, label: this.data.dataEnteredByName },
                        };
                        this.getMarkup();
                        this.labor.hoursorClockorScan = res.hoursorClockorScan;
                        this.labor.workFloworSpecificTaskorWorkOrder = (res.workOrderHoursType == 0) ? 'workFlow' : (res.workOrderHoursType == 1) ? 'specificTasks' : 'workOrder';
                        this.labor.totalWorkHours = res.totalWorkHours;
                        this.labor.expertiseId = res.expertiseId;
                        this.labor['labourMemo'] = res.labourMemo;
                        this.labor['workOrderHoursType'] = res['workOrderHoursType'];
                        if (this.isSubWorkOrder == true) {
                            this.labor['subWorkOrderLaborHeaderId'] = res['subWorkOrderLaborHeaderId'];
                        }
                    }
                    if (res) {
                        for (let labList of this.data['laborList']) {
                            if (this.taskList) {
                                for (let task of this.taskList) {
                                    if (task.taskId == labList['taskId']) {
                                        if (!this.labor.workOrderLaborList[0][task.description.toLowerCase()]) {
                                            this.labor.workOrderLaborList[0][task.description.toLowerCase()] = []
                                        }
                                        if (this.labor.workOrderLaborList[0][task.description.toLowerCase()][0] && (this.labor.workOrderLaborList[0][task.description.toLowerCase()][0]['expertiseId'] == undefined || this.labor.workOrderLaborList[0][task.description.toLowerCase()][0]['expertiseId'] == null)) {
                                            this.labor.workOrderLaborList[0][task.description.toLowerCase()].splice(0, 1);
                                        }
                                        let taskData = new AllTasks()
                                        taskData['workOrderLaborHeaderId'] = labList['workOrderLaborHeaderId'];
                                        taskData['workOrderLaborId'] = labList['workOrderLaborId'];
                                        taskData['expertiseId'] = labList['expertiseId'];
                                        taskData['employeeId'] = { value: labList['employeeId'], label: labList['employeeName'] };
                                        taskData['billableId'] = labList['billableId'];
                                        taskData['startDate'] = labList['startDate'] ? new Date(labList['startDate']) : null;
                                        taskData['endDate'] = labList['endDate'] ? new Date(labList['endDate']) : null;
                                        taskData['hours'] = labList['hours'];
                                        taskData['adjustments'] = labList['adjustments'];
                                        taskData['adjustedHours'] = labList['adjustedHours'].toFixed(2);
                                        taskData['memo'] = labList['memo'];

                                        taskData['burdaenRatePercentageId'] = labList['burdaenRatePercentageId'];
                                        taskData['burdenRateAmount'] = labList['burdenRateAmount'] ? formatNumberAsGlobalSettingsModule(labList['burdenRateAmount'], 2) : '0.00';
                                        taskData['directLaborOHCost'] = labList['directLaborOHCost'] ? formatNumberAsGlobalSettingsModule(labList['directLaborOHCost'], 2) : '0.00';
                                        taskData['totalCost'] = labList['totalCost'] ? formatNumberAsGlobalSettingsModule(labList['totalCost'], 2) : '0.00';
                                        taskData['totalCostPerHour'] = labList['totalCostPerHour'] ? formatNumberAsGlobalSettingsModule(labList['totalCostPerHour'], 2) : '0.00';

                                        if (taskData.hours) {
                                            let hours = taskData.hours.toFixed(2);
                                            taskData['totalHours'] = hours.toString().split('.')[0];
                                            taskData['totalMinutes'] = hours.toString().split('.')[1];
                                        }
                                        if (taskData.adjustments) {
                                            let adjustments = taskData.adjustments.toFixed(2);
                                            taskData['adjtotalHours'] = adjustments.toString().split('.')[0];
                                            taskData['ajdtotalMinutes'] = adjustments.toString().split('.')[1];
                                        }
                                        this.labor.workOrderLaborList[0][task.description.toLowerCase()].push(taskData);
                                        break;
                                    }
                                }
                            }
                        }
                        if (this.gridActiveTab === 'billorInvoice') {
                            this.quoteChargesList = this.data['laborList'];
                        }
                    }
                }
            },
                err => {
                    this.workOrderLaborList = [];
                    this.getMarkup();
                    this.handleError(err);
                })
        }
        // setTimeout(() => {
        //    if(Object.keys(this.data).length == 0){
        //     this.getMarkup();
        //    }
        // }, 500);
        if (!this.isSubWorkOrder) {
            if (this.workOrderGeneralInformation.isSinglePN == true) {
                this.labor['employeeId'] = this.workOrderGeneralInformation.partNumbers[0]['technicianId'];
            }
            else {
                this.workOrderGeneralInformation.partNumbers.forEach(pn => {
                    if (pn['id'] == this.workOrderPartNumberId) {
                        this.labor['employeeId'] = pn['technicianId'];
                    }
                })
            }
        }
    }
    markupList: any = [];
    getMarkup(value?) {
        this.setEditArray = [];
        if (this.isEdit == true) {
            // this.setEditArray.push(this.currentAsset.tangibleClassId ? this.currentAsset.tangibleClassId : 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        // this.commonservice.smartDropDownList('[Percent]', 'PercentId', 'PercentValue').subscribe((res) => {
        this.commonService.autoSuggestionSmartDropDownList('[Percent]', 'PercentId', 'PercentValue', strText, true, 0, this.setEditArray.join(), this.authService.currentUser.masterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.markupList = res;
                this.markupList.sort((n1, n2) => n1.label - n2.label);
            }
        }, err => {
            this.errorHandling(err);
        })
    }
    otherOptionTabSelected(value) {
        this.subTabWorkFlow = '';
        this.subTabMainComponent = '';
        this.subTabOtherOptions = '';
        setTimeout(
            () => {
                this.subTabOtherOptions = value;
            },
            0
        )
        if (value === 'charges') {
            this.getChargesListByWorkOrderId();
        } else if (value === 'exclusions') {
            // this.getExclusionListByWorkOrderId();
        } else if (value === 'freight') {
            this.getFreightListByWorkOrderId();
        }
    }

    mainComponentTabSelected(value) {
        this.subTabMainComponent = value;
    }
    chargesDeletedStatus: boolean = false;
    getChargesDeletedStatus(event) {
        this.chargesDeletedStatus = event ? event : false;
        this.getChargesListByWorkOrderId();
    }


    getChargesListByWorkOrderId() {
        if (this.isSubWorkOrder == true) {
            this.isSpinnerVisible = true;
            this.workOrderService.getSubWorkOrderChargesList(this.subWOPartNoId, this.chargesDeletedStatus, this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;

                for (let charge in res) {
                    res[charge]['unitCost'] = res[charge]['unitCost'] ? formatNumberAsGlobalSettingsModule(res[charge]['unitCost'], 2) : '0.00';
                    res[charge]['extendedCost'] = res[charge]['extendedCost'] ? formatNumberAsGlobalSettingsModule(res[charge]['extendedCost'], 2) : '0.00';
                    res[charge]['unitPrice'] = res[charge]['unitPrice'] ? formatNumberAsGlobalSettingsModule(res[charge]['unitPrice'], 2) : '0.00';
                    res[charge]['extendedPrice'] = res[charge]['extendedPrice'] ? formatNumberAsGlobalSettingsModule(res[charge]['extendedPrice'], 2) : '0.00';
                    res[charge]['refNum'] = res[charge]['referenceNo'];
                }
                this.workOrderChargesList = res;
            },
                err => {
                    this.handleError(err);
                })
        } else {

            if (this.workFlowWorkOrderId !== 0 && this.workOrderId) {
                this.isSpinnerVisible = true;
                this.workOrderService.getWorkOrderChargesList(this.workFlowWorkOrderId, this.workOrderId, this.chargesDeletedStatus, this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                    this.isSpinnerVisible = false;

                    for (let charge in res) {
                        res[charge]['unitCost'] = res[charge]['unitCost'] ? formatNumberAsGlobalSettingsModule(res[charge]['unitCost'], 2) : '0.00';
                        res[charge]['extendedCost'] = res[charge]['extendedCost'] ? formatNumberAsGlobalSettingsModule(res[charge]['extendedCost'], 2) : '0.00';
                        res[charge]['unitPrice'] = res[charge]['unitPrice'] ? formatNumberAsGlobalSettingsModule(res[charge]['unitPrice'], 2) : '0.00';
                        res[charge]['extendedPrice'] = res[charge]['extendedPrice'] ? formatNumberAsGlobalSettingsModule(res[charge]['extendedPrice'], 2) : '0.00';
                    }
                    this.workOrderChargesList = res;
                    if (this.gridActiveTab === 'billorInvoice') {
                        this.workOrderChargesList = this.workOrderChargesList;
                    }
                },
                    err => {
                        this.handleError(err);
                    })
            }
        }
    }

    // getExclusionListByWorkOrderId() {
    //     if (this.workFlowWorkOrderId !== 0 && this.workOrderId) {
    //         this.isSpinnerVisible = true;
    //         this.workOrderService.getWorkOrderExclusionsList(this.workFlowWorkOrderId, this.workOrderId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
    //             this.isSpinnerVisible = false;
    //             this.workOrderExclusionsList = res;
    //             for (let charge in this.workOrderExclusionsList) {
    //                 this.workOrderExclusionsList[charge]['unitCost'] = this.workOrderExclusionsList[charge]['unitCost'].toFixed(2);
    //                 this.workOrderExclusionsList[charge]['extendedCost'] = this.workOrderExclusionsList[charge]['extendedCost'].toFixed(2);
    //             }
    //         },
    //             err => {
    //                 this.handleError(err);
    //             })
    //     }
    // }

    // saveWorkOrderExclusionsList(data) {
    //     const exclusionsArr = data.exclusions.map(x => {
    //         return {
    //             ...x,
    //             masterCompanyId: this.authService.currentUser.masterCompanyId,
    //             isActive: true,
    //             createdBy: this.userName,
    //             updatedBy: this.userName,
    //             workOrderId: this.workOrderId, workFlowWorkOrderId: this.workFlowWorkOrderId,
    //             estimtPercentOccurranceId: x.estimtPercentOccurranceId
    //         }
    //     });
    //     this.isSpinnerVisible = true;
    //     this.workOrderService.createWorkOrderExclusionList(exclusionsArr).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
    //         this.isSpinnerVisible = false;
    //         this.workFlowObject.charges = [];
    //         this.alertService.showMessage(
    //             this.moduleName,
    //             'Saved Work Order Exclusions  Succesfully',
    //             MessageSeverity.success
    //         );
    //         // this.getExclusionListByWorkOrderId();
    //     },
    //         err => {
    //             this.isSpinnerVisible = false;
    //             this.errorHandling(err)
    //         })
    // }

    updateWorkOrderExclusionsList(data) {
        const exclusionsArr = data.exclusions.map(x => {
            return {
                ...x,
                masterCompanyId: this.authService.currentUser.masterCompanyId,
                isActive: true,
                createdBy: this.userName,
                updatedBy: this.userName,
                workOrderId: this.workOrderId, workFlowWorkOrderId: this.workFlowWorkOrderId
            }
        });
        this.isSpinnerVisible = true;
        this.workOrderService.updateWorkOrderExclusionList(exclusionsArr).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.isSpinnerVisible = false;
            this.workFlowObject.charges = [];
            this.alertService.showMessage(
                this.moduleName,
                'Update Work Order Exclusions  Succesfully',
                MessageSeverity.success
            );
            // this.getExclusionListByWorkOrderId();
        },
            err => {
                this.isSpinnerVisible = false;
                this.errorHandling(err)
            })
    }
    freightsDeletedStatus: boolean = false;
    getFreightssDeletedStatus(event) {
        this.freightsDeletedStatus = event ? event : false;
        this.getFreightListByWorkOrderId();
    }
    getFreightListByWorkOrderId() {
        this.workOrderFreightList = [];
        if (this.workFlowWorkOrderId !== 0 && this.workOrderId != 0) {
            this.isSpinnerVisible = true;
            this.workOrderService.getWorkOrderFrieghtsList(this.workFlowWorkOrderId, this.workOrderId, this.isSubWorkOrder, this.subWOPartNoId, this.freightsDeletedStatus, this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workOrderFreightList = res;
            },
                err => {
                    this.handleError(err);
                })
        }
    }

    saveWorkOrderFreightsList(data) {
        this.freightsArr = [];
        if (this.isSubWorkOrder == true) {
            this.freightsArr = data.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    isDeleted: false,
                    createdDate: new Date(),
                    updatedDate: new Date(),
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.subWorkOrderDetails.workOrderId,
                    workFlowWorkOrderId: this.workFlowWorkOrderId,
                    estimtPercentOccurranceId: x.estimtPercentOccurrance,
                    subWOPartNoId: this.subWOPartNoId,
                    subWorkOrderId: this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId,
                }
            });
        } else {
            this.freightsArr = data.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    isDeleted: false,
                    createdDate: new Date(),
                    updatedDate: new Date(),
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.workOrderId,
                    workFlowWorkOrderId: this.workFlowWorkOrderId,
                    estimtPercentOccurranceId: x.estimtPercentOccurrance
                }
            });
        }
        this.isSpinnerVisible = true;
        this.workOrderService.createWorkOrderFreightList(this.freightsArr, this.isSubWorkOrder).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.isSpinnerVisible = false;
            this.freight = [];
            this.alertService.showMessage(
                this.moduleName,
                'Saved Work Order Freight  Succesfully',
                MessageSeverity.success
            );
            this.getFreightListByWorkOrderId();
        },
            err => {
                this.handleError(err);
            })
    }

    updateWorkOrderFreightsList(data) {
        this.freightsArr = [];
        if (this.isSubWorkOrder == true) {
            this.freightsArr = data.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    isDeleted: false,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.subWorkOrderDetails.workOrderId,
                    workFlowWorkOrderId: this.workFlowWorkOrderId,
                    estimtPercentOccurranceId: x.estimtPercentOccurrance,
                    subWOPartNoId: this.subWOPartNoId,
                    subWorkOrderId: this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId
                }
            });
            this.isSpinnerVisible = true;
            this.workOrderService.createWorkOrderFreightList(this.freightsArr, this.isSubWorkOrder).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.freight = [];
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    this.moduleName,
                    'Updated Work Order Freight  Succesfully',
                    MessageSeverity.success
                );
                this.getFreightListByWorkOrderId();
            },
                err => {
                    this.handleError(err);
                })
        } else {
            this.freightsArr = data.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    isDeleted: false,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.workOrderId, workFlowWorkOrderId: this.workFlowWorkOrderId,
                    estimtPercentOccurranceId: x.estimtPercentOccurrance
                }
            });
            this.isSpinnerVisible = true;
            this.workOrderService.updateWorkOrderFreightList(this.freightsArr).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.freight = [];
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    this.moduleName,
                    'Updated Work Order Freight  Succesfully',
                    MessageSeverity.success
                );
                this.getFreightListByWorkOrderId();
            },
                err => {
                    this.handleError(err);
                })
        }
    }

    filterPartNumber(event) {
        if (this.partNumberOriginalData != undefined) {
            this.partNumberList = this.partNumberOriginalData;
            if (event.query !== undefined && event.query !== null) {

                const partNumbers = [...this.partNumberOriginalData.filter(x => {
                    return x.partNumber.toLowerCase().includes(event.query.toLowerCase())
                })]
                this.partNumberList = partNumbers;
            } else {
                this.partNumberList = [];
            }
        }
    }

    filterTechnician(event) {
        this.technicianList = this.technicianByExpertiseTypeList;
        if (this.technicianByExpertiseTypeList != undefined && this.technicianByExpertiseTypeList != '') {
            if (this.technicianByExpertiseTypeList && this.technicianByExpertiseTypeList.length != 0) {
                if (event.query !== undefined && event.query !== null) {
                    const technician = [...this.technicianByExpertiseTypeList.filter(x => {
                        return x.name.toLowerCase().includes(event.query.toLowerCase())
                    })]
                    this.technicianList = technician;
                }
            }
        }
        else {
            this.commonService.getExpertise(this.currentUserMasterCompanyId).subscribe(res => {
                res.map(x => {
                    if (x.empExpCode == 'TECHNICIAN' || x.empExpCode == 'Technician' || x.description == 'TECHNICIAN' || x.description == 'Technician') {
                        this.commonService.getExpertiseEmployeesByCategory(x.employeeExpertiseId, this.currentUserMasterCompanyId).subscribe(res => {
                            this.technicianByExpertiseTypeList = res;
                            this.technicianList = this.technicianByExpertiseTypeList;
                            if (this.technicianByExpertiseTypeList && this.technicianByExpertiseTypeList.length != 0) {
                                if (event.query !== undefined && event.query !== null) {
                                    const technician = [...this.technicianByExpertiseTypeList.filter(x => {
                                        return x.name.toLowerCase().includes(event.query.toLowerCase())
                                    })]
                                    this.technicianList = technician;
                                }
                            }
                        })
                    }
                });
            })
        }
    }

    saveWorkOrderBilling(object) {
        const data = {
            ...object,
            ...this.loginDetailsForCreate,
            workOrderId: this.workOrderId,
            workFlowWorkOrderId: this.workFlowWorkOrderId,
            workOrderPartNoId: this.workOrderPartNumberId,
            itemMasterId: this.workOrderPartNumberId,
            customerId: editValueAssignByCondition('customerId', this.savedWorkOrderData.customerId),
            employeeId: editValueAssignByCondition('value', this.savedWorkOrderData.employeeId),
            soldToCustomerId: editValueAssignByCondition('customerId', object.soldToCustomerId),
            shipToCustomerId: editValueAssignByCondition('customerId', object.shipToCustomerId),
            invoiceTime: moment(object.invoiceTime, ["h:mm A"]).format("HH:mm")
        }

        if (this.isEditBilling) {
            this.isSpinnerVisible = true;
            this.workOrderService.updateBillingByWorkOrderId(data).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    this.moduleName,
                    'Updated Work Order Billing Succesfully',
                    MessageSeverity.success
                );
            },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err)
                })
        } else {
            this.isSpinnerVisible = true;
            this.workOrderService.createBillingByWorkOrderId(data).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    this.moduleName,
                    'Saved Work Order Billing Succesfully',
                    MessageSeverity.success
                );
            },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err)
                })
        }
    }

    billingCreateOrEdit() {
        this.isSpinnerVisible = true;
        this.workOrderService.getBillingEditData(this.workOrderId, this.workOrderPartNumberId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.isSpinnerVisible = false;
            if (res['response'] == 'Invoice not created for this Work Order MPN') {
                this.isbillingNotCreated = true;
            } else {
                this.isbillingNotCreated = false;
            }
            if (res['response']) {
                this.getWorkOrderDetailsFromHeader();
            }
            else {
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
                    shipAccountInfo: res.shippingAccountinfo,
                }
                this.isEditBilling = true;
            }
        }, error => {
            this.isSpinnerVisible = false;
            this.getWorkOrderDetailsFromHeader();
            this.errorHandling(error);
        })
    }

    getWorkOrderDetailsFromHeader() {
        this.isSpinnerVisible = true;
        this.workOrderId = this.isSubWorkOrder ? this.subWorkOrderDetails.workOrderId : this.workOrderId;
        this.workOrderService.viewWorkOrderHeader(this.workOrderId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.isSpinnerVisible = false;
            const data = res;
            this.billing = new Billing();
            this.billing = {
                ...this.billing,
                customerRef: data.customerReference,
                employeeName: data.employee,
                woOpenDate: new Date(data.openDate),
                salesPerson: data.salesperson,
                woType: data.workOrderType,
                creditTerm: data.creditTerm,
                workScope: data.workScope,
                managementStructureId: data.managementStructureId,
                soldToCustomerId: { customerId: this.workOrderGeneralInformation.customerId.customerId, customerName: this.workOrderGeneralInformation.customerId.customerName },
                shipToCustomerId: { customerId: this.workOrderGeneralInformation.customerId.customerId, customerName: this.workOrderGeneralInformation.customerId.customerName },
            }
        },
            err => {
                this.handleError(err);
            })
    }

    getQuoteIdByWfandWorkOrderId() {
        this.isSpinnerVisible = true;
        if (this.workFlowWorkOrderId && this.workOrderId) {
            this.quoteService.getQuoteIdByWfandWorkOrderId(this.workFlowWorkOrderId, this.workOrderId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerVisible = false;
                if (res) {
                    this.quoteData = res;
                    this.workOrderQuoteId = res.quoteDetailId;
                    this.quoteService.getSavedQuoteDetails(this.workFlowWorkOrderId, this.currentUserMasterCompanyId)
                        .subscribe(
                            res => {
                                if (this.quotestatusofCurrentPart == "Approved") {
                                    this.getQuoteIdByWfandWorkOrderId();
                                    this.buildMethodDetails = res;
                                    this.getQuoteCostingData(res['buildMethodId']);
                                } else {
                                    // for billling details 
                                    this.quotestatusofCurrentPart = "NotApproved"
                                    // this.getMaterialListByWorkOrderId();
                                    //new one
                                    this.getNewMaterialListByWorkOrderId();
                                    this.getChargesListByWorkOrderId();
                                    this.getWorkFlowLaborList();
                                }
                            }
                        )
                }
            },
                err => {
                    this.handleError(err);
                })
        }
    }

    getQuoteCostingData(buildMethodId) {
        this.getQuoteMaterialListByWorkOrderQuoteId(buildMethodId);
        this.getQuoteFreightsListByWorkOrderQuoteId(buildMethodId);
        this.getQuoteChargesListByWorkOrderQuoteId(buildMethodId);
        this.getQuoteLaborListByWorkOrderQuoteId(buildMethodId);
    }

    async getQuoteMaterialListByWorkOrderQuoteId(buildMethodId) {
        this.isSpinnerVisible = true;
        await this.quoteService.getQuoteMaterialList(this.workOrderQuoteId, buildMethodId, this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.isSpinnerVisible = false;
            this.quoteMaterialList = res;
        },
            err => {
                this.handleError(err);
            })
    }

    async getQuoteFreightsListByWorkOrderQuoteId(buildMethodId) {
        this.isSpinnerVisible = true;
        await this.quoteService.getQuoteFreightsList(this.workOrderQuoteId, buildMethodId, this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.isSpinnerVisible = false;
            this.quoteFreightsList = res;
        },
            err => {
                this.handleError(err);
            })
    }

    async getQuoteChargesListByWorkOrderQuoteId(buildMethodId) {
        this.isSpinnerVisible = true;
        await this.quoteService.getQuoteChargesList(this.workOrderQuoteId, buildMethodId, this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.isSpinnerVisible = false;
            this.quoteChargesList = res;
        },
            err => {
                this.handleError(err);
            })
    }

    async getQuoteLaborListByWorkOrderQuoteId(buildMethodId) {
        this.isSpinnerVisible = true;
        await this.quoteService.getQuoteLaborList(this.workOrderQuoteId, buildMethodId, this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.isSpinnerVisible = false;
            if (res) {
                let wowfId = this.workFlowWorkOrderId;
                if (res) {
                    let laborList = this.labor.workOrderLaborList;
                    this.quoteLaborList = { ...res, workOrderLaborList: laborList };
                    this.quoteLaborList.dataEnteredBy = getObjectById('value', res.dataEnteredBy, this.employeeList);
                    this.quoteLaborList.workFlowWorkOrderId = wowfId;
                    if (!this.quoteLaborList.workOrderLaborList[0]) {
                        this.quoteLaborList.workOrderLaborList = [{}]
                    }
                    this.taskList.forEach((tl) => {
                        this.quoteLaborList.workOrderLaborList[0][tl['description'].toLowerCase()] = [];
                        res.laborList.forEach((rt) => {
                            if (rt['taskId'] == tl['taskId']) {
                                let labor = {}
                                if (rt.hours) {
                                    let hours = rt.hours.toFixed(2);
                                    rt.totalHours = hours.toString().split('.')[0];
                                    rt.totalMinutes = hours.toString().split('.')[1];
                                }

                                if (rt.adjustments) {
                                    let adjustments = rt.adjustments.toFixed(2);
                                    rt.adjtotalHours = adjustments.toString().split('.')[0];
                                    rt.ajdtotalMinutes = adjustments.toString().split('.')[1];
                                }
                                labor = { ...rt, employeeId: { 'label': rt.employeeName, 'value': rt.employeeId } }
                                this.quoteLaborList.workOrderLaborList[0][tl['description'].toLowerCase()].push(labor);
                            }
                        })
                    })
                }
            }
            else {
                this.taskList.forEach((tl) => {
                    this.quoteLaborList['workOrderLaborList'] = [{}];
                    this.quoteLaborList.workOrderLaborList[0][tl['description'].toLowerCase()] = [];
                });
            }

        },
            err => {
                this.handleError(err);
            })
    }


    getWorkOrderQuoteDetail(workOrderId, workFlowWorkOrderId) {
        this.isSpinnerVisible = true;
        this.quoteService.getWorkOrderQuoteDetail(workOrderId, workFlowWorkOrderId, this.currentUserMasterCompanyId)
            .pipe(takeUntil(this.onDestroy$)).subscribe(
                (res: any) => {
                    this.isSpinnerVisible = false;
                    if (res) {
                        this.workOrderQuoteId = res.workOrderQuote.workOrderQuoteId;
                    }
                },
                err => {
                    this.handleError(err);
                }
            )
    }

    async getPartNosByCustomer(customerId, workOrderId) {
        await this.workOrderService.getPartNosByCustomer(customerId, workOrderId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            if (res && res.length != 0) {
                this.partNumberOriginalData = res;
            } else {
                this.partNumberOriginalData = [];
            }
            if (this.partNumberOriginalData.length > 0) {
                for (let i = 0; i < this.partNumberOriginalData.length; i++) {
                    if (this.salesOrderReferenceData && this.partNumberOriginalData[i].itemMasterId == this.salesOrderReferenceData.itemMasterId) {
                        this.masterParterIdForSalesOrderReference = this.partNumberOriginalData[i];
                        this.onSelectedPartNumber(this.masterParterIdForSalesOrderReference, this.workOrderGeneralInformation.partNumbers[0], 0, 'onload')
                    }
                }
            }
        });
    }

    async getMultiplePartsNumbers() {
        await this.workOrderService.getMultipleParts(this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.partNumberOriginalData = res;
        },
            err => {
                this.handleError(err);
            })
    }

    getWorkOrderDatesFoRTat() {
        this.workOrderId = this.workOrderGeneralInformation ? this.workOrderGeneralInformation.workOrderId : this.workOrderId;
        if (this.workOrderId) {
            this.workOrderService.getWorkOrderDatesFoRTat(this.workOrderId, this.currentUserMasterCompanyId)
                .pipe(takeUntil(this.onDestroy$)).subscribe(
                    (res: any) => {
                        if (res) {
                            this.quoteCreatedDate = res;

                        }
                    },
                    err => {
                        this.handleError(err);
                    }
                )
        }
    }

    calculatePartTat(workOrderPart) {
        const data = this.workOrderGeneralInformation
        let currentdate: any = new Date();
        if (data.shippedDate != null) {
            this.days1 = moment(data.sentDate).diff(workOrderPart.receivedDate, 'days');
            this.days2 = moment(data.shippedDate).diff(data.approvedDate, 'days');
            workOrderPart.tatDaysCurrent = this.days1 + this.days2;
        } else if (data.shippedDate == null && data.approvedDate != null) {
            this.days1 = moment(data.sentDate).diff(workOrderPart.receivedDate, 'days');
            this.days2 = moment(currentdate).diff(data.approvedDate, 'days');
            workOrderPart.tatDaysCurrent = this.days1 + this.days2;
        } else if (data.shippedDate == null && data.approvedDate == null && data.sentDate != null) {
            this.days1 = moment(data.sentDate).diff(workOrderPart.receivedDate, 'days');
            workOrderPart.tatDaysCurrent = this.days1 > 0 ? this.days1 : 0;
        } else {
            workOrderPart.tatDaysCurrent = moment(currentdate).diff(workOrderPart.receivedDate, 'days');;
        }
    }

    filterCustContacts(event) {
        this.customerContactInfo = this.customerContactList;

        if (event.query !== undefined && event.query !== null) {
            const customers = [...this.customerContactList.filter(x => {
                return x.customerContact.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.customerContactInfo = customers;
        }
    }

    getAllCustomerContact(id, type) {
        this.commonService.getCustomerContactsById(id, this.currentUserMasterCompanyId).subscribe(res => {
            this.customerContactList = res.map(x => {
                return {
                    ...x,
                    workPhone: `${x.workPhone} ${x.workPhoneExtn}`,
                    customerContact: x.name
                }
            });
            if (this.isSubWorkOrder == false) {
                const isDefaultContact = this.customerContactList.filter(x => {
                    if (x.isDefaultContact === true) {
                        return x;
                    } else return x;
                })
                if (type == 'edit') {
                    this.myCustomerContact = this.workOrderGeneralInformation.customerDetails;
                    this.workOrderGeneralInformation.customerPhoneNo = this.workOrderGeneralInformation.customerDetails.customerPhone;
                } else {
                    this.myCustomerContact = isDefaultContact[0];
                    this.workOrderGeneralInformation.customerPhoneNo = isDefaultContact[0].workPhone;
                }
            }
        },
            err => {
                this.handleError(err);
            });
    }

    onSelectCustomerContact(value) {
        this.workOrderGeneralInformation.customerPhoneNo = value.workPhone;
        this.myCustomerContact = value;
    }

    onClickQuoteTab() {
        this.isQuoteAction = true;
        this.hideWOHeader = true;
        const element = document.querySelector('mat-sidenav-content') || window;
        element.scrollTo(0, 0);
    }

    enableBackToWO(event) {
        this.hideWOHeader = false;
        this.gridActiveTab = 'workFlow';
        this.gridTabChange('materialList');
        const element = document.querySelector('mat-sidenav-content') || window;
        element.scrollTo(0, 0);
    }

    getCustomerWarningsList(): void {
        const strText = ''
        this.commonService.autoSuggestionSmartDropDownList('CustomerWarningType', 'CustomerWarningTypeId ', 'Name', strText, true, 0, this.setEditArray.join(), 0).subscribe(res => {
            // this.commonService.smartDropDownList('CustomerWarningType', 'CustomerWarningTypeId ', 'Name').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            res.forEach(element => {
                if (element.label == 'Create WO for MPN') {
                    this.customerWarningListId = element.value;
                    return;
                } else if (element.label == 'Create WO Quote for MPN') {
                    this.createQuoteListID = element.value;
                } else if (element.label == 'Create WO Billing for PMN') {
                    this.customerBillingListID = element.value;
                }

            });
            if (this.enumcall = true) {
                if (this.workOrderGeneralInformation.customerDetails && this.workOrderGeneralInformation.customerDetails.customerId) {
                    this.customerWarnings(this.workOrderGeneralInformation.customerDetails.customerId);
                }
                if (!this.isEdit && this.workOrderGeneralInformation.customerId && this.workOrderGeneralInformation.customerId.customerId) {
                    this.customerWarnings(this.workOrderGeneralInformation.customerId.customerId);
                }

            }
        },
            err => {
                this.handleError(err);
            })
    }

    customerWarnings(customerId) {
        if (this.customerWarningListId == undefined) {
            this.getCustomerWarningsList();
            this.enumcall = true;
        } else {
            this.enumcall = false;
            if (customerId && this.customerWarningListId && this.isCustomerAction) {
                this.warningMessage = '';
                this.validateWarnings(customerId, this.customerWarningListId);
            }
            else if (customerId && this.createQuoteListID && this.isQuoteAction) {
                this.warningMessage = '';
                this.validateWarnings(customerId, this.createQuoteListID);
            }
            else if (customerId && this.customerBillingListID && this.isBillAction) {
                this.warningMessage = '';
                this.validateWarnings(customerId, this.customerBillingListID);
            } else if (customerId && this.createQuoteListID && this.isQuoteActionTab) {
                this.warningMessage = '';
                this.validateWarnings(customerId, this.customerBillingListID);
            } else if (customerId && this.customerWarningListId && this.isEditWorkordershowMsg) {
                this.warningMessage = '';
                this.validateWarnings(customerId, this.customerWarningListId);
                this.restrictID = 0;
            }
        }
    }

    validateWarnings(customerId, id) {
        let cusId = (customerId.customerId) ? customerId.customerId : customerId;
        this.commonService.customerWarnings(cusId, id, this.currentUserMasterCompanyId).subscribe((res: any) => {
            if (res) {
                this.currentWarningMessage = res.warningMessage;
                this.warningMessage = res.warningMessage;
                this.warningID = res.customerWarningId;
                if (this.isEditWorkordershowMsg == true && res.customerWarningId != 0) {
                    this.showAlertMessage();
                } else {
                    if (!this.isView) {
                        this.customerResctrictions(customerId, this.warningMessage, id);
                    }
                }
            }
        },
            err => {
                this.handleError(err);
            })
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
                } else if (this.warningID == 0 && this.restrictID == 0) {
                    if (this.isQuoteAction == true) {
                        // window.open(`/workordersmodule/workorderspages/app-work-order-quote?workorderid=${this.workOrderId}`);

                        this.router.navigateByUrl(
                            `workordersmodule/workorderspages/app-work-order-quote?workorderid=${this.workOrderId}`
                        );
                    }
                    if (this.isQuoteActionTab == true) {
                        this.onClickQuoteTab();
                    }
                    if (this.isBillAction == true) {

                    }
                    this.isBillAction = false;
                    this.isQuoteAction = false;
                    this.isCustomerAction = false;
                }
            }
        },
            err => {
                this.handleError(err);
            })
    }

    showAlertMessage() {
        if (!this.isView && !this.workOrderQuoteId) {
            $('#warnRestrictMesg').modal("show");
        }
    }
    showAlertWarningMessage() {
        $('#warningMesg').modal("show");
    }

    movetoworkorderlist() {
        $('#warningMesg').modal("hide");
        $('#warnRestrictMesg').modal("show");
        this.router.navigateByUrl(
            `/workordersmodule/workorderspages/app-work-order-list`
        );
    }

    yestocontinue() {
        $('#warningMesg').modal("hide");
        $('#warnRestrictMesg').modal("show");
        this.isBillAction = false;
        this.isQuoteAction = false;
        this.isCustomerAction = false;
        this.isEditWorkordershowMsg = false;
        this.warningMessage = '';
        this.restrictMessage = '';
    }

    WarnRescticModel() {
        if (this.isQuoteAction == true && this.restrictID == 0) {
            // window.open(`/workordersmodule/workorderspages/app-work-order-quote?workorderid=${this.workOrderId}`);
            this.router.navigateByUrl(
                `workordersmodule/workorderspages/app-work-order-quote?workorderid=${this.workOrderId}`
            );

        }
        else if (this.isCustomerAction == true && this.restrictID != 0) {
            this.workOrderGeneralInformation.customerId = null;
            this.myCustomerContact = null;
            this.workOrderGeneralInformation.customerPhoneNo = null;
        }
        this.isBillAction = false;
        this.isQuoteAction = false;
        this.isCustomerAction = false;
        this.isEditWorkordershowMsg = false;
        $('#warnRestrictMesg').modal("hide");
        $('#warningMesg').modal("hide");
        this.warningMessage = '';
        this.restrictMessage = '';
    }

    getShipViaDetails(id) {
        this.sourcePoApproval.shippingAcctNum = null;
        var userType = this.sourcePoApproval.shipToUserTypeId ? parseInt(this.sourcePoApproval.shipToUserTypeId) : 0;
        if (id != 0 && id != null) {
            this.isSpinnerVisible = true;
            this.commonService.getShipViaDetailsById(id, userType, this.currentUserMasterCompanyId).subscribe(res => {
                this.isSpinnerVisible = false;
                const responseData = res;
                this.sourcePoApproval.shippingAcctNum = responseData.shippingAccountInfo;
                this.sourcePoApproval.shipVia = responseData.shipVia;
                this.sourcePoApproval.shipViaId = responseData.shippingViaId;
            },
                err => {
                    this.handleError(err);
                })
        }
    }
    enableAddSave() {
        this.enableAddSaveBtn = true;
    }
    errorHandling(err) {
        this.handleError(err);
    }

    handleError(err) {
        this.isSpinnerVisible = false;
    }
    onAddDescription(value) {
        this.disableForMemo = true;
        this.type = value;
        this.tempMemo = "";
        if (value == 1) {
            this.tempMemo = this.workOrderGeneralInformation.notes;
        } else {
            this.tempMemo = this.workOrderGeneralInformation.memo;
        }
    }
    onSaveDescription() {
        if (this.type == 1) {
            this.workOrderGeneralInformation.notes = this.tempMemo;
        } else {
            this.workOrderGeneralInformation.memo = this.tempMemo;
        }
        this.disableSaveForEdit = false;
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
    getValid() {
        this.disableSaveForPart = false;
    }
    filterCsr(event) {
        this.csrList = this.csrOriginalList;
        if (event.query !== undefined && event.query !== null) {
            const csr = [...this.csrOriginalList.filter(x => {
                return x.name.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.csrList = csr;
        }
    }
    filterEmployee(event): void {
        if (event.query !== undefined && event.query !== null) {
            this.getAllEmployees(event.query)
        } else {
            this.getAllEmployees('');
        }
    }
    filterSalesPerson(event): void {
        this.salesPersonList = this.salesAgentsOriginalList;
        if (event.query !== undefined && event.query !== null) {
            const salesPerson = [...this.salesAgentsOriginalList.filter(x => {
                return x.name.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.salesPersonList = salesPerson;
        }
    }
    getAllEmployees(value) {
        this.setEditArray = [];
        if (this.isEdit == true) {
            this.setEditArray.push(this.workOrderGeneralInformation.employeeId ? this.workOrderGeneralInformation.employeeId.value : 0);
            if (this.workOrderGeneralInformation.partNumbers && this.workOrderGeneralInformation.partNumbers.length != 0) {
                this.msId = this.workOrderGeneralInformation.partNumbers[0].managementStructureId;
            }

        } else {
            this.setEditArray.push(0);
            this.msId = this.authService.currentUser
                ? this.authService.currentUser.managementStructureId
                : null;
        }
        if (this.setEditArray.length == 0) {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.setEditArray.join(), this.msId, this.currentUserMasterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.employeesOriginalData = res.map(x => {
                    return {
                        ...x,
                        employeeId: x.value,
                        name: x.label
                    }
                });
                this.employeeList = this.employeesOriginalData;
            }
        })
    }
    getAllWorkScpoes(value,currentRecord,index): void {
        this.setEditArray = [];
        if (this.isEdit == true) {
            this.workOrderGeneralInformation.partNumbers.forEach(element => {
                if (element.workOrderScopeId) {
                    this.setEditArray.push(element.workOrderScopeId)
                }
            });
            if (this.setEditArray && this.setEditArray.length == 0) {
                this.setEditArray.push(0);
            }
        } else {
            this.setEditArray.push(0);
        } 
        const strText = '';

  this.commonService.autoSuggestionSmartDropDownList('WorkScope', 'WorkScopeId', 'WorkScopeCode', strText, true, 20, this.setEditArray.join(), this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.workScopesList = res;
            // this['dynamicworkScopesList'+index] = []
            // this['dynamicworkScopesList'+index] = this.workScopesList;
        });

        // this.commonService.autoCompleteDropdownsWorkScopeByItemMasterCaps(strText, currentRecord.masterPartId.itemMasterId, currentRecord.masterPartId.managementStructureId, 20, this.setEditArray.join(), this.authService.currentUser.masterCompanyId).subscribe(res => {
        //     this.workScopesList = res;
        //     this['dynamicworkScopesList'+index] = []
        //     this['dynamicworkScopesList'+index] = this.workScopesList;
        // });
    }
    getConditionsList(value) {
        this.setEditArray = [];
        if (this.isEdit == true) {
            this.workOrderGeneralInformation.partNumbers.forEach(element => {
                if (element.conditionId) {
                    this.setEditArray.push(element.conditionId)
                }
            });
            if (this.setEditArray && this.setEditArray.length == 0) {
                this.setEditArray.push(0);
            }
        } else {
            this.setEditArray.push(0);
        }
        const strText = '';
        this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description', strText, true, 20, this.setEditArray.join(), this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.conditionList = res;
        })
    }
    getAllTecStations(value) {
        this.setEditArray = [];
        if (this.isEdit == true) {
            this.workOrderGeneralInformation.partNumbers.forEach(element => {
                if (element.partTechnicianId) {
                    this.setEditArray.push(element.partTechnicianId.employeeId)
                }
            });
            if (this.setEditArray && this.setEditArray.length == 0) {
                this.setEditArray.push(0);
            }
        } else {
            this.setEditArray.push(0);
        }
        const strText = '';
        this.commonService.autoSuggestionSmartDropDownList('EmployeeStation', 'EmployeeStationId', 'StationName', strText, true, 20, this.setEditArray.join(), this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.techStationList = res.map(x => {
                return {
                    ...x,
                    techStationId: x.value,
                    name: x.label
                }
            });
        })
    }
    getAllPriority(value) {
        this.setEditArray = [];
        if (this.isEdit == true) {
            this.workOrderGeneralInformation.partNumbers.forEach(element => {
                if (element.workOrderPriorityId) {
                    this.setEditArray.push(element.workOrderPriorityId)
                }
            });
            if (this.setEditArray && this.setEditArray.length == 0) {
                this.setEditArray.push(0);
            }
        } else {
            this.setEditArray.push(0);
        }
        const strText = '';
        this.commonService.autoSuggestionSmartDropDownList('Priority', 'PriorityId', 'Description', strText, true, 20, this.setEditArray.join(), this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.priorityList = res;
        })
    }

    getTaskList() {
        if (this.labor == undefined) {
            this.labor = new WorkOrderLabor()
        }
        this.labor.workOrderLaborList = [];
        this.labor.workOrderLaborList.push({})
        const strText = '';
        this.commonService.autoSuggestionSmartDropDownList('Task', 'TaskId', 'Description', strText, true, 20, this.setEditArray.join(), this.authService.currentUser.masterCompanyId).subscribe(res => {
            // this.commonService.smartDropDownList('Task', 'TaskId', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.taskList = res.map(x => {
                return {
                    id: x.value,
                    description: x.label.toLowerCase(),
                    taskId: x.value,
                    label: x.label.toLowerCase(),
                }
            });
            this.taskList = this.taskList.sort((a, b) => a.description.localeCompare(b.description, 'es', { sensitivity: 'base' }))
            if (this.labor.workOrderLaborList && this.labor.workOrderLaborList.length != 0) {
                this.labor.workOrderLaborList[0] = {}
            }
            this.taskList.forEach(task => {
                if (this.labor.workOrderLaborList && this.labor.workOrderLaborList.length != 0) {
                    this.labor.workOrderLaborList[0][task.description.toLowerCase()] = [];
                }
            })
        },
            err => {
                this.handleError(err);
            })
    }

    memoValidate() {
        this.disableForMemo = false;
    }

    onWorkOrderPrintLoadEvent() {

    }

    doSomething(currentDate, workOrderPart, index) {
        if (currentDate > workOrderPart.estimatedShipDate) {
            this.alertService.showMessage(
                this.moduleName,
                'Selected ESt. Completion Date is greater than ESt. Ship Date. So, ESt. Ship Date also reset.',
                MessageSeverity.warn
            );
            this.workOrderGeneralInformation.partNumbers[index].estimatedShipDate = currentDate;
        }
    }
    createNewRoWorkOrder(rowData) {
        if (this.isSubWorkOrder == true) {
            // window.open(`/vendorsmodule/vendorpages/workorder-ro-create/${0}/${0}/${0}/${0}/${this.subWOPartNoId}`)

            this.router.navigateByUrl(
                `vendorsmodule/vendorpages/workorder-ro-create/${0}/${0}/${0}/${0}/${this.subWOPartNoId}`
            );
        } else {
            // window.open(`/vendorsmodule/vendorpages/workorder-ro-create/${0}/${rowData.id}`)

            this.router.navigateByUrl(
                `vendorsmodule/vendorpages/workorder-ro-create/${0}/${rowData.id}`
            );
        }
    }
    woPartId: any;
    currentWorkflowId: any;
    addToExitRoWorkOrder(rowData) {
        this.woPartId = rowData.id;
    }
    viewWorkflow(workOrderPartNumber) {
        this.currentWorkflowId = workOrderPartNumber.workflowId;
    }
    currentcmmId:any;
    viewCmm(workOrderPartNumber){
        this.currentcmmId=undefined;
        this.currentcmmId=workOrderPartNumber.cMMId;
    }     
    workflowTransfer:any={};
    currentRowIndex:any;
    tranferCheckbox(ev,currentRecord,currentIndex){
        this.currentRowIndex=currentIndex;
        if (ev.target.checked) {
            $('#workFlowTransfer').modal('show');
        } else {
            $('#workFlowTransfer').modal('show');
        }
        this.workFlowId = currentRecord.workflowId;
        this.workOrderId = this.workOrderId ? this.workOrderId : currentRecord.workOrderId;

        this.workOrderService.GetWorkflowtranserData(currentRecord.itemMasterId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.workflowTransfer.Material = res.material
            this.workflowTransfer.Labor = res.labor
            this.workflowTransfer.Tools = res.tools
            this.workflowTransfer.Charges = res.charges


            //const workOrderData = res;

        })

    }
    taskComletedByConfirmation(ev) {

    }

    transferWorkflow() {
        $('#workFlowTransfer').modal('hide');
        const newArray: any = [];

        if (this.workflowTransfer.Material) {
            newArray.push('Materials')
        } if (this.workflowTransfer.Labor) {
            newArray.push('Labor')
        } if (this.workflowTransfer.Tools) {
            newArray.push('Tools')
        } if (this.workflowTransfer.Charges) {
            newArray.push('Charges')
        }

        const data: any = {};
        data.list = newArray.toString()
        data.workOrderId = this.workOrderId;
        data.workflowId = this.workFlowId;
        data.masterCompanyId = this.currentUserMasterCompanyId;
        data.workOrderPartNumberId = this.workOrderPartNumberId;
        data.createdBy = this.userName;
        data.createdById = this.authService.currentEmployee.employeeId;
        this.workOrderService.transferWorkflow(data).subscribe(res => {
            this.workOrderGeneralInformation.partNumbers[this.currentRowIndex].isWorkflowTranfer = true;
            this.showWaringForWorkflow();

            this.reloadPageForWorkflow();


            this.alertService.showMessage(
                this.moduleName,
                'Transfered WorkflowData to Work Order',
                MessageSeverity.success
            );
        });
    }
    reloadPageForWorkflow() {
        this.transferWorkflowData = false;
        if (this.gridActiveTab == 'materialList') {
            this.getNewMaterialListByWorkOrderId();
        } else if (this.gridActiveTab == 'labor') {
            this.getWorkFlowLaborList();
        }
        else if (this.gridActiveTab == 'equipment') {

            this.transferWorkflowData = true;
            this.gridActiveTab = '';
            this.isSubWorkOrder = true;
            this.isSubWorkOrder = false;
            this.gridActiveTab = 'equipment';
        } else if (this.subTabOtherOptions && this.subTabOtherOptions == 'charges') {

            this.getChargesListByWorkOrderId();
        }
    }
    transferWorkflowData: boolean = false;
    closeTranferFlow() {

        if (this.workflowTransfer.Material || this.workflowTransfer.Labor || this.workflowTransfer.Tools || this.workflowTransfer.Charges) {
            this.workOrderGeneralInformation.partNumbers[this.currentRowIndex].isWorkflowTranfer = true;
        }
        else {
            this.workOrderGeneralInformation.partNumbers[this.currentRowIndex].isWorkflowTranfer = false;
        }

        $('#workFlowTransfer').modal('hide');
    }
    publicatonExpirationDate: any;
    showWaringForWorkflow() {
        if (!this.isView) {
            setTimeout(() => {
                this.workOrderGeneralInformation.partNumbers.map((x, index) => {
                    if (x.workflowExpirationDate) {
                        //if(  moment(x.workflowExpirationDate).format('MM/DD/YYYY')   <  moment(this.currentDate).format('MM/DD/YYYY')){
                        if ((new Date(x.workflowExpirationDate)) < (new Date())) {
                            // this.removeWorkflow(x,index);
                            x.disabledForWorkflow = true;
                            setTimeout(() => {
                                // x.workflowId=0;
                                this.disableSaveForPart = false;
                                this.workflowNumber = x.workFlowNo;
                            }, 2000);
                            $('#warningForCmmWorkflow').modal('show');
                            // this.expriryarray.push(x);

                        }
                    }
                });
            }, 5000);
        }
    }
    isShowSummary: boolean = false;
    summaryShow() {
        this.isShowSummary = true;
    }
    publicationNo: any;
    workflowNumber: any;
    isPublicationExpired:boolean=false;
    showWaringForPublication() {
        if (!this.isView) {
            setTimeout(() => {
                this.workOrderGeneralInformation.partNumbers.map((x, index) => {
                    if (x.publicatonExpirationDate) {
                        if ((new Date(x.publicatonExpirationDate)) < (new Date())) {
                            setTimeout(() => {
                                this.disableSaveForPart = false;
                            }, 2000);
                            this.isPublicationExpired=true;
                            this.publicationNo = x.publicationNo;
                            $('#warningForCmmPublication').modal('show');
                        }
                    }
                });
            }, 5000);
        }
    }
}