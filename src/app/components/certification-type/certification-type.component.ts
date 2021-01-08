import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import * as $ from 'jquery';
import { MenuItem } from 'primeng/api';//bread crumb
 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterCompany } from '../../models/mastercompany.model';
import { GLAccountClassService } from '../../services/glaccountclass.service';

import { TableModule, Table } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { SelectButtonModule } from 'primeng/selectbutton'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'

import { AuditHistory } from '../../models/audithistory.model';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { CertificationtypeService } from '../../services/certificationtype.service';
import { CertificationType } from '../../models/certificationtype.model';
import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";
import { getObjectByValue, validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, getObjectById } from '../../generic/autocomplete';
import { ConfigurationService } from '../../services/configuration.service';



import { CommonService } from '../../services/common.service';

@Component({
	selector: 'app-certification-type',
	templateUrl: './certification-type.component.html',
	styleUrls: ['./certification-type.component.scss'],
	animations: [fadeInOut]
})
/** GlAccountClass component*/
export class CertificationTypeComponent implements OnInit {
	// disablesave: boolean;
	// selectedcertificationName: any;
	// auditHisory: any[];
	// @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
	// @ViewChild(MatSort,{static:false}) sort: MatSort;
	// certificationNamecolle: any[] = [];
	// cols: any[];
	// selectedColumns: any[];
	// displayedColumns = ['description', 'createdDate', 'companyName'];
	// dataSource: MatTableDataSource<any>;
	// allCertification: any[];
	// allComapnies: MasterCompany[] = [];
	// private isSaving: boolean;
	// public sourcecertificationtype: any = {}
	// private bodyText: string;
	// loadingIndicator: boolean;
	// closeResult: string;
	// title: string = "Create";
	// id: number;
	// display: boolean = false;
	// modelValue: boolean = false;
	// errorMessage: any;
	// modal: NgbModalRef;
	// /** Actions ctor */
	// private isEditMode: boolean = false;
	// private isDeleteMode: boolean = false;
	// description: string;
	// memo: string;
	// filteredBrands: any[];
	// localCollection: any[] = [];
	// selectedColumn: any[];
	// Active: string = "Active";
	// certificationViewFileds: any = {};
	// totalRecords: number;
	// AuditDetails: SingleScreenAuditDetails[];
	// //disablesave: boolean = false;
	// public certificationname: any = "";


	// constructor(private breadCrumb: SingleScreenBreadcrumbService, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public workFlowtService: CertificationtypeService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {
	// 	this.displayedColumns.push('action');
	// 	this.dataSource = new MatTableDataSource();
	// 	this.sourcecertificationtype = new CertificationType();
	// }
	// validateRecordExistsOrNot(field: string, currentInput: any, originalData: any) {
	// 	// console.log(field, currentInput, originalData)
	// 	if ((field !== '' || field !== undefined) && (currentInput !== '' || currentInput !== undefined) && (originalData !== undefined)) {
	// 		const data = originalData.filter(x => {
	// 			return x[field].toLowerCase() === currentInput.toLowerCase()
	// 		})
	// 		return data;
	// 	}
	// }
	// editValueAssignByCondition(field: any, value: any) {
	// 	console.log(field, value)
	// 	if ((value !== undefined) && (field !== '' || field !== undefined)) {

	// 		if (typeof (value) === 'string') {
	// 			return value
	// 		}
	// 		else {
	// 			return this.getValueFromObjectByKey(field, value)
	// 		}
	// 	}
	// }
	// getValueFromObjectByKey(field: string, object: any) {
	// 	console.log(field, object)
	// 	if ((field !== '' || field !== undefined) && (object !== undefined)) {
	// 		return object[field];
	// 	}
	// }



	originalData: any=[];
	isEdit: boolean = false;
	totalRecords: any;
	pageIndex: number = 0;
	pageSize: number = 10;
	totalPages: number;
	headers = [
		{ field: 'description', header: 'Certification Type' },
		{ field: 'memo', header: 'Memo' },
	]
	selectedColumns = this.headers;
	formData = new FormData()
	@ViewChild('dt',{static:false})

	private table: Table;
	auditHistory: any[] = [];
	disableSaveCertification: boolean = false;
	certificationList: any;

    disableSaveCertificationMsg:boolean = false;
	new = {
		description: "",
		masterCompanyId: 1,
		isActive: true,
		memo: "",
	}
	addNew = { ...this.new };
	currentstatus: string = 'Active';
	modal: NgbModalRef;
	selectedRecordForEdit: any;
	viewRowData: any;
	selectedRowforDelete: any;
	// originalData: any;
	existingRecordsResponse = []
	constructor(private breadCrumb: SingleScreenBreadcrumbService,
		private authService: AuthService,
        private commonService: CommonService,
		private modalService: NgbModal,
		private activeModal: NgbActiveModal,
		private _fb: FormBuilder,
		private alertService: AlertService,
		public certificationService: CertificationtypeService,
		private dialog: MatDialog,
		private masterComapnyService: MasterComapnyService,
		private configurations: ConfigurationService) {

	}

	OnInit() {

	}

	getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

	ngOnInit(): void {
		this.getList();
		// this.loadData();
		// this.cols = [
		//    // { field: 'itemGroupId', header: 'IGID' },

		//     // { field: 'createdBy', header: 'Created By' },
		//     // { field: 'updatedBy', header: 'Updated By' },
		//     //{ field: 'updatedDate', header: 'Updated Date' },
		//     //{ field: 'createdDate', header: 'Created Date' }
		// ];
		this.breadCrumb.currentUrl = '/singlepages/singlepages/app-certification-type';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
		// this.selectedColumns = this.cols;
	}

