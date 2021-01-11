import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
declare var $ : any;
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { MenuItem } from 'primeng/api';//bread crumb
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { ConditionService } from '../../services/condition.service';
import { BinService } from '../../services/bin.service';
import { SiteService } from '../../services/site.service';;
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { StocklineService } from '../../services/stockline.service';
import { ConfigurationService } from '../../services/configuration.service';
import { WorkOrderService } from '../../services/work-order/work-order.service';
import { WorkOrderType } from '../../models/work-order-type.model';
import { WorkOrderSettingsService } from '../../services/work-order-settings.service';

@Component({
    selector: 'app-create-work-order-settings',
    templateUrl: './create-work-order-settings.component.html',
    styleUrls: ['./create-work-order-settings.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})

export class CreateWorkOrderSettingsComponent implements OnInit {

    receivingForm: any = {};
    isEditMode: boolean = false;
    private onDestroy$: Subject<void> = new Subject<void>();
    breadcrumbs: MenuItem[] = [
        { label: 'Admin' },
        { label: 'Work Order Settings' },
        { label: 'Create Work Order Settings' }
    ];
    workOrderViewList= [{label: "MPN View",value: 1,woListViewRBId:1},
    {label: "WO View",value: 2,woListViewRBId:2}]
   workOrderStatusRbList =[{label: "Open",value: 3,woListStatusRBId:3},
    {label: "Closed",value: 4,woListStatusRBId:4},
    {label: "Canceled",value: 5,woListStatusRBId:5},
    {label: "All",value: 6,woListStatusRBId:6}];
    allCustomersList: any = [];
    allVendorsList: any = [];
    allCompanyList: any = [];
    customersList: any = [];
    vendorsList: any = [];
    companyList: any = [];
    allEmployeeList: any = [];
    employeeNames: any = [];
    allCustomersInfo: any = [];
    customerNamesInfo: any = [];
    customerCodesInfo: any = [];
    allPartnumbersList: any = [];
    partNumbersInfo: any = [];
    allWareHouses: any = [];
    allLocations: any = [];
    allShelfs: any = [];
    allBins: any = [];
    allSites: any = [];
    businessUnitList: any = [];
    divisionList: any = [];
    departmentList: any = [];
    allConditionInfo: any = [];
    customerContactList: any = [];
    customerContactInfo: any = [];
    customerPhoneInfo: any = [];
    allTagTypes: any = [];
    workordersettings: any;
    readonly: boolean = true;
    currentDate = new Date();
    disableMagmtStruct: boolean = true;
    textAreaInfo: string;
    textAreaLabel: string;
    receivingCustomerWorkId: number;
    workOrderId: number;
    sourceTimeLife: any = {};
    customerId: number;
    timeLifeCyclesId: number;
    disableCondition: boolean = true;
    disableSite: boolean = true;
    loadingIndicator: boolean;
    formData = new FormData();
    customerWorkDocumentsList: any = [];
    priorityList: any;
    workOrderStagesList: any;
    workOrderOriginalStageList: any;
    workScopesList: any;
    workOrderTypes: WorkOrderType[];
    // workOrderStatusList: any;
    ReceivingListRBList: any;
    WOListRBList: any;
    workOrderStatusList: any;
    tearDownTypes: any;
    selectedTearDownTypes: any = [];
    moduleName: string = "WO Settings";
    dropdownSettings = {};
    constructor(
        private workOrderService: WorkOrderService,
        private commonService: CommonService, private customerService: CustomerService, private binService: BinService, private siteService: SiteService, private conditionService: ConditionService, private datePipe: DatePipe, private _actRoute: ActivatedRoute, private receivingCustomerWorkOrderService: WorkOrderSettingsService, private authService: AuthService, private router: Router, private alertService: AlertService, private stocklineService: StocklineService, private configurations: ConfigurationService) {
        this.receivingForm.receivingNumber = 'Creating';
        this.receivingForm.workOrderTypeId = 0;
        this.receivingForm.prefix;
        this.receivingForm.sufix;
        this.receivingForm.startCode;
        this.receivingForm.recivingListDefaultRB = 0;
        this.receivingForm.woListDefaultRB = 0;
        this.receivingForm.defaultConditionId = 0;
        this.receivingForm.defaultSiteId = 0;
        this.receivingForm.defaultWearhouseId = 0;
        this.receivingForm.defaultLocationId = 0;
        this.receivingForm.defaultShelfId = 0;
        this.receivingForm.defaultStageCodeId = 0;
        this.receivingForm.defaultScopeId = 0;
        this.receivingForm.defaultStatusId = 0;
        this.receivingForm.defaultPriorityId = 0;
        this.receivingForm.masterCompanyId = 0;
        this.receivingForm.createdBy = 0;
        this.receivingForm.updatedBy = 0;
        this.receivingForm.receivedDate = new Date();
    }
    ngOnInit() {
        // this.loadstatusData();
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'value',
            textField: 'label',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 1,
            allowSearchFilter: false
        };
        this.loadReceivingListRB();
        this.loadWOListRB();
     
        this.loadSiteData();
        this.loadConditionData();
        this.getAllWorkOrderTypes();
        this.getAllWorkOrderStatus();
        this.getAllWorkScpoes();
        this.getAllWorkOrderStages();

        this.getAllPriority();
        this.getworblist();
        this.getAllTearDownTypes();
        this.receivingCustomerWorkId = this._actRoute.snapshot.params['id'];
    }

    // api/workOrder/getworblist
    private getworblist() {
        this.workOrderService.getworblist().subscribe(res => {
        });
    }

    get userName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.userName
            : '';
    }

    

    private loadSiteData() {
        this.siteService.getSiteList().subscribe(res => {
            this.allSites = res[0];
        });
    }

    private loadConditionData() {
        this.conditionService.getConditionList().subscribe(res => {
            this.allConditionInfo = res[0];
            if(!this.isEditMode) {
                this.allConditionInfo.map(x => {
                    if(x.description == 'AR') {
                        this.receivingForm.defaultConditionId = x.conditionId;
                    }
                })                
            }
        });
    }

//     loadstatusData(){
//     this.workOrderViewList= [{label: "MPN View",value: 1,woListViewRBId:1},
//     {label: "WO View",value: 2,woListViewRBId:2}]
//    this.workOrderStatusRbList =[{label: "Open",value: 3,woListStatusRBId:3},
//     {label: "Closed",value: 4,woListStatusRBId:4},
//     {label: "Canceled",value: 5,woListStatusRBId:5},
//     {label: "All",value: 6,woListStatusRBId:6}];
// }
    getAllTearDownTypes(){
        this.commonService.smartDropDownList('TeardownType', 'TeardownTypeId', 'Name')
        .subscribe(
            res => {
                this.tearDownTypes = res;
                if (this.receivingCustomerWorkId) {
                    this.isEditMode = true;
                    this.getReceivingCustomerDataonEdit(this.receivingCustomerWorkId);
                   
                }
            },
            err => {
                this.errorHandling(err);
            }
        )
    }

    getReceivingCustomerDataonEdit(id) {
        const mastercompanyid = 1;
        this.readonly = false;
        this.receivingCustomerWorkOrderService.getworkflowbyid(mastercompanyid, id).subscribe(res => {

             this.receivingForm = {
                 ...res[0]
                //  woListStatusRBId:res[0].woListStatusDefaultRB,
                //  woListViewRBId:res[0].woListDefaultRB
            };
            let teardowns = res[0].tearDownTypes.split(',');
            this.tearDownTypes.forEach(
                teardown => {
                    teardowns.forEach(
                        (td)=>{
                            if(td == teardown.value){
                                this.selectedTearDownTypes = [...this.selectedTearDownTypes, teardown];
                            }
                        }
                    )
                }
            )
            if (this.receivingForm.defaultSiteId) {
                this.siteValueChange(this.receivingForm.defaultSiteId)
            }
            if (this.receivingForm.defaultWearhouseId) {
                this.wareHouseValueChange(this.receivingForm.defaultWearhouseId)
            }
            if (this.receivingForm.defaultLocationId) {
                this.locationValueChange(this.receivingForm.defaultLocationId)
            }
            if (this.receivingForm.defaultShelfId) {
                this.shelfValueChange(this.receivingForm.defaultShelfId)
            }
          
        },
        err => {
            this.errorHandling(err);
        });
    }    

    getSiteDetailsOnEdit(res) {
        this.siteValueChange(res.siteId);
        this.wareHouseValueChange(res.warehouseId);
        this.locationValueChange(res.locationId);
        this.shelfValueChange(res.binId);
        this.receivingForm.warehouseId = res.warehouseId;
        this.receivingForm.locationId = res.locationId;
        this.receivingForm.shelfId = res.shelfId;
        this.receivingForm.binId = res.binId;
    }

    

    siteValueChange(siteId) {
        this.allWareHouses = [];
        this.allLocations = [];
        this.allShelfs = [];
        this.allBins = [];
        this.receivingForm.warehouseId = 0;
        this.receivingForm.locationId = 0;
        this.receivingForm.shelfId = 0;
        this.receivingForm.binId = 0;
        this.binService.getWareHouseDate(siteId).subscribe(res => {
            this.allWareHouses = res;
        });
        this.onChangeSiteName();
    }

    onChangeSiteName() {
        if (this.receivingForm.siteId != 0) {
            this.disableSite = false;
        } else {
            this.disableSite = true;
        }
    }

    wareHouseValueChange(warehouseId) {
        this.allLocations = [];
        this.allShelfs = [];
        this.allBins = [];
        this.receivingForm.locationId = 0;
        this.receivingForm.shelfId = 0;
        this.receivingForm.binId = 0;
        this.binService.getLocationDate(warehouseId).subscribe(res => {
            this.allLocations = res;
        });
    }

    locationValueChange(locationId) {
        this.allShelfs = [];
        this.allBins = [];
        this.receivingForm.shelfId = 0;
        this.receivingForm.binId = 0;
        this.binService.getShelfDate(locationId).subscribe(res => {
            this.allShelfs = res;
        },
        err => {
            this.errorHandling(err);
        });
    }

    shelfValueChange(binId) {
        this.allBins = [];
        this.receivingForm.binId = 0;

        this.binService.getBinDataById(binId).subscribe(res => {
            this.allBins = res;
        },
        err => {
            this.errorHandling(err);
        });
    }


    resetSerialNoTimeLife() {
        this.receivingForm.isSkipSerialNo = false;
        this.receivingForm.serialNumber = '';
        this.receivingForm.isSkipTimeLife = false;
        this.receivingForm.timeLifeDate = null;
        this.receivingForm.timeLifeOrigin = '';
        this.sourceTimeLife = {};
    }



    onSelectCondition() {
        if (this.receivingForm.conditionId != 0) {
            this.disableCondition = false;
        } else {
            this.disableCondition = true;
        }
    }

    getTearDownTypes(){
        let result = '';
        this.selectedTearDownTypes.forEach(
            x=>{
                if(result == ''){
                    result = x.value;
                }
                else{
                    result += `,${x.value}`
                }
            }
        )
        return result;
    }

    onSaveCustomerReceiving() {
        const receivingForm = {
            ...this.receivingForm,
            tearDownTypes: this.getTearDownTypes(),
            createdBy: this.userName,
            updatedBy: this.userName,
            masterCompanyId: 1
        }
    
        if (!this.isEditMode) {
          //  alert(JSON.stringify(receivingForm));
            this.receivingCustomerWorkOrderService.newAction(receivingForm).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Saved Work order setting Successfully`,
                    MessageSeverity.success
                );
                this.router.navigateByUrl('/workordersettingsmodule/workordersettings/app-work-order-settings-list');
            },
            (err)=>{
                this.errorHandling(err);
            });
        }
        else {
          //  alert(JSON.stringify(receivingForm));
            this.receivingCustomerWorkOrderService.updateAction(receivingForm).subscribe(res => {              
                this.alertService.showMessage(
                    'Success',
                    `Updated Work order setting Successfully`,
                    MessageSeverity.success
                );
                this.router.navigateByUrl('/workordersettingsmodule/workordersettings/app-work-order-settings-list');

            },
            (err)=>{
                this.errorHandling(err);
            });
        }
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
            },
            err => {
                this.errorHandling(err);
            }
        );
    }

    private loadReceivingListRB() {
        this.commonService.smartDropDownList('ReceivingListRB', 'ReceivingListRBId', 'Name').subscribe(response => {
            this.ReceivingListRBList = response;
        },
        err => {
            this.errorHandling(err);
        });
    }

    private loadWOListRB() {
        this.commonService.smartDropDownList('WOListRB', 'WOListRBId', 'Name').subscribe(response => {
            this.WOListRBList  = response.map(x => {
                return {
                    label: x.label,
                    value: x.value
                }
                // this.woListView=
            },
            err => {
                this.errorHandling(err);
            });
        });
    }
    getAllWorkOrderStages(): void {
        this.workOrderService.getWorkOrderStageAndStatus().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.workOrderOriginalStageList = res;
            this.workOrderStagesList = res
            if(!this.isEditMode) {
                this.workOrderStagesList.map(x => {
                    if(x.workOrderStage == 'WO Opened') {
                        this.receivingForm.defaultStageCodeId = x.workOrderStageId;
                    }
                })                
            }
        },
        err => {
            this.errorHandling(err);
        });
    }

    getAllPriority() {
        this.commonService.smartDropDownList('Priority', 'PriorityId', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.priorityList = res;
            if(!this.isEditMode) {
                this.priorityList.map(x => {
                    if(x.label == 'Routine') {
                        this.receivingForm.defaultPriorityId = x.value;
                    }
                })                
            }
        },
        err => {
            this.errorHandling(err);
        })
    }

    getAllWorkOrderTypes(): void {
        this.workOrderService.getAllWorkOrderTypes().pipe(takeUntil(this.onDestroy$)).subscribe(
            result => {
                this.workOrderTypes = result;
            },
            err => {
                this.errorHandling(err);
            }
        );
    }



    getAllWorkOrderStatus(): void {
        this.commonService.smartDropDownList('WorkOrderStatus', 'ID', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.workOrderStatusList = res.sort(function (a, b) { return a.value - b.value; });
        },
        err => {
            this.errorHandling(err);
        })
    }

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

}



