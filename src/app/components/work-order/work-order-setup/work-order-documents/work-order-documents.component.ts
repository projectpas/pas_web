import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { Documents } from '../../../../models/work-order-documents.modal';
declare var $ : any;
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { AuthService } from '../../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { ConfigurationService } from '../../../../services/configuration.service';
import { CommonService } from '../../../../services/common.service';
import { NgbModal,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-work-order-documents',
  templateUrl: './work-order-documents.component.html',
  styleUrls: ['./work-order-documents.component.scss']
})
/** WorkOrderDocuments component*/
export class WorkOrderDocumentsComponent implements OnInit {
  @Input() savedWorkOrderData: any
  @Input() documentForm;
  @Input() workFlowWorkOrderId;
    @Input() documentsDestructuredData: any = [];
  @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
  @Input() isView: boolean = false;
  @Input() subWorkOrderDetails:any;
  @Input() subWOPartNoId:any;
  @Input() isSubWorkOrder:boolean=false;
    documentTypeList: any = [];
 disableSave: Boolean = true;
  formData = new FormData();
  isEditButton = false;
  sourceViewforDocumentList: any = [];
  workOrderId: any;
 
  sourceViewforDocumentListColumns = [
    { field: 'fileName', header: 'File Name' },
  ]
  loader = false;
  pageSize: any = 10;
  documentsColumns = [

    { field: 'name', header: 'Name' },
    { field: 'description', header: 'Description' },
    { field: 'fileName', header: 'File Name' },
      { field: 'type', header: 'Type' },
      { field: 'fileSize', header: 'File Size' },
      { field: 'memo', header: 'Memo' },
    { field: 'createdDate', header: 'Created Date' },
    { field: 'createdBy', header: 'Created By' },
    { field: 'updatedBy', header: 'Updated By' },
    { field: 'updatedDate', header: 'Updated Date' }
  
  ];
  selectedColumns = this.documentsColumns;
    localCollection: any;
    selectedRowForDelete: any;
    modal: NgbModalRef;
    isDeleteMode: boolean = false;

  constructor(private workOrderService: WorkOrderService,
      private alertService: AlertService,
      private authService: AuthService, private configurations: ConfigurationService,
      private commonService: CommonService, private modalService: NgbModal) { }


  ngOnInit() {
      this.workOrderId = this.savedWorkOrderData.workOrderId;
      this.getAllDocumentTypeList();
    // this.workFlowWorkOrderId = this.savedWorkOrderData
  }
  addNewDoc() {
    this.documentForm = [...this.documentForm, new Documents()];
  }

  get userName(): string {
    return this.authService.currentUser ? this.authService.currentUser.userName : "";
  }
  // this.docName = '';
  // this.docMemo = '';
  // this.docDescription = '';
  // this.docCode = '';


  //  getDocumentList() {
  //    this.loader = true;
  //    this.workOrderService.getDocumentsList(this.workFlowWorkOrderId, this.workOrderId).subscribe(res => {
  //    this.documentsDestructuredData = res;
  //    this.loader = false;
  //  })
  //}

