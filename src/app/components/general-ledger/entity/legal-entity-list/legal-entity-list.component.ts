import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut } from '../../../../services/animations';
// declare var $ : any;
declare var $ : any;
import { AuthService } from '../../../../services/auth.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { LegalEntityService } from '../../../../services/legalentity.service';
import {  MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { CommonService } from '../../../../services/common.service';
import { MasterCompany } from '../../../../models/mastercompany.model';
import { CurrencyService } from '../../../../services/currency.service';
import { Currency } from '../../../../models/currency.model';
import { TreeNode } from 'primeng/api';
import {  MenuItem } from 'primeng/api';
import {  Table,  } from 'primeng/table';
import { EntityViewComponent } from '../../../../shared/components/legalEntity/entity-view/entity-view.component';
import { DatePipe } from '@angular/common';
import { listSearchFilterObjectCreation } from '../../../../generic/autocomplete';
// import { DataTable } from 'primeng/datatable';
import * as moment from 'moment';
import { ConfigurationService } from '../../../../services/configuration.service';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';

@Component({ 
	selector: 'app-legal-entity-list',
	templateUrl: './legal-entity-list.component.html',
	styleUrls: ['./legal-entity-list.component.scss'],
	animations: [fadeInOut],
	providers: [DatePipe]
})

export class EntityEditComponent implements OnInit, AfterViewInit {
	cols1: any[];
	gridData: TreeNode[];
	childCollection: any[] = [];
	allCurrencyInfo: any[];
	sourceLegalEntity: any = {};
	lockboxing: any = {};
	selectedNode1: TreeNode;
	dataSource: MatTableDataSource<{}>;
	displayedColumns: any;
	display: boolean = false;
	@ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
	selectedColumn: any;
	lazyLoadEventDataInput: any;
	statusForList: string = 'Active';
	currentStatusForList: string = 'Active';
	isSpinnerVisible: boolean = true;
	@ViewChild(MatSort,{static:false}) sort: MatSort;
	loadingIndicator: boolean;
	currencyName: any;
	modelValue: boolean = false;
	filteredText: string;
	cols: any[];
	data: any;
	allComapnies: MasterCompany[] = [];
	allATAMaininfo: any;
	isSaving: boolean;
	customerauditHisory: any[];
	selectedColumns1: any[];
	isEditMode: boolean = false;
	isDeleteMode: boolean;
	// @ViewChild('dt',{static:false}) dataTable: DataTable;
	sourceViewforDocumentListColumns = [
        { field: 'fileName', header: 'File Name' },
    ];
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
	Active: string;
	entityViewFeilds: any = {};
	allCountryinfo: any[];
	countrycollection: any[];
	disablesave: boolean;
	selectedCountries: any;
	displayWarningModal: boolean = false;
	breadcrumbs: MenuItem[];
	selectedRowforDelete: any = {};
	results: any;
	filterText: any = '';
	currentDeletedstatus: boolean = false;
	auditHistory: object[];
	loading: boolean;
	lazyLoadEventData: Event;
	pageIndex: number = 0;
	pageSize: number = 10;
	totalPages: number;
	totalRecords: number = 0;
	selectedOnly: boolean = false;
    targetData: any;
	private table: Table;
	legalEntityColumns = [
		{ field: 'name', header: 'Legal entity Name' },
        { field: 'companyName', header: 'Company Name' },
		{ field: 'companyCode', header: 'Company Code' },
		{ field: 'phoneNumber', header: 'Phone Number' },
		{ field: 'address1', header: 'Address1' },
		{ field: 'address2', header: 'Address2' },
		{ field: 'city', header: 'City' },
		{ field: 'stateOrProvince', header: 'State/Province' },
		{ field: 'postalCode', header: 'ZIP' },
		{ field: 'country', header: 'Country' },
		{ field: 'createdDate', header: 'Created Date' },
		{ field: 'createdBy', header: 'Created By' },
		{ field: 'updatedDate', header: 'Updated Date' },
		{ field: 'updatedBy', header: 'Updated By' },
	];
	selectedColumns = this.legalEntityColumns;
	moduleName:any="LegalEntity";
	referenceId:any;
	pageNumber = 0;
	isViewMode: boolean;
	isAdd:boolean=true;
	isEdit:boolean=true;
	isDelete:boolean=true;
	constructor(private route: Router,
		private authService: AuthService,
		private alertService: AlertService,
		public currency: CurrencyService,
		public entityService: LegalEntityService,
		private modalService: NgbModal,
		private commonService: CommonService,
		private configurations: ConfigurationService,
		private datePipe: DatePipe) {

			this.isAdd=this.authService.checkPermission([ModuleConstants.Organization+'.'+PermissionConstants.Add]);
        this.isEdit=this.authService.checkPermission([ModuleConstants.Organization+'.'+PermissionConstants.Update]);
        this.isDelete=this.authService.checkPermission([ModuleConstants.Organization+'.'+PermissionConstants.Delete]);
		this.dataSource = new MatTableDataSource();
		if (this.entityService.listCollection != null && this.entityService.isEditMode == true) {
			this.sourceLegalEntity = this.entityService.listCollection;
			this.sourceLegalEntity.createdDate = new Date();
			this.sourceLegalEntity.modifiedDate = new Date();
		}
	}
	ngOnInit(): void {
		this.sourceLegalEntity.isBalancingEntity = true;
		this.breadcrumbs = [
			{ label: 'Organization' },
			{ label: 'Legal Entity List' },
		];
	}
	closeDeleteModal() {
        $("#downloadConfirmation").modal("hide");
	}
	
	get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }    
	
	getAuditHistoryById(content, row) {
		this.alertService.startLoadingMessage();
		this.entityService.getLeaglEntityHistory(row.legalEntityId).subscribe(
			results => this.onAuditHistoryLoadSuccessful(results, content), err => {

				const errorLog = err;
				this.errorMessageHandler(errorLog);
			});
	}
	first:any=0;
	getStatusForList(status) { 
		this.pageNumber = 0;
		const pageIndex = 0;
		this.currentStatusForList=status ? status :'Active';
		this.pageIndex = pageIndex;
		this.pageSize = this.lazyLoadEventDataInput.rows;
		this.lazyLoadEventDataInput.first = pageIndex;
		this.statusForList = status ? status :'Active';
		this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status };
		const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
		// this.first=0;
		// PagingData.page=1;
		this.getList(PagingData);
	}
	
	getDeleteListByStatus(value) {
		// this.pageNumber = 0;
		this.currentDeletedstatus=true;
		// const pageIndex = 0;
		// this.pageIndex = pageIndex;
		// this.pageSize = this.lazyLoadEventDataInput.rows;
		// this.lazyLoadEventDataInput.first = pageIndex;

		this.pageNumber = 0;
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = this.pageIndex;

		if (value == true) {
			this.currentDeletedstatus = true;
			this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForList };
			this.isSpinnerVisible = true;
			this.loadDatas(this.lazyLoadEventDataInput);
		} else {
			this.currentDeletedstatus = false;
			this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForList };
			this.isSpinnerVisible = true;
			this.loadDatas(this.lazyLoadEventDataInput);
		}
	}

	globalSearch(value) {
		this.isSpinnerVisible = true;
		this.pageIndex = this.lazyLoadEventDataInput.rows > 10 ? parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows : 0;
		this.pageSize = this.lazyLoadEventDataInput.rows;
		this.lazyLoadEventDataInput.first = this.pageIndex;
		this.lazyLoadEventDataInput.globalFilter = value;
		this.filterText = value;
		this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForList };
		this.getList(this.lazyLoadEventDataInput);
	}
	
	private onAuditHistoryLoadSuccessful(auditHistory, content) {
		this.alertService.stopLoadingMessage();
		this.customerauditHisory = auditHistory;
		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
	}


	getColorCodeForHistory(i, field, value) {
		const data = this.auditHistory;
		const dataLength = data.length;
		if (i >= 0 && i <= dataLength) {
			if ((i + 1) === dataLength) {
				return true;
			} else {
				return data[i + 1][field] === value
			}
		}
	}

	modal: NgbModalRef;
	modal1: NgbModalRef;

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	public allWorkFlows: any[] = [];
	getList(data) {

		this.isSpinnerVisible = true;
		const isdelete = this.currentDeletedstatus ? true : false;
		data.filters.isDeleted = isdelete;		
        data.filters.masterCompanyId = this.currentUserMasterCompanyId; 
		const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
		this.entityService.getEntityLists(PagingData).subscribe(res => {
			this.alertService.stopLoadingMessage();
			const data = res;
			this.isSpinnerVisible = false;
			this.allATAMaininfo = data[0]['results'].map(x => {
				return {
					...x,
					createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '', 
					updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
				}
			});;
			if (this.allATAMaininfo.length > 0) {
				this.totalRecords = data[0]['totalRecordsCount'];
				this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
			}
			else {
				this.totalRecords = 0;
				this.totalPages = 0;
			} 
		}, err => {

			const errorLog = err;
			this.errorMessageHandler(errorLog);
		})
	}
	allAssetInfoOriginal:any=[];
	dateObject:any={}
  dateFilterForTable(date, field) {
	const minyear = '1900';
	const dateyear = moment(date).format('YYYY');
	this.dateObject={}
	date=moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
    if(date !="" && moment(date, 'MM/DD/YYYY',true).isValid()){
		if(dateyear > minyear){
     		if(field=='createdDate'){
	  			this.dateObject={'createdDate':date}
  			}else if(field=='updatedDate'){
			  	this.dateObject={'updatedDate':date}
		} 
  		this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters ,...this.dateObject};
  		const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
	  	this.getList(PagingData); 
	  }
	}else{
  		this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,...this.dateObject};
  		if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate){
	  	delete this.lazyLoadEventDataInput.filters.createdDate;
  	}
  	if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate){
	  	delete this.lazyLoadEventDataInput.filters.updatedDate;
  	}
  	this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,...this.dateObject};
	  const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
	  this.getList(PagingData); 
	}
	
  }
	columnsChanges() {
		this.refreshList();
	}
	refreshList() {
		if (this.filteredText != "" && this.filteredText != null && this.filteredText != undefined) {
			this.globalSearch(this.filteredText);
		}
		else {
			this.table.reset();
		}
	}

	loadDatas(event) {
		this.lazyLoadEventData = event;
		this.pageIndex = parseInt(event.first) / event.rows;
		if(this.pageIndex <1){
            this.pageIndex=this.pageIndex*10;
        }
		// this.pageIndex = pageIndex;
		this.pageSize = event.rows;
		event.first = this.pageIndex;
		this.lazyLoadEventDataInput = event;
		this.lazyLoadEventDataInput.filters = {
			...this.lazyLoadEventDataInput.filters,
			status: this.statusForList ? this.statusForList : 'Active',
		}

		if (this.filterText == '') {
			this.getList(this.lazyLoadEventDataInput);
		} else {
			this.globalSearch(this.filterText);
		}
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

	open(content) {
		this.route.navigateByUrl(`generalledgermodule/generalledgerpage/app-legal-entity-add`);
	}

	navigateTogeneralInfo() {
		this.entityService.isEditMode = false;
		this.entityService.ShowPtab = true;
		this.entityService.currentUrl = '/generalledgermodule/generalledgerpage/app-legal-entity-add';
		this.entityService.bredcrumbObj.next(this.entityService.currentUrl);
		this.entityService.alertObj.next(this.entityService.ShowPtab);
		this.route.navigateByUrl('/generalledgermodule/generalledgerpage/app-legal-entity-add');
		this.entityService.listCollection = undefined;
	}

	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	openCurrency(content) {
		this.isEditMode = false;
		this.isDeleteMode = false;
		this.isSaving = true;
		this.sourceAction = new Currency();
		this.sourceAction.isActive = true;
		this.currencyName = "";
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	editItemAndCloseModel() {
		if (!(this.sourceLegalEntity.name && this.sourceLegalEntity.description && this.sourceLegalEntity.reportingCurrencyId && this.sourceLegalEntity.reportingCurrencyId && this.sourceLegalEntity.ledgerName)) {
			this.display = true;
			this.modelValue = true;
		}
		if (this.sourceLegalEntity.name && this.sourceLegalEntity.description && this.sourceLegalEntity.reportingCurrencyId && this.sourceLegalEntity.reportingCurrencyId && this.sourceLegalEntity.ledgerName) {
			if (!this.sourceLegalEntity.legalEntityId) {
				this.sourceLegalEntity.createdBy = this.userName;
				this.sourceLegalEntity.updatedBy = this.userName;

				this.sourceLegalEntity.masterCompanyId = 1;
				this.entityService.newAddEntity(this.sourceLegalEntity).subscribe(data => {
					this.alertService.showMessage(
						'Success',
						'Legal Entity added successfully.',
						MessageSeverity.success
					);
				}, err => {

					const errorLog = err;
					this.errorMessageHandler(errorLog);
				});
			}
			else {
				this.sourceLegalEntity.createdBy = this.userName;
				this.sourceLegalEntity.updatedBy = this.userName;
				this.sourceLegalEntity.masterCompanyId = 1;
				this.entityService.updateEntity(this.sourceLegalEntity).subscribe(data => {
					this.alertService.showMessage(
						'Success',
						'Legal Entity updated successfully.',
						MessageSeverity.success
					);
				}, err => {

					const errorLog = err;
					this.errorMessageHandler(errorLog);
				});
			}
			if (this.modal) { this.modal.close(); }
			if (this.modal1) { this.modal1.close(); }
		}

		if (this.display == false) {
			this.dismissModel();
		}
	}

	dismissModelWarning() {
		this.displayWarningModal = true;
	}


	dismissModel() {
		this.isDeleteMode = false;
		this.isEditMode = false;
		if (this.modal) { this.modal.close(); }
		if (this.modal1) { this.modal1.close(); }
	}

	openContentEdit(row) {
		const { legalEntityId } = row;
		localStorage.removeItem('currentLETab');
		this.route.navigateByUrl(`generalledgermodule/generalledgerpage/app-legal-entity-edit/${legalEntityId}`);
	}

	openEdit(content, row) {
		this.GeneralInformation();
		this.sourceLegalEntity = {};
		this.sourceLegalEntity = row;

		this.isSaving = true;
		this.sourceLegalEntity.parentId = row.legalEntityId;
		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
		this.modal.result.then(() => {
		}, () => {
		})
	}

	openDelete(content, row) {
		this.sourceLegalEntity = row;
		this.selectedRowforDelete = row;
		this.isEditMode = false;
		this.isDeleteMode = true;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	deleteItemAndCloseModel() {
		this.isSaving = true;
		this.selectedRowforDelete.updatedBy = this.userName;
		this.entityService.updateEntitydelete(this.selectedRowforDelete.legalEntityId).subscribe(
			data => {
				this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
				// this.getStatusForList(this.statusForList);
				const lazyEvent = this.lazyLoadEventDataInput;
				this.loadDatas({
					...lazyEvent,
					filters: {
						...lazyEvent.filters,
						status:this.statusForList
					}
				})
			}, err => {
				const errorLog = err;
				this.errorMessageHandler(errorLog);
			})
		this.modal.close();
	}

	openHist(content, row) {
		this.sourceLegalEntity = row;
	}

	toggleIsActive(rowData, e) { 
		if (e.checked == false) {
			this.Active = "InActive";
		}else{
			this.Active = "Active";
		}
		this.entityService.updateLegalEntityStatus(rowData.legalEntityId, this.Active, this.userName).subscribe(res => {
			// if (rowData.isActive) {
			// 	this.getStatusForList('InActive')
			// }
			// else {
			// 	this.getStatusForList('Active')
			// }
			const pageIndex = parseInt(this.lazyLoadEventDataInput.first); 
			this.pageIndex = pageIndex;
			this.pageSize = this.lazyLoadEventDataInput.rows;
			this.lazyLoadEventDataInput.first = pageIndex >= 1 ? pageIndex : 0;
			
			this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForList, isDeleted: this.currentDeletedstatus };
			const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
		  
			const lazyEvent = this.lazyLoadEventDataInput;
			this.loadDatas(PagingData)
			this.alertService.showMessage("Success", `Updated successfully`, MessageSeverity.success);
		}, err => {

			const errorLog = err;
			this.errorMessageHandler(errorLog);
		})
	}

	getEntityDataById(id) {
		this.entityService.getEntityDataById(id).subscribe(res => {
			this.entityViewFeilds.faxNumber = res.faxNumber;
			this.entityViewFeilds.phoneNumber1 = res.phoneNumber;
			this.entityViewFeilds.functionalCurrencyId = res.functionalCurrencyId;
			this.entityViewFeilds.reportingCurrencyId = res.reportingCurrencyId;
			this.entityViewFeilds.isBalancingEntity = res.isBalancingEntity;
			this.entityViewFeilds.cageCode = res.cageCode;
			this.entityViewFeilds.faaLicense = res.faaLicense;
			this.entityViewFeilds.taxId = res.taxId;
		}, err => {

			const errorLog = err;
			this.errorMessageHandler(errorLog);
		})
	}

	onCloseViewEntity() {
		$('#invView').modal('hide');
		// $('.show').remove();
		// $('.modal').remove();
// $('.modal-backdrop').remove();
        // this.modal.close();
	}
	legalEntityMainId:any;
	sourceViewforDocumentList:any=[];
	isSpinnerVisibleHistory:any=false;
	showViewForTabs:any=false;
	openView(row) {
// 		            $('.show').add();
//             $('.modal').add();
// $('.modal-backdrop').add(); 
 
		this.showViewForTabs=false;
		const { legalEntityId } = row;
	
		this.isSpinnerVisibleHistory = true;
		this.referenceId=legalEntityId
		this.entityService.getEntityDataById(legalEntityId).subscribe(res => {
			this.showViewForTabs=true;
			res.legalEntityCode=res.companyCode;
			this.viewDataGeneralInformation = res;
			if(this.viewDataGeneralInformation.invoiceAddressPosition==1){
				this.viewDataGeneralInformation.invoiceAddressPositionTop=true;
			}else 	if(this.viewDataGeneralInformation.invoiceAddressPosition==2){
				this.viewDataGeneralInformation.invoiceAddressPositionBottom=true;
			}
			if(this.viewDataGeneralInformation.invoiceFaxPhonePosition==1){
				this.viewDataGeneralInformation.invoiceFaxPhonePositionTop=true;
			}else 	if(this.viewDataGeneralInformation.invoiceFaxPhonePosition==2){
				this.viewDataGeneralInformation.invoiceFaxPhonePositionBottom=true;
			}

			this.legalEntityMainId=res.legalEntityId
		
			this.bankingAps(legalEntityId);
			this.editlegalEntityLogo(res.attachmentId, legalEntityId);
			this.getEntityLockBoxDataById(legalEntityId);
			setTimeout(() => {
				this.isSpinnerVisibleHistory = false;
			}, 1500);
		}, err => {
			this.isSpinnerVisibleHistory = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		})
	}
	editlegalEntityLogo(attachmentId, legalEntityId) {
        this.entityService.toGetUploadDocumentsList(attachmentId, legalEntityId, 41).subscribe(res => {

            this.sourceViewforDocumentList = res; 

        }, err => {

			const errorLog = err;
			this.errorMessageHandler(errorLog);
		});
	}
	isLockBox:any=false;
	isDomesticWire:any=false;
	isInternationalWire:any=false;
	isAch:any=false;
	
	getEntityLockBoxDataById(legalEntityId) {
        this.entityService.getEntityLockboxDataById(legalEntityId).subscribe(res => {
            if (res != null && res && res.length !=0)  {
this.isLockBox=false;
                this.lockboxing = {
                    ...this.lockboxing,
                    poBox: res[0].poBox,
                    bankStreetaddress1: res[0].address1,
                    bankStreetaddress2: res[0].address2,
                    bankCity: res[0].city,
                    bankProvince: res[0].stateOrProvince,
                    bankcountry: res[0].country,
                    bankpostalCode: res[0].postalCode
                };
            }else{
				this.isLockBox=true;
			}
        })
        this.getEntityDomesticwireDataById(legalEntityId);
    }
    getEntityDomesticwireDataById(legalEntityId) {
        this.entityService.getEntityDomesticDataById(legalEntityId).subscribe(res => {
            if ( res != null && res && res.length !=0) {
				this.isDomesticWire=false;
                this.lockboxing = {
                    ...this.lockboxing,
                    domesticBankName: res[0].bankName,
                    domesticIntermediateBank: res[0].intermediaryBankName,
                    domesticBenficiaryBankName: res[0].benificiaryBankName,
                    domesticBankAccountNumber: res[0].accountNumber,
                    domesticABANumber: res[0].aba
                }
            }else{
				this.isDomesticWire=true;
			}

        })

        this.getInternationalwireDataById(legalEntityId);

    }

    getInternationalwireDataById(legalEntityId) {
        this.entityService.getEntityInternalDataById(legalEntityId).subscribe(res => {
            const response = res;
            if ( res != null && res && res.length !=0) {
				this.isInternationalWire=false;
                this.lockboxing = {
                    ...this.lockboxing,
                    internationalBankName: res[0].bankName,
                    internationalIntermediateBank: res[0].intermediaryBank,
                    internationalBenficiaryBankName: res[0].beneficiaryBank,
                    internationalBankAccountNumber: res[0].beneficiaryBankAccount,
                    internationalSWIFTID: res[0].swiftCode
                }
            }else{
				this.isInternationalWire=true;
			}
        })
        this.getEntityACHDataById(legalEntityId);
    }


    getEntityACHDataById(legalEntityId) {
        this.entityService.getEntityAchDataById(legalEntityId).subscribe(res => {
            const response = res;
            if ( res != null && res && res.length !=0) {
				this.isAch=false;
                this.lockboxing = {
                    ...this.lockboxing,
                    achBankName: res[0].bankName,
                    achIntermediateBank: res[0].intermediateBankName,
                    achBenficiaryBankName: res[0].beneficiaryBankName,
                    achBankAccountNumber: res[0].accountNumber,
                    achABANumber: res[0].aba,
                    achSWIFTID: res[0].swiftCode,
                }
            }else{
				this.isAch=true;
			}
        })
    }
	bankingApiDataList:any=[];
	bankingAps(legalEntityId){ 
		this.entityService.getBankingApisData(legalEntityId).subscribe(res=>{

			this.bankingApiDataList=[];
			this.bankingApiDataList=res;
		}, err => {

			const errorLog = err;
			this.errorMessageHandler(errorLog);
		})
	}
	viewDataGeneralInformation:any={}
	filtercountry(event) {
		this.countrycollection = [];
		if (this.allCountryinfo.length > 0) {
			for (let i = 0; i < this.allCountryinfo.length; i++) {
				let countryName = this.allCountryinfo[i].nice_name;
				if (countryName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.countrycollection.push(countryName);
				}
			}
		}
	}

	onCountrieselected(event) {
		if (this.allCountryinfo) {
			for (let i = 0; i < this.allCountryinfo.length; i++) {
				if (event == this.allCountryinfo[i].nice_name) {
					this.sourceLegalEntity.nice_name = this.allCountryinfo[i].nice_name;
					this.disablesave = false;
					this.selectedCountries = event;
				}
			}
		}
	}

	eventCountryHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedCountries) {
				if (value == this.selectedCountries.toLowerCase()) {
					this.disablesave = false;
				}
				else {
					this.disablesave = true;
				}
			}
		}
	}
		exportCSV(dt) {
		this.isSpinnerVisible = true;
		const isdelete = this.currentDeletedstatus ? true : false;
		let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": {"masterCompanyId": this.currentUserMasterCompanyId,"status": this.statusForList, "isDeleted": isdelete }, "globalFilter": this.filterText ? this.filterText :"" }		
		let filters = Object.keys(dt.filters);
		filters.forEach(x => {
			PagingData.filters[x] = dt.filters[x].value;
		});
		this.entityService.getEntityLists(PagingData).subscribe(res => {
			const vList = res[0]['results'].map(x => {
				return {
					...x,
					createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '', 
					updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
				}
			});

			dt._value = vList;
			dt.exportCSV();
			$("#downloadConfirmation").modal("hide");
			this.dismissModel();
			dt.value = this.allATAMaininfo;
			this.isSpinnerVisible = false;
		}, err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		});
	}



	getLegalEntityHistoryById(content,rowData) {
		this.isSpinnerVisible = true;
		this.entityService.getLeaglEntityHistoryById(rowData.legalEntityId).subscribe(res => {
			this.auditHistory = res;
			this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false,windowClass: 'assetMange' }); 
			this.isSpinnerVisible = false;
		}, err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		});
	}
	restorerecord: any = {} 
	downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }
	restoreRecord() {
		this.commonService.updatedeletedrecords('LegalEntity', 'LegalEntityId', this.restorerecord.legalEntityId).subscribe(res => {
			// this.getDeleteListByStatus(true)
			const lazyEvent = this.lazyLoadEventDataInput;
			this.loadDatas({
				...lazyEvent,
				filters: {
					...lazyEvent.filters,
					status:this.statusForList
				}
			})
			this.modal.close();
			this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
		}, err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		});
	}

	restore(content, rowData) {
		this.restorerecord = rowData;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	closeHistoryModal() {
		// $("#legalEntityHistory").modal("hide");
		this.modal.close();
	}

	openStep1() {
        $('#step1').collapse('show');
    }

    ExpandAllCustomerDetailsModel() {
        $('#step1').collapse('show');
        $('#step2').collapse('show');
        $('#step3').collapse('show');
        $('#step4').collapse('show');
        $('#step5').collapse('show');
        $('#step6').collapse('show');
        $('#step7').collapse('show');
        $('#step8').collapse('show');
        $('#step9').collapse('show');
        $('#step10').collapse('show');
    }
    CloseAllCustomerDetailsModel() {
        $('#step1').collapse('hide');
        $('#step2').collapse('hide');
        $('#step3').collapse('hide');
        $('#step4').collapse('hide');
        $('#step5').collapse('hide');
        $('#step6').collapse('hide');
        $('#step7').collapse('hide');
        $('#step8').collapse('hide');
        $('#step9').collapse('hide');
        $('#step10').collapse('hide');

	}
	

    openTag(content) {

				this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
			}
	errorMessageHandler(log) {
        this.isSpinnerVisible = false;
        // this.alertService.showMessage(
        //     'Error',
        //     log,
        //     MessageSeverity.error
        // ); 
	}
	auditHistoryHeaders: any = [];
	auditHistoryList: any = [];
	// isSpinnerVisibleHistory: boolean = false;
	getAuditHistoryByIdbanking(content,type) {
		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false ,windowClass: 'assetMange'});
		if (type == 1) {
			this.auditHistoryHeaders = [];
			this.isSpinnerVisibleHistory = true;
			this.entityService.getLeaglLockBoxHistory(this.referenceId).subscribe(
				res => {
					this.auditHistoryList = res;
					this.isSpinnerVisibleHistory = false;
				}, err => {
					this.isSpinnerVisibleHistory = false;
					const errorLog = err;
					this.errorMessageHandler(errorLog);
				});
			this.auditHistoryHeaders = [
				{ header: 'PO Box', field: 'poBox' },
				{ header: 'Street Address Line 1', field: 'line1' },
				{ header: 'Street Address Line 2', field: 'line2' },
				{ header: 'City', field: 'city' },
				{ header: 'Province/State', field: 'stateOrProvince' },
				{ header: 'Country', field: 'countries_name' },
				{ header: 'Postal Code', field: 'postalCode' },
				{ header: 'Created Date', field: 'createdDate' },
				{ header: 'Created By', field: 'createdBy' },
				{ header: 'Updated Date', field: 'updatedDate' },
				{ header: 'Updated By', field: 'updatedBy' }
			];
		} else if (type == 2) {
			this.auditHistoryHeaders = [];
			this.isSpinnerVisibleHistory = true;
			this.entityService.getLeaglDomesticHistory(this.referenceId).subscribe(
				res => {
					this.auditHistoryList = res;
					this.isSpinnerVisibleHistory = false;
				}, err => {
					const errorLog = err;
					this.isSpinnerVisibleHistory = false;
					this.errorMessageHandler(errorLog);
				});
			this.auditHistoryHeaders = [
				{ header: 'Bank Name', field: 'bankName' },
				{ header: 'Intermediate Bank', field: 'intermediaryBankName' },
				{ header: 'Benficiary Bank Name', field: 'benificiaryBankName' },
				{ header: 'Bank Account Number', field: 'accountNumber' },
				{ header: 'ABA Number', field: 'aba' },
				{ header: 'Created Date', field: 'createdDate' },
				{ header: 'Created By', field: 'createdBy' },
				{ header: 'Updated Date', field: 'updatedDate' },
				{ header: 'Updated By', field: 'updatedBy' }
			];
		} else if (type == 3) {
			this.auditHistoryHeaders = [];
			this.isSpinnerVisibleHistory = true;
			this.entityService.getLeaglInternationalHistory(this.referenceId).subscribe(
				res => {
					this.auditHistoryList = res;
					this.isSpinnerVisibleHistory = false;
				}, err => {
					const errorLog = err;
					this.isSpinnerVisibleHistory = false;
					this.errorMessageHandler(errorLog);
				});
			this.auditHistoryHeaders = [
				{ header: 'Bank Name', field: 'bankName' },
				{ header: 'Intermediate Bank', field: 'intermediaryBank' },
				{ header: 'Benficiary', field: 'beneficiaryBank' },
				{ header: 'Account Number', field: 'beneficiaryBankAccount' },
				{ header: 'ABA Number', field: 'aba' },
				{ header: 'SWIFT Code', field: 'swiftCode' },
				{ header: 'Created Date', field: 'createdDate' },
				{ header: 'Created By', field: 'createdBy' },
				{ header: 'Updated Date', field: 'updatedDate' },
				{ header: 'Updated By', field: 'updatedBy' }
			];
		} else if (type == 4) {
			this.auditHistoryHeaders = [];
			this.isSpinnerVisibleHistory = true;
			this.entityService.getLeaglAchHistory(this.referenceId).subscribe(
				res => {
					this.auditHistoryList = res;
					this.isSpinnerVisibleHistory = false;
				}, err => {
					const errorLog = err;
					this.isSpinnerVisibleHistory = false;
					this.errorMessageHandler(errorLog);
				});
			this.auditHistoryHeaders = [
				{ header: 'Bank Name', field: 'bankName' },
				{ header: 'Intermediate Bank', field: 'intermediateBankName' },
				{ header: 'Benficiary Bank Name', field: 'beneficiaryBankName' },
				{ header: 'Bank Account Number', field: 'accountNumber' },
				{ header: 'ABA Number', field: 'aba' },
				{ header: 'SWIFT Code', field: 'swiftCode' },
				{ header: 'Created Date', field: 'createdDate' },
				{ header: 'Created By', field: 'createdBy' },
				{ header: 'Updated Date', field: 'updatedDate' },
				{ header: 'Updated By', field: 'updatedBy' }
			];
		}
	}
	CloserCOnatcHistory() {
		// $("#contentHist").modal("hide");
		this.modal.close();
	}	
	getColorCodeForHistoryBanking(i, field, value) {
		const data = this.auditHistoryList;
		const dataLength = data.length;
		if (i >= 0 && i <= dataLength) {
			if ((i + 1) === dataLength) {
				return true;
			} else {
				return data[i + 1][field] === value
			}
		}
	}

	changeOfTab(event) {}
}