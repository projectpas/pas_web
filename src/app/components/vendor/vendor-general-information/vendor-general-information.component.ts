import { Component, ViewChild, OnInit, EventEmitter, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnDestroy, HostListener, ElementRef, Output , Input} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { fadeInOut } from '../../../services/animations';
import { MasterCompany } from '../../../models/mastercompany.model';
import { AuditHistory } from '../../../models/audithistory.model';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { VendorService } from '../../../services/vendor.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { Vendor } from '../../../models/vendor.model';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { VendorClassification } from '../../../models/vendorclassification.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GMapModule } from 'primeng/gmap';
import { AddActionsDialogComponent } from '../../dialogs/add-actions-dialog/add-actions-dialog.component';
import { VendorClassificationService } from '../../../services/vendorclassification.service';
//import { unescapeHtml } from '@angular/platform-browser/src/browser/transfer_state';
import { FileUploadModule } from 'primeng/fileupload';
import { Message } from 'primeng/components/common/message';
import { MenuItem } from 'primeng/components/common/menuitem';
import { DialogModule } from 'primeng/dialog';//Error Validation Pop Up
import { CustomerService } from '../../../services/customer.service';
import { CommonService } from '../../../services/common.service';
import { IntegrationService } from '../../../services/integration-service';
import { ConfigurationService } from '../../../services/configuration.service';
import { editValueAssignByCondition, getObjectById, getValueFromObjectByKey, selectedValueValidate, toLowerCaseOnInput, validateRecordExistsOrNot, validateRecordExistsOrNotOnEdit, getObjectByValue } from '../../../generic/autocomplete';
import { VendorStepsPrimeNgComponent } from '../vendor-steps-prime-ng/vendor-steps-prime-ng.component';
import { emailPattern, urlPattern, phonePattern, namePattern } from '../../../validations/validation-pattern';
declare const google: any;
declare var $ : any;
import { Subject } from 'rxjs'

