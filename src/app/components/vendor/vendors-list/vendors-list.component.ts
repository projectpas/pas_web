import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { FormBuilder, } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { fadeInOut } from '../../../services/animations';
import { MasterCompany } from '../../../models/mastercompany.model';
import { AuditHistory } from '../../../models/audithistory.model';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { VendorService } from '../../../services/vendor.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { Router, ActivatedRoute } from '@angular/router';
//import $ from "jquery";
import { ConfigurationService } from '../../../services/configuration.service';
import { VendorCapabilitiesService } from '../../../services/vendorcapabilities.service';
import { MenuItem } from 'primeng/api';
import { listSearchFilterObjectCreation } from '../../../generic/autocomplete';
import { CommonService } from '../../../services/common.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
declare var $ : any;


@Component({
    selector: 'app-vendors-list',
    templateUrl: './vendors-list.component.html',
    styleUrls: ['./vendors-list.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe],
})
export class VendorsListComponent implements OnInit {
    allVendorCertifiedocumentsList: any = [];
    allVendorCertifiedocumentsListOriginal: any = [];
    allVendorAuditdocumentsList: any = [];
    allVendorAuditdocumentsListOriginal: any = [];
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
    ];
    sourceViewforDocumentAudit: any = [];
    activeIndex: number;
    vendorCode: any = "";
    vendorname: any = "";
    vendorEmail: any = "";
    VendorTypeId: any = "";
    allgeneralInfo: any[];
    collection: any;
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createddate: any = "";
    updatedDate: any = "";
    sub: any;
    local: any;
    vendorName: any;
    lastName: any = "";
    firstName: any = "";
    contactTitle: any = "";
    email: any = "";
    mobilePhone: number;
    fax: any = "";
    vendorTypeId: any = "";
    creditlimit: any = "";
    creditTermsId: any = "";
    currencyId: any = "";
    discountLevel: any = "";
    is1099Required: any = "";
    isCertified: boolean = false;
    showGeneralData: boolean = true;
    showcontactdata: boolean = true;
    showfinancialdata: boolean = true;
    allContacts: any[] = [];
    allpayments: any[] = [];
    selectedPaymentColumns: any[];
    allShippings: any[] = [];
    shippingCol: any[];
    selectedShippingColumns: any[];
    selectedRow: any;
    billingInfoList: any[] = [];
    selectedBillingColumns: any[];
    billingCol: any[];
    warningInfoList: any[] = [];
    selectedWarningColumns: any[];
    warninggCol: any[];
    allVendorPOROList: any[] = [];
    memoCols: any[];
    vendorDocumentsData: any = [];
    vendorDocumentsColumns: any[];
    totalRecords: number = 0;
    totalPages: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    isVendorList: boolean;
    @Input() isCreatePO: boolean = false;
    @Input() isCreateRO: boolean = false;
    purchaseOrderList: any = [];
    poCols: any = [];
    selectedPOColumns: any[];
    selectedPOColumn: any[];
    vendorStatus: boolean = false;
    isIsBillingAddress: boolean = false;
    isIsShippingAddress: boolean = false;
    vendorcreatedBy: any;
    vendorCreatedDate: any;
    vendorIntegration: any;
    edi: boolean = false;
    aeroExchange: boolean = false;
    ediDescription: any;
    aeroExchangeDesc: any;
    vendorProcess1099Data: any;
    checkedCheckboxesList: any = [];
    status: string = 'active';
    isSpinnerVisible: Boolean = false;
    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    filteredBrands: any[];
    displayedColumns = ['actionId', 'companyName', 'description', 'memo', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<any>;
    allVendorList: any[] = [];
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourceVendor: any = {};
    public vendorFinData: any = {};    
    public domesticSaveObj: any = {};
    public internationalSaveObj: any = {};
    public sourceAction: any = [];
    public auditHisory: AuditHistory[] = [];
    private bodyText: string;
    public sourceVendorUpdateStatus: any = {};
    //loadingIndicator: boolean;
    closeResult: string;
    selectedColumn: any[];
    selectedColumns: any[];
    selectedContactColumns: any[];
    cols: any[];
    contactcols: any[];
    paymentcols: any[];
    title: string = "Create";
    id: number;
    errorMessage: any;
    modal: NgbModalRef;
    actionName: string;
    Active: string = "Active";
    length: number;
    localCollection: any;
    allVendorGeneralDocumentsList: any = [];
    updateActiveData = {
        vendorId: 0,
        updatedBy: '',
        isActive: false,
        isdeleted: false,
        createdBy: ''
    }
    private isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    public allWorkFlows: any[] = [];
    isEnablePOList: boolean = false;
    isEnableROList: boolean = false;
    vendorId: number;
    isActive: boolean = false;
    defaultPaymentData: any = {};
    internationalwithVendor: any[];
    defaultwithVendor: any[];
    domesticWithVedor: any[];
    paymentTypeName: any;
    allvendorCapsList: any[] = [];
    selectedCapsColumns: any[];
    capsCols: any[];
    vendorCapesGeneralInfo: any = {};
    aircraftListDataValues: any;
    colsaircraftLD: any[] = [
        { field: "aircraft", header: "Aircraft" },
        { field: "model", header: "Model" },
        { field: "dashNumber", header: "Dash Numbers" },
        { field: "memo", header: "Memo" }
    ];
    breadcrumbs: MenuItem[];

    sourceViewforDocument: any;
    sourceViewforDocumentList: any = [];
    vendorData: any = {};
    viewPageSize: number = 5;
    lazyLoadEventData: any;
    lazyLoadEventDataInput: any;
    filterText: any = '';
    globalfilter: string;
    isViewMode: boolean = true;
    modalIsCertified: NgbModalRef;
    modalVendorAudit: NgbModalRef;
    currentDeletedstatus:boolean=false;
    selectedRowforDelete: any;
    dateObject: any = {};
    selectedOnly: boolean = false;
    targetData: any;

    constructor(private router: ActivatedRoute, private route: Router, private datePipe: DatePipe, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public vendorService: VendorService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService, private vendorCapesService: VendorCapabilitiesService, public commonService: CommonService) {
        this.local = this.vendorService.financeCollection;
        this.dataSource = new MatTableDataSource();
        this.vendorService.listCollection = null;
    }

    ngOnInit() {
        this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendors-list';
        this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
        this.vendorService.ShowPtab = false;
        this.vendorService.alertObj.next(this.vendorService.ShowPtab);
        this.isVendorList = true;

        this.breadcrumbs = [
            { label: 'Vendors' },
            { label: 'Vendors List' },
        ];

        this.cols = [
            { field: 'vendorName', header: 'Vendor Name' },
            { field: 'vendorCode', header: 'Vendor Code' },
            { field: 'description', header: 'Vendor Type' },
            { field: 'classificationName', header: 'Vendor Classification' },
            { field: 'vendorEmail', header: 'Email' },
            { field: 'city', header: 'Vendor City' },
            { field: 'stateOrProvince', header: 'Vendor State' },
            { field: 'vendorPhoneContact', header: 'Vendor Contact' },
            { field: 'createdDate', header: 'Created Date' },
            { field: 'createdBy', header: 'CreatedBy' },
            { field: 'updatedDate', header: 'Updated Date' },
            { field: 'updatedBy', header: 'UpdatedBy' }
        ];
        this.selectedColumns = this.cols;
    }
    closeDeleteModal() {
        $("#downloadConfirmation").modal("hide");
    }

    navigateTogeneralInfo() {
        this.vendorService.isEditMode = false;
        this.vendorService.ShowPtab = true;
        this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-general-information';
        this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
        this.vendorService.alertObj.next(this.vendorService.ShowPtab);
        this.route.navigateByUrl('/vendorsmodule/vendorpages/app-vendor-general-information');
        this.vendorService.listCollection = undefined;
  }
    //Load Data for Vendor List
    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;
    if (this.isCreatePO || this.isCreateRO) {
            this.isActive = true;
        }
        if (this.filterText == '') {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status, isDeleted: this.currentDeletedstatus }
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        } else {
            this.globalSearch(this.filterText);
        }
    }

    getList(data) {
        this.isSpinnerVisible = true;
        this.vendorService.getAllVendorList(data).subscribe(res => {


            this.allVendorList = res[0]['results'].map(x => {
				return {
                    ...x,
                    createdDate : x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a'): '',
                    updatedDate : x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a'): '',
				}
			});	

            if (this.allVendorList != undefined) {
                if (this.allVendorList.length > 0) {
                    this.totalRecords = res[0]['totalRecordsCount'];
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                } else {
                    this.totalRecords = 0;
                    this.totalPages = 0;
                }
                this.isSpinnerVisible = false;
            } else {
                this.totalRecords = 0;
                this.totalPages = 0;
                this.isSpinnerVisible = false;
            }            
        }, error => this.onDataLoadFailed(error))
    }

    globalSearch(value) {
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status, isDeleted: this.currentDeletedstatus };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData);
    }

    resetGlobalFilter() {
        this.filterText = '';
        this.globalfilter = '';
    }

    getVenListByStatus(status) {
        // const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;
        // this.pageIndex = pageIndex;
        // this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = 0;
        this.status = status;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status, isDeleted: this.currentDeletedstatus };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData);
    }

    private loadMasterCompanies() {
        this.isSpinnerVisible = true;
        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        this.isSpinnerVisible = false;
        this.allComapnies = allComapnies;
    }

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }
    
    handleChanges(rowData, e) {
        this.updateActiveData.updatedBy = this.userName;
        this.updateActiveData.createdBy = this.userName;
        this.updateActiveData.vendorId = rowData.vendorId;
        if (e.checked == false) {
            this.sourceVendor = rowData;
            this.Active = "In Active";
            this.updateActiveData.isActive = false;
            this.vendorService.updateActionforActive(this.updateActiveData).subscribe(
                response => {
                    this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status, isDeleted: this.currentDeletedstatus };
                    const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                    this.getList(PagingData);
                    this.alertService.showMessage("Success", `Records In-Acivated successfully`, MessageSeverity.success);
                } ,error => this.saveFailedHelper(error));
        }
        else {
            this.Active = "Active";
            this.updateActiveData.isActive = true;
            this.vendorService.updateActionforActive(this.updateActiveData).subscribe(
                response => {
                    this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status, isDeleted: this.currentDeletedstatus };
                    const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                    this.getList(PagingData);
                    this.alertService.showMessage("Success", `Records Acivated successfully`, MessageSeverity.success);
                },
                error => this.saveFailedHelper(error));
        }
    }
    private refresh() {
        this.applyFilter(this.dataSource.filter);
    }

    filterActions(event) {
        this.localCollection = [];
        for (let i = 0; i < this.allVendorList.length; i++) {
            let actionName = this.allVendorList[i].description;
            if (actionName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(actionName);
            }
        }
    }
    private onHistoryLoadSuccessful(auditHistory: any, content) {
        this.isSpinnerVisible = false;
        //TO Items to Add Aftre All testinng
        this.auditHisory = []; //auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.auditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    private onDataLoadFailed(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    open(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.actionName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openGeneralInfo() {
        this.showGeneralData = true;
        this.showcontactdata = false;
        this.showfinancialdata = false;
    }

    openFinancialInfo() {
        this.showGeneralData = false;
        this.showcontactdata = false;
        this.showfinancialdata = true;
    }

    openDelete(content1, rowData) {
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceVendor = rowData;
        this.selectedRowforDelete = rowData;
        this.modal = this.modalService.open(content1, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openEdit(row) {
        this.vendorService.checkVendorEditmode(true);
        this.vendorService.isEditMode = true;
        this.vendorService.listCollection = this.sourceVendor;
        this.vendorService.enableExternal = true;
        this.vendorService.indexObj.next(this.activeIndex);
        let obj = {
            listCollection: this.vendorService.listCollection,
            activeIndex: this.activeIndex
        }
        
        window.localStorage.setItem('vendorService', JSON.stringify(obj));
        const { vendorId } = row;
        this.route.navigateByUrl(`/vendorsmodule/vendorpages/app-vendor-general-information/${vendorId}`);
  }
    private loadContactDataData(vendorId) {
        this.isSpinnerVisible = true;
        this.vendorService.getContacts(vendorId).subscribe(
            results => this.onContactDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
        this.contactcols = [
            { field: 'firstName', header: 'First Name' },
            { field: 'lastName', header: 'Last  Name' },
            { field: 'contactTitle', header: 'Contact Title' },
            { field: 'email', header: 'Email' },
            { field: 'mobilePhone', header: 'Mobile Phone' },
            { field: 'fullContactNo', header: 'Work Phone' },
            { field: 'fax', header: 'Fax' },
            { field: 'createdBy', header: 'Created By' },
            { field: 'updatedBy', header: 'Updated By' },
            { field: 'updatedDate', header: 'Updated Date' },
            { field: 'createdDate', header: 'Created Date' }
        ];
        this.selectedContactColumns = this.contactcols;
    }

    private loadMemosData(vendorId) {
        this.isSpinnerVisible = true;
        this.vendorService.getVendorPOMemolist(vendorId).subscribe(
            res => {
                this.allVendorPOROList = res;
                this.isSpinnerVisible = false;
            });
        this.vendorService.getVendorROMemolist(vendorId).subscribe(
            res => {
                for (let value of res) {
                    this.allVendorPOROList.push(value);
                }
                this.isSpinnerVisible = false;
            });
        this.memoCols = [
            { field: 'module', header: 'Module' },
            { field: 'orderNumber', header: 'Id' },
            { field: 'notes', header: 'Memo text' }
        ];
    }

    private onContactDataLoadSuccessful(allWorkFlows: any[]) {
        this.isSpinnerVisible = false;
        this.dataSource.data = allWorkFlows;
        this.allContacts = allWorkFlows;
    }

    private getVendorFinanceInfo(vendorId) {
        this.isSpinnerVisible = true;
        this.vendorService.getVendordata(vendorId).subscribe(
            results => this.onVendorsLoadSuccssfull(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onVendorsLoadSuccssfull(allVendors: any) {
        this.isSpinnerVisible = false;
        this.vendorFinData.data = allVendors;
        if(this.vendorFinData.data != undefined || this.vendorFinData.data != null)
        {
            if(this.vendorFinData.data.creditTermsId > 0)
            {
                this.vendorFinData.creditLimit =  this.vendorFinData.data.creditLimit;
                this.vendorFinData.creditTerms =  this.vendorFinData.data.creditTerms;
                this.vendorFinData.discontValue =  this.vendorFinData.data.discontValue;
                this.vendorFinData.currency =  this.vendorFinData.data.currency;
                this.vendorFinData.is1099Required =  this.vendorFinData.data.is1099Required;
                
            }
        }
    }

    
    private loadPayamentData(vendorId) {
        this.isSpinnerVisible = true;
        this.vendorService.getCheckPaymentobj(vendorId).subscribe(
            results => this.onPaymentDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
        this.paymentcols = [
            { field: 'siteName', header: 'Site Name' },
            { field: 'address1', header: 'Address' },
            { field: 'city', header: 'City' },
            { field: 'stateOrProvince', header: 'State/Prov' },
            { field: 'postalCode', header: 'Postal Code' },
            { field: 'countryName', header: 'Country' }
        ];
        this.selectedPaymentColumns = this.paymentcols;
    }
    private onPaymentDataLoadSuccessful(allWorkFlows: any[]) {
        this.isSpinnerVisible = false;
        this.dataSource.data = allWorkFlows;
        this.allpayments = allWorkFlows;
    }

    openView(content, row) {
        this.vendorId = row.vendorId;
        this.isSpinnerVisible = true;
        this.vendorService.getVendorDataById(row.vendorId).subscribe(res => {
            this.vendorData = res;    
            this.isSpinnerVisible = false;        
        },error => this.onDataLoadFailed(error)); 

        this.toGetVendorGeneralDocumentsList(row.vendorId);
        this.toGetVendorCertifiedDocumentsList(row.vendorId);
        this.toGetVendorAuditDocumentsList(row.vendorId);
        this.getVendorProcess1099FromTransaction(row.vendorId);
        this.getDomesticWithVendorId(row.vendorId);
        this.InternatioalWithVendorId(row.vendorId);
        this.DefaultWithVendorId(row.vendorId);
        this.loadPayamentData(row.vendorId);
        this.loadMemosData(row.vendorId);
        this.getVendorFinanceInfo(row.vendorId);

        this.isSpinnerVisible = false;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        $('#step1').collapse('show');      
    }

    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    
    openHist(content, row) {
        this.isSpinnerVisible = true;
        this.sourceVendor = row;
        this.isSaving = true;
        this.selectedRow = row;
        this.vendorService.getHistoryForVendor(this.sourceVendor.vendorId).subscribe(
            results => this.onHistoryLoadSuccessful(results, content),
            error => this.saveFailedHelper(error));
    }
    AddPage() {
        this.route.navigateByUrl('/vendorsmodule/vendorpages/app-vendor-general-information');
    }
    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.isDeleteMode = true;
        this.updateActiveData.vendorId = this.sourceVendor.vendorId;
        this.updateActiveData.isdeleted = true;
        this.updateActiveData.createdBy = this.userName;
        this.updateActiveData.updatedBy = this.userName;
        this.vendorService.updateVendorIsDelete(this.updateActiveData).subscribe(
            response => this.saveCompleted(this.sourceVendor),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }
    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }
    private saveCompleted(user?: any) {
        this.isSaving = false;

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
        }
        this.getList(this.lazyLoadEventData);
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
    handleChangesforcontacts(rowData, e) {
        if (e.checked == false) {
            this.sourceVendor = rowData;
            this.sourceVendor.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceVendor.isActive = false;

            this.sourceVendorUpdateStatus.updatedBy = this.userName;
            this.sourceVendorUpdateStatus.contactId = rowData.contactId;
            this.sourceVendorUpdateStatus.isActive = false;

            this.vendorService.updateContactforActive(this.sourceVendorUpdateStatus).subscribe(
                response => this.saveCompleted(this.sourceVendor),
                error => this.saveFailedHelper(error));
        }
        else {
            this.sourceVendor = rowData;
            this.sourceVendor.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceVendor.isActive = true;

            this.sourceVendorUpdateStatus.updatedBy = this.userName;
            this.sourceVendorUpdateStatus.contactId = rowData.contactId;
            this.sourceVendorUpdateStatus.isActive = true;

            this.vendorService.updateContactforActive(this.sourceVendorUpdateStatus).subscribe(
                response => this.saveCompleted(this.sourceVendor),
                error => this.saveFailedHelper(error));
        }
    }
    opencontactView(content, row) {
        this.sourceVendor = row;
        this.firstName = row.firstName;
        this.lastName = row.lastName;
        this.contactTitle = row.contactTitle;
        this.email = row.email;
        this.mobilePhone = row.mobilePhone;
        this.fax = row.fax;
        this.createdBy = row.createdBy;
        this.updatedBy = row.updatedBy;
        this.createddate = row.createdDate;
        this.updatedDate = row.updatedDate;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openEditforcontact(content, row) {
        this.vendorService.isEditMode=true;
        this.isEditMode = true;
        this.isSaving = true;
        this.sourceVendor = row;
        this.loadMasterCompanies(); 
    }
    openViewforfinance(content, row) {
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }
    handleChangesforcontact(rowData, e) {
        if (e.checked == false) {
            this.sourceVendor = rowData;
            this.sourceVendor.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceVendor.isActive = false;

            this.sourceVendorUpdateStatus.updatedBy = this.userName;
            this.sourceVendorUpdateStatus.contactId = rowData.contactId;
            this.sourceVendorUpdateStatus.isActive = false;

            this.vendorService.updateContactforActive(this.sourceVendorUpdateStatus).subscribe(
                response => this.saveCompleted(this.sourceVendor),
                error => this.saveFailedHelper(error));
        }
        else {
            this.sourceVendor = rowData;
            this.sourceVendor.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceVendor.isActive = true;

            this.sourceVendorUpdateStatus.updatedBy = this.userName;
            this.sourceVendorUpdateStatus.contactId = rowData.contactId;
            this.sourceVendorUpdateStatus.isActive = true;

            this.vendorService.updateContactforActive(this.sourceVendorUpdateStatus).subscribe(
                response => this.saveCompleted(this.sourceVendor),
                error => this.saveFailedHelper(error));
        }
    }

    openHistforcontact(content, row) {
        //this.alertService.startLoadingMessage();
        //this.loadingIndicator = true;
        this.isSpinnerVisible = true
        this.sourceVendor = row;
        this.isSaving = true;
        this.vendorService.historyAcion(this.sourceVendor.contactId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => this.saveFailedHelper(error));
    }
    openContactList(content, row) {
        this.vendorId = row.vendorId;
        this.selectedRow = row;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        this.loadContactDataData(row.vendorId);
    }

    openVendorCapesList(content, row) {
        this.vendorId = row.vendorId;
        this.selectedRow = row;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        //this.loadContactDataData(row.vendorId);
    }

    ExpandAllVenodrDetailsModel() {
        $('#step1').collapse('show');
        $('#step2').collapse('show');
        $('#step3').collapse('show');
        $('#step4').collapse('show');
        $('#step5').collapse('show');
        $('#step6').collapse('show');
        $('#step7').collapse('show');
        $('#step9').collapse('show');
        $('#step10').collapse('show');
        $('#step11').collapse('show');
        $('#step12').collapse('show');
    }
    CloseAllVenodrDetailsModel() {
        $('#step1').collapse('hide');
        $('#step2').collapse('hide');
        $('#step3').collapse('hide');
        $('#step4').collapse('hide');
        $('#step5').collapse('hide');
        $('#step6').collapse('hide');
        $('#step7').collapse('hide');
        $('#step9').collapse('hide');
        $('#step10').collapse('hide');
        $('#step11').collapse('hide');
        $('#step12').collapse('hide');
    }

    gotoCreatePO(rowData) {
        const { vendorId } = rowData;
        this.route.navigateByUrl(`vendorsmodule/vendorpages/app-purchase-setup/vendor/${vendorId}`);
    }
    gotoCreateRO(rowData) {
        const { vendorId } = rowData;
        this.route.navigateByUrl(`vendorsmodule/vendorpages/app-ro-setup/vendor/${vendorId}`);
    }
    navigateToCreatePO() {
        $('#purchaseOrderList').modal('hide');
        this.route.navigateByUrl(`vendorsmodule/vendorpages/app-purchase-setup/vendor/${this.vendorId}`);
    }
    navigateToCreateRO() {
        $('#repairOrderList').modal('hide');
        this.route.navigateByUrl(`vendorsmodule/vendorpages/app-ro-setup/vendor/${this.vendorId}`);
    }

    toGetVendorGeneralDocumentsList(vendorId) {
        var moduleId = 3;
        this.isSpinnerVisible = true;
        this.vendorService.GetVendorGeneralDocumentsList(vendorId, moduleId).subscribe(res => {
            this.allVendorGeneralDocumentsList = res;
            this.isSpinnerVisible = false;
        },
            error => this.onDataLoadFailed(error))
    }
    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }

    getVendorPOId(rowData) {
        this.vendorId = rowData.vendorId;
        this.isEnablePOList = true;
        this.isEnableROList = false;
    }

    getVendorROId(rowData) {
        this.vendorId = rowData.vendorId;
        this.isEnableROList = true;
        this.isEnablePOList = false;
    }

    resetVendorId() {
        this.vendorId = null;
    }

    public getVendorProcess1099FromTransaction(vendorId) {
        this.isSpinnerVisible = true;
          this.vendorService.getVendorProcess1099DataFromTransaction(vendorId).subscribe(res => {
            if (res[0].length != 0) {
                this.vendorProcess1099Data = res[0].map(x => {
                    return {
                        ...x
                    }
                });
                for (let j = 0; j < this.vendorProcess1099Data.length; j++) {
                    if (this.vendorProcess1099Data[j].isDefaultRadio == true || this.vendorProcess1099Data[j].isDefaultRadio == "true") {
                        this.vendorProcess1099Data[j].isDefaultRadio = this.vendorProcess1099Data[j].description
                    }
                    if (this.vendorProcess1099Data[j].isDefaultCheck == true) {
                        this.checkedCheckboxesList.push(j);
                    }
                }
            }
            this.isSpinnerVisible = false;
          },
              error => this.onDataLoadFailed(error))
    }
    public getDomesticWithVendorId(vendorId) {
        this.isSpinnerVisible = true;
        this.vendorService.getDomesticvedor(vendorId).subscribe(
            results => this.onDomestciLoad(results[0]),
            error => this.onDataLoadFailed(error)

        );
    }
    private onDomestciLoad(allWorkFlows: any) {
        this.isSpinnerVisible = false;
        this.domesticWithVedor = allWorkFlows;
        if (this.domesticWithVedor.length > 0) {
            this.domesticSaveObj = allWorkFlows[0];
        }
    }
    public InternatioalWithVendorId(vendorId) {
        this.isSpinnerVisible = true;
        this.vendorService.getInternationalWire(vendorId).subscribe(
            results => this.onInternatioalLoad(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    public onInternatioalLoad(allWorkFlows: any) {
        this.isSpinnerVisible = false;
        this.internationalwithVendor = allWorkFlows;
        if (this.internationalwithVendor.length > 0) {
            this.internationalSaveObj = allWorkFlows[0];
        }
    }

    public DefaultWithVendorId(vendorId) {
        this.isSpinnerVisible = true;
        this.vendorService.getDefaultlist(vendorId).subscribe(
            res => {
                this.defaultPaymentData = res[0];
                this.isSpinnerVisible = false;
                if (this.defaultPaymentData != null && this.defaultPaymentData.paymentType != null) {
                    this.paymentTypeName = this.defaultPaymentData.paymentType;
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }
    viewFileSelectedCapsRow(rowData) {
        this.sourceViewforDocument = rowData;
        this.toGetUploadDocumentsList(rowData.attachmentId, rowData.vendorId, 3);
    }

    viewSelectedDocsRowonDbl(rowData) {
        this.viewFileSelectedCapsRow(rowData);
        $('#fileDocview').modal('show');
    }

    toGetUploadDocumentsList(attachmentId, vendorId, moduleId) {
        this.vendorService.toGetUploadDocumentsList(attachmentId, vendorId, moduleId).subscribe(res => {
            this.sourceViewforDocumentList = res;
        })
    }
    getPageCount(totalNoofRecords, viewPageSize) {
        return Math.ceil(totalNoofRecords / viewPageSize)
    }
    toGetVendorCertifiedDocumentsList(vendorId) {
        var moduleId = 48;
        this.isSpinnerVisible = true;
        this.commonService.GetDocumentsListNew(vendorId, moduleId).subscribe(res => {
            this.allVendorCertifiedocumentsList = res;
            this.allVendorCertifiedocumentsListOriginal = res;
            this.isSpinnerVisible = false;
        },
            error => this.onDataLoadFailed(error))
    }
    toGetVendorAuditDocumentsList(vendorId) {
        var moduleId = 49;
        this.isSpinnerVisible = true;
        this.commonService.GetDocumentsListNew(vendorId, moduleId).subscribe(res => {
            this.allVendorAuditdocumentsList = res;
            this.allVendorAuditdocumentsListOriginal = res;
            this.isSpinnerVisible = false;
        },
            error => this.onDataLoadFailed(error))
    }
    dateFilterForTableVendorAudit(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.allVendorAuditdocumentsList = this.allVendorAuditdocumentsListOriginal;
            const data = [...this.allVendorAuditdocumentsList.filter(x => {

                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.allVendorAuditdocumentsList = data;
        } else {
            this.allVendorAuditdocumentsList = this.allVendorAuditdocumentsListOriginal;
        }
    }



    updateDateFilterForTableForVendorList(date, field) {
        if (date !== '') {

            const data = [...this.allVendorList.filter(x => {

                if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.allVendorList = data;
        } else {
            this.allVendorList = this.allVendorList;
        }

    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }
    openHistoryDoc(rowData) {
 this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
            res => {
                this.sourceViewforDocumentAudit = res;
     },
     error => this.onDataLoadFailed(error))
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
    viewIsCertifiedModal(content){
        this.modalIsCertified = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }
    viewVendorAuditModal(content){
        this.modalVendorAudit = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }
    closeIsCertifiedModal(){
        this.modalIsCertified.close()
    }
    closeVendorAuditModal(){
        this.modalVendorAudit.close()
    }
    getDeleteListByStatus(value){
        this.lazyLoadEventDataInput.filters.isDeleted = value
        this.currentDeletedstatus = value;
        if(value==true){
			const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }            
				this.getList(PagingData);
        }else{
			const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }            
				this.getList(PagingData);
        }
    }
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    restorerecord:any={}
    restoreRecord(){
        this.commonService.updatedeletedrecords('Vendor','VendorId',this.restorerecord.vendorId).subscribe(res => {
            this.modal.close();
            this.getDeleteListByStatus(true)
            this.alertService.showMessage("Success", `Record was Restored successfully. `, MessageSeverity.success);
        },
            error => this.onDataLoadFailed(error))
    }
    exportCSV(dt) {
        this.isSpinnerVisible = true;
        let PagingData = {"first":0,"rows":dt.totalRecords,"sortOrder":1,"filters":{"status":this.status,"isDeleted":this.currentDeletedstatus},"globalFilter":""}
        let filters = Object.keys(dt.filters);
        filters.forEach(x=>{
			PagingData.filters[x] = dt.filters[x].value;
        })
        this.vendorService.getAllVendorList(PagingData).subscribe(res => {
            dt._value = res[0]['results'].map(x => {
				return {
                    ...x,
                    createdDate : x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                    updatedDate : x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
				}
			});	
            dt.exportCSV();
            dt.value = this.allVendorList;
            this.isSpinnerVisible = false;
        },error => {
                this.onDataLoadFailed(error)
            },
        );
    }

    dateFilterForTable(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.allVendorCertifiedocumentsList = this.allVendorCertifiedocumentsListOriginal;
            const data = [...this.allVendorCertifiedocumentsList.filter(x => {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.allVendorCertifiedocumentsList = data;
        } else {
            this.allVendorCertifiedocumentsList = this.allVendorCertifiedocumentsListOriginal;
        }

    }

    dateFilterForTableVendorList(date, field) {
        this.dateObject={}
                date=moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
        if(date !="" && moment(date, 'MM/DD/YYYY',true).isValid()){
            if(field=='createdDate'){
                this.dateObject={'createdDate':date}
            }else if(field=='updatedDate'){
                this.dateObject={'updatedDate':date}
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status ,...this.dateObject};
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData); 
        }else{
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,  status: this.status,...this.dateObject};
            if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate){
                delete this.lazyLoadEventDataInput.filters.createdDate;
            }
            if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate){
                delete this.lazyLoadEventDataInput.filters.updatedDate;
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status,...this.dateObject};
                const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                this.getList(PagingData); 
        }              
    }

    // createDateFilterForTableForVendorList(date, field) {
    //     if (date !== '') {

    //         const data = [...this.allVendorList.filter(x => {

    //             if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
    //                 return x;
    //             }
    //         })]
    //         this.allVendorList = data;
    //     } else {
    //         this.allVendorList = this.allVendorList;
    //     }

    // }
    changeCheck1099Required($event, i) {}
}