import { Component, ViewChild, OnInit, AfterViewInit, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
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
import { Currency } from '../../../../models/currency.model';
import { TreeNode } from 'primeng/api';
import { CustomerService } from '../../../../services/customer.service';
import { CommonService } from '../../../../services/common.service';
import { editValueAssignByCondition,getObjectById } from '../../../../generic/autocomplete';
import { titlePattern } from '../../../../validations/validation-pattern';
// declare var $ : any;
declare var $ : any;
@Component({
	selector: 'app-legal-entity-banking',
	templateUrl: './legal-entity-banking.component.html',
	styleUrls: ['./legal-entity-banking.component.scss'],
	animations: [fadeInOut]
})
/** EntityEdit component*/
export class EntityBankingComponent implements OnInit, AfterViewInit {
	@Input() savedGeneralInformationData;
	@Input() editMode;
	@Input() editGeneralInformationData;
	@Input() parentLegalEntity;
	@Input() customerListOriginal;
	@Output() tab = new EventEmitter<any>();
	@Output() editGeneralInformation = new EventEmitter<any>();
	parentLegalEntityList: any = [];
	cols1: any[];
	countryListOriginal: any;
	gridData: TreeNode[];
	childCollection: any[] = [];
	allCurrencyInfo: any[];
	sourceLegalEntity: any = {};
	selectedNode1: TreeNode;
	dataSource: MatTableDataSource<{}>;
	displayedColumns: any;
	display: boolean = false;
	@ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
	selectedColumn: any;
	@ViewChild(MatSort,{static:false}) sort: MatSort;
	loadingIndicator: boolean;
	currencyName: any;
	modelValue: boolean = false;
	cols: any[];
	allComapnies: MasterCompany[] = [];
	allATAMaininfo: any[] = [];
	isSaving: boolean;
	selectedColumns: any[];
	selectedColumns1: any[];
	isEditMode: boolean = false;
	isDeleteMode: boolean;
	legalentitylockingboxid: any;
	public sourceAction: any = [];
	public GeneralInformationValue: boolean = false;
	public LockboxValue: boolean = true;
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
	countrycollection: any[];
	disablesave: boolean;
	selectedCountries: any;
	displayWarningModal: boolean = false;
	tagNames: any = [];
	companyName: string;
	companyCode: string;
	legalentitydomesticid: number;
	nextOrPreviousTab: any = "Next";
	isEdit: any = false;
	id: number;
	editData: any;
	LegalEntityDomesticWireBankingId: any;
	LegalEntityInternationalWireBankingId: any;
	LegalACHId: any;
	internalwire; any;
	locksave: boolean;
	domesticvalid: boolean;
	internationalvalid: boolean;
	achvalid: boolean;
	tabscreen: any;
	titlePattern = titlePattern()
	isSpinnerVisible: boolean = false;
	@ViewChild("tabRedirectConfirmationModal",{static:false}) public tabRedirectConfirmationModal: ElementRef;
	constructor(
		private authService: AuthService, private commonService: CommonService, private _fb: FormBuilder, private alertService: AlertService,
		public currency: CurrencyService, public workFlowtService: LegalEntityService,
		private modalService: NgbModal, private activeModal: NgbActiveModal, private dialog: MatDialog, private masterComapnyService: MasterComapnyService,
		private customerService: CustomerService) {
		this.sourceLegalEntity.tagNames = [];

	}
	ngOnInit(): void {
		if (this.editMode) {
			this.id = this.editGeneralInformationData.legalEntityId;
			this.companyCode = this.editGeneralInformationData.companyCode;
			if (typeof this.editGeneralInformationData.name != 'string') {
				this.companyName = this.editGeneralInformationData.name.label;
			} else {
				this.companyName = this.editGeneralInformationData.name;
			}
		} else {
			this.id = this.savedGeneralInformationData.legalEntityId;
			this.companyCode = this.savedGeneralInformationData.companyCode;
			if (typeof this.savedGeneralInformationData.name != 'string') {
				this.companyName = this.savedGeneralInformationData.name.label;
			} else {
				this.companyName = this.savedGeneralInformationData.name;

			}

		}
		this.Lockbox();
		this.sourceLegalEntity = {};
		this.sourceLegalEntity.isBalancingEntity = true;
		this.sourceLegalEntity.isActive = true;
		this.entityName = "";
		this.CountryData('')
	}

	get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
			? this.authService.currentUser.masterCompanyId
			: null;
	}

	modal: NgbModalRef;
	modal1: NgbModalRef;

	ngAfterViewInit() {
	}
	public allWorkFlows: any[] = [];
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
		this.LockboxValue = true;
		this.domesticWireValue = false;
		this.internationalValue = false;
		this.ACHValue = false;
		this.LockboxStyle = true;
		this.domesticWireStyle = false;
		this.internationalStyle = false;
		this.ACHStyle = false;
		this.locksave = false;
		this.getEntityLockBoxDataById(this.id);
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
		this.domesticvalid = false;
		this.getEntityDomesticwireDataById(this.id);

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
		this.internationalvalid = false;
		this.getInternationalwireDataById(this.id);
	}
	ACH() {
		this.isAchValueUpdate = true;
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
		this.achvalid = false;
		this.getEntityACHDataById(this.id)
	}
	showDomesticWire() {
		this.DomesticWire();
	}

	getEntityLockBoxDataById(id) {
		this.isSpinnerVisible = true;
		this.workFlowtService.getEntityLockboxDataById(id).subscribe(res => {
			if (Array.isArray(res) == true && res.length == 0) {
				this.isLockBox = true;
			} else {
				this.isLockBox = false;
			}
			this.isSpinnerVisible = false;
			if (res != null && res && res.length != 0) {
				this.legalentitylockingboxid = res[0].legalEntityBankingLockBoxId;
				this.sourceLegalEntity = {
					...this.sourceLegalEntity,
					poBox: res[0].poBox,
					bankStreetaddress1: res[0].address1,
					bankStreetaddress2: res[0].address2,
					bankCity: res[0].city,
					bankProvince: res[0].stateOrProvince,
					bankpostalCode: res[0].postalCode,
					bankcountryId: res[0].countryId
				};				
				//this.CountryData('')
			}
		}, err => {
			this.isSpinnerVisible = false;
		})
	}

	getEntityDomesticwireDataById(id) {
		this.workFlowtService.getEntityDomesticDataById(id).subscribe(res => {
			if (Array.isArray(res) == true && res.length == 0) {
				this.isDomesticWire = true;
			} else {
				this.isDomesticWire = false;
			}
			if (res != null && res && res.length != 0) {
				this.LegalEntityDomesticWireBankingId = res[0].legalEntityDomesticWireBankingId;
				this.legalentitydomesticid = res[0].domesticWirePaymentId;
				this.sourceLegalEntity = {
					...this.sourceLegalEntity,
					domesticBankName: res[0].bankName,
					domesticIntermediateBank: res[0].intermediaryBankName,
					domesticBenficiaryBankName: res[0].benificiaryBankName,
					domesticBankAccountNumber: res[0].accountNumber,
					domesticABANumber: res[0].aba
				}
			}

		}, err => {
			this.isSpinnerVisible = false;
		})
	}
	isLockBox: boolean = false;
	isDomesticWire: boolean = false;
	isInternationalWire: boolean = false;
	isAch: boolean = false;
	getInternationalwireDataById(id) {
		this.workFlowtService.getEntityInternalDataById(id).subscribe(res => {
			if (Array.isArray(res) == true && res.length == 0) {
				this.isInternationalWire = true;
			} else {
				this.isInternationalWire = false;
			}
			if (res != null && res && res.length != 0) {
				const response = res;
				this.LegalEntityInternationalWireBankingId = res[0].legalEntityInternationalWireBankingId
				this.internalwire = res[0].internationalWirePaymentId;
				this.sourceLegalEntity = {
					...this.sourceLegalEntity,
					internationalBankName: res[0].bankName,
					bankLocation1: res[0].bankLocation1,
					bankLocation2: res[0].bankLocation2,
					internationalIntermediateBank: res[0].intermediaryBank,
					internationalBenficiaryBankName: res[0].beneficiaryBank,
					internationalBankAccountNumber: res[0].beneficiaryBankAccount,
					aba: res[0].aba,
					internationalSWIFTID: res[0].swiftCode
				}
			}
		}, err => {
			this.isSpinnerVisible = false;
		})
	}

	backClick() {
		this.tab.emit('Contacts');
	}

	getEntityACHDataById(id) {
		this.workFlowtService.getEntityAchDataById(id).subscribe(res => {
			if (Array.isArray(res) == true && res.length == 0) {
				this.isAch = true;
			} else {
				this.isAch = false;
			}
			if (res != null && res && res.length != 0) {
				const response = res;

				this.LegalACHId = res[0].achId ? res[0].achId : 0;
				this.sourceLegalEntity = {
					...this.sourceLegalEntity,
					achBankName: res[0].bankName,
					achIntermediateBank: res[0].intermediateBankName,
					achBenficiaryBankName: res[0].beneficiaryBankName,
					achBankAccountNumber: res[0].accountNumber,
					achABANumber: res[0].aba,
					achSWIFTID: res[0].swiftCode,
				}
			}
		}, err => {
			this.isSpinnerVisible = false;
		})
	}

	getmemo() {
		if (this.sourceLegalEntity.bankStreetaddress1 != null &&
			this.sourceLegalEntity.bankCity != null && 
			this.sourceLegalEntity.bankProvince != null &&
			 this.sourceLegalEntity.bankcountryId != null
			&& this.sourceLegalEntity.bankpostalCode != null && this.sourceLegalEntity.bankcountryId != null
		) {
			this.locksave = true;
		}
	}

	domesticval() {
		if (this.sourceLegalEntity.domesticBankName != null && this.sourceLegalEntity.domesticIntermediateBank != null &&
			this.sourceLegalEntity.domesticBenficiaryBankName != null && this.sourceLegalEntity.domesticBankAccountNumber != null && this.sourceLegalEntity.domesticABANumber != null
		) {
			this.domesticvalid = true;
		}
	}

	internationalval() {
		if (this.sourceLegalEntity.internationalBankName != null && 			
			this.sourceLegalEntity.internationalBenficiaryBankName != null && 
			this.sourceLegalEntity.internationalBankAccountNumber != null
		) {
			this.internationalvalid = true;
		}
	}

	isAchValueUpdate: any = false;
	achval() {
		if (this.sourceLegalEntity.achBankName != null && 			
			this.sourceLegalEntity.achBankAccountNumber != null && 
			this.sourceLegalEntity.achABANumber != null && 
			this.sourceLegalEntity.achSWIFTID != null
		) {
			this.achvalid = true;
			this.isAchValueUpdate = false;
		}
	}

	savebanklockingbox() {
		const data = {
			LegalEntityId: this.id,
			poBox: this.sourceLegalEntity.poBox,
			address1: this.sourceLegalEntity.bankStreetaddress1,
			address2: this.sourceLegalEntity.bankStreetaddress2,
			City: this.sourceLegalEntity.bankCity,
			StateOrProvince: this.sourceLegalEntity.bankProvince,
			CountryId: editValueAssignByCondition('value', this.sourceLegalEntity.bankcountryId),
			PostalCode: this.sourceLegalEntity.bankpostalCode,
			LegalEntityBankingLockBoxId: this.legalentitylockingboxid,
			MasterCompanyId: this.currentUserMasterCompanyId,
			CreatedBy: this.userName,
			UpdatedBy: this.userName
		}
		if (this.isLockBox == true) {
			this.isSpinnerVisible = true;
			this.workFlowtService.newAddlockboxEntity(data).subscribe(res => {
				// this.DomesticWire();
				this.locksave=false;
				this.isLockBox = false;
				this.isSpinnerVisible = false;
				this.alertService.showMessage(
					'Success',
					'Lock Box Saved Successfully',
					MessageSeverity.success
				);
			}, err => {
				this.isSpinnerVisible = false;
			})
		}
		else {
			this.isSpinnerVisible = true;
			this.workFlowtService.updateLegalEntityLockbox(data).subscribe(res => {
				this.isSpinnerVisible = false;
				// this.DomesticWire();
				this.locksave=false;
				this.alertService.showMessage(
					'Success',
					'Lock Box Updated Successfully',
					MessageSeverity.success
				);
			}, err => {
				this.isSpinnerVisible = false;
			})
		}
	}

	savebankdomesticwire() {
		const data = {
			LegalEntityId: this.id,
			BankName: this.sourceLegalEntity.domesticBankName,
			IntermediaryBankName: this.sourceLegalEntity.domesticIntermediateBank,
			BenificiaryBankName: this.sourceLegalEntity.domesticBenficiaryBankName,
			AccountNumber: this.sourceLegalEntity.domesticBankAccountNumber,
			ABA: this.sourceLegalEntity.domesticABANumber,
			MasterCompanyId: this.currentUserMasterCompanyId,
			CreatedBy: this.userName,
			UpdatedBy: this.userName,
			domesticWirePaymentId: this.legalentitydomesticid,
			LegalEntityDomesticWireBankingId: this.LegalEntityDomesticWireBankingId
		}
		if (this.isDomesticWire == true) {
			this.isSpinnerVisible = true;
			this.workFlowtService.getNewdomesticwireLegalEntity(data).subscribe(res => {
				const response = res;
				this.isSpinnerVisible = false;
				this.isDomesticWire = false;
				this.domesticvalid=false;
				// this.InternationalWire();
				this.alertService.showMessage(
					'Success',
					'Domestic wire Saved Successfully',
					MessageSeverity.success
				);
			}, err => {
				this.isSpinnerVisible = false;
			})
		}
		else {
			this.isSpinnerVisible = true;
			this.workFlowtService.updateLegalDomestic(data).subscribe(res => {
				this.isSpinnerVisible = false;
				// this.InternationalWire();
				this.domesticvalid=false;
				this.alertService.showMessage(
					'Success',
					'Domestic wire Updated Successfully',
					MessageSeverity.success
				);
			}, err => {
				this.isSpinnerVisible = false;
			});
		}
	}

	savebankinternationalwire() {
		const data = {
			LegalEntityId: this.id,
			BankName: this.sourceLegalEntity.internationalBankName,
			IntermediaryBank: this.sourceLegalEntity.internationalIntermediateBank,
			BeneficiaryBank: this.sourceLegalEntity.internationalBenficiaryBankName,
			BeneficiaryBankAccount: this.sourceLegalEntity.internationalBankAccountNumber,
			SwiftCode: this.sourceLegalEntity.internationalSWIFTID,
			BankLocation1: this.sourceLegalEntity.bankLocation1,
			BankLocation2: this.sourceLegalEntity.bankLocation2,			
			MasterCompanyId: this.currentUserMasterCompanyId,
			CreatedBy: this.userName,
			UpdatedBy: this.userName,
			LegalEntityInternationalWireBankingId: this.LegalEntityInternationalWireBankingId,
			internationalWirePaymentId: this.internalwire,
			ABA: this.sourceLegalEntity.aba
		}
		if (this.isInternationalWire == true) {
			this.isSpinnerVisible = true;
			this.workFlowtService.getNewinternationalwireLegalEntity(data).subscribe(res => {
				const response = res;
				this.internationalvalid=false;
				this.isSpinnerVisible = false;
				this.isInternationalWire = false;
				this.alertService.showMessage(
					'Success',
					'International Saved Successfully',
					MessageSeverity.success
				);

			}, err => {
				this.isSpinnerVisible = false;
			})
		}
		else {
			this.isSpinnerVisible = true;
			this.workFlowtService.updateLegalInternational(data).subscribe(res => {
				this.isSpinnerVisible = false;
				const response = res;
				// this.ACH();
				this.internationalvalid=false;
				this.alertService.showMessage(
					'Success',
					'International Updated Successfully',
					MessageSeverity.success
				);
			}, err => {
				this.isSpinnerVisible = false;
			})
		}
	}

	savebankACH() {
		const data = {
			LegalEntityId: this.id,
			BankName: this.sourceLegalEntity.achBankName,
			IntermediateBankName: this.sourceLegalEntity.achIntermediateBank,
			BeneficiaryBankName: this.sourceLegalEntity.achBenficiaryBankName,
			AccountNumber: this.sourceLegalEntity.achBankAccountNumber,
			ABA: this.sourceLegalEntity.achABANumber,
			SwiftCode: this.sourceLegalEntity.achSWIFTID,
			MasterCompanyId: this.currentUserMasterCompanyId,
			CreatedBy: this.userName,
			UpdatedBy: this.userName,
			ACHId: this.LegalACHId
		}
		if (this.isAch == true) {
			this.isSpinnerVisible = true;
			this.workFlowtService.getNewACHLegalEntity(data).subscribe(res => {
				this.isSpinnerVisible = false;
				this.isAchValueUpdate = true;
				const response = res;
				this.isAch = false;
				this.alertService.showMessage(
					'Success',
					'ACH Saved Successfully',
					MessageSeverity.success
				);
			}, err => {
				this.isSpinnerVisible = false;
			})
		}
		else {
			this.isSpinnerVisible = true;
			this.workFlowtService.updateLegalACH(data).subscribe(res => {
				this.isSpinnerVisible = false;
				this.isAchValueUpdate = true;
				this.isAch = false;
				const response = res;
				this.alertService.showMessage(
					'Success',
					'ACH updated Successfully',
					MessageSeverity.success
				);
			}, err => {
				this.isSpinnerVisible = false;
			})
		}
	}

	next() {
		this.tab.emit('Billing');
	}

	open(content) {
		this.GeneralInformation();
		this.sourceLegalEntity = {};
		this.sourceLegalEntity.isBalancingEntity = true;
		this.sourceLegalEntity.isActive = true;
		this.entityName = "";
		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
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

	saveGeneralInformation() {
		this.isSaving = true;
		if (this.editGeneralInformationData.name && this.editGeneralInformationData.reportingCurrencyId) {
			if (!this.editGeneralInformationData.legalEntityId) {
				this.sourceLegalEntity.createdBy = this.userName;
				this.sourceLegalEntity.updatedBy = this.userName;
				this.sourceLegalEntity.masterCompanyId = this.currentUserMasterCompanyId;
				this.workFlowtService.getNewACHLegalEntity(this.sourceLegalEntity).subscribe(data => {
					this.alertService.showMessage(
						'Success',
						'Banking Information added successfully.',
						MessageSeverity.success
					);
					this.tab.emit('Billing');
					this.savedGeneralInformationData.emit(data);
					this.editData = data;
					this.isEdit = true;

				}, err => {
					this.isSpinnerVisible = false;
				});
			}
			else {
				this.sourceLegalEntity.createdBy = this.userName;
				this.sourceLegalEntity.updatedBy = this.userName;
				this.sourceLegalEntity.masterCompanyId = this.currentUserMasterCompanyId;
				this.workFlowtService.updateEntity(this.sourceLegalEntity).subscribe(data => {
					this.alertService.showMessage(
						'Success',
						'Banking Information updated successfully.',
						MessageSeverity.success
					);
					this.tab.emit('Billing');
					this.editGeneralInformation.emit(data);
					this.editData = data;

					this.isEdit = true;
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

	private saveCompleted(user?: any) {
		this.isSaving = false;
		if (this.isDeleteMode == true) {
			this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
			this.isDeleteMode = false;
		}
		else {
			this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
		}
	}

	dismissModel() {
		this.isDeleteMode = false;
		this.isEditMode = false;
		if (this.modal) { this.modal.close(); }
		if (this.modal1) { this.modal1.close(); }
	}

	nextClick(nextOrPrevious, event) {
		this.tabscreen = event;
		this.nextOrPreviousTab = nextOrPrevious;
		let content = this.tabRedirectConfirmationModal;

		if (this.tabscreen == 'domesticWireValue') {
			this.DomesticWire();
		}
		if (this.tabscreen == 'internationalValue') {
			this.InternationalWire();
		}
		if (this.tabscreen == 'ACHValue') {
			this.ACH();
		}
		if (this.tabscreen == 'NewTab') {
			this.tab.emit('Billing');
		}
		if (this.tabscreen == 'LockboxValue') {
			this.Lockbox();
		}
	}

	redirectToTab() {
		this.dismissModel();
		if (this.tabscreen == 'domesticWireValue') {
			this.DomesticWire();
		}
		if (this.tabscreen == 'internationalValue') {
			this.InternationalWire();
		}
		if (this.tabscreen == 'ACHValue') {
			this.ACH();
		}
		if (this.tabscreen == 'NewTab') {
			this.tab.emit('Billing');
		}
		if (this.tabscreen == 'LockboxValue') {
			this.Lockbox();
		}
	}

	openContentEdit(content, row) {
		this.isEditMode = true;
		this.GeneralInformation();
		this.sourceLegalEntity.isBankingInfo = false;
		this.sourceLegalEntity = row;
		this.sourceLegalEntity.createdDate = new Date(row.createdDate);
		this.sourceLegalEntity.modifiedDate = new Date(row.updatedDate);
		this.modal1 = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
	}

	openEdit(content, row) {
		this.GeneralInformation();
		this.sourceLegalEntity = {};
		this.sourceLegalEntity = row;
		this.isSaving = true;
		this.sourceLegalEntity.parentId = row.legalEntityId;
		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
	}

	openDelete(content, row) {
		this.sourceLegalEntity = row;
		this.isEditMode = false;
		this.isDeleteMode = true;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });

	}

	deleteItemAndCloseModel() {
		this.isSaving = true;
		this.sourceLegalEntity.updatedBy = this.userName;
		this.workFlowtService.updateEntitydelete(this.sourceLegalEntity.legalEntityId).subscribe(
			data => {
			}, err => {
				this.isSpinnerVisible =false;
			})
		this.modal.close();
	}

	openHist(content, row) {
		this.sourceLegalEntity = row;
	}

	pattrenValidate(event) {
		var k;
		k = event.charCode;
		return ((k >= 48 && k <= 57));
	}

	toggleIsActive(rowData, e) {
		if (e.checked == false) {
			this.sourceLegalEntity = rowData;
			this.sourceLegalEntity.updatedBy = this.userName;
			this.Active = "In Active";
			this.sourceLegalEntity.isActive == false;
			this.workFlowtService.updateLegalEntityForActive(this.sourceLegalEntity).subscribe(
				response => this.saveCompleted(this.sourceLegalEntity), err => {
					this.isSpinnerVisible = false;
				});
		}
		else {
			this.sourceLegalEntity = rowData;
			this.sourceLegalEntity.updatedBy = this.userName;
			this.Active = "Active";
			this.sourceLegalEntity.isActive == true;
			this.workFlowtService.updateLegalEntityForActive(this.sourceLegalEntity).subscribe(
				response => this.saveCompleted(this.sourceLegalEntity), err => {
					this.isSpinnerVisible = false;
				});
		}
	}

	openView(content, row) {
		this.entityViewFeilds.name = row.name;
		this.entityViewFeilds.description = row.description;
		this.entityViewFeilds.doingLegalAs = row.doingLegalAs;
		this.entityViewFeilds.address1 = row.address1;
		this.entityViewFeilds.address2 = row.address2;
		this.entityViewFeilds.city = row.city;
		this.entityViewFeilds.stateOrProvince = row.stateOrProvince;
		this.entityViewFeilds.postalCode = row.postalCode;
		this.entityViewFeilds.country = row.country;
		this.entityViewFeilds.faxNumber = row.faxNumber;
		this.entityViewFeilds.phoneNumber1 = row.phoneNumber1;
		this.entityViewFeilds.functionalCurrencyId = row.functionalCurrencyId;
		this.entityViewFeilds.reportingCurrencyId = row.reportingCurrencyId;
		this.entityViewFeilds.isBalancingEntity = row.isBalancingEntity;
		this.entityViewFeilds.cageCode = row.cageCode;
		this.entityViewFeilds.faaLicense = row.faaLicense;
		this.entityViewFeilds.taxId = row.taxId;
		this.entityViewFeilds.poBox = row.poBox;
		this.entityViewFeilds.bankStreetaddress1 = row.bankStreetaddress1;
		this.entityViewFeilds.bankStreetaddress2 = row.bankStreetaddress2;
		this.entityViewFeilds.bankCity = row.bankCity;
		this.entityViewFeilds.bankProvince = row.bankProvince;
		this.entityViewFeilds.bankcountry = row.bankcountry;
		this.entityViewFeilds.bankpostalCode = row.bankpostalCode;
		this.entityViewFeilds.domesticBankName = row.domesticBankName;
		this.entityViewFeilds.domesticIntermediateBank = row.domesticIntermediateBank;
		this.entityViewFeilds.domesticBenficiaryBankName = row.domesticBenficiaryBankName;
		this.entityViewFeilds.domesticBankAccountNumber = row.domesticBankAccountNumber;
		this.entityViewFeilds.domesticABANumber = row.domesticABANumber;
		this.entityViewFeilds.internationalBankName = row.internationalBankName;
		this.entityViewFeilds.internationalIntermediateBank = row.internationalIntermediateBank;
		this.entityViewFeilds.internationalBenficiaryBankName = row.internationalBenficiaryBankName;
		this.entityViewFeilds.internationalBankAccountNumber = row.internationalBankAccountNumber;
		this.entityViewFeilds.internationalSWIFTID = row.internationalSWIFTID;
		this.entityViewFeilds.achBankName = row.achBankName;
		this.entityViewFeilds.achIntermediateBank = row.achIntermediateBank;
		this.entityViewFeilds.achBenficiaryBankName = row.achBenficiaryBankName;
		this.entityViewFeilds.achBankAccountNumber = row.achBankAccountNumber;
		this.entityViewFeilds.achABANumber = row.achABANumber;
		this.entityViewFeilds.achSWIFTID = row.achSWIFTID;
	}

	onFilterCountry(value) {
		this.CountryData(value);
	}

	setEditArray: any = [];
	CountryData(value) {
		this.setEditArray = [];
		if (this.isEditMode == true) {
			this.setEditArray.push(this.sourceLegalEntity.bankcountryId ? this.sourceLegalEntity.bankcountryId : 0);
		} else {
			this.setEditArray.push(0);
		}
		const strText = value ? value : '';
		//this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name').subscribe(res => {
		this.commonService.autoSuggestionSmartDropDownList('Countries', 'countries_id', 'nice_name', strText, true, 20, this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
			this.countrycollection = res;
		}, err => {
			this.isSpinnerVisible = false;
		});
	}

	errorMessageHandler(log) {
		this.isSpinnerVisible = false;
	}

	auditHistoryHeaders: any = [];
	auditHistory: any = [];
	isSpinnerVisibleHistory: boolean = false;
	getAuditHistoryById(type) {
		if (type == 1) {
			this.auditHistoryHeaders = [];
			this.isSpinnerVisibleHistory = true;
			this.workFlowtService.getLeaglLockBoxHistory(this.id).subscribe(
				res => {
					this.auditHistory = res;
					this.isSpinnerVisibleHistory = false;
				}, err => {
					this.isSpinnerVisibleHistory = false;
					this.isSpinnerVisible = false;
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
			this.workFlowtService.getLeaglDomesticHistory(this.id).subscribe(
				res => {
					this.auditHistory = res;
					this.isSpinnerVisibleHistory = false;
				}, err => {					
					this.isSpinnerVisibleHistory = false;
					this.isSpinnerVisible = false;
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
			this.workFlowtService.getLeaglInternationalHistory(this.id).subscribe(
				res => {
					this.auditHistory = res;
					this.isSpinnerVisibleHistory = false;
				}, err => {					
					this.isSpinnerVisibleHistory = false;
					this.isSpinnerVisible = false;
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
			this.workFlowtService.getLeaglAchHistory(this.id).subscribe(
				res => {
					this.auditHistory = res;
					this.isSpinnerVisibleHistory = false;
				}, err => {					
					this.isSpinnerVisibleHistory = false;
					this.isSpinnerVisible = false;
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
		$("#contentHist").modal("hide");
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
}