import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { PageHeaderComponent } from '../../../../shared/page-header.component';
import * as $ from 'jquery';
import { LegalEntityEndpontService } from '../../../../services/legalentity-endpoint.service';
import { AuthService } from '../../../../services/auth.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { FormBuilder } from '@angular/forms';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MasterComapnyService } from '../../../../services/mastercompany.service';
import { MasterCompany } from '../../../../models/mastercompany.model';
import { CurrencyService } from '../../../../services/currency.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Currency } from '../../../../models/currency.model';
//import { TreeTableModule } from 'primeng/treetable';
import { TreeNode, MenuItem } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { TreeTableModule } from 'primeng/treetable';

@Component({
    selector: 'app-legalentity-structure',
    templateUrl: './entity-list.component.html',
    styleUrls: ['./entity-list.component.scss'],
    animations: [fadeInOut]
})
/** EntityList component*/
export class LegalEntityStructureComponent implements OnInit, AfterViewInit {
	modal1: NgbModalRef;
	cols1: any[];
	header: boolean = true;
	gridData: TreeNode[];
	childCollection: any[]=[];
    /** EntityList ctor */
	allCurrencyInfo: any[];
	sourceLegalEntity: any = {}
    dataSource: MatTableDataSource<{}>;
	displayedColumns: any;
	@ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
	@ViewChild(MatSort,{static:false}) sort: MatSort;
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
	
	items: MenuItem[];
	selectedNode: TreeNode;
	constructor(private authService: AuthService, private _fb: FormBuilder, private alertService: AlertService, public currency: CurrencyService, public workFlowtService: LegalEntityService,  private modalService: NgbModal, private activeModal: NgbActiveModal, private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {		
		this.dataSource = new MatTableDataSource();
	}

	ngOnInit(): void {
		this.CurrencyData();
		this.loadData();
	}

	modal: NgbModalRef;
	
	
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
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

	private loadData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.workFlowtService.getEntityList().subscribe(
			results => this.onDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

		this.cols = [
			//{ field: 'ataMainId', header: 'ATAMain Id' },
			{ field: 'name', header: 'Name'},
			{ field: 'description', header: 'Description'},
			{ field: 'cageCode', header: 'CageCode'},
			{ field: 'doingLegalAs', header: 'DoingLegalAs'},
			{ field: 'createdBy', header: 'Created By' },
			{ field: 'updatedBy', header: 'Updated By' },
			{ field: 'updatedDate', header: 'Updated Date' },
			{ field: 'createdDate', header: 'createdDate' }
		];
		
		this.selectedColumns = this.cols;
	}

	private onDataLoadSuccessful(getAtaMainList: any[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getAtaMainList;
		this.allATAMaininfo = getAtaMainList;
		//debugger;
		this.gridData = this.makeNestedObj(this.allATAMaininfo, null);
		
		this.cols1 = [
			{ field: 'name', header: 'Name' },
			{ field: 'description', header: 'Description' },
			{ field: 'cageCode', header: 'Cage Code' },
			{ field: 'legalEntityId', header: 'ID' },
			//{ field: 'parentId', header: 'Parent Id' },

		];
		//this.selectedColumns1 = this.cols1;
		this.items = [
			{ label: 'View', icon: 'pi pi-search', command: (event) => this.viewFile(this.selectedNode) },
			{ label: 'Toggle', icon: 'pi pi-sort', command: (event) => this.toggleFile(this.selectedNode) }
		];
	}
	viewFile(node) {
		//this.alertService.add({ severity: 'info', summary: 'File Selected', detail: node.data.name + ' - ' + node.data.size });
	}
	//nodeSelect(event) {
	//	alert(event);
	//}

	toggleFile(node) {
		node.expanded = !node.expanded;
		this.gridData = [...this.gridData];
	}
	exapandORcollapse(node: TreeNode,node1:any) {
		//debugger;
		
		for (let i = 0; i < node1.length; i++) {
			if (node[i].children) {
				node[i].expanded = true;
				for (let cn of node[i].children) {
					this.exapandORcollapse(cn,cn);
				}
			}
		}
	}
	
	makeNestedObj(arr, parent) {
		var out = []
		for (var i in arr) {
			if (arr[i].parentId == parent) {
				var children = this.makeNestedObj(arr, arr[i].legalEntityId)
				arr[i] = { "data": arr[i] };
				if (children.length) {
					arr[i].children = children
				}
				out.push(arr[i])
			}
		}
		return out
	}
	nodeSelect(event) {
		debugger;
		//event.node = selected node
		console.log("selected node", event, event.node);
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
		this.GeneralInformation();
		this.sourceLegalEntity.isBankingInfo = false;
		this.sourceLegalEntity = row;
		this.modal1 = this.modalService.open(content, { size: 'lg' });
		this.modal1.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	open(content) {

		this.isEditMode = false;
		this.isDeleteMode = false;

		this.isSaving = true;
		this.loadMasterCompanies();
		//this.sourceLegalEntity = new ATAMain();
		this.sourceLegalEntity.isActive = true;
		this.entityName = "";
		this.modal = this.modalService.open(content, { size: 'lg' });
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
	private CurrencyData() {
		// 
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
	private onDataLoadFailed(error: any) {
		// alert(error);
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;

	}
	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	openCurrency(content) {

		this.isEditMode = false;
		this.isDeleteMode = false;

		this.isSaving = true;
		this.loadMasterCompanies();
		this.sourceAction = new Currency();
		this.sourceAction.isActive = true;
		this.currencyName = "";
		this.modal = this.modalService.open(content, { size: 'sm' });
		this.modal.result.then(() => {



			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}
	editItemAndCloseModel() {

		this.isSaving = true;

		if (this.isEditMode == false) {
			this.sourceLegalEntity.createdBy = this.userName;
			this.sourceLegalEntity.updatedBy = this.userName;
			
			this.sourceLegalEntity.masterCompanyId = 1;
			this.workFlowtService.newAddEntity(this.sourceLegalEntity).subscribe(
				role => this.saveSuccessHelper(role),
                error => this.saveFailedHelper(error));
            this.loadData();
		}
		else {
			this.sourceLegalEntity.createdBy = this.userName;
			this.sourceLegalEntity.updatedBy = this.userName;
			this.sourceLegalEntity.masterCompanyId = 1;
			this.workFlowtService.updateEntity(this.sourceLegalEntity).subscribe(
				response => this.saveCompleted(this.sourceLegalEntity),
                error => this.saveFailedHelper(error));
            this.loadData();
		}

		//this.modal.close();
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
		this.isDeleteMode = false;
		this.isEditMode = false;
		this.modal.close();
	}

	openEdit(content, row) {

		//this.isEditMode = true;

		this.isSaving = true;
		this.loadMasterCompanies();
		//this.sourceAction = row;
		this.sourceLegalEntity.parentId = row.parentId;
		this.entityName = this.sourceLegalEntity.entityName;
		this.loadMasterCompanies();
		this.modal = this.modalService.open(content, { size: 'lg' });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

}