import * as moment from 'moment';
@Component({
    selector: 'app-vendor-general-information',
    templateUrl: './vendor-general-information.component.html',
    styleUrls: ['./vendor-general-information.component.scss'],
    animations: [fadeInOut],
})
/** anys component*/
export class VendorGeneralInformationComponent implements OnInit {       
    @Input() selectedVendorTab: string = '';
    @Input() editMode;    
    @Output() editVendorId = new EventEmitter<any>();
    flagForAddingVendor: boolean = false;   
    disableSaveVenderName: boolean;
    disableSaveVendorPhone: boolean;
    disableSaveVendorEmail: boolean;
    //disableSaveVendorCountry: boolean;
    disableSaveVenderCode: boolean;
    VendorCodesColl: any[] = [];
    selectedVendorCode: any;
    disableSaveVenCode: boolean;
    disableSave: boolean;
    disableSaveMemo: boolean = true;
    selectedActionName: any;
    disableSaveVenName: boolean;
    VendorNamecoll: any[] = [];
    allCapbilityClassInfo: any[];
    modelValue: boolean;
    display: boolean;
    matSpinner: boolean;
    activeIndex: number = 1;
    showvendorContractReference: boolean;
    showvendorCode: boolean;
    showVendorName: boolean;
    showalert: boolean;
    showLable: boolean;
    venname: any;
    allVendorClassInfo: VendorClassification[];
    vendorClassName: any;
    vendorCollection: any[];
    vendorNames: any[];
    vendorCodes: any[];
    localCollections: any;
    vendorName: any;
    vendorCode: any;
    checkAddress: boolean = false;
    allgeneralInfo: any[];
    closeCmpny: boolean = true;
    service: boolean = false;
    vendorId: any;
    addressId: any;
    allAddresses: any[];
    action_name: any = "";
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createddate: any = "";
    updatedDate: any = "";
    vendorParentName: any = "";
    viewName: string = "Create";
    private items: MenuItem[];
    home: MenuItem;
    local: any;
    vendorInfoByName: any[] = [];
    sourceCustomer: any;
    allCountryinfo: any[];
    disablesave: boolean;
    countrycollection: any;
    selectedCountries: any;
    isVendorAlsoCustomer: boolean = false;
    disableSaveParentName: boolean;
    disablesaveForClassification: boolean;
    selectedClass: any;
    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    filteredBrands: any[];
    displayedColumns = ['actionId', 'companyName', 'description', 'memo', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<any>;
    arrayVendorParentlist:any[] = [];
    arrayVendorlist:any[] = [];
    venderListOriginal = [];
    vendorallListOriginal = [];
    selectedParentId: any;
    allActions: any[] = [];
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourceAction: any = {};
    public auditHisory: AuditHistory[] = [];
    private bodyText: string;
    //loadingIndicator: boolean;
    closeResult: string;
    selectedColumn: any[];
    selectedColumns: any[];
    cols: any[];
    title: string = "Create";
    id: number;
    errorMessage: any;
    modal: NgbModalRef;
    actionName: string;
    Active: string = "Active";
    length: number;
    index: number;
    localCollection: any[] = [];
    collection: any;
    options: any;
    public overlays: any[];
    msgs: Message[];
    uploadedFiles: any[] = [];
    isEditMode: boolean = false;
    isDeleteMode: boolean = false;
    integrationOriginalList: any = [];
    integrationList: any = [];
    intSelectedColumns: any[];
    dropDownVendorCapabilitiesList: any[];
    form: any;
    allvendorclassificationInfo;
    formData = new FormData();
    allVendorGeneralDocumentsList: any = [];
    sourceVendor: any = {};
    vendorParentNames: any[];
    emailPattern = emailPattern()
    urlPattern = urlPattern()
    phonePattern = phonePattern();
    namePattern = namePattern();
    parentVendorOriginal: any[];
    forceSelectionOfVendorName: boolean = false;
    selectedEditData: any;
    editModeData: any;
    newvendorId;
    isvendorEditMode:any=false;
    intergrationNew = {
        isActive: true,
        description: '',
        memo: '',
        portalURL: '',
    }
    addNewIntergation = { ...this.intergrationNew };
    isIntegrationAlreadyExists: boolean = false;
    originalData: any;
    totalRecordsCertified: number = 0;
    totalPagesCertified: number = 0;
    totalRecordsAudit: number = 0;
    pageSizeNew: number = 3;
    totalPagesAudit: number = 0;
    pageSize: number = 10;
    sourceViewforDocumentListColumns = [
        { field: 'fileName', header: 'File Name' },
    ]
    customerDocumentsColumns = [
        { field: 'docName', header: 'Name', width: '130px' },
        { field: 'docDescription', header: 'Description', width: '130px' },
        { field: 'docMemo', header: 'Memo', width: '130px' },
        { field: 'fileName', header: 'File Name', width: '130px' },
        { field: 'fileSize', header: 'File Size', width: '130px' },
        { field: 'createdDate', header: 'Created Date', width: '150px' },
        { field: 'createdBy', header: 'Created By', width: '130px' },
        { field: 'updatedDate', header: 'Updated Date', width: '150px' },
        { field: 'updatedBy', header: 'Updated By', width: '130px' }
    ];
    @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
    selectedColumnsCertified = this.customerDocumentsColumns;
    sourceViewforDocumentList: any = [];
    sourceViewforDocument: any = [];
    sourceViewforDocumentAudit: any = [];
    isEditButton: boolean = false;
    documentInformation = {
        docName: '',
        docMemo: '',
        docDescription: '',
        attachmentDetailId: 0
    }
    selectedFileAttachment: any = [];
    selectedFile: File = null;
    allDocumentListOriginal: any = [];
    selectedRowForDelete: any;
    rowIndex: number;
    @ViewChild('fileUploadInputAudit',{static:false}) fileUploadInputAudit: any;
    disableFileAttachmentSubmit: boolean = true;
    selectedColumnsAudit = this.customerDocumentsColumns;
    sourceViewforDocumentListAudit: any = [];
    sourceViewforDocumentVendorAudit: any = [];
    sourceViewforDocumentVendorAuditNew: any = [];
    selectedFileAttachmentAudit: any = [];
    selectedFileAudit: File = null;
    allDocumentListOriginalAudit: any = [];
    selectedRowForDeleteAudit: any;
    rowIndexAudit: number;
    nextOrPreviousTab: string;
    @ViewChild('table4',{static:false})  private _table4: Table;
    @ViewChild("tabRedirectConfirmationModal",{static:false}) public tabRedirectConfirmationModal: ElementRef;
    modalIsCertified: NgbModalRef;
    modalVendorAudit: NgbModalRef;
    vendorAuditTablePageSize: number = 5;
    isCertifiedTablePageSize: number = 5;
    allowNextView:boolean=false;
    isSpinnerVisible: Boolean = false;
    vendorCodeTemp = "Creating"
    memoPopupContent: any;
    enableUpdate: boolean = false;
    disableSaveForEdit:boolean=true;
    stopmulticlicks: boolean;
    disableSaveForEditDocument:boolean=true;
    disableSaveForEditDocumentAudit:boolean=true;
    arrayIntegrationlist:any[] = [];
    CertifiedModuleName:any="VendorCertified";
    AuditModuleName:any="VendorAudit";
    referenceId:any; 
    uploadDocs: Subject<boolean> = new Subject();
    isView:boolean=true;
    constructor(public vendorclassificationService: VendorClassificationService,
        private http: HttpClient,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private authService: AuthService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder,
        public customerser: CustomerService,
        private alertService: AlertService,
        public vendorService: VendorService,
        private dialog: MatDialog,
        private masterComapnyService: MasterComapnyService,
        public commonService: CommonService,
        public integrationService: IntegrationService,
        private acRouter: ActivatedRoute,
        private configurations: ConfigurationService) {
        this.dataSource = new MatTableDataSource();
        this.stopmulticlicks = false;
        this.vendorId = this.acRouter.snapshot.params['id'];
        this.countrylist();
        
        if(window.localStorage.getItem('vendorService')){
            var obj = JSON.parse(window.localStorage.getItem('vendorService'));
            if(this.acRouter.snapshot.params['id']){
                this.vendorService.checkVendorEditmode(true);
                this.vendorService.isEditMode = true;
                this.vendorService.listCollection = obj.listCollection;
                this.vendorService.indexObj.next(obj.activeIndex);
                this.vendorService.enableExternal = true;
            }
        }
        this.loadVendorData();
        if (this.vendorId) {
            this.disableSaveForEdit = true;
            this.isvendorEditMode = true;
            this.enableUpdate = true;

        } else {
            this.vendorService.ShowPtab = true;
            this.sourceVendor.vendorTypeId = 2;
            this.sourceVendor.vendorTypeId = 1;
            if (this.vendorService.isEditMode == false) {
                this.sourceVendor.vendorTypeId = 2;
                this.viewName = "Create";
                this.sourceVendor.isAddressForBilling = true;
                this.sourceVendor.isAddressForShipping = true;
            }
            if (this.vendorService.enableExternal == false) {
                this.sourceVendor.vendorTypeId = 2;
            }
            if (this.vendorService.listCollection) {
                this.sourceVendor = this.vendorService.listCollection;
            }
            if (!this.intSelectedColumns) {
                this.intSelectedColumns = this.cols;
            }
            if (!this.vendorService.isReset) {
                if (this.viewName != "Edit") {
                    this.sourceVendor = {};
                    this.sourceVendor.vendorTypeId = 2;
                    this.sourceVendor.isAddressForBilling = true;
                    this.sourceVendor.isAddressForShipping = true;
                }
            }
        }
    }

    ngOnInit(): void {
        if(window.localStorage.getItem('vendorService')){
            var obj = JSON.parse(window.localStorage.getItem('vendorService'));
            if(obj.listCollection && this.acRouter.snapshot.params['id']){
                this.vendorService.checkVendorEditmode(true);
                this.vendorService.isEditMode = true;
                this.vendorService.listCollection = obj.listCollection;
                this.vendorService.indexObj.next(2);
                this.vendorService.enableExternal = true;
                this.vendorId = this.acRouter.snapshot.params['id'];
				this.vendorService.vendorId = this.vendorId;
                this.vendorService.listCollection.vendorId = this.vendorId; 
                if(this.vendorId > 0)
                {
                    this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                        res => {
                                this.local = res[0];
                        },err => {
                            const errorLog = err;
                            this.saveFailedHelper(errorLog);
                    });
                }				
            }
        }
        this.vendorId = this.acRouter.snapshot.params['id'];
        if(this.vendorId){
            this.vendorService.currentEditModeStatus.subscribe(message => {
                this.isvendorEditMode = message;
            });
            this.editModeDataBinding();
            this.getAllVendorClassification();
            this.getAllIntegrations();
            this.getVendorIntegrationByVendorrId();
            this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-general-information/${this.vendorId}';
        }
        else{
            this.getAllVendorClassification();
            this.getAllIntegrations();
            this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-general-information';
        }
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }

    patternVendorNamevalidation(event: any) {
        const pattern = /[a-zA-Z0-9.-_/ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    getVendorData(vendorId){
        this.isSpinnerVisible = true;
        this.vendorService.getVendorDataById(vendorId).subscribe(res => {
            this.sourceVendor = res;
            this.allowNextView=true;
            if (this.sourceVendor.countryId !== undefined) {
                this.sourceVendor.countryId = { countries_id: this.sourceVendor.countryId, nice_name: this.sourceVendor.country }
            }
            this.originalData = Object.assign({}, res);
            this.newvendorId = res.vendorId;
            this.selectedParentId = res.vendorParentId;           

            if(res.vendorParentId > 0) {			
                this.arrayVendorParentlist.push(res.vendorParentId); }

            this.loadVendorParentsData();

            this.forceSelectionOfVendorName = true;
            this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-general-information/edit';
            this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
            this.vendorService.ShowPtab = true;
            this.vendorService.alertObj.next(this.vendorService.ShowPtab);
            this.vendorService.indexObj.next(0);
            this.vendorService.listCollection = this.sourceVendor
            this.vendorService.enableExternal = true;
            this.sourceVendor.vendorClassificationIds = this.sourceVendor.vendorClassifications;
            this.vendorCodeTemp = this.sourceVendor.vendorCode ? this.sourceVendor.vendorCode : 'Creating';
            this.editModeDataBinding();
            this.isSpinnerVisible = false;
        }, error =>{
                this.onDataLoadFailed(error)
        })

        this.toGetDocumentsListNew(vendorId ? vendorId : this.newvendorId);
        this.toGetDocumentsListAudit(vendorId ? vendorId : this.newvendorId);
    }
    editModeDataBinding() {
        this.isvendorEditMode = true;
        if (this.vendorService.listCollection != null && this.vendorService.isEditMode == true) {
            this.showLable = true;
            this.viewName = "Edit";
            this.local = this.vendorService.listCollection;
            this.sourceVendor = this.vendorService.listCollection;
            if (this.sourceVendor.vendorName !== undefined) {
                this.sourceVendor.vendorName = { vendorId: this.sourceVendor.vendorId, vendorName: this.sourceVendor.vendorName }
            }
            this.toGetVendorGeneralDocumentsList(this.sourceVendor.vendorId);
            this.sourceVendor.address1 = this.vendorService.listCollection.address1;
            this.sourceVendor.address2 = this.vendorService.listCollection.address2;
            this.sourceVendor.address3 = this.vendorService.listCollection.address3;
            this.sourceVendor.city = this.vendorService.listCollection.city;
            this.sourceVendor.stateOrProvince = this.vendorService.listCollection.stateOrProvince;
            this.sourceVendor.postalCode = this.vendorService.listCollection.postalCode;
            this.sourceVendor.vendorClassificationIds = this.sourceVendor.vendorClassifications;
            if (this.sourceVendor.parent) {
            this.sourceVendor.vendorParentId = getObjectById('vendorId', this.sourceVendor.vendorParentId, this.allActions);
            }
        }
        if (this.customerser.isCustomerAlsoVendor == true) {
            this.sourceVendor = this.customerser.localCollectiontoVendor;
            this.sourceVendor.vendorEmail = this.customerser.localCollectiontoVendor.email;
            this.sourceVendor.vendorPhone = this.customerser.localCollectiontoVendor.customerPhone;
            this.sourceVendor.vendorName = this.customerser.localCollectiontoVendor.name;
            this.sourceVendor.vendorCode = this.customerser.localCollectiontoVendor.customerCode;
            this.vendorCodeTemp = this.sourceVendor.vendorCode ? this.sourceVendor.vendorCode : 'Creating';
            this.sourceVendor.doingBusinessAsName = this.customerser.localCollectiontoVendor.doingBuinessAsName;
            this.sourceVendor.postalCode = this.customerser.localCollectiontoVendor.postalCode;
        }
    }
    checkFilteredDateValue(event){
    }
    closethis() {
        this.closeCmpny = false;
    }
    public allWorkFlows: any[] = [];

    async loadVendorData(strText = '') {
        if(this.vendorId > 0)
			this.arrayVendorlist.push(this.vendorId);
		if(this.arrayVendorlist.length == 0) {			
            this.arrayVendorlist.push(0); }
        
        await this.commonService.autoSuggestionSmartDropDownList('Vendor', 'VendorId', 'VendorName',strText,true,20,this.arrayVendorlist.join()).subscribe(response => {
            
            this.venderListOriginal = response.map(x => {
                return {
                    vendorName: x.label, vendorId: x.value //, customerId: x.value
                }
            })
                    
            this.vendorNames = response;

            this.vendorNames = this.venderListOriginal.reduce((acc, obj) => {
                return acc.filter(x => x.vendorId !== this.selectedParentId)
            }, this.venderListOriginal)

            if (this.vendorId) {            
                this.getVendorData(this.vendorId);
            }
            this.checVendorName();
		},err => {
			const errorLog = err;
            this.onDataLoadFailed(errorLog);		
            this.isSpinnerVisible = false;
		});
    }	

    bindvendordropdownData(strText = '') {
        if(this.vendorId > 0)
			this.arrayVendorlist.push(this.vendorId);
		if(this.arrayVendorlist.length == 0) {			
            this.arrayVendorlist.push(0); }
        
        this.commonService.autoSuggestionSmartDropDownList('Vendor', 'VendorId', 'VendorName',strText,true,20,this.arrayVendorlist.join()).subscribe(response => {
            this.venderListOriginal = response.map(x => {
                return {
                    vendorName: x.label, vendorId: x.value 
                }
            })
            this.vendorNames = response;
            this.vendorNames = this.venderListOriginal.reduce((acc, obj) => {
                return acc.filter(x => x.vendorId !== this.selectedParentId)
            }, this.venderListOriginal)
            
            this.checVendorName();
		},err => {
			const errorLog = err;
            this.onDataLoadFailed(errorLog);		
            this.isSpinnerVisible = false;
		});
    }

    enableSave() {
        this.disableSaveForEdit = false;
    }
    
    enableSaveDocument() {
		this.disableSaveForEditDocument = false;
    }

    enableSaveDocumentAudit() {
		this.disableSaveForEditDocumentAudit = false;
    }

    //get Country List
    private countrylist() {
        this.isSpinnerVisible = true;
        this.vendorService.getCountrylist().subscribe(
            results => this.onDatacountrySuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    private onDatacountrySuccessful(allWorkFlows: any[]) {
        this.isSpinnerVisible = false;
        this.dataSource.data = allWorkFlows;
        this.allCountryinfo = allWorkFlows;
        if (this.vendorService.isEditMode && this.sourceVendor.countryId != null) {
        }
    }

    public addEntity() {
        let dialogRef = this.dialog.open(AddActionsDialogComponent, {
            panelClass: 'mat-dialog-md', data: { role: "" }
        });
        dialogRef.afterClosed().subscribe(role => {
            if (role) {
            }
        },
            error => this.onDataLoadFailed(error));
    }
    //Load Address 
    private loadAddressDara() {
        this.isSpinnerVisible = true;
        this.vendorService.getAddressDtails().subscribe(
            results => this.onAddressDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    private onAddressDataLoadSuccessful(alladdress: any[]) {
        this.dataSource.data = alladdress;
        this.allAddresses = alladdress;
        this.addressId = this.allAddresses[0].addressId;
        this.isSpinnerVisible = false;
    }
    
    //Load Master Companies
    onClickMemo() {
        this.memoPopupContent = this.documentInformation.docMemo;
        this.enableSaveDocumentAudit();
        this.enableSaveDocument();
        this.disableSaveMemo=true;
    }

    enableSaveMemo() {
        this.disableSaveMemo = false;
    }
    
    onClickPopupSave() {
        this.documentInformation.docMemo = this.memoPopupContent;
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
    openClassification(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new VendorClassification();
        this.sourceAction.isActive = true;
        this.vendorName = "";
        this.vendorClassName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    
    async getAllVendorClassification() {
        await this.commonService.smartDropDownList('VendorClassification', 'VendorClassificationId', 'ClassificationName').subscribe(res => {
            this.allvendorclassificationInfo = res;
        },
            error => this.onDataLoadFailed(error));
    }

    async getAllIntegrations() {
		var strText = '';
        if(this.arrayIntegrationlist.length == 0) {			
            this.arrayIntegrationlist.push(0); }
        await this.commonService.autoSuggestionSmartDropDownList('IntegrationPortal', 'IntegrationPortalId', 'Description',strText,true,300,this.arrayIntegrationlist.join()).subscribe(res => {
            this.integrationOriginalList = res.map(x => {
                return {
                    label: x.label, value: x.value 
                }
            })
		})
	}

    async  getVendorIntegrationByVendorrId() {
        if (this.sourceVendor.vendorId > 0) {
            await this.commonService.getIntegrationMapping(this.sourceVendor.vendorId, 3).subscribe(res => {
                this.sourceVendor.integrationPortalIds = res.map(x => x.integrationPortalId);
            },
                error => this.onDataLoadFailed(error));
        }
    }

    filterVendors(event) {
        this.vendorCollection = [];
        for (let i = 0; i < this.allVendorClassInfo.length; i++) {
            let vendorName = this.allVendorClassInfo[i].classificationName;
            if (vendorName != "" && vendorName != null && vendorName != "Null") {
                if (vendorName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.vendorCollection.push(vendorName);
                }
            }
        }
    }
    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }
    private refresh() {
        this.applyFilter(this.dataSource.filter);
    }
    private onvendorloadsuccessfull(allWorkFlows: any[]) {
        this.vendorInfoByName = allWorkFlows[0]
        this.sourceVendor = this.vendorInfoByName;
    }

    filterVendorNames(event) {
		if (event.query !== undefined && event.query !== null) {
			this.bindvendordropdownData(event.query); }
    }

    async loadVendorParentsData(strText = '') {      
		if(this.arrayVendorParentlist.length == 0 || this.arrayVendorParentlist == undefined) {			
			this.arrayVendorParentlist.push(0); }
        await  this.commonService.autoSuggestionSmartDropDownList('Vendor', 'VendorId', 'VendorName',strText,true,20,this.arrayVendorParentlist.join()).subscribe(response => {
            
            this.parentVendorOriginal = response.map(x => {
                return {
                    vendorName: x.label, vendorId: x.value 
                }
            })

            this.vendorParentNames = this.parentVendorOriginal.reduce((acc, obj) => {
                return acc.filter(x => x.vendorId != this.newvendorId)
            }, this.parentVendorOriginal)

            this.sourceVendor = {
                ...this.sourceVendor,
                vendorParentId: getObjectByValue('vendorName', this.sourceVendor.vendorParentName, this.parentVendorOriginal)
            };
		},err => {
			const errorLog = err;
            this.onDataLoadFailed(errorLog);	
            this.isSpinnerVisible = false;	
		});
    }
    
    filterVendorParentNames(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loadVendorParentsData(event.query); }
    }

    selectedParentName(event) {
        if (event.name === this.sourceVendor.vendorName) {
            this.disableSaveParentName = true;
        }
        else {
            this.disableSaveParentName = false;
        }
    }
    checkWithName(event) {
        if (event === this.sourceVendor.vendorName) {
            this.disableSaveParentName = true;
        }
        else {
            this.disableSaveParentName = false;
        }
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
    filterVendorCodes(event) {
        this.vendorCodes = [];
        for (let i = 0; i < this.allActions.length; i++) {
            let vendorCode = this.allActions[i].vendorCode;
            if (vendorCode.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.VendorCodesColl.push([{
                    "vendorId": this.allActions[i].vendorClassificationId,
                    "vendorCode": vendorCode
                }]),
                    this.vendorCodes.push(vendorCode);
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
        this.toGetVendorGeneralDocumentsList(this.sourceVendor.vendorId);
        this.actionName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    openDelete(content, row) {
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceVendor = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    openEdit(content, row) {
        this.toGetVendorGeneralDocumentsList(this.sourceVendor.vendorId);
        this.isEditMode = true;
        this.isSaving = true;
        this.sourceVendor = row;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    openView(content, row) {
        this.sourceVendor = row;
        this.action_name = row.description;
        this.memo = row.memo;
        this.createdBy = row.createdBy;
        this.updatedBy = row.updatedBy;
        this.createddate = row.createdDate;
        this.updatedDate = row.updatedDate;
        this.loadMasterCompanies();
        this.toGetVendorGeneralDocumentsList(this.sourceVendor.vendorId);
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openHist(content, row) {
        this.sourceVendor = row;
    }

    convertUrlToLowerCase(event) {
        const value = event.target.value;
        event.target.value = toLowerCaseOnInput(value);
    }

    checkVendorExists(field, value) {
        let isEdit;
        if (this.vendorService.isEditMode) {
            this.editModeData = this.vendorService.listCollection;
        } else {
            isEdit = undefined;
        }
        const exists = validateRecordExistsOrNot(field, value, this.allActions, this.editModeData);

        if (exists.length > 0) {
            if (field == 'vendorName') {
                this.disableSaveVenderName = true;
            } else if (field == 'vendorPhone') {
                this.disableSaveVendorPhone = true;
            } else {
                this.disableSaveVendorEmail = true;
            }
        }
        else {
            if (field == 'vendorName') {
                this.disableSaveVenderName = false;
            } else if (field == 'vendorPhone') {
                this.disableSaveVendorPhone = false;
            } else {
                this.disableSaveVendorEmail = false;
            }
        }
        if (this.vendorService.isEditMode) {
            if (value == this.editModeData.vendorName.vendorName) {
                this.disableSaveVenderName = false;
            }
        }
    }
    saveConformation(goNext?){
        if(this.sourceVendor.isVendorAlsoCustomer &&  this.vendorService.isEditMode ){
            this.editItemAndCloseModel(goNext);
        }else if(this.sourceVendor.isVendorAlsoCustomer == false || this.sourceVendor.isVendorAlsoCustomer == undefined ){
            this.flagForAddingVendor = true;
            this.editItemAndCloseModel(goNext);
        }else if(this.sourceVendor.isVendorAlsoCustomer == true &&  this.vendorService.isEditMode == false){
            $('#isAlsoaCustomer').modal('show');  
        }
    }

    isCustomerAlsoaVendor(value, goNext){
        if(value === 'Yes'){
            this.sourceVendor.isVendorAlsoCustomer = true;
            this.flagForAddingVendor = true;
        }else{
            this.sourceVendor.isVendorAlsoCustomer = false;
        }
        this.editItemAndCloseModel(goNext);
    }

    editItemAndCloseModel(goNxt?: any) {
        this.isSaving = true;
        this.isEditMode = true;

        if(this.sourceVendor.countryId == undefined || this.sourceVendor.countryId == '' || this.sourceVendor.countryId == null) {
			this.alertService.showMessage(
				'Validation Error',
				`Country Selection is Required.`,
                MessageSeverity.error)		
            return;
        } 

        this.sourceVendor.vendorCode = this.vendorCodeTemp;
        if (!(this.sourceVendor.vendorName && this.sourceVendor.vendorCode && this.sourceVendor.vendorEmail && this.sourceVendor.vendorPhone && this.sourceVendor.address1 && this.sourceVendor.city
            && this.sourceVendor.postalCode && this.sourceVendor.countryId && this.sourceVendor.vendorClassificationIds
        )) {
            this.modelValue = true;
        }
        if (this.sourceVendor.vendorName && this.sourceVendor.vendorCode && this.sourceVendor.vendorEmail && this.sourceVendor.vendorPhone && this.sourceVendor.address1 && this.sourceVendor.city
            && this.sourceVendor.postalCode && this.sourceVendor.countryId && this.sourceVendor.vendorClassificationIds) {            
            if (!this.sourceVendor.vendorId) {             
                //For Add New Vendor   
                if (this.flagForAddingVendor == false) {
                    this.sourceVendor.createdBy = this.userName;
                    this.sourceVendor.updatedBy = this.userName;
                    this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;
                    this.sourceVendor.isActive = true;
                    if (this.sourceVendor.parent == false || this.sourceVendor.parent == null) {
                        this.sourceVendor.vendorParentName = '';
                    }
                    const countryId = editValueAssignByCondition('countries_id', this.sourceVendor.countryId);
                    const country = editValueAssignByCondition('nice_name', this.sourceVendor.countryId);
                    let vendorParentId;
                    if (this.sourceVendor.parent) {
                        vendorParentId = editValueAssignByCondition('vendorId', this.sourceVendor.vendorParentId);
                    }
                    this.allowNextView = true;
                    if (this.sourceVendor.isVendorAlsoCustomer == true) {
                        this.vendorService.isVendorAlsoCustomer = this.sourceVendor.isVendorAlsoCustomer;
                        this.vendorService.localCollectiontoCustomer = this.sourceVendor;
                    }
                    this.viewName = "Edit";
                    this.vendorService.listCollection = this.sourceVendor;
                    this.flagForAddingVendor = true;
                } else {
                    this.isSpinnerVisible = true;
                    this.sourceVendor.createdBy = this.userName;
                    this.sourceVendor.updatedBy = this.userName;
                    this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;
                    this.sourceVendor.isActive = true;
                    if (this.sourceVendor.parent == false || this.sourceVendor.parent == null) {
                        this.sourceVendor.vendorParentName = '';
                    }
                    const countryId = editValueAssignByCondition('countries_id', this.sourceVendor.countryId);
                    const country = editValueAssignByCondition('nice_name', this.sourceVendor.countryId);
                    let vendorParentId;
                    if (this.sourceVendor.parent) {
                        vendorParentId = editValueAssignByCondition('vendorId', this.sourceVendor.vendorParentId);
                    }

                    const data = { ...this.sourceVendor, vendorParentId: vendorParentId ,countryId:countryId,country:country};

                    this.vendorService.newAction(data).subscribe(data => {
                        this.sourceVendor.vendorName = editValueAssignByCondition('vendorName', this.sourceVendor.vendorName)
                        this.allowNextView=true;
                        this.localCollection = data;
                        this.vendorId = data.vendorId;
                        this.sourceVendor.vendorId =  data.vendorId;
                        localStorage.setItem('commonId', this.vendorId);
                        // if(this.sourceViewforDocumentList && this.sourceViewforDocumentList.length>0){
                                // this.onUploadDocumentListNew(data.vendorId);
                        // }
                        this.isSpinnerVisible = false;
                        this.uploadDocs.next(true);
                        if (this.sourceVendor.isVendorAlsoCustomer == true) {
                            this.vendorService.isVendorAlsoCustomer = this.sourceVendor.isVendorAlsoCustomer;
                            this.vendorService.localCollectiontoCustomer = this.sourceVendor;
                        }
                        this.viewName = "Edit";
                        this.selectedParentId = data.vendorParentId
                        this.vendorService.listCollection = this.sourceVendor;
                        this.savesuccessCompleted(this.sourceVendor, goNxt);
                        this.enableUpdate = true;
                        this.disableSaveForEdit = true;
                        
                        this.vendorService.isEditMode =  true;
                        this.vendorService.vendorId = data.vendorId;
                        this.vendorService.checkVendorEditmode(true);
                        this.vendorService.isEditMode = true;
                        this.vendorService.enableExternal = true;
                        this.router.navigateByUrl(`vendorsmodule/vendorpages/app-vendor-general-information/${this.vendorId}`);
                  },
                      error => this.saveFailedHelper(error))
                }
            }
            else {
                //For Upadate Vendor  
                this.isSpinnerVisible = true;
                const vendorName = editValueAssignByCondition('vendorName', this.sourceVendor.vendorName);
                const countryId = editValueAssignByCondition('countries_id', this.sourceVendor.countryId);
                const country = editValueAssignByCondition('nice_name', this.sourceVendor.countryId);
                let vendorParentId;
                this.sourceVendor.updatedBy = this.userName;
                if (this.sourceVendor.parent == false || this.sourceVendor.parent == null) {
                    this.sourceVendor.vendorParentName = '';
                }
                if (this.sourceVendor.parent) {
                    vendorParentId = editValueAssignByCondition('vendorId', this.sourceVendor.vendorParentId);
                }
                const data = { ...this.sourceVendor, vendorName: vendorName, vendorParentId: vendorParentId,countryId:countryId,country:country};
                const { vendorContact, address, ...newSourceVendor } = data;
                this.vendorService.updateVendorDetails(newSourceVendor).subscribe(
                    data => {
                        this.allowNextView=true;
                        this.localCollection = data;
                        this.selectedParentId = data.vendorParentId
                        // if(this.sourceViewforDocumentList && this.sourceViewforDocumentList.length>0){
                            // this.onUploadDocumentListNew(data.vendorId);
                        // }
                        this.isSpinnerVisible = false;
                        this.uploadDocs.next(true);
                        this.savesuccessCompleted(this.sourceVendor, goNxt);
                        this.disableSaveForEdit = true;
                       
                    },
                    error => { this.isSpinnerVisible = false; })
            }
        }
        else {
        }
    }
    nextClick() {
        this.vendorService.vendorgeneralcollection = this.local;
        this.activeIndex = 2;
        this.vendorService.changeofTab(this.activeIndex);
    }
    dismissModelNew() {
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
    }
    private savesuccessCompleted(user?: any, goNxt?: any) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `${this.vendorService.isEditMode==true ? 'Updated' : 'Saved'}  General Information  successfully`, MessageSeverity.success);
    }
    private saveSuccessHelper(role?: any) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
    }
    
    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    onUpload(event) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: 'File Uploaded', detail: '' });
    }

    onVendorselected(object) {
        if (this.vendorService.isEditMode === true) {
            this.selectedEditData = this.originalData
        } else {
            this.selectedEditData = undefined;
        }

        const exists = selectedValueValidate('vendorId', object, this.selectedEditData);
        this.disableSaveVenderName = !exists;
    }

    checVendorName() {
        if(this.newvendorId){
            this.loadVendorParentsData();
        }
    }

    eventvendorHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedVendorCode) {
                if (value == this.selectedVendorCode.toLowerCase()) {
                    this.disableSaveVenCode = true;
                    this.disableSaveVenderCode = true;
                }
                else {
                    this.disableSaveVenCode = false;
                    this.disableSaveVenderCode = false;
                }
            }
        }
    }
    onVendorCodeselected(event) {
        for (let i = 0; i < this.VendorCodesColl.length; i++) {
            if (event == this.VendorCodesColl[i][0].vendorCode) {
                this.disableSaveVenCode = true;
                this.disableSaveVenderCode = true;
                this.selectedVendorCode = event;
            }
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
        }
    }

    eventCountryHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            for (let i = 0; i < this.allCountryinfo.length; i++) {
                if (value == this.allCountryinfo[i].nice_name.toLowerCase()) {
                    this.sourceVendor.nice_name = this.allCountryinfo[i].nice_name;
                    this.sourceVendor.countryId = getObjectByValue('nice_name', this.allCountryinfo[i].nice_name, this.allCountryinfo)
                    this.disablesave = false;
                    this.selectedCountries = event;
                    return;
                }
            }
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
    
    parentEventHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    this.disableSaveParentName = false;
                }
                else {
                    this.disableSaveParentName = true;
                }
            }
        }
    }

