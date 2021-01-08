import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input, ElementRef, SimpleChanges } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { Router, ActivatedRoute } from '@angular/router';
//import { Router, NavigationExtras } from '@angular/router';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { CustomerService } from '../../../services/customer.service';
import { CustomerContactModel } from '../../../models/customer-contact.model';
import { MatDialog } from '@angular/material';
import { getObjectByValue, getObjectById, getValueFromObjectByKey } from '../../../generic/autocomplete';
import { ConfigurationService } from '../../../services/configuration.service';
import * as $ from 'jquery';
import { Table } from 'primeng/table';
import * as moment from 'moment';
@Component({
    selector: 'app-customer-documents',
    templateUrl: './customer-documents.component.html',
    styleUrls: ['./customer-documents.component.scss'],
})
/** Customer component*/
export class CustomerDocumentsComponent implements OnInit {
    disableSave: boolean = true;
    @Input() savedGeneralInformationData;
    @Input() editMode;
    @Input() editGeneralInformationData;
    @Input() selectedCustomerTab: string = '';
    @Output() tab = new EventEmitter<any>();
    @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
    @Input() customerDataFromExternalComponents: any;
    documentInformation = {
        docName: '',
        docMemo: '',
        docDescription: ''
    }
    @ViewChild('documents',{static:false}) Table;
    customerDocumentsData: any = [];
    customerdocumentsDestructuredData = [];
    customerdocumentsDestructuredDataOriginal:any[];
    customerDocumentsColumns = [

        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'fileName', header: 'File Name' },
        { field: 'fileSize', header: 'File Size' },
        { field: 'docMemo', header: 'Memo' },
        { field: 'fileCreatedDate', header: 'Created Date' },
        { field: 'fileCreatedBy', header: 'Created By' },
        { field: 'fileUpdatedDate', header: 'Updated Date' },
        { field: 'fileUpdatedBy', header: 'Updated By' }        
    ];
    sourceViewforDocumentListColumns = [
        { field: 'fileName', header: 'File Name' },
    ]
    selectedColumns = this.customerDocumentsColumns;
    formData = new FormData()
    uploadedFileLength = 0;
    isSpinnerVisible: boolean = false;
    isEditButton: boolean = false;
    isDeleteMode: boolean = false;
    id: number;
    customerCode: any;
    customerName: any;
    sourceViewforDocument: any;
    localCollection: any;
    selectedRowForDelete: any;
    modal: NgbModalRef;
    sourceViewforDocumentList: any = [];
    documentauditHisory: any[];
    headersforAttachment = [
        { field: 'fileName', header: 'File Name' },
    ];
    isViewMode: boolean = false;
    totalRecords: number = 0;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number = 0;
    //loader: boolean = true;
    lastValueItegrated: any;
    currentDeletedstatus:boolean=false;
    restorerecord:any={}
    memoPopupContent: any;
    memoPopupValue: any;
    isPopup:boolean=false;

    constructor(private router: ActivatedRoute, private route: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public customerService: CustomerService,
        private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService) {
    }

    ngOnInit() {
        if (this.editMode) {
            this.id = this.editGeneralInformationData.customerId;

            this.customerCode = this.editGeneralInformationData.customerCode;
            this.customerName = this.editGeneralInformationData.name;
            this.isViewMode = false;
            //this.getList();

        } else {
            if (this.customerDataFromExternalComponents) {
                this.id = this.customerDataFromExternalComponents.customerId;
                this.customerCode = this.customerDataFromExternalComponents.customerCode;
                this.customerName = this.customerDataFromExternalComponents.name;
                //this.getList();
                this.isViewMode = true;
            } else {
                this.id = this.savedGeneralInformationData.customerId;
                this.customerCode = this.savedGeneralInformationData.customerCode;
                this.customerName = this.savedGeneralInformationData.name;
                this.isViewMode = false;
                //this.getList();
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {

        for (let property in changes) {
            if (property == 'customerDataFromExternalComponents') {
                if (changes[property].currentValue != {}) {
                    this.id = this.customerDataFromExternalComponents.customerId;
                    this.customerCode = this.customerDataFromExternalComponents.customerCode;
                    this.customerName = this.customerDataFromExternalComponents.name;
                    if(this.id > 0)
                        this.getList();
                    this.isViewMode = true;
                }
            }
            if (property == 'selectedCustomerTab') {
                if (changes[property].currentValue != {} && changes.selectedCustomerTab.currentValue == "Documents") {
                     if (this.editMode) {
                        this.id = this.editGeneralInformationData.customerId;
                
                        this.customerCode = this.editGeneralInformationData.customerCode;
                        this.customerName = this.editGeneralInformationData.name;
                        this.isViewMode = false;
                        this.getList();
                
                    } else {
                        if (this.customerDataFromExternalComponents) {
                            this.id = this.customerDataFromExternalComponents.customerId;
                            this.customerCode = this.customerDataFromExternalComponents.customerCode;
                            this.customerName = this.customerDataFromExternalComponents.name;
                            this.getList();
                            this.isViewMode = true;
                         } else {
                             this.id = this.savedGeneralInformationData.customerId;
                            this.customerCode = this.savedGeneralInformationData.customerCode;
                            this.customerName = this.savedGeneralInformationData.name;
                            this.isViewMode = false;
                            this.getList();
                         }
                    }
                }
            }
        }
    }

    enableSave() {

        if ((this.sourceViewforDocumentList && this.sourceViewforDocumentList.length > 0)) {
            this.disableSave = false;
        }else if(this.isEditButton == true){
            this.disableSave = false; 
        } else {
            this.disableSave = this.uploadedFileLength === 0; 
        }
       
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
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }

    fileUpload(event) {
        if (event.files.length === 0) {
			return  this.disableSave = true;
		}else{
            this.disableSave = false;
		}

        for (let file of event.files) {
            this.uploadedFileLength++;
            this.formData.append(file.name, file);
        }
    }
    removeFile(event) {
        this.formData.delete(event.file.name)
        this.uploadedFileLength--;
        this.disableSave = this.uploadedFileLength === 0;
    }

    openDocument(row) {
        this.sourceViewforDocumentList = [];
        this.customerService.toGetUploadDocumentsList(row.attachmentId, row.customerId, 1).subscribe(res => {
            this.sourceViewforDocumentList = res;
            this.sourceViewforDocument = row;
        },error => this.saveFailedHelper(error));

    }
    docviewdblclick(data) {
        this.sourceViewforDocument = data;
        this.openDocument(data);
        $('#docView').modal('show');
    }
    toGetUploadDocumentsList(attachmentId, customerId, moduleId) {

        this.customerService.toGetUploadDocumentsList(attachmentId, customerId, moduleId).subscribe(res => {
            this.sourceViewforDocumentList = res;
            if (res.length > 0) {
                this.enableSave();
            }
        },error => this.saveFailedHelper(error))
    }
    getList() {
        this.isSpinnerVisible = true;
        this.customerdocumentsDestructuredData = [];
          this.customerService.getDocumentList(this.id, this.currentDeletedstatus).subscribe(res => {
			let arr = [];
			const data = res.map(x => {
				for (var i = 0; i < x.attachmentDetails.length; i++) {
					const y = x.attachmentDetails;
					arr.push({
						...x,
						fileName: y[i].fileName,
						fileCreatedDate: y[i].createdDate,
						fileCreatedBy: y[i].createdBy,
						fileUpdatedBy: y[i].updatedBy,
						fileUpdatedDate: y[i].updatedDate,
						fileSize: y[i].fileSize,
						attachmentDetailId: y[i].attachmentDetailId

					})
            }
        })
			this.customerdocumentsDestructuredData = arr;
            this.customerdocumentsDestructuredDataOriginal=arr;
            //this.loader = false;
            this.isSpinnerVisible = false;
        }, err => {
            this.customerdocumentsDestructuredData = [];
            //this.loader = false;
            this.isSpinnerVisible = false;
        })
        //this.isSpinnerVisible = false;
    }
    saveDocumentInformation() {        
        const data = {
            ...this.documentInformation,
            customerId: this.id,
            masterCompanyId: this.currentUserMasterCompanyId,
            updatedBy: this.userName,
            createdBy: this.userName
        }

        for (var key in data) {
            this.formData.append(key, data[key]);
        }
        
        if (!this.isEditButton) {
            this.isSpinnerVisible = true;
            this.customerService.documentUploadAction(this.formData).subscribe(res => {
                this.formData = new FormData()
                this.documentInformation = {

                    docName: '',
                    docMemo: '',
                    docDescription: ''
                }
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Saved Documents Successfully `,
                    MessageSeverity.success
                );
                this.dismissDocumentPopupModel()
                this.isSpinnerVisible = false;
            },error => this.saveFailedHelper(error))
            
        }
        else {
            this.isSpinnerVisible = true;
            this.customerService.documentUploadAction(this.formData).subscribe(res => {
                this.documentInformation = {

                    docName: '',
                    docMemo: '',
                    docDescription: ''
                }
                this.isEditButton = false;
                this.formData = new FormData()
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Updated Documents Successfully `,
                    MessageSeverity.success
                );
                this.dismissDocumentPopupModel()
                this.isSpinnerVisible = false;
            },error => this.saveFailedHelper(error))
        }
        $("#addDocumentDetails").modal("hide");
        this.disableSave = true;
        this.isSpinnerVisible = false;
    }

    updateCustomerDocument() { }

    editCustomerDocument(rowdata) {
        this.isEditButton = true;
        this.documentInformation = rowdata;

        this.customerService.toGetUploadDocumentsList(rowdata.attachmentId, rowdata.customerId, 1).subscribe(res => {
            this.sourceViewforDocumentList = res;
        },error => this.saveFailedHelper(error));
    }

    addDocumentDetails() {
        this.sourceViewforDocumentList = [];
        this.isEditButton = false;
        this.documentInformation = {

            docName: '',
            docMemo: '',
            docDescription: ''
        }
    }
    backClick() {
        this.tab.emit('Warnings');
    }
    addNewClick() {
        //this.route.navigateByUrl(`customersmodule/customerpages/app-customer-create`);
        this.tab.emit('General');
        this.route.navigate(['customersmodule/customerpages/app-customer-create']);
    }
    openDelete(content, row) {
        this.selectedRowForDelete = row;
        this.isDeleteMode = true;
        delete row.updatedBy;
        this.localCollection = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
    }
    restore(content, rowData)
    {
        this.restorerecord = rowData;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    restoreRecord()
    {
        let attachmentDetailId = this.restorerecord.attachmentDetailId;
        this.isSpinnerVisible = true;
		this.customerService.restoreCustomerDocumentRecord(attachmentDetailId, this.userName).subscribe(res => {
			this.currentDeletedstatus=true;
			this.modal.close();
			this.getList()
			this.alertService.showMessage("Success", `Document Restore Successfully`, MessageSeverity.success);
			this.isSpinnerVisible = false;
		},error => this.saveFailedHelper(error))
    }
    getDeleteListByStatus(value){
		if(value){
			this.currentDeletedstatus=true;
		}else{
			this.currentDeletedstatus=false;
		}
		this.getList();
	}
    deleteItemAndCloseModel() {
        let attachmentDetailId = this.localCollection.attachmentDetailId;
        if (attachmentDetailId > 0) {
            this.customerService.deleteCustomerDocumentRecord(attachmentDetailId, this.userName).subscribe(res => {
                this.getList()
                this.alertService.showMessage(
                    'Success',
                    `Deleted  Documents Successfully `,
                    MessageSeverity.success
                );
            },error => this.saveFailedHelper(error))
        } 
        this.modal.close();
    }
    dismissModel() {
        this.isDeleteMode = false;
        this.modal.close();
    }

    dismissDocumentPopupModel() {
        this.fileUploadInput.clear();
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
    openHistory(content, rowData) {
        this.alertService.startLoadingMessage();

        this.customerService.getCustomerDocumentHistory(rowData.customerDocumentDetailId, this.id).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results, content),
            error => this.saveFailedHelper(error));
    }
    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.documentauditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
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
    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        setTimeout(() => this.alertService.stopLoadingMessage(), 10000);
    }

    dateFilterForTable(date, field){
        if(date !== '' && moment(date).format('MMMM DD YYYY') ){

            const data = [...this.customerdocumentsDestructuredData.filter(x => {
                if(    moment(x.fileCreatedDate).format('MMMM DD YYYY')  === moment(date).format('MMMM DD YYYY') && field === 'fileCreatedDate' ){
                    return x;
                }else if(moment(x.fileUpdatedDate).format('MMMM DD YYYY')  === moment(date).format('MMMM DD YYYY') && field === 'fileUpdatedDate' ){
                    return x;
                }
            }) ]
            this.customerdocumentsDestructuredData = data;
        }else{
        this.customerdocumentsDestructuredData = this.customerdocumentsDestructuredDataOriginal;
        }  
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
}