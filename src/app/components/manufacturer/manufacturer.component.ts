import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import * as $ from 'jquery';
import { MenuItem, LazyLoadEvent } from 'primeng/api';//bread crumb

import { MasterCompany } from '../../models/mastercompany.model';
import { ManufacturerService } from '../../services/manufacturer.service';
// import { DataTableModule } from 'primeng/datatable';
import { TableModule, Table } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { SelectButtonModule } from 'primeng/selectbutton'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'
// import { Action } from 'rxjs/scheduler/Action';
import { AuditHistory } from '../../models/audithistory.model';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { Manufacturer } from '../../models/manufacturer.model';
import { SingleScreenAuditDetails } from '../../models/single-screen-audit-details.model';
import { getObjectByValue, validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, listSearchFilterObjectCreation } from '../../generic/autocomplete';
import { ConfigurationService } from '../../services/configuration.service';


import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';



@Component({
    selector: 'app-manufacturer',
    templateUrl: './manufacturer.component.html',
    styleUrls: ['./manufacturer.component.scss'],
    animations: [fadeInOut]

})
/** manufacturer1 component*/
export class ManufacturerComponent implements OnInit {
    // manufacturerPaginationList: any[] = [];
    // totelPages: number;
    // manufacturer = [];
    // updatedByInputFieldValue: any;
    // createdByInputFieldValue: any;
    // nameInputFieldValue: any;
    // commentsInputFieldValue: any;
    // matvhMode: any;
    // field: any;
    // event: any;
    // auditHisory: any[];
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ViewChild(MatSort) sort: MatSort;
    // cols: any[];
    // selectedColumns: any[];
    // displayedColumns = ['name', 'comments', 'createdDate', 'companyName'];
    // dataSource: MatTableDataSource<any>;
    // allComapnies: MasterCompany[] = [];
    // private isSaving: boolean;
    // public sourcemanufacturer: any = {}
    // private bodyText: string;
    // loadingIndicator: boolean;
    // closeResult: string;
    // title: string = "Create";
    // id: number;
    // namecolle: any[] = [];
    // actionamecolle: any[] = [];
    // errorMessage: any;
    // modal: NgbModalRef;
    // /** Actions ctor */
    // private isEditMode: boolean = false;
    // private isDeleteMode: boolean = false;
    // filteredBrands: any[];
    // localCollection: any[] = [];
    // selectedColumn: any[];
    // Active: string = "Active";
    // allManufacturer: any[];
    // manufacturerId: any;
    // name: string = "";
    // sourceAction: any;
    // integrationName: any;
    // selectedManufacturer: any;
    // //disablesave: boolean=false;
    // allManufacturerInfo: any[] = [];
    // localmanufacturer: any[];
    // comments: any = " ";
    // createdBy: any = "";
    // updatedBy: any = "";
    // createdDate: any = "";
    // updatedDate: any = "";
    // manufactureViewField: any = {};
    // disableSave: boolean = false;
    // AuditDetails: SingleScreenAuditDetails[];

    // pageSearch: { query: any; field: any; };
    // first: number;
    // rows: number;
    // paginatorState: any;
    // manufacturerPagination: Manufacturer[];//added
    // totalRecords: number;
    // loading: boolean;
    // /** manufacturer1 ctor */
    // constructor(private breadCrumb: SingleScreenBreadcrumbService, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public workFlowtService: ManufacturerService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {

    // }
    // ngAfterViewInit(): void {

    // }
    // ngOnInit(): void {
    //     this.loadData();
    //     this.cols = [
    //         { field: 'name', header: 'Manufacturer Name' },
    //         { field: 'comments', header: 'Memo' },
    //         // { field: 'createdBy', header: 'Created By' },
    //         //{ field: 'updatedBy', header: 'Updated By' },
    //         //{ field: 'createdDate', header: 'Created Date' },
    //         //{ field: 'updatedDate', header: 'Updated Date' }
    //     ];
    //     this.selectedColumns = this.cols;
    //     this.breadCrumb.currentUrl = '/singlepages/singlepages/app-manufacturer';
    //     this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);

