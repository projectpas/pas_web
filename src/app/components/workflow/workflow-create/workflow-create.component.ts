import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { retry } from 'rxjs/operator/retry';
import { WorkFlowEndpoint } from '../../../services/workflow-endpoint.service';
import { WorkFlowtService } from '../../../services/workflow.service';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { VendorService } from '../../../services/vendor.service';
import { ConditionService } from '../../../services/condition.service';
import { UnitOfMeasureService } from '../../../services/unitofmeasure.service';
import { ItemClassificationService } from '../../../services/item-classfication.service';
import { WorkScopeService } from '../../../services/workscope.service';
import { CurrencyService } from '../../../services/currency.service';
import { CustomerService } from '../../../services/customer.service';
import { EmployeeExpertiseService } from '../../../services/employeeexpertise.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-workflow-create',
    templateUrl: './workflow-create.component.html',
    styleUrls: ['./workflow-create.component.scss']
})

/** workflow-create component*/
export class WorkflowCreateComponent implements OnInit {
	employeeExplist: any[]=[];
	materailTypeList: any[]=[];
	allCustomers: any[]=[];
	customerNamecoll: any[]=[];
	customerNames: any[]=[];
	percentreplcae: boolean;
	ispercent: boolean;
	isFixed: boolean;
	isFlat: boolean;
	isCalculate: boolean;
	allCurrencyData: any[]=[];
	worksScopeCollection: any[]=[];
	partWithId: any;
	partCollection: any[]=[];
	itemclaColl: any[]=[];
	workflowCharges: any[][];
	workflowEquipment: any[][];
	workflowMaterails: any[][];
	workflowExpertise: any[][];
	itemClassInfo: any[][];
	allUomdata: any[] = [];
	allconditioninfo: any[] = [];
	allPartDetails: any[] = [];
	allPartnumbersInfo: any[] = [];
	sourceWorkFlow: any = {};
	workflowactionAttributes: any[] = [];
	actionAttributes: any[] = [];
	workflowActions: any[]=[];
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
    workflowActionAttribues: any[] = [];//For Tabs
    loadedDDs: any = {};
    selectedActionAttributes: any[] = [];//For DropDown
    actionValue: any;//dropdown selected value
    addedActionIds: number[] = [];
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
    actionAttributeTabs: any[] = [
        { visible: false, selected: false, label: "Material List" },
        { visible: false, selected: false, label: "Charges" },
        { visible: false, selected: false, label: "Equipment" },
        { visible: false, selected: false, label: "Expertise" },
        { visible: false, selected: false, label: "Directions" },
        { visible: false, selected: false, label: "Exclusions" },
        { visible: false, selected: false, label: "Publications" },
        { visible: false, selected: false, label: "Measurements" }
	];
	breadcrumbs: MenuItem[] = [
        { label: 'Work Flow' },
		{ label: 'Work Flow List' },
		{ label: 'Create Work Flow' }
	];
	
    // Class Constructor
	constructor(private expertiseService:EmployeeExpertiseService,private cusservice:CustomerService,public workscopeService: WorkScopeService, public currencyService: CurrencyService,public itemClassService: ItemClassificationService, public unitofmeasureService: UnitOfMeasureService, private conditionService: ConditionService, private _workflowService: WorkFlowtService, private itemser: ItemMasterService, private vendorService: VendorService) {
        this.getActionsDD();
        this.getActionAttributesDD();
	}
	
	ngOnInit() {
		this.loadCurrencyData();
		this.loadCurrencyData();
		this.loadWorkScopedata();
		this.loadItemClassData();
		this.loadPartData();
		this.ptnumberlistdata();
		if (!this.sourceWorkFlow.workFlowId) {
			this.sourceWorkFlow.workFlowId = 'Creating';
		}
		this.getMaterialType();
		this.loadcustomerData();
		this.loadExpertiseData();
	}

    //Get Drop Downs
    getActionsDD() {
        this._workflowService.getWorkFlowActions().subscribe((data:any) => {
            if (data && data[0].length > 0) {
                this.actionsDD = [{ actionId: "", description: ""}].concat( data[0] );
            }
            this.loadedDDs["actions"] = true;
            if (this.loadedDDs["actionAttributes"]) 
                this.getSelectedWorkflowActions();
        });
	}

	getMaterialType() {
		this._workflowService.getMaterialType().subscribe(data => { this.materailTypeList = data;});
	}

	private loadExpertiseData() {
		this.expertiseService.getWorkFlows().subscribe(data => { this.employeeExplist = data; });
	}

