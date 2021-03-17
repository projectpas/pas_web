import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { WorkOrderLabor, AllTasks} from '../../../../models/work-order-labor.modal';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
declare var $ : any;
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { EndpointFactory } from '../../../../services/endpoint-factory.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
    selector: 'app-common-wo-summarization',
    templateUrl: 'wo-summarized-data.component.html',
    styleUrls: ['./wo-summarized-data.component.scss']
})

export class WoSummarizedDataComponent implements OnInit, OnChanges {
    @Input() workOrderId;
    @Input() savedWorkOrderData;
    @Input() mpnPartNumbersList;
    @Input() employeesOriginalData;
    @Input() taskList;
    @Input() workOrderWorkFlowOriginalData;
    @Input() customerContactList;
    @Input() defaultTab;
    @Output() resetSelectedTab = new EventEmitter();
    hideHeader = true;
    materialListMPNs: any[];
    labourListMPNs: any[];
    labourAnalysisListMPNs: any[];
    chargesListMPNs: any[];
    documentsListMPNs: any[];
    memoListMPNs: any[];
    emailListMPNs: any[];
    phoneListMPNs: any[];
    textListMPNs: any[];
    shippingListMPNs: any[];
    freightsListMPNs: any[];
    woAnalysisMPNs: any[];
    quoteAnalysisMPNs: any[];
    billingAndInvoiceMPNs: any[];
    gridActiveTab: any = '';
    workFlowObject = {
        materialList: [],
        equipments: [],
        charges: [],
        exclusions: []
    }
    materialListDetailedViewOpened: boolean = false;
    labourDetailedViewOpened: boolean = false;

    materialListHeader = [
        {
            "header": "Task",
            "field": "task"
        },
        {
            "header": "MPN",
            "field": "partNumber"
        },
        {
            "header": "Revised Part No",
            "field": "revisedPartNo"
        },
        {
            "header": "Part Description",
            "field": "partDescription"
        },
        {
            "header": "SN",
            "field": "serialNo"
        },
        {
            "header": "Stock Line No",
            "field": "stockLineNo"
        },
        {
            "header": "Stock Type",
            "field": "stockType"
        },
        {
            "header": "Control #",
            "field": "controllerId"
        },
        {
            "header": "Control Num",
            "field": "controllerNo"
        },
        {
            "header": "Cond #",
            "field": "condition"
        },
        {
            "header": "Item Type",
            "field": "itemType"
        },
        {
            "header": "Qty Required",
            "field": "quantityReq"
        },
        {
            "header": "Qty On Hand",
            "field": "quantityOnHand"
        },
        {
            "header": "Qty Available",
            "field": "quantityAvailable"
        },
        {
            "header": "QTY Issued",
            "field": "qtyssued"
        },
        {
            "header": "Unit Cost",
            "field": "unitCost"
        },
        {
            "header": "Extended Cost",
            "field": "extendedCost"
        },
        {
            "header": "Warehouse",
            "field": "warehouse"
        },
        {
            'header': 'Location',
            'field': 'location'
        },
        {
            'header': 'Receiver',
            'field': 'receiver'
        },
        {
            'header': 'Site',
            'field': 'site'
        },
        {
            "header": 'Shelf',
            "field": "shelf"
        }
    ]

    labourListHeader = [
        {
            "header": "MPN",
            "field": "partNumber"
        },
        {
            "header": "Revised Part No",
            "field": "revisedPartNo"
        },
        {
            "header": "Part Description",
            "field": "partDescription"
        },
        {
            "header": "Data Entered By",
            "field": "dataEnteredBy"
        },
        {
            "header": "Expertise",
            "field": "expertise"
        },
        {
            "header": "Employee",
            "field": "employee"
        },
        {
            "header": "Task Completed By One",
            "field": "taskCompletedByOne"
        },
        {
            "header": "Add Hours By",
            "field": "addHoursBy"
        },
        {
            "header": "Total Hours",
            "field": "totalHours"
        }
    ]

