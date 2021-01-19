import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, Self } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { fadeInOut } from '../../services/animations';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AuditHistory } from '../../models/audithistory.model';
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
import { Shelf } from '../../models/shelf.model';
import { Site } from '../../models/site.model';
import { Warehouse } from '../../models/warehouse.model';
import { Location } from '../../models/location.model';
import { ShelfService } from '../../services/shelf.service';
import { TreeNode, MenuItem } from 'primeng/api';
import { LegalEntityService } from '../../services/legalentity.service';
import { ConfigurationService } from '../../services/configuration.service';
import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";

import { CommonService } from '../../services/common.service';


@Component({
	selector: 'app-shelf',
	templateUrl: './shelf.component.html',
	styleUrls: ['./shelf.component.scss'],
	animations: [fadeInOut]
})
/** shelf component*/
export class ShelfComponent {

	disableSaveShelfName: boolean;

	public sourceShelf: any = {};

	addressId: any;
	locationId: any;
	totalRecords: number;


	memo: any = "";
	isActive: true;
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


	siteId: any;
	warehouseId: any;

	warehouseName: any;
	warehouse_Name: any = "";
	siteName: any;
	disableSaveForEdit: boolean = false;
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
	displayedColumns = ['locationId', 'name', 'wareHouseName', 'siteName', 'address1', 'address2', 'address3', 'city', 'stateOrProvince', 'country', 'postalCode', 'memo'];
	selectedColumn: Location[];
	selectedColumns: any[];
	cols: any[];
	shelf_Name: any = "";
	allshelfs: any[];
	stateOrProvince: any;
	allSites: Site[];
	allWareHouses: any[];
	allAddress: any;
	allSelfs: any = [];
	shelfId: any;
	location_Name: any;
	allLocations: any;
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
	shelfInfo: Shelf;
	localManagementShelfEditCollection: TreeNode[];
	localManagementLocationCollection: any;
	showManagement: boolean;
	Active: string = "Active";
	actionamecolle: any[] = [];
	disableSaveManufacturer: boolean = false;;
	selectedShelf: any;
	localCollection: any[] = [];
	shelfName: any;
	AuditDetails: any[];
	HasAuditDetails: boolean = false;
	AuditHistoryTitle: string = 'History of Shelf';
	formData: FormData = null;
	uploadedRecords: Object = null;
	totalPages: number;
	pageSize: number = 10;

	currentstatus: string = 'Active';

	isDeleted: Boolean = false;
	shelfData: any[] = [];

