import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, Input } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
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
import { VendorService } from '../../../services/vendor.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { Vendor } from '../../../models/vendor.model';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { GMapModule } from 'primeng/gmap';
declare var $: any;
import { DatePipe } from '@angular/common';
import { getObjectById, editValueAssignByCondition, getObjectByValue } from '../../../generic/autocomplete';
import { VendorStepsPrimeNgComponent } from '../vendor-steps-prime-ng/vendor-steps-prime-ng.component';
import { ConfigurationService } from '../../../services/configuration.service';
import { CommonService } from '../../../services/common.service';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';
declare const google: any;

@Component({
	selector: 'app-vendor-payment-information',
	templateUrl: './vendor-payment-information.component.html',
	styleUrls: ['./vendor-payment-information.component.scss'],
	animations: [fadeInOut],
	providers: [DatePipe]
})
/** VendorPaymentInformation component*/
export class VendorPaymentInformationComponent implements OnInit, AfterViewInit {

	modelValue: boolean;
	display: boolean;
	selectedOnly: boolean = false;
	targetData: any;
	defaultPaymentStyle: boolean = true;
	defaultPaymentValue: boolean = true;
	activeIndex: number = 7;
	showcountry: boolean;
	showpostalCode: boolean;
	showstateOrProvince: boolean;
	showCity: boolean;
	showAddress1: boolean;
	showSiteName: boolean;
	alldata: any;
	step: string;
	internationalwithVendor: any[];
	defaultwithVendor: any[];
	domesticWithVedor: any[];
	checkAddress: boolean = false;
	vendorCode: any = "";
	vendorname: any = "";
	allgeneralInfo: any[];
	collection: any;
	action_name: any = "";
	allAddresses: any[];
	addressId: any;
	memo: any = "";
	createdBy: any = "";
	updatedBy: any = "";
	createddate: any = "";
	updatedDate: any = "";
	viewName: string = "Create";
	sub: any;
	local: any;
	closeCmpny: boolean = true;
	service: boolean = false;
	public checkValue: boolean = false;
	public domasticWireValue: boolean = false;
	public internationalValue: boolean = false;
	public checkStyle: boolean = false;
	public domesticWireStyle: boolean = false;
	public internationalStyle: boolean = false;
	updatedCollection: {};
	siteName: any;
	address1: any;
	address2: any;
	isPrimary: boolean = false;
	city: any;
	stateOrProvince: any;
	postalCode: number;
	country: any;
	defaultPaymentMethod: number;
	disablesaveforCountry: boolean;
	disablesavefoInternalrCountry: boolean;
	isSpinnerVisible: boolean = false;
	disablesaveforBeneficiary: boolean;
	selectedRowforDelete: any;
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;
	filteredBrands: any[];
	displayedColumns = ['actionId', 'companyName', 'description', 'memo', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
	dataSource: MatTableDataSource<any>;
	allActions: any[] = [];
	allComapnies: MasterCompany[] = [];
	private isSaving: boolean;
	public sourceVendor: any = {};
	public domesticSaveObj: any = {};
	public internationalSaveObj: any = {};
	public defaultSaveObj: any = {};
	public defaultPaymentObj: any = {};
	public sourceAction: any = [];
	public auditHisory: AuditHistory[] = [];
	private bodyText: string;
	//loadingIndicator: boolean;
	closeResult: string;
	selectedColumn: any[];
	selectedColumns: any[] = [];
	cols: any[];
	title: string = "Create";
	id: number;
	errorMessage: any;
	modal: NgbModalRef;
	actionName: string;
	Active: string = "Active";
	length: number;
	localCollection: any[] = [];
	public overlays: any[];
	allCountryinfo: any[];
	countrycollection: any;
	selectedCountries: any;
	private isEditMode: boolean = false;
	private isDeleteMode: boolean = false;
	isEditPaymentInfo: boolean = false;
	pageSize: number = 10;
	totalRecords: number = 0;
	totalPages: number = 0;
	@Input() vendorId: number = 0;
	@Input() isViewMode: boolean = false;
	selectedParentId: any;
	isvendorEditMode: any;
	formData = new FormData();
	disableSave: boolean = true;
	//loaderForPaymentCheck: boolean;
	vendorData: any = {};
	originalTableData: any = [];
	currentDeletedstatus: boolean = false;
	status: any = "Active";
	currentstatus: string = 'Active';
	public allWorkFlows: any[] = [];
	restorerecord: any = {};
	arraySiteIdlist: any[] = [];
	sitelistCollection: any[];
	sitelistCollectionOriginal: any[];
	changeName: boolean = false;
	isSiteNameAlreadyExists: boolean = false;
	disableSaveSiteName: boolean;
	arrayCountrylist: any[] = [];
	disableSavePaymentCountry: boolean = true;
	vendorCodeandName: any;
	contact: any;
	editSiteName: any
	isAdd: boolean = true;
	isEdit: boolean = true;
	isDelete: boolean = true;
	isPaymentView: boolean = true;
	constructor(private http: HttpClient, private datePipe: DatePipe, private commonService: CommonService, private changeDetectorRef: ChangeDetectorRef, private router: ActivatedRoute, private route: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public vendorService: VendorService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService) {
		if (window.localStorage.getItem('vendorService')) {
			var obj = JSON.parse(window.localStorage.getItem('vendorService'));
			if (obj.listCollection && this.router.snapshot.params['id']) {
				this.vendorService.checkVendorEditmode(true);
				this.vendorService.isEditMode = true;
				this.vendorService.listCollection = obj.listCollection;
				this.vendorService.indexObj.next(obj.activeIndex);
				this.vendorService.enableExternal = true;
				this.vendorId = this.router.snapshot.params['id'];
				this.vendorService.vendorId = this.vendorId;
				this.vendorService.listCollection.vendorId = this.vendorId;
				if (this.vendorId > 0) {
					this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
						res => {
							this.local = res[0];
							this.vendorCodeandName = res[0];
							this.selectedParentId = res[0];
							if (this.local.vendorName !== undefined) {
								this.domesticSaveObj.vendorName = { vendorId: res[0].vendorId, vendorName: res[0].vendorName }
							}
							if (this.local.vendorName !== undefined) {
								this.internationalSaveObj.vendorName = { vendorId: res[0].vendorId, vendorName: res[0].vendorName }
							}

						}, err => {
							this.isSpinnerVisible = false;
						});
				}
			}
		}
		else {
			this.getVendorCodeandNameByVendorId();
		}
		if (this.vendorService.listCollection !== undefined) {
			this.vendorService.isEditMode = true;
		}

		if (this.vendorService.financeCollection) {
			this.local = this.vendorService.financeCollection;
		}
		if (this.defaultPaymentMethod == 1) {
			this.showPament();
		}
		if (this.defaultPaymentMethod == 2) {
			this.showDomesticWire();
		}

		this.cols = [
			{ field: 'tagName', header: 'Tag', width: '150px' },
			{ field: 'attention', header: 'Attention', width: '150px' },
			{ field: 'siteName', header: 'Site Name', width: '150px' },
			{ field: 'address1', header: 'Address1', width: '150px' },
			{ field: 'address2', header: 'Address2', width: '150px' },
			{ field: 'city', header: 'City', width: '120px' },
			{ field: 'stateOrProvince', header: 'State/Prov', width: '100px' },
			{ field: 'postalCode', header: 'Postal Code', width: '100px' },
			{ field: 'countryName', header: 'Country', width: '120px' },
			{ field: 'createdDate', header: 'Created Date', width: '150px' },
			{ field: 'createdBy', header: 'Created By', width: '100px' },
			{ field: 'updatedDate', header: 'Updated Date', width: '150px' },
			{ field: 'updatedBy', header: 'Updated By', width: '100px' },
			{ field: 'isPrimayPayment', header: 'IsPrimary', width: '40px' }
		];
		this.selectedColumns = this.cols;

		//this.countrylist();
		this.dataSource = new MatTableDataSource();
		if (this.local) {
			this.vendorService.contactCollection = this.local;
		}
		if (this.vendorService.generalCollection) {
			this.local = this.vendorService.generalCollection;
		}
		if (this.vendorService.listCollection && this.vendorService.isEditMode == true) {
			this.viewName = "Edit";
			this.local = this.vendorService.listCollection;
			//this.loadData();
		}
		if (this.vendorService.generalCollection) {
			this.local = this.vendorService.generalCollection;
			this.sourceVendor.siteName = this.local.vendorName;
			this.sourceVendor.address1 = this.local.address1;
			this.sourceVendor.address2 = this.local.address2;
			this.sourceVendor.address3 = this.local.address3;
			this.sourceVendor.city = this.local.city;
			this.sourceVendor.countryId = this.local.countryId;
			this.sourceVendor.stateOrProvince = this.local.stateOrProvince;
			this.sourceVendor.postalCode = this.local.PostalCode;
			this.sourceVendor.fileCreatedBy = this.local.fileCreatedBy;
			this.sourceVendor.fileCreatedBy = this.local.fileCreatedBy;
			this.sourceVendor.fileUpdatedDate = this.local.fileUpdatedDate;
			this.sourceVendor.fileUpdatedBy = this.local.fileUpdatedBy;
		}
		if (this.vendorService.listCollection && this.vendorService.isEditMode == true) {
			this.viewName = "Edit";
			this.local = this.vendorService.listCollection;
			//this.loadData();
		}

		this.isAdd = this.authService.checkPermission([ModuleConstants.Vendors_PaymentInformation + '.' + PermissionConstants.Add])
		this.isEdit = this.authService.checkPermission([ModuleConstants.Vendors_PaymentInformation + '.' + PermissionConstants.Update])
		this.isDelete = this.authService.checkPermission([ModuleConstants.Vendors_PaymentInformation + '.' + PermissionConstants.Delete])
		this.isPaymentView = this.authService.checkPermission([ModuleConstants.Vendors_PaymentInformation + '.' + PermissionConstants.View])
	}

