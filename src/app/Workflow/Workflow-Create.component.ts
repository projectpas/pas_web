import { Component, OnInit, ViewChild, Input, OnDestroy, Output, EventEmitter } from "@angular/core";
import { ActionService } from "./ActionService";
import { ITask } from "./Action";
import { IActionAttrbutes } from "./ActionAttributes";
import { ActivatedRoute, Router } from "@angular/router";
import { SelectItem } from "primeng/api";
import { WorkScopeService } from "../services/workscope.service";
import { ItemClassificationService } from "../services/item-classfication.service";
import { CurrencyService } from "../services/currency.service";
import { UnitOfMeasureService } from "../services/unitofmeasure.service";
import { WorkFlowtService } from "../services/workflow.service";
import { ItemMasterService } from "../services/itemMaster.service";
import { AlertService, MessageSeverity } from "../services/alert.service";
declare var $: any;
import { ChargesCreateComponent } from "../shared/Charges-Create.component";
import { Percent } from "../models/Percent.model";
import { AuthService } from "../services/auth.service";
import { formatNumberAsGlobalSettingsModule, editValueAssignByCondition } from "../generic/autocomplete";
import { CommonService } from "../services/common.service";
import { MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'wf-create',
    templateUrl: './workflow-Create.component.html',
    styleUrls: ['./workflow-Create.component.css'],
    providers: [DatePipe]
})
export class WorkflowCreateTestComponent implements OnInit, OnDestroy {
    @Input() isWorkOrder = false;
    @Input() savedWorkOrderData;
    @Input() WorkOrderType;
    @Input() workFlowId;
    @Input() workFlowWorkOrderId;
    @Input() workOrderPartNumberId;
    @Input() isQuote = false;
    @Input() isEdit = false;
    @Output() savedWorkFlowWorkOrderData = new EventEmitter();
    @Output() saveData = new EventEmitter();
    UpdateMode: boolean;
    workFlow: any;
    workFlowList: any[];
    actions: ITask[];
    actionAttributes: IActionAttrbutes[];
    actionList: ITask[];
    currenttaskId: string = "0";
    selectedtaskId: number;
    selectedActionAttributeId: number;
    errorMessage: string;
    showActionAttribute: boolean = false;
    showMainPage: boolean = false;
    actionAttributesList = [];
    selectedItems = [];
    dropdownSettings = {};
    newAction: ITask;
    workFlowActions: ITask[];
    sourceWorkFlow: any = {};
    title: string = "Work Flow";
    validateheader: any = false;
    calculatepart: any = false;
    finalCost: any;
    finalThrsh: any;
    allCustomers: any[] = [];
    customerNamecoll: any[] = [];
    customerNames: any[] = [];
    percentreplcae: boolean;
    ispercent: boolean;
    isFixed: boolean;
    isFlat: boolean;
    isCalculate: boolean;
    allCurrencyData: any[] = [];
    worksScopeCollection: any[] = [];
    partWithId: any;
    partCollection: any[] = [];
    changedPartCollection: any[] = [];
    workflowCharges: any[][];
    workflowEquipment: any[][];
    workflowMaterails: any[][];
    workflowExpertise: any[][];
    itemClassInfo: any[][];
    allUomdata: any[] = [];
    materialMandatory: any[] = [];
    allconditioninfo: any[] = [];
    allPartDetails: any[] = [];
    allParts: any[] = [];
    workflowactionAttributes: any[] = [];
    workflowActions: any[] = [];
    equipmentListObj: any[] = [];
    expertiseListObj: any[] = [];
    expertiseList: boolean;
    directionListObj: any[] = [];
    directionList: boolean;
    exclusionListObj: any[] = [];
    exclusionList: boolean;
    equipmentList: boolean;
    partListData: any[] = [];
    chargeList: boolean;
    selectedActionAttribute: any;
    materialList: boolean;
    materialListObj: any[] = [];
    chargeListObj: any[] = [];
    cars: SelectItem[];
    selectedValues: any[] = [];
    isWorkFlowEdit: boolean = false;
    selectedWorkflow: any;
    workflowActionAttribues: any[] = [];
    loadedDDs: any = {};
    selectedActionAttributes: any[] = [];
    actionValue: any;
    addedtaskIds: number[] = [];
    selectedAction: any;
    actionsDD: any[] = [];
    actionsAttributesDD: SelectItem[] = [];
    chargesDL: any[] = [];
    directionsDL: any[] = [];
    equipmentDL: any[] = [];
    exclusionsDL: any[] = [];
    expertiseDL: any[] = [];
    materialListDL: any[] = [];
    measurementsDL: any[] = [];
    publicationsDL: any[] = [];
    selectedSideTabIndex: number;
    berthreshold: any;
    modal: any;
    EstMaterialCost: any = '0.00';
    EstTotalExpertiseCost: any = '0.00';
    EstTotalCharges: any = '0.00';
    EstTotalOthers: any = '0.00';
    TotalEst: any = '0.00';
    actionAttributeTabs: any[] = [
        { visible: false, selected: false, label: "Material List" },
        { visible: false, selected: false, label: "Charges" },
        { visible: false, selected: false, label: "Tools" },
        { visible: false, selected: false, label: "Expertise" },
        { visible: false, selected: false, label: "Directions" },
        { visible: false, selected: false, label: "Exclusions" },
        { visible: false, selected: false, label: "Publications" },
        { visible: false, selected: false, label: "Measurements" }
    ];
    totalPercent:any=[];
    currentPanelId: any;
    todaydate = new Date();
    toggle_wf_header: boolean = true;
    MaterialCost: any;
    TotalCharges: any;
    TotalExpertiseCost: any;
    Total: any;
    PercentBERThreshold: any;
    @ViewChild(ChargesCreateComponent, { static: false }) chargesCreateComponent: ChargesCreateComponent;
    responseDataForHeader: any;
    tasksData: any = [];
    typeOfForm: string = 'Create';
    itemMasterId: any = 0;
    isHeaderUpdate: boolean = false;
    saveWorkFlowWorkOrderData: any;
    isSpinnerVisible: boolean = false;
    isUpdateAfterCreate = false;
    tempMemo: any;
    disableUpdateButton: boolean = false;
    updateWorkFlowId: string;
    arrayworkScopeIdlist: any[] = [];
    arraycurrencyIdlist: any[] = [];
    arrayCustomerIdlist: any[] = [];
    arrayItemMasterIdlist: any[] = [];
    breadcrumbs: MenuItem[] = [
        { label: 'Work Flow' },
        { label: 'Create Work Flow' }
    ];
    isOnload: any;
    percentBERTh: any;
    currentActiveTab: string; 
    isheadUpdate: any;
    originalworkFLow: any = {};
    materialPercentValue:any;
    expertisePercentValue:any;
    chargesPercentValue:any;
    othersPercentValue:any;
    constructor(private actionService: ActionService,
        private authService: AuthService,
        private router: ActivatedRoute,
        private route: Router,
        public workscopeService: WorkScopeService,
        public currencyService: CurrencyService,
        public itemClassService: ItemClassificationService,
        public unitofmeasureService: UnitOfMeasureService,
        private _workflowService: WorkFlowtService,
        private itemser: ItemMasterService,
        private alertService: AlertService,
        private datePipe: DatePipe,
        private commonService: CommonService) {
    }
    public ngOnDestroy() {
        this._workflowService.listCollection = null
        this.typeOfForm = 'Create';
        if (!this.isUpdateAfterCreate) {
            this._workflowService.enableUpdateMode = false;
            this._workflowService.currentWorkFlowId = null;
        }
    }
    setCurrentPanel(itemName, id): void {
        this.currentPanelId = id;
        itemName = itemName.replace(" ", "_");
        this.workFlow.partNumber = this.sourceWorkFlow.itemMasterId;
        var list = document.getElementsByClassName('pan');
        for (var i = 0; i < list.length; i++) {
            list[i].classList.remove('active');
            list[i].classList.remove('in');
        }
        var elem = document.getElementById('tab_' + itemName);
        if (elem != null) {
            document.getElementById('tab_' + itemName).classList.remove('fade');
            document.getElementById('tab_' + itemName).classList.add('in');
            document.getElementById('tab_' + itemName).classList.add('active');
        }
    }
    SetCurrectTab(taskId, index?): void {
        this.currenttaskId = taskId;
        if (index !== undefined || index !== null) {
            this.selectedSideTabIndex = index;
        }
        this.workFlow = this.workFlowList.filter(x => x.taskId == this.currenttaskId)[0];
        var list = document.getElementsByClassName('actrmv');
        for (var i = 0; i < list.length; i++) {
            list[i].classList.add('active');
        }
        for (var i = 0; i < this.workFlowList.length; i++) {
            document.getElementById('tab_' + this.workFlowList[i].taskId).classList.remove('active');
        }
        document.getElementById('tab_' + taskId).classList.add('active');
        // if (this.workFlow.selectedItems != undefined || this.workFlow.selectedItems.length > 0) {
            this.setSelectedItems(this.workFlow);
        // }
        this.selectedItems = this.workFlow.selectedItems;
    }
    setSelectedItems(workFlow: any): void {
        this.selectedItems = [];
        if (workFlow.charges != undefined && workFlow.charges.length > 0) {
            var chargesItem = this.actionAttributes.filter(x => x.Name == "Charges")[0];
            this.selectedItems.push(chargesItem);
        }
        if (workFlow.directions != undefined && workFlow.directions.length > 0) {
            var directionsItem = this.actionAttributes.filter(x => x.Name == "Directions")[0];
            this.selectedItems.push(directionsItem);
        }
        if (workFlow.equipments != undefined && workFlow.equipments.length > 0) {
            var equipmentItem = this.actionAttributes.filter(x => x.Name == "Tools")[0];
            this.selectedItems.push(equipmentItem);
        }
        if (workFlow.exclusions != undefined && workFlow.exclusions.length > 0) {
            var exclusionsItem = this.actionAttributes.filter(x => x.Name == "Exclusions")[0];
            this.selectedItems.push(exclusionsItem);
        }
        if (workFlow.expertise != undefined && workFlow.expertise.length > 0) {
            var expertiseItem = this.actionAttributes.filter(x => x.Name == "Expertise")[0];
            this.selectedItems.push(expertiseItem);
        }
        if (workFlow.materialList != undefined && workFlow.materialList.length > 0) {
            var materialItem = this.actionAttributes.filter(x => x.Name == "Material List")[0];
            this.selectedItems.push(materialItem);
        }
        if (workFlow.measurements != undefined && workFlow.measurements.length > 0) {
            var measurementsItem = this.actionAttributes.filter(x => x.Name == "Measurements")[0];
            this.selectedItems.push(measurementsItem);
        }
        if (workFlow.publication != undefined && workFlow.publication.length > 0) {
            var publicationItem = this.actionAttributes.filter(x => x.Name == "Publications")[0];
            this.selectedItems.push(publicationItem);
        }
        if (this.selectedItems.length > 0) {
            this.showActionAttribute = true;
        }
        this.workFlow.selectedItems = this.selectedItems;
        if (this.selectedItems != undefined && this.selectedItems.length > 0)
            if (!this.currentPanelId) {
                this.setCurrentPanel(this.selectedItems[0].Name, this.selectedItems[0].Id);
            }
            else {
                for (var i = 0; i < this.workFlow.selectedItems.length; i++) {
                    if (this.workFlow.selectedItems[i].Id == this.currentPanelId) {
                        this.setCurrentPanel(this.selectedItems[i].Name, this.selectedItems[i].Id);
                    } else {
                        this.setCurrentPanel(this.selectedItems[0].Name, this.selectedItems[0].Id);
                        // return;
                    }
                }
            }
            this.isSpinnerVisible=true;
            setTimeout(() => {
                this.isSpinnerVisible=false;
          if(this.selectedItems && this.selectedItems.length !=0){
            this.currentPanelId = this.selectedItems[0].Id;
            this.setCurrentPanel(this.selectedItems[0].Name, this.selectedItems[0].Id)
          }
            }, 500);
    }
    ngOnInit(): void {
        if (this._workflowService.enableUpdateMode) {
            this.typeOfForm = 'Edit';
            this.breadcrumbs = [
                { label: 'Work Flow' },
                { label: 'Edit Work Flow' }
            ];
        }
        if (!this.isWorkOrder) {
            this.sourceWorkFlow.workFlowId = +this.router.snapshot.paramMap.get("id");
        }
        this.isFixedcheck('');
        this.sourceWorkFlow.workflowCreateDate = new Date();
        this.sourceWorkFlow.version = "V-1";
        if (!this.sourceWorkFlow.workFlowId) {
            this.sourceWorkFlow.workOrderNumber = 'Creating';
        } else {
            this._workflowService.enableUpdateMode = true;
            this._workflowService.currentWorkFlowId = this.sourceWorkFlow.workFlowId;
        }
        this.newAction = { Id: "0", Name: "", Description: "", Memo: "", Sequence: 0 };
        this.getAllActions();
        this.getTaksAttributes();
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'Id',
            textField: 'Name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: false
        };
        this.loadWorkFlow();
        this.getAllPercentages();
    }
    masterItemMasterId: any;
    loadWorkFlow() {
        if (this._workflowService.enableUpdateMode == true && !this.UpdateMode) {
            let workFlowId: any = this.isWorkOrder ? this.workFlowId : this._workflowService.currentWorkFlowId;
            this.isSpinnerVisible = true;
            this.actionService.getWorkFlow(workFlowId).subscribe(workFlow => {
                this.sourceWorkFlow = {...workFlow[0]};
                if (workFlow && workFlow[0]) {
                    this.sourceWorkFlow.part = {
                        partId: workFlow[0].itemMasterId,
                        partName: workFlow[0].partNumber
                    }
                }
              
                this.masterItemMasterId = workFlow[0].itemMasterId,
                    this.sourceWorkFlow.percentageOfMaterial = this.sourceWorkFlow.percentageOfMaterial > 0 ? this.sourceWorkFlow.percentageOfMaterial : 0;
                this.sourceWorkFlow.percentageOfExpertise = this.sourceWorkFlow.percentageOfExpertise > 0 ? this.sourceWorkFlow.percentageOfExpertise : 0;
                this.sourceWorkFlow.percentageOfCharges = this.sourceWorkFlow.percentageOfCharges > 0 ? this.sourceWorkFlow.percentageOfCharges : 0;
                this.sourceWorkFlow.percentageOfOthers = this.sourceWorkFlow.percentageOfOthers > 0 ? this.sourceWorkFlow.percentageOfOthers : 0;
                this.sourceWorkFlow.percentageOfTotal = this.sourceWorkFlow.percentageOfTotal > 0 ? this.sourceWorkFlow.percentageOfTotal : 0;
                this.isSpinnerVisible = false;
                this.sourceWorkFlow.workflowCreateDate = new Date(this.sourceWorkFlow.workflowCreateDate);
                this.sourceWorkFlow.workflowExpirationDate = this.sourceWorkFlow.workflowExpirationDate != null ? new Date(this.sourceWorkFlow.workflowExpirationDate) : null;
                this.itemMasterId = this.sourceWorkFlow.itemMasterId;

                if (this.sourceWorkFlow.isFixedAmount == true) {
                    this.isFixedcheck('fixed');
                }
                if (this.sourceWorkFlow.isPercentageOfNew == true) {
                    this.isFixedcheck('percentage');
                }
                if (this.sourceWorkFlow.isPercentageOfReplacement == true) {
                    this.isFixedcheck('percentreplace');
                }
                if (this.sourceWorkFlow.customer != undefined || this.sourceWorkFlow.customer != null) {
                    this.sourceWorkFlow.customerName = this.sourceWorkFlow.customer.name;
                    this.sourceWorkFlow.customerCode = this.sourceWorkFlow.customer.customerCode;
                }
                else {
                    this.sourceWorkFlow.customerName = "";
                    this.sourceWorkFlow.customerCode = "";
                }
                this.sourceWorkFlow.customerName={'customerId': workFlow[0].customerId,'customerName':workFlow[0].customerName};
               if (this.sourceWorkFlow.costOfNew && this.sourceWorkFlow.percentageOfNew) {
                    this.onPercentOfNew(this.sourceWorkFlow.costOfNew, this.sourceWorkFlow.percentageOfNew);
                }
                if (this.sourceWorkFlow.costOfReplacement && this.sourceWorkFlow.percentageOfReplacement) {
                    this.onPercentOfReplcaement(this.sourceWorkFlow.costOfReplacement, this.sourceWorkFlow.percentageOfReplacement);
                }
                this.updateWorkFlowId = this.sourceWorkFlow.workflowId;
                this.UpdateMode = true;
                this.disableUpdateButton = true;
                this.arrayItemMasterIdlist.push(this.sourceWorkFlow.itemMasterId);
                this.loadChangePartItems('', true);
                this.loapartItems('', true, this.sourceWorkFlow.itemMasterId);
                this.loadCurrencyData();
                this.loadWorkScopedata();
                this.loadcustomerData();
                this.updateMode(workFlow);
                this.isOnload = true;
                this.calculateTotalWorkFlowCost(true)
            }, error => {
                this.isSpinnerVisible = false;
            });
        } else {
            this.sourceWorkFlow.workScopeId = 0;
            this.sourceWorkFlow.currencyId = 0;
            this.sourceWorkFlow.percentageOfMaterial = 0;
            this.sourceWorkFlow.percentageOfExpertise = 0;
            this.sourceWorkFlow.percentageOfCharges = 0;
            this.sourceWorkFlow.percentageOfOthers = 0;
            this.sourceWorkFlow.percentageOfTotal = 0;
            this.currenttaskId = "0";
            this.loadCurrencyData();
            this.loadWorkScopedata();
        }
    }
    getTaksAttributes() {
        this.isSpinnerVisible = true;
        this.actionService.getActionAttributes().subscribe(
            actionAttributes => {
                this.isSpinnerVisible = false;
                actionAttributes = actionAttributes.filter(x => x.isActive && x)
                this.actionAttributes = [];
                for (let attr of actionAttributes) {
                    if (this.isQuote && (attr.description == 'Material List' || attr.description == 'Charges' || attr.description == 'Exclusions' || attr.description == 'Expertise')) {
                        this.actionAttributes.push({ Id: attr.taskAttributeId, Name: attr.description, Sequence: attr.taskAttributeId });
                    }
                    else if (!this.isQuote) {
                        this.actionAttributes.push({ Id: attr.taskAttributeId, Name: attr.description, Sequence: attr.taskAttributeId });
                    }
                }
                this.actionAttributes = this.actionAttributes.sort((a, b) => a.Name.localeCompare(b.Name, 'es', { sensitivity: 'base' }))
            }, error => {
                this.isSpinnerVisible = false;
            });
    }
    getAllActions(): void {
        this.isSpinnerVisible = true;
        this.actionService.getActions().subscribe(
            actions1 => {
                this.isSpinnerVisible = false;
                this.actions = [];
                for (let attr of actions1) {
                    this.actions.push({ Id: attr.taskId, Name: attr.description, Description: "", Memo: "", Sequence: attr.sequence })
                }
                this.actions = this.actions.sort((a, b) => a.Name.localeCompare(b.Name, 'es', { sensitivity: 'base' }))
            }, error => {
                this.isSpinnerVisible = false;
            });
    }
    updateMode(workFlow): void {
        this.workFlowList = [];
        var ids = [];
        var taskIds = [];
        if (workFlow[0].charges != undefined) {

            taskIds = workFlow[0].charges.map(item => item.taskId)
                .filter((value, index, self) => self.indexOf(value) === index);
        }
        if (workFlow[0].directions != undefined) {
            ids = workFlow[0].directions.map(item => item.taskId)
                .filter((value, index, self) => self.indexOf(value) === index);
        }
        if (workFlow[0].equipments != undefined) {
            taskIds = taskIds.concat(ids);
            ids = workFlow[0].equipments.map(item => item.taskId)
                .filter((value, index, self) => self.indexOf(value) === index);
        }
        if (workFlow[0].exclusions != undefined) {
            taskIds = taskIds.concat(ids);
            ids = workFlow[0].exclusions.map(item => item.taskId)
                .filter((value, index, self) => self.indexOf(value) === index);
        }
        if (workFlow[0].expertise != undefined) {
            taskIds = taskIds.concat(ids);
            ids = workFlow[0].expertise.map(item => item.taskId)
                .filter((value, index, self) => self.indexOf(value) === index);
        }
        if (workFlow[0].materialList != undefined) {
            taskIds = taskIds.concat(ids);
            ids = workFlow[0].materialList.map(item => item.taskId)
                .filter((value, index, self) => self.indexOf(value) === index);
        }
        if (workFlow[0].measurements != undefined) {
            taskIds = taskIds.concat(ids);
            ids = workFlow[0].measurements.map(item => item.taskId)
                .filter((value, index, self) => self.indexOf(value) === index);
        }
        if (workFlow[0].publication != undefined) {
            taskIds = taskIds.concat(ids);
            ids = workFlow[0].publication.map(item => item.taskId)
                .filter((value, index, self) => self.indexOf(value) === index);
        }
        taskIds = taskIds.concat(ids);
        taskIds = taskIds.map(item => item).filter((value, index, self) => self.indexOf(value) === index);
        this.currenttaskId = taskIds[0];
        this.workFlowActions = [];
        for (let actId of taskIds) {
            var action = this.actions.filter(x => x.Id == actId)[0];
            this.workFlowActions.push(action);
            let wf = this.GetWorkFlow();
            wf.taskId = action.Id;
            wf.ActionName = action.Name;
            wf.selectedItems = [];
            if (this.UpdateMode) {
                wf.workflowId = this.updateWorkFlowId;
            }
            if (workFlow[0].charges != undefined && workFlow[0].charges.length > 0) {
                var charges = workFlow[0].charges.filter(charge => charge.taskId == action.Id);
                wf.charges = charges;
                wf.qtySummation = wf.charges.reduce((acc, x) => {
                    return acc + parseFloat(x.quantity == undefined || x.quantity === '' ? 0 : x.quantity)
                }, 0);
                wf.extendedCostSummation = wf.charges.reduce((acc, x) => {
                    return acc + parseFloat(x.extendedCost == undefined || x.extendedCost === '' ? 0 : x.extendedCost)
                }, 0);
                wf.totalChargesCost = wf.charges.reduce((acc, x) => {
                    return acc + parseFloat(x.extendedPrice == undefined || x.extendedPrice === '' ? 0 : x.extendedPrice)
                }, 0);
            }
            if (workFlow[0].directions != undefined && workFlow[0].directions.length > 0) {
                var direction = workFlow[0].directions.filter(direction => direction.taskId == action.Id);
                wf.directions = direction;
            }
            if (workFlow[0].equipments != undefined && workFlow[0].equipments.length > 0) {
                var equipment = workFlow[0].equipments.filter(equipment => equipment.taskId == action.Id);
                wf.equipments = equipment;
            }
            if (workFlow[0].exclusions != undefined && workFlow[0].exclusions.length > 0) {
                var exclusion = workFlow[0].exclusions.filter(exclusion => exclusion.taskId == action.Id);
                wf.exclusions = exclusion;
                wf.sumofQty = wf.exclusions.reduce((acc, x) => {
                    return acc + parseFloat(x.quantity == undefined || x.quantity === '' ? 0 : x.quantity)
                }, 0);
                wf.sumofExtendedCost = wf.exclusions.reduce((acc, x) => {
                    return acc + parseFloat(x.extendedCost == undefined || x.extendedCost === '' ? 0 : x.extendedCost)
                }, 0);
            }
            if (workFlow[0].expertise != undefined && workFlow[0].expertise.length > 0) {
                var expertise = workFlow[0].expertise.filter(expertise => expertise.taskId == action.Id);
                wf.expertise = expertise;
                wf.sumofestimatedhrs = wf.expertise.reduce((acc, x) => {
                    return acc + parseFloat(x.estimatedHours === undefined || x.estimatedHours === '' ? 0 : x.estimatedHours)
                }, 0);
                wf.sumofLabourDirectCost = wf.expertise.reduce((acc, x) => {
                    return acc + parseFloat(x.directLaborRate === undefined || x.directLaborRate === '' ? 0 : x.directLaborRate)
                }, 0);
                wf.sumOfOHCost = wf.expertise.reduce((acc, x) => {
                    return acc + parseFloat(x.overheadCost === undefined || x.overheadCost === '' ? 0 : x.overheadCost)
                }, 0);
                wf.sumOfOHCost = parseFloat((wf.sumOfOHCost).toFixed(2));
                wf.totalExpertiseCost = wf.expertise.reduce((acc, x) => {
                    return acc + parseFloat(x.laborOverheadCost === undefined || x.laborOverheadCost === '' ? 0 : x.laborOverheadCost)
                }, 0);
                wf.totalExpertiseCost = parseFloat((wf.totalExpertiseCost).toFixed(2));
            }
            if (workFlow[0].materialList != undefined && workFlow[0].materialList.length > 0) {
                var material = workFlow[0].materialList.filter(material => material.taskId == action.Id);
                wf.materialList = material;
                wf.materialQtySummation = wf.materialList.reduce((acc, x) => {
                    return acc + parseFloat(x.quantity == undefined || x.quantity === '' ? 0 : x.quantity)
                }, 0);
                wf.materialExtendedCostSummation = wf.materialList.reduce((acc, x) => {
                    return acc + parseFloat(x.extendedCost == undefined || x.extendedCost === '' ? 0 : x.extendedCost)
                }, 0);
                wf.totalMaterialCostValue = wf.materialExtendedCostSummation;
                wf.totalMaterialCost = wf.materialList.reduce((acc, x) => {
                    return acc + parseFloat(x.price == undefined || x.price === '' ? 0 : x.price)
                }, 0);
                wf.materialExtendedPriceSummation = wf.materialList.reduce((acc, x) => {
                    return acc + parseFloat(x.extendedPrice == undefined || x.extendedPrice === '' ? 0 : x.extendedPrice)
                }, 0);
            }
            if (workFlow[0].measurements != undefined && workFlow[0].measurements.length > 0) {
                var measurement = workFlow[0].measurements.filter(measurement => measurement.taskId == action.Id);
                wf.measurements = measurement;
            }
            if (workFlow[0].publication != undefined && workFlow[0].publication.length > 0) {
                var publication = workFlow[0].publication.filter(publication => publication.taskId == action.Id);
                wf.publication = publication;
                for (let pub of wf.publication) {

                    // this.actionService.GetPublicationModel(pub.aircraftManufacturer).subscribe(
                    //     model => {
                    //         pub["publicationModels"] = model;
                    //     },
                    //     error => this.errorMessage = <any>error
                    // );
                    for (let dn of pub.workflowPublicationDashNumbers) {
                        dn.dashNumberId = dn.aircraftDashNumberId;
                    }
                }
            }
            this.workFlowList.push(wf);
        }
        this.workFlow = this.workFlowList[0];
        if (this.workFlow != undefined) {
            this.setSelectedItems(this.workFlow);
            this.showMainPage = true;
        }
        setTimeout(() => {
            if (this.selectedItems.length > 0) {
                this.setCurrentPanel(this.selectedItems[0].Name, this.selectedItems[0].Id);
            }
        }, 1000);
        this.calculateTotalWorkFlowCost(false);
       }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }
    get employeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }
    private getAllPercentages(): void {
        this.isSpinnerVisible = true;
        this.commonService.autoSuggestionSmartDropDownList('[Percent]', 'PercentId', 'PercentValue', '', true, 0, 0,this.currentUserMasterCompanyId)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.totalPercent = res.sort((n1,n2) => n1.label - n2.label);
            });
    }
    berDetermination(value, from): any {
        if (from == 'html') {
            setTimeout(() => {
                this.validateCOstflow()
            }, 1000);
        } else {
            this.validateCOstflow()
        }
    }
    onChangeberThresholdAmount() {
        this.sourceWorkFlow.berThresholdAmount = this.sourceWorkFlow.berThresholdAmount ? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.berThresholdAmount, 2) : '0.00';
    }
    validateCOstflow() {
        if (this.sourceWorkFlow.fixedAmount) {
            this.sourceWorkFlow.berThresholdAmount = this.sourceWorkFlow.fixedAmount;
            this.onChangeberThresholdAmount();
        }
        // check on is percentOfNew enable
        if (this.sourceWorkFlow.percentOfNew1) {
            this.sourceWorkFlow.berThresholdAmount = this.sourceWorkFlow.percentOfNew;
            this.onChangeberThresholdAmount();
        }
        // check on is .percentOfReplacement enable
        if (this.sourceWorkFlow.percentOfReplacement) {
            this.sourceWorkFlow.berThresholdAmount = this.sourceWorkFlow.percentOfReplacement;
            this.onChangeberThresholdAmount();
        }
        // 1 and 2 check box 
        if (this.sourceWorkFlow.fixedAmount && this.sourceWorkFlow.percentOfNew) {
            const fixedAmount = this.sourceWorkFlow.fixedAmount.toString().replace(/\,/g, '');
            const percentOfNew = this.sourceWorkFlow.percentOfNew.toString().replace(/\,/g, '');
            this.sourceWorkFlow.berThresholdAmount = Math.min(parseFloat(fixedAmount), parseFloat(percentOfNew));
            this.onChangeberThresholdAmount();
        }
        // 2 and 3  check box 
        if (this.sourceWorkFlow.percentOfNew && this.sourceWorkFlow.percentOfReplacement) {
            const percentOfReplacement = this.sourceWorkFlow.percentOfReplacement.toString().replace(/\,/g, '');
            const percentOfNew = this.sourceWorkFlow.percentOfNew.toString().replace(/\,/g, '');
            this.sourceWorkFlow.berThresholdAmount = Math.min(parseFloat(percentOfNew), parseFloat(percentOfReplacement));
            this.onChangeberThresholdAmount();
        }
        // 1 and 3  check box 
        if (this.sourceWorkFlow.fixedAmount && this.sourceWorkFlow.percentOfReplacement) {
            const percentOfReplacement = this.sourceWorkFlow.percentOfReplacement.toString().replace(/\,/g, '');
            const fixedAmount = this.sourceWorkFlow.fixedAmount.toString().replace(/\,/g, '');
            this.sourceWorkFlow.berThresholdAmount = Math.min(parseFloat(fixedAmount), parseFloat(percentOfReplacement));
            this.onChangeberThresholdAmount();
        }

        //1 and 2 and 3 check box
        if (this.sourceWorkFlow.fixedAmount && this.sourceWorkFlow.percentOfNew && this.sourceWorkFlow.percentOfReplacement) {
            const fixedAmount = this.sourceWorkFlow.fixedAmount.toString().replace(/\,/g, '');
            const percentOfNew = this.sourceWorkFlow.percentOfNew.toString().replace(/\,/g, '');
            const percentOfReplacement = this.sourceWorkFlow.percentOfReplacement.toString().replace(/\,/g, '');
            this.sourceWorkFlow.berThresholdAmount = Math.min(parseFloat(fixedAmount), parseFloat(percentOfNew), parseFloat(percentOfReplacement));
            this.onChangeberThresholdAmount();
        }
        //1 and 2 and 3 check box all uncheck 
        if (!this.sourceWorkFlow.fixedAmount && !this.sourceWorkFlow.percentOfNew && !this.sourceWorkFlow.percentOfReplacement) {
            this.sourceWorkFlow.berThresholdAmount = 0.00;
          }
        this.sourceWorkFlow.fixedAmount = this.sourceWorkFlow.fixedAmount ? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.fixedAmount, 2) : null;
        if (this.sourceWorkFlow.berThresholdAmount > 0) {
            this.sourceWorkFlow.berThresholdAmount = formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.berThresholdAmount, 2);
        }
        this.calculateTotalWorkFlowCost(false)
    }
    public filterpartItems(event) {
        if (event.query !== undefined && event.query !== null) {
            this.loapartItems(event.query);
        }
    }
    loapartItems(strvalue = '', initialCall = false, itemMasterId = 0) {
        if (this.UpdateMode) {
            itemMasterId = this.sourceWorkFlow.changedPartNumberId ? this.sourceWorkFlow.changedPartNumberId : 0;
        }
        if (this.arrayItemMasterIdlist.length == 0 && itemMasterId == 0) {
            this.arrayItemMasterIdlist.push(0);
        }
        else {
            this.arrayItemMasterIdlist.push(itemMasterId);
        }
        this.commonService.getPartnumList(strvalue,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.isSpinnerVisible = false;
            this.partCollection = res.map(x => {
                if (initialCall && this.sourceWorkFlow.partNumber == x.partNumber) {
                    this.sourceWorkFlow.part = {
                        partId: x.itemMasterId,
                        partName: x.partNumber
                    }
                }
                return {
                    ...x,
                    partId: x.itemMasterId,
                    partName: x.partNumber
                }
            });
        }, error => {
            this.isSpinnerVisible = false;
        });
    }
    loadChangePartItems(strvalue = '', initialCall = false) {
        this.isSpinnerVisible = true;
        let changedPartNumberId = 0;
        if (this.UpdateMode && this.sourceWorkFlow) {
            changedPartNumberId = this.sourceWorkFlow.changedPartNumberId ? this.sourceWorkFlow.changedPartNumberId : 0;
        }

        if (this.arrayItemMasterIdlist.length == 0 && changedPartNumberId == 0) {
            this.arrayItemMasterIdlist.push(0);
        }
        else {
            this.arrayItemMasterIdlist.push(changedPartNumberId);
        }

        this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'PartNumber', strvalue, true, 20, this.arrayItemMasterIdlist.join(), this.currentUserMasterCompanyId)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.changedPartCollection = res.map(x => {
                    if (initialCall && this.sourceWorkFlow.changedPartNumberId == x.value) {
                        this.sourceWorkFlow.changedPart = {
                            partId: x.value,
                            partName: x.label
                        }
                    }
                    return {
                        partId: x.value,
                        partName: x.label
                    }

                });
                if (this.sourceWorkFlow.part && this.sourceWorkFlow.part.partId) {

                    this.changedPartCollection = this.partCollection.reduce((part, obj) => {
                        return part.filter(x => x.partId !== this.sourceWorkFlow.part.partId)
                    }, this.partCollection)
                }
            }, error => {
                this.isSpinnerVisible = false;
            })
    }
    public filterChangedPartItems(event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadChangePartItems(event.query);
        }
    }
    public onPartSelect(event) {
        this.isSpinnerVisible = true;
        this.sourceWorkFlow.revisedPartNumber = event.revisedPartNumber
        this.itemser.getItemMasterDetailById(this.sourceWorkFlow.part.partId).subscribe(res => {

            this.isSpinnerVisible = false;
            this.sourceWorkFlow.itemMasterId = res[0].itemMasterId;
            this.sourceWorkFlow.partNumber = res[0].partNumber;
            this.sourceWorkFlow.partNumberDescription = res[0].partDescription;
            this.sourceWorkFlow.itemGroup = res[0].itemGroup;

            if (this.UpdateMode) {
                this.disableUpdateButton = false;
            }
            if (this.workFlow != undefined) {
                this.workFlow.partNumber = this.sourceWorkFlow.part.partId;
            }
            if (this.sourceWorkFlow.changedPart != undefined && this.sourceWorkFlow.part.partId == this.sourceWorkFlow.changedPart.partId) {
                this.sourceWorkFlow.changedPart = undefined;
                this.sourceWorkFlow.changedPartNumberId = '';
                this.sourceWorkFlow.changedPartNumber = '';
                this.sourceWorkFlow.changedPartNumberDescription = '';

            }
            this.itemMasterId = this.sourceWorkFlow.itemMasterId;

        }, error => {
            this.isSpinnerVisible = false;
        });

    }
    checkEnableUpdate() {
        if (this.UpdateMode) {
            this.disableUpdateButton = false;
        }
    }
    public onChangedPartSelect(event) {

        this.isSpinnerVisible = true;
        this.itemser.getItemMasterDetailById(this.sourceWorkFlow.changedPart.partId).subscribe(res => {
            this.isSpinnerVisible = false;
            this.sourceWorkFlow.changedPartNumberId = res[0].itemMasterId;
            this.sourceWorkFlow.changedPartNumber = res[0].partNumber;
            this.sourceWorkFlow.changedPartNumberDescription = res[0].partDescription;

            if (this.UpdateMode) {
                this.disableUpdateButton = false;
            }
            if (this.workFlow != undefined) {
                this.workFlow.changedPartNumber = this.sourceWorkFlow.changedPart.partId;
            }
        }, error => {
            this.isSpinnerVisible = false;
        });

    }
    public isCalculatedBERThreshold(event) {
        if (event == 'calculate') {
            this.isCalculate = true;
            this.isFlat = false;
        } if (event == 'flat') {
            this.isCalculate = false;
            this.isFlat = true;
        }
    }
    isFixedcheck(event) {

        if (this.UpdateMode) {
            this.disableUpdateButton = false;
        }
        if (event == 'fixed') {
            this.isFixed = true;
            this.sourceWorkFlow.isFixedAmount = true;
        }
        if (event == 'percentage') {
            this.ispercent = true;
            this.sourceWorkFlow.isPercentageofNew = true;
               this.sourceWorkFlow.percentageOfNew = this.sourceWorkFlow.percentageOfNew ? this.sourceWorkFlow.percentageOfNew :-1;
        }
        if (event == 'percentreplace') {
            this.sourceWorkFlow.percentageOfReplacement= this.sourceWorkFlow.percentageOfReplacement? this.sourceWorkFlow.percentageOfReplacement:-1;
            this.percentreplcae = true;
            this.sourceWorkFlow.isPercentageOfReplacement = true;
        }
    }
    isFixedUnchecked(e) {
        if (!e.target.checked) {
            this.isFixed = false;
            this.sourceWorkFlow.isFixedAmount = false;
            this.sourceWorkFlow.fixedAmount = undefined

        }
    }
    isPercentageUnchecked(e) {
        if (!e.target.checked) {
            this.ispercent = false;
            this.sourceWorkFlow.isPercentageofNew = false;
             this.sourceWorkFlow.percentOfNew = undefined
            this.sourceWorkFlow.percentageOfNew = this.sourceWorkFlow.percentageOfNew ? this.sourceWorkFlow.percentageOfNew :-1;
            this.sourceWorkFlow.costOfNew = '';
        }
    }
    isPercentreplcaeUnchecked(e) {
        if (!e.target.checked) {
            this.percentreplcae = false;
            this.sourceWorkFlow.percentreplcae = false;
            this.sourceWorkFlow.percentOfReplacement = '';
            this.sourceWorkFlow.costOfReplacement = '';
            this.sourceWorkFlow.percentageOfReplacement = -1;
        }
    }
    private loadWorkScopedata() {
        let workScopeId = this.sourceWorkFlow.workScopeId ? this.sourceWorkFlow.workScopeId : '0';
        this.arrayworkScopeIdlist.push(workScopeId);

        this.commonService.autoSuggestionSmartDropDownList('WorkScope', 'WorkScopeId', 'WorkScopeCode', '', true, 100, this.arrayworkScopeIdlist.join(), this.currentUserMasterCompanyId)
            .subscribe(res => {
                this.worksScopeCollection = res.map(x => {
                    return {
                        ...x,
                        workScopeId: x.value,
                        description: x.label
                    }
                });
            }, error => {
                this.isSpinnerVisible = false;
            });
    }
    private loadCurrencyData() {
        let currencyId = this.sourceWorkFlow.currencyId ? this.sourceWorkFlow.currencyId : '0';
        if (this.arraycurrencyIdlist.length == 0 && currencyId == 0) {
            this.arraycurrencyIdlist.push(0);
        }
        else {
            this.arraycurrencyIdlist.push(currencyId);
        }
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', '', true, 0, this.arraycurrencyIdlist.join(), this.currentUserMasterCompanyId)
            .subscribe(currencydata => {
                this.allCurrencyData = currencydata.map(x => {
                    return {
                        ...x,
                        currencyId: x.value,
                        code: x.label
                    }
                });
            }, error => {
                this.isSpinnerVisible = false;
            });
    }
    onCustomerNameselected(event) {
        if (this.UpdateMode) {
            this.disableUpdateButton = false;
        }
        for (let i = 0; i < this.customerNamecoll.length; i++) {
            if (event.customerName == this.customerNamecoll[i][0].name) {

                this.sourceWorkFlow.customerId = this.customerNamecoll[i][0].customerId;
                this.sourceWorkFlow.customerCode = this.customerNamecoll[i][0].customerCode;
            }

        }
    }
    filterNames(event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadcustomerData(event.query);
        }
    }
    private loadcustomerData(query = '') {
        let customerId = 0;
        if (this.updateMode) {
            customerId = this.sourceWorkFlow.customerId ? this.sourceWorkFlow.customerId : 0;
        }

        if (this.arrayCustomerIdlist.length == 0 && customerId == 0) {
            this.arrayCustomerIdlist.push(0);
        }
        else {
            this.arrayCustomerIdlist.push(customerId);
        }

        this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', query, true, 20, this.arrayCustomerIdlist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.customerNames = res.map(x => {
                this.isSpinnerVisible = false;
                // if (this.sourceWorkFlow.customerId == x.value) {
                //     this.sourceWorkFlow.customerName = {
                //         customerId: x.value,
                //         customerName: x.label
                //     }
                // }
                return {
                    customerId: x.value,
                    customerName: x.label
                }
            }, error => {
                this.isSpinnerVisible = false;
            });

        })
    }
    clearautoCompleteInput(data){
        data.customerName='';
        data.customerId=0;
    }
    getSelectedWorkflowActions() {
        if (this.isWorkFlowEdit) {
            this.isSpinnerVisible = true;
            this._workflowService.getWorkflowActionAttributes(this.selectedWorkflow["workflowId"]).subscribe(data => {
                this.isSpinnerVisible = false;
                if (data && data[0].length > 0) {
                    this.workflowActions = data[0];
                    this.addedtaskIds = this.workflowActions.map(action => action["taskId"]);
                }
            }, error => {
                this.isSpinnerVisible = false;
            });
        }
        // this.workflowActions = [
        //     { workflowId: "", taskId: 2, workflowActionAttributeIds: "11,12,13" },
        //     { workflowId: "", taskId: 3, workflowActionAttributeIds: "14,15,16" },
        //     { workflowId: "", taskId: 4, workflowActionAttributeIds: "16,17,36" }
        // ];
        // this.addedtaskIds = [2, 3, 4];
        // select First Action
        this.displaySelectedAction(this.workflowActions[0]);
    } 
    onActionValueChange(selectedvalue) {
        if (Number(selectedvalue.target.value) > 0) {
            this.selectedActionAttributes = [];
            let indx = this.addedtaskIds.indexOf(Number(selectedvalue.target.value));
            if (indx >= 0)
                this.selectedActionAttributes = this.workflowActions[indx].workflowActionAttributeIds.split(",");
        } else {
            this.selectedActionAttributes = [];
        }
    }
    onActionSelect(action) {
        let selAction = this.workflowActions.find(obj => obj.taskId == action.taskId);
        if (selAction)
            this.displaySelectedAction(selAction);
    }
    displaySelectedAction(selAction, loadAttrData = false) {
        //Display Action Label
        let action = this.actionsDD.find(action => action["taskId"] == selAction["taskId"]);
        if (this.selectedAction != action) {
            this.selectedAction = action;
        }

        //Hide all attribute tabs
        this.actionAttributeTabs.forEach(attr => { attr.visible = false; attr.selected = false; });
        //Display Selected Attribute Tabs
        selAction["workflowActionAttributeIds"].split(",").forEach(attr_id => {
            this.actionAttributeTabs.forEach(attr => {
                if (attr["value"] == attr_id)
                    attr.visible = true;
            });
        });
        let selAttr = this.actionAttributeTabs.find(attr => attr.visible);
        if (selAttr) selAttr.selected = true;
        //document.getElementById('tab_'+ )
        if (loadAttrData) {
            if (this.isWorkFlowEdit) {

            } else {

            }
        }
    }
    addActionAttributes() {
        if (this.actionValue && this.actionValue != "" && this.selectedActionAttributes && this.selectedActionAttributes.length > 0) {
            let currAction = { workflowId: "", taskId: Number(this.actionValue), workflowActionAttributeIds: this.selectedActionAttributes.join(",") }
            let selAction = this.workflowActions.find(obj => obj.taskId == this.actionValue)
            if (selAction) {

                selAction["workflowActionAttributeIds"] = currAction["workflowActionAttributeIds"]
            }
            else {
                this.workflowActions.push(currAction);
                this.addedtaskIds.push(Number(this.actionValue));
                selAction = currAction;
            }
            this.displaySelectedAction(selAction);
        }
    }
 
    onMaterialCostChange(value, from) {
        if( this.totalPercent &&  this.totalPercent.length !=0){
        this.totalPercent.forEach(element => {
            if(element.value ==value){
                return this.materialPercentValue=Number(element.label);
            }   
        });
    }
    this.materialPercentValue =this.materialPercentValue ? this.materialPercentValue :0;
        if (from == 'html') {
            this.isOnload == false
            this.calculateTotalWorkFlowCost(true);
        }
        if (this.MaterialCost) {
            // this.materialPercentValue == -1 || this.materialPercentValue == "-1" ? 0 :
            this.materialPercentValue = this.materialPercentValue;
            const MaterialCost = parseFloat(this.MaterialCost.toString().replace(/\,/g, ''));
            const val = ((MaterialCost / 100) * this.materialPercentValue) + MaterialCost;
            this.EstMaterialCost = formatNumberAsGlobalSettingsModule(val, 2);
            this.setTotalCharges()
        } else {
            this.EstMaterialCost = '0.00';
        }
    }

    onExpertiseCostChange(value, from) {
        if( this.totalPercent &&  this.totalPercent.length !=0){
            this.totalPercent.forEach(element => {
                if(element.value ==value){
                    return this.expertisePercentValue=Number(element.label);
                }   
            });
        }
        this.expertisePercentValue =this.expertisePercentValue ? this.expertisePercentValue :0;
        if (from == 'html') {
            this.isOnload == false
            this.calculateTotalWorkFlowCost(true);
        }
        if (this.TotalExpertiseCost) {
            // this.expertisePercentValue == -1 || this.expertisePercentValue == "-1" ? 0 :
            this.expertisePercentValue =  this.expertisePercentValue;
            const TotalExpertiseCost = parseFloat(this.TotalExpertiseCost.toString().replace(/\,/g, ''));
            const val = ((TotalExpertiseCost / 100) * this.expertisePercentValue) + TotalExpertiseCost;
            this.EstTotalExpertiseCost = formatNumberAsGlobalSettingsModule(val, 2);
            this.setTotalCharges()
        } else {
            this.EstTotalExpertiseCost = '0.00';
        }
    }

    onChargesChange(value, from) {
        if( this.totalPercent &&  this.totalPercent.length !=0){
            this.totalPercent.forEach(element => {
                if(element.value ==value){
                    return this.chargesPercentValue=Number(element.label);
                }   
            });
        }
        this.chargesPercentValue =this.chargesPercentValue ? this.chargesPercentValue :0;
        if (from == 'html') {
            this.isOnload == false
            this.calculateTotalWorkFlowCost(true);
        }
        if (this.TotalCharges) {
            // this.chargesPercentValue == -1 || this.chargesPercentValue == "-1" ? 0 :
            this.chargesPercentValue =  this.chargesPercentValue;
            const TotalCharges = parseFloat(this.TotalCharges.toString().replace(/\,/g, ''));
            const val = ((TotalCharges / 100) * this.chargesPercentValue) + TotalCharges;
            this.EstTotalCharges = formatNumberAsGlobalSettingsModule(val, 2);
            this.setTotalCharges()
        } else {
            this.EstTotalCharges = '0.00';
        }
    }
 
    onOtherChange(value, from) {
        if( this.totalPercent &&  this.totalPercent.length !=0){
            this.totalPercent.forEach(element => {
                if(element.value ==value){
                    return this.othersPercentValue=Number(element.label);
                }   
            });
        }
        this.othersPercentValue =this.othersPercentValue ? this.othersPercentValue :0;
        if (from == 'html') {
            this.isOnload == false
            this.calculateTotalWorkFlowCost(true);
        }
        if (this.sourceWorkFlow.otherCost) {
            // this.othersPercentValue == -1 || this.othersPercentValue == "-1" ? 0 : 
            this.othersPercentValue = this.othersPercentValue;
            const otherCost = parseFloat(this.sourceWorkFlow.otherCost.toString().replace(/\,/g, ''));
            const val = ((otherCost / 100) * this.othersPercentValue) + otherCost;
            this.EstTotalOthers = formatNumberAsGlobalSettingsModule(val, 2);
            this.setTotalCharges()
        } else {
            this.EstTotalOthers = '0.00';
        }
    }
    onChangeOtherCost() {
        if (this.sourceWorkFlow.otherCost <= 0) {
            this.sourceWorkFlow.percentageOfOthers =0;
            //  -1;
        }
        if (this.UpdateMode) {
            this.disableUpdateButton = false;
        }
        this.MaterialCost = this.MaterialCost ? formatNumberAsGlobalSettingsModule(this.MaterialCost, 2) : '0.00';
        this.TotalCharges = this.TotalCharges ? formatNumberAsGlobalSettingsModule(this.TotalCharges, 2) : '0.00';
        this.TotalExpertiseCost = this.TotalExpertiseCost ? formatNumberAsGlobalSettingsModule(this.TotalExpertiseCost, 2) : '0.00';
        this.sourceWorkFlow.otherCost = this.sourceWorkFlow.otherCost ? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.otherCost, 2) : '0.00';
        const materialCost = parseFloat(this.MaterialCost.toString().replace(/\,/g, ''));
        const totalCharges = parseFloat(this.TotalCharges.toString().replace(/\,/g, ''));
        const totalExpertiseCost = parseFloat(this.TotalExpertiseCost.toString().replace(/\,/g, ''));
        const otherCost = this.sourceWorkFlow.otherCost ? parseFloat(this.sourceWorkFlow.otherCost.toString().replace(/\,/g, '')) : 0.00;
        const total = materialCost + totalCharges + totalExpertiseCost + otherCost;
        this.Total = formatNumberAsGlobalSettingsModule(total, 2);
        const val = ((otherCost / 100) * this.sourceWorkFlow.percentageOfCharges) + otherCost;
        this.EstTotalOthers = formatNumberAsGlobalSettingsModule(val, 2);
        this.sourceWorkFlow.otherCost = this.sourceWorkFlow.otherCost ? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.otherCost, 2) : null;
        this.setTotalCharges();

    }
    onTotalChange(percentValue, from) {
        this.TotalEst = '0.00';
        if (this.Total > 0) {
            const Total = parseFloat(this.Total.toString().replace(/\,/g, ''));
            const val = ((Total / 100) * percentValue) + Total;
            this.TotalEst = formatNumberAsGlobalSettingsModule(val, 2);
        } else {
            this.TotalEst = '0.00';
        }
    }
    setTotalCharges() { 
        const EstMaterialCost = parseFloat(this.EstMaterialCost.toString().replace(/\,/g, ''));
        const EstTotalExpertiseCost = parseFloat(this.EstTotalExpertiseCost.toString().replace(/\,/g, ''));
        const EstTotalCharges = parseFloat(this.EstTotalCharges.toString().replace(/\,/g, ''));
        const EstTotalOthers = parseFloat(this.EstTotalOthers.toString().replace(/\,/g, ''));
        const total = EstMaterialCost + EstTotalExpertiseCost + EstTotalCharges + EstTotalOthers;
        this.TotalEst = formatNumberAsGlobalSettingsModule(total, 2);

    setTimeout(() => {
        const totlapercentOriginal = ((parseFloat(this.TotalEst.toString().replace(/\,/g, '')) - parseFloat(this.Total.toString().replace(/\,/g, ''))) / parseFloat(this.Total.toString().replace(/\,/g, ''))) * 100;

        const totlapercent=totlapercentOriginal ? totlapercentOriginal :0;
        this.sourceWorkFlow.percentageOfTotal = totlapercent;
        this.sourceWorkFlow.totPer = (totlapercent > 0 ? formatNumberAsGlobalSettingsModule(totlapercent, 2) : '0.00') + '%';
   if(this.sourceWorkFlow.berThresholdAmount){
    const berThAmt = parseFloat(this.sourceWorkFlow.berThresholdAmount.toString().replace(/\,/g, ''));
    let percentageofBerThreshold: any = (parseFloat(this.TotalEst.toString().replace(/\,/g, '')) / berThAmt) * 100;
    this.PercentBERThreshold = parseFloat(percentageofBerThreshold).toFixed(2);
    this.percentBERTh = (this.PercentBERThreshold ? formatNumberAsGlobalSettingsModule(this.PercentBERThreshold, 2) : '0.00') + '%';

   }
        }, 1000);
    }
    calculateTotalWorkFlowCost(isDisplayErrorMesage: boolean): any {
        if (this.sourceWorkFlow.berThresholdAmount == undefined || this.sourceWorkFlow.berThresholdAmount == 0) {
            this.sourceWorkFlow.berThresholdAmount = 0;
            this.onChangeberThresholdAmount();
        }
        this.MaterialCost = 0;
        this.TotalCharges = 0;
        this.TotalExpertiseCost = 0;
        if (this.workFlowList != undefined && this.workFlowList.length > 0) {
            for (let wf of this.workFlowList) {
                this.MaterialCost += (wf.totalMaterialCostValue != undefined && wf.totalMaterialCostValue != "") ? parseFloat(wf.totalMaterialCostValue.toString().replace(/\,/g, '')) : 0;
                this.TotalCharges += (wf.extendedCostSummation != undefined && wf.extendedCostSummation != "") ? parseFloat(wf.extendedCostSummation.toString().replace(/\,/g, '')) : 0;
                this.TotalExpertiseCost += (wf.totalExpertiseCost != undefined && wf.totalExpertiseCost != "") ? parseFloat(wf.totalExpertiseCost.toString().replace(/\,/g, '')) : 0;
            }
        }
        this.MaterialCost = this.MaterialCost ? formatNumberAsGlobalSettingsModule(this.MaterialCost, 2) : '0.00';
        this.TotalCharges = this.TotalCharges ? formatNumberAsGlobalSettingsModule(this.TotalCharges, 2) : '0.00';
        this.TotalExpertiseCost = this.TotalExpertiseCost ? formatNumberAsGlobalSettingsModule(this.TotalExpertiseCost, 2) : '0.00';
        this.sourceWorkFlow.otherCost = this.sourceWorkFlow.otherCost ? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.otherCost, 2) : '0.00';
        const materialCost = parseFloat(this.MaterialCost.toString().replace(/\,/g, ''));
        const totalCharges = parseFloat(this.TotalCharges.toString().replace(/\,/g, ''));
        const totalExpertiseCost = parseFloat(this.TotalExpertiseCost.toString().replace(/\,/g, ''));
        const otherCost = this.sourceWorkFlow.otherCost ? parseFloat(this.sourceWorkFlow.otherCost.toString().replace(/\,/g, '')) : 0.00;
        const total = materialCost + totalCharges + totalExpertiseCost + otherCost;
        this.Total = formatNumberAsGlobalSettingsModule(total, 2);
        if (this.isOnload == true) {
            this.sourceWorkFlow.percentageOfMaterial = this.sourceWorkFlow.percentageOfMaterial == 0 ? 0 : this.sourceWorkFlow.percentageOfMaterial;
            this.sourceWorkFlow.percentageOfExpertise = this.sourceWorkFlow.percentageOfExpertise == 0 ? 0 : this.sourceWorkFlow.percentageOfExpertise;
            this.sourceWorkFlow.percentageOfCharges = this.sourceWorkFlow.percentageOfCharges == 0 ? 0 : this.sourceWorkFlow.percentageOfCharges;
            this.sourceWorkFlow.percentageOfOthers = this.sourceWorkFlow.percentageOfOthers == 0 ? 0 : this.sourceWorkFlow.percentageOfOthers
            this.onMaterialCostChange(this.sourceWorkFlow.percentageOfMaterial, 'onload');
            this.onExpertiseCostChange(this.sourceWorkFlow.percentageOfExpertise, 'onload');
            this.onChargesChange(this.sourceWorkFlow.percentageOfCharges, 'onload');
            this.onOtherChange(this.sourceWorkFlow.percentageOfOthers, 'onload');
        }
        const berThAmt = parseFloat(this.sourceWorkFlow.berThresholdAmount.toString().replace(/\,/g, ''));
        const maxValue = Math.max(0, total, berThAmt);
        const minValue = Math.min(total, berThAmt) !== -Infinity ? Math.min(total, berThAmt) : 0;
        let percentageofBerThreshold: any = (minValue) / (maxValue / 100);
        this.PercentBERThreshold = parseFloat(percentageofBerThreshold).toFixed(2);
        // this.percentBERTh = (this.PercentBERThreshold ? formatNumberAsGlobalSettingsModule(this.PercentBERThreshold, 2) : '0.00') + '%';
        if (!this.isOnload) {
            if (this.Total > berThAmt && isDisplayErrorMesage && (this.sourceWorkFlow.isFixedAmount == true || this.sourceWorkFlow.isPercentageOfNew == true || this.sourceWorkFlow.percentageOfReplacement == true)) {
                this.alertService.showMessage(this.title, 'Work Flow total cost is exceeding the BER Threshold Amount', MessageSeverity.info);
                return false;
            }
            if (this.Total > berThAmt && (this.sourceWorkFlow.isFixedAmount == true || this.sourceWorkFlow.isPercentageOfNew == true || this.sourceWorkFlow.percentageOfReplacement == true)) {
                return false;
            }
            return true;
        }
    }
    newCostPercentValue:any;
    onPercentOfNew(myValue, pValue = 0) {
        if( this.totalPercent &&  this.totalPercent.length !=0){
      if(pValue >0){
        this.totalPercent.forEach(element => {
            if(element.value ==pValue){
               this.newCostPercentValue=Number(element.label);
               return ;
            }   
        });
      }
        }
        this.newCostPercentValue= this.newCostPercentValue  ? this.newCostPercentValue : 0
        this.sourceWorkFlow.costOfNew = this.sourceWorkFlow.costOfNew ? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.costOfNew, 2) : null;
        this.sourceWorkFlow.percentOfNew = '';
        if (myValue) {
            myValue = parseFloat(myValue.toString().replace(/\,/g, ''));
            const val = ((myValue / 100) * this.newCostPercentValue)
            this.sourceWorkFlow.percentOfNew = formatNumberAsGlobalSettingsModule(val, 2);
        } else {
            this.sourceWorkFlow.percentOfNew = 0;
        }
        this.berDetermination(0, 'onload');
    }
    replacePercentValue:any;
    onPercentOfReplcaement(myValue, pValue = 0) {
        if( this.totalPercent &&  this.totalPercent.length !=0){
            if(pValue >0){
            this.totalPercent.forEach(element => {
                if(element.value ==pValue){
                   this.replacePercentValue=Number(element.label);
                   return;
                }   
            });
        }
        }
        this.replacePercentValue= this.replacePercentValue ? this.replacePercentValue :0
        this.sourceWorkFlow.costOfReplacement = this.sourceWorkFlow.costOfReplacement ? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.costOfReplacement, 2) : null;
        this.sourceWorkFlow.percentOfReplacement = '';
        if (myValue) {
            myValue = parseFloat(myValue.toString().replace(/\,/g, ''));
            let afterpercent = ((myValue / 100) * this.replacePercentValue)
            this.sourceWorkFlow.percentOfReplacement = formatNumberAsGlobalSettingsModule(afterpercent, 2);

        } else {
            this.sourceWorkFlow.percentOfReplacement = 0;
        }
        this.berDetermination(0, 'onload');
    }
    getWorkFlowMaterial() {
        this.isSpinnerVisible = true;
        this._workflowService.getWorkFlowMaterial().subscribe(data => {
            this.isSpinnerVisible = false;
            this.workflowMaterails = data;
        }, error => {
            this.isSpinnerVisible = false;
        });

    }
    getWorkFlowChargeList() {
        this.isSpinnerVisible = true;
        this._workflowService.getChargeList().subscribe(data => {
            this.isSpinnerVisible = false;
            this.workflowCharges = data;
        }, error => {
            this.isSpinnerVisible = false;
        });

    }
    getWorkFlowEquipment() {
        this.isSpinnerVisible = true;
        this._workflowService.getWorkFlowEquipmentList().subscribe(data => {
            this.isSpinnerVisible = false;
            this.workflowEquipment = data;
        }, error => {
            this.isSpinnerVisible = false;
        });

    }
    getWorkFlowExpertise() {
        this.isSpinnerVisible = true;
        this._workflowService.getWorkflowExpertise().subscribe(data => {
            this.isSpinnerVisible = false;
            this.workflowExpertise = data;
        }, error => {
            this.isSpinnerVisible = false;
        });
    }

    AddPage() {
        this.route.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-stock');
    }
    AddPageCustomer() {
        this.route.navigateByUrl('/customersmodule/customerpages/app-customer-general-information');
    }
    getDashNumbers(publication): void {
    }
    AddActionAttribute(): void {
        this.selectedSideTabIndex = 0;
        if (this.selectedItems.length > 0) {
            if (this.workFlowList != undefined && this.workFlowList.length > 0) {
                var currentWorkFlow = this.GetWorkFlow();
                var isWorkFlowExist = false;
                for (var i = 0; i < this.workFlowList.length; i++) {
                    if (this.workFlowList[i].taskId == currentWorkFlow.taskId) {
                        isWorkFlowExist = true;
                        for (var j = 0; j < this.selectedItems.length; j++) {
                            if (this.selectedItems[j].Name == 'Charges' && (this.workFlowList[i].charges == undefined || (this.workFlowList[i].charges != undefined && this.workFlowList[i].charges.length == 0))) {
                                var charge: any[];
                                charge = this.GetCharges();
                                if (this.UpdateMode) {
                                    charge[0].taskId = this.currenttaskId;
                                    charge[0].workflowId = this.updateWorkFlowId;
                                }
                                this.workFlowList[i].qtySummation = 0;
                                this.workFlowList[i].extendedCostSummation = 0;
                                this.workFlowList[i].totalChargesCost = 0;
                                this.workFlowList[i].charges = charge;
                            }
                            if (this.selectedItems[j].Name == 'Directions' && (this.workFlowList[i].directions == undefined || (this.workFlowList[i].directions != undefined && this.workFlowList[i].directions.length == 0))) {
                                var direction: any[];
                                direction = this.GetDirections();
                                if (this.UpdateMode) {
                                    direction[0].taskId = this.currenttaskId;
                                    direction[0].workflowId = this.updateWorkFlowId;
                                }
                                this.workFlowList[i].directions = direction;
                            }
                            if (this.selectedItems[j].Name == 'Tools' && (this.workFlowList[i].equipments == undefined || (this.workFlowList[i].equipments != undefined && this.workFlowList[i].equipments.length == 0))) {
                                var equipment: any[];
                                equipment = this.GetEquipmentList();
                                if (this.UpdateMode) {
                                    equipment[0].taskId = this.currenttaskId;
                                    equipment[0].workflowId = this.updateWorkFlowId;
                                    equipment[0].taskId = this.currenttaskId;
                                }
                                this.workFlowList[i].equipments = equipment;
                            }
                            if (this.selectedItems[j].Name == 'Expertise' && (this.workFlowList[i].expertise == undefined || (this.workFlowList[i].expertise != undefined && this.workFlowList[i].expertise.length == 0))) {
                                var expertise: any[];
                                expertise = this.GetExpertise();
                                if (this.UpdateMode) {
                                    expertise[0].taskId = this.currenttaskId;
                                    expertise[0].workflowId = this.updateWorkFlowId;
                                }
                                this.workFlowList[i].sumofestimatedhrs = 0;
                                this.workFlowList[i].sumofLabourDirectCost = 0;
                                this.workFlowList[i].sumOfOHCost = 0;
                                this.workFlowList[i].totalExpertiseCost = 0;
                                this.workFlowList[i].expertise = expertise;
                            }
                            if (this.selectedItems[j].Name == 'Material List' && (this.workFlowList[i].materialList == undefined || (this.workFlowList[i].materialList != undefined && this.workFlowList[i].materialList.length == 0))) {
                                var material: any[];
                                material = this.GetMaterialList();
                                if (this.UpdateMode) {
                                    material[0].taskId = this.currenttaskId;
                                    material[0].workflowId = this.updateWorkFlowId;
                                    material[0].createdBy = this.userName;
                                    material[0].updatedBy = this.userName;
                                }
                                this.workFlowList[i].materialQtySummation = 0;
                                this.workFlowList[i].materialExtendedCostSummation = 0;
                                this.workFlowList[i].totalMaterialCost = 0;
                                this.workFlowList[i].materialList = material;
                            }
                            if (this.selectedItems[j].Name == 'Publications' && (this.workFlowList[i].publication == undefined || (this.workFlowList[i].publication != undefined && this.workFlowList[i].publication.length == 0))) {
                                var publication: any[];
                                publication = this.GetPublication();
                                if (this.UpdateMode) {
                                    publication[0].taskId = this.currenttaskId;
                                    publication[0].workflowId = this.updateWorkFlowId;
                                    publication[0].createdBy = this.userName;
                                    publication[0].updatedBy = this.userName;
                                }
                                this.workFlowList[i].publication = publication;
                            }
                            if (this.selectedItems[j].Name == 'Exclusions' && (this.workFlowList[i].exclusions == undefined || (this.workFlowList[i].exclusions != undefined && this.workFlowList[i].exclusions.length == 0))) {
                                var exclusion: any[];
                                exclusion = this.GetExclusions();
                                if (this.UpdateMode) {
                                    exclusion[0].taskId = this.currenttaskId;
                                    exclusion[0].workflowId = this.updateWorkFlowId;
                                }
                                this.workFlowList[i].sumofQty = 0;
                                this.workFlowList[i].sumofExtendedCost = 0;
                                this.workFlowList[i].exclusions = exclusion;
                            }
                            if (this.selectedItems[j].Name == 'Measurements' && (this.workFlowList[i].measurements == undefined || (this.workFlowList[i].measurements != undefined && this.workFlowList[i].measurements.length == 0))) {
                                var measurement: any[];
                                measurement = this.GetMeasurements();
                                if (this.UpdateMode) {
                                    measurement[0].taskId = this.currenttaskId;
                                    measurement[0].workflowId = this.updateWorkFlowId;
                                }
                                this.workFlowList[i].measurements = measurement;
                            }
                        }
                        this.workFlowList[i].selectedItems = this.selectedItems;
                        this.workFlow = this.workFlowList[i];
                    }
                }
                if (!isWorkFlowExist) {
                    for (var i = 0; i < this.selectedItems.length; i++) {
                        if (this.selectedItems[i].Name == 'Charges') {
                            var charge: any[];
                            charge = this.GetCharges();
                            if (this.UpdateMode) {
                                charge[0].taskId = this.currenttaskId;
                                charge[0].workflowId = this.updateWorkFlowId;
                            }
                            currentWorkFlow.qtySummation = 0;
                            currentWorkFlow.extendedCostSummation = 0;
                            currentWorkFlow.totalChargesCost = 0;
                            currentWorkFlow.charges = charge;
                        }
                        if (this.selectedItems[i].Name == 'Directions') {
                            var direction: any[];
                            direction = this.GetDirections();
                            if (this.UpdateMode) {
                                direction[0].taskId = this.currenttaskId;
                                direction[0].workflowId = this.updateWorkFlowId;
                            }
                            currentWorkFlow.directions = direction
                        }
                        if (this.selectedItems[i].Name == 'Tools') {
                            var equipment: any[];
                            equipment = this.GetEquipmentList();
                            if (this.UpdateMode) {
                                equipment[0].taskId = this.currenttaskId;
                                equipment[0].workflowId = this.updateWorkFlowId;
                            }
                            currentWorkFlow.equipments = equipment;
                        }
                        if (this.selectedItems[i].Name == 'Expertise') {
                            var expertise: any[];
                            expertise = this.GetExpertise();
                            if (this.UpdateMode) {
                                expertise[0].taskId = this.currenttaskId;
                                expertise[0].workflowId = this.updateWorkFlowId;
                            }
                            currentWorkFlow.sumofestimatedhrs = 0;
                            currentWorkFlow.sumofLabourDirectCost = 0;
                            currentWorkFlow.sumOfOHCost = 0;
                            currentWorkFlow.totalExpertiseCost = 0;
                            currentWorkFlow.expertise = expertise;
                        }
                        if (this.selectedItems[i].Name == 'Material List') {
                            var material: any[];
                            material = this.GetMaterialList();
                            if (this.UpdateMode) {
                                material[0].taskId = this.currenttaskId;
                                material[0].workflowId = this.updateWorkFlowId;
                            }
                            currentWorkFlow.materialQtySummation = 0;
                            currentWorkFlow.materialExtendedCostSummation = 0;
                            currentWorkFlow.totalMaterialCost = 0;
                            currentWorkFlow.materialList = material;
                        }
                        if (this.selectedItems[i].Name == 'Publications') {
                            var publication: any[];
                            publication = this.GetPublication();
                            if (this.UpdateMode) {
                                publication[0].taskId = this.currenttaskId;
                                publication[0].workflowId = this.updateWorkFlowId;
                            }
                            currentWorkFlow.publication = publication;
                        }
                        if (this.selectedItems[i].Name == 'Exclusions') {
                            var exclusion: any[];
                            exclusion = this.GetExclusions();
                            if (this.UpdateMode) {
                                exclusion[0].taskId = this.currenttaskId;
                                exclusion[0].workflowId = this.updateWorkFlowId;
                            }
                            currentWorkFlow.sumofQty = 0;
                            currentWorkFlow.sumofExtendedCost = 0;
                            currentWorkFlow.exclusions = exclusion;
                        }
                        if (this.selectedItems[i].Name == 'Measurements') {
                            var measurement: any[];
                            measurement = this.GetMeasurements();
                            if (this.UpdateMode) {
                                measurement[0].taskId = this.currenttaskId;
                                measurement[0].workflowId = this.updateWorkFlowId;
                            }
                            currentWorkFlow.measurements = measurement;
                        }
                    }
                    currentWorkFlow.selectedItems = this.selectedItems;
                    this.workFlowList.push(currentWorkFlow);
                    this.workFlow = currentWorkFlow;
                }
            }
            else {
                this.workFlowList = [];
                var currentWorkFlow = this.GetWorkFlow();
                currentWorkFlow.selectedItems = this.selectedItems;
                this.workFlowList.push(currentWorkFlow);
                for (var i = 0; i < this.selectedItems.length; i++) {
                    if (this.selectedItems[i].Name == 'Charges') {
                        var charge: any[];
                        charge = this.GetCharges();
                        if (this.UpdateMode) {
                            charge[0].taskId = this.currenttaskId;
                            charge[0].workflowId = this.updateWorkFlowId;
                            charge[0].taskId = this.currenttaskId;
                        }
                        this.workFlowList[0].qtySummation = 0;
                        this.workFlowList[0].extendedCostSummation = 0;
                        this.workFlowList[0].totalChargesCost = 0;
                        this.workFlowList[0].charges = charge;
                    }
                    if (this.selectedItems[i].Name == 'Directions') {
                        var direction: any[];
                        direction = this.GetDirections();
                        if (this.UpdateMode) {
                            direction[0].taskId = this.currenttaskId;
                            direction[0].workflowId = this.updateWorkFlowId;
                            direction[0].taskId = this.currenttaskId;
                        }
                        this.workFlowList[0].directions = direction;
                    }
                    if (this.selectedItems[i].Name == 'Tools') {
                        var equipment: any[];
                        equipment = this.GetEquipmentList();
                        if (this.UpdateMode) {
                            equipment[0].taskId = this.currenttaskId;
                            equipment[0].workflowId = this.updateWorkFlowId;
                            equipment[0].taskId = this.currenttaskId;
                        }
                        this.workFlowList[0].equipments = equipment;
                    }
                    if (this.selectedItems[i].Name == 'Expertise') {
                        var expertise: any[];
                        expertise = this.GetExpertise();
                        if (this.UpdateMode) {
                            expertise[0].taskId = this.currenttaskId;
                            expertise[0].workflowId = this.updateWorkFlowId;
                            expertise[0].taskId = this.currenttaskId;
                        }
                        this.workFlowList[0].sumofestimatedhrs = 0;
                        this.workFlowList[0].sumofLabourDirectCost = 0;
                        this.workFlowList[0].sumOfOHCost = 0;
                        this.workFlowList[0].totalExpertiseCost = 0;
                        this.workFlowList[0].expertise = expertise;
                    }
                    if (this.selectedItems[i].Name == 'Material List') {
                        var material: any[];
                        material = this.GetMaterialList();
                        if (this.UpdateMode) {
                            material[0].taskId = this.currenttaskId;
                            material[0].workflowId = this.updateWorkFlowId;
                            material[0].taskId = this.currenttaskId;
                        }
                        this.workFlowList[0].materialQtySummation = 0;
                        this.workFlowList[0].materialExtendedCostSummation = 0;
                        this.workFlowList[0].totalMaterialCost = 0;
                        this.workFlowList[0].materialList = material;
                    }
                    if (this.selectedItems[i].Name == 'Publications') {
                        var publication: any[];
                        publication = this.GetPublication();
                        if (this.UpdateMode) {
                            publication[0].taskId = this.currenttaskId;
                            publication[0].workflowId = this.updateWorkFlowId;
                            publication[0].taskId = this.currenttaskId;
                        }
                        else {
                            this.workFlowList[0].materialQtySummation = 0;
                            this.workFlowList[0].materialExtendedCostSummation = 0;
                            this.workFlowList[0].totalMaterialCost = 0;
                        }
                        this.workFlowList[0].publication = publication;
                    }
                    if (this.selectedItems[i].Name == 'Exclusions') {
                        var exclusion: any[];
                        exclusion = this.GetExclusions();
                        if (this.UpdateMode) {
                            exclusion[0].taskId = this.currenttaskId;
                            exclusion[0].workflowId = this.updateWorkFlowId;
                            charge[0].taskId = this.currenttaskId;
                        }
                        else {
                            this.workFlowList[0].sumofQty = 0;
                            this.workFlowList[0].sumofExtendedCost = 0;
                        }
                        this.workFlowList[0].exclusions = exclusion;
                    }
                    if (this.selectedItems[i].Name == 'Measurements') {
                        var measurement: any[];
                        measurement = this.GetMeasurements();
                        if (this.UpdateMode) {
                            measurement[0].taskId = this.currenttaskId;
                            measurement[0].workflowId = this.updateWorkFlowId;
                            measurement[0].taskId = this.currenttaskId;
                        }
                        this.workFlowList[0].measurements = measurement;
                    }
                }
                this.workFlow = this.workFlowList[0];
            }
        }
        else {
            var wf = this.workFlowList.filter(x => x.taskId == this.currenttaskId);
            if (wf != undefined && wf.length > 0) {
                wf[0].charges = [];
                wf[0].directions = [];
                wf[0].equipments = [];
                wf[0].exclusions = [];
                wf[0].expertise = [];
                wf[0].materialList = [];
                wf[0].measurements = [];
                wf[0].publication = [];
                wf[0].selectedItems = [];
                this.workFlow = wf;
            }
        }
        this.showMainPage = true;
        if (this.selectedItems.length > 0) {
            setTimeout(() => {
                this.setCurrentPanel(this.selectedItems[0].Name, this.selectedItems[0].Id);
            }, 1000);
        }
        else {
            setTimeout(() => {
                this.setCurrentPanel("", this.currentPanelId);
            }, 1000);
        }
    }
    GetWorkFlow(): any {
        var taskId = this.currenttaskId != undefined ? this.currenttaskId : "0";
        var actionName = "";
        this.actions.forEach(function (value, index) {
            if (value.Id == taskId) {
                actionName = value.Name;
            }
        });

        return {
            workflowId: "0",
            taskId: taskId,
            ActionName: actionName,
            charges: undefined,
            directions: undefined,
            equipments: undefined,
            expertise: undefined,
            materialList: undefined,
            publication: undefined,
            exclusions: undefined,
            measurements: undefined,
            selectedItems: [],
            order: this.workFlowList.length + 1
        };
    }
    openTab(evt, tabId): void {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        document.getElementById(tabId).style.display = "block";
        evt.currentTarget.className += " active";
    }
    GetMeasurements(): any[] {
        var measurement = [{
            workflowMeasurementId: "0",
            itemMasterId: "",
            sequence: "",
            stage: "",
            min: "",
            max: "",
            expected: "",
            diagramURL: "",
            memo: "",
            taskId: "",
            masterCompanyId: '',
            workflowId: "",
            AllowEdit: true,
            isDeleted: false,
        }];
        return measurement;
    }
    GetExclusions(): any[] {
        var exclusion = [{
            workFlowExclusionId: "0",
            itemMasterId: '',
            unitCost: "",
            quantity: "",
            extendedCost: "",
            estimtPercentOccurrance: "",
            memo: "",
            masterCompanyId: '',
            taskId: "",
            workflowId: "",
            AllowEdit: true,
            isDeleted: false,
        }];
        return exclusion;
    }
    GetPublication(): any[] {
        var publication = [{
            id: "0",
            publicationId: "",
            publication: "",
            publicationType: "",
            sequence: "",
            source: "",
            aircraftManufacturer: "",
            model: "",
            location: "",
            revision: "",
            revisionDate: "",
            verifiedBy: "",
            verifiedDate: "",
            status: "",
            image: "",
            taskId: "",
            workflowId: "",
            AllowEdit: true,
            isDeleted: false,
        }];
        return publication;
    }
    GetCharges(): any[] {
        var charges = [{
            workflowChargesListId: "0",
            workflowChargeTypeId: "",
            description: "",
            quantity: "",
            unitCost: "",
            extendedCost: "",
            unitPrice: "",
            extendedPrice: "",
            currencyId: "",
            forexRate: "",
            vendorId: "",
            vendorUnitPrice: "",
            masterCompanyId: '',
            taskId: "",
            workflowId: "",
            AllowEdit: true,
            isDeleted: false,

        }];
        return charges;
    }
    GetEquipmentList(): any[] {
        var equipmentList = [{
            workflowEquipmentListId: "0",
            assetId: "",
            assetTypeId: "",
            assetDescription: "",
            quantity: "",
            taskId: "",
            workflowId: "",
            masterCompanyId: '',
            AllowEdit: true,
            isDeleted: false,
        }];
        return equipmentList;
    }
    GetExpertise(): any[] {
        var expertise = [{
            workflowExpertiseListId: "0",
            expertiseTypeId: "",
            estimatedHours: "",
            laborDirectRate: "",
            directLaborRate: "",
            overheadBurden: "",
            overheadCost: "",
            standardRate: '',
            laborOverheadCost: "",
            taskId: "",
            workflowId: "",
            masterCompanyId: '',
            AllowEdit: true,
            isDeleted: false,
        }];

        return expertise;
    }
    GetMaterialList(): any[] {
        var material = [{
            workflowMaterialListId: "0",
            itemMasterId: '',
            conditionCodeId: 0,
            mandatoryOrSupplemental: 'Mandatory',
            itemClassificationId: '',
            quantity: '',
            unitOfMeasureId: 0,
            unitCost: "",
            extendedCost: "",
            price: "",
            extendedPrice: '',
            provisionId: '',
            isDeferred: '',
            memo: "",

            taskId: "",
            workflowId: "",
            masterCompanyId: '',
            createdBy: this.userName,
            updatedBy: this.userName,
            AllowEdit: true,
            isDeleted: false,
        }];

        return material;
    }
    GetDirections(): any[] {
        var directions = [{
            workflowDirectionId: "0",
            action: "",
            description: "",
            sequence: "",
            memo: "",
            taskId: "",
            workflowId: "",
            masterCompanyId: '',
            AllowEdit: true,
            isDeleted: false,

        }];
        return directions;
    }
    onActionChange(): void {
        if (this.currenttaskId == "0" && this.workFlowList.length == 0) {
            this.showActionAttribute = false;
            return;
        }
        if (this.currenttaskId != "0") {
            var currentWF = undefined;
            if (this.workFlowList != undefined) {
                currentWF = this.workFlowList.filter(x => x.taskId == this.currenttaskId);
            }
            this.showActionAttribute = true;
            if (currentWF == undefined || currentWF.length == 0) {
                if (this.workFlowList == undefined) {
                    this.workFlowList = [];
                }
                var currentWorkFlow = this.GetWorkFlow();
                currentWorkFlow.selectedItems = [];
                this.workFlowList.push(currentWorkFlow);
                currentWF = this.workFlowList.filter(x => x.taskId == this.currenttaskId);
            }
            this.workFlow = currentWF[0];
            this.selectedItems = currentWF[0].selectedItems;
            this.tasksData.push(this.workFlow);
        }
    }
    addAction(): void {
        this.isSpinnerVisible = true;
        this.actionService.addAction(this.newAction).subscribe(
            data => {
                this.alertService.showMessage("Workflow", "Task added successfully.", MessageSeverity.success);
                this.getAllActions();
                this.isSpinnerVisible = false;
            }, error => {
                this.isSpinnerVisible = false;
            });
    }
    validateWorkFlowHeader(): boolean {
        if (this.sourceWorkFlow.itemMasterId == undefined || this.sourceWorkFlow.itemMasterId == '') {
            this.alertService.showMessage(this.title, 'Part Number is required', MessageSeverity.error);
            return false;
        }
        if (this.sourceWorkFlow.workScopeId == undefined || this.sourceWorkFlow.workScopeId == '') {
            this.alertService.showMessage(this.title, 'Work Scope is required', MessageSeverity.error);
            return false;
        }
        if (this.sourceWorkFlow.currencyId == undefined || this.sourceWorkFlow.currencyId == '') {
            this.alertService.showMessage(this.title, 'Currency is required', MessageSeverity.error);
            return false;
        }
        if (this.workFlow != undefined && this.workFlow.materialList != undefined) {
            for (let material of this.workFlow.materialList) {
                if (material.partNumber == this.sourceWorkFlow.partNumber) {
                    this.alertService.showMessage(this.title, 'Material List can not have Master Part Number', MessageSeverity.error);
                    return false;
                }
            }
        }

        return true;
    }
    showVersionUpdate() {
        $('#quoteVer').modal("show");
        this.calculateTotalWorkFlowCost(true)
    }
    resetPage(): void {
        this.selectedItems = [];
        this.workFlowList = [];
        this.currenttaskId = "0";
        this.showMainPage = false;
        this.showActionAttribute = false;
    }
    onDeSelect(item: any) {
        var items = this.selectedItems.filter(x => x.Id != item.Id);
        if (items != undefined && items.length > 0) {
            this.selectedItems = items;
            this.AddActionAttribute();
            this.setCurrentPanel(this.selectedItems[0].Name, this.selectedItems[0].Id);
        }
        else {
            this.selectedItems = [];
            this.AddActionAttribute();
        }
        this.workFlow.selectedItems = this.selectedItems;
        this.resetWorkflowGrid();
    }
    onItemSelect(item: any) {
        this.AddActionAttribute();
    }
    onSelectAll(items: any) {
        this.selectedItems = items;
        this.AddActionAttribute();
        this.setCurrentPanel(this.selectedItems[this.selectedItems.length - 1].Name, this.selectedItems[this.selectedItems.length - 1].Id);
        this.resetWorkflowGrid();
    }
    onDeSelectAll(items: any) {
        this.selectedItems = [];
        this.AddActionAttribute();
        this.workFlow.selectedItems = [];
        this.resetWorkflowGrid();
    }
    taskDeleteConfirmation(confirmDeleteTemplate: any, task: any): void {
    }
    removeTask(workFlow: any): void {
        var index = this.workFlowList.indexOf(workFlow);
        this.workFlowList.splice(index, 1);
        if (index == 0 && this.workFlowList.length == 0) {
            this.currenttaskId = "0";
            this.selectedItems = [];
        }
        else {
            this.workFlow = this.workFlowList[0];
            this.currenttaskId = this.workFlowList[0].taskId;

            this.SetCurrectTab(this.currenttaskId, 0);
            this.setSelectedItems(this.workFlow);
        }
        this.tasksData = this.tasksData.filter(x => {
            if (x.taskId !== workFlow.taskId) {
                return x;
            }
        })
        this.onActionChange();
    }
    dismissModel() {
        this.modal.close();
    }
    private resetWorkflowGrid(): void {
        for (let wf of this.workFlowList) {
            if (wf.taskId == this.currenttaskId) {
                var chargesItem = wf.selectedItems.filter(x => x.Name == "Charges");
                if (chargesItem.length == 0) {
                    wf.charges = [];
                }
                var directionsItem = wf.selectedItems.filter(x => x.Name == "Directions");
                if (directionsItem.length == 0) {
                    wf.directions = [];
                }
                var equipmentItem = wf.selectedItems.filter(x => x.Name == "Tools");
                if (equipmentItem.length == 0) {
                    wf.equipments = [];
                }
                var exclusionItem = wf.selectedItems.filter(x => x.Name == "Exclusions");
                if (exclusionItem.length == 0) {
                    wf.exclusions = [];
                }
                var expertiseItem = wf.selectedItems.filter(x => x.Name == "Expertise");
                if (expertiseItem.length == 0) {
                    wf.expertise = [];
                }
                var materialItem = wf.selectedItems.filter(x => x.Name == "Material List");
                if (materialItem.length == 0) {
                    wf.materialList = [];
                }
                var measurementItem = wf.selectedItems.filter(x => x.Name == "Measurements");
                if (measurementItem.length == 0) {
                    wf.measurements = [];
                }
                var measurementItem = wf.selectedItems.filter(x => x.Name == "Publications");
                if (measurementItem.length == 0) {
                    wf.publication = [];
                }
            }
        }
    }
    saveBuildFromScratchData() {
        this.saveData.emit(this.workFlowList);
    }
    onAddDescription(value) {
        this.tempMemo = "";
        this.tempMemo = this.sourceWorkFlow.memo;
    }
    onSaveDescription() {
        this.sourceWorkFlow.memo = this.tempMemo;
        if (this.UpdateMode) {
            this.disableUpdateButton = false;
        }
        // this.enableUpdateButton = false;
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
    increaseVerConfirmation(isIncrease) {
        $('#quoteVer').modal("hide");
        this.sourceWorkFlow['isVersionIncrease'] = isIncrease;
        if (this.isWorkOrder) {
            this.saveWorkFlowWorkOrderData['isVersionIncrease'] = isIncrease;
            this._workflowService.currentWorkFlowId = this.sourceWorkFlow.workflowId != 0 ? this.sourceWorkFlow.workflowId : this.sourceWorkFlow.existingWorkFlowId
            this.savedWorkFlowWorkOrderData.emit(this.saveWorkFlowWorkOrderData);
        }
        else {
            this.updateWorkFlow();
        }
    }
    addWorkFlow(isHeaderUpdate: boolean): void {
        this.isheadUpdate = isHeaderUpdate;
        this.sourceWorkFlow.workflowId = undefined;
        this.calculateTotalWorkFlowCost(true)
        this.finalCost = parseFloat(this.TotalEst.toString().replace(/\,/g, ''));
        if (!this.validateWorkFlowHeader()) {
            return;
        }
        if (!this.calculateTotalWorkFlowCost(false)) {
            $('#confir').modal("show");
        }
        // if (this.finalCost == 0) {
            this.confirmation();
        // }
    }
    updateWorkFlow(): void {
        this.originalworkFLow = this.workFlow
        if (!this.validateWorkFlowHeader()) {
            this.validateheader = true;
            return;
        }
        this.finalCost = parseFloat(this.TotalEst.toString().replace(/\,/g, ''));
        this.finalThrsh = parseFloat(this.sourceWorkFlow.berThresholdAmount.toString().replace(/\,/g, ''))
        if (!this.calculateTotalWorkFlowCost(false)) {
            $('#quoteVer').modal("hide");
            if (this.finalCost > 0) {
                if ((this.finalCost > this.finalThrsh)) {
                    $('#UpdateConfirm').modal("show");
                }
            }
            if (this.finalCost == 0) {
                this.updateConfirmation();
            }
        }
        if (this.finalCost < this.finalThrsh) {
            if (this.finalCost > 0) {
                this.updateConfirmation();
            }
        }
    }
    dataCancel() {
        $('#confir').modal("hide");
    }
    modifyForSaveUpdateApis(): void { 
        if (this.workFlowList != undefined && this.workFlowList.length > 0) {
            this.sourceWorkFlow.charges = [];
            this.sourceWorkFlow.directions = [];
            this.sourceWorkFlow.equipments = [];
            this.sourceWorkFlow.exclusions = [];
            this.sourceWorkFlow.expertise = [];
            this.sourceWorkFlow.materialList = [];
            this.sourceWorkFlow.measurements = [];
            this.sourceWorkFlow.publication = [];
            this.sourceWorkFlow.masterCompanyId = this.currentUserMasterCompanyId;
            this.sourceWorkFlow.createdBy = this.userName;
            this.sourceWorkFlow.updatedBy = this.userName;
            for (let workflow of this.workFlowList) {
                if (workflow.charges != undefined) {
                    for (let charge of workflow.charges) {

                        if (charge.workflowChargesListId > 0) {
                            charge.workflowId = workflow.workflowId;
                            charge.taskId = workflow.taskId;
                            charge.order = workflow.order;
                            charge.masterCompanyId = this.currentUserMasterCompanyId;
                            charge.createdBy = this.userName;
                            charge.createdDate = new Date();
                            charge.updatedBy = this.userName;
                            charge.updatedDate = new Date();
                        } else {
                            charge.workflowChargesListId = charge.workflowChargesListId > 0 ? charge.workflowChargesListId : 0;
                            charge.createdBy = this.userName;
                            charge.createdDate = new Date();
                            charge.masterCompanyId = this.currentUserMasterCompanyId;
                            charge.updatedBy = this.userName;
                            charge.updatedDate = new Date();
                        }
                        this.sourceWorkFlow.charges.push(charge);
                    }
                }
                if (workflow.directions != undefined) {
                    for (let direction of workflow.directions) {

                        if (direction.workflowDirectionId > 0) {
                            direction.workflowId = workflow.workflowId;
                            direction.taskId = workflow.taskId;
                            direction.order = workflow.order;
                            direction.masterCompanyId = this.currentUserMasterCompanyId;
                            direction.createdBy = this.userName;
                            direction.createdDate = new Date();
                            direction.updatedBy = this.userName;
                            direction.updatedDate = new Date();
                        } else {
                            direction.workflowDirectionId = direction.workflowDirectionId > 0 ? direction.workflowDirectionId : 0;
                            direction.masterCompanyId = this.currentUserMasterCompanyId;
                            direction.createdBy = this.userName;
                            direction.createdDate = new Date();

                            direction.updatedBy = this.userName;
                            direction.updatedDate = new Date();
                        }
                        this.sourceWorkFlow.directions.push(direction);
                    }
                }
                if (workflow.equipments != undefined) {
                    for (let equipment of workflow.equipments) {
                        if (equipment.workflowEquipmentListId > 0) {
                            equipment.workflowId = workflow.workflowId;
                            equipment.taskId = workflow.taskId;
                            equipment.order = workflow.order;
                            equipment.masterCompanyId = this.currentUserMasterCompanyId;
                            equipment.updatedBy = this.userName;
                            equipment.updatedDate = new Date();
                            equipment.createdBy = this.userName;
                            equipment.createdDate = new Date();
                            equipment.partNumber = equipment.partNumber && equipment.partNumber.assetId
                                && equipment.partNumber != null && equipment.partNumber.assetId != undefined ? equipment.partNumber.assetId : '';
                        } else {
                            equipment.workflowEquipmentListId = equipment.workflowEquipmentListId > 0 ? equipment.workflowEquipmentListId : 0;
                            equipment.masterCompanyId = this.currentUserMasterCompanyId;
                            equipment.updatedBy = this.userName;
                            equipment.updatedDate = new Date();
                            equipment.createdBy = this.userName;
                            equipment.createdDate = new Date();
                            equipment.partNumber = equipment.partNumber && equipment.partNumber.assetId
                                && equipment.partNumber != null && equipment.partNumber.assetId != undefined ? equipment.partNumber.assetId : '';
                        }
                        this.sourceWorkFlow.equipments.push(equipment);
                    }
                }
                if (workflow.exclusions != undefined) {
                    for (let exclusion of workflow.exclusions) {
                        if (exclusion.workflowExclusionId > 0) {
                            exclusion.workflowId = workflow.workflowId;
                            exclusion.partNumber = workflow.workflowId;
                            exclusion.taskId = workflow.taskId;
                            exclusion.order = workflow.order;
                            exclusion.masterCompanyId = this.currentUserMasterCompanyId;
                            exclusion.createdBy = this.userName;
                            exclusion.createdDate = new Date();
                            exclusion.updatedBy = this.userName;
                            exclusion.updatedDate = new Date();
                        } else {
                            exclusion.workflowExclusionId = exclusion.workflowExclusionId > 0 ? exclusion.workflowExclusionId : 0;
                            exclusion.masterCompanyId = this.currentUserMasterCompanyId;
                            exclusion.createdBy = this.userName;
                            exclusion.createdDate = new Date();
                            exclusion.updatedBy = this.userName;
                            exclusion.updatedDate = new Date();
                        }
                        this.sourceWorkFlow.exclusions.push(exclusion);
                    }
                }
                if (workflow.expertise != undefined) {
                    for (let expert of workflow.expertise) {
                        if (expert.workflowExpertiseListId > 0) {
                            expert.workflowId = workflow.workflowId;
                            expert.taskId = workflow.taskId;
                            expert.order = workflow.order;
                            expert.masterCompanyId = this.currentUserMasterCompanyId;
                            expert.updatedBy = this.userName;
                            expert.updatedDate = new Date();
                            expert.createdBy = this.userName;
                            expert.createdDate = new Date();
                        } else {
                            expert.workflowExpertiseListId = expert.workflowExpertiseListId > 0 ? expert.workflowExpertiseListId : 0;
                            expert.masterCompanyId = this.currentUserMasterCompanyId;
                            expert.updatedBy = this.userName;
                            expert.updatedDate = new Date();
                            expert.createdBy = this.userName;
                            expert.createdDate = new Date();
                        }
                        this.sourceWorkFlow.expertise.push(expert);
                    }
                }
                if (workflow.materialList != undefined) {
                    for (let material of workflow.materialList) {
                        if (material.workflowMaterialListId > 0) {
                            material.workflowId = workflow.workflowId;
                            material.taskId = workflow.taskId;
                            material.order = workflow.order;
                            material.masterCompanyId = this.currentUserMasterCompanyId;
                            material.createdBy = this.userName;
                            material.createdDate = new Date();
                            material.updatedBy = this.userName;
                            material.updatedDate = new Date();
                        } else {
                            material.workflowMaterialListId = material.workflowMaterialListId > 0 ? material.workflowMaterialListId : 0;
                            material.masterCompanyId = this.currentUserMasterCompanyId;
                            material.createdBy = this.userName;
                            material.createdDate = new Date();
                            material.updatedBy = this.userName;
                            material.updatedDate = new Date();
                            material.taskId = workflow.taskId;
                            if (material.partItem && typeof material.partItem == 'object') {
                                material.itemMasterId = material.partItem.partId;
                                material.partNumber = material.partItem.partName;
                            }
                        }
                        this.sourceWorkFlow.materialList.push(material);
                    }
                }
                if (workflow.measurements != undefined) {
                    for (let measurement of workflow.measurements) {
                        if (measurement.workflowMeasurementId > 0) {
                            measurement.workflowId = workflow.workflowId;
                            measurement.taskId = workflow.taskId;
                            measurement.order = workflow.order;
                            measurement.masterCompanyId = this.currentUserMasterCompanyId;
                            measurement.updatedBy = this.userName;
                            measurement.updatedDate = new Date();
                            measurement.createdBy = this.userName;
                            measurement.createdDate = new Date();
                        } else {
                            measurement.workflowMeasurementId = measurement.workflowMeasurementId > 0 ? measurement.workflowMeasurementId : 0;
                            measurement.masterCompanyId = this.currentUserMasterCompanyId;
                            measurement.createdBy = this.userName;
                            measurement.createdDate = new Date();
                            measurement.updatedBy = this.userName;
                            measurement.updatedDate = new Date();
                        }
                        this.sourceWorkFlow.measurements.push(measurement);
                    }
                }
                if (workflow.publication != undefined) {
                    for (let publication of workflow.publication) {
                        if (publication.id > 0) {
                            publication.workflowId = workflow.workflowId;
                            publication.taskId = workflow.taskId;
                            publication.order = workflow.order;
                            if (publication.workflowPublicationDashNumbers != undefined) {
                                for (let dashNumber of publication.workflowPublicationDashNumbers) {
                                    dashNumber.workflowId = this.workFlow.workflowId;
                                    dashNumber.aircraftDashNumberId = dashNumber.dashNumberId;
                                    dashNumber.taskId = this.workFlow.taskId;
                                    dashNumber.publicationsId = publication.id;
                                    dashNumber.dashNumberId = dashNumber.dashNumberId;
                                    dashNumber.dashNumber = dashNumber.dashNumber;
                                }
                            }
                        } else {
                            publication.id = publication.id > 0 ? publication.id : 0;
                            publication.masterCompanyId = this.currentUserMasterCompanyId;
                        }
                        publication.createdBy = this.userName;
                        publication.createdDate = new Date();
                        publication.updatedBy = this.userName;
                        publication.updatedDate = new Date();
                        publication.masterCompanyId = this.currentUserMasterCompanyId;
                        this.sourceWorkFlow.publication.push(publication);
                    }
                }
            }
        }
    }
    validateMethod(){ 
        this.errorValidate=[];
        for (let workflow of this.workFlowList) {
            if (workflow.charges != undefined) {
                for (let charge of workflow.charges) {
                    if(charge.workflowChargeTypeId =='' || charge.workflowChargeTypeId ==0 || charge.workflowChargeTypeId ==undefined){
                        this.errorValidate.push({'error':'Charge Type Not Added','task':workflow.ActionName,'attribute':'Charges'})
                      }else if(charge.unitCost == '' || charge.unitCost == undefined || charge.unitCost <=0){
                                this.errorValidate.push({'error':'Unit Cost Not Added','task':workflow.ActionName,'attribute':'Charges'})
                        }else if(charge.quantity==0 ||charge.quantity==''){
                                this.errorValidate.push({'error':'Quantity Not Added','task':workflow.ActionName,'attribute':'Charges'})
                            }else if(charge.extendedCost <=0){
                                this.errorValidate.push({'error':'Extended Cost Not Added','task':workflow.ActionName,'attribute':'Charges'})
                            }
            }
        }
            if (workflow.directions != undefined) {
                for (let direction of workflow.directions) {
                    if(direction.action ==''){
                        this.errorValidate.push({'error':'Action Type Not Added','task':workflow.ActionName,'attribute':'Directions'})
                      }
                }
            }
            if (workflow.equipments != undefined) {
                for (let equipment of workflow.equipments) {
                    if(equipment.assetId =='' || equipment.assetId ==0||  equipment.assetId ==undefined){
                        this.errorValidate.push({'error':'Tool Name Not Added','task':workflow.ActionName,'attribute':'Tools'})
                      }else if(equipment.quantity == '' || equipment.quantity == undefined || equipment.quantity <=0){
                                this.errorValidate.push({'error':'Quantity Not Added','task':workflow.ActionName,'attribute':'Tools'})
                        }
                }
            }
            if (workflow.exclusions != undefined) {
                for (let exclusion of workflow.exclusions) {
                    if(exclusion.itemMasterId ==0 || exclusion.itemMasterId =='' || exclusion.itemMasterId ==undefined){
                        this.errorValidate.push({'error':'Tool Name Not Added','task':workflow.ActionName,'attribute':'Exclusions'})
                      }
                    //   else if(exclusion.quantity == '' || exclusion.quantity == undefined || exclusion.quantity <=0){
                    //             this.errorValidate.push({'error':'Quantity Not Added','task':workflow.ActionName,'attribute':'Exclusions'})
                    //     }
                    //     else if(exclusion.unitCost == '' || exclusion.unitCost == undefined || exclusion.unitCost <=0){
                    //         this.errorValidate.push({'error':'Unit Cost Not Added','task':workflow.ActionName,'attribute':'Charges'})
                    // }
                }
            }
            if (workflow.expertise != undefined) {
                for (let expert of workflow.expertise) {
                    if(expert.expertiseTypeId ==0 || expert.expertiseTypeId=='' || expert.expertiseTypeId==undefined){
                        this.errorValidate.push({'error':'Expertise Type Not Added','task':workflow.ActionName,'attribute':'Expertise'})
                      } 
                }
            }
            if (workflow.materialList != undefined) {
                for (let material of workflow.materialList) {
                    if(material.itemMasterId =='' || material.itemMasterId ==undefined || material.itemMasterId ==0){
                        this.errorValidate.push({'error':'PN Not Added','task':workflow.ActionName,'attribute':'Material list'})
                      }else  if(material.conditionCodeId ==0 || material.conditionCodeId ==undefined){
                        this.errorValidate.push({'error':'Cond Not Added','task':workflow.ActionName,'attribute':'Material list'})
                      }else if(material.unitCost == '' || material.unitCost == undefined || material.unitCost <=0){
                                this.errorValidate.push({'error':'Unit Cost Not Added','task':workflow.ActionName,'attribute':'Material list'})
                        }else if(material.quantity=='0' || material.quantity==''){
                                this.errorValidate.push({'error':'Qty Not Added','task':workflow.ActionName,'attribute':'Material list'})
                            }else if(material.extendedCost <=0){
                                this.errorValidate.push({'error':'Extended Cost Not Added','task':workflow.ActionName,'attribute':'Material list'})
                            }
                }
            }
            if (workflow.measurements != undefined) {
                for (let measurement of workflow.measurements) {
                    if(measurement.itemMasterId =='' || measurement.itemMasterId ==undefined || measurement.itemMasterId ==0){
                        this.errorValidate.push({'error':'PN Not Added','task':workflow.ActionName,'attribute':'Measurements'})
                      }
                }
            }
            if (workflow.publication != undefined) {
                for (let publication of workflow.publication) {
                    if(publication.publicationId =='' || publication.publicationId ==undefined || publication.publicationId ==0){
                        this.errorValidate.push({'error':'Pub ID Not Added','task':workflow.ActionName,'attribute':'Publications'})
                      }
                }
            }
        }
        if(this.errorValidate && this.errorValidate.length !=0){
            var msg = '';
            this.errorValidate.forEach((error) => {
                if (error.error != undefined) {
                    msg +=error.task+ '-'+ error.attribute+ ':' + error.error  + '<br/>';
                }
            }); 


            this.validateTask=false;
            this.alertService.showMessage("Workflow", msg, MessageSeverity.error);
            return;
        }else{ 
            this.validateTask=true;
            this.modifyForSaveUpdateApis();
        }
    }

    errorValidate:any=[];
    validateTask:boolean=false;
    upDateDataCancel() {
        $('#UpdateConfirm').modal("hide");
    }
    updateConfirmation() { 
        if (this.isHeaderUpdate) {
            this.sourceWorkFlow.charges = [];
            this.sourceWorkFlow.directions = [];
            this.sourceWorkFlow.equipments = [];
            this.sourceWorkFlow.exclusions = [];
            this.sourceWorkFlow.expertise = [];
            this.sourceWorkFlow.materialList = [];
            this.sourceWorkFlow.measurements = [];
            this.sourceWorkFlow.publication = [];
            this.isSpinnerVisible = true;

            this.sourceWorkFlow.masterCompanyId = this.currentUserMasterCompanyId;
            this.sourceWorkFlow.createdBy = this.userName;
            this.sourceWorkFlow.updatedBy = this.userName;
            if (this.sourceWorkFlow.customerName) {
                this.sourceWorkFlow.customerId = this.sourceWorkFlow.customerName.customerId;
            }else{
                this.sourceWorkFlow.customerId=null;
            }
            if(this.sourceWorkFlow.workflowExpirationDate){
                
                this.sourceWorkFlow.workflowExpirationDate = this.sourceWorkFlow.workflowExpirationDate ? this.datePipe.transform(this.sourceWorkFlow.workflowExpirationDate, 'MMM-dd-yyyy') : null;
            }
            if(this.sourceWorkFlow.workflowCreateDate){
                this.sourceWorkFlow.workflowCreateDate = this.sourceWorkFlow.workflowCreateDate ? this.datePipe.transform(this.sourceWorkFlow.workflowCreateDate, 'MMM-dd-yyyy') : null;
            }

            const workflowData={...this.sourceWorkFlow}
            delete    workflowData.customerName
            this.actionService.addWorkFlowHeader(workflowData).subscribe(result => {
                this.isSpinnerVisible = false;
                this.sourceWorkFlow.version=result.version;
                this.alertService.showMessage(this.title, "Work Flow header updated successfully.", MessageSeverity.success);
                this.sourceWorkFlow.workflowId = result.workflowId;
                this.UpdateMode = true;
                this.disableUpdateButton = true;
            }, error => {
                this.isSpinnerVisible = false;
            });

            return;
        }
        // this.modifyForSaveUpdateApis();
        this.validateMethod();
        if (this.workFlowList.length == 0) {
            this.alertService.showMessage(this.title, "Atleast one task is required.", MessageSeverity.error);
        }
if(this.validateTask==true){
    this.isSpinnerVisible = true;
    const originalData = { ...this.sourceWorkFlow };
    const souceData = { ...this.sourceWorkFlow };
    if (souceData.exclusions && souceData.exclusions.length != 0) {
        souceData.exclusions.forEach(element => {
            if (element.partName) {
                element.partNumber = element.partName.partNumber;
            }
            delete element.partName
        });
    }
    if (souceData.measurements && souceData.measurements.length != 0) {
        souceData.measurements.forEach(element => {
            delete element.partName
        });
    }
    if (souceData.publication && souceData.publication.length != 0) {
        souceData.publication.forEach(element => {
            delete element.allDashNumbers;
            delete element.aircraft;
            if (element.workflowPublicationDashNumbers && element.workflowPublicationDashNumbers.length != 0) {
                var i;
                for (i = 0; i < element.workflowPublicationDashNumbers.length; i++) {
                    element.workflowPublicationDashNumbers[i].AircraftDashNumberId = element.workflowPublicationDashNumbers[i]['dashNumberId'];
                    element.workflowPublicationDashNumbers[i].workflowId = souceData.workflowId
                    delete element.workflowPublicationDashNumbers[i].dashNumberId;
                }
            }
        });
    }
    if (souceData.equipments && souceData.equipments.length != 0) {
        souceData.equipments.forEach(element => {
            element.partNumber = element.partNumber.name
        });
    }
    delete souceData.customerName 
    souceData.percentageOfNew= souceData.percentageOfNew==-1?0 :souceData.percentageOfNew;
    souceData.percentageOfReplacement = souceData.percentageOfReplacement==-1?0 :souceData.percentageOfReplacement
    this.actionService.getNewWorkFlow(souceData).subscribe(
        result => {
            this.isSpinnerVisible = false;
            this.validateTask=false;
            this.alertService.showMessage(this.title, "Work Flow updated successfully.", MessageSeverity.success);
            // this.route.navigateByUrl('/workflowmodule/workflowpages/app-workflow-list');
            this._workflowService.enableUpdateMode = true;
            this.UpdateMode=false;
            this.loadWorkFlow()
        }, error => {
            this.isSpinnerVisible = false;
            this.validateTask=false;
        });
}
    } 
    saveWorkFlowWorkOrder(isSaveToWorkFlow) {
        if (this.workFlowList != undefined && this.workFlowList.length > 0) {
            this.sourceWorkFlow.charges = [];
            this.sourceWorkFlow.directions = [];
            this.sourceWorkFlow.equipments = [];
            this.sourceWorkFlow.exclusions = [];
            this.sourceWorkFlow.expertise = [];
            this.sourceWorkFlow.materialList = [];
            this.sourceWorkFlow.measurements = [];
            this.sourceWorkFlow.publication = [];
            this.sourceWorkFlow.masterCompanyId = this.currentUserMasterCompanyId;
            this.sourceWorkFlow.createdBy = this.userName;
            this.sourceWorkFlow.updatedBy = this.userName;
            for (let workflow of this.workFlowList) {
                if (workflow.charges != undefined) {
                    for (let charge of workflow.charges) {
                        charge.workflowChargesListId = charge.workflowChargesListId > 0 ? charge.workflowChargesListId : 0;
                        charge.workflowId = workflow.workflowId;
                        charge.taskId = workflow.taskId;
                        this.sourceWorkFlow.charges.push(charge);
                    }
                }
                if (workflow.directions != undefined) {
                    for (let direction of workflow.directions) {
                        direction.workflowDirectionId = direction.workflowDirectionId > 0 ? direction.workflowDirectionId : 0;
                        direction.workflowId = workflow.workflowId;
                        direction.taskId = workflow.taskId;
                        this.sourceWorkFlow.directions.push(direction);
                    }
                }
                if (workflow.equipments != undefined) {
                    for (let equipment of workflow.equipments) {
                        equipment.workflowEquipmentListId = equipment.workflowEquipmentListId > 0 ? equipment.workflowEquipmentListId : 0;
                        equipment.workflowId = workflow.workflowId;
                        equipment.taskId = workflow.taskId;
                        this.sourceWorkFlow.equipments.push(equipment);
                    }
                }
                if (workflow.exclusions != undefined) {
                    for (let exclusion of workflow.exclusions) {
                        exclusion.workflowExclusionId = exclusion.workflowExclusionId > 0 ? exclusion.workflowExclusionId : 0;
                        exclusion.workflowId = workflow.workflowId;
                        exclusion.taskId = workflow.taskId;
                        this.sourceWorkFlow.exclusions.push(exclusion);
                    }
                }
                if (workflow.expertise != undefined) {
                    for (let expert of workflow.expertise) {
                        expert.workflowExpertiseListId = expert.workflowExpertiseListId > 0 ? expert.workflowExpertiseListId : 0;
                        expert.workflowId = workflow.workflowId;
                        expert.taskId = workflow.taskId;
                        this.sourceWorkFlow.expertise.push(expert);
                    }
                }
                if (workflow.materialList != undefined) {
                    for (let material of workflow.materialList) {
                        material.workflowMaterialListId = material.workflowMaterialListId > 0 ? material.workflowMaterialListId : 0;
                        material.workflowId = workflow.workflowId;
                        material.taskId = workflow.taskId;
                        material.partNumber = (typeof material.partNumber == 'string') ? material.partNumber : material.partNumber.partName;
                        this.sourceWorkFlow.materialList.push(material);
                    }
                }
                if (workflow.measurements != undefined) {
                    for (let measurement of workflow.measurements) {
                        measurement.workflowMeasurementId = measurement.workflowMeasurementId > 0 ? measurement.workflowMeasurementId : 0;
                        measurement.workflowId = workflow.workflowId;
                        measurement.taskId = workflow.taskId;
                        this.sourceWorkFlow.measurements.push(measurement);
                    }
                }
                if (workflow.publication != undefined) {
                    for (let publication of workflow.publication) {
                        publication.workflowId = workflow.workflowId;
                        publication.taskId = workflow.taskId;
                        if (publication.workflowPublicationDashNumbers != undefined) {
                            for (let dashNumber of publication.workflowPublicationDashNumbers) {

                                dashNumber.workflowId = this.workFlow.workflowId;
                                dashNumber.aircraftDashNumberId = dashNumber.dashNumberId;
                                dashNumber.taskId = this.workFlow.taskId;
                                dashNumber.publicationsId = publication.id;
                                dashNumber.dashNumberId = dashNumber.dashNumberId;
                                dashNumber.dashNumber = dashNumber.dashNumber;
                            }
                        }
                        this.sourceWorkFlow.publication.push(publication);
                    }
                }
            }
        }
        if (this.isWorkOrder) {
            const data = this.sourceWorkFlow;
            const excessParams = {
                createdBy: this.userName,
                updatedBy: this.userName,
                createdate: new Date(),
                updatdate: new Date(),
                isActive: true,
                masterCompanyId: this.currentUserMasterCompanyId,
            }
            if (data.measurements && data.measurements.length != 0) {
                data.measurements.forEach(element => {
                    delete element.partName
                });
            }
            const saveWorkFlowWorkOrderData = {
                ...this.sourceWorkFlow,
                isSaveToWorkFlow: isSaveToWorkFlow,
                workflowId: this.sourceWorkFlow.workflowId,
                workOrderId: this.savedWorkOrderData.workOrderId,
                workFlowWorkOrderId: this.workFlowWorkOrderId,
                workOrderPartNoId: this.workOrderPartNumberId,
                existingWorkFlowId: this.sourceWorkFlow.workflowId,
                charges: data.charges.map(x => { return { ...x, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } }),
                directions: data.directions.map(x => { return { ...x, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } }),
                equipments: data.equipments.map(x => { return { ...x, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } }),
                exclusions: data.exclusions.map(x => { return { ...x, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } }),
                expertise: data.expertise.map(x => { return { ...x, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } }),
                materialList: data.materialList.map(x => {
                    return {
                        ...x,
                        workOrderId: this.savedWorkOrderData.workOrderId,
                        partNumber: (typeof x.partNumber == 'string') ? x.partNumber : x.partNumber.partName,
                        ...excessParams
                    }
                }),
                measurements: data.measurements.map(x => { return { ...x, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } }),
                publication: data.publication.map(x => { return { ...x, Id: 0, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } })
            }
            if (isSaveToWorkFlow) {
                this.saveWorkFlowWorkOrderData = saveWorkFlowWorkOrderData;
                this.showVersionUpdate()
            }
            else {
                this.savedWorkFlowWorkOrderData.emit(saveWorkFlowWorkOrderData);
            }
        }
    }

//currently not using this method
    confirmation() { 
        //  this.validateMethod();
    // this.modifyForSaveUpdateApis();

        if (this.isheadUpdate) {
            this.sourceWorkFlow.charges = [];
            this.sourceWorkFlow.directions = [];
            this.sourceWorkFlow.equipments = [];
            this.sourceWorkFlow.exclusions = [];
            this.sourceWorkFlow.expertise = [];
            this.sourceWorkFlow.materialList = [];
            this.sourceWorkFlow.measurements = [];
            this.sourceWorkFlow.publication = [];
            this.isSpinnerVisible = true;
            this.sourceWorkFlow.masterCompanyId = this.currentUserMasterCompanyId;
            this.sourceWorkFlow.createdBy = this.userName;
            this.sourceWorkFlow.updatedBy = this.userName;
            if (this.sourceWorkFlow.customerName) {
                this.sourceWorkFlow.customerId = this.sourceWorkFlow.customerName.customerId;
            }else{
                this.sourceWorkFlow.customerId=null;
            }
            const createDataset = { ...this.sourceWorkFlow }
            delete createDataset.customerName;
            this.isSpinnerVisible = true;
            this.actionService.addWorkFlowHeader(createDataset).subscribe(result => {
                this.isSpinnerVisible = false;
                this.sourceWorkFlow.version=result.version;
                this.alertService.showMessage(this.title, "Work Flow header added successfully.", MessageSeverity.success);
                this.isUpdateAfterCreate = true;
                this._workflowService.enableUpdateMode = true;
                this._workflowService.currentWorkFlowId = result.workflowId;
                this.disableUpdateButton = true;
                this.route.navigateByUrl(`/workflowmodule/workflowpages/wf-edit/${this._workflowService.currentWorkFlowId}`);
            }, error => {
                this.isSpinnerVisible = false;
            });

            return;
        }
       
        this.isSpinnerVisible = true;
        this.sourceWorkFlow.masterCompanyId = this.currentUserMasterCompanyId;
        this.sourceWorkFlow.createdBy = this.userName;
        this.sourceWorkFlow.updatedBy = this.userName;
        const dataSet = { ...this.sourceWorkFlow }
        delete dataSet.customerName;
        dataSet.percentageOfNew= dataSet.percentageOfNew==-1?0 :dataSet.percentageOfNew;
        dataSet.percentageOfReplacement = dataSet.percentageOfReplacement==-1?0 :dataSet.percentageOfReplacement
        this.actionService.getNewWorkFlow(dataSet).subscribe(
            data => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(this.title, "Work Flow added successfully.", MessageSeverity.success);
                this.route.navigateByUrl('/workflowmodule/workflowpages/app-workflow-list');
            }, error => {
                this.isSpinnerVisible = false;
            });
    }


}