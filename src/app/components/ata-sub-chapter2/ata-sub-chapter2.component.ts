import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { AtaSubChapter2Service } from '../../services/atasubchapter2.service';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { ATASubChapter2 } from '../../models/atasubchapter2.model';
import { AuditHistory } from '../../models/audithistory.model';
import { AuthService } from '../../services/auth.service';
import { ATAMain } from '../../models/atamain.model';
import { AtaMainService } from '../../services/atamain.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MasterCompany } from '../../models/mastercompany.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { ATAChapter } from '../../models/atachapter.model';

@Component({
	selector: 'app-ata-sub-chapter2',
	templateUrl: './ata-sub-chapter2.component.html',
	styleUrls: ['./ata-sub-chapter2.component.scss'],
	animations: [fadeInOut]
})
/** AtaSubChapter2 component*/
export class AtaSubChapter2Component implements OnInit, AfterViewInit {
	memo: any = "";
	createdBy: any = "";
	updatedBy: any = "";
	createdDate: any = "";
	updatedDate: any = "";
	private isEditMode: boolean = false;
	private isDeleteMode: boolean = false;
	Active: string = "Active";
	selectedActionName: any;
	disableSave: boolean;

	/** AtaSubChapter1 ctor */
	ngOnInit(): void {
		this.loadData();
		this.atamaindata();
		this.breadCrumb.currentUrl = '/singlepages/singlepages/app-ata-sub-chapter2';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
	}

	@ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
	@ViewChild(MatSort,{static:false}) sort: MatSort;

