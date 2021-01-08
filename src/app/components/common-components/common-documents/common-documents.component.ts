import { Component, OnInit, ViewChild, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as $ from 'jquery';
import * as moment from 'moment';
import { AuthService } from '../../../services/auth.service';
import { CustomerService } from '../../../services/customer.service';
import { CommonService } from '../../../services/common.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { ConfigurationService } from '../../../services/configuration.service';
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
    @Input() isViewMode:any=false;
    @Input() moduleName;
    @Input() referenceId;
    @Input() savedGeneralInformationData;
    @Input() editMode;
    @Input() editGeneralInformationData;
    @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
    @Input() customerDataFromExternalComponents: any;
    @Input() offLineUpload: any = false;
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
        // { field: 'fileSize', header: 'File Size' },
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
    // isViewMode: boolean = false;
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

    constructor(private commonService: CommonService, private router: ActivatedRoute, private route: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public customerService: CustomerService,
        private dialog: MatDialog, private configurations: ConfigurationService) {
    }

    ngOnInit() {
        this.offLineUpload = this.offLineUpload ? this.offLineUpload : false;
        // if (this.editMode) {
        //     this.id = this.editGeneralInformationData.customerId;

        //     this.customerCode = this.editGeneralInformationData.customerCode;
        //     this.customerName = this.editGeneralInformationData.name;
        //     this.isViewMode = false;

        // } else {
        //     if (this.customerDataFromExternalComponents) {
        //         this.id = this.customerDataFromExternalComponents.customerId;
        //         this.customerCode = this.customerDataFromExternalComponents.customerCode;
        //         this.customerName = this.customerDataFromExternalComponents.name;
        //         this.isViewMode = true;
        //     } else {
        //         this.id = this.savedGeneralInformationData.customerId;
        //         this.customerCode = this.savedGeneralInformationData.customerCode;
        //         this.customerName = this.savedGeneralInformationData.name;
        //         this.isViewMode = false;
        //     }
        // }
        this.getModuleList();

        console.log("oninit");

    }

    ngOnChanges(changes: SimpleChanges) {
        // for (let property in changes) {
        //     if (property == 'customerDataFromExternalComponents') {
        //         if (changes[property].currentValue != {}) {
        //             this.id = this.customerDataFromExternalComponents.customerId;
        //             this.customerCode = this.customerDataFromExternalComponents.customerCode;
        //             this.customerName = this.customerDataFromExternalComponents.name;
        //             if(this.id > 0)
        //              
        //             this.isViewMode = true;
        //         }
        //     }

        // }
        this.offLineUpload = this.offLineUpload ? this.offLineUpload : false;
        this.moduleName = this.moduleName
        console.log("module Name", this.moduleName);
        this.getModuleList();
    }
    attachmoduleList: any = [];
    getModuleList(): void {
        console.log("attachment function");

        this.commonService.smartDropDownList('AttachmentModule', 'AttachmentModuleId', 'Name').subscribe(res => {
            this.attachmoduleList = res;
            this.getList();
        },
            err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });

    }
    enableSave() {
        if ((this.sourceViewforDocumentList && this.sourceViewforDocumentList.length > 0)) {
            this.disableSave = false;
        } else if (this.isEditButton == true) {
            this.disableSave = false;
        } else {
            this.disableSave = true;
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
        this.isEditButton = true;
        this.documentInformation = rowdata;
        console.log("edit data", this.documentInformation);
        this.sourceViewforDocumentList = rowdata.attachmentDetails;
    }
    addDocumentDetails() {
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
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    restoreRecord() {
        console.log("this.restr", this.restorerecord);
        if (this.restorerecord && this.restorerecord.attachmentId != 0) {
            this.commonService.updatedRestoreCommonRecords(this.restorerecord.commonDocumentDetailId, this.userName).subscribe(res => {
                this.currentDeletedstatus = true;
                this.modal.close();
                this.getList();
                this.alertService.showMessage("Success", `Document Restore Successfully`, MessageSeverity.success);
                this.isSpinnerVisible = false;
            }, err => {
                const errorLog = err;
                this.saveFailedHelper(errorLog);
            })
        } else {

            this.documentCollection = [];
            if (this.currentDeletedstatus == true) {

                this.commondocumentsDestructuredData.forEach(element => {
                    if (element.isDeleted == true) {
                        this.documentCollection.push(element);
                    }
                });
            } else {
                this.commondocumentsDestructuredData.forEach(element => {
                    if (element.isDeleted == false) {
                        this.documentCollection.push(element);
                    }
                });
            }
        }
    }
    dismissModelRestore() {
        this.modal.close();
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
    }
    closeMemoModel() {
        $('#memo-popup-Doc').modal("hide");
    }
    removeFile(event) {
        this.formData.delete(event.file.name)
        this.uploadedFileLength--;
        this.disableSave = true;
        console.log("fdisable save", this.selectedFileAttachment);
        console.log("fdisable save", this.uploadedFileLength);
        console.log("fdisable save", this.formData);
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
    deleteItemAndCloseModel() {
        // this.commondocumentsDestructuredData.forEach(element => {
        //     if (element.fileName == this.localCollection.fileName) {
        //         element.isDeleted = true;
        //     }
        // });
        console.log("delete", this.selectedRowForDelete);
        if (this.selectedRowForDelete && this.selectedRowForDelete.attachmentId > 0) {
            // this.commondocumentsDestructuredDataOriginal = this.commondocumentsDestructuredData;
            this.commonService.GetAttachmentCommonDeleteById(this.selectedRowForDelete.commonDocumentDetailId, this.userName).subscribe(() => {
                this.getList()
                this.alertService.showMessage(
                    'Success',
                    `Deleted  Documents Successfully `,
                    MessageSeverity.success
                );
            }, error => this.saveFailedHelper(error))
        } else {

            this.documentCollection = [];
            if (this.currentDeletedstatus == true) {
                this.commondocumentsDestructuredData.forEach(element => {
                    if (element.isDeleted == true) {
                        this.documentCollection.push(element);
                    }
                });
            } else {
                this.commondocumentsDestructuredData.forEach(element => {
                    if (element.isDeleted == false) {
                        this.documentCollection.push(element)
                    }
                });
            }
        }
        // $('#deleteContent').modal("hide");
        this.modal.close();
    }
    dismissModeldelete() {
        this.isDeleteMode = false;
        $('#deleteContent').modal("hide");
    }
    dismissModelHistory() {
        $('#contentAuditHist').modal("hide");
    }
    updateCollection:any=[];
    onUploadDocumentListToServer() {
        console.log("module Name", this.moduleName);
        console.log("this.attachmoduleList", this.attachmoduleList);
// debugger;
        this.attachmoduleList.forEach(element => {
            if (element.label == this.moduleName) {
                this.moduleId = element.value;
            }
        });
        console.log("module moduleId", this.moduleId);
        const vdata = {
            referenceId: this.referenceId,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
            moduleId: this.moduleId,
            //docName: this.sourceViewforDocumentList[0].docName,
        }
        for (var key in vdata) {
            this.formData.append(key, vdata[key]);
        }

        if (this.documentCollection.length > 0) {
            const docList: any = [];
            console.log("form Details", this.documentCollection);
            if(this.isEditButton==true && this.newDocumentDetails){
            // for (var i = 0; i < this.newDocumentDetails.length; i++) {
                docList.push(this.newDocumentDetails)
                this.updateCollection[0]=this.newDocumentDetails;
                this.formData.append('attachmentdetais', JSON.stringify(docList));
                console.log("formDataa",)
                this.commonService.uploadDocumentsCommonEndpointUpdate(this.formData, this.updateCollection).subscribe(() => {
                    this.alertService.showMessage("Success", `Upload Documents Successfully.`, MessageSeverity.success);
                    this.formData = new FormData();
                 
                        this.isEditButton = false;
        
                    this.getList();
                }, err => {
                    this.formData = new FormData();
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                });
            // }
            }else{
                for (var i = 0; i < this.documentCollection.length; i++) {
                    docList.push(this.documentCollection[i])
                }
                this.updateCollection=this.documentCollection;
                this.formData.append('attachmentdetais', JSON.stringify(docList));
                console.log("formDataa",)
                this.commonService.uploadDocumentsCommonEndpoint(this.formData, this.updateCollection).subscribe(() => {
                    this.alertService.showMessage("Success", `Upload Documents Successfully.`, MessageSeverity.success);
                    this.formData = new FormData();
                 
                        this.isEditButton = false;
        
                    this.getList();
                }, err => {
                    this.formData = new FormData();
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                });
            }
         
        }
    }
    getList() {
        // console.log("module name",this.moduleName,this.attachmoduleList);
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
            if (this.commondocumentsDestructuredDataOriginal && this.commondocumentsDestructuredDataOriginal.length != 0) {
                this.commondocumentsDestructuredData = [...this.commondocumentsDestructuredDataOriginal, ...res];
            }
            if (this.sourceViewforDocumentList.length > 0) {
                this.sourceViewforDocumentList.forEach(item => {
                    item["isFileFromServer"] = true;
                })
            }
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
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }

    closeDeleteModal(){

    }

    exportCSV(data){

    }
    // fileUpload(event) {
    //     if (event.files.length === 0) {
    //         return this.disableSave = true;
    //     } else {
    //         this.disableSave = false;
    //     }

    //     for (let file of event.files){
    //         this.formData.append(file.name, file);
    //     }
    //     this.disableSave=false;
    // }
    fileUpload(event) {
        console.log("event", event);

        if (event.files.length === 0) {
            this.disableSave = true;
        } else {
            this.disableSave = false;
        }
        const filesSelectedTemp = [];
        this.selectedFileAttachment = [];
        for (let file of event.files) {
            console.log("file", file)
            var flag = false;
            for (var i = 0; i < this.commondocumentsDestructuredData.length; i++) {
                if (this.commondocumentsDestructuredData[i].fileName == file.name) {
                    flag = true;
                    this.alertService.showMessage(
                        'Duplicate',
                        `Already Exists this file `,
                        MessageSeverity.warn
                    );
                    this.disableSave = true;
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
                console.log("formDat", this.formData);

            }
        }
        console.log("seleclt object", filesSelectedTemp);
        this.formNames = [];
        // if()
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
        console.log("seleclt object", filesSelectedTemp);
    }
    newDocumentDetails:any={};
    saveDocumentInformation() {
        this.newDocumentDetails={};
        console.log("this.selectedFileAttachment", this.selectedFileAttachment)
        console.log("this.commondocumentsDestructuredData", this.commondocumentsDestructuredData)
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
        this.newDocumentDetails={...this.documentInformation};
        console.log("check documentInformation", this.documentInformation);
        console.log("check list", this.commondocumentsDestructuredData);

if(this.isEditButton==true){
    for (var i = 0; i < this.selectedFileAttachment.length; i++) {
        this.newDocumentDetails.attachmentDetails.push(this.selectedFileAttachment[i])
    }
}
        this.documentInformation={...this.newDocumentDetails}
        if (this.documentInformation.attachmentId > 0 || this.index > 0) {
            console.log("addd check ")
            // debugger;
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
        this.commondocumentsDestructuredData = [...this.commondocumentsDestructuredData];
        console.log("check list2", this.commondocumentsDestructuredData);
        this.documentCollection = this.commondocumentsDestructuredData;
        this.index = 0;
 
        this.disableSave == false;
        $('#addDocumentDetails').modal("hide");
        if (this.fileUploadInput) {
            this.fileUploadInput.clear()
        }

        this.selectedFileAttachment = [];
        if (this.offLineUpload == false) {
            this.onUploadDocumentListToServer();
        }
    }
}