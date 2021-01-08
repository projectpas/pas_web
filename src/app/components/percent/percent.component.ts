
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

import { MasterCompany } from '../../models/mastercompany.model';
import { PriorityService } from '../../services/priority.service';
import { Priority } from '../../models/priority.model';
import { AuditHistory } from '../../models/audithistory.model';
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";


import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";

import { CustomerService } from '../../services/customer.service';
import { Table } from '../../../../node_modules/primeng/table';
import { validateRecordExistsOrNot, getObjectByValue, selectedValueValidate, editValueAssignByCondition, getObjectById} from '../../generic/autocomplete';
import { PercentService } from '../../services/percent.service';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-percent',
    templateUrl: './percent.component.html',
    styleUrls: ['./percent.component.scss'],
    animations: [fadeInOut]
})
/** Actions component*/
export class PercentComponent implements OnInit {
    
    originalData: any=[];
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    headers = [
        { field: 'percentValue', header: 'Percent' }
    ]
    selectedColumns = this.headers;
    formData = new FormData()
    @ViewChild('dt',{static:false})
    modal: NgbModalRef;
    private table: Table;
    auditHistory: any[] = [];
    disableSaveGroupId: boolean = false;
    PortalList: any;
    disableSaveForDescription: boolean = false;
    disableSaveForDescriptionMsg: boolean = false;
    descriptionList: any;
    percentData: any;
    

    new = {
        percentValue: "",
        masterCompanyId: 1,
        isActive: true        
    }
    addNew = { ...this.new };
    currentstatus: string = 'Active';
    selectedRecordForEdit: any;
    viewRowData: any;
    selectedRowforDelete: any;
    existingRecordsResponse = []
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private authService: AuthService,
        private commonService: CommonService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder,
        private alertService: AlertService,
        public percentService: PercentService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {

    }


    ngOnInit(): void {
        this.getList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-percent';
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
    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }
    refreshList() {
        this.table.reset();

        // this.table.sortOrder = 0;
        // this.table.sortField = '';

        this.getList();
    }

    onBlur(event) {
        //console.log(event.target.value);
        //console.log(this.addNew);

        const value = event.target.value;
        this.disableSaveForDescriptionMsg = false;
        for (let i = 0; i < this.originalData.length; i++) {
            let percentValue = this.originalData[i].percentValue;
            let percenteId = this.originalData[i].percenteId;
            if (percentValue == value) {
                if (!this.isEdit) {
                    this.disableSaveForDescriptionMsg = true;
                    this.disableSaveForDescription = true;
                }
                else if (percenteId != this.selectedRecordForEdit.percenteId) {
                    this.disableSaveForDescriptionMsg = true;
                    this.disableSaveForDescription = false;
                }
                else {
                    this.disableSaveForDescriptionMsg = false;
                    this.disableSaveForDescription = false;
                }
                console.log('percentValue :', percentValue);
                break;
            }
        }

    }

    customExcelUpload(event) {
        // const file = event.target.files;

        // console.log(file);
        // if (file.length > 0) {

        //     this.formData.append('file', file[0])
        //     this.unitofmeasureService.UOMFileUpload(this.formData).subscribe(res => {
        //         event.target.value = '';

        //         this.formData = new FormData();
        //         this.existingRecordsResponse = res;
        //         this.getList();
        //         this.alertService.showMessage(
        //             'Success',
        //             `Successfully Uploaded  `,
        //             MessageSeverity.success
        //         );

        //     })
        // }

    }
    sampleExcelDownload() {
        // const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=UnitOfMeasure&fileName=uom.xlsx`;

        // window.location.assign(url);
    }

    getList() {
        this.percentService.getPercentages().subscribe(res => {

            this.originalTableData=res[0];
            this.getListByStatus(this.status ? this.status :this.currentstatus)
            // console.log(res)
            // const responseData = res[0];
            // this.originalData = responseData;
            // this.totalRecords = responseData.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
    }
    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);

        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }


    checkGroupDescriptionExists(field, value) {
         console.log(this.selectedRecordForEdit);

        const exists = validateRecordExistsOrNot(field, parseInt(value), this.originalData, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForDescription = true;
            this.disableSaveForDescriptionMsg = true;
        }
        else {
            this.disableSaveForDescription = false;
            this.disableSaveForDescriptionMsg = false;
        }

    }
    filterDescription(event) {
        this.descriptionList = this.originalData;
        const descriptionData = [...this.originalData.filter(x => {
            return x.percentValue.toString().toLowerCase().includes(event.query.toString().toLowerCase())
        })]
        this.descriptionList = descriptionData;
    }
    selectedDescription(object) {
       const exists = selectedValueValidate('percentValue', object, this.selectedRecordForEdit)

      this.disableSaveForDescription = !exists;
    }

    save() {
         const data = {
             ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
           
            percentValue: editValueAssignByCondition('percentValue', this.addNew.percentValue),

        };

        if (!this.isEdit) {
            data.percentValue = parseFloat(this.addNew.percentValue);         
             this.percentService.newPercentage(data).subscribe(() => {
                 this.resetForm();
                 this.getList();
                 this.alertService.showMessage(
                     'Success',
                     `Added  New Percent Successfully`,
                     MessageSeverity.success
                 );
             })
         } else {
             this.percentService.updatePercentage(data).subscribe(() => {
                 this.selectedRecordForEdit = undefined;
                 this.isEdit = false;
                 this.resetForm();
                 this.getList();
                 this.alertService.showMessage(
                     'Success',
                     `Updated Percent Successfully`,
                     MessageSeverity.success
                 );
             })
         }
    }

    resetForm() {
        this.isEdit = false;
        this.selectedRecordForEdit = undefined;
        this.addNew = { ...this.new };
    }


    edit(rowData) {
        console.log(rowData);
       
        this.isEdit = true;
        this.disableSaveGroupId = false;
        this.disableSaveForDescription = true;
        this.disableSaveForDescriptionMsg = false;

        this.addNew = {
            ...rowData, percentValue: getObjectById('percentId', rowData.percentId, this.originalData)
        };
       // alert(JSON.stringify(this.addNew.percentValue));
        this.selectedRecordForEdit = { ...this.addNew }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.percentService.updatePercentage(data).subscribe(() => {

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
            this.percentService.deletePercentage(this.selectedRowforDelete.percentId,
                this.selectedRowforDelete.userName).subscribe(() => {
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Percent Successfully  `,
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
         this.originalData=newarry;
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
              this.originalData = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.originalData= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.originalData= newarry;
			}
        }
        this.totalRecords = this.originalData.length ;
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
            this.commonService.updatedeletedrecords('[Percent]',
            'PercentId',this.restorerecord.percentId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }

    getAuditHistoryById(rowData) {
        this.percentService.historyAcion(rowData.percentId).subscribe(res => {
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
}