    getDocumentList() {
        this.documentsDestructuredData = [];
        this.workOrderService.getDocumentsList(this.workFlowWorkOrderId, this.workOrderId,this.isSubWorkOrder,this.subWOPartNoId ? this.subWOPartNoId :0).subscribe(res => {
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
                        link: y[i].link,
                        attachmentDetailId: y[i].attachmentDetailId

                    })
                }
            })

            this.documentsDestructuredData = arr;
            this.loader = false;
        }, err => {
                this.documentsDestructuredData = [];
            this.loader = false;
        })
    }

     

    addDocumentDetails() {
        this.sourceViewforDocumentList = [];
        this.isEditButton = false;
        this.documentForm = {

            name: '',
            memo: '',
            description: '',
            code:''
        }
        this.formData = new FormData();
        this.fileUploadInput.clear();
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

  fileUpload(event) {
      if (event.files.length == 0) {

          return this.disableSave = true;
      } else {
          this.disableSave = false;
      }

    for (let file of event.files){
      this.sourceViewforDocumentList.push(file);
      this.formData.append(file.name, file);
    }
   
    }

  removeFile(event) {
    delete this.sourceViewforDocumentList[this.sourceViewforDocumentList.length-1];
    this.formData.delete(event.file.name)
    }

  openDocument(x, y) {

    }

  openHistory(x, y) { }


  saveDocumentInformation1() {
    const data = {
      ...this.documentForm,
      // customerId: this.id,
      workOrderId: this.workOrderId,
      workFlowWorkOrderId: this.workFlowWorkOrderId,
      masterCompanyId: 1,
      updatedBy: this.userName,
      createdBy: this.userName,
      managementStructureId: 1,
      // attachmentId : 1
    }
    for (var key in data) {
      this.formData.append(key, data[key]);
    }
    this.workOrderService.createDocuments(this.formData,this.isSubWorkOrder).subscribe(res => {
      this.closeMyModel('#documentDetails');
      this.alertService.showMessage(
        'Success',
        `Saved Documents Successfully `,
        MessageSeverity.success
        );
        this.formData = new FormData();
        this.getDocumentList();
    })
  }


 saveDocumentInformation() {
     const data = {
         ...this.documentForm,
         // customerId: this.id,
         workOrderId: this.workOrderId,
         workFlowWorkOrderId: this.workFlowWorkOrderId,
         masterCompanyId: 1,
         updatedBy: this.userName,
         createdBy: this.userName,
         managementStructureId: 1,
      // attachmentId : 1
         }
if(this.isSubWorkOrder==true){
data.subWOPartNoId=this.subWOPartNoId;
data.subWorkOrderId=this.subWorkOrderDetails.subWorkOrderId;
}
        for (var key in data) {
            this.formData.append(key, data[key]);
        }
        if (!this.isEditButton) {
            this.workOrderService.createDocuments(this.formData,this.isSubWorkOrder).subscribe(res => {
                this.formData = new FormData()
                this.fileUploadInput.clear();
                this.documentForm = {
                    name: '',
                    memo: '',
                    description: '',
                    code:''
                }
                this.getDocumentList();
                this.alertService.showMessage(
                    'Success',
                    `Saved Documents Successfully `,
                    MessageSeverity.success
                );
                // this.closeMyModel('#documentDetails');
                $('#documentDetails').modal('hide');
            })
        }
        else {
            this.workOrderService.createDocuments(this.formData,this.isSubWorkOrder).subscribe(res => {
                this.documentForm = {
                    name: '',
                    memo: '',
                    description: '',
                    code: ''
                }
                this.isEditButton = false;
                this.getDocumentList();
                this.alertService.showMessage(
                  'Success',
                  `Updated Documents Successfully `,
                  MessageSeverity.success
                  );
                  this.formData = new FormData()
                  // this.fileUploadInput.clear();
                $('#documentDetails').modal('hide');
            })
        }
        this.disableSave = true;
    }

  
  getPageCount(totalNoofRecords, pageSize) {
    return Math.ceil(totalNoofRecords / pageSize)
    }

  pageIndexChange(event) {
    this.pageSize = event.rows;
  }

  downloadFileUpload(rowData) {
        console.log('Wo Doc');
        console.log(rowData);
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);

    }

  closeMyModel(dialogiueId) {
    $(dialogiueId).modal('hide');

    }

  docviewdblclick(data) {

    }

    editWODocument(rowdata) {
        this.isEditButton = true;
        this.documentForm = rowdata;
        console.log(" this.documentForm", this.documentForm);
        this.sourceViewforDocumentList = rowdata;
        // this.commonService.getDocumentAttachmentList(rowdata.attachmentId, rowdata.workFlowWorkOrderId, 36).subscribe(res => {
            // this.sourceViewforDocumentList = res;
            // console.log("res",res);
            //this.sourceViewforDocument = rowdata;
        // });
    }

    openWoDelete(content, row) {
        this.selectedRowForDelete = row;
        this.isDeleteMode = true;
        delete row.updatedBy;
        this.localCollection = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    deleteItemAndCloseModel() {
        let attachmentId = this.localCollection.attachmentId;
        if (attachmentId > 0) {
            this.workOrderService.deleteWorkOrderDocuments(attachmentId, this.userName).subscribe(res => {
                this.getDocumentList()
                this.alertService.showMessage(
                    'Success',
                    `Deleted  Documents Successfully `,
                    MessageSeverity.success
                );

            })



        }
        this.modal.close();
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.modal.close();
    }

     getAllDocumentTypeList() {

        this.commonService.smartDropDownList('DocumentType', 'DocumentTypeId', 'Name').subscribe(res => {
            this.documentTypeList = res;
        })
    }
}
