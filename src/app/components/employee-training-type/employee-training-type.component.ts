import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { fadeInOut } from '../../services/animations';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
// import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { getObjectByValue, validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, getObjectById } from '../../generic/autocomplete';
import { Table } from 'primeng/table';
import { ConfigurationService } from '../../services/configuration.service';
import { EmployeeTrainingTypeService } from '../../services/employee-training-type.service';
import {  listSearchFilterObjectCreation } from '../../generic/autocomplete';



import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';


@Component({
    selector: 'app-employee-training-type',
    templateUrl: './employee-training-type.component.html',
    styleUrls: ['./employee-training-type.component.scss'],
    animations: [fadeInOut]
})
/** employee-training-type component*/
export class EmployeeTrainingTypeComponent implements OnInit  {
    /** employee-training-type ctor */
    originalData: any[] = [];
    isEdit: boolean = false;
    localCollection: any[] = [];
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    headers = [
        { field: 'trainingType', header: ' Training Type ' },
       // { field: 'description', header: ' Description ' },
        { field: 'memo', header: 'Memo' },

    ]
    selectedColumns = this.headers;
    formData = new FormData()
    @ViewChild('dt',{static:false})
    modal: NgbModalRef;
    private table: Table;
    auditHistory: any[] = [];
    disableSaveEmpTrainingType: boolean = false;
    disableSaveDescriptrion: boolean = false;
    EmpTrainingTypeList: any;
    actionamecolle: any[] = [];
    selectedSite: any;