	ngOnInit(): void {
		this.cols = [
			{ field: 'name', header: 'Shelf Name' },
			{ field: 'locationName', header: 'Location Name' },
			{ field: 'wareHouseName', header: 'Warehouse Name' },
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
		this.breadCrumb.currentUrl = '/singlepages/singlepages/app-shelf';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
		this.selectedColumns = this.cols;
	}

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;

	constructor(public manageMentService: LegalEntityService,
		private commonService: CommonService, private configurations: ConfigurationService, public workFlowtService: ShelfService, public locationService: LocationService, public wareHouseService: WarehouseService, public siteService: SiteService, private breadCrumb: SingleScreenBreadcrumbService, private http: HttpClient, private changeDetectorRef: ChangeDetectorRef, private router: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {
		this.dataSource = new MatTableDataSource();
		this.sourceShelf = new Shelf();

	}

	closethis() {
		this.closeCmpny = false;
	}
	sampleExcelDownload() {
		const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=Shelf&fileName=Shelf.xlsx`;

		window.location.assign(url);
	}


	handleChange(rowData, e) {
		if (e.checked == false) {
			this.sourceShelf = rowData;
			this.sourceShelf.updatedBy = this.userName;
			this.Active = "In Active";
			this.sourceShelf.isActive == false;
			this.workFlowtService.updateShelf(this.sourceShelf).subscribe(
				response => this.saveCompleted(this.sourceShelf),
				error => this.saveFailedHelper(error));
			//alert(e);
		}
		else {
			this.sourceShelf = rowData;
			this.sourceShelf.updatedBy = this.userName;
			this.Active = "Active";
			this.sourceShelf.isActive == true;
			this.workFlowtService.updateShelf(this.sourceShelf).subscribe(
				response => this.saveCompleted(this.sourceShelf),
				error => this.saveFailedHelper(error));
			//alert(e);
		}

	}
	getPageCount(totalNoofRecords, pageSize) {
		return Math.ceil(totalNoofRecords / pageSize)
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	public allWorkFlows: Shelf[] = [];


	private loadData() { //retrive Location Data
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.workFlowtService.getShelfList().subscribe(
			results => this.onDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
		this.selectedColumns = this.cols;
	}

	private loadSiteData()  //retriving SIte Information
	{
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.siteService.getSiteList().subscribe(   //Getting Site List Hear
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

		if (this.sourceShelf.siteId) {

			this.workFlowtService.getAddressDate(this.sourceShelf.siteId).subscribe( //calling and Subscribing for Address Data
				results => this.addressDataArray(results[0]), //sending Address
				error => this.onDataLoadFailed(error)
			);

			this.workFlowtService.getWareHouseDate(this.sourceShelf.siteId).subscribe( //calling and Subscribing for WareHouse Data
				results => this.onDataLoadWareHouse(results), //sending WareHouse
				error => this.onDataLoadFailed(error)
			);



		}

	}

	wareHouseValueChange(data) {
		console.log(this.sourceShelf.warehouseId);
		this.workFlowtService.getLocationDate(this.sourceShelf.warehouseId).subscribe( //calling and Subscribing for Location Data
			results => this.onDataLoadLocation(results), //sending Location
			error => this.onDataLoadFailed(error)
		);
	}


	locationValueChange(data) {
		this.showManagement = true;
		this.workFlowtService.getManagementLocationData(data).subscribe(
			data2 => {
				this.localManagementLocationCollection = data2; //local SiteManagement Site Data for Site Date Selected
				this.gridData2 = this.makeNestedObj1(this.localManagementLocationCollection, this.allManagemtninfo, null);
				this.selectedNodeTest = this.gridData2;
			})
		console.log(data);
		console.log(this.warehouseId);
	}

	private onDataLoadWareHouse(getWarehousList: any) { //Storing WareHouse Data

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allWareHouses = getWarehousList; //cha

	}

	private onDataLoadLocation(getLocationList: any) { //Storing WareHouse Data

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allLocations = getLocationList; //cha

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
			//{ field: 'legalEntityId', header: 'ID' },
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
							arr[j].data.managementShelfId = child[i].managementShelfId;
							arr[j].data.shelfId = child[i].shelfId;
							out.push(arr[j]);
							console.log(arr[j].data);
							break;
						}
						else if (child[i].managementStructureId == arr[j].managementStructureId) {
							arr[j].data.managementShelfId = child[i].managementShelfId;
							arr[j].data.shelfId = child[i].shelfId;
							out.push(arr[j]);
							console.log(arr[j].data);
							break;
						}
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
		//    this.localSelectedManagement.push(this.selectedNodeTest);
		console.log(this.localSelectedManagement);

	}

	public applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue;
	}

	Manufacturerdescription(event) {
		//
		if (this.allSelfs) {

			for (let i = 0; i < this.actionamecolle.length; i++) {
				if (event == this.actionamecolle[i][0].shelfName) {
					//this.sourceShelf.name = this.allSelfs[i][0].name;
					this.disableSaveManufacturer = true;
					this.selectedShelf = event;
				}

			}
		}
	}

	ManufacturerHandler(event) //auto suzition start hear and value will pass to 
	{

		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedShelf) {
				if (value == this.selectedShelf.toLowerCase()) {
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
		for (let i = 0; i < this.allSelfs.length; i++) {
			let shelf_Name = this.allSelfs[i].name;
			if (shelf_Name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
				this.actionamecolle.push([{
					"shelfId": this.allSelfs[i].shelfId,
					"shelfName": shelf_Name
				}]),
					this.localCollection.push(shelf_Name)

			}
		}
	}


	//Refresh
	private refresh() {
		// Causes the filter to refresh there by updating with recently added data.
		this.applyFilter(this.dataSource.filter);
	}

	//OnDataLoadSuccessful
	private onDataLoadSuccessful(getSelfList: any[]) {

		// this.alertService.stopLoadingMessage();
		// this.loadingIndicator = false;
		// this.dataSource.data = getSelfList;
		// this.allSelfs = getSelfList;
		// this.originalTableData = this.allSelfs;
		this.workFlowtService.getShelfList().subscribe(res => {
			this.originalTableData = res[0];
			this.getListByStatus(this.status ? this.status : this.currentstatus)
		});


		// this.totalRecords = getSelfList.length;
		// this.totalPages = Math.ceil(this.totalRecords / this.pageSize);


	}

	private onDataLoadFailed(error: any) {
		// alert(error);
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;

	}

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
		this.disableSaveManufacturer = false;
		this.sourceShelf = {};

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
		this.sourceShelf = row;
		this.shelf_Name = row.name;
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
		this.showManagement = true;
		this.disableSaveManufacturer = false;
		this.sourceShelf = row;
		if (row.siteId) {
			this.siteValueChange(row.siteId);
			this.wareHouseValueChange(row.wareHouseId);
			this.locationValueChange(row.locationId);
		}
		this.name = this.sourceShelf.name;

		//Getting ManagementSite Data
		this.workFlowtService.getManagementShelfEditData(this.sourceShelf.shelfId).subscribe(data11 => {
			this.localManagementShelfEditCollection = data11; //local SiteManagement Data for Edit Collection
			if (this.localManagementShelfEditCollection) {
				if (this.gridData) {
					//this.gridData = this.makeNestedObj(this.localManagementShelfEditCollection, null);
					this.gridData1 = this.makeNestedObj1(this.localManagementShelfEditCollection, this.allManagemtninfo, null);
				}
				else {
					this.gridData = this.makeNestedObj(this.allManagemtninfo, null);
				}
			}
			this.selectedNodeTest = this.gridData1;
		})

		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	getmemo() {
		this.disableSaveForEdit = false;
	}

	openHist(content, row) {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;
		this.sourceShelf = row;
		this.workFlowtService.historyShelf(this.sourceShelf.shelfId).subscribe(
			results => this.onHistoryLoadSuccessful(results[0], content),
			error => this.saveFailedHelper(error));
	}

	//OpenView
	openView(content, row) {

		this.sourceShelf = row;
		this.shelfId = row.shelfId;
		this.shelf_Name = row.name;
		this.location_Name = row.locationName;
		this.warehouseName = row.wareHouseName;
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
		this.sourceShelf.updatedBy = this.userName;
		this.workFlowtService.deleteShelf(this.sourceShelf.shelfId).subscribe(
			response => this.saveCompleted(this.sourceShelf),
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

	public saveManagement(shelfId, data1) //retriving SiteManagement Array
	{
		for (let i = 0; i < data1.length; i++) {
			if (data1[i].data.managementStructureId != null) {
				data1[i].data.shelfId = shelfId;
				this.workFlowtService.newManagementShelf(data1[i].data).subscribe(data11 => {
					this.localManagementSiteCollection = data11; //local SiteManagement Data
				})
			}
		}
		this.loadData();
	}
	//EditItem
	editItemAndCloseModel() {
		this.isSaving = true;
		if (this.isEditMode == false) {
			this.showAddress = false;
			this.showManagement = false;
			this.sourceShelf.createdBy = this.userName;
			this.sourceShelf.updatedBy = this.userName;
			this.sourceShelf.masterCompanyId = 1;
			this.sourceShelf.name = this.name;
			this.workFlowtService.newShelf(this.sourceShelf).subscribe(data => {
				this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
				this.shelfInfo = data;
				if (data != null) {
					this.saveManagement(data.shelfId, this.selectedNodeTest); //pushing Site Management Need Site Value so after getting SiteId we are calling

				}
			})
			this.loadData();
		}
		else {
			this.showAddress = true;
			this.sourceShelf.updatedBy = this.userName;
			this.sourceShelf.name = this.name;
			this.sourceShelf.masterCompanyId = 1;
			this.showManagement = true;
			this.workFlowtService.updateShelf(this.sourceShelf).subscribe( //Update
				response => this.saveCompleted(this.sourceShelf),
				error => this.saveFailedHelper(error));
			if (this.selectedNodeTest && this.selectedNodeTest.length > 0) {
				this.workFlowtService.deleteManagementShelf(this.selectedNodeTest).subscribe(data => {

				});
			}
			if (this.selectedNodeTest && this.selectedNodeTest.length > 0) {
				this.saveManagement(this.selectedNodeTest[0].data.shelfId, this.selectedNodeTest); // will call ManagementSite Edit Data
			}

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
		this.isDeleteMode = false;
		this.showManagement = false;
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
		this.auditShelf(id);
		this.modal = this.modalService.open(template, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	auditShelf(shelfId: number): void {
		this.AuditDetails = [];
		this.HasAuditDetails = this.AuditDetails.length > 0;
		this.workFlowtService.getShelfAudit(shelfId).subscribe(audits => {
			if (audits.length > 0) {
				this.AuditDetails = audits[0].result;
				this.HasAuditDetails = this.AuditDetails.length > 0;
			}
		});
	}

	/* 
	    Bulk shelf upload
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
			this.shelfData = newarry;
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
			this.shelfData = newarry;
		} else if (status == 'ALL') {
			this.status = status;
			if (this.currentDeletedstatus == false) {
				// this.billingInfoList=this.originalTableData;
				this.originalTableData.forEach(element => {
					if (element.isDeleted == false) {
						newarry.push(element);
					}
				});
				this.shelfData = newarry;
			} else {
				this.originalTableData.forEach(element => {
					if (element.isDeleted == true) {
						newarry.push(element);
					}
				});
				this.shelfData = newarry;
			}
		}
		this.totalRecords = this.shelfData.length;
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
		this.commonService.updatedeletedrecords('Shelf',
			'ShelfId', this.restorerecord.shelfId).subscribe(res => {
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