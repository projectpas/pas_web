import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
// import { VendorProcess1099Service } from '../../services/vendorprocess1099.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { validateRecordExistsOrNot, editValueAssignByCondition, getObjectById, selectedValueValidate, getObjectByValue } from '../../generic/autocomplete';
import { Table } from 'primeng/table';
import { ConfigurationService } from '../../services/configuration.service';
import { VendorService } from '../../services/vendor.service';
import { VendorProcess1099Service } from '../../services/vendorprocess1099.service';


import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-vendor-process1099',
    templateUrl: './vendor-process1099.component.html',
    styleUrls: ['./vendor-process1099.component.scss'],
    animations: [fadeInOut]
})
/** Vendor Classification component*/
export class VendorProcess1099Component implements OnInit {
    vendorProcess1099Data: any=[];
    viewRowData: any;
    selectedRowforDelete: any;
    newVendorProcess1099 =
        {
            master1099Id:0,
            description: "",
            masterCompanyId: 1,
            isActive: true,
            isDeleted: false,
            memo:""

          
        }
    addNewVendorProcess1099 = { ...this.newVendorProcess1099 };
    currentstatus: string = 'Active';
    disableSaveForVendorProcess1099: boolean = false;
    disableSave:boolean=false;
    vendorProcess1099List: any;
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    vendorProcess1099Headers = [
        { field: 'description', header: '1099 Name' },
        {field:'memo',header:'Memo'}
    
    ]
    selectedColumns = this.vendorProcess1099Headers;
    formData = new FormData()
    @ViewChild('dt',{static:false})
    modal: NgbModalRef;
    // private table: Table;
    auditHistory: any[] = [];
    existingRecordsResponse: Object;
    selectedRecordForEdit: any;
    disableSaveForShortName: boolean = false;
    shortNameList: any;

    constructor(private breadCrumb: SingleScreenBreadcrumbService,
         private configurations: ConfigurationService, 
         private authService: AuthService, 
         private alertService: AlertService,
         private modalService: NgbModal,
         private commonService: CommonService,
         private vendor1099Service: VendorProcess1099Service,
        private vendorservice: VendorService,
      
   ) {

    }

   
    ngOnInit(): void {
         this.getVendorProcess1099List();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-vendor-process1099';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

     columnsChanges() {
         this.refreshList();
     }
     getmemo() {
             this.disableSave = false;
      
     }

     refreshList() {
         //this.table.reset();
         this.getVendorProcess1099List();
     }
     dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }
   
    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('ModuleName', 'Master1099')
            this.formData.append('file', file[0])