    labourAnalysisListHeader = [
        {
            "header": "MPN",
            "field": "partNumber"
        },
        {
            "header": "Revised Part No",
            "field": "revisedPartNo"
        },
        {
            "header": "Part Description",
            "field": "partDescription"
        },
        {
            "header": "Action",
            "field": "action"
        },
        {
            "header": "Tech",
            "field": "expertise"
        },
        {
            "header": "Hours",
            "field": "hours"
        },
        {
            "header": "Customer",
            "field": "customer"
        },
        {
            "header": "WO Num",
            "field": "workOrderNum"
        },
        {
            "header": "Stage",
            "field": "stage"
        }
    ];

    chargesListHeader = [
        {
            "header": "MPN",
            "field": "partNumber"
        },
        {
            "header": "Revised Part No",
            "field": "revisedPartNo"
        },
        {
            "header": "Part Description",
            "field": "partDescription"
        },
        {
            "header": "Item",
            "field": "chargeType"
        },
        {
            "header": "Vendor",
            "field": "vendor"
        },
        {
            "header": "QTY",
            "field": "quantity"
        },
        {
            "header": "RO Num",
            "field": "roNum"
        },
        {
            "header": "Ref Num",
            "field": "refNum"
        },
        {
            "header": "Invoice Num",
            "field": "invoiceNum"
        },
        {
            "header": "Amount",
            "field": "unitPrice"
        }
    ]

    documentsListHeader = [
        {
            "header": "MPN",
            "field": "partNumber"
        },
        {
            "header": "Revised Part No",
            "field": "revisedPartNo"
        },
        {
            "header": "Part Description",
            "field": "partDescription"
        },
        {
            "header": "Description",
            "field": "description"
        },
        {
            "header": "Code",
            "field": "code"
        },
        {
            "header": "Link",
            "field": "link"
        }
    ]

    freightsListHeader = [
        {
            "header": "MPN",
            "field": "partNumber"
        },
        {
            "header": "Revised Part No",
            "field": "revisedPartNo"
        },
        {
            "header": "Part Description",
            "field": "partDescription"
        },
        {
            "header": "Ship Via",
            "field": "shipVia"
        },
        {
            "header": "Dimention",
            "field": "dimention"
        },
        {
            "header": "Weight",
            "field": "weight"
        },
        {
            "header": "Memo",
            "field": "memo"
        },
        {
            "header": "Amount",
            "field": "amount"
        }
    ]
    isView = true;
    selectedCommunicationTab = '';
    freight = [];
    isSpinnerVisible: boolean = false;
    moduleName = "WO Summarized data"

    constructor(private workOrderService: WorkOrderService, private alertService: AlertService, private authService: AuthService) {
    }

    ngOnInit() {

    }

    ngOnChanges() {
        this.gridActiveTab = '';
        this.selectedCommunicationTab = '';
    }

    resetParentTab() {
        this.resetSelectedTab.emit();
    }

