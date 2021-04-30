import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnDestroy, HostListener } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { fadeInOut } from '../../../../services/animations';
import { MasterCompany } from '../../../../models/mastercompany.model';
import { AuditHistory } from '../../../../models/audithistory.model';
import { AuthService } from '../../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { MasterComapnyService } from '../../../../services/mastercompany.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GMapModule } from 'primeng/gmap';
import { AddActionsDialogComponent } from '../../../dialogs/add-actions-dialog/add-actions-dialog.component';
// import { unescapeHtml } from '@angular/platform-browser/src/browser/transfer_state';
import { FileUploadModule } from 'primeng/fileupload';
import { Message } from 'primeng/components/common/message';
import { MenuItem } from 'primeng/components/common/menuitem';
import { DialogModule } from 'primeng/dialog';//Error Validation Pop Up
import { CustomerService } from '../../../../services/customer.service';
import { CommonService } from '../../../../services/common.service';
import { IntegrationService } from '../../../../services/integration-service';
import { ConfigurationService } from '../../../../services/configuration.service';
import { editValueAssignByCondition, getObjectById, getValueFromObjectByKey, selectedValueValidate, toLowerCaseOnInput, validateRecordExistsOrNot } from '../../../../generic/autocomplete';
import { emailPattern, urlPattern } from '../../../../validations/validation-pattern';
import { LegalEntityService } from '../../../../services/legalentity.service';

declare const google: any;
@Component({
    selector: 'legal-entity-general-information',
    templateUrl: './legal-entity-general-information.component.html',
    styleUrls: ['./legal-entity-general-information.component.scss'],
    animations: [fadeInOut],
})