            this.commonService.smartExcelFileUpload(this.formData).subscribe(res => {

                this.formData = new FormData();
                this.getVendorProcess1099List();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );

            })
        }

    }

     sampleExcelDownload() {
         const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=Master1099&fileName=Master1099.xlsx`;
         window.location.assign(url);
     }

    getVendorProcess1099List() {
        let companyId = 1;
         this.vendor1099Service.getAllVendorProcess1099Endpoint(companyId).subscribe(res => {
           
            //   const responseData = res;

            //  this.vendorProcess1099Data = responseData;

            //  this.originalTableData=res;
            //  this.getListByStatus(this.status ? this.status :this.currentstatus)

             if (res.length > 0) {

                  this.originalTableData=res;
             this.getListByStatus(this.status ? this.status :this.currentstatus)

                //  this.totalRecords = res.length;
                //  this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
             }
            //  console.log(this.vendorProcess1099Data);
            //  this.totalRecords = res.totalRecords;
            //  console.log(this.totalRecords)
            //  this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          })
     }

     changePage(event: { first: any; rows: number }) {
         console.log(event);
         const pageIndex = (event.first / event.rows);
         this.pageSize = event.rows;
         this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
     }

     //checkVendorProcess1099nExists(field, value) {
     //    const exists = validateRecordExistsOrNot(field, value, this.vendorProcess1099Data, this.selectedRecordForEdit);
     //    if (exists.length > 0) {
     //        this.disableSaveForVendorProcess1099 = true;
     //    }
     //    else {
     //        this.disableSaveForVendorProcess1099 = false;
     //    }

     //}
    checkVendorProcess1099nExists(value) {

        
        this.disableSaveForVendorProcess1099 = false;
      
        for (let i = 0; i < this.vendorProcess1099Data.length; i++) {

            if (this.addNewVendorProcess1099.description == this.vendorProcess1099Data[i].description || value == this.vendorProcess1099Data[i].description) {
                this.disableSaveForVendorProcess1099 = true;
               
                // this.disableSave = true;
              
              
                return;
            }

        }

    }
     filterVendorProcess1099(event) {
         this.vendorProcess1099List = this.vendorProcess1099Data;

         const vendorProcess1099Data = [...this.vendorProcess1099Data.filter(x => {
             return x.description.toLowerCase().includes(event.query.toLowerCase())
         })]
         this.vendorProcess1099List = vendorProcess1099Data;
     }

     selectedVendorProcess1099(object) {
         const exists = selectedValueValidate('description', object, this.selectedRecordForEdit)
         this.disableSaveForVendorProcess1099 = !exists;
        
     }

     saveVendoProcess1099() {
         const data = {
             ...this.addNewVendorProcess1099, createdBy: this.userName, updatedBy: this.userName,
             description: editValueAssignByCondition('description', this.addNewVendorProcess1099.description)
         };
         if (!this.isEdit) {
            
             this.vendor1099Service.getNewVendorProcess1099Endpoint(data).subscribe(() => {
                 this.resetVendorProcess1099Form();
                 this.getVendorProcess1099List();
                 this.alertService.showMessage(
                     'Success',
                     `Added  New Vendor Process1099 Successfully`,
                     MessageSeverity.success
                 );
             })
         } else {
             this.vendor1099Service.getNewVendorProcess1099Endpoint(data).subscribe(() => {
                 this.selectedRecordForEdit = undefined;
                 this.isEdit = false;
                 this.resetVendorProcess1099Form();
                 this.getVendorProcess1099List();
                 this.alertService.showMessage(
                     'Success',
                     `Updated Vendor Process1099 Successfully`,
                     MessageSeverity.success
                 );
             })
         }
     }

     resetVendorProcess1099Form() {
         this.isEdit = false;
         this.disableSaveForVendorProcess1099 = false;
         this.selectedRecordForEdit = undefined;
         this.addNewVendorProcess1099 = { ...this.newVendorProcess1099 };
     }


     editVendorProcess1099(rowData) {
         console.log(rowData);
         this.isEdit = true;
         this.disableSaveForVendorProcess1099 = false;
         this.disableSave=true;

         this.addNewVendorProcess1099 = {
             ...rowData, description: getObjectById('master1099Id', rowData.master1099Id, this.vendorProcess1099Data)
         };
         this.selectedRecordForEdit = { ...this.addNewVendorProcess1099 }

     }

     changeStatus(rowData) {
         console.log(rowData);
         const data = { ...rowData }
         this.vendor1099Service.getStatusVendorProcess1099Endpoint(data.master1099Id,data.updatedBy,data.isActive).subscribe(() => {
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
             this.vendor1099Service.getDeleteVendorProcess1099Endpoint(this.selectedRowforDelete.master1099Id, this.selectedRowforDelete.updatedBy).subscribe(() => {
                 this.getVendorProcess1099List();
                 this.alertService.showMessage(
                     'Success',
                     `Deleted Vendor Process1099 Successfully  `,
                     MessageSeverity.success
                 );
             })
         } else {
             this.selectedRowforDelete = undefined;
         }
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
         this.vendorProcess1099Data=newarry;
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
              this.vendorProcess1099Data = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.vendorProcess1099Data= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.vendorProcess1099Data= newarry;
			}
        }
        this.totalRecords = this.vendorProcess1099Data.length ;
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
            this.commonService.updatedeletedrecords('Master1099',
            'Master1099Id',this.restorerecord.master1099Id, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getVendorProcess1099List();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 
 

    getAuditHistoryById(master1099Id) {
        this.vendor1099Service.getAllVendorProcess1099Audit(master1099Id).subscribe(res => {
            this.auditHistory = res;
        })
    }
    showAuditPopup(audit): void {
      
        this.getAuditHistoryById(audit.master1099Id);
        //this.modal = this.modalService.open(template, { size: 'sm' });
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