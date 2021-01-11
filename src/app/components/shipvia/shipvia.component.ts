import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';

import { ShipViaService } from '../../services/shipVia.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { Condition } from '../../models/condition.model';
declare var $ : any;
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { MasterCompany } from '../../models/mastercompany.model';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AuthService } from '../../services/auth.service';
// import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuditHistory } from '../../models/audithistory.model';
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { validateRecordExistsOrNot, getObjectById, getObjectByValue, selectedValueValidate, editValueAssignByCondition } from '../../generic/autocomplete';
import { ConfigurationService } from '../../services/configuration.service';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-shipvia',
    templateUrl: './shipvia.component.html',
    styleUrls: ['./shipvia.component.scss'],
    animations: [fadeInOut]
})
/** Actions component*/
export class ShipviaComponent implements OnInit{
    selectedActionName: any;
    actionamecolle: any[] = [];

    AuditDetails: SingleScreenAuditDetails[];
    auditHisory: AuditHistory[] = [];
    selectedColumns: any[];
    id: number;
    errorMessage: any;

    public isEditMode: boolean = false;

    private isDeleteMode: boolean = false;
    allComapnies: MasterCompany[];
    private isSaving: boolean;
    modal: NgbModalRef;
    selectedColumn: Condition[];
    formData = new FormData();
    existingRecordsResponse: Object;
    filteredBrands: any[];
    localCollection: any[] = [];
    Active: string = "Active";

    viewRowData: any;
    auditHistory: any = [];
    selectedRowforDelete: any;

    shipViaData: any = [];
    shipviaList: any = [];
    shipviaHeaders = [

        { field: 'name', header: 'Ship Via' },
        { field: 'memo', header: 'Memo' },

    ];
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    @ViewChild('dt',{static:false})
    private table: Table;
    selectedRecordForEdit: any;
    newShipvia =
        {
            name: "",
            masterCompanyId: 1,
            isActive: true,
            isDeleted: false,
            memo: ""
        };
    addNewShipvia = { ...this.newShipvia };
    currentstatus: string = 'Active';

    disableSaveForCondition: boolean;
    disableSaveForConditionMsg: boolean;

  
    currentStatusShipvia: string = 'Active';


    constructor(public router: Router, 
        private commonService: CommonService,
        private breadCrumb: SingleScreenBreadcrumbService,
         private authService: AuthService, private _fb: FormBuilder, private alertService: AlertService, private masterComapnyService: MasterComapnyService, private modalService: NgbModal, public shipViaService: ShipViaService, private dialog: MatDialog, private configurations: ConfigurationService) {


    }
    ngOnInit(): void {
        this.selectedColumns = this.shipviaHeaders;
        this.getShipViaList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-shipvia';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    }

    columnsChanges() {
        this.refreshList();
    }
    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }
    private getShipViaList() {
        this.shipViaService.getAllShipViaList().subscribe(res => {
             const respData = res[0];
            if(respData.length > 0) {
                this.shipViaData = respData;
                this.originalTableData=res[0];
                this.getListByStatus(this.status ? this.status :this.currentstatus)
                    // this.totalRecords = respData.length;
                // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            } else {
                this.totalRecords = 0;
                this.totalPages = 0;
            }
            
        });
    }

    // onBlur(event) {
    //     const value = event.target.value;
    //     this.disableSaveForConditionMsg = false;
    //     for (let i = 0; i < this.shipViaData.length; i++) {
    //         let name = this.shipViaData[i].name;
    //         let shippingViaId = this.shipViaData[i].shippingViaId;
    //         if (name.toLowerCase() == value.toLowerCase()) {
    //             if (!this.isEditMode  || this.isEditMode) {
    //                 this.disableSaveForConditionMsg = true;
    //                 this.disableSaveForCondition = true;
    //             }
    //             else if (shippingViaId != this.selectedRecordForEdit.shippingViaId) {
    //                 this.disableSaveForConditionMsg = true;
    //                 this.disableSaveForCondition = false;
    //             }
    //             else {
    //                 this.disableSaveForConditionMsg = false;
    //                 this.disableSaveForCondition = false;
    //             }
    //             break;
    //         }
    //     }
    // }