	GetVendorGeneralAddress(event) {
		if (event) {
			this.isSpinnerVisible = true;
			this.vendorService.getVendorDataById(this.vendorId).subscribe(res => {
				this.local = res;
				this.sourceVendor.address1 = this.local.address1;
				this.sourceVendor.address2 = this.local.address2;
				this.sourceVendor.address3 = this.local.address3;
				this.sourceVendor.city = this.local.city;
				if (this.local.countryId !== undefined) {
					this.sourceVendor.countryId = { countries_id: this.local.countryId, nice_name: this.local.country }
				}
				this.sourceVendor.stateOrProvince = this.local.stateOrProvince;
				this.sourceVendor.postalCode = this.local.postalCode;
				this.isSpinnerVisible = false;
			})
		} else {
			this.sourceVendor.address1 = "";
			this.sourceVendor.address2 = "";
			this.sourceVendor.address3 = "";
			this.sourceVendor.city = "";
			this.sourceVendor.countryId = "";
			this.sourceVendor.stateOrProvince = "";
			this.sourceVendor.postalCode = "";
			this.isSpinnerVisible = false;
		}
	}

	ngOnInit() {
		this.vendorService.currentEditModeStatus.subscribe(message => {
			this.isvendorEditMode = message;
		});
		this.defaultSaveObj.defaultPaymentMethod = 1;

		if (this.isViewMode) {
			this.getVendorCodeandNameByVendorId();
		}
		else {
			this.vendorId = this.router.snapshot.params['id'];
			this.vendorService.vendorId = this.vendorId;
			this.vendorService.listCollection.vendorId = this.vendorId;
			this.countrylist();
		}

		if (this.isPaymentView) {
			if (this.local) {
				this.loadData();
				this.defaultPaymentValue = true;
				this.getDomesticWithVendorId();
				this.InternatioalWithVendorId();
				this.DefaultWithVendorId();
				this.showDefault();
			}
			else if (this.vendorId != 0) {
				this.loadData();
			} else {
				this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-payment-information';
				this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
			}
		}
	}

	ngAfterViewInit() {
	}
	closeDeleteModal() {
		$("#downloadConfirmation").modal("hide");
	}
	// exportCSV(dt) {
	//     this.isSpinnerVisible = true;
	//     let PagingData = {"first":0,"rows":dt.totalRecords,"sortOrder":1,"filters":{"status":this.status,"isDeleted":this.currentDeletedstatus},"globalFilter":""}
	//     let filters = Object.keys(dt.filters);
	//     filters.forEach(x=>{
	// 		PagingData.filters[x] = dt.filters[x].value;
	//     })

	//     this.vendorService.getCheckPaymentobj(PagingData).subscribe(res => {
	//         dt._value = res[0]['results'].map(x => {
	// 			return {
	//             ...x,
	//             createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
	//             updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
	//             }
	//         });
	//         dt.exportCSV();
	//         dt.value = this.vendorData;
	//         this.isSpinnerVisible = false;
	//     },error => {
	//             this.saveFailedHelper(error)
	//         },
	//     );
	//   }

	exportCSV(dt) {
		dt._value = dt._value.map(x => {
			return {
				...x,
				createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
				updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
			}
		});
		dt.exportCSV();
	}