    new = {
        description: "",
        masterCompanyId: 1,
        isActive: true,
        memo: "",
        trainingType: ""
    }
    addNew = { ...this.new };
    currentstatus: string = 'Active';
    disableSaveForEdit: boolean = false;
    selectedRecordForEdit: any;
    viewRowData: any;
    selectedRowforDelete: any;
    // originalData: any;
    existingRecordsResponse: any;
    lazyLoadEventData: any;
    loadingIndicator: boolean;
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private authService: AuthService,
        private modalService: NgbModal,
        private commonService: CommonService,
        private alertService: AlertService,
        public employeeService: EmployeeTrainingTypeService,
        private configurations: ConfigurationService) {


    }

    ngOnInit(): void {
       // this.getList();
        // this.loadData();
        // this.cols = [
        //    // { field: 'itemGroupId', header: 'IGID' },

        //     // { field: 'createdBy', header: 'Created By' },
        //     // { field: 'updatedBy', header: 'Updated By' },
        //     //{ field: 'updatedDate', header: 'Updated Date' },
        //     //{ field: 'createdDate', header: 'Created Date' }
        // ];
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-employee-training-type';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        // this.selectedColumns = this.cols;
    }

    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }
    loadAllTryningData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.loadingIndicator = true;
        if (event.globalFilter == null) {
            event.globalFilter = ""
        }
        const PagingData = { ...event, filters: listSearchFilterObjectCreation(event.filters) }
        this.employeeService.getSearchData(PagingData).subscribe(
            results => {
                 this.originalTableData=results[0]['results'];
        this.getListByStatus(this.status ? this.status :this.currentstatus)

                //(JSON.stringify(results[0]['results']));
                // this.originalData = results[0]['results'];
                // this.totalRecords = results[0]['totalRecordsCount']
                // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            },
            
            error => this.onDataLoadFailed(error)
        );

    
    
    }

    private onDataLoadFailed(error: any) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;

	}
    constantFilters() {
        return {
            first: 0,
            rows: 10,
            sortField: undefined,
            sortOrder: 1,
            filters: "",
            globalFilter: "",
            multiSortMeta: undefined
        }
    }
    getmemo() {     
        this.disableSaveForEdit = false;    
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    columnsChanges() {
        this.refreshList();
    }
    refreshList() {
        this.table.reset();

        // this.table.sortOrder = 0;
        // this.table.sortField = '';

        this.getList();
    }

    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.employeeService.EmployeeExpertiseFileUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.existingRecordsResponse = res;

                var result = this.existingRecordsResponse[0].uploadStatus;
                if (result == "Duplicate") {

                    this.alertService.showMessage(
                        'Duplicate',
                        `Duplicate Records found `,
                        MessageSeverity.success
                    );
                }
                if (result === "Success") {
                    this.alertService.showMessage(
                        'Success',
                        `Success Records found `,
                        MessageSeverity.success
                    );
                }

                if (result === "Failed") {
                    this.alertService.showMessage(
                        'Failed',
                        `Failed `,
                        MessageSeverity.success
                    );
                }
                this.getList();
            })
        }

    }
    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=EmployeeTrainingType&fileName=employeeTrainingType.xlsx`;

        window.location.assign(url);
    }

    getList() {
        this.loadAllTryningData(this.constantFilters());

        
    }
    changePage(event: { first: any; rows: number }) {
        console.log(event);
        // this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }


    checkEmployeeTrainingTypeExists(event) {
        //const exists = validateRecordExistsOrNot('trainingType', event.target.value, this.originalData, this.selectedRecordForEdit);
        //console.log(exists);
        //if (exists.length > 0) {
        //    this.disableSaveEmpTrainingType = true;
        //    this.disableSaveDescriptrion = true;
        //}
        //else {
        //    this.disableSaveEmpTrainingType = false;
        //    this.disableSaveDescriptrion = false
        //}

        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedSite) {
                if (value == this.selectedSite.toLowerCase()) {
                    this.disableSaveEmpTrainingType = true;
          // this.disableSaveDescriptrion = true;
                }
                else {
                       this.disableSaveEmpTrainingType = false;
           // this.disableSaveDescriptrion = false

                }
            }

        }
    }
    filterEmployeeTrainingType(event) {
        //this.EmpTrainingTypeList = this.originalData;

        //const EmpTrainingTypeData = [...this.originalData.filter(x => {
        //    return x.trainingtype.toLowerCase().includes(event.query.toLowerCase())
        //})]
        //this.EmpTrainingTypeList = EmpTrainingTypeData;
        this.localCollection = [];
        for (let i = 0; i < this.originalData.length; i++) {
            let trainingType = this.originalData[i].trainingType;
            if (trainingType.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.actionamecolle.push([{
                    "employeeTrainingTypeId": this.originalData[i].employeeTrainingTypeId,
                    "trainingType": trainingType
                }]),
                    this.localCollection.push(trainingType)

            }
        }
    }
    selectedEmpTrainingType(event) {
        //const exists = selectedValueValidate('trainingType', object, this.selectedRecordForEdit)

        //this.disableSaveEmpTrainingType = !exists;
        //this.disableSaveDescriptrion = !exists;
        if (this.originalData) {

            for (let i = 0; i < this.actionamecolle.length; i++) {
                if (event == this.actionamecolle[i][0].trainingType) {
                    //this.sourceSite.name = this.allSites[i][0].name;
                   this.disableSaveEmpTrainingType = true;
                    this.disableSaveDescriptrion = true;

                    this.selectedSite = event;
                }

            }
        }
    }



    save() {
        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
            trainingType: editValueAssignByCondition('trainingType', this.addNew.trainingType),
            description: editValueAssignByCondition('description', this.addNew.description),
            // unitName: editValueAssignByCondition('description', this.addNew.unitName)
        };
        if (!this.isEdit) {
            this.employeeService.newAction(data).subscribe(() => {
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added Employee TrainingType  Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.employeeService.updateAction(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  Employee TrainingType  Successfully  `,
                    MessageSeverity.success
                );
            })
        }
    }

    resetForm() {
        this.isEdit = false;
        this.selectedRecordForEdit = undefined;
        this.disableSaveEmpTrainingType = false;
        this.disableSaveDescriptrion = false;
        this.addNew = { ...this.new };
    }


    edit(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveForEdit=true;
        this.disableSaveDescriptrion = true;
        this.addNew = {
            ...rowData,
           // trainingType: getObjectById('employeeTrainingTypeId', rowData.employeeTrainingTypeId, this.originalData),
           // description: getObjectById('employeeTrainingTypeId', rowData.employeeTrainingTypeId, this.originalData),
        };
        this.selectedRecordForEdit = { ...this.addNew }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.employeeService.updateAction(data).subscribe(() => {
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
            this.employeeService.deleteAcion(this.selectedRowforDelete.employeeTrainingTypeId,
                this.selectedRowforDelete.userName).
            subscribe(() => {
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

    getAuditHistoryById(rowData) {
        this.employeeService.historyAcion(rowData.employeeTrainingTypeId).subscribe(res => {
            this.auditHistory = res[0];
            console.log(this.auditHistory);
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
            this.commonService.updatedeletedrecords('EmployeeTrainingType',
            'EmployeeTrainingTypeId',this.restorerecord.employeeTrainingTypeId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
}