    onParentNameselected(event) {
        if (this.allActions) {
            for (let i = 0; i < this.allActions.length; i++) {
                if (event == this.allActions[i].vendorName) {
                    this.sourceVendor.vendorParentName = event;
                    this.disableSaveParentName = false;
                    this.selectedActionName = event;
                }
            }
        }
    }

    onClassificationelected(event) {
        if (this.allVendorClassInfo) {
            for (let i = 0; i < this.allVendorClassInfo.length; i++) {
                if (event == this.allVendorClassInfo[i].classificationName) {
                    this.sourceVendor.vendorClassificationId = event;
                    this.disablesaveForClassification = true;
                    this.selectedClass = event;
                }
            }
        }
    }
    
    eventClassificationHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedClass) {
                if (value == this.selectedClass.toLowerCase()) {
                    this.disablesaveForClassification = true;
                }
                else {
                    this.disablesaveForClassification = false;
                }
            }
        }
    }
    onAddIntegrationWith() {
        this.addNewIntergation = { ...this.intergrationNew };
        this.isIntegrationAlreadyExists = false;
    }
    onAddCapabilities() {
        const id=this.sourceVendor.vendorId ? this.sourceVendor.vendorId :this.vendorId;
        this.router.navigateByUrl('/vendorsmodule/vendorpages/app-vendor-capabilities-list/' + id );
    }
    patternMobilevalidationWithSpl(event: any) {
        const pattern = /[0-9\+\-()\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    fileUpload(event, fileType) {
        if (event.files.length === 0)
            return;
        for (let file of event.files) {           
            this.formData.append(fileType, file);

        }
    }
    toGetVendorGeneralDocumentsList(vendorId) {
        var moduleId = 3;
        this.vendorService.GetVendorGeneralDocumentsList(vendorId, moduleId).subscribe(res => {
            this.allVendorGeneralDocumentsList = res;
        },
            error => this.onDataLoadFailed(error))
    }
    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }
    VendorAttachmentDelete(rowData) {
        let attachmentDetailId = rowData.attachmentDetailId;
        let updatedBy = this.userName;
        this.vendorService.GetVendorAttachmentDelete(attachmentDetailId, updatedBy).subscribe(res => {
            this.toGetVendorGeneralDocumentsList(this.sourceVendor.vendorId)
        },
            error => this.onDataLoadFailed(error))
    }
    onClearParent() {
        this.sourceVendor.vendorParentId = undefined;
    }

    filterIntegrations(event) {
        this.integrationList = this.integrationOriginalList;
        this.integrationList = [...this.integrationOriginalList.filter(x => {
            return x.label.toLowerCase().includes(event.query.toLowerCase())
        })]
    }

    checkIntergationExists(field, value) {
        const exists = validateRecordExistsOrNot('label', value, this.integrationOriginalList)
        if (exists.length > 0) {
            this.isIntegrationAlreadyExists = true;
        } else {
            this.isIntegrationAlreadyExists = false;
        }
    }
    selectedWebSite() {
        this.isIntegrationAlreadyExists = true;
    }

    newIntegrationAdd() {
        const data = {
            ...this.addNewIntergation,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName
        }
        this.integrationService.newAction(data).subscribe(() => {
            this.getAllIntegrations();
            this.alertService.showMessage(
                'Success',
                `Added New Integration  Sucessfully `,
                MessageSeverity.success
            );
        },
            error => this.onDataLoadFailed(error))
    }
    addDocumentDetails() {
        this.selectedFileAttachment = [];
        this.disableFileAttachmentSubmit = false;
        this.selectedFileAttachmentAudit = [];
        this.index = 0;
        this.isEditButton = false;
        this.documentInformation = {
            docName: '',
            docMemo: '',
            docDescription: '',
            attachmentDetailId: 0
        }
    }
    dismissDocumentPopupModel(type) {
        this.fileUploadInput.clear();
        this.fileUploadInputAudit.clear();
        this.closeMyModel(type);
    }
    closeMyModel(type) {
        $(type).modal("hide");

    }
    downloadFileUploadNew(link) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${link}`;
        window.location.assign(url);
    }
    fileUploadCertified(event) {

        if (event.files.length === 0) {
             this.disableFileAttachmentSubmit = false;
        } else {
            this.disableFileAttachmentSubmit = true;
        }
        const filesSelectedTemp = [];
        this.selectedFileAttachment = [];
        for (let file of event.files) {
            var flag = false;
            for (var i = 0; i < this.sourceViewforDocumentList.length; i++) {
                if (this.sourceViewforDocumentList[i].fileName == file.name) {
                    flag = true;
                    this.alertService.showMessage(
                        'Duplicate',
                        `Already Exists this file `,
                        MessageSeverity.warn
                    );
                    this.disableFileAttachmentSubmit = false;
                    if (this.fileUploadInput) {
                        this.fileUploadInput.clear()
                    }
                }
            }
            if (!flag) {
                filesSelectedTemp.push({
                    link: file.objectURL,
                    fileName: file.name,
                    isFileFromServer: false,
                    fileSize: file.size,
                })
                this.formData.append(file.name, file);
            }
        }
        for (var i = 0; i < filesSelectedTemp.length; i++) {
            this.selectedFileAttachment.push({
                docName: this.documentInformation.docName,
                docMemo: this.documentInformation.docMemo,
                docDescription: this.documentInformation.docDescription,
                createdBy: this.userName,
                updatedBy: this.userName,
                link: filesSelectedTemp[i].link,
                fileName: filesSelectedTemp[i].fileName,
                fileSize: filesSelectedTemp[i].fileSize,
                isFileFromServer: false,
                attachmentDetailId: 0,
                moduleId:48,
            })
        }
    }
    fileUploadVendorAudit(event) {
        if (event.files.length === 0) {
            return this.disableFileAttachmentSubmit = false;
        } else {
            this.disableFileAttachmentSubmit = true;
        }
        const filesSelectedTemp = [];
        this.selectedFileAttachmentAudit = [];
        for (let file of event.files) {
            var flag = false;
            for (var i = 0; i < this.sourceViewforDocumentListAudit.length; i++) {
                if (this.sourceViewforDocumentListAudit[i].fileName == file.name) {
                    flag = true;
                    this.alertService.showMessage(
                        'Duplicate',
                        `Already Exists this file `,
                        MessageSeverity.warn
                    );
                    this.disableFileAttachmentSubmit = false;
                    if (this.fileUploadInputAudit) {
                        this.fileUploadInputAudit.clear()
                    }
                }
            }
            if (!flag) {
                filesSelectedTemp.push({
                    link: file.objectURL,
                    fileName: file.name,
                    isFileFromServer: false,
                    fileSize: file.size,
                })
                this.formData.append(file.name, file);
            }
        }
        for (var i = 0; i < filesSelectedTemp.length; i++) {
            this.selectedFileAttachmentAudit.push({
                docName: this.documentInformation.docName,
                docMemo: this.documentInformation.docMemo,
                docDescription: this.documentInformation.docDescription,
                createdBy: this.userName,
                updatedBy: this.userName,
                link: filesSelectedTemp[i].link,
                fileName: filesSelectedTemp[i].fileName,
                fileSize: filesSelectedTemp[i].fileSize,
                isFileFromServer: false,
                attachmentDetailId: 0,
                moduleId: 49,
            })
        }
    }
    onFileChanged(event) {
        this.selectedFile = event.target.files[0];
    }
    addDocumentInformation(type, documentInformation,mode) {
        if (this.selectedFileAttachment != []) {
            for (var i = 0; i < this.selectedFileAttachment.length; i++) {
                this.sourceViewforDocumentList.push({
                    docName: documentInformation.docName,
                    docMemo: documentInformation.docMemo,
                    docDescription: documentInformation.docDescription,
                    link: this.selectedFileAttachment[i].link,
                    fileName: this.selectedFileAttachment[i].fileName,
                    isFileFromServer: false,
                    attachmentDetailId: 0,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    createdDate: Date.now(),
                    updatedDate: Date.now(),
                    fileSize: (((this.selectedFileAttachment[i].fileSize) / (1024 * 1024)).toFixed(2))+'MB',
                    moduleId:48
                })
             }
         }

        if (documentInformation.attachmentDetailId > 0 || this.index > 0) {
            for (var i = 0; i <= this.sourceViewforDocumentList.length; i++) {
                if (this.sourceViewforDocumentList[i].attachmentDetailId > 0) {
                    if (this.sourceViewforDocumentList[i].attachmentDetailId == documentInformation.attachmentDetailId) {

                        this.sourceViewforDocumentList[i].docName = documentInformation.docName;
                        this.sourceViewforDocumentList[i].docMemo = documentInformation.docMemo;
                        this.sourceViewforDocumentList[i].docDescription = documentInformation.docDescription;
                        break;
                    }
                }
                else {
                    if (i == this.index) {
                        this.sourceViewforDocumentList[i].docName = documentInformation.docName;
                        this.sourceViewforDocumentList[i].docMemo = documentInformation.docMemo;
                        this.sourceViewforDocumentList[i].docDescription = documentInformation.docDescription;
                        break;
                    }
                }
            }
        }
        if (mode == 'add') {
            this.alertService.showMessage(
                'Success',
                `Document added successfully. `,
                MessageSeverity.success
            );
        } else {
            this.alertService.showMessage(
                'Success',
                `Document updated successfully. `,
                MessageSeverity.success
            );
        }
        this.sourceViewforDocumentList = [...this.sourceViewforDocumentList]
        if (this.sourceViewforDocumentList.length > 0) {
            this.totalRecordsCertified = this.sourceViewforDocumentList.length;
            this.totalPagesCertified = Math.ceil(this.totalRecordsCertified / this.pageSizeNew);
        }
        this.index = 0;
        this.isEditButton = false;
        this.disableFileAttachmentSubmit == true;
        this.enableSave();
        this.dismissDocumentPopupModel(type)
        if (this.fileUploadInput) {
            this.fileUploadInput.clear()
        }
    }
    addDocumentInformationVendorAudit(type, documentInformation,mode) {
        if (this.selectedFileAttachmentAudit != []) {
            for (var i = 0; i < this.selectedFileAttachmentAudit.length; i++) {
                this.sourceViewforDocumentListAudit.push({
                    docName: documentInformation.docName,
                    docMemo: documentInformation.docMemo,
                    docDescription: documentInformation.docDescription,
                    link: this.selectedFileAttachmentAudit[i].link,
                    fileName: this.selectedFileAttachmentAudit[i].fileName,
                    isFileFromServer: false,
                    attachmentDetailId: 0,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    createdDate: Date.now(),
                    updatedDate: Date.now(),
                    fileSize: (((this.selectedFileAttachmentAudit[i].fileSize) / (1024 * 1024)).toFixed(2))+'MB',
                    moduleId: 49
                })
            }
        }
        if (documentInformation.attachmentDetailId > 0 || this.index > 0) {
            for (var i = 0; i <= this.sourceViewforDocumentListAudit.length; i++) {
                if (documentInformation.attachmentDetailId > 0) {
                    if (this.sourceViewforDocumentListAudit[i].attachmentDetailId == documentInformation.attachmentDetailId) {
                        this.sourceViewforDocumentListAudit[i].docName = documentInformation.docName;
                        this.sourceViewforDocumentListAudit[i].docMemo = documentInformation.docMemo;
                        this.sourceViewforDocumentListAudit[i].docDescription = documentInformation.docDescription;
                        break;
                    }
                }
                else {
                    if (i == this.index) {
                        this.sourceViewforDocumentListAudit[i].docName = documentInformation.docName;
                        this.sourceViewforDocumentListAudit[i].docMemo = documentInformation.docMemo;
                        this.sourceViewforDocumentListAudit[i].docDescription = documentInformation.docDescription;
                        break;
                    }
                }
            }
        }

        if (mode == 'add') {
            this.alertService.showMessage(
                'Success',
                `Document added successfully. `,
                MessageSeverity.success
            );
        } else {
            this.alertService.showMessage(
                'Success',
                `Document updated successfully. `,
                MessageSeverity.success
            );
        }
        this.sourceViewforDocumentListAudit = [...this.sourceViewforDocumentListAudit]
        if (this.sourceViewforDocumentListAudit.length > 0) {
            this.totalRecordsAudit = this.sourceViewforDocumentListAudit.length;
            this.totalPagesAudit = Math.ceil(this.totalRecordsAudit / this.pageSizeNew);
        }
        this.index = 0;
        this.isEditButton = false;
        this.disableFileAttachmentSubmit == true;
        this.enableSave();
        this.dismissDocumentPopupModel(type)
        if (this.fileUploadInputAudit) {
            this.fileUploadInputAudit.clear()
        }
    }
    editCustomerDocument(rowdata,index=0) {
        this.selectedFileAttachment = [];
        this.disableSaveForEditDocumentAudit = true;
        this.disableSaveForEditDocument = true;
        this.isEditButton = true;
        this.documentInformation = rowdata;
        this.index = index;
        if (rowdata.attachmentDetailId > 0) {
            this.toGetDocumentView(rowdata.attachmentDetailId);
        }
        else {
            this.sourceViewforDocument = [];
            this.sourceViewforDocument.push(rowdata);
        }
    }

    editCustomerDocumentAudit(rowdata,index=0) {
        this.selectedFileAttachmentAudit=[];
        this.disableSaveForEditDocumentAudit = true;
        this.disableSaveForEditDocument = true;
        this.isEditButton = true;
        this.documentInformation = rowdata;
        if (rowdata.attachmentDetailId > 0) {
            this.toGetDocumentViewAudit(rowdata.attachmentDetailId);
        }
        else {
            this.sourceViewforDocumentVendorAudit = [];
            this.sourceViewforDocumentVendorAudit.push(rowdata);
        }
    }

    deleteAttachmentRow(rowdata, index, content) {
        this.selectedRowForDelete = rowdata;
        this.rowIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm' });
    }

    deleteAttachmentRowAudit(rowdata, index, content) {
        this.selectedRowForDeleteAudit = rowdata;
        this.rowIndexAudit = index;
        this.modal = this.modalService.open(content, { size: 'sm' });
    }

    deleteItemAndCloseModel() {
        let attachmentDetailId = this.selectedRowForDelete.attachmentDetailId;
        if (attachmentDetailId > 0) {
            this.commonService.GetAttachmentDeleteById(attachmentDetailId, this.userName).subscribe(res => {
                this.toGetDocumentsListNew(this.sourceVendor.vendorId);
            },
                error => this.saveFailedHelper(error))
        }
        else {
            this.sourceViewforDocumentList.splice(this.rowIndex, 1)
            this.totalRecordsCertified = this.sourceViewforDocumentList.length;
            this.totalPagesCertified = Math.ceil(this.totalRecordsCertified / this.pageSizeNew);
        }
        this.alertService.showMessage(
            'Success',
            `Deleted Attachment  Successfully`,
            MessageSeverity.success
        );
        this.modal.close();
    }
    deleteItemAndCloseModelAudit() {
        let attachmentDetailId = this.selectedRowForDeleteAudit.attachmentDetailId;
        if (attachmentDetailId > 0) {
            this.commonService.GetAttachmentDeleteById(attachmentDetailId, this.userName).subscribe(res => {
                this.toGetDocumentsListAudit(this.sourceVendor.vendorId);
            },
                error => this.saveFailedHelper(error))
        }
        else {
            this.sourceViewforDocumentListAudit.splice(this.rowIndexAudit, 1)
            this.totalRecordsAudit = this.sourceViewforDocumentListAudit.length;
            this.totalPagesAudit = Math.ceil(this.totalRecordsAudit / this.pageSizeNew);
        }
        this.alertService.showMessage(
            'Success',
            `Deleted Attachment  Successfully`,
            MessageSeverity.success
        );
        this.modal.close();
    }
    onUploadDocumentListNew(vendorId) {
        const vdata = {
            referenceId: vendorId,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName, 
            moduleId: 48,
        }
        for (var key in vdata) {
            this.formData.append(key, vdata[key]);
        }
        if (this.sourceViewforDocumentListAudit != []) {
            for (var i = 0; i < this.sourceViewforDocumentListAudit.length; i++) {
                this.sourceViewforDocumentList.push({
                    docName: this.sourceViewforDocumentListAudit[i].docName,
                    docMemo: this.sourceViewforDocumentListAudit[i].docMemo,
                    docDescription: this.sourceViewforDocumentListAudit[i].docDescription,
                    link: this.sourceViewforDocumentListAudit[i].link,
                    fileName: this.sourceViewforDocumentListAudit[i].fileName,
                    isFileFromServer: false,
                    attachmentDetailId: this.sourceViewforDocumentListAudit[i].attachmentDetailId,
                    createdBy: this.sourceViewforDocumentListAudit[i].createdBy,
                    updatedBy: this.sourceViewforDocumentListAudit[i].updatedBy,
                    createdDate: this.sourceViewforDocumentListAudit[i].createdDate,
                    updatedDate: this.sourceViewforDocumentListAudit[i].updatedDate,
                    fileSize: this.sourceViewforDocumentListAudit[i].fileSize,
                    moduleId: this.sourceViewforDocumentListAudit[i].moduleId,
                })
            }
            }
        this.formData.append('attachmentdetais', JSON.stringify(this.sourceViewforDocumentList));
        this.commonService.uploadVendorDocumentsEndpoint(this.formData).subscribe(res => {
            this.formData = new FormData();
        },
            error => this.saveFailedHelper(error));
    }
    onUploadDocumentListVendorAudit() {

        const vdata = {
            referenceId: this.sourceVendor.vendorId,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
            moduleId: 49,

        }
        for (var key in vdata) {
            this.formData.append(key, vdata[key]);
        }
        this.formData.append('attachmentdetais', JSON.stringify(this.sourceViewforDocumentListAudit));
        this.commonService.uploadVendorAuditDocumentsEndpoint(this.formData).subscribe(res => {
            this.formData = new FormData();
            this.toGetDocumentsListAudit(this.sourceVendor.vendorId);
        },
            error => this.saveFailedHelper(error));

    }

    toGetDocumentsListNew(id) {
        var moduleId = 48;
        this.commonService.GetDocumentsListNew(id, moduleId).subscribe(res => {
            this.sourceViewforDocumentList = res || [];
            this.allDocumentListOriginal = res;

            if (this.sourceViewforDocumentList.length > 0) {
                this.sourceViewforDocumentList.forEach(item => {
                    item["isFileFromServer"] = true;
                    item["moduleId"] = 48;


                })
            }
            this.totalRecordsCertified = this.sourceViewforDocumentList.length;
            this.totalPagesCertified = Math.ceil(this.totalRecordsCertified / this.pageSizeNew);
        },
            error => this.onDataLoadFailed(error))
    }
    toGetDocumentsListAudit(id) {
        var moduleId = 49;
        this.commonService.GetDocumentsListNew(id, moduleId).subscribe(res => {
            this.sourceViewforDocumentListAudit = res || [];
            this.allDocumentListOriginalAudit = res;
            
            if (this.sourceViewforDocumentListAudit.length > 0) {
                this.sourceViewforDocumentListAudit.forEach(item => {
                    item["isFileFromServer"] = true;
                    item["moduleId"] = 49;

                })
            }
            this.totalRecordsAudit = this.sourceViewforDocumentListAudit.length;
            this.totalPagesAudit = Math.ceil(this.totalRecordsAudit / this.pageSizeNew);

        },
            error => this.onDataLoadFailed(error))
    }
    toGetDocumentView(id) {
        this.commonService.GetAttachment(id).subscribe(res => {
            this.sourceViewforDocument = [];
            this.sourceViewforDocument.push(res);
        },
            error => this.onDataLoadFailed(error))
    }

    toGetDocumentViewAudit(id) {
        this.commonService.GetAttachment(id).subscribe(res => {
            this.sourceViewforDocumentVendorAudit = [];
            this.sourceViewforDocumentVendorAudit.push(res);
        },
            error => this.onDataLoadFailed(error))
    }

    dateFilterForTableNew(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.sourceViewforDocumentList = this.allDocumentListOriginal;
            const data = [...this.sourceViewforDocumentList.filter(x => {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.sourceViewforDocumentList = data;
        } else {
            this.sourceViewforDocumentList = this.allDocumentListOriginal;
        }
    }

    dateFilterForTableNewAudit(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            const data = [...this.sourceViewforDocumentListAudit.filter(x => {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.sourceViewforDocumentListAudit = data;
        } else {
            this.sourceViewforDocumentListAudit = this.allDocumentListOriginalAudit;
        }
    }

    dismissModel() {
        this.modal.close();
    }
    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.sourceViewforDocumentAudit = auditHistory;
        this.isSpinnerVisible = false;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }
    openHistory(content, rowData) {
        this.isSpinnerVisible = true;
        this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results, content),
            error => this.saveFailedHelper(error));
    }
    getColorCodeForHistory(i, field, value) {
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
    removeFile(event) {
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    previousOrNextTab(previousOrNext){
        this.nextOrPreviousTab = previousOrNext;
        let content = this.tabRedirectConfirmationModal;
        this.modal = this.modalService.open(content, { size: "sm" });
    }

    paginate(event, totalRecords) {
        this.getPageCount(totalRecords, event.rows);
    }

    redirectToTab(){
        this.dismissModel();

        if(!this.disableSaveForEdit)
        {
            this.editItemAndCloseModel('goNext');
        }    
		setTimeout(() => {
			this.stopmulticlicks = false;
		}, 500)
         
		if(this.nextOrPreviousTab == "Previous"){
            this.activeIndex = 8;
            this.vendorService.changeofTab(this.activeIndex);
            
        } else {
            this.activeIndex = 2;
            this.editVendorId.emit(this.vendorId);
            this.vendorService.changeofTab(this.activeIndex);
        }
    }

    redirectToTabWithoutSave(){
        this.dismissModel();

		if(this.nextOrPreviousTab == "Previous"){
            this.activeIndex = 11;
            this.vendorService.changeofTab(this.activeIndex);
            
        } else {
            this.activeIndex = 2;
            this.editVendorId.emit(this.vendorId);
            this.vendorService.changeofTab(this.activeIndex);
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
    changeOfStatus(status){
        this.disableSaveForEdit=false;

        // this.disableSaveForEdit = true;
    }
}