    getActionAttributesDD() {
        this._workflowService.getActionAttributes().subscribe((data:any) => {
            if (data && data[0].length > 0) {
                let _attrList:any[] = [];
                for (let i = 0; i < data[0].length; i++)
                    _attrList.push( { value: data[0][i].taskAttributeId, label: data[0][i].description } );
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
	
	filterpartItems(event) {
		this.partCollection = [];
		this.itemclaColl = [];
		if (this.allPartnumbersInfo) {
			if (this.allPartnumbersInfo.length > 0) {

				for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
					let partName = this.allPartnumbersInfo[i].partNumber;
					if (partName) {
						if (partName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
							this.itemclaColl.push([{
								"partId": this.allPartnumbersInfo[i].itemMasterId,
								"partName": partName,
								"description": this.allPartnumbersInfo[i].partDescription
							}]),

								this.partCollection.push(partName);
						}
					}
				}
			}
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

	isFixedcheck(event) {
		if (event == 'fixed') {
			this.isFixed = true;
			this.ispercent = false;
			this.percentreplcae = false;
		}
		if (event == 'percentage') {
			this.isFixed = false;
			this.ispercent = true;
			this.percentreplcae = false;
		}
		if (event == 'percentreplace') {
			this.isFixed = false;
			this.ispercent = false;
			this.percentreplcae = true;
		}
	}

	private loadWorkScopedata() {	
		this.workscopeService.getWorkScopeList().subscribe(
			data => { this.worksScopeCollection=data[0]})	
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
								"name": name
							}]),
								this.customerNames.push(name);
						}
					}
					else {
						this.customerNamecoll.push([{
							"customerId": this.allCustomers[i].customerId,
							"name": name
						}]),
							this.customerNames.push(name);
					}
				}
			}
		}
	}

	private loadcustomerData() {
		this.cusservice.getWorkFlows().subscribe(data => { this.allCustomers=data[0]});
	}

	onPartSelect(event) {
		if (this.itemclaColl) {
			for (let i = 0; i < this.itemclaColl.length; i++) {
				if (event == this.itemclaColl[i][0].partName) {
					this.sourceWorkFlow.itemMasterId = this.itemclaColl[i][0].partId;
					this.sourceWorkFlow.partNumberDescription = this.itemclaColl[i][0].description;
				}
			};
		}
	}

	partnmId(parentdata, event) {
		if (this.itemclaColl) {
			for (let i = 0; i < this.itemclaColl.length; i++) {
				if (event == this.itemclaColl[i][0].partName) {
					this.sourceWorkFlow.itemMasterId = this.itemclaColl[i][0].partId;
					this.partWithId = [];				
					this.vendorService.getPartDetailsWithidForSinglePart(this.sourceWorkFlow.itemMasterId).subscribe(
						data1 => {
							if (data1[0][0]) {
								this.partWithId = data1[0][0];
								parentdata.partAlternatePartId = this.partWithId.partAlternatePartId;
								parentdata.partId = this.partWithId.itemMasterId;
								parentdata.partdescription = this.partWithId.partDescription;
								parentdata.partNumber = this.partWithId.partNumber;
								parentdata.itemTypeId = this.partWithId.itemTypeId;
								parentdata.name = this.partWithId.name;
								parentdata.itemMasterId = this.partWithId.itemMasterId;
								parentdata.glAccountId = this.partWithId.glAccountId;
								parentdata.shortName = this.partWithId.shortName;
							}

						})
				}
			};
		}
	}

    //Get Business Data 
    getSelectedWorkflowActions() {
        if (this.isWorkFlowEdit) {
            this._workflowService.getWorkflowActionAttributes(this.selectedWorkflow["workflowId"]).subscribe(data => {
                if (data && data[0].length > 0) {
                    this.workflowActions = data[0];
                    this.addedActionIds = this.workflowActions.map(action => action["actionId"]);
                }
            });
        }
        this.workflowActions = [
			{ workflowId: "", actionId: 2, workflowActionAttributeIds: "11,12,13" },
			{ workflowId: "", actionId: 3, workflowActionAttributeIds: "14,15,16" },
			{ workflowId: "", actionId: 4, workflowActionAttributeIds: "16,17,36" }
        ];
        this.addedActionIds = [2, 3, 4];
        this.displaySelectedAction(this.workflowActions[0]);
	}
	
    //On Action Dropdown value change
    onActionValueChange(selectedvalue) {
        if (Number(selectedvalue.target.value) > 0) {
            this.selectedActionAttributes = [];
            let indx = this.addedActionIds.indexOf(Number(selectedvalue.target.value));
            if (indx >= 0)
                this.selectedActionAttributes = this.workflowActions[indx].workflowActionAttributeIds.split(",");
        } else {
            this.selectedActionAttributes = [];
        }
	}
	
    //one of the Actions Tab Click
    onActionSelect(action) {
		let selAction = this.workflowActions.find(obj => obj.actionId == action.actionId);
        if (selAction)
            this.displaySelectedAction(selAction);
    }

    displaySelectedAction(selAction,loadAttrData=false) {
		let action = this.actionsDD.find(action => action["actionId"] == selAction["actionId"]);
        if (this.selectedAction != action) {
            this.selectedAction = action;
        }
        
        //Hide all attribute tabs
        this.actionAttributeTabs.forEach(attr => { attr.visible = false; attr.selected = false; } );
        //Display Selected Attribute Tabs
        selAction["workflowActionAttributeIds"].split(",").forEach(attr_id => {
            this.actionAttributeTabs.forEach(attr => {
                if (attr["value"] == attr_id)
                    attr.visible = true;
            });
        });
        let selAttr = this.actionAttributeTabs.find(attr => attr.visible);
        if (selAttr) selAttr.selected = true;
        if (loadAttrData) {
            if (this.isWorkFlowEdit) {

            } else {

            }
        }
    }

    // On Add Button Click
    addActionAttributes() {
        if (this.actionValue && this.actionValue != "" && this.selectedActionAttributes && this.selectedActionAttributes.length > 0) {
			let currAction = { workflowId: "", actionId: Number(this.actionValue), workflowActionAttributeIds: this.selectedActionAttributes.join(",") }
			let selAction = this.workflowActions.find(obj => obj.actionId == this.actionValue)
            if (selAction) {
                selAction["workflowActionAttributeIds"] = currAction["workflowActionAttributeIds"]
            } else {
                this.workflowActions.push(currAction);
                this.addedActionIds.push(Number(this.actionValue));
                selAction = currAction;
            }
            this.displaySelectedAction(selAction);
        }
	}

	onPercentOfNew(myValue, percentValue) {
		let afterpercent = percentValue / 100;
		let test = afterpercent * myValue;
		this.sourceWorkFlow.percentOfNew = myValue - test;
	}

	onPercentOfReplcaement(myValue, percentValue) {
		let afterpercent = percentValue / 100;
		let test = afterpercent * myValue;
		this.sourceWorkFlow.percentOfReplaceMent = myValue - test;
	}

    private defualtChargesListobj() {
        let partListObj = {
            type: '', qty: '', unitcost: '', extcost: '', actionId: ''            
        }
        return partListObj;
    }

    private defualtDrectObj() {
        let partListObj = { //ifSplitShip: false, //partListObj: this.allPartDetails, //itemTypeId: ''
            action: '', directionName: '', sequence: '', memo: '',
        }
        return partListObj;
    }

    private defualtEquipmentObj() {
        let partListObj = { //ifSplitShip: false, //partListObj: this.allPartDetails, //itemTypeId: ''
            partNumber: '', partDescription: '', itemClassification: '', qty: '',
        }
        return partListObj;
    }

    private defualtExclsuionObj() {
        let partListObj = { //ifSplitShip: false, //partListObj: this.allPartDetails, //itemTypeId: ''
            epn: '', epndescription: '', cost: '', notes: '', 
        }
        return partListObj;
    }

    private defualtExpertiseObj() {
        let partListObj = {
            //ifSplitShip: false, //partListObj: this.allPartDetails, //itemTypeId: ''
            expertiseType: '', estimatedHours: '', standardRate: '', estimatedRate: '',
        }
        return partListObj;
    }

	private defualtMaterialListobj() {
		let partListObj = {
			//ifSplitShip: false, //partListObj: this.allPartDetails, //itemTypeId: ''
			partNumber: '', partDescription: '', itemClassification: '', qty: '', uom: '', condition: '',
			unitcost: '', extcost: '', provision: '', deffered: '', figureId: '', actionId:''
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

	private ptnumberlistdata() {
		this.itemser.getPrtnumberslistList().subscribe(
			results => this.onptnmbersSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onptnmbersSuccessful(allWorkFlows: any[]) {
		this.allPartnumbersInfo = allWorkFlows;
	}

	private loadPartData() {
		this.vendorService.getPartDetails().subscribe(
			data => {
				this.allPartDetails = data[0];
				this.loadPartListData();
				if (this.vendorService.isEditMode == false) {

					for (let i = 0; i < this.partListData.length; i++) {
						this.partListData[i].partListObj = this.allPartDetails;
					}
				}
			})
	}

	private loadConditionData() {
		this.conditionService.getConditionList().subscribe(data => {
			this.allconditioninfo = data[0];
		})
	}

	private loadUOMData() {
		this.unitofmeasureService.getUnitOfMeasureList().subscribe(uomdata => {
			this.allUomdata = uomdata[0];
		})
	}

	private loadItemClassData() {
		this.itemClassService.getWorkFlows().subscribe(data => { this.itemClassInfo = data });
	}

	private loadPartListData() {
	}

	private onDataLoadFailed(error: any) {
    }

}