    gridTabChange(tabname){
        switch(tabname){
            case 'materialList':{
                this.gridActiveTab = tabname;
                this.isSpinnerVisible = true;
                this.workOrderService.getMaterialListMPNS(this.workOrderId)
                .subscribe(
                    (res: any[]) => {
                        this.isSpinnerVisible = false;
                        this.materialListMPNs = res;
                        this.materialListMPNs.forEach(
                            first => {
                                this.mpnPartNumbersList.forEach(
                                    second => {
                                        if(first.workFlowWorkOrderId == second.value.workOrderWorkFlowId){
                                            first['workOrderPartNumberId'] = second.value.workOrderPartNumberId;
                                        }
                                    }
                                )
                            }
                        )
                        console.log(this.materialListMPNs);
                    },
                    (err) => {
                        this.isSpinnerVisible = false;
                        this.errorHandling(err);
                    }
                )
                break;
            }
            case 'labour': {
                this.gridActiveTab = tabname;
                this.isSpinnerVisible = true;
                this.workOrderService.getLabourListMPNS(this.workOrderId)
                .subscribe(
                    (res: any[]) => {
                        this.isSpinnerVisible = false;
                        this.labourListMPNs = res;
                        this.labourListMPNs.forEach(
                            first => {
                                this.mpnPartNumbersList.forEach(
                                    second => {
                                        if(first.workFlowWorkOrderId == second.value.workOrderWorkFlowId){
                                            first['workOrderPartNumberId'] = second.value.workOrderPartNumberId;
                                        }
                                    }
                                )
                            }
                        )
                        console.log(this.labourListMPNs);
                    },
                    (err) => {
                        this.isSpinnerVisible = false;
                        this.errorHandling(err);
                    }
                )
                break;
            }
            case 'labourAnalysis': {
                this.gridActiveTab = tabname;
                this.isSpinnerVisible = true;
                this.workOrderService.getLabourAnalysisListMPNS(this.workOrderId)
                .subscribe(
                    (res: any[]) => {
                        this.isSpinnerVisible = false;
                        this.labourAnalysisListMPNs = res;
                        this.labourAnalysisListMPNs.forEach(
                            first => {
                                this.mpnPartNumbersList.forEach(
                                    second => {
                                        if(first.partNumber == second.label){
                                            first['workOrderPartNumberId'] = second.value.workOrderPartNumberId;
                                        }
                                    }
                                )
                            }
                        )
                        console.log(this.labourAnalysisListMPNs);
                    },
                    (err) => {
                        this.isSpinnerVisible = false;
                        this.errorHandling(err);
                    }
                )
                break;
            }
            case 'charges': {
                this.gridActiveTab = tabname;
                this.isSpinnerVisible = true;
                this.workOrderService.getChargesListMPNS(this.workOrderId)
                .subscribe(
                    (res: any[]) => {
                        this.isSpinnerVisible = false;
                        this.chargesListMPNs = res;
                        this.chargesListMPNs.forEach(
                            first => {
                                this.mpnPartNumbersList.forEach(
                                    second => {
                                        if(first.workFlowWorkOrderId == second.value.workOrderWorkFlowId){
                                            first['workOrderPartNumberId'] = second.value.workOrderPartNumberId;
                                        }
                                    }
                                )
                            }
                        )
                        console.log(this.chargesListMPNs);
                    },
                    (err) => {
                        this.isSpinnerVisible = false;
                        this.errorHandling(err);
                    }
                )
                break;
            }

            case 'documents': {
                this.gridActiveTab = tabname;
                this.isSpinnerVisible = true;
                this.workOrderService.getDocumentsListMPNS(this.workOrderId)
                .subscribe(
                    (res: any[]) => {
                        this.isSpinnerVisible = false;
                        this.documentsListMPNs = res;
                        this.documentsListMPNs.forEach(
                            first => {
                                this.mpnPartNumbersList.forEach(
                                    second => {
                                        if(first.workFlowWorkOrderId == second.value.workOrderWorkFlowId){
                                            first['workOrderPartNumberId'] = second.value.workOrderPartNumberId;
                                        }
                                    }
                                )
                            }
                        )
                        console.log(this.documentsListMPNs);
                    },
                    (err) => {
                        this.isSpinnerVisible = false;
                        this.errorHandling(err);
                    }
                )
                break;
            }

            case 'memo': {
                this.gridActiveTab = 'communication';
                this.isSpinnerVisible = true;
                this.workOrderService.getMemosListMPNS(this.workOrderId)
                .subscribe(
                    (res: any[]) => {
                        this.isSpinnerVisible = false;
                        this.memoListMPNs = res;
                        this.memoListMPNs.forEach(
                            first => {
                                this.mpnPartNumbersList.forEach(
                                    second => {
                                        if(first.partNumber == second.label){
                                            first['workOrderPartNumberId'] = second.value.workOrderPartNumberId;
                                        }
                                    }
                                )
                            }
                        )
                        console.log(this.memoListMPNs);
                    },
                    (err) => {
                        this.isSpinnerVisible = false;
                        this.errorHandling(err);
                    }
                )
                break;
            }

            case 'email': {
                this.gridActiveTab = 'communication';
                this.isSpinnerVisible = true;
                this.workOrderService.getEmailsListMPNS(this.workOrderId)
                .subscribe(
                    (res: any[]) => {
                        this.isSpinnerVisible = false;
                        this.emailListMPNs = res;
                        this.emailListMPNs.forEach(
                            first => {
                                this.mpnPartNumbersList.forEach(
                                    second => {
                                        if(first.partNumber == second.label){
                                            first['workOrderPartNumberId'] = second.value.workOrderPartNumberId;
                                        }
                                    }
                                )
                            }
                        )
                    },
                    (err) => {
                        this.isSpinnerVisible = false;
                        this.errorHandling(err);
                    }
                )
                break;
            }

            case 'phone': {
                this.gridActiveTab = 'communication';
                this.isSpinnerVisible = true;
                this.workOrderService.getPhonesListMPNS(this.workOrderId)
                .subscribe(
                    (res: any[]) => {
                        this.isSpinnerVisible = false;
                        this.phoneListMPNs = res;
                        this.phoneListMPNs.forEach(
                            first => {
                                this.mpnPartNumbersList.forEach(
                                    second => {
                                        if(first.partNumber == second.label){
                                            first['workOrderPartNumberId'] = second.value.workOrderPartNumberId;
                                        }
                                    }
                                )
                            }
                        )
                    },
                    (err) => {
                        this.isSpinnerVisible = false;
                        this.errorHandling(err);
                    }
                )
                break;
            }

            case 'text': {
                this.gridActiveTab = 'communication';
                this.isSpinnerVisible = true;
                this.workOrderService.getTextsListMPNS(this.workOrderId)
                .subscribe(
                    (res: any[]) => {
                        this.isSpinnerVisible = false;
                        this.textListMPNs = res;
                        this.textListMPNs.forEach(
                            first => {
                                this.mpnPartNumbersList.forEach(
                                    second => {
                                        if(first.partNumber == second.label){
                                            first['workOrderPartNumberId'] = second.value.workOrderPartNumberId;
                                        }
                                    }
                                )
                            }
                        )
                    },
                    (err) => {
                        this.isSpinnerVisible = false;
                        this.errorHandling(err);
                    }
                )
                break;
            }

            case 'freight': {
                this.gridActiveTab = 'freight';
                this.isSpinnerVisible = true;
                this.workOrderService.getFreightsListMPNS(this.workOrderId).subscribe((res: any[]) => {
                    this.isSpinnerVisible = false;
                    this.freightsListMPNs = res;
                },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err);
                })
                break;
            }

