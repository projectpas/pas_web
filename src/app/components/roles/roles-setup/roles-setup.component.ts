import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { EmployeeService } from '../../../services/employee.service';
import { TreeNode, MenuItem, MessageService } from 'primeng/api';
import { MasterCompany } from '../../../models/mastercompany.model';
import { fadeInOut } from '../../../services/animations';
import { Row } from 'primeng/components/common/shared';
import { ItemMasterService } from '../../../services/itemMaster.service';
@Component({
    selector: 'app-roles-setup',
    templateUrl: './roles-setup.component.html',
	styleUrls: ['./roles-setup.component.scss'],
	animations: [fadeInOut]
})
/** roles-setup component*/
export class RolesSetupComponent {
	
	allRolesInfoByRoleId: any[]=[];
	selectedRoles: any[]=[];
	tagNameCollection: any[] = [];
	modelValue: boolean = false;
	display: boolean = false;
	showicon: boolean = false;
	treeindex: number = 1;
	allManagemtninfo: any[];
	allUserRoleLevelList: any[];
	modal1: NgbModalRef;
	cols1: any[];
	header: boolean = true;
	headerofMS: any = "";
	gridData: TreeNode[];
	childCollection: any[] = [];
	/** EntityList ctor */
	allCurrencyInfo: any[];
	sourceLegalEntity: any = {}
	dataSource: MatTableDataSource<{}>;
	displayedColumns: any;
	userRolelevelId: any;
	loadingIndicator: boolean;
	currencyName: any;
	cols: any[];
	allComapnies: MasterCompany[] = [];
	allATAMaininfo: any[] = [];
	isSaving: boolean;
	selectedColumns: any[];
	isEditMode: boolean = false;
	isDeleteMode: boolean;
	public sourceAction: any = [];
	public GeneralInformationValue: boolean = true;
	public LockboxValue: boolean = false;
	public domesticWireValue: boolean = false;
	public internationalValue: boolean = false;
	public GeneralInformationStyle: boolean = true;
	public LockboxStyle: boolean = false;
	public domesticWireStyle: boolean = false;
	public internationalStyle: boolean = false;
	ACHStyle: boolean;
	ACHValue: boolean;
	entityName: string;
	selectedFile3: TreeNode;
	items: MenuItem[];
	selectedNode: TreeNode;
    /** roles-setup ctor */
	constructor(private itemMasterService:ItemMasterService,private employeeService:EmployeeService,private messageService: MessageService, private authService: AuthService, private _fb: FormBuilder, private alertService: AlertService, private modalService: NgbModal, private activeModal: NgbActiveModal, private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {

		this.dataSource = new MatTableDataSource();


	}
	ngOnInit(): void {
		
		this.loadManagementdata();
	
	}

	get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

	modal: NgbModalRef;
	SetViewValue(type, rowNode) {
		if (rowNode.node) {
			let changedItems = this.updateChildValue([rowNode.node], type, rowNode.node.data[type]);
			//if (this.selectedRoles.length > 0) {
			//praveen's code//
			for (let i = 0; i < changedItems.length; i++) {
				let changedData = changedItems[i];
				let ischange = false;
				for (let j = 0; j < this.selectedRoles.length; j++) {
					if (this.selectedRoles[j].uiRoleEntityId == changedData.uiRoleEntityId) {
						//this.selectedRoles.splice(i);
						this.selectedRoles[j] = changedData;
						ischange = true;
					}
				}
				if (!ischange) {
					this.selectedRoles.push(changedData);
				}
			}
			//}
		}
		else {
			let isChange = false;
			let changedItems = this.updateChildValue([rowNode], type, rowNode.data[type]);
			//if (this.selectedRoles.length > 0) {
			//praveen's code//
			for (let i = 0; i < changedItems.length; i++) {
				let changedData = changedItems[i];
				let ischange = false;
				for (let j = 0; j < this.selectedRoles.length; j++) {
					if (this.selectedRoles[j].uiRoleEntityId == changedData.uiRoleEntityId) {
						//this.selectedRoles.splice(i);
						this.selectedRoles[j] = changedData;
						ischange = true;
					}
				}
				if (!ischange) {
					this.selectedRoles.push(changedData);
				}
			}
		}
		console.log(this.selectedRoles);
	}

	updateChildValue(child, update_field, value) {
		let changedItems = [];
		for (let i = 0; i < child.length; i++) {
			if (child[i]["data"]) {
				child[i]["data"][update_field] = value;
				changedItems.push(child[i]["data"]);
			}
			if (child[i]["children"]) {
				changedItems = changedItems.concat(this.updateChildValue(child[i]["children"], update_field, value));
			}
		}
		return changedItems;
	}

	ngAfterViewInit() {
		//this.dataSource.paginator = this.paginator;
		//this.dataSource.sort = this.sort;
	}
	public allWorkFlows: any[] = [];

	contextMenu(node, contextMenu) {
		if (node) {
			contextMenu.hide();
		}
	}
	private loadMasterCompanies() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.masterComapnyService.getMasterCompanies().subscribe(
			results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}

	expandAll(toggle: boolean) {
		this.gridData.map(node => {
			node.expanded = toggle;
		});
	}
	private loadManagementdata() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.employeeService.getRolesSetupData().subscribe(
			results => this.onManagemtntdataLoad(results[0]),
			error => this.onDataLoadFailed(error)
		);
		this.employeeService.getUserRolelevel().subscribe(
			results => this.onUserLevelRolelist(results[0]),
			error => this.onDataLoadFailed(error)
		);
		this.cols = [
			//{ field: 'ataMainId', header: 'ATAMain Id' },
			{ field: 'code', header: 'Code' },
			{ field: 'description', header: 'Description' },
			//{ field: 'cageCode', header: 'CageCode' },
			//{ field: 'doingLegalAs', header: 'DoingLegalAs' },
			{ field: 'createdBy', header: 'Created By' },
			{ field: 'updatedBy', header: 'Updated By' },
			{ field: 'updatedDate', header: 'Updated Date' },
			{ field: 'createdDate', header: 'createdDate' }
		];

		this.selectedColumns = this.cols;
	}

	
	nodeSelect(event) {
		this.messageService.add({ severity: 'info', summary: 'Node Selected', detail: event.node.data.name });
	}

