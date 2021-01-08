import { Component, OnInit, ViewChild, AfterViewInit, Input, OnDestroy, Output, EventEmitter } from "@angular/core";
import { ActionService } from "./ActionService";
import { ITask } from "./Action";
import { IActionAttrbutes } from "./ActionAttributes";
import { IWorkFlow } from "./WorkFlow";
import { ICharges } from "./Charges";
import { IDirections } from "./Directions";
import { IEquipmentList } from "./EquipmentList";
import { IExpertise } from "./Expertise";
import { IMaterialList } from "./MaterialList";
import { IPublication } from "./Publication";
import { IExclusion } from "./Exclusion";
import { IMeasurement } from "./Measurement";
import { ActivatedRoute, Router } from "@angular/router";
import { VirtualTimeScheduler } from "rxjs";
import { SelectItem } from "primeng/api";
import { VendorService } from "../services/vendor.service";
import { EmployeeExpertiseService } from "../services/employeeexpertise.service";
import { WorkScopeService } from "../services/workscope.service";
import { CustomerService } from "../services/customer.service";
import { ItemClassificationService } from "../services/item-classfication.service";
import { CurrencyService } from "../services/currency.service";
import { UnitOfMeasureService } from "../services/unitofmeasure.service";
import { ConditionService } from "../services/condition.service";
import { WorkFlowtService } from "../services/workflow.service";
import { ItemMasterService } from "../services/itemMaster.service";
import { AlertService, MessageSeverity } from "../services/alert.service";
import * as $ from 'jquery';

 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChargesCreateComponent } from "../shared/Charges-Create.component";
import { Percent } from "../models/Percent.model";
import { PercentService } from "../services/percent.service";
import { WorkOrderService } from "../services/work-order/work-order.service";
import { AuthService } from "../services/auth.service";
import { formatNumberAsGlobalSettingsModule } from "../generic/autocomplete";
import { CommonService } from "../services/common.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";


@Component({
    selector: 'wf-create',
    templateUrl: './workflow-Create.component.html',
    styleUrls: ['./workflow-Create.component.css']
})
export class WorkflowCreateTestComponent implements OnInit, OnDestroy {
    @Input() isWorkOrder;
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
    sourceWorkFlow: any = {}; employeeExplist: any[] = [];
    materailTypeList: any[] = [];
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
    /** workflow-create ctor */
    // Variables Declaration

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
    /** workflow-create ctor */
    cars: SelectItem[];
    selectedValues: any[] = [];
    isWorkFlowEdit: boolean = false;
    selectedWorkflow: any;
    workflowActionAttribues: any[] = [];
    loadedDDs: any = {};
    selectedActionAttributes: any[] = [];
    actionValue: any;//dropdown selected value

    addedtaskIds: number[] = [];
    selectedAction: any;//selected tab value

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

    totalPercent: Percent[];
    currentPanelId: any;
    todaydate = new Date();
    toggle_wf_header: boolean = true;

    MaterialCost: any;
    TotalCharges: any;
    TotalExpertiseCost: any;
    Total: any;
    PercentBERThreshold: any;
    @ViewChild(ChargesCreateComponent,{static:false}) chargesCreateComponent: ChargesCreateComponent;
    responseDataForHeader: any;
    tasksData: any = [];
    typeOfForm: string = 'Create';
    itemMasterId: any = 0;
    isHeaderUpdate: boolean = false;
    saveWorkFlowWorkOrderData: any;
    isSpinnerVisible: boolean = false;

    constructor(private actionService: ActionService,
        private workOrderService: WorkOrderService,
        private authService: AuthService,
        private router: ActivatedRoute, private route: Router,
        private expertiseService: EmployeeExpertiseService,
        private cusservice: CustomerService,
        public workscopeService: WorkScopeService,
        public currencyService: CurrencyService,
        public itemClassService: ItemClassificationService,
        public unitofmeasureService: UnitOfMeasureService,
        private conditionService: ConditionService,
        private _workflowService: WorkFlowtService,
        private itemser: ItemMasterService,
        private vendorService: VendorService,
        private alertService: AlertService,
        private modalService: NgbModal, private percentService: PercentService,
        private commonService: CommonService) {
    }

    public ngOnDestroy() {
        this._workflowService.listCollection = null;
        this.typeOfForm = 'Create';
        this._workflowService.enableUpdateMode = false;
        this._workflowService.currentWorkFlowId = null;
    }

    setSelectedItems(workFlow: any): void {
        // debugger;
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
            this.setCurrentPanel(this.selectedItems[0].Name, this.selectedItems[0].Id);

    }

    updateWorkFlowId: string;



    ngOnInit(): void {
        if (this._workflowService.enableUpdateMode) {
            this.typeOfForm = 'Edit';
        }
        this.isFixedcheck('');
        this.loadCurrencyData();
        this.loadWorkScopedata();
        this.loadItemClassData();
        this.GetPartNumberList();
        this.getMaterialMandatory();
        this.loadUOMData();
        this.loadConditionData();
        this.sourceWorkFlow.workflowCreateDate = new Date();
        this.sourceWorkFlow.version = "V-1";

        if (!this.sourceWorkFlow.workFlowId) {
            this.sourceWorkFlow.workOrderNumber = 'Creating';
        }

        this.getMaterialType();
        this.loadcustomerData();
        this.loadExpertiseData();

        this.newAction = { Id: "0", Name: "", Description: "", Memo: "" ,Sequence:0};
        this.getAllActions();
        this.actionService.getActionAttributes().subscribe(
            actionAttributes => {
                actionAttributes = actionAttributes.filter(x => x.isActive && x)
                this.actionAttributes = [];
                for (let attr of actionAttributes) {
                    if (this.isQuote && (attr.description == 'Material List' || attr.description == 'Charges' || attr.description == 'Exclusions' || attr.description == 'Expertise')) {
                        this.actionAttributes.push({ Id: attr.taskAttributeId, Name: attr.description, Sequence: attr.taskAttributeId});
                    }
                    else if (!this.isQuote) {
                        this.actionAttributes.push({ Id: attr.taskAttributeId, Name: attr.description, Sequence: attr.taskAttributeId });
                    }
                }
                this.actionAttributes = this.actionAttributes.sort(function(a, b) {
                    var nameA = a.Sequence; // ignore upper and lowercase
                    var nameB = b.Sequence; // ignore upper and lowercase
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                    return 0;
                  });
            },
            error => this.errorMessage = <any>error
        );

        this.dropdownSettings = {
            singleSelection: false,
            idField: 'Id',
            textField: 'Name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 1,
            allowSearchFilter: false
        };

        this.loadWorkFlow();
        this.getAllPercentages();







    }


    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    private getAllPercentages(): void {
         this.commonService.smartDropDownList('[Percent]', 'PercentId', 'PercentValue').subscribe(res => {
			this.totalPercent = res;
		 })
        // this.percentService.getPercentages().subscribe(
        //     result => {
        //         this.totalPercent = result[0];
        //     },
        //     error => {
        //         this.alertService.showDialog(this.title, 'Something went wrong while loading Percentages.');
        //     }
        // );
    }


