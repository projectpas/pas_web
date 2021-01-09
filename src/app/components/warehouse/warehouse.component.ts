import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, OnChanges } from '@angular/core';
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
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { Site } from '../../models/site.model';
import { Warehouse } from '../../models/warehouse.model';
import { TreeNode, MenuItem } from 'primeng/api';
import { LegalEntityService } from '../../services/legalentity.service';
import { ConfigurationService } from '../../services/configuration.service';
import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";
import { take } from 'rxjs/operators';
import { listSearchFilterObjectCreation } from '../../generic/autocomplete';


import { CommonService } from '../../services/common.service';


@Component({
	selector: 'app-warehouse',
	templateUrl: './warehouse.component.html',
	styleUrls: ['./warehouse.component.scss'],
	animations: [fadeInOut]
})
/** warehouse component*/
export class WarehouseComponent implements OnInit, AfterViewInit {
	disableSaveSiteName: boolean;

	public sourceWarehouse: any = {};

	addressId: any;
	wareHouseID: any;
	totalRecords: number;
	wareHouseName: any;
	siteName: any;
	memo: any = "";

	address1: any = "";
	address2: any = "";
	address3: any = "";
	city: any = "";
	state: any = "";
	country: any = "";
	postalCode: any = "";

	createdBy: any = "";
	updatedBy: any = "";
	createdDate: any = "";
	updatedDate: any = "";

	siteId: any;
	warehouseId: any;
	name: any;

	countrycollection: any;
	countryName: string;
	allCountryinfo: any[];

	localCollection: any[] = [];

	public isEditMode: boolean = false;
	public isDeleteMode: boolean = false;
	dataSource: MatTableDataSource<any>;
	showLable: boolean;
	closeCmpny: boolean = true;
	loadingIndicator: boolean;
	modal: NgbModalRef;
	action_name: any = "";
	public isSaving: boolean;
	actionName: string;
	allComapnies: MasterCompany[] = [];
	public auditHisory: AuditHistory[] = [];
	existingRecordsResponse: Object;
	allActions: Warehouse[] = [];
	displayedColumns = ['siteId', 'name', 'siteName', 'address1', 'address2', 'address3', 'city', 'stateOrProvince', 'country', 'postalCode', 'memo'];
	selectedColumn: Site[];
	selectedColumns: any[];
	cols: any[];
	warehouse_Name: any = "";
	allWareHouses: any = [];
	disableSaveForEdit: boolean = false;
	
	stateOrProvince: any;
	zipCode: any;
	localWareHouseCollction: any[];
	allSites: any[] = [];
	selectedSiteIdValue: string;
	selectedSiteIdNumber: Number;
	allAddress: any[] = [];
	showAddress: boolean;

	gridData: TreeNode[];//Managemnt
	gridData1: TreeNode[];//Managemnt
	gridData2: TreeNode[];//Managemnt
	cols1: any[];
	allManagemtninfo: any[];
	selectedNodeTest: any;
	localManagementWarehouseCollection: any;
	showManagement: boolean;
	Active: string = "Active";
	localSiteManagementWarehouseCollection: any;
	actionamecolle: any[] = [];
	disableSaveManufacturer: boolean = false;
	selectedWareHouse: any;
	warehouseName: any;
	AuditDetails: any[];
	HasAuditDetails: boolean;
	AuditHistoryTitle: string = 'History of WareHouse'
	formData:FormData = null;
	// pageSize: number = 10;
	// totalPages: number;
	uploadedRecords: Object = null

	// formData: FormData = null;
	// uploadedRecords: Object = null;

	lazyLoadEventData: any;
	pageIndex: number;
	pageSize: any;
	totalPages: number;
	// originalTableData: any[] = [];
	wareHousedata: any[] = [];
	currentstatus: string = 'Active';

    isDeleted: Boolean = false;

