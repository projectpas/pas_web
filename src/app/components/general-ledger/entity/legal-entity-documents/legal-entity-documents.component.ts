import { Component, OnInit, ViewChild, Output, EventEmitter, Input,  SimpleChanges } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal,  NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../services/auth.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { MasterComapnyService } from '../../../../services/mastercompany.service';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { MatDialog } from '@angular/material';
import { ConfigurationService } from '../../../../services/configuration.service';
import * as $ from 'jquery';
@Component({
    selector: 'app-legal-entity-documents',
    templateUrl: './legal-entity-documents.component.html',
    styleUrls: ['./legal-entity-documents.component.scss'],
})
/** Entity Documents component*/
export class EntityDocumentsComponent implements OnInit {
    disableSave: boolean = true;
// @Input() viewDataGeneralInformation;
    @Input() savedGeneralInformationData;
    @Input() editMode;
    @Input() editGeneralInformationData;
    @Output() tab = new EventEmitter<any>();
    @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
    @Input() legalEntityDataFromExternalComponents: any;
    documentInformation = {

        docName: '',
        docMemo: '',
        docDescription: ''
    }
    legalEntityDocumentsData: any = [];
    legalEntityDocumentsColumns = [

        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'documents', header: 'Documents' },
        { field: 'docMemo', header: 'Memo' },
        { field: 'createdDate', header: 'Created Date' },
		{ field: 'createdBy', header: 'Created By' },
		{ field: 'updatedDate', header: 'Updated Date' },
		{ field: 'updatedBy', header: 'Updated By' },
    ];
    sourceViewforDocumentListColumns = [
        { field: 'fileName', header: 'File Name' },
    ]
    selectedColumns = this.legalEntityDocumentsColumns;
    formData = new FormData()
    uploadedFileLength = 0;
    // ediData: any;
    isEditButton: boolean = false;
    isDeleteMode: boolean = false;
    id: number;
    legalEntityCode: any;
    legalEntityName: any;
    sourceViewforDocument: any;
    localCollection: any;
    selectedRowForDelete: any={};
    legalEntityDocumentDetailId: any;
    dellogo: any;
    modal: NgbModalRef;
    attachid: any;
    legal: any;
    sourceViewforDocumentList: any = [];
    documentauditHisory: any[];
    headersforAttachment = [
        { field: 'fileName', header: 'File Name' },
        //{ field: 'link', header: 'Action' },
    ];
    isViewMode: boolean = false;
    totalRecords: number = 0;
    memoPopupContent:any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number = 0;

    constructor(private router: ActivatedRoute, private route: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public legalEntityService: LegalEntityService,
        private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService) {
    }

    ngOnInit() {
    if(this.isViewMode==false){
        if (this.editMode) {
            this.id = this.editGeneralInformationData.legalEntityId;

            this.legalEntityCode = this.editGeneralInformationData.companyCode;
            if(typeof this.editGeneralInformationData.name != 'string'){
                this.legalEntityName = this.editGeneralInformationData.name.label;
            }else{
                this.legalEntityName = this.editGeneralInformationData.name;
            }
            this.isViewMode = false;
            this.getList();

        } else {
            if (this.legalEntityDataFromExternalComponents) {
                this.id = this.legalEntityDataFromExternalComponents.legalEntityId;
                this.legalEntityCode = this.legalEntityDataFromExternalComponents.companyCode;
                if(typeof this.legalEntityDataFromExternalComponents.name != 'string'){
                    this.legalEntityName = this.legalEntityDataFromExternalComponents.name.label;
                }else{
                    this.legalEntityName = this.legalEntityDataFromExternalComponents.name;
                }
                this.getList();
                this.isViewMode = true;
            } else {
                this.id = this.savedGeneralInformationData.legalEntityId;
                this.legalEntityCode = this.savedGeneralInformationData.companyCode;
                if(typeof this.savedGeneralInformationData.name != 'string'){
                    this.legalEntityName = this.savedGeneralInformationData.name.label;	
                }else{
                    this.legalEntityName = this.savedGeneralInformationData.name;
                    
                }
                this.isViewMode = false;
                this.getList();
            }

        }
    }

    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {

            if (property == 'legalEntityDataFromExternalComponents') {

                if (changes[property].currentValue != {}) {
                    this.id = this.legalEntityDataFromExternalComponents.legalEntityId;
                    this.legalEntityCode = this.legalEntityDataFromExternalComponents.legalEntityCode;
                    this.legalEntityName = this.legalEntityDataFromExternalComponents.name;
                    this.getList();
                    this.isViewMode = true;

                }
            }
          
        }
    }
    // enableSave() {
    //     this.disableSave = false;

    // }
    closeMyModel(type) {
        $(type).modal("hide");
        this.disableSave = true;
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    fileUpload(event) {
        if (event.files.length === 0) {
            return this.disableSave = true;
        } else {
            this.disableSave = false;
        }

        for (let file of event.files){
            this.formData.append(file.name, file);
        }
        this.disableSave=false;
    }
    removeFile(event) {
        this.formData.delete(event.file.name)

    }

    openDocument(content, row) {

        this.legalEntityService.toGetUploadDocumentsList(row.attachmentId, row.legalEntityId, 30).subscribe(res => {
            this.sourceViewforDocumentList = res;
            this.sourceViewforDocument = row;

        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })


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

    openDeletes(content, row) {
        this.selectedRowForDelete=row;
        this.dellogo = row.attachmentId;
       this.editMode = false;
        this.isDeleteMode = true;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }


    docviewdblclick(data) {
        this.sourceViewforDocument = data;
        $('#docView').modal('show');

    }
    toGetUploadDocumentsList(attachmentId, legalEntityId, moduleId) {

        this.legalEntityService.toGetUploadDocumentsList(attachmentId, legalEntityId, moduleId).subscribe(res => {
            this.sourceViewforDocumentList = res;
            if (res.length > 0) {
                // this.disableSave = false;
                 this.enableSave();
            }
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    getDeleteListByStatus(value){
        this.deletedStatusInfo=value ? value :false;
        this.getList();
    }
    deletedStatusInfo:boolean=false;
    getList() {
        if(this.id !=undefined){     
            this.isSpinnerVisible=true; 
              this.legalEntityService.getDocumentList(this.id,this.deletedStatusInfo).subscribe(res => {
            this.legalEntityDocumentsData = res;
            this.isSpinnerVisible=false; 
            if (this.legalEntityDocumentsData.length > 0) {
                this.totalRecords = this.legalEntityDocumentsData.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
}
restorerecord: any = {}

restoreRecord() {
    this.legalEntityService.restoreDocumentLegal(this.restorerecord.legalEntityDocumentDetailId,this.userName).subscribe(res => {
        this.getList()
        this.modal.close();
        this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
    }, err => {
        const errorLog = err;
    });
}

restore(content, rowData) {
    this.restorerecord = rowData;
    this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
}
    saveDocumentInformation() {
        const data = {
            ...this.documentInformation,
            legalEntityId: this.id,
            masterCompanyId: 1,
            updatedBy: this.userName,
            createdBy: this.userName
        }

       // alert(JSON.stringify(data));

        for (var key in data) {
            this.formData.append(key, data[key]);
        }

       // alert(JSON.stringify(this.formData));
        if (!this.isEditButton) {
            this.legalEntityService.documentUploadAction(this.formData).subscribe(res => {
                this.formData = new FormData()
                this.documentInformation = {

                    docName: '',
                    docMemo: '',
                    docDescription: ''
                }
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Document Saved Successfully `,
                    MessageSeverity.success
                );
                this.dismissDocumentPopupModel()
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
        else {
            this.legalEntityService.documentUploadAction(this.formData).subscribe(res => {
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
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
        $("#addDocumentDetails").modal("hide");
        this.disableSave = true;
    }

    updatelegalEntityDocument() { }
    savedocument(){
    this.getList();
    this.alertService.showMessage(
        'Success',
        `Documents Saved Successfully `,
        MessageSeverity.success
    );
    }

    editlegalEntityDocument(rowdata) {
        this.isEditButton = true;
        this.documentInformation = rowdata;
        //alert(JSON.stringify(rowdata));

        this.attachid = rowdata.attachmentId;
        this.legal = rowdata.legalEntityId;
        this.legalEntityService.toGetUploadDocumentsList(rowdata.attachmentId, rowdata.legalEntityId, 30).subscribe(res => {
            this.sourceViewforDocumentList = res;
            //this.sourceViewforDocument = rowdata;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
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
       // this.tab.emit('Warnings');
        this.tab.emit('Shipping');
    }
    openDelete(content, row) {
        this.selectedRowForDelete = row;
        this.legalEntityDocumentDetailId = row.legalEntityDocumentDetailId;
        //this.attachid = row.attachmentId;
       // this.legal = row.legalEntityId;
        this.isDeleteMode = true;
        delete row.updatedBy;
        this.localCollection = row.legalEntityDocumentDetailId;
        this.modal = this.modalService.open(content, { size: 'sm' });

    }
    deletesItemAndCloseModel(){

        this.legalEntityService.deleteLogo(this.dellogo).subscribe(res => {
        
            this.alertService.showMessage(
                'Success',
                `Action was deleted successfully `,
                MessageSeverity.success
            );
            this.toGetUploadDocumentsList(this.attachid, this.legal, 30);
            this.getList();
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });

        this.modal.close();
    }


    deleteItemAndCloseModel() {

        this.legalEntityService.deleteDocumentListbyId(this.legalEntityDocumentDetailId).subscribe(res => {
                    this.alertService.showMessage(
                    'Success',
                    `Action was deleted successfully `,
                    MessageSeverity.success
                );
            // this.toGetUploadDocumentsList(this.attachid, this.legal, 30);
            this.getList();
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });

        this.modal.close();
    }

    enableSave() {

        if ((this.sourceViewforDocumentList && this.sourceViewforDocumentList.length > 0)) {
            this.disableSave = false;
        }else if(this.isEditButton == true){
            this.disableSave = false; 
        } else {
            this.disableSave = false; 
        }
       this.isDocsMemoEnable=false
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

    openHistory(rowData) {

        this.legalEntityService.getlegalEntityDocumentHistory(rowData.legalEntityDocumentDetailId, this.id).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results), err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
    }
    private onAuditHistoryLoadSuccessful(auditHistory) {
        this.alertService.stopLoadingMessage();


        this.documentauditHisory = auditHistory;

        // this.modal = this.modalService.open(content, { size: 'lg',  keyboard: false,windowClass:'assetMange' });

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

        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }
    isDocsMemoEnable:any=false;
    onClickMemo() {
        this.memoPopupContent = this.documentInformation.docMemo;
       this.enableSave();
        //this.memoPopupValue = value;
        this.isDocsMemoEnable=true;
    }   
    onClickPopupSave() {
        this.documentInformation.docMemo = this.memoPopupContent;
        this.memoPopupContent = '';
        $('#memo-popup-Doc').modal("hide");
    }
    closeMemoModel() {
        $('#memo-popup-Doc').modal("hide");
    }
    closeDOcs(){
        $('#docView').modal("hide");
    }
    dismissModel() { 
        this.isDeleteMode = false;
        this.modal.close();
    }
    dismissModelHistory(){ 
        // if(this.isViewMode==false){
            // this.modal.close();
        // }else{
            $('#contentHistDocs').modal("hide");
//             $('.show').remove();
//             $('.fade').remove();
// $('.modal-backdrop').remove();

// modal-backdrop fade show
        // }
    }
    closeView(){
        $('#docView').modal("hide");
    }
    isSpinnerVisible:boolean=false;
    errorMessageHandler(log) {
        this.isSpinnerVisible=false; 
        // this.alertService.showMessage(
        //     'Error',
        //     log,
        //     MessageSeverity.error
        // ); 
    }
}
// $('.modal-backdrop').remove();

