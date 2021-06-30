
import { Component, ViewChild, OnInit } from '@angular/core';
import {  FormBuilder} from '@angular/forms';
import { fadeInOut } from '../../../services/animations';
declare var $ : any;
import {  MatTableDataSource, MatDialog } from '@angular/material';
import { AuthService } from '../../../services/auth.service';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { CustomerService } from '../../../services/customer.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import {  Table } from 'primeng/table';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { listSearchFilterObjectCreation } from '../../../generic/autocomplete';
import { CommonService } from '../../../services/common.service';
import { CustomerViewComponent } from '../../../shared/components/customer/customer-view/customer-view.component';
import { ConfigurationService } from '../../../services/configuration.service';
import * as moment from 'moment';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';
import { PermissionMaster } from '../../user-role/ModuleHierarchyMaster.model';

@Component({
    selector: 'app-customers-list',
    templateUrl: './customers-list.component.html',
    styleUrls: ['./customers-list.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
export class CustomersListComponent implements OnInit {
    moduleName="Customer"
    isSpinnerVisible: Boolean = true;
    totalRecords: number = 0;
    totalPages: number = 0;
    isDeleteMode: boolean = false;
    allCustomerFinanceDocumentsList: any = [];
    customerId: number = 0;
    sourceViewforShippingInfo: any;
    sourceViewInterforShippingInfo: any;
    demosticShippingViaDataInfo: any;
    demosticInterShippingViaDataInfo: any;
    sourceViewforDocument: any;
    home: any;
    sourceViewforContact: any;
    selectedColumnsForInternationShipViaTable = [
        { field: 'shipVia', header: 'Ship Via' },
        { field: 'shippingAccountInfo', header: 'Shipping AccountInfo' },
          { field: 'memo', header: 'Memo' }
    ];
    selectedColumnsForDomesticShipVia = this.selectedColumnsForInternationShipViaTable;
    headers = [
        { field: 'name', header: 'Name' },
        { field: 'customerCode', header: 'Code',width:"100px" },
        { field: 'accountType', header: 'Account Type' },
        { field: 'customerType', header: 'Type',width:"100px" },
        { field: 'customerClassification', header: 'Classification',width:"200px" },
        { field: 'email', header: 'Email' ,width:"180px"},
        { field: 'city', header: 'City',width:"100px" },
        { field: 'stateOrProvince', header: 'State',width:"100px" },
        { field: 'contact', header: 'Contact' },
        { field: 'salesPersonPrimary', header: 'Sales Person' ,width:"110px"},
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' ,width:"100px"},
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By',width:"100px" }
    ]
    selectedColumns = this.headers;
    data: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    tax: boolean = false;
    @ViewChild('dt',{static:false})
    private table: Table;
    lazyLoadEventData: any;
    viewData: any[];
    modal: NgbModalRef;
    viewDataGeneralInformation: any={};
    viewDataclassification: any[];
    viewDocumnets: any;
    viewDataIntegration: any[];
    customerContacts: any;
    selectedRow: any;
    contactcols: any[];
    selectedContactColumns: any[];
    allContacts: any[] = [];
    customerauditHisory: any[];
    createdDate:any;
    selectedRowforDelete: any;
    restorerecord: any = {}
    pageIndexForInternationalShipVia: number = 0;
    pageSizeForInternationalShipVia: number = 10;
    customerContactsColumns = [
        { field: 'tag', header: 'Tag' },
        { field: 'firstName', header: 'First Name' },
        { field: 'lastName', header: 'Last Name' },
        { field: 'contactTitle', header: 'Contact Title' },
        { field: 'email', header: 'Email' },
        { field: 'workPhone', header: 'Work Phone' },
        { field: 'mobilePhone', header: 'Mobile Phone' },
        { field: 'fax', header: 'Fax' },
    ];
    colsaircraftLD: any = [
        { field: "aircraftType", header: "Aircraft" },
        { field: "aircraftModel", header: "Model" },
        { field: "dashNumber", header: "Dash Numbers" },
        { field: "inventory", header: "Inventory" },
        { field: "memo", header: "Memo" }

    ]
    ataHeaders = [
        { field: 'firstName', header: 'Contact' },
        { field: 'ataChapterName', header: 'ATA Chapter' },
        { field: 'ataSubChapterDescription', header: 'ATA Sub-Chapter' }
    ]
    billingInfoTableHeaders = [
        { field: 'siteName', header: 'Site Name' },
        { field: 'address1', header: 'Address1' },
        { field: 'address2', header: 'Address2' },
        { field: 'city', header: 'City' },
        { field: 'stateOrProvince', header: 'State/Prov' },
        { field: 'postalCode', header: 'Postal Code' },
        { field: 'countryName', header: 'Country' }
    ]
    domesticShippingHeaders = [
        { field: 'siteName', header: 'Site Name' },
        { field: 'address1', header: 'Address1' },
        { field: 'address2', header: 'Address2' },
        { field: 'city', header: 'City' },
        { field: 'stateOrProvince', header: 'State Or Province' },
        { field: 'postalCode', header: 'Postal Code' },
        { field: 'countryName', header: 'Country' }
    ]
    internationalShippingHeaders = [
        { field: 'exportLicense', header: 'Export License' },
        { field: 'description', header: 'Description' },
        { field: 'isPrimary', header: 'IsDefault' },
        { field: 'startDate', header: 'Start Date' },
        { field: 'expirationDate', header: 'Expiration Date' },
        { field: 'amount', header: 'Amount' }
    ]
    warningHeaders = [
        { field: 'sourceModule', header: 'Module' },
        { field: 'warningMessage', header: 'Warning Message' },
        { field: 'restrictMessage', header: 'Restrict Message' }
    ]
    customerDocumentsColumns = [
        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'docMemo', header: 'Memo' },
    ];
    customerPMAColumns = [
        { field: 'partNumber', header: 'Part Number' },
        { field: 'partDescription', header: 'Description' },
        { field: 'manufacturerName', header: 'Manufacturer' }
    ];
    customerDERColumns = [
        { field: 'partNumber', header: 'Part Number' },
        { field: 'partDescription', header: 'Description' },
        { field: 'manufacturerName', header: 'Manufacturer' }
    ];
    aircraftListDataValues: any;
    ataListDataValues: any;
    billingInfoList: any;
    waringInfoList: any;
    DocumentsList: any;
    domesticShippingData: any[];
    internationalShippingData: any;
    filterKeysByValue: object = {};
    taxTypeRateMapping: any;
    restrictedPMAParts: any;
    restrictedDERParts: any;
    disableRestrictedPMA: boolean = false;
    classificationIds: any[];
    filteredText: string;
    dataSource: MatTableDataSource<any>;
    breadcrumbs: MenuItem[];
    status: string = 'Active';
    currentstatus: string = 'Active';
    currentDeletedstatus:boolean=false;
    onDeletedActionState:boolean=false;
    lazyLoadEventDataInput: any;
    selectedOnly: boolean = false;
    targetData: any;
    dateObject: any = {};
    isAdd:boolean=true;
    isEdit:boolean=true;
    isActive:boolean=true;
    isDelete: boolean = true;
    isDownload:boolean=true;
    isDocumentview:boolean=true;
    permissionAddCheck=[ModuleConstants.Customer+'.'+PermissionConstants.Add,
        ModuleConstants.Customers_ATAChapter+'.'+PermissionConstants.Add,
        ModuleConstants.Customers_AircraftInformation+'.'+PermissionConstants.Add,
        ModuleConstants.Customers_BillingInformation+'.'+PermissionConstants.Add,
        ModuleConstants.Customers_Contacts+'.'+PermissionConstants.Add,
        ModuleConstants.Customers_Documents+'.'+PermissionConstants.Add,
        ModuleConstants.Customers_FinancialInformation+'.'+PermissionConstants.Add,
        ModuleConstants.Customers_GeneralInformation+'.'+PermissionConstants.Add,
        ModuleConstants.Customers_SalesPersonInformation+'.'+PermissionConstants.Add,
        ModuleConstants.Customers_ShippingInformation+'.'+PermissionConstants.Add,
        ModuleConstants.Customers_Warnings+'.'+PermissionConstants.Add];
    permissionUpdateCheck=[ModuleConstants.Customer+'.'+PermissionConstants.Update,
        ModuleConstants.Customers_ATAChapter+'.'+PermissionConstants.Update,
        ModuleConstants.Customers_AircraftInformation+'.'+PermissionConstants.Update,
        ModuleConstants.Customers_BillingInformation+'.'+PermissionConstants.Update,
        ModuleConstants.Customers_Contacts+'.'+PermissionConstants.Update,
        ModuleConstants.Customers_Documents+'.'+PermissionConstants.Update,
        ModuleConstants.Customers_FinancialInformation+'.'+PermissionConstants.Update,
        ModuleConstants.Customers_GeneralInformation+'.'+PermissionConstants.Update,
        ModuleConstants.Customers_SalesPersonInformation+'.'+PermissionConstants.Update,
        ModuleConstants.Customers_ShippingInformation+'.'+PermissionConstants.Update,
        ModuleConstants.Customers_Warnings+'.'+PermissionConstants.Update];
    constructor(private _route: Router,
        private authService: AuthService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder,
        private alertService: AlertService,
        public customerService: CustomerService,
        private datePipe: DatePipe,
        private dialog: MatDialog,
        private masterComapnyService: MasterComapnyService,
        private commonService: CommonService,
        private configurations: ConfigurationService) {
        this.dataSource = new MatTableDataSource();
        //this.isAdd=this.authService.checkPermission(ModuleConstants.Customer+'.'+PermissionConstants.Add);
        this.isAdd=this.authService.checkPermission(this.permissionAddCheck);
        //this.isEdit=this.authService.checkPermission(ModuleConstants.Customer+'.'+PermissionConstants.Update);
        this.isEdit=this.authService.checkPermission(this.permissionUpdateCheck);
        this.isActive=this.authService.checkPermission([ModuleConstants.Customer+'.'+PermissionConstants.Update]);
        this.isDelete=this.authService.checkPermission([ModuleConstants.Customer+'.'+PermissionConstants.Delete]);
        this.isDownload=this.authService.checkPermission([ModuleConstants.CustomerList+'.'+PermissionConstants.Download]);
        this.isDocumentview=this.authService.checkPermission([ModuleConstants.Customers_Documents+'.'+PermissionConstants.View]);
    }

    ngOnInit() {
       this.breadcrumbs = [
            { label: 'Customers' },
            { label: 'Customers List' },
        ];
        localStorage.removeItem('currentTab');
    }

    closeDeleteModal() {
        $("#downloadConfirmation").modal("hide");
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    geListByStatus(status) {
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.currentstatus = status;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex >= 1 ? pageIndex : 0;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus, isDeleted: this.currentDeletedstatus };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData);
    }

    getDeleteListByStatus(value){
        this.currentDeletedstatus=value;
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex >= 1 ? pageIndex : 0;
        if(value==true){
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus, isDeleted: this.currentDeletedstatus};
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        }else{
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus, isDeleted: this.currentDeletedstatus};
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        }
    }

    globalSearch(value) {
      const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex >= 1 ? pageIndex : 0;
        this.lazyLoadEventDataInput.globalFilter=value;
        //this.status = status;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus, isDeleted: this.currentDeletedstatus };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData);
    }

    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex >= 1 ? pageIndex : 0;
        event.globalFilter='';
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.filters = {
            ...this.lazyLoadEventDataInput.filters,
            status: this.currentstatus ? this.currentstatus : 'Active'
        }
        this.getList(event)
    }

    getList(data) {        
        this.isSpinnerVisible = true;
        data.filters.isDeleted = this.currentDeletedstatus;
        data.filters.status = this.currentstatus;
        data.filters.masterCompanyId = this.currentUserMasterCompanyId;      
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.customerService.getCustomerAll(PagingData).subscribe(res => {  
            if(res)
            {
                this.data = res['results'].map(x => {
                    return {
                        ...x,
                        createdDate : x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a'): '',
                        updatedDate : x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a'): '',
                    }
                });	

                //this.data = res.results;
                this.onDeletedActionState = this.currentDeletedstatus;
                this.isSpinnerVisible = false;
                if (res.results.length > 0) {
                    this.totalRecords = res.totalRecordsCount;
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                }
                if (res.results.length < 1) {
                    this.totalRecords = 0;
                    this.totalPages = 0;
                } 
            }   
            else{this.isSpinnerVisible = false;}                      
        }, error => {this.isSpinnerVisible = false;})
    }

    dateFilterForTableCustomerList(date, field) {
        const minyear = '1900';
        const dateyear = moment(date).format('YYYY');;
        this.dateObject={}
                date=moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
        if(date !="" && moment(date, 'MM/DD/YYYY',true).isValid()){
            if(dateyear > minyear)
            {
                if(field=='createdDate'){
                    this.dateObject={'createdDate':date}
                }else if(field=='updatedDate'){
                    this.dateObject={'updatedDate':date}
                }
                this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus ,...this.dateObject};
                const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                this.getList(PagingData); 
            }            
        }else{
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,  status: this.currentstatus,...this.dateObject};
            if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate){
                delete this.lazyLoadEventDataInput.filters.createdDate;
            }
            if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate){
                delete this.lazyLoadEventDataInput.filters.updatedDate;
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus,...this.dateObject};
                const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                this.getList(PagingData); 
        }              
    }
    
    restoreRecord(){
        this.commonService.updatedeletedrecords('Customer','CustomerId',this.restorerecord.customerId, ).subscribe(res => {
            this.modal.close();
            //this.getDeleteListByStatus(true)
            const pageIndex = parseInt(this.lazyLoadEventDataInput.first); 
            this.pageIndex = pageIndex;
            this.pageSize = this.lazyLoadEventDataInput.rows;
            this.lazyLoadEventDataInput.first = pageIndex >= 1 ? pageIndex : 0;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus, isDeleted: this.currentDeletedstatus };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
            this.alertService.showMessage("Success", `Restored Records Successfully`, MessageSeverity.success);
        }, error => {this.isSpinnerVisible = false;})
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    columnsChanges() {
        this.refreshList();
    }
    refreshList() {
        if (this.filteredText != "" && this.filteredText != null && this.filteredText != undefined) {
            this.globalSearch(this.filteredText);
        }
        else {
            this.table.reset();
        }
    }
    filterData(data) {
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    changeStatus(rowData) {
        this.isSpinnerVisible = true;
        this.customerService.updateActionforActive(rowData, this.userName).subscribe(res => {       
            if(res)
            {
                const pageIndex = parseInt(this.lazyLoadEventDataInput.first); 
                this.pageIndex = pageIndex;
                //this.currentstatus = status;
                this.pageSize = this.lazyLoadEventDataInput.rows;
                this.lazyLoadEventDataInput.first = pageIndex >= 1 ? pageIndex : 0;
                this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus, isDeleted: this.currentDeletedstatus };
                const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                this.getList(PagingData);
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
                //this.isSpinnerVisible = false;            
            }     
            else{
                this.isSpinnerVisible = false;
            }
            
        }, error => {this.isSpinnerVisible = false;})
        
    }
    edit(rowData) {
        const { customerId } = rowData;
        this._route.navigateByUrl(`customersmodule/customerpages/app-customer-edit/${customerId}`);
    }
    viewSelectedRow(rowData) {
        const { customerId } = rowData;
        this.modal = this.modalService.open(CustomerViewComponent, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.componentInstance.customerId = customerId;
    }
    viewSelectedRowdbl(content, rowData) {
        const { customerId } = rowData;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    ExpandAllCustomerDetailsModel() {
        $('#step1').collapse('show');
        $('#step2').collapse('show');
        $('#step3').collapse('show');
        $('#step4').collapse('show');
        $('#step5').collapse('show');
        $('#step6').collapse('show');
        $('#step7').collapse('show');
        $('#step8').collapse('show');
        $('#step9').collapse('show');
        $('#step10').collapse('show');
    }
    CloseAllCustomerDetailsModel() {
        $('#step1').collapse('hide');
        $('#step2').collapse('hide');
        $('#step3').collapse('hide');
        $('#step4').collapse('hide');
        $('#step5').collapse('hide');
        $('#step6').collapse('hide');
        $('#step7').collapse('hide');
        $('#step8').collapse('hide');
        $('#step9').collapse('hide');
        $('#step10').collapse('hide');

    }


    dblExpandAllCustomerDetailsModel() {
        $('#step11').collapse('show');
        $('#step12').collapse('show');
        $('#step13').collapse('show');
        $('#step14').collapse('show');
        $('#step15').collapse('show');
        $('#step16').collapse('show');
        $('#step17').collapse('show');
        $('#step18').collapse('show');
        $('#step19').collapse('show');
        $('#step20').collapse('show');
    }

    dblCloseAllCustomerDetailsModel() {
        $('#step11').collapse('hide');
        $('#step12').collapse('hide');
        $('#step13').collapse('hide');
        $('#step14').collapse('hide');
        $('#step15').collapse('hide');
        $('#step16').collapse('hide');
        $('#step17').collapse('hide');
        $('#step18').collapse('hide');
        $('#step19').collapse('hide');
        $('#step20').collapse('hide');
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.modal.close();
    }

    delete(content, rowData) {
        this.isDeleteMode = true;
        this.selectedRowforDelete = rowData;
        this.customerId = rowData.customerId;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    restore(restorePopupId, rowData) {
        this.restorerecord = rowData;
        this.customerId = rowData.customerId;
        this.modal = this.modalService.open(restorePopupId, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    
    deleteItemAndCloseModel() {
        let customerId = this.customerId;
        if (customerId > 0) {
            this.isSpinnerVisible = true;
            this.customerService.updateListstatus(customerId).subscribe(response => {
                const pageIndex = parseInt(this.lazyLoadEventDataInput.first); 
                this.pageIndex = pageIndex;
                this.pageSize = this.lazyLoadEventDataInput.rows;
                this.lazyLoadEventDataInput.first = pageIndex >= 1 ? pageIndex : 0;
                this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus, isDeleted: this.currentDeletedstatus };
                const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                this.getList(PagingData);
                this.isDeleteMode = false;
                this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            },error => {this.isSpinnerVisible = false;});
        }
        this.modal.close();
    }

    private saveCompleted(user?: any) {

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
            this.saveCompleted
        }
        this.getList(this.lazyLoadEventData);
    }

    // private saveFailedHelper(error: any) {
    //     this.alertService.stopLoadingMessage();
    //     this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
    //     this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    //     this.isSpinnerVisible = false;
    //     setTimeout(() => this.alertService.stopLoadingMessage(), 5000);
    // }

    openContactList(content, row) {
        this.selectedRow = row;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        this.loadContactDataData(row.customerId);
    }

    openSitesList(content, row) {
        this.selectedRow = row;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    openDocumentsList(content, row) {      
        const { customerId } = row;        
        this.selectedRow = row;
        this.customerId = customerId;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });   
    }

    private loadContactDataData(customerId) {
        this.alertService.startLoadingMessage();

        this.customerService.getContacts(customerId).subscribe(
            results => this.onContactDataLoadSuccessful(results[0]),
            error => this.isSpinnerVisible = false
        );

        this.contactcols = [
            { field: 'tag', header: 'Tag' },
            { field: 'firstName', header: 'First Name' },
            { field: 'lastName', header: 'Last  Name' },
            { field: 'contactTitle', header: 'Contact Title' },
            { field: 'email', header: 'Email' },
            { field: 'workPhone', header: 'Work Phone' },
            { field: 'mobilePhone', header: 'Mobile Phone' },
            { field: 'fax', header: 'Fax' }
        ];
        this.selectedContactColumns = this.contactcols;
    }
    private onContactDataLoadSuccessful(allWorkFlows: any[]) {
        this.alertService.stopLoadingMessage();

        this.dataSource.data = allWorkFlows;
        this.allContacts = allWorkFlows;

    }

    // private onDataLoadFailed(error: any) {
    //     this.alertService.stopLoadingMessage();

    // }

    getAuditHistoryById(content, row) {
        this.alertService.startLoadingMessage();
        this.customerService.getCustomerHistory(row.customerId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results, content),
            error => {this.isSpinnerVisible = false;});
    }

    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.customerauditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.customerauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    downloadFileUpload(rowData) {

        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }

    viewContactSelectedRow(rowData) {
        this.sourceViewforContact = rowData;

    }

    exportCSV(dt){
		this.isSpinnerVisible = true;
		const isdelete=this.currentDeletedstatus ? true:false;
		let PagingData = {"first":0,"rows":dt.totalRecords,"sortOrder":1,"filters":{"masterCompanyId":this.currentUserMasterCompanyId,"status":this.currentstatus,"isDeleted":isdelete},"globalFilter":""}
		let filters = Object.keys(dt.filters);
		filters.forEach(x=>{
			PagingData.filters[x] = dt.filters[x].value;
        })
        
		this.customerService.getCustomerAll(PagingData).subscribe(res => {
            dt._value = res['results'].map(x => {
				return {
					...x,
                    // createdDate: new Date(x.createdDate).getFullYear() +'/'+
                    //  (new Date(x.createdDate).getMonth() + 1) +'/'+
                    //   new Date(x.createdDate).getDate() +'  '+ new Date(x.createdDate).getHours() +':'+
                    //    new Date(x.createdDate).getMinutes() +':'+ new Date(x.createdDate).getSeconds(),
                    // updatedDate: new Date(x.updatedDate).getFullYear() +'/'+ (new Date(x.updatedDate).getMonth() + 1) +'/'+ new Date(x.updatedDate).getDate() +'  '+ new Date(x.updatedDate).getHours() +':'+ new Date(x.updatedDate).getMinutes() +':'+ new Date(x.updatedDate).getSeconds(),

                    createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                    updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',


				}
			});	
			dt.exportCSV();
			dt.value = this.data;
        	this.isSpinnerVisible = false;
        },error => this.isSpinnerVisible = false)
    }
}