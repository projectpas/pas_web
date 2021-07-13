import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CreditTermsService } from '../../../../services/Credit Terms.service';
import { CustomerService } from '../../../../services/customer.service';
import { EmployeeService } from '../../../../services/employee.service';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { WorkOrderPartNumberService } from '../../../../services/work-order/work-order-part-number.service';
import { StocklineService } from '../../../../services/stockline.service';
import { CommonService } from '../../../../services/common.service';
import { AuthService } from '../../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { workOrderGeneralInfo } from '../../../../models/work-order-generalInformation.model';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { SalesOrderService } from '../../../../services/salesorder.service';
import { SalesOrderReference } from '../../../../models/sales/salesOrderReference';


@Component({
    selector: 'app-work-view-component',
    templateUrl: './work-order-view.component.html',
})
/** WorkOrderShipping component*/
export class WorkOrderViewComponent implements OnInit, OnChanges {
    @Input() workOrderId = 0;
    creditTerms: any;
    techStationList: any;
    workOrderStagesList: any;
    priorityList: any;
    workOrderTypes: any;
    workOrderStatusList: any;
    partNumberOriginalData: Object;
    recCustomerId: any = 0;
    editWorkOrderGeneralInformation: any;
    workOrderGeneralInformation: workOrderGeneralInfo = new workOrderGeneralInfo();
    isEdit: boolean = true;
    legalEntityList: any;
    private onDestroy$: Subject<void> = new Subject<void>();
    conditionList: any;
    // workOrderOriginalStageList: any;
    conditionId: any;
    jobTitles: any;
    salesPersonOriginalList: any = [];
    csrOriginalList: Object;
    agentsOriginalList: any = [];
    salesAgentsOriginalList: any = [];
    technicianOriginalList: Object;
    inspectorsOriginalList: any;
    isSpinnerEnable: boolean = false;
    masterCompanyId = 0;
    workorderSettings: any;
    expertiseTypeList: any;
    technicianByExpertiseTypeList: any;
    salesOrderReferenceData: SalesOrderReference;
    isSubWorkOrder: any;
    paramsData: any;
    /** WorkOrderShipping ctor */
    constructor(private alertService: AlertService,
        private workOrderService: WorkOrderService,
        private creditTermsService: CreditTermsService,
        private customerService: CustomerService,
        private employeeService: EmployeeService,
        private itemMasterService: ItemMasterService,
        private workOrderPartNumberService: WorkOrderPartNumberService,
        private stocklineService: StocklineService,
        private commonService: CommonService,
        private authService: AuthService,
        private acRouter: ActivatedRoute,
        private salesOrderService: SalesOrderService
    ) {
        this.salesOrderService.getReferenceObject().subscribe(data => {
        });
        this.salesOrderService.salesOrderReferenceSubj$.subscribe(data => {
            this.salesOrderReferenceData = data;
        });
    }


    ngOnInit() {
        this.getBasicDetails();
        this.getAllWorkOrderStages();
        this.getAllWorkOrderStatus();
    }

    ngOnChanges() {
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }

    getBasicDetails() {

        // this.getMultiplePartsNumbers();
        if (this.workOrderId || this.recCustomerId) {

            this.recCustomerId = 0;
            this.workOrderService.getWorkOrderById(this.workOrderId, this.recCustomerId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerEnable = true;
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
                            // customerRequestDate: this.recCustomerId == 0 ? new Date(x.customerRequestDate) : null,
                            promisedDate: this.recCustomerId == 0 ? new Date(x.promisedDate) : null,
                            estimatedCompletionDate: this.recCustomerId == 0 ? new Date(x.estimatedCompletionDate) : null,
                            estimatedShipDate: this.recCustomerId == 0 ? new Date(x.estimatedShipDate) : null,
                            receivedDate: this.recCustomerId == 0 && res.receivingCustomerWorkId == null ? null : new Date(x.receivedDate)
                        }

                    })
                }
                this.editWorkOrderGeneralInformation = data;
            })
            // }
        }
        else {
            this.getWorkOrderDefaultSetting();
        }
    }
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
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
                            workOrderStageId: data.defaultStageCodeId,
                            workOrderPriorityId: data.defaultPriorityId, // true 
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

    getAllWorkOrderTypes(): void {
        this.workOrderService.getAllWorkOrderTypes().pipe(takeUntil(this.onDestroy$)).subscribe(
            result => {
                this.workOrderTypes = result;
            }
        );
    }


    setEditArray: any = [];
    getAllWorkOrderStatus(): void {
        this.setEditArray.push(0);
        const strText = '';
        this.commonService.autoSuggestionSmartDropDownList('WorkOrderStatus', 'ID', 'Description', strText, true, 0, this.setEditArray.join(), 0).subscribe(res => {
            this.workOrderStatusList = res.sort(function (a, b) { return a.value - b.value; });
        })
    }

    getJobTitles() {
        this.commonService.getJobTitles(this.currentUserMasterCompanyId).subscribe(res => {
            this.jobTitles = res;

        })
    }

    employeesOriginalData: any = [];

    getAllWorkOrderStages(): void {
        this.workOrderService.getWorkOrderStageAndStatus(this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {

            this.workOrderStagesList = res.map(x => {
                return {
                    ...x,
                    value: x.workOrderStageId,
                    label: x.workOrderStage
                }
            });
        })
    }


    getMultiplePartsNumbers() {
        this.workOrderService.getMultipleParts(this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.partNumberOriginalData = res;
        })
    }


    async getPartNosByCustomer(customerId, workOrderId) {
        await this.workOrderService.getPartNosByCustomer(customerId, workOrderId, this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {

            this.partNumberOriginalData = res;
        });
    }



    getConditionsList() {
        this.commonService.smartDropDownList('Condition', 'ConditionId', 'Description', this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.conditionList = res;

            const conditionId = res.find(x => x.label.includes('As Removed'));
            this.workOrderGeneralInformation = {
                ...this.workOrderGeneralInformation,
                partNumbers: this.workOrderGeneralInformation.partNumbers.map(x => {
                    return {
                        ...x,
                        conditionId: conditionId !== undefined ? conditionId.value : null
                    }
                })
            }
            this.isSpinnerEnable = true;
        })
    }

}