	displayedColumns = ['memo','createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
	dataSource: MatTableDataSource<ATASubChapter2>;
	allATAMaininfo: ATASubChapter2[] = [];
	allComapnies: MasterCompany[] = [];
	private isSaving: boolean;
	allATAMaininfo1: ATAChapter[];
	public sourceAction: ATASubChapter2;
	public auditHisory: AuditHistory[] = [];
	private bodyText: string;
	loadingIndicator: boolean;
	closeResult: string;
	selectedColumn: ATASubChapter2[];
	selectedColumns: any[];
	cols: any[];
	title: string = "Create";
	id: number;
	errorMessage: any;
	modal: NgbModalRef;
	ataChapterName: string;
	filteredBrands: any[];
	localCollection: any[] = [];

	/** Actions ctor */

	constructor(private breadCrumb: SingleScreenBreadcrumbService, public ataservice: AtaMainService, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public ataSubChapter2Service: AtaSubChapter2Service, private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {
		//this.displayedColumns.push('action');
		this.dataSource = new MatTableDataSource();
		this.sourceAction = new ATASubChapter2();

	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	public allWorkFlows: ATASubChapter2[] = [];

	private loadData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.ataSubChapter2Service.getAtaSubChapter2List().subscribe(
			results => this.onDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

		this.cols = [
			//{ field: 'ataMainId', header: 'ATAMain Id' },
			//{ field: 'ataChapterName', header: 'ATA Chapter Name' },
			//{ field: 'ataChapterCategory', header: 'ATA Chapter Category' },
			{ field: 'memo', header: 'Memo' },
			{ field: 'createdBy', header: 'Created By' },
			{ field: 'updatedBy', header: 'Updated By' },
			{ field: 'updatedDate', header: 'Updated Date' },
			{ field: 'createdDate', header: 'createdDate' }
		];

		this.selectedColumns = this.cols;

	}

	private loadMasterCompanies() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.masterComapnyService.getMasterCompanies().subscribe(
			results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}
	private atamaindata() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.ataservice.getAtaMainList().subscribe(
			results => this.onSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onSuccessful(getAtaMainList: ATAChapter[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		//this.dataSource.data = getAtaMainList;
		this.allATAMaininfo1 = getAtaMainList;
	}

	public applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue;
	}

	private refresh() {
		// Causes the filter to refresh there by updating with recently added data.
		this.applyFilter(this.dataSource.filter);
	}

	private onDataLoadSuccessful(getAtaSubChapter2List: ATASubChapter2[]) {
		// alert('success');
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getAtaSubChapter2List;
		this.allATAMaininfo = getAtaSubChapter2List;
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

	handleChange(rowData, e) {
		if (e.checked == false) {
			this.sourceAction = rowData;
			this.sourceAction.updatedBy = this.userName;
			this.Active = "In Active";
			this.sourceAction.isActive == false;
			this.ataSubChapter2Service.updateATASubChapter2(this.sourceAction).subscribe(
				response => this.saveCompleted(this.sourceAction),
				error => this.saveFailedHelper(error));
			//alert(e);
		}
		else {
			this.sourceAction = rowData;
			this.sourceAction.updatedBy = this.userName;
			this.Active = "Active";
			this.sourceAction.isActive == true;
			this.ataSubChapter2Service.updateATASubChapter2(this.sourceAction).subscribe(
				response => this.saveCompleted(this.sourceAction),
				error => this.saveFailedHelper(error));
			//alert(e);
		}

	}

	open(content) {

		this.isEditMode = false;
		this.isDeleteMode = false;

		this.isSaving = true;
		this.loadMasterCompanies();
		this.sourceAction = new ATASubChapter2();
		this.sourceAction.isActive = true;
		this.ataChapterName = "";
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
		//this.ataChapterName = this.sourceAction.ataChapterName;
		this.loadMasterCompanies();
		this.modal = this.modalService.open(content, { size: 'sm' });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	openView(content, row) {

		this.sourceAction = row;
		//this.ataChapter_Name = row.ataChapterName;
		//this.ataChapterCategory = row.ataChapterCategory;
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



	openHist(content, row) {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;


		this.sourceAction = row;



		//this.isSaving = true;
		// debugger;
		this.ataSubChapter2Service.historyATASubChapter2(this.sourceAction.ataSubChapter2Id).subscribe(
			results => this.onHistoryLoadSuccessful(results[0], content),
			error => this.saveFailedHelper(error));


	}


	editItemAndCloseModel() {

		// debugger;

		this.isSaving = true;

		if (this.isEditMode == false) {
			this.sourceAction.createdBy = this.userName;
			this.sourceAction.updatedBy = this.userName;
			this.sourceAction.masterCompanyId = 1;
			//this.sourceAction.ataChapterName = this.ataChapterName;
			this.ataSubChapter2Service.newATASubChapter2(this.sourceAction).subscribe(
				role => this.saveSuccessHelper(role),
				error => this.saveFailedHelper(error));
		}
		else {

			this.sourceAction.updatedBy = this.userName;
			//this.sourceAction.ataChapterName = this.ataChapterName;
			this.sourceAction.masterCompanyId = 1;
			this.ataSubChapter2Service.updateATASubChapter2(this.sourceAction).subscribe(
				response => this.saveCompleted(this.sourceAction),
				error => this.saveFailedHelper(error));
		}

		this.modal.close();
	}

	deleteItemAndCloseModel() {
		this.isSaving = true;
		this.sourceAction.updatedBy = this.userName;
		this.ataSubChapter2Service.deleteATASubChapter2(this.sourceAction.ataSubChapter2Id).subscribe(
			response => this.saveCompleted(this.sourceAction),
			error => this.saveFailedHelper(error));
		this.modal.close();
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

	//partnmId(event) {
	//	//debugger;
	//	for (let i = 0; i < this.actionamecolle.length; i++) {
	//		if (event == this.actionamecolle[i][0].ataChapterName) {
	//			//alert("Action Name already Exists");
	//			this.disableSave = true;
	//			this.selectedActionName = event;
	//		}
	//	}
	//}

	//filterAtamains(event) {

	//	this.localCollection = [];
	//	for (let i = 0; i < this.allATAMaininfo.length; i++) {
	//		let ataChapterName = this.allATAMaininfo[i].ataChapterName;
	//		if (ataChapterName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
	//			this.actionamecolle.push([{
	//				"ataMainId": this.allATAMaininfo[i].ataMainId,
	//				"ataChapterName": ataChapterName
	//			}]),
	//				this.localCollection.push(ataChapterName);
	//		}
	//	}
	//}

	dismissModel() {
		this.isDeleteMode = false;
		this.isEditMode = false;
		this.modal.close();
	}

	private saveCompleted(user?: ATASubChapter2) {
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

	private saveSuccessHelper(role?: ATASubChapter2) {
		this.isSaving = false;
		this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);

		this.loadData();

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
}