export class LegalEntityGeneralInformationComponent implements OnInit {
    disableSaveentityName: boolean;
    disableSaveentityCode: boolean;
    entityCodesColl: any[] = [];
    selectedentityCode: any;
    disableSaveVenCode: boolean;
    disableSave: boolean;
    selectedActionName: any;
    disableSaveVenName: boolean;
    entityNamecoll: any[] = [];
    allCapbilityClassInfo: any[];
    modelValue: boolean;
    display: boolean;
    matSpinner: boolean;
    activeIndex: number = 1;
    showentityContractReference: boolean;
    showentityCode: boolean;
    showentityName: boolean;
    showalert: boolean;
    showLable: boolean;
    venname: any;
    entityClassName: any;
    entityCollection: any[];
    entityNames: any[];
    entityCodes: any[];
    localCollections: any;
    entityName: any;
    entityCode: any;
    checkAddress: boolean = false;
    allgeneralInfo: any[];
    closeCmpny: boolean = true;
    service: boolean = false;
    entityId: any;
    addressId: any;
    allAddresses: any[];
    action_name: any = "";
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createddate: any = "";
    updatedDate: any = "";
    entityParentName: any = "";
    viewName: string = "Create";
    private items: MenuItem[];
    home: MenuItem;
    local: any;
    entityInfoByName: any[] = [];
    sourceCustomer: any;
    allCountryinfo: any[];
    disablesave: boolean;
    countrycollection: any;
    selectedCountries: any;
    isentityAlsoCustomer: boolean = false;
    disableSaveParentName: boolean;
    disablesaveForClassification: boolean;
    selectedClass: any;
    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    filteredBrands: any[];
    displayedColumns = ['actionId', 'companyName', 'description', 'memo', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<any>;
    allActions: any[] = [];
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourceAction: any = {};
    public auditHisory: AuditHistory[] = [];
    private bodyText: string;
    loadingIndicator: boolean;
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
    localCollection: any[] = [];
    collection: any;
    options: any;
    public overlays: any[];
    msgs: Message[];
    uploadedFiles: any[] = [];
    isEditMode: boolean = false;
    isDeleteMode: boolean = false;
    integrationOriginalList;
    intSelectedColumns: any[];
    dropDownentityCapabilitiesList: any[];
    form: any;
    allentityclassificationInfo;
    formData = new FormData();
    allentityGeneralDocumentsList: any = [];
    sourceentity: any = {};
    entityParentNames: any[];
    emailPattern = emailPattern()
    urlPattern = urlPattern()
    parententityOriginal: any[];
    forceSelectionOfentityName: boolean = false;
    selectedEditData: any;
    editModeData: any;
    parentLegalEntity: any = {};
    newentityId;
    private parentId: number;

    constructor(
        private http: HttpClient,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private authService: AuthService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder,
        public customerser: CustomerService,
        private alertService: AlertService,
        public entityService: LegalEntityService,
        private dialog: MatDialog,
        private masterComapnyService: MasterComapnyService,
        public commonService: CommonService,
        public integrationService: IntegrationService,
        private acRouter: ActivatedRoute,
        private configurations: ConfigurationService) {
        this.dataSource = new MatTableDataSource();
        let entityId = this.acRouter.snapshot.params['id'];
        
        this.countrylist();
        this.loadData();
        this.loadGeneralObject();
        console.log(entityId);

        if (entityId) {
            this.entityService.getEntityDataById(entityId).subscribe(res => {
                this.sourceentity = res;
                this.newentityId = res.entityId;
                this.parententityList(res.entityId);
                this.forceSelectionOfentityName = true;
               // this.entityService.currentUrl = '/entitysmodule/entitypages/app-entity-general-information/edit';
                this.entityService.bredcrumbObj.next(this.entityService.currentUrl);
                this.entityService.ShowPtab = true;
                this.entityService.alertObj.next(this.entityService.ShowPtab);
                this.entityService.indexObj.next(0);
                this.entityService.listCollection = this.sourceentity
                this.entityService.enableExternal = true;
                if (this.entityService.listCollection !== undefined) {
                    this.entityService.isEditMode = true;
                }
                this.editModeDataBinding();
            })
        } else {
            this.entityService.ShowPtab = true;
            this.sourceentity.entityTypeId = 2;
            this.sourceentity.entityTypeId = 1;

            if (this.entityService.isEditMode == false) {
                this.sourceentity.entityTypeId = 2;
                this.viewName = "Create";
                this.sourceentity.isAddressForBilling = true;
                this.sourceentity.isAddressForShipping = true;

            }
            if (this.entityService.enableExternal == false) {
                this.sourceentity.entityTypeId = 2;
            }

            if (this.entityService.listCollection) {
                this.sourceentity = this.entityService.listCollection;
            }

            if (!this.intSelectedColumns) {
                this.intSelectedColumns = this.cols;
            }
            if (!this.entityService.isReset) {
                if (this.viewName != "Edit") {
                    this.sourceentity = {};
                    this.sourceentity.entityTypeId = 2;
                    this.sourceentity.isAddressForBilling = true;
                    this.sourceentity.isAddressForShipping = true;
                }
            }
            console.log(this.entityService.listCollection);
        }
    }

    ngOnInit(): void {
        this.entityService.currentEditModeStatus.subscribe(message => {
            this.isentityEditMode = message;
        });
        this.editModeDataBinding();
        this.loadDataentityData();
        this.getAllentityCapabilities();
        this.getAllIntegrations();
        this.getentityIntegrationByentityrId();
    }
    isentityEditMode
    ngOnDestroy() {
    }

    editModeDataBinding() {

        if (this.entityService.listCollection != null && this.entityService.isEditMode == true) {
            this.showLable = true;
            this.viewName = "Edit";
            this.local = this.entityService.listCollection;
            this.sourceentity = this.entityService.listCollection;
            console.log(this.sourceentity);
            this.sourceentity.entityName = getObjectById('entityId', this.sourceentity.entityId, this.allActions);
           // this.toGetentityGeneralDocumentsList(this.sourceentity.entityId);
            this.sourceentity.address1 = this.entityService.listCollection.address1;
            this.sourceentity.address2 = this.entityService.listCollection.address2;
            this.sourceentity.address3 = this.entityService.listCollection.address3;
            this.sourceentity.city = this.entityService.listCollection.city;
            this.sourceentity.country = getObjectById('countries_id', this.entityService.listCollection.countryId, this.allCountryinfo);
            this.sourceentity.stateOrProvince = this.entityService.listCollection.stateOrProvince;
            this.sourceentity.postalCode = this.entityService.listCollection.postalCode;
            this.sourceentity.entityClassificationIds = this.sourceentity.entityClassifications;
            if (this.sourceentity.parent) {
                this.sourceentity.entityParentId = getObjectById('entityId', this.sourceentity.entityParentId, this.allActions);
            }

        }
        //if (this.customerser.isCustomerAlsoentity == true) {
        //    this.sourceentity = this.customerser.localCollectiontoentity;
        //    this.sourceentity.entityEmail = this.customerser.localCollectiontoentity.email;
        //    this.sourceentity.entityPhone = this.customerser.localCollectiontoentity.customerPhone;
        //    this.sourceentity.entityName = this.customerser.localCollectiontoentity.name;
        //    this.sourceentity.entityCode = this.customerser.localCollectiontoentity.customerCode;
        //    this.sourceentity.doingBusinessAsName = this.customerser.localCollectiontoentity.doingBuinessAsName;
        //    this.sourceentity.postalCode = this.customerser.localCollectiontoentity.postalCode;
        //}
    }

    closethis() {
        this.closeCmpny = false;
    }
    public allWorkFlows: any[] = [];
    async  loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        await this.entityService.getEntityList().subscribe(res =>
            this.allActions = res[0]
        );
        console.log("heler", this.allActions);
    }
    private onDataLoadSuccessful(allWorkFlows: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
    }

