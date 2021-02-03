import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { AlertService,MessageSeverity } from '../../../../services/alert.service';
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
    @Input()subWoMpnGridUpdated;
    @Input()conditionListfromSubWo;
    // @Input() subWOPartNoId;
    creditTerms: any;
    employeesOriginalData: any;
    techStationList: any;
    workScopesList: { label: string; value: number; }[];
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
    masterCompanyId:any;
    workorderSettings: any;
    expertiseTypeList: any;
    technicianByExpertiseTypeList: any;
    salesOrderReferenceData: SalesOrderReference;
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
        if(this.isSubWorkOrder==false){
        this.salesOrderService.getReferenceObject().subscribe(data => {
        });
        this.salesOrderService.salesOrderReferenceSubj$.subscribe(data => {
            this.salesOrderReferenceData = data;
          });
        }
     }


    ngOnInit() {
this.masterCompanyId=this.authService.currentUser
? this.authService.currentUser.masterCompanyId
: null;
        // comment due to getting error in labor need to check all scenarios
        // if(this.isSubWorkOrder==false){
            this.getAllWorkOrderTypes();
            this.getAllWorkOrderStatus();
            this.getAllCreditTerms();
            // this.getAllCustomers();
            this.getAllEmployees();
            this.getAllTecStations();
            this.getJobTitles();
            this.getAllWorkScpoes();
            this.getAllWorkOrderStages();
            this.getAllExpertiseType();
            this.getAllPriority();
            this.getCurrency();
            this.getLegalEntity();
            if(this.isSubWorkOrder==false){
            this.getConditionsList();
            }else{
                this.conditionList=this.conditionListfromSubWo;
                setTimeout(()=>{
                    this.isSpinnerEnable = true;
                },2000)
}

        if (this.isSubWorkOrder) {
            this.subWorkOrderId = this.subWorkOrderId;
        } else {
            // get the workOrderId on Edit Mode
            this.workOrderId = this.acRouter.snapshot.params['id'];
            //Receiving Customer
            this.recCustomerId = this.acRouter.snapshot.params['rcustid'];
        }
        //if (!this.recCustomerId)
        //     this.getMultiplePartsNumbers();
        // if(this.isSubWorkOrder==false){
        if (this.workOrderId || this.recCustomerId) {

            if (this.recCustomerId) {
                this.showTabsGrid = false;
                this.workOrderId = 0;
                    this.getWorkOrderDefaultSetting();
            }
             else {    // uncomment this else by mahesh  , due to comment this  this.recCustomerId is undefined and handel bellow  promisedDate etc assing nulls 

                this.recCustomerId = 0;
            }
// if(this.workOrderId && this.recCustomerId){ //fix reccustomer id is comming undefined issue
            this.workOrderService.getWorkOrderById(this.workOrderId, this.recCustomerId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                setTimeout(()=>{
                    this.isSpinnerEnable = true;
                },2000)
                //if (this.recCustomerId || (res.receivingCustomerWorkId != null && res.receivingCustomerWorkId > 0)) {
                //    if(res.receivingCustomerWorkId > 0)
                //        this.getPartNosByCustomer(res.customerId, res.workOrderId);
                //    else
                //        this.getPartNosByCustomer(res.customerId,0);
                //}
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
                            // customerRequestDate: this.recCustomerId == 0 ? new Date(x.customerRequestDate) : null,
                            promisedDate: this.recCustomerId == 0 ? new Date(x.promisedDate) : null,
                            estimatedCompletionDate: this.recCustomerId == 0 ? new Date(x.estimatedCompletionDate) : null,
                            estimatedShipDate: this.recCustomerId == 0 ? new Date(x.estimatedShipDate) : null,
                            receivedDate: this.recCustomerId == 0 && res.receivingCustomerWorkId == null ? null : new Date(x.receivedDate)
                        }

                    })
                }
                this.editWorkOrderGeneralInformation = data;
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
        // }
        }
        else {
            this.getWorkOrderDefaultSetting();
        }
    // }
    }

    ngOnChanges(changes: SimpleChanges) {
        // console.log("cnages",changes);
        // console.log("cnages",this.subWoMpnGridUpdated);
        // this.subWOPartNoId=this.subWOPartNoId;
        this.subWoMpnGridUpdated=this.subWoMpnGridUpdated;
    }
    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
    getAllExpertiseType() {
        this.commonService.getExpertise().subscribe(res => {

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
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
      }
      getExpertiseEmployeeByExpertiseId(value) {
        this.commonService.getExpertiseEmployeesByCategory(value).subscribe(res => {
          this.technicianByExpertiseTypeList = res;
         },
         err => {
             // this.isSpinnerVisible = false;
             this.errorHandling(err);
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
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }




    getCustomerNameandCodeById(object) {
        const { customerId } = object;
        this.commonService.getCustomerNameandCodeById(customerId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            object.customer = res;
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }

    getAllWorkOrderTypes(): void {
        // this.workOrderService.getAllWorkOrderTypes().pipe(takeUntil(this.onDestroy$)).subscribe(
        //     result => {
        //         this.workOrderTypes = result;
        //     }
        // );

        this.commonService.smartDropDownList('WorkOrderType', 'ID', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            // this.workOrderTypes = res;
            this.workOrderTypes = res.map(x => {
                return {
                    id: x.value,
                    description: x.label
                }
              });

         },
         err => {
             // this.isSpinnerVisible = false;
             this.errorHandling(err);
         })
    }



    getAllWorkOrderStatus(): void {
        this.commonService.smartDropDownList('WorkOrderStatus', 'ID', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.workOrderStatusList = res.sort(function (a, b) { return a.value - b.value; });
         },
         err => {
             // this.isSpinnerVisible = false;
             this.errorHandling(err);
         })
    }

    getAllCreditTerms(): void {
        this.creditTerms = [];
    }


    getJobTitles() {
        this.commonService.getJobTitles().subscribe(res => {
            this.jobTitles = res;
            this.getSalesPersonList();
            this.getCSRList();
            this.getAgentsList();
            this.getTechnicianList();
            // this.getInspectiorsList();
            // this.getSalesAgentsList();
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }
    getSalesPersonList() {
        const id = getValueByFieldFromArrayofObject('jobTitle', 'Sales', this.jobTitles);
        if (id !== undefined) {
            this.commonService.getEmployeesByCategory(id[0].jobTitleId).subscribe(res => {
                this.salesPersonOriginalList = res;
                this.salesAgentsOriginalList = [...this.salesPersonOriginalList];
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
        }
    }

    getCSRList() {
        const id = getValueByFieldFromArrayofObject('jobTitle', 'CSR', this.jobTitles);
        if (id !== undefined) {
            this.commonService.getEmployeesByCategory(id[0].jobTitleId).subscribe(res => {
                this.csrOriginalList = res;
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
        }
    }

    getAgentsList() {
        const id = getValueByFieldFromArrayofObject('jobTitle', 'Agents', this.jobTitles);
        if (id !== undefined) {
            this.commonService.getEmployeesByCategory(id[0].jobTitleId).subscribe(res => {
                this.agentsOriginalList = res;
                this.salesAgentsOriginalList = [...this.salesAgentsOriginalList, ...this.agentsOriginalList];
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
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
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
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
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
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
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }

    getAllWorkScpoes(): void {
     this.commonService.smartDropDownList('WorkScope', 'WorkScopeId', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.workScopesList = res;
            // .map(x => {
            //     return {
            //         ...x,
            //         techStationId: x.value,
            //         name: x.label
            //     }
            // });
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
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
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }

    getAllPriority() {
        this.commonService.smartDropDownList('Priority', 'PriorityId', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.priorityList = res;
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }


    getMultiplePartsNumbers() {
        this.workOrderService.getMultipleParts().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.partNumberOriginalData = res;
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }


    async getPartNosByCustomer(customerId, workOrderId) {
        // this.partNumberOriginalData = null;
        //this.workOrderService.getPartNosByCustomer(customerId).subscribe(res => {
        await this.workOrderService.getPartNosByCustomer(customerId, workOrderId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {

            this.partNumberOriginalData = res;
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        });
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

    getLegalEntity() {
        this.commonService.getLegalEntityList().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.legalEntityList = res;
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
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
            setTimeout(()=>{
                this.isSpinnerEnable = true;
            },2000)
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
    }
    moduleName:any='';
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
                'Failed due to some  error',
                MessageSeverity.error
            );
        }
    }
}