	nodeUnselect(event) {
		this.messageService.add({ severity: 'info', summary: 'Node Unselected', detail: event.node.data.name });
	}
	private onManagemtntdataLoad(getAtaMainList: any[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getAtaMainList;
		this.allManagemtninfo = getAtaMainList;
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].tagName != null) {
				this.tagNameCollection.push(this.allManagemtninfo[i]);
			}
		}
		//debugger;
		if (this.allManagemtninfo) {

			this.gridData = this.makeNestedObj(this.allManagemtninfo, null);
		}

		this.cols1 = [
			{ field: 'entityName', header: 'Entity Name' },
			{ field: 'moduleName', header: 'Module Name' },
			{ field: 'screenName', header: 'Screen Name' },
			{ field: 'fieldName', header: 'Field Name' },


		];


	}

	private onUserLevelRolelist(getAtaMainList: any[]) {
		//debugger;
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allUserRoleLevelList = getAtaMainList;
		


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


	deleteItemAndCloseModel() {
		//this.isSaving = true;
		//this.sourceAction.updatedBy = this.userName;
		//this.workFlowtService.delete(this.sourceAction.managementStructureId).subscribe(data => {
		//	this.saveCompleted(this.sourceLegalEntity);
		//	this.loadManagementdata();
		//})
		//this.modal.close();
	}
	makeNestedObj(arr, parent) {
		var out = []
		for (var i in arr) {
			if (arr[i].parentId == parent) {
				var children = this.makeNestedObj(arr, arr[i].uiRoleEntityId)
				arr[i] = { "data": arr[i] };
				if (children.length) {
					arr[i].children = children
				}
				out.push(arr[i])
			}
		}
		return out
	}



	GeneralInformation() {
		this.GeneralInformationValue = true;
		this.LockboxValue = false;
		this.domesticWireValue = false;
		this.internationalValue = false;
		this.ACHValue = false;

		this.GeneralInformationStyle = true;
		this.LockboxStyle = false;
		this.domesticWireStyle = false;
		this.internationalStyle = false;
		this.ACHStyle = false;
	}

	Lockbox() {
		this.GeneralInformationValue = false;
		this.LockboxValue = true;
		this.domesticWireValue = false;
		this.internationalValue = false;
		this.ACHValue = false;

		this.GeneralInformationStyle = false;
		this.LockboxStyle = true;
		this.domesticWireStyle = false;
		this.internationalStyle = false;
		this.ACHStyle = false;
	}
	DomesticWire() {
		this.GeneralInformationValue = false;
		this.LockboxValue = false;
		this.domesticWireValue = true;
		this.internationalValue = false;
		this.ACHValue = false;

		this.GeneralInformationStyle = false;
		this.LockboxStyle = false;
		this.domesticWireStyle = true;
		this.internationalStyle = false;
		this.ACHStyle = false;
	}
	InternationalWire() {
		this.GeneralInformationValue = false;
		this.LockboxValue = false;
		this.domesticWireValue = false;
		this.internationalValue = true;
		this.ACHValue = false;

		this.GeneralInformationStyle = false;
		this.LockboxStyle = false;
		this.domesticWireStyle = false;
		this.internationalStyle = true;
		this.ACHStyle = false;
	}
	ACH() {
		this.GeneralInformationValue = false;
		this.LockboxValue = false;
		this.domesticWireValue = false;
		this.internationalValue = false;
		this.ACHValue = true;

		this.GeneralInformationStyle = false;
		this.LockboxStyle = false;
		this.domesticWireStyle = false;
		this.internationalStyle = false;
		this.ACHStyle = true;
	}
	showDomesticWire() {

		this.DomesticWire();
	}

	openContentEdit(content, row) {
		//this.headerofMS = row.code;
		if (row.isLastChild == true) {
			this.sourceLegalEntity.isAssignable = true;
		}
		this.sourceLegalEntity = row;
		this.modal1 = this.modalService.open(content, { size: 'sm' });
		this.modal1.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	open(content) {
		this.headerofMS = "Add Root Entity";
		this.sourceLegalEntity = {};
		this.isEditMode = false;
		this.isDeleteMode = false;

		this.isSaving = true;
		this.loadMasterCompanies();
		//this.sourceLegalEntity = new ATAMain();
		this.sourceLegalEntity.isActive = true;
		this.entityName = "";
		this.modal = this.modalService.open(content, { size: 'sm' });
		this.modal.result.then(() => {



			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
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
	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	getRolesyuserRolelevelId(event) {
		this.itemMasterService.getRolesDataByUserId(event).subscribe(
			results => this.onRolesLoadSuccessfull(results[0]),
			error => this.onDataLoadFailed(error)
		);
		//alert(event);
	}
	private onRolesLoadSuccessfull(allWorkFlows: any[]) {
		//debugger;
		this.selectedRoles = [];
		//this.selectedColumns = this.cols;
		this.allRolesInfoByRoleId = allWorkFlows;
		if (this.allRolesInfoByRoleId.length > 0) {
			for (let i = 0; i < this.allManagemtninfo.length; i++) {
				for (let j = 0; j < this.allRolesInfoByRoleId.length; j++) {

					if (this.allManagemtninfo[i].data.uiRoleEntityId == this.allRolesInfoByRoleId[j].uiRoleEntityId) {
						console.log(this.allRolesInfoByRoleId[j]);
						
						if (this.allRolesInfoByRoleId[j].permittedEditActionDescription == "Add") {
							this.allManagemtninfo[i].data.isAdd = true;
							let type = 'isAdd';
							this.allManagemtninfo[i].data.userRoleLevelId = this.allRolesInfoByRoleId[j].userRoleLevelId;
							this.SetViewValue(type, this.allManagemtninfo[i]);
						
						}
						if (this.allRolesInfoByRoleId[j].permittedEditActionDescription == "View") {
							this.allManagemtninfo[i].data.isViewed = true;
							let type = 'isViewed';
							this.allManagemtninfo[i].data.userRoleLevelId = this.allRolesInfoByRoleId[j].userRoleLevelId;
							this.SetViewValue(type, this.allManagemtninfo[i]);
						}
						if (this.allRolesInfoByRoleId[j].permittedEditActionDescription == "Update") {
							this.allManagemtninfo[i].data.isUpdate = true;
							let type = 'isUpdate';
							this.allManagemtninfo[i].data.userRoleLevelId = this.allRolesInfoByRoleId[j].userRoleLevelId;
							this.SetViewValue(type, this.allManagemtninfo[i]);
						}
						if (this.allRolesInfoByRoleId[j].permittedEditActionDescription == "Delete") {
							this.allManagemtninfo[i].data.isDelete = true;
							let type = 'isDelete';
							this.allManagemtninfo[i].data.userRoleLevelId = this.allRolesInfoByRoleId[j].userRoleLevelId;
							this.SetViewValue(type, this.allManagemtninfo[i]);
						}
						//console.log(this.selectedRoles);
						
						
					}
					//console.log(this.selectedRoles);
				}
			}
		}

	}
	editItemAndCloseModel() {
		//debugger;
		for (let i = 0; i < this.selectedRoles.length; i++) {
			//this.isSaving = true;


			this.selectedRoles[i].createdBy = this.userName;
			this.selectedRoles[i].updatedBy = this.userName;
			this.selectedRoles[i].userRoleLevelId = this.userRolelevelId;
			this.selectedRoles[i].masterCompanyId = this.currentUserMasterCompanyId;
			this.employeeService.AddRolesData(this.selectedRoles[i]).subscribe(data => {
				

				//this.loadManagementdata();
			});

			


		}
		this.saveSuccessHelper(this.selectedRoles[0]);
	}


	private saveSuccessHelper(role?: any) {
		this.isSaving = false;
		this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);

		//this.loadData();

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

		//this.loadData();
	}

	private saveFailedHelper(error: any) {
		this.isSaving = false;
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
	}

	dismissModel() {
		if (this.modal) { this.modal.close(); }
		if (this.modal1) { this.modal1.close(); }

	}
	onNodeExpand(event) {

		if (event.node.parent == null) {
			this.treeindex == 1;
			this.treeindex++;
			if (this.treeindex == 4) {
				this.showicon = true;
				alert(this.showicon);
			}

		}
	}
	openEdit(content, row) {
		this.headerofMS = row.code;
		//this.isEditMode = true;
		this.sourceLegalEntity = {};
		this.isSaving = true;
		this.loadMasterCompanies();
		//this.sourceAction = row;
		this.sourceLegalEntity.parentId = row.managementStructureId;

		//this.entityName = this.sourceLegalEntity.entityName;
		this.loadMasterCompanies();
		this.modal = this.modalService.open(content, { size: 'sm' });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

}