import { Component, ViewChild, Input, SimpleChanges } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { fadeInOut } from '../../../services/animations';
import { MasterCompany } from '../../../models/mastercompany.model';
import { AuditHistory } from '../../../models/audithistory.model';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { VendorService } from '../../../services/vendor.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
import { editValueAssignByCondition, getObjectById, getObjectByValue, getValueFromObjectByKey } from '../../../generic/autocomplete';
import { ConfigurationService } from '../../../services/configuration.service';
import { CustomerInternationalShippingModel } from '../../../models/customer-internationalshipping.model';
declare const google: any;
import * as moment from 'moment';
import { CommonService } from '../../../services/common.service';
import { DatePipe } from '@angular/common';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';
@Component({
    selector: 'app-vendor-shipping-information',
    templateUrl: './vendor-shipping-information.component.html',
    styleUrls: ['./vendor-shipping-information.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
/** VendorShippingInformation component*/
export class VendorShippingInformationComponent {
    @Input() selectedVendorTab: string = '';
    @Input() editMode;
    @Input() vendorId: number = 0;
    @Input() isViewMode: boolean = false;
    customerName: any;
    customerCode: any;
    isSpinnerVisible: Boolean = false;

    modelValue: boolean;
    display: boolean;
    activeIndex: number = 8;
    public overlays: any[];
    shipViaCollection: any;
    shipviaIntercollection: any;
    allShipViaDetails: any[] = [];
    allShipViaInterDetails: any = [];
    updatedCollection: {};
    vendorshippingAddressdetails: any;
    local: any;
    addressId: any;
    allAddresses: any[];
    vendorCode: any;
    vendorname: any;
    allgeneralInfo: any[];
    action_name: any = "";
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createddate: any = "";
    updatedDate: any = "";
    shipViaObj: any = {};
    shipViaInterObj: any = {};
    checkAddress: boolean = false;
    viewName: string = "Create";
    siteName: any;
    address1: any;
    address2: any;
    city: any;
    stateOrProvince: any;
    postalCode: number;
    country: any;
    selectedShipVia: any;
    shipviacollection: any[];
    shippingauditHisory: any[];
    isPrimary: boolean = false;
    minimumDate = new Date();
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    filteredBrands: any[];
    displayedColumns = ['actionId', 'companyName', 'description', 'memo', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<any>;
    allActions: any[] = [];
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourceAction: any = [];
    public auditHisory: AuditHistory[] = [];
    private bodyText: string;
    closeResult: string;
    selectedColumn: any[];
    selectedInterColumn: any[];
    selectedShipViaColumn: any[];
    selectedShipViaColumns: any[];
    cols: any[] = [
        { field: 'tagName', header: 'TagName' },
        { field: 'attention', header: 'Attention' },
        { field: 'siteName', header: 'Site Name' },
        { field: 'address1', header: 'Address1' },
        { field: 'address2', header: 'Address2' },
        { field: 'city', header: 'City' },
        { field: 'stateOrProvince', header: 'State/Prov' },
        { field: 'postalCode', header: 'Postal Code' },
        { field: 'countryName', header: 'Country' },
        { field: 'isPrimary', header: 'IsPrimary' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' }
    ];
    internationalShippingHeaders = [
        { field: 'isPrimary', header: 'IsPrimary' },
        { field: 'exportLicense', header: 'Export License' },
        { field: 'description', header: 'Description' },
        { field: 'startDate', header: 'Start Date' },
        { field: 'expirationDate', header: 'Expiration Date' },
        { field: 'amount', header: 'Amount', width: "70px" },
        { field: 'shipToCountry', header: 'Country' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' }
    ]
    selectedInternationalColumns = this.internationalShippingHeaders;
    selectedColumns: any[] = this.cols;
    shipViacols: any[];
    shipViaColumns: any[];
    title: string = "Create";
    id: number;
    errorMessage: any;
    modal: NgbModalRef;
    actionName: string;
    Active: string = "Active";
    length: number;
    localCollection: any;
    allCountryinfo: any[];
    disablesave: boolean;
    countrycollection: any;
    selectedCountries: any;
    private isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    isEditShippingInfo: boolean = false;
    //isEditIntShippingInfo: boolean = false;
    selectedRowforDelete: any;
    selectedRowforRestorDomesticShipVia: any;
    selectedInterRowforDelete: any = {};
    selectedInterShipViaRowforDelete: any = {};
    auditHistory: any = [];
    formData = new FormData();
    totalRecords: number = 0;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number = 0;
    isPrimaryshipvia: any;
    public sourceVendor: any = {};
    textDomesticMemo: any;
    textInternationalMemo: any;
    disableShipVia: boolean = false;
    disableEditor: any = true;

    isvendorEditMode: any;
    internationalShippingData: any = [];
    internationalShippingDataListOriginal: any[];
    internationalShippingInfo = new CustomerInternationalShippingModel()
    isEditInternational: any;
    shipViaInternational: any;
    sourceViewforInterShipping: any;
    intershippingViaauditHisory: any;
    shipViaIntercols = [
        { field: 'shipViaName', header: 'Ship Via' },
        { field: 'shippingAccountInfo', header: 'Shipping Account Info' },
        { field: 'memo', header: 'Memo' }
    ];
    selectedShipViaInterColumns: any = [];
    auditHistoryInterShipvia: any = [];
    isEditInterShipVia: boolean = false;
    isEditDomesticShipVia: boolean = false;
    interShippingViaView: any = {};
    currentstatus: string = 'Active';
    currentDeletedstatus: boolean = false;
    domesticShippingViaView: any = {};
    pageSizeForInt: number = 10;
    selectedOnly: boolean = false;
    targetData: any;
    pageSizeForDomestic: number = 10;
    pageSizeForShipViaDomestic: number = 10;
    pageSizeForShipViaInt: number = 10;
    loaderForDomesticShipping: boolean;
    loaderForDomesticShipVia: boolean;
    loaderForInterShipping: boolean;
    loaderForInterShipVia: boolean;
    shipViaDropdownList: any;
    domesticShippingData: any[] = [];
    currentstatus1: string = 'Active';
    currentstatus2: string = 'Active';
    vendorData: any = {};
    enableCheckForDomestic: boolean = false;
    enableCheckForInternational: boolean = false;
    arrayDomesricShipIdlist: any[] = [];
    domesticSieList: any[];
    domesticSieListOriginal: any[];
    changeName: boolean = false;
    isSiteNameAlreadyExists: boolean = false;
    disableSaveSiteName: boolean;
    domesticShippingOriginalInfo: any[];
    disableSaveDomesticSite: boolean = true;
    disableSaveInternationalSite: boolean = true;
    currentDeletedstatusShipVia: boolean = false;
    currentDeletedstatusInternationalShipVia: boolean = false;
    selectedDomesticVendorShippingAddressId: any;
    disableSaveForEditShipVia: boolean = true;
    disableSaveForEditShipViaInternational: boolean = true;
    restoreDomesticRecord: any = {};
    selectedRowRestoreInternationalShipping: any = {};
    shipViaNewObj: any = {};
    domesitcshippingData: any = {};
    shipppingDetails: any = {};
    originalTableDataDomestic: any = [];
    originalTableDataInternanl: any = []
    currentDeletedstatusDomestic: boolean = false;
    currentDeletedstatusIntenational: boolean = false;
    isActivStatus: any = "Active";
    isActivIntStatus: any = "Active";
    vendorHistoryRowData: any = {};
    vendorIntHistoryRowData: any = {};
    selectedVendorInternationalShippingId: any;
    selectedShipViaInterHistory: any = {};
    disableSaveShippingCountry: boolean = true;
    disableSaveShippingIntCountry: boolean = true;
    editSiteName: string = '';
    arrayTagNamelist: any = [];
    tagNamesList: any = [];
    allActionsOriginal: any[];
    isAdd: boolean = true;
    isEdit: boolean = true;
    isDelete: boolean = true;
    isDownload: boolean = true;
    isShippingView: boolean = true;
    isNextVisible: Boolean=true;
    isPrevVisible: Boolean=true;
    constructor(private http: HttpClient, private router: Router,
        private authService: AuthService, private modalService: NgbModal, private activeRoute: ActivatedRoute, private commonService: CommonService, private configurations: ConfigurationService, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public vendorService: VendorService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private datePipe: DatePipe) {
        //this.vendorId = this.activeRoute.snapshot.params['id'];
        if (window.localStorage.getItem('vendorService')) {
            var obj = JSON.parse(window.localStorage.getItem('vendorService'));
            if (obj.listCollection && this.activeRoute.snapshot.params['id']) {
                this.vendorService.checkVendorEditmode(true);
                this.vendorService.isEditMode = true;
                this.vendorService.listCollection = obj.listCollection;
                this.vendorService.indexObj.next(obj.activeIndex);
                this.vendorService.enableExternal = true;
                this.vendorId = this.activeRoute.snapshot.params['id'];
                this.vendorService.vendorId = this.vendorId;
                this.vendorService.listCollection.vendorId = this.vendorId;
                if (this.vendorId > 0) {
                    this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                        res => {
                            this.local = res[0];
                        }, err => {
                            this.isSpinnerVisible = false;
                            //const errorLog = err;
                            //this.saveFailedHelper(errorLog);
                        });
                }
            }
        }
        if (this.vendorService.listCollection !== undefined) {
            this.vendorService.isEditMode = true;
        }
        this.shipViaObj.isPrimary = false;
        this.dataSource = new MatTableDataSource();
        if (this.local) {
            this.vendorService.contactCollection = this.local;
        }
        if (this.vendorService.generalCollection) {
            this.local = this.vendorService.generalCollection;
        }
        if (this.vendorService.paymentCollection) {
            this.local = this.vendorService.paymentCollection;
        }
        this.dataSource = new MatTableDataSource();
        if (this.vendorService.listCollection && this.vendorService.isEditMode == true) {
            this.local = this.vendorService.listCollection.t;
        }
        if (this.vendorService.paymentCollection) {
            this.local = this.vendorService.paymentCollection;
            this.sourceVendor.siteName = this.local.vendorName;
            this.sourceVendor.address1 = this.local.address1;
            this.sourceVendor.address2 = this.local.address2;
            this.sourceVendor.city = this.local.city;
            this.sourceVendor.countryId = this.local.countryId;
            this.sourceVendor.stateOrProvince = this.local.stateOrProvince;
            this.sourceVendor.postalCode = this.local.PostalCode;
        }
        if (this.vendorService.listCollection && this.vendorService.isEditMode == true) {
            this.viewName = "Edit";
            this.local = this.vendorService.listCollection;
            //this.loadData();
        }

        this.isAdd = this.authService.checkPermission([ModuleConstants.Vendors_ShippingInformation + '.' + PermissionConstants.Add])
        this.isEdit = this.authService.checkPermission([ModuleConstants.Vendors_ShippingInformation + '.' + PermissionConstants.Update])
        this.isDelete = this.authService.checkPermission([ModuleConstants.Vendors_ShippingInformation + '.' + PermissionConstants.Delete])
        this.isDownload = this.authService.checkPermission([ModuleConstants.Vendors_ShippingInformation + '.' + PermissionConstants.Download])
        this.isShippingView = this.authService.checkPermission([ModuleConstants.Vendors_ShippingInformation + '.' + PermissionConstants.View])

        this.isNextVisible=this.authService.ShowTab('Create Vendor','Warnings');
        this.isPrevVisible=this.authService.ShowTab('Create Vendor','Payment Information');
    }

    ngOnInit() {
        this.vendorService.currentEditModeStatus.subscribe(message => {
            this.isvendorEditMode = message;
        });
        if (this.vendorId > 0) {
            this.loadData();
            this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-shipping-information/${this.vendorId}';
        }
        else {
            this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-shipping-information';
            this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
        }
        this.getshipvialistList();
        if (!this.isViewMode) {
            this.getInternationalShippingByVendorId();
            this.countrylist();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isViewMode) {
            if (this.isShippingView) {
                this.getInternationalShippingByVendorId();
            }
        }

        for (let property in changes) {
            if (property == 'selectedCustomerTab') {
                if (changes[property].currentValue != {} && changes[property].currentValue == "Shipping") {
                    this.loadData();
                    this.getInternationalShippingByVendorId();
                    this.getshipvialistList()
                }
            }
        }
    }

    getFormatedDate(date) {
        if (date) {
            let actualDate = new Date(date);
            return `${actualDate.getMonth()}/${actualDate.getDate()}/${actualDate.getFullYear()} ${actualDate.getHours()}:${actualDate.getMinutes()}`;
        }
        return date;
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    parsedText(text) {

        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }
    // memoType:any;
    onSaveDomesticMemo() {
        this.shipViaObj.memo = this.textDomesticMemo;
        this.textDomesticMemo = '';
        this.disableShipVia = false;
        $("#textarea-popup1").modal("hide");

    }

    onSaveInternationalMemo() {
        this.shipViaInterObj.memo = this.textInternationalMemo;
        this.textInternationalMemo = '';
        $("#textarea-popup2").modal("hide");
        this.disableShipVia = false;
    }
    onAddDomesticMemo() {
        this.textDomesticMemo = this.shipViaObj.memo;
        this.disableEditor = true;
        this.enableSaveDomeSticShipVia();
    }
    onAddInternationalmemo() {
        this.textInternationalMemo = this.shipViaInterObj.memo;
        this.disableEditor = true;
        this.enableSaveInternationalShipVia();
    }

    onCloseTextAreaInfo(type) {
        if (type == 1) {
            $("#textarea-popup1").modal("hide");
        } else if (type == 2) {
            $("#textarea-popup2").modal("hide");
        }
    }
    editorgetmemo() {
        this.disableEditor = false;
        this.disableShipVia = false;
    }

    getshipvialistList() {
        //this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name').subscribe(res => {
        this.commonService.autoSuggestionSmartDropDownList('ShippingVia', 'ShippingViaId', 'Name', '', true, 0, '', this.currentUserMasterCompanyId).subscribe(res => {
            this.shipViaDropdownList = res.map(x => {
                return {
                    ...x,
                    id: x.value,
                    name: x.label
                }
            });
        }, error => { this.isSpinnerVisible = false; }) // this.onDataLoadFailed(error))
    }

    private loadData() {
        this.isSpinnerVisible = true;
        const vendorId = this.vendorId != 0 ? this.vendorId : this.local.vendorId;
        const newvendorId = vendorId ? vendorId : this.activeRoute.snapshot.params['id'];
        this.vendorService.getVendorShipAddressGet(newvendorId).subscribe(
            results => {
                this.onDataLoadSuccessful(results[0]);
                this.isSpinnerVisible = false;
            },
            error => { this.isSpinnerVisible = false; }
        );
    }

    private countrylist() {
        this.isSpinnerVisible = true;
        this.vendorService.getCountrylist().subscribe(
            results => this.onDatacountrySuccessful(results[0]),
            error => { this.isSpinnerVisible = false; }
        );
    }

    private onDatacountrySuccessful(allWorkFlows: any[]) {
        this.isSpinnerVisible = false;
        this.dataSource.data = allWorkFlows;
        this.allCountryinfo = allWorkFlows;
    }

    private loadShipViaCollection(vendorShippingAddressId) {
        this.isSpinnerVisible = true;
        this.loaderForDomesticShipVia = true;
        this.vendorService.getVendorShipViaDetails(vendorShippingAddressId, this.currentDeletedstatusShipVia).subscribe(
            results => {
                this.loaderForDomesticShipVia = false;
                this.onShipViadetails(results[0])
            },
            error => {
                //this.onDataLoadFailed(error)
                this.isSpinnerVisible = false;
                this.loaderForDomesticShipVia = false;
            }
        );
        this.shipViacols = [
            { field: 'shipViaName', header: 'Ship Via' },
            { field: 'shippingAccountInfo', header: 'Shipping Account Info' },
            { field: 'memo', header: 'Memo' }
        ];
        this.selectedShipViaColumns = this.shipViacols;
    }

    openShipViaEdit(rowObject) {
        this.disableSaveForEditShipVia = true;
        this.domesitcshippingData = rowObject;
        this.isEditMode = true;
        this.isSaving = true;
        this.isPrimaryshipvia = rowObject.isPrimary;
        this.shipViaObj = { ...rowObject };
        this.isEditDomesticShipVia = true;
        //this.loadMasterCompanies();
    }

    updateActiveorInActiveShipViaForDS(rowData) {
        this.vendorService.updateStatusForDomesticShippingVia(rowData.vendorShippingId, rowData.isActive, this.userName).subscribe(res => {
            this.loadShipViaCollection(rowData.vendorShippingAddressId);
            this.alertService.showMessage(
                'Success',
                `Sucessfully Updated Domestic Ship Via Status`,
                MessageSeverity.success
            );
        }, error => { this.isSpinnerVisible = false; }) //this.saveFailedHelper(error))
    }

    // private loadMasterCompanies() {
    //     this.isSpinnerVisible = true;
    //     this.masterComapnyService.getMasterCompanies().subscribe(
    //         results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    openClassification(content) {
    }

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceVendor = rowData;
        }
        else {
            this.sourceVendor = rowData;
        }
    }

    // private refresh() {
    //     this.applyFilter(this.dataSource.filter);
    // }

    private onDataLoadSuccessful(allWorkFlows: any) {
        this.dataSource.data = allWorkFlows;
        this.originalTableDataDomestic = allWorkFlows;
        if (this.originalTableDataDomestic.length == 0) {
            this.enableCheckForDomestic = true;
        } else {
            this.enableCheckForDomestic = false;
        }
        this.geListByStatusDomsetic(this.isActivStatus ? this.isActivStatus : this.currentstatus1);
    }

    private onShipViadetails(allWorkFlows: any) {
        this.dataSource.data = allWorkFlows;
        this.allShipViaDetails = allWorkFlows;
        this.isSpinnerVisible = false;
    }

    filterActions(event) {
        this.localCollection = [];
        for (let i = 0; i < this.allActions.length; i++) {
            let actionName = this.allActions[i].description;
            if (actionName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(actionName);
            }
        }
    }

    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
        this.isSpinnerVisible = false;
        this.auditHisory = auditHistory;
    }

    private onAuditHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
        this.isSpinnerVisible = false;
        this.shippingauditHisory = auditHistory;
    }

    // private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
    //     this.allComapnies = allComapnies;
    //     this.isSpinnerVisible = false;
    // }

    private onDataLoadFailed(error: any) {
        this.isSpinnerVisible = false;
    }

    open(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        //this.loadMasterCompanies();
        this.actionName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openDelete(content, row) {
        if (!row.isPrimary) {
            this.isEditMode = false;
            this.isDeleteMode = true;
            this.localCollection = row;
            this.selectedRowforDelete = row;
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        } else {
            $('#deleteshipping').modal('show');
        }
    }

    restoreDomesticShippingVia(content, row) {
        this.localCollection = row;
        this.selectedRowforRestorDomesticShipVia = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    onAddDomesticSiteInfo() {
        this.sourceVendor = {};
        this.isEditShippingInfo = false;
        this.isSiteNameAlreadyExists = false;
        this.arrayTagNamelist = [];
        this.getAllTagNameSmartDropDown('');
    }

    openEdit(row) {
        this.isEditMode = true;
        this.isSaving = true;
        this.arrayDomesricShipIdlist = [];
        this.sourceVendor = { ...row, countryId: getObjectById('countries_id', row.countryId, this.allCountryinfo) };
        this.sourceVendor['tempIsPrimary'] = this.sourceVendor.isPrimary

        if (row.contactTagId > 0) {
            this.arrayTagNamelist.push(row.contactTagId);
            this.getAllTagNameSmartDropDown('', row.contactTagId);
        }

        if (this.arrayDomesricShipIdlist.length == 0) {
            this.arrayDomesricShipIdlist.push(row.vendorShippingAddressId);
        }
        this.commonService.autoSuggestionSmartDropDownListWtihColumn('VendorShippingAddress', 'VendorShippingAddressId', 'SiteName', '', 'VendorId', this.vendorId, 20, this.arrayDomesricShipIdlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.domesticSieListOriginal = response.map(x => {
                return {
                    siteName: x.label, value: x.value
                }
            })
            this.domesticSieList = [...this.domesticSieListOriginal];
            this.sourceVendor = {
                ...this.sourceVendor,
                siteName: getObjectByValue('siteName', row.siteName, this.domesticSieListOriginal)
            };
            this.editSiteName = row.siteName;
            this.domesticShippingOriginalInfo = this.sourceVendor;
        }, err => {
            //const errorLog = err;
            //this.saveFailedHelper(errorLog)
            this.isSpinnerVisible = false;
        });

        //this.loadMasterCompanies();
        this.isEditShippingInfo = true;
        this.disableSaveDomesticSite = true;
    }

    openView(content, row) {
        this.sourceVendor = row;
        this.isPrimary = row.isPrimary;
        this.siteName = row.siteName;
        this.address1 = row.address1;
        this.city = row.city;
        this.stateOrProvince = row.stateOrProvince;
        this.postalCode = row.postalCode;
        this.country = row.countryName;
        this.address2 = row.address2;
        this.createdBy = row.createdBy;
        this.updatedBy = row.updatedBy;
        this.createddate = row.createdDate;
        this.updatedDate = row.updatedDate;
        //this.loadMasterCompanies();
        this.openShipVia(row);
        this.getVendorBasicData(row.vendorId);
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    getVendorBasicData(vendorId) {
        this.vendorService.getVendorDataById(vendorId).subscribe(res => {
            this.vendorData = res;
        });
    }

    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openHist(content, row) {
        this.isSpinnerVisible = true;
        this.shipViaObj = {};
        this.isSaving = true;
        this.vendorService.shipviaHistory(row.vendorShippingId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => { this.isSpinnerVisible = false; }) //this.saveFailedHelper(error));
    }

    openShipaddressHistory(content, row) {
        this.isSpinnerVisible = true;
        this.sourceVendor = row;
        this.isSaving = true;
        this.vendorService.getShipaddressHistory(this.sourceVendor.vendorId, this.sourceVendor.vendorShippingAddressId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results, content),
            error => { this.isSpinnerVisible = false; }) //this.saveFailedHelper(error));
    }
    closeDomesticDeleteModal() {
        $("#downloadDomesticConfirmation").modal("hide");
    }
    closeInternDeleteModal() {
        $("#downloadInternConfirmation").modal("hide");
    }

    exportCSV(domesticShipInfo) {
        domesticShipInfo._value = domesticShipInfo._value.map(x => {
            return {
                ...x,
                createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
            }
        });
        domesticShipInfo.exportCSV();
    }

    exportInternCSV(interShipInfo) {
        interShipInfo._value = interShipInfo._value.map(x => {
            return {
                ...x,
                createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
            }
        });
        interShipInfo.exportCSV();
    }


    editItemAndCloseModel() {
        this.isSaving = true;
        if (this.sourceVendor.siteName && this.sourceVendor.address1 && this.sourceVendor.city &&
            this.sourceVendor.stateOrProvince && this.sourceVendor.postalCode && this.sourceVendor.countryId) {
            if (!this.sourceVendor.vendorId) {
                this.sourceVendor.createdBy = this.userName;
                this.sourceVendor.updatedBy = this.userName;
                this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;
                this.sourceVendor.isPrimary = this.sourceVendor.isPrimary ? this.sourceVendor.isPrimary : false;
                this.sourceVendor.vendorId = this.local.vendorId;
                this.sourceVendor.siteName = editValueAssignByCondition('siteName', this.sourceVendor.siteName),
                    this.sourceVendor.countryId = editValueAssignByCondition('countries_id', this.sourceVendor.countryId);
                this.sourceVendor.contactTagId = editValueAssignByCondition('contactTagId', this.sourceVendor.tagName);
                this.vendorService.newShippingAdd(this.sourceVendor).subscribe(data => {
                    this.localCollection = data;
                    this.loadData();
                    this.savesuccessCompleted(this.sourceVendor);
                    this.sourceVendor = {};
                    this.disableSaveDomesticSite = true;
                }, error => { this.isSpinnerVisible = false; }) //this.saveFailedHelper(error))
            }
            else {
                this.sourceVendor.createdBy = this.userName;
                this.sourceVendor.updatedBy = this.userName;
                this.sourceVendor.siteName = editValueAssignByCondition('siteName', this.sourceVendor.siteName),
                    this.sourceVendor.countryId = editValueAssignByCondition('countries_id', this.sourceVendor.countryId);
                this.sourceVendor.contactTagId = editValueAssignByCondition('contactTagId', this.sourceVendor.tagName);
                this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;
                this.sourceVendor.isPrimary = this.sourceVendor.isPrimary ? this.sourceVendor.isPrimary : false;
                this.vendorService.updateshippinginfo(this.sourceVendor).subscribe(data => {
                    this.updatedCollection = data;
                    this.loadData();
                    this.sourceVendor = {};
                    this.alertService.showMessage("Success", `Record was edited successfully`, MessageSeverity.success);
                    this.disableSaveDomesticSite = true;
                }, error => { this.isSpinnerVisible = false; }) //this.saveFailedHelper(error))
            }
        }

        $('#addShippingInfoDomestic').modal('hide');
    }

    saveVendorShipViaDetails() {
        this.isSaving = true;
        if (this.shipViaObj.shipViaId == null || this.shipViaObj.shipViaId == "") {
            this.alertService.showMessage("Empty", 'Cannot Submit Empty', MessageSeverity.warn);
            return;
        }
        if (this.shipViaObj.vendorShippingId > 0) {
            this.shipViaObj.createdBy = this.userName;
            this.shipViaObj.updatedBy = this.userName;
            this.shipViaObj.masterCompanyId = this.currentUserMasterCompanyId;
            this.shipViaObj.isActive = true;
            this.shipViaObj.isPrimary = this.allShipViaDetails.length == 0 ? true : this.isPrimaryshipvia;
            const newshipviaobj = this.shipViaObj;
            newshipviaobj.isPrimary = this.allShipViaDetails.length == 0 ? true : this.isPrimaryshipvia;
            newshipviaobj.vendorId = this.shipViaNewObj.vendorId;
            newshipviaobj.vendorShippingAddressId = this.shipViaNewObj.vendorShippingAddressId;
            this.vendorService.updateshippingViainfo(newshipviaobj).subscribe(data => {
                this.shipViaCollection = data;
                this.alertService.showMessage("Success", `Saved Data successfully`, MessageSeverity.success);
                this.loadShipViaCollection(this.shipViaCollection.vendorShippingAddressId);
                if (this.shipViaCollection) {
                    this.shipViaObj.shipViaId = "";
                    this.shipViaObj.shippingAccountInfo = "";
                    this.shipViaObj.shippingURL = "";
                    this.shipViaObj.shippingId = "";
                    this.shipViaObj.memo = "";
                    this.shipViaObj.vendorShippingId = 0;
                    this.shipViaObj.isPrimary = false;
                    this.isPrimaryshipvia = false;
                }
                this.isEditDomesticShipVia = false;
                this.shipViaObj.shipViaId = null;
            }, error => {
                this.alertService.showStickyMessage("Save Error", "Data already exits", MessageSeverity.error);

            })
        }
        else {
            this.shipViaObj.createdBy = this.userName;
            this.shipViaObj.updatedBy = this.userName;
            this.shipViaObj.masterCompanyId = this.currentUserMasterCompanyId;
            this.shipViaObj.isActive = true;
            this.shipViaObj.isPrimary = this.allShipViaDetails.length == 0 ? true : this.isPrimaryshipvia;
            const newshipviaobj = this.shipViaObj;
            newshipviaobj.isPrimary = this.allShipViaDetails.length == 0 ? true : this.isPrimaryshipvia;
            newshipviaobj.vendorId = this.shipViaNewObj.vendorId;
            newshipviaobj.vendorShippingAddressId = this.shipViaNewObj.vendorShippingAddressId;
            this.vendorService.newShippingViaAdd(newshipviaobj).subscribe(data => {
                this.alertService.showMessage("Success", `Saved Data successfully`, MessageSeverity.success);
                this.shipViaCollection = data;
                this.loadShipViaCollection(this.shipViaCollection.vendorShippingAddressId);
                if (this.shipViaCollection) {
                    this.shipViaObj.shipVia = "";
                    this.shipViaObj.shippingAccountInfo = "";
                    this.shipViaObj.shippingURL = "";
                    this.shipViaObj.shippingId = "";
                    this.shipViaObj.memo = "";
                    this.shipViaObj.isPrimary = false;
                    this.isPrimaryshipvia = false;
                    this.shipViaObj.vendorShippingId = 0;
                }
                this.shipViaObj.shipViaId = null;
                this.isEditDomesticShipVia = false;
            }, error => {
                this.alertService.showStickyMessage("Save Error", "Data already exits", MessageSeverity.error);
            })
        }
    }

    previousClick() {
        this.activeIndex = 7;
        this.vendorService.changeofTab(this.activeIndex);
    }


    openShipVia(rowData) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.shipViaNewObj = rowData;
        this.selectedDomesticVendorShippingAddressId = rowData.vendorShippingAddressId;
        this.isPrimaryshipvia = false;
        if (this.allShipViaDetails.length == 0) {
            this.isPrimaryshipvia = true;
        }
        this.shipViaObj.shipVia = "";
        this.shipViaObj.shippingAccountInfo = "";
        this.shipViaObj.shippingURL = "";
        this.shipViaObj.shippingId = "";
        this.shipViaObj.memo = "";
        this.isSaving = true;
        this.loadShipViaCollection(rowData.vendorShippingAddressId);
        //this.loadMasterCompanies();
        this.sourceAction.isActive = true;
        this.getVendorBasicData(rowData.vendorId);
    }

    updateVendorShippingAddress(updateObj: any) {

        this.vendorService.updateVendorShippingAddressDetails(updateObj, this.local.vendorId).subscribe(data => {
            this.vendorshippingAddressdetails = data;
            this.vendorService.newShippingAddWithAddress(this.sourceVendor, this.vendorshippingAddressdetails.vendorShippingAddressId).subscribe(data => {
                this.localCollection = data;
                this.updateVendorShippingAddress(this.localCollection);
            })
            this.loadData();
        }, error => { this.isSpinnerVisible = false; }) //this.saveFailedHelper(error))
    }

    deleteVendorShippingAddress() {
        this.isSaving = true;
        this.localCollection.isActive = false;
        this.localCollection.addressStatus = false;
        this.localCollection.updatedBy = this.userName;
        this.vendorService.deleteVendorShippingAddress(this.localCollection).subscribe(
            response => this.saveCompleted(this.sourceVendor),
            error => { this.isSpinnerVisible = false; }) //this.saveFailedHelper(error));
        this.modal.close();
    }

    deleteItemDomesticShipViaCloseModel() {
        this.isSaving = true;
        this.localCollection.isActive = false;
        this.localCollection.addressStatus = false;
        this.localCollection.updatedBy = this.userName;

        this.vendorService.deleteVendorAcion(this.localCollection).subscribe(data => {
            this.alertService.showMessage("Success", `Record was deleted successfully`, MessageSeverity.success);
            this.loadShipViaCollection(this.localCollection.vendorShippingAddressId);
        }, error => { this.isSpinnerVisible = false; })
        this.modal.close();
    }

    restorevendorshippingViaCloseModel() {
        this.localCollection.updatedBy = this.userName;

        this.vendorService.restorevendorshippingVia(this.localCollection).subscribe(data => {
            this.alertService.showMessage("Success", `Record was Restore successfully`, MessageSeverity.success);
            this.loadShipViaCollection(this.localCollection.vendorShippingAddressId);
        }, error => { this.isSpinnerVisible = false; }) //error => this.saveFailedHelper(error))
        this.modal.close();
    }

    dismissShipViaDomesticModel() {
        $('#contentDomesticShipVia').modal('hide');
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    private saveCompleted(user?: any) {
        this.isSaving = false;
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Record was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
            this.isSpinnerVisible = false;
        }
        else {
            this.alertService.showMessage("Success", `Record was edited successfully`, MessageSeverity.success);
            this.isSpinnerVisible = false;
        }
        this.loadData();
    }

    private savesuccessCompleted(user?: any) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Record was added successfully`, MessageSeverity.success);
        this.loadData();
    }

    private saveSuccessHelper(role?: any) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Record was created successfully`, MessageSeverity.success);
        this.loadData();
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        this.isSpinnerVisible = false
    }

    toggledbldisplay(data) {
        this.sourceVendor = data;
    }

    nextClick() {
        if (this.local) {
            this.vendorService.shippingCollection = this.local;
        }
        this.activeIndex = 9;
        this.vendorService.changeofTab(this.activeIndex);
    }
    domesticdateFilterForTable(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.allActions = this.allActionsOriginal;
            const data = [...this.allActions.filter(x => {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.allActions = data;
        } else {
            this.allActions = this.allActionsOriginal;
        }
    }


    handleChanges(rowData, e) {
        if (e.checked == false) {
            this.sourceVendor = rowData;
            this.sourceVendor.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceVendor.isActive == false;
            if (this.sourceVendor.isPrimary == null) {
                this.sourceVendor.isPrimary = false;
            }
            this.isSpinnerVisible = true;
            this.vendorService.updateActionforActiveforshipping(this.sourceVendor).subscribe(
                response => {
                    this.alertService.showMessage("Success", `Record was In-Activated successfully`, MessageSeverity.success);
                    this.loadData();
                    this.isSpinnerVisible = false;
                }, error => { this.isSpinnerVisible = false; }) //this.saveFailedHelper(error));
            this.sourceVendor = "";
        }
        else {
            this.sourceVendor = rowData;
            this.sourceVendor.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceVendor.isActive == true;
            this.isSpinnerVisible = true;
            this.vendorService.updateActionforActiveforshipping(this.sourceVendor).subscribe(
                response => {
                    this.alertService.showMessage("Success", `Record was Activated successfully`, MessageSeverity.success);
                    this.loadData();
                    this.isSpinnerVisible = false;
                }, error => { this.isSpinnerVisible = false; })
            this.sourceVendor = "";
        }
    }

    onCountrieselected(event) {
        if (this.allCountryinfo) {
            for (let i = 0; i < this.allCountryinfo.length; i++) {
                if (event == this.allCountryinfo[i].nice_name) {
                    this.sourceVendor.nice_name = this.allCountryinfo[i].nice_name;
                    this.disablesave = false;
                    this.selectedCountries = event;
                }
            }
            this.disableSaveShippingCountry = false;
        }
    }


    eventCountryHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedCountries) {
                if (value == this.selectedCountries.toLowerCase()) {
                    this.disablesave = false;
                }
                else {
                    this.disablesave = true;
                }
            } else {
                this.disableSaveShippingCountry = true;
            }
        } else {
            this.disableSaveShippingCountry = true;
        }
    }

    onIntCountrieselected(event) {
        if (this.allCountryinfo) {
            for (let i = 0; i < this.allCountryinfo.length; i++) {
                if (event == this.allCountryinfo[i].nice_name) {
                    this.sourceVendor.nice_name = this.allCountryinfo[i].nice_name;
                    this.disableSaveInternationalSite = false;
                    this.selectedCountries = event;
                }
            }
            this.disableSaveShippingIntCountry = false;
        }
    }

    eventIntCountryHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedCountries) {
                if (value == this.selectedCountries.toLowerCase()) {
                    this.disableSaveInternationalSite = false;
                }
                else {
                    this.disableSaveInternationalSite = true;
                }
            } else {
                this.disableSaveShippingIntCountry = true;
            }
        } else {
            this.disableSaveShippingIntCountry = true;
        }
    }


    filtercountry(event) {
        this.countrycollection = this.allCountryinfo;
        if (event.query !== undefined && event.query !== null) {
            const countries = [...this.allCountryinfo.filter(x => {
                return x.nice_name.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.countrycollection = countries;
        }
    }

    onShipVia(event) {
        if (this.allShipViaDetails) {
            for (let i = 0; i < this.allShipViaDetails.length; i++) {
                if (event == this.allShipViaDetails[i].shipVia) {
                    this.shipViaObj.shipVia = this.allShipViaDetails[i].shipVia;
                    this.selectedShipVia = event;
                }
            }
        }
    }

    eventShipviaHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedShipVia) {
                if (value == this.selectedShipVia.toLowerCase()) {
                    this.disablesave = true;
                }
                else {
                    this.disablesave = false;
                }
            }
        }
    }

    filterShipVia(event) {
        this.shipviacollection = [];
        if (this.allShipViaDetails.length > 0) {
            for (let i = 0; i < this.allShipViaDetails.length; i++) {
                let shipName = this.allShipViaDetails[i].shipVia;
                if (shipName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.shipviacollection.push(shipName);
                }
            }
        }
    }

    shippingInfoHistory(rowData) {
        this.vendorHistoryRowData = rowData;
        this.vendorService.getShipaddressHistory(rowData.vendorId, rowData.vendorShippingAddressId).subscribe(res => {
            this.auditHistory = res;
        }, error => { this.isSpinnerVisible = false; })
        this.getVendorBasicData(rowData.vendorId);
    }

    closeAddShipViaDomestic() {
        this.modal.close();
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

    onAddShippingInfo() {
        this.isEditInternational = false;
        this.sourceVendor = {};
        this.internationalShippingInfo = new CustomerInternationalShippingModel();
        if (this.enableCheckForInternational) {
            this.internationalShippingInfo.isPrimary = true;
        } else {
            this.internationalShippingInfo.isPrimary = false;
        }
        if (this.enableCheckForDomestic) {
            this.sourceVendor.isPrimary = true;
        } else {
            this.sourceVendor.isPrimary = false;
        }
        this.isEditShippingInfo = false;
    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=VendorShipingAddress&fileName=VendorShippingAddress.xlsx`;
        window.location.assign(url);
    }

    sampleExcelInternationationalsDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=VendorInternationalShipping&fileName=VendorInternationalShipping.xlsx`;
        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;
        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.vendorService.ShippingFileUpload(this.formData, this.local.vendorId).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.loadData();

                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
            }, error => { this.isSpinnerVisible = false; })
        }
    }

    internexlupload(event) {
        const file = event.target.files;

        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.vendorService.InternationalShippingFileUpload(this.formData, this.local.vendorId).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.getInternationalShippingByVendorId();

                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
            }, error => { this.isSpinnerVisible = false; })
        }
    }

    getVendorName() {
        if (this.local !== undefined) {
            return editValueAssignByCondition('vendorName', this.local.vendorName) === undefined ? '' : editValueAssignByCondition('vendorName', this.local.vendorName);
        } else {
            return '';
        }
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    getColorCodeForInterShipViaHistory(i, field, value) {
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

    getColorCodeForInternnationalShipViaHistory(i, field, value) {
        const data = this.auditHistoryInterShipvia;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    getColorCodeForInternationalHistory(i, field, value) {
        const data = this.intershippingViaauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    saveInternationalShipping() {
        const data = {
            ...this.internationalShippingInfo,
            shipToCountryId: getValueFromObjectByKey('countries_id', this.internationalShippingInfo.shipToCountryId),
            createdBy: this.userName,
            updatedBy: this.userName,
            masterCompanyId: this.currentUserMasterCompanyId,
            isActive: true,
            isDeleted: false,
            vendorId: this.local.vendorId
        }
        if (!this.isEditInternational) {
            this.vendorService.postInternationalShipping(data).subscribe((res) => {
                this.getInternationalShippingByVendorId()
                this.alertService.showMessage(
                    'Success',
                    `Saved International Shipping Information Sucessfully `,
                    MessageSeverity.success
                );
                this.isEditInternational = false;
            }, error => { this.isSpinnerVisible = false; })
        } else {
            this.vendorService.updateInternationalShipping(data).subscribe(res => {
                this.getInternationalShippingByVendorId()
                this.isEditInternational = false;
                this.alertService.showMessage(
                    'Success',
                    `Saved International Shipping Information Sucessfully `,
                    MessageSeverity.success
                );
            }, error => { this.isSpinnerVisible = false; })
        }
    }

    getInternationalShippingByVendorId() {
        const vendorId = this.vendorId != 0 ? this.vendorId : this.local.vendorId;
        const newvendorId = vendorId ? vendorId : this.activeRoute.snapshot.params['id'];
        this.isSpinnerVisible = true;
        this.vendorService.getInternationalShippingByVendorId(newvendorId).subscribe(res => {
            this.internationalShippingDataListOriginal = res;
            this.originalTableDataInternanl = res;
            this.isSpinnerVisible = false;
            if (this.originalTableDataInternanl.length == 0) {
                this.enableCheckForInternational = true;
            } else {
                this.enableCheckForInternational = false;
            }
            this.geListByStatusInternational(this.isActivIntStatus ? this.isActivIntStatus : 'Active')
        }, err => { this.isSpinnerVisible = false; })
    }

    closeInternationalModal() {
        $("viewInter").modal('hide');
        this.isEditInternational = false;
    }

    openInternationalView(rowData) {
        this.isSpinnerVisible = true;
        this.vendorService.getInternationalShippingById(rowData.vendorInternationalShippingId).subscribe(res => {
            this.sourceViewforInterShipping = res;
            this.isSpinnerVisible = false;
            if (this.sourceViewforInterShipping.startDate != null) {
                this.sourceViewforInterShipping.startDate = new Date(res.startDate);
            }
            if (this.sourceViewforInterShipping.expirationDate != null) {
                this.sourceViewforInterShipping.expirationDate = new Date(res.expirationDate);
            }
            this.sourceViewforInterShipping.shipToCountryId = getObjectById('countries_id', res.shipToCountryId, this.allCountryinfo);
            this.sourceViewforInterShipping['tempIsPrimary'] = this.sourceViewforInterShipping.isPrimary
            this.getVendorBasicData(rowData.vendorId);
            this.onClickInterShipvia(rowData)
            $("#viewInter").modal('show');
        }, error => { this.isSpinnerVisible = false; })
    }

    getInternationalShippingById(rowData) {
        this.isEditInternational = true;
        this.disableSaveInternationalSite = true;
        this.isSpinnerVisible = true;
        this.vendorService.getInternationalShippingById(rowData.vendorInternationalShippingId).subscribe(res => {
            this.internationalShippingInfo = res;
            if (this.internationalShippingInfo.startDate != null) {
                this.internationalShippingInfo.startDate = new Date(res.startDate);
            }
            if (this.internationalShippingInfo.expirationDate != null) {
                this.internationalShippingInfo.expirationDate = new Date(res.expirationDate);
            }
            this.internationalShippingInfo.shipToCountryId = getObjectById('countries_id', res.shipToCountryId, this.allCountryinfo);
            this.internationalShippingInfo['tempIsPrimary'] = this.internationalShippingInfo.isPrimary;
            this.isSpinnerVisible = false;

        }, error => { this.isSpinnerVisible = false; })
    }

    openInterShipHistory(rowData) {
        this.vendorIntHistoryRowData = rowData;
        this.getVendorBasicData(rowData.vendorId);
        this.vendorService.getVendorInternationalAuditHistory(rowData.vendorInternationalShippingId).subscribe(
            results => this.onAuditInterShipViaHistoryLoadSuccessful(results),
            error => { this.isSpinnerVisible = false; })
    }

    private onAuditInterShipViaHistoryLoadSuccessful(auditHistory) {
        this.intershippingViaauditHisory = auditHistory;
    }

    deleteVendorInterShipping(row) {
        if (!row.isPrimary) {
            this.selectedInterRowforDelete = row;
            $('#deleteInterShipInfo').modal('show');
        } else {
            $('#deleteshipping').modal('show');
        }
    }

    confirmDeleteVendorInterShipping() {
        this.vendorService.deleteVendorInternationalShipping(this.selectedInterRowforDelete.vendorInternationalShippingId, this.userName).subscribe(res => {
            this.alertService.showMessage(
                'Success',
                `Record was Deleted Sucessfully `,
                MessageSeverity.success
            );
            this.getInternationalShippingByVendorId();
            $('#deleteInterShipInfo').modal('hide');
        }, error => { this.isSpinnerVisible = false; })
    }

    changeOfStatusForInternationalShipping(rowData, e) {
        this.vendorService.updateStatusForInternationalShipping(rowData.vendorInternationalShippingId, e.checked, this.userName).subscribe(res => {
            if (e.checked) {
                this.alertService.showMessage('Success', `Record was In-Activated sucessfully.`, MessageSeverity.success);
            }
            else {
                this.alertService.showMessage('Success', `Record was Activated sucessfully.`, MessageSeverity.success);
            }
            this.getInternationalShippingByVendorId();
        }, error => { this.isSpinnerVisible = false; })
    }

    openDomesticShippingViewVia(rowData) {
        this.domesticShippingViaView = {};
        this.domesticShippingViaView = rowData;
    }

    openDomesticShipViaonDbl(rowData) {
        this.openDomesticShippingViewVia(rowData);
        $('#viewDomesticShipVia').modal('show');
    }

    dismissShipViaInterModel() {
        $('#internationalShipVia').modal('hide');
        this.disableSaveForEditShipViaInternational = true;
    }

    onClickInterShipvia(rowData) {
        this.shipppingDetails = rowData
        this.shipViaInterObj = {};
        this.shipViaInterObj.vendorInternationalShippingId = rowData.vendorInternationalShippingId;
        this.loadShipViaInterCollection(rowData);
    }

    filterInterShipVia(event) {
        this.shipviaIntercollection = [];
        if (this.allShipViaInterDetails.length > 0) {
            for (let i = 0; i < this.allShipViaInterDetails.length; i++) {
                let shipName = this.allShipViaInterDetails[i].shipVia;
                if (shipName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.shipviaIntercollection.push(shipName);
                }
            }
        }
    }

    onSelectInterShipVia(event) {
        if (this.allShipViaInterDetails) {
            for (let i = 0; i < this.allShipViaInterDetails.length; i++) {
                if (event == this.allShipViaInterDetails[i].shipVia) {
                    this.shipViaInterObj.shipVia = this.allShipViaInterDetails[i].shipVia;
                    this.selectedShipVia = event;
                }
            }
        }
    }

    saveInterShipViaDetails() {

        this.shipViaInterObj.createdBy = this.userName;
        this.shipViaInterObj.updatedBy = this.userName;
        this.shipViaInterObj.masterCompanyId = this.currentUserMasterCompanyId;
        this.shipViaInterObj.isActive = true;
        this.vendorService.saveInterShipViaDetails(this.shipViaInterObj).subscribe(data => {
            this.shipviaIntercollection = data;
            this.loadShipViaInterCollection(this.shipviaIntercollection);
            if (this.shipviaIntercollection) {
                this.shipViaInterObj.shipViaId = "";
                this.shipViaInterObj.shippingAccountInfo = "";
                this.shipViaInterObj.memo = "";
                this.shipViaInterObj.isPrimary = false;
                this.shipViaInterObj.vendorShippingId = 0;
                this.shipViaInterObj.vendorInternationalShipViaDetailsId = undefined;
            }
            if (this.isEditInterShipVia) {
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Updated Ship Via for International Shipping`,
                    MessageSeverity.success
                );
            } else {
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Added Ship Via for International Shipping`,
                    MessageSeverity.success
                );
            }
            this.isEditInterShipVia = false;
        }, error => {
            this.alertService.showStickyMessage("Save Error", "Data already exits", MessageSeverity.error);

        })
    }

    loadShipViaInterCollection(rowData) {
        this.loaderForInterShipVia = true;
        this.selectedVendorInternationalShippingId = rowData.vendorInternationalShippingId;
        this.vendorService.getVendorShipViaInterDetails(rowData.vendorInternationalShippingId, this.currentDeletedstatusInternationalShipVia).subscribe(res => {
            this.allShipViaInterDetails = res[0];
            this.loaderForInterShipVia = false;
            if (this.allShipViaInterDetails.length == 0) {
                this.shipViaInterObj.isPrimary = true;
            }
        },
            err => {
                this.loaderForInterShipVia = false;
                //this.onDataLoadFailed(err)
                this.isSpinnerVisible = false;
            });
    }

    openShipViaInterEdit(rowObject) {
        this.disableSaveForEditShipViaInternational = true;
        this.shipViaInterObj = { ...rowObject };
        this.shipViaInterObj['tempIsPrimary'] = this.shipViaInterObj.isPrimary
        this.isEditInterShipVia = true;
    }

    delShipViaInter(row) {
        if (!row.isPrimary) {
            this.selectedInterShipViaRowforDelete = row;
            $('#shipViaInterDel').modal('show');
        } else {
            $('#deleteshipping').modal('show');
        }
    }

    restoreShipViaInternational(row) {
        if (!row.isPrimary) {
            this.selectedInterShipViaRowforDelete = row;
            $('#shipViaInterRestore').modal('show');
        } else {
            $('#shipViaInterRestore').modal('show');
        }
    }

    confirmDelShipviaInter() {
        this.vendorService.getDeletevendorshipViaInter(this.selectedInterShipViaRowforDelete).subscribe(data => {
            this.loadShipViaInterCollection(this.selectedInterShipViaRowforDelete);
            this.alertService.showMessage(
                'Success',
                `Record was deleted successfully`,
                MessageSeverity.success
            );
        }, error => { this.isSpinnerVisible = false; })
        this.modal.close();
    }

    confirmRestoreShipviaInter() {
        this.vendorService.getRestorevendorshipViaInter(this.selectedInterShipViaRowforDelete).subscribe(data => {
            this.loadShipViaInterCollection(this.selectedInterShipViaRowforDelete);
            this.alertService.showMessage(
                'Success',
                `Record was Restored successfully`,
                MessageSeverity.success
            );
        }, error => { this.isSpinnerVisible = false; })
        this.modal.close();
    }

    openHistInterShipvia(row) {
        this.shipViaInterObj = {};
        this.selectedShipViaInterHistory = row;
        this.vendorService.getShipviaHistoryInter(row.vendorInternationalShipViaDetailsId).subscribe(res => {
            this.auditHistoryInterShipvia = res[0];
        }, error => { this.isSpinnerVisible = false; })
    }

    openInterShippingViewVia(rowData) {
        this.interShippingViaView = {};
        this.interShippingViaView = rowData;
    }

    openInterShipViaonDbl(rowData) {
        this.openInterShippingViewVia(rowData);
        $('#viewInterVia').modal('show');
    }

    async updateActiveorInActiveShipViaForIS(rowData) {
        await this.vendorService.updateStatusForInternationalShippingVia(rowData.vendorInternationalShipViaDetailsId, rowData.isActive, this.userName).subscribe(res => {
            this.loadShipViaInterCollection(rowData);

            this.alertService.showMessage(
                'Success',
                `Sucessfully Updated International Ship Via Status`,
                MessageSeverity.success
            );
        }, error => { this.isSpinnerVisible = false; })
    }

    pageIndexChangeForDomestic(event) {
        this.pageSizeForDomestic = event.rows;
    }

    pageIndexChangeForInt(event) {
        this.pageSizeForInt = event.rows;
    }

    pageIndexChangeForShipViaDom(event) {
        this.pageSizeForShipViaDomestic = event.rows;
    }

    pageIndexChangeForShipViaInt(event) {
        this.pageSizeForShipViaInt = event.rows;
    }

    dateFilterForTable(date, field) {
        if (date !== '') {
            this.internationalShippingData = this.internationalShippingDataListOriginal;
            const data = [...this.internationalShippingData.filter(x => {
                if (moment(x.startDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'startDate') {
                    return x;
                } else if (moment(x.expirationDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'expirationDate') {
                    return x;
                } else if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;

                }
            })]
            this.internationalShippingData = data;
        } else {
            this.internationalShippingData = this.internationalShippingDataListOriginal;
        }
    }


    getDeleteListByStatusDomestic(value) {
        if (value) {
            this.currentDeletedstatusDomestic = true;
        } else {
            this.currentDeletedstatusDomestic = false;
        }
        this.geListByStatusDomsetic(this.isActivStatus ? this.isActivStatus : this.currentstatus1);
    }

    getDeleteListByStatusIntern(value) {
        if (value) {
            this.currentDeletedstatusIntenational = true;
        } else {
            this.currentDeletedstatusIntenational = false;
        }
        this.geListByStatusInternational(this.isActivIntStatus ? this.isActivIntStatus : this.currentstatus2)
    }

    geListByStatusDomsetic(status) {
        const newarry = [];
        if (status == 'Active') {
            this.isActivStatus = status;
            if (this.currentDeletedstatusDomestic == false) {
                this.originalTableDataDomestic.forEach(element => {
                    if (element.isActive == true && element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableDataDomestic.forEach(element => {
                    if (element.isActive == true && element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
            }
            this.allActions = newarry;
        } else if (status == 'InActive') {
            this.isActivStatus = status;
            if (this.currentDeletedstatusDomestic == false) {
                this.originalTableDataDomestic.forEach(element => {
                    if (element.isActive == false && element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableDataDomestic.forEach(element => {
                    if (element.isActive == false && element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
            }
            this.allActions = newarry;
        } else if (status == 'ALL') {
            this.isActivStatus = status;
            if (this.currentDeletedstatusDomestic == false) {
                this.originalTableDataDomestic.forEach(element => {
                    if (element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableDataDomestic.forEach(element => {
                    if (element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
            }
            this.allActions = newarry;
        }
        this.allActions = this.allActions.map(x => {
            return {
                ...x,
                createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : ''
            }
        })
        this.allActionsOriginal = this.allActions;
        this.totalRecords = this.allActions.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    geListByStatusInternational(status) {
        const newarry = [];
        if (status == 'Active') {
            this.isActivIntStatus = status;
            if (this.currentDeletedstatusIntenational == false) {
                this.originalTableDataInternanl.forEach(element => {
                    if (element.isActive == true && element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableDataInternanl.forEach(element => {
                    if (element.isActive == true && element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
            }
            this.internationalShippingData = newarry;
        } else if (status == 'InActive') {
            this.isActivIntStatus = status;
            if (this.currentDeletedstatusIntenational == false) {
                this.originalTableDataInternanl.forEach(element => {
                    if (element.isActive == false && element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableDataInternanl.forEach(element => {
                    if (element.isActive == false && element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
            }
            this.internationalShippingData = newarry;
        } else if (status == 'ALL') {
            this.isActivIntStatus = status;
            if (this.currentDeletedstatusIntenational == false) {
                this.originalTableDataInternanl.forEach(element => {
                    if (element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableDataInternanl.forEach(element => {
                    if (element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
            }
            this.internationalShippingData = newarry;
        }
        this.internationalShippingData = this.internationalShippingData.map(x => {
            return {
                ...x,
                createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                startDate: x.startDate ? this.datePipe.transform(x.startDate, 'MM/dd/yyyy hh:mm a') : '',
                expirationDate: x.expirationDate ? this.datePipe.transform(x.expirationDate, 'MM/dd/yyyy hh:mm a') : ''
            }
        })
        this.totalRecords = this.internationalShippingData.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    restoreDomesticShipping(content, rowData) {
        this.restoreDomesticRecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    restoreInternationalShipping(content, rowData) {
        this.selectedRowRestoreInternationalShipping = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    restoreRecordDomestic() {
        this.isSpinnerVisible = true;
        this.vendorService.restoreVendorShippingAddress(this.restoreDomesticRecord.vendorShippingAddressId, this.userName).subscribe(res => {
            this.currentDeletedstatusDomestic = true;
            this.modal.close();
            this.loadData()
            this.alertService.showMessage("Success", `Record was Resstored Successfully.`, MessageSeverity.success);
            this.isSpinnerVisible = false;
        }, error => { this.isSpinnerVisible = false; })
    }

    restoreRecordIntern() {
        this.isSpinnerVisible = true;
        this.commonService.updatedeletedrecords('VendorInternationalShipping', 'VendorInternationalShippingId', this.selectedRowRestoreInternationalShipping.vendorInternationalShippingId).subscribe(res => {
            this.currentDeletedstatusDomestic = true;
            this.modal.close();
            this.getInternationalShippingByVendorId();
            this.alertService.showMessage("Success", `Record was Resstored Successfully.`, MessageSeverity.success);
            this.isSpinnerVisible = false;
        }, error => { this.isSpinnerVisible = false; })
    }

    getAllDomesticSiteSmartDropDown(strText = '') {
        //this.isSpinnerVisible = true;
        if (this.arrayDomesricShipIdlist.length == 0) {
            this.arrayDomesricShipIdlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownListWtihColumn('VendorShippingAddress', 'VendorShippingAddressId', 'SiteName', '', 'VendorId', this.vendorId, 20, this.arrayDomesricShipIdlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.domesticSieListOriginal = response.map(x => {
                return {
                    siteName: x.label, value: x.value
                }
            })
            this.domesticSieList = [...this.domesticSieListOriginal];
            this.arrayDomesricShipIdlist = [];
            //this.isSpinnerVisible = false;
        }, err => {
            //const errorLog = err;
            //this.saveFailedHelper(errorLog);
            this.isSpinnerVisible = false;
        });
    }

    filterDomessticSite(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllDomesticSiteSmartDropDown(event.query);
        }
    }

    enableSaveDomestic() {
        this.disableSaveDomesticSite = false;
    }

    enableSaveInternational() {
        this.disableSaveInternationalSite = false;
    }
    closeInternationalShipping() {
        this.disableSaveInternationalSite = true;
    }

    selectedDomessticSite() {
        if (this.editSiteName != editValueAssignByCondition('siteName', this.sourceVendor.siteName)) {
            this.isSiteNameAlreadyExists = true;
            this.disableSaveSiteName = true;
        }
        else {
            this.isSiteNameAlreadyExists = false;
            this.disableSaveSiteName = false;
        }
    }

    checkSiteNameExist(value) {
        this.isSiteNameAlreadyExists = false;
        this.disableSaveSiteName = false;
        if (value != this.editSiteName) {
            for (let i = 0; i < this.domesticSieListOriginal.length; i++) {
                if (this.sourceVendor.siteName == this.domesticSieListOriginal[i].siteName || value == this.domesticSieListOriginal[i].siteName) {
                    this.isSiteNameAlreadyExists = true;
                    this.disableSaveSiteName = true;
                    return;
                }
            }
        }
    }

    getDeleteListByStatusInternationalShipVia(value) {
        if (value) {
            this.currentDeletedstatusInternationalShipVia = true;
        } else {
            this.currentDeletedstatusInternationalShipVia = false;
        }
        this.vendorService.getVendorShipViaInterDetails(this.selectedVendorInternationalShippingId, this.currentDeletedstatusInternationalShipVia).subscribe(res => {
            this.allShipViaInterDetails = res[0];
            this.loaderForInterShipVia = false;
            if (this.allShipViaInterDetails.length == 0) {
                this.shipViaInterObj.isPrimary = true;
            }
        },
            err => {
                this.loaderForInterShipVia = false;
                //this.onDataLoadFailed(err)
                this.isSpinnerVisible = false;
            });
    }

    getDeleteListByStatusDomesticShipVia(value) {
        if (value) {
            this.currentDeletedstatusShipVia = true;
        } else {
            this.currentDeletedstatusShipVia = false;
        }
        this.loadShipViaCollection(this.selectedDomesticVendorShippingAddressId)
    }

    enableSaveDomeSticShipVia() {
        this.disableSaveForEditShipVia = false;
    }

    enableSaveInternationalShipVia() {
        this.disableSaveForEditShipViaInternational = false;
    }

    filterTagNames(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllTagNameSmartDropDown(event.query);
        }
    }

    getAllTagNameSmartDropDown(strText = '', contactTagId = 0) {
        if (this.arrayTagNamelist.length == 0) {
            this.arrayTagNamelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('ContactTag', 'ContactTagId', 'TagName', strText, true, 20, this.arrayTagNamelist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.tagNamesList = res.map(x => {
                return {
                    tagName: x.label, contactTagId: x.value
                }
            })
            if (contactTagId > 0) {
                this.sourceVendor = {
                    ...this.sourceVendor,
                    tagName: getObjectById('contactTagId', contactTagId, this.tagNamesList)
                }
            }
        })
    }

    updateActiveorInActiveForShipping(rowData) { }
}