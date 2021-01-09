import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { Params, ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../services/auth.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { MasterComapnyService } from '../../../../services/mastercompany.service';

import { MatDialog } from '@angular/material';
import { getObjectByValue, getObjectById, getValueFromObjectByKey, editValueAssignByCondition } from '../../../../generic/autocomplete';
import { SalesQuoteService } from '../../../../services/salesquote.service';
import { ConfigurationService } from '../../../../services/configuration.service';
import { AuditHistory } from '../../../../models/audithistory.model';
import * as $ from 'jquery';
import { Documents } from '../../../../models/documents.model';
import { CommonService } from '../../../../services/common.service';
import { CustomerService } from '../../../../services/customer.service';
import * as moment from 'moment';
@Component({
	selector: 'app-salesQuote-documents',
	templateUrl: './salesQuote-document.component.html',
	styleUrls: ['./salesQuote-document.component.scss'],
})
/** Customer component*/
export class SalesQuoteDocumentsComponent implements OnInit {


	@Output() tab = new EventEmitter<any>();
	@ViewChild('fileUpload',{static:false}) fileUpload: any;

	documentInformation = { ...new Documents() };

	salesQuoteDocumentsData: any = [];
	salesQuoteDocumentsColumns = [
		{ field: 'docName', header: 'Name' },
		{ field: 'docDescription', header: 'Description' },
		{ field: 'docMemo', header: 'Memo' },
		{ field: 'fileName', header: 'File Name' },
		{ field: 'fileSize', header: 'File Size' },
		{ field: 'fileCreatedBy', header: 'Created By' },
		{ field: 'fileCreatedDate', header: 'Created Date' },
		{ field: 'fileUpdatedBy', header: 'Updated By' },
		{ field: 'fileUpdatedDate', header: 'Updated Date' },

	];
	selectedColumns = this.salesQuoteDocumentsColumns;

	headersforAttachment = [
		{ field: 'fileName', header: 'File Name' },

	];
	sourceViewforDocumentListColumns = [
		{ field: 'fileName', header: 'File Name' },
	]
	formData = new FormData()

	isEditButton: boolean = false;

	sourceViewforDocument: any;
	localCollection: any;
	sourceViewforDocumentList: any = [];
	local: any;
	activeIndex: any = 11;
	isDeleteMode: boolean = false;
	@Input() isEditMode: boolean = false;
	private isEditModeHeader: boolean = false;
	private isSaving: boolean;
	modal: NgbModalRef;
	public auditHisory: AuditHistory[] = [];
	loadingIndicator: boolean;
	documentauditHisory: any[];
	isViewMode: boolean = false;
	totalRecords: number = 0;
	pageIndex: number = 0;
	memoPopupContent:any;
	pageSize: number = 10;
	totalPages: number = 0;
	// @Input() salesQuoteId: number = 0;
	@Input() salesOrderQuoteId;
	@Input() viewMode: boolean = false;
	documentsDestructuredData: any = [];
	documentsDestructuredDataListOriginal: any[];
	loaderForDocuments: boolean;
	disableSave: boolean = true;
	isSpinnerVisible: boolean = false;

	constructor(public salesQuoteService: SalesQuoteService, private router: ActivatedRoute, private route: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService,
		private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService, public commonService: CommonService, public customerService: CustomerService) {
		if (this.salesQuoteService.listCollection && this.isEditMode == true) {
			console.log("vendor local", this.salesQuoteService.listCollection)
			this.local = this.salesQuoteService.listCollection;
		}
	}

	ngOnInit(): void {
		// this.getList(this.salesOrderQuoteId);

	}

	refresh() {
		this.getList(this.salesOrderQuoteId);
	}

	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	resetCreateForm() {
		this.documentInformation = new Documents();
		this.sourceViewforDocument = undefined;
		this.sourceViewforDocumentList = [];
		this.clearFileUpload();
		this.isEditButton = false;

	}
	clearFileUpload() {
		this.fileUpload.clear();
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
	closeMyModel(type) {
        $(type).modal("hide");
        this.disableSave = true;
	}
	onClickMemo() {
        this.memoPopupContent = this.documentInformation.docMemo;
        this.enableSave();
        //this.memoPopupValue = value;
    }   
    onClickPopupSave() {
        this.documentInformation.docMemo = this.memoPopupContent;
        this.memoPopupContent = '';
        $('#memo-popup-Doc').modal("hide");
    }
    closeMemoModel() {
        $('#memo-popup-Doc').modal("hide");
    }
	dateFilterForTable(date, field) {
		if (date !== '' && moment(date).format('MMMM DD YYYY')) {

			const data = [...this.documentsDestructuredData.filter(x => {
				console.log(moment(x.createdDate).format('MMMM DD YYYY'), moment(date).format('MMMM DD YYYY'));

				if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
					return x;
				} else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
					return x;
				}
			})]
			this.documentsDestructuredData = data;
		} else {
			this.documentsDestructuredData = this.documentsDestructuredDataListOriginal;
		}

	}


	fileUploadForDocuments(event) {
		console.log(event);

		if (event.files.length === 0) {
			return this.disableSave = true;
		} else {
			this.disableSave = false;
		}


		for (let file of event.files) {

			if (!this.formData.has(file.name)) {
				this.formData.append(file.name, file);
			}
			else {
				this.alertService.showMessage(
					'Duplicate File',
					`Duplicate file not allowed ! `,
					MessageSeverity.warn
				);
			}
		}

		this.disableSave = false;
		// fileUpload.clear();

	}
	removeFile(event) {
		console.log("event deletre", event);
		this.formData.delete(event.file.name);
		// this.enableSave();

	}

	getList(salesQuoteId) {

		var moduleId = 46;
		this.loaderForDocuments = true;
		this.documentsDestructuredData = [];
		this.isSpinnerVisible = true;
		this.salesQuoteService.getDocumentList(salesQuoteId).subscribe(res => {
			let arr = [];
			this.isSpinnerVisible = false;
			const data = res.map(x => {
				for (var i = 0; i < x.attachmentDetails.length; i++) {
					const y = x.attachmentDetails;
					arr.push({
						...x,
						// documents: y[i].fileName,
						fileName: y[i].fileName,
						link: y[i].link,
						fileCreatedDate: y[i].createdDate,
						fileCreatedBy: y[i].createdBy,
						fileUpdatedBy: y[i].updatedBy,
						fileUpdatedDate: y[i].updatedDate,
						// fileSize: `${y[i].fileSize} MB`
						fileSize: y[i].fileSize,
						attachmentDetailId: y[i].attachmentDetailId

					})
				}
				this.documentsDestructuredData = arr;
				this.documentsDestructuredDataListOriginal = arr;
				// console.log(arr);
				// console.log(this.documentsDestructuredData);


			})
			this.loaderForDocuments = false;
		}, err => {
			this.documentsDestructuredData = [];
			this.loaderForDocuments = false;
			this.isSpinnerVisible = false;
			this.alertService.showMessage('SO Quote', err, MessageSeverity.error);
		})
	}

	private onDataLoadFailed(error: any) {
		this.isSpinnerVisible = false;
		this.alertService.showMessage('SO Quote', error, MessageSeverity.error);
	}

	saveDocumentInformation() {

		// if (this.isEditMode) {
		// 	this.salesOrderQuoteId = this.salesQuoteId;
		// }
		// else {
		// 	this.salesQuoteId = this.salesOrderQuoteId;
		// }
		const data = {
			...this.documentInformation,
			salesQuoteId: this.salesOrderQuoteId,
			masterCompanyId: 1,
			createdBy: this.userName,
			updatedBy: this.userName
		}

		for (var key in data) {
			this.formData.append(key, data[key]);
		}

		this.salesQuoteService.documentUploadAction(this.formData).subscribe(res => {
			console.log("hello text");

			this.documentInformation.docDescription = '';
			this.documentInformation.docMemo = '';
			this.documentInformation.docName = '';
			this.sourceViewforDocumentList = [];

			this.formData = new FormData();
			this.clearFileUpload();
			this.getList(res.salesOrderQuoteId);
			if (!this.isEditButton) {
				this.alertService.showMessage(
					'Success',
					`Saved Documents Successfully `,
					MessageSeverity.success
				);
			} else {
				this.alertService.showMessage(
					'Success',
					`Updated Documents Successfully `,
					MessageSeverity.success
				);
			}
		})
		this.modal.close();
		this.disableSave = true;
		$("#addDocumentDetails").modal("hide");
	}

	updateVendorDocument() {
	}


	openHistory(content, row) {

		this.alertService.startLoadingMessage();

		this.isSaving = true;
		this.salesQuoteService.getSalesQuoteDocumentAuditHistory(row.salesOrderQuoteDocumentDetailId).subscribe(
			results => this.onAuditHistoryLoadSuccessful(results, content),
			error => this.saveFailedHelper(error));



	}
	backClick() {
		this.activeIndex = 10;
		this.salesQuoteService.changeofTab(this.activeIndex);

	}

	CreateNewClick() {

		this.route.navigateByUrl('salesmodule/salespages/sales-quote-list');

	}
	private onAuditHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;

		this.documentauditHisory = auditHistory;

		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}
	private saveFailedHelper(error: any) {
		this.isSaving = false;
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
	}

	getColorCodeForHistory(i, field, value) {
		const data = this.documentauditHisory;
		const dataLength = data.length;
		if (i >= 0 && i <= dataLength) {
			if ((i + 1) === dataLength) {
				return true;
			} else {
				return data[i + 1][field] === value
			}
		}
	}

	editVendorDocument(rowdata, e) {
		this.isEditButton = true;

		this.documentInformation = { ...rowdata };
		this.salesQuoteService.toGetUploadDocumentsList(rowdata.attachmentId, rowdata.salesOrderQuoteId, 46).subscribe(res => {
			this.sourceViewforDocumentList = res;
			this.sourceViewforDocument = rowdata;
		})
	}

	openView(row) {

		this.salesQuoteService.toGetUploadDocumentsList(row.attachmentId, row.salesOrderQuoteId, 46).subscribe(res => {
			this.sourceViewforDocumentList = res;
			this.sourceViewforDocument = row;

		})
	}
	openViewOnDblClick(row) {
		this.salesQuoteService.toGetUploadDocumentsList(row.attachmentId, row.salesOrderQuoteId, 46).subscribe(res => {
			this.sourceViewforDocumentList = res;
			this.sourceViewforDocument = row;
		});
		$('#docView').modal('show');
	}
	openDelete(content, row) {
		this.isEditMode = false;
		this.isDeleteMode = true;
		delete row.updatedBy;
		this.localCollection = row;
		console.log("attachmentId", row)
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	deleteItemAndCloseModel() {

		// if (vendorDocumentDetailId > 0) {
		this.isSaving = true;

		let vendorDocumentDetailId = this.localCollection.attachmentDetails[0].attachmentDetailId;
		// getDeleteDocumentListbyId
		this.customerService.deleteDocumentByCustomerAttachementId(vendorDocumentDetailId, this.userName).subscribe(

			res => {
				this.getList(this.salesOrderQuoteId);
				this.alertService.showMessage(
					'Success',
					`Action was deleted successfully `,
					MessageSeverity.success
				)
			});

		// }

		this.modal.close();
	}

	dismissModel() {
		this.modal.close();
	}

	downloadFileUpload(rowData) {
		const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
		window.location.assign(url);
	}

	getPageCount(totalNoofRecords, pageSize) {
		return Math.ceil(totalNoofRecords / pageSize)
	}
	pageIndexChange(event) {
		this.pageSize = event.rows;
	}

	enableSave() {
		console.log("isenamebsd", this.sourceViewforDocumentList.length)
		if (this.sourceViewforDocumentList && this.sourceViewforDocumentList.length > 0) {
			this.disableSave = false;
		} else if (this.isEditButton == true) {
			this.disableSave = false;
		} else {
			this.disableSave = true;
		}
	}

}