    // }
    // validateRecordExistsOrNot(field: string, currentInput: any, originalData: any) {
    //     console.log(field, currentInput, originalData)
    //     if ((field !== '' || field !== undefined) && (currentInput !== '' || currentInput !== undefined) && (originalData !== undefined)) {
    //         const data = originalData.filter(x => {
    //             return x[field].toLowerCase() === currentInput.toLowerCase()
    //         })
    //         return data;
    //     }
    // }
    // editValueAssignByCondition(field: any, value: any) {
    //     console.log(field, value)
    //     if ((value !== undefined) && (field !== '' || field !== undefined)) {

    //         if (typeof (value) === 'string') {
    //             return value
    //         }
    //         else {
    //             return this.getValueFromObjectByKey(field, value)
    //         }
    //     }
    // }
    // getValueFromObjectByKey(field: string, object: any) {
    //     console.log(field, object)
    //     if ((field !== '' || field !== undefined) && (object !== undefined)) {
    //         return object[field];
    //     }
    // }

    // private loadMasterCompanies() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;
    //     this.masterComapnyService.getMasterCompanies().subscribe(
    //         results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
    //         error => this.onDataLoadFailed(error)
    //     );

    // }
    // public applyFilter(filterValue: string) {
    //     this.dataSource.filter = filterValue;
    // }
    // private refresh() {
    //     this.applyFilter(this.dataSource.filter);
    // }

    // open(content) {
    //     this.disableSave = false;
    //     this.isEditMode = false;
    //     this.isDeleteMode = false;
    //     this.isSaving = true;
    //     this.loadMasterCompanies();
    //     this.sourcemanufacturer = new Manufacturer();
    //     this.sourcemanufacturer.name= "";
    //     this.sourcemanufacturer.isActive = true;
    //     this.modal = this.modalService.open(content, { size: 'sm' });
    //     this.modal.result.then(() => {
    //         console.log('When user closes');
    //     }, () => { console.log('Backdrop click') })
    // }

    // openDelete(content, row) {
    //     this.isEditMode = false;
    //     this.isDeleteMode = true;
    //     this.sourcemanufacturer = row;
    //     this.manufactureViewField.name = row.name;
    //     this.modal = this.modalService.open(content, { size: 'sm' });
    //     this.modal.result.then(() => {
    //         console.log('When user closes');
    //     }, () => { console.log('Backdrop click') })
    // }


    // ManufacturerHandler(field, value) {
    //     value = value.trim();
    //     const exists = this.validateRecordExistsOrNot(field, value, this.allManufacturerInfo);
    //     // console.log(exists);
    //     if (exists.length > 0) {
    //         this.disableSave = true;
    //     }
    //     else {
    //         this.disableSave = false;
    //     }
    // }

    // Manufacturerdescription(event) {
    //     //
    //     this.disableSave = true;
    // }
    // editItemAndCloseModel() {

    //     this.isSaving = true;
    //     if (this.isEditMode == false) {
    //         this.sourcemanufacturer.createdBy = this.userName;
    //         this.sourcemanufacturer.updatedBy = this.userName;
    //         this.sourcemanufacturer.masterCompanyId = 1;
    //         this.sourcemanufacturer.name = this.editValueAssignByCondition('name', this.sourcemanufacturer.name);
    //         this.workFlowtService.newManufacturer(this.sourcemanufacturer).subscribe(
    //             role => this.saveSuccessHelper(role),
    //             error => this.saveFailedHelper(error));
    //     }
    //     else {

    //         this.sourcemanufacturer.updatedBy = this.userName;
    //         this.sourcemanufacturer.name = this.editValueAssignByCondition('name', this.sourcemanufacturer.name);
    //         this.sourcemanufacturer.masterCompanyId = 1;
    //         this.workFlowtService.updateManufacturer(this.sourcemanufacturer).subscribe(
    //             response => this.saveCompleted(this.sourcemanufacturer),
    //             error => this.saveFailedHelper(error));
    //     }