            case 'shipping': {
                this.gridActiveTab = "shipping";
                this.isSpinnerVisible = true;
                this.workOrderService.getShippingListMPNS(this.workOrderId).subscribe((res: any[]) => {
                    this.isSpinnerVisible = false;
                    this.shippingListMPNs = res;
                },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err);
                })
                break;
            }
            
            case 'woAnalysis': {
                this.gridActiveTab = 'woAnalysis';
                this.isSpinnerVisible = true;
                this.workOrderService.getWOAnalysisMPNs(this.workOrderId).subscribe((res: any[]) => {
                    this.isSpinnerVisible = false;
                    this.woAnalysisMPNs = res;
                },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err);
                })
                break;
            }

            case 'quoteAnalysis': {
                this.gridActiveTab = 'quoteAnalysis';
                this.isSpinnerVisible = true;
                this.workOrderService.getQuoteAnalysisMPNs(this.workOrderId).subscribe((res: any[]) => {
                    this.isSpinnerVisible = false;
                    this.quoteAnalysisMPNs = res;
                },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err);
                })
                break;
            }

            case 'billingAndInvoice': {
                this.gridActiveTab = 'billingAndInvoice';
                this.isSpinnerVisible = true;
                this.workOrderService.getBillingAndInvoiceMPNs(this.workOrderId).subscribe((res: any[]) => {
                    this.isSpinnerVisible = false;
                    this.billingAndInvoiceMPNs = res;
                },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err);
                })
            }
        }
    }

    collapseAll(type, grid, iteratingArray, callingMethod){
        if(grid == 'materialList'){
            this.materialListDetailedViewOpened = !this.materialListDetailedViewOpened;
        }
        else if(grid == 'labour'){
            this.labourDetailedViewOpened = !this.labourDetailedViewOpened;
        }
        for (var x in iteratingArray){
                if(this.materialListDetailedViewOpened || this.labourDetailedViewOpened){
                    $(`#${grid}_${x}`).collapse('show');
                    if(callingMethod){
                        this[callingMethod](iteratingArray[x]);
                    }
                }
                else{
                    $(`#${grid}_${x}`).collapse('hide');
                }
        }
    }

    getMaterialListData(materialMPN){
        this.isSpinnerVisible = true;
        this.workOrderService.getWorkOrderMaterialList(materialMPN.workFlowWorkOrderId, this.workOrderId,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.isSpinnerVisible = false;
            if (res.length > 0) {
                res.forEach(element => {
                    this.getValues(element)
                            element.isShowPlus=true;
                            if(element.currency)element.currency= element.currency.symbol;
                        });
                materialMPN.workOrderMaterialList = res;
                materialMPN.materialStatus = res[0].partStatusId;
            }
        },
        err => {
            this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }

    getLabourListData(labourMPN){
        this.workOrderService.getLabourListForDetailedView(labourMPN.workFlowWorkOrderId)
        .subscribe(
            (res: any[])=>{
                labourMPN['labor'] = res;
            }
        )
        // let labor =  new WorkOrderLabor();
        // if ((labourMPN.workFlowWorkOrderId !== 0 || labourMPN.workFlowWorkOrderId !== undefined) && this.workOrderId) {
        //     this.isSpinnerVisible = true;
        //     this.workOrderService.getWorkOrderLaborList(labourMPN.workFlowWorkOrderId, this.workOrderId,false,0).subscribe(res => {
        //         let data = {};
        //         data = res;
        //         this.isSpinnerVisible = false;
        //         if (res) {
        //             labourMPN['workOrderLaborList'] = {
        //                 ...data,
        //                 workFlowWorkOrderId: getObjectById('value', data['workFlowWorkOrderId'], this.workOrderWorkFlowOriginalData),
        //                 employeeId: getObjectById('value', data['employeeId'], this.employeesOriginalData),
        //                 dataEnteredBy: getObjectById('value', data['employeeId'], this.employeesOriginalData),
        //             };
        //             labor.hoursorClockorScan = res.hoursorClockorScan;
        //             labor.workFloworSpecificTaskorWorkOrder = (res.workOrderHoursType == 0)?'workFlow':(res.workOrderHoursType == 1)?'specificTasks':'workOrder';
        //             labor.totalWorkHours = res.totalWorkHours;
        //             labor.expertiseId = res.expertiseId;
        //             labor['labourMemo'] = res.labourMemo;
        //             labor.employeeId = getObjectById('value', data['employeeId'], this.employeesOriginalData);
        //             labor.dataEnteredBy = getObjectById('value', data['employeeId'], this.employeesOriginalData);
        //             labor['workOrderHoursType'] = res['workOrderHoursType'];
        //         }
        //         if (res) {
        //             for (let labList of data['laborList']) {
        //                 if(this.taskList){
        //                     for (let task of this.taskList) {

        //                         if (task.taskId == labList['taskId']) {
        //                             if(!labor.workOrderLaborList){
        //                                 labor.workOrderLaborList = [{}];
        //                             }
        //                             if (!labor.workOrderLaborList[0][task.description.toLowerCase()]) {
        //                                 labor.workOrderLaborList[0][task.description.toLowerCase()] = []
        //                             }
        //                             if (labor.workOrderLaborList[0][task.description.toLowerCase()][0] && (labor.workOrderLaborList[0][task.description.toLowerCase()][0]['expertiseId'] == undefined || labor.workOrderLaborList[0][task.description.toLowerCase()][0]['expertiseId'] == null)) {
        //                                 labor.workOrderLaborList[0][task.description.toLowerCase()].splice(0, 1);
        //                             }
        //                             let taskData = new AllTasks()
        //                             taskData['workOrderLaborHeaderId'] = labList['workOrderLaborHeaderId'];
        //                             taskData['workOrderLaborId'] = labList['workOrderLaborId'];
        //                             taskData['expertiseId'] = labList['expertiseId'];
        //                             taskData['employeeId'] = getObjectById('value', labList['employeeId'], this.employeesOriginalData);
        //                             taskData['billableId'] = labList['billableId'];
        //                             taskData['startDate'] = labList['startDate']?new Date(labList['startDate']):null;
        //                             taskData['endDate'] = labList['endDate']?new Date(labList['endDate']):null;
        //                             taskData['hours'] = labList['hours'];
        //                             taskData['adjustments'] = labList['adjustments'];
        //                             taskData['adjustedHours'] = labList['adjustedHours'];
        //                             taskData['memo'] = labList['memo'];
        //                             labor.workOrderLaborList[0][task.description.toLowerCase()].push(taskData);
        //                             break;
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //         labourMPN['labor'] = labor;
        //     },
        //     err => {
        //         this.isSpinnerVisible = false;
        //         this.errorHandling(err);
        //     })
        // }
    }

    getChargesListData(chargesMPN){
        this.isSpinnerVisible = true;
        this.workOrderService.getWorkOrderChargesList(chargesMPN.workFlowWorkOrderId, this.workOrderId,false,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.isSpinnerVisible = false;
            chargesMPN.workOrderChargesList = res;
            for(let charge in chargesMPN.workOrderChargesList){
                chargesMPN.workOrderChargesList[charge]['unitCost'] = chargesMPN.workOrderChargesList[charge]['unitCost'].toFixed(2);
                chargesMPN.workOrderChargesList[charge]['extendedCost'] = chargesMPN.workOrderChargesList[charge]['extendedCost'].toFixed(2);
                chargesMPN.workOrderChargesList[charge]['unitPrice'] = chargesMPN.workOrderChargesList[charge]['unitPrice'].toFixed(2);
                chargesMPN.workOrderChargesList[charge]['extendedPrice'] = chargesMPN.workOrderChargesList[charge]['extendedPrice'].toFixed(2);
            }
            if(this.gridActiveTab === 'billorInvoice'){
                chargesMPN.workOrderChargesList=chargesMPN.workOrderChargesList;
            }
        },
        err => {
            this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }

    getDocumentsListData(documentsMPN) {
        this.isSpinnerVisible = true;
        // false ,0 is to handle subworkorder data purpose to handel apis in Endpoint
        this.workOrderService.getDocumentsList(documentsMPN.workFlowWorkOrderId, this.workOrderId,false,0).subscribe(res => {
            let arr = [];
            this.isSpinnerVisible = false;
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
            documentsMPN['documentsDestructuredData'] = arr;
        }, err => {
            this.isSpinnerVisible = false;
            this.errorHandling(err);
            documentsMPN['documentsDestructuredData'] = [];
        })
    }

    getValues(element){
        if(element.stockLineNumber){
            if (element.stockLineNumber.indexOf(',') > -1){
                element.isMultipleStockLine=  'Multiple';
            }else{
                element.isMultipleStockLine=  'Single';
            }
        }
        if(element.controlNo){
            if (element.controlNo.indexOf(',') > -1){
                element.isMultipleControlNo=  'Multiple';
            }else{
                element.isMultipleControlNo=  'Single';
            }
        }
        if(element.controlId){
            if (element.controlId.indexOf(',') > -1){
                element.isMultiplecontrolId=  'Multiple';
            }else{
                element.isMultiplecontrolId=  'Single';
            }
        }
        if(element.receiver){
            if (element.receiver.indexOf(',') > -1){
                element.isMultiplereceiver=  'Multiple';
            }else{
                element.isMultiplereceiver=  'Single';
            }
        }
    }

    getFreightListByWorkOrderId(freightMPN) {
        if (freightMPN.workFlowWorkOrderId !== 0 && this.workOrderId) {
            this.isSpinnerVisible = true;
            this.workOrderService.getWorkOrderFrieghtsList(freightMPN.workFlowWorkOrderId, this.workOrderId,false,0,false,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.isSpinnerVisible = false;
                freightMPN.workOrderFreightList = res;
            },
            err => {
                this.errorHandling(err);
                this.isSpinnerVisible = false;
            })
        }
    }

    errorHandling(err){
        this.alertService.showMessage(
            this.moduleName,
            'Error while fetching data',
            MessageSeverity.error
        );
    }

    globalizeAmount(data, field){
        if(data && (field == 'unitCost' || field == 'extendedCost')){
            let result = formatNumberAsGlobalSettingsModule(data, '0')
            return result+".00"
        }
        else{
            return data;
        }
    }
}