	getVendorCodeandNameByVendorId() {
		if (this.vendorId > 0) {
			this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
				res => {
					this.vendorCodeandName = res[0];
				}, err => {
					this.isSpinnerVisible = false;
					//const errorLog = err;
					//this.saveFailedHelper(errorLog);
				});
		}
	}

	check() {
		this.checkValue = true;
		this.domasticWireValue = false;
		this.internationalValue = false;
		this.defaultPaymentValue = false;

		this.checkStyle = true;
		this.domesticWireStyle = false;
		this.internationalStyle = false;
		this.defaultPaymentStyle = false;
	}

	domesticWire() {
		this.checkValue = false;
		this.domasticWireValue = true;
		this.internationalValue = false;
		this.defaultPaymentValue = false;

		this.checkStyle = false;
		this.domesticWireStyle = true;
		this.internationalStyle = false;
		this.defaultPaymentStyle = false;
	}
	internationalWire() {
		this.checkValue = false;
		this.domasticWireValue = false;
		this.internationalValue = true;
		this.defaultPaymentValue = false;

		this.checkStyle = false;
		this.domesticWireStyle = false;
		this.internationalStyle = true;
		this.defaultPaymentStyle = false;
	}
	defaultPayment() {
		this.checkValue = false;
		this.domasticWireValue = false;
		this.internationalValue = false;
		this.defaultPaymentValue = true;

		this.checkStyle = false;
		this.domesticWireStyle = false;
		this.internationalStyle = false;
		this.defaultPaymentStyle = true;
	}

	showDomesticWire() {
		this.domesticWire();
	}
	showPament() {
		this.check();
	}

	showInternational() {
		this.internationalWire();
	}

	showDefault() {
		this.defaultPayment();
	}

	private getDomesticWithVendorId() {
		this.isSpinnerVisible = true;
		this.id = this.local.vendorId ? this.local.vendorId : this.router.snapshot.params['id'];
		this.vendorService.getDomesticvedor(this.id).subscribe(
			results => this.onDomestciLoad(results[0]),
			error => { this.isSpinnerVisible = false } //this.onDataLoadFailed(error)
		);
	}

	private InternatioalWithVendorId() {
		this.isSpinnerVisible = true;
		this.id = this.local.vendorId ? this.local.vendorId : this.router.snapshot.params['id'];
		this.vendorService.getInternationalWire(this.id).subscribe(
			results => this.onInternatioalLoad(results[0]),
			error => { this.isSpinnerVisible = false }//this.onDataLoadFailed(error)
		);
	}

	private DefaultWithVendorId() {
		this.isSpinnerVisible = true;
		this.id = this.local.vendorId ? this.local.vendorId : this.router.snapshot.params['id'];
		this.vendorService.getDefaultlist(this.id).subscribe(
			results => this.onDefaultLoad(results[0]),
			error => { this.isSpinnerVisible = false }//this.onDataLoadFailed(error)
		);
	}

	countrylist() {
		var strText = '';
		if (this.arrayCountrylist.length == 0) {
			this.arrayCountrylist.push(0);
		}

		this.commonService.autoSuggestionSmartDropDownList('Countries', 'countries_id', 'nice_name',strText,true,0,this.arrayCountrylist.join(),this.currentUserMasterCompanyId).subscribe(res => {
            this.allCountryinfo = res.map(x => {
                return {
                    nice_name: x.label, countries_id: x.value 
                }
            })
            this.countrycollection = this.allCountryinfo;
            this.countrycollection = [...this.allCountryinfo.filter(x => {
                return x.nice_name.toLowerCase().includes(strText.toLowerCase())
			})]
		})
	}

	private loadData() {
		this.isSpinnerVisible = true;
		const vendorId = this.vendorId != 0 ? this.vendorId : this.local.vendorId;
		const newvendorId = vendorId ? vendorId : this.router.snapshot.params['id'];
		this.vendorService.getCheckPaymentobj(newvendorId).subscribe(
			results => this.onDataLoadSuccessful(results[0]),
			error => { this.isSpinnerVisible = false } //this.onDataLoadFailed(error)
		);
	}

	private loadMasterCompanies() {
		this.isSpinnerVisible = false;
		this.masterComapnyService.getMasterCompanies().subscribe(
			results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
			error => { this.isSpinnerVisible = false } //this.onDataLoadFailed(error)
		);
	}

	public applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue;
	}

	handleChange(rowData, e) {
		if (e.checked == false) {
			this.isSpinnerVisible = false;
			this.sourceVendor = rowData;
			this.sourceVendor.updatedBy = this.userName;
			this.Active = "In Active";
			this.sourceVendor.isActive == false;
			this.vendorService.updateActiveforpayment(this.sourceVendor).subscribe(
				response => this.saveCompleted(this.sourceVendor),
				error => { this.isSpinnerVisible = false }) //this.saveFailedHelper(error));
			this.sourceVendor = "";
		}
		else {
			this.isSpinnerVisible = false;
			this.sourceVendor = rowData;
			this.sourceVendor.updatedBy = this.userName;
			this.Active = "Active";
			this.sourceVendor.isActive == true;
			this.vendorService.updateActiveforpayment(this.sourceVendor).subscribe(
				response => this.saveCompleted(this.sourceVendor),
				error => { this.isSpinnerVisible = false }) //this.saveFailedHelper(error));
			this.sourceVendor = "";
		}
	}

	getDeleteListByStatus(value) {
		if (value) {
			this.currentDeletedstatus = true;
		} else {
			this.currentDeletedstatus = false;
		}
		this.geListByStatus(this.status ? this.status : this.currentstatus)
	}

	geListByStatus(status) {
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
			this.allActions = newarry;
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
			this.allActions = newarry;
		} else if (status == 'ALL') {
			this.status = status;
			if (this.currentDeletedstatus == false) {
				this.originalTableData.forEach(element => {
					if (element.isDeleted == false) {
						newarry.push(element);
					}
				});
				this.allActions = newarry;
			} else {
				this.originalTableData.forEach(element => {
					if (element.isDeleted == true) {
						newarry.push(element);
					}
				});
				this.allActions = newarry;
			}
		}
		this.totalRecords = this.allActions.length;
		this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
	}

	restore(content, rowData) {
		this.restorerecord = rowData;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	restoreRecord(value) {
		if (value === 'Yes') {
			this.isSpinnerVisible = true;
			this.vendorService.restoreCheckPayment(this.restorerecord.checkPaymentId).subscribe(() => {
				this.loadData();
				this.alertService.showMessage(
					'Success',
					`Record was Restored successfully`,
					MessageSeverity.success
				);
				this.isSpinnerVisible = false;
			}, error => { this.isSpinnerVisible = false })// this.saveFailedHelper(error))
		} else {
			this.restorerecord = undefined;
		}
		this.modal.close();
	}

	private onDataLoadSuccessful(allWorkFlows: any[]) {
		this.dataSource.data = allWorkFlows;
		this.originalTableData = allWorkFlows;
		//let obtainedVendorId = this.originalTableData[0].vc.vendorId;
		//this.getVendorBasicData(obtainedVendorId);
		this.geListByStatus(this.status ? this.status : this.currentstatus)
		this.isSpinnerVisible = false;
	}

	// getVendorBasicData(vendorId) {
	// 	this.isSpinnerVisible = true;
	// 	this.vendorService.getVendorDataById(vendorId).subscribe(res => {
	// 		this.vendorData = res;
	// 		this.isSpinnerVisible = false;
	// 	}, error => this.onDataLoadFailed(error));
	// }

	// private onBencustomerLoad(allWorkFlows: any) {
	// 	this.dataSource.data = allWorkFlows;
	// 	this.alldata = allWorkFlows;
	// 	this.isSpinnerVisible = false;
	// }

	private onDomestciLoad(allWorkFlows: any) {
		this.dataSource.data = allWorkFlows;
		this.domesticWithVedor = allWorkFlows;
		this.isSpinnerVisible = false;
		if (this.domesticWithVedor.length > 0) {
			this.domesticSaveObj = allWorkFlows[0];
			if (this.domesticSaveObj.countryId) {
				this.domesticSaveObj.countryId = { nice_name: this.domesticSaveObj.countryName, countries_id: this.domesticSaveObj.countryId }
				//this.domesticSaveObj.countryId = getObjectById('countries_id', this.domesticSaveObj.countryId, this.allCountryinfo);
			}
			if (this.domesticSaveObj.vendorId != null) {
				this.domesticSaveObj.vendorName = { vendorId: this.domesticSaveObj.accountNameId, vendorName: this.domesticSaveObj.vendorName }
			}
		}
	}

	private onInternatioalLoad(allWorkFlows: any) {
		this.dataSource.data = allWorkFlows;
		this.internationalwithVendor = allWorkFlows;
		this.isSpinnerVisible = false;
		if (this.internationalwithVendor.length > 0) {
			this.internationalSaveObj = allWorkFlows[0];
			if (this.internationalSaveObj.countryId != null) {
				this.internationalSaveObj.countryId = getObjectById('countries_id', this.internationalSaveObj.countryId, this.allCountryinfo);
			}
			if (this.internationalSaveObj.vendorId != null) {
				this.internationalSaveObj.vendorName = { vendorId: this.internationalSaveObj.beneficiaryCustomerId, vendorName: this.internationalSaveObj.vendorName }
			}
		}
	}

	private onDefaultLoad(allWorkFlows: any) {
		this.dataSource.data = allWorkFlows;
		this.defaultwithVendor = allWorkFlows;
		this.isSpinnerVisible = false;

		if (allWorkFlows) {
			this.defaultSaveObj = allWorkFlows;
			if (this.defaultSaveObj.defaultPaymentMethod == 1) {
				this.showPament();
			}
			else if (this.defaultSaveObj.defaultPaymentMethod == 2) {
				this.showDomesticWire();
			}
			else if (this.defaultSaveObj.defaultPaymentMethod == 3) {
				this.showInternational();
			}
			else {
				this.showPament();
			}
		}
	}


	filterActions(event) {
		this.localCollection = [];
		for (let i = 0; i < this.allActions.length; i++) {
			let actionName = this.allActions[i].description;
			if (actionName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
				this.localCollection.push(actionName);
			}
		}
	}

	filterbencus(event) {
		this.localCollection = [];
		for (let i = 0; i < this.alldata.length; i++) {
			let actionName = this.alldata[i].beneficiaryCustomer;
			if (actionName) {
				if (actionName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.localCollection.push(actionName);
				}
			}
		}
	}

	private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
		this.auditHisory = auditHistory;
		this.isSpinnerVisible = false;
		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
	}

	private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
		this.allComapnies = allComapnies;
		this.isSpinnerVisible = false;
	}

	private onDataLoadFailed(error: any) {
		//this.loaderForPaymentCheck = false;
		this.isSpinnerVisible = false;
	}

	open(content) {
		this.isEditMode = false;
		this.isDeleteMode = false;
		this.isSaving = true;
		this.loadMasterCompanies();
		this.actionName = "";
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	openDelete(content, row) {
		if (!row.isPrimayPayment) {
			this.selectedRowforDelete = row;
			this.isEditMode = false;
			this.isDeleteMode = true;
			this.sourceVendor = row;
			this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
		} else {
			$('#deletePayment').modal('show');
		}
	}

	openEdit(row) {
		this.isEditMode = true;
		this.isSaving = true;
		this.disableSave = true;
		this.sourceVendor = { ...row, countryId: getObjectById('countries_id', row.countryId, this.allCountryinfo) };

		if (row.contactTagId > 0) {
			this.arrayTagNamelist.push(row.contactTagId);
			this.getAllTagNameSmartDropDown('', row.contactTagId);
		}

		this.arraySiteIdlist.push(row.checkPaymentId);
		//this.commonService.autoSuggestionSmartDropDownList('CheckPayment', 'CheckPaymentId', 'SiteName','',true,20,this.arraySiteIdlist.join()).subscribe(response => {
		this.commonService.autoSuggestionSmartDropDownVendorCheckPaymentList('siteName', '', true, this.arraySiteIdlist.join(), this.currentUserMasterCompanyId, this.id).subscribe(response => {
			this.sitelistCollectionOriginal = response.map(x => {
				return {
					siteName: x.label, value: x.value
				}
			})
			this.sitelistCollection = [...this.sitelistCollectionOriginal];
			this.arraySiteIdlist = [];
			this.isSpinnerVisible = false;

			this.sourceVendor = {
				...this.sourceVendor,
				siteName: getObjectByValue('siteName', row.siteName, this.sitelistCollectionOriginal)
			};
			if (row.contactTagId > 0) {
				this.arrayTagNamelist.push(row.contactTagId);
				this.getAllTagNameSmartDropDown('', row.contactTagId);
			}
			this.editSiteName = row.siteName;
		}, err => {
			this.isSpinnerVisible = false;
		});

		this.sourceVendor['tempIsPrimary'] = this.sourceVendor.isPrimayPayment;
		this.loadMasterCompanies();
		this.isEditPaymentInfo = true;
	}

	openView(content, row) {

		this.sourceVendor = row;
		this.siteName = row.siteName;
		this.address1 = row.address1;
		this.address2 = row.address2;
		this.isPrimary = row.isPrimayPayment ? row.isPrimayPayment : false;
		this.city = row.city;
		this.stateOrProvince = row.stateOrProvince;
		this.postalCode = row.postalCode;
		this.country = row.countryName;
		this.createdBy = row.createdBy;
		this.updatedBy = row.updatedBy;
		this.createddate = row.createdDate;
		this.updatedDate = row.updatedDate;
		this.loadMasterCompanies();
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	openHelpText(content) {
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	openHist(content, row) {
		this.sourceVendor = row;
		this.isSaving = true;
		this.isSpinnerVisible = true;
		this.vendorService.paymentHist(this.sourceVendor.checkPaymentId).subscribe(
			results => this.onHistoryLoadSuccessful(results[0], content),
			error => { this.isSpinnerVisible = false })// this.saveFailedHelper(error));
	}

	onBlurMethod(data) {
		if (data == 'siteName') {
			this.showSiteName = false;
		}
		if (data == 'address1') {
			this.showAddress1 = false;
		}
		if (data == 'city') {
			this.showCity = false;
		}
		if (data == 'stateOrProvince') {
			this.showstateOrProvince = false;

		}
		if (data == 'postalCode') {
			this.showpostalCode = false;
		}
		if (data == 'country') {
			this.showcountry = false;
		}
		if (data == 'createdBy') {
			this.createdBy = false;
		}
		if (data == 'createddate') {
			this.createddate = false;
		}
		if (data == 'updatedBy') {
			this.updatedBy = false;
		}
		if (data == 'updatedDate') {
			this.updatedDate = false;
		}
	}

	saveCheckPaymentInfo() {
		this.isSaving = true;
		this.isSpinnerVisible = true;
		if (!(this.sourceVendor.siteName && this.sourceVendor.address1 && this.sourceVendor.city &&
			this.sourceVendor.stateOrProvince && this.sourceVendor.postalCode && this.sourceVendor.countryId
		)) {
			this.display = true;
			this.modelValue = true;
		}

		if (this.sourceVendor.siteName && this.sourceVendor.address1 && this.sourceVendor.city &&
			this.sourceVendor.stateOrProvince && this.sourceVendor.postalCode && this.sourceVendor.countryId) {
			if (!this.sourceVendor.checkPaymentId && !this.sourceVendor.vendorId) {
				this.sourceVendor.createdBy = this.userName;
				this.sourceVendor.updatedBy = this.userName;
				this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;
				this.sourceVendor.isActive = true;
				this.sourceVendor.vendorId = this.local.vendorId;
				this.sourceVendor.siteName = editValueAssignByCondition('siteName', this.sourceVendor.siteName),
					this.sourceVendor.countryId = editValueAssignByCondition('countries_id', this.sourceVendor.countryId);
				this.sourceVendor.contactTagId = editValueAssignByCondition('contactTagId', this.sourceVendor.tagName);
				this.vendorService.addCheckinfo(this.sourceVendor).subscribe(data => {
					this.loadData();
					this.localCollection = data;
					this.savesuccessCompleted(this.sourceVendor);
					this.sourceVendor = new Object();
					this.updateVendorCheckPayment(this.localCollection);
					this.sourceVendor = {};
					this.isSpinnerVisible = false;
				}, error => { this.isSpinnerVisible = false })// this.saveFailedHelper(error))
			}
			else {
				this.sourceVendor.createdBy = this.userName;
				this.sourceVendor.updatedBy = this.userName;
				this.sourceVendor.updatedBy = this.userName;
				this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;
				this.sourceVendor.vendorId = this.local.vendorId;
				this.sourceVendor.siteName = editValueAssignByCondition('siteName', this.sourceVendor.siteName),
					this.sourceVendor.countryId = editValueAssignByCondition('countries_id', this.sourceVendor.countryId);
				this.sourceVendor.contactTagId = editValueAssignByCondition('contactTagId', this.sourceVendor.tagName);
				this.vendorService.updateCheckPaymentInfo(this.sourceVendor).subscribe(data => {
					if (data) { this.sourceVendor = new Object(); }
					this.updatedCollection = data;
					this.loadData();
					this.isSpinnerVisible = false;
				}, error => { this.isSpinnerVisible = false }) //this.saveFailedHelper(error))
				this.saveCompleted(this.sourceVendor);
				this.sourceVendor = {};
				this.disableSave = true;
			}
			this.disableSave = true;
		}
		else {
		}

		$('#addPaymentInfo').modal('hide');
	}

	saveDomesticPaymentInfo() {
		this.isSaving = true;
		this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;
		this.sourceVendor.isActive = true;
		this.domesticSaveObj.createdBy = this.userName;
		this.domesticSaveObj.updatedBy = this.userName;
		this.domesticSaveObj.masterCompanyId = this.currentUserMasterCompanyId;
		this.domesticSaveObj.countryId = editValueAssignByCondition('countries_id', this.domesticSaveObj.countryId);
		this.domesticSaveObj.vendorId = this.local.vendorId ? this.local.vendorId : this.sourceVendor.vendorId;
		this.domesticSaveObj.accountNameId = editValueAssignByCondition('vendorId', this.domesticSaveObj.vendorName);
		if (!(this.domesticSaveObj.aba && this.domesticSaveObj.accountNumber && this.domesticSaveObj.bankName
		)) {
			this.display = true;
			this.modelValue = true;
		}
		if (this.domesticSaveObj.aba && this.domesticSaveObj.accountNumber && this.domesticSaveObj.bankName) {
			if (!this.domesticSaveObj.domesticWirePaymentId && !this.sourceVendor.vendorId) {
				this.domesticSaveObj.updatedBy = this.userName;
				this.isSpinnerVisible = true;
				this.vendorService.addDomesticinfo(this.domesticSaveObj).subscribe(data => {
					this.disableSave = true;
					this.localCollection = {
						...data, createdBy: this.userName,
						updatedBy: this.userName
					};
					this.savesuccessCompleted(this.sourceVendor);
					this.sourceVendor = new Object();
					this.updateVendorDomesticWirePayment(this.localCollection);
					this.isSpinnerVisible = false;
				}, error => { this.isSpinnerVisible = false })
			}
			else {
				this.isSpinnerVisible = true;
				this.vendorService.updateDomesticBankPaymentinfo(this.domesticSaveObj).subscribe(
					response => {
						this.disableSave = true;
						this.saveCompleted(this.sourceVendor)
						this.getDomesticWithVendorId();
						this.isSpinnerVisible = false;
					},
					error => { this.isSpinnerVisible = false })
			}
			this.showDomesticWire();
			this.domasticWireValue = true;
			this.internationalValue = false;
		}
	}

	saveInternationalPaymentInfo() {
		this.isSaving = true;
		if (!(this.internationalSaveObj.swiftCode)) {
			this.display = true;
			this.modelValue = true;
		}
		if (this.internationalSaveObj.swiftCode) {
			this.isSpinnerVisible = true;
			if (!this.internationalSaveObj.internationalWirePaymentId && !this.sourceVendor.vendorId) {
				this.sourceVendor.createdBy = this.userName;
				this.sourceVendor.updatedBy = this.userName;
				this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;
				this.internationalSaveObj.createdBy = this.userName;
				this.internationalSaveObj.updatedBy = this.userName;
				this.internationalSaveObj.masterCompanyId = this.currentUserMasterCompanyId;
				this.vendorService.addInternationalinfo({
					...this.internationalSaveObj,
					//vendorId :editValueAssignByCondition('vendorId', this.internationalSaveObj.vendorName),
					beneficiaryCustomerId: editValueAssignByCondition('vendorId', this.internationalSaveObj.vendorName),
					countryId: editValueAssignByCondition('countries_id', this.internationalSaveObj.countryId),
				}).subscribe(data => {
					this.localCollection = {
						...data, createdBy: this.userName,
						updatedBy: this.userName
					};
					this.vendorService.paymentCollection = this.local;
					this.savesuccessCompleted(this.sourceVendor);
					this.updateVendorInternationalWirePayment(this.localCollection);
					this.isSpinnerVisible = false;
					this.disableSave = true;
				}, error => { this.isSpinnerVisible = false; })
			}
			else {
				this.sourceVendor.createdBy = this.userName;
				this.sourceVendor.updatedBy = this.userName;
				this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;

				this.internationalSaveObj.masterCompanyId = this.currentUserMasterCompanyId;
				this.internationalSaveObj.createdBy = this.userName;
				this.internationalSaveObj.updatedBy = this.userName;

				this.vendorService.vendorInternationalUpdate({
					...this.internationalSaveObj,
					//vendorId :editValueAssignByCondition('vendorId', this.internationalSaveObj.vendorName),	
					beneficiaryCustomerId: editValueAssignByCondition('vendorId', this.internationalSaveObj.vendorName),
					countryId: editValueAssignByCondition('countries_id', this.internationalSaveObj.countryId),
				}).subscribe(
					data => {
						this.vendorService.paymentCollection = this.local;
						this.disableSave = true;
						this.saveCompleted(this.sourceVendor);
						this.isSpinnerVisible = false;
					}, error => { this.isSpinnerVisible = false; })
			}
			this.showInternational();
			this.internationalValue = true;
			this.defaultPaymentValue = false;
		}
	}

	saveDefaultPaymentInfo() {
		if (this.defaultSaveObj.vendorPaymentId > 0) {
			this.defaultPaymentObj.vendorPaymentId = this.defaultSaveObj.vendorPaymentId;
			this.defaultPaymentObj.vendorId = this.defaultSaveObj.vendorId;
			this.defaultPaymentObj.updatedBy = this.userName;
			this.defaultPaymentObj.createdBy = this.userName;
			this.defaultPaymentObj.masterCompanyId = this.currentUserMasterCompanyId;
			this.defaultPaymentObj.isActive = true;
			this.defaultPaymentObj.defaultPaymentMethod = this.defaultSaveObj.defaultPaymentMethod;
			this.isSpinnerVisible = true;
			this.vendorService.vendorDefaultUpdate(this.defaultPaymentObj).subscribe(
				data => {
					this.vendorService.paymentCollection = this.local;
					this.saveCompleted(this.sourceVendor);
				}, error => { this.isSpinnerVisible = false; })
		}
		else {
			this.isSpinnerVisible = true;
			this.defaultPaymentObj.createdBy = this.userName;
			this.defaultPaymentObj.updatedBy = this.userName;
			this.defaultPaymentObj.masterCompanyId = this.currentUserMasterCompanyId;
			this.defaultPaymentObj.vendorId = this.local.vendorId;
			this.defaultPaymentObj.defaultPaymentMethod = this.defaultSaveObj.defaultPaymentMethod;
			this.defaultPaymentObj.isActive = true;

			this.vendorService.addDefaultinfo(this.defaultPaymentObj).subscribe(data => {
				this.savesuccessCompleted(this.sourceVendor);
			}, error => { this.isSpinnerVisible = false; })
		}
		this.disableSave = true;
	}

	deleteConformation(value) {
		if (value === 'Yes') {
			this.vendorService.deleteCheckPayment(this.selectedRowforDelete.checkPaymentId).subscribe(() => {
				this.loadData();
				this.alertService.showMessage(
					'Success',
					`Record was deleted successfully`,
					MessageSeverity.success
				);
			}, error => { this.isSpinnerVisible = false; })
		} else {
			this.selectedRowforDelete = undefined;
		}
		this.modal.close();
	}

	updateVendorCheckPayment(updateObj: any) {
		this.vendorService.updateVendorCheckpayment(updateObj, this.local.vendorId).subscribe(data => {
			this.loadData();
		}, error => { this.isSpinnerVisible = false; })
	}

	updateVendorDomesticWirePayment(updateObj: any) {
		this.vendorService.updateVendorDomesticWirePayment(updateObj, this.local.vendorId).subscribe(data => {
			this.getDomesticWithVendorId();
		}, error => { this.isSpinnerVisible = false; })
	}

	updateVendorInternationalWirePayment(updateObj: any) {
		this.vendorService.updateVendorInternationalWirePayment(updateObj, this.local.vendorId).subscribe(data => {
			this.loadData();
		}, error => { this.isSpinnerVisible = false; })
	}

	previousClick() {
		this.activeIndex = 6;
		this.vendorService.changeofTab(this.activeIndex);
		const id = this.vendorService.listCollection ? this.vendorService.listCollection.vendorId : this.vendorId;
		this.route.navigateByUrl('/vendorsmodule/vendorpages/app-vendor-billing-information/' + id);
	}

	nextClick() {
		this.vendorService.contactCollection = this.local;
		this.activeIndex = 8;
		this.vendorService.changeofTab(this.activeIndex);
		const id = this.vendorService.listCollection ? this.vendorService.listCollection.vendorId : this.vendorId;
		this.route.navigateByUrl('/vendorsmodule/vendorpages/app-vendor-shipping-information/' + id);
	}

	private saveCompleted(user?: any) {
		this.isSaving = false;
		if (this.isDeleteMode == true) {
			this.alertService.showMessage("Success", `Record was deleted successfully`, MessageSeverity.success);
			this.isDeleteMode = false;
		}
		else {
			this.alertService.showMessage("Success", `Record was edited successfully`, MessageSeverity.success);
		}

		this.loadData();
		this.isSpinnerVisible = false;
	}

	onInternalBankCountrieselected(event) {
		if (this.allCountryinfo) {
			for (let i = 0; i < this.allCountryinfo.length; i++) {
				if (event == this.allCountryinfo[i].nice_name) {
					this.sourceVendor.nice_name = this.allCountryinfo[i].nice_name;
					this.disablesavefoInternalrCountry = false;
					this.selectedCountries = event;
				}
			}
		}
	}

	eventInternalBankCountryHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedCountries) {
				if (value == this.selectedCountries.toLowerCase()) {
					this.disablesavefoInternalrCountry = false;
				}
				else {
					this.disablesavefoInternalrCountry = true;
				}
			}
		}
	}

	private savesuccessCompleted(user?: any) {
		this.isSaving = false;
		this.alertService.showMessage("Success", `Record was saved successfully`, MessageSeverity.success);
		this.loadData();
		this.isSpinnerVisible = false;
	}

	get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
			? this.authService.currentUser.masterCompanyId
			: null;
	}

	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	private saveFailedHelper(error: any) {
		this.isSaving = false;
		this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
		this.isSpinnerVisible = false;
	}

	dismissModel() { this.modal.close(); }

	handleChanges(rowData, e) {
		this.isSpinnerVisible = true;
		if (e.checked == false) {
			this.sourceVendor.checkPaymentId = rowData.checkPaymentId;
			this.sourceVendor.updatedBy = this.userName;
			this.Active = "In Active";
			this.sourceVendor.isActive = false;
			this.vendorService.updateActiveforpayment(this.sourceVendor).subscribe(
				response => {
					this.isSpinnerVisible = false;
					this.alertService.showMessage("Success", `Records In-Acivated successfully`, MessageSeverity.success);
					this.loadData();
				},
				error => { this.isSpinnerVisible = false; })
		}
		else {
			this.sourceVendor.checkPaymentId = rowData.checkPaymentId;
			this.sourceVendor.updatedBy = this.userName;
			this.Active = "Active";
			this.sourceVendor.isActive = true;
			this.vendorService.updateActiveforpayment(this.sourceVendor).subscribe(
				response => {
					this.isSpinnerVisible = false;
					this.alertService.showMessage("Success", `Records Acivated successfully`, MessageSeverity.success);
					this.loadData();
				},
				error => { this.isSpinnerVisible = false; })
		}
	}

	onCountrieselected(event) {
		if (this.allCountryinfo) {
			for (let i = 0; i < this.allCountryinfo.length; i++) {
				if (event == this.allCountryinfo[i].nice_name) {
					this.sourceVendor.nice_name = this.allCountryinfo[i].nice_name;
					this.disableSave = false;
					this.selectedCountries = event;
				}
			}
			this.disableSavePaymentCountry = false;
		}
	}

	eventCountryHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedCountries) {
				if (value == this.selectedCountries.toLowerCase()) {
					this.disableSave = false;
				}
				else {
					this.disableSave = true;
				}
			} else {
				this.disableSavePaymentCountry = true;
			}
		} else {
			this.disableSavePaymentCountry = true;
		}
	}

	filtercountry(event) {
		this.countrycollection = this.allCountryinfo;
		if (event.query !== undefined && event.query !== null) {
			const countries = [...this.allCountryinfo.filter(x => {
				return x.nice_name.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.countrycollection = countries;
		}
	}

	onBankCountrieselected(event) {
		if (this.allCountryinfo) {
			for (let i = 0; i < this.allCountryinfo.length; i++) {
				if (event == this.allCountryinfo[i].nice_name) {
					this.sourceVendor.nice_name = this.allCountryinfo[i].nice_name;
					this.disablesaveforCountry = false;
					this.selectedCountries = event;
				}
			}
		}
	}

	eventBankCountryHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedCountries) {
				if (value == this.selectedCountries.toLowerCase()) {
					this.disablesaveforCountry = false;
				}
				else {
					this.disablesaveforCountry = true;
				}
			}

		}
	}

	onBeneficiaryselected(event) {
		if (this.alldata) {
			for (let i = 0; i < this.alldata.length; i++) {
				if (event == this.alldata[i].beneficiaryCustomer) {
					this.sourceVendor.beneficiaryCustomer = event;
					this.disablesaveforBeneficiary = false;
					this.selectedCountries = event;
					break;
				}
			}
		}
	}

	eventBeneficiaryHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedCountries) {
				if (value == this.selectedCountries.toLowerCase()) {
					this.disablesaveforBeneficiary = false;
				}
				else {
					this.disablesaveforBeneficiary = true;
				}
			}
		}
	}

	onAddPaymentInfo() {
		this.sourceVendor = {};
		this.editSiteName = '';
		this.isSiteNameAlreadyExists = false;
		this.isEditPaymentInfo = false;
	}

	getPageCount(totalNoofRecords, pageSize) {
		return Math.ceil(totalNoofRecords / pageSize)
	}

	pageIndexChange(event) {
		this.pageSize = event.rows;
	}

	getVendorName() {
		if (this.local !== undefined) {
			return editValueAssignByCondition('vendorName', this.local.vendorName) === undefined ? '' : editValueAssignByCondition('vendorName', this.local.vendorName);
		} else {
			return '';
		}
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

	sampleExcelDownload() {
		const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=VendorPaymentInfo&fileName=VendorPaymentInfo.xlsx`;
		window.location.assign(url);
	}

	customExcelUpload(event) {
		const file = event.target.files;

		if (file.length > 0) {
			this.formData.append('file', file[0])
			this.vendorService.PaymentCheckUpload(this.formData, this.local.vendorId).subscribe(res => {
				event.target.value = '';

				this.formData = new FormData();
				this.loadData();

				this.alertService.showMessage(
					'Success',
					`Successfully Uploaded  `,
					MessageSeverity.success
				);
			}, error => { this.isSpinnerVisible = false; })
		}
	}
	enableSave() {
		this.disableSave = false;

	}

	checkSiteNameExist(value) {
		this.changeName = true;
		this.isSiteNameAlreadyExists = false;
		this.disableSaveSiteName = false;
		if (value != this.editSiteName) {
			for (let i = 0; i < this.sitelistCollectionOriginal.length; i++) {
				if (this.sourceVendor.siteName == this.sitelistCollectionOriginal[i].siteName || value == this.sitelistCollectionOriginal[i].siteName) {
					this.isSiteNameAlreadyExists = true;
					this.disableSaveSiteName = true;
					return;
				}
			}
		}
	}

	getAllSiteSmartDropDown(strText = '') {
		if (this.arraySiteIdlist.length == 0) {
			this.arraySiteIdlist.push(0);
		}
		//this.commonService.autoSuggestionSmartDropDownList('CheckPayment', 'CheckPaymentId', 'SiteName',strText,true,20,this.arraySiteIdlist.join()).subscribe(response => {
		this.commonService.autoSuggestionSmartDropDownVendorCheckPaymentList('siteName', strText, true, this.arraySiteIdlist.join(), this.currentUserMasterCompanyId, this.id).subscribe(response => {
			this.sitelistCollectionOriginal = response.map(x => {
				return {
					siteName: x.label, value: x.value
				}
			})
			this.sitelistCollection = [...this.sitelistCollectionOriginal];
			this.arraySiteIdlist = [];
		}, err => {
			this.isSpinnerVisible = false;
		});
	}

	filterSite(event) {
		if (event.query !== undefined && event.query !== null) {
			this.getAllSiteSmartDropDown(event.query);
		}
	}

	checkBillingSiteNameSelect() {
		if (this.editSiteName != editValueAssignByCondition('siteName', this.sourceVendor.siteName)) {
			this.isSiteNameAlreadyExists = true;
			this.disableSaveSiteName = true;
		}
		else {
			this.isSiteNameAlreadyExists = false;
			this.disableSaveSiteName = false;
		}
	}

	//Not In Use
	// private getgeneralInnfo() {
	// 	this.alertService.startLoadingMessage();
	// 	this.loadingIndicator = true;

	// 	this.vendorService.getWorkFlows().subscribe(
	// 		results => this.ongeneralDataLoadSuccessful(results[0]),
	// 		error => this.onDataLoadFailed(error)
	// 	);
	// }

	// restoreRecord(){  
	// 	this.isSpinnerVisible = true;
	//     this.commonService.updatedeletedrecords('CheckPayment','CheckPaymentId',this.restorerecord.checkPaymentId ).subscribe(res => {
	//         this.currentDeletedstatus=true;
	//         this.modal.close();
	//         this.loadData();
	// 		this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
	// 		this.isSpinnerVisible = false;
	// 	}, error => this.saveFailedHelper(error))
	// }

	// private ongeneralDataLoadSuccessful(allWorkFlows: any[]) {
	// 	this.alertService.stopLoadingMessage();
	// 	this.loadingIndicator = false;
	// 	this.dataSource.data = allWorkFlows;
	// 	this.allgeneralInfo = allWorkFlows;
	// 	this.vendorname = this.allgeneralInfo[0].vendorName;
	// 	this.vendorCode = this.allgeneralInfo[0].vendorCode;
	// }

	// private loadAddressDara() {
	// 	this.alertService.startLoadingMessage();
	// 	this.loadingIndicator = true;
	// 	this.vendorService.getAddressDtails().subscribe(
	// 		results => this.onAddressDataLoadSuccessful(results[0]),
	// 		error => this.onDataLoadFailed(error)
	// 	);
	// }

	// private onAddressDataLoadSuccessful(alladdress: any[]) {
	// 	this.dataSource.data = alladdress;
	// 	this.allAddresses = alladdress;
	// 	this.addressId = this.allAddresses[0].addressId;
	// }

	// private refresh() {
	// 	this.applyFilter(this.dataSource.filter);
	// }

	// private loadPaymentObject() {
	// 	this.alertService.startLoadingMessage();
	// 	this.loadingIndicator = true;
	// 	this.vendorService.getPaymentObj().subscribe(
	// 		results => this.onPaymentObjUrl(results[0]),
	// 		error => this.onDataLoadFailed(error)
	// 	);
	// }

	// private onPaymentObjUrl(allWorkFlows: any) {
	// 	this.alertService.stopLoadingMessage();
	// 	this.loadingIndicator = false;
	// 	this.dataSource.data = allWorkFlows;
	// 	this.sourceVendor = allWorkFlows;
	// }

	// private saveSuccessHelper(role?: any) {
	// 	this.isSaving = false;
	// 	this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
	// 	this.loadData();
	// }

	// private getDismissReason(reason: any): string {
	// 	if (reason === ModalDismissReasons.ESC) {
	// 		return 'by pressing ESC';
	// 	} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
	// 		return 'by clicking on a backdrop';
	// 	} else {
	// 		return `with: ${reason}`;
	// 	}
	// }

	// public getbencus() {
	// 	this.isSpinnerVisible = true;
	// 	this.vendorService.getBeneficiaryCustomer().subscribe(
	// 		results => this.onBencustomerLoad(results[0]),
	// 		error => this.onDataLoadFailed(error)
	// 	);
	// }

	filterTagNames(event) {
		if (event.query !== undefined && event.query !== null) {
			this.getAllTagNameSmartDropDown(event.query);
		}
	}
	arrayTagNamelist: any = [];
	tagNamesList: any = [];
	getAllTagNameSmartDropDown(strText = '', contactTagId = 0) {
		if (this.arrayTagNamelist.length == 0) {
			this.arrayTagNamelist.push(0);
		}
		this.commonService.autoSuggestionSmartDropDownList('ContactTag', 'ContactTagId', 'TagName', strText, true, 20, this.arrayTagNamelist.join(), this.currentUserMasterCompanyId).subscribe(res => {
			this.tagNamesList = res.map(x => {
				return {
					tagName: x.label, contactTagId: x.value
				}
			})

			if (contactTagId > 0) {
				this.sourceVendor = {
					...this.sourceVendor,
					tagName: getObjectById('contactTagId', contactTagId, this.tagNamesList)
				}
			}
		})
	}

	arrayVendorlist: any[] = [];
	venderListOriginal = [];
	vendorNames: any[];

	bindvendordropdownData(strText = '') {
		if (this.vendorId > 0)
			this.arrayVendorlist.push(this.vendorId);
		if (this.arrayVendorlist.length == 0) {
			this.arrayVendorlist.push(0);
		}

		this.commonService.autoSuggestionSmartDropDownList('Vendor', 'VendorId', 'VendorName', strText, true, 20, this.arrayVendorlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
			this.venderListOriginal = response.map(x => {
				return {
					vendorName: x.label, vendorId: x.value
				}
			})
			this.vendorNames = response;
			this.vendorNames = this.venderListOriginal.reduce((acc, obj) => {
				return acc.filter(x => x.vendorId !== this.selectedParentId)
			}, this.venderListOriginal)
			// this.checVendorName();
		}, err => {
			const errorLog = err;
		});
	}

	filterVendorNames(event) {
		if (event.query !== undefined && event.query !== null) {
			this.bindvendordropdownData(event.query);
		}
	}

}