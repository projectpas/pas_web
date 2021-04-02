import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, Input } from '@angular/core';
import { ConditionService } from '../../../../services/condition.service';
import { Condition } from '../../../../models/condition.model';
import { fadeInOut } from '../../../../services/animations';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MultiSelectModule } from 'primeng/multiselect';
import { VendorService } from '../../../../services/vendor.service';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { AtaMainService } from '../../../../services/atamain.service';
import { ATAMain } from '../../../../models/atamain.model';
import { ATASubChapter } from '../../../../models/atasubchapter.model';
import { AtaSubChapter1Service } from '../../../../services/atasubchapter1.service';
import { ATAChapter } from '../../../../models/atachapter.model';
import { Router, ActivatedRoute } from '@angular/router';
import { getObjectById, editValueAssignByCondition, getValueFromObjectByKey, getValueFromArrayOfObjectById } from '../../../../generic/autocomplete';
import { CommonService } from '../../../../services/common.service';
import { AircraftModelService } from '../../../../services/aircraft-model/aircraft-model.service';
import { DashNumberService } from '../../../../services/dash-number/dash-number.service';
import { AuthService } from '../../../../services/auth.service';
import { VendorCapabilitiesService } from '../../../../services/vendorcapabilities.service';
declare var $ : any;
import { DatePipe } from '@angular/common';
import { ConfigurationService } from '../../../../services/configuration.service';
import { MenuItem } from 'primeng/api';

@Component({
	selector: 'app-add-vendor-capabilities',
	templateUrl: './add-vendor-capabilities.component.html',
	styleUrls: ['./add-vendor-capabilities.component.scss'],
	animations: [fadeInOut],
	providers: [DatePipe],
})
/** add-vendor-capabilities component*/
export class AddVendorCapabilitiesComponent implements OnInit {
	matSpinner: boolean;
	loadingIndicator: boolean;

	allATAMaininfo1: ATAMain[];
	allATAMaininfo: ATAChapter[];
	itemclaColl: any[];
	allVendors: any[] = [];
	VendorNamecoll: any[] = [];
	descriptionbyPart: any[] = [];
	capabilityTypeListDataColl: any[] = [];
	vendorCodes: any[];
	sourceVendorCap: any = {};
	disableSaveVenName: boolean;
	disableSaveVenderName: boolean;
	disableSave: boolean = true;
	selectedVendorActionName: any;
	vendorNames: any[];
	VendorCodesColl: any[] = [];
	disableSaveVenderCode: boolean;
	disableSaveVenCode: boolean;
	selectedVendorCode: any;
	allPartnumbersInfo: any[];
	selectedActionName: any;
	disableSavepartNumber: boolean;
	disableSavepartDescription: boolean;
	partCollection: any[];
	allaircraftInfo: any[];
	completeAircraftManfacturerData: any[];
	shiftValues: any[] = [];
	capabilityTypeList: any[] = [];
	modal: NgbModalRef;
	isSaving: boolean;
	selectedAircraftTypes: any;
	cols: any[];
	selectedAircraftDataModels: any[] = [];
	selectedColumns: any[];
	allAircraftinfo: any[];
	enablePopupData: boolean = false;
	selectedModels: any[] = [];
	currentVendorModels: any[] = [];
	showInput: boolean;
	allManufacturerInfo: any[];
	vendorCodeError: boolean;
	vendorNameError: boolean;
	vendorRankingError: boolean;
	partIdError: boolean;
	altPartNumber: boolean;
	partDescriptionError: boolean;
	capabulityTypeListDataError: boolean;
	pmaDerError: boolean;
	capabulityDescError: boolean;
	costError: boolean;
	tatError: boolean;
	manufacturerdataError: boolean;
	display: boolean;
	modelValue: boolean;
	collectionofVendorCapability: any;
	collectionofItemMaster: any;
	selectedCapabulityTypesListData: any;
	collectionofVendorCapabilityTypeList: any;
	collectionofVendorCapabulityAircraftTypeList: any;
	enablePlus: boolean = false;
	tempMemo: any;
	tempMemoLabel: any;
	isEditMode: boolean = false;
	manufacturerData: any[] = [];
	selectedAircraftId: any;
	newValue: any;
	loadValues: any[] = [];
	selectedModelId: any;
	selectedDashnumber: any;
	selectAircraftManfacturer: any = [];
	aircraftModelList: { label: string; value: number; }[] = [];
	aircraftManfacturerIdsUrl: any = '';
	aircraftModelsIdUrl: any = '';
	dashNumberIdUrl: any = '';
	memoUrl: any = '';
	selectedAircraftModel: any = [];
	selectedDashNumbers: any = [];
	selectedATAchapter: any = [];
	dashNumberList: any = [];
	searchAircraftParams: string = '';
	itemMasterId: number;
	aircraftListDataValues: any;
	CapabilityName: string = '';
	selectedCapabilityId: number;
	sselectedVendorName: string = '';
	sselectedVendorCode: string;
	selectedVendorId: number;
	@Input() isEnableVendor: boolean;
	vendorName: string;
	vendorCode: string;
	totalRecords: number = 0;
	totalPages: number = 0;
	pageSize: number = 10;
	pageIndex: number = 0;
	arrayVendorlist:any[] = [];
	arraylistItemMasterId:any[] = [];
	itemMasterlistCollectionOriginal: any[];
	arrayCapabilityTypelist:any[] = [];

