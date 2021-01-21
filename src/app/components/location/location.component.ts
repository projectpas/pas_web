import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { fadeInOut } from '../../services/animations';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AuditHistory } from '../../models/audithistory.model';
import { ATAMain } from '../../models/atamain.model';
import { AtaMainService } from '../../services/atamain.service';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { MasterCompany } from '../../models/mastercompany.model'
import { AuthService } from '../../services/auth.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MessageSeverity, AlertService } from '../../services/alert.service';
import { SiteService } from '../../services/site.service';
import { WarehouseService } from '../../services/warehouse.service';
import { LocationService } from '../../services/location.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { Site } from '../../models/site.model';
import { Warehouse } from '../../models/warehouse.model';
import { Location } from '../../models/location.model';
import { TreeNode, MenuItem } from 'primeng/api';
import { LegalEntityService } from '../../services/legalentity.service';
import { ConfigurationService } from '../../services/configuration.service';
import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";


import { CommonService } from '../../services/common.service';



@Component({
	selector: 'app-location',
	templateUrl: './location.component.html',
	styleUrls: ['./location.component.scss'],
	animations: [fadeInOut]
})
/** location component*/
export class LocationComponent implements OnInit, AfterViewInit {
	disableSaveLocationName: boolean;

	public sourceLocation: any = {};

	addressId: any;
	locationId: any;

	totalRecords: number;
	memo: any = "";

	address1: any;
	address2: any;
	address3: any;
	city: any;
	state: any;
	country: any;
	postalCode: any;

	createdBy: any = "";
	updatedBy: any = "";
	createdDate: any = "";
	updatedDate: any = "";

	countrycollection: any;
	countryName: string;
	allCountryinfo: any[];
	allATAMaininfo: ATAMain[] = [];
	localCollection: any[] = [];
	disableSaveForEdit: boolean = false;

	siteId: any;
	warehouseId: any;

	warehouseName: any;
	warehouse_Name: any = "";
	siteName: any;

	name: any;
	public isEditMode: boolean = false;
	private isDeleteMode: boolean = false;
	dataSource: MatTableDataSource<any>;
	showLable: boolean;
	closeCmpny: boolean = true;
	loadingIndicator: boolean;
	modal: NgbModalRef;
	action_name: any = "";
	private isSaving: boolean;
	actionName: string;
	allComapnies: MasterCompany[] = [];
	public auditHisory: AuditHistory[] = [];
	allActions: Location[] = [];
	displayedColumns = ['locationId', 'name', 'warehouseName', 'siteName', 'address1', 'address2', 'address3', 'city', 'stateOrProvince', 'country', 'postalCode', 'memo'];
	selectedColumn: Location[];
	selectedColumns: any[];
	cols: any[];
	location_Name: any = "";
	allLocations: any = [];
	stateOrProvince: any;
	allSites: Site[];
	allWareHouses: any[];
	allAddress: any;
	showAddress: boolean;
	gridData: TreeNode[];//Managemnt
	gridData1: TreeNode[];//Managemnt
	gridData2: TreeNode[];//Managemnt
	cols1: any[];
	localSelectedManagement: any[] = [];
	selectedManagementValues: any;
	index: any;
	selectedNodes3: any;
	selectedNodeTest: any;
	localManagementSiteCollection: any;
	allManagemtninfo: any[];
	localManagementLocationEditCollection: TreeNode[];
	showManagement: boolean;
	Active: string = "Active";
	actionamecolle: any[] = [];
	AuditDetails: any[];
	localWareHouseManagementWarehouseCollection: any;
	disableSaveManufacturer: boolean = false;

	currentstatus: string = 'Active';

	isDeleted: Boolean = false;
	locationData: any[] = [];
	selectedLocation: any;
	locationName: any;
	HasAuditDetails: boolean;
	AuditHistoryTitle: string = 'History of Location';
	formData: FormData = null;
	totalPages: number;
	pageSize: number = 10;
	uploadedRecords: Object = null;