    //get Country List
    private countrylist() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.entityService.getCountrylist().subscribe(
            results => this.onDatacountrySuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    private onDatacountrySuccessful(allWorkFlows: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.allCountryinfo = allWorkFlows;
        if (this.entityService.isEditMode && this.sourceentity.country != null) {
        }
    }
    
    public addEntity() {
        let dialogRef = this.dialog.open(AddActionsDialogComponent,
            {
                panelClass: 'mat-dialog-md',
                data: { role: "" }
            });
        dialogRef.afterClosed().subscribe(role => {
            if (role) {
            }
        });
    }
    //Load Address 
    //private loadAddressDara() {
    //    this.alertService.startLoadingMessage();
    //    this.loadingIndicator = true;
    //    this.entityService.getAddressDtails().subscribe(
    //        results => this.onAddressDataLoadSuccessful(results[0]),
    //        error => this.onDataLoadFailed(error)
    //    );
    //}
    //private onAddressDataLoadSuccessful(alladdress: any[]) {
    //    this.alertService.stopLoadingMessage();
    //    this.loadingIndicator = false;
    //    this.dataSource.data = alladdress;
    //    this.allAddresses = alladdress;
    //    this.addressId = this.allAddresses[0].addressId;
    //}

    private loadMasterCompanies() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;
    }

    async getAllIntegrations() {
        await this.integrationService.getWorkFlows().subscribe(res => {
            const responseData = res[0]
            this.integrationOriginalList = responseData.map(x => {
                return {
                    label: x.description, value: x.integrationPortalId
                }
            })

        })
    }
    async  getentityIntegrationByentityrId() {
        if (this.sourceentity.entityId > 0) {
            await this.commonService.getIntegrationMapping(this.sourceentity.entityId, 3).subscribe(res => {
                this.sourceentity.integrationPortalIds = res.map(x => x.integrationPortalId);
            });
        }

    }