    //     this.modal.close();
    // }
    // private saveSuccessHelper(role?: any) {
    //     this.isSaving = false;
    //     this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);

    //     this.loadData();

    // }
    // deleteItemAndCloseModel() {
    //     this.isSaving = true;
    //     this.sourcemanufacturer.updatedBy = this.userName;
    //     this.workFlowtService.deleteManufacturer(this.sourcemanufacturer.manufacturerId).subscribe(
    //         response => this.saveCompleted(this.sourcemanufacturer),
    //         error => this.saveFailedHelper(error));
    //     this.modal.close();
    // }
    // private onmanufacturerSuccessful(allWorkFlows: any[]) {

    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;
    //     this.totalRecords = allWorkFlows.length;
    //     this.allManufacturerInfo = allWorkFlows;
    //     //console.log(this.allActions);
    // }
    // filtermanufacturer(event) {
    //     this.localCollection = this.allManufacturerInfo;

    //     if (event.query !== undefined && event.query !== null) {
    //         const name = [...this.allManufacturerInfo.filter(x => {
    //             return x.name.toLowerCase().includes(event.query.toLowerCase())
    //         })]
    //         this.localCollection = name;
    //     }
    // }

    // openEdit(content, row) {
    //     this.isEditMode = true;
    //     this.isSaving = true;
    //     this.loadMasterCompanies();
    //     this.disableSave = false;
    //     this.sourcemanufacturer = {...row};
    //     this.sourcemanufacturer.name = getObjectByValue('name', row.name, this.allManufacturerInfo)
    //     //this.comments = this.sourcemanufacturer.comments;
    //     this.loadMasterCompanies();
    //     this.modal = this.modalService.open(content, { size: 'sm' });
    //     this.modal.result.then(() => {
    //         console.log('When user closes');
    //     }, () => { console.log('Backdrop click') })
    // }
    // openView(content, row) {
    //     this.sourcemanufacturer = row;
    //     this.manufactureViewField.name = row.name;
    //     this.manufactureViewField.comments = row.comments;
    //     this.createdBy = row.createdBy;
    //     this.updatedBy = row.updatedBy;
    //     this.createdDate = row.createdDate;
    //     this.updatedDate = row.updatedDate;
    //     this.loadMasterCompanies();
    //     this.modal = this.modalService.open(content, { size: 'sm' });
    //     this.modal.result.then(() => {
    //         console.log('When user closes');
    //     }, () => { console.log('Backdrop click') })
    // }

    // openHist(content, row) {
    //     this.sourcemanufacturer = row;
    //     this.workFlowtService.historyManufacturer(this.sourcemanufacturer.manufacturerId).subscribe(
    //         results => this.onHistoryLoadSuccessful(results[0], content),
    //         error => this.saveFailedHelper(error));
    // }
    // private saveFailedHelper(error: any) {
    //     this.isSaving = false;
    //     this.alertService.stopLoadingMessage();
    //     this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
    //     this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    // }
    // handleChange(rowData, e) {
    //     if (e.checked == false) {
    //         this.sourcemanufacturer = rowData;
    //         this.sourcemanufacturer.updatedBy = this.userName;
    //         this.Active = "In Active";
    //         this.sourcemanufacturer.isActive == false;
    //         this.loadMasterCompanies();
    //         this.sourcemanufacturer.masterCompanyId = 1;

    //         this.workFlowtService.updateManufacturer(this.sourcemanufacturer).subscribe(

    //             response => this.saveCompleted(this.sourcemanufacturer),
    //             error => this.saveFailedHelper(error));
    //     }
    //     else {
    //         this.sourcemanufacturer = rowData;
    //         this.sourcemanufacturer.updatedBy = this.userName;
    //         this.Active = "Active";
    //         this.sourcemanufacturer.isActive == true;
    //         this.loadMasterCompanies();
    //         this.sourcemanufacturer.masterCompanyId = 1;
    //         this.workFlowtService.updateManufacturer(this.sourcemanufacturer).subscribe(

    //             response => this.saveCompleted(this.sourcemanufacturer),
    //             error => this.saveFailedHelper(error));
    //         //alert(e);
    //     }

