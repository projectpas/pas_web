import { Component, OnInit, ViewChild, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
// declare var $ : any;
declare var $ : any;
import * as moment from 'moment';
import { AuthService } from '../../../services/auth.service';
import { CustomerService } from '../../../services/customer.service';
import { CommonService } from '../../../services/common.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-common-documents',
    templateUrl: './common-documents.component.html',
    styleUrls: ['./common-documents.component.scss'],
})
/** common component*/
export class CommonDocumentsComponent implements OnInit {
    disableSave: boolean = true;
    moduleId: any;
    targetData: any;
    selectedOnly: any;
    @Input() isViewMode: any = false;
    @Input() moduleName;
    @Input() referenceId;
    @Input() editMode;
    @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
    @Input() offLineUpload: any = false;
    @Input() generalInformtionData;
    @Output() tab = new EventEmitter<any>();
    @Output()parentTrigger=new EventEmitter<any>();
    @Input() uploadDocsToser: Subject<boolean>;
    documentInformation = {
        docName: '',
        docMemo: '',
        docDescription: '',
        attachmentDetailId: 0,
        attachmentId: 0,
    }
    @ViewChild('documents',{static:false}) Table;
    customerDocumentsData: any = [];
    commondocumentsDestructuredData = [];
    commondocumentsDestructuredDataOriginal: any[];
    DocumentsColumns = [
        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'fileName', header: 'File Name' },
        { field: 'docMemo', header: 'Memo' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' }
    ];
    sourceViewforDocumentListColumns = [
        { field: 'fileName', header: 'File Name' },
    ]
    selectedColumns = this.DocumentsColumns;
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
    totalRecords: number = 0;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number = 0;
    lastValueItegrated: any;
    currentDeletedstatus: boolean = false;
    restorerecord: any = {}
    memoPopupContent: any;
    memoPopupValue: any;
    isPopup: boolean = false;
    enableUpdate: boolean = false;
    hideUpoladThing:boolean=false;
    constructor(private commonService: CommonService, private router: ActivatedRoute, private route: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public customerService: CustomerService,
        private dialog: MatDialog, private configurations: ConfigurationService) {
    }

    ngOnInit() {
        this.offLineUpload = this.offLineUpload ? this.offLineUpload : false;
        if (this.generalInformtionData) {
            this.id = this.referenceId;
            this.generalCode = this.generalInformtionData.companyCode;
            this.generalName = this.generalInformtionData.name;
        }

 if(this.uploadDocsToser !=undefined){
    this.id = this.referenceId;
                this.uploadDocsToser.subscribe(v => { 
                 
                    this.hideUpoladThing=true;
              setTimeout(() => {
                this.onUploadDocumentListToServer();
              }, 1500);
                 });
                }
    }

    generalCode: any;
    generalName: any;

    ngOnChanges(changes: SimpleChanges) {
      
        for (let property in changes) {
            if (property == 'generalInformtionData') {
                if (changes[property].currentValue != {}) {
                    
                    this.generalCode = this.generalInformtionData.companyCode;
                    this.generalName = this.generalInformtionData.name;
                    this.isViewMode = this.isViewMode ? this.isViewMode : false;
                }
            }
        
         
            if (property == 'uploadDocsToser') {
                this.hideUpoladThing=true;
        //   setTimeout(() => {
        //     this.onUploadDocumentListToServer();
        //   }, 1200);
            }
        }
        this.id = this.referenceId;
        this.getModuleList();
        this.offLineUpload = this.offLineUpload ? this.offLineUpload : false;
        this.moduleName = this.moduleName;
    }
    attachmoduleList: any = [];
    arrayCustlist:any=[];
    getModuleList(): void {
    //     this.arrayCustlist.push(0);
    
    // const mcId= this.authService.currentUser
    // ? this.authService.currentUser.masterCompanyId
    // : null;
    // const strText='';
        this.commonService.smartDropDownList('AttachmentModule', 'AttachmentModuleId', 'Name').subscribe(res => {
            // this.commonService.autoSuggestionSmartDropDownList('AttachmentModule', 'AttachmentModuleId', 'Name', strText, true, 20, this.arrayCustlist.join(),mcId).subscribe(res => {
            this.attachmoduleList = res;
        //   setTimeout(() => {
            this.getList();
        //   }, 5000);
        }
        // ,
        //     err => {
        //         const errorLog = err;
        //         this.errorMessageHandler(errorLog);
        //     }
        );
    }

