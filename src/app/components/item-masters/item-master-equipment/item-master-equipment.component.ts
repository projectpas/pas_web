
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { fadeInOut } from '../../../services/animations';
import { MasterCompany } from '../../../models/mastercompany.model';
import { AuditHistory } from '../../../models/audithistory.model';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { Router, NavigationExtras } from '@angular/router';
import { CustomerClassification } from '../../../models/customer-classification.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GMapModule } from 'primeng/gmap';
import { AddActionsDialogComponent } from '../../dialogs/add-actions-dialog/add-actions-dialog.component';

import { FileUploadModule } from 'primeng/fileupload';
import { Message } from 'primeng/components/common/message';
import { CustomerClassificationService } from '../../../services/CustomerClassification.service';
import { Integration } from '../../../models/integration.model';
import { IntegrationService } from '../../../services/integration-service';
import { DialogModule } from 'primeng/dialog';

import { BaseRowDef } from '@angular/cdk/table';
import { ItemClassificationService } from '../../../services/item-classfication.service';
import { ItemClassificationModel } from '../../../models/item-classification.model';
import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { Itemgroup } from '../../../models/item-group.model';
import { ItemGroupService } from '../../../services/item-group.service';
import { Provision } from '../../../models/provision.model';
import { ProvisionService } from '../../../services/provision.service';
import { ATAMain } from '../../../models/atamain.model';
import { AtaMainService } from '../../../services/atamain.service';
import { Priority } from '../../../models/priority.model';
import { PriorityService } from '../../../services/priority.service';
import { Currency } from '../../../models/currency.model';
import { CurrencyService } from '../../../services/currency.service';
import { UnitOfMeasureService } from '../../../services/unitofmeasure.service';
import { UnitOfMeasure } from '../../../models/unitofmeasure.model';
import { LegalEntityService } from '../../../services/legalentity.service';
import { ATAChapter } from '../../../models/atachapter.model';
@Component({
	selector: 'app-item-master-equipment',
	templateUrl: './item-master-equipment.component.html',
	styleUrls: ['./item-master-equipment.component.scss']
})
/** item-master-stock component*/
export class ItemMasterEquipmentComponent implements OnInit {
	EquipmentDelete: boolean = false;;
	EquipmentView: boolean = false;;
	EquipmentAdd: boolean = false;
	EquipmentUpdate: boolean = false;
	NonstockDelete: boolean = false;;
	NonstockView: boolean = false;;
	NonstockAdd: boolean = false;;
	NonstockUpdate: boolean = false;
	Delete: boolean = false;
	View: boolean = false;
	Add: boolean = false;
	Update: boolean = false;
	allRolesInfo: any[]=[];
	modelValue: boolean =	false;
	display: boolean = false;
	disableSaveglAccount: boolean;
	disableSaveManufacturer: boolean;
	selectedManufacturer: any;
	showLable: boolean;
	collectionofItemMaster: any;
	component: boolean = false;
	partcla: any[];
	selectedActionName: any;
	equipmentName: string;
	allequipmentsInfo: any;
	itemColl: any;
	equipCollection: any[];
	partCollection: any[];
	bulist: any[] = [];
	bulistovh: any[] = [];
	departmentList: any[] = [];
	departmentListovh: any[] = [];
	divisionlist: any[] = [];
	divisionlistovh: any[] = [];
	maincompanylist: any[] = [];
	itemclaColl: any;
	allPartnumbersInfo: any[];
	glAccountcla: any[];
	glAccountCollection: any[];
	name: string;
	allManufacturerInfo: any[];
	sourcemanufacturer: any = {};
	localmanufacturer: any[];
	Name: string;
	manufacturerName: string;
	allActions: any[];
	provisionName: string;
	shiftValues: any[] = [];
	allaircraftInfo: any[];
	allAircraftinfo: any[];
	selectedAircraftTypes: any;
	allWarninginfo: any[];
	localunit: any[];
	partNumber: any;
	unitName: string;
	allCountryInfo: any[];
	allCurrencyInfo: any[];
	localpriority: any[];
	priorityName: string;
	allglAccountInfo: any[];
	integrationName: string;
	localintegration: any[];
	allIntegrationInfo: Integration[];
	localatamain: any[];
	ataChapterName: string;
	localprovision: any[] = [];
	localgroup: any[] = [];
	allProvisonInfo: Provision[];
	itemGroupName: string;
	enablePopupData: boolean = false;
	allCapesData: any[] = [];
	enablePlus: boolean = false;
	allAircraftsGet: any[] = [];
	manfacturerAircraftmodelsarray: any[] = [];
	overhaulAircraftmodelsarray: any[] = [];
	distributionAircraftmodelsarray: any[] = [];
	repairAircraftmodelsarray: any[] = [];
	certificationarrayAircraftmodelsarray: any[] = [];
	exchangeAircraftmodelsarray: any[] = [];
	capesCollection: any[] = [];
	selectedModels: any[] = [];
	itemType: any;
	description: any;
	item_Name: any;
	memo: any = "";
	createdBy: any = "";
	updatedBy: any = "";
	createdDate: any = "";
	updatedDate: any = "";
	auditHisory: AuditHistory[];

	@ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
	@ViewChild(MatSort,{static:false}) sort: MatSort;
	cols: any[];
	selectedColumns: any[];
	displayedColumns = ['itemclassificationId', 'itemclassificationCode', 'description', 'memo'];
	//, 'Sequence', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'
	dataSource: MatTableDataSource<ItemClassificationModel>;

	allitemclassificationInfo: ItemClassificationModel[];
	allComapnies: MasterCompany[] = [];
	allitemgroupobjInfo: Itemgroup[];
	private isSaving: boolean;
	public sourceAction: any = {};
	//public sourceItem: Itemgroup;
	//public sourceprovision: Provision;
	//public sourceAction: Priority;
	// public sourceatamain: ATAMain;
	// sourceUnit: UnitOfMeasure;
	//sourceintegratn: Integration;
	allATAMaininfo: ATAChapter[];
	allPriorityInfo: Priority[];
	allUnitOfMeasureinfo: UnitOfMeasure[];
	private bodyText: string;
	loadingIndicator: boolean;
	closeResult: string;
	selectedColumn: ItemClassificationModel[];
	equipmentId: any;
	title: string = "Create";
	isEnabeCapes: boolean = false;
	id: number;
	showInput: boolean;
	errorMessage: any;
	Active: string = "Active";
	modal: NgbModalRef;
	itemName: string;
	filteredBrands: any[];
	localCollection: any[] = [];
	sourceItemMaster: any = {};
	standAlone: any;
	private isEditMode: boolean = false;
	private isDeleteMode: boolean = false;
	allManagemtninfo: any[] = [];
	allAircraftManufacturer: any[] = [];
	constructor(public workFlowtService1: LegalEntityService,private authService: AuthService, public unitService: UnitOfMeasureService, private modalService: NgbModal, public itemser: ItemMasterService, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public ataMainSer: AtaMainService, public currency: CurrencyService, public priority: PriorityService, public inteService: IntegrationService, public workFlowtService: ItemClassificationService, public itemservice: ItemGroupService, public proService: ProvisionService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private router: Router, public itemMasterService: ItemMasterService) {
		this.displayedColumns.push('action');
		this.dataSource = new MatTableDataSource();
		this.itemser.currentUrl = '/itemmastersmodule/itemmasterpages/app-item-master-equipment';
		this.itemser.bredcrumbObj.next(this.itemser.currentUrl);//Bread Crumb
		
		if (this.itemser.listEquipmentCollection  && this.itemser.isEditMode == true) {

			
			this.showLable = true;
			this.sourceItemMaster = this.itemser.listEquipmentCollection;
			if (this.sourceItemMaster.standAloneEquipment == false) { this.component = true; }
			else { this.component = false; }
			
			//this.sourceItemMaster.memo = this.itemser.listEquipmentCollection.memo;
			//this.sourceItemMaster.toleranceMinimum = this.itemser.listEquipmentCollection.toleranceMinimum;
			//this.sourceItemMaster.toleranceMaximum = this.itemser.listEquipmentCollection.toleranceMaximum;
			//this.sourceItemMaster.toleranceExpected = this.itemser.listEquipmentCollection.toleranceExpected; 
			//this.sourceItemMaster.findings = this.itemser.listEquipmentCollection.findings;
			//if (this.itemser.listEquipmentCollection.part) {
			//	this.sourceItemMaster.partNumber = this.itemser.listEquipmentCollection.part.partNumber;
			//	this.sourceItemMaster.parentPartId = this.itemser.listEquipmentCollection.part.parentPartId;
			//	this.sourceItemMaster.partdescription = this.itemser.listEquipmentCollection.part.description;
			//}
			this.sourceItemMaster.partdescription = this.itemser.listEquipmentCollection.partDescription;

			if (this.sourceItemMaster.expirationDate == "0001-01-01T00:00:00" || this.sourceItemMaster.expirationDate == undefined || this.sourceItemMaster.expirationDate == "undefined") {
				this.sourceItemMaster.expirationDate = new Date();
			}
			else {
				this.sourceItemMaster.expirationDate = new Date(this.sourceItemMaster.expirationDate);
			}
		}



	}