    // }

    // private loadData() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;
    //     this.workFlowtService.getWorkFlows().subscribe(
    //         results => this.onmanufacturerSuccessful(results[0]),
    //         error => this.onDataLoadFailed(error)
    //     );

    // }

    // private saveCompleted(user?: any) {
    //     this.isSaving = false;

    //     if (this.isDeleteMode == true) {
    //         this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
    //         this.isDeleteMode = false;
    //     }
    //     else {
    //         this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);

    //     }

    //     this.loadData();
    // }
    // private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {

    //     // debugger;
    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;

    //     this.auditHisory = auditHistory;


    //     this.modal = this.modalService.open(content, { size: 'lg' });

    //     this.modal.result.then(() => {
    //         console.log('When user closes');
    //     }, () => { console.log('Backdrop click') })


    // }
    // private onDataLoadFailed(error: any) {
    //     // alert(error);
    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;

    // }
    // private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
    //     // alert('success');
    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;
    //     this.allComapnies = allComapnies;

    // }
    // get userName(): string {
    //     return this.authService.currentUser ? this.authService.currentUser.userName : "";
    // }
    // dismissModel() {
    //     this.isDeleteMode = false;
    //     this.isEditMode = false;
    //     this.modal.close();
    // }

    // showAuditPopup(template, id): void {
    //     debugger;
    //     this.getManufacturerAuditDetails(id);
    //     this.modal = this.modalService.open(template, { size: 'sm' });
    // }

    // getManufacturerAuditDetails(Id: number): void {
    //     this.workFlowtService.getManufacturerAuditDetails(Id).subscribe(audits => {
    //         if (audits.length > 0) {
    //             this.AuditDetails = audits;
    //             this.AuditDetails[0].ColumnsToAvoid = ["manufacturerAuditId", "manufacturerId", "masterCompanyId", "createdBy", "createdDate", "updatedDate"];
    //         }
    //     });
    // }

    // updatePaginatorState() //need to pass this Object after update or Delete to get Server Side pagination
    // {
    //     this.paginatorState = {
    //         rows: this.rows,
    //         first: this.first
    //     }
    //     if (this.paginatorState) {
    //         this.loadManufacturer(this.paginatorState);
    //     }
    // }

    // loadManufacturer(event: LazyLoadEvent) //when page initilizes it will call this method
    // {
    //     this.loading = true;
    //     this.rows = event.rows;
    //     this.first = event.first;
    //     if (this.field)
    //     {
    //         this.manufacturer.push({
    //             Name: this.nameInputFieldValue,
    //             Comments: this.commentsInputFieldValue,
    //             CreatedBy: this.createdByInputFieldValue,
    //             UpdatedBy: this.updatedByInputFieldValue,
    //             first: this.first,
    //             page: 10,
    //             pageCount: 10,
    //             rows: this.rows,
    //             limit: 5
    //         })
    //         if (this.manufacturer) {
    //             this.workFlowtService.getServerPages(this.manufacturer[this.manufacturer.length - 1]).subscribe( //we are sending event details to service
    //                 pages => {
    //                     this.manufacturerPaginationList = pages;
    //                     this.manufacturerPagination = this.manufacturerPaginationList[0].manufacturerList;
    //                     this.totalRecords = this.manufacturerPaginationList[0].totalRecordsCount;
    //                     this.totelPages = Math.ceil(this.totalRecords / this.rows);
    //                 });
    //         }
    //         else {
    //         }
    //     }
    //     else {
    //         setTimeout(() => {
    //             if (this.allManufacturerInfo) {
    //                 this.workFlowtService.getServerPages(event).subscribe( //we are sending event details to service
    //                     pages => {
    //                         this.manufacturerPaginationList = pages;
    //                         this.manufacturerPagination = this.manufacturerPaginationList[0].manufacturerList;
    //                         this.totalRecords = this.manufacturerPaginationList[0].totalRecordsCount;
    //                         this.totelPages = Math.ceil(this.totalRecords / this.rows);
    //                     });
    //                 this.loading = false;
    //             }
    //         }, 1000);
    //     }