    enableSave() {
        if ((this.sourceViewforDocumentList && this.sourceViewforDocumentList.length > 0)) {
            this.disableSave = false;
        } else {
            this.disableSave = true;
        }
        if (this.isEditButton == true) {
            this.disableSave = false;
        }
    }

    disabledMemo: boolean = false;

    enableSaveMemo() {
        this.disabledMemo = false;
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

    openDocument(row) {
        this.sourceViewforDocumentList = [];
        this.sourceViewforDocument = row;
        this.sourceViewforDocumentList = row.attachmentDetails;
    }

    docviewdblclick(data) {
        this.sourceViewforDocument = data;
        this.openDocument(data);
        $('#docView').modal('show');
    }

    openEdit(rowdata) {
        this.selectedFileAttachment = [];
        this.isEditButton = true;
        this.documentInformation = rowdata;
        this.sourceViewforDocumentList = rowdata.attachmentDetails;
        this.disableSave = true;
    }

    addDocumentDetails() {
        this.selectedFileAttachment = [];
        this.sourceViewforDocumentList = [];
        this.isEditButton = false;
        this.documentInformation = {
            docName: '',
            docMemo: '',
            docDescription: '',
            attachmentDetailId: 0,
            attachmentId: 0
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

    documentCollection: any = [];

    getDeleteListByStatus(value) {
        if (value) {
            this.currentDeletedstatus = true;
        } else {
            this.currentDeletedstatus = false;
        }
        this.getList();
    }

    dismissDocumentPopupModel() {
        if (!this.isEditButton) {
            this.fileUploadInput.clear();
        }
    }

    downloadFile(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
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

    dateFilterForTable(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.commondocumentsDestructuredData = this.commondocumentsDestructuredDataOriginal;
            const data = [...this.commondocumentsDestructuredData.filter(x => {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.commondocumentsDestructuredData = data;
        } else {
            this.commondocumentsDestructuredData = this.commondocumentsDestructuredDataOriginal;
        }
    }

    onClickMemo() {
        this.memoPopupContent = this.documentInformation.docMemo;
    }

    onClickPopupSave() {
        this.documentInformation.docMemo = this.memoPopupContent;
        this.memoPopupContent = '';
        $('#memo-popup-Doc').modal("hide");
        this.disabledMemo = true;
        this.disableSave = false;
    }

    closeMemoModel() {
        $('#memo-popup-Doc').modal("hide");
        this.disabledMemo = true;
    }

    removeFile(event) {
        this.formData.delete(event.file.name)
        this.uploadedFileLength--;
        this.disableSave = true;
        this.selectedFileAttachment = this.selectedFileAttachment.filter(({ fileName }) => fileName !== event.file.name);
    }

    selectedFileAttachment: any = [];
    index: number;
    formNames: any;

    openHistory(rowData) {
        this.alertService.startLoadingMessage();
        this.commonService.GetAttachmentCommonAudit(rowData.commonDocumentDetailId, this.referenceId, this.moduleId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results),
            error => this.saveFailedHelper(error));
    }

    private onAuditHistoryLoadSuccessful(auditHistory) {
        this.alertService.stopLoadingMessage();
        this.documentauditHisory = auditHistory;
    }

    errorMessageHandler(log) {
        this.isSpinnerVisible = false;
    }

    openDelete(content, row) {
        this.selectedRowForDelete = row;
        this.isDeleteMode = true;
        delete row.updatedBy;
        this.localCollection = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
    }

    isOfline: any = false;

    deleteItemAndCloseModel() {
        if (this.selectedRowForDelete && this.selectedRowForDelete.attachmentId > 0) {
            this.commonService.GetAttachmentCommonDeleteById(this.selectedRowForDelete.commonDocumentDetailId, this.userName).subscribe(() => {
                this.commondocumentsList.forEach(element => {
                    if (element.commonDocumentDetailId == this.selectedRowForDelete.commonDocumentDetailId) {
                        element.isDeleted = true;
                    }
                });
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted  Documents Successfully `,
                    MessageSeverity.success
                );
            }, error => this.saveFailedHelper(error))
        } else {
            this.commondocumentsList.forEach(element => {
                if ((element.docName == this.selectedRowForDelete.docName && element.attachmentId == 0)) {
                    element.isDeleted = true;
                }
            });
            this.documentCollection = [];
            this.commondocumentsList.forEach(element => {
                if (element.isDeleted == false) {
                    this.documentCollection.push(element);
                }
            });
            this.alertService.showMessage(
                'Success',
                `Deleted  Documents Successfully `,
                MessageSeverity.success
            );
            this.isEnableUpdateButton = false;
        }
        this.modal.close();
        this.triggerUpdatebutton();
    }

    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    restoreRecord() {
        if (this.restorerecord && this.restorerecord.attachmentId != 0) {
            this.commonService.updatedRestoreCommonRecords(this.restorerecord.commonDocumentDetailId, this.userName).subscribe(res => {
                this.currentDeletedstatus = true;
                this.commondocumentsList.forEach(element => {
                    if (element.commonDocumentDetailId == this.restorerecord.commonDocumentDetailId) {
                        element.isDeleted = false;
                    }
                });
                this.modal.close();
                this.getList();
                this.alertService.showMessage("Success", `Document Restore Successfully`, MessageSeverity.success);
                this.isSpinnerVisible = false;
            }, err => {
                const errorLog = err;
                this.saveFailedHelper(errorLog);
            })
        } else {
            this.commondocumentsList.forEach(element => {
                if (element.docName == this.restorerecord.docName) {
                    element.isDeleted = false;
                }
            });
            this.documentCollection = [];
            this.commondocumentsList.forEach(element => {
                if (element.isDeleted == true) {
                    this.documentCollection.push(element);
                }
            });
            this.modal.close();
            this.alertService.showMessage("Success", `Document Restore Successfully`, MessageSeverity.success);
            this.isEnableUpdateButton = false;
        }
        this.triggerUpdatebutton();
    }

    dismissModelRestore() {
        this.modal.close();
    }

    dismissModeldelete() {
        // this.isDeleteMode = false;
        // $('#deleteContent').modal("hide");
        this.modal.close();
    }

    dismissModelHistory() {
        $('#contentAuditHist').modal("hide");
    }

    updateCollection: any = [];

    onUploadDocumentListToServer() {
        this.attachmoduleList.forEach(element => {
            if (element.label == this.moduleName) {
                this.moduleId = element.value;
            }
        });
        
        const vdata = {
            referenceId: this.referenceId,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
            moduleId: this.moduleId,
        }
        for (var key in vdata) {
            this.formData.append(key, vdata[key]);
        }

        if (this.documentCollection.length > 0) {
            const docList: any = [];
            if (this.isEditButton == true && this.newDocumentDetails) {
                docList.push(this.newDocumentDetails)
                this.updateCollection[0] = this.newDocumentDetails;
                this.formData.append('attachmentdetais', JSON.stringify(docList));
                this.commonService.uploadDocumentsCommonEndpointUpdate(this.formData, this.updateCollection).subscribe(() => {
                    this.alertService.showMessage("Success", `Upload Documents Successfully.`, MessageSeverity.success);
                    this.formData = new FormData();
                    this.isEditButton = false;
                    this.commondocumentsList = [];
                    if(this.uploadDocsToser){
                        this.uploadDocsToser.unsubscribe();
                        this.hideUpoladThing=false;
                    }
                    this.getList();
                    this.isEnableUpdateButton = true;
                }, err => {
                    this.formData = new FormData();
                });
            } else {
                for (var i = 0; i < this.documentCollection.length; i++) {
                    docList.push(this.documentCollection[i])
                }
                this.updateCollection = this.documentCollection;
                this.formData.append('attachmentdetais', JSON.stringify(docList));
                this.commonService.uploadDocumentsCommonEndpoint(this.formData, this.updateCollection).subscribe(() => {
                    this.alertService.showMessage("Success", `Upload Documents Successfully.`, MessageSeverity.success);
                    this.formData = new FormData();
                    this.isEditButton = false;
                    this.commondocumentsList = [];
                    this.isEnableUpdateButton = true;
                    if(this.uploadDocsToser){
                        this.uploadDocsToser.unsubscribe();
                        this.hideUpoladThing=false;
                    }
                    this.getList();
                }, err => {
                    this.formData = new FormData();
                });
            }

        }
    }

    getList() {
        this.isSpinnerVisible = true;
        this.attachmoduleList.forEach(element => {
            if (element.label == this.moduleName) {
                this.moduleId = element.value;
            }
        });
        this.commonService.GetDocumentsCommonList(this.referenceId, this.moduleId, this.currentDeletedstatus).subscribe(res => {

            this.commondocumentsDestructuredData = [];
            this.documentCollection = [];
            this.commondocumentsDestructuredData = res;
             if (this.sourceViewforDocumentList.length > 0) {
                this.sourceViewforDocumentList.forEach(item => {
                    item["isFileFromServer"] = true;
                })
            }
            if (this.commondocumentsList && this.commondocumentsList.length != 0) {
                if (this.currentDeletedstatus == true) {
                    this.currentDeletedstatus = true;
                    this.commondocumentsList.forEach(element => {
                        if (element.isDeleted == true) {
                            this.documentCollection.push(element);
                        }
                    });
                } else {
                    this.currentDeletedstatus = false;
                    this.commondocumentsList.forEach(element => {
                        if (element.isDeleted == false) {
                            this.documentCollection.push(element)
                        }
                    });
                }
            } else {
                if (this.currentDeletedstatus == true) {
                    this.currentDeletedstatus = true;
                    this.commondocumentsDestructuredData.forEach(element => {
                        if (element.isDeleted == true) {
                            this.documentCollection.push(element);
                        }
                    });
                } else {
                    this.currentDeletedstatus = false;
                    this.commondocumentsDestructuredData.forEach(element => {
                        if (element.isDeleted == false) {
                            this.documentCollection.push(element)
                        }
                    });
                }
            }
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        })
    }

    closeDeleteModal() {
        $('#downloadConfirmation').modal("hide");
    }

    viewModelDismiss() {
        $('#docView').modal("hide");
    }

    exportCSV(data) {
    }

    fileUpload(event) {
        if (event.files.length == 0) {
            this.disableSave = true;
        } else {
            this.disableSave = false;
        }
        const filesSelectedTemp = [];
        // this.selectedFileAttachment = [];
        for (let file of event.files) {
            var flag = false;
            for (var i = 0; i < this.commondocumentsDestructuredData.length; i++) {
                if (this.commondocumentsDestructuredData[i].fileName == file.name) {
                    flag = true;
                    this.alertService.showMessage(
                        'Duplicate',
                        `Already Exists this file `,
                        MessageSeverity.warn
                    );
                    if (this.fileUploadInput) {
                        this.fileUploadInput.clear()
                    }
                }
            }
            if (!flag) {
                filesSelectedTemp.push({
                    link: file.objectURL,
                    fileName: file.name,
                    isFileFromServer: false,
                    fileSize: file.size,
                })
                this.formData.append(file.name, file);
            }
        }
        this.formNames = [];
        for (var i = 0; i < filesSelectedTemp.length; i++) {
            this.selectedFileAttachment.push({
                createdBy: this.userName,
                updatedBy: this.userName,
                createdDate: Date.now(),
                updatedDate: Date.now(),
                link: filesSelectedTemp[i].link,
                fileName: filesSelectedTemp[i].fileName,
                fileSize: filesSelectedTemp[i].fileSize,
                typeId: 1,
                isFileFromServer: false,
                attachmentDetailId: 0,
                attachmentId: 0,
                isDeleted: false
            })
        }
    }

    newDocumentDetails: any = {};

    saveDocumentInformation() {
        this.newDocumentDetails = {};
        this.documentInformation;
        if (this.selectedFileAttachment != [] && !this.isEditButton) {
            this.commondocumentsDestructuredData.push({
                docName: this.documentInformation.docName,
                docMemo: this.documentInformation.docMemo,
                docDescription: this.documentInformation.docDescription,
                masterCompanyId: this.authService.currentUser.masterCompanyId,
                attachmentId: 0,
                createdBy: this.userName,
                updatedBy: this.userName,
                createdDate: Date.now(),
                updatedDate: Date.now(),
                isDeleted: false,
                attachmentDetails: this.selectedFileAttachment
            })
        }
        this.newDocumentDetails = { ...this.documentInformation };
        if (this.isEditButton == true) {
            for (var i = 0; i < this.selectedFileAttachment.length; i++) {
                this.newDocumentDetails.attachmentDetails.push(this.selectedFileAttachment[i])
            }
        }
        this.documentInformation = { ...this.newDocumentDetails }
        if (this.documentInformation.attachmentId > 0 || this.index > 0) {
            for (var i = 0; i <= this.commondocumentsDestructuredData.length; i++) {
                if (this.commondocumentsDestructuredData[i].attachmentId > 0) {
                    if (this.commondocumentsDestructuredData[i].attachmentId == this.documentInformation.attachmentId) {
                        this.commondocumentsDestructuredData[i].docName = this.documentInformation.docName;
                        this.commondocumentsDestructuredData[i].docMemo = this.documentInformation.docMemo;
                        this.commondocumentsDestructuredData[i].docDescription = this.documentInformation.docDescription;
                        this.commondocumentsDestructuredData[i].attachmentDetails = this.newDocumentDetails.attachmentDetails;
                        break;
                    }
                }
                else {
                    if (i == this.index) {
                        this.commondocumentsDestructuredData[i].docName = this.documentInformation.docName;
                        this.commondocumentsDestructuredData[i].docMemo = this.documentInformation.docMemo;
                        this.commondocumentsDestructuredData[i].docDescription = this.documentInformation.docDescription;
                        break;
                    }
                }
            }
            this.index = 0;
            // this.isEditButton = false;
            this.disableSave == true;
        }
        // this.documentCollection
        // this.commondocumentsList=[];
        // this.commondocumentsList = [...this.commondocumentsDestructuredData];

        this.enableUpdate = (this.documentCollection && this.documentCollection.length > 0);

        this.commondocumentsDestructuredData = [...this.commondocumentsDestructuredData];
        this.documentCollection = this.commondocumentsDestructuredData;
        this.commondocumentsList = [...this.documentCollection];
        this.index = 0;
        this.disableSave == false;
     
        $('#addDocumentDetails').modal("hide");
        if (this.fileUploadInput) {
            this.fileUploadInput.clear()
        }
        this.selectedFileAttachment = [];
        if (this.offLineUpload == false) {
            this.onUploadDocumentListToServer();
        } else {
            this.alertService.showMessage("Success", `Upload Documents Successfully.`, MessageSeverity.success);
        }
        this.isEnableUpdateButton = false;
        this.triggerUpdatebutton();
    }

    isEnableUpdateButton: any = true;
    
    backClick() {
        this.tab.emit('Shipping'); 

      
    }
    //offline upload time enable update button for parent component 
    triggerUpdatebutton(){
this.parentTrigger.emit(true)
    }
    commondocumentsList: any = []
}