	ngOnInit(): void {
		this.loadRolesData();
		this.loadManagementdata();
		this.itemclass();
		this.itemgroup();
		this.provisiondata();
		this.atamaindata();
		this.integrationData();
	    this.priorityData();
		this.CurrencyData();
		this.countryData();
		this.unitofmeasure();
		this.warningdata();
		this.aircraftmodelData();
		this.loadData();
		this.manufacturerdata();
		this.ptnumberlistdata();
		this.glAccountlistdata();
		this.getAircraftModelsData();
		this.getCpaesData();
		this.cols = [
			//{ field: 'itemClassificationId', header: 'Item Classification ID' },

		];
		this.selectedColumns = this.cols;
		this.itemser.currentUrl = '/itemmastersmodule/itemmasterpages/app-item-master-equipment';
		this.itemser.bredcrumbObj.next(this.itemser.currentUrl);//Bread Crumb
		this.sourceItemMaster.standAloneEquipment = true;
	}


	

	getAircraftModelsData(): any {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.itemser.getAircaftList(this.sourceItemMaster.itemMasterId).subscribe(
			results => this.onAircarftmodelloadsuccessfull(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	getCpaesData(): any {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.itemser.getCpaesData(this.sourceItemMaster.itemMasterId).subscribe(
			results => this.OnCapesLoadSuccessfull(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	getBUList(selItem, masterCompanyId) {
		let _bulist = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == masterCompanyId) {
				_bulist.push(this.allManagemtninfo[i]);
			}
		}
		selItem["bulist"] = _bulist;
		console.log(this.bulist);

	}
	getBUListovh(selItem, masterCompanyId) {
		let _bulist = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == masterCompanyId) {
				_bulist.push(this.allManagemtninfo[i]);
			}
		}
		selItem["bulistovh"] = _bulist;
		console.log(this.bulist);
	}
	getBUListDistribution(selItem, masterCompanyId) {
		//debugger;
		let _bulist = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == masterCompanyId) {
				_bulist.push(this.allManagemtninfo[i]);
			}
		}
		selItem["bulistdistribution"] = _bulist;
		console.log(this.bulist);
	}
	getBUListcertificate(selItem, masterCompanyId) {
		let _bulist = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == masterCompanyId) {
				_bulist.push(this.allManagemtninfo[i]);
			}
		}
		selItem["bulistcertificate"] = _bulist;
		console.log(this.bulist);
	}
	getBUListexcahnge(selItem, masterCompanyId) {
		let _bulist = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == masterCompanyId) {
				_bulist.push(this.allManagemtninfo[i]);
			}
		}
		selItem["bulistexcahnge"] = _bulist;
		console.log(this.bulist);
	}
	getBUListrepair(selItem, masterCompanyId) {
		let _bulist = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == masterCompanyId) {
				_bulist.push(this.allManagemtninfo[i]);
			}
		}
		selItem["bulistrepair"] = _bulist;
		console.log(this.bulist);
	}



	getDepartmentlistrepair(selItem, buid) {
		let _departmentList = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == buid) {
				_departmentList.push(this.allManagemtninfo[i]);
			}
		}
		selItem["departmentListrepair"] = _departmentList;
		console.log(this.departmentList);
	}
	getDepartmentlist(selItem, buid) {
		let _departmentList = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == buid) {
				_departmentList.push(this.allManagemtninfo[i]);
			}
		}
		selItem["departmentList"] = _departmentList;
		console.log(this.departmentList);
	}
	getDepartmentlistdistribution(selItem, buid) {
		let _departmentList = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == buid) {
				_departmentList.push(this.allManagemtninfo[i]);
			}
		}
		selItem["departmentListdistribution"] = _departmentList;
		console.log(this.departmentList);
	}
	getDepartmentlistovh(selItem, buid) {
		let _departmentList = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == buid) {
				_departmentList.push(this.allManagemtninfo[i]);
			}
		}
		selItem["departmentListovh"] = _departmentList;
		console.log(this.departmentList);
	}
	getDepartmentlistcertificate(selItem, buid) {
		let _departmentList = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == buid) {
				_departmentList.push(this.allManagemtninfo[i]);
			}
		}
		selItem["departmentListcertificate"] = _departmentList;
		console.log(this.departmentList);
	}
	getDepartmentlistexcahnge(selItem, buid) {
		let _departmentList = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == buid) {
				_departmentList.push(this.allManagemtninfo[i]);
			}
		}
		selItem["departmentListexcahnge"] = _departmentList;
		console.log(this.departmentList);
	}



	getDivisionlist(selItem, depid) {
		let _divisionlist = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == depid) {
				_divisionlist.push(this.allManagemtninfo[i]);
			}
		}
		selItem["divisionlist"] = _divisionlist;
		console.log(this.divisionlist);
	}
	getDivisionlistcertificate(selItem, depid) {
		let _divisionlist = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == depid) {
				_divisionlist.push(this.allManagemtninfo[i]);
			}
		}
		selItem["divisionlistcertificate"] = _divisionlist;
		console.log(this.divisionlist);
	}
	getDivisionlistdistrubution(selItem, depid) {
		let _divisionlist = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == depid) {
				_divisionlist.push(this.allManagemtninfo[i]);
			}
		}
		selItem["divisionlistdistribution"] = _divisionlist;
		console.log(this.divisionlist);
	}
	getDivisionlistovh(selItem, depid) {
		let _divisionlist = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == depid) {
				_divisionlist.push(this.allManagemtninfo[i]);
			}
		}
		selItem["divisionlistovh"] = _divisionlist;
		console.log(this.divisionlist);
	}
	getDivisionlistexcahnge(selItem, depid) {
		let _divisionlist = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == depid) {
				_divisionlist.push(this.allManagemtninfo[i]);
			}
		}
		selItem["divisionlistexcahnge"] = _divisionlist;
		console.log(this.divisionlist);
	}
	getDivisionlistrepair(selItem, depid) {
		let _divisionlist = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == depid) {
				_divisionlist.push(this.allManagemtninfo[i]);
			}
		}
		selItem["divisionlistrepair"] = _divisionlist;
		console.log(this.divisionlist);
	}

	private onAircarftmodelloadsuccessfull(allWorkFlows: any[]) {
		//;
		for (let i = 0; i < allWorkFlows.length; i++) {
			allWorkFlows[i].checkbox = true;
		}
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allAircraftsGet = allWorkFlows;
		if (this.allAircraftsGet) {
			this.enablePlus = true;
			this.allAircraftinfo = JSON.parse(JSON.stringify(this.allAircraftsGet));
			//this.manfacturerAircraftmodelsarray = [];
			//this.distributionAircraftmodelsarray = [];
			//this.overhaulAircraftmodelsarray = [];
			//this.certificationarrayAircraftmodelsarray = [];
			//this.repairAircraftmodelsarray = [];
			//this.exchangeAircraftmodelsarray = [];
			this.isDeleteMode = false;
			this.isEditMode = false;
			//this.modal.close();
			this.isEnabeCapes = true;
			//this.manfacturerAircraftmodelsarray = JSON.parse(JSON.stringify(this.allAircraftinfo));
			//this.distributionAircraftmodelsarray = JSON.parse(JSON.stringify(this.allAircraftinfo));
			//this.overhaulAircraftmodelsarray = JSON.parse(JSON.stringify(this.allAircraftinfo));
			//this.certificationarrayAircraftmodelsarray = JSON.parse(JSON.stringify(this.allAircraftinfo));
			//this.repairAircraftmodelsarray = JSON.parse(JSON.stringify(this.allAircraftinfo));
			//this.exchangeAircraftmodelsarray = JSON.parse(JSON.stringify(this.allAircraftinfo));
		}

		//console.log(this.allActions);


	}

	private loadManagementdata() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.workFlowtService1.getManagemententity().subscribe(
			results => this.onManagemtntdataLoad(results[0]),
			error => this.onDataLoadFailed(error)
		);


	}
	private onManagemtntdataLoad(getAtaMainList: any[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getAtaMainList;
		this.allManagemtninfo = getAtaMainList;
		for (let i = 0; i < this.allManagemtninfo.length; i++) {

			if (this.allManagemtninfo[i].parentId == null) {
				this.maincompanylist.push(this.allManagemtninfo[i]);

			}

			//console.log(this.maincompanylist);
		}


	}
	private OnCapesLoadSuccessfull(allWorkFlows: any[]) {
		//
		this.manfacturerAircraftmodelsarray = [];
		this.distributionAircraftmodelsarray = [];
		this.overhaulAircraftmodelsarray = [];
		this.certificationarrayAircraftmodelsarray = [];
		this.repairAircraftmodelsarray = [];
		this.exchangeAircraftmodelsarray = [];
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allCapesData = allWorkFlows;
		if (this.allCapesData) {
			for (let i = 0; i < this.allCapesData.length; i++) {
				if (this.allCapesData[i].capabilityTypeId == 1) {
					//this.manfacturerAircraftmodelsarray = [];
					this.getBUList(this.allCapesData[i], this.allCapesData[i].masterComapnyId1);
					this.getDepartmentlist(this.allCapesData[i], this.allCapesData[i].buid1);
					this.getDivisionlist(this.allCapesData[i], this.allCapesData[i].depid1);
					this.manfacturerAircraftmodelsarray.push(JSON.parse(JSON.stringify(this.allCapesData[i])));

				}

				else if (this.allCapesData[i].capabilityTypeId == 2) {
					//this.overhaulAircraftmodelsarray = [];
					this.getBUListovh(this.allCapesData[i], this.allCapesData[i].masterComapnyId1);
					this.getDepartmentlistovh(this.allCapesData[i], this.allCapesData[i].buid1);
					this.getDivisionlistovh(this.allCapesData[i], this.allCapesData[i].depid1);
					this.overhaulAircraftmodelsarray.push(JSON.parse(JSON.stringify(this.allCapesData[i])));

				}
				else if (this.allCapesData[i].capabilityTypeId == 3) {
					//this.distributionAircraftmodelsarray = [];
					this.getBUListDistribution(this.allCapesData[i], this.allCapesData[i].masterComapnyId1);
					this.getDepartmentlistdistribution(this.allCapesData[i], this.allCapesData[i].buid1);
					this.getDivisionlistdistrubution(this.allCapesData[i], this.allCapesData[i].depid1);
					this.distributionAircraftmodelsarray.push(JSON.parse(JSON.stringify(this.allCapesData[i])));

				}
				else if (this.allCapesData[i].capabilityTypeId == 4) {
					//this.certificationarrayAircraftmodelsarray = [];
					this.getBUListcertificate(this.allCapesData[i], this.allCapesData[i].masterComapnyId1);
					this.getDepartmentlistcertificate(this.allCapesData[i], this.allCapesData[i].buid1);
					this.getDivisionlistcertificate(this.allCapesData[i], this.allCapesData[i].depid1);
					this.certificationarrayAircraftmodelsarray.push(JSON.parse(JSON.stringify(this.allCapesData[i])));

				}
				else if (this.allCapesData[i].capabilityTypeId == 5) {
					//this.repairAircraftmodelsarray = [];
					this.getBUListrepair(this.allCapesData[i], this.allCapesData[i].masterComapnyId1);
					this.getDepartmentlistrepair(this.allCapesData[i], this.allCapesData[i].buid1);
					this.getDivisionlistrepair(this.allCapesData[i], this.allCapesData[i].depid1);
					this.repairAircraftmodelsarray.push(JSON.parse(JSON.stringify(this.allCapesData[i])));

				}
				else if (this.allCapesData[i].capabilityTypeId == 6) {
					//this.exchangeAircraftmodelsarray = [];
					this.getBUListexcahnge(this.allCapesData[i], this.allCapesData[i].masterComapnyId1);
					this.getDepartmentlistexcahnge(this.allCapesData[i], this.allCapesData[i].buid1);
					this.getDivisionlistexcahnge(this.allCapesData[i], this.allCapesData[i].depid1);
					this.exchangeAircraftmodelsarray.push(JSON.parse(JSON.stringify(this.allCapesData[i])));

				}



				//console.log(this.manfacturerAircraftmodelsarray);


			}
		}

		//console.log(this.allActions);


	}
	public allWorkFlows: any[] = [];

	private itemclass() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.workFlowtService.getWorkFlows().subscribe(
			results => this.onDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}

	private manufacturerdata() {

		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.itemser.getManufacturerList().subscribe(
			results => this.onManufacturerSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}
	private onManufacturerSuccessful(allWorkFlows: any[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allManufacturerInfo = allWorkFlows;
	}
	private loadRolesData() {
		//this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.itemMasterService.getRolesData().subscribe(
			results => this.onRolesLoadSuccessfull(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}
	private onRolesLoadSuccessfull(allWorkFlows: any[]) {
		//debugger;
		//this.selectedColumns = this.cols;
		this.allRolesInfo = allWorkFlows;
		if (this.allRolesInfo.length > 0) {

			for (let i = 0; i < this.allRolesInfo.length; i++) {

				if (this.allRolesInfo[i].entityName = 'ItemMasterMain') {

					if (this.allRolesInfo[i].permittedEditActionDescription = 'Add') {
						this.EquipmentAdd = true;
						
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'View') {
						
						this.EquipmentView = true;
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'Delete') {
						
						this.EquipmentDelete = true;
					}

				}
				
				if (this.allRolesInfo[i].screenName == 'Equipment') {
					if (this.allRolesInfo[i].permittedEditActionDescription = 'Add') {
						this.EquipmentAdd = true;
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'View') {
						this.EquipmentView = true;
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'Delete') {
						this.EquipmentDelete = true;
					}
				}
				if (this.allRolesInfo[i].fieldName == 'All Other Fields') {
					if (this.allRolesInfo[i].permittedEditActionDescription = 'Add') {
						this.EquipmentAdd = true;
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'View') {
						this.EquipmentView = true;
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'Delete') {
						this.EquipmentDelete = true;
					}
				}
			}
		}

	}
	
	private glAccountlistdata() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;
		let value = "Stock";
		this.itemser.getItemStockList(value).subscribe(
			results => this.onglAccountSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	//private purchaseDiscountOffListPrice() {
	//	this.loadingIndicator = true;
	//}

	private onglAccountSuccessful(allWorkFlows: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allglAccountInfo = allWorkFlows;

	}
	private loadData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.itemser.getItemMasterList().subscribe(
			results => this.onitemmasterSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onitemmasterSuccessful(allWorkFlows: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allActions = allWorkFlows;


		//console.log(this.allActions);




	}


	private equipmentdata() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.itemser.geteuipmentList().subscribe(
			results => this.onequipmentSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onequipmentSuccessful(allWorkFlows: any) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allequipmentsInfo = allWorkFlows;


		//console.log(this.allActions);


	}

	private ptnumberlistdata() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.itemser.getPrtnumberslistList().subscribe(
			results => this.onptnmbersSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onptnmbersSuccessful(allWorkFlows: any) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allPartnumbersInfo = allWorkFlows;


		//console.log(this.allActions);


	}



	private warningdata() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.itemser.getWarningdata().subscribe(
			results => this.onwarningSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}

	private onwarningSuccessful(allWorkFlows: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allWarninginfo = allWorkFlows;
	}


	private countryData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.itemser.getCountrydata().subscribe(
			results => this.onDataLoadcountrySuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}

	private unitofmeasure() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.unitService.getUnitOfMeasureList().subscribe(
			results => this.onDataunitSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}

	private onDataunitSuccessful(getUnitOfMeasureList: UnitOfMeasure[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		// this.dataSource.data = getUnitOfMeasureList;
		this.allUnitOfMeasureinfo = getUnitOfMeasureList;
	}
	private onDataLoadcountrySuccessful(allWorkFlows: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allCountryInfo = allWorkFlows;
	}

	private CurrencyData() {
		// ;
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.currency.getCurrencyList().subscribe(
			results => this.oncurrencySuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}
	private oncurrencySuccessful(getCreditTermsList: Currency[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		//this.dataSource.data = getCreditTermsList;

		this.allCurrencyInfo = getCreditTermsList;
	}


	private priorityData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.priority.getPriorityList().subscribe(
			results => this.onprioritySuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}
	private itemgroup() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.itemservice.getWorkFlows().subscribe(
			results => this.onDataitemSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}
	private onprioritySuccessful(getPriorityList: Priority[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		// this.dataSource.data = getPriorityList;
		this.allPriorityInfo = getPriorityList;
	}
	private atamaindata() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.ataMainSer.getAtaMainList().subscribe(
			results => this.onSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onSuccessful(getAtaMainList: ATAChapter[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		//this.dataSource.data = getAtaMainList;
		this.allATAMaininfo = getAtaMainList;
	}

	private integrationData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.inteService.getWorkFlows().subscribe(
			results => this.onDatainteSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}
	private onDatainteSuccessful(allWorkFlows: Integration[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		//this.dataSource.data = allWorkFlows;
		this.allIntegrationInfo = allWorkFlows;
	}

	private provisiondata() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.proService.getProvisionList().subscribe(
			results => this.onprodataSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onprodataSuccessful(getProvisionList: Provision[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		//this.dataSource.data = getProvisionList;
		this.allProvisonInfo = getProvisionList;
	}

	private onDataitemSuccessful(allWorkFlows: Itemgroup[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		// this.dataSource.data = allWorkFlows;
		this.allitemgroupobjInfo = allWorkFlows;
	}

	private loadMasterCompanies() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.masterComapnyService.getMasterCompanies().subscribe(
			results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}

	public applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue;
	}

	private refresh() {
		// Causes the filter to refresh there by updating with recently added data.
		this.applyFilter(this.dataSource.filter);
	}
	private onDataLoadSuccessful(allWorkFlows: ItemClassificationModel[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allitemclassificationInfo = allWorkFlows;
	}

	private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allComapnies = allComapnies;

	}

	private onDataLoadFailed(error: any) {
		// alert(error);
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;

	}

	Manufacturer(content) {

		this.isEditMode = false;
		this.isDeleteMode = false;

		this.isSaving = true;
		this.loadMasterCompanies();
		//this.sourceAction = new UnitOfMeasure();
		this.sourceAction.isActive = true;
		this.name = "";
		this.modal = this.modalService.open(content, { size: 'sm' });
		this.modal.result.then(() => {



			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	unitmeasure(content) {

		this.isEditMode = false;
		this.isDeleteMode = false;

		this.isSaving = true;
		this.loadMasterCompanies();
		this.sourceAction = new UnitOfMeasure();
		this.sourceAction.isActive = true;
		this.unitName = "";
		this.modal = this.modalService.open(content, { size: 'sm' });
		this.modal.result.then(() => {



			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	private aircraftmodelData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.itemser.getAircraft().subscribe(
			results => this.onDataLoadaircraftmodelSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}


	private onDataLoadaircraftmodelSuccessful(allWorkFlows: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allaircraftInfo = allWorkFlows;
		if (this.allaircraftInfo) {
			if (this.allaircraftInfo.length > 0) {
				for (let i = 0; i < this.allaircraftInfo.length; i++)
					this.shiftValues.push(
						{ value: this.allaircraftInfo[i].aircraftTypeId, label: this.allaircraftInfo[i].description },

					);
			}
			let valAirCraft = [];
			//we are Passing Customer Id for getting Edit Data and make it check 
			this.itemser.getAircaftManafacturerList(this.sourceItemMaster.itemMasterId)
				.subscribe(results => {
					this.allAircraftManufacturer = results[0];
					if (results != null) {
						for (let i = 0; i < this.allAircraftManufacturer.length; i++) {
							valAirCraft.push(this.allAircraftManufacturer[i].aircraftTypeId);
						}
						this.selectedAircraftTypes = valAirCraft; //if there is Aircraft Data with ItemMasterId that will be Checked 
						console.log(this.selectedAircraftTypes);
					}
				},
					error => this.onDataLoadFailed(error)
				);
		}
	}

	openModelPopups(content) {

		//alert(this.itemser.isEditMode);
		if (this.itemser.isEditMode == false) {
			this.modal = this.modalService.open(content, { size: 'sm' });
			this.isSaving = true
			this.modal.result.then(() => {



				console.log('When user closes');
			}, () => { console.log('Backdrop click') })

			var arr = this.selectedAircraftTypes;
			var selectedvalues = arr.join(",");
			this.itemser.getAircraftTypes(selectedvalues).subscribe(
				results => this.onDataLoadaircrafttypeSuccessful(results[0]),
				error => this.onDataLoadFailed(error)
			);
			this.cols = [
				//{ field: 'customerClassificationId', header: 'Customer Classification ID' },
				{ field: 'description', header: 'Aircraft Type' },
				{ field: 'modelName', header: 'Model' },


			];
			this.selectedColumns = this.cols;
		}
		if (this.itemser.isEditMode == true) {

			this.modal = this.modalService.open(content, { size: 'sm' });
			this.modal.result.then(() => {

				console.log('When user closes');
			}, () => { console.log('Backdrop click') })
			if (this.allAircraftinfo) {
				if (this.allAircraftinfo.length >= 0) {
					this.enablePopupData = true;
					var arr = this.selectedAircraftTypes;
					if (this.selectedAircraftTypes) {
						var selectedvalues = arr.join(",");
						//this.loadData();
						this.itemser.getAircraftTypes(selectedvalues).subscribe(
							results => this.onDataLoadaircrafttypeSuccessful(results[0]),
							error => this.onDataLoadFailed(error)

						)
					}
				}
			}
		}
	}
	openCapes(content) {
		this.modal = this.modalService.open(content, { size: 'lg' });
		this.modal.result.then(() => {



			console.log('When user closes');
		}, () => { console.log('Backdrop click') })

	}
	saverange(selectedRow) {

		let ischange = false;
		if (this.selectedModels.length > 0) {
			this.selectedModels.map((row) => {
				if (selectedRow.aircraftModelId == row.aircraftModelId) {
					row = selectedRow;
					ischange = true;
				}
			});
		}
		if (!ischange) {
			this.selectedModels.push(selectedRow);
		}

	}

	//private onDataLoadaircrafttypeSuccessful(allWorkFlows: any[]) {

	//    this.alertService.stopLoadingMessage();
	//    this.loadingIndicator = false;
	//    this.dataSource.data = allWorkFlows;
	//    this.allAircraftinfo = allWorkFlows;

	//}
	private onDataLoadaircrafttypeSuccessful(allWorkFlows: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		if (this.itemser.isEditMode == false) {
			this.allAircraftinfo = allWorkFlows;
		}
		if (this.enablePopupData == true) {
			this.allAircraftinfo = allWorkFlows;
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
			//if (!ischange1) {
			//	this.selectedModels.push(selectedRow);
			//}

		}

	}

    itemclassification(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;

        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new ItemClassificationModel();
        this.sourceAction.isActive = true;
        this.itemName = "";
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {



            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }


    priorty(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;

        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new Priority();
        this.sourceAction.isActive = true;
        this.priorityName = "";
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {



            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    atamai(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;

        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new ATAMain();
        this.sourceAction.isActive = true;
        this.ataChapterName = "";
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {



            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }


    item(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;

        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new Itemgroup();
        this.sourceAction.isActive = true;
        this.itemGroupName = "";
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {



            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }


    waning(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;

        this.isSaving = true;
        this.loadMasterCompanies();
        //this.sourceAction = new this.warningName();
        //this.sourceAction.isActive = true;

        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {



            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    provisionope(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;

        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new Provision();
        this.sourceAction.isActive = true;

        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {



            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    integratn(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;

        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new Integration();
        this.sourceAction.isActive = true;
        this.integrationName = "";
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }




    openDelete(content, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openEdit(content, row) {

        this.isEditMode = true;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = row;
        this.itemName = this.sourceAction.itemClassificationCode;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openHist(content, row) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;


        this.sourceAction = row;



        this.isSaving = true;

        this.workFlowtService.historyAcion(this.sourceAction.itemClassificationId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => this.saveFailedHelper(error));


	}


	ManufacturerHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedManufacturer) {
				if (value == this.selectedManufacturer.toLowerCase()) {
					//alert("Action Name already Exists");
					this.disableSaveManufacturer = true;

				}
				else {
					this.disableSaveManufacturer = false;

				}
			}

		}
	}

	Manufacturerdescription(event) {
		//;
		if (this.allManufacturerInfo) {

			for (let i = 0; i < this.allManufacturerInfo.length; i++) {
				if (event == this.allManufacturerInfo[i].name) {
					this.sourcemanufacturer.name = this.allManufacturerInfo[i].name;
					this.disableSaveManufacturer = true;

					this.selectedManufacturer = event;
				}

			}
		}
	}


	glAccountHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedActionName) {
				if (value == this.selectedActionName.toLowerCase()) {
					//alert("Action Name already Exists");
					this.disableSaveglAccount = true;

				}
				else {
					this.disableSaveglAccount = false;

				}
			}

		}
	}
	glAccountId(event) {
		//
		if (this.glAccountcla) {
			for (let i = 0; i < this.glAccountcla.length; i++) {
				if (event == this.glAccountcla[i][0].glAccountId) {
					this.sourceItemMaster.ItemMasterId = this.itemclaColl[i][0].ItemMasterId;
				}
			}
		}
	}

	filterglAccount(event) {

		this.glAccountCollection = [];
		this.glAccountcla = [];
		if (this.allglAccountInfo) {
			for (let i = 0; i < this.allglAccountInfo.length; i++) {
				let glAccountId = this.allglAccountInfo[i].glAccountId;

				if (glAccountId) {
					this.glAccountCollection.push(glAccountId);
				}
			}
		}
	}
    filterItems(event) {

		this.localCollection = [];
		if (this.allitemclassificationInfo) {
			for (let i = 0; i < this.allitemclassificationInfo.length; i++) {
				let itemName = this.allitemclassificationInfo[i].itemClassificationCode;
				if (itemName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.localCollection.push(itemName);
				}
			}
		}
    }

    filterUnitOfMeasures(event) {

		this.localunit = [];
		if (this.allUnitOfMeasureinfo) {
			for (let i = 0; i < this.allUnitOfMeasureinfo.length; i++) {
				let unitName = this.allUnitOfMeasureinfo[i].description;
				if (unitName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.localunit.push(unitName);
				}
			}
		}
    }

    filterItemgroups(event) {

		this.localgroup = [];
		if (this.allitemgroupobjInfo) {
			for (let i = 0; i < this.allitemgroupobjInfo.length; i++) {
				let itemGroupName = this.allitemgroupobjInfo[i].itemGroupCode;
				if (itemGroupName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.localgroup.push(itemGroupName);
				}
			}
		}
    }

    filterprovisions(event) {

		this.localprovision = [];
		if (this.allProvisonInfo) {
			for (let i = 0; i < this.allProvisonInfo.length; i++) {
				let provisionName = this.allProvisonInfo[i].description;
				if (provisionName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.localprovision.push(provisionName);
				}
			}
		}
    }

    filterpriorities(event) {

		this.localpriority = [];
		if (this.allPriorityInfo) {
			for (let i = 0; i < this.allPriorityInfo.length; i++) {
				let priorityName = this.allPriorityInfo[i].description;
				if (priorityName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.localpriority.push(priorityName);
				}
			}
		}
    }

    filterAtamains(event) {

		this.localatamain = [];
		if (this.allATAMaininfo) {
			for (let i = 0; i < this.allATAMaininfo.length; i++) {
				let ataChapterName = this.allATAMaininfo[i].ataChapterName;
				if (ataChapterName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.localatamain.push(ataChapterName);
				}
			}
		}
    }

    filterintegrations(event) {

		this.localintegration = [];
		if (this.allIntegrationInfo) {
			for (let i = 0; i < this.allIntegrationInfo.length; i++) {
				let integrationName = this.allIntegrationInfo[i].description;
				if (integrationName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.localintegration.push(integrationName);
				}
			}
		}
    }



    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.workFlowtService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
            //alert(e);
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.workFlowtService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
            //alert(e);
        }

    }
    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {


        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.auditHisory = auditHistory;


        this.modal = this.modalService.open(content, { size: 'lg' });

        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })


    }


    editItemAndCloseModel() {

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.itemClassificationCode = this.itemName;
            this.sourceAction.masterCompanyId = 1;
            this.workFlowtService.newAction(this.sourceAction).subscribe(
                role => this.saveSuccessHelper(role),
				error => this.saveFailedHelper(error));
			
        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.itemClassificationCode = this.itemName;
            this.sourceAction.masterCompanyId = 1;
            this.workFlowtService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        // this.modal.close();
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.workFlowtService.deleteAcion(this.sourceAction.itemClassificationId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
		this.modal.close();
		
	}

	
    private saveCompleted(user?: any) {
        this.isSaving = false;

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);

        }

        this.itemclass();
    }


    openView(content, row) {

        this.sourceAction = row;
        this.item_Name = row.itemClassificationCode;
        this.description = row.description;
        this.itemType = row.itemType;
        this.memo = row.memo;
        this.createdBy = row.createdBy;
        this.updatedBy = row.updatedBy;
        this.createdDate = row.createdDate;
        this.updatedDate = row.updatedDate;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    private saveSuccessHelper(role?: any) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);

        this.itemclass();

    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    saveitemclassification() {

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.itemClassificationCode = this.itemName;
            this.sourceAction.masterCompanyId = 1;
            this.workFlowtService.newAction(this.sourceAction).subscribe(data => { this.itemclass() })
            //role => this.saveSuccessHelper(role),
            //error => this.saveFailedHelper(error));
        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.itemClassificationCode = this.itemName;
            this.sourceAction.masterCompanyId = 1;
            this.workFlowtService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        //this.modal.close();
    }

    saveitemgroup() {

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.itemGroupCode = this.itemGroupName;
            this.sourceAction.masterCompanyId = 1;
            this.itemservice.newAction(this.sourceAction).subscribe(data => { this.itemgroup() })
        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.itemGroupCode = this.itemGroupName;
            this.sourceAction.masterCompanyId = 1;
            this.itemservice.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        // this.modal.close();
    }

    saveprovision() {

        // ;

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.provisionName;
            this.sourceAction.masterCompanyId = 1;
            this.proService.newProvision(this.sourceAction).subscribe(data => { this.provisiondata() })

        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.provisionName;
            this.sourceAction.masterCompanyId = 1;
            this.proService.updateProvision(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        // this.modal.close();
    }
    saveatamain() {

        // ;

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.masterCompanyId = 1;
            this.sourceAction.ataChapterName = this.ataChapterName;
            this.ataMainSer.newATAMain(this.sourceAction).subscribe(data => { this.atamaindata() })

        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.ataChapterName = this.ataChapterName;
            this.sourceAction.masterCompanyId = 1;
            this.ataMainSer.updateATAMain(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        this.modal.close();
    }
    saveunitofmeasure() {

        // ;

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.unitName;
            this.sourceAction.masterCompanyId = 1;
            this.unitService.newUnitOfMeasure(this.sourceAction).subscribe(data => { this.unitofmeasure() })

        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.unitName;
            this.sourceAction.masterCompanyId = 1;
            this.unitService.updateUnitOfMeasure(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        // this.modal.close();
    }
    savepriority() {

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.priorityName;
            this.priority.newPriority(this.sourceAction).subscribe(data => { this.priorityData() })

        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.priorityName;
            this.priority.updatePriority(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        //this.modal.close();
    }

    saveintegration() {

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.integrationName;
            this.inteService.newAction(this.sourceAction).subscribe(data => { this.integrationData() })

        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.integrationName;
            this.inteService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        //this.modal.close();
    }

    savewarnings() {

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.itemser.newWarning(this.sourceAction).subscribe(
                role => this.saveSuccessHelper(role),
                error => this.saveFailedHelper(error));
        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.itemser.updateItemMaster(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        // this.modal.close();
    }
    setValue(value) {
        if (value == "standalone") {
			this.component = false;
		
        }
        else if (value == "component") {
            this.component = true;
        }
	}


	
	saveitemMasterclose() {
		// ;
		if (this.component == false) {
			if (!( this.sourceItemMaster.partNumber && this.sourceItemMaster.partdescription && this.sourceItemMaster.assetId && this.sourceItemMaster.glAccountId && this.sourceItemMaster.currencyId && this.sourceItemMaster.equipmentUOMId)) {
				this.display = true;
				this.modelValue = true;
			}
		}
		if (this.component  == true) {
			if (!(this.sourceItemMaster.parentPartId &&this.sourceItemMaster.partNumber && this.sourceItemMaster.partdescription && this.sourceItemMaster.assetId && this.sourceItemMaster.glAccountId && this.sourceItemMaster.currencyId && this.sourceItemMaster.equipmentUOMId)) {
				this.display = true;
				this.modelValue = true;
			}
		}
		if (this.component == false) {
			if ((this.sourceItemMaster.partNumber && this.sourceItemMaster.partdescription && this.sourceItemMaster.assetId && this.sourceItemMaster.glAccountId && this.sourceItemMaster.currencyId && this.sourceItemMaster.equipmentUOMId)) {

				this.isSaving = true;

				if (!this.sourceItemMaster.itemMasterId) {
					this.sourceItemMaster.createdBy = this.userName;
					this.sourceItemMaster.updatedBy = this.userName;
					// this.sourceAction.defaultMessageCode = this.messageName;
					this.sourceItemMaster.masterCompanyId = 1;
					this.sourceItemMaster.itemTypeId = 3;
					this.itemser.newItemMaster(this.sourceItemMaster).subscribe(data => {
						this.collectionofItemMaster = data;
						if (data != null) {
							if (data.partId && data.itemMasterId) {
								// if (this.manfacturerAircraftmodelsarray.length >= 0) {
								// 	this.savemfginfo(data.partId, data.itemMasterId, this.manfacturerAircraftmodelsarray);
								// }
								// if (this.distributionAircraftmodelsarray.length >= 0) {
								// 	this.saveDistrbution(data.partId, data.itemMasterId, this.distributionAircraftmodelsarray);
								// }

								// if (this.overhaulAircraftmodelsarray.length >= 0) {
								// 	this.saveovhinfo(data.partId, data.itemMasterId, this.overhaulAircraftmodelsarray);
								// }
								// if (this.repairAircraftmodelsarray.length >= 0) {
								// 	this.saverepairinfo(data.partId, data.itemMasterId, this.repairAircraftmodelsarray);
								// }
								// if (this.certificationarrayAircraftmodelsarray.length >= 0) {
								// 	this.savecertification(data.partId, data.itemMasterId, this.certificationarrayAircraftmodelsarray);
								// }
								// if (this.exchangeAircraftmodelsarray.length >= 0) {
								// 	this.saveexcahneginfo(data.partId, data.itemMasterId, this.exchangeAircraftmodelsarray);
								// }
								if (this.selectedModels.length > 0) {

									this.saveAircraftmodelinfo(data.partId, data.itemMasterId, this.selectedModels);

								}
							}
						}
						this.AddCustomerAircraftdata(this.collectionofItemMaster); 
						this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-list')
						//this.value = 1;


					})
					if (this.selectedAircraftTypes != null) //separting Array whic is having ","
					{
						this.sourceItemMaster.AircraftTypeId = this.selectedAircraftTypes.toString().split(",");
					}

				}
				else {
					if (this.selectedAircraftTypes != null) //separting Array whic is having ","
					{
						this.sourceItemMaster.AircraftTypeId = this.selectedAircraftTypes.toString().split(",");
					}

					this.sourceItemMaster.updatedBy = this.userName;
					//this.sourceItemMaster.defaultMessageCode = this.messageName;
					this.sourceItemMaster.masterCompanyId = 1;
					this.itemser.updateEquipment(this.sourceItemMaster).subscribe(data => {
						this.collectionofItemMaster = data;
						this.saveCompleted(this.sourceItemMaster);
						if (data != null) {
							if (data.partId && data.itemMasterId) {
								// if (this.manfacturerAircraftmodelsarray.length >= 0) {
								// 	this.savemfginfo(data.partId, data.itemMasterId, this.manfacturerAircraftmodelsarray);
								// }
								// if (this.distributionAircraftmodelsarray.length >= 0) {
								// 	this.saveDistrbution(data.partId, data.itemMasterId, this.distributionAircraftmodelsarray);
								// }

								// if (this.overhaulAircraftmodelsarray.length >= 0) {
								// 	this.saveovhinfo(data.partId, data.itemMasterId, this.overhaulAircraftmodelsarray);
								// }
								// if (this.repairAircraftmodelsarray.length >= 0) {
								// 	this.saverepairinfo(data.partId, data.itemMasterId, this.repairAircraftmodelsarray);
								// }
								// if (this.certificationarrayAircraftmodelsarray.length >= 0) {
								// 	this.savecertification(data.partId, data.itemMasterId, this.certificationarrayAircraftmodelsarray);
								// }
								// if (this.exchangeAircraftmodelsarray.length >= 0) {
								// 	this.saveexcahneginfo(data.partId, data.itemMasterId, this.exchangeAircraftmodelsarray);
								// }
								if (this.selectedModels.length > 0) {

									this.saveAircraftmodelinfo(data.partId, data.itemMasterId, this.selectedModels);

								}
							}
						}

					})
				}


			}
			else { }

		}

		if (this.component == true) {
			if ((this.sourceItemMaster.partNumber && this.sourceItemMaster.partdescription && this.sourceItemMaster.assetId && this.sourceItemMaster.glAccountId && this.sourceItemMaster.currencyId && this.sourceItemMaster.equipmentUOMId)) {

				this.isSaving = true;

				if (!this.sourceItemMaster.itemMasterId) {
					this.sourceItemMaster.createdBy = this.userName;
					this.sourceItemMaster.updatedBy = this.userName;
					// this.sourceAction.defaultMessageCode = this.messageName;
					this.sourceItemMaster.masterCompanyId = 1;
					this.sourceItemMaster.itemTypeId = 3;
					this.itemser.newItemMaster(this.sourceItemMaster).subscribe(data => {
						this.collectionofItemMaster = data;
						if (data != null) {
							if (data.partId && data.itemMasterId) {
								// if (this.manfacturerAircraftmodelsarray.length >= 0) {
								// 	this.savemfginfo(data.partId, data.itemMasterId, this.manfacturerAircraftmodelsarray);
								// }
								// if (this.distributionAircraftmodelsarray.length >= 0) {
								// 	this.saveDistrbution(data.partId, data.itemMasterId, this.distributionAircraftmodelsarray);
								// }

								// if (this.overhaulAircraftmodelsarray.length >= 0) {
								// 	this.saveovhinfo(data.partId, data.itemMasterId, this.overhaulAircraftmodelsarray);
								// }
								// if (this.repairAircraftmodelsarray.length >= 0) {
								// 	this.saverepairinfo(data.partId, data.itemMasterId, this.repairAircraftmodelsarray);
								// }
								// if (this.certificationarrayAircraftmodelsarray.length >= 0) {
								// 	this.savecertification(data.partId, data.itemMasterId, this.certificationarrayAircraftmodelsarray);
								// }
								// if (this.exchangeAircraftmodelsarray.length >= 0) {
								// 	this.saveexcahneginfo(data.partId, data.itemMasterId, this.exchangeAircraftmodelsarray);
								// }
								if (this.selectedModels.length > 0) {

									this.saveAircraftmodelinfo(data.partId, data.itemMasterId, this.selectedModels);

								}
							}
						}
						this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-list')
						//this.value = 1;


					})


				}
				else {

					this.sourceItemMaster.updatedBy = this.userName;
					//this.sourceItemMaster.defaultMessageCode = this.messageName;
					this.sourceItemMaster.masterCompanyId = 1;
					this.itemser.updateItemMaster(this.sourceItemMaster).subscribe(data => {
						this.collectionofItemMaster = data;
						this.saveCompleted(this.sourceItemMaster);
						if (data != null) {
							if (data.partId && data.itemMasterId) {
								// if (this.manfacturerAircraftmodelsarray.length >= 0) {
								// 	this.savemfginfo(data.partId, data.itemMasterId, this.manfacturerAircraftmodelsarray);
								// }
								// if (this.distributionAircraftmodelsarray.length >= 0) {
								// 	this.saveDistrbution(data.partId, data.itemMasterId, this.distributionAircraftmodelsarray);
								// }

								// if (this.overhaulAircraftmodelsarray.length >= 0) {
								// 	this.saveovhinfo(data.partId, data.itemMasterId, this.overhaulAircraftmodelsarray);
								// }
								// if (this.repairAircraftmodelsarray.length >= 0) {
								// 	this.saverepairinfo(data.partId, data.itemMasterId, this.repairAircraftmodelsarray);
								// }
								// if (this.certificationarrayAircraftmodelsarray.length >= 0) {
								// 	this.savecertification(data.partId, data.itemMasterId, this.certificationarrayAircraftmodelsarray);
								// }
								// if (this.exchangeAircraftmodelsarray.length >= 0) {
								// 	this.saveexcahneginfo(data.partId, data.itemMasterId, this.exchangeAircraftmodelsarray);
								// }
								if (this.selectedModels.length > 0) {
									this.saveAircraftmodelinfo(data.partId, data.itemMasterId, this.selectedModels);
								 }
							}
						}

					})
				}


			}
			else { }
		}
		
		// this.modal.close();
	}

	saveAircraftmodelinfo(partid, itemid, data) {
		;
		for (let i = 0; i < data.length; i++) {
			data[i].itemMasterId = itemid;
			//data[i].partId = partid;


			this.itemser.saveAircraftinfo(data[i]).subscribe(aircraftdata => {
				this.collectionofItemMaster = aircraftdata;
			})

		}
	}
	public AddCustomerAircraftdata(ItemMasterobject) {
		for (let i = 0; i < this.selectedAircraftTypes.length; i++) {
			ItemMasterobject.aircraftTypeId = this.selectedAircraftTypes[i];
			this.itemser.AddItemMasteraircrafttype(ItemMasterobject).subscribe(data => {
				this.localCollection = data;
				//this.itemser.itemMasterobject = this.localCollection;
			})
		}


	}

	ViewFunction() {

		alert("functionality not yet implemented");
	}
	// savemfginfo(partid, itemid, data) {
		
	// 	for (let i = 0; i < data.length; i++) {
	// 		if (data[i].atcChapterId1 != null) {
	// 			data[i].itemId = itemid;
	// 			data[i].partId = partid;
	// 			data[i].capabilityTypeId = 1;
	// 			data[i].verifiedBy = data[i].verifiedBy1;
	// 			data[i].isCMMExist = data[i].isCMMExist1;
	// 			data[i].description = data[i].modelname1;
	// 			data[i].isCMMExist = data[i].isCMMExist1;
	// 			data[i].aTAMainId = data[i].atcChapterId1;
	// 			data[i].memo = data[i].memo1;
	// 			data[i].aircraftManufacturer = data[i].aircraftManufacturer;
	// 			data[i].aircraftModelId = data[i].aircraftModelId;
	// 			data[i].aircraftTypeId = data[i].aircraftTypeId;
	// 			data[i].entryDate = data[i].entrydate1;

	// 			this.itemser.saveManfacturerinforcapes(data[i]).subscribe(data11 => {
	// 				this.collectionofItemMaster = data11;
	// 			})
	// 		}
	// 	}
	// }


	// saveDistrbution(partid, itemid, data) {
		
	// 	for (let i = 0; i < data.length; i++) {
	// 		if (data[i].atcChapterId1 != null) {
	// 			data[i].itemId = itemid;
	// 			data[i].partId = partid;
	// 			data[i].capabilityTypeId = 3;
	// 			data[i].verifiedBy = data[i].verifiedBy1;
	// 			data[i].isCMMExist = data[i].isCMMExist1;
	// 			data[i].description = data[i].modelname1;
	// 			data[i].isCMMExist = data[i].isCMMExist1;
	// 			data[i].aTAMainId = data[i].atcChapterId1;
	// 			data[i].memo = data[i].memo1;
	// 			data[i].aircraftManufacturer = data[i].aircraftManufacturer;
	// 			data[i].aircraftModelId = data[i].aircraftModelId;
	// 			data[i].aircraftTypeId = data[i].aircraftTypeId;
	// 			data[i].entryDate = data[i].entrydate1;

	// 			this.itemser.saveManfacturerinforcapes(data[i]).subscribe(data11 => {
	// 				this.collectionofItemMaster = data11;
	// 			})
	// 		}

	// 	}
	// }

	// saveovhinfo(partid, itemid, data) {
		
	// 	for (let i = 0; i < data.length; i++) {
	// 		if (data[i].atcChapterId1 != null) {
	// 			data[i].itemId = itemid;
	// 			data[i].partId = partid;
	// 			data[i].capabilityTypeId = 2;
	// 			data[i].verifiedBy = data[i].verifiedBy1;
	// 			data[i].isCMMExist = data[i].isCMMExist1;
	// 			data[i].description = data[i].modelname1;
	// 			data[i].isCMMExist = data[i].isCMMExist1;
	// 			data[i].aTAMainId = data[i].atcChapterId1;
	// 			data[i].memo = data[i].memo1;
	// 			data[i].aircraftManufacturer = data[i].aircraftManufacturer;
	// 			data[i].aircraftModelId = data[i].aircraftModelId;
	// 			data[i].aircraftTypeId = data[i].aircraftTypeId;
	// 			data[i].entryDate = data[i].entrydate1;

	// 			this.itemser.saveManfacturerinforcapes(data[i]).subscribe(data11 => {
	// 				this.collectionofItemMaster = data11;
	// 			})
	// 		}

	// 	}
	// }
	// saverepairinfo(partid, itemid, data) {
		
	// 	for (let i = 0; i < data.length; i++) {
	// 		if (data[i].atcChapterId1 != null) {
	// 			data[i].itemId = itemid;
	// 			data[i].partId = partid;
	// 			data[i].capabilityTypeId = 5;
	// 			data[i].verifiedBy = data[i].verifiedBy1;
	// 			data[i].isCMMExist = data[i].isCMMExist1;
	// 			data[i].description = data[i].modelname1;
	// 			data[i].isCMMExist = data[i].isCMMExist1;
	// 			data[i].aTAMainId = data[i].atcChapterId1;
	// 			data[i].memo = data[i].memo1;
	// 			data[i].aircraftManufacturer = data[i].aircraftManufacturer;
	// 			data[i].aircraftModelId = data[i].aircraftModelId;
	// 			data[i].aircraftTypeId = data[i].aircraftTypeId;
	// 			data[i].entryDate = data[i].entrydate1;

	// 			this.itemser.saveManfacturerinforcapes(data[i]).subscribe(data11 => {
	// 				this.collectionofItemMaster = data11;
	// 			})
	// 		}
	// 	}
	// }
	// saveexcahneginfo(partid, itemid, data) {
		
	// 	for (let i = 0; i < data.length; i++) {
	// 		if (data[i].atcChapterId1 != null) {
	// 			data[i].itemId = itemid;
	// 			data[i].partId = partid;
	// 			data[i].capabilityTypeId = 6;
	// 			data[i].verifiedBy = data[i].verifiedBy1;
	// 			data[i].isCMMExist = data[i].isCMMExist1;
	// 			data[i].description = data[i].modelname1;
	// 			data[i].isCMMExist = data[i].isCMMExist1;
	// 			data[i].aTAMainId = data[i].atcChapterId1;
	// 			data[i].memo = data[i].memo1;
	// 			data[i].aircraftManufacturer = data[i].aircraftManufacturer;
	// 			data[i].aircraftModelId = data[i].aircraftModelId;
	// 			data[i].aircraftTypeId = data[i].aircraftTypeId;
	// 			data[i].entryDate = data[i].entrydate1;

	// 			this.itemser.saveManfacturerinforcapes(data[i]).subscribe(data11 => {
	// 				this.collectionofItemMaster = data11;
	// 			})
	// 		}

	// 	}
	// }
	// savecertification(partid, itemid, data) {
		
	// 	for (let i = 0; i < data.length; i++) {
	// 		if (data[i].atcChapterId1 != null) {
	// 			data[i].itemId = itemid;
	// 			data[i].partId = partid;
	// 			data[i].capabilityTypeId = 4;
	// 			data[i].verifiedBy = data[i].verifiedBy1;
	// 			data[i].isCMMExist = data[i].isCMMExist1;
	// 			data[i].description = data[i].modelname1;
	// 			data[i].isCMMExist = data[i].isCMMExist1;
	// 			data[i].aTAMainId = data[i].atcChapterId1;
	// 			data[i].memo = data[i].memo1;
	// 			data[i].aircraftManufacturer = data[i].aircraftManufacturer;
	// 			data[i].aircraftModelId = data[i].aircraftModelId;
	// 			data[i].aircraftTypeId = data[i].aircraftTypeId;
	// 			data[i].entryDate = data[i].entrydate1;

	// 			this.itemser.saveManfacturerinforcapes(data[i]).subscribe(data11 => {
	// 				this.collectionofItemMaster = data11;
	// 			})
	// 		}

	// 	}
	// }
	dismissAircraftModels() {
		if (this.selectedModels.length > 0) {
			this.manfacturerAircraftmodelsarray = [];
			this.distributionAircraftmodelsarray = [];
			this.overhaulAircraftmodelsarray = [];
			this.certificationarrayAircraftmodelsarray = [];
			this.repairAircraftmodelsarray = [];
			this.exchangeAircraftmodelsarray = [];
			this.isDeleteMode = false;
			this.isEditMode = false;
			this.modal.close();
			if (this.itemser.isEditMode == false || (this.itemser.isEditMode == true && this.selectedModels.length > 0)) {

				this.manfacturerAircraftmodelsarray = this.manfacturerAircraftDataParsing(JSON.parse(JSON.stringify(this.selectedModels)));
				this.distributionAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
				this.overhaulAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
				this.certificationarrayAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
				this.repairAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
				this.exchangeAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
			}
		}
		this.showInput = true;
		this.modal.close();
	}
	manfacturerAircraftDataParsing(data) {
		if (data) {
			for (let obj of data) {
				obj["bulist"] = []
				obj["departmentList"] = []
				obj["divisionlist"] = []
			}

			return data;
		}
		return null;
	}

	dismissCapesModel() {
		this.isDeleteMode = false;
		this.isEditMode = false;
		this.modal.close();
		this.capesCollection = [];
		for (let i = 0; i < this.manfacturerAircraftmodelsarray.length; i++) {
			this.capesCollection.push(JSON.parse(JSON.stringify(this.manfacturerAircraftmodelsarray[i])));


		}
		for (let i = 0; i < this.overhaulAircraftmodelsarray.length; i++) {
			this.capesCollection.push(JSON.parse(JSON.stringify(this.overhaulAircraftmodelsarray[i])));


		}

		for (let i = 0; i < this.distributionAircraftmodelsarray.length; i++) {
			this.capesCollection.push(JSON.parse(JSON.stringify(this.distributionAircraftmodelsarray[i])));


		}

		for (let i = 0; i < this.repairAircraftmodelsarray.length; i++) {
			this.capesCollection.push(JSON.parse(JSON.stringify(this.repairAircraftmodelsarray[i])));


		}

		for (let i = 0; i < this.certificationarrayAircraftmodelsarray.length; i++) {
			this.capesCollection.push(JSON.parse(JSON.stringify(this.certificationarrayAircraftmodelsarray[i])));


		}

		for (let i = 0; i < this.exchangeAircraftmodelsarray.length; i++) {
			this.capesCollection.push(JSON.parse(JSON.stringify(this.exchangeAircraftmodelsarray[i])));


		}
		console.log(this.capesCollection);
	}

	public saveSelectedModel(selectedRow, indeex) {

		selectedRow.isBoolean = indeex;

	}
	public getSelectedItem(selectedRow, event) {
		//;
		let ischange = false;
		if (this.selectedModels.length > 0) {
			this.selectedModels.map((row) => {
				if (selectedRow.aircraftModelId == row.aircraftModelId) {
					row.priority = event.target.value;
					ischange = true;
				}
			});
		}
		if (!ischange) {
			this.selectedModels.push(selectedRow);
		}
		console.log(this.selectedModels);
		//


	}
	Mfacturer(content) {

		this.isEditMode = false;
		this.isDeleteMode = false;

		this.isSaving = true;
		this.loadMasterCompanies();
		//this.sourceAction = new UnitOfMeasure();
		this.sourceAction.isActive = true;
		this.name = "";
		this.modal = this.modalService.open(content, { size: 'sm' });
		this.modal.result.then(() => {



			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}
    saveManufacturer() {

       //;

		this.isSaving = true;
		if (this.isEditMode == false) {
			this.sourcemanufacturer.masterCompanyId = 1;
			this.sourceAction.updatedBy = this.userName;
			this.sourceAction.description = this.integrationName;
			this.sourceAction.masterCompanyId = 1;
		this.itemser.savemanufacutrer(this.sourcemanufacturer).subscribe(data => { this.manufacturerdata() })
                //role => this.saveSuccessHelper(role),
                //error => this.saveFailedHelper(error));
      

      
		}
		else {

			this.sourceAction.updatedBy = this.userName;
			this.sourceAction.description = this.integrationName;
			this.inteService.updateAction(this.sourcemanufacturer).subscribe(
				response => this.saveCompleted(this.sourceAction),
				error => this.saveFailedHelper(error));
		}

		this.modal.close();
	}
    filtermanufacturer(event) {

		this.localmanufacturer = [];
		if (this.allManufacturerInfo) {
			for (let i = 0; i < this.allManufacturerInfo.length; i++) {
				let name = this.allManufacturerInfo[i].name;
				if (name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.localmanufacturer.push(name);
				}
			}
		}
    }

    // Temporery Item Master Radiuo Route
    stock() {
        this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-stock');
    }

    nonStock() {
        this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-non-stock');
    }
    equipment() {
        this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-equipment');
    }
    exchange() {
        this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-exchange');
    }
    loan() {
        this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-loan');
    }

    partnmId(event) {
        //;
		if (this.partcla) {
			for (let i = 0; i < this.partcla.length; i++) {
				if (event == this.partcla[i][0].partName) {
					this.sourceItemMaster.partId = this.itemclaColl[i][0].partId;
				}
			}
		}
	}

	

    filterpartItems(event) {

        this.partCollection = [];
		this.partcla = [];
		if (this.allPartnumbersInfo) {
			for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
				let partName = this.allPartnumbersInfo[i].partNumber;
				if (partName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.partcla.push([{
						"partId": this.allPartnumbersInfo[i].partId,
						"partName": partName
					}]),

						this.partCollection.push(partName);
				}
			}
		}
    }

    //saveequipment() {

    //    //;

    //    this.isSaving = true;
    //    this.sourceItemMaster.masterCompanyId = 1;
    //    this.itemser.saveequipment(this.sourceItemMaster).subscribe(
    //        role => this.saveSuccessHelper(role),
    //        error => this.saveFailedHelper(error));



    //}

    //Equipment(content) {

    //    this.isEditMode = false;
    //    this.isDeleteMode = false;

    //    this.isSaving = true;
    //    this.loadMasterCompanies();
    //   // this.sourceAction = new Integration();
    //    this.sourceAction.isActive = true;
    //    this.equipmentName = "";
    //    this.modal = this.modalService.open(content, { size: 'sm' });
    //    this.modal.result.then(() => {
    //        console.log('When user closes');
    //    }, () => { console.log('Backdrop click') })
    //}



    euipId(event) {
        //;
        for (let i = 0; i < this.itemColl.length; i++) {
            if (event == this.itemColl[i][0].equipmentName) {
                this.sourceItemMaster.partId = this.itemColl[i][0].partId;
            }
        }
    }

    filtereqipItems(event) {

        this.equipCollection = [];
		this.itemColl = [];
		if (this.allequipmentsInfo) {
			for (let i = 0; i < this.allequipmentsInfo.length; i++) {
				let equipmentName = this.allequipmentsInfo[i].equipmentId;
				if (equipmentName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.itemColl.push([{
						"equipmentId": this.allequipmentsInfo[i].partId,
						"equipmentName": equipmentName
					}]),

						this.equipCollection.push(equipmentName);
				}
			}
		}
    }
   

}