    getmemo($event) {
		
			this.disableSaveCertificationMsg = false;
            this.disableSaveCertification = false;
        
    }

	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}
	dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }
	// columnsChanges() {
	// 	this.refreshList();
	// }
	// refreshList() {
	// 	this.table.reset();

	// 	// this.table.sortOrder = 0;
	// 	// this.table.sortField = '';

	// 	this.getList();
	// }

	customExcelUpload() {
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
		const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=CertificationType&fileName=certificationType.xlsx`;

		window.location.assign(url);
	}

	getList() {
		this.certificationService.getWorkFlows().subscribe(res => {

			
			this.originalTableData=res[0];
			console.log(this.originalTableData);
            this.getListByStatus(this.status ? this.status :this.currentstatus)


			// const responseData = res[0];
			// // this.uomHeaders = responseData.columHeaders;
			// this.selectedColumns = res[0].columHeaders;
			//this.originalData = responseData;
			// this.totalRecords = responseData.length;
			// this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
		})
	}
	changePage(event: { first: any; rows: number }) {
		console.log(event);
		// this.pageIndex = pageIndex;
		this.pageSize = event.rows;
		this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
	}


	checkCertificationName(field, value) {
		const exists = validateRecordExistsOrNot(field, value, this.originalData, this.selectedRecordForEdit);
		console.log(exists);
		if (exists.length > 0) {
			this.disableSaveCertification = true;
            this.disableSaveCertificationMsg = true;
        }
		else {
			this.disableSaveCertification = false;
            this.disableSaveCertificationMsg = false;
        }

	}
	filterCertificationName(event) {
		this.certificationList = this.originalData;

		const certificationData = [...this.originalData.filter(x => {
			return x.description.toLowerCase().includes(event.query.toLowerCase())
		})]
		this.certificationList = certificationData;
	}
	selectedCertificationName(object) {
        const exists = selectedValueValidate('description', object, this.selectedRecordForEdit);
		this.disableSaveCertification = !exists;
        this.disableSaveCertificationMsg = !exists;
    }


    onBlur(event) {
        const value = event.target.value;
		this.disableSaveCertificationMsg = false;
        for (let i = 0; i < this.originalData.length; i++) {
            let description = this.originalData[i].description;
            let taxTypeId = this.originalData[i].taxTypeId;
            if (description.toLowerCase() == value.toLowerCase()) {
                if (!this.isEdit || this.isEdit) {
					this.disableSaveCertification = true;
					this.disableSaveCertificationMsg = true;
                }
                else if (taxTypeId != this.selectedRecordForEdit.taxTypeId) {
					this.disableSaveCertification = false;
					this.disableSaveCertificationMsg = true;
                }
                else {
					this.disableSaveCertification = false;
					this.disableSaveCertificationMsg = false;
                }
                console.log('description :', description);
                break;
            }
        }
    }


	save() {
		const data = {
			...this.addNew, createdBy: this.userName, updatedBy: this.userName,
			description: editValueAssignByCondition('description', this.addNew.description),
			// unitName: editValueAssignByCondition('description', this.addNew.unitName)
		};
		if (!this.isEdit) {
			this.certificationService.newCertificationtype(data).subscribe(() => {
				this.resetForm();
				this.getList();
				this.alertService.showMessage(
					'Success',
					`Added New Certification  Successfully  `,
					MessageSeverity.success
				);
			})
		} else {
			this.certificationService.updateCertificationtype(data).subscribe(() => {
				this.selectedRecordForEdit = undefined;
				this.isEdit = false;
				this.resetForm();
				this.getList();
				this.alertService.showMessage(
					'Success',
					`Updated  Certification Successfully  `,
					MessageSeverity.success
				);
			})
		}
	}

	resetForm() {
		this.isEdit = false;
        this.disableSaveCertificationMsg = false;
		this.selectedRecordForEdit = undefined;

		this.addNew = { ...this.new };
	}


	edit(rowData) {
		console.log(rowData);
		this.isEdit = true;
		this.disableSaveCertification = true;
        this.disableSaveCertificationMsg = false;
        this.addNew = {
			...rowData,
			description: getObjectById('employeeLicenseTypeId', rowData.employeeLicenseTypeId, this.originalData),
		};
		this.selectedRecordForEdit = { ...this.addNew }

	}

	changeStatus(rowData) {
		console.log(rowData);
		const data = { ...rowData }
		this.certificationService.updateCertificationtype(data).subscribe(() => {
			// this.getUOMList();
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
			this.certificationService.deleteCertificationtype
			(this.selectedRowforDelete.employeeLicenseTypeId).subscribe(() => {
				this.getList();
				this.alertService.showMessage(
					'Success',
					`Deleted  Successfully  `,
					MessageSeverity.success
				);
			})
		} else {
			this.selectedRowforDelete = undefined;
		}
	}

	// getAuditHistoryById(rowData) {
	//     this.itemGroupService.historyAcion(rowData.itemGroupId).subscribe(res => {
	//         this.auditHistory = res;
	//     })
	// }
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
            this.commonService.updatedeletedrecords('EmployeeLicenseType',
            'EmployeeLicenseTypeId',this.restorerecord.employeeLicenseTypeId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                // this.getList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
		}
		
}
