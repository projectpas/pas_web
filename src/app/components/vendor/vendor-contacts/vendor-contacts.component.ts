import { Component, ViewChild, OnInit, Input } from '@angular/core';
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
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { getValueFromArrayOfObjectById, editValueAssignByCondition, getValueFromObjectByKey, getObjectByValue, getObjectById } from '../../../generic/autocomplete';
import { emailPattern, titlePattern, phonePattern, mobilePattern } from '../../../validations/validation-pattern';
import { DatePipe } from '@angular/common';
declare var $ : any;

import { AtaSubChapter1Service } from '../../../services/atasubchapter1.service';
import { AtaMainService } from '../../../services/atamain.service';
import { CommonService } from '../../../services/common.service';
import * as moment from 'moment';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';

@Component({
    selector: 'app-vendor-contacts',
    templateUrl: './vendor-contacts.component.html',
    styleUrls: ['./vendor-contacts.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
/** anys component*/
export class VendorContactsComponent implements OnInit {
	currentstatus: string = 'Active';
    modelValue: boolean;
    display: boolean;
    matSpinner: boolean;
    selectedOnly: boolean = false;
    targetData: any;
    activeIndex: any = 3;
    showFirstName: boolean;
    showemail: boolean;
    showworkPhone: boolean;
    showmobilePhone: boolean;
    showLastName: boolean;
    showvendorContractReference: boolean;
    emailPattern = emailPattern()
	titlePattern = titlePattern()
	phonePattern = phonePattern();
	mobilePattern = mobilePattern();
    alldata: any[];
    middleNames: any[];
    lastNames: any;
    isDefault: boolean = false;
    firstNames: any;
    vendorCode: any = "";
    vendorname: any = "";
    allgeneralInfo: any[];
    contactauditHisory: any[];
    collection: any;
    action_name: any = "";
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createddate: any = "";
    updatedDate: any = "";
    sub: any;
    local: any;
    viewName: string = "Create";
    lastName: any = "";
    firstName: any = "";
    contactTitle: any = "";
    email: any = "";
    mobilePhone: number;
    disableSaveMemo: boolean = true;
    fax: any;
    sourceVendorforView: any = {};
    selectedFirstName: any;
    selectedLastName:any;
	selectedMiddleName:any;
    disablesaveForFirstname: boolean;
    disablesaveForlastname: boolean;
    disablesaveForMiddlename: boolean;
    formData = new FormData();
    totalRecords: number = 0;
    memoPopupContent: any;
    pageIndex: number = 0;

    pageSize: number = 10;
    totalPages: number = 0;
    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    filteredBrands: any[];
    displayedColumns = ['actionId', 'companyName', 'description', 'memo', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<any>;
    allActions: any[] = [];
    //allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourceVendor: any = {};
    public sourceVendorUpdateStatus: any = {};
    public sourceAction: any = [];
    public auditHisory: AuditHistory[] = [];
    private bodyText: string;
    isSpinnerVisible: boolean = false;
    loadingIndicator: boolean;
    closeResult: string;
    selectedColumn: any[];
    cols: any[];
    title: string = "Create";
    id: number;
    errorMessage: any;
    modal: NgbModalRef;
    actionName: string;
    Active: string = "Active";
    length: number;
    localCollection: any;
    comName: string;
    isEditMode: boolean = false;
    isDeleteMode: boolean = false;
    isEditContactInfo: boolean = false;
    selectedRowforDelete: any;
    vendorContactsColumns = [
        { field: 'firstName', header: 'First Name' },
        { field: 'lastName', header: 'Last Name' },
        { field: 'contactTitle', header: 'Contact Title' }, 
        { field: 'email', header: 'Email' },
        { field: 'tagName', header: 'Tag' },
        { field: 'attention', header: 'Attention' },
        { field: 'mobilePhone', header: 'Mobile Phone',width:"100px" },
        { field: 'fullContactNo', header: 'Work Phone' ,width:"100px"},
        { field: 'notes', header: 'Memo' ,width:"130px"},
        //{ field: 'fax', header: 'FAX' },
        { field: 'isDefaultContact', header: 'IsPrimary' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' }
    ];

    selectedColumns = this.vendorContactsColumns;
    @Input() vendorId: number = 0;
    @Input() isViewMode: boolean = false;
    isvendorEditMode: any;
    disableSave: boolean = true;
    disableSaveATA: boolean = true;
    add_SelectedId: any;
    add_SelectedModels: any;
    add_ataSubChapterList: any;
    search_ataSubChapterList: any;
    search_ataSubChapterList1: any;
    ataListDataValues: any = [];
    originalATASubchapterData: any = [];
    selectedContact: any;
   
    ataChapterEditDat = {
        ataChapterId: null,
        ataSubChapterId: null,
        isActive: true,
        isDeleted: false,
        vendorContactATAMappingId: 0,
        masterCompanyId: this.currentUserMasterCompanyId,
        createdBy: "",
        updatedBy: "",
        createdDate: new Date(),
        vendorContactId: 0,
        ataChapterName: "",
        ataChapterCode: "",
        ataSubChapterDescription: "",
    }
    ataChapterEditData = { ...this.ataChapterEditDat };
    search_ataChapterList1: any = [];
    selectedAtappedRowforDelete: any;
    selectedAtappedRowforRestore: any;
    contactATAId: number;
    auditHistoryATA: any = [];
    add_ataChapterList: any;
    pageSizeForATA: number = 10;
    ataHeaders = [
        { field: 'ataChapterName', header: 'ATA Chapter' },
        { field: 'ataSubChapterDescription', header: 'ATA Sub-Chapter' }
    ]
    search_ataChapterList: { value: number; label: string; }[];
    vendorData :any = {};
    arrayContactlist:any[] = [];
    arrayTagNamelist:any[] = [];
    firstNamesList: any;
	middleNamesList: any;
    lastNamesList: any;
    tagNamesList: any;
    currentATADeletedstatus:boolean=false;
    originalTableData:any=[];
	currentDeletedstatus:boolean=false;
    status:any="Active";
    restorerecord:any={};
    vendorCodeandName: any;
    allActionsOriginal: any = [];
    isAdd:boolean=true;
    isEdit:boolean=true;
    isDelete:boolean=true;
    isDownload:boolean=true;
    isATA:Boolean=true;
    isContactView:boolean=true;
    isNextVisible:Boolean=true;
    isPrevVisible:Boolean=true;

    constructor(private router: ActivatedRoute,
        private atamain: AtaMainService,
        private route: Router,
        private customerser: CustomerService,
        private authService: AuthService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder,
        private alertService: AlertService,
        public vendorService: VendorService,
        private dialog: MatDialog,
        private datePipe: DatePipe,
        private commonService: CommonService,
        private masterComapnyService: MasterComapnyService,
        private configurations: ConfigurationService, public atasubchapter1service: AtaSubChapter1Service) {
            if(!this.isViewMode)
            {
                if(window.localStorage.getItem('vendorService')){
                    var obj = JSON.parse(window.localStorage.getItem('vendorService'));
                    if(obj.listCollection && this.router.snapshot.params['id']){
                        this.vendorService.checkVendorEditmode(true);
                        this.vendorService.isEditMode = true;
                        this.vendorService.listCollection = obj.listCollection;
                        this.vendorService.indexObj.next(obj.activeIndex);
                        this.vendorService.enableExternal = true;
                        this.vendorId = this.router.snapshot.params['id'];
                        this.vendorService.vendorId = this.vendorId;
                        this.vendorService.listCollection.vendorId = this.vendorId; 
                        if(this.vendorId > 0)
                        {
                            this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                                res => {
                                   this.local = res[0];
                                   this.vendorCodeandName = res[0];
                               },err => {
                                   //const errorLog = err;
                                   //this.saveFailedHelper(errorLog);
                                   this.isSpinnerVisible = false;
                               });
                        }                        
                    }
                }
                else
                {
                    this.getVendorCodeandNameByVendorId();
                }
            }
            else
            {}
        
        if (this.vendorService.listCollection !== undefined) {
            this.vendorService.isEditMode = true;
        }
        if (this.local) {
            this.vendorService.contactCollection = this.local;
        }
        if (this.vendorService.generalCollection) {
            this.local = this.vendorService.generalCollection;
        }
        if (this.customerser.isCustomerAlsoVendor == true) {
            this.sourceVendor = this.customerser.localCollectiontoVendor;
        }
        this.dataSource = new MatTableDataSource();
        if (this.vendorService.listCollection && this.vendorService.listCollection != undefined && this.vendorService.isEditMode == true) {
            this.local = this.vendorService.listCollection;
        }

        this.isAdd=this.authService.checkPermission([ModuleConstants.Vendors_Contacts+'.'+PermissionConstants.Add])
		this.isEdit=this.authService.checkPermission([ModuleConstants.Vendors_Contacts+'.'+PermissionConstants.Update])
        this.isDelete=this.authService.checkPermission([ModuleConstants.Vendors_Contacts+'.'+PermissionConstants.Delete])
        this.isDownload=this.authService.checkPermission([ModuleConstants.Vendors_Contacts+'.'+PermissionConstants.Download])
        this.isATA=this.authService.ShowTab('Create Vendor','ATA Chapter');
        this.isContactView=this.authService.checkPermission([ModuleConstants.Vendors_Contacts+'.'+PermissionConstants.View]);
        this.alertService.stopLoadingMessage();
        this.isNextVisible=this.authService.ShowTab('Create Vendor','ATA Chapter');
        this.isPrevVisible=this.authService.ShowTab('Create Vendor','Capabilities');
    }
    ngOnInit(): void {
        this.vendorService.currentEditModeStatus.subscribe(message => {
            this.isvendorEditMode = message;
        });
        this.sourceVendor.isdefaultContact = true;
        this.matSpinner = true;

        if(this.isViewMode)
        {
            this.getVendorCodeandNameByVendorId();
        }
        else{
            this.vendorId = this.router.snapshot.params['id'];
            this.vendorService.vendorId = this.vendorId;
            this.vendorService.listCollection.vendorId = this.vendorId; 
        }

        this.router.queryParams.subscribe((params: Params) => {
        });
        if (this.vendorId != 0) {
            this.loadData();
        } else {
            this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-contacts';
            this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
        }
    }
    dateFilterForTable(date, field) {
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
   
    getVendorCodeandNameByVendorId()
    {
        if(this.vendorId > 0)
        {
            this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                res => {
                        this.vendorCodeandName = res[0];
                },err => {
                    //const errorLog = err;
                    //this.saveFailedHelper(errorLog);
                    this.isSpinnerVisible = false;
            });
        }        
    }
    
    public allWorkFlows: any[] = [];

    private loadData() {
        this.isSpinnerVisible = true;
        const vendorId = this.vendorId != 0 ? this.vendorId : this.local.vendorId;

        if(this.isContactView){
        this.vendorService.getContacts(vendorId).subscribe(
            results => this.onDataLoadSuccessful(results[0]),           
            error => {this.isSpinnerVisible = false } //this.onDataLoadFailed(error))
        );
        }
    }
    enableSaveMemo() {
        this.disableSaveMemo = false;
    }

    onClickMemo() {
        this.memoPopupContent = this.sourceVendor.notes;
        this.enableSave();
        this.disableSaveMemo = true;
        //this.memoPopupValue = value;
    }   
    onClickPopupSave() {
        this.sourceVendor.notes = this.memoPopupContent;
        this.memoPopupContent = '';
        $('#memo-popup-Doc').modal("hide");
    }
    closeMemoModel() {
        $('#memo-popup-Doc').modal("hide");
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

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    handleChanges(rowData, e) {
        if (e.checked == false) {
            this.isSpinnerVisible = true;
            this.sourceVendor = rowData;
            this.sourceVendor.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceVendor.isActive == false;

            this.sourceVendorUpdateStatus.updatedBy = this.userName;
            this.sourceVendorUpdateStatus.contactId = rowData.contactId;
            this.sourceVendorUpdateStatus.isActive = false;
            this.vendorService.updateContactforActive(this.sourceVendorUpdateStatus).subscribe(
                response => {
                    this.isSpinnerVisible = false;
                    this.alertService.showMessage("Success", `Records In-Acivated successfully`, MessageSeverity.success);
                    this.loadData();
                },
                error => {this.isSpinnerVisible = false} )//this.saveFailedHelper(error));
        }
        else {
            this.isSpinnerVisible = true;
            this.sourceVendor = rowData;
            this.sourceVendor.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceVendor.isActive == true;

            this.sourceVendorUpdateStatus.updatedBy = this.userName;
            this.sourceVendorUpdateStatus.contactId = rowData.contactId;
            this.sourceVendorUpdateStatus.isActive = true;

            this.vendorService.updateContactforActive(this.sourceVendorUpdateStatus).subscribe(
                response => {
                    this.isSpinnerVisible = false;
                    this.alertService.showMessage("Success", `Records Acivated successfully`, MessageSeverity.success);
                    this.loadData();
                },
                error => {this.isSpinnerVisible = false} )// this.saveFailedHelper(error));
        }
    }

    private onDataLoadSuccessful(allWorkFlows: any[]) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.originalTableData = allWorkFlows;
        let obtainedVendorId = this.originalTableData[0].vendorId;
        this.geListByStatus(this.status ? this.status :this.currentstatus );
    }

    dismissModel() {
        this.modal.close();
    }

    private onEmptyObjUrl(allWorkFlows: any) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.sourceVendor = allWorkFlows;
    }

    filterActions(event) {
        this.localCollection = [];
        for (let i = 0; i < this.alldata.length; i++) {
            let actionName = this.alldata[i].description;
            if (actionName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(actionName);
            }
        }
    }

    private onDataLoadFailed(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
    }

    open(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.actionName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openDelete(content, row) {
        if (!row.isDefaultContact) {
            this.isEditMode = false;
            this.isDeleteMode = true;
            delete row.updatedBy;
            this.localCollection = row;
            this.selectedRowforDelete = row;
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        } else {
            $('#deleteoops').modal('show');
        }
    }

    openEdit(row) {
        this.isEditContactInfo=true;
        this.isEditMode = true;
        this.disableSave = true;
        this.isSaving = true;
        this.sourceVendor = { ...row };

        this.arrayContactlist = [];
		if(row.contactId > 0)
            this.arrayContactlist.push(row.contactId);

		this.getAllContactFirstNameSmartDropDown('', row.firstName);
		this.getAllContactMiddleNameSmartDropDown('', row.middleName);
        this.getAllContactLastNameSmartDropDown('', row.lastName);
        this.selectedFirstName = row.firstName
		this.selectedMiddleName = row.middleName
        this.selectedLastName = row.lastName
        
        if(row.contactTagId > 0)
        {
            this.arrayTagNamelist.push(row.contactTagId);
            this.getAllTagNameSmartDropDown('', row.contactTagId);
        }
        
        if(this.sourceVendor.isDefaultContact == true) {
            this.sourceVendor['tempIsDefaultContact'] = this.sourceVendor.isDefaultContact;
        }
        this.sourceVendor.tempIsDefaultContact=this.sourceVendor.isActive==false?true:false;
        
       
        
    }

    openView(content, row) {
        this.sourceVendor = row;
        this.action_name = row.description;
        this.memo = row.memo;
        this.createdBy = row.createdBy;
        this.updatedBy = row.updatedBy;
        this.createddate = row.createdDate;
        this.updatedDate = row.updatedDate;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openHist(content, row) {
        this.isSpinnerVisible = true;
        this.sourceVendor = row;
        this.isSaving = true;
        this.vendorService.getVendorContactAuditHistory(this.sourceVendor.vendorId, this.sourceVendor.contactId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results, content),
            error => {this.isSpinnerVisible = false})// this.saveFailedHelper(error));
    }

    private onAuditHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.contactauditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.contactauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    onBlurMethod(data) {
        if (data == 'firstName') {
            this.showFirstName = false;
        }
        if (data == 'lastName') {
            this.showLastName = false;
        }
        if (data == 'workPhone') {
            this.showworkPhone = false;
        }
        if (data == 'email') {
            this.showemail = false;
        }
    }

    editItemAndCloseModel() {
        this.isSaving = true;
        if (!(this.sourceVendor.firstName && this.sourceVendor.lastName && this.sourceVendor.workPhone &&
            this.sourceVendor.email
        )) {
            this.modelValue = true;
        }
        if (this.sourceVendor.firstName && this.sourceVendor.lastName && this.sourceVendor.workPhone &&
            this.sourceVendor.email) {
            if (!this.sourceVendor.vendorId && !this.isEditContactInfo) {
                this.sourceVendor.createdBy = this.userName;
                this.sourceVendor.updatedBy = this.userName;
                this.sourceVendor.firstName = this.sourceVendor.firstName.firstName != undefined ? this.sourceVendor.firstName.firstName : (this.sourceVendor.firstName != undefined ? this.sourceVendor.firstName : '') ;
                this.sourceVendor.middleName = this.sourceVendor.middleName == undefined ? '' : (this.sourceVendor.middleName.middleName != undefined ? this.sourceVendor.middleName.middleName : this.sourceVendor.middleName) ;
                this.sourceVendor.lastName = this.sourceVendor.lastName.lastName != undefined ? this.sourceVendor.lastName.lastName : (this.sourceVendor.lastName != undefined ? this.sourceVendor.lastName : '') ;
                this.sourceVendor.contactTagId = editValueAssignByCondition('contactTagId', this.sourceVendor.tagName);
                this.isDefault = this.sourceVendor.isDefaultContact;

                if (!this.sourceVendor.isDefaultContact) {
                    this.sourceVendor.isDefaultContact = false;
                }
                if (!this.isEditContactInfo) {
                    this.sourceVendor.vendorId = this.vendorId;
                    this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;
                }
                this.isSpinnerVisible = true;
                // before you commit make sure u don't have conlog, debug, commented code...
                this.vendorService.newAddContactInfo(this.sourceVendor).subscribe(data => {
                    this.isSpinnerVisible = false;
                    
                    this.localCollection = data;                    
                    this.localCollection.VendorId = this.vendorId;
                    this.localCollection.ContactId = this.local.contactId;
                    this.localCollection.isDefaultContact = this.isDefault;
                    this.sourceVendor = new Object();

                    if (data) {
                        this.updateVendorContact(this.localCollection);
                    }
                    else
                    {
                        this.loadData();
                    }

                    this.vendorService.contactCollection = this.local;
                    this.alertService.showMessage("Success", `Record was saved successfully`, MessageSeverity.success);
                    this.sourceVendor = {};
                    this.isEditContactInfo = false;
                    this.disableSave = true;
                    $("#addContactInfo").modal("hide");
                    
                }, err => {
                    this.isSpinnerVisible = false;
                    this.isEditContactInfo = false;
                    this.disableSave = true;
                    this.sourceVendor.vendorId = undefined;
                })
            }
            else {
                this.isSpinnerVisible = true;
                this.sourceVendor.updatedBy = this.userName;
                this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;
                this.sourceVendor.firstName = this.sourceVendor.firstName.firstName != undefined ? this.sourceVendor.firstName.firstName : (this.sourceVendor.firstName != undefined ? this.sourceVendor.firstName : '') ;
                this.sourceVendor.middleName = this.sourceVendor.middleName == undefined ? '' : (this.sourceVendor.middleName.middleName != undefined ? this.sourceVendor.middleName.middleName : this.sourceVendor.middleName) ;
                this.sourceVendor.lastName = this.sourceVendor.lastName.lastName != undefined ? this.sourceVendor.lastName.lastName : (this.sourceVendor.lastName != undefined ? this.sourceVendor.lastName : '') ;
                this.sourceVendor.contactTagId = editValueAssignByCondition('contactTagId', this.sourceVendor.tagName);

                this.vendorService.updateContactinfo(this.sourceVendor).subscribe(data => {
                    if (data) { this.sourceVendor = new Object(); }
                    this.savesuccessCompleted(this.sourceVendor);
                    this.loadData();
                    this.sourceVendor = {};
                    this.disableSave = true;
                    this.isSpinnerVisible = false;
                    $("#addContactInfo").modal("hide");
                }, err => {
                    this.isSpinnerVisible = false;
                    //this.saveFailedHelper(err);
                    this.disableSave = true;
                    // this.alertService.showMessage(
                    //     'Warning',
                    //     err.error,
                    //     MessageSeverity.error
                    // );
                })
            }
        }
        else {
        }
        this.vendorService.contactCollection = this.local;
    }

    toggledbldisplay(data) {
        this.sourceVendor = data;
    }

    previousClick() {
        this.activeIndex = 2;
        this.vendorService.changeofTab(this.activeIndex);
   }

    nextClick() {
        this.activeIndex = 4;
        this.vendorService.changeofTab(this.activeIndex);
     }

    deleteItemAndCloseModel() {
        let contactId = this.localCollection.contactId;
        let updatedBy = this.userName;
        if (contactId > 0) {
            this.isSaving = true;
            this.isSpinnerVisible = true;
            this.vendorService.deleteContact(contactId, updatedBy).subscribe(
                response => this.saveCompleted(this.sourceVendor),
                error => {this.isSpinnerVisible = false})//this.saveFailedHelper(error));
        }
        this.modal.close();
    }

    updateVendorContact(updateObj: any) {
        this.vendorService.newAddvendorContact(updateObj).subscribe(data => {
            this.loadData();
        },err => {this.isSpinnerVisible = false}) //this.saveFailedHelper(err))
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
            this.saveCompleted
            this.isSpinnerVisible = false;
        }
        this.loadData();
    }

    private savesuccessCompleted(user?: any) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Record was saved successfully`, MessageSeverity.success);
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
        this.isSpinnerVisible = false;
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    opencontactView(content, row) {
        this.sourceVendorforView = row;
        this.firstName = row.firstName;
        this.lastName = row.lastName;
        this.contactTitle = row.contactTitle;
        this.email = row.email;
        this.mobilePhone = row.mobilePhone;
        this.fax = row.fax;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    enableSave() {
        this.disableSave = false;
    }

    onAddContactInfo() {
        this.sourceVendor = {};
        this.isfirstNameAlreadyExists = false;
        this.islastNameAlreadyExists = false;
        this.ismiddleNameAlreadyExists = false;
        this.isEditContactInfo = false;
    }

    patternMobilevalidationWithSpl(event: any) {
        const pattern = /[0-9\+\-()\ ]/;

        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=VendorContacts&fileName=VendorContact.xlsx`;
        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;
        this.isSpinnerVisible = true;

        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.vendorService.ContactUpload(this.formData, this.local.vendorId).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.loadData();
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded File Data. `,
                    MessageSeverity.success
                );
            }, err => {this.isSpinnerVisible = false}) //this.saveFailedHelper(err))
        }
    }

    pageIndexChangeForInt(event) {
        this.pageSizeForATA = event.rows;
    }

    resetfileds() {
        this.add_SelectedId = '';
        this.add_SelectedModels = '';
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    getATAVendorContactMapped() {
        this.isSpinnerVisible = true;
        this.vendorService.getATAMappedByContactId(this.selectedContact.vendorContactId, this.currentATADeletedstatus).subscribe(res => {
            this.ataListDataValues = res;
            this.isSpinnerVisible = false;
            for (let i = 0; i < this.ataListDataValues.length; i++) {
                this.ataListDataValues[i]['ataChapterName'] = this.ataListDataValues[i]['ataChapterCode'] + ' - ' + this.ataListDataValues[i]['ataChapterName'];
                if (this.ataListDataValues[i]['ataSubChapterDescription'] != null) {
                    this.ataListDataValues[i]['ataSubChapterDescription'] = this.ataListDataValues[i]['ataSubChapterCode'] + ' - ' + this.ataListDataValues[i]['ataSubChapterDescription'];
                } else {
                    this.ataListDataValues[i]['ataSubChapterDescription'] ='-'
                }
                }
        },error => {this.isSpinnerVisible = false }) //this.onDataLoadFailed(error))
    }

    getOriginalATASubchapterList() {
        this.isSpinnerVisible = true;
        this.atasubchapter1service.getAtaSubChapter1List().subscribe(res => {
            const responseData = res[0];
            this.originalATASubchapterData = responseData;
            this.isSpinnerVisible = false;
        },error => {this.isSpinnerVisible = false }) //this.onDataLoadFailed(error))
    }


    getAllATAChapter() {
        this.isSpinnerVisible = true;
        this.atamain.getAtaMainList().subscribe(res => {
            const responseData = res[0];
            this.isSpinnerVisible = false;
            // used to get the complete object in the value 
            this.add_ataChapterList = responseData.map(x => {
                return {
                    value: x,
                    label: x.ataChapterCode + ' - ' + x.ataChapterName
                }

            })
            this.search_ataChapterList = responseData.map(x => {
                return {
                    value: x.ataChapterId,
                    label: x.ataChapterCode + '-' + x.ataChapterName
                }
            })
        },error => {this.isSpinnerVisible = false }) //this.onDataLoadFailed(error))
    }

    getATASubChapterByATAChapter() {
        this.isSpinnerVisible = true;
        this.add_SelectedModels = [];
        const selectedATAId = getValueFromObjectByKey('ataChapterId', this.add_SelectedId)
        this.atasubchapter1service.getATASubChapterListByATAChapterId(selectedATAId).subscribe(atasubchapter => {
            const responseData = atasubchapter[0];
            this.isSpinnerVisible = false;
            this.add_ataSubChapterList = responseData.map(x => {
                return {
                    label: x.ataSubChapterCode + ' - ' + x.description,
                    value: x
                }
            })
        },error => {this.isSpinnerVisible = false }) //this.onDataLoadFailed(error))
    }

    getATASubChapter() {
        this.isSpinnerVisible = true;
        this.atasubchapter1service.getAtaSubChaptersList().subscribe(atasubchapter => {
            const responseData = atasubchapter[0];
            this.isSpinnerVisible = false;
            this.add_ataSubChapterList = responseData.map(x => {
                return {
                    label: x.ataSubChapterCode + ' - ' + x.description,
                    value: x
                }
            })
            this.search_ataSubChapterList = responseData.map(x => {
                return {
                    value: x.ataSubChapterId,
                    label: x.ataSubChapterCode + ' - ' + x.description
                }
            })
            this.search_ataSubChapterList1 = responseData.map(x => {
                return {
                    value: x.ataSubChapterId,
                    label: x.description
                }
            })
        },error => {this.isSpinnerVisible = false }) //this.onDataLoadFailed(error))
    }

    addATAChapter(rowData) {
        this.add_SelectedModels = undefined;
        this.add_SelectedId = undefined;
        this.selectedContact = rowData;
        this.ataListDataValues = [];
        this.add_ataSubChapterList = '';
        this.getATAVendorContactMapped();
    }

    getATASubChapterByATAChapterID(id) {
        this.isSpinnerVisible = true;
        this.atasubchapter1service.getATASubChapterListByATAChapterId(id).subscribe(atasubchapter => {
            const responseData = atasubchapter[0];
            this.isSpinnerVisible = false;
            this.search_ataSubChapterList = responseData.map(x => {
                return {
                    label: x.ataSubChapterCode + ' - ' + x.description,
                    value: x.ataSubChapterId
                }
            })
        },error => {this.isSpinnerVisible = false }) //this.onDataLoadFailed(error))
        this.add_SelectedModels = undefined;
    }

    editContactATAChapters(rowData) {
        this.getATASubChapterByATAChapterID(rowData.ataChapterId)
        this.ataChapterEditData = {
            ...rowData,
        }
    }

    addATAMapping() {
        const vendorId = this.vendorId != 0 ? this.vendorId : this.local.vendorId;
        if(this.add_SelectedModels != undefined && this.add_SelectedModels != null && this.add_SelectedModels != ''){
        const ataMappingData = this.add_SelectedModels.map(x => {
            return {
                vendorId: vendorId,
                VendorContactId: this.selectedContact.vendorContactId,
                ATAChapterId: getValueFromObjectByKey('ataChapterId', this.add_SelectedId),
                ATASubChapterId: x.ataSubChapterId,
                ATAChapterCode: getValueFromObjectByKey('ataChapterCode', this.add_SelectedId),
                ATAChapterName: getValueFromObjectByKey('ataChapterName', this.add_SelectedId),
                ATASubChapterDescription: x.description,
                MasterCompanyId: x.masterCompanyId,
                CreatedBy: this.userName,
                UpdatedBy: this.userName,
                CreatedDate: new Date(),
                UpdatedDate: new Date(),
                IsDeleted: false,
            }
        })
        this.add_SelectedModels = undefined;
        this.add_SelectedId = undefined;

            this.vendorService.postVendorContactATAMapped(ataMappingData).subscribe(res => {
            setTimeout(() => {
                this.alertService.showMessage(
                    'Success',
                    `ATA Information Added Successfully.`,
                    MessageSeverity.success
                );
                this.getATAVendorContactMapped();
            }, 1000);
            },error => {this.isSpinnerVisible = false})//this.saveFailedHelper(error))
    }else{
            const ataMappingData = [{
                vendorId: vendorId,
                VendorContactId: this.selectedContact.vendorContactId,
                ATAChapterId: getValueFromObjectByKey('ataChapterId', this.add_SelectedId),
                ATASubChapterId: null,
                ATAChapterCode: getValueFromObjectByKey('ataChapterCode', this.add_SelectedId),
                ATAChapterName: getValueFromObjectByKey('ataChapterName', this.add_SelectedId),
                ATASubChapterDescription: null,
                MasterCompanyId: this.currentUserMasterCompanyId,
                CreatedBy: this.userName,
                UpdatedBy: this.userName,
                CreatedDate: new Date(),
                UpdatedDate: new Date(),
                IsDeleted: false,
            }
        ]
        this.add_SelectedModels = undefined;
        this.add_SelectedId = undefined;

            this.vendorService.postVendorContactATAMapped(ataMappingData).subscribe(res => {
            setTimeout(() => {
                this.alertService.showMessage(
                    'Success',
                    `ATA Information Added Successfully.`,
                    MessageSeverity.success
                );
                this.getATAVendorContactMapped();
            }, 1000);
        },
        (err)=>{
            this.alertService.showMessage(
                'Error',
                err.error,
                MessageSeverity.error
            );
        })
    }

    }

    updateATAChapters() {
        this.isSpinnerVisible = true;
        this.ataChapterEditData = {
            ...this.ataChapterEditData,
            masterCompanyId: this.currentUserMasterCompanyId,
            isActive: true,
            createdBy: this.userName,
            updatedBy: this.userName,
            createdDate: new Date(),
            vendorContactId: this.selectedContact.vendorContactId,

            ataChapterName: getValueFromArrayOfObjectById('label', 'value', this.ataChapterEditData.ataChapterId, this.search_ataChapterList1),
            ataChapterCode: getValueFromArrayOfObjectById('code', 'value', this.ataChapterEditData.ataChapterId, this.search_ataChapterList1),

            ataSubChapterDescription: getValueFromArrayOfObjectById('label', 'value', this.ataChapterEditData.ataSubChapterId, this.search_ataSubChapterList1),
        }
        this.vendorService.updateVendorContactATAMApped(this.ataChapterEditData).subscribe(res => {
            this.getATAVendorContactMapped();
            this.alertService.showMessage(
                'Success',
                `Record Was Updated Successfully.`,
                MessageSeverity.success
            );
            this.isSpinnerVisible = false;
            this.disableSaveATA = true;
        }, err => {
            this.alertService.showMessage(
                'Error',
                err.error,
                MessageSeverity.error
            );
            this.isSpinnerVisible = false;
            this.disableSaveATA = true;
        })
    }

    deleteATAMapped(content, rowData) {
        this.selectedAtappedRowforDelete = rowData;
        this.contactATAId = rowData.vendorContactATAMappingId;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    deleteItemAndCloseModel1() {
        let contactATAId = this.contactATAId;
        if (contactATAId > 0) {
            this.isSpinnerVisible = true;
            this.vendorService.deleteATAMappedByContactId(contactATAId).subscribe(
                response => {
                    this.getATAVendorContactMapped();
                    this.alertService.showMessage(
                        'Success',
                        `Record Deleted Successfully`,
                        MessageSeverity.success
                    );
                    this.isSpinnerVisible = false;
                },error => {this.isSpinnerVisible = false}) //this.saveFailedHelper(error));
        }
        this.modal.close();
    }

    restoreATAMapped(content, rowData) {
        this.selectedAtappedRowforRestore = rowData;
        this.contactATAId = rowData.vendorContactATAMappingId;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    restoreItemAndCloseModel() {
        let contactATAId = this.contactATAId;
        if (contactATAId > 0) {
            this.isSpinnerVisible = true;
            this.vendorService.restoreATAMappedByContactId(contactATAId).subscribe(
                response => {
                    this.getATAVendorContactMapped();
                    this.alertService.showMessage(
                        'Success',
                        `Record Restored Successfully`,
                        MessageSeverity.success
                    );
                    this.isSpinnerVisible = false;
                },
                error => {this.isSpinnerVisible = false;})//this.saveFailedHelper(error));
        }
        this.modal.close();
    }

    getATAAuditHistoryById(rowData) {
        this.isSpinnerVisible = true;
        this.vendorService.getVendorContactATAAuditDetails(rowData.vendorContactATAMappingId).subscribe(res => {
            this.auditHistoryATA = res;
            this.isSpinnerVisible = false;
        },error => {this.isSpinnerVisible = false }) //this.onDataLoadFailed(error))
    }

    getColorCodeForHistoryATA(i, field, value) {
        const data = this.auditHistoryATA;
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
        this.geListByStatus(this.status ? this.status : 'Active')
    } 
    
    geListByStatus(status) {
        const newarry=[];
        this.status = status;
        this.currentstatus = status;
        if(status=='Active'){ 			
			if(this.currentDeletedstatus==false){
			   this.originalTableData.forEach(element => {
                   if (element.isActive == true && element.isDeleted == false ){
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
			if(this.currentDeletedstatus==false){
				this.originalTableData.forEach(element => {
                    if (element.isActive == false && element.isDeleted == false){
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
        this.allActionsOriginal=this.allActions;
        this.totalRecords = this.allActions.length ;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
        
		restore(content, rowData) {
			this.restorerecord = rowData;
			this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        }
		
		restoreRecord(){
            this.isSpinnerVisible = true;
			this.commonService.updatedeletedrecords('VendorContact','VendorContactId',this.restorerecord.vendorContactId, ).subscribe(res => {
				this.currentDeletedstatus=true;
				this.modal.close();
				this.loadData();
                this.alertService.showMessage("Success", `Record Was Restored Successfully`, MessageSeverity.success);
                this.isSpinnerVisible = false;
            },error => {this.isSpinnerVisible = false}) //this.saveFailedHelper(error))
        }
        
        getAllContactFirstNameSmartDropDown(strText = '', contactName = ''){
            if(this.arrayContactlist.length == 0) {			
                this.arrayContactlist.push(0); }
            this.commonService.autoSuggestionSmartDropDownVendorContactList('firstName',strText,true,this.arrayContactlist.join(),this.currentUserMasterCompanyId,this.vendorId).subscribe(response => {    
                var endResult = [];
                for(let resInd = 0; resInd<response.length; resInd++){
                    let alreadyExist = false;
                    for(let endInd = 0; endInd<endResult.length; endInd++){
                        if(endResult[endInd].firstName.toLowerCase() == response[resInd].label.toLowerCase()){
                            alreadyExist = true;
                        }
                    }
                    if(!alreadyExist){
                        endResult.push({firstName: response[resInd].label})
                    }
                }
    
                this.firstNamesList = endResult;
    
                if(contactName != '')
                {
                    this.sourceVendor = {
                        ...this.sourceVendor,
                        firstName: getObjectByValue('firstName', contactName, this.firstNamesList),
                        middleName: this.sourceVendor.middleName,
                        lastName: this.sourceVendor.lastName,
                    }
                }
            },error => { this.isSpinnerVisible = false;})//this.saveFailedHelper(error));
        }
    
        getAllContactMiddleNameSmartDropDown(strText = '', contactName = ''){
            if(this.arrayContactlist.length == 0) {			
                this.arrayContactlist.push(0); }
            this.commonService.autoSuggestionSmartDropDownVendorContactList('middleName',strText,true,this.arrayContactlist.join(),this.currentUserMasterCompanyId,this.vendorId).subscribe(response => {
                
                var endResult = [];
                for(let resInd = 0; resInd<response.length; resInd++){
                    let alreadyExist = false;
                    for(let endInd = 0; endInd<endResult.length; endInd++){
                        if(endResult[endInd].middleName.toLowerCase() == response[resInd].label.toLowerCase()){
                            alreadyExist = true;
                        }
                    }
                    if(!alreadyExist){
                        endResult.push({middleName: response[resInd].label})
                    }
                }
    
                this.middleNamesList = endResult;
                
                if(contactName != '')
                {
                    this.sourceVendor = {
                        ...this.sourceVendor,
                        middleName: getObjectByValue('middleName', contactName, this.middleNamesList),
                        firstName: this.sourceVendor.firstName,
                        lastName: this.sourceVendor.lastName,
                    }
                }
            },error =>{this.isSpinnerVisible = false;}) //this.saveFailedHelper(error));
        }
    
        getAllContactLastNameSmartDropDown(strText = '', contactName = ''){
            if(this.arrayContactlist.length == 0) {			
                this.arrayContactlist.push(0); }
            this.commonService.autoSuggestionSmartDropDownVendorContactList('lastName',strText,true,this.arrayContactlist.join(),this.currentUserMasterCompanyId,this.vendorId).subscribe(response => {
                
                var endResult = [];
                for(let resInd = 0; resInd<response.length; resInd++){
                    let alreadyExist = false;
                    for(let endInd = 0; endInd<endResult.length; endInd++){
                        if(endResult[endInd].lastName.toLowerCase() == response[resInd].label.toLowerCase()){
                            alreadyExist = true;
                        }
                    }
                    if(!alreadyExist){
                        endResult.push({lastName: response[resInd].label})
                    }
                }
                    
                this.lastNamesList = endResult;
    
                if(contactName != '')
                {
                    this.sourceVendor = {
                        ...this.sourceVendor,
                        lastName: getObjectByValue('lastName', contactName, this.lastNamesList),
                        firstName: this.sourceVendor.firstName,
                        middleName: this.sourceVendor.middleName,
                    }
                }
            },error => {this.isSpinnerVisible = false;}) //this.saveFailedHelper(error));
        }

        getAllTagNameSmartDropDown(strText = '', contactTagId = 0) {
            if(this.arrayTagNamelist.length == 0) {			
                this.arrayTagNamelist.push(0); }
                this.commonService.autoSuggestionSmartDropDownList('ContactTag', 'ContactTagId', 'TagName',strText,true,20,this.arrayTagNamelist.join(),this.currentUserMasterCompanyId).subscribe(res => {
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

        filterFirstNames(event) {
            if (event.query !== undefined && event.query !== null) {
                this.getAllContactFirstNameSmartDropDown(event.query); }
        }
    
        filterMiddleNames(event) {
            if (event.query !== undefined && event.query !== null) {
                this.getAllContactMiddleNameSmartDropDown(event.query); }
        }

        filterTagNames(event) {
            if (event.query !== undefined && event.query !== null) {
                this.getAllTagNameSmartDropDown(event.query); }
        }
    
        filterLastNames(event) {
            if (event.query !== undefined && event.query !== null) {
                this.getAllContactLastNameSmartDropDown(event.query); }
        }

        getATADeleteListByStatus(value){
            if(value){
                this.currentATADeletedstatus=true;
            }else{
                this.currentATADeletedstatus=false;
            }
            this.getATAVendorContactMapped();
        }

        enableSaveATA() {
            this.disableSaveATA = false;
        }

    isfirstNameAlreadyExists: boolean = false;
	checkfirstNameExist(value) {
       // this.changeName = true;
        this.isfirstNameAlreadyExists = false;
        this.disablesaveForFirstname = false;
        if (value != this.selectedFirstName) {
            // if (this.vendorListOriginal != undefined && this.contactsListOriginal != null) {
                for (let i = 0; i < this.firstNamesList.length; i++) {
                    if (this.sourceVendor.firstName == this.firstNamesList[i].firstName || value == this.firstNamesList[i].firstName) {
                        this.isfirstNameAlreadyExists = true;
                        //this.disablesaveForFirstname = true;
                        this.disableSave = true;
                        return;
                    }
                }
            //}
        }
	}

	selectedFirstnameName() {	
        
		const firstName = editValueAssignByCondition('firstName', this.sourceVendor.firstName);		
        if (firstName == this.selectedFirstName){
			this.isfirstNameAlreadyExists = false;
            if(this.isEditContactInfo)
            this.disableSave = false;
			//this.disablesaveForFirstname = false;
		}
        else{
			this.isfirstNameAlreadyExists = true;
            if(this.isEditContactInfo)
            this.disableSave = true;
			//this.disablesaveForFirstname = true;
		}			
    }
    
    ismiddleNameAlreadyExists: boolean = false;
	checkmiddleNameExist(value) {
       // this.changeName = true;
        this.ismiddleNameAlreadyExists = false;
        //this.disableSaveMiddleName = false;
        if (value != this.selectedMiddleName) {
            //if (this.contactsListOriginal != undefined && this.contactsListOriginal != null) {
                for (let i = 0; i < this.middleNamesList.length; i++) {
                    if (this.sourceVendor.middleName == this.middleNamesList[i].middleName || value == this.middleNamesList[i].middleName) {
                        this.ismiddleNameAlreadyExists = true;
                        //this.disableSaveMiddleName = true;
                        this.disableSave = true;
                        return;
                    }
                }
            }
        //}
	}

	selectedmiddleNameName() {				
		const middleName = editValueAssignByCondition('middleName', this.sourceVendor.middleName);		
        if (middleName == this.selectedFirstName){
			this.ismiddleNameAlreadyExists = false;
			if(this.isEditContactInfo)
			this.disableSave = false;
		}
        else{
			this.ismiddleNameAlreadyExists = true;
			if(this.isEditContactInfo)
			this.disableSave = true;
		}			
    }
    
    islastNameAlreadyExists: boolean = false;
	checklastNameExist(value) {
       // this.changeName = true;
        this.islastNameAlreadyExists = false;
        //this.disableSaveLastName = false;
        if (value != this.selectedLastName) {
            //if (this.contactsListOriginal != undefined && this.contactsListOriginal != null) {
                for (let i = 0; i < this.lastNamesList.length; i++) {
                    if (this.sourceVendor.lastName == this.lastNamesList[i].lastName || value == this.lastNamesList[i].lastName) {
                        this.islastNameAlreadyExists = true;
                        this.disableSave = true;
                        return;
                    }
                }
            //}
        }
	}

	selectedlastNameName() {				
		const lastName = editValueAssignByCondition('lastName', this.sourceVendor.lastName);		
        if (lastName == this.selectedLastName){
			this.islastNameAlreadyExists = false;
			if(this.isEditContactInfo)
			this.disableSave = false;
		}
        else{
			this.islastNameAlreadyExists = true;
			if(this.isEditContactInfo)
			this.disableSave = true;
		}			
    }
}