    resetShipviaForm() {
        this.isEditMode = false;
        this.disableSaveForCondition = false;
        this.disableSaveForConditionMsg = false;

        this.selectedRecordForEdit = undefined;
        this.addNewShipvia = { ...this.newShipvia };
    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.shipViaService.updateShipviaStatus(data.shippingViaId, data.isActive, this.userName).subscribe(() => {
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully`,
                MessageSeverity.success
            );

            this.getListByStatus(this.currentStatusShipvia);

        })
    }

    filtershipvia(event) {
        this.shipviaList = this.shipViaData;

        const shipViaData = [...this.shipViaData.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.shipviaList = shipViaData;
    }

    getmemo($event) {
        this.disableSaveForConditionMsg = false;
        this.disableSaveForCondition = false;
    };

    checkShipViaExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.shipViaData, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForConditionMsg = true;
            this.disableSaveForCondition = true;
        }
        else {
            this.disableSaveForConditionMsg = false;
            this.disableSaveForCondition = false;
        }
        // for (var i = 0; i < this.shipViaData.length; i++) {
        //     if (value.toLowerCase() == this.shipViaData[i].name.toLowerCase()) {
        //         this.disableSaveForConditionMsg = true;
        //         this.disableSaveForCondition = true;
        //     } else {
        //         this.disableSaveForConditionMsg = false;
        //         this.disableSaveForCondition = false;
        //     }
        // }
    }
    selectedShipvia(object) {
       
        const exists = selectedValueValidate('name', object, this.selectedRecordForEdit);
        this.disableSaveForCondition = !exists;
        this.disableSaveForConditionMsg = !exists;
    }


    refreshList() {
        this.table.reset();
        this.getShipViaList();
    }

    delete(rowData) {
        this.selectedRowforDelete = rowData;

    }
    deleteConformation(value) {
        if (value === 'Yes') {
            this.shipViaService.deleteShipvia(this.selectedRowforDelete.shippingViaId, this.userName).subscribe(() => {
                this.getShipViaList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Ship Via Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    viewSelectedRow(rowData) {
        console.log(rowData);
        this.viewRowData = rowData;
    }

    resetViewData() {
        this.viewRowData = undefined;
    }
    edit(rowData) {
        console.log(rowData);
        this.isEditMode = true;
        this.disableSaveForCondition = true;
        this.disableSaveForConditionMsg = false;
        this.addNewShipvia = { ...rowData, name: getObjectById('shippingViaId', rowData.shippingViaId, this.shipViaData) };
        this.selectedRecordForEdit = { ...this.addNewShipvia }
        console.log(this.addNewShipvia);
    }

    saveShipVia() {
        if (this.shipViaData.findIndex(x => x.name == this.addNewShipvia.name) > -1) {
            this.alertService.showMessage("Failed", "Ship Via  " + this.addNewShipvia.name + " already exists.", MessageSeverity.error);
            return;
        }
        const data = {
            ...this.addNewShipvia, createdBy: this.userName, updatedBy: this.userName,
            name: editValueAssignByCondition('name', this.addNewShipvia.name)
        };
        if (!this.isEditMode) {
            this.shipViaService.newAddShipvia(data).subscribe(() => {
                this.resetShipviaForm();
                this.getShipViaList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Ship Via Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.shipViaService.updateShipvia(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEditMode = false;
                this.resetShipviaForm();
                this.getShipViaList();
                this.alertService.showMessage(
                    'Success',
                    `Updated Ship Via Successfully`,
                    MessageSeverity.success
                );
            })
        }
    }

    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    getAuditHistoryById(rowData) {
        this.shipViaService.getShipViaAudit(rowData.shippingViaId).subscribe(res => {
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

    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        // this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.shipViaService.shipviaCustomUpload(this.formData).subscribe(res => {
                event.target.value = '';
                this.formData = new FormData();
                this.existingRecordsResponse = res;
                this.getShipViaList();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
            })
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
         this.shipViaData=newarry;
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
              this.shipViaData = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.shipViaData= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.shipViaData= newarry;
			}
        }
        this.totalRecords = this.shipViaData.length ;
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
            this.commonService.updatedeletedrecords('ShippingVia',
            'ShippingViaId',this.restorerecord.shippingViaId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getShipViaList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 
    
    getPageCount(totalNoofRecords, pageSize) {
		return Math.ceil(totalNoofRecords / pageSize)
    }
    
    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=ShipVia&fileName=shipvia.xlsx`;
        window.location.assign(url);
    }
}