	ngOnInit(): void {
		this.cols = [

			{ field: 'name', header: 'Location Name' },
			{ field: 'warehouseName', header: 'Warehouse Name' },
			{ field: 'siteName', header: 'Site Name' },
			{ field: 'address1', header: 'Address Line 1' },
			{ field: 'address2', header: 'Address Line 2' },
			{ field: 'address3', header: 'Address Line 3' },
			{ field: 'city', header: 'City' },
			{ field: 'stateOrProvince', header: 'State' },
			{ field: 'country', header: 'Country' },
			{ field: 'postalCode', header: 'Zip Code' },
			{ field: 'memo', header: 'memo' }
			//{ field: 'createdBy', header: 'Created By' },
			//{ field: 'updatedBy', header: 'Updated By' },
			//{ field: 'updatedDate', header: 'Updated Date' },
			//{ field: 'createdDate', header: 'createdDate' }
		];
		this.loadData();
		this.loadSiteData();
		this.loadManagementdata(); //Calling Management Data
		//	this.loadWareHouseData();
		this.breadCrumb.currentUrl = '/singlepages/singlepages/app-location';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
		this.selectedColumns = this.cols;
	}

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;
	/** location ctor */
	constructor(public manageMentService: LegalEntityService,
		private commonService: CommonService, private configurations: ConfigurationService, public wareHouseService: WarehouseService, public workFlowtService1: SiteService, private breadCrumb: SingleScreenBreadcrumbService, private http: HttpClient, public ataservice: AtaMainService, private changeDetectorRef: ChangeDetectorRef, private router: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public workFlowtService: LocationService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {
		this.dataSource = new MatTableDataSource();
		this.sourceLocation = new Location();

	}

	closethis() {
		this.closeCmpny = false;
	}
	sampleExcelDownload() {
		const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=Location&fileName=Location.xlsx`;

		window.location.assign(url);
	}

	handleChange(rowData, e) {
		if (e.checked == false) {
			this.sourceLocation = rowData;
			this.sourceLocation.updatedBy = this.userName;
			this.Active = "In Active";
			this.sourceLocation.isActive == false;
			this.workFlowtService.updateLocation(this.sourceLocation).subscribe(
				response => this.saveCompleted(this.sourceLocation),
				error => this.saveFailedHelper(error));
			//alert(e);
		}
		else {
			this.sourceLocation = rowData;
			this.sourceLocation.updatedBy = this.userName;
			this.Active = "Active";
			this.sourceLocation.isActive == true;
			this.workFlowtService.updateLocation(this.sourceLocation).subscribe(
				response => this.saveCompleted(this.sourceLocation),
				error => this.saveFailedHelper(error));
			//alert(e);
		}

	}

	getPageCount(totalNoofRecords, pageSize) {
		return Math.ceil(totalNoofRecords / pageSize)
	}

	getmemo() {

		this.disableSaveForEdit = false;

	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	public allWorkFlows: Location[] = [];

	private loadData() { //retrive Location Data
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.workFlowtService.getLocationList().subscribe(
			results => this.onDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)

		);

		//this.cols = [
		//	{ field: 'locationId', header: 'Location Id' },
		//	{ field: 'name', header: 'Location Name' },
		//	{ field: 'memo', header: 'Memo' },
		//	{ field: 'createdBy', header: 'Created By' },
		//	{ field: 'updatedBy', header: 'Updated By' },
		//	{ field: 'updatedDate', header: 'Updated Date' },
		//	{ field: 'createdDate', header: 'createdDate' }
		//];

		this.selectedColumns = this.cols;
	}

	Manufacturerdescription(event) {
		//
		if (this.allLocations) {

			for (let i = 0; i < this.actionamecolle.length; i++) {
				if (event == this.actionamecolle[i][0].locationName) {
					//this.sourceLocation.name = this.allLocations[i][0].name;
					this.disableSaveManufacturer = true;

					this.selectedLocation = event;
				}

			}
		}
	}

	ManufacturerHandler(event) //auto suzition start hear and value will pass to 
	{

		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedLocation) {
				if (value == this.selectedLocation.toLowerCase()) {
					//alert("Action Name already Exists");
					this.disableSaveManufacturer = true;
				}
				else {
					this.disableSaveManufacturer = false;

				}
			}

		}
	}

	filtermanufacturer(event) // will call when we click droup down button
	{

		this.localCollection = [];
		for (let i = 0; i < this.allLocations.length; i++) {
			let locationName = this.allLocations[i].name;
			if (locationName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
				this.actionamecolle.push([{
					"locationId": this.allLocations[i].locationId,
					"locationName": locationName
				}]),
					this.localCollection.push(locationName)

			}
		}
	}


	private loadSiteData()  //retriving SIte Information
	{
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.workFlowtService1.getSiteList().subscribe(   //Getting Site List Hear
			results => this.onSaiteDataLoadSuccessful(results[0]), //Pasing first Array and calling Method
			error => this.onDataLoadFailed(error)
		);

	}
	private onSaiteDataLoadSuccessful(getSiteList: Site[]) { //Storing Site Data

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getSiteList; //need
		this.allSites = getSiteList; //Contain first array of Loaded table Data will put in Html as [value]

	}

	siteValueChange(data) //Site Valu Selection in Form
	{
		this.showAddress = true;
		console.log(this.siteId);

		if (this.sourceLocation.siteId) {
			this.workFlowtService.getAddressDate(this.sourceLocation.siteId).subscribe( //calling and Subscribing for Address Data
				results => this.addressDataArray(results[0]), //sending Address
				error => this.onDataLoadFailed(error)
			);

			this.workFlowtService.getWareHouseDate(this.sourceLocation.siteId).subscribe( //calling and Subscribing for Address Data
				results => this.onDataLoadWareHouse(results), //sending Address
				error => this.onDataLoadFailed(error)
			);
		}

	}

	wareHouseValueChange(data) {
		this.showManagement = true;

		this.workFlowtService.getManagementWareHouseData(data).subscribe(
			data2 => {
				this.localWareHouseManagementWarehouseCollection = data2; //local SiteManagement Site Data for Site Date Selected
				this.gridData2 = this.makeNestedObj1(this.localWareHouseManagementWarehouseCollection, this.allManagemtninfo, null);
				this.selectedNodeTest = this.gridData2;
			})

		console.log(data);
		console.log(this.warehouseId);
	}

	private onDataLoadWareHouse(getWarehouseList: any) { //Storing WareHouse Data

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		//this.dataSource.data = getWarehouseList; //cha
		this.allWareHouses = getWarehouseList; //cha

	}

	addressDataArray(data: any) //Getting Address Based on Change
	{
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		if (data) {
			this.allAddress = data;
			this.address1 = data.address1;
			this.address2 = data.address2;
			this.address3 = data.address3;
			this.city = data.city;
			this.country = data.country;
			this.postalCode = data.postalCode;
			this.stateOrProvince = data.stateOrProvince;
		}
		//Storing Address Details

	}

	//private loadWareHouseData() { //Retriving WareHouse Data from Service
	//	this.alertService.startLoadingMessage();
	//	this.loadingIndicator = true;

	//	this.wareHouseService.getWarehouseList().subscribe( //change
	//		results => this.onDataLoadWareHouse(results[0]),
	//		error => this.onDataLoadFailed(error)
	//	);
	//}



	private loadManagementdata() //Loading Management Structure Data
	{
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.manageMentService.getManagemententity().subscribe(
			results => this.onManagemtntdataLoad(results[0]),
			error => this.onDataLoadFailed(error)
		);
		this.selectedColumns = this.cols;
	}

	private onManagemtntdataLoad(getAtaMainList: any[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getAtaMainList;
		this.allManagemtninfo = getAtaMainList;
		//debugger;
		if (this.allManagemtninfo) {
			this.gridData = this.makeNestedObj(this.allManagemtninfo, null);
		}

		this.cols1 = [
			{ field: 'code', header: 'Code' },
			{ field: 'name', header: 'Name' },
			{ field: 'description', header: 'Description' },
			// { field: 'legalEntityId', header: 'ID' },
		];
	}

	makeNestedObj(arr, parent) {
		var out = []
		for (var i in arr) {
			if (arr[i].parentId == parent) {
				var children = this.makeNestedObj(arr, arr[i].managementStructureId)
				arr[i] = { "data": arr[i] };
				if (children.length) {
					arr[i].children = children
				}
				out.push(arr[i])
			}
		}
		return out
	}

	makeNestedObj1(child, arr, parent) {

		var out = []
		if (child) {
			for (var i = 0; i < child.length; i++) {
				for (var j = 0; j < arr.length; j++) {
					if (arr[j].data) {
						if (child[i].managementStructureId == arr[j].data.managementStructureId) {
							arr[j].data.managementLocationId = child[i].managementLocationId;
							arr[j].data.locationId = child[i].locationId;
							out.push(arr[j]);
							console.log(arr[j].data);
							break;
						}
					}
					else if (child[i].managementStructureId == arr[j].managementStructureId) {
						arr[j].data.managementLocationId = child[i].managementLocationId;
						arr[j].data.locationId = child[i].locationId;
						out.push(arr[j]);
						console.log(arr[j].data);
						break;
					}
				}
			}
		}
		return out;
	}

	nodeSelect(event) {
		//event.node = selected node
		console.log("selected node", event, event.node);
	}

	managementStructureClick(data) {
		console.log(this.localSelectedManagement);
	}


	//ApplyFilter
	public applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue;
	}


	//Refresh
	private refresh() {
		// Causes the filter to refresh there by updating with recently added data.
		this.applyFilter(this.dataSource.filter);
	}





	//OnDataLoadSuccessful
	private onDataLoadSuccessful(getLocationList: any[]) {

		// this.alertService.stopLoadingMessage();
		// this.loadingIndicator = false;
		// this.dataSource.data = getLocationList;
		// this.allLocations = getLocationList;
		this.workFlowtService.getLocationList().subscribe(res => {

			this.originalTableData = res[0];
			this.getListByStatus(this.status ? this.status : this.currentstatus)
		});
		// this.totalRecords = getLocationList.length;
		// 	this.totalPages = Math.ceil(this.totalRecords / this.pageSize);


		// 	console.log(this.allActions);
	}

	//OnDataLoadFailed
	private onDataLoadFailed(error: any) {
		// alert(error);
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;

	}

	//OnDataMasterCompaniesLoadSuccessful
	private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allComapnies = allComapnies;

	}




	//OnHistoryLoadSuccessful
	private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {

		// debugger;
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;

		this.auditHisory = auditHistory;


		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });

		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}


	//LoadMasterCompanies
	private loadMasterCompanies() {


		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.masterComapnyService.getMasterCompanies().subscribe(
			results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}

	//SaveCompleted
	private saveCompleted(user?: any) {
		this.isSaving = false;

		if (this.isDeleteMode == true) {
			this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
			this.isDeleteMode = false;
		}
		else {
			this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);

		}

		this.loadData();
	}


	//Open
	open(content) {

		this.isEditMode = false;
		this.isDeleteMode = false;
		this.isSaving = true;
		this.loadMasterCompanies();
		this.loadManagementdata(); //Calling Management Data
		this.selectedNodeTest = []; //while Open new Node Data Should Be Empty
		this.localCollection = [];
		this.disableSaveManufacturer = false;
		this.sourceLocation = {};
		this.address1 = "";
		this.address2 = "";
		this.address3 = "";
		this.city = "";
		this.country = "";
		this.postalCode = "";
		this.stateOrProvince = "";
		this.name = "";

		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}


	//OpenDelete
	openDelete(content, row) {

		this.isEditMode = false;
		this.isDeleteMode = true;
		this.sourceLocation = row;
		this.location_Name = row.name;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}


	//OpenEdit
	openEdit(content, row) {
		this.isEditMode = true;
		this.isSaving = true;
		this.loadMasterCompanies();
		this.disableSaveForEdit = true;
		this.disableSaveManufacturer = false;
		this.sourceLocation = row;
		this.showManagement = true;
		if (row.siteId) {
			this.siteValueChange(row.siteId);
		}
		this.name = this.sourceLocation.name;
		//Getting ManagementSite Data
		this.workFlowtService.getManagementLocationEditData(this.sourceLocation.locationId).subscribe(data11 => {
			this.localManagementLocationEditCollection = data11; //local SiteManagement Data for Edit Collection
			if (this.localManagementLocationEditCollection) {
				if (this.gridData) {
					//this.gridData = this.makeNestedObj(this.localManagementLocationEditCollection, null);
					this.gridData1 = this.makeNestedObj1(this.localManagementLocationEditCollection, this.allManagemtninfo, null);
				}
				else {
					this.gridData = this.makeNestedObj(this.allManagemtninfo, null);
				}
			}
			//this.selectedNodeTest = this.localManagementLocationEditCollection;
			this.selectedNodeTest = this.gridData1;
		})

		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	//OpenHist
	openHist(content, row) {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;


		this.sourceLocation = row;
		this.workFlowtService.historyLocation(this.sourceLocation.locationId).subscribe(
			results => this.onHistoryLoadSuccessful(results[0], content),
			error => this.saveFailedHelper(error));
	}

	//OpenView
	openView(content, row) {
		this.sourceLocation = row;
		this.locationId = row.LocationId;
		this.location_Name = row.name;
		this.warehouseName = row.warehouseName;
		this.siteName = row.siteName;
		this.address1 = row.address1;
		this.address2 = row.address2;
		this.address3 = row.address3;
		this.city = row.city;
		this.stateOrProvince = row.stateOrProvince;
		this.country = row.country;
		this.postalCode = row.postalCode;
		this.memo = row.memo;
		this.createdBy = row.createdBy;
		this.updatedBy = row.updatedBy;
		this.createdDate = row.createdDate;
		this.updatedDate = row.updatedDate;
		this.loadMasterCompanies();
		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	//OpenHelpText
	openHelpText(content) {
		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	//DeleteItemAndCloseModel
	deleteItemAndCloseModel() {
		this.isSaving = true;
		this.sourceLocation.updatedBy = this.userName;
		this.workFlowtService.deleteLocation(this.sourceLocation.locationId).subscribe(
			response => this.saveCompleted(this.sourceLocation),
			error => this.saveFailedHelper(error));
		this.modal.close();
	}

	//GetUserName
	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}


	//SaveFailedHelper
	private saveFailedHelper(error: any) {
		this.isSaving = false;
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage("Save Error", "The below errors occured while saving your changes:", MessageSeverity.error, error);
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
	}

	public saveManagement(locationId, data1) //retriving SiteManagement Array
	{
		for (let i = 0; i < data1.length; i++) {
			if (data1[i].data.managementStructureId != null) {
				data1[i].data.locationId = locationId;
				this.workFlowtService.newManagementSite(data1[i].data).subscribe(data11 => {
					this.localManagementSiteCollection = data11; //local SiteManagement Data
				})
			}
		}
		this.loadData();
	}


	//EditItem
	saveandeditLocation() {
		// debugger;

		this.isSaving = true;

		if (this.isEditMode == false) {
			this.showAddress = false;
			this.showManagement = false;
			this.sourceLocation.createdBy = this.userName;
			this.sourceLocation.updatedBy = this.userName;
			this.sourceLocation.masterCompanyId = 1;
			this.sourceLocation.name = this.name;
			this.workFlowtService.newLocation(this.sourceLocation).subscribe(data => {
				this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
				if (data != null) {
					this.saveManagement(data.locationId, this.selectedNodeTest); //pushing Site Management Need Site Value so after getting SiteId we are calling

				}
			})
			this.loadData();
		}
		else {
			this.showAddress = true;
			this.showManagement = true;
			this.sourceLocation.updatedBy = this.userName;
			this.sourceLocation.name = this.name;
			this.sourceLocation.masterCompanyId = 1;
			this.workFlowtService.updateLocation(this.sourceLocation).subscribe( //Update
				response => this.saveCompleted(this.sourceLocation),
				error => this.saveFailedHelper(error));
			if (this.selectedNodeTest && this.selectedNodeTest.length > 0) {
				this.workFlowtService.deleteManagementLocation(this.selectedNodeTest).subscribe(data => {
					//alert("getting delete");
				});
			}
			if (this.selectedNodeTest && this.selectedNodeTest.length > 0) {
				this.saveManagement(this.selectedNodeTest[0].data.locationId, this.selectedNodeTest);
			}// will call ManagementSite Edit Data
			this.selectedNodeTest = []; //after Edit making empty
		}

		this.modal.close();
		this.loadData();
	}

	//SaveSuccessHelper
	private saveSuccessHelper(role?: any) {
		this.isSaving = false;
		this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
		this.loadData();
	}


	//DismissModel
	public dismissModel() {
		this.showAddress = false;
		this.showManagement = false;
		this.isDeleteMode = false;
		this.isEditMode = false;
		this.modal.close();
	}

	//SaveSuccessCompleted
	private savesuccessCompleted(user?: any) {
		this.isSaving = false;
		this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
		this.loadData();
	}

	showAuditPopup(template, id): void {
		this.auditLocation(id);
		this.modal = this.modalService.open(template, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	auditLocation(locationId: number): void {
		this.AuditDetails = [];
		this.HasAuditDetails = this.AuditDetails.length > 0;
		this.workFlowtService.getLocationAudit(locationId).subscribe(audits => {
			if (audits.length > 0) {
				this.AuditDetails = audits[0].result;
				this.HasAuditDetails = this.AuditDetails.length > 0;
			}
		});
	}

	/* 
	    Bulk location upload
	*/

	bulkUpload(event) {

		this.formData = new FormData();

		this.uploadedRecords = null;

		const file = event.target.files;

		console.log(file);

		if (file.length > 0) {

			this.formData.append('file', file[0])

			this.workFlowtService.bulkUpload(this.formData).subscribe(response => {

				event.target.value = '';

				this.uploadedRecords = response;

				this.loadData();

				this.alertService.showMessage(
					'Success',
					`Successfully Uploaded  `,
					MessageSeverity.success
				);
			})
		}

	}
	getDeleteListByStatus(value) {
		if (value) {
			this.currentDeletedstatus = true;
		} else {
			this.currentDeletedstatus = false;
		}
		this.getListByStatus(this.status ? this.status : this.currentstatus)
	}

	originalTableData: any = [];
	currentDeletedstatus: boolean = false;
	status: any = "Active";
	getListByStatus(status) {
		const newarry = [];
		if (status == 'Active') {
			this.status = status;
			if (this.currentDeletedstatus == false) {
				this.originalTableData.forEach(element => {
					if (element.isActive == true && element.isDeleted == false) {
						newarry.push(element);
					}
				});
			} else {
				this.originalTableData.forEach(element => {
					if (element.isActive == true && element.isDeleted == true) {
						newarry.push(element);
					}
				});
			}
			this.locationData = newarry;
		} else if (status == 'InActive') {
			this.status = status;
			if (this.currentDeletedstatus == false) {
				this.originalTableData.forEach(element => {
					if (element.isActive == false && element.isDeleted == false) {
						newarry.push(element);
					}
				});
			} else {
				this.originalTableData.forEach(element => {
					if (element.isActive == false && element.isDeleted == true) {
						newarry.push(element);
					}
				});
			}
			this.locationData = newarry;
		} else if (status == 'ALL') {
			this.status = status;
			if (this.currentDeletedstatus == false) {
				// this.billingInfoList=this.originalTableData;
				this.originalTableData.forEach(element => {
					if (element.isDeleted == false) {
						newarry.push(element);
					}
				});
				this.locationData = newarry;
			} else {
				this.originalTableData.forEach(element => {
					if (element.isDeleted == true) {
						newarry.push(element);
					}
				});
				this.locationData = newarry;
			}
		}
		this.totalRecords = this.locationData.length;
		this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
	}
	restore(content, rowData) {
		this.restorerecord = rowData;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}
	restorerecord: any = {}
	restoreRecord() {
		this.commonService.updatedeletedrecords('Location',
			'LocationId', this.restorerecord.locationId).subscribe(res => {
				this.currentDeletedstatus = true;
				this.modal.close();
				// this.geListByStatus(this.status ? this.status : 'Active');
				this.loadData();

				this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
			})
	}

	openEdits(rowData) {}
	changeStatus(rowData) {}
}