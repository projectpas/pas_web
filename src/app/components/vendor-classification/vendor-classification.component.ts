import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { VendorClassificationService } from '../../services/vendorclassification.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { validateRecordExistsOrNot, editValueAssignByCondition, getObjectById, selectedValueValidate, getObjectByValue } from '../../generic/autocomplete';
import { Table } from 'primeng/table';
import { ConfigurationService } from '../../services/configuration.service';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-vendor-classification',
    templateUrl: './vendor-classification.component.html',
    styleUrls: ['./vendor-classification.component.scss'],
    animations: [fadeInOut]
})
/** Vendor Classification component*/
export class VendorClassificationComponent implements OnInit {
    vendorClassificationData: any;
    viewRowData: any;
    selectedRowforDelete: any;
    newVendorClassification =
        {
            classificationName: "",
            masterCompanyId: 1,
            isActive: true,
            isDeleted: false,
            memo: ""
        }
    addNewVendorClassification = { ...this.newVendorClassification };

    currentstatus: string = 'Active';
    disableSaveForVendorClassification: boolean = false;
    vendorClassificationList: any;
    disableSave:boolean=false;
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    vendorClassificationHeaders = [
        { field: 'classificationName', header: 'Classification Name' },
        { field: 'memo', header: 'Memo' },
    ]
    selectedColumns = this.vendorClassificationHeaders;
    formData = new FormData()
    @ViewChild('dt',{static:false})
    modal: NgbModalRef;
    private table: Table;
    auditHistory: any[] = [];
    existingRecordsResponse: Object;
    selectedRecordForEdit: any;
    disableSaveForShortName: boolean = false;
    shortNameList: any;

    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private modalService: NgbModal,
         private configurations: ConfigurationService, private authService: AuthService, private alertService: AlertService, private vendorclassificationService: VendorClassificationService, private commonService: CommonService) {

    }

    ngOnInit(): void {
        this.getVendorClassificationList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-vendor-classification';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    columnsChanges() {
        this.refreshList();
    }

    refreshList() {
        this.table.reset();
        this.getVendorClassificationList();
    }

    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }

    getChange() {
      

        this.disableSaveForVendorClassification = false;
             this.disableSave = false;
      
     }
    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('ModuleName', 'VendorClassification')
            this.formData.append('file', file[0])


            this.commonService.smartExcelFileUpload(this.formData).subscribe(res => {

                this.formData = new FormData();
                this.getVendorClassificationList();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );

            })
        }

    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=VendorClassification&fileName=VendorClassification.xlsx`;
        window.location.assign(url);
    }

    getVendorClassificationList() {
        this.vendorclassificationService.getAllVendorClassificationList().subscribe(res => {

            this.originalTableData=res[0].columnData;
            this.getListByStatus(this.status ? this.status :this.currentstatus)
            // const responseData = res[0];
            // this.vendorClassificationData = responseData.columnData;
            // this.totalRecords = responseData.totalRecords;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
    }

    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    checkVendorClassificationExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.vendorClassificationData, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForVendorClassification = true;
  this.disableSave=true;  
        }
        else {
            this.disableSaveForVendorClassification = false;
        this.disableSave=false;
        }

    }

    filterVendorClassifications(event) {
        this.vendorClassificationList = this.vendorClassificationData;

        const vendorClassificationData = [...this.vendorClassificationData.filter(x => {
            return x.classificationName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.vendorClassificationList = vendorClassificationData;
    }

    selectedVendorClassification(object) {
        const exists = selectedValueValidate('classificationName', object, this.selectedRecordForEdit)
        this.disableSaveForVendorClassification = !exists;
        this.disableSave=!exists;
    }

    saveVendorClassification() {
        const data = {
            ...this.addNewVendorClassification, createdBy: this.userName, updatedBy: this.userName,
            classificationName: editValueAssignByCondition('classificationName', this.addNewVendorClassification.classificationName)
        };
        if (!this.isEdit) {
            this.vendorclassificationService.newVendorClassification(data).subscribe(() => {
                this.resetVendorClassificationForm();
                this.getVendorClassificationList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Vendor Classification Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.vendorclassificationService.updateVendorClassification(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetVendorClassificationForm();
                this.getVendorClassificationList();
                this.alertService.showMessage(
                    'Success',
                    `Updated Vendor Classification Successfully`,
                    MessageSeverity.success
                );
            })
        }
    }

    resetVendorClassificationForm() {
        this.isEdit = false;
        this.disableSaveForVendorClassification = false;
        this.selectedRecordForEdit = undefined;
        this.addNewVendorClassification = { ...this.newVendorClassification };
    }


    editVendorClassification(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveForVendorClassification = false;
        this.disableSave=true;

        this.addNewVendorClassification = {
            ...rowData, classificationName: getObjectById('vendorClassificationId', rowData.vendorClassificationId, this.vendorClassificationData)
        };
        this.selectedRecordForEdit = { ...this.addNewVendorClassification }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.vendorclassificationService.updateVendorClassification(data).subscribe(() => {
            // this.getvendorClassificationList();
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully  `,
                MessageSeverity.success
            );
        })

    }

    viewSelectedRow(rowData) {
        console.log(rowData);
        this.viewRowData = rowData;
    }

    resetViewData() {
        this.viewRowData = undefined;
    }

    delete(rowData) {
        this.selectedRowforDelete = rowData;

    }

    deleteConformation(value) {
        if (value === 'Yes') {
            this.vendorclassificationService.deleteVendorClassification(this.selectedRowforDelete.vendorClassificationId).subscribe(() => {
                this.getVendorClassificationList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Vendor Classification Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.vendorclassificationService.getVendorClassificationAudit(rowData.vendorClassificationId).subscribe(res => {
            this.auditHistory = res;
        })
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
    getPageCount(totalNoofRecords, pageSize) {		
		return Math.ceil(totalNoofRecords / pageSize)
    }
    
    getDeleteListByStatus(value){
        if(value){
            this.currentDeletedstatus=true;
        }else{
            this.currentDeletedstatus=false;
        }
        this.getListByStatus(this.status ? this.status : this.currentstatus)
            }
            
	originalTableData:any=[];
    currentDeletedstatus:boolean=false;
    status:any="Active";
    getListByStatus(status) {
        const newarry=[];
        if(status=='Active'){ 
            this.status=status;
			if(this.currentDeletedstatus==false){
			   this.originalTableData.forEach(element => {
				if(element.isActive ==true && element.isDeleted ==false){
				newarry.push(element);
				}
			   });
	       }else{
		        this.originalTableData.forEach(element => {
				if(element.isActive ==true && element.isDeleted ==true){
			     newarry.push(element);
				}
			   });
	   }
         this.vendorClassificationData=newarry;
        }else if(status=='InActive' ){
            this.status=status;
			if(this.currentDeletedstatus==false){
				this.originalTableData.forEach(element => {
				 if(element.isActive ==false && element.isDeleted ==false){
				 newarry.push(element);
				 }
				});
			}else{
				 this.originalTableData.forEach(element => {
				 if(element.isActive ==false && element.isDeleted ==true){
				  newarry.push(element);
				 }
				});
		}
              this.vendorClassificationData = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.vendorClassificationData= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.vendorClassificationData= newarry;
			}
        }
        this.totalRecords = this.vendorClassificationData.length ;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
		}
 
        restore(content, rowData) {
            this.restorerecord = rowData;
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
            this.modal.result.then(() => {
                console.log('When user closes');
            }, () => { console.log('Backdrop click') })
        }
        restorerecord:any={}
        restoreRecord(){  
            this.commonService.updatedeletedrecords('VendorClassification',
            'VendorClassificationId',this.restorerecord.vendorClassificationId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getVendorClassificationList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }

}