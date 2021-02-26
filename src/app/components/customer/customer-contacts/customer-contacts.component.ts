import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
declare var $ : any;
import { Params, ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { AlertService, MessageSeverity } from '../../../services/alert.service';

import { MasterComapnyService } from '../../../services/mastercompany.service';
import { CustomerService } from '../../../services/customer.service';
import { CustomerContactModel } from '../../../models/customer-contact.model';
import { MatDialog } from '@angular/material';
import { getObjectByValue, getPageCount, getObjectById, getValueFromObjectByKey, editValueAssignByCondition, getValueFromArrayOfObjectById } from '../../../generic/autocomplete';
import { AtaSubChapter1Service } from '../../../services/atasubchapter1.service';

import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

import { DatePipe } from '@angular/common';
import { emailPattern, urlPattern, titlePattern, phonePattern, mobilePattern } from '../../../validations/validation-pattern';
import { ConfigurationService } from '../../../services/configuration.service';
import { CommonService } from '../../../services/common.service';
import { AtaMainService } from '../../../services/atamain.service';

@Component({
	selector: 'app-customer-contacts',
	templateUrl: './customer-contacts.component.html',
	styleUrls: ['./customer-contacts.component.scss'],
	providers: [DatePipe]
})
/** CustomerEdit component*/
export class CustomerContactsComponent implements OnInit {
	@Input() savedGeneralInformationData: any = {};
	@Input() editMode;
	@Input() editGeneralInformationData;
	@Input() selectedCustomerTab: string = '';
	@Input() add_ataChapterList;
	@Input() search_ataChapterList;
	@Input() search_ataChapterList1;
	// @Input() ataListDataValues;
	@Output() tab = new EventEmitter<any>();
	@Output() saveCustomerContactATAMapped = new EventEmitter();
	@Output() refreshCustomerATAMapped = new EventEmitter();
	@Output() refreshCustomerATAByCustomerId = new EventEmitter();
	@Output() refreshCustomerContactMapped = new EventEmitter();
	@Input() customerDataFromExternalComponents: any;
	pageSizeForATA: number = 10;
	disableSave: boolean = true;
	disableSaveMemo: boolean = true;
	formData = new FormData();
	totalRecords: any;
	pageIndex: number = 0;
	pageSize: number = 10;
	totalPages: number;
	selectedOnly: boolean = false;
	targetData: any;
	contactsListOriginal: any;
	firstNamesList: any;
	middleNamesList: any;
	lastNamesList: any;
	isDeleteMode: boolean = false;
	public sourceCustomer: any = {}
	contactInformation = new CustomerContactModel()
	customerContacts: any = [];
	selectedRowforDelete: any;
	selectedAtappedRowforDelete: any;
	selectedFirstName: any;
	disablesaveForFirstname: boolean;
	disableSaveMiddleName: boolean;
	disableSaveLastName: boolean;
	disablesaveForlastname: boolean;
	loaderForContacts = true;
	customerContactsColumns = [
		{ field: 'isDefaultContact', header: 'Primary Contact' },
		{ field: 'tag', header: 'Tag' },
		{ field: 'firstName', header: 'First Name' },
		{ field: 'lastName', header: 'Last Name' },
		{ field: 'contactTitle', header: 'Contact Title' },
		{ field: 'email', header: 'Email' },
		{ field: 'workPhone', header: 'Work Phone' },
		{ field: 'mobilePhone', header: 'Mobile Phone' },
		{ field: 'notes', header: 'Memo' },
		{ field: 'fax', header: 'Fax' },
		{ field: 'createdDate', header: 'Created Date' },
		{ field: 'createdBy', header: 'Created By' },
		{ field: 'updatedDate', header: 'Updated Date' },
		{ field: 'updatedBy', header: 'Updated By' }
	];
	selectedColumns = this.customerContactsColumns;
	selectedColumn: any;
	ediData: any;
	isEditButton: boolean = false;
	id: number;
	contactId: number;
	customerContactId: number;
	contactATAId: number;
	customerCode: any;
	memoPopupContent: any;
	customerName: any;
	contactName: any;
	modal: NgbModalRef;
	localCollection: any;

	emailPattern = emailPattern()
	urlPattern = urlPattern()
	titlePattern = titlePattern()
	phonePattern = phonePattern();
	mobilePattern = mobilePattern();

	sourceViewforContact: any;
	add_SelectedId: any;
	add_SelectedModels: any;
	add_ataSubChapterList: any;
	search_ataSubChapterList: any;
	search_ataSubChapterList1: any;
	selectedContact: any;
	selectedstockColumn: any[];
	isSpinnerVisible: boolean = false;
	ataHeaders = [
		{ field: 'ataChapterName', header: 'ATA Chapter' },
		{ field: 'ataSubChapterDescription', header: 'ATA Sub-Chapter' }
	]
	ataListDataValues = []
	auditHistory: any[] = [];
	auditHistory1: any[] = [];
	@ViewChild('ATAADD', { static: false }) myModal;

	originalATASubchapterData: any = [];
	isViewMode: boolean = false;
	resettablefileds: any;
	ataChapterEditDat =
		{
			ataChapterId: null,
			ataSubChapterId: null,
			isActive: true,
			isDeleted: false,
			customerContactATAMappingId: 0,
			masterCompanyId: this.currentUserMasterCompanyId,
			createdBy: "",
			updatedBy: "",
			createdDate: new Date(),
			customerContactId: 0,
			ataChapterName: "",
			ataChapterCode: "",
			ataSubChapterDescription: "",
		}

	ataChapterEditData = { ...this.ataChapterEditDat };
	stopmulticlicks: boolean;
	isPrimatyContactData: any;
	currentstatus: string = 'Active';
	originalTableData: any = [];
	currentDeletedstatus: boolean = false;
	currentATADeletedstatus: boolean = false;
	status: any = "Active";
	restorerecord: any = {}
	restoreATArecord: any = {}
	arrayContactlist: any[] = [];
	resetinputmodel: any;

	constructor(private router: ActivatedRoute,
		private route: Router,
		private authService: AuthService,
		private modalService: NgbModal,
		private activeModal: NgbActiveModal,
		private _fb: FormBuilder,
		private alertService: AlertService,
		public customerService: CustomerService,
		private dialog: MatDialog,
		public atasubchapter1service: AtaSubChapter1Service,
		private masterComapnyService: MasterComapnyService,
		private configurations: ConfigurationService,
		private commonService: CommonService,
		private atamain: AtaMainService,
		private datePipe: DatePipe
	) {
		this.stopmulticlicks = false;
	}

	ngOnInit() {

		if (this.editMode) {
			this.id = this.editGeneralInformationData.customerId;
			this.customerCode = this.editGeneralInformationData.customerCode;
			this.customerName = this.editGeneralInformationData.name;
			this.isViewMode = false;

			//this.getAllCustomerContact()
		} else {

			if (this.customerDataFromExternalComponents) {
				this.id = this.customerDataFromExternalComponents.customerId;
				this.customerCode = this.customerDataFromExternalComponents.customerCode;
				this.customerName = this.customerDataFromExternalComponents.name;

				//this.getAllCustomerContact();
				this.isViewMode = true;
			} else {

				this.id = this.savedGeneralInformationData.customerId;
				this.customerCode = this.savedGeneralInformationData.customerCode;
				this.customerName = this.savedGeneralInformationData.name;
				//this.getAllCustomerContact();
				this.isViewMode = false;
			}
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		for (let property in changes) {
			if (property == 'selectedCustomerTab') {
				if (changes[property].currentValue != {} && changes[property].currentValue == "Contacts") {
					if (this.id > 0) {
						this.getAllCustomerContact();
					}
					this.getAllATAChapter();
				}
			}
			if (property == 'customerDataFromExternalComponents') {

				if (changes[property].currentValue != {}) {
					this.id = this.customerDataFromExternalComponents.customerId;
					this.customerCode = this.customerDataFromExternalComponents.customerCode;
					this.customerName = this.customerDataFromExternalComponents.name;
					if (this.id > 0) {
						this.getAllCustomerContact();
					}
					this.isViewMode = true;
				}
			}
		}
	}

	closeDeleteModal() {
		$("#downloadConfirmation").modal("hide");
	}

	getDeleteListByStatus(value) {
		if (value) {
			this.currentDeletedstatus = true;
		} else {
			this.currentDeletedstatus = false;
		}
		this.geListByStatus(this.status ? this.status : 'Active')
	}

	getATADeleteListByStatus(value) {
		if (value) {
			this.currentATADeletedstatus = true;
		} else {
			this.currentATADeletedstatus = false;
		}
		this.getATACustomerContactMapped();
	}

	exportCSV(contact) {
		contact._value = contact._value.map(x => {
			return {
				...x,
				createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
				updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
				notes: x.notes ? this.parsedText(x.notes) : '',
			}
		});
		contact.exportCSV();
	}
	onClickMemo() {
		this.memoPopupContent = this.contactInformation.notes;
		this.enableSave();
		this.disableSaveMemo = true;
		//this.memoPopupValue = value;
	}

	onClickPopupSave() {
		this.contactInformation.notes = this.memoPopupContent;
		this.memoPopupContent = '';
		$('#memo-popup-Doc').modal("hide");
	}

	closeMemoModel() {
		$('#memo-popup-Doc').modal("hide");
	}

	parsedText(text) {
		if (text) {
			const dom = new DOMParser().parseFromString(
				'<!doctype html><body>' + text,
				'text/html');
			const decodedString = dom.body.textContent;
			return decodedString;
		}
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
			this.customerContacts = newarry;
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
			this.customerContacts = newarry;
		} else if (status == 'ALL') {
			this.status = status;
			if (this.currentDeletedstatus == false) {
				this.originalTableData.forEach(element => {
					if (element.isDeleted == false) {
						newarry.push(element);
					}
				});
				this.customerContacts = newarry;
			} else {
				this.originalTableData.forEach(element => {
					if (element.isDeleted == true) {
						newarry.push(element);
					}
				});
				this.customerContacts = newarry;
			}
		}
		this.totalRecords = this.customerContacts.length;
		this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
	}

	restore(content, rowData) {
		this.restorerecord = rowData;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	restoreRecord() {
		this.isSpinnerVisible = true;
		this.commonService.updatedeletedrecords('CustomerContact', 'CustomerContactId', this.restorerecord.customerContactId,).subscribe(res => {
			this.currentDeletedstatus = true;
			this.modal.close();
			this.getAllCustomerContact();
			this.alertService.showMessage("Success", `Updated Successfully`, MessageSeverity.success);
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error))
	}

	restoreATA(content, rowData) {
		this.restoreATArecord = rowData;
		//this.contactATAId = rowData.customerContactATAMappingId;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	restoreATARecord() {
		this.isSpinnerVisible = true;
		if (this.restoreATArecord.customerContactATAMappingId > 0) {
			this.isSpinnerVisible = true;
			this.customerService.restoreATAMappedByContactId(this.restoreATArecord.customerContactATAMappingId).subscribe(
				response => {
					this.getATACustomerContactMapped();
					this.refreshCustomerATAMapped.emit(this.id)
					this.refreshCustomerContactMapped.emit(this.id);
					this.isSpinnerVisible = false;
					this.alertService.showMessage("Success", `Action was Restored successfully`, MessageSeverity.success);
				},
				error => this.saveFailedHelper(error));
		}

		this.modal.close();
	}

	enableSave() {
		this.disableSave = false;
	}

	enableSaveMemo() {
		this.disableSaveMemo = false;
	}

	closeMyModel() {
		$("#addContactDetails").modal("hide");
		this.disableSave = true;
	}

	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
			? this.authService.currentUser.masterCompanyId
			: null;
	}

	getPageCount(totalNoofRecords, pageSize) {
		return Math.ceil(totalNoofRecords / pageSize)
	}

	pageIndexChangeForInt(event) {
		this.pageSizeForATA = event.rows;
	}

	pageIndexChange(event) {
		this.pageSize = event.rows;
	}

	getAllContactFirstNameSmartDropDown(strText = '', contactName = '') {
		this.isSpinnerVisible = true;
		if (this.arrayContactlist.length == 0) {
			this.arrayContactlist.push(0);
		}
		this.commonService.autoSuggestionSmartDropDownSelfContactList('firstName', strText, true, this.arrayContactlist.join(),this.currentUserMasterCompanyId,this.id).subscribe(response => {

			var endResult = [];
			for (let resInd = 0; resInd < response.length; resInd++) {
				let alreadyExist = false;
				for (let endInd = 0; endInd < endResult.length; endInd++) {
					if (endResult[endInd].firstName.toLowerCase() == response[resInd].label.toLowerCase()) {
						alreadyExist = true;
					}
				}
				if (!alreadyExist) {
					endResult.push({ firstName: response[resInd].label })
				}
			}

			this.firstNamesList = endResult;

			if (contactName != '') {
				this.contactInformation = {
					...this.ediData,
					firstName: getObjectByValue('firstName', contactName, this.firstNamesList),
					middleName: this.contactInformation.middleName,
					lastName: this.contactInformation.lastName,
				}
			}
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error));
	}

	getAllContactMiddleNameSmartDropDown(strText = '', contactName = '') {
		this.isSpinnerVisible = true;
		if (this.arrayContactlist.length == 0) {
			this.arrayContactlist.push(0);
		}
		this.commonService.autoSuggestionSmartDropDownSelfContactList('middleName', strText, true, this.arrayContactlist.join(),this.currentUserMasterCompanyId,this.id).subscribe(response => {

			var endResult = [];
			for (let resInd = 0; resInd < response.length; resInd++) {
				let alreadyExist = false;
				for (let endInd = 0; endInd < endResult.length; endInd++) {
					if (endResult[endInd].middleName.toLowerCase() == response[resInd].label.toLowerCase()) {
						alreadyExist = true;
					}
				}
				if (!alreadyExist) {
					endResult.push({ middleName: response[resInd].label })
				}
			}

			this.middleNamesList = endResult;

			if (contactName != '') {
				this.contactInformation = {
					...this.ediData,
					middleName: getObjectByValue('middleName', contactName, this.middleNamesList),
					firstName: this.contactInformation.firstName,
					lastName: this.contactInformation.lastName,
				}
			}
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error));
	}

	getAllContactLastNameSmartDropDown(strText = '', contactName = '') {
		this.isSpinnerVisible = true;
		if (this.arrayContactlist.length == 0) {
			this.arrayContactlist.push(0);
		}
		this.commonService.autoSuggestionSmartDropDownSelfContactList('lastName', strText, true, this.arrayContactlist.join(),this.currentUserMasterCompanyId,this.id).subscribe(response => {

			var endResult = [];
			for (let resInd = 0; resInd < response.length; resInd++) {
				let alreadyExist = false;
				for (let endInd = 0; endInd < endResult.length; endInd++) {
					if (endResult[endInd].lastName.toLowerCase() == response[resInd].label.toLowerCase()) {
						alreadyExist = true;
					}
				}
				if (!alreadyExist) {
					endResult.push({ lastName: response[resInd].label })
				}
			}

			this.lastNamesList = endResult;

			if (contactName != '') {
				this.contactInformation = {
					...this.ediData,
					lastName: getObjectByValue('lastName', contactName, this.lastNamesList),
					firstName: this.contactInformation.firstName,
					middleName: this.contactInformation.middleName,
				}
			}
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error));
	}

	filterFirstNames(event) {
		if (event.query !== undefined && event.query !== null) {
			this.getAllContactFirstNameSmartDropDown(event.query);
		}
	}

	filterMiddleNames(event) {
		if (event.query !== undefined && event.query !== null) {
			this.getAllContactMiddleNameSmartDropDown(event.query);
		}
	}

	filterLastNames(event) {
		if (event.query !== undefined && event.query !== null) {
			this.getAllContactLastNameSmartDropDown(event.query);
		}
	}

	patternMobilevalidationWithSpl(event: any) {
		const pattern = /[0-9\+\-()\ ]/;

		let inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode != 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}

	async saveContactInformation() {
		this.isSpinnerVisible = true;
		// create a new contact in the contact table
		const data = {
			...this.contactInformation, createdBy: this.userName, updatedBy: this.userName, isActive: true,
			masterCompanyId: this.currentUserMasterCompanyId,
			customerId: this.id,
			firstName: editValueAssignByCondition('firstName', this.contactInformation.firstName),
			middleName: editValueAssignByCondition('middleName', this.contactInformation.middleName),
			lastName: editValueAssignByCondition('lastName', this.contactInformation.lastName)

		}
		if (this.customerContacts && this.customerContacts == 0) {
			data.isDefaultContact = true;
		}
		await this.customerService.newAddContactInfo(data).subscribe(res => {
			const responseForCustomerCreate = {
				...data, ...res
			};

			$("#addContactDetails").modal("hide");
			this.isEditButton = false;
			this.contactInformation = new CustomerContactModel();
			this.customerContacts = [];
			this.getAllCustomerContact();
			this.refreshCustomerContactMapped.emit(this.id);
			this.isSpinnerVisible = false;

			this.alertService.showMessage('Success', `Sucessfully Created Contact`, MessageSeverity.success);

		}, err => {
			this.isEditButton = false;
			this.alertService.showMessage(
				'Warning',
				err.error,
				MessageSeverity.error
			);
			this.isSpinnerVisible = false;
		});

		this.disableSave = true;
	}

	viewSelectedRow(rowData) {
		this.sourceViewforContact = rowData;
	}

	viewSelectedRowdbl(content, rowData) {
		this.sourceViewforContact = rowData;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	onAddContactInfo() {
		this.isEditButton = false;
		this.contactInformation = new CustomerContactModel()
	}

	editCustomerContact(rowData) {
		this.arrayContactlist = [];
		if (rowData.contactId > 0)
			this.arrayContactlist.push(rowData.contactId);
		this.getAllContactFirstNameSmartDropDown('', rowData.firstName)
		this.getAllContactMiddleNameSmartDropDown('', rowData.middleName)
		this.getAllContactLastNameSmartDropDown('', rowData.lastName)

		this.isPrimatyContactData = rowData.isDefaultContact;
		this.ediData = { ...rowData };
		this.isEditButton = true;
		this.sourceViewforContact = '';
	}

	updateCustomerContact() {
		this.isSpinnerVisible = true;
		const data = {
			...this.contactInformation,
			masterCompanyId: this.currentUserMasterCompanyId,
			firstName: editValueAssignByCondition('firstName', this.contactInformation.firstName),
			middleName: editValueAssignByCondition('middleName', this.contactInformation.middleName),
			lastName: editValueAssignByCondition('lastName', this.contactInformation.lastName),
		}
		if (String(data.isDefaultContact) == "Yes") {
			data.isDefaultContact = true

		}
		else if (String(data.isDefaultContact) == "") {
			data.isDefaultContact = false;
		}
		this.customerService.updateContactinfo(data).subscribe(res => {
			//this.getAllContacts();
			this.customerContacts = [];
			this.getAllCustomerContact();

			this.alertService.showMessage(
				'Success',
				`Sucessfully Updated Contact`,
				MessageSeverity.success
			);
			this.isSpinnerVisible = false;
		}, err => {
			this.alertService.showMessage(
				'Warning',
				err.error,
				MessageSeverity.error
			);
			this.isSpinnerVisible = false;
		});
		$("#addContactDetails").modal("hide");
		this.disableSave = true
	}

	// get Customer Contatcs 
	getAllCustomerContact() {
		this.isSpinnerVisible = true;
		this.id = this.id ? this.id : this.router.snapshot.params['id'];
		if (this.id) {
			this.customerService.getContacts(this.id).subscribe(res => {
				this.originalTableData = res[0];
				this.loaderForContacts = false;
				this.geListByStatus(this.status ? this.status : this.currentstatus);
				this.isSpinnerVisible = false;
			}, error => this.saveFailedHelper(error))
		}
	}

	handleChange(rowData) {
		this.isSpinnerVisible = true;
		this.sourceViewforContact = '';

		const data = { ...rowData, updatedBy: this.userName, masterCompanyId: this.currentUserMasterCompanyId };

		this.customerService.updateContactinfo(data).subscribe(res => {
			//this.getAllContacts();
			this.getAllCustomerContact();
			this.alertService.showMessage(
				'Success',
				`Sucessfully Updated Status`,
				MessageSeverity.success
			);
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error));
	}

	resetfileds() {
		this.add_SelectedId = '';
		this.add_SelectedModels = '';
		this.resettablefileds = '';
	}

	openDelete(content, rowData) {

		if (!rowData.isDefaultContact) {
			this.selectedRowforDelete = rowData;

			this.sourceViewforContact = '';
			this.isDeleteMode = true;

			this.contactId = rowData.contactId;
			this.customerContactId = rowData.customerContactId
			this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
		} else {
			$('#deleteoops').modal('show');
		}
		this.getAllCustomerContact();
	}

	deleteItemAndCloseModel() {

		let contactId = this.contactId;
		let customerContactId = this.customerContactId;
		if (contactId > 0) {
			this.isSpinnerVisible = true;
			this.customerService.deleteContact(customerContactId, this.userName).subscribe(
				response => {
					this.saveCompleted(this.sourceCustomer);
					this.refreshCustomerATAByCustomerId.emit(this.id)
					this.refreshCustomerContactMapped.emit(this.id);
					this.isSpinnerVisible = false;
				},
				error => this.saveFailedHelper(error));
		}

		this.modal.close();
	}

	addATAChapter(rowData) {
		this.sourceViewforContact = '';
		this.add_SelectedModels = undefined;
		this.add_SelectedModels = ''
		this.add_SelectedId = undefined;
		this.selectedContact = rowData;
		this.contactName = rowData.firstName;
		this.ataListDataValues = [];
		this.add_ataSubChapterList = '';
		this.getOriginalATASubchapterList()
		this.getATACustomerContactMapped();
		this.getATASubChapter();
	}

	dismissModel() {
		this.modal.close();
	}

	getATASubChapter() {
		this.isSpinnerVisible = true;
		this.atasubchapter1service.getAtaSubChaptersList().subscribe(atasubchapter => {
			const responseData = atasubchapter[0];
			this.add_ataSubChapterList = responseData.map(x => {
				return {
					label: x.ataSubChapterCode + ' - ' + x.description,
					value: x
				}
			})
			this.search_ataSubChapterList = responseData.map(x => {
				return {
					value: x.ataSubChapterId,
					label: x.ataSubChapterCode + ' - ' + x.description
				}
			})
			this.search_ataSubChapterList1 = responseData.map(x => {
				return {
					value: x.ataSubChapterId,
					label: x.description
				}
			})
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error))
	}

	// get subchapter by Id in the add ATA Mapping
	getATASubChapterByATAChapter() {
		this.isSpinnerVisible = true;
		this.add_SelectedModels = [];
		const selectedATAId = getValueFromObjectByKey('ataChapterId', this.add_SelectedId)
		this.atasubchapter1service.getATASubChapterListByATAChapterId(selectedATAId).subscribe(atasubchapter => {
			const responseData = atasubchapter[0];
			this.add_ataSubChapterList = responseData.map(x => {
				return {
					label: x.ataSubChapterCode + ' - ' + x.description,
					value: x
				}
			})
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error))
	}

	// post the ata Mapping 
	async addATAMapping() {
		if (this.add_SelectedModels != undefined && this.add_SelectedModels != '' && (this.add_SelectedModels && this.add_SelectedModels.length > 0)) {
			const ataMappingData = this.add_SelectedModels.map(x => {
				return {
					CustomerId: this.id,
					CustomerContactId: this.selectedContact.customerContactId,
					ATAChapterId: getValueFromObjectByKey('ataChapterId', this.add_SelectedId),
					ATASubChapterId: x.ataSubChapterId,
					ATAChapterCode: getValueFromObjectByKey('ataChapterCode', this.add_SelectedId),
					ATAChapterName: getValueFromObjectByKey('ataChapterName', this.add_SelectedId),
					ATASubChapterDescription: x.description,
					MasterCompanyId: x.masterCompanyId,
					CreatedBy: this.userName,
					UpdatedBy: this.userName,
					CreatedDate: new Date(),
					UpdatedDate: new Date(),
					IsDeleted: false,
				}
			})
			this.add_SelectedModels = undefined;
			this.add_SelectedId = undefined;
			let reqList = [];
			for (let j = 0; j < ataMappingData.length; j++) {
				let index = this.ataListDataValues.findIndex(e => e.ataChapterId === ataMappingData[j].ATAChapterId && e.ataSubChapterId === ataMappingData[j].ATASubChapterId);
				if (index == -1) {
					reqList.push(ataMappingData[j])
				}
			}
			await this.saveCustomerContactATAMapped.emit(reqList);
		} else {
			let reqList = [];
			reqList[0] = {
				CustomerId: this.id,
				CustomerContactId: this.selectedContact.customerContactId,
				ATAChapterId: getValueFromObjectByKey('ataChapterId', this.add_SelectedId),
				ATASubChapterId: null,
				ATAChapterCode: getValueFromObjectByKey('ataChapterCode', this.add_SelectedId),
				ATAChapterName: getValueFromObjectByKey('ataChapterName', this.add_SelectedId),
				ATASubChapterDescription: '',
				MasterCompanyId: getValueFromObjectByKey('masterCompanyId', this.add_SelectedId),
				CreatedBy: this.userName,
				UpdatedBy: this.userName,
				CreatedDate: new Date(),
				UpdatedDate: new Date(),
				IsDeleted: false,
			}
			await this.saveCustomerContactATAMapped.emit(reqList);
			this.add_SelectedModels = undefined;
			this.add_SelectedId = undefined;
		}
		setTimeout(() => {
			this.getATACustomerContactMapped();
		}, 1000);
		this.refreshCustomerContactMapped.emit(this.id);
	}

	openModel() {
		this.myModal.nativeElement.className = 'modal fade show';
		this.getATACustomerContactMapped();
	}

	async getOriginalATASubchapterList() {
		this.isSpinnerVisible = true;
		this.atasubchapter1service.getAtaSubChapter1List().subscribe(res => {
			const responseData = res[0];
			this.originalATASubchapterData = responseData;
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error))
	}

	async getATACustomerContactMapped() {
		this.isSpinnerVisible = true;
		this.customerService.getATAMappedByContactId(this.selectedContact.customerContactId, this.currentATADeletedstatus).subscribe(res => {

			this.ataListDataValues = res;

			for (let i = 0; i < this.ataListDataValues.length; i++) {
				this.ataListDataValues[i]['ataChapterName'] = this.ataListDataValues[i]['ataChapterCode'] + ' - ' + this.ataListDataValues[i]['ataChapterName']
				if (this.ataListDataValues[i]['ataSubChapterCode'] && this.ataListDataValues[i]['ataSubChapterDescription']) {
					this.ataListDataValues[i]['ataSubChapterDescription'] = this.ataListDataValues[i]['ataSubChapterCode'] + ' - ' + this.ataListDataValues[i]['ataSubChapterDescription']
				} else {
					this.ataListDataValues[i]['ataSubChapterDescription'] = "";
				}
			}
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error))
	}

	deleteATAMapped(content, rowData) {

		this.selectedAtappedRowforDelete = rowData;
		this.sourceViewforContact = '';
		this.isDeleteMode = true;
		this.contactATAId = rowData.customerContactATAMappingId;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });

	}

	deleteItemAndCloseModel1() {
		let contactATAId = this.contactATAId;
		if (contactATAId > 0) {
			this.isSpinnerVisible = true;
			this.customerService.deleteATAMappedByContactId(contactATAId).subscribe(
				response => {
					//this.saveCompleted(this.sourceCustomer);
					this.getATACustomerContactMapped();
					this.refreshCustomerATAMapped.emit(this.id)
					this.refreshCustomerContactMapped.emit(this.id);
					this.isSpinnerVisible = false;

					if (this.isDeleteMode == true) {
						this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
						this.isDeleteMode = false;
					}
				},
				error => this.saveFailedHelper(error));
		}

		this.modal.close();
	}

	getAuditHistoryById(rowData) {
		this.isSpinnerVisible = true;
		this.customerService.getCustomerContactAuditDetails(rowData.customerContactId, rowData.customerId).subscribe(res => {
			this.auditHistory = res;
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error))
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

	nextClick() {
		this.stopmulticlicks = true;
		this.tab.emit('AircraftInfo');
		setTimeout(() => {
			this.stopmulticlicks = false;
		}, 500)
	}

	backClick() {
		this.tab.emit('General');
	}

	private saveCompleted(user?: any) {
		if (this.isDeleteMode == true) {
			this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
			this.isDeleteMode = false;
		}
		else {
			this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
			this.saveCompleted
		}
		this.getAllCustomerContact();
	}
	private saveFailedHelper(error: any) {
		this.isSpinnerVisible = false;
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
		setTimeout(() => this.alertService.stopLoadingMessage(), 5000);
	}

	onFirstNameSelected() {
		this.disablesaveForFirstname = true;
	}

	onMiddleNameSelected() {
		this.disableSaveMiddleName = true;
	}

	onLastNameSelected() {
		this.disableSaveLastName = true;
	}

	//not in Use Need to be confirm
	checkfirstNameExist(value) {

		this.disablesaveForFirstname = false;

		if (value !== undefined && value !== null) {
			this.getAllContactFirstNameSmartDropDown(value);
		}

		for (let i = 0; i < this.firstNamesList.length; i++) {

			if (this.contactInformation.firstName == this.firstNamesList[i].firstName || value == this.firstNamesList[i].firstName) {
				this.disablesaveForFirstname = true;
				return;
			}
		}
	}

	//not in Use Need to be confirm
	checkfirstNameExistOld(value) {

		this.disablesaveForFirstname = false;

		for (let i = 0; i < this.contactsListOriginal.length; i++) {

			if (this.contactInformation.firstName == this.contactsListOriginal[i].firstName || value == this.contactsListOriginal[i].firstName) {
				this.disablesaveForFirstname = true;
				return;
			}
		}
	}

	//not in Use Need to be confirm
	checkmiddleNameExist(value) {
		this.disableSaveMiddleName = false;
		for (let i = 0; i < this.contactsListOriginal.length; i++) {
			if (this.contactInformation.middleName == this.contactsListOriginal[i].middleName || value == this.contactsListOriginal[i].middleName) {
				this.disableSaveMiddleName = true;
				return;
			}
		}
		if (value == "") {
			this.disableSaveMiddleName = false;
		}
	}

	//not in Use Need to be confirm
	checklastNameExist(value) {
		this.disableSaveLastName = false;
		for (let i = 0; i < this.contactsListOriginal.length; i++) {

			if (this.contactInformation.lastName == this.contactsListOriginal[i].lastName || value == this.contactsListOriginal[i].lastName) {
				this.disableSaveLastName = true;
				return;
			}
		}
	}

	sampleExcelDownloadForContact() {
		const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=CustomerContact&fileName=CustomerContact.xlsx`;
		window.location.assign(url);
	}

	customContactExcelUpload(event) {
		const file = event.target.files;
		if (file.length > 0) {
			this.isSpinnerVisible = true;
			this.formData.append('file', file[0])
			this.customerService.ContactUpload(this.formData, this.id, this.currentUserMasterCompanyId).subscribe(res => {
				event.target.value = '';

				this.formData = new FormData();
				//this.getAllContacts();
				this.getAllCustomerContact();
				this.alertService.showMessage(
					'Success',
					`Successfully Uploaded  `,
					MessageSeverity.success
				);
				this.isSpinnerVisible = false;
			}, error => this.saveFailedHelper(error))
		}
	}

	editContactATAChapters(rowData) {

		this.getATASubChapterByATAChapterID(rowData.ataChapterId)
		this.ataChapterEditData = {
			...rowData,
			//ataSubChapterId: getObjectById('label', rowData.ataSubChapterId, this.search_ataSubChapterList)
		}
	}

	getATAAuditHistoryById(rowData) {
		this.isSpinnerVisible = true;
		this.customerService.getCustomerContactATAAuditDetails(rowData.customerContactATAMappingId).subscribe(res => {
			this.auditHistory1 = res;
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error))
	}

	getColorCodeForHistoryATA(i, field, value) {
		const data = this.auditHistory1;
		const dataLength = data.length;
		if (i >= 0 && i <= dataLength) {
			if ((i + 1) === dataLength) {
				return true;
			} else {
				return data[i + 1][field] === value
			}
		}
	}
	updateATAChapters() {
		this.isSpinnerVisible = true;
		this.ataChapterEditData = {
			...this.ataChapterEditData,
			masterCompanyId: this.currentUserMasterCompanyId,
			isActive: true,
			createdBy: this.userName,
			updatedBy: this.userName,
			createdDate: new Date(),
			customerContactId: this.selectedContact.customerContactId,

			ataChapterName: getValueFromArrayOfObjectById('label', 'value', this.ataChapterEditData.ataChapterId, this.search_ataChapterList1),
			ataChapterCode: getValueFromArrayOfObjectById('code', 'value', this.ataChapterEditData.ataChapterId, this.search_ataChapterList1),

			ataSubChapterDescription: getValueFromArrayOfObjectById('label', 'value', this.ataChapterEditData.ataSubChapterId, this.search_ataSubChapterList1),
		}
		this.customerService.updateCustomerContactATAMApped(this.ataChapterEditData).subscribe(res => {
			this.getATACustomerContactMapped();
			this.alertService.showMessage(
				'Success',
				`ATA chapter Info Updated successfully`,
				MessageSeverity.success
			);
			this.isSpinnerVisible = false;
		}, err => {
			this.alertService.showMessage(
				'Error',
				err.error,
				MessageSeverity.error
			);
			this.isSpinnerVisible = false;
		})
	}
	getATASubChapterByATAChapterID(id) {
		this.isSpinnerVisible = true;
		this.atasubchapter1service.getATASubChapterListByATAChapterId(id).subscribe(atasubchapter => {
			const responseData = atasubchapter[0];
			this.search_ataSubChapterList = responseData.map(x => {
				return {
					label: x.ataSubChapterCode + ' - ' + x.description,
					value: x.ataSubChapterId
				}
			})
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error))
		this.add_SelectedModels = undefined;
	}

	getAllATAChapter() {
		this.isSpinnerVisible = true;
		this.atamain.getAtaMainList().subscribe(res => {
			const responseData = res[0];
			// used to get the complete object in the value 
			this.add_ataChapterList = responseData.map(x => {
				return {
					value: x,
					label: x.ataChapterCode + ' - ' + x.ataChapterName
				}
			})
			// used to get the id for the value 
			this.search_ataChapterList = responseData.map(x => {
				return {
					value: x.ataChapterId,
					label: x.ataChapterCode + '-' + x.ataChapterName
				}
			})

			this.search_ataChapterList1 = responseData.map(x => {
				return {
					value: x.ataChapterId,
					label: x.ataChapterName,
					code: x.ataChapterCode
				}
			})
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error));
	}

	clearValue() {}
}
