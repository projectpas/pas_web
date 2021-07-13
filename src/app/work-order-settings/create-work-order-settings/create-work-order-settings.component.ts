import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
declare var $: any;
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
    workOrderViewList = [{ label: "MPN View", value: 1, woListViewRBId: 1 },
    { label: "WO View", value: 2, woListViewRBId: 2 }]
    workOrderStatusRbList = [{ label: "Open", value: 3, woListStatusRBId: 3 },
    { label: "Closed", value: 4, woListStatusRBId: 4 },
    { label: "Canceled", value: 5, woListStatusRBId: 5 },
    { label: "All", value: 6, woListStatusRBId: 6 }];
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
    workOrderTypes: any = [];
    ReceivingListRBList: any;
    WOListRBList: any;
    workOrderStatusList: any;
    tearDownTypes: any;
    selectedTearDownTypes: any = [];
    moduleName: string = "WO Settings";
    dropdownSettings = {};
    isSpinnerVisible: boolean = false;
    breadcrumbs: MenuItem[];
    setEditArray: any = [];
    woTypeId: any;

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
        this.receivingForm.isApprovalRule = false;
        this.receivingForm.isshortteardown = false;
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
        this.AcquisitionloadData('');
        this.getAllWorkOrderStatus();
        this.getAllWorkOrderStages();
        this.loadConditionData('');
        this.getAllPriority();
        // this.getworblist();
        this.getAllTearDownTypes();
        this.receivingCustomerWorkId = this._actRoute.snapshot.params['id'];
        if (!this.receivingCustomerWorkId) {
            this.loadSiteData('');
            this.loadConditionData('');
        }

        if (!this.receivingCustomerWorkId) {
            this.breadcrumbs = [
                { label: 'Work Order Settings' },
                { label: 'Create Work Order Settings' },
            ];
        } else {
            this.breadcrumbs = [
                { label: 'Work Order Settings' },
                { label: 'Edit Work Order Settings' },
            ];
        }
    }

    get userName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.userName
            : '';
    }

    getAllTearDownTypes() {
        this.commonService.smartDropDownList('TeardownType', 'TeardownTypeId', 'Name', 0, '', '', 0)
            .subscribe(
                res => {
                    this.tearDownTypes = res;
                    if (this.receivingCustomerWorkId) {
                        this.isEditMode = true;
                        this.getReceivingCustomerDataonEdit(this.receivingCustomerWorkId);
                    }
                }
            )
    }

    getReceivingCustomerDataonEdit(id) {
        const mastercompanyid = this.authService.currentUser.masterCompanyId;
        this.readonly = false;
        this.isSpinnerVisible = true;
        this.receivingCustomerWorkOrderService.getworkflowbyid(mastercompanyid, id).subscribe(res => {
            this.receivingForm = {
                ...res[0]
            };
            this.isSpinnerVisible = false;

            this.loadSiteData('');
            this.loadConditionData('');
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
            if (this.receivingForm.pickTicketEffectiveDate) {
                this.receivingForm.pickTicketEffectiveDate = new Date(this.receivingForm.pickTicketEffectiveDate);
            }
            this.getSiteDetailsOnEdit(this.receivingForm);

            let teardowns = res[0].tearDownTypes.split(',');
            this.tearDownTypes.forEach(
                teardown => {
                    teardowns.forEach(
                        (td) => {
                            if (td == teardown.value) {
                                this.selectedTearDownTypes = [...this.selectedTearDownTypes, teardown];
                            }
                        }
                    )
                }
            )

        },
            err => {
                this.isSpinnerVisible = false;
            });
    }

    getSiteDetailsOnEdit(res) {
        this.getInactiveObjectOnEdit('value', res.defaultWearhouseId, this.allWareHouses, 'Warehouse', 'WarehouseId', 'Name');
        this.getInactiveObjectOnEdit('value', res.defaultLocationId, this.allLocations, 'Location', 'LocationId', 'Name');
        this.getInactiveObjectOnEdit('value', res.defaultShelfId, this.allShelfs, 'Shelf', 'ShelfId', 'Name');
        this.getInactiveObjectOnEdit('value', res.defaultBinId, this.allBins, 'Bin', 'BinId', 'Name');
    }

    getInactiveObjectOnEdit(string, id, originalData, tableName, primaryColumn, description) {
        if (id) {
            for (let i = 0; i < originalData.length; i++) {
                if (originalData[i][string] == id) {
                    return id;
                }
            }
            let obj: any = {};
            this.commonService.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryColumn, id, this.authService.currentUser.masterCompanyId).subscribe(res => {
                obj = res[0];
                if (tableName == 'Site') {
                    obj.siteId = obj.value,
                        obj.name = obj.label,
                        this.allSites = [...originalData, obj];
                }
                else if (tableName == 'Warehouse') {
                    obj.warehouseId = obj.value,
                        obj.name = obj.label,
                        this.allWareHouses = [...originalData, obj];
                }
                else if (tableName == 'Location') {
                    obj.locationId = obj.value,
                        obj.name = obj.label,
                        this.allLocations = [...originalData, obj];
                }
                else if (tableName == 'Shelf') {
                    obj.shelfId = obj.value,
                        obj.name = obj.label,
                        this.allShelfs = [...originalData, obj];
                }
                else if (tableName == 'Bin') {
                    obj.binId = obj.value,
                        obj.name = obj.label,
                        this.allBins = [...originalData, obj];
                }
            });
            return id;
        } else {
            return null;
        }
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

    getTearDownTypes() {
        let result = '';
        this.selectedTearDownTypes.forEach(
            x => {
                if (result == '') {
                    result = x.value;
                }
                else {
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
            masterCompanyId: Number(this.authService.currentUser.masterCompanyId)
        }

        if (receivingForm.pickTicketEffectiveDate) {
            receivingForm.pickTicketEffectiveDate = receivingForm.pickTicketEffectiveDate.toDateString();
        }

        if (!this.isEditMode) {
            this.receivingCustomerWorkOrderService.newAction(receivingForm).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Saved Work order setting Successfully`,
                    MessageSeverity.success
                );
                this.router.navigateByUrl('/workordersettingsmodule/workordersettings/app-work-order-settings-list');
            });
        }
        else {
            this.receivingCustomerWorkOrderService.updateAction(receivingForm).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Updated Work order setting Successfully`,
                    MessageSeverity.success
                );
                this.router.navigateByUrl('/workordersettingsmodule/workordersettings/app-work-order-settings-list');

            });
        }
    }

    private loadReceivingListRB() {
        this.commonService.smartDropDownList('ReceivingListRB', 'ReceivingListRBId', 'Name', this.authService.currentUser.masterCompanyId, '', '', 0).subscribe(response => {
            this.ReceivingListRBList = response;
        });
    }

    private loadWOListRB() {
        this.commonService.smartDropDownList('WOListRB', 'WOListRBId', 'Name', this.authService.currentUser.masterCompanyId, '', '', 0).subscribe(response => {
            this.WOListRBList = response.map(x => {
                return {
                    label: x.label,
                    value: x.value
                }
            });
        });
    }

    getAllWorkOrderStages(): void {
        this.workOrderService.getWorkOrderStageAndStatus(this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.workOrderOriginalStageList = res;
            this.workOrderStagesList = res
            if (!this.isEditMode) {
                this.workOrderStagesList.map(x => {
                    if (x.workOrderStage == 'WO Opened') {
                        this.receivingForm.defaultStageCodeId = x.workOrderStageId;
                    }
                })
            }
        });
    }

    getAllPriority() {
        this.commonService.smartDropDownList('Priority', 'PriorityId', 'Description', this.authService.currentUser.masterCompanyId, '', '', 0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.priorityList = res;
            if (!this.isEditMode) {
                this.priorityList.map(x => {
                    if (x.label == 'Routine') {
                        this.receivingForm.defaultPriorityId = x.value;
                    }
                })
            }
        })
    }

    getAllWorkOrderStatus(): void {
        this.commonService.smartDropDownList('WorkOrderStatus', 'ID', 'Description', 0, '', '', 0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.workOrderStatusList = res.sort(function (a, b) { return a.value - b.value; });
        })
    }

    onFilterAcqution(value) {
        this.AcquisitionloadData(value);
    }


    private AcquisitionloadData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.receivingForm.workOrderTypeId ? this.receivingForm.workOrderTypeId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('WorkOrderType', 'Id', 'Description', strText, true, 20, this.setEditArray.join(), this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.workOrderTypes = res;
            this.workOrderTypes.forEach(ev => {
                if (ev.label == 'Customer') {
                    this.woTypeId = ev.value
                }
            })

        });
    }

    onFilterCondition(value) {
        this.loadConditionData(value);
    }

    private loadConditionData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.receivingForm.defaultConditionId ? this.receivingForm.defaultConditionId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description', strText, true, 20, this.setEditArray.join(), this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.allConditionInfo = res;

            if (!this.isEditMode) {
                this.allConditionInfo.map(x => {
                    if (x.label == 'AR') {
                        this.receivingForm.defaultConditionId = x.conditionId;
                    }
                })
            }
        });
    }

    onFilterSite(value) {
        this.loadSiteData(value);
    }

    private loadSiteData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.receivingForm.defaultSiteId ? this.receivingForm.defaultSiteId : 0);

        } else {
            this.setEditArray.push(0);
        }
        const mcId = this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
        this.commonService.autoSuggestionSmartDropDownList('Site', 'SiteId', 'Name', value, true, 20, this.setEditArray.join(), mcId).subscribe(res => {
            if (res && res.length != 0) {
                this.allSites = res.map(x => {
                    return {

                        siteId: x.value,
                        name: x.label,
                        ...x
                    }
                });
            }
        })
    }

    siteValueChange(siteId) {
        this.allWareHouses = [];
        this.allLocations = [];
        this.allShelfs = [];
        this.allBins = [];
        this.commonService.smartDropDownList('Warehouse', 'WarehouseId', 'Name', this.authService.currentUser.masterCompanyId, 'SiteId', siteId, 0).subscribe(res => {
            this.allWareHouses = res.map(x => {
                return {
                    warehouseId: x.value,
                    name: x.label,
                    ...x
                }
            });
        })
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
        if (warehouseId != 0) {
            this.commonService.smartDropDownList('Location', 'LocationId', 'Name', this.authService.currentUser.masterCompanyId, 'WarehouseId', warehouseId, 0).subscribe(res => {
                this.allLocations = res.map(x => {
                    return {

                        locationId: x.value,
                        name: x.label,
                        ...x
                    }
                });
            })

        } else {
            this.allLocations = [];
        }
    }

    locationValueChange(locationId) {
        this.allShelfs = [];
        this.allBins = [];
        if (locationId != 0) {
            this.commonService.smartDropDownList('Shelf', 'ShelfId', 'Name', this.authService.currentUser.masterCompanyId, 'LocationId', locationId, 0).subscribe(res => {
                this.allShelfs = res.map(x => {
                    return {
                        shelfId: x.value,
                        name: x.label,
                        ...x
                    }
                });
            })

        } else {
            this.allShelfs = [];
        }
    }

    shelfValueChange(shelfId) {
        this.allBins = [];
        if (shelfId != 0) {
            this.commonService.smartDropDownList('Bin', 'BinId', 'Name', this.authService.currentUser.masterCompanyId, 'ShelfId', shelfId, 0).subscribe(res => {
                this.allBins = res.map(x => {
                    return {
                        binId: x.value,
                        name: x.label,
                        ...x
                    }
                });
            })

        } else {
            this.allBins = [];
        }
    }

    getmemo(ev) {

    }
}