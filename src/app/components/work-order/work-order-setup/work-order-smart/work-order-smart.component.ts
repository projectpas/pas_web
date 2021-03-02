import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CommonService } from '../../../../services/common.service';
import { AuthService } from '../../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { getValueByFieldFromArrayofObject } from '../../../../generic/autocomplete';
import { workOrderGeneralInfo } from '../../../../models/work-order-generalInformation.model';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { SalesOrderService } from '../../../../services/salesorder.service';
import { SalesOrderReference } from '../../../../models/sales/salesOrderReference';
@Component({
    selector: 'app-work-order-smart',
    templateUrl: './work-order-smart.component.html',
})
/** WorkOrderShipping component*/
export class WorkOrderSmartComponent implements OnInit {
    @Input() isSubWorkOrder = false;
    @Input() paramsData;
    @Input() showTabsGrid;
    @Input() showGridMenu;
    @Input() subWorkOrderId;
    @Input() workFlowWorkOrderId;
    @Input() subWoMpnGridUpdated;
    @Input() conditionListfromSubWo;
    creditTerms: any;
    employeesOriginalData: any;
    techStationList: any;
    workOrderStagesList: any;
    priorityList: any;
    workOrderTypes: any;
    workOrderStatusList: any;
    partNumberOriginalData: Object;
    workOrderId: any;
    recCustomerId: any = 0;
    editWorkOrderGeneralInformation: any;
    workOrderGeneralInformation: workOrderGeneralInfo = new workOrderGeneralInfo();
    isEdit: boolean = false;
    currencyList: any;
    legalEntityList: any;
    private onDestroy$: Subject<void> = new Subject<void>();
    conditionList: any;
    conditionId: any;
    jobTitles: any;
    salesPersonOriginalList: any = [];
    csrOriginalList: Object;
    agentsOriginalList: any = [];
    salesAgentsOriginalList: any = [];
    technicianOriginalList: Object;
    inspectorsOriginalList: any;
    isSpinnerEnable: boolean = false;
    masterCompanyId: any;
    workorderSettings: any;
    expertiseTypeList: any;
    technicianByExpertiseTypeList: any;
    salesOrderReferenceData: SalesOrderReference;
    arayJobTitleIds: any[] = [];
    constructor(
        private workOrderService: WorkOrderService,
        private commonService: CommonService,
        private authService: AuthService,
        private acRouter: ActivatedRoute,
        private salesOrderService: SalesOrderService
    ) {
        if (this.isSubWorkOrder == false) {
            this.salesOrderService.getReferenceObject().subscribe(data => {
            });
            this.salesOrderService.salesOrderReferenceSubj$.subscribe(data => {
                this.salesOrderReferenceData = data;
            });
        }
    }
    ngOnInit() {
        this.getAllWorkOrderTypes();
        this.getAllWorkOrderStatus();
        this.getAllCreditTerms();
        this.getJobTitles();
        this.getAllWorkOrderStages();
        this.getAllExpertiseType();
        if (this.isSubWorkOrder == false) {
        } else {
            this.conditionList = this.conditionListfromSubWo;
        }

        if (this.isSubWorkOrder) {
            this.subWorkOrderId = this.subWorkOrderId;
        } else {
            this.workOrderId = this.acRouter.snapshot.params['id'];
            this.recCustomerId = this.acRouter.snapshot.params['rcustid'];
        }
        if (this.workOrderId || this.recCustomerId) {
            if (this.recCustomerId) {
                this.showTabsGrid = false;
                this.workOrderId = 0;
                this.getWorkOrderDefaultSetting();
            }
            else {    // uncomment this else by mahesh  , due to comment this  this.recCustomerId is undefined and handel bellow  promisedDate etc assing nulls 
                this.recCustomerId = 0;
            }
            this.isSpinnerEnable = true;
            this.workOrderService.getWorkOrderById(this.workOrderId, this.recCustomerId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                setTimeout(() => {
                    this.isSpinnerEnable = false;
                }, 2000)
                this.getPartNosByCustomer(res.customerId, 0);
                this.isEdit = true;
                const workOrderData = res;
                const data = {
                    ...res,
                    workOrderNumber: res.workOrderNum,
                    openDate: new Date(res.openDate),
                    customerId: res.customerId,
                    partNumbers: res.partNumbers.map(x => {
                        return {
                            ...x,
                            promisedDate: this.recCustomerId == 0 ? new Date(x.promisedDate) : null,
                            estimatedCompletionDate: this.recCustomerId == 0 ? new Date(x.estimatedCompletionDate) : null,
                            estimatedShipDate: this.recCustomerId == 0 ? new Date(x.estimatedShipDate) : null,
                            receivedDate: this.recCustomerId == 0 && res.receivingCustomerWorkId == null ? null : new Date(x.receivedDate)
                        }
                    })
                }
                this.editWorkOrderGeneralInformation = data;
            })
        }
        else {
            this.getWorkOrderDefaultSetting();
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        this.subWoMpnGridUpdated = this.subWoMpnGridUpdated;
    }
    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
    getAllExpertiseType() {
        this.commonService.getExpertise(this.currentUserMasterCompanyId).subscribe(res => {
            this.expertiseTypeList = res.map(x => {
                if (x.expertiseType == 'Technician'  || x.expertiseType == 'TECHNICIAN') {
                    this.getExpertiseEmployeeByExpertiseId(x.employeeExpertiseId);
                    return;
                }
            });
        })
    }
    getExpertiseEmployeeByExpertiseId(value) { 
        
        this.commonService.getExpertiseEmployeesByCategory(value).subscribe(res => {
            this.technicianByExpertiseTypeList = res;
        })
    }
    getWorkOrderDefaultSetting(value?) {
        const value1 = value ? value : this.workOrderGeneralInformation.workOrderTypeId;
        this.commonService.workOrderDefaultSettings(this.currentUserMasterCompanyId, value1).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            if (res.length > 0) {
                const data = res[0];
                this.workorderSettings = res[0];
                this.workOrderGeneralInformation = {
                    ...this.workOrderGeneralInformation,
                    partNumbers: this.workOrderGeneralInformation.partNumbers.map(x => {
                        return {
                            ...x,
                            // workOrderScopeId: data.defaultScopeId, // true
                            workOrderStageId: data.defaultStageCodeId,
                            workOrderPriorityId: data.defaultPriorityId, // true
                            // workOrderStatusId: data.defaultStatusId, // status
                            // conditionId: data.defaultConditionId
                        }
                    })
                }
            }
        })
    }
    getCustomerNameandCodeById(object) {
        const { customerId } = object;
        this.commonService.getCustomerNameandCodeById(customerId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            object.customer = res;
        })
    }
    getAllCreditTerms(): void {
        this.creditTerms = [];
    }
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }
    getJobTitles() {
        this.commonService.getJobTitles(this.currentUserMasterCompanyId).subscribe(res => {
            this.jobTitles = res;
            this.getAllSalesEmployeeListByJobTitle(this.jobTitles)
        })
    }
    getAllSalesEmployeeListByJobTitle(jobTitles) {

        const CSRid = getValueByFieldFromArrayofObject('jobTitle', 'CSR', this.jobTitles);
        const Salesid = getValueByFieldFromArrayofObject('jobTitle', 'Sales', this.jobTitles);
        const Agentsid = getValueByFieldFromArrayofObject('jobTitle', 'Agents', this.jobTitles);
        const Technicianid = getValueByFieldFromArrayofObject('jobTitle', 'Technician', this.jobTitles);
        if (CSRid[0].jobTitleId > 0)
            this.arayJobTitleIds.push(CSRid[0].jobTitleId);

        if (Salesid[0].jobTitleId > 0)
            this.arayJobTitleIds.push(Salesid[0].jobTitleId);

        if (Agentsid[0].jobTitleId > 0)
            this.arayJobTitleIds.push(Agentsid[0].jobTitleId);
        if (Technicianid[0].jobTitleId > 0)
            this.arayJobTitleIds.push(Technicianid[0].jobTitleId);
        this.commonService.getAllSalesEmployeeListByJobTitle(this.arayJobTitleIds).subscribe(res => {
            if (res) {
                this.csrOriginalList = res.filter(x => {
                    if (CSRid[0].jobTitleId == x.jobTitleId) {
                        return x;
                    }
                })

                this.agentsOriginalList = res.filter(x => {
                    if (Agentsid[0].jobTitleId == x.jobTitleId) {
                        return x;
                    }
                })
                this.salesAgentsOriginalList = [...this.agentsOriginalList];
                this.salesPersonOriginalList = res.filter(x => {
                    if (Salesid[0].jobTitleId == x.jobTitleId) {
                        return x;
                    }
                })
                this.salesAgentsOriginalList = [...this.salesPersonOriginalList];

                this.technicianOriginalList = res.filter(x => {
                    if (Technicianid[0].jobTitleId == x.jobTitleId) {
                        return x;
                    }
                })
                this.arayJobTitleIds = [];
            }
        })
    }
    getAllWorkOrderStages(): void {
        this.workOrderService.getWorkOrderStageAndStatus().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.workOrderStagesList = res.map(x => {
                return {
                    ...x,
                    value: x.workOrderStageId,
                    label: x.workOrderStage
                }
            });
            this.isSpinnerEnable = false;
        })
    }
    async getPartNosByCustomer(customerId, workOrderId) {
        await this.workOrderService.getPartNosByCustomer(customerId, workOrderId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.partNumberOriginalData = res;
        });
    }
    // this api returns 4 to 5 records
    setEditArray:any=[]
    getAllWorkOrderTypes(): void {
        this.setEditArray = [];
        const strText ='';
        if(this.isEdit==true){
            this.setEditArray.push(this.editWorkOrderGeneralInformation.workOrderTypeId ? this.editWorkOrderGeneralInformation.workOrderTypeId :0)
            if(this.setEditArray && this.setEditArray.length==0){
                this.setEditArray.push(0);  
            }
        }else{
            this.setEditArray.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('WorkOrderType', 'ID', 'Description', strText, true, 20, this.setEditArray.join()).subscribe(res => {
      this.workOrderTypes = res.map(x => {
                return {
                    id: x.value,
                    description: x.label
                }
            });
        })
    }
    getAllWorkOrderStatus(): void {
        this.setEditArray = [];
        if (this.isEdit == true) {
            this.workOrderGeneralInformation.partNumbers.forEach(element => {
                if(element.workOrderStatusId){
                    this.setEditArray.push(element.workOrderStatusId)
                }
            });
            if(this.setEditArray && this.setEditArray.length==0){
                this.setEditArray.push(0);  
            }
        } else {
            this.setEditArray.push(0); 
        }
        const strText ='';
        this.commonService.autoSuggestionSmartDropDownList('WorkOrderStatus', 'ID', 'Description', strText, true, 20, this.setEditArray.join()).subscribe(res => {
         this.workOrderStatusList = res.sort(function (a, b) { return a.value - b.value; });
        })
    }
}
