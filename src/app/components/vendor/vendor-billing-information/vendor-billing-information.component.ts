import { Component, ViewChild, Input } from '@angular/core';
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
declare var $ : any;
import { DatePipe } from '@angular/common';
import { getObjectById, editValueAssignByCondition, getObjectByValue } from '../../../generic/autocomplete';
import { ConfigurationService } from '../../../services/configuration.service';
import { CommonService } from '../../../services/common.service';
declare const google: any;
@Component({
    selector: 'app-vendor-billing-information',
    templateUrl: './vendor-billing-information.component.html',
    styleUrls: ['./vendor-billing-information.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
/** VendorBillingInformation component*/
export class VendorBillingInformationComponent {
    modelValue: boolean;
    display: boolean;
    activeIndex: number = 6;
    public overlays: any[];
    currentstatus: string = 'Active';
    updatedCollection: {};
    vendorbillingAddressdetails: any;
    local: any;
    addressId: any;
    selectedOnly: boolean = false;
    targetData: any;
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
    isPrimary: boolean = false;
    checkAddress: boolean = false;
    viewName: string = "Create";
    siteName: any;
    address1: any;
    address2: any;
    city: any;
    stateOrProvince: any;
    postalCode: number;
    country: any;
    formData = new FormData();
    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    filteredBrands: any[];
    displayedColumns = ['actionId', 'companyName', 'description', 'memo', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<any>;
    allActions: any[] = [];
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourceAction: any = [];
    public auditHisory: AuditHistory[] = [];
    private bodyText: string;
    //loadingIndicator: boolean;
    closeResult: string;
    selectedColumn: any[];
    cols: any[] = [
        { field: 'tagName', header: 'Tag' },
        { field: 'attention', header: 'Attention' },
        { field: 'siteName', header: 'Site Name' },
        { field: 'address1', header: 'Address1' },
        { field: 'address2', header: 'Address2' },
        { field: 'city', header: 'City' },
        { field: 'stateOrProvince', header: 'State/Prov' },
        { field: 'postalCode', header: 'Postal Code' },
        { field: 'countryName', header: 'Country' },
        { field: 'createdDate', header: 'Created Date' },
		{ field: 'createdBy', header: 'Created By' },
		{ field: 'updatedDate', header: 'Updated Date' },
		{ field: 'updatedBy', header: 'Updated By' },
        { field: 'isPrimary', header: 'IsPrimary' }
    ];
    selectedColumns: any[] = this.cols;
    billingauditHisory: any[];
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
    isEditBillingInfo: boolean = false;
    selectedRowforDelete: any;
    totalRecords: number = 0;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number = 0;
    public sourceVendor: any = {};
    @Input() vendorId: number = 0;
    @Input() isViewMode: boolean = false;
    isvendorEditMode: any;
    //loaderForBillingInfo: boolean = false;
    vendorData: any = {};
    obtainedVendorName: any;
    obtainedVendorCode: any;
    originalTableData:any=[];
    currentDeletedstatus:boolean=false;
    status:any="Active";
    isSpinnerVisible: Boolean = false;
    restorerecord:any={};
    arraySiteIdlist:any[] = [];
    sitelistCollection: any[];
    sitelistCollectionOriginal: any[];
    changeName: boolean = false;
    isSiteNameAlreadyExists: boolean = false;
    disableSaveSiteName: boolean;
    disableSave: boolean = true;
    disableSaveBillingCountry: boolean = true;
    vendorCodeandName: any;
    editSiteName: string = '';
    arrayTagNamelist:any=[];
    tagNamesList:any=[];

    constructor(private http: HttpClient, private router: Router,private activeRoute: ActivatedRoute,
        private authService: AuthService, private modalService: NgbModal,
        private activeModal: NgbActiveModal, private _fb: FormBuilder,private commonService: CommonService,
        private alertService: AlertService,
        private datePipe: DatePipe,
        public vendorService: VendorService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService) {
            if(window.localStorage.getItem('vendorService')){
                var obj = JSON.parse(window.localStorage.getItem('vendorService'));
                if(obj.listCollection && this.activeRoute.snapshot.params['id']){
                    this.vendorService.checkVendorEditmode(true);
                    this.vendorService.isEditMode = true;
                    this.vendorService.listCollection = obj.listCollection;
                    this.vendorService.indexObj.next(obj.activeIndex);
                    this.vendorService.enableExternal = true;
                    this.vendorId = this.activeRoute.snapshot.params['id'];
                    this.vendorService.vendorId = this.vendorId;
                    this.vendorService.listCollection.vendorId = this.vendorId; 
                    this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                        res => {
                                this.local = res[0];
                                this.vendorCodeandName = res[0];
                        },err => {
                            const errorLog = err;
                            this.saveFailedHelper(errorLog);
                        });
                }
            }
            else
            {
                if(!this.isViewMode)
                {
                    this.getVendorCodeandNameByVendorId();
                }
                
            }
        if (this.vendorService.listCollection !== undefined) {
            this.vendorService.isEditMode = true;
        }
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
        }
    }

    ngOnInit() {
        this.vendorService.currentEditModeStatus.subscribe(message => {
            this.isvendorEditMode = message;
        });
        if (this.vendorId != 0) {
        } else {
            this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-billing-information';
            this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
        }
        if(this.isViewMode)
        {
            this.getVendorCodeandNameByVendorId();
        }
        else{
            this.countrylist();
            this.vendorId = this.activeRoute.snapshot.params['id'];
            this.vendorService.vendorId = this.vendorId;
            this.vendorService.listCollection.vendorId = this.vendorId; 
        }
        this.loadData();        
    }

    getVendorCodeandNameByVendorId()
    {
        if(this.vendorId > 0)
        {
            this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                res => {
                        this.vendorCodeandName = res[0];
                },err => {
                    const errorLog = err;
                    this.saveFailedHelper(errorLog);
            });
        }        
    }

    private loadData() {
        this.isSpinnerVisible = true;
        const vendorId = this.vendorId != 0 ? this.vendorId : this.local.vendorId;
        const newvendorId= vendorId ? vendorId :this.activeRoute.snapshot.params['id'];

        this.vendorService.getVendorBillAddressGet(newvendorId).subscribe(
            results =>{
                this.onDataLoadSuccessful(results[0])
                this.isSpinnerVisible = false;
            },
            error =>{
                this.onDataLoadFailed(error);
            } 
        );
    }
    closeDeleteModal() {
		$("#downloadConfirmation").modal("hide");
    }
    
    exportCSV(dt){
        dt._value = dt._value.map(x => {
            return {
                ...x,
                createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
            }
        });
        dt.exportCSV();
    }
    private countrylist() {
        this.isSpinnerVisible = true;
        this.vendorService.getCountrylist().subscribe(
            results => this.onDatacountrySuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onDatacountrySuccessful(allWorkFlows: any[]) {
        this.dataSource.data = allWorkFlows;
        this.allCountryinfo = allWorkFlows;
        this.isSpinnerVisible = false;
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

    private onDataLoadSuccessful(allWorkFlows: any) {
        this.dataSource.data = allWorkFlows;
        this.originalTableData = allWorkFlows;
        let obtainedVendorId = this.originalTableData[0].vendorId;
        //this.getVendorBasicData(obtainedVendorId);
        this.geListByStatus(this.status ? this.status :this.currentstatus)     
    }

    getVendorBasicData(vendorId) {
        this.isSpinnerVisible = true;
        this.vendorService.getVendorDataById(vendorId).subscribe(res => {
            this.vendorData = res;
            this.obtainedVendorName = this.vendorData.vendorName;
            this.obtainedVendorCode = this.vendorData.vendorCode;
            this.isSpinnerVisible = false;
        }, error => this.onDataLoadFailed(error));
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

    // private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
    //     this.allComapnies = allComapnies;
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
            this.selectedRowforDelete = row;
            this.isEditMode = false;
            this.isDeleteMode = true;
            this.sourceVendor = row;
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        } else {
            $('#deletebilling').modal('show');
        }
    }

    openEdit(row) {
        this.isEditMode = true;
        this.isEditBillingInfo = true;
        this.isSaving = true;
        this.disableSave = true;
        this.isSiteNameAlreadyExists = false;
        
        this.sourceVendor = { ...row, 
            countryId: getObjectById('countries_id', row.countryId, this.allCountryinfo)
        };

        if(row.contactTagId > 0)
        {
            this.arrayTagNamelist.push(row.contactTagId);
            this.getAllTagNameSmartDropDown('', row.contactTagId);
        }

        this.arraySiteIdlist.push(row.vendorBillingAddressId); 
        this.commonService.autoSuggestionSmartDropDownListWtihColumn('VendorBillingAddress', 'VendorBillingAddressId', 'SiteName','', 'VendorId', this.vendorId, 20,this.arraySiteIdlist.join()).subscribe(response => {
            this.sitelistCollectionOriginal = response.map(x => {
                return {
                    siteName: x.label, value: x.value
                }
            })
            this.sitelistCollection = [...this.sitelistCollectionOriginal];
            this.arraySiteIdlist = [];
            this.isSpinnerVisible = false;
            
            this.sourceVendor = {
                 ...this.sourceVendor,
                siteName:  getObjectByValue('siteName', row.siteName, this.sitelistCollectionOriginal)
            };

            this.editSiteName = row.siteName;
            
            },err => {
                const errorLog = err;
                this.saveFailedHelper(errorLog);
            });
            if(row.contactTagId > 0)
            {
                this.arrayTagNamelist.push(row.contactTagId);
                this.getAllTagNameSmartDropDown('', row.contactTagId);
            }
        this.sourceVendor['tempIsPrimary'] = this.sourceVendor.isPrimary;
    }

    openView(content, row) {
        this.sourceVendor = row;
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
        this.isPrimary = row.isPrimary;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openBilladdressHistory(content, row) {
        this.isSpinnerVisible = true;
        this.sourceVendor = row;
        this.isSaving = true;
        this.vendorService.getVendorBillingAuditHistory(this.sourceVendor.vendorId, this.sourceVendor.vendorBillingAddressId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results, content),
            error => this.saveFailedHelper(error));
    }

    private onAuditHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
        this.billingauditHisory = auditHistory;
        this.isSpinnerVisible = false;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    editItemAndCloseModel() {        
        this.isSpinnerVisible = true;
        this.isSaving = true;
        if(!this.sourceVendor.countryId){
            this.isSpinnerVisible = false;
            this.alertService.showMessage("Error", `Please Select Country`, MessageSeverity.error);
            return false;
        }
        if (!(this.sourceVendor.siteName && this.sourceVendor.address1 && this.sourceVendor.city &&
            this.sourceVendor.stateOrProvince && this.sourceVendor.postalCode && this.sourceVendor.countryId
        )) {
            this.display = true;
            this.modelValue = true;
        }
        if (this.sourceVendor.siteName && this.sourceVendor.address1 && this.sourceVendor.city &&
            this.sourceVendor.stateOrProvince && this.sourceVendor.postalCode && this.sourceVendor.countryId) {
            if (!this.sourceVendor.vendorId) {
                this.sourceVendor.createdBy = this.userName;
                this.sourceVendor.updatedBy = this.userName;
                this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;
                this.sourceVendor.vendorId = this.local.vendorId;
                this.sourceVendor.isPrimary= this.sourceVendor.isPrimary ? this.sourceVendor.isPrimary :false;
                this.sourceVendor.siteName = editValueAssignByCondition('siteName', this.sourceVendor.siteName),
                this.sourceVendor.countryId = editValueAssignByCondition('countries_id', this.sourceVendor.countryId);
                this.sourceVendor.contactTagId = editValueAssignByCondition('contactTagId', this.sourceVendor.tagName);               
                this.vendorService.createNewBillinginfo(this.sourceVendor).subscribe(data => {
                    this.localCollection = data;
                    this.isSaving = false;
                    this.loadData();
                    this.sourceVendor = {};
                    this.alertService.showMessage("Success", `Biiling Info was added successfully`, MessageSeverity.success);                    
                    this.isSpinnerVisible = false;
                    $('#addBillingInfo').modal('hide');
                }, error => {this.isSaving = false; this.isSpinnerVisible = false})
            }
            else {
                this.sourceVendor.updatedBy = this.userName;
                this.sourceVendor.isPrimary= this.sourceVendor.isPrimary ? this.sourceVendor.isPrimary :false;
                this.sourceVendor.siteName = editValueAssignByCondition('siteName', this.sourceVendor.siteName),
                this.sourceVendor.countryId = editValueAssignByCondition('countries_id', this.sourceVendor.countryId);
                this.sourceVendor.contactTagId = editValueAssignByCondition('contactTagId', this.sourceVendor.tagName);
                this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;                
                this.vendorService.createNewBillinginfo(this.sourceVendor).subscribe(data => {
               //this.vendorService.updateBillAddressdetails(this.sourceVendor).subscribe(data => {
                    this.updatedCollection = data; 
                    this.loadData();
                    this.sourceVendor = {};
                    this.alertService.showMessage("Success", `Biiling Info was Updated successfully`, MessageSeverity.success);
                    this.isSpinnerVisible = false;
                    $('#addBillingInfo').modal('hide');
                }, error => {this.isSaving = false; this.isSpinnerVisible = false;})
            }
        }
        
    }

    previousClick() {
        this.activeIndex = 5;
        this.vendorService.changeofTab(this.activeIndex);
    }

    deleteConformation(value) {
        if (value === 'Yes') {
            this.vendorService.GetVendorBillingAddressDelete(this.selectedRowforDelete.vendorBillingAddressId, this.userName).subscribe(() => {
                this.loadData();
                this.alertService.showMessage(
                    'Success',
                    `Record was deleted successfully`,
                    MessageSeverity.success
                );
            }, error => this.saveFailedHelper(error))
        } else {
            this.selectedRowforDelete = undefined;
        }
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

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        this.isSpinnerVisible = false;
    }

    nextClick() {
        if (this.local) {
            this.vendorService.billingCollection = this.local;
        }
        this.activeIndex = 7;
        this.vendorService.changeofTab(this.activeIndex);
    }

    handleChanges(rowData, e) {
        if (e.checked == false) {
            this.isSpinnerVisible = true;
            this.sourceVendor = rowData;
            this.sourceVendor.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceVendor.isActive == false;
            this.vendorService.GetUpdateVendorBillingAddressStatus(this.sourceVendor.vendorBillingAddressId, this.sourceVendor.isActive, this.userName).subscribe(
                response => {
                    this.alertService.showMessage("Success", `Record was In-Activated successfully`, MessageSeverity.success);
                    this.isSpinnerVisible = false;
                    this.loadData();
                }, 
                error => this.saveFailedHelper(error));
            this.sourceVendor = "";

        }
        else {
            this.isSpinnerVisible = true;
            this.sourceVendor = rowData;
            this.sourceVendor.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceVendor.isActive == true;
            this.vendorService.GetUpdateVendorBillingAddressStatus(this.sourceVendor.vendorBillingAddressId, this.sourceVendor.isActive, this.userName).subscribe(
                response => {
                    this.alertService.showMessage("Success", `Record was Activated successfully`, MessageSeverity.success);
                    this.isSpinnerVisible = false;
                    this.loadData();
                }, 
                error => this.saveFailedHelper(error));
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
            this.disableSaveBillingCountry = false;
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
                this.disableSaveBillingCountry = true;
            }
        } else {
            this.disableSaveBillingCountry = true;
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

    getColorCodeForHistory(i, field, value) {
        const data = this.billingauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    onAddBillingInfo() {
        this.sourceVendor = {};
        this.isEditBillingInfo = false;
        this.isSiteNameAlreadyExists = false;
        this.getAllSiteSmartDropDown();
    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=VendorBillingAddress&fileName=VendorBillingInfo.xlsx`;
        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;

        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.vendorService.BillingFileUpload(this.formData, this.local.vendorId).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.loadData();

                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded File `,
                    MessageSeverity.success
                );
            }, error => this.saveFailedHelper(error))
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

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

	getDeleteListByStatus(value){
        if(value){
            this.currentDeletedstatus=true;
        }else{
            this.currentDeletedstatus=false;
        }
        this.geListByStatus(this.status ? this.status : this.currentstatus)
    }
	
    geListByStatus(status) {
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
         this.allActions=newarry;
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
        this.allActions = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.allActions= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.allActions= newarry;
			}
        }
        this.totalRecords = this.allActions.length ;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
        
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
   
    restoreRecord() {
        this.vendorService.GetVendorBillingAddressRestore(this.restorerecord.vendorBillingAddressId, this.userName).subscribe(() => {
            this.loadData();
            this.modal.close();
            this.alertService.showMessage( 'Success', `Record was Restored successfully`, MessageSeverity.success );
        }, error => this.saveFailedHelper(error))
    }

    checkSiteNameExist(value) {
        this.isSiteNameAlreadyExists = false;
        this.disableSaveSiteName = false;
        if (value != this.editSiteName) {
            for (let i = 0; i < this.sitelistCollectionOriginal.length; i++) {
                if (this.sourceVendor.siteName == this.sitelistCollectionOriginal[i].siteName || value == this.sitelistCollectionOriginal[i].siteName) {
                    this.isSiteNameAlreadyExists = true;
                    this.disableSaveSiteName = true;
                    return;
                }
            }
        }
    }

    checkBillingSiteNameSelect() {    
        if(this.editSiteName  != editValueAssignByCondition('siteName', this.sourceVendor.siteName))
        {
            this.isSiteNameAlreadyExists = true;
            this.disableSaveSiteName = true;
        }
        else
        {
            this.isSiteNameAlreadyExists = false;
            this.disableSaveSiteName = false;
        }
    }

    getAllSiteSmartDropDown(strText = ''){
		if(this.arraySiteIdlist.length == 0) {
            this.arraySiteIdlist.push(0); }
            this.commonService.autoSuggestionSmartDropDownListWtihColumn('VendorBillingAddress', 'VendorBillingAddressId', 'SiteName', strText , 'VendorId', this.vendorId, 20,this.arraySiteIdlist.join()).subscribe(response => {
            this.sitelistCollectionOriginal = response.map(x => {
                return {
                    siteName: x.label, value: x.value
                }
            })
            this.sitelistCollection = [...this.sitelistCollectionOriginal];
            this.arraySiteIdlist = [];
		},err => {
			const errorLog = err;
			this.saveFailedHelper(errorLog);
		});
    }

    filterSite(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllSiteSmartDropDown(event.query); 
        }
    }
    
    enableSave() {
        this.disableSave = false;        
        // this.disableSaveBillingCountry = this.isEditBillingInfo ? false : true;
    }
    filterTagNames(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllTagNameSmartDropDown(event.query); }
    }
    
    getAllTagNameSmartDropDown(strText = '', contactTagId = 0) {
        if(this.arrayTagNamelist.length == 0) {			
            this.arrayTagNamelist.push(0); }
            this.commonService.autoSuggestionSmartDropDownList('ContactTag', 'ContactTagId', 'TagName',strText,true,20,this.arrayTagNamelist.join()).subscribe(res => {
            this.tagNamesList = res.map(x => {
                return {
                    tagName: x.label, contactTagId: x.value 
                }
            })

            if(contactTagId > 0)
            {
                this.sourceVendor = {
                    ...this.sourceVendor,
                    tagName : getObjectById('contactTagId', contactTagId, this.tagNamesList)
                }
            }
        })
    }
}