	ngOnInit(): void {
		this.cols = [
			{ field: 'warehouseId', header: 'Warehosue Id' },
			{ field: 'name', header: 'Warehouse Name' },
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
		this.loadManagementdata();//loading Management Data
		this.loadSiteData();
		this.breadCrumb.currentUrl = '/singlepages/singlepages/app-warehouse';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
		this.selectedColumns = this.cols;
		this.formData = new FormData();
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}



	@ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
	@ViewChild(MatSort,{static:false}) sort: MatSort;
	/** site ctor */
	constructor(public manageMentService: LegalEntityService,
        private commonService: CommonService, private configurations: ConfigurationService, public workFlowtService1: SiteService, private breadCrumb: SingleScreenBreadcrumbService, private http: HttpClient, public ataservice: AtaMainService, private changeDetectorRef: ChangeDetectorRef, private router: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public workFlowtService: WarehouseService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {
		this.dataSource = new MatTableDataSource();
		this.sourceWarehouse = new Warehouse(); //change

	}

	closethis() {
		this.closeCmpny = false;
	}


	getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
	
	 loadAllWareHousesData(event) {
		this.lazyLoadEventData = event;
		const pageIndex = parseInt(event.first) / event.rows;;
		this.pageIndex = pageIndex;
		this.pageSize = event.rows;
		event.first = pageIndex;
		this.loadingIndicator = true;
		if (event.globalFilter == null) {
			event.globalFilter = ""
		}
		const PagingData = { ...event, filters: listSearchFilterObjectCreation(event.filters) }
		this.workFlowtService.getSearchData(PagingData).subscribe(
			results => {
				//this.allWareHouses = results[0]['results'];
				this.originalTableData=results[0]['results'];
				this.getListByStatus(this.status ? this.status :this.currentstatus)
					// this.totalRecords = results[0]['totalRecordsCount']
				// this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
			},
			error => this.onDataLoadFailed(error)
		);
	}

	getmemo() {
     
		this.disableSaveForEdit = false;
	
}
	constantFilters() {
		return {
			first: 0,
			rows: 10,
			sortField: undefined,
			sortOrder: 1,
			filters: "",
			globalFilter: "",
			multiSortMeta: undefined
		}
	}

	handleChange(rowData, e) {
		if (e.checked == false) {
			this.sourceWarehouse = rowData;
			this.sourceWarehouse.updatedBy = this.userName;
			this.Active = "In Active";
			this.sourceWarehouse.isActive == false;
			this.workFlowtService.updateWarehouse(this.sourceWarehouse).subscribe(res => {
				this.getListByStatus(this.currentstatus);
				this.alertService.showMessage("Success", `Action was Updated successfully`, MessageSeverity.success)
			})
			//alert(e);
		}
		else {
			this.sourceWarehouse = rowData;
			this.sourceWarehouse.updatedBy = this.userName;
			this.Active = "Active";
			this.sourceWarehouse.isActive == true;
			this.workFlowtService.updateWarehouse(this.sourceWarehouse).subscribe(
				response => {this.getListByStatus(this.currentstatus); this.saveCompleted(this.sourceWarehouse)},
				error => this.saveFailedHelper(error));
			//alert(e);
		}
		this.loadAllWareHousesData(this.constantFilters());

	}
	sampleExcelDownload() {
		const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=Warehouse&fileName=Warehouse.xlsx`;

		window.location.assign(url);
	}

	siteValueChange(data) //Site Valu Selection in Form
	{
		this.showAddress = true;
		this.showManagement = true;
		console.log(this.sourceWarehouse.siteId);


		this.workFlowtService.getAddressDate(this.sourceWarehouse.siteId).subscribe( //calling and Subscribing for Address Data
			results => this.addressDataArray(results[0]),
			error => this.onDataLoadFailed(error)
		);

		this.workFlowtService.getManagementSiteData(this.sourceWarehouse.siteId).subscribe(
			data2 => {
				this.localSiteManagementWarehouseCollection = data2; //local SiteManagement Site Data for Site Date Selected
				this.gridData2 = this.makeNestedObj1(this.localSiteManagementWarehouseCollection, this.allManagemtninfo, null);
				this.selectedNodeTest = this.gridData2;
			})

	}

	selectedManagementSiteData(data: any) {

	}


	addressDataArray(data: any) //Getting Address
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

	public allWorkFlows: Warehouse[] = [];

	private loadData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.workFlowtService.getWarehouseList().subscribe( //change
			results => this.onDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);



		this.selectedColumns = this.cols;
	}

	//private loadSiteAddressData()
	//{
	//	this.alertService.startLoadingMessage();
	//	this.loadingIndicator = true;

	//	this.workFlowtService.getWarehouseList().subscribe( //change
	//		results => this.onDataLoadSuccessful(results[0]),
	//		error => this.onDataLoadFailed(error)
	//	);
	//}

	private loadSiteData()  //retriving Information
	{
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.workFlowtService1.getSiteList().subscribe(   //Getting Site List Hear
			results => this.onSaiteDataLoadSuccessful(results[0]), //Pasing first Array and calling Method
			error => this.onDataLoadFailed(error)
		);

	}
	private onSaiteDataLoadSuccessful(getSiteList: Site[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getSiteList; //need
		this.allSites = getSiteList; //Contain first array of Loaded table Data will put in Html as [value]

		//console.log(this.allSites);
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
							arr[j].data.managementWarehouseId = child[i].managementWarehouseId;
							arr[j].data.warehouseId = child[i].warehouseId;
							out.push(arr[j]);
							console.log(arr[j].data);
							break;
						}
					}
					else if (child[i].managementStructureId == arr[j].managementStructureId) {
						arr[j].data.managementWarehouseId = child[i].managementWarehouseId;
						arr[j].data.warehouseId = child[i].warehouseId;
						out.push(arr[j]);
						console.log(arr[j].data);
						break;
					}

				}
			}
		}
		return out;
	}

	public saveManagement(warehouseId, data1) //retriving SiteManagement Array
	{
		debugger;
		for (let i = 0; i < data1.length; i++) {
			if (data1[i].data.managementStructureId != null) {
				data1[i].data.warehouseId = warehouseId;
				this.workFlowtService.newManagementWareHouse(data1[i].data).subscribe(data11 => {
					this.localManagementWarehouseCollection = data11; //local SiteManagement Data
				})
			}
		}
		//this.loadData();
		this.loadAllWareHousesData(this.constantFilters());
	}

	nodeSelect(event) {
		debugger;
		//event.node = selected node
		console.log("selected node", event, event.node);
	}

	Manufacturerdescription(event) {
		//
		if (this.allWareHouses) {

			for (let i = 0; i < this.actionamecolle.length; i++) {
				if (event == this.actionamecolle[i][0].warehouseName) {
					//this.sourceWarehouse.name = this.allWareHouses[i][0].name;
					this.disableSaveManufacturer = true;

					this.selectedWareHouse = event;
				}

			}
		}
	}

	ManufacturerHandler(event) //auto suzition start hear and value will pass to 
	{

		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedWareHouse) {
				if (value == this.selectedWareHouse.toLowerCase()) {
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
		for (let i = 0; i < this.allWareHouses.length; i++) {
			let warehouseName = this.allWareHouses[i].name;
			if (warehouseName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
				this.actionamecolle.push([{
					"warehouseId": this.allWareHouses[i].warehouseId,
					"warehouseName": warehouseName
				}]),
					this.localCollection.push(warehouseName)

			}
		}
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
	private onDataLoadSuccessful(getWarehouseList: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
        this.dataSource.data = getWarehouseList; //cha
        this.allWareHouses = getWarehouseList;
		this.totalRecords = getWarehouseList.length;
		this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        //cha
		//this.localWareHouseCollction = getWarehouseList;

		//console.log(this.allActions);


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


	//LoadMasterCompanies
	private loadMasterCompanies() {


		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.masterComapnyService.getMasterCompanies().subscribe(
			results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}

	//Open
	open(content) {

		this.isEditMode = false;
		this.isDeleteMode = false;
		this.isSaving = true;

		this.loadMasterCompanies();

		this.sourceWarehouse = new Warehouse(); //chang
		this.loadManagementdata(); //Calling Management Data
		this.selectedNodeTest = []; //while Open new Node Data Should Be Empty
		this.disableSaveManufacturer = false;
		this.address1 = "";
		this.address2 = "";
		this.address3 = "";
		this.city = "";
		this.country = "";
		this.postalCode = "";
		this.stateOrProvince = "";
		this.name = "";

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
		this.sourceWarehouse = row;
		this.warehouse_Name = row.name;
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
		this.disableSaveForEdit=true;
		this.showManagement = true;
		this.disableSaveManufacturer = false;
		this.sourceWarehouse = row;//chang
		if (row.siteId) {
			this.siteValueChange(row.siteId);
		}

		this.workFlowtService.getManagementWarehouseEditData(this.sourceWarehouse.warehouseId).subscribe(data11 => {
			this.localManagementWarehouseCollection = data11; //local SiteManagement Data for Edit Collection
			if (this.localManagementWarehouseCollection) {
				if (this.gridData) {
					//this.gridData = this.makeNestedObj(this.localManagementWarehouseCollection, null);
					this.gridData1 = this.makeNestedObj1(this.localManagementWarehouseCollection, this.allManagemtninfo, null);
				}
				else {
					this.gridData = this.makeNestedObj(this.allManagemtninfo, null);
				}
			}
			this.selectedNodeTest = this.gridData1;
		})

		this.name = this.sourceWarehouse.name;
		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	//OpenHist
	openHist(content, row) {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;
		this.sourceWarehouse = row;
		this.workFlowtService.historyWarehouse(this.sourceWarehouse.warehouseId).subscribe(
			results => this.onHistoryLoadSuccessful(results[0], content),
			error => this.saveFailedHelper(error));
	}

	//OpenView
	openView(content, row) {

		this.sourceWarehouse = row;
		this.warehouseId = row.WarehouseId;
		this.warehouse_Name = row.name;
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
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	//DeleteItemAndCloseModel
	deleteItemAndCloseModel() {
		this.isSaving = true;
		this.sourceWarehouse.updatedBy = this.userName;
		this.workFlowtService.deleteWarehouse(this.sourceWarehouse.warehouseId).subscribe(() => {
			this.alertService.showMessage("Success", `Deleted warehouse successfully`, MessageSeverity.success);
			this.modal.close();
			//this.loadData();
			this.loadAllWareHousesData(this.constantFilters());
		});
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

	getColorCodeForHistory(i, field, value) {
		const data = this.auditHisory;
		const dataLength = data.length;
		if (i >= 0 && i <= dataLength) {
			if ((i + 1) === dataLength) {
				return true;
			} else {
				return data[i + 1][field] === value
			}
		}
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

		//this.loadData();
		this.loadAllWareHousesData(this.constantFilters());
	}







	//SaveSuccessHelper
	private saveSuccessHelper(role?: any) {
		this.isSaving = false;
		this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
		//this.loadData();
		this.loadAllWareHousesData(this.constantFilters());
	}


	//DismissModel
	public dismissModel() {
		this.showAddress = false;
		this.isDeleteMode = false;
		this.isEditMode = false;
		this.modal.close();
	}

	//SaveSuccessCompleted
	private savesuccessCompleted(user?: any) {
		this.isSaving = false;
		this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
		//this.loadData();
		this.loadAllWareHousesData(this.constantFilters());
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


	//EditItem
	SaveandEditWarehouse() {
		this.isSaving = true;

		if (this.isEditMode == false) {
			this.showAddress = false;
			this.showManagement = false;
			this.sourceWarehouse.createdBy = this.userName;
			this.sourceWarehouse.updatedBy = this.userName;
			this.sourceWarehouse.masterCompanyId = 1;
			this.sourceWarehouse.name = this.name;
			//this.sourceWarehouse.siteId = this.siteId;
			//this.sourceWarehouse.siteID = this.selectedSiteIdValue;
			this.workFlowtService.newWarehouse(this.sourceWarehouse).subscribe(data => {
				this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
				response => this.saveCompleted(this.sourceWarehouse)
				error => this.saveFailedHelper(error)
				if (data != null) {
					this.saveManagement(data.warehouseId, this.selectedNodeTest); //pushing Site Management Need Site Value so after getting SiteId we are calling

				}
			})
			//this.loadData();
			this.loadAllWareHousesData(this.constantFilters());
		}
		else {
			this.showAddress = true;
			this.showManagement = true;
			this.sourceWarehouse.updatedBy = this.userName;
			this.sourceWarehouse.name = this.name;
			this.sourceWarehouse.masterCompanyId = 1;
			this.workFlowtService.updateWarehouse(this.sourceWarehouse).subscribe(data => {
				this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
				response => this.saveCompleted(this.sourceWarehouse)
				error => this.saveFailedHelper(error)
			});
			if (this.selectedNodeTest && this.selectedNodeTest.length > 0) {
				this.workFlowtService.deleteManagementWarehouse(this.selectedNodeTest).subscribe(data => {
					//alert("getting delete");
				});
			}
			if (this.selectedNodeTest && this.selectedNodeTest.length > 0) {
				this.saveManagement(this.selectedNodeTest[0].data.warehouseId, this.selectedNodeTest); // will call ManagementSite Edit Data
			}

			this.selectedNodeTest = []; //after Edit making empty
		}


		this.modal.close();
		//this.loadData();
		this.loadAllWareHousesData(this.constantFilters());
	}

	showAuditPopup(template, id): void {
		this.auditWarehouse(id);
		this.modal = this.modalService.open(template, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	auditWarehouse(warehouseId: number): void {
		this.AuditDetails = [];
		this.HasAuditDetails = this.AuditDetails.length > 0;

		this.workFlowtService.getWarehouseAudit(warehouseId).subscribe(audits => {
			if (audits.length > 0) {
				this.AuditDetails = audits[0].result;
				this.HasAuditDetails = this.AuditDetails.length > 0;
			}
		});
	}

	/* 
	    Bulk site upload
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

				//this.loadData();

				this.alertService.showMessage(
					'Success',
					`Successfully Uploaded  `,
					MessageSeverity.success
				);

				this.loadAllWareHousesData(this.constantFilters());
			})
		}

	}

	getDeleteListByStatus(value){
        if(value){
            this.currentDeletedstatus=true;
        }else{
            this.currentDeletedstatus=false;
        }
        this.getListByStatus(this.status ? this.status : this.currentstatus)
            }
            
	originalTableData:any=[];
    currentDeletedstatus:boolean=false;
    status:any="Active";
    getListByStatus(status) {
        const newarry=[];
        if(status=='Active'){ 
            this.status=status;
			if(this.currentDeletedstatus==false){
			   this.originalTableData.forEach(element => {
				if(element.isActive ==true && element.isDeleted ==false){
				newarry.push(element);
				}
			   });
	       }else{
		        this.originalTableData.forEach(element => {
				if(element.isActive ==true && element.isDeleted ==true){
			     newarry.push(element);
				}
			   });
	   }
         this.wareHousedata=newarry;
        }else if(status=='InActive' ){
            this.status=status;
			if(this.currentDeletedstatus==false){
				this.originalTableData.forEach(element => {
				 if(element.isActive ==false && element.isDeleted ==false){
				 newarry.push(element);
				 }
				});
			}else{
				 this.originalTableData.forEach(element => {
				 if(element.isActive ==false && element.isDeleted ==true){
				  newarry.push(element);
				 }
				});
		}
              this.wareHousedata = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.wareHousedata= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.wareHousedata= newarry;
			}
        }
        this.totalRecords = this.wareHousedata.length ;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
		}
		restore(content, rowData) {
            this.restorerecord = rowData;
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
            this.modal.result.then(() => {
                console.log('When user closes');
            }, () => { console.log('Backdrop click') })
        }
        restorerecord:any={}
        restoreRecord(){  
            this.commonService.updatedeletedrecords('Warehouse',
            'WarehouseId',this.restorerecord.warehouseId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadAllWareHousesData(this.lazyLoadEventData);
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
   

}