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
import { getObjectById, getValueByFieldFromArrayofObject } from '../../../../generic/autocomplete';
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
    @Input() currencyList = [];
    @Input() employeesOriginalData = [];
    creditTerms: any;
    techStationList: any;
    workScopesList: { label: string; value: number; }[];
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
    masterCompanyId = 1;
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
    }

    ngOnChanges() {
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }

    getBasicDetails(){
        this.getConditionsList();
        this.getAllWorkOrderTypes();
        this.getAllWorkOrderStatus();
        this.getAllCreditTerms();
        // this.getAllCustomers();
        // this.getAllEmployees();
        this.getAllTecStations();
        this.getJobTitles();
        this.getAllWorkScpoes();
        this.getAllWorkOrderStages();
        this.getAllExpertiseType();
        this.getAllPriority();
        this.getLegalEntity();
     
        //if (!this.recCustomerId)
            this.getMultiplePartsNumbers();
        if (this.workOrderId || this.recCustomerId) {

            this.recCustomerId = 0;
            this.workOrderService.getWorkOrderById(this.workOrderId, this.recCustomerId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.isSpinnerEnable = true;
                //if (this.recCustomerId || (res.receivingCustomerWorkId != null && res.receivingCustomerWorkId > 0)) {
                //    if(res.receivingCustomerWorkId > 0)
                //        this.getPartNosByCustomer(res.customerId, res.workOrderId);
                //    else
                //        this.getPartNosByCustomer(res.customerId,0);
                //}
                // this.getPartNosByCustomer(res.customerId, 0);
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
    getAllExpertiseType() {
        this.commonService.getExpertise(this.currentUserMasterCompanyId).subscribe(res => {

          this.expertiseTypeList = res.map(x => {
            // return {
            //   label: x.expertiseType,
            //   value: x.employeeExpertiseId
            // }
            if(x.expertiseType =='Technician'){
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
      const  value1 = value ? value : this.workOrderGeneralInformation.workOrderTypeId;
        this.commonService.workOrderDefaultSettings(this.masterCompanyId, value1).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            
            if (res.length > 0) {
                const data = res[0];
                this.workorderSettings=res[0];
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

    getAllWorkOrderTypes(): void {
        this.workOrderService.getAllWorkOrderTypes().pipe(takeUntil(this.onDestroy$)).subscribe(
            result => {
                this.workOrderTypes = result;
            }
        );
    }



    getAllWorkOrderStatus(): void {
        this.commonService.smartDropDownList('WorkOrderStatus', 'ID', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.workOrderStatusList = res.sort(function (a, b) { return a.value - b.value; });
        })
    }

    getAllCreditTerms(): void {
        this.commonService.smartDropDownList('CreditTerms', 'CreditTermsId', 'Name').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.creditTerms = res;
        })
    }


    getJobTitles() {
        this.commonService.getJobTitles(this.currentUserMasterCompanyId).subscribe(res => {
            this.jobTitles = res;
            this.getSalesPersonList();
            this.getCSRList();
            this.getAgentsList();
            this.getTechnicianList();
            // this.getInspectiorsList();
            // this.getSalesAgentsList();
        })
    }
    getSalesPersonList() {
        const id = getValueByFieldFromArrayofObject('jobTitle', 'Sales', this.jobTitles);
        if (id !== undefined) {
            this.commonService.getEmployeesByCategory(id[0].jobTitleId).subscribe(res => {
                this.salesPersonOriginalList = res;
                this.salesAgentsOriginalList = [...this.salesPersonOriginalList];
            })
        }
    }

    getCSRList() {
        const id = getValueByFieldFromArrayofObject('jobTitle', 'CSR', this.jobTitles);
        if (id !== undefined) {
            this.commonService.getEmployeesByCategory(id[0].jobTitleId).subscribe(res => {
                this.csrOriginalList = res;
            })
        }
    }

    getAgentsList() {
        const id = getValueByFieldFromArrayofObject('jobTitle', 'Agents', this.jobTitles);
        if (id !== undefined) {
            this.commonService.getEmployeesByCategory(id[0].jobTitleId).subscribe(res => {
                this.agentsOriginalList = res;
                this.salesAgentsOriginalList = [...this.salesAgentsOriginalList, ...this.agentsOriginalList];
            })
        }
    }

    // getSalesAgentsList() {
    //     this.salesAgentsOriginalList = [...this.salesPersonOriginalList , ...this.agentsOriginalList ];
    //     // this.salesAgentsOriginalList.push(this.salesPersonOriginalList);
    //     // this.salesAgentsOriginalList.push(this.agentsOriginalList);
    // }

    getTechnicianList() {
        const id = getValueByFieldFromArrayofObject('jobTitle', 'Technician', this.jobTitles);
        if (id !== undefined) {
            this.commonService.getEmployeesByCategory(id[0].jobTitleId).subscribe(res => {
                this.technicianOriginalList = res;
            })
        }
    }
 

    async getAllEmployees() {
        await this.commonService.smartDropDownList('Employee', 'EmployeeId', 'FirstName').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.employeesOriginalData = res.map(x => {
                return {
                    ...x,
                    employeeId: x.value,
                    name: x.label
                }
            });
        })
    }

    async getAllTecStations() {
        await this.commonService.smartDropDownList('EmployeeStation', 'EmployeeStationId', 'StationName').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.techStationList = res.map(x => {
                return {
                    ...x,
                    techStationId: x.value,
                    name: x.label
                }
            });
        })
    }

    getAllWorkScpoes(): void {
        this.workOrderService.getAllWorkScopes().pipe(takeUntil(this.onDestroy$)).subscribe(
            result => {
                this.workScopesList = result.map(x => {
                    return {
                        label: x.description,
                        value: x.workScopeId
                    }
                })
            }
        );
    }


    getAllWorkOrderStages(): void {
        this.workOrderService.getWorkOrderStageAndStatus().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            // this.workOrderOriginalStageList = res;
            this.workOrderStagesList = res.map(x => {
                return {
                    ...x,
                    value: x.workOrderStageId,
                    label: x.workOrderStage
                }
            });
        })
    }

    getAllPriority() {
        this.commonService.smartDropDownList('Priority', 'PriorityId', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.priorityList = res;
        })
    }


    getMultiplePartsNumbers() {
        this.workOrderService.getMultipleParts().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.partNumberOriginalData = res;
        })
    }


    async getPartNosByCustomer(customerId, workOrderId) {
        // this.partNumberOriginalData = null;
        //this.workOrderService.getPartNosByCustomer(customerId).subscribe(res => {
        await this.workOrderService.getPartNosByCustomer(customerId, workOrderId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {

            this.partNumberOriginalData = res;
        });
    }

    getLegalEntity() {
        this.commonService.getLegalEntityList().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.legalEntityList = res;
        })

    }


    getConditionsList() {
        this.commonService.smartDropDownList('Condition', 'ConditionId', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
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