    private loadDataentityData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        //this.entityclassificationService.getActiveentityClassificationEndpointList().subscribe(
        //    results => this.onentityDataLoad(results[0]),
        //    error => this.onDataLoadFailed(error)
        //);
    }
    //private onentityDataLoad(getActiveentityClassificationList: entityClassification[]) {
    //    this.alertService.stopLoadingMessage();
    //    this.loadingIndicator = false;
    //    this.dataSource.data = getActiveentityClassificationList;
    //}
    //filterentitys(event) {
    //    this.entityCollection = [];
    //    for (let i = 0; i < this.allentityClassInfo.length; i++) {
    //        let entityName = this.allentityClassInfo[i].classificationName;
    //        if (entityName != "" && entityName != null && entityName != "Null") {
    //            if (entityName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //                this.entityCollection.push(entityName);
    //            }
    //        }
    //    }
    //}

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }
    private refresh() {
        this.applyFilter(this.dataSource.filter);
    }
    private onentityloadsuccessfull(allWorkFlows: any[]) {
        this.entityInfoByName = allWorkFlows[0]
        this.sourceentity = this.entityInfoByName;
    }


    filterentityNames(event) {
        this.entityNames = this.allActions;
        if (event.query !== undefined && event.query !== null) {
            const entityName = [...this.allActions.filter(x => {
                return x.entityName.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.entityNames = entityName;
        }
    }
    parententityList(id) {
        console.log("check id", id)
        this.parententityOriginal = [... this.allActions.filter(x => {
            if (x.entityId != id) {
                return x;
            }
        })]
        console.log(this.parententityOriginal);
    }


    filterentityParentNames(event) {
        this.entityParentNames = this.parententityOriginal;
        console.log("entity info", this.parententityOriginal);
        this.entityParentNames = [...this.parententityOriginal.filter(x => {
            return x.entityName.toLowerCase().includes(event.query.toLowerCase());
        })]
    }


    selectedParentName(event) {
        if (event.name === this.sourceentity.entityName) {
            this.disableSaveParentName = true;
        }
        else {
            this.disableSaveParentName = false;
        }
        // }

    }
    checkWithName(event) {


        if (event === this.sourceentity.entityName) {
            this.disableSaveParentName = true;
        }
        else {
            this.disableSaveParentName = false;
        }

    }

    filterentityCodes(event) {
        this.entityCodes = [];
        for (let i = 0; i < this.allActions.length; i++) {
            let entityCode = this.allActions[i].entityCode;
            if (entityCode.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.entityCodesColl.push([{
                    "entityId": this.allActions[i].entityClassificationId,
                    "entityCode": entityCode
                }]),
                    this.entityCodes.push(entityCode);
            }
        }
    }

    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.auditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        // does nothing here too
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
    }
    private loadGeneralObject() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.entityService.getGeneralObj().subscribe(
            results => this.onGeneralObjUrl(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    private onGeneralObjUrl(allWorkFlows: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.sourceentity = allWorkFlows;
    }
    private ongeneralDataLoadSuccessful(allWorkFlows: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.allgeneralInfo = allWorkFlows;
    }
    open(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        //this.toGetentityGeneralDocumentsList(this.sourceentity.entityId);
        this.actionName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        //remove
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openDelete(content, row) {
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceentity = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openEdit(content, row) {
        //this.toGetentityGeneralDocumentsList(this.sourceentity.entityId);
        this.isEditMode = true;
        this.isSaving = true;
        this.sourceentity = row;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    openView(content, row) {
        this.sourceentity = row;
        this.action_name = row.description;
        this.memo = row.memo;
        this.createdBy = row.createdBy;
        this.updatedBy = row.updatedBy;
        this.createddate = row.createdDate;
        this.updatedDate = row.updatedDate;
        this.loadMasterCompanies();
        //this.toGetentityGeneralDocumentsList(this.sourceentity.entityId);
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openHist(content, row) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.sourceentity = row;
    }

    convertUrlToLowerCase(event) {
        const value = event.target.value;
        event.target.value = toLowerCaseOnInput(value);
    }


    checkentityExists(field, value) {

        let isEdit;
        if (this.entityService.isEditMode) {
            this.editModeData = this.sourceentity.listCollection;
        } else {
            isEdit = undefined;
        }

        const exists = validateRecordExistsOrNot(field, value, this.allActions, this.editModeData);
        if (exists.length > 0) {
            this.disableSaveentityName = true;
        }
        else {
            this.disableSaveentityName = false;
        }

    }

    editItemAndCloseModel(goNxt?: any) {
        this.isSaving = true;
        this.isEditMode = true;
        if (!(this.sourceentity.entityName && this.sourceentity.entityCode && this.sourceentity.entityEmail && this.sourceentity.entityPhone && this.sourceentity.address1 && this.sourceentity.city
            && this.sourceentity.postalCode && this.sourceentity.country && this.sourceentity.entityClassificationIds
        )) {
            //this.display = true;
            this.modelValue = true;
        }
        if (this.sourceentity.entityName && this.sourceentity.entityCode && this.sourceentity.entityEmail && this.sourceentity.entityPhone && this.sourceentity.address1 && this.sourceentity.city
            && this.sourceentity.postalCode && this.sourceentity.country && this.sourceentity.entityClassificationIds) {

            this.sourceentity.country = editValueAssignByCondition('countries_id', this.sourceentity.country);
            this.sourceentity.entityParentId = editValueAssignByCondition('entityId', this.sourceentity.entityParentId);
            console.log(this.sourceentity);
            if (!this.sourceentity.entityId) {
                this.sourceentity.createdBy = this.userName;
                this.sourceentity.updatedBy = this.userName;
                this.sourceentity.masterCompanyId = 1;
                this.sourceentity.isActive = true;
                console.log('Test');

                if (this.sourceentity.parent) {


                    console.log(this.sourceentity.entityParentId);


                }
                if (this.sourceentity.parent == false || this.sourceentity.parent == null) {
                    this.sourceentity.entityParentName = '';
                }

                this.entityService.newAddEntity(this.sourceentity).subscribe(data => {

                    const vdata = {
                        entityId: data.entityId,
                        masterCompanyId: 1,
                        createdBy: this.userName,
                        updatedBy: this.userName
                    }

                    for (var key in vdata) {
                        this.formData.append(key, vdata[key]);
                    }
                    this.sourceentity.entityName = editValueAssignByCondition('entityName', this.sourceentity.entityName)
                    //this.entityService.entityGeneralDocumentUploadEndpoint(this.formData, this.sourceentity.entityId,3,'entity',this.userName,1);
                    //this.entityService.entityGeneralFileUpload(this.formData).subscribe(res => {
                    //    this.formData = new FormData();
                    //   // this.toGetentityGeneralDocumentsList(this.sourceentity.entityId);
                    //});
                    this.sourceentity.updatedBy = this.userName;
                    this.localCollection = data;
                    this.sourceentity = data;
                    this.sourceentity.address1 = data.address.line1;
                    this.sourceentity.address2 = data.address.line2;
                    this.sourceentity.address3 = data.address.line3;
                    this.sourceentity.city = data.address.city;
                    this.sourceentity.country = data.address.country;
                    this.sourceentity.stateOrProvince = data.address.stateOrProvince;
                    this.sourceentity.postalCode = data.address.postalCode;
                    // this.sourceentity.entityParentId = getObjectById('entityId', this.sourceentity.entityParentId, this.entityCollection)
                    //this.entityService.generalCollection = this.localCollection;
                    //this.entityService.contactCollection = this.localCollection;
                    //this.entityService.financeCollection = this.localCollection;
                    //this.entityService.paymentCollection = this.localCollection;
                    //this.entityService.shippingCollection = this.localCollection;
                    //if (this.sourceentity.isentityAlsoCustomer == true) {
                    //    this.entityService.isentityAlsoCustomer = this.sourceentity.isentityAlsoCustomer;
                    //    this.entityService.localCollectiontoCustomer = this.sourceentity;
                    //}
                    this.viewName = "Edit";
                    this.entityService.isEditMode = true;
                    this.entityService.listCollection = this.sourceentity;
                    this.savesuccessCompleted(this.sourceentity, goNxt);
                })
            }

            else {
                this.sourceentity.entityName = editValueAssignByCondition('entityName', this.sourceentity.entityName)
                this.sourceentity.updatedBy = this.userName;
                if (this.sourceentity.parent == false || this.sourceentity.parent == null) {
                    this.sourceentity.entityParentName = '';
                }


                if (this.sourceentity.parent) {
                    this.sourceentity.entityParentId = editValueAssignByCondition('entityId', this.sourceentity.entityParentId);
                }
                const { entityContact, address, ...newSourceentity } = this.sourceentity;

                this.entityService.updateEntityDetails(newSourceentity).subscribe(
                    data => {
                        const vdata = {
                            entityId: this.sourceentity.entityId,
                            masterCompanyId: 1,
                            createdBy: this.userName,
                            updatedBy: this.userName
                        }

                        for (var key in vdata) {
                            this.formData.append(key, vdata[key]);
                        }
                        //this.entityService.entityGeneralDocumentUploadEndpoint(this.formData, this.sourceentity.entityId,3,'entity',this.userName,1);
                        //this.entityService.entityGeneralFileUpload(this.formData).subscribe(res => {
                        //    this.formData = new FormData();
                        //    this.toGetentityGeneralDocumentsList(this.sourceentity.entityId);
                        //});

                        this.sourceentity.updatedBy = this.userName;
                        this.localCollection = data;
                        this.sourceentity = data;
                        // this.sourceentity.entityParentId = getObjectById('entityId', this.sourceentity.entityParentId, this.entityCollection)
                        this.sourceentity.address1 = data.address.line1;
                        this.sourceentity.address2 = data.address.line2;
                        this.sourceentity.address3 = data.address.line3;
                        this.sourceentity.city = data.address.city;
                        this.sourceentity.country = data.address.country;
                        this.sourceentity.stateOrProvince = data.address.stateOrProvince;
                        this.sourceentity.postalCode = data.address.postalCode;
                        //this.entityService.generalCollection = this.localCollection;
                        //this.entityService.contactCollection = this.localCollection;
                        //this.entityService.financeCollection = this.localCollection;
                        //this.entityService.paymentCollection = this.localCollection;
                        //this.entityService.shippingCollection = this.localCollection;

                        this.entityService.isEditMode = true;
                        this.entityService.listCollection = this.sourceentity;
                        this.savesuccessCompleted(this.sourceentity, goNxt);
                    })
            }
        }
        else {
        }


    }

    nextClick() {
        console.log(this.sourceentity);

       // this.entityService.entitygeneralcollection = this.local;
        this.activeIndex = 2;
        this.entityService.changeofTab(this.activeIndex);
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
        this.loadData();
    }

    private savesuccessCompleted(user?: any, goNxt?: any) {
        this.isSaving = false;
        console.log("entity service", this.entityService.isEditMode);
        this.alertService.showMessage("Success", `${this.isentityEditMode ? 'Updated' : 'Saved'}  General Information  successfully`, MessageSeverity.success);
        if (goNxt === 'goNext') {
            this.nextClick();
        }
        this.loadData();
    }
    private saveSuccessHelper(role?: any) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    private saveFailedHelper(error: any) {
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
    onUpload(event) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: 'File Uploaded', detail: '' });
    }

    private loadParentEntities() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.entityService.loadParentEntities().subscribe(
            results => this.onloadParentEntitiesLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onloadParentEntitiesLoadSuccessful(allEntities: MasterCompany[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.parentLegalEntity = allEntities;

    }

    onentityselected(object) {

        if (this.entityService.isEditMode === true) {
            this.selectedEditData = this.sourceentity
        } else {
            this.selectedEditData = undefined;
        }
        const exists = selectedValueValidate('entityName', object, this.selectedEditData);
        console.log(exists);

        this.parententityList(getValueFromObjectByKey('entityId', object));
        this.disableSaveentityName = !exists;
    }
    checentityName(name) {
        this.parententityList(this.newentityId);
    }
    evententityHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedentityCode) {
                if (value == this.selectedentityCode.toLowerCase()) {
                    this.disableSaveVenCode = true;
                    this.disableSaveentityCode = true;
                }
                else {
                    this.disableSaveVenCode = false;
                    this.disableSaveentityCode = false;
                }
            }
        }
    }
    onentityCodeselected(event) {
        for (let i = 0; i < this.entityCodesColl.length; i++) {
            if (event == this.entityCodesColl[i][0].entityCode) {
                this.disableSaveVenCode = true;
                this.disableSaveentityCode = true;
                this.selectedentityCode = event;
            }
        }
    }
    onCountrieselected(event) {
        if (this.allCountryinfo) {
            for (let i = 0; i < this.allCountryinfo.length; i++) {
                if (event == this.allCountryinfo[i].nice_name) {
                    this.sourceentity.nice_name = this.allCountryinfo[i].nice_name;
                    this.disablesave = false;
                    this.selectedCountries = event;
                }
            }
        }
    }
    //Added by Vijay For Capabilities dropdown binding

    getAllentityCapabilities(): void {

        this.commonService.smartDropDownList('entityCapabiliy', 'entityCapabilityId', 'capabilityDescription').subscribe(res => {
            this.dropDownentityCapabilitiesList = res;
        })
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
                if (event == this.allActions[i].entityName) {
                    this.sourceentity.entityParentName = event;

                    this.disableSaveParentName = false;

                    this.selectedActionName = event;
                }

            }
        }
    }

    //onClassificationelected(event) {
    //    if (this.allentityClassInfo) {
    //        for (let i = 0; i < this.allentityClassInfo.length; i++) {
    //            if (event == this.allentityClassInfo[i].classificationName) {
    //                this.sourceentity.entityClassificationId = event;
    //                this.disablesaveForClassification = true;
    //                this.selectedClass = event;
    //            }
    //        }
    //    }
    //}

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
        this.router.navigate(['/singlepages/singlepages/app-integration']);
    }

    onAddCapabilities() {
        this.router.navigateByUrl('/entitysmodule/entitypages/app-entity-capabilities-list');
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

        for (let file of event.files) {        // console.log(fileType);   
            this.formData.append(fileType, file);
            console.log(this.formData);
        }

    }

    //toGetentityGeneralDocumentsList(entityId) {
    //    var moduleId = 3;
    //    this.entityService.GetentityGeneralDocumentsList(entityId, moduleId).subscribe(res => {
    //        this.allentityGeneralDocumentsList = res;
    //        console.log(this.allentityGeneralDocumentsList);
    //    })
    //}
    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }

    //entityAttachmentDelete(rowData) {
    //    let attachmentDetailId = rowData.attachmentDetailId;
    //    let updatedBy = this.userName;
    //    this.entityService.GetentityAttachmentDelete(attachmentDetailId, updatedBy).subscribe(res => {
    //        this.toGetentityGeneralDocumentsList(this.sourceentity.entityId)
    //    })
    //}
}