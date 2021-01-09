import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { fadeInOut } from '../../../services/animations';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { AuditHistory } from '../../../models/audithistory.model';
import { ATAMain } from '../../../models/atamain.model';
import { AtaMainService } from '../../../services/atamain.service';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { MasterCompany } from '../../../models/mastercompany.model'
import { AuthService } from '../../../services/auth.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { RolesManagementStructureService } from '../../../services/roles-management-structure.service';
import { UserRoleLevel } from '../../../models/userRoleLevel.model';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { SingleScreenBreadcrumbService } from "../../../services/single-screens-breadcrumb.service";
import { LegalEntityService } from '../../../services/legalentity.service';
import { TreeNode, MenuItem } from 'primeng/api';

@Component({
    selector: 'app-roles-management-structure',
    templateUrl: './roles-management-structure.component.html',
	styleUrls: ['./roles-management-structure.component.scss'],
	animations: [fadeInOut]
})

export class RolesManagementStructureComponent implements OnInit, AfterViewInit{

	createdBy: any = "";
	updatedBy: any = "";
	createdDate: any = "";
	updatedDate: any = "";
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
	displayedColumns = ['description', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
	selectedColumn: any = {};
	selectedColumns: any[];
	cols: any[];
	cols1: any[];
    allManagemtninfo: any[];
	gridData: TreeNode[];//Managemnt
	gridData1: TreeNode[];//Managemnt
	localSelectedManagement: any[] = [];
	selectedManagementValues: any;
	index: any;
	selectedNodes3: any;
	selectedNodeTest: TreeNode[];
	siteInfo: any;
	localManagementSiteCollection: any;
	localManagementRoleEditCollection: TreeNode[];
	sourceUserRoleLevel: any = {};
	description: any;
    selectedActionName: any;
	disableSave: boolean;
	allRoles: UserRoleLevel[] = [];
    roleInfo: any;
	localCollection: any;

    /** roles-management-structure ctor */
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	ngOnInit(): void {
		//This Headers will Place in Html
		this.cols = [
			{ field: 'description', header: 'Role Name' }
		];

		this.loadData(); //Calling Method
		this.loadManagementdata(); //Calling Management Data
		this.selectedColumns = this.cols;
		this.breadCrumb.currentUrl = '/rolesmodule/rolespages/app-roles-management-structure';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
		this.selectedColumns = this.cols;
	}

	@ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
	@ViewChild(MatSort,{static:false}) sort: MatSort;
	constructor(private workFlowtService: RolesManagementStructureService,private breadCrumb: SingleScreenBreadcrumbService,public manageMentService: LegalEntityService, private http: HttpClient, public ataservice: AtaMainService, private changeDetectorRef: ChangeDetectorRef, private router: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService,  private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {
		this.dataSource = new MatTableDataSource();
		this.sourceUserRoleLevel = new UserRoleLevel();
	}

	//GetUserName
	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	closethis() {
		this.closeCmpny = false;
	}

	public allWorkFlows: UserRoleLevel[] = [];

	private loadData()  //retriving Information
	{
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.workFlowtService.getRolesList().subscribe(
			results => this.onDataLoadSuccessful(results[0]), //Pasing first Array and calling Method
			error => this.onDataLoadFailed(error)
		);
		this.selectedColumns = this.cols;
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
		//this.dataSource.data = getAtaMainList;
		this.allManagemtninfo = getAtaMainList;
		//debugger;
		if (this.allManagemtninfo) {
			this.gridData = this.makeNestedObj(this.allManagemtninfo, null);
		}

		this.cols1 = [
			{ field: 'code', header: 'Code' },
			{ field: 'description', header: 'Description' },
			{ field: 'legalEntityId', header: 'ID' },
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
							arr[j].data.userRoleManagementStructureId = child[i].userRoleManagementStructureId;
							arr[j].data.userRoleLevelId = child[i].userRoleLevelId;
							out.push(arr[j]);
							console.log(arr[j].data);
							break;
						}
					}
					else if (child[i].managementStructureId == arr[j].managementStructureId) {
						arr[j].data.userRoleManagementStructureId = child[i].userRoleManagementStructureId;
						arr[j].data.managementStructureId = child[i].managementStructureId;
						out.push(arr[j]);
						console.log(arr[j].data);
						break;

					}
				}
			}
		}
		return out;
	}

	public saveManagement(roleLevelId, data1) //retriving SiteManagement Array
	{
		debugger;
		for (let i = 0; i < data1.length; i++) {
			if (data1[i].data.managementStructureId != null) {
				data1[i].data.UserRoleLevelId = roleLevelId;
				this.workFlowtService.newRolesManagementStructure(data1[i].data).subscribe(data11 => {
					this.localManagementSiteCollection = data11; //local SiteManagement Data
				})
			}
		}
	}

	public applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue;
	}


	//Refresh
	private refresh() {
		// Causes the filter to refresh there by updating with recently added data.
		this.applyFilter(this.dataSource.filter);
	}

	//OnDataLoadSuccessful
	private onDataLoadSuccessful(getRoleList: UserRoleLevel[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getRoleList; //need
		this.allRoles = getRoleList; //Contain first array of Loaded table Data will put in Html as [value]
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
		//Getting Master Company Data
		this.masterComapnyService.getMasterCompanies().subscribe(
			results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}

	//Open
	open(content) //it will Open Form and Creating New Site Object
	{

		this.isEditMode = false;
		this.isDeleteMode = false;
		this.isSaving = true;
		this.loadMasterCompanies();
		this.loadManagementdata(); //Calling Management Data
		this.sourceUserRoleLevel = new UserRoleLevel();
		this.description = "";
		this.modal = this.modalService.open(content, { size: 'lg' });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	//OpenDelete
	openDelete(content, row) {

		this.isEditMode = false;
		this.isDeleteMode = true;
		this.sourceUserRoleLevel = row;
		this.modal = this.modalService.open(content, { size: 'sm' });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	localManagementSiteCollectionEdit(data) {
		console.log(data);
	}
	//OpenEdit
	openEdit(content, row) {

		this.isEditMode = true;
		this.isSaving = true;
		this.loadMasterCompanies();
		this.sourceUserRoleLevel = row;
		this.description = this.sourceUserRoleLevel.description;
		//Getting ManagementSite Data
		this.workFlowtService.getRoleManagementStructureEditData(this.sourceUserRoleLevel.userRoleLevelId).subscribe(data11 => {
			this.localManagementRoleEditCollection = data11; //local SiteManagement Data for Edit Collection
			if (this.localManagementRoleEditCollection) {
				if (this.gridData) {
					//this.gridData = this.makeNestedObj(this.localManagementSiteEditCollection, null);
					this.gridData1 = this.makeNestedObj1(this.localManagementRoleEditCollection, this.allManagemtninfo, null);
				}
				else {
					this.gridData = this.makeNestedObj(this.allManagemtninfo, null);
				}
			}
			//this.selectedNodeTest = this.localManagementRoleEditCollection;
			this.selectedNodeTest = this.gridData1;
		})
		//this.name = this.sourceUserRoleLevel.name;
		this.modal = this.modalService.open(content, { size: 'lg' });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	//OpenHist
	openHist(content, row) {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;
		this.sourceUserRoleLevel = row;
		this.workFlowtService.historyRoles(this.sourceUserRoleLevel.UserRoleLevelId).subscribe(
			results => this.onHistoryLoadSuccessful(results[0], content),
			error => this.saveFailedHelper(error));
	}

	//OpenView
	openView(content, row) {

		this.sourceUserRoleLevel = row;
		this.description = row.description;
		this.createdBy = row.createdBy;
		this.updatedBy = row.updatedBy;
		this.createdDate = row.createdDate;
		this.updatedDate = row.updatedDate;
		this.loadMasterCompanies();
		this.modal = this.modalService.open(content, { size: 'lg' });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	//OpenHelpText
	openHelpText(content) {
		this.modal = this.modalService.open(content, { size: 'sm' });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	eventHandler(event) {
		let value = event.target.value.toLowerCase();
		if (this.selectedActionName) {
			if (value == this.selectedActionName.toLowerCase()) {
				//alert("Action Name already Exists");
				this.disableSave = true;
			}
			else {
				this.disableSave = false;
			}
		}
	}

	//DeleteItemAndCloseModel
	deleteItemAndCloseModel() {
		this.isSaving = true;
		this.sourceUserRoleLevel.updatedBy = this.userName;
		this.workFlowtService.deleteRole(this.sourceUserRoleLevel.userRoleLevelId).subscribe(
			response => this.saveCompleted(this.sourceUserRoleLevel),
			error => this.saveFailedHelper(error));

		////tryed for Management Delete But not Need 
		//this.workFlowtService.deleteManagementSite(this.sourceSite.siteId).subscribe(
		//	error => this.saveFailedHelper(error));
		//this.modal.close();
	}

	//SaveFailedHelper
	private saveFailedHelper(error: any) {
		this.isSaving = false;
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage("Save Error", "The below errors occured while saving your changes:", MessageSeverity.error, error);
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
	}

	//EditItem
	editItemAndCloseModel() {
		this.isSaving = true;
		if (this.isEditMode == false) {
			this.sourceUserRoleLevel.createdBy = this.userName;
			this.sourceUserRoleLevel.updatedBy = this.userName;
			this.sourceUserRoleLevel.masterCompanyId = 1;
			this.sourceUserRoleLevel.description = this.description;
			this.sourceUserRoleLevel.name = this.name;

			this.workFlowtService.newRole(this.sourceUserRoleLevel).subscribe(data => {
				this.roleInfo = data;
				//retrive after enter siteid get and submit managementsite
				if (data != null) {
					this.saveManagement(data.userRoleLevelId, this.selectedNodeTest); //pushing Site Management Need Site Value so after getting SiteId we are calling

				}
			})
			this.loadData();
		}
		else {

			this.sourceUserRoleLevel.updatedBy = this.userName;
			this.sourceUserRoleLevel.description = this.description;
			this.sourceUserRoleLevel.name = this.name;
			this.sourceUserRoleLevel.masterCompanyId = 1;
			this.workFlowtService.updateRole(this.sourceUserRoleLevel).subscribe(
				response => this.saveCompleted(this.sourceUserRoleLevel),
				error => this.saveFailedHelper(error));

			this.workFlowtService.deleteManagementRole(this.selectedNodeTest).subscribe(data => {

			});
			this.saveManagement(this.selectedNodeTest[0].data.userRoleLevelId, this.selectedNodeTest); // will call ManagementSite Edit Data
			this.selectedNodeTest = []; //after Edit making empty
			
		}

		this.modal.close();
		this.loadData();
	}


	private saveCompleted(user?: UserRoleLevel) {
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

	//DismissModel
	public dismissModel() {
		this.isDeleteMode = false;
		this.isEditMode = false;
		this.modal.close();
		this.loadData();
	}

	private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {

		// debugger;
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;

		this.auditHisory = auditHistory;


		this.modal = this.modalService.open(content, { size: 'lg' });

		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })


	}

	handleChange(rowData,$event) {}
	partnmId($event) {}
}