	colsaircraftLD: any[] = [
		{ field: "aircraft", header: "Aircraft" },
		{ field: "model", header: "Model" },
		{ field: "dashNumber", header: "Dash Numbers" },
		{ field: "memo", header: "Memo" }
	];
	colaircraft: any[] = [
		{ field: "AircraftType", header: "Aircraft" },
		{ field: "AircraftModel", header: "Model" },
		{ field: "DashNumber", header: "Dash Numbers" },
	];
	modelUnknown = false;
	dashNumberUnknown = false;
	dashNumberUrl: any;
	loadDashnumber = [];
	newModelValue: any = [];
	newDashnumValue: any = [];
	aircraftData: any;
	viewTable: boolean = false;
	enableAircraftInfo: boolean = true;
	selectedAircraftInfo: boolean = false;
	selectedGeneralInfo: boolean = true;
	vendorCapabilityId: number;
	rowDataToDelete: any = {};
	@Input() vendorId: number = 0;
	@Input() vendorCapsId: number;
	editAirCraftData: any;
	isShowCaret: boolean = false;
	aircraftauditHisory = [];
	formData: any = new FormData();
	isSpinnerVisible: Boolean = false;
	vendorCodeandName: any;
	breadcrumbs: MenuItem[];

	/** add-vendor-capabilities ctor */
	constructor(private _route: Router, private modalService: NgbModal,
		private cd: ChangeDetectorRef,
		private datePipe: DatePipe,
		private configurations: ConfigurationService,
		public ataSubChapter1Service: AtaSubChapter1Service, public ataservice: AtaMainService, public vendorService: VendorService, private alertService: AlertService, public itemser: ItemMasterService, public commonService: CommonService, private aircraftModelService: AircraftModelService, private dashNumService: DashNumberService, private authService: AuthService, private _actRoute: ActivatedRoute, private vendorCapesService: VendorCapabilitiesService) {
	}

	ngOnInit(): void {
		this.matSpinner = false;

		this.breadcrumbs = [
			{ label: 'Vendor' },
		];

		if (!this.vendorId)
		{
			this.vendorService.ShowPtab = false;
			this.vendorService.alertObj.next(this.vendorService.ShowPtab);
		}

		this.vendorCapabilityId = this._actRoute.snapshot.params['id'];
		if (this.vendorCapabilityId != null && this.vendorCapabilityId != undefined) {
			this.isEditMode = true;
			this.enableAircraftInfo = false;
			this.getVendorCapabilitiesEdit(this.vendorCapabilityId);
			this.breadcrumbs = [...this.breadcrumbs, {
				label: this.isEditMode == true ? 'Edit Vendor Capability' : 'Create Vendor Capability' 
			}]
		}
		else{
			this.capabilityTypeListData();
			this.breadcrumbs = [...this.breadcrumbs, {
				label: this.isEditMode == true ? 'Edit Vendor Capability' : 'Create Vendor Capability' 
		}]
		} 
	}

