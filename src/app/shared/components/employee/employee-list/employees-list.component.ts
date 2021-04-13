import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fadeInOut } from '../../../../services/animations';
import { AlertService, DialogType, MessageSeverity } from '../../../../services/alert.service';
import { Action } from '../../../../models/action.model';
import { AuditHistory } from '../../../../models/audithistory.model';
import { AuthService } from '../../../../services/auth.service';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MasterCompany } from '../../../../models/mastercompany.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs'
import { CheckboxModule } from 'primeng/checkbox';
import { EmployeeService } from '../../../../services/employee.service';
import { Router } from '@angular/router';
import { AppTranslationService } from '../../../../services/app-translation.service';
//import $ from "jquery";
import * as moment from 'moment';
import { CommonService } from '../../../../services/common.service';
import { getValueFromArrayOfObjectById, formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { ConfigurationService } from '../../../../services/configuration.service';
import { CurrencyService } from '../../../../services/currency.service';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { listSearchFilterObjectCreation } from '../../../../generic/autocomplete';
import { ThrowStmt } from '@angular/compiler';
import { DatePipe } from '@angular/common';
declare let $ : any;



@Component({
    selector: 'app-employees-list',
    templateUrl: './employees-list.component.html',
    styleUrls: ['./employees-list.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe],
})
/** employees-list component*/
export class EmployeesListComponent implements OnInit {
    
    activeIndex: number;
    private isSaving: boolean;
    isDeleteMode: boolean = false;
    private isEditMode: boolean = false;
    viewactive: boolean = false;
    viewinactive: boolean = true;
    isSpinnerVisible: boolean = false;
    loadingIndicator: any;
    exportData: any = [];
    employeeId: any;
    allCapesInfo: any = [];
    currentEmployee: any;
    viewempDetails: any = {};
    //viewempDetails: any = {};
    viewTraining: any = {};
    viewGeneralDetails: any = {};
    allEmployeelist: any = [];
    EmployeeViewlist: any = {};
    EmployeeEditlist: any = {};
    public originationCounty: any;
    public nationalCountry: any;
    public companyCode: any;
    public businessUnit: any;
    public departmentCode: any;
    public divisionCode: any;
    public empExpertisedescription: any;
    public jobTypeName: any;
    public jobTitleName: any;
    public employeeLeaveType: any;
    public deleteEmployeeId: any;
    totalRecords: any;
    totalPages: number;
    pageSize: number = 10;
    public departname: any;
    public divsioname: any;
    public biuName: any;
    public compnayname: any;
    public shiftId: any;
    public supervisiorname: any;
    public empTrainningInfo: any;
    public leaveMapArray: any;
    public shiftMapArray: any = [];
    //public auditHistory: AuditHistory[] = [];
    auditHistory: any = [];
    getAllFrequencyTrainingInfodrpData;
    frequencyOfTrainingData: any;
    allEmployeeTrainingDocumentsList: any = [];
    allCurrencyData: any[] = [];
    allShiftData: any[] = [];
    selectedShiftData: any;
    currencyName: any;
    getAllAllStationInfodrpData;
    stationName: any;
    empMemo: any;
    empShiftType: any;
    empLeaveType: any;
    manufacturerData: any;
    allCustomerFinanceDocumentsListOriginal: any = [];
    pageIndex: number = 0;
    private onDestroy$: Subject<void> = new Subject<void>();
    showTitle = '';
    headerManagementStructureWithName: any = {};
    currenDocDeletedstatus: boolean = false;
    selectedOnly: boolean = false;
    targetData: any;
    moduleName='Employee'
    headers = [
        { field: 'firstName', header: 'First Name' },
        { field: 'lastName', header: 'Last Name' },
        { field: 'employeeCode', header: 'Emp ID' },
        // { field: 'email', header: 'Email' },
        //{ field: 'businessUnitId', header: 'BU' },
        //{ field: 'divisionId', header: 'Division' },
        //{ field: 'departmentId', header: 'Department' },
        { field: 'jobtitle', header: 'Job Title' },
        { field: 'employeeExpertise', header: 'Emp Expertise' },
        //{ field: 'jobtype', header: 'Job Type'},
        { field: 'startDate', header: 'Start Date' },
        { field: 'company', header: 'Company' },
        { field: 'shopEmployee', header: 'Shop Employee',width:"70px" },
        { field: 'paytype', header: 'Pay Type' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'CreatedBy',width:"90px" },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'UpdatedBy',width:"90px" },


    ];
    customerDocumentsColumns = [

        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'docMemo', header: 'Memo' },
        { field: 'fileName', header: 'File Name' },
        { field: 'fileSize', header: 'File Size' ,width:"65px"},

        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedBy', header: 'Updated By' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'updatedDate', header: 'Updated Date' },


    ];


    selectedColumnsDoc = this.customerDocumentsColumns;
    selectedColumns = this.headers;
    sourceViewforDocumentList: any;
    allDocumentListOriginal: any;
    deleteEmployeeName: any;
    restoreRecordData: any;
    table3: any;
    
    ngOnInit(): void {
        this.activeIndex = 0;
        this.empService.currentUrl = '/employeesmodule/employeepages/app-employees-list';
        this.empService.bredcrumbObj.next(this.empService.currentUrl);
        this.empService.ShowPtab = false;
        this.empService.alertObj.next(this.empService.ShowPtab);
        // this.getAllFrequencyTrainingData();
        // this.loadCurrencyData();
        // this.getAllStationData();
        // this.getAllAircraftManfacturer();
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    get loginEmployeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }

    allEmployeesList: any[];
    dataSource: MatTableDataSource<any>;
    selectedColumn: any[];
    public sourceEmployee: any = {};
    Active: string = "Active";

    cols: any[];
    modal: NgbModalRef;
    employeeRolesList: object[];
    employeeRoleLabel = [];
    allManagemtninfo: any[];
    tagNameCollection: any[] = [];
    selectedRoleNames: string = '';
    gridData = [];
    empDetailsData: any;
    supervisorName: any;
    empCreatedBy: any;
    empCreatedDate: any;
    aircraftModelName: any;
    lazyLoadEventDataInput: any;
    status: string = 'Active';
    lazyLoadEventData: any;
    filterText: boolean = false;
    @Input() isEnablePOList: boolean;
    currentstatus: string = 'Active';
    viewEmpID: number = 0;
    data: any;
    viewType: any = 'mpn';
    empshifttype: any = '';

    supervisorname: any = '';
    empcreatedby: any = '';

    compmanagmentLegalEntityName: any = '';
    biumanagmentLegalEntityName: any = '';
    divmanagmentLegalEntityName: any = '';
    managmentLegalEntityName: any = '';
    originatingCountryName: any = '';
    shiftNames: any = '';
    leavetypenames: any = '';
    empcreatedDate: any = '';
    empExpertiseName: any = '';
    empleaveType: any = '';
    empstatus: any = '';
    durationType: any = '';
    durationTypelist: any = [
        { id: 1, type: 'Days' },
        { id: 2, type: 'Weeks' },
        { id: 3, type: 'Months' },
        { id: 3, type: 'Years' }
    ]




    sourceViewforDocumentAudit: any = [];
    documentTableColumns: any[] = [
        { field: "docName", header: "Name" },
        { field: "docDescription", header: "Description" },
        { field: "docMemo", header: "Memo" },

        { field: "fileName", header: "File Name" },
        { field: "fileSize", header: "File Size" },

        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'CreatedBy' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'UpdatedBy' },
        { field: 'download', header: 'Actions' },
        // { field: 'delete', header: 'Delete' },
    ];
    currentDeletedstatus: boolean = false;

    /** employees-list ctor */
    constructor(private modalService: NgbModal,
        private translationService: AppTranslationService,
        private empService: EmployeeService,
        private router: Router,
        private authService: AuthService,
        private datePipe: DatePipe,
        private alertService: AlertService, public commonService: CommonService, private configurations: ConfigurationService, public currencyService: CurrencyService, private legalEntityService: LegalEntityService, private itemser: ItemMasterService) {
        this.dataSource = new MatTableDataSource();
        this.translationService.closeCmpny = false;
        this.activeIndex = 0;
        this.empService.listCollection = null;

    }
    private onDataLoadSuccessful(allWorkFlows: any[]) {
        //this.alertService.stopLoadingMessage();
        //this.loadingIndicator = false;
        this.totalRecords = allWorkFlows.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.dataSource.data = allWorkFlows;
        this.allEmployeesList = allWorkFlows;
        this.isSpinnerVisible = false;
    }

    closeDeleteModal() {
        $("#downloadConfirmation").modal("hide");
    }
    private onemployeeDataLoadSuccessful(allWorkFlows: any) {

        if (allWorkFlows[0].employeeLeaveTypeMapping != null) {
            this.employeeLeaveType = allWorkFlows[0].employeeLeaveTypeMapping.employeeLeaveTypeId;
            this.shiftId = allWorkFlows[0].employeeShiftMapping.shiftId;
            this.leaveMapArray = allWorkFlows[0].employeeLeaveTypeMapping;
            this.shiftMapArray = allWorkFlows[0].employeeShiftMapping;

            // if(this.shiftMapArray.length>0)
            // {
            //     console.log(this.shiftMapArray);

            //     for(var i=0; i< this.shiftMapArray; i++){

            //         this.selectedShiftData += getValueFromArrayOfObjectById('description', 'shiftId', this.shiftMapArray[i].shiftId , this.allCurrencyData); 
            //     }

            // }



        }

        //this.alertService.stopLoadingMessage();
        //this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.allEmployeelist = allWorkFlows[0];
        if (this.allEmployeelist.employeeTraining[0] && this.allEmployeelist.employeeTraining[0].durationTypeId)
            this.durationType = getValueFromArrayOfObjectById('type', 'id', this.allEmployeelist.employeeTraining[0].durationTypeId, this.durationTypelist);
        else
            this.durationType = ''

        this.allEmployeelist.hourlyPay = this.allEmployeelist.hourlyPay ? formatNumberAsGlobalSettingsModule(this.allEmployeelist.hourlyPay, 2) : '0';
        //this.allEmployeelist.employeeTraining[0].cost= this.allEmployeelist.employeeTraining[0].cost ? formatNumberAsGlobalSettingsModule(this.allEmployeelist.employeeTraining[0].cost, 2) : '0',


        //if (this.allEmployeelist.employeetraining != null && this.allEmployeelist.employeetrainginfo.aircraftmodelid > 0) {
        //    this.aircraftmodelname = getvaluefromarrayofobjectbyid('label', 'value', this.allEmployeelist.employeetrainginfo.aircraftmodelid, this.manufacturerData)

        //}
        //else {
        //    this.aircraftModelName = "";
        //}
        // this.EmployeeViewlist = allWorkFlows[0];

        this.isSpinnerVisible = false;

    }


    public navigateTogeneralInfo() {
        this.empService.isEditMode = false;
        this.empService.isDisbaleTabs = false;
        this.empService.ShowPtab = true;
        this.router.navigateByUrl('/employeesmodule/employeepages/app-employee-general-information');
        this.empService.currentUrl = '/employeesmodule/employeepages/app-employee-general-information';
        this.empService.alertObj.next(this.empService.ShowPtab);
        this.empService.bredcrumbObj.next(this.empService.currentUrl);
        this.empService.listCollection = undefined;

    }

    getManagementStructureNameandCodes(id) {
        this.commonService.getManagementStructureNameandCodes(id).subscribe(res => {
            if (res.Level1) {
                this.headerManagementStructureWithName.level1 = res.Level1;
            } else {
                this.headerManagementStructureWithName.level1 = '-';
            }
            if (res.Level2) {
                this.headerManagementStructureWithName.level2 = res.Level2;
            } else {
                this.headerManagementStructureWithName.level2 = '-';
            }
            if (res.Level3) {
                this.headerManagementStructureWithName.level3 = res.Level3;
            } else {
                this.headerManagementStructureWithName.level3 = '-';
            }
            if (res.Level4) {
                this.headerManagementStructureWithName.level4 = res.Level4;
            } else {
                this.headerManagementStructureWithName.level4 = '-';
            }
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
        });
    }

    openEdit(row) {
        //for tabs enable in editmode
        this.empService.isDisbaleTabs = true;
        //this.isEditMode = true;
        this.empService.isEditMode = true;
        //this.isSaving = true;
        //this.sourceVendor = row;
        //this.loadMasterCompanies();
        this.empService.employeeId
        this.empService.listCollection = row;
        // this.actionName = this.sourceVendor.description;
        // this.router.navigateByUrl('/employeesmodule/employeepages/app-employee-general-information');
        const { employeeId } = row;
        this.empService.employeeId = employeeId;
        this.router.navigateByUrl(`employeesmodule/employeepages/app-employee-general-information-edit/${employeeId}`);
    }

    private onDataLoadFailed(error: any) {
        this.isSpinnerVisible = false;
        // alert(error);
        //this.alertService.stopLoadingMessage();
        //this.loadingIndicator = false;

    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    //deleteItemAndCloseModel(rowData) {
    //	this.isSaving = true;
    //	this.sourceEmployee = rowData;
    //	this.sourceEmployee.updatedBy = this.userName;
    //	this.sourceEmployee.isActive = false;
    //	this.sourceEmployee.employeeId = rowData.employeeId;
    //	this.empService.updateListstatus(this.sourceEmployee).subscribe(
    //		response => this.saveCompleted(this.sourceEmployee),
    //		error => this.saveFailedHelper(error));

    //}

    // Not in use
    private loadData() {
        this.empService.getEmployeeList().subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    activeStatus(value) {

        if (value && this.currentDeletedstatus == true) {
            this.filterText = true;
        } else {
            this.filterText = false;
        }
    }
    loadEmployeePages(event) {
        this.isSpinnerVisible = true;
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.filters = {
            ...this.lazyLoadEventDataInput.filters,
            status: this.status ? this.status : 'Active',
        }
        if (this.filterText == true) {
            this.lazyLoadEventDataInput.filters.isDeleted = true;
        } else {
            this.lazyLoadEventDataInput.filters.isDeleted = false;
        }
        this.getList(this.lazyLoadEventDataInput);
    }

    //global search 




    //                this.lazyLoadEventDataInput.filters = {
    //    purchaseOrderNo: this.purchaseOrderNoInput,
    //    openDate: this.openDateInput,
    //    closedDate: this.closedDateInput,
    //    vendorName: this.vendorNameInput,
    //    vendorCode: this.vendorCodeInput,
    //    status: this.statusIdInput ? this.statusIdInput : this.currentStatusPO,
    //    requestedBy: this.requestedByInput,
    //    approvedBy: this.approvedByInput,
    //    vendorId: this.vendorId ? this.vendorId : null
    //}

    //employee list status radio buttons 
    geEmpListByStatus(status) {
        this.isSpinnerVisible = true;
        const pageIndex = 0;
        this.viewactive = !this.viewactive;
        this.viewinactive = !this.viewinactive;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.status = status;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData);
    }
    getDeleteListByStatus(value) {
        this.isSpinnerVisible = true;
        this.currentDeletedstatus = true;
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.status = status;
        if (value == true) {
            //this.currentstatus="ALL";
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        } else {
            this.currentDeletedstatus = false;
            //this.currentstatus="ALL"
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        }
    }
    restore(content, rowData) {
        this.restoreRecordData = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    restoreRecord() {
        this.commonService.updatedeletedrecords('Employee', 'EmployeeId', this.restoreRecordData.employeeId).subscribe(res => {
            this.modal.close();
            this.getDeleteListByStatus(true)
            this.alertService.showMessage("Success", `Employee Restored Successfully.`, MessageSeverity.success);
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
        });
    }
    globalSearch(value) {
        this.isSpinnerVisible = true;
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.status = this.currentstatus;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData);
    }

    //ge pagination list function
    getList(data) {
        this.isSpinnerVisible = true;
        //this.empService.getAllEmployeeList(data).subscribe(res => {
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete
        data.filters.loginEmployeeId = this.loginEmployeeId;
        data.filters.masterCompanyId = this.currentUserMasterCompanyId;         
        const Data = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.empService.getAllEmployeeList(Data).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.data = res[0]['results'];
            this.allEmployeesList = this.data;
            this.allCapesInfo = this.data;

            if (this.allEmployeesList.length > 0) {
                this.totalRecords = res[0]['totalRecordsCount'];
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            } else {
                this.allEmployeesList = [];
                this.totalRecords = 0;
                this.totalPages = 0;
            }
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;            
        });
    }

    exportCSV(dt) {
        this.isSpinnerVisible = true;
        this.exportData = [];
        const isdelete = this.currentDeletedstatus ? true : false;
        let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "loginEmployeeId": this.loginEmployeeId, "masterCompanyId": this.currentUserMasterCompanyId,"status": this.currentstatus, "isDeleted": isdelete }, "globalFilter": "" }
        let filters = Object.keys(dt.filters);
        filters.forEach(x => {
            PagingData.filters[x] = dt.filters[x].value;
        });
        this.empService.getAllEmployeeList(PagingData).pipe(takeUntil(this.onDestroy$)).subscribe(res => {         
                dt._value = res[0]['results'].map(x => {
                    return {
                        ...x,
                        startDate: x.startDate ? this.datePipe.transform(x.startDate, 'MMM-dd-yyyy') : '',
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                        updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
                    }
                });                
                dt.exportCSV();
                dt.value = this.data;               
                this.isSpinnerVisible = false;                
            }, err => {
                this.isSpinnerVisible = false;               
            });
    }

    errorMessageHandler(log) {
        var msg = '';
        if (typeof log.error == 'string') {
            this.alertService.showMessage(
                'Error',
                log.error,
                MessageSeverity.error
            );

        } else {


            //if (log.error && log.error.errors.length > 0) {
            // for (let i = 0; i < log.error.errors.length; i++) {
            // msg = msg + log.error.errors[i].message + '<br/>'

            //}
            this.alertService.showMessage(
                log.error.message,
                msg,
                MessageSeverity.error
            );

        }
    }

    // restoreRecord(record){
    //     this.customerService.restoreCustomerRecord(record.customerId, this.userName).subscribe(res => {
    //         this.getDeleteListByStatus(true)
    //         this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
    //     })
    // }
    //date conversion related function

    mouseOverData(key, data) {

        if (key === 'startDate') {
            return moment(data['startDate']).format('MM/DD/YYYY');
        }
        else if (key === 'updatedDate') {
            return moment(data['updatedDate']).format('MM/DD/YYYY');
        }
        else if (key === 'createdDate') {
            return moment(data['createdDate']).format('MM/DD/YYYY');
        }
    }
    convertDate(key, data) {
        if (key === 'startDate') {
            return moment(data['startDate']).format('MM/DD/YYYY');
        }
        else if (key === 'updatedDate') {
            return moment(data['updatedDate']).format('MM/DD/YYYY');
        }
        else if (key === 'createdDate') {
            return moment(data['createdDate']).format('MM/DD/YYYY');
        }
    }
    getData(rowData, field) {

        if (field === 'jobtitle') return rowData['jobtitle'] ? rowData['jobtitle'] : 'NA';
        //if (field === 'jobtype') return rowData['jobtype'] ? rowData['jobtype']['jobTypeName'] : 'NA';
        else if (field === 'company') {
            // return rowData['masterCompany'] ? rowData['masterCompany']['companyName'] : 'NA';

            if (rowData.managmentLegalEntity != null && rowData.divmanagmentLegalEntity != null && rowData.biumanagmentLegalEntity != null && rowData.compmanagmentLegalEntity != null) {
                return rowData.compmanagmentLegalEntity.name;

            }
            else if (rowData.biumanagmentLegalEntity != null && rowData.divmanagmentLegalEntity != null && rowData.managmentLegalEntity != null) {
                return rowData.biumanagmentLegalEntity.name;

            }
            else if (rowData.divmanagmentLegalEntity != null && rowData.managmentLegalEntity != null) {
                return rowData.divmanagmentLegalEntity.name;
            }
            else if (rowData.managementStructeInfo != null) {
                return rowData.managmentLegalEntity.name;
            } else {
                return 'NA';
            }


        }
        else if (field === 'employeeExpertise') return rowData['employeeExpertise'] ? rowData['employeeExpertise']['description'] : 'NA';
        else if (field === 'employeeId') return `EMP ${rowData[field]}`;
        else if (field === 'paytype') return rowData['isHourly'] ? 'Hourly' : 'Yearly';
        else return rowData[field];
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.isDeleteMode = true;
        this.sourceEmployee.isdelete = true;
        //this.sourceVendor = content;
        //this.sourceEmployee.employeeId = rowData.employeeId;
        this.sourceEmployee.employeeId = this.deleteEmployeeId;
        this.sourceEmployee.updatedBy = this.userName;
        this.showTitle = "Employee removed successfully.";
        this.empService.deleteEmployee(this.sourceEmployee).subscribe(data => {
            this.alertService.showMessage("Success", this.showTitle, MessageSeverity.success);
            this.modal.close();
            // this.loadData();
            this.loadEmployeePages(this.lazyLoadEventData);
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
        });
    }

    openDelete(content, row) {
        this.deleteEmployeeId = row.employeeId;
        this.deleteEmployeeName = row.firstName + ' - ' + row.employeeCode;
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceEmployee = row;

        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { })
    }
    private saveCompleted(user?: any) {
        this.isSaving = false;

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Employee deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Employee Action edited successfully`, MessageSeverity.success);

        }

        //	this.loadData();
        this.loadEmployeePages(this.lazyLoadEventData);
    }
    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }
    openView(row) {
        this.isSpinnerVisible = true;       
        $('#step1').collapse('show');
        this.toGetEmployeeDetailsByEmpId(row.employeeId);
        this.toGetDocumentsListNew(row.employeeId);
        this.viewEmpID = row.employeeId;
        this.loadEmployeeRoles(row.employeeId);
        //this.isSpinnerVisible = false;
        this.empService.getEmployeeListforView(row.employeeId).subscribe(
            results => this.onemployeeDataLoadSuccessful(results[0]),
            error => {this.isSpinnerVisible=false} //this.onDataLoadFailed(error)
        );        
    }

    dismissModel() {
        this.modal.close();
    }
    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceEmployee = rowData;
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.IsActive = false;
            var employpeeleaveTypeId = [];
            employpeeleaveTypeId.push(this.sourceEmployee.employeeLeaveTypeId);
            this.sourceEmployee.employeeLeaveTypeId = employpeeleaveTypeId;

            this.Active = "In Active";
            this.sourceEmployee.isActive = false;
            this.empService.updateActionforActive(this.sourceEmployee).subscribe(
                response => this.saveCompleted(this.sourceEmployee),
                error => {this.isSpinnerVisible=false});
            //alert(e);
        }
        else {
            var employpeeleaveTypeId = [];
            this.sourceEmployee = rowData;
            employpeeleaveTypeId.push(this.sourceEmployee.employeeLeaveTypeId);
            this.sourceEmployee.employeeLeaveTypeId = employpeeleaveTypeId;
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.IsActive = true;
            this.Active = "Active";
            this.sourceEmployee.isActive == true;
            this.empService.updateActionforActive(this.sourceEmployee).subscribe(
                response => this.saveCompleted(this.sourceEmployee),
                error => {this.isSpinnerVisible=false});
            //alert(e);
        }

    }

    ExpandAllEmployeeDetailsModel() {
        $('#step1').collapse('show');
        $('#step2').collapse('show');
        $('#step3').collapse('show');
        $('#step4').collapse('show');
    }
    CloseAllEmployeerDetailsModel() {
        $('#step1').collapse('hide');
        $('#step2').collapse('hide');
        $('#step3').collapse('hide');
        $('#step4').collapse('hide');

    }



    dismissDocumentPopupModel(type) {

        this.closeMyModel(type);

    }
    closeMyModel(type) {

        $(type).modal("hide");

    }



    getAuditHistoryById(rowData) {
        this.isSpinnerVisible = true;
        this.empService.getEmployeeAuditDetails(rowData.employeeId).subscribe(res => {
            this.auditHistory = res;
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;            
        });
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

    async getAllFrequencyTrainingData() {
        await this.commonService.smartDropDownList('FrequencyOfTraining', 'FrequencyOfTrainingId', 'FrequencyName').subscribe(res => {
            this.getAllFrequencyTrainingInfodrpData = res;

        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
           // this.errorMessageHandler(errorLog);
        });
    }

    getDeleteDocumentListByStatus(value, empID) {
        if (value) {
            this.currenDocDeletedstatus = true;
        } else {
            this.currenDocDeletedstatus = false;
        }
        this.toGetDocumentsListNew(empID);
    }

    // toGetEmployeeTrainingDocumentsList(employeeId) {
    //     var moduleId = 4;
    //     this.commonService.GetDocumentsList(employeeId, moduleId).subscribe(res => {
    //         this.allEmployeeTrainingDocumentsList = res;
    //     })
    // }
    toGetDocumentsListNew(employeeId) {
        var moduleId = 4;
        this.commonService.GetDocumentsListNew(employeeId, moduleId, this.currenDocDeletedstatus).subscribe(res => {
            this.allEmployeeTrainingDocumentsList = res;
            this.allCustomerFinanceDocumentsListOriginal = res;

        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            ///this.errorMessageHandler(errorLog);
        });
    }

    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }

    private loadCurrencyData() {
        this.currencyService.getCurrencyList(this.currentUserMasterCompanyId).subscribe(currencydata => {
            this.allCurrencyData = currencydata[0];
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
        });
    }

    // private loadShiftData() {       
    //     this.empService.getshift().subscribe(data => {           
    //             this.allShiftData = data[0];     
    //             console.log(this.allShiftData);
    //         })
    // }

    async getAllStationData() {
        await this.commonService.smartDropDownList('EmployeeStation', 'EmployeeStationId', 'StationName').subscribe(res => {
            this.getAllAllStationInfodrpData = res;

        }, err => {
            this.isSpinnerVisible = false;
           // const errorLog = err;
           // this.errorMessageHandler(errorLog);
        });
    }

    getManagementStructureData(empId) {
        this.selectedRoleNames = '';

        //let roles = [];
        this.empService.getStoredEmployeeRoles(empId)
            .subscribe(
                (employeeList: any[]) => {
                    if (this.employeeRolesList != null) {
                        this.employeeRolesList.forEach(mainRole => {
                            employeeList.forEach(role => {
                                if (role.roleId == mainRole['id']) {
                                    //roles.push(mainRole['name']);
                                    this.selectedRoleNames += mainRole['name'] + ', ';
                                }
                            });
                        });
                        if (this.selectedRoleNames && this.selectedRoleNames.length > 1) {
                            this.selectedRoleNames = this.removeLastComma(this.selectedRoleNames);
                        }
                    }
                }
            )
        this.empService.getStoredEmployeeManagementStructure(empId)
            .subscribe(
                (managementStructureList: any[]) => {
                    this.empService.legalEnityList = managementStructureList;
                }
            )
    }

    removeLastComma(strng) {
        var n = strng.lastIndexOf(",");
        var a = strng.substring(0, n)
        return a;
    }




    loadEmployeeRoles(empId) {
        this.empService.getAllRolesOfEmployee().subscribe(
            results => {
                this.employeeRolesList = results;
                this.employeeRoleLabel = this.employeeRolesList.map((emp) => { return emp['name'] })
                this.loadManagementStructure(empId);
            },
            error => {this.isSpinnerVisible=false} //console.log(error)
        );
    }

    loadManagementStructure(empId) {
        this.legalEntityService.getManagemententity().subscribe(
            (results: any) => {
                this.onManagemtntdataLoad(results[0])
                this.getManagementStructureData(empId);
            },
            (error: any) => {
                this.isSpinnerVisible=false
            }
        )
    }

    private onManagemtntdataLoad(getAtaMainList: any[]) {

        this.allManagemtninfo = getAtaMainList;
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].tagName != null) {
                this.tagNameCollection.push(this.allManagemtninfo[i]);
            }
        }

        if (this.allManagemtninfo) {

            this.gridData = [{
                data: {
                    fullName: this.allManagemtninfo[0].companyName,
                    isRoot: true,
                    managementStructureId: 0
                },
                children: this.makeNestedObj(this.allManagemtninfo, null),
                isCheckboxNotDisable: true
            }];

        }

    }
    makeNestedObj(arr, parent) {
        var out = []
        for (var i in arr) {
            if (arr[i].parentId == parent) {
                var children = this.makeNestedObj(arr, arr[i].managementStructureId)
                arr[i] = { "data": arr[i] };
                arr[i].isCheckboxNotDisable = true;
                if (children.length) {
                    arr[i].children = children
                }
                out.push(arr[i])
            }
        }
        return out
    }

    toGetEmployeeDetailsByEmpId(employeeId) {
        this.empService.toGetEmployeeDetailsByEmpId(employeeId).subscribe(res => {
            this.empDetailsData = res;
            this.empshifttype = this.empDetailsData.shiftnames;
            this.supervisorname = this.empDetailsData.supervisorName;
            this.empcreatedby = this.empDetailsData.createdBy;
            this.empcreatedDate = this.empDetailsData.createdDate;
            this.compmanagmentLegalEntityName = this.empDetailsData.compmanagmentLegalEntityName;
            this.biumanagmentLegalEntityName = this.empDetailsData.biumanagmentLegalEntityName;
            this.divmanagmentLegalEntityName = this.empDetailsData.divmanagmentLegalEntityName;
            this.managmentLegalEntityName = this.empDetailsData.managmentLegalEntityName;
            this.originatingCountryName = this.empDetailsData.originatingCountryName;
            this.shiftNames = this.empDetailsData.shiftNames;
            this.currencyName = this.empDetailsData.currencyName;
            this.leavetypenames = this.empDetailsData.leavetypenames;
            this.stationName = this.empDetailsData.stationName;
            this.jobTitleName = this.empDetailsData.jobTitle
            this.empExpertiseName = this.empDetailsData.employeeExpertiseName
            this.empleaveType = this.empDetailsData.leaveTypeNames;
            this.empstatus = this.empDetailsData.isActive;
            this.getManagementStructureNameandCodes(this.empDetailsData.managementStructureId);
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
        });
    }

    getAllAircraftManfacturer() {
        this.itemser.getAircraft().subscribe(res => {
            this.manufacturerData = res[0].map(x => {
                return {
                    value: x.aircraftTypeId, label: x.description
                }
            })
        });
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    dateFilterForTable1(date, field) {

        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.allEmployeeTrainingDocumentsList = this.allCustomerFinanceDocumentsListOriginal;
            const data = [...this.allEmployeeTrainingDocumentsList.filter(x => {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.allEmployeeTrainingDocumentsList = data;
        } else {
            this.allEmployeeTrainingDocumentsList = this.allCustomerFinanceDocumentsListOriginal;
        }

    }
    dateObject: any = {}
    dateFilterForTable(date, field) { 
        const minyear = '1900';
        const dateyear = moment(date).format('YYYY');
        this.dateObject = {}  
        date = moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
        if (date != "" && moment(date, 'MM/DD/YYYY', true).isValid()) {
            if(dateyear > minyear){
                if (field == 'createdDate') {
                    this.dateObject = { 'createdDate': date }
                } else if (field == 'updatedDate') {
                    this.dateObject = { 'updatedDate': date }
                } else if (field == 'startDate') {
                    this.dateObject = { 'startDate': date }
                }

                this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
                const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                this.getList(PagingData);
            }
        } else {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate) {
                delete this.lazyLoadEventDataInput.filters.createdDate;
            }
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate) {
                delete this.lazyLoadEventDataInput.filters.updatedDate;
            }
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.startDate) {
                delete this.lazyLoadEventDataInput.filters.startDate;
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        }

    }


    openHistoryDoc(rowData) {
        this.isSpinnerVisible = true;
        this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
            res => {
                this.sourceViewforDocumentAudit = res;
                this.isSpinnerVisible = false;
            }, err => {
                this.isSpinnerVisible = false;
                //const errorLog = err;
                //this.errorMessageHandler(errorLog);
            });

    }
    getColorCodeForHistoryDoc(i, field, value) {
        const data = this.sourceViewforDocumentAudit;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    changeStatus(rowData) {}









}