    berDetermination(): any {
        if (this.sourceWorkFlow.fixedAmount) {            
            this.sourceWorkFlow.berThresholdAmount = this.sourceWorkFlow.fixedAmount;
        }
        // check on is percentOfNew enable
        if (this.sourceWorkFlow.percentOfNew) {
            this.sourceWorkFlow.berThresholdAmount = this.sourceWorkFlow.percentOfNew;
        }
        // check on is .percentOfReplacement enable
        if (this.sourceWorkFlow.percentOfReplacement) {
            this.sourceWorkFlow.berThresholdAmount = this.sourceWorkFlow.percentOfReplacement;
        }

        // 1 and 2 check box 
        if (this.sourceWorkFlow.fixedAmount && this.sourceWorkFlow.percentOfNew) {
            const fixedAmount = this.sourceWorkFlow.fixedAmount.toString().replace(/\,/g,'');
            const percentOfNew = this.sourceWorkFlow.percentOfNew.toString().replace(/\,/g,'');
            this.sourceWorkFlow.berThresholdAmount = Math.min(parseFloat(fixedAmount), parseFloat(percentOfNew));
        }

        // 2 and 3  check box 
        if (this.sourceWorkFlow.percentOfNew && this.sourceWorkFlow.percentOfReplacement) {
            const percentOfReplacement = this.sourceWorkFlow.percentOfReplacement.toString().replace(/\,/g,'');
            const percentOfNew = this.sourceWorkFlow.percentOfNew.toString().replace(/\,/g,'');
            this.sourceWorkFlow.berThresholdAmount = Math.min(parseFloat(percentOfNew), parseFloat(percentOfReplacement));
        }
        // 1 and 3  check box 
        if (this.sourceWorkFlow.fixedAmount && this.sourceWorkFlow.percentOfReplacement) {
            const percentOfReplacement = this.sourceWorkFlow.percentOfReplacement.toString().replace(/\,/g,'');
            const fixedAmount = this.sourceWorkFlow.fixedAmount.toString().replace(/\,/g,'');
            this.sourceWorkFlow.berThresholdAmount = Math.min(parseFloat(fixedAmount), parseFloat(percentOfReplacement));
        }

        //1 and 2 and 3 check box
        if (this.sourceWorkFlow.fixedAmount && this.sourceWorkFlow.percentOfNew && this.sourceWorkFlow.percentOfReplacement) {
            const fixedAmount = this.sourceWorkFlow.fixedAmount.toString().replace(/\,/g,'');
            const percentOfNew = this.sourceWorkFlow.percentOfNew.toString().replace(/\,/g,'');
            const percentOfReplacement = this.sourceWorkFlow.percentOfReplacement.toString().replace(/\,/g,'');
            this.sourceWorkFlow.berThresholdAmount = Math.min(parseFloat(fixedAmount), parseFloat(percentOfNew), parseFloat(percentOfReplacement));
        }
        //1 and 2 and 3 check box all uncheck 
        if (!this.sourceWorkFlow.fixedAmount && !this.sourceWorkFlow.percentOfNew && !this.sourceWorkFlow.percentOfReplacement) {
            this.sourceWorkFlow.berThresholdAmount = 0.00;
        }

        this.sourceWorkFlow.fixedAmount = this.sourceWorkFlow.fixedAmount ? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.fixedAmount, 2) : null;
        if (this.sourceWorkFlow.berThresholdAmount > 0) {
            this.sourceWorkFlow.berThresholdAmount = formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.berThresholdAmount, 2);
        }
    }

    loadWorkFlow() {
        if (this._workflowService.enableUpdateMode == true && !this.UpdateMode) {
            if (this._workflowService.listCollection) {

                this.sourceWorkFlow = this._workflowService.listCollection.workflow;

                this.sourceWorkFlow.workflowCreateDate = new Date(this.sourceWorkFlow.workflowCreateDate);
                this.sourceWorkFlow.workflowExpirationDate = new Date(this.sourceWorkFlow.workflowExpirationDate);

                this.sourceWorkFlow.itemMasterId = this._workflowService.listCollection.itemMasterId;
                this.itemMasterId = this.sourceWorkFlow.itemMasterId;
                this.sourceWorkFlow.partNumber = this._workflowService.listCollection.partNumber;
                this.sourceWorkFlow.partNumberDescription = this._workflowService.listCollection.partNumberDescription;

                this.sourceWorkFlow.itemGroup = this._workflowService.listCollection.itemgroup;
                this.sourceWorkFlow.changedPartNumberId = this._workflowService.listCollection.changedPartNumberId;
                this.sourceWorkFlow.changedPartNumber = this._workflowService.listCollection.changedPartNumber;
                this.sourceWorkFlow.changedPartNumberDescription = this._workflowService.listCollection.changedPartNumberDescription;



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

                if (this.sourceWorkFlow.costOfNew && this.sourceWorkFlow.percentageOfNew) {
                    this.onPercentOfNew(this.sourceWorkFlow.costOfNew, this.sourceWorkFlow.percentageOfNew);

                }
                if (this.sourceWorkFlow.costOfReplacement && this.sourceWorkFlow.percentageOfReplacement) {
                    this.onPercentOfReplcaement(this.sourceWorkFlow.costOfReplacement, this.sourceWorkFlow.percentageOfReplacement);
                }

                this.updateWorkFlowId = this.sourceWorkFlow.workflowId;
                this.UpdateMode = true;
                this.updateMode();
            }
        }

    }

    updateMode(): void {

        this.actionService.getWorkFlow(this.updateWorkFlowId).subscribe(

            workFlow => {

                this.actionService.getActions().subscribe(
                    actions1 => {
                        
                       const actions = actions1.sort(function(a, b) {
                            var nameA = a.sequence; // ignore upper and lowercase
                            var nameB = b.sequence; // ignore upper and lowercase
                            if (nameA < nameB) {
                              return -1;
                            }
                            if (nameA > nameB) {
                              return 1;
                            }
                            // names must be equal
                            return 0;
                          });
                        this.actionService.getActionAttributes().subscribe(
                            actionAttributes => {
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

                                taskIds = taskIds.map(item => item)
                                    .filter((value, index, self) => self.indexOf(value) === index);


                                //taskIds = taskIds.sort();
                                this.currenttaskId = taskIds[0];
                                this.workFlowActions = [];
                                for (let actId of taskIds) {
                                    var action = actions.filter(x => x.taskId == actId)[0];
                                    this.workFlowActions.push(action);
                                    let wf = this.GetWorkFlow();
                                    wf.taskId = action.taskId;
                                    wf.ActionName = action.description;
                                    wf.selectedItems = [];
                                    if (this.UpdateMode) {
                                        wf.workflowId = this.updateWorkFlowId;
                                    }

                                    if (workFlow[0].charges != undefined && workFlow[0].charges.length > 0) {
                                        var charges = workFlow[0].charges.filter(charge => charge.taskId == action.taskId);
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
                                        var direction = workFlow[0].directions.filter(direction => direction.taskId == action.taskId);
                                        wf.directions = direction;
                                    }
                                    if (workFlow[0].equipments != undefined && workFlow[0].equipments.length > 0) {
                                        var equipment = workFlow[0].equipments.filter(equipment => equipment.taskId == action.taskId);
                                        wf.equipments = equipment;
                                    }
                                    if (workFlow[0].exclusions != undefined && workFlow[0].exclusions.length > 0) {
                                        var exclusion = workFlow[0].exclusions.filter(exclusion => exclusion.taskId == action.taskId);
                                        wf.exclusions = exclusion;
                                        wf.sumofQty = wf.exclusions.reduce((acc, x) => {
                                            return acc + parseFloat(x.quantity == undefined || x.quantity === '' ? 0 : x.quantity)
                                        }, 0);

                                        wf.sumofExtendedCost = wf.exclusions.reduce((acc, x) => {
                                            return acc + parseFloat(x.extendedCost == undefined || x.extendedCost === '' ? 0 : x.extendedCost)
                                        }, 0);

                                    }
                                    if (workFlow[0].expertise != undefined && workFlow[0].expertise.length > 0) {
                                        var expertise = workFlow[0].expertise.filter(expertise => expertise.taskId == action.taskId);
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
                                        var material = workFlow[0].materialList.filter(material => material.taskId == action.taskId);
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
                                        var measurement = workFlow[0].measurements.filter(measurement => measurement.taskId == action.taskId);
                                        wf.measurements = measurement;
                                    }
                                    if (workFlow[0].publication != undefined && workFlow[0].publication.length > 0) {
                                        var publication = workFlow[0].publication.filter(publication => publication.taskId == action.taskId);
                                        wf.publication = publication;
                                        for (let pub of wf.publication) {

                                            this.actionService.GetPublicationModel(pub.aircraftManufacturer).subscribe(
                                                model => {
                                                    pub["publicationModels"] = model;
                                                },
                                                error => this.errorMessage = <any>error
                                            );

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
                            },
                            error => this.errorMessage = <any>error
                        );
                    },
                    error => this.errorMessage = <any>error
                );

            },
            error => this.errorMessage = <any>error
        );
    }

    getActionsDD() {
        this._workflowService.getWorkFlowActions().subscribe((data: any) => {
            if (data && data[0].length > 0) {
                this.actionsDD = [{ taskId: "", description: "" }].concat(data[0]);
            }
            this.loadedDDs["actions"] = true;
            if (this.loadedDDs["actionAttributes"])
                this.getSelectedWorkflowActions();
        });
    }

    getMaterialType() {
        this._workflowService.getMaterialType().subscribe(data => { this.materailTypeList = data; });
    }

    private loadExpertiseData() {


        this.expertiseService.getWorkFlows().subscribe(data => { this.employeeExplist = data; });

    }

    getActionAttributesDD() {
        this._workflowService.getActionAttributes().subscribe((data: any) => {
            if (data && data[0].length > 0) {
                let _attrList: any[] = [];
                for (let i = 0; i < data[0].length; i++)
                    _attrList.push({ value: data[0][i].taskAttributeId, label: data[0][i].description });
                this.actionsAttributesDD = _attrList;

                this.actionsAttributesDD.forEach(obj => {
                    this.actionAttributeTabs.forEach((tab) => {
                        if (tab.label == obj["label"])
                            tab["value"] = obj["value"];
                    });
                });
            }
            this.loadedDDs["actionAttributes"] = true;
            if (this.loadedDDs["actions"])
                this.getSelectedWorkflowActions();
        });
    }

    private filterpartItems(event) {
        this.partCollection = [];
        if (this.allParts != undefined && this.allParts.length > 0) {
            for (let part of this.allParts) {
                if (part.partNumber != undefined && part.partNumber.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.partCollection.push({
                        "partId": part.itemMasterId,
                        "partName": part.partNumber,
                        "description": part.partDescription,
                        "itemGroup": part.itemGroup
                    });
                }
            }
        }
    }

    private filterChangedPartItems(event) {
        this.changedPartCollection = [];
        if (this.allParts != undefined && this.allParts.length > 0) {
            for (let part of this.allParts) {
                if (part.partNumber != undefined && this.sourceWorkFlow.itemMasterId != part.itemMasterId && part.partNumber.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.changedPartCollection.push({
                        "partId": part.itemMasterId,
                        "partName": part.partNumber,
                        "description": part.partDescription
                    });
                }
            }
        }
    }

    private onPartSelect(event) {
        this.sourceWorkFlow.itemMasterId = this.sourceWorkFlow.part.partId;
        this.sourceWorkFlow.partNumber = this.sourceWorkFlow.part.partName;
        this.sourceWorkFlow.partNumberDescription = this.sourceWorkFlow.part.description;
        this.sourceWorkFlow.itemGroup = this.sourceWorkFlow.part.itemGroup;

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

    }



    private onChangedPartSelect(event) {
        this.sourceWorkFlow.changedPartNumberId = this.sourceWorkFlow.changedPart.partId;
        this.sourceWorkFlow.changedPartNumber = this.sourceWorkFlow.changedPart.partName;
        this.sourceWorkFlow.changedPartNumberDescription = this.sourceWorkFlow.changedPart.description;

        if (this.workFlow != undefined) {
            this.workFlow.changedPartNumber = this.sourceWorkFlow.changedPart.partId;
        }
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

    private setCalculatedBERThreshold(workflow: any) {
        this.sourceWorkFlow.isFixedAmount = workflow.isFixedAmount;
        this.sourceWorkFlow.isPercentageofNew = workflow.isPercentageofNew;
        this.sourceWorkFlow.isPercentageOfReplacement = workflow.isPercentageOfReplacement;
        this.sourceWorkFlow.fixedAmount = workflow.fixedAmount;
        this.sourceWorkFlow.costOfNew = workflow.costOfNew;
        this.sourceWorkFlow.percentageOfNew = workflow.percentageOfNew;
        this.sourceWorkFlow.costOfReplacement = workflow.costOfReplacement;
        this.sourceWorkFlow.percentageOfReplacement = workflow.percentageOfReplacement;
    }

    private resetBERThreshold() {
        this.isFixed = false;
        this.ispercent = false;
        this.percentreplcae = false;
        this.sourceWorkFlow.isFixedAmount = false;
        this.sourceWorkFlow.isPercentageofNew = false;
        this.sourceWorkFlow.isPercentageOfReplacement = false;
    }

    isFixedcheck(event) {

        if (event == 'fixed') {
            this.isFixed = true;
            this.sourceWorkFlow.isFixedAmount = true;
        }
        if (event == 'percentage') {
            this.ispercent = true;
            this.sourceWorkFlow.isPercentageofNew = true;
        }
        if (event == 'percentreplace') {
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
            // reseting the  cost of new values
            this.sourceWorkFlow.percentOfNew = undefined
            this.sourceWorkFlow.percentageOfNew = '';
            this.sourceWorkFlow.costOfNew = '';

        }
    }
    isPercentreplcaeUnchecked(e) {
        if (!e.target.checked) {
            this.percentreplcae = false;
            this.sourceWorkFlow.percentreplcae = false;
            // reseting the replacement cost 
            this.sourceWorkFlow.percentOfReplacement = undefined;
            this.sourceWorkFlow.costOfReplacement = '';
            this.sourceWorkFlow.percentageOfReplacement = '';
        }
    }


    private loadWorkScopedata() {
        this.commonService.smartDropDownList("WorkScope","WorkScopeId","Description").subscribe(res => {
            this.worksScopeCollection = res.map(x => {
                return {
                    ...x,
                    workScopeId: x.value,
                    description: x.label
                }
            });
        })
    }

    private loadCurrencyData() {
        this.currencyService.getCurrencyList().subscribe(currencydata => {
            this.allCurrencyData = currencydata[0];
        })
    }

    onCustomerNameselected(event) {
        for (let i = 0; i < this.customerNamecoll.length; i++) {
            if (event == this.customerNamecoll[i][0].name) {

                this.sourceWorkFlow.customerId = this.customerNamecoll[i][0].customerId;
                this.sourceWorkFlow.customerCode = this.customerNamecoll[i][0].customerCode;
            }

        }
    }

    filterNames(event) {

        this.customerNames = [];
        if (this.allCustomers) {
            if (this.allCustomers.length > 0) {
                for (let i = 0; i < this.allCustomers.length; i++) {
                    let name = this.allCustomers[i].name;
                    if (event.query) {
                        if (name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                            this.customerNamecoll.push([{
                                "customerId": this.allCustomers[i].customerId,
                                "name": name,
                                "customerCode": this.allCustomers[i].customerCode
                            }]);
                            this.customerNames.push(name);
                        }
                    }
                    else {
                        this.customerNamecoll.push([{
                            "customerId": this.allCustomers[i].customerId,
                            "name": name,
                            "customerCode": this.allCustomers[i].customerCode
                        }]);
                        this.customerNames.push(name);
                    }
                }
            }
        }
    }

    private loadcustomerData() {
        this.cusservice.getWorkFlows().subscribe(data => { this.allCustomers = data[0] });
    }

    getSelectedWorkflowActions() {
        if (this.isWorkFlowEdit) {
            this._workflowService.getWorkflowActionAttributes(this.selectedWorkflow["workflowId"]).subscribe(data => {
                if (data && data[0].length > 0) {
                    this.workflowActions = data[0];
                    this.addedtaskIds = this.workflowActions.map(action => action["taskId"]);
                }
            });
        }
        this.workflowActions = [
            { workflowId: "", taskId: 2, workflowActionAttributeIds: "11,12,13" },
            { workflowId: "", taskId: 3, workflowActionAttributeIds: "14,15,16" },
            { workflowId: "", taskId: 4, workflowActionAttributeIds: "16,17,36" }
        ];
        this.addedtaskIds = [2, 3, 4];
        // select First Action
        this.displaySelectedAction(this.workflowActions[0]);
    }

    //On Action Dropdown value change
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

    //one of the Actions Tab Click
    onActionSelect(action) {
        let selAction = this.workflowActions.find(obj => obj.taskId == action.taskId);
        if (selAction)
            this.displaySelectedAction(selAction);
    }

    //ex: accepted format -> selAction = { workflowId: "1", actionId: 2, workflowActionAttributeIds: "11,12,13" }
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

    // On Add Button Click
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

    onPercentOfNew(myValue, percentValue) {
        this.sourceWorkFlow.costOfNew = this.sourceWorkFlow.costOfNew ? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.costOfNew, 2) : null;
        this.sourceWorkFlow.percentOfNew = "";
        myValue = parseFloat(myValue.toString().replace(/\,/g,''));
        if (myValue && percentValue) {
            const val = (myValue / 100) * percentValue;
            this.sourceWorkFlow.percentOfNew = formatNumberAsGlobalSettingsModule(val, 2);
        }
        this.berDetermination();
    }

    onPercentOfReplcaement(myValue, percentValue) {
        this.sourceWorkFlow.costOfReplacement = this.sourceWorkFlow.costOfReplacement ? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.costOfReplacement, 2) : null;
        this.sourceWorkFlow.percentOfReplacement = "";
        if (myValue && percentValue) {
            myValue = parseFloat(myValue.toString().replace(/\,/g,''));
            let afterpercent = (myValue / 100) * percentValue;
            this.sourceWorkFlow.percentOfReplacement = formatNumberAsGlobalSettingsModule(afterpercent, 2);

        }
        this.berDetermination();
    }

    private defualtChargesListobj() {
        let partListObj = {
            type: '', qty: '', unitcost: '', extcost: '', taskId: ''
        }
        return partListObj;
    }

    private defualtDrectObj() {
        let partListObj = {
            action: '', directionName: '', sequence: '', memo: '',
        }
        return partListObj;
    }

    private defualtEquipmentObj() {
        let partListObj = {
            partNumber: '', partDescription: '', itemClassification: '', qty: '',
        }
        return partListObj;
    }

    private defualtExclsuionObj() {
        let partListObj = {
            epn: '', epndescription: '', cost: '', notes: '',
        }
        return partListObj;
    }

    private defualtExpertiseObj() {
        let partListObj = {
            expertiseType: '', estimatedHours: '', standardRate: '', estimatedRate: '',
        }
        return partListObj;
    }

    private defualtMaterialListobj() {
        let partListObj = {
            partNumber: '', partDescription: '', itemClassification: '', qty: '', uom: '', condition: '',
            unitcost: '', extcost: '', provision: '', deffered: '', figureId: '', taskId: ''
        }
        return partListObj;
    }

    getWorkFlowMaterial() {
        this._workflowService.getWorkFlowMaterial().subscribe(data => {
            this.workflowMaterails = data;
        });

    }

    getWorkFlowChargeList() {
        this._workflowService.getChargeList().subscribe(data => {
            this.workflowCharges = data;
        });

    }

    getWorkFlowEquipment() {
        this._workflowService.getWorkFlowEquipmentList().subscribe(data => {
            this.workflowEquipment = data;
        });

    }

    getWorkFlowExpertise() {
        this._workflowService.getWorkflowExpertise().subscribe(data => {
            this.workflowExpertise = data;
        });
    }

    private GetPartNumberList() {
        this.itemser.getPartDetailsDropdown().subscribe(
            results => {
                this.allParts = results;
                if (this.updateMode) {
                    var currentSelectedPart = this.allParts.filter(x => x.itemMasterId == this.sourceWorkFlow.itemMasterId);

                    if (currentSelectedPart.length > 0) {
                        this.sourceWorkFlow.part = {
                            "partId": currentSelectedPart[0].itemMasterId,
                            "partName": currentSelectedPart[0].partNumber,
                            "description": currentSelectedPart[0].partDescription
                        };
                    }

                    if (this.sourceWorkFlow.changedPartNumberId != undefined && this.sourceWorkFlow.changedPartNumberId != null && this.sourceWorkFlow.changedPartNumberId != '') {
                        var currentSelectedChangedPart = this.allParts.filter(x => x.itemMasterId == this.sourceWorkFlow.changedPartNumberId);
                        if (currentSelectedChangedPart.length > 0) {
                            this.sourceWorkFlow.changedPart = {
                                "partId": currentSelectedChangedPart[0].itemMasterId,
                                "partName": currentSelectedChangedPart[0].partNumber,
                                "description": currentSelectedChangedPart[0].partDescription
                            };
                        }
                    }
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    private getDefaultConditionId(name: string): string {

        if (this.allconditioninfo != undefined && this.allconditioninfo.length > 0) {
            let defaultCondition: any = this.allconditioninfo.find(x => x.description.trim().toLowerCase() == name.toLowerCase())

            return defaultCondition != undefined ? defaultCondition.conditionId : 0;
        }
        else {
            this.conditionService.getConditionList().subscribe(data => {
                this.allconditioninfo = data[0];
                let defaultCondition: any = this.allconditioninfo.find(x => x.description.trim().toLowerCase() == name.toLowerCase())

                return defaultCondition != undefined ? defaultCondition.conditionId : 0;
            })
        }
    }

    private loadConditionData() {
        this.conditionService.getConditionList().subscribe(data => {
            this.allconditioninfo = data[0];
        })
    }

    private getDefaultUOMId(name: string): string {
        let defaultUOM: any = this.allUomdata.filter(x => x.shortName == name);

        if (defaultUOM.length > 0) {
            return defaultUOM[0].unitOfMeasureId;
        }
        return "";
    }

    private loadUOMData() {
        this.unitofmeasureService.getUnitOfMeasureList().subscribe(uomdata => {
            this.allUomdata = uomdata[0];
        })
    }

    private getDefaultMaterialMandatoryId(name: string): string {
        let defaultMaterialMandatory: any = this.materialMandatory.filter(x => x.name == name);

        if (defaultMaterialMandatory.length > 0) {
            return defaultMaterialMandatory.id;
        }
        return "";
    }

    private getMaterialMandatory(): void {
        this.actionService.GetMaterialMandatory().subscribe(
            mandatory => {
                this.materialMandatory = mandatory;
            },
            error => this.errorMessage = <any>error
        );
    }

    private loadItemClassData() {
        this.itemClassService.getWorkFlows().subscribe(data => { this.itemClassInfo = data });
    }


    private onDataLoadFailed(error: any) {
    }

    getAllActions(): void {
        this.actionService.getActions().subscribe(
            actions1 => {
                this.actions = [];
                for (let attr of actions1) {
                    this.actions.push({ Id: attr.taskId, Name: attr.description, Description: "", Memo: "",Sequence:attr.sequence })
                }
                this.actions = this.actions.sort(function(a, b) {
                    var nameA = a.Sequence; // ignore upper and lowercase
                    var nameB = b.Sequence; // ignore upper and lowercase
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                    return 0;
                  });
            },
            error => this.errorMessage = <any>error
        );
    }

    currentActiveTab: string;

    setCurrentPanel(itemName, id): void {

        this.currentPanelId = id;
        this.workFlow.partNumber = this.sourceWorkFlow.itemMasterId;
        itemName = itemName.replace(" ", "_");

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

        if (this.workFlow.selectedItems != undefined || this.workFlow.selectedItems.length > 0) {
            this.setSelectedItems(this.workFlow);
        }

        this.selectedItems = this.workFlow.selectedItems;
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
                        // TODO :  need to write delete action code here
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
                // I think this else part is not really required as it was added previously when der was a add button.
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
            isDelete: false,
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
            isDelete: false,
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
            isDelete: false,

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
            IsDelete: false,
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
            IsDelete: false,
        }];

        return expertise;
    }



    GetMaterialList(): any[] {
        var material = [{
            workflowMaterialListId: "0",
            itemMasterId: '',
            conditionCodeId: this.getDefaultConditionId('new'),
            mandatoryOrSupplemental: 'Mandatory',
            itemClassificationId: '',
            quantity: '',
            unitOfMeasureId: this.getDefaultUOMId('Ea'),
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
            AllowEdit: true,
            isDelete: false,
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
            isDelete: false,

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
        this.actionService.addAction(this.newAction).subscribe(
            data => {
                this.alertService.showMessage("Workflow", "Task added successfully.", MessageSeverity.success);
                this.getAllActions();
            },
            error => this.errorMessage = <any>error
        );
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

    addWorkFlow(isHeaderUpdate: boolean): void {
        this.sourceWorkFlow.workflowId = undefined;

        if (!this.validateWorkFlowHeader()) {
            return;
        }

        if (!this.calculateTotalWorkFlowCost(false)) {
            var OkCancel = confirm("Work Flow total cost exceed the BER threshold amount. Do you still want to continue?");
            if (OkCancel == false) {
                return;
            }
        }

        this.SaveWorkFlow();
        if (isHeaderUpdate) {
            this.sourceWorkFlow.charges = [];
            this.sourceWorkFlow.directions = [];
            this.sourceWorkFlow.equipments = [];
            this.sourceWorkFlow.exclusions = [];
            this.sourceWorkFlow.expertise = [];
            this.sourceWorkFlow.materialList = [];
            this.sourceWorkFlow.measurements = [];
            this.sourceWorkFlow.publication = [];
            this.isSpinnerVisible = true;
            this.actionService.addWorkFlowHeader(this.sourceWorkFlow).subscribe(result => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(this.title, "Work Flow header added successfully.", MessageSeverity.success);
                this.sourceWorkFlow.workflowId = result.workflowId;
                this.sourceWorkFlow.workOrderNumber = result.workOrderNumber;
                this.UpdateMode = true;
            },
            err => {
                this.isSpinnerVisible = false;
            });

            return;
        }

        this.isSpinnerVisible = true;
        this.actionService.getNewWorkFlow(this.sourceWorkFlow).subscribe(
            data => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(this.title, "Work Flow added successfully.", MessageSeverity.success);
                this.route.navigateByUrl('/workflowmodule/workflowpages/app-workflow-list');
            },
            error => {
                this.isSpinnerVisible = false;
                var message = '';
                if (error.error.constructor == Array) {
                    message = error.error[0].errorMessage != "" ? error.error[0].errorMessage : "Please fill all the mandatory fields";
                }
                else {
                    message = error.error.Message;
                }
                this.alertService.showMessage(this.title, message, MessageSeverity.error);
            }
        )
    }

    title: string = "Work Flow";

    updateWorkFlow(): void {
        if (!this.validateWorkFlowHeader()) {
            return;
        }

        if (!this.calculateTotalWorkFlowCost(false)) {
            var OkCancel = confirm("Work Flow total cost exceed the BER threshold amount. Do you still want to continue?");
            if (OkCancel == false) {
                return;
            }
        }

        this.SaveWorkFlow();
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
            this.actionService.addWorkFlowHeader(this.sourceWorkFlow).subscribe(result => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(this.title, "Work Flow header updated successfully.", MessageSeverity.success);
                this.sourceWorkFlow.workflowId = result.workflowId;
                this.UpdateMode = true;
            },
            err => {
                this.isSpinnerVisible = false;
            });

            return;
        }

        if (this.workFlowList.length == 0) {
            this.alertService.showMessage(this.title, "Atleast one task is required.", MessageSeverity.error);
        }
        this.isSpinnerVisible = true;
        this.actionService.getNewWorkFlow(this.sourceWorkFlow).subscribe(
            result => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(this.title, "Work Flow updated successfully.", MessageSeverity.success);
                this.route.navigateByUrl('/workflowmodule/workflowpages/app-workflow-list');
            },
            error => {
                this.isSpinnerVisible = false;
                var message = '';
                if (error.error.constructor == Array) {
                    message = error.error[0].errorMessage;
                }
                else {
                    message = error.error.Message;
                }
                this.alertService.showMessage(this.title, message, MessageSeverity.error);
            }
        );
    }
    increaseVerConfirmation(isIncrease){
        $('#quoteVer').modal("hide");
        this.sourceWorkFlow['isVersionIncrease'] = isIncrease;
        if(this.isWorkOrder){
            this.saveWorkFlowWorkOrderData['isVersionIncrease'] = isIncrease;
            this.savedWorkFlowWorkOrderData.emit(this.saveWorkFlowWorkOrderData);
        }
        else{
            this.updateWorkFlow();
        }
    }
    showVersionUpdate(){
        $('#quoteVer').modal("show");
    }

    SaveWorkFlow(): void {

        if (this.workFlowList != undefined && this.workFlowList.length > 0) {

            this.sourceWorkFlow.charges = [];
            this.sourceWorkFlow.directions = [];
            this.sourceWorkFlow.equipments = [];
            this.sourceWorkFlow.exclusions = [];
            this.sourceWorkFlow.expertise = [];
            this.sourceWorkFlow.materialList = [];
            this.sourceWorkFlow.measurements = [];
            this.sourceWorkFlow.publication = [];

            for (let workflow of this.workFlowList) {
                if (workflow.charges != undefined) {
                    for (let charge of workflow.charges) {
                        charge.workflowChargesListId = charge.workflowChargesListId > 0 ? charge.workflowChargesListId : 0;
                        charge.workflowId = workflow.workflowId;
                        charge.taskId = workflow.taskId;
                        charge.order = workflow.order;
                        this.sourceWorkFlow.charges.push(charge);
                    }
                }
                if (workflow.directions != undefined) {
                    for (let direction of workflow.directions) {
                        direction.workflowDirectionId = direction.workflowDirectionId > 0 ? direction.workflowDirectionId : 0;
                        direction.workflowId = workflow.workflowId;
                        direction.taskId = workflow.taskId;
                        direction.order = workflow.order;
                        this.sourceWorkFlow.directions.push(direction);
                    }
                }
                if (workflow.equipments != undefined) {
                    for (let equipment of workflow.equipments) {
                        equipment.workflowEquipmentListId = equipment.workflowEquipmentListId > 0 ? equipment.workflowEquipmentListId : 0;
                        equipment.workflowId = workflow.workflowId;
                        equipment.taskId = workflow.taskId;
                        equipment.order = workflow.order;
                        this.sourceWorkFlow.equipments.push(equipment);
                    }
                }
                if (workflow.exclusions != undefined) {
                    for (let exclusion of workflow.exclusions) {
                        exclusion.workflowExclusionId = exclusion.workflowExclusionId > 0 ? exclusion.workflowExclusionId : 0;
                        exclusion.workflowId = workflow.workflowId;
                        exclusion.taskId = workflow.taskId;
                        exclusion.order = workflow.order;
                        this.sourceWorkFlow.exclusions.push(exclusion);
                    }
                }
                if (workflow.expertise != undefined) {
                    for (let expert of workflow.expertise) {
                        expert.workflowExpertiseListId = expert.workflowExpertiseListId > 0 ? expert.workflowExpertiseListId : 0;
                        expert.workflowId = workflow.workflowId;
                        expert.taskId = workflow.taskId;
                        expert.order = workflow.order;
                        this.sourceWorkFlow.expertise.push(expert);
                    }
                }
                if (workflow.materialList != undefined) {
                    for (let material of workflow.materialList) {
                        material.workflowMaterialListId = material.workflowMaterialListId > 0 ? material.workflowMaterialListId : 0;
                        material.workflowId = workflow.workflowId;
                        material.taskId = workflow.taskId;
                        material.order = workflow.order;
                        this.sourceWorkFlow.materialList.push(material);
                    }
                }
                if (workflow.measurements != undefined) {
                    for (let measurement of workflow.measurements) {
                        measurement.workflowMeasurementId = measurement.workflowMeasurementId > 0 ? measurement.workflowMeasurementId : 0;
                        measurement.workflowId = workflow.workflowId;
                        measurement.taskId = workflow.taskId;
                        measurement.order = workflow.order;
                        this.sourceWorkFlow.measurements.push(measurement);
                    }
                }
                if (workflow.publication != undefined) {
                    for (let publication of workflow.publication) {
                        publication.id = publication.id > 0 ? publication.id : 0;
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
                        this.sourceWorkFlow.publication.push(publication);
                    }
                }
            }
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
                        publication.id = publication.id > 0 ? publication.id : 0;
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

            // responseDataForHeader
            const data = this.sourceWorkFlow;
            const excessParams = {
                createdBy: this.userName,
                updatedBy: this.userName,
                createdate: new Date(),
                updatdate: new Date(),
                isActive: true,
                IsDeleted: false,
                masterCompanyId: 1

            }

            const saveWorkFlowWorkOrderData = {
                ...this.sourceWorkFlow,
                // ...tasks[0],
                isSaveToWorkFlow: isSaveToWorkFlow,
                workflowId: 0,
                workOrderId: this.savedWorkOrderData.workOrderId,
                workFlowWorkOrderId: this.workFlowWorkOrderId,
                workOrderPartNoId: this.workOrderPartNumberId,
                existingWorkFlowId: this.sourceWorkFlow.workflowId,
                charges: data.charges.map(x => { return { ...x, workflowChargesListId: 0, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } }),
                directions: data.directions.map(x => { return { ...x, workflowDirectionId: 0, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } }),
                equipments: data.equipments.map(x => { return { ...x, workflowEquipmentListId: 0, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } }),
                exclusions: data.exclusions.map(x => { return { ...x, workflowExclusionId: 0, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } }),
                expertise: data.expertise.map(x => { return { ...x, workflowExpertiseListId: 0, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } }),
                materialList: data.materialList.map(x => { return { ...x, workflowMaterialListId: 0, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } }),
                measurements: data.measurements.map(x => { return { ...x, workflowMeasurementId: 0, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } }),
                publication: data.publication.map(x => { return { ...x, Id: 0, workOrderId: this.savedWorkOrderData.workOrderId, ...excessParams } })



            }
            if(isSaveToWorkFlow){
                this.saveWorkFlowWorkOrderData = saveWorkFlowWorkOrderData;
                this.showVersionUpdate()
            }
            else{
                this.savedWorkFlowWorkOrderData.emit(saveWorkFlowWorkOrderData);
            }
            //   this.workOrderService.createWorkFlowWorkOrder(
            //       ).subscribe(res => {

            //     this.alertService.showMessage(
            //         '',
            //         'Work Order Work Flow Saved Succesfully',
            //         MessageSeverity.success
            //       );
            // })
        }
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
        // this.modal = this.modalService.open(confirmDeleteTemplate, { size: 'sm' });
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

    calculateTotalWorkFlowCost(isDisplayErrorMesage): boolean {
        if (this.sourceWorkFlow.berThresholdAmount == undefined || this.sourceWorkFlow.berThresholdAmount == 0) {
            this.sourceWorkFlow.berThresholdAmount = 0;
        }

        this.MaterialCost = 0;
        this.TotalCharges = 0;
        this.TotalExpertiseCost = 0;

        if (this.workFlowList != undefined && this.workFlowList.length > 0) {
            for (let wf of this.workFlowList) {
                this.MaterialCost += wf.totalMaterialCostValue != undefined ? parseFloat(wf.totalMaterialCostValue.toString().replace(/\,/g,'')) : 0;
                this.TotalCharges += wf.extendedCostSummation != undefined ? parseFloat(wf.extendedCostSummation.toString().replace(/\,/g,'')) : 0;
                this.TotalExpertiseCost += wf.totalExpertiseCost != undefined ? parseFloat(wf.totalExpertiseCost.toString().replace(/\,/g,'')) : 0;
            }
        }

        this.MaterialCost = this.MaterialCost ? formatNumberAsGlobalSettingsModule(this.MaterialCost, 2) : '0.00';
        this.TotalCharges = this.TotalCharges ? formatNumberAsGlobalSettingsModule(this.TotalCharges, 2) : '0.00';
        this.TotalExpertiseCost = this.TotalExpertiseCost ? formatNumberAsGlobalSettingsModule(this.TotalExpertiseCost, 2) : '0.00';
        this.sourceWorkFlow.otherCost = this.sourceWorkFlow.otherCost ? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.otherCost, 2) : '0.00';
        const materialCost = parseFloat(this.MaterialCost.toString().replace(/\,/g,''));
        const totalCharges = parseFloat(this.TotalCharges.toString().replace(/\,/g,''));
        const totalExpertiseCost = parseFloat(this.TotalExpertiseCost.toString().replace(/\,/g,''));
        const otherCost = this.sourceWorkFlow.otherCost ? parseFloat(this.sourceWorkFlow.otherCost.toString().replace(/\,/g,'')) : 0.00;
        const total = materialCost + totalCharges + totalExpertiseCost + otherCost;
        this.Total = formatNumberAsGlobalSettingsModule(total, 2);

        // this.Total = parseFloat((this.MaterialCost + this.TotalCharges + this.TotalExpertiseCost + parseFloat(((this.sourceWorkFlow.otherCost == undefined || this.sourceWorkFlow.otherCost == '') ? 0 : this.sourceWorkFlow.otherCost)))).toFixed(2);
        const berThAmt = parseFloat(this.sourceWorkFlow.berThresholdAmount.toString().replace(/\,/g,''));        
        const maxValue = Math.max(0, total, berThAmt);
        const minValue = Math.min(total, berThAmt) !== -Infinity ?  Math.min(total, berThAmt) : 0 ;

        let percentageofBerThreshold: any = (minValue)/(maxValue/100);
   
        this.PercentBERThreshold = parseFloat(percentageofBerThreshold).toFixed(2);

        // this.PercentBERThreshold = parseFloat((this.Total / this.sourceWorkFlow.berThresholdAmount).toFixed(2));

        if (this.Total > berThAmt && isDisplayErrorMesage && (this.sourceWorkFlow.isFixedAmount == true || this.sourceWorkFlow.isPercentageOfNew == true || this.sourceWorkFlow.percentageOfReplacement == true)) {
            this.alertService.showMessage(this.title, 'Work Flow total cost is exceeding the BER Threshold Amount', MessageSeverity.info);
            return false;
        }

        if (this.Total > berThAmt && (this.sourceWorkFlow.isFixedAmount == true || this.sourceWorkFlow.isPercentageOfNew == true || this.sourceWorkFlow.percentageOfReplacement == true)) {
            return false;
        }

        return true;
    }

    saveBuildFromScratchData() {
        this.saveData.emit(this.workFlowList);
    }

    onChangeOtherCost() {
        this.sourceWorkFlow.otherCost = this.sourceWorkFlow.otherCost ? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.otherCost, 2) : null;
    }

}