    // }

    // inputFiledFilter(event, filed, matchMode) {
    //     this.first = 0;
    //     this.event = event;
    //     this.field = filed;
    //     this.matvhMode = matchMode;

    //     if (filed == 'name') {
    //         this.nameInputFieldValue = event;
    //     }
    //     if (filed == 'comments') {
    //         this.commentsInputFieldValue = event;
    //     }
    //     if (filed == 'createdBy') {
    //         this.createdByInputFieldValue = event;
    //     }
    //     if (filed == 'updatedBy') {
    //         this.updatedByInputFieldValue = event;
    //     }
    //     this.manufacturer.push({
    //         Name: this.nameInputFieldValue,
    //         Comments: this.commentsInputFieldValue,
    //         CreatedBy: this.createdByInputFieldValue,
    //         UpdatedBy: this.updatedByInputFieldValue,
    //         first: this.first,
    //         page: 10,
    //         pageCount: 10,
    //         rows: this.rows,
    //         limit: 5
    //     })
    //     if (this.manufacturer) {
    //         this.workFlowtService.getServerPages(this.manufacturer[this.manufacturer.length - 1]).subscribe( //we are sending event details to service
    //             pages => {
    //                 this.manufacturerPaginationList = pages;
    //                 this.manufacturerPagination = this.manufacturerPaginationList[0].manufacturerList;
    //                 this.totalRecords = this.manufacturerPaginationList[0].totalRecordsCount;
    //                 this.totelPages = Math.ceil(this.totalRecords / this.rows);
    //             });
    //     }
    //     else {
    //     }
    // }

    //Fresh changes
    // uomHeaders: any;
    ManufactureData: any= [];
    // selectedColumns: any = [];
    viewRowData: any;
    // status: string = 'Active';
    selectedRowforDelete: any;
    newManufacturer =
        {
            name: "",           
            masterCompanyId: 1,
            isActive: true,
            isDelete: false,
            comments: "",
          
        }
    addnewManufacturer = { ...this.newManufacturer };
    disableSaveForUOM: boolean = false;
    ManufactList: any;
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    manufacturerHeader = [
        { field: 'name', header: 'Manfacturer Name' },
        { field: 'comments', header: 'Memo' },
    ]
    selectedColumns = this.manufacturerHeader;
    formData = new FormData()

    @ViewChild('dt',{static:false})
    modal: NgbModalRef;
    private table: Table;
    auditHistory: any[] = [];
    existingRecordsResponse: Object;
    selectedRecordForEdit: any;
    disableSaveForShortName: boolean = false;
    manufacturerList: any;
    lazyLoadEventData: any;
    loadingIndicator: boolean;

    // originalTableData: any=[];
    currentstatus: string = 'Active';

    isDeleted: Boolean = false;


    constructor(private breadCrumb: SingleScreenBreadcrumbService, private modalService: NgbModal, private commonService: CommonService,
         private configurations: ConfigurationService, private authService: AuthService, private alertService: AlertService, public manufacturerService: ManufacturerService) {


    }
    ngOnInit(): void {
       this.getManufacturerList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-manufacturer';
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
        this.getManufacturerList();
    }

    getmemo($event) {
            this.disableSaveForUOM = false;
    }
    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
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


    loadAllManufacturerData(event) {
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
        this.manufacturerService.getSearchData(PagingData).subscribe(
            results => {
                this.ManufactureData = results[0]['results'];
                this.totalRecords = results[0]['totalRecordsCount']
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            },
            error => this.onDataLoadFailed(error)
        );




    }
    private onDataLoadFailed(error: any) {


    }

