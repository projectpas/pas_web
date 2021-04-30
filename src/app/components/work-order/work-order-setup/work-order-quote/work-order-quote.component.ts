import { SalesQuote } from './../../../../models/sales/SalesQuote.model';
import { Component, Input, OnInit, ChangeDetectorRef, OnChanges, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import {WorkOrderQuote,multiParts,partsDetail} from '../../../../models/work-order-quote.modal';
import { MenuItem } from 'primeng/api';
import { WorkOrderQuoteService } from '../../../../services/work-order/work-order-quote.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CommonService } from '../../../../services/common.service';
import { WorkFlowtService } from '../../../../services/workflow.service';
import { CurrencyService } from '../../../../services/currency.service';
import { ConditionService } from '../../../../services/condition.service';
import { UnitOfMeasureService } from '../../../../services/unitofmeasure.service';
import { AuthService } from '../../../../services/auth.service';
import { PurchaseOrderService } from '../../../../services/purchase-order.service';
declare var $ : any;
import {AlertService, MessageSeverity} from '../../../../services/alert.service';
import {WorkOrderLabor,AllTasks,WorkOrderQuoteLabor,ExclusionQuote,ChargesQuote,QuoteMaterialList,QuoteFreightList} from '../../../../models/work-order-labor.modal';
import { getObjectById, formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { DBkeys } from '../../../../services/db-Keys';
import { ApprovalProcessEnum } from "../../../sales/quotes/models/approval-process-enum";
import { ApprovalStatusEnum, ApprovalStatusDescirptionEnum } from "../../../sales/quotes/models/approval-status-enum";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AuditComponentComponent } from '../../../../shared/components/audit-component/audit-component.component';
@Component({
    selector: 'app-work-order-quote',
    templateUrl: './work-order-quote.component.html',
    styleUrls: ['./work-order-quote.component.scss']
})

export class WorkOrderQuoteComponent implements OnInit, OnChanges {
    @Input() quoteForm: WorkOrderQuote;
    @Input() quoteListViewData: any = {};
    @Input() workorderid: number = 0;
    @Input() isView: boolean = false;
    @Input() hidehistoricalBtns: boolean = false;
    
    @Input() enableEditBtn: boolean = false;
    @Input() ispop: boolean = false;
    @Input() isQuoteListView: boolean = false;
    @Input() customerId: any;
    @Input() selectedDisplayType: string = '';
    @Input() isWoTab: boolean = false;
    @Input() isListView: boolean = false;
    customerName: string;
    creditLimit: any;
    creditTerms: any;
    customerCode: any;
    customerEmail: string;
    customerPhone: number;
    customerContact: string;
    customerRef: any;
    quoteDueDate: Date = new Date();
    isDetailedViewQuote: boolean;
    validFor: number;
    expirationDate: Date;
    sentDate: Date;
    approvedDate: Date;
    isEditMode:boolean =false;
    isapprove:boolean =true;
    isrejected:boolean =true;
    quoteStatus: string;
    woNum: string;
    creditTerm: any;
    salesPerson: string;
    csr: any;
    breadcrumbs: MenuItem[];
    employeeName: any;
    currency: any = '';
    workOrderNumber: string;
    mpnPartNumbersList: any[];
    selectedPartNumber: string = "";
    dso: string;
    moduleName: string;
    workOrderPartsDetail: partsDetail[];
    selectedBuildMethod: string = "";
    buildWorkOrderList: any[];
    buildHistoricalList: any[];
    gridActiveTab: string="materialList";
    quotationHeader: any;
    materialListQuotation: any[];
    chargesQuotation: any[];
    exclusionsQuotation: any[];
    laborQuotation: any[];
    selectedWorkFlowOrWorkOrder: any;
    workOrderLaborList: any;
    labor = new WorkOrderLabor();
    taskList: any;
    currencyList: any[];
    statusList: any = [];
    savedWorkOrderData: any;
    laborPayload = new WorkOrderQuoteLabor();
    exclusionPayload = new ExclusionQuote();
    chargesPayload = new ChargesQuote();
    materialListPayload = new QuoteMaterialList();
    quoteFreightListPayload = new QuoteFreightList();
    workFlowWorkOrderId: number = 0;
    workOrderId: number = 0;
    workOrderExclusionsList: Object[];
    workOrderMaterialList: any;
    workOrderChargesList: any;
    accountsReceivableBalance: any;
    workOrderWorkFlowOriginalData: any[];
    warnings: any;
    memo: any;
    markupList: any;
    isEdit: boolean = false;
    employeeList: any[];
    freight = [];
    approvers:  any;
    isViewMode: any;
    statusListForApproval = [];
    workFlowObject = { materialList: [],equipments: [],charges: [],exclusions: [],freights: []
    }
    isQuote: boolean = true;
    editMatData: any[] = [];
    costPlusType: Number;
    tabQuoteCreated: Object = {
        'materialList': false,
        'charges': false,
        'exclusions': false,
        'labor': false
    }
    editData: any;
    quoteCreated:any=false;
    editingIndex: number;
    selectedWorkFlowWorkOrderId: number;
    workOrderQuoteDetailsId: any;
    historicalWorkOrderId: number = 0;
    woWorkFlowId: number = 0;
    currenttaskId: number = 0;
    workOrderFreightList = [];
    overAllMarkup: any;
    selectedHistoricalWorkOrder: any;
    displayType: string = '';
    type: any = '0';
    selectedPartDescription: string = "";
    selectedStockLineNumber: string = "";
    fromquote: boolean = false;
    WOTaskDetails: any;
    conditions: any[];
    unitOfMeasuresList: any[];
    employeesOriginalData: any[];
    materialFlatBillingAmount: any="0.00";
    buildMethodDetails: any;
    approvalGridActiveTab: string = 'mpns';
    internalApproversList: any = [];
    woQuoteApprovalList: any = [];
    woQuoteAnalysisList: any = [];
    customerContactList: any = [];
    isSpinnerVisible: boolean = false;
    cusContactList: any[];
    saveType: string = '';
    currentWarningMessage:any;
    fields = ['partsCost', 'partsRevPercentage', 'laborCost', 'laborCost', 'laborRevPercentage', 'overHeadCost', 'overHeadPercentage', 'chargesCost', 'freightCost', 'exclusionCost', 'directCost', 'directCostPercentage', 'revenue', 'margin', 'marginPercentage'];
    currentApprover: any;
    isCurrentUserApprovalLimitExceeded: boolean = true;
    quotestatusofCurrentPart: string = '';
    isViewForApprovedPart: boolean = false;
    defaultContactId: any;
    modal: NgbModalRef;
    woQuoteListHeader = [
        {
            header: 'Action',
            field: 'actionStatus'
        }, {
            header: 'Internal Sent Date',
            field: 'internalSentDate'
        }, {
            header: 'Internal Status',
            field: 'internalStatusId'
        }, {
            header: 'Internal Memo',
            field: 'internalMemo'
        }, 
        {
            header: ' Internal Approved Date',
            field: 'internalApprovedDate'
        }, {
            header: 'Internal Approved By',
            field: 'internalApprovedBy'
        }, 
        {
            header: ' Internal Rejected Date',
            field: 'internalRejectedDate'
        }, {
            header: 'Internal Rejected By',
            field: 'internalRejectedby'
        },
        {
            header: 'Customer Sent Date',
            field: 'customerSentDate'
        }, {
            header: 'Customer Status',
            field: 'customerStatusId'
        }, {
            header: 'Customer Memo',
            field: 'customerMemo'
        },
        {
            header: ' Customer Approved Date',
            field: 'customerApprovedDate'
        }, {
            header: 'Customer Approved By',
            field: 'customerApprovedBy'
        },
        {
            header: ' Customer Rejected Date',
            field: 'customerRejectedDate'
        }, {
            header: 'Customer Rejected By',
            field: 'customerRejectedby'
        },  
        {
            header: 'MPN',
            field: 'partNumber'
        }, {
            header: 'MPN Desc',
            field: 'partDescription'
        }, {
            header: 'Stage',
            field: 'stage'
        }, {
            header: 'Scope',
            field: 'scope',
            width:"60px",
        }, {
            header: 'Parts Cost',
            field: 'partsCost'
        }, {
            header: 'Parts Revenue %',
            field: 'partsRevPercentage'
        }, {
            header: 'Labour Cost',
            field: 'laborCost',
            width:"60px",
        }, {
            header: 'Labour Revenue %',
            field: 'laborRevPercentage',
            width:"60px",
        }, {
            header: 'Overhead Cost',
            field: 'overHeadCost',
            width:"60px",
        }, {
            header: 'Overhead Cost %',
            field: 'overHeadPercentage',
            width:"60px",
        }, {
            header: 'Charges Cost',
            field: 'chargesCost',
            width:"60px",
        }, {
            header: 'Freight Cost',
            field: 'freightCost',
            width:"60px",
        }, 
        // {
        //     header: 'Exclusion Cost',
        //     field: 'exclusionCost'
        // },
         {
            header: 'Direct Cost',
            field: 'directCost',
            width:"60px",
        }, {
            header: 'Direct Cost %',
            field: 'directCostPercentage',
            width:"60px",
        }, {
            header: 'Revenue',
            field: 'revenue',
            width:"60px",
        }, {
            header: 'Margin',
            field: 'margin',
            width:"60px",
        }, {
            header: 'Margin %',
            field: 'marginPercentage',
            width:"60px",
        } 
    ]
    woQuoteAnalysisHeader = [
        {
            header: 'Customer',
            field: 'customerName'
        }, {
            header: 'Work Order No',
            field: 'workOrderNum'
        }, {
            header: 'Status',
            field: 'status'
        }, {
            header: 'MPN',
            field: 'partNumber'
        },
        {
            header: 'MPN Desc',
            field: 'partDescription'
        }, {
            header: 'Stage',
            field: 'stage'
        }, {
            header: 'Revenue',
            field: 'revenue'
        }, {
            header: 'Parts Cost',
            field: 'materialCost'
        }, {
            header: 'Parts Rev %',
            field: 'materialRevenuePercentage'
        }, 
        {
            header: 'Total Labour Cost',
            field: 'totalLaborCost'
        },
        {
            header: 'Labour Cost',
            field: 'laborCost'
        }, {
            header: 'Labour Rev %',
            field: 'laborRevenuePercentage'
        }, {
            header: 'Overhead Cost',
            field: 'overHeadCost'
        }, {
            header: 'Overhead Cost Rev %',
            field: 'overHeadCostRevenuePercentage'
        },
        {
            header: 'Other Cost',
            field: 'otherCost'
        }, {
            header: 'Direct Cost',
            field: 'directCost'
        }, {
            header: 'Direct Cost Rev %',
            field: 'directCostRevenuePercentage'
        }, {
            header: 'Margin',
            field: 'margin'
        }, {
            header: 'Margin %',
            field: 'marginPercentage'
        }
    ]
    @Output() enableBackToWO = new EventEmitter();
    restrictID: number;
    restrictMessage: any;
    warningID: number;
    createQuoteListID: any;
    warningMessage: any;
    currentCustomerId: any;
    selectedHistoricalCustomerId: any;
    selectedApprovalIndex: any;
    memoType: any = '';
    toEmail: any;
    cc: any;
    bcc: any;
    subject: any;
    emailBody: any;
    emailTypes: any[];
    emailCustomerContact: any;
    emailContactBy: any;
    emailType: any;
    emailContactId: any;
    mainIndex: any;
    subIndex: any;
    quoteStatusList: any = [];
    isWorkOrder: any;
    memoPopupContent: any;
    selectall: any;
    cols: any;
    pageIndex: number = 0;
    totalRecords: number=0;
    totalPages: number;
    pageSize: number = 10;
    deleteRowRecord:any={};
    msId:any;
    selectedquotePn: any;
    showDisplayData:boolean=false;
    customerWarningsList: any;
    textAreaInfo: any;
    memoIndex;
    setEditArray:any=[];
    upDateDisabeldbutton:any;
    disableForMemo:boolean=false;
    tempMemo:any;
    originlaMlist:any=[];
    historyData:any=[];
    auditHistoryHeaders = [
        { field: 'taskName', header: 'Task' ,isRequired:true},
        { field: 'partNumber', header: 'PN',isRequired:true },
        { field: 'partDescription', header: 'PN Description',isRequired:false },
        { field: 'provision', header: 'Provision',isRequired:false },
        { field: 'quantity', header: 'Qty',isRequired:true },
        { field: 'uomName', header: 'UOM',isRequired:false },
        { field: 'conditiontype', header: 'Cond Type',isRequired:true },
        { field: 'stocktype', header: 'Stock Type',isRequired:false },
        { field: 'unitCost', header: 'Unit Cost',isRequired:false },
        { field: 'totalPartCost', header: 'Total Part Cost',isRequired:false },
        { field: 'billingName', header: 'Billing Method',isRequired:true },
        { field: 'markUp', header: 'Mark Up',isRequired:false },
        { field: 'billingRate', header: 'Billing Rate',isRequired:false },
        { field: 'billingAmount', header: 'Billing Amount',isRequired:false },
        { field: 'isDeleted', header: 'Is Deleted',isRequired:false },
        { field: 'createdDate', header: 'Created Date',isRequired:false },
        { field: 'createdBy', header: 'Created By',isRequired:false },
        { field: 'updatedDate', header: 'Updated Date',isRequired:false },
        { field: 'updatedBy', header: 'Updated By',isRequired:false },
      ]
    constructor(private router: ActivatedRoute,private modalService: NgbModal, private workOrderService: WorkOrderQuoteService, private commonService: CommonService, private _workflowService: WorkFlowtService, private alertService: AlertService, private workorderMainService: WorkOrderService, private currencyService: CurrencyService, private cdRef: ChangeDetectorRef, private conditionService: ConditionService, private unitOfMeasureService: UnitOfMeasureService, private authService: AuthService,private purchaseOrderService: PurchaseOrderService) { }
    
    ngOnInit() {
        this.employeeName= this.authService.currentEmployee.name;
        this.enableEditBtn = Boolean(this.enableEditBtn);
        this.getCustomerWarningsList();
        this.breadcrumbs = [
			{ label: 'Work Order Quote' },
		];
        if (this.workOrderId) {
			this.isEditMode = true;
			this.breadcrumbs = [...this.breadcrumbs, {
				 label: this.isEditMode==true ? 'Edit Vendor' : 'Create Vendor' 
			}]
		}else{
			this.breadcrumbs = [...this.breadcrumbs, {
				label: this.isEditMode==true ? 'Edit Vendor' : 'Create Vendor' 
		   }]
		} 
        if (this.quoteForm == undefined) {
            this.quoteForm = new WorkOrderQuote();
        }
        this.moduleName = "Quote Information";
        if(this.workorderid == 0){
            this.router.queryParams.subscribe((params: Params) => {
                if (params['workorderid']) {
                    this.workOrderId = params['workorderid'];
                    this.workorderid = this.workOrderId;
                }
            })
        }
        else{
            this.workOrderId = this.workorderid;
        }
        if(this.workOrderId && this.workOrderId != 0)
        {
            this.getEmployeeList(this.workOrderId);
            this.loadCurrency('');
     
            // this.getUnitOfMeasure();
            this.getAllEmailType();
            this.getAllWorkOrderStatus('');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property == 'selectedDisplayType') {        
                this.workOrderId=this.workorderid;
                if(this.workOrderId){

                    this.getEmployeeList(this.workOrderId);
                }
            // selectedDisplayType
            }
        }
        this.enableEditBtn = Boolean(this.enableEditBtn);
        if (this.isQuoteListView) {
            this.quoteForm = new WorkOrderQuote();
            this.formDataFromViewListData();
        }
    }

    refresh( isView = false) {
        this.isSpinnerVisible = true;
        this.isViewMode = isView;
    }

    getInternalSentDateEnableStatus(approver) {
        return !approver.isSelected || approver.approvalActionId != ApprovalProcessEnum.SentForInternalApproval;
    }

    getinternalStatusIdEnableStatus(approver) {
        return !approver.isSelected || approver.approvalActionId != ApprovalProcessEnum.SubmitInternalApproval;
    }

    getcustomerSentDateEnableStatus(approver) {
        return !approver.isSelected || approver.approvalActionId != ApprovalProcessEnum.SentForCustomerApproval;
    }

    getcustomerStatusIdEnableStatus(approver) {
        if (approver.isSelected && approver.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) 
        {
            return false;
        } 
        else {
            return true;
        }
        //return !approver.isSelected || approver.approvalActionId != ApprovalProcessEnum.SubmitCustomerApproval;
    }

    getcustomerStatusIdByEnableStatus(approver) {
        if (approver.isSelected && approver.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) 
        {
            if(approver.customerStatusId !=3)
            {
                approver.customerRejectedDate="";
                approver.customerRejectedbyID="";
                if(approver.customerApprovedDate){
                    approver.customerApprovedDate=  moment(new Date()).format('MM/DD/YYYY');
                }
                else
                {
                    approver.customerApprovedDate=  moment(new Date()).format('MM/DD/YYYY');
                }

               

                return false;
            }else
            {
                return true;
            }
            
        } 
        else {
            return true;
        }
        //return !approver.isSelected || approver.approvalActionId != ApprovalProcessEnum.SubmitCustomerApproval;
    }

    getcustomerStatusRejectedIdEnableStatus(approver) {

        if (approver.isSelected && approver.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) 
        {
            if(approver.customerStatusId !=3)
            {
                return true;
            }else
            {

                approver.customerApprovedDate= "";
                approver.customerApprovedById="";
                if(approver.customerRejectedDate)
                {
                    approver.customerRejectedDate=  moment(new Date()).format('MM/DD/YYYY');
                }
                else
                {
                    approver.customerRejectedDate=  moment(new Date()).format('MM/DD/YYYY');
                }
                return false;
            }
            
        } 
        else {
            return true;
        }
        //return !approver.isSelected || approver.approvalActionId != ApprovalProcessEnum.SubmitCustomerApproval;
    }

    getApprovalActionInternalStatus(approver) {
        if (approver.isSelected && approver.approvalActionId == ApprovalProcessEnum.SubmitInternalApproval) {
            return true;
        } else {
            return false;
        }
    }

    getApprovalActionCustomerStatus(approver) {
        if (approver.isSelected && approver.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) {
            return true;
        } else {
            return false;
        }
    }

    getWorkOrderInfo(getWorkOrderInfo) {
        this.isSpinnerVisible = true;
        if(getWorkOrderInfo && getWorkOrderInfo != 0){
            this.workOrderService.getWorkOrderById(getWorkOrderInfo).subscribe(res => { 
                if (res) {
                    this.savedWorkOrderData = res;
                    this.customerCode = res.customerDetails.customerCode;
                    this.customerName = res.customerDetails.customerName;
                    this.customerContact = res.customerDetails.customerContact;
                    this.customerRef = res.customerDetails.customerRef;
                    this.csr = res.customerDetails.csrName;
                    this.salesPerson=res.salesPerson?res.salesPerson.name : '' ;
                    this.customerEmail = res.customerDetails.customerEmail;
                    this.customerPhone = res.customerDetails.customerPhone;
                    this.creditTerms=res.creditTerm;
                    this.creditLimit = formatNumberAsGlobalSettingsModule(res.creditLimit, 2);
                    this.workOrderNumber = res.workOrderNum;
                    this.quoteForm.WorkOrderId = res.workOrderId;
                    this.quoteForm.WorkFlowWorkOrderId = res["workFlowWorkOrderId"];
                    this.quoteForm.openDate = new Date(res["openDate"])
                    this.quoteForm['customerId'] = res['customerDetails']['customerId'];
                    this.quoteForm['CustomerPhone'] = res['customerDetails']['customerPhone']
                    this.quoteForm['salesPersonId'] = res['salesPersonId'];
                    this.quoteForm['csrId'] = res['csrId'];
                    this.quoteForm['employeeId'] = res['employeeId'];
                    this.quoteForm['creditTermsId'] = res.customerDetails['creditTermsId'];
                    this.quoteForm.masterCompanyId = res['masterCompanyId'];
                    this.quoteForm.creditTermsandLimit = res.customerDetails.creditLimit;
                    this.quoteForm['versionNo'] = 'V1';
                    this.salesPerson = res.salesPerson.name;
                    const workorderid =res.workOrderId ==0 ? this.workOrderId :res.workOrderId; 
                    this.workOrderService.getWorkOrderQuoteDetail(workorderid, res["workFlowWorkOrderId"],this.authService.currentUser.masterCompanyId)
                        .subscribe(
                            (res: any) => {
                                this.isSpinnerVisible = false;
                                if (res) {
                                    this.upDateDisabeldbutton=true;
                                    this.currentCustomerId = res.customerId
                                    this.isEdit = true;
                                    this.setWorkOrderQuoteId(res['workOrderQuote']['workOrderQuoteId']);
                                    this.quoteCreated=true;
                                    this.quotationHeader = this.formQuoteInfo(res.workOrderQuote);
                                    this.quotationHeader['workOrderQuoteId'] = res.workOrderQuote.workOrderQuoteId;
                                    this.dso = res.workOrderQuote.dso;
                                    this.validFor = res.workOrderQuote.validForDays;
                                    res.workOrderQuote.openDate = new Date(res.workOrderQuote.openDate);
                                    this.quoteForm = {
                                        ...res.workOrderQuote, WorkOrderId: res.workOrderId,
                                        WorkFlowWorkOrderId: res["workFlowWorkOrderId"], quoteNumber: res.workOrderQuote.quoteNumber, expirationDateStatus: res.workOrderQuote.quoteStatusId
                                    };
                                    this.employeeName=res.employeeName ?  res.employeeName : this.authService.currentEmployee.name;
                                    this.quoteForm['versionNo'] = 'V1';
                                    if (res.workOrderQuote['versionNo']) {
                                        // let vNo = Number(res.workOrderQuote['versionNo'].split('V')[1]) + 1;
                                        this.quoteForm['versionNo'] = res.workOrderQuote['versionNo'];
                                        this.increaseVer();
                                        // $('#versionNoModel').modal("show");
                                    }
                                    this.quoteDueDate = new Date(res.workOrderQuote.quoteDueDate);
                                    this.expirationDate = new Date(res.workOrderQuote.expirationDate);
                                    this.currency = res.workOrderQuote.currencyId;
                                    this.accountsReceivableBalance = res.workOrderQuote.accountsReceivableBalance;
                                    this.warnings = res.warnings;
                                    this.salesPerson=res.salesPersonName;
                                    this.memo = res.memo;
                                    this.approvedDate = new Date(res.approvedDate);
                                    this.sentDate = new Date(res.sentDate);
                                    this.isSpinnerVisible = false;
                                    // this.getQuoteTabData();
                                    this.setBuildMethod(res.buildMethodId);
                                    for (let emp of this.employeeList) {
                                        if (emp.value == res.employeeId) {
                                            this.employeeName = emp.label;
                                            this.quoteForm['employeeId'] = { label: emp.label, value: res.employeeId };

                                        }
                                    }

                                }
                                else{
                                    this.isSpinnerVisible = false;
                                }
                                if (!this.quotationHeader || !this.quotationHeader.workOrderQuoteId) {
                                    this.quoteForm.employeeId=this.authService.currentEmployee;
                                    this.workOrderService.getQuoteSettings(this.savedWorkOrderData.masterCompanyId, this.savedWorkOrderData.workOrderTypeId)
                                        .subscribe(
                                            (res) => {
                                                
                                                if (res && res.length > 0) {
                                                    this.validFor = res[0].validDays;
                                                    this.calculateExpiryDate();
                                                }
                                            },
                                            err => {
                                                
                                            }
                                        )
                                }
                            },
                            err => {
                                // console.log("hello crecords")
                                this.quoteCreated=false;
                                // this.quotationHeader['workOrderQuoteId']=0
                                this.isSpinnerVisible = false;
                            }
                        )
                        this.getTaskList('');
                        this.getMarkup('');
                    // this.getCreditTerms(res.creditTermsId);
                    this.setEmpAndSalesPersonName(res.employeeId, res.salesPersonId);
                    this.getMPNList(res.workOrderId !=0 ? res.workOrderId :this.workOrderId);
                    this.customerWarnings(this.quoteForm['customerId']);
                }
                else{
                    this.isSpinnerVisible = false;
                }
            },
            err => {
                this.errorHandling(err);
                this.isSpinnerVisible = false;
            })
        }
    }
    
    deleteMemoConfirmation(mainIndex, subIndex,obj){
        this.mainIndex = mainIndex;
        this.subIndex = subIndex;
        this.deleteRowRecord=obj
    }

    saveApprovalMemo(data){
        if(this.memoType == 'internalMemo'){
            this.woQuoteApprovalList[this.selectedApprovalIndex]['internalMemo'] = data;
        }
        else if(this.memoType == 'customerMemo'){
            this.woQuoteApprovalList[this.selectedApprovalIndex]['customerMemo'] = data;
        }
    }

    getInternalSentMaxDate(sentDate){
        let sDate = new Date(sentDate);
        if(new Date() > sDate){
            return sDate;
        }
        return new Date();
    }

    getInternalSentMinDate(openDate){
        return new Date(openDate);
    }

    getInternalApprovedMaxDate(){
        return new Date();
    }

    getCustomerSentMinDate(intApprovedDate){
        if(intApprovedDate){
            return new Date(intApprovedDate);
        }
        return;
    }

    getCondition(value) {
        if (this.originlaMlist && this.originlaMlist.length !=0) {
            this.originlaMlist.forEach(element => {
                this.setEditArray.push(element.conditionCodeId ? element.conditionCodeId : 0);
            });
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
            this.commonService.autoSuggestionSmartDropDownList('condition', 'conditionId', 'description', strText, true, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
                    res = res.map(x => { return {'conditionId': x.value, 'description': x.label} })
                    this.conditions = res;        
                },
                err => {
                    this.errorHandling(err);
                }
            )
    }
    calculateExpiryDate() {
        if (this.validFor && this.quoteDueDate) {
            this.expirationDate = new Date();
            this.expirationDate.setDate(this.quoteForm.openDate.getDate() + this.validFor);
        }
    }

    saveQuoteDetails() {
        if(this.quotationHeader && this.quotationHeader.workOrderQuoteId){
            $('#quoteVer').modal("show");
            this.quoteCreated=true;
        }
        else{
            this.saveQuoteAPI()
        }        
    }

    saveQuoteAPI(){
        this.formQuoteInfo(this.quoteForm);
        let isCreateQuote = (this.quotationHeader.workOrderQuoteId == undefined || this.quotationHeader.workOrderQuoteId == 0);
        this.isSpinnerVisible = true;
        this.workOrderService.createOrUpdateQuotation(this.quotationHeader)
            .subscribe(
                res => {
                    this.isSpinnerVisible = false;
                    this.quotationHeader = res;
                    this.quoteCreated=true;
                    this.quoteForm.quoteNumber = res['quoteNumber'];
                    this.setWorkOrderQuoteId(res['workOrderQuoteId']);
                    this.laborPayload.StatusId = this.exclusionPayload.StatusId = this.chargesPayload.StatusId = this.materialListPayload.StatusId = this.quoteFreightListPayload.StatusId = res['quoteStatusId']
                    this.alertService.showMessage(
                        this.moduleName,
                        `Quote ${isCreateQuote ? 'Created' : 'Updated'}  Succesfully`,
                        MessageSeverity.success
                    );
                    this.upDateDisabeldbutton=true;
                },
                err => {
                    this.errorHandling(err);
                    this.isSpinnerVisible = false;
                }
            )
    }
    // addMPN() {
    //   this.quoteForm.partsDetails.push(new multiParts());
    // }

    formQuoteInfo(quoteHeader) {

        let quotationHeader = {
            WorkOrderId: (quoteHeader.workOrderId) ? quoteHeader.workOrderId : quoteHeader.WorkOrderId,
            WorkFlowWorkOrderId: (quoteHeader.workFlowWorkOrderId) ? quoteHeader.workFlowWorkOrderId : quoteHeader.WorkFlowWorkOrderId,
            openDate: quoteHeader.openDate,
            QuoteDueDate: this.quoteDueDate,
            ValidForDays: this.validFor,
            ExpirationDate: this.expirationDate,
            QuoteStatusId: quoteHeader.expirationDateStatus,
            CustomerId: quoteHeader.customerId,
            CurrencyId: Number(this.currency),
            AccountsReceivableBalance: this.accountsReceivableBalance,
            SalesPersonId: quoteHeader.salesPersonId,
            EmployeeId: quoteHeader.employeeId,
            masterCompanyId: quoteHeader.masterCompanyId,
            createdBy: "admin",
            updatedBy: "admin",
            IsActive: true,
            IsDeleted: false,
            DSO: this.dso,
            Warnings: this.warnings,
            Memo: this.memo,
            creditLimit: this.creditLimit,
            creditTerm: this.creditTerm,
            customerContact: this.customerContact,
            customerEmail: this.customerEmail,
            customerName: this.customerName,
            customerPhone: this.customerPhone,
            customerReference: this.customerRef,
            employeeName: this.employeeName,
            salesPersonName: this.salesPerson,
            workOrderNumber: this.workOrderNumber,
            workOrderQuoteId: 0,
            approvedDate: this.approvedDate,
            sentDate: this.sentDate,
            csrId: quoteHeader.csrId,
            creditTermsId: quoteHeader.creditTermsId,
            versionNo: (quoteHeader['versionNo']) ? quoteHeader['versionNo'] : 'V1',
            employeeId: (quoteHeader.employeeId && quoteHeader.employeeId.value)?quoteHeader.employeeId.value:quoteHeader.employeeId
        }
        if (quoteHeader.quoteNumber) {
            quotationHeader['quoteNumber'] = quoteHeader.quoteNumber;
        }
        if (quotationHeader.EmployeeId) {
            delete quotationHeader.EmployeeId;
        }
        if (this.quotationHeader !== undefined && this.quotationHeader['workOrderQuoteId'] !== undefined) {
            quotationHeader['workOrderQuoteId'] = this.quotationHeader['workOrderQuoteId'];
        }
        if(quoteHeader['isVersionIncrease']){
            quotationHeader['isVersionIncrease'] = true;
        }
        this.quotationHeader = quotationHeader;
        return this.quotationHeader;
    }



    increaseVer(){
        let vNo = Number(this.quoteForm['versionNo'].split('V')[1]) + 1;
        this.quoteForm['versionNo'] = 'V' + vNo;
        // $('#versionNoModel').modal("hide");
        // setTimeout(() => {
        //     $(".modal-backdrop").hide();
        // }, 5000);
    }

    increaseVerConfirmation(isIncrease: boolean){
        if(this.saveType == ''){
            this.quoteForm['isVersionIncrease'] = isIncrease;
            this.saveQuoteAPI();
        }
        else if(this.saveType == 'charges'){
            this.chargesPayload['isVersionIncrease'] = isIncrease;
            this.saveCharges();
        }
        else if(this.saveType == 'exclusions'){
            this.exclusionPayload['isVersionIncrease'] = isIncrease;
            this.saveExclusions();
        }
        else if(this.saveType == 'labour'){
            this.laborPayload['isVersionIncrease'] = isIncrease;
            this.createLaborQuote();
        }
        else if(this.saveType == 'materialList'){
            this.materialListPayload['isVersionIncrease'] = isIncrease;
            this.saveMaterialList();
        }
        else if(this.saveType == 'freightsList'){
            this.quoteFreightListPayload['isVersionIncrease'] = isIncrease;
            this.saveFreights();
        }
    }
    getEmployeeList(woId) { 
            this.setEditArray.push(0);
            this.msId = this.authService.currentUser
                ? this.authService.currentUser.managementStructureId
                : null;
                    const strText = '';
                    this.isSpinnerVisible = true;
                    this.commonService.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.setEditArray.join(), this.msId,this.authService.currentUser.masterCompanyId).subscribe(employeeList => {
                    this.employeeList = employeeList;
                    this.employeesOriginalData = employeeList;
                    this.getWorkOrderInfo(woId);
                    this.getMPNDetails(woId);
                    
                },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err);
                }
            )
    }

    setEmpAndSalesPersonName(empId, salesPerId) {
        for (let emp of this.employeeList) {
            if (emp.value == empId) {
                this.employeeName = emp.label;
                this.quoteForm['employeeId'] = { label: emp.label, value: empId };
            }
            // if (emp.value == salesPerId) {
            //     this.salesPerson = emp.label;
            // }
        }
    }

    getMPNList(workOrderId) {   
        console.log("workorderId",workOrderId)     
        if(workOrderId && workOrderId != 0){
            this.workOrderService.getWorkOrderWorkFlowNumbers(workOrderId,this.authService.currentUser.masterCompanyId).subscribe(res => {                
                this.workOrderWorkFlowOriginalData = res;
                this.mpnPartNumbersList = res.map(x => {
                    return {
                        value:
                        {
                            workOrderWorkFlowId: x.value,
                            workOrderNo: x.label,
                            masterPartId: x.itemMasterId,
                            workflowId: x.workflowId,
                            workflowNo: x.workflowNo,
                            partNumber: x.partNumber,
                            workOrderScopeId: x.workOrderScopeId,
                            itemMasterId: x.itemMasterId,
                            partDescription: x.description,
                            stockLineNumber: x.stockLineNo,
                            woPartNoId: x.woPartNoId,
                            managementStructureId: x.managementStructureId,
                            quoteStatus: x.quoteStatus
                        },
                        label: x.partNumber
                    }
                });

                if (this.savedWorkOrderData && this.savedWorkOrderData.isSinglePN) {
                    this.selectedPartNumber = this.mpnPartNumbersList[0].value;
                    this.selectedquotePn = this.mpnPartNumbersList[0].label
                    this.partNumberSelected(this.mpnPartNumbersList[0].value);
                } else {
                    this.selectedPartNumber = this.mpnPartNumbersList[0].value;
                    this.partNumberSelected(this.mpnPartNumbersList[0].value);
                }
            },
            err => {
                this.errorHandling(err);
            })
        }
    }
    
    partNumberSelected(data) {
        this.selectedPartNumber = data;
        this.quotestatusofCurrentPart=data.quoteStatus;
        this.isViewForApprovedPart = false;
        if(this.quotestatusofCurrentPart == 'Approved'){
            this.isViewForApprovedPart = true;
        }
        this.clearQuoteData();
        let msId = 0;
        if (data) {
            this.workOrderService.getWOTaskQuote(this.selectedPartNumber['woPartNoId'],this.authService.currentUser.masterCompanyId)
                .subscribe(
                    (res) => {
                        this.WOTaskDetails = res; 
                    },
                    err => {
                        this.errorHandling(err);
                    }
                )
            this.selectedPartDescription = data.partDescription;
            this.selectedStockLineNumber = data.stockLineNumber;
            msId = data.masterPartId;
            this.labor.workFlowWorkOrderId = data;
            this.workFlowWorkOrderId = data.workOrderWorkFlowId;
            this.selectedWorkFlowWorkOrderId = data.workOrderWorkFlowId;            
            this.getBuildMethodDetails();
        }
        this.savedWorkOrderData.partNumbers.forEach((pns) => {
            if (msId == pns['masterPartId']) {
                this.laborPayload.IsDER = this.exclusionPayload.IsDER = this.chargesPayload.IsDER = this.materialListPayload.IsDER = this.quoteFreightListPayload.IsDER = pns['isDER'];
                this.laborPayload.IsPMA = this.exclusionPayload.IsPMA = this.chargesPayload.IsPMA = this.materialListPayload.IsPMA = this.quoteFreightListPayload.IsPMA = pns['isPMA'];
                this.laborPayload.ItemMasterId = this.exclusionPayload.ItemMasterId = this.chargesPayload.ItemMasterId = this.materialListPayload.ItemMasterId = this.quoteFreightListPayload.ItemMasterId = pns['masterPartId'];
                this.laborPayload.CMMId = this.exclusionPayload.CMMId = this.chargesPayload.CMMId = this.materialListPayload.CMMId = this.quoteFreightListPayload.CMMId = pns['cmmId'];
                this.laborPayload.EstCompDate = this.exclusionPayload.EstCompDate = this.chargesPayload.EstCompDate = this.materialListPayload.EstCompDate = this.quoteFreightListPayload.EstCompDate = pns['estimatedCompletionDate'];
                this.laborPayload.StatusId = this.exclusionPayload.StatusId = this.chargesPayload.StatusId = this.materialListPayload.StatusId = this.quoteFreightListPayload.StatusId = pns['workOrderStatusId'];
            }
        })
        // for(let pn of this.mpnPartNumbersList){
        //   if(pn['label'] == this.selectedPartNumber){
        //     this._workflowService.getWorkFlowDataById(pn['value']['workflowId']).subscribe(data => {
        //     });
        //   }
        // }

    }

    getBuildMethodDetails(){
        this.workOrderService.getSavedQuoteDetails(this.selectedWorkFlowWorkOrderId ? this.selectedWorkFlowWorkOrderId : this.workOrderQuoteDetailsId,this.authService.currentUser.masterCompanyId)
            .subscribe((res) => {
            this.buildMethodDetails = res;
            if (res) {
                this.costPlusType = res['materialBuildMethod']? res['materialBuildMethod'].toString(): '';
                this.materialFlatBillingAmount = res['materialFlatBillingAmount'];
            }
            if (res && res['workOrderQuoteDetailsId']) {
                this.workOrderQuoteDetailsId = res['workOrderQuoteDetailsId'];
                this.getQuoteTabData();
                this.historicalWorkOrderId = res['selectedId'];
                this.woWorkFlowId = res['selectedId'];
                this.currenttaskId = res['taskId'];
                if (res['buildMethodId'] == 1) {
                    this.buildMethodSelected('use work order');
                }
                else if (res['buildMethodId'] == 2) {
                    this.buildMethodSelected('use work flow');
                }
                else if (res['buildMethodId'] == 3) {
                    this.buildMethodSelected('use historical wos');
                }
                else {
                    this.buildMethodSelected('build from scratch');
                }
            }
            else {
                this.workOrderQuoteDetailsId = 0;
                this.updateWorkOrderQuoteDetailsId(this.workOrderQuoteDetailsId);
                this.getQuoteTabData();
                // this.historicalWorkOrderId = 0;
                // this.woWorkFlowId = 0;
                // this.selectedBuildMethod = "";
                // this.currenttaskId = 0;
            }
            if (this.workOrderQuoteDetailsId == 0) {
                this.isDetailedViewQuote = false;
            } else {
                this.isDetailedViewQuote = true;
            }
        },
        err => {
            this.errorHandling(err);
        }
    )
} 
    getMPNDetails(workOrderId) { 
        this.workOrderService.getPartsDetail(workOrderId,this.authService.currentUser.masterCompanyId)
            .subscribe(
                (workOrderParts: partsDetail[]) => {
                    this.workOrderPartsDetail = workOrderParts;
                    this.workOrderPartsDetail.forEach(element => {
                        element.iscontract=element.contract=='No'? false:true;
                    });
                },
                err => {
                    this.errorHandling(err);
                }
            )
    }

    buildMethodSelected(buildType: string) {
        this.selectedBuildMethod = buildType;
        // this.gridActiveTab = '';
        this.selectedWorkFlowOrWorkOrder = undefined;

        if (buildType == 'use work flow') {
            this.labor.workFloworSpecificTaskorWorkOrder = 'workFlow';
        }
        else if (buildType == 'use historical wos') {
            this.labor.workFloworSpecificTaskorWorkOrder = 'specificTasks';
        }

        if(!this.gridActiveTab || this.gridActiveTab=='materialList' ){
            this.gridTabChange('materialList');
        }

    }
    
    getDisplayData(buildType) {
        this.showDisplayData=false;
        this.displayType = buildType;
        var partId;
        var workScopeId;
        this.mpnPartNumbersList.forEach(element => {
            if (element['label'] == this.selectedPartNumber['partNumber']) {
                partId = element['value']['masterPartId'];
                workScopeId = element['value']['workOrderScopeId'];
                let payLoad = {
                    "first": 0,
                    "rows": 10,
                    "sortOrder": 1, 
                    "filters": {
                        "ItemMasterId": partId,
                        "WorkScopeId": workScopeId,
                        "statusId": Number(this.type),
                        "masterCompanyId":this.authService.currentUser.masterCompanyId
                    },
                    "globalFilter": null
                }
                if (this.type == 1) {
                    payLoad.filters['customerId'] = this.quotationHeader.CustomerId;
                }
                if (buildType == 'historical WO quotes') {
                    this.workOrderService.getBuildDetailsFromHistoricalWorkOrderQuote(partId, workScopeId, payLoad)
                        .subscribe(
                            (res:any) => {
                                this.buildHistoricalList =res['results']; 
                                this.showDisplayData=true;
                                if (res['results'].length > 0) {
                                    this.totalRecords = res.totalRecordsCount;
                                        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                                      }else {
                                        this.totalRecords = 0;
                                        this.totalPages = 0;
                                    }
                            }
                        )
                }
                else if (buildType == 'use historical wos') {
                    this.workOrderService.getBuildDetailsFromHistoricalWorkOrder(partId, workScopeId, payLoad)
                        .subscribe(
                            (res: any) => {
                                this.buildHistoricalList = res['results'];
                                this.showDisplayData=true;
                                if (res['results'].length > 0) {
                                    this.totalRecords = res.totalRecordsCount;
                                        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                                      }else {
                                        this.totalRecords = 0;
                                        this.totalPages = 0;
                                    }
                            }
                        )
                }
            }
        });
    }

    isEmptyObj(data){
            for(var key in data) {
                if(data.hasOwnProperty(key))
                    return false;
            }
            return true;
    }

    checkForAllEmpty(){
        let result = true;
        for(let x of this.labor.workOrderLaborList[0]){
            if(this.labor.workOrderLaborList[0][x].length>0){
                result = false;
            }
        }
        return result;
    }

    //not used
    getQuoteInfo(data) {
        this.selectedWorkFlowOrWorkOrder = data;
        // this.gridActiveTab = '';
        this.formTaskList();
        if (this.selectedBuildMethod == 'use work flow') {
            this.workOrderService.getWorkFlowDetails(data.workFlowId,this.authService.currentUser.masterCompanyId)
                .subscribe(
                    res => {
                        this.upDateDisabeldbutton=true;
                        this.materialListQuotation = res['materialList'];
                        if (this.materialListQuotation && this.materialListQuotation.length > 0) {
                            for (let charge in this.materialListQuotation) {
                                if (this.materialListQuotation[charge]['unitCost']) {
                                    this.materialListQuotation[charge]['unitCost'] = Number(this.materialListQuotation[charge]['unitCost'].toString().split(',').join('')).toFixed(2);
                                }
                                if (this.materialListQuotation[charge]['billingRate']) {
                                    this.materialListQuotation[charge]['billingRate'] = Number(this.materialListQuotation[charge]['billingRate'].toString().split(',').join('')).toFixed(2);
                                }
                                if (this.materialListQuotation[charge]['billingAmount']) {
                                    this.materialListQuotation[charge]['billingAmount'] = Number(this.materialListQuotation[charge]['billingAmount'].toString().split(',').join('')).toFixed(2);
                                }
                            }
                        }
                        let temp = []
                        let formedData = [];
                        // this.materialListQuotation.forEach(
                        //     (x) => {
                        //         formedData = [...formedData, ...x];
                        //     }
                        // )
                        temp = formedData.reduce(function (r, a) {
                            r[a['taskId']] = r[a['taskId']] || [];
                            r[a['taskId']].push(a);
                            return r;
                        }, Object.create(null));
                        this.materialListQuotation = [];
                        for (let x in temp) {
                            // this.workOrderExclusionsList = [...this.workOrderExclusionsList, ...this.workOrderExclusionsLists[x].map(da=>{ return {...da, taskId:x}})]
                            this.materialListQuotation.push(temp[x]);
                        }
                        this.workOrderMaterialList = res['materialList'];
                        this.laborQuotation = res['expertise'];
                        this.chargesQuotation, this.workOrderChargesList = res['charges'];
                        for (let charge in this.workOrderChargesList) {
                            this.workOrderChargesList[charge]['unitCost'] = Number(this.workOrderChargesList[charge]['unitCost'].toString().split(',').join('')).toFixed(2);
                            this.workOrderChargesList[charge]['extendedCost'] = Number(this.workOrderChargesList[charge]['extendedCost'].toString().split(',').join('')).toFixed(2);
                        }
                        this.exclusionsQuotation = res['exclusions'].map(exclusion => {
                            return {
                                ...exclusion,
                                epn: exclusion.partNumber,
                                epnDescription: exclusion.partDescription
                            }
                        });
                        this.workOrderExclusionsList = res['exclusions'].map(exclusion => {
                            return {
                                ...exclusion,
                                epn: exclusion.partNumber,
                                epnDescription: exclusion.partDescription
                            }
                        });
                        // this.labor.workOrderLaborList[0] = {};
                        this.taskList.forEach((tl) => {
                            res['expertise'].forEach((rt) => {
                                if (rt['taskId'] == tl['taskId']) {
                                    if (this.labor.workOrderLaborList[0][tl['description']][0] && this.labor.workOrderLaborList[0][tl['description']][0]['expertiseId'] == null && this.labor.workOrderLaborList[0][tl['description']][0]['employeeId'] == null) {
                                        this.labor.workOrderLaborList[0][tl['description']] = [];
                                    }
                                    let labor = {}
                                    labor = { ...rt, expertiseId: rt.expertiseTypeId, hours: rt.estimatedHours, employeeId: { 'label': rt.employeeName, 'value': rt.employeeId } }
                                    this.labor.workOrderLaborList[0][tl['description']].push(labor);
                                }
                            })
                        })
                        this.labor.workFloworSpecificTaskorWorkOrder = 'workFlow';
                        this.savedWorkOrderData.workFlowWorkOrderId = undefined;
                    },
                    err => {
                        this.errorHandling(err);
                    }
                )
        }
        else {
            this.clearQuoteData();
        }
    }

    clearQuoteData() {
        this.materialListQuotation = [];
        this.laborQuotation = [];
        this.chargesQuotation = [];
        this.exclusionsQuotation = [];
    }

    saveWorkOrderFreightsList(e) {
        this.quoteFreightListPayload.BuildMethodId = this.getBuildMethodId();
        this.quoteFreightListPayload["taskId"] = (this.selectedBuildMethod == 'build from scratch') ? this.currenttaskId : 0;
        this.quoteFreightListPayload['WorkflowWorkOrderId'] = this.selectedWorkFlowWorkOrderId;
        this.quoteFreightListPayload['createdDate'] = (e.createdDate) ? e.createdDate : new Date();
        this.quoteFreightListPayload.masterCompanyId = this.quotationHeader.masterCompanyId;
        this.quoteFreightListPayload.SelectedId = (this.selectedBuildMethod == "use work flow") ? this.woWorkFlowId : (this.selectedBuildMethod == "use historical wos") ? this.historicalWorkOrderId : 0;
        this.quoteFreightListPayload.WorkOrderQuoteFreight = e['data'].map(fre => {
            if (fre.workOrderQuoteDetailsId && fre.workOrderQuoteDetailsId != 0) {
                this.quoteFreightListPayload.WorkOrderQuoteDetailsId = fre.workOrderQuoteDetailsId
            }
            return {
                "WorkOrderQuoteFreightId": (fre.workOrderQuoteFreightId) ? fre.workOrderQuoteFreightId : 0,
                "WorkOrderQuoteDetailsId": (this.quoteFreightListPayload.WorkOrderQuoteDetailsId) ? this.quoteFreightListPayload.WorkOrderQuoteDetailsId : 0,
                "CarrierId": fre.carrierId,
                "ShipViaId": fre.shipViaId,
                "Length": fre.length,
                "Width": fre.width,
                "Height": fre.height,
                "Weight": fre.weight,
                "Memo": fre.memo,
                "Amount": fre.amount,
                "IsFixedFreight": fre.isFixedFreight,
                "FixedAmount": fre.fixedAmount,
                "masterCompanyId": this.quotationHeader.masterCompanyId,
                "markupPercentageId": fre.markupPercentageId ? fre.markupPercentageId: 0,
                "freightCostPlus": fre.freightCostPlus,
                "taskId": fre.taskId,
                "CreatedBy": "admin",
                "UpdatedBy": "admin",
                "CreatedDate": "2019-10-31T09:06:59.68",
                "UpdatedDate": "2019-10-31T09:06:59.68",
                "IsActive": true,
                "IsDeleted": fre.isDeleted,
                "billingMethodId": Number(fre.billingMethodId),
                "BillingAmount": fre.billingAmount,
                "headerMarkupId": fre.headerMarkupId,
                "markupFixedPrice": fre.markupFixedPrice,
                "uomId": fre.uomId,
                "dimensionUOMId": fre.dimensionUOMId,
                "currencyId": fre.currencyId,
            }
        })

        this.quoteFreightListPayload['WorkOrderQuoteTask'] = [];
        this.quoteFreightListPayload['freightFlatBillingAmount'] = e['freightFlatBillingAmount'];
        this.quoteFreightListPayload['FreightBuildMethod'] = e['FreightBuildMethod'];
        e['taskSum'].forEach(
            (x) => {
                this.WOTaskDetails.forEach(
                    (td) => {
                        if (td.taskId == x.TaskId) {
                            x['WorkOrderQuoteTaskId'] = td['workOrderQuoteTaskId'];
                        }
                    }
                )
                this.quoteFreightListPayload['WorkOrderQuoteTask'].push({ ...x, woPartNoId: this.selectedPartNumber['woPartNoId'] })
            }
        )
        this.saveType = 'freightsList';
        $('#quoteVer').modal("show");
        
    }

    saveFreights(){
        this.isSpinnerVisible=true;
        this.workOrderService.saveFreightsListQuote(this.quoteFreightListPayload)
        .subscribe(
            (res) => {
                this.isSpinnerVisible=false;
                this.tabQuoteCreated['freight'] = true;
                this.updateWorkOrderQuoteDetailsId(res.workOrderQuoteDetailsId);
                this.getQuoteFreightListByWorkOrderQuoteId();
                // this.partNumberSelected(this.selectedPartNumber);
                this.alertService.showMessage(
                    this.moduleName,
                    'Quotation for Freights created successfully',
                    MessageSeverity.success
                );
                this.updateQuotationHeader()
            },
            err =>{
                this.isSpinnerVisible=false;
                this.errorHandling(err)
            }
        )
    }

    createMaterialQuote() {
        this.disableMat=true;
        this.materialListPayload.BuildMethodId = this.getBuildMethodId();
        this.materialListPayload["taskId"] = (this.selectedBuildMethod == 'build from scratch') ? this.currenttaskId : 0;
        this.materialListPayload['WorkflowWorkOrderId'] = this.selectedWorkFlowWorkOrderId;
        this.materialListPayload.SelectedId = (this.selectedBuildMethod == "use work flow") ? this.woWorkFlowId : (this.selectedBuildMethod == "use historical wos") ? this.historicalWorkOrderId : 0;
        let WorkOrderQuoteTask = [];
        this.materialListPayload['MaterialBuildMethod'] = this.costPlusType;
        // if(Number(this.costPlusType) == 3){
        this.materialListPayload['materialFlatBillingAmount'] = this.materialFlatBillingAmount;
        // }
        this.materialListQuotation.forEach(
            (taskCharge) => {
                this.taskList.forEach(
                    (task) => {
                        if (task.taskId == taskCharge[0].taskId) {
                            let workOrderQuoteTaskId = 0;
                            this.WOTaskDetails.forEach(
                                (td) => {
                                    if (td.taskId == task.taskId) {
                                        workOrderQuoteTaskId = td['workOrderQuoteTaskId'];
                                    }
                                }
                            )
                            // task.masterCompany.masterCompanyId
                            WorkOrderQuoteTask.push(
                                {
                                    "WorkOrderQuoteTaskId": workOrderQuoteTaskId,
                                    "TaskId": task.taskId,
                                    "MaterialCost": this.getTotalTaskUnitCost(taskCharge),
                                    "MaterialBilling": this.totalTaskMaterialBillingAmount(taskCharge),
                                    "MaterialRevenue": this.totalTaskMaterialBillingAmount(taskCharge),
                                    "masterCompanyId": this.authService.currentUser.masterCompanyId,
                                    "CreatedBy": "admin",
                                    "UpdatedBy": "admin",
                                    "CreatedDate": new Date().toDateString(),
                                    "UpdatedDate": new Date().toDateString(),
                                    "IsActive": true,
                                    "IsDeleted": false,
                                    "woPartNoId": this.selectedPartNumber['woPartNoId']
                                }
                            )
                        }
                    }
                )
            }
        )
        let temp = [];
        this.materialListQuotation.forEach(
            x => {
                temp = [...temp, ...x];
            }
        ) 
        this.materialListPayload['WorkOrderQuoteTask'] = WorkOrderQuoteTask;
        this.materialListPayload.WorkOrderQuoteMaterial = temp.map(mList => {
            // if(mList.workOrderQuoteDetailsId && mList.workOrderQuoteDetailsId != 0){
            this.materialListPayload.WorkOrderQuoteDetailsId = this.workOrderQuoteDetailsId;
            // }
            return {
                "WorkOrderQuoteMaterialId": (mList.workOrderQuoteMaterialId) ? mList.workOrderQuoteMaterialId : 0,
                "WorkOrderQuoteDetailsId": (mList.workOrderQuoteDetailsId) ? mList.workOrderQuoteDetailsId : 0,
                "ItemMasterId": mList.itemMasterId,
                "ConditionCodeId": mList.conditionCodeId,
                "MandatoryOrSupplemental": mList.mandatoryOrSupplemental ? mList.mandatoryOrSupplemental :mList.materialMandatoriesName,
                "materialMandatoriesId": mList.materialMandatoriesId,
                "ItemClassificationId": mList.itemClassificationId,
                "Quantity": mList.quantity,
                "UnitOfMeasureId": mList.unitOfMeasureId,
                "UnitCost": mList.unitCost,
                "ExtendedCost": mList.extendedCost,
                "Price": mList.price,
                "provisionId": mList.provisionId,
                "ExtendedPrice": mList.extendedPrice,
                "Memo": mList.memo,
                "IsDefered": mList.isDeferred,
                "markupPercentageId": mList.markupPercentageId,
                "TotalPartsCost": 155,
                "Markup": mList.markup,
                "masterCompanyId": (mList.masterCompanyId == '') ? 1 : mList.masterCompanyId,
                "TaskId": (typeof mList.taskId === 'object')?mList.taskId.taskId :mList.taskId,
                "BillingMethodId": mList.billingMethodId? Number(mList.billingMethodId):this.costPlusType,
                "BillingRate": mList.billingRate,
                "BillingAmount": mList.billingAmount,
                "headerMarkupId": this.overAllMarkup,
                "markupFixedPrice": this.costPlusType,
                "CreatedBy": "admin",
                "UpdatedBy": "admin",
                "IsActive": true,
                "IsDeleted": mList.isDeleted
            } 
        })
        this.saveType = 'materialList';
        $('#quoteVer').modal("show");
       
    }

    saveMaterialList(){ 
        this.isSpinnerVisible=true;
        this.workOrderService.saveMaterialListQuote(this.materialListPayload)
        .subscribe(
            res => {
                this.isSpinnerVisible=false;
                this.tabQuoteCreated['materialList'] = true;
                this.updateWorkOrderQuoteDetailsId(res.workOrderQuoteDetailsId);
                this.getQuoteMaterialListByWorkOrderQuoteId();
                this.alertService.showMessage(
                    this.moduleName,
                    'Quotation for material list created successfully',
                    MessageSeverity.success
                );
                this.updateQuotationHeader()
            },
            err =>{
                this.isSpinnerVisible=false;
                this.errorHandling(err)
            }
        )
    }

    tmchange() {
        for (let mData of this.materialListQuotation) {
            mData.forEach(
                x => {
                    x.billingMethodId = this.costPlusType;
                    x.markupPercentageId = '';
                    x.billingRate = 0;
                    x.billingAmount = (x.quantity * Number(x.unitCost.toString().split(',').join(''))).toFixed(2);
                    if(this.costPlusType == 3){
                        x.billingAmount = 0.00;
                        this.materialFlatBillingAmount = 0.00;
                    }
                    if (Number(this.costPlusType) == 1) {
                        this.overAllMarkup = '';
                    }
                }
            )
        }
    }

    getTaskName(task) {
        this.taskList.forEach(
            x => {
                if (x.taskId == task['taskId']) {
                    return x.description;
                }
            }
        )
    }

    createLaborQuote() { 
        this.laborPayload['workflowWorkOrderId'] = this.selectedWorkFlowWorkOrderId;
        this.laborPayload['SelectedId'] = (this.selectedBuildMethod == "use work flow") ? this.woWorkFlowId : (this.selectedBuildMethod == "use historical wos") ? this.historicalWorkOrderId : 0;
        this.isSpinnerVisible=true;
        this.workOrderService.saveLaborListQuote(this.laborPayload)
            .subscribe(
                res => {
                    this.isSpinnerVisible=false;
                    if (res) {
                        this.tabQuoteCreated['labor'] = true;
                        let laborList = this.labor.workOrderLaborList;
                        this.labor = { ...res.workOrderQuoteLaborHeader, workOrderLaborList: laborList };
                        this.mpnPartNumbersList.forEach((mpn) => {
                            if (mpn.label == this.selectedPartNumber) {
                                this.labor.workFlowWorkOrderId = mpn;
                            }
                        })
                        this.updateWorkOrderQuoteDetailsId(res.workOrderQuoteDetailsId);
                        this.getQuoteLaborListByWorkOrderQuoteId();
                        // this.partNumberSelected(this.selectedPartNumber);
                        this.updateQuotationHeader()
                    }
                    this.alertService.showMessage(
                        this.moduleName,
                        'Quotation created  Succesfully',
                        MessageSeverity.success
                    );
                },
                err =>{
                    this.isSpinnerVisible=false;
                    this.errorHandling(err)
                }
            )
    }

    createChargeQuote(data) {
        this.chargesPayload['workflowWorkOrderId'] = this.selectedWorkFlowWorkOrderId;
        this.chargesPayload["taskId"] = (this.selectedBuildMethod == 'build from scratch') ? this.currenttaskId : 0;
        this.chargesPayload['SelectedId'] = (this.selectedBuildMethod == "use work flow") ? this.woWorkFlowId : (this.selectedBuildMethod == "use historical wos") ? this.historicalWorkOrderId : 0;
        this.chargesPayload.BuildMethodId = this.getBuildMethodId();
        this.chargesPayload['createdDate'] = (data.createdDate) ? data.createdDate : new Date();
        this.chargesPayload['masterCompanyId'] = this.quotationHeader.masterCompanyId;
        this.chargesPayload.WorkOrderQuoteCharges = data['data'].map(charge => {
            // if(charge.workOrderQuoteDetailsId && charge.workOrderQuoteDetailsId != 0){
            this.chargesPayload.WorkOrderQuoteDetailsId = this.workOrderQuoteDetailsId;
            // }
            return { 
                "WorkOrderQuoteChargesId": (charge.workOrderQuoteChargesId) ? charge.workOrderQuoteChargesId : 0,
                "WorkOrderQuoteDetailsId": (charge.workOrderQuoteDetailsId) ? charge.workOrderQuoteDetailsId : 0,
                "ChargesTypeId": charge.workflowChargeTypeId,
                "VendorId": charge.vendorId,
                "Quantity": charge.quantity,
                "RoNumberId": 1,
                "InvoiceNo": "InvoiceNo 123456",
                "Amount": 100,
                "MarkupPercentageId": charge.markupPercentageId,
                // "TMAmount":charge.tmAmount,
                // "FlateRate":charge.flateRate,
                "Description": charge.description,
                "UnitCost": charge.unitCost,
                "ExtendedCost": charge.extendedCost,
                "UnitPrice": charge.unitPrice,
                "ExtendedPrice": charge.extendedPrice,
                "HeaderMarkupId": charge.headerMarkupId,
                "masterCompanyId": this.quotationHeader.masterCompanyId,
                "taskId": (typeof charge.taskId === 'object')?charge.taskId.taskId :charge.taskId,
                "CreatedBy": "admin",
                "UpdatedBy": "admin",
                "IsActive": true,
                "IsDeleted": charge.isDeleted,
                "BillingMethodId": charge.billingMethodId,
                "BillingRate": charge.billingRate,
                "BillingAmount": charge.billingAmount,
                "markupFixedPrice": charge.markupFixedPrice,
                "roNum": charge.roNum,
                "refNum": charge.refNum,
                "invoiceNum": charge.invoiceNum
            }
        })

        this.chargesPayload['WorkOrderQuoteTask'] = [];
        this.chargesPayload['chargesFlatBillingAmount'] = data['chargesFlatRateBillingAmount'];
        this.chargesPayload['ChargesBuildMethod'] = data['ChargesBuildMethod'];
        data['taskSum'].forEach(
            (x) => {
                this.WOTaskDetails.forEach(
                    (td) => {
                        if (td.taskId == x.TaskId) {
                            x['WorkOrderQuoteTaskId'] = td['workOrderQuoteTaskId'];
                        }
                    }
                )
                this.chargesPayload['WorkOrderQuoteTask'].push({ ...x, woPartNoId: this.selectedPartNumber['woPartNoId'] })
            }
        )
        $('#quoteVer').modal("show");
        this.saveType = 'charges';
    }

    saveCharges(){
        this.isSpinnerVisible=true;
        this.workOrderService.saveChargesQuote(this.chargesPayload)
        .subscribe(
            res => {
                this.isSpinnerVisible=false;
                this.tabQuoteCreated['charges'] = true;
                this.workOrderChargesList = res.workOrderQuoteCharges;
                for (let charge in this.workOrderChargesList) {
                    this.workOrderChargesList[charge]['unitCost'] = Number(this.workOrderChargesList[charge]['unitCost'].toString().split(',').join('')).toFixed(2);
                    this.workOrderChargesList[charge]['extendedCost'] = Number(this.workOrderChargesList[charge]['extendedCost'].toString().split(',').join('')).toFixed(2);
                }
                this.updateWorkOrderQuoteDetailsId(res.workOrderQuoteDetailsId);
                this.getQuoteChargesListByWorkOrderQuoteId();
                this.getBuildMethodDetails();
                // this.partNumberSelected(this.selectedPartNumber);
                this.alertService.showMessage(
                    this.moduleName,
                    'Quotation created  Succesfully',
                    MessageSeverity.success
                );
                this.updateQuotationHeader()
            },
            err =>{
                this.isSpinnerVisible=false;
                this.errorHandling(err)
            }
        )
    }
    createExclusionsQuote() {
        this.exclusionsQuotation['workflowWorkOrderId'] = this.selectedWorkFlowWorkOrderId;
        this.exclusionsQuotation['SelectedId'] = (this.selectedBuildMethod == "use work flow") ? this.woWorkFlowId : (this.selectedBuildMethod == "use historical wos") ? this.historicalWorkOrderId : 0;
        
        this.saveType = 'exclusions';
        $('#quoteVer').modal("show");
    }

    saveExclusions(){
        this.workOrderService.saveExclusionsQuote(this.exclusionsQuotation)
            .subscribe(
                res => {
                    
                    this.tabQuoteCreated['exclusions'] = true;
                    this.workOrderExclusionsList = res.workOrderQuoteExclusions;
                    for (let exc in this.workOrderExclusionsList) {
                        if (this.workOrderExclusionsList[exc]['billingAmount']) {
                            this.workOrderExclusionsList[exc]['billingAmount'] = Number(this.workOrderExclusionsList[exc]['billingAmount'].toString().split(',').join('')).toFixed(2);
                        }
                        if (this.workOrderExclusionsList[exc]['billingRate']) {
                            this.workOrderExclusionsList[exc]['billingRate'] = Number(this.workOrderExclusionsList[exc]['billingRate'].toString().split(',').join('')).toFixed(2);
                        }
                        if (this.workOrderExclusionsList[exc]['unitCost']) {
                            this.workOrderExclusionsList[exc]['unitCost'] = Number(this.workOrderExclusionsList[exc]['unitCost'].toString().split(',').join('')).toFixed(2);
                        }
                        if (this.workOrderExclusionsList[exc]['extendedCost']) {
                            this.workOrderExclusionsList[exc]['extendedCost'] = Number(this.workOrderExclusionsList[exc]['extendedCost'].toString().split(',').join('')).toFixed(2);
                        }
                    }
                    this.getQuoteExclusionListByWorkOrderQuoteId();
                    this.updateWorkOrderQuoteDetailsId(res.workOrderQuoteDetailsId);
                    this.updateQuotationHeader();
                },
                err =>{
                    
                    this.errorHandling(err)
                }
            )
    }

    getTaskList(value) {
        if (this.labor == undefined) {
            this.labor = new WorkOrderLabor()
        }
        this.labor.workOrderLaborList = [];
        this.labor.workOrderLaborList.push({})
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('task', 'taskId', 'description', strText, true, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(taskList => {
                    taskList = taskList.map(x=>{
                    return {
                        id: x.value,
                        description: x.label.toLowerCase(),
                        taskId: x.value,
                        label:x.label.toLowerCase(),
                    }
                }
                    )
                    this.labor.workOrderLaborList[0] = {}
                    this.taskList = taskList;
                    this.formTaskList();
                },
                (error) => {
                    this.errorHandling(error);
                }
            )
    }

    createNew(type) {
        this.editData = undefined;
        if (type == 'add') {
            this.fromquote = true;
        }
    }

    edit(rowData, i) {
        this.isEditMode=true;
        this.editingIndex = i;
        this.createNew('edit');
        this.cdRef.detectChanges();
        this.isEdit = true;
        this.editData = rowData;
    }

    formTaskList() {
        this.taskList.forEach(task => {
            this.labor.workOrderLaborList[0][task.description] = [];
        });
    }

    saveworkOrderLabor(data) {
        this.laborPayload.BuildMethodId = this.getBuildMethodId();
        // this.laborPayload.WorkOrderQuoteLaborHeader.WorkOrderQuoteLaborHeaderId = data.workOrderLaborHeaderId;
        // this.laborPayload.WorkOrderQuoteLaborHeader.WorkOrderQuoteDetailsId = 0;
        this.laborPayload.WorkOrderQuoteLaborHeader["taskId"] = (this.selectedBuildMethod == 'build from scratch') ? this.currenttaskId : 0;
        this.laborPayload.WorkOrderQuoteLaborHeader['workOrderQuoteDetailsId'] = this.workOrderQuoteDetailsId;
        this.laborPayload.WorkOrderQuoteDetailsId = this.workOrderQuoteDetailsId;
        // if(this.laborPayload.WorkOrderQuoteLaborHeader['workOrderQuoteDetailsId']){
        //   this.laborPayload.WorkOrderQuoteDetailsId = this.laborPayload.WorkOrderQuoteLaborHeader['workOrderQuoteDetailsId'];
        // }

        this.laborPayload.WorkOrderQuoteLaborHeader.DataEnteredBy = data.dataEnteredBy;
        this.laborPayload.WorkOrderQuoteLaborHeader.HoursorClockorScan = data.hoursorClockorScan;
        this.laborPayload.WorkOrderQuoteLaborHeader.IsTaskCompletedByOne = data.isTaskCompletedByOne;
        this.laborPayload.WorkOrderQuoteLaborHeader.WorkOrderHoursType = data['workOrderHoursType'];
        this.laborPayload.WorkOrderQuoteLaborHeader.LabourMemo = "";
        this.laborPayload.WorkOrderQuoteLaborHeader.EmployeeId = data.employeeId;
        this.laborPayload.WorkOrderQuoteLaborHeader.ExpertiseId = data.expertiseId;
        this.laborPayload.WorkOrderQuoteLaborHeader.TotalWorkHours = data.totalWorkHours;
        this.laborPayload.WorkOrderQuoteLaborHeader.masterCompanyId = data.masterCompanyId;
        this.laborPayload.WorkOrderQuoteLaborHeader['headerMarkupId'] = data.headerMarkupId;
        this.laborPayload.WorkOrderQuoteLaborHeader['markupFixedPrice'] = data.markupFixedPrice;
        this.laborPayload.WorkOrderQuoteLaborHeader.CreatedBy = "admin"
        this.laborPayload.WorkOrderQuoteLaborHeader.UpdatedBy = "admin"
        this.laborPayload.WorkOrderQuoteLaborHeader.IsActive = true
        this.laborPayload.WorkOrderQuoteLaborHeader.IsDeleted = false;
        this.laborPayload['createdDate'] = (data.createdDate) ? data.createdDate : new Date();
        // if(Number(data.costPlusType) == 3){
        this.laborPayload['laborFlatBillingAmount'] = data.laborFlatBillingAmount;
        // }
        // else{
        //   this.laborPayload['laborFlatBillingAmount'] = 0;
        // }
        this.laborPayload['LaborBuildMethod'] = data['LaborBuildMethod'];
        var laborList = [];
        for (let labor in data.workOrderLaborList) {
            laborList = [...laborList, ...data.workOrderLaborList[labor]];
        }
        this.laborPayload.WorkOrderQuoteLaborHeader['WorkOrderQuoteTask'] = [];
        data['WorkOrderQuoteTask'].forEach(
            (x) => {
                this.WOTaskDetails.forEach(
                    (td) => {
                        if (td.taskId == x.TaskId) {
                            x['WorkOrderQuoteTaskId'] = td['workOrderQuoteTaskId'];
                        }
                    }
                )
                this.laborPayload.WorkOrderQuoteLaborHeader['WorkOrderQuoteTask'].push({ ...x, woPartNoId: this.selectedPartNumber['woPartNoId'] })
            }
        )
        this.laborPayload.WorkOrderQuoteLaborHeader.WorkOrderQuoteLabor = []
        laborList.forEach((labor) => {
            if (labor.expertiseId) {
                this.laborPayload.WorkOrderQuoteLaborHeader.WorkOrderQuoteLabor.push({
                    "WorkOrderQuoteLaborId": (labor.workOrderQuoteLaborId) ? labor.workOrderQuoteLaborId : 0,
                    "WorkOrderQuoteLaborHeaderId": (labor.workOrderQuoteLaborHeaderId) ? labor.workOrderQuoteLaborHeaderId : 0,
                    "ExpertiseId": labor.expertiseId,
                    "EmployeeId": labor.employeeId,
                    "BillableId": labor.billableId,
                    "Hours": labor.hours,
                    "Adjustments": labor.adjustments,
                    "AdjustedHours": labor.adjustedHours,
                    "Memo": labor.memo,
                    "TaskId": labor.taskId,
                    "LabourCostPlus": labor.labourCostPlus,
                    "laborOverheadCost": labor.laborOverheadCost,
                    "markupPercentageId": labor.markupPercentageId,
                    "directLaborOHCost": labor.directLaborOHCost,
                    "headerMarkupId": labor.headerMarkupId,
                    // "fixedAmount": labor.fixedAmount,
                    "CreatedBy": "admin",
                    "UpdatedBy": "admin",
                    "IsActive": true,
                    "IsDeleted": labor.isDeleted,
                    "BurdaenRatePercentageId": labor.burdaenRatePercentageId,
                    "BurdenRateAmount": labor.burdenRateAmount,
                    "TotalCostPerHour": labor.totalCostPerHour,
                    "TotalCost": labor.totalCost,
                    "BillingMethodId": labor.billingMethodId,
                    "BillingRate": labor.billingRate,
                    "BillingAmount": labor.billingAmount,
                    "markupFixedPrice": labor.markupFixedPrice,
                })
            }
        })
        this.saveType = 'labour';
        $('#quoteVer').modal("show");
        // this.createLaborQuote();
    }

    getBuildMethodId() {
        if (this.selectedBuildMethod === 'use work order') return 1;
        else if (this.selectedBuildMethod === 'use work flow') return 2;
        else if (this.selectedBuildMethod === 'use historical wos') return 3;
        else if (this.selectedBuildMethod === 'build from scratch') return 4;
        else if (this.selectedBuildMethod === 'display 3rd party') return 5;
    }

    setBuildMethod(id) {
        if (id === 1) {
            this.selectedBuildMethod = 'use work order';
        }
        else if (id == 2) {
            this.selectedBuildMethod = 'use work flow';
        }
        else if (id === 3) {
            this.selectedBuildMethod = 'use historical wos';
        }
        else if (id === 4) {
            this.selectedBuildMethod = 'build from scratch';
        }
        else if (id === 5) {
            this.selectedBuildMethod = 'display 3rd party';
        }
    }

    saveWorkOrderExclusionsList(data) {
        this.exclusionPayload.BuildMethodId = this.getBuildMethodId();
        this.exclusionPayload["taskId"] = (this.selectedBuildMethod == 'build from scratch') ? this.currenttaskId : 0;
        this.exclusionPayload['WorkflowWorkOrderId'] = this.selectedWorkFlowWorkOrderId;
        this.exclusionPayload['createdDate'] = (data.createdDate) ? data.createdDate : new Date();
        this.exclusionPayload.WorkOrderQuoteExclusions = data['data'].map(ex => {
            // if(ex.workOrderQuoteDetailsId && ex.workOrderQuoteDetailsId != 0){
            this.exclusionPayload.WorkOrderQuoteDetailsId = this.workOrderQuoteDetailsId;
            // }
            return {
                "WorkOrderQuoteExclusionsId": ex.workOrderQuoteExclusionsId ? ex.workOrderQuoteExclusionsId : 0,
                "WorkOrderQuoteDetailsId": ex.workOrderQuoteDetailsId ? ex.workOrderQuoteDetailsId : 0,
                "ItemMasterId": ex.itemMasterId,
                "SourceId": 1,
                "Reference": 2,
                "exstimtPercentOccuranceId": Number(ex.estimtPercentOccurrance),
                "Memo": ex.memo,
                "Quantity": ex.quantity,
                "UnitCost": ex.unitCost,
                "ExtendedCost": ex.extendedCost,
                "MarkupPercentageId": Number(ex.markUpPercentageId),
                "CostPlusAmount": ex.costPlusAmount,
                "FixedAmount": ex.fixedAmount,
                "taskId": ex.taskId,
                "masterCompanyId": (ex.masterCompanyId == '') ? 0 : ex.masterCompanyId,
                "CreatedBy": "admin",
                "UpdatedBy": "admin",
                "IsActive": true,
                "IsDeleted": ex.isDeleted,
                "BillingMethodId": Number(ex.billingMethodId),
                "BillingRate": ex.billingRate,
                "BillingAmount": ex.billingAmount,
                "headerMarkupId": ex.headerMarkupId,
                "markupFixedPrice": ex.markupFixedPrice,
                "itemClassificationId": ex.itemClassificationId
            }
        })
        this.exclusionPayload['WorkOrderQuoteTask'] = [];
        data['taskSum'].forEach(
            (x) => {
                this.WOTaskDetails.forEach(
                    (td) => {
                        if (td.taskId == x.TaskId) {
                            x['WorkOrderQuoteTaskId'] = td['workOrderQuoteTaskId'];
                        }
                    }
                );
                this.exclusionPayload['WorkOrderQuoteTask'].push({ ...x, woPartNoId: this.selectedPartNumber['woPartNoId'] })

            }
        )
        this.workOrderService.saveExclusionsQuote(this.exclusionPayload)
            .subscribe(
                res => {
                    this.tabQuoteCreated['exclusions'] = true;
                    this.workOrderExclusionsList = res.workOrderQuoteExclusions;
                    for (let exc in this.workOrderExclusionsList) {
                        if (this.workOrderExclusionsList[exc]['billingAmount']) {
                            this.workOrderExclusionsList[exc]['billingAmount'] = Number(this.workOrderExclusionsList[exc]['billingAmount'].toString().split(',').join('')).toFixed(2);
                        }
                        if (this.workOrderExclusionsList[exc]['billingRate']) {
                            this.workOrderExclusionsList[exc]['billingRate'] = Number(this.workOrderExclusionsList[exc]['billingRate'].toString().split(',').join('')).toFixed(2);
                        }
                        if (this.workOrderExclusionsList[exc]['unitCost']) {
                            this.workOrderExclusionsList[exc]['unitCost'] = Number(this.workOrderExclusionsList[exc]['unitCost'].toString().split(',').join('')).toFixed(2);
                        }
                        if (this.workOrderExclusionsList[exc]['extendedCost']) {
                            this.workOrderExclusionsList[exc]['extendedCost'] = Number(this.workOrderExclusionsList[exc]['extendedCost'].toString().split(',').join('')).toFixed(2);
                        }
                    }
                    this.updateWorkOrderQuoteDetailsId(res.workOrderQuoteDetailsId);
                    this.getQuoteExclusionListByWorkOrderQuoteId();
                    this.partNumberSelected(this.selectedPartNumber);
                    // this.updateWorkOrderQuoteDetailsId(res.workOrderQuoteExclusions[0].workOrderQuoteDetailsId)
                    this.alertService.showMessage(
                        this.moduleName,
                        'Quotation created  Succesfully',
                        MessageSeverity.success
                    );
                },
                err => {
                    this.errorHandling(err);
                }
            )
    }

    updateWorkOrderExclusionsList(data) {
        const exclusionsArr = data.exclusions.map(x => {
            return {
                ...x,
                masterCompanyId: 1,
                isActive: true,
                workOrderId: this.workOrderId, workFlowWorkOrderId: this.workFlowWorkOrderId
            }
        });
        this.workorderMainService.updateWorkOrderExclusionList(exclusionsArr).subscribe(res => {
            this.workFlowObject.materialList = [];
            this.alertService.showMessage(
                this.moduleName,
                'Update Work Order Exclusions  Succesfully',
                MessageSeverity.success
            );
            this.getQuoteExclusionListByWorkOrderQuoteId();
        },
            err => {
                this.errorHandling(err);
            })
    }

    getExclusionListByWorkOrderId() {
        if (this.workFlowWorkOrderId !== 0 && this.workOrderId) {
            this.workorderMainService.getWorkOrderExclusionsList(this.workFlowWorkOrderId, this.workOrderId).subscribe((res: any[]) => {
                this.workFlowObject.materialList = [];
                this.workOrderExclusionsList = res;
                for (let exc in this.workOrderExclusionsList) {
                    if (this.workOrderExclusionsList[exc]['billingAmount']) {
                        this.workOrderExclusionsList[exc]['billingAmount'] = Number(this.workOrderExclusionsList[exc]['billingAmount'].toString().split(',').join('')).toFixed(2);
                    }
                    if (this.workOrderExclusionsList[exc]['billingRate']) {
                        this.workOrderExclusionsList[exc]['billingRate'] = Number(this.workOrderExclusionsList[exc]['billingRate'].toString().split(',').join('')).toFixed(2);
                    }
                    if (this.workOrderExclusionsList[exc]['unitCost']) {
                        this.workOrderExclusionsList[exc]['unitCost'] = Number(this.workOrderExclusionsList[exc]['unitCost'].toString().split(',').join('')).toFixed(2);
                    }
                    if (this.workOrderExclusionsList[exc]['extendedCost']) {
                        this.workOrderExclusionsList[exc]['extendedCost'] = Number(this.workOrderExclusionsList[exc]['extendedCost'].toString().split(',').join('')).toFixed(2);
                    }
                }
            },
            err => {
                this.errorHandling(err);
            })

        }
    }

    saveWorkOrderChargesList(data) {
        if (!this.workOrderChargesList) {
            this.workOrderChargesList = [];
        }
        this.workOrderChargesList = [...this.workOrderChargesList, ...data['charges']];
        for (let charge in this.workOrderChargesList) {
            this.workOrderChargesList[charge]['unitCost'] = Number(this.workOrderChargesList[charge]['unitCost'].toString().split(',').join('')).toFixed(2);
            this.workOrderChargesList[charge]['extendedCost'] = Number(this.workOrderChargesList[charge]['extendedCost'].toString().split(',').join('')).toFixed(2);
        }
    }

    saveMaterialListForWO(data) {
        this.disableMat=false; 
        data['materialList'].forEach( 
            mData => {
                if (mData.billingRate) {
                    mData.billingRate = Number(mData.billingRate.toString().split(',').join('')).toFixed(2);
                }
                if (mData.unitCost) {
                    mData.unitCost = Number(mData.unitCost.toString().split(',').join('')).toFixed(2);
                }
                mData['billingAmount'] = (mData.quantity * Number(mData.billingRate.toString().split(',').join(''))).toFixed(2);
                mData.partNumber= mData.partItem.partName;
                mData.taskId=(typeof mData.taskId == 'object')? mData.taskId.taskId:mData.taskId;
                mData.taskName=(typeof mData.taskId == 'object')?mData.taskId.description:mData.taskName;
                mData.billingMethodId=this.costPlusType ? this.costPlusType :0;
                mData.markupPercentageId=this.overAllMarkup ? this.overAllMarkup : 0;

                // (typeof mList.taskId === 'object')?mList.taskId.taskId :mList.taskId,
            }
        )
        if (!this.editMatData || this.editMatData.length == 0) {
            let temp = []
            let formedData = [];
            this.materialListQuotation.forEach(
                (x) => {
                    formedData = [...formedData, ...x];
                }
            )
            formedData = [...formedData, ...data['materialList']];
            temp = formedData.reduce(function (r, a) {
                r[a['taskId']] = r[a['taskId']] || [];
                r[a['taskId']].push(a);
                return r;
            }, Object.create(null));
            this.materialListQuotation = [];
            for (let x in temp) {
                // this.workOrderExclusionsList = [...this.workOrderExclusionsList, ...this.workOrderExclusionsLists[x].map(da=>{ return {...da, taskId:x}})]
                this.materialListQuotation.push(temp[x]);
            }
        }
        else {
            this.editMatData = [];
        }
        $('#addNewMaterials').modal('hide');
    }
    getMarkup(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            // this.setEditArray.push(this.currentAsset.tangibleClassId ? this.currentAsset.tangibleClassId : 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        // this.commonservice.smartDropDownList('[Percent]', 'PercentId', 'PercentValue').subscribe((res) => {
        this.commonService.autoSuggestionSmartDropDownList('[Percent]', 'PercentId', 'PercentValue', strText, true, 200, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.markupList = res;
                this.markupList.sort((n1,n2) => n1.label - n2.label);
            }
        },err => {
             this.errorHandling(err);
            })
    }
    markupChanged(matData, type) {
        try {
            this.markupList.forEach((markup) => {
                if (type == 'row' && markup.value == matData.markupPercentageId) {
                    matData.tmAmount = Number(matData.extendedCost) + ((Number(matData.extendedCost) / 100) * Number(markup.label))
                    matData['billingRate'] = (Number(matData['unitCost']) + ((Number(matData['unitCost'].toString().split(',').join('')) / 100) * Number(markup.label))).toFixed(2)
                    matData['billingAmount'] = this.formateCurrency(Number(matData['billingRate'].toString().split(',').join('')) * Number(matData.quantity));
                }
                else if (type == 'all' && markup.value == this.overAllMarkup) {
                    this.materialListQuotation.forEach((x) => {
                        x.forEach((mData) => {
                            mData.markupPercentageId = this.overAllMarkup;
                            mData['billingRate'] = (Number(mData['unitCost'].toString().split(',').join('')) + ((Number(mData['unitCost'].toString().split(',').join('')) / 100) * Number(markup.label))).toFixed(2)
                            mData['billingAmount'] = this.formateCurrency(Number(mData['billingRate'].toString().split(',').join('')) * Number(mData.quantity));
                        })
                    })
                }
            })
        }
        catch (e) {
        }
    }

    saveBuildFromScratch(data) {
        let materialList = [];
        let chargesList = [];
        let exclusionsList = [];
        let laborList = [];
        if (data) {
            data.forEach((da) => {
                if (da.materialList) {
                    if (this.materialListQuotation) {
                        let temp = []
                        let formedData = [];
                        this.materialListQuotation.forEach(
                            (x) => {
                                formedData = [...formedData, ...x];
                            }
                        )
                        formedData = [...formedData, ...da.materialList]

                        temp = formedData.reduce(function (r, a) {
                            r[a['taskId']] = r[a['taskId']] || [];
                            r[a['taskId']].push(a);
                            return r;
                        }, Object.create(null));
                        this.materialListQuotation = [];
                        for (let x in temp) {
                            // this.workOrderExclusionsList = [...this.workOrderExclusionsList, ...this.workOrderExclusionsLists[x].map(da=>{ return {...da, taskId:x}})]
                            this.materialListQuotation.push(temp[x]);
                        }
                    }
                    else {
                        this.materialListQuotation = [];
                    }
                }
                if (da.charges) {
                    chargesList = [...chargesList, ...da.charges];
                }
                if (da.expertise) {
                    laborList = [...exclusionsList, ...da.expertise];
                }
                if (da.exclusions) {
                    exclusionsList = [...exclusionsList, ...da.exclusions.map(x => { return { ...x, epn: x.partNumber, epnDescription: x.partDescription } })];
                    // exclusionsList = [...exclusionsList, ...da.exclusions];
                }
            })
            this.createMaterialQuote();
            this.saveWorkOrderExclusionsList(exclusionsList);
            this.createChargeQuote(chargesList);
        }
    }

    editMaterialList(matData) {
        this.editMatData=[]
        matData.unitOfMeasure=matData.uom;
        const eData=[matData]
        this.editMatData = [...eData];
        // this.editMatData[0].materialMandatoriesId=this.editMatData[0].materialMandatoriesId;
        // this.editMatData[0].materialMandatoriesId=this.editMatData[0].mandatoryOrSupplemental;
        this.editMatData[0].partItem= { partId:this.editMatData[0].itemMasterId, partName:this.editMatData[0].partNumber }

    }

    deleteMaterialList(mainIndex, subIndex) {
        this.materialListQuotation[mainIndex][subIndex].isDeleted = true;
        this.disableMat=false;
    }

    updateWorkOrderChargesList(data) {
    }

    checkValidQuote() {
        if (this.quoteDueDate && this.validFor && this.currency) {
            return false;
        }
        else {
            return true;
        }
    }

    updateWorkOrderQuoteDetailsId(id) {
        this.workOrderQuoteDetailsId = id;
        this.laborPayload.WorkOrderQuoteDetailsId = id;
        this.chargesPayload.WorkOrderQuoteDetailsId = id;
        this.exclusionPayload.WorkOrderQuoteDetailsId = id;
        this.materialListPayload.WorkOrderQuoteDetailsId = id;
        this.quoteFreightListPayload.WorkOrderQuoteDetailsId = id;
    }

    setWorkOrderQuoteId(id) {
        this.laborPayload.WorkOrderQuoteId = id;
        this.exclusionPayload.WorkOrderQuoteId = id;
        this.chargesPayload.WorkOrderQuoteId = id;
        this.materialListPayload.WorkOrderQuoteId = id;;
        this.quoteFreightListPayload.WorkOrderQuoteId = id;
    }

    getQuoteTabData() {
        // this.getQuoteExclusionListByWorkOrderQuoteId();
        // this.getQuoteMaterialListByWorkOrderQuoteId();
        // this.getQuoteChargesListByWorkOrderQuoteId();
        // this.getQuoteLaborListByWorkOrderQuoteId();
        // this.getQuoteFreightListByWorkOrderQuoteId();
    }
    getTotalQuantity() {
        let totalQuantity = 0;
        if( this.materialListQuotation &&  this.materialListQuotation.length !=0){
        this.materialListQuotation.forEach(
            (material) => {
                totalQuantity += this.getTotalTaskQuantity(material);
            }
        )
        return totalQuantity;
        }
    }

    getTotalTaskQuantity(data) {
        let totalQuantity = 0;
        data.forEach(
            (material) => {
                if (material.quantity && !material.isDeleted) {
                    totalQuantity += Number(material.quantity);
                }
            }
        )
        return totalQuantity;
    }

    getTotalUnitCost() {
        let total = 0;
        if( this.materialListQuotation &&  this.materialListQuotation.length !=0){
        this.materialListQuotation.forEach(
            (material) => {
                total += Number(this.getTotalTaskUnitCost(material));
            }
        )
        return total.toFixed(2);
        }
    }

    getTotalTaskUnitCost(data) {
        let total = 0;
        data.forEach(
            (material) => {
                if (material.unitCost && material.quantity && !material.isDeleted) {
                    total += Number(material.quantity * Number(material.unitCost.toString().split(',').join('')));
                }
            }
        )
        return total.toFixed(2);
    }

    totalMaterialBillingRate() {
        let total = 0;
        this.materialListQuotation.forEach(
            (material) => {
                total += Number(this.totalTaskMaterialBillingRate(material));
            }
        )
        return total.toFixed(2);
    }

    totalTaskMaterialBillingRate(data) {
        let total = 0;
        data.forEach(
            (material) => {
                if (material.billingRate && !material.isDeleted) {
                    total += Number(material.billingRate.toString().split(',').join(''));
                }
            }
        )
        return total.toFixed(2);
    }

    totalMaterialBillingAmount() {
        let total = 0;
        if( this.materialListQuotation &&  this.materialListQuotation.length !=0){
        this.materialListQuotation.forEach(
            (material) => {
                total += Number(this.totalTaskMaterialBillingAmount(material));
            }
        )
        this.materialFlatBillingAmount = total? total.toFixed(2):'0.00';
        return total.toFixed(2);
        }
    }

    totalTaskMaterialBillingAmount(data) {
        let total = 0;
        data.forEach(
            (material) => {
                if (material.billingAmount && !material.isDeleted) {
                    total += Number(material.billingAmount.toString().split(',').join(''));
                }
            }
        )
        return total.toFixed(2);
    }

    getEmpData(empId): object {
        let result = {};
        this.employeeList.forEach(
            (emp) => {
                if (emp.value == empId) {
                    result = emp;
                    return;
                }
            }
        )
        return result;
    }

    saveExclusionsList(event) {
        if (this.isQuote) {
            this.workOrderExclusionsList = [...this.workOrderExclusionsList, ...event['exclusions'].map(x => { return { ...x, epn: x.partNumber, epnDescription: x.partDescription } })];
            for (let exc in this.workOrderExclusionsList) {
                if (this.workOrderExclusionsList[exc]['billingAmount']) {
                    this.workOrderExclusionsList[exc]['billingAmount'] = Number(this.workOrderExclusionsList[exc]['billingAmount'].toString().split(',').join('')).toFixed(2);
                }
                if (this.workOrderExclusionsList[exc]['billingRate']) {
                    this.workOrderExclusionsList[exc]['billingRate'] = Number(this.workOrderExclusionsList[exc]['billingRate'].toString().split(',').join('')).toFixed(2);
                }
                if (this.workOrderExclusionsList[exc]['unitCost']) {
                    this.workOrderExclusionsList[exc]['unitCost'] = Number(this.workOrderExclusionsList[exc]['unitCost'].toString().split(',').join('')).toFixed(2);
                }
                if (this.workOrderExclusionsList[exc]['extendedCost']) {
                    this.workOrderExclusionsList[exc]['extendedCost'] = Number(this.workOrderExclusionsList[exc]['extendedCost'].toString().split(',').join('')).toFixed(2);
                }
            }
            $('#addNewExclusions').modal('hide');
        }
    }

    updateExclusionsList(event) {
        if (this.isQuote && this.isEdit) {
            this.workOrderExclusionsList[this.editingIndex] = event.exclusions[0];
            for (let exc in this.workOrderExclusionsList) {
                if (this.workOrderExclusionsList[exc]['billingAmount']) {
                    this.workOrderExclusionsList[exc]['billingAmount'] = Number(this.workOrderExclusionsList[exc]['billingAmount'].toString().split(',').join('')).toFixed(2);
                }
                if (this.workOrderExclusionsList[exc]['billingRate']) {
                    this.workOrderExclusionsList[exc]['billingRate'] = Number(this.workOrderExclusionsList[exc]['billingRate'].toString().split(',').join('')).toFixed(2);
                }
                if (this.workOrderExclusionsList[exc]['unitCost']) {
                    this.workOrderExclusionsList[exc]['unitCost'] = Number(this.workOrderExclusionsList[exc]['unitCost'].toString().split(',').join('')).toFixed(2);
                }
                if (this.workOrderExclusionsList[exc]['extendedCost']) {
                    this.workOrderExclusionsList[exc]['extendedCost'] = Number(this.workOrderExclusionsList[exc]['extendedCost'].toString().split(',').join('')).toFixed(2);
                }
            }
            $('#addNewExclusions').modal('hide');
            this.isEdit = false;
        }
    }

    formDataFromViewListData() {
        if (this.quoteListViewData) {
            this.quoteForm.quoteNumber = this.quoteListViewData.quoteNumber;
            this.quoteForm.openDate = new Date(this.quoteListViewData.openDate);
            this.quoteDueDate = new Date(this.quoteListViewData.quoteDueDate);
            this.validFor = this.quoteListViewData.validForDays;
            this.expirationDate = new Date(this.quoteListViewData.expirationDate);
            if (this.quoteListViewData.quoteStatus == "open") {
                this.quoteForm.expirationDateStatus = 1;
            }
            else if (this.quoteListViewData.quoteStatus == "closed") {
                this.quoteForm.expirationDateStatus = 2;
            }
            if (this.quoteListViewData.quoteStatus == "cancelled") {
                this.quoteForm.expirationDateStatus = 3;
            }
            if (this.quoteListViewData.quoteStatus == "delayed") {
                this.quoteForm.expirationDateStatus = 4;
            }
            this.workOrderNumber = this.quoteListViewData.workOrderNum;
            this.customerName = this.quoteListViewData.customerName;
            this.customerCode = this.quoteListViewData.customerCode;
            this.customerContact = this.quoteListViewData.customerContact;
            this.customerEmail = this.quoteListViewData.customerEmail;
            this.customerPhone = this.quoteListViewData.customerPhone;
            this.customerRef = this.quoteListViewData.customerRef;
            this.accountsReceivableBalance = this.quoteListViewData.arBalance;
            this.creditLimit = formatNumberAsGlobalSettingsModule(this.quoteListViewData.creditLimit, 2);
            this.creditTerms = this.quoteListViewData.creditTerms;
            // this.salesPerson = this.quoteListViewData.salesPerson;
            this.csr = this.quoteListViewData.csr;
            this.employeeName = this.quoteListViewData.employee;
            this.currency = this.quoteListViewData.currency;
            this.dso = this.quoteListViewData.dso;
            this.warnings = this.quoteListViewData.warnings;
            this.memo = this.quoteListViewData.memo;
        }
    }

    typeChange() {
        this.getDisplayData(this.displayType);
    }

    createQuote() {
        window.open(` /workordersmodule/workorderspages/app-work-order-quote?workorderid=${this.workorderid}`);
    }

    filterEmployee(event): void {
        this.employeeList = this.employeesOriginalData;
        if (event.query !== undefined && event.query !== null) {
            const employee = [...this.employeesOriginalData.filter(x => {
                return x.label.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.employeeList = employee;
        }
    }

    clearautoCompleteInput(currentRecord, field) {
        currentRecord[field] = null;
    }

    onClickBackToWO() {
        this.enableBackToWO.emit(true);
    }

    noBack(data) {
    }
    
    getCustomerWarningsList(): void {
        this.commonService.smartDropDownList('CustomerWarningType', 'CustomerWarningTypeId ', 'Name').subscribe(res => {
            res.forEach(element => {
                if (element.label == 'Create WO Quote for MPN') {
                    this.createQuoteListID = element.value;
                }
            });
        },
        err => {
            this.errorHandling(err);
        })
    }

    customerWarnings(customerId) {
        this.commonService.customerWarnings(customerId, this.createQuoteListID).subscribe((res: any) => {
            if (res) {
                this.warningMessage = res.warningMessage;
                this.warningID = res.customerWarningId;
                this.currentWarningMessage= res.warningMessage;
                this.customerResctrictions(customerId, this.warningMessage, this.createQuoteListID);
            }
        },
        err => {
            this.errorHandling(err);
        })
    }

    customerResctrictions(customerId, warningMessage, id) {
        this.restrictMessage = '';
        //   if(customerId && this.customerWarningListId){
        this.commonService.customerResctrictions(customerId, id).subscribe((res: any) => {
            if (res) {
                this.restrictMessage = res.restrictMessage;
                this.restrictID = res.customerWarningId;
                if (this.warningID != 0 && this.restrictID == 0) {
                    this.showAlertMessage(warningMessage, this.restrictMessage);
                } else if (this.warningID == 0 && this.restrictID != 0) {
                    this.showAlertMessage(warningMessage, this.restrictMessage);
                } else if (this.warningID != 0 && this.restrictID != 0) {
                    this.showAlertMessage(warningMessage, this.restrictMessage);
                } else if (this.warningID == 0 && this.restrictID == 0) {
                    console.log("hello")
                    // window.open(`/workordersmodule/workorderspages/app-work-order-quote?workorderid=${this.workOrderId}`);
                }
            }
        })
    }

    showAlertMessage(warningMessage, restrictMessage) {
        $('#warnRestrictMesg').modal("show");
        //   this.modal.close();
    }

    WarnRescticModel() {
        // this.modal.close();
        // if (this.restrictID == 0) {
        //     window.open(`/workordersmodule/workorderspages/app-work-order-quote?workorderid=${this.workOrderId}`);
        // }
        $('#warnRestrictMesg').modal("hide");
        this.warningMessage = '';
        this.restrictMessage = '';
    }

    approvalGridActiveTabChange(val) {
        this.resetApprovalGridData();
        this.approvalGridActiveTab = val;

        if (val == 'internalApprovers') {
            this.getApproversList();
        }
        else if (val == 'workOrderQuoteAnalysis') {
            this.getWOQuoteAnalysisList();
        }
        else {
            this.getWOQuoteApprovalList();
        }
        let a = document.getElementById('approvalTabs');
        if(a){
            a.scrollIntoView();
        }
    }

    getApproversList(){ 
        let currentUser = JSON.parse(window.sessionStorage.getItem('current_user'));
        if(!currentUser){
            currentUser = JSON.parse(window.localStorage.getItem('current_user'));
        }
        this.isCurrentUserApprovalLimitExceeded = true;
if(this.quotationHeader  && this.quotationHeader['workOrderQuoteId']){
        this.isSpinnerVisible = true;
		this.purchaseOrderService.approverslistbyTaskId(2, this.quotationHeader['workOrderQuoteId']).subscribe(res => {
                         this.internalApproversList = res;
                         this.approvers = res;
						 this.internalApproversList.map(x => {
                            if(currentUser && currentUser['email'] == x.approverEmails && !x.isExceeded){
                               this.isCurrentUserApprovalLimitExceeded = false;
                             }
                             
							//this.apporoverEmailList = x.approverEmails;
                            //this.apporoverNamesList.push(x.approverName);
                            
						})
						 this.isSpinnerVisible = false;
						},
						err =>{
							 this.isSpinnerVisible = false;
						 });
        // this.workOrderService.getTotals(this.quotationHeader['workOrderQuoteId'])
        // .subscribe(
        //     (total: any) => {
        //         this.workOrderService.getInternalApproversList(2, total.totalRevenue)
        //             .subscribe(
        //                 (res) => {
        //                     this.internalApproversList = res.map(x=>{
        //                         if(currentUser && currentUser['email'] == x.approverEmail && !x.isExceeded){
        //                             this.isCurrentUserApprovalLimitExceeded = false;
        //                         }
        //                         return {...x, 'upperValue': this.formateCurrency(x.upperValue), 'totalCost': this.formateCurrency(x.totalCost), 'lowerValue': this.formateCurrency(x.lowerValue)}
        //                     });
        //                 }
        //             )
        //     },
        //     err => {
        //         this.errorHandling(err);
        //     }
        // )
                        }
    }

    resetApprovalGridData() {
        this.internalApproversList = [];
        this.approvalGridActiveTab = '';
    }

    onApprovalSelected(approver, i) {
        if (approver.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) {
            if (this.defaultContactId) {
                this.woQuoteApprovalList[i].customerApprovedById = this.defaultContactId;
            } else {
                this.woQuoteApprovalList[i].customerApprovedById = '';
            }
        }
    }
    onRejectedSelected(approver, i) {
        if (approver.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) {
            if (this.defaultContactId) {
                this.woQuoteApprovalList[i].customerRejectedbyID = this.defaultContactId;
            } else {
                this.woQuoteApprovalList[i].customerApprovedById = '';
            }
        }
    }

    get employeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }

    getPartToDisableOrNot(part) {
        if (part.actionStatus != 'Approved') {
            if (part.approvalActionId == ApprovalProcessEnum.SentForInternalApproval) {
                return true;
            } else if (part.approvalActionId == ApprovalProcessEnum.SubmitInternalApproval) {
                if (this.approvers && this.approvers.length > 0) {
                    let approverFound = this.approvers.find(approver => approver.approverId == this.employeeId && approver.isExceeded == false);
                    if (approverFound) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else if (part.approvalActionId == ApprovalProcessEnum.SentForCustomerApproval) {
                return true;
            } else if (part.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    getWOQuoteApprovalList() {
        this.getApproversList();
        this.getApproverStatusList();
        if(this.quotationHeader && this.quotationHeader['CustomerId']){
        this.commonService.getCustomerContactsById(this.quotationHeader['CustomerId'],this.authService.currentUser.masterCompanyId).subscribe(res => {      
            this.customerContactList = res;
            if(this.customerContactList.length > 0){

                this.setDefaultContact();
                for(let i=0; i<this.customerContactList.length; i++){
                    if(this.customerContactList[i].isDefaultContact == true){
                        this.emailCustomerContact = this.customerContactList[i];
                        this.contactSelected(this.customerContactList[i])
                    }
                }
            }
        },
        err => {
            this.errorHandling(err);
        })
    }
    if(this.quotationHeader && this.quotationHeader['workOrderQuoteId']){
        this.workOrderService.getWOQuoteApprovalList(this.quotationHeader['workOrderQuoteId'],this.authService.currentUser.masterCompanyId)
            .subscribe(
                (res) => {
                   
                    this.woQuoteApprovalList = [];

                    res.forEach(
                        (x)=>{
                            x.marginPercentage=x.marginPercentage ? formatNumberAsGlobalSettingsModule(x.marginPercentage, 2) : '0.00';
                            x.margin= x.margin ? formatNumberAsGlobalSettingsModule(x.margin, 2): '0.00';
                            x.revenue= x.revenue ? formatNumberAsGlobalSettingsModule(x.revenue, 2): '0.00';
                            x.directCostPercentage= x.directCostPercentage ? formatNumberAsGlobalSettingsModule(x.directCostPercentage, 2): '0.00';
                            x.directCost= x.directCost ? formatNumberAsGlobalSettingsModule(x.directCost, 2): '0.00';
                            x.freightCost= x.freightCost ? formatNumberAsGlobalSettingsModule(x.freightCost, 2): '0.00';
                            x.chargesCost= x.chargesCost ? formatNumberAsGlobalSettingsModule(x.chargesCost, 2): '0.00';
                            x.overHeadCost= x.overHeadCost ? formatNumberAsGlobalSettingsModule(x.overHeadCost, 2): '0.00';

                            x.overHeadPercentage= x.overHeadPercentage ? formatNumberAsGlobalSettingsModule(x.overHeadPercentage, 2): '0.00';
                            x.laborRevPercentage= x.laborRevPercentage ? formatNumberAsGlobalSettingsModule(x.laborRevPercentage, 2): '0.00';
                            x.laborCost= x.laborCost ? formatNumberAsGlobalSettingsModule(x.laborCost, 2): '0.00';
                            x.partsCost= x.partsCost ? formatNumberAsGlobalSettingsModule(x.partsCost, 2): '0.00';
                            x.partsRevPercentage= x.partsRevPercentage ? formatNumberAsGlobalSettingsModule(x.partsRevPercentage, 2): '0.00';

                            if(x.internalSentDate){
                                x.internalSentDate = new Date(x.internalSentDate);
                                if(!x.internalApprovedDate){
                                    x.internalApprovedDate = new Date();
                                    x.internalApprovedDate=  moment(new Date()).format('MM/DD/YYYY');
                                }
                                // else{
                                //     x.internalApprovedDate=  moment(x.internalApprovedDate).format('MM/DD/YYYY');
                                // }
                            }
                            else if(!x.internalSentDate){
                                x.internalSentDate = new Date();
                            }
                            if(x.customerSentDate){
                                x.customerSentDate = new Date(x.customerSentDate);
                                if(!x.customerApprovedDate){
                                   // x.customerApprovedDate = new Date();
                                    x.customerApprovedDate=  moment(new Date()).format('MM/DD/YYYY');
                                }
                            
                            }
                            if(x.internalApprovedDate){
                               // x.internalApprovedDate = new Date(x.internalApprovedDate);
                               x.internalApprovedDate=  moment(x.internalApprovedDate).format('MM/DD/YYYY');
                                if(!x.customerSentDate){
                                    x.customerSentDate = new Date();
                                }
                            }
                            if(x.customerApprovedDate){
                                //x.customerApprovedDate = new Date(x.customerApprovedDate);
                                x.customerApprovedDate=  moment(x.customerApprovedDate).format('MM/DD/YYYY');
                            }
                            if(x.internalStatusId != 3)
                            {
                                if(x.internalApprovedDate){
                                    x.internalApprovedDate=  moment(x.internalApprovedDate).format('MM/DD/YYYY');
                                }
                                else
                                {
                                    x.internalApprovedDate=  moment(new Date()).format('MM/DD/YYYY');
                                }
                                x.internalRejectedDate=null;

                            }else
                            {
                                if(x.internalRejectedDate){
                                    x.internalRejectedDate=  moment(x.internalRejectedDate).format('MM/DD/YYYY');
                                }
                                else
                                {
                                    x.internalRejectedDate=  moment(new Date()).format('MM/DD/YYYY');
                                }
                                x.internalApprovedDate=null;
                            }

                            if(x.customerStatusId != 3)
                            {
                                if(x.customerApprovedDate){
                                    x.customerApprovedDate=  moment(x.customerApprovedDate).format('MM/DD/YYYY');
                                }
                                else
                                {
                                    x.customerApprovedDate=  moment(new Date()).format('MM/DD/YYYY');
                                }
                                x.internalRejectedDate=null;

                            }else
                            {
                                if(x.customerRejectedDate){
                                    x.customerRejectedDate=  moment(x.customerRejectedDate).format('MM/DD/YYYY');
                                }
                                else
                                {
                                    x.customerRejectedDate=  moment(new Date()).format('MM/DD/YYYY');
                                }
                                x.customerApprovedDate=null;
                            }
                           

                            // if(x.customerRejectedDate){
                            //     if(x.customerRejectedDate)
                            //     x.customerRejectedDate=  moment(x.customerRejectedDate).format('MM/DD/YYYY');
                            // }
                            //this.fields.forEach(
                            //    field =>{
                            //        if(x[field]){
                            //            x[field] = Number(x[field]).toFixed(2);
                            //        }
                            //    }
                            //)
                            //if(x.partsCost)
                            this.woQuoteApprovalList.push(x);
                        }
                    )
                },
                (err) => {
                    this.errorHandling(err);
                }
            )
    }
    }

    getApproverStatusList() { 
        this.setEditArray = [];
        const strText = '';   
            this.setEditArray.push(0); 
        this.commonService.autoSuggestionSmartDropDownList('ApprovalStatus', 'ApprovalStatusId', 'Name', strText, true, 20, this.setEditArray.join(), this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.statusList = res.map(x => {
                return {
                    ...x,
                    statusId: x.value,
                    name: x.label
                };
            });
            this.setStatusListForApproval(this.statusList);
        })
    }

    setStatusListForApproval(statusList) {
        let tempList = [];

        if (statusList && statusList.length > 0) {
            for (let i = 0; i < statusList.length; i++) {
                if (statusList[i].name === ApprovalStatusDescirptionEnum.Approved) {
                    tempList.push(statusList[i]);
                } else if (statusList[i].name === ApprovalStatusDescirptionEnum.Rejected) {
                    tempList.push(statusList[i]);
                }
            }
        }
        this.statusListForApproval = tempList;
    }

    setDefaultContact() {
        if (this.customerContactList) {
            if (this.customerContactList.length > 0) {
                for (let i = 0; i < this.customerContactList.length; i++) {
                    let isDefaultContact = this.customerContactList[i].isDefaultContact;
                    if (isDefaultContact) {
                        this.defaultContactId = this.customerContactList[i].contactId;
                    }
                }
            }
        }
    }

    getWOQuoteAnalysisList() {
        this.workOrderService.getWOQuoteAnalysisList(this.savedWorkOrderData.workOrderId,this.authService.currentUser.masterCompanyId)
            .subscribe(
                (res) => {
             if(res && res.length !=0){
                this.woQuoteAnalysisList = res.map(x =>{ return {
                    ...x,
                    marginPercentage:x.marginPercentage ? formatNumberAsGlobalSettingsModule(x.marginPercentage, 2) : '0.00',
                    margin: x.margin ? formatNumberAsGlobalSettingsModule(x.margin, 2): '0.00',
                    revenue: x.revenue ? formatNumberAsGlobalSettingsModule(x.revenue, 2): '0.00',
                    directCostRevenuePercentage: x.directCostRevenuePercentage ? formatNumberAsGlobalSettingsModule(x.directCostRevenuePercentage, 2): '0.00',
                    directCost: x.directCost ? formatNumberAsGlobalSettingsModule(x.directCost, 2): '0.00',
                    freightCost: x.freightCost ? formatNumberAsGlobalSettingsModule(x.freightCost, 2): '0.00',
                   chargesCost: x.chargesCost ? formatNumberAsGlobalSettingsModule(x.chargesCost, 2): '0.00',
                    overHeadCost: x.overHeadCost ? formatNumberAsGlobalSettingsModule(x.overHeadCost, 2): '0.00',
                   overHeadCostRevenuePercentage: x.overHeadCostRevenuePercentage ? formatNumberAsGlobalSettingsModule(x.overHeadCostRevenuePercentage, 2): '0.00',
                   laborRevenuePercentage: x.laborRevenuePercentage ? formatNumberAsGlobalSettingsModule(x.laborRevenuePercentage, 2): '0.00',
                  laborCost: x.laborCost ? formatNumberAsGlobalSettingsModule(x.laborCost, 2): '0.00',
                    materialCost: x.materialCost ? formatNumberAsGlobalSettingsModule(x.materialCost, 2): '0.00',
                   materialRevenuePercentage: x.materialRevenuePercentage ? formatNumberAsGlobalSettingsModule(x.materialRevenuePercentage, 2): '0.00',
                   totalLaborCost  : x.totalLaborCost ? formatNumberAsGlobalSettingsModule(x.totalLaborCost, 2): '0.00'
                }});
             }else{
                this.woQuoteAnalysisList=[];
             }
                },
                (err) => {
                    this.errorHandling(err);
                }
            )
    }

    selectAllApproval(type, isSelected) {
        this.woQuoteApprovalList.forEach(
            (x, i) => {
                let disableEdit = this.getPartToDisableOrNot(x);
                if (disableEdit) {
                    x.isSelected = !isSelected;
                    this.onApprovalSelected(x, i);
                }
            }
        )
    }

    getAllPartsToDisableOrNot() {
        var result = false;
        if (this.woQuoteApprovalList && this.woQuoteApprovalList.length > 0) {
            this.woQuoteApprovalList.forEach(
                (x) => {
                    if (x.actionStatus != 'Approved') {
                        if (x.approvalActionId == ApprovalProcessEnum.SentForInternalApproval) {
                            result = true;
                        } else if (x.approvalActionId == ApprovalProcessEnum.SubmitInternalApproval) {
                            if (this.approvers && this.approvers.length > 0) {
                                let approverFound = this.approvers.find(approver => approver.approverId == this.employeeId && approver.isExceeded == false);
                                if (approverFound) {
                                    result = true;
                                }
                            }
                        } else if (x.approvalActionId == ApprovalProcessEnum.SentForCustomerApproval) {
                            result = true;
                        } else if (x.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) {
                            result = true;
                        }
                    }
                }
            )
        }

        return result;
    }

    saveApprovalData() {


       // if (this.approvalGridActiveTab == 'setForInternalApproval' || this.approvalGridActiveTab == 'sentForCustomerApproval') {
        let payLoad = [];
        let currentEmployee = JSON.parse(localStorage.getItem('employee'));
            this.woQuoteApprovalList.forEach(
                x => {
                    if (x.isSelected) {

                     if(x.approvalActionId == ApprovalProcessEnum.SubmitInternalApproval)
                     {
                         if(x.internalStatusId !=3)
                         {
                            x.internalApprovedDate= new Date().toDateString();
                         }
                         else
                         {
                            x.internalRejectedDate= new Date().toDateString();
                         }
                      
                     }
                     if( x.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval)
                     {
                        x.customerApprovedDate= new Date().toDateString();

                        if(x.customerStatusId !=3)
                        {
                           x.customerApprovedDate= new Date().toDateString();
                           x.customerRejectedDate=null;
                           x.customerRejectedbyID= null;
                        }
                        else
                        {
                           x.customerRejectedDate= new Date().toDateString();
                           x.customerApprovedDate=null;
                           x.customerApprovedById= null;
                        }
                     }
                        let obj = {
                            "workOrderId": x.workOrderId,
                            "workOrderQuoteId": x.workOrderQuoteId,
                            "workOrderPartNoId": x.workOrderPartNoId,
                            "customerId": x.customerId,
                            "workOrderDetailId": x.workOrderDetailId,
                            "workOrderApprovalId": x.workOrderApprovalId,
                            "InternalSentDate": x.internalSentDate,
                            "InternalApprovedDate": x.internalApprovedDate,
                            "InternalRejectedDate": x.internalRejectedDate,
                            //"InternalRejectedby": x.internalRejectedby,
                            //"InternalApprovedById": currentEmployee.employeeId,
                            "CustomerSentDate": x.customerSentDate,
                            "customerApprovedDate": x.customerApprovedDate,
                            "CustomerRejectedDate": x.customerRejectedDate,
                            "customerApprovedById": x.customerApprovedById,
                            "CustomerRejectedbyID": x.customerRejectedbyID,
                            "internalStatusId": x.internalStatusId,
                            "customerStatusId": x.customerStatusId,
                            "internalMemo": x.internalMemo,
                            "customerMemo": x.customerMemo,
                            "UpdatedBy": this.authService.currentUser.userName,
                            "MasterCompanyId": x.masterCompanyId,
                            "ApprovalActionId": x.approvalActionId,
                            "IsInternalApprove": x.isInternalApprove,
                            "masterCompanyId": x.masterCompanyId,
                            "createdBy": this.authService.currentUser.userName,
                            "updatedBy": this.authService.currentUser.userName,
                            "createdDate": new Date().toDateString(),
                            "updatedDate": new Date().toDateString(),
                            "isActive": true,
                            "isDeleted": false
                        }

                        if(x.approvalActionId == 3){
                            obj['email'] = {
                                fromEmail: DBkeys.FROM_EMAIL_FOR_SENDING_MAIL,
                                toEmail: this.toEmail,
                                cc: this.cc,
                                bcc: this.bcc,
                                subject: this.subject,
                                emailBody: this.emailBody,
                                createdBy: this.authService.currentUser.userName,
                                updatedBy: this.authService.currentUser.userName,
                                createdDate: new Date(),
                                updatedDate: new Date(),
                                isActive: true,
                                isDeleted: false,
                                contactById: this.emailContactBy.employeeId,
                                emailType: this.emailType,
                                customerContactId: this.emailCustomerContact.emailContactId,
                                masterCompanyId:this.authService.currentUser.masterCompanyId
                            }
                        }

                        if (x.approvalActionId == 1) { // Sent for Internal Approvals
                            obj['InternalEmails'] = this.getApproversEmails();
                            obj['approvers'] = this.getApproversNames();
                        }
                        else {
                            obj['InternalEmails'] = "";
                            obj['approvers'] = "";
                        }
                        if (x.approvalActionId == 2) 
                        {

                            if(x.internalStatusId !=3)
                            {
                                obj['InternalApprovedById'] = currentEmployee.employeeId;
                                obj['InternalRejectedID'] = x.internalRejectedID;
                               //x.CustomerRejectedbyID=x.customerRejectedbyID;
                            }
                            else
                            {
                                obj['InternalRejectedID'] = currentEmployee.employeeId;
                                obj['InternalApprovedById'] = x.internalApprovedById;
                               //x.CustomerRejectedbyID=x.customerRejectedbyID;
                            }

                            
                        }
                        else {
                            obj['InternalApprovedById'] = x.internalApprovedById;
                            obj['InternalRejectedID'] = x.internalRejectedID;
                        }
                        payLoad.push(obj);
                    }
                }
            )
            $('#quoteVersion').modal('hide');
            this.isSpinnerVisible = true;
            this.workOrderService.sentForInternalApproval(payLoad)
                .subscribe(
                    res => {
                        this.emailBody='';
                        this.subject='';
                        this.alertService.showMessage(
                            this.moduleName,
                            `Data updated successfully`,
                            MessageSeverity.success
                        );
                        this.isSpinnerVisible = false;
                        this.getWOQuoteApprovalList();
                        this.updateQuotationHeader();
                    },
                    err => {
                        this.errorHandling(err);
                        this.isSpinnerVisible = false;
                    }
                )
    }

    getApproversEmails(){
        let result = '';
        this.internalApproversList.forEach(
            (x)=>{
                if(result != ''){
                    result += ','
                }
                result += x.approverEmail;
            }
        )
        return result;
    }

    getApproversNames(){
        let result = '';
        this.internalApproversList.forEach(
            (x)=>{
                if(result != ''){
                    result += ','
                }
                result += x.approverName;
            }
        )
        return result;
    }
    
    onAddTextAreaInfo(intApproval, index) {
        this.memoIndex = index;
        this.textAreaInfo = intApproval.internalMemo;
    }

    onSaveTextAreaInfo(memo) {
        if (memo) {
            this.textAreaInfo = memo;
            this.woQuoteApprovalList[this.memoIndex].internalMemo = this.textAreaInfo;
        }
        $("#textarea-popupintmemo").modal("hide");
    }

    onCloseTextAreaInfo() {
        $("#textarea-popupintmemo").modal("hide");
    }

    errorHandling(err){
        this.isSpinnerVisible=false
    }

    checkValidEmails(){
        let result = false;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(this.cc || this.bcc){
            result = true;
            if(this.cc){
                let emaillist = this.cc.split(',');
                let invalid = false;
                emaillist.forEach(x => {
                    if(!mailformat.test(x)){
                        invalid = true;
                    }
                });
                if(invalid){
                    return true;
                }
            }
            if(this.bcc){
                let emaillist = this.bcc.split(',');
                let invalid = false;
                
                emaillist.forEach(x => {
                    if(!mailformat.test(x)){
                        invalid = true;
                    }
                });
                if(invalid){
                    return true;
                }
            }
            result = false;
        }
        return result;
    }

    getAllEmailType() {
        this.setEditArray = [];
        const strText = '';
     
            this.setEditArray.push(0);

        this.commonService.autoSuggestionSmartDropDownList('EmailType', 'EmailTypeId', 'Name', strText, true, 20, this.setEditArray.join(), this.authService.currentUser.masterCompanyId).subscribe(res => {
           


        // this.commonService.smartDropDownList('EmailType', 'EmailTypeId', 'Name')
        // .subscribe((res: any[])=>{


                this.emailTypes = res;

                this.emailTypes.forEach(
                    (x)=>{
                        if(x.label == 'Manual'){
                            this.emailType = x.value;
                        }
                    }
                );
            },
            err => {
                this.errorHandling(err);
            })
    } 

    contactSelected(event){
        this.toEmail = event.email;
    }

    showEle(){
        $('#emailDetails').modal('show');
    }

    selectedCustomer(){
        this.cusContactList = this.customerContactList;
    }

    filterCustomerContact(event): void {
        this.cusContactList = this.customerContactList;
        if (event.query !== undefined && event.query !== null && event.query !== '') {
            const customers = [...this.customerContactList.filter(x => {
                return x.contactName.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.cusContactList = customers;
        }else{
            this.cusContactList = this.customerContactList; 
        }        
    }

    hideModal(modalName){
        $(`#${modalName}`).modal('hide');
    }

    saveApprovalProcess(){
        let openEmail = false;
        this.woQuoteApprovalList.forEach(
            x => {
                if (x.isSelected && x.approvalActionId == 3) {
                    openEmail = true;
                }
            }
        )
        if(openEmail){
            $('#quoteVersion').modal('show');
            this.emailContactBy = this.authService.currentEmployee;
            this.cusContactList = this.customerContactList;
        }
        else{
            this.saveApprovalData();
        }
    }

    formateCurrency(value){
        if(value){
            value = (Number(value.toString().split(',').join(''))).toFixed(2);
            let result = formatNumberAsGlobalSettingsModule(value, 0.00);
            return `${result}.00`;
        }
        return value;
    }

    calculatebCost(value,material): void {
        setTimeout(() => {
            material.billingAmount = value ? formatNumberAsGlobalSettingsModule(value, 2) : '0.00';
        }, 500);
    }

    updateQuotationHeader(){
        this.workOrderService.getWorkOrderQuoteDetail(this.workOrderId, this.workFlowWorkOrderId,this.authService.currentUser.masterCompanyId)
        .subscribe(
            (res: any) => {
                
                if (res) {
                    this.quoteForm['versionNo'] = res.workOrderQuote['versionNo'];
                    this.quoteForm.expirationDateStatus = res.workOrderQuote.quoteStatusId;
                }
            },
            err => {
                this.errorHandling(err);
            }
        )
    }

    getChargesListByWorkOrderId() {}
    getFreightListByWorkOrderId() {}
    updateWorkOrderFreightsList($event) {}

    parseToInt(str : any) {
        return Number(str);
    }

    onFilterTangible(value) {
        this.getAllWorkOrderStatus(value);
    }
    
    getAllWorkOrderStatus(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.quoteForm.expirationDateStatus? this.quoteForm.expirationDateStatus :0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('WorkOrderQuoteStatus', 'WorkOrderQuoteStatusId', 'Description', strText, true, 20, this.setEditArray.join(), this.authService.currentUser.masterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.quoteStatusList = res;
            }
        })
    }

    onFilterCurrency(value) {
        this.loadCurrency(value);
    }

    loadCurrency(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.quoteForm.expirationDateStatus? this.quoteForm.expirationDateStatus :0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'code', strText, true, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.currencyList = res;
            }
        })
    }
    
    getValid(){
        this.upDateDisabeldbutton=false;
    }
    
    onAddDescription(value) {
        this.disableForMemo = true;
        this.type = value;
        this.tempMemo = "";
            this.tempMemo = this.memo;
    }

    onSaveDescription() {
            this.memo = this.tempMemo;
        this.upDateDisabeldbutton = false;
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

    memoValidate() {
        this.disableForMemo = false;
    }

    getWOMaterialList(){
        this.isSpinnerVisible = true;
        this.workorderMainService.getWorkOrderMaterialList(this.workFlowWorkOrderId, this.workOrderId,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.isSpinnerVisible = false;
            this.workOrderMaterialList = res; 
         
            if (res.length > 0) {
                this.materialListQuotation = res;
                if (this.materialListQuotation && this.materialListQuotation.length > 0) {
                    for (let charge in this.materialListQuotation) {
                        if (this.materialListQuotation[charge]['unitCost']) {
                            this.materialListQuotation[charge]['unitCost'] = Number(this.materialListQuotation[charge]['unitCost'].toString().split(',').join('')).toFixed(2);
                        }
                        if (this.materialListQuotation[charge]['billingRate']) {
                            this.materialListQuotation[charge]['billingRate'] = Number(this.materialListQuotation[charge]['billingRate'].toString().split(',').join('')).toFixed(2);
                        }
                        if (this.materialListQuotation[charge]['billingAmount']) {
                            this.materialListQuotation[charge]['billingAmount'] = Number(this.materialListQuotation[charge]['billingAmount'].toString().split(',').join('')).toFixed(2);
                        }
                    }
                }
                let temp = []
                let formedData = [];
                // this.materialListQuotation.forEach(
                //     (x) => {
                //         formedData = [...formedData, ...x];
                //     }
                // )
                formedData=[...this.materialListQuotation]
                temp = formedData.reduce(function (r, a) {
                    r[a['taskId']] = r[a['taskId']] || [];
                    r[a['taskId']].push(a);
                    return r;
                }, Object.create(null));
                this.materialListQuotation = [];
                for (let x in temp) {
                    // this.workOrderExclusionsList = [...this.workOrderExclusionsList, ...this.workOrderExclusionsLists[x].map(da=>{ return {...da, taskId:x}})]
                    this.materialListQuotation.push(temp[x]);
                }
            }
        },
        err => {
            this.errorHandling(err);
            this.isSpinnerVisible = false;
        })
    }

    getWOLabourList(){
        this.isSpinnerVisible = true;
        // false, 0 is For Sub Work Order 
        this.workorderMainService.getWorkOrderLaborList(this.workFlowWorkOrderId, this.workOrderId,false,0,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.isSpinnerVisible = false;
            let laborList = this.labor.workOrderLaborList;
            this.labor = { ...res, workOrderLaborList: laborList };
            this.labor.hoursorClockorScan = undefined;
            this.labor.workFlowWorkOrderId = this.workFlowWorkOrderId; 
            this.taskList.forEach(task => {
                this.labor.workOrderLaborList[0][task.description] = [];
            });
            this.taskList.forEach((tl) => {
                if (res) {

                    res.laborList.forEach((rt) => {

                        if (rt['taskId'] == tl['taskId']) {
                            if (this.labor.workOrderLaborList[0][tl['description']][0] && this.labor.workOrderLaborList[0][tl['description']][0]['expertiseId'] == null && this.labor.workOrderLaborList[0][tl['description']][0]['employeeId'] == null) {
                                this.labor.workOrderLaborList[0][tl['description']] = [];
                            }
                            let labor = {}
                            if(rt.hours){
                                let hours = rt.hours.toFixed(2);
                                rt.totalHours = hours.toString().split('.')[0];
                                rt.totalMinutes = hours.toString().split('.')[1];
                            }
                            labor = { ...rt, employeeId: { 'label': rt.employeeName, 'value': rt.employeeId } }
                            this.labor.workOrderLaborList[0][tl['description']].push(labor);
                        }
                    })
                }
            })
        },
        err => {
            this.errorHandling(err);
            this.isSpinnerVisible = false;
        })
    }

    getWOChargesList(){
        this.isSpinnerVisible = true;
        this.workorderMainService.getWorkOrderChargesList(this.workFlowWorkOrderId, this.workOrderId,false,this.authService.currentUser.masterCompanyId).subscribe((res: any[]) => {
            this.isSpinnerVisible = false;
            this.workOrderChargesList = res;
            for (let charge in this.workOrderChargesList) {
                this.workOrderChargesList[charge]['unitCost'] = Number(this.workOrderChargesList[charge]['unitCost'].toString().split(',').join('')).toFixed(2);
                this.workOrderChargesList[charge]['extendedCost'] = Number(this.workOrderChargesList[charge]['extendedCost'].toString().split(',').join('')).toFixed(2);
            }
        },
        err => {
            this.errorHandling(err);
            this.isSpinnerVisible = false;
        })
    }

    getWOExclusionsList(){
        this.isSpinnerVisible = true;
        this.workorderMainService.getWorkOrderExclusionsList(this.workFlowWorkOrderId, this.workOrderId).subscribe((res: any[]) => {
            this.isSpinnerVisible = false;
            this.workOrderExclusionsList = res;
            for (let exc in this.workOrderExclusionsList) {
                if (this.workOrderExclusionsList[exc]['billingAmount']) {
                    this.workOrderExclusionsList[exc]['billingAmount'] = Number(this.workOrderExclusionsList[exc]['billingAmount'].toString().split(',').join('')).toFixed(2);
                }
                if (this.workOrderExclusionsList[exc]['billingRate']) {
                    this.workOrderExclusionsList[exc]['billingRate'] = Number(this.workOrderExclusionsList[exc]['billingRate'].toString().split(',').join('')).toFixed(2);
                }
                if (this.workOrderExclusionsList[exc]['unitCost']) {
                    this.workOrderExclusionsList[exc]['unitCost'] = Number(this.workOrderExclusionsList[exc]['unitCost'].toString().split(',').join('')).toFixed(2);
                }
                if (this.workOrderExclusionsList[exc]['extendedCost']) {
                    this.workOrderExclusionsList[exc]['extendedCost'] = Number(this.workOrderExclusionsList[exc]['extendedCost'].toString().split(',').join('')).toFixed(2);
                }
            }
        },
        err => {
            this.isSpinnerVisible = false;
        })
    }

    getWOFrieghtsList(){
        // ,false,0 handle for sub work order handle both apis in end point
       this.workorderMainService.getWorkOrderFrieghtsList(this.workFlowWorkOrderId, this.workOrderId,false,0,false,this.authService.currentUser.masterCompanyId).subscribe((res: any[]) => {
           this.workOrderFreightList = res;
           for (let fre in this.workOrderFreightList) {
               if (this.workOrderFreightList[fre]['billingAmount']) {
                   this.workOrderFreightList[fre]['billingAmount'] = Number(this.workOrderFreightList[fre]['billingAmount'].toString().split(',').join('')).toFixed(2);
               }
           }
       }) 
   }

    gridTabChange(value) {
        this.gridActiveTab = value;
        if(value == 'materialList'){
            // && this.materialListQuotation.length <= 0
            this.getQuoteMaterialListByWorkOrderQuoteId();
        }
        else if(value == 'charges' && (!this.workOrderChargesList || this.workOrderChargesList.length <= 0)){
            this.getQuoteChargesListByWorkOrderQuoteId();
        }
        else if(value == 'exclusions' && (!this.workOrderExclusionsList || this.workOrderExclusionsList.length <= 0)){
            this.getQuoteExclusionListByWorkOrderQuoteId();
        }
        else if(value == 'labor'){
            // && (!this.labor.workOrderLaborList || this.isEmptyObj(this.labor.workOrderLaborList[0]) || this.checkForAllEmpty())
            this.getQuoteLaborListByWorkOrderQuoteId();
        }
        else if(value == 'freight' ){
            // && (!this.workOrderFreightList || this.workOrderFreightList.length <= 0)

            this.getQuoteFreightListByWorkOrderQuoteId();
        }
        let a = document.getElementById('quote-grid-tabs');
        if(a){
            a.scrollIntoView();
        }
    }

    getQuoteExclusionListByWorkOrderQuoteId() {
        if (this.workOrderQuoteDetailsId) {
            this.isSpinnerVisible = true;
            this.workOrderService.getQuoteExclusionList(this.workOrderQuoteDetailsId, (this.selectedBuildMethod === 'use work order') ? 1 : (this.selectedBuildMethod == "use work flow") ? 2 : (this.selectedBuildMethod == "use historical wos") ? 3 : 4).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workOrderExclusionsList = res;
                for (let exc in this.workOrderExclusionsList) {
                    if (this.workOrderExclusionsList[exc]['billingAmount']) {
                        this.workOrderExclusionsList[exc]['billingAmount'] = Number(this.workOrderExclusionsList[exc]['billingAmount'].toString().split(',').join('')).toFixed(2);
                    }
                    if (this.workOrderExclusionsList[exc]['billingRate']) {
                        this.workOrderExclusionsList[exc]['billingRate'] = Number(this.workOrderExclusionsList[exc]['billingRate'].toString().split(',').join('')).toFixed(2);
                    }
                    if (this.workOrderExclusionsList[exc]['unitCost']) {
                        this.workOrderExclusionsList[exc]['unitCost'] = Number(this.workOrderExclusionsList[exc]['unitCost'].toString().split(',').join('')).toFixed(2);
                    }
                    if (this.workOrderExclusionsList[exc]['extendedCost']) {
                        this.workOrderExclusionsList[exc]['extendedCost'] = Number(this.workOrderExclusionsList[exc]['extendedCost'].toString().split(',').join('')).toFixed(2);
                    }
                }
                if (res.length > 0) {
                    this.updateWorkOrderQuoteDetailsId(res[0].workOrderQuoteDetailsId)
                }
                else{
                    this.getWOExclusionsList();
                }
            },
            err => {
                this.errorHandling(err);
                this.isSpinnerVisible = false;
            })
        }
        else {
            this.getWOExclusionsList();
        }
    }
    
    getQuoteMaterialListByWorkOrderQuoteId() {
        if (this.workOrderQuoteDetailsId) {
            this.isSpinnerVisible = true;
            this.workOrderService.getQuoteMaterialList(this.workOrderQuoteDetailsId, (this.selectedBuildMethod === 'use work order') ? 1 : (this.selectedBuildMethod == "use work flow") ? 2 : (this.selectedBuildMethod == "use historical wos") ? 3 : 4,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.isSpinnerVisible = false;
                this.materialListQuotation = res;
                this.originlaMlist=res;
                this.disableMat=true;
              this.getCondition('');
                this.materialListQuotation.forEach(element => {
                    return{
                        ...element,
                        taskName:element.taskName.toLowerCase()
                    }
                });
                if (this.materialListQuotation && this.materialListQuotation.length > 0) {
                    for (let charge in this.materialListQuotation) {
                        if (this.materialListQuotation[charge]['unitCost']) {
                            this.materialListQuotation[charge]['unitCost'] = Number(this.materialListQuotation[charge]['unitCost'].toString().split(',').join('')).toFixed(2);
                        }
                        if (this.materialListQuotation[charge]['billingRate']) {
                            this.materialListQuotation[charge]['billingRate'] = Number(this.materialListQuotation[charge]['billingRate'].toString().split(',').join('')).toFixed(2);
                        }
                        if (this.materialListQuotation[charge]['billingAmount']) {
                            this.materialListQuotation[charge]['billingAmount'] = Number(this.materialListQuotation[charge]['billingAmount'].toString().split(',').join('')).toFixed(2);
                        }
                    }
                }
                if (this.materialListQuotation && this.materialListQuotation.length > 0 && this.materialListQuotation[0].headerMarkupId) {
                    this.costPlusType = this.materialListQuotation[0].markupFixedPrice.toString();
                    this.overAllMarkup = Number(this.materialListQuotation[0].headerMarkupId);
                }
                let temp = []
                let formedData = [];
                formedData=[...this.materialListQuotation]
                temp = formedData.reduce(function (r, a) {
                    r[a['taskId']] = r[a['taskId']] || [];
                    r[a['taskId']].push(a);
                    return r;
                }, Object.create(null));
                this.materialListQuotation = [];
                for (let x in temp) {
                    // this.workOrderExclusionsList = [...this.workOrderExclusionsList, ...this.workOrderExclusionsLists[x].map(da=>{ return {...da, taskId:x}})]
                    this.materialListQuotation.push(temp[x]);
                }
                if (res.length > 0) {
                    this.updateWorkOrderQuoteDetailsId(res[0].workOrderQuoteDetailsId)
                }
                else {
                    this.getWOMaterialList();
                }
                if(!res){
                    this.getWOMaterialList();
                }
            },
            err => {
                this.errorHandling(err);
                this.isSpinnerVisible = false;
            })
        }
        else {
            this.getWOMaterialList();
        }
    }

    getQuoteFreightListByWorkOrderQuoteId() {
        if (this.workOrderQuoteDetailsId) {
            this.isSpinnerVisible = true;
            this.workOrderService.getQuoteFreightsList(this.workOrderQuoteDetailsId, (this.selectedBuildMethod === 'use work order') ? 1 : (this.selectedBuildMethod == "use work flow") ? 2 : (this.selectedBuildMethod == "use historical wos") ? 3 : 4,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workOrderFreightList = res;
                for (let fre in this.workOrderFreightList) {
                    if (this.workOrderFreightList[fre]['billingAmount']) {
                        this.workOrderFreightList[fre]['billingAmount'] = Number(this.workOrderFreightList[fre]['billingAmount'].toString().split(',').join('')).toFixed(2);
                    }
                }
                if (res.length > 0) {
                    this.updateWorkOrderQuoteDetailsId(res[0].workOrderQuoteDetailsId)
                }
                else{
                    this.getWOFrieghtsList();
                }
            },
            err => {
                this.errorHandling(err);
                this.isSpinnerVisible = false;
            })
        }
        else {
            this.getWOFrieghtsList();
        }
    }

    getQuoteChargesListByWorkOrderQuoteId() {
        if (this.workOrderQuoteDetailsId) {
            this.isSpinnerVisible = true;
            this.workOrderService.getQuoteChargesList(this.workOrderQuoteDetailsId, (this.selectedBuildMethod === 'use work order') ? 1 : (this.selectedBuildMethod == "use work flow") ? 2 : (this.selectedBuildMethod == "use historical wos") ? 3 : 4,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workOrderChargesList = res;
                for (let charge in this.workOrderChargesList) {
                    this.workOrderChargesList[charge]['unitCost'] = Number(this.workOrderChargesList[charge]['unitCost'].toString().split(',').join('')).toFixed(2);
                    this.workOrderChargesList[charge]['extendedCost'] = Number(this.workOrderChargesList[charge]['extendedCost'].toString().split(',').join('')).toFixed(2);
                }
                if (res.length > 0) {
                    this.updateWorkOrderQuoteDetailsId(res[0].workOrderQuoteDetailsId)
                }
                else{
                    this.getWOChargesList();
                }
            },
            err => {
                this.errorHandling(err);
                this.isSpinnerVisible = false;
            })
        }
        else {
            this.getWOChargesList();
        }
    }

    getQuoteLaborListByWorkOrderQuoteId() {
        if (this.workOrderQuoteDetailsId) { 
            this.isSpinnerVisible = true;
            this.workOrderService.getQuoteLaborList(this.workOrderQuoteDetailsId, (this.selectedBuildMethod === 'use work order') ? 1 : (this.selectedBuildMethod == "use work flow") ? 2 : (this.selectedBuildMethod == "use historical wos") ? 3 : 4,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.isSpinnerVisible = false;
                if (res) {
                    let wowfId = this.labor.workFlowWorkOrderId;
                    if (res) {
                        this.laborPayload.WorkOrderQuoteLaborHeader = res;
                        this.updateWorkOrderQuoteDetailsId(res.workOrderQuoteDetailsId)
                        let laborList = this.labor.workOrderLaborList;
                        this.labor = { ...res, workOrderLaborList: laborList };
                        this.labor.dataEnteredBy = getObjectById('value', res.dataEnteredBy, this.employeeList);
                        this.labor.workFlowWorkOrderId = wowfId;
                        this.taskList.forEach((tl) => {
                            this.labor.workOrderLaborList[0][tl['description'].toLowerCase()] = [];
                            res.laborList.forEach((rt) => {
                                if (rt['taskId'] == tl['taskId']) {
                                    let labor = {}
                                    if(rt.hours){
                                        let hours = rt.hours.toFixed(2);
                                        rt.totalHours = hours.toString().split('.')[0];
                                        rt.totalMinutes = hours.toString().split('.')[1];
                                    }
                                    labor = { ...rt, employeeId: { 'label': rt.employeeName, 'value': rt.employeeId } }
                                    this.labor.workOrderLaborList[0][tl['description'].toLowerCase()].push(labor);
                                }
                            })
                        })
                    }
                    else{
                        this.getWOLabourList();
                    }
                }
                else {
                    this.taskList.forEach((tl) => {
                        this.labor.workOrderLaborList[0][tl['description'].toLowerCase()] = [];
                    });
                    this.getWOLabourList();
                }

            },
            err => {
                this.errorHandling(err);
                this.isSpinnerVisible = false;
            })
        }
        else {
            this.taskList.forEach((tl) => {
                this.labor.workOrderLaborList[0][tl['description'].toLowerCase()] = [];
            });
            this.getWOLabourList();
        }

    }

    toggleDisplayMode(): void {
        this.isDetailedViewQuote = !this.isDetailedViewQuote;
    }
  
    getAuditHistoryById(rowData) { 
        if(rowData.workOrderQuoteMaterialId){
        this.workorderMainService.getquoteMaterialHistory(rowData.workOrderQuoteMaterialId).subscribe(res => {
            this.historyData = res;
        //     this.historyData = res.forEach(element => {
        //       element.billingAmount=element.billingAmount ?  formatNumberAsGlobalSettingsModule(element.billingAmount, 2) : '0.00';
        //       element.billingRate=element.billingRate ?  formatNumberAsGlobalSettingsModule(element.billingRate, 2) : '0.00';
        //       element.markUp=element.markUp ?  formatNumberAsGlobalSettingsModule(element.markUp, 2) : '0.00';
        //       element.unitCost=element.unitCost ?  formatNumberAsGlobalSettingsModule(element.unitCost, 2) : '0.00';
        //       element.totalPartCost=element.totalPartCost ?  formatNumberAsGlobalSettingsModule(element.totalPartCost, 2) : '0.00';
        //   });
          this.auditHistoryHeaders=this.auditHistoryHeaders;
          // this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
       
          this.modal = this.modalService.open(AuditComponentComponent, { size: 'lg', backdrop: 'static', keyboard: false,windowClass: 'assetMange' });
          this.modal.componentInstance.auditHistoryHeader = this.auditHistoryHeaders;
          this.modal.componentInstance.auditHistory = this.historyData;
          
        })
    }else{
        this.modal = this.modalService.open(AuditComponentComponent, { size: 'lg', backdrop: 'static', keyboard: false,windowClass: 'assetMange' });
        this.modal.componentInstance.auditHistoryHeader = this.auditHistoryHeaders;
        this.modal.componentInstance.auditHistory = [];  
    }
      }
      triggerWoQuoteView(rowData){
        this.selectedHistoricalWorkOrder=undefined;
        this.selectedHistoricalCustomerId=undefined;
        this.selectedHistoricalWorkOrder = rowData.workOrderId; 
        this.selectedHistoricalCustomerId = rowData.customerId
      }
      getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    disableMat:boolean=false;
    getValidMat(){
        this.disableMat=false;
    }
}