	get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }


	getVendorCapabilitiesEdit(vendorCapesId) {
		this.isSpinnerVisible = true;
		this.vendorCapesService.getVendorCapabilitybyId(vendorCapesId).subscribe(res => {
			this.itemMasterId = res.itemMasterId;
			this.sselectedVendorName = res.vendorName;
			this.sselectedVendorCode = res.vendorCode;
			this.selectedVendorId = res.vendorId;
			this.sourceVendorCap = {
				...res,
			}
			this.arrayVendorlist.push(res.vendorId);
			this.arraylistItemMasterId.push(res.itemMasterId);
			this.arrayCapabilityTypelist.push(res.capabilityTypeId);
			this.capabilityTypeListData();
			this.loadVendorData('', res.vendorId);
			this.getItemMasterSmartDropDown('', res.itemMasterId);
			this.isSpinnerVisible = false;
		},err => { 
			this.onDataLoadFailed(err);
		})
	}

	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	// get all Aircraft Models
	getAllAircraftModels() {
		this.aircraftModelService.getAll().subscribe(models => {
			const responseValue = models[0];
			this.aircraftModelList = responseValue.map(models => {
				return {
					label: models.modelName,
					value: models.aircraftModelId
				};
			});
		});
	}

	// get all dashnumber
	getAllDashNumbers() {
		this.dashNumService.getAll().subscribe(dashnumbers => {
			const responseData = dashnumbers[0];
			this.dashNumberList = responseData.map(dashnumbers => {
				return {
					label: dashnumbers.dashNumber,
					value: dashnumbers.dashNumberId
				};
			});
		});
	}

	filterVendorNames(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loadVendorData(event.query, null); }
    }
    

	selectedVendorName(value) {		
		if (value.vendorId > 0) {
			this.getVendorCodeandNameByVendorId(value.vendorId);
		}
	}

	private manufacturerdata() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.itemser.getManufacturerList().subscribe(
			results => this.onmanufacturerSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onmanufacturerSuccessful(allWorkFlows: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allManufacturerInfo = allWorkFlows;
	}

	private onDataLoadFailed(error: any) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.isSpinnerVisible = false;
	}

	capabilityTypeListData(strText = ''){
		if(this.arrayCapabilityTypelist.length == 0) {
			this.arrayCapabilityTypelist.push(0); }
        this.commonService.autoSuggestionSmartDropDownList('CapabilityType', 'CapabilityTypeId', 'CapabilityTypeDesc',strText,true,200,this.arrayCapabilityTypelist.join()).subscribe(response => {
			this.capabilityTypeList = response;
		},err => {
			this.onDataLoadFailed(err);
		});
    }

	onDataLoadCapabilityTypeListDataSuccessful(capabilityTypeList: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.capabilityTypeListDataColl = capabilityTypeList;
		if (this.capabilityTypeListDataColl) {
			if (this.capabilityTypeListDataColl.length > 0) {
				for (let i = 0; i < this.capabilityTypeListDataColl.length; i++)
					this.capabilityTypeList.push(
						{ value: this.capabilityTypeListDataColl[i].capabilityTypeId, label: this.capabilityTypeListDataColl[i].description, capabilityDescription: this.capabilityTypeListDataColl[i].capabilityTypeDesc },
					);
			}
		}
	}
 
	bindCapsDesc(capabilityId, currentRecord) {
		currentRecord.capabilityTypeDescription = getValueFromArrayOfObjectById('label', 'value', capabilityId, this.capabilityTypeList);
	}

	private atamaindata() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.ataservice.getAtaMainList().subscribe(
			results => this.onDataLoadATAMainDataSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	onDataLoadATAMainDataSuccessful(getAtaMainList: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allATAMaininfo1 = getAtaMainList;
	}

	private onDataLoadAtaSubChapterDataSuccessful(data: any) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allATAMaininfo = data;
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

	getItemMasterSmartDropDown(strText = '', itemMasterId){
		if(this.arraylistItemMasterId.length == 0) {
			this.arraylistItemMasterId.push(0); }
        this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'PartNumber',strText,true,20,this.arraylistItemMasterId.join()).subscribe(response => {
			this.itemMasterlistCollectionOriginal = response;
			if(itemMasterId > 0)
			{
				this.sourceVendorCap = {
					...this.sourceVendorCap,
					value: getObjectById('value', itemMasterId, this.itemMasterlistCollectionOriginal),
				}
			}

			this.partCollection = this.itemMasterlistCollectionOriginal;
            this.allPartnumbersInfo = [...this.itemMasterlistCollectionOriginal];
		},err => {
			const errorLog = err;
			this.onDataLoadFailed(errorLog);
		});
    }

    filterPartNumber(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getItemMasterSmartDropDown(event.query, null); }
	}
	
	loadVendorData(strText = '', VendorId) {
        if(this.vendorId > 0)
			this.arrayVendorlist.push(this.vendorId);
		if(this.arrayVendorlist.length == 0) {			
            this.arrayVendorlist.push(0); }
        
        this.commonService.autoSuggestionSmartDropDownList('Vendor', 'VendorId', 'VendorName',strText,true,20,this.arrayVendorlist.join()).subscribe(response => {
            this.allVendors = response.map(x => {
                return {
                    vendorName: x.label, vendorId: x.value 
                }
            })                    
			this.vendorNames = this.allVendors;

			if(VendorId > 0)
			{
				this.sourceVendorCap = {
					...this.sourceVendorCap,
					vendorId: getObjectById('vendorId', VendorId, this.allVendors),
				}
			}
			
		if (this.vendorId) {
			this.getVendorCodeandNameByVendorId(this.vendorId);
		}
            
		},err => {
			const errorLog = err;
            this.onDataLoadFailed(errorLog);		
            this.isSpinnerVisible = false;
		});
	}
	
	getVendorCodeandNameByVendorId(vendorId)
    {
		if(vendorId > 0)
		{
			this.vendorService.getVendorCodeandNameByVendorId(vendorId).subscribe(
				res => {
						this.vendorCodeandName = res[0];
						this.vendorName = res[0].vendorName;
						this.vendorCode = res[0].vendorCode;
						this.sourceVendorCap.vendorCode = res[0].vendorCode;
				},err => {
					const errorLog = err;
					this.onDataLoadFailed(errorLog);
				});
		}        
    }

	onVendorselected(event) {
		for (let i = 0; i < this.VendorNamecoll.length; i++) {
			if (event == this.VendorNamecoll[i][0].vendorName) {
				this.sourceVendorCap.vendorName = this.VendorNamecoll[i][0].vendorName;
				this.sourceVendorCap.vendorId = this.VendorNamecoll[i][0].vendorId;
				this.sourceVendorCap.vendorCode = this.VendorNamecoll[i][0].vendorCode;
				this.disableSaveVenName = true;
				this.disableSave = true;
				this.disableSaveVenderName = true;
				this.selectedVendorActionName = event;
			}
		}
	}

	getPNDetailsById(value) {
		this.itemMasterId = editValueAssignByCondition('value', value);

		this.vendorService.getPartDetailsWithidForSinglePart(this.itemMasterId).subscribe(
			data => {
				if (data[0]) {
					this.sourceVendorCap.partNumber = data[0].partNumber;
					this.sourceVendorCap.partDescription = data[0].partDescription;
					this.sourceVendorCap.manufacturerId = data[0].manufacturerId;
					this.sourceVendorCap.manufacturerName = data[0].name;
					this.sourceVendorCap.itemMasterId = this.itemMasterId;
				}
			})
	}

	onVendorCodeselected(event) {
		for (let i = 0; i < this.VendorCodesColl.length; i++) {
			if (event == this.VendorCodesColl[i][0].vendorCode) {
				this.sourceVendorCap.vendorId = this.VendorCodesColl[i][0].vendorId;
				this.sourceVendorCap.vendorName = this.VendorCodesColl[i][0].vendorName; //passing Vendor Name
				this.disableSaveVenCode = true;
				this.disableSaveVenderCode = true;
				this.selectedVendorCode = event;
			}
		}
	}

	codeEventHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedVendorCode) {
				if (value == this.selectedVendorCode.toLowerCase()) {
					this.disableSaveVenCode = true;
					this.disableSaveVenderCode = true;

				}
				else {
					this.disableSaveVenCode = false;
					this.disableSaveVenderCode = false;
				}
			}

		}
	}

	partEventHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedActionName) {
				if (value == this.selectedActionName.toLowerCase()) {
					this.disableSavepartNumber = true;
				}
				else {
					this.disableSavepartNumber = false;
					this.sourceVendorCap.partDescription = "";
					this.disableSavepartDescription = false;
				}
			}

		}
	}

	//get ATA Chapter Alias ATA Subchapter1 Data
	getATASubChapterData(ataMainId) {
		this.vendorService.getATASubchapterData(ataMainId).subscribe( //calling and Subscribing for Address Data
			results => this.onDataLoadAtaSubChapterDataSuccessful(results[0]), //sending Address
			error => this.onDataLoadFailed(error)
		);
	}

	openModelPopups(content) {

		if (this.vendorService.isEditMode == false) {
			this.modal = this.modalService.open(content, { size: 'sm' });
			this.isSaving = true

			//Adding for Aircraft manafacturer List Has empty then List Should be null
			if (this.selectedAircraftTypes.length > 0) {
				var arr = this.selectedAircraftTypes;
				var selectedvalues = arr.join(",");
				this.itemser.getAircraftTypes(selectedvalues).subscribe(
					results => this.onDataLoadaircrafttypeSuccessful(results[0]),
					error => this.onDataLoadFailed(error)
				);
			}
			else {
				this.allAircraftinfo = []; //Making empty if selecting is null
			}

			this.cols = [
				{ field: 'description', header: 'Aircraft Type' },
				{ field: 'modelName', header: 'Model' },
			];
			this.selectedColumns = this.cols;
		}
	}


	private onDataLoadaircrafttypeSuccessful(allWorkFlows: any[]) //getting Models Based on Manfacturer Selection
	{
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.selectedAircraftDataModels = allWorkFlows; //selected Aircraft Models based on Aircraft Data Selection

		if (this.vendorService.isEditMode == false) {
			this.allAircraftinfo = allWorkFlows; //Totel Aircraft model Data Based on Aircraft Type
		}
		if (this.enablePopupData == true) {
			this.allAircraftinfo = allWorkFlows;
		}
		//for Open Model for Edit Data
		if (this.itemser.isEditMode == true) //in this we are Making all the Models and Getting Checked if data is thete with Item Master Id 
		{
			{

				for (let i = 0; i < this.currentVendorModels.length; i++) {
					for (let j = 0; j < this.allAircraftinfo.length; j++) {
						if (this.currentVendorModels[i].aircraftModelId == this.allAircraftinfo[j].aircraftModelId) {
							this.allAircraftinfo[j].priority = this.currentVendorModels[i].priority;
							this.allAircraftinfo[j].checkbox = this.currentVendorModels[i].checkbox;
						}
					}
				}
			}
		}

		if (this.selectedModels.length > 0) {

			let ischange1 = false;
			if (this.selectedModels.length > 0) {
				this.selectedModels.map((row) => {
					for (let i = 0; i < this.allAircraftinfo.length; i++) {
						if (this.allAircraftinfo[i].aircraftModelId == row.aircraftModelId) {
							this.allAircraftinfo[i].priority = row.priority;
							this.allAircraftinfo[i].checkbox = row.checkbox;
							ischange1 = true;
						}
					}

				});
			}
		}
	}

	public saveSelectedModel(selectedRow, indeex) {
		selectedRow.isBoolean = indeex;
		let ischange = false;
		if (this.selectedModels.length > 0) {
			this.selectedModels.map((row) => {
				if (selectedRow.aircraftModelId == row.aircraftModelId) {
					ischange = true;
				}
			});
		}
		if (!ischange) {
			this.selectedModels.push(selectedRow);
		}
	}

	public getSelectedItem(selectedRow, event) {
		let ischange = false;
		if (this.selectedModels.length > 0) {
			this.selectedModels.map((row) => {
				if (selectedRow.aircraftModelId == row.aircraftModelId) {
					row.dashNumber = event.target.value;
					ischange = true;
				}
			});
		}
		if (!ischange) {
			this.selectedModels.push(selectedRow);
		}
	}

	saveAircraftmodelinfo(partid, itemid, data) {

		for (let i = 0; i < data.length; i++) {
			data[i].itemMasterId = itemid;
			this.itemser.saveAircraftinfo(data[i]).subscribe(aircraftdata => {
				this.collectionofItemMaster = aircraftdata;
			})
		}
	}

	saveVendorCapsclose()
	{
		if (!this.sourceVendorCap.vendorCode) {
			this.vendorCodeError = true;
		}
		else {
			this.vendorCodeError = false;
		}

		if (!this.sourceVendorCap.vendorName) {
			this.vendorNameError = true;
		}
		else {
			this.vendorNameError = false;
		}

		if (!this.sourceVendorCap.vendorRanking) {
			this.vendorRankingError = true;
		}
		else {
			this.vendorRankingError = false;
		}

		if (!this.sourceVendorCap.partId) {
			this.partIdError = true;
		}
		else {
			this.partIdError = false;
		}

		if (!this.sourceVendorCap.partDescription) {
			this.partDescriptionError = true;
		}
		else {
			this.partDescriptionError = false;
		}

		if (!this.selectedCapabulityTypesListData) {
			this.capabulityTypeListDataError = true;
		}
		else {
			this.capabulityTypeListDataError = false;
		}

		if (!this.sourceVendorCap.isPMADER) {
			this.pmaDerError = true;
		}
		else {
			this.pmaDerError = false;
		}

		if (!this.sourceVendorCap.capabilityDescription) {
			this.capabulityDescError = true;
		}
		else {
			this.capabulityDescError = false;
		}

		if (!this.sourceVendorCap.cost) {
			this.costError = true;
		}
		else {
			this.costError = false;
		}
		if (!this.sourceVendorCap.tat) {
			this.tatError = true;
		}
		else {
			this.tatError = false;
		}

		if (!this.sourceVendorCap.manufacturerId) {
			this.manufacturerdataError = true;
		}
		else {
			this.manufacturerdataError = false;
		}

		if (
			(!this.sourceVendorCap.vendorCode) || (!this.sourceVendorCap.vendorName)
			|| (!this.sourceVendorCap.vendorRanking) || (!this.sourceVendorCap.partId)
			|| (!this.sourceVendorCap.partDescription) || (!this.selectedCapabulityTypesListData) || (!this.sourceVendorCap.isPMADER)
			|| (!this.sourceVendorCap.capabilityDescription) || (!this.sourceVendorCap.cost) || (!this.sourceVendorCap.tat) || (!this.sourceVendorCap.manufacturerId)
		) {
			this.display = true;
			this.disableSave = true;

			this.modelValue = true;
		}

		if (this.sourceVendorCap.vendorCode && this.sourceVendorCap.vendorName && this.sourceVendorCap.vendorRanking && this.sourceVendorCap.partId
			&& this.sourceVendorCap.partDescription && this.selectedCapabulityTypesListData && this.sourceVendorCap.isPMADER
			&& this.sourceVendorCap.capabilityDescription && this.sourceVendorCap.cost && this.sourceVendorCap.tat && this.sourceVendorCap.manufacturerId) {
			if (!this.sourceVendorCap.vendorCapabilityId) //for Edit Screen
			{
				this.sourceVendorCap.masterCompanyId = this.currentUserMasterCompanyId;
				this.sourceVendorCap.itemTypeId = 1;

				this.vendorService.newVendorCapability(this.sourceVendorCap).subscribe(data => {
					this.collectionofVendorCapability = data;
					this.savesuccessCompleted(this.sourceVendorCap);

					if (data != null) {
						if (this.selectedCapabulityTypesListData) {

							for (let i = 0; i < this.selectedCapabulityTypesListData.length; i++) {
								let localCapabulityTypeColl = [{
									vendorCapabilityId: data.vendorCapabilityId,
									capabilityTypeId: this.selectedCapabulityTypesListData[i]
								}]
								this.vendorService.addVendorCapabilityTypeList(localCapabulityTypeColl[0]).subscribe(aircraftdata => {
									this.collectionofVendorCapabilityTypeList = aircraftdata;
								})
							}
						}

						if (this.selectedAircraftTypes) {
							for (let i = 0; i < this.selectedAircraftTypes.length; i++) {
								let localCapabulityAircraftTypeColl = [{
									vendorCapabilityId: data.vendorCapabilityId,
									AircraftTypeId: this.selectedAircraftTypes[i]
								}]
								this.vendorService.addVendorCapabilityAircraftType(localCapabulityAircraftTypeColl[0]).subscribe(aircraftdata => {
									this.collectionofVendorCapabulityAircraftTypeList = aircraftdata;
								})
							}
						}
						if (this.selectedModels) {
							for (let i = 0; i < this.selectedModels.length; i++) {
								let localCapabulityAircraftModelColl = [{
									vendorCapabilityId: data.vendorCapabilityId,
									aircraftModelId: this.selectedModels[i].aircraftModelId,
									dashNumber: this.selectedModels[i].dashNumber,
									isSelected: true
								}]
								this.vendorService.addVendorCapabiltiyAircraftModel(localCapabulityAircraftModelColl[0]).subscribe(aircraftdata => {
									this.collectionofVendorCapabilityTypeList = aircraftdata;
								})
							}
						}
					}
					this.alertService.startLoadingMessage();
					this.savesuccessCompleted(this.sourceVendorCap);
					this._route.navigateByUrl('/vendorsmodule/vendorpages/app-vendor-capabilities-list')
				})
			}
		}
	}

	private savesuccessCompleted(user?: any) {
		this.isSaving = false;
		this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
	}

	isPMAorDER(value) {
		if (value == 'pma') {
			this.sourceVendorCap.isPMADER = 'PMA';
		}
		if (value == 'der') {
			this.sourceVendorCap.isPMADER = 'DER';
		}
	}

	onAddDescription(value) {
		this.tempMemo = '';
		if (value == 'capDesc') {
			this.tempMemoLabel = 'Cap Description';
			this.tempMemo = this.sourceVendorCap.capabilityDescription;
		}
		if (value == 'memo') {
			this.tempMemoLabel = 'Memo';
			this.tempMemo = this.sourceVendorCap.memo;
		}
	}

	onSaveDescription() {
		if (this.tempMemoLabel == 'Cap Description') {
			this.sourceVendorCap.capabilityDescription = this.tempMemo;
		}
		if (this.tempMemoLabel == 'Memo') {
			this.sourceVendorCap.memo = this.tempMemo;
		}
		this.disableSave = false;
		$("#add-description").modal("hide");
	}

	CancelVendorCapsGeneralInfo()
	{
		this._route.navigateByUrl('/vendorsmodule/vendorpages/app-vendor-capabilities-list')
	}

	saveVendorCapsGeneralInfo() {
		this.sselectedVendorName = getValueFromObjectByKey('vendorName', this.sourceVendorCap.vendorId);

		// var errmessage = '';

		// this.alertService.resetStickyMessage();	
        //     if(this.sourceVendorCap.tat == 0 || this.sourceVendorCap.tat == null) {	
		// 		this.isSpinnerVisible = false;	
		// 		errmessage = errmessage + "TAT values must be greater than zero."
        //     }
        //     if(this.sourceVendorCap.cost == 0 || this.sourceVendorCap.cost == null) {	
        //         this.isSpinnerVisible = false;	
        //         if(errmessage != '') {
        //             errmessage = errmessage + '<br />' + "Cost values must be greater than zero."
        //         }
        //         else
        //         {
        //             errmessage = errmessage + "Cost values must be greater than zero."
        //         }				
        //     }
        //     if(errmessage != '') {
		// 		this.alertService.showStickyMessage("Validation failed", errmessage, MessageSeverity.error, errmessage);
		// 		return;
		//     }

		if (this.vendorId != 0 && this.vendorId != undefined && this.vendorId != null) {
			this.sselectedVendorName = this.vendorName ? this.vendorName : '';
			this.sselectedVendorCode = this.vendorCode ? this.vendorCode : '';
		}
		this.sourceVendorCap.createdBy = this.userName,
		this.sourceVendorCap.updatedBy = this.userName,

		this.sourceVendorCap.CapabilityTypeName = getValueFromArrayOfObjectById('label', 'value', this.sourceVendorCap.capabilityTypeId, this.capabilityTypeList)

		let { vendorCode, partNumber, manufacturerName, ...res } = this.sourceVendorCap;
		res = {
			...res,
			vendorId: editValueAssignByCondition('vendorId', res.vendorId),
			partNumberId: editValueAssignByCondition('value', res.partNumberId),
			masterCompanyId: this.currentUserMasterCompanyId,
			manufacturerName: this.sourceVendorCap.manufacturerName,
			partNumber: this.sourceVendorCap.partNumber
		}
		if (this.vendorId != 0 && this.vendorId != undefined) {
			res = { ...res, vendorId: this.vendorId,  }
		}
		this.vendorService.newVendorCapability(res).subscribe(data => {
			this.sourceVendorCap.vendorCapabilityId = data.vendorCapabilityId;
			this.selectedVendorId = data.vendorId;
			// this.enableAircraftInfo = false;
			// this.selectedGeneralInfo = false;
			// this.selectedAircraftInfo = true;

			this.alertService.showMessage(
				'Success',
				'Saved General Information Successfully',
				MessageSeverity.success
			);
			this._route.navigateByUrl('/vendorsmodule/vendorpages/app-vendor-capabilities-list')
		}, error => this.onDataLoadFailed(error))
	}

	// get aircraft model by type 
	getAircraftModelByManfacturer(value) {
		this.newValue = value.originalEvent.target.textContent;
		if (this.newValue) {
			this.aircraftModelService.getAircraftModelListByManufactureId(this.selectedAircraftId).subscribe(models => {
				const responseValue = models[0];
				this.loadValues = responseValue.map(models => {
					return {
						label: models.modelName,
						value: models
					}
				});
			});
			this.selectedModelId = undefined;
			this.selectedDashnumber = undefined;
		}
	}

	searchByFieldUrlCreateforAircraftInformation() {
		if (this.selectAircraftManfacturer.length > 0) {
			const aircraftTypeIds = this.selectAircraftManfacturer.reduce(
				(acc, value) => {
					return `${acc},${value}`;
				},
				''
			);
			this.aircraftManfacturerIdsUrl = aircraftTypeIds.substr(1);
		} else {
			this.aircraftManfacturerIdsUrl = '';
		}

		if (this.selectedAircraftModel.length > 0) {
			const aircraftModelIds = this.selectedAircraftModel.reduce((acc, id) => {
				return `${acc},${id}`;
			}, '');
			this.aircraftModelsIdUrl = aircraftModelIds.substr(1);
		} else {
			this.aircraftModelsIdUrl = '';
		}
		if (this.selectedDashNumbers.length > 0) {
			const dashNumberIds = this.selectedDashNumbers.reduce((acc, id) => {
				return `${acc},${id}`;
			}, '');
			this.dashNumberIdUrl = dashNumberIds.substr(1);
		} else {
			this.dashNumberIdUrl = '';
		}

	}

	// get AircraftModels By manufacturer Type
	async getAircraftModelByManfacturerType() {
		// construct url from array
		await this.searchByFieldUrlCreateforAircraftInformation();
		// reset the dropdowns
		this.selectedAircraftModel = [];
		this.selectedDashNumbers = []
		// checks where multi select is empty or not and calls the service
		if (this.aircraftManfacturerIdsUrl !== '') {
			this.aircraftModelService
				.getAircraftModelListByManufactureId(this.aircraftManfacturerIdsUrl)
				.subscribe(models => {
					const responseValue = models[0];
					this.aircraftModelList = responseValue.map(models => {
						return {
							label: models.modelName,
							value: models.aircraftModelId
						};
					});
				});
		} else {
			this.getAllAircraftModels();
			this.getAllDashNumbers();
		}
	}

	async getDashNumberByManfacturerandModel() {
		// construct url from array
		await this.searchByFieldUrlCreateforAircraftInformation();
		// reset dropdown
		this.selectedDashNumbers = []
		// checks where multi select is empty or not and calls the service

		if (this.aircraftManfacturerIdsUrl !== '' && this.aircraftModelsIdUrl !== '') {
			this.dashNumService.getDashNumberByModelTypeId(
				this.aircraftModelsIdUrl,
				this.aircraftManfacturerIdsUrl
			).subscribe(dashnumbers => {
				const responseData = dashnumbers;
				this.dashNumberList = responseData.map(dashnumbers => {

					return {
						label: dashnumbers.dashNumber,
						value: dashnumbers.dashNumberId
					};
				});
			});
		}
	}

	//  search aircraft information by all parameter
	async searchAircraftInformation() {
		await this.searchByFieldUrlCreateforAircraftInformation();
		this.searchAircraftParams = '';

		// checks where multi select is empty or not and calls the service		
		if (
			this.aircraftManfacturerIdsUrl !== '' &&
			this.aircraftModelsIdUrl !== '' &&
			this.dashNumberIdUrl !== '' &&
			this.memoUrl !== ''
		) {
			this.searchAircraftParams = `aircraftTypeID=${this.aircraftManfacturerIdsUrl}&aircraftModelID=${this.aircraftModelsIdUrl}&dashNumberId=${this.dashNumberIdUrl}&memo=${this.memoUrl}`;
		}
		else if (
			this.aircraftManfacturerIdsUrl !== '' &&
			this.aircraftModelsIdUrl !== '' &&
			this.memoUrl !== ''
		) {
			this.searchAircraftParams = `aircraftTypeID=${this.aircraftManfacturerIdsUrl}&aircraftModelID=${this.aircraftModelsIdUrl}&memo=${this.memoUrl}`;
		}
		else if (
			this.aircraftManfacturerIdsUrl !== '' &&
			this.memoUrl !== ''
		) {
			this.searchAircraftParams = `aircraftTypeID=${this.aircraftManfacturerIdsUrl}&memo=${this.memoUrl}`;
		}
		else if (
			this.aircraftManfacturerIdsUrl !== '' &&
			this.aircraftModelsIdUrl !== '' &&
			this.dashNumberIdUrl !== ''
		) {
			this.searchAircraftParams = `aircraftTypeID=${this.aircraftManfacturerIdsUrl}&aircraftModelID=${this.aircraftModelsIdUrl}&dashNumberId=${this.dashNumberIdUrl}`;
		}
		else if (
			this.aircraftManfacturerIdsUrl !== '' &&
			this.aircraftModelsIdUrl !== ''
		) {
			this.searchAircraftParams = `aircraftTypeID=${this.aircraftManfacturerIdsUrl}&aircraftModelID=${this.aircraftModelsIdUrl}`;
		}
		else if (this.aircraftManfacturerIdsUrl !== '') {
			this.searchAircraftParams = `aircraftTypeID=${this.aircraftManfacturerIdsUrl}`;
		}
		else if (this.aircraftModelsIdUrl !== '') {
			this.searchAircraftParams = `aircraftModelID=${this.aircraftModelsIdUrl}`;
		}
		else if (this.dashNumberIdUrl !== '') {
			this.searchAircraftParams = `dashNumberId=${this.dashNumberIdUrl}`;
		}
		else if (this.memoUrl !== '') {
			this.searchAircraftParams = `memo=${this.memoUrl}`;
		}
if(this.isShowCaret==false)this.searchAircraftParams = '';
		this.vendorCapesService.searchAirMappedByMultiTypeIdModelIDDashID(this.vendorCapabilityId ? this.vendorCapabilityId :this.sourceVendorCap.vendorCapabilityId, this.searchAircraftParams).subscribe(res => {
			this.aircraftListDataValues = res.map(x => {
				return {
					...x,
					aircraft: x.aircraftType,
					model: x.aircraftModel,
					dashNumber: x.dashNumber,
					memo: x.memo,
				}
			})
		});
	}

	selectedDashnumbervalue(value) {
		this.newDashnumValue = value.originalEvent.target.textContent;
	}

	// get dashNumbers by Type and Model 
	getDashNumberByTypeandModel(value) {

		this.newModelValue = value.originalEvent.target.textContent;
		this.dashNumberUrl = this.selectedModelId.reduce((acc, obj) => {

			return `${acc},${obj.aircraftModelId}`
		}, '')
		this.dashNumberUrl = this.dashNumberUrl.substr(1);

		this.dashNumService.getDashNumberByModelTypeId(this.dashNumberUrl, this.selectedAircraftId).subscribe(dashnumbers => {
			const responseData = dashnumbers;
			this.loadDashnumber = responseData.map(dashnumbers => {
				return {
					label: dashnumbers.dashNumber,
					value: dashnumbers.dashNumberId
				}
			});
		});
	}

	getAircraftMappedDataByItemMasterId() {
		// check whether edit or create and send and passes ItemMasterId
		this.vendorCapesService.getVendorAircraftGetDataByCapsId(this.sourceVendorCap.vendorCapabilityId).subscribe(data => {
			const responseData = data;
			this.aircraftListDataValues = responseData.map(x => { //aircraftListData
				return {
					...x,
					aircraft: x.aircraftType,
					model: x.aircraftModel,
					dashNumber: x.dashNumber,
					memo: x.memo,
				}
			})
		})
	}

	deleteAircraft(rowData) {
		this.rowDataToDelete = rowData;
	}

	deleteAircraftMapped() {
		const { vendorCapabilityAircraftId } = this.rowDataToDelete;
		this.vendorCapesService.deleteAirCraft(vendorCapabilityAircraftId, this.userName).subscribe(res => {
			this.getAircraftMappedDataByItemMasterId();
			this.alertService.showMessage(
				'Success',
				`Deleted Successfully`,
				MessageSeverity.success
			);
		})
		$("#aircraftDelete").modal("hide");
	}

	resetAircraftModelsorDashNumbers() {
		if (this.modelUnknown) {
			this.selectedModelId = undefined;
			this.selectedDashnumber = undefined;
		}
		if (this.dashNumberUnknown) {
			this.selectedDashnumber = undefined;
		}
	}

	mapAircraftInformation() {
		this.viewTable = true;
		if (this.selectedAircraftId !== undefined && this.selectedModelId !== undefined && this.selectedDashnumber !== undefined) {
			this.dashNumService.getAllDashModels(this.dashNumberUrl, this.selectedAircraftId, this.selectedDashnumber).subscribe(aircraftdata => {
				const responseValue = aircraftdata;
				this.aircraftData = responseValue.map(x => {
					return {
						AircraftType: x.aircraft,
						AircraftModel: x.model,
						DashNumber: x.dashNumber,
						AircraftModelId: x.modelid,
						DashNumberId: x.dashNumberId,
						Memo: '',
						IsChecked: false
					}
				})
			})
		}

		if (this.selectedAircraftId !== undefined && this.modelUnknown) {
			this.aircraftData = [{
				AircraftType: this.newValue,
				AircraftModel: 'Unknown',
				DashNumber: 'Unknown',
				AircraftModelId: 0,
				DashNumberId: 0,
				Memo: '',
				IsChecked: false
			}]
		}

		if (this.selectedAircraftId !== undefined && this.selectedModelId !== undefined && this.dashNumberUnknown) {
			this.aircraftData = this.selectedModelId.map(x => {
				return {
					AircraftType: this.newValue,
					AircraftModel: x.modelName,
					DashNumber: 'Unknown',
					AircraftModelId: x.aircraftModelId,
					DashNumberId: 0,
					Memo: '',
					IsChecked: false
				}
			})
		}
	}

	saveAircraft() {
		const data = this.aircraftData.map(obj => {
			return {
				...obj,
				DashNumberId: obj.DashNumber === 'Unknown' ? 0 : obj.DashNumberId,
				AircraftModelId: obj.AircraftModel === 'Unknown' ? 0 : obj.AircraftModelId,
				MasterCompanyId: this.currentUserMasterCompanyId,
				CreatedBy: this.userName,
				UpdatedBy: this.userName,
				CreatedDate: new Date(),
				UpdatedDate: new Date(),
				AircraftTypeId: this.selectedAircraftId,
				VendorCapabilityId: this.sourceVendorCap.vendorCapabilityId,
				IsActive: true,
				IsDeleted: false

			}
		})
		// posting the DashNumber Mapped data from Popup
		// Used to get the Data Posted in the Popup
		this.vendorCapesService.newIVendorAircarftClass(data).subscribe(datas => {
			this.alertService.showMessage(
				'Success',
				'Mapped Aircraft Information Successfully',
				MessageSeverity.success
			);
			this.aircraftData = undefined;
			this.selectedAircraftId = undefined;
			this.selectedModelId = undefined;
			this.selectedDashnumber = undefined;
			this.dashNumberUnknown = false;
			this.modelUnknown = false;

			this.getAircraftMappedDataByItemMasterId();

		}, err => {
			const errorLog = err;

			this.errorMessageHandler(errorLog);
			// reset poupup aircraft information
			this.aircraftData = undefined;
			this.selectedAircraftId = undefined;
			this.selectedModelId = undefined;
			this.selectedDashnumber = undefined;
			this.dashNumberUnknown = false;
			this.modelUnknown = false;
		})
		$("#ModalDashNumber").modal("hide");
	}

	errorMessageHandler(log) {
		this.alertService.showMessage(
			'Error',
			log.error,
			MessageSeverity.error
		);
	}

	onAddAircraftInfo() {
		this.aircraftData = undefined;
		this.selectedAircraftId = undefined;
		this.selectedModelId = undefined;
		this.selectedDashnumber = undefined;
		this.dashNumberUnknown = false;
		this.modelUnknown = false;
	}
	dismissMemoModel() {
		$("#add-description").modal("hide");
	}
	dismissAircraftModel() {
		$("#ModalDashNumber").modal("hide");
	}
	dismissDeleteModel() {
		$("#aircraftDelete").modal("hide");
	}
	closehistoryModel(){
		$("#contentAuditHist").modal("hide");	
	}
	getVendorName() {
		if (this.sselectedVendorName !== undefined && this.vendorName ==undefined) {
			return editValueAssignByCondition('vendorName', this.sselectedVendorName);
		}else {
			return this.vendorName;
		}
	}

	getPageCount(totalNoofRecords, pageSize) {

		return Math.ceil(totalNoofRecords / pageSize)
	}
	enableSave() {
		this.disableSave = false;

	}
	editAirCraft(rowData) {
		this.editAirCraftData = { ...rowData };
	}
	updateAircraft() {
		const { vendorCapabilityAircraftId, memo } = this.editAirCraftData;
		this.vendorCapesService.vendorAircraftupdateMemo(vendorCapabilityAircraftId, memo, this.userName).subscribe(res => {
			$('#editAirCraftDetailsCapes').modal('hide');
			this.getAircraftMappedDataByItemMasterId();
			this.alertService.showMessage(
				'Success',
				'Updated Mapped Aircraft Information Successfully',
				MessageSeverity.success
			);
		})
		this.disableSave = true;
	}
	closeModelForEditAircraft() {
		$('#editAirCraftDetailsCapes').modal('hide');
		this.editAirCraftData = undefined;

	}
	advancedSearchBoolean(value) {
		if (value === false) {
			this.isShowCaret = true;
			this.searchAircraftInformation();
		} else {
			this.isShowCaret = false;
			this.searchAircraftInformation();
		}
		this.selectAircraftManfacturer = [];
		this.selectedAircraftModel = [];
		this.selectedDashNumbers = [];
		this.memoUrl = '';

	}
	getAuditHistoryForAuditHistory(rowData) {
		const { vendorCapabilityAircraftId } = rowData;
		this.vendorCapesService.auditHistoryForAircraft(vendorCapabilityAircraftId).subscribe(res => {
			this.aircraftauditHisory = res;
		}, err => {
			this.aircraftauditHisory = [];
		})
	}
	getColorCodeForHistory(i, field, value) {
		const data = this.aircraftauditHisory;
		const dataLength = data.length;
		if (i >= 0 && i <= dataLength) {
			if ((i + 1) === dataLength) {
				return true;
			} else {
				return data[i + 1][field] === value
			}
		}
	}
	customExcelUpload(event) {
		const file = event.target.files;
		if (file.length > 0) {

			this.formData.append('file', file[0]);
			this.formData.append('VendorCapabilityId', this.sourceVendorCap.vendorCapabilityId);
			this.formData.append('VendorId', this.selectedVendorId ? this.selectedVendorId : this.vendorId);
			this.vendorCapesService.uploadAircraftInfoFile(this.formData).subscribe(res => {
				event.target.value = '';
				this.formData = new FormData();
				this.alertService.showMessage(
					'Success',
					`Successfully Uploaded  `,
					MessageSeverity.success
				);
			})
		}

	}
	sampleExcelDownload() {
		const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=VendorCapabilityAircraft&fileName=VendorCapabilityAircraft.xlsx`;

		window.location.assign(url);
	}
}