    customExcelUpload(event) {
        const file = event.target.files;
        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.manufacturerService.ManufacturerFileUpload(this.formData).subscribe(res => {
                event.target.value = '';
                this.formData = new FormData();
                this.existingRecordsResponse = res;
                this.getManufacturerList();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
                //$('#duplicateRecords').modal('show');
                //document.getElementById('duplicateRecords').click();
            })
        }
    }

 
        

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=Manufacturer&fileName=manufacturer.xlsx`;

        window.location.assign(url);
    }


    onBlur(event) {
        const value = event.target.value;
        this.disableSaveForShortName = false;
        for (let i = 0; i < this.ManufactureData.length; i++) {
            let name = this.ManufactureData[i].name;
            let ManufactureId = this.ManufactureData[i].ManufactureId;
            if (name.toLowerCase() == value.toLowerCase()) {
                if (!this.isEdit || this.isEdit) {
                    this.disableSaveForShortName = true;
                }
                else if (ManufactureId != this.selectedRecordForEdit.ManufactureId) {
                    this.disableSaveForShortName = true;
                }
                else {
                    this.disableSaveForShortName = false;
                }
                break;
            }
        }

    }

    getManufacturerList() {
        this.manufacturerService.getWorkFlows().subscribe(res => {
            // console.log(res,'test1');
            // const responseData = res[0];
            // console.log(responseData,'test2')
            this.originalTableData=res[0];
            this.getListByStatus(this.status ? this.status :this.currentstatus)
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


    checkManufacturerExists(field, value) {
       const exists = validateRecordExistsOrNot(field, value, this.ManufactureData, this.selectedRecordForEdit);
   
        if (exists.length > 0) {
           
            this.disableSaveForShortName = true;
        }
        else {
            this.disableSaveForShortName = false;
        }

    }
    filterDescription(event) {
        this.ManufactList = this.ManufactureData;

        const ManufacturerVAlue = [
            ...this.ManufactureData.filter(x => {
                return x.name.toLowerCase().includes(event.query.toLowerCase());
            })
        ];
        this.ManufactList = ManufacturerVAlue;
    }
    selectedManufcaturer(object) {
       const exists = selectedValueValidate('name', object, this.selectedRecordForEdit);
            this.disableSaveForShortName = !exists
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

    
    saveManufacturer() {
       
        const data = {
            ...this.addnewManufacturer, createdBy: this.userName, updatedBy: this.userName,
            name: editValueAssignByCondition('name', this.addnewManufacturer.name),
        };
        if (!this.isEdit) {
            this.manufacturerService.newManufacturer(data).subscribe(() => {
                this.resetManufacuterForm();
                this.getManufacturerList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Manufacturer Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.manufacturerService.updateManufacturer(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetManufacuterForm();
                this.getManufacturerList();
                this.alertService.showMessage(
                    'Success',
                    `Updated   Manufacturer  Successfully  `,
                    MessageSeverity.success
                );
            })
        }
    }

    resetManufacuterForm() {
        this.isEdit = false;
        this.disableSaveForShortName = false;
        this.selectedRecordForEdit = undefined;
        this.addnewManufacturer = { ...this.newManufacturer };
    }


    editManufacturer(rowData) {
     
        console.log(rowData);
        
        this.isEdit = true;
   
        this.disableSaveForUOM = true;
        this.disableSaveForShortName = false;

        this.addnewManufacturer = {
            ...rowData, name: getObjectByValue('name', rowData.name, this.ManufactureData),
            
        };
        this.selectedRecordForEdit = { ...this.addnewManufacturer }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.manufacturerService.updateManufacturer(data).subscribe(() => {
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

            this.manufacturerService.deleteManufacturer(this.selectedRowforDelete.manufacturerId).subscribe(() => {
                this.getManufacturerList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Manufacturer Successfully  `,
                    MessageSeverity.success
                );
            })

        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.manufacturerService.getManufacturerAuditDetails(rowData.manufacturerId).subscribe(res => {
            console.log(res)
            this.auditHistory = res;
        });
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
         this.ManufactureData=newarry;
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
              this.ManufactureData = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.ManufactureData= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.ManufactureData= newarry;
			}
        }
        this.totalRecords = this.ManufactureData.length ;
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
            this.commonService.updatedeletedrecords('Manufacturer',
            'ManufacturerId',this.restorerecord.manufacturerId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadAllManufacturerData(this.lazyLoadEventData);
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 
      
 
    
}