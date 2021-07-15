import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { MatDialog } from '@angular/material';
import { editValueAssignByCondition } from '../../../generic/autocomplete';
import { VendorService } from '../../../services/vendor.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { AuditHistory } from '../../../models/audithistory.model';
declare var $ : any;
import { Documents } from '../../../models/documents.model';
import { CustomerService } from '../../../services/customer.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { AppModuleEnum } from 'src/app/enum/appmodule.enum';
@Component({
	selector: 'app-vendor-documents',
	templateUrl: './vendor-documents.component.html',
	styleUrls: ['./vendor-documents.component.scss'],
    providers: [DatePipe]
}) 
export class VendorDocumentsComponent implements OnInit {
	@Output() tab = new EventEmitter<any>();
	@ViewChild('fileUpload',{static:false}) fileUpload: any;
	documentInformation = { ...new Documents() };
	vendorDocumentsData: any = [];
	vendorDocumentsColumns = [
		{ field: 'docName', header: 'Name' },
		{ field: 'docDescription', header: 'Description' },
		{ field: 'docMemo', header: 'Memo' },
		{ field: 'fileName', header: 'File Name' },
		{ field: 'fileSize', header: 'File Size' },
		{ field: 'fileCreatedDate', header: 'Created Date' },
		{ field: 'fileCreatedBy', header: 'Created By' },
		{ field: 'fileUpdatedDate', header: 'Updated Date' },
		{ field: 'fileUpdatedBy', header: 'Updated By' },		
	];
	selectedColumns = this.vendorDocumentsColumns;
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
	status:any="Active";
	sourceViewforDocumentList: any = [];
	local: any;
	disableSaveMemo: boolean = true;
	activeIndex: any = 11;
	selectedOnly: boolean = false;
    targetData: any;
	isDeleteMode: boolean = false;
	private isEditMode: boolean = false;
	private isSaving: boolean;
	modal: NgbModalRef;
	public auditHisory: AuditHistory[] = [];
	documentauditHisory: any[];
	isViewMode: boolean = false;
	totalRecords: number = 0;
	pageIndex: number = 0;
	pageSize: number = 10;
	totalPages: number = 0;
	@Input() vendorId: number = 0;
	@Input() viewMode: boolean = false;
	documentsDestructuredData: any = [];
	documentsDestructuredDataListOriginal: any[];
	disableSave: boolean = true;
	memoPopupContent: any;
	enableUpdateButton: boolean = false;
	vendorData: any = {};
	currentDeletedstatus:boolean=false;
	isSpinnerVisible: boolean = false;
	restorerecord: any = {};
	vendorCodeandName: any;
	moduleName:any="Vendor";
	referenceId:any;
	savedGeneralInformationData: any;
	editGeneralInformationData: any;
	enum :any;
	constructor(public vendorService: VendorService, private router: ActivatedRoute, private route: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService,
		private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService, public customerService: CustomerService, private datePipe: DatePipe) {
			if(window.localStorage.getItem('vendorService')){
                var obj = JSON.parse(window.localStorage.getItem('vendorService'));
                if(obj.listCollection && this.router.snapshot.params['id']){
                    this.vendorService.checkVendorEditmode(true);
                    this.vendorService.isEditMode = true;
                    this.vendorService.listCollection = obj.listCollection;
                    this.vendorService.indexObj.next(obj.activeIndex);
                    this.vendorService.enableExternal = true;
                    this.vendorId = this.router.snapshot.params['id'];
					this.vendorService.vendorId = this.vendorId;
					this.vendorService.listCollection.vendorId = this.vendorId; 
                    this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                        res => {
								this.local = res[0];
								this.vendorCodeandName = res[0];
                        },err => {
                            const errorLog = err;
                            this.saveFailedHelper(errorLog);
                        });
                }
			}
			else { this.getVendorCodeandNameByVendorId(); }
			this.enum = AppModuleEnum.Vendor;
	}

	ngOnInit() { 
		if (this.vendorService.listCollection !== undefined && this.vendorService.listCollection !== null) {
			this.vendorService.isEditMode = true;
			this.isViewMode = false;
			this.vendorId = this.router.snapshot.params['id'];
			this.vendorService.vendorId = this.vendorId;
			this.vendorService.listCollection.vendorId = this.vendorId; 
		}
		else {
			this.isViewMode = true;;
		}
		if (this.vendorService.listCollection && this.vendorService.isEditMode == true) {
			this.local = this.vendorService.listCollection;
		}
		if(this.isViewMode)
        {
            this.getVendorCodeandNameByVendorId();
        }
		this.getList();
	}

	getVendorCodeandNameByVendorId()
    {
        if(this.vendorId > 0)
        {
            this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                res => {
                        this.vendorCodeandName = res[0];
                },err => {
                    const errorLog = err;
                    this.saveFailedHelper(errorLog);
            });
        }        
    }

	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
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
	enableSaveMemo() {
        this.disableSaveMemo = false;
    }
	onClickMemo() {
		this.memoPopupContent = this.documentInformation.docMemo;
		this.disableSaveMemo = true;
	}
	closeDeleteModal() {
		$("#downloadConfirmation").modal("hide");
	}

	// exportCSV(contact) {
    //     this.isSpinnerVisible = true;
    //     let PagingData = {"first":0,"rows":contact.totalRecords,"sortOrder":1,"filters":{"status":this.status,"isDeleted":this.currentDeletedstatus},"globalFilter":""}
    //     let filters = Object.keys(contact.filters);
    //     filters.forEach(x=>{
	// 		PagingData.filters[x] = contact.filters[x].value;
    //     })
    
    //     this.vendorService.getDocumentListbyId(PagingData).subscribe(res => {
    //         contact._value = res[0]['results'].map(x => {
	// 			return {
    //             ...x,
    //             createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
    //             updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
    //             }
    //         });
    //         contact.exportCSV();
    //         contact.value = this.sourceViewforDocumentList;
    //         this.isSpinnerVisible = false;
    //     },error => {
    //             this.saveFailedHelper(error)
    //         },
    //     );
	//   }
	
	exportCSV(documents){
        documents._value = documents._value.map(x => {
            return {
                ...x,
                createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
				updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
				docMemo: x.docMemo.replace(/<[^>]*>/g, ''),
            }
        });
        documents.exportCSV();
    }
	onClickPopupSave() {
		this.enableUpdateButton = true;
		this.documentInformation.docMemo = this.memoPopupContent;
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
	dateFilterForTable(date, field) {
		if (date !== '' && moment(date).format('MMMM DD YYYY')) {
			const data = [...this.documentsDestructuredData.filter(x => {
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
		if (event.files.length === 0) {
			return this.disableSave = true;
		} else {
			this.disableSave = false;
		}
		for (let file of event.files) {
			this.formData.append(file.name, file);
		}
		this.disableSave = false;
	}

	removeFile(event) {
		this.formData.delete(event.file.name);
	}

	getList() {
		this.isSpinnerVisible = true;
		const vendorId = this.vendorId != 0 ? this.vendorId : this.local.vendorId;
		const newvendorId = vendorId ? vendorId :this.router.snapshot.params['id'];
		this.documentsDestructuredData = [];
		this.vendorService.getDocumentList(newvendorId, this.currentDeletedstatus).subscribe(res => {
			let arr = [];
			const data = res.map(x => {
				for (var i = 0; i < x.attachmentDetails.length; i++) {
					const y = x.attachmentDetails;
					arr.push({
						...x,
						fileName: y[i].fileName,
						link: y[i].link,
						fileCreatedDate: y[i].createdDate,
						fileCreatedBy: y[i].createdBy,
						fileUpdatedBy: y[i].updatedBy,
						fileUpdatedDate: y[i].updatedDate,
						fileSize: y[i].fileSize,
						attachmentDetailId: y[i].attachmentDetailId
					})
				}
				arr = arr.map(x => {
					return {
						...x,
						createdDate : x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
						updatedDate : x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
						fileCreatedDate : x.fileCreatedDate ? this.datePipe.transform(x.fileCreatedDate, 'MM/dd/yyyy hh:mm a'): '',
						fileUpdatedDate : x.fileUpdatedDate ? this.datePipe.transform(x.fileUpdatedDate, 'MM/dd/yyyy hh:mm a'): '',
					}  
				  })
				  arr.forEach(x=>{
					x.attachmentDetails = x.attachmentDetails.map(att => {return {
						  	...att,
						  	createdDate : att.createdDate ?  this.datePipe.transform(att.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
							updatedDate : att.updatedDate ?  this.datePipe.transform(att.updatedDate, 'MMM-dd-yyyy hh:mm a'): ''
					  }})
				  })
				this.documentsDestructuredData = arr;
				this.documentsDestructuredDataListOriginal = arr;
			})
			this.isSpinnerVisible = false;
		}, err => {
			this.documentsDestructuredData = [];
				this.isSpinnerVisible = false;
				this.onDataLoadFailed(err);
		})
	}

	getListById(vendorDocId) {
		this.isSpinnerVisible = true;
		this.vendorService.getDocumentListbyId(vendorDocId).subscribe(res => {
			this.sourceViewforDocument = res;
			this.isSpinnerVisible = false;
		}, error => this.onDataLoadFailed(error))
	}

	toGetUploadDocumentsList(attachmentId, vendorId, moduleId) {
		this.isSpinnerVisible = true;
		this.vendorService.toGetUploadDocumentsList(attachmentId, vendorId, moduleId).subscribe(res => {
			this.sourceViewforDocumentList = res;
			this.isSpinnerVisible = false;
			if (res.length > 0) {
				this.enableSave()
			}
		}, error => this.onDataLoadFailed(error))
	}

	saveDocumentInformation() {
		this.isSpinnerVisible = true;
		const data = {
			...this.documentInformation,
			vendorId: this.local.vendorId,
			masterCompanyId: this.currentUserMasterCompanyId,
			createdBy: this.userName,
			updatedBy: this.userName
		}
		for (var key in data) {
			this.formData.append(key, data[key]);
		}
		this.vendorService.documentUploadAction(this.formData).subscribe(res => {
			this.documentInformation.docDescription = '';
			this.documentInformation.docMemo = '';
			this.documentInformation.docName = '';
			this.sourceViewforDocumentList = [];
			this.formData = new FormData();
			this.clearFileUpload();
			this.getList();
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
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error))
		if (this.modal) this.modal.close();
		this.disableSave = true;
		$("#addDocumentDetails").modal("hide");
	}

	editVendorDocument(rowdata, e) {
		this.isSpinnerVisible = true;
		this.isEditButton = true;
		this.documentInformation = { ...rowdata };
		this.vendorService.toGetUploadDocumentsList(rowdata.attachmentId, rowdata.vendorId, 3).subscribe(res => {
			this.sourceViewforDocumentList = res;
			this.sourceViewforDocument = rowdata;
			this.isSpinnerVisible = false;
		}, error => this.saveFailedHelper(error))
	}

	openView(row) {
		this.isSpinnerVisible = true;
		this.vendorService.toGetUploadDocumentsList(row.attachmentId, row.vendorId, 3).subscribe(res => {
			this.sourceViewforDocumentList = res;
			this.sourceViewforDocument = row;
			this.isSpinnerVisible = false;
		}, error => this.onDataLoadFailed(error));
	}

	openViewOnDblClick(row) {
		this.isSpinnerVisible = true;
		this.vendorService.toGetUploadDocumentsList(row.attachmentId, row.vendorId, 3).subscribe(res => {
			this.sourceViewforDocumentList = res;
			this.sourceViewforDocument = row;
			this.isSpinnerVisible = false;
		}, error => this.onDataLoadFailed(error));
		$('#docView').modal('show');
	}
	
	private onDataLoadFailed(error: any) {
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
		this.isSpinnerVisible = false;
	}

	openDelete(content, row) {
		this.isEditMode = false;
		this.isDeleteMode = true;
		delete row.updatedBy;
		this.localCollection = row;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	deleteItemAndCloseModel() {
		this.isSpinnerVisible = true;
		this.isSaving = true;
		let vendorDocumentDetailId = this.localCollection.attachmentDetails[0].attachmentDetailId;
		this.customerService.deleteDocumentByCustomerAttachementId(vendorDocumentDetailId, this.userName).subscribe(
			res => {
				this.getList();
				this.alertService.showMessage(
					'Success',
					`Action was deleted successfully `,
					MessageSeverity.success
				)
				this.isSpinnerVisible = false;
			}, error => this.saveFailedHelper(error));
		this.modal.close();
	}

	dismissModel() {
		this.modal.close();
	}

	downloadFileUpload(rowData) {
		const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
		window.location.assign(url);
	}

	backClick() {
		this.activeIndex = 10;
		this.vendorService.changeofTab(this.activeIndex);
	}

	CreateNewClick() {
		this.activeIndex = 1;
		this.vendorService.changeofTab(this.activeIndex);
		this.vendorService.isEditMode = false;
        this.vendorService.ShowPtab = true;
		this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-general-information';
        this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
        this.vendorService.alertObj.next(this.vendorService.ShowPtab);
		this.route.navigateByUrl('/vendorsmodule/vendorpages/app-vendor-general-information');
		this.vendorService.listCollection = undefined;
	}

	openHistory(content, row) {
		this.isSaving = true;
		this.isSpinnerVisible = true;
		this.vendorService.getVendorDocumentAuditHistory(row.vendorDocumentDetailId).subscribe(
			results => this.onAuditHistoryLoadSuccessful(results, content),
			error => this.saveFailedHelper(error));
	}

	private onAuditHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
		this.isSpinnerVisible = false;
		this.documentauditHisory = auditHistory;
		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
	}

	private saveFailedHelper(error: any) {
		this.isSaving = false;
		this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
		this.isSpinnerVisible = false;
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

	getVendorName() {
		if (this.local !== undefined) {
			return editValueAssignByCondition('vendorName', this.local.vendorName) === undefined ? '' : editValueAssignByCondition('vendorName', this.local.vendorName);
		} else {
			return '';
		}
	}

	getPageCount(totalNoofRecords, pageSize) {
		return Math.ceil(totalNoofRecords / pageSize)
	}

	pageIndexChange(event) {
		this.pageSize = event.rows;
	}

	enableSave() {
		if (this.sourceViewforDocumentList && this.sourceViewforDocumentList.length > 0) {
			this.disableSave = false;
		} else if (this.isEditButton == true) {
			this.disableSave = false;
		} else {
			this.disableSave = true;
		}
	}

	getDeleteListByStatus(value){
        if(value){
            this.currentDeletedstatus=true;
        }else{
            this.currentDeletedstatus=false;
        }
        this.getList();
	} 
	
	openRestoreModel(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}
	
	restoreRecord() {
		this.isSpinnerVisible = true;
		this.customerService.restoreDocumentByAttachmentId(this.restorerecord.attachmentDetailId, this.userName).subscribe(
			res => {
				this.getList();
				this.alertService.showMessage(
					'Success',
					`Action was Restored successfully `,
					MessageSeverity.success
				)
				this.isSpinnerVisible = false;
			}, error => this.saveFailedHelper(error));
		this.modal.close();
	}

	changeOfTab(event) {

	}
}