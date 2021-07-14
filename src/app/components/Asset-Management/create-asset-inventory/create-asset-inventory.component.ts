import { Component, OnInit, ViewChild } from '@angular/core';
import { AssetLocationService } from '../../../services/asset-location/asset-location.service';
import { AssetService } from '../../../services/asset/Assetservice';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { getObjectById, formatNumberAsGlobalSettingsModule, getValueFromObjectByKey } from '../../../generic/autocomplete';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { ConfigurationService } from '../../../services/configuration.service';
declare var $: any;
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { VendorService } from '../../../services/vendor.service';
import { Location } from '@angular/common';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';
@Component({
    selector: 'app-create-asset-inventory',
    templateUrl: './create-asset-inventory.component.html',
    styleUrls: ['./create-asset-inventory.component.scss'],
    providers: [DatePipe]
})
/** create-asset component*/
export class CreateAssetInventoryComponent implements OnInit {
    uploadDocs: Subject<boolean> = new Subject();
    todaysDate = new Date();
    disableSaveForEdit: boolean = false;
    totalRecords: any;
    breadcrumbs: MenuItem[];
    currentAsset: any = {};
    isSpinnerVisible: boolean = true;
    assetInventoryId: any;
    pageSize = 10;
    isEditMode: boolean = false;
    currentDate = new Date();
    private onDestroy$: Subject<void> = new Subject<void>();
    allAssetList: any = [];
    assetListFilter: any = [];
    allLocationList: any = [];
    allCapesInfo: any = [];
    allVendorsList: any = [];
    vendorListFilter: any = [];
    allCurrencyInfo: any = [];
    allWarrantyStatusList: any = [];
    cols = [
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'captypedescription', header: 'Capability Type' },
        { field: 'manufacturer', header: 'Aircraft Manufacturer' },
        { field: 'modelname', header: 'Models' },
        { field: 'dashnumber', header: 'Dash Number' }
    ];
    selectedColumns = this.cols;
    managementStructure = {
        companyId: 0,
        buId: 0,
        divisionId: 0,
        departmentId: 0,
    }
    legalEntityList: any = [];
    businessUnitList: any = [];
    divisionList: any = [];
    departmentList: any = [];
    headerMemo: any;
    memoLabel: any;
    documentInformation = {
        docName: '',
        docMemo: '',
        docDescription: '',
        attachmentDetailId: 0
    }
    isEditButton: boolean = false;
    sourceViewforDocument: any = [];
    sourceViewforDocumentWarranty: any = [];
    customerDocumentsColumns = [
        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'docMemo', header: 'Memo' },
        { field: 'fileName', header: 'File Name' },
        { field: 'fileSize', header: 'File Size' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedBy', header: 'Updated By' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'updatedDate', header: 'Updated Date' },
    ];
    selectedColumnsDoc = this.customerDocumentsColumns;
    sourceViewforDocumentList: any = [];
    sourceViewforDocumentListWarranty: any = [];
    sourceViewforDocumentAudit: any = [];
    disableDocumentSave: boolean = false;
    disableFileAttachmentSubmit: boolean = true;
    selectedFileAttachment: any = [];
    @ViewChild('fileUploadInput', { static: false }) fileUploadInput: any;
    @ViewChild('fileUploadInputWarranty', { static: false }) fileUploadInputWarranty: any;
    @ViewChild('fileUploadInputInt', { static: false }) fileUploadInputInt: any;
    formDataMain = new FormData();
    formDataWarr = new FormData();
    formDataInt = new FormData();
    allDocumentListOriginal: any = [];
    index: number;
    pageSizeNew: number = 3;
    modal: NgbModalRef;
    selectedRowForDelete: any;
    rowIndex: number;
    isDeleteMode: boolean;
    allDocumentListOriginalWarranty: any = [];
    disableFileAttachmentSubmitWarranty: boolean = true;
    selectedFileAttachmentWarranty: any = [];
    selectedRowForDeleteWarranty: any;
    warrantyCompanySelectList: any = [];
    sourceViewforDocumentListInt: any = [];
    disableFileAttachmentSubmitInt: boolean = true;
    selectedFileAttachmentInt: any = [];
    sourceViewforDocumentInt: any = [];
    selectedRowForDeleteInt: any;
    originalAsset: any;
    home: any;
    maintanancemoduleName = 'AssetInventoryMaintenanceFile';
    warrantymoduleName = 'AssetInventoryWarrantyFile';
    intangiblemoduleName = 'AssetInventoryIntangibleFile';
    modalIsMaintannce: NgbModalRef;
    modalWarrenty: NgbModalRef;

    isView:boolean=true;
    isAdd:boolean=true;
    isUpdate:boolean=true;
    constructor(private commonService: CommonService, private location: Location, private vendorService: VendorService, private assetService: AssetService, private assetLocationService: AssetLocationService, private alertService: AlertService, private configurations: ConfigurationService, private authService: AuthService, private modalService: NgbModal, private route: Router, private _actRoute: ActivatedRoute, private datePipe: DatePipe) {
        this.currentAsset.entryDate = this.currentDate;
        this.currentAsset.isTangible = 1;
        this.currentAsset.assetLocationId = 0;
        this.currentAsset.warrantyStatusId = 0;
        this.isView=this.authService.checkPermission([ModuleConstants.Asset_Inventory_List+'.'+PermissionConstants.View]);
        this.isAdd=this.authService.checkPermission([ModuleConstants.Asset_Inventory_Create+'.'+PermissionConstants.Add]);
        this.isUpdate=this.authService.checkPermission([ModuleConstants.Asset_Inventory_Create+'.'+PermissionConstants.Update]);
    }

    ngOnInit() {
        if (this.assetService.isEditMode == false) {
            this.breadcrumbs = [
                { label: 'Asset Inventory' },
                { label: 'Create Asset Inventory' },
            ];
        } else {
            this.breadcrumbs = [
                { label: 'Asset Inventory' },
                { label: 'Edit Asset Inventory' },
            ];
        }
        this.currentAsset.installationCost = "0.00";
        this.currentAsset.inventoryNumber = "Generating"
        this.getAssetList();
        this.loadCurrencyData('');
        this.getLocationList();
        this.getWarrantyStatusList();

        this.assetInventoryId = this._actRoute.snapshot.params['id'];
        if (this.assetInventoryId) {
            this.disableSaveForEdit = true;
            this.isEditMode = true;
            setTimeout(() => {
                this.getAssetInventoryDataOnEdit(this.assetInventoryId);
            }, 1000);
        } else {

            this.getManagementStructureDetails(this.authService.currentUser
                ? this.authService.currentUser.managementStructureId
                : null, this.authService.currentUser ? this.authService.currentUser.employeeId : 0);
            this.getManagementStructureLevelIds(this.authService.currentUser
                ? this.authService.currentUser.managementStructureId : 0)
            this.getAssetStatusList('');
            this.getAssetInventoryStatusList();
            this.isSpinnerVisible = false;
        }
        // this.todaysDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toLocaleDateString();
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    getAssetList() {

        this.filterAssetIdInEdit('');
    }
    filterAssetIdInEdit(value) {
        this.setEditArray = [];
        if (this.currentAsset && this.currentAsset.assetId != undefined && this.currentAsset.assetId != null) {
            this.setEditArray.push(this.currentAsset.assetId);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value;


        this.commonService.autoSuggestionSmartDropDownList('Asset', 'AssetRecordId', 'AssetId', strText, true, 20, this.setEditArray.join(), this.currentUserMasterCompanyId).subscribe(res => {

            this.allAssetList = res;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });

    }

    arrayVendlsit: any = [];
    loadVendorData(value) {
        this.arrayVendlsit = [];
        this.arrayVendlsit.push(this.orignEditData.calibrationDefaultVendorId,
            this.orignEditData.certificationDefaultVendorId,
            this.orignEditData.inspectionDefaultVendorId,
            this.orignEditData.verificationDefaultVendorId,
            this.orignEditData.maintenanceDefaultVendorId,
            this.orignEditData.warrantyDefaultVendorId);
        this.vendorService.getVendorNameCodeListwithFilter(value, 20, this.arrayVendlsit.join()).subscribe(res => {

            this.allVendorsList = res.map(x => {
                return {
                    value: x.vendorId,
                    label: x.vendorName
                }
            });
            this.vendorListFilter = this.allVendorsList;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })

    }


    onFilterAssetCurrency(value) {
        this.loadCurrencyData(value);
    }
    loadCurrencyData(value) {


        if (this.isEditMode == true) {
            this.setEditArray = [];
            this.setEditArray.push(this.currentAsset.certificationCurrencyId, this.currentAsset.inspectionCurrencyId, this.currentAsset.calibrationCurrencyId, this.currentAsset.verificationCurrencyId);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value;
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', strText, true, 20, this.setEditArray.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.allCurrencyInfo = res;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });

    }


    setEditArray: any = [];
    getLocationList() {

        this.commonService.smartDropDownGetNamaWithCode('AssetLocation', 'AssetLocationId', 'Name', this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.allLocationList = res.map(x => {
                return {
                    ...x,
                    assetLocationId: x.value,
                    name: x.label
                }
            });

        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })

    }
    getWarrantyStatusList() {
        this.commonService.smartDropDownList('AssetWarrantyStatus', 'AssetWarrantyStatusId', 'warrantyStatus', 0).subscribe(response => {
            this.allWarrantyStatusList = response;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }

    get employeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }
    getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
        empployid = empployid == 0 ? this.employeeId : empployid;
        editMSID = this.isEditMode ? editMSID = id : 0;

        this.commonService.getManagmentStrctureData(id, empployid, editMSID, this.currentUserMasterCompanyId).subscribe(response => {

            if (this.isEditMode == true) {
                if (this.whereItComesFrom == 'fromHtml') {
                    setTimeout(() => {
                        this.isSpinnerVisible = false;
                    }, 1500);
                } else {
                    this.isSpinnerVisible = false;
                }

            }
            if (response) {
                const result = response;
                if (result[0] && result[0].level == 'Level1') {
                    this.legalEntityList = result[0].lstManagmentStrcture;
                    this.currentAsset.companyId = result[0].managementStructureId;
                    this.currentAsset.managementStructureId = result[0].managementStructureId;
                    this.currentAsset.buId = 0;
                    this.currentAsset.divisionId = 0;
                    this.currentAsset.departmentId = 0;
                    this.businessUnitList = [];
                    this.divisionList = [];
                    this.departmentList = [];
                } else {
                    this.currentAsset.companyId = 0;
                    this.currentAsset.buId = 0;
                    this.currentAsset.divisionId = 0;
                    this.currentAsset.departmentId = 0;
                    this.legalEntityList = [];
                    this.businessUnitList = [];
                    this.divisionList = [];
                    this.departmentList = [];
                }

                if (result[1] && result[1].level == 'Level2') {
                    this.businessUnitList = result[1].lstManagmentStrcture;
                    this.currentAsset.buId = result[1].managementStructureId;
                    this.currentAsset.managementStructureId = result[1].managementStructureId;
                    this.currentAsset.divisionId = 0;
                    this.currentAsset.departmentId = 0;
                    this.divisionList = [];
                    this.departmentList = [];
                } else {
                    if (result[1] && result[1].level == 'NEXT') {
                        this.businessUnitList = result[1].lstManagmentStrcture;
                    }
                    this.currentAsset.buId = 0;
                    this.currentAsset.divisionId = 0;
                    this.currentAsset.departmentId = 0;
                    this.divisionList = [];
                    this.departmentList = [];
                }

                if (result[2] && result[2].level == 'Level3') {
                    this.divisionList = result[2].lstManagmentStrcture;
                    this.currentAsset.divisionId = result[2].managementStructureId;
                    this.currentAsset.managementStructureId = result[2].managementStructureId;
                    this.currentAsset.departmentId = 0;
                    this.departmentList = [];
                } else {
                    if (result[2] && result[2].level == 'NEXT') {
                        this.divisionList = result[2].lstManagmentStrcture;
                    }
                    this.currentAsset.divisionId = 0;
                    this.currentAsset.departmentId = 0;
                    this.departmentList = [];
                }

                if (result[3] && result[3].level == 'Level4') {
                    this.departmentList = result[3].lstManagmentStrcture;;
                    this.currentAsset.departmentId = result[3].managementStructureId;
                    this.currentAsset.managementStructureId = result[3].managementStructureId;
                } else {
                    this.currentAsset.departmentId = 0;
                    if (result[3] && result[3].level == 'NEXT') {
                        this.departmentList = result[3].lstManagmentStrcture;
                    }
                }

            }
        }, err => {
            this.isSpinnerVisible = false;
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }
    getManagementStructureLevelIds(id) {
        if (id) {
            this.commonService.getManagementStructureData(this.authService.currentUser.masterCompanyId, id).subscribe(res => {
                const data: any = res;
                if (data != undefined) {
                    if (data && data.levelId1) {
                        this.managementStructure.companyId = data.levelId1;
                    }
                    if (data && data.levelId2) {
                        this.managementStructure.buId = data.levelId2;
                    }
                    if (data && data.levelId3) {
                        this.managementStructure.divisionId = data.levelId3;
                    }
                    if (data && data.levelId4) {
                        this.managementStructure.departmentId = data.levelId4;
                    }
                }
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }
    orignEditData: any = {}
    assetRecordIdForCapes: any;
    getAssetInventoryDataOnEdit(id) {
        if (id != undefined) {
            this.assetService.getByInventoryId(id).subscribe(res => {
                this.orignEditData = res;
                this.assetRecordIdForCapes = res.assetRecordId;
                this.loadVendorData('')
                this.onAssetIdselection({ "value": res.assetRecordId }, "fromOnload");
                this.currentAsset = {
                    ...res,
                    memo: res.memo,
                    isTangible: !res.isIntangible,
                    assetRecordId: getObjectById('value', res.assetRecordId, this.allAssetList),
                    entryDate: res.entryDate ? new Date(res.entryDate) : null,
                    manufacturedDate: res.manufacturedDate ? new Date(res.manufacturedDate) : null,
                    expirationDate: res.expirationDate ? new Date(res.expirationDate) : null,
                    assetLocationId: res.assetLocationId ? parseInt(res.assetLocationId) : 0,
                    unitCost: res.unitCost ? formatNumberAsGlobalSettingsModule(res.unitCost, 2) : '0.00',
                    installationCost: res.installationCost ? formatNumberAsGlobalSettingsModule(res.installationCost, 2) : '0.00',
                    freight: res.freight ? formatNumberAsGlobalSettingsModule(res.freight, 2) : '0.00',
                    insurance: res.insurance ? formatNumberAsGlobalSettingsModule(res.insurance, 2) : '0.00',
                    taxes: res.taxes ? formatNumberAsGlobalSettingsModule(res.taxes, 2) : '0.00',
                    residualPercentage: res.residualPercentage ? formatNumberAsGlobalSettingsModule(res.residualPercentage, 2) : '0.00',
                    totalCost: res.totalCost ? formatNumberAsGlobalSettingsModule(res.totalCost, 2) : '0.00',
                    calibrationDefaultCost: res.calibrationDefaultCost ? formatNumberAsGlobalSettingsModule(res.calibrationDefaultCost, 2) : '',
                    certificationDefaultCost: res.certificationDefaultCost ? formatNumberAsGlobalSettingsModule(res.certificationDefaultCost, 2) : '',
                    inspectionDefaultCost: res.inspectionDefaultCost ? formatNumberAsGlobalSettingsModule(res.inspectionDefaultCost, 2) : '',
                    verificationDefaultCost: res.verificationDefaultCost ? formatNumberAsGlobalSettingsModule(res.verificationDefaultCost, 2) : '',
                    defaultVendorId: res.defaultVendorId ? getObjectById('value', res.defaultVendorId, this.allVendorsList) : null,
                    warrantyCompanyId: res.warrantyCompanyId ? getObjectById('value', res.warrantyCompanyId, this.allVendorsList) : null,
                    warrantyStartDate: res.warrantyStartDate ? new Date(res.warrantyStartDate) : null,
                    warrantyEndDate: res.warrantyEndDate ? new Date(res.warrantyEndDate) : null,
                };
                this.originalAsset = this.currentAsset;
                this.getAssetStatusList('');
                this.getAssetInventoryStatusList();
                //   this.toGetDocumentsListNew(this.assetInventoryId);
                // this.toGetDocumentsListWarranty(this.assetInventoryId);
                // if(!this.currentAsset.isTangible){
                // this.toGetDocumentsListInt(this.assetInventoryId);
                // }
                const isIntangible = this.currentAsset.isIntangible ? 1 : 0;
                // this.isSpinnerVisible = false;
            }, err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }

    filterAssetList(event) {

        this.assetListFilter = this.allAssetList;
        if (event.query !== undefined && event.query !== null) {
            this.filterAssetIdInEdit(event.query);
            const assetFilter = [...this.allAssetList.filter(x => {
                return x.label.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.assetListFilter = assetFilter;
        }
    }

    filterVendorList(event) {
        this.vendorListFilter = this.allVendorsList;
        if (event.query !== undefined && event.query !== null) {
            this.loadVendorData(event.query);
        } else {
            this.loadVendorData('');
        }
        const vendors = [...this.allVendorsList.filter(x => {
            return x.label.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.vendorListFilter = vendors;

    }
    whereItComesFrom: any;
    onAssetIdselection(event, type) {
        if (event && event.value != undefined) {
            if (type == 'fromHtml') {
                this.whereItComesFrom = type;
                this.isSpinnerVisible = true;
            }


            this.assetService.getAssetDataForInventoryById(event.value).subscribe(res => {

                if (type == 'fromHtml') {
                    this.orignEditData = res;
                    this.loadVendorData('')
                    this.getManagementStructureDetails(res
                        ? res.managementStructureId
                        : null, this.authService.currentUser ? this.authService.currentUser.employeeId : 0);
                    this.getManagementStructureLevelIds(res ? res.managementStructureId : 0)
                }
                this.assetRecordIdForCapes = this.assetRecordIdForCapes ? this.assetRecordIdForCapes : res.assetRecordId;
                setTimeout(() => {
                    this.currentAsset = {
                        ...res,
                        isTangible: !res.isIntangible,
                        assetRecordId: { 'value': res.assetRecordId, 'label': res.assetId },
                        entryDate: res.entryDate ? new Date(res.entryDate) : this.currentDate,
                        manufacturedDate: res.manufacturedDate ? new Date(res.manufacturedDate) : null,
                        expirationDate: res.expirationDate ? new Date(res.expirationDate) : null,
                        unitCost: res.unitCost ? formatNumberAsGlobalSettingsModule(res.unitCost, 2) : '0.00',
                        installationCost: res.installationCost ? formatNumberAsGlobalSettingsModule(res.installationCost, 2) : '0.00',
                        freight: res.freight ? formatNumberAsGlobalSettingsModule(res.freight, 2) : '0.00',
                        insurance: res.insurance ? formatNumberAsGlobalSettingsModule(res.insurance, 2) : '0.00',
                        taxes: res.taxes ? formatNumberAsGlobalSettingsModule(res.taxes, 2) : '0.00',
                        residualPercentage: res.residualPercentage ? formatNumberAsGlobalSettingsModule(res.residualPercentage, 2) : '0.00',
                        calibrationDefaultCost: res.calibrationDefaultCost ? formatNumberAsGlobalSettingsModule(res.calibrationDefaultCost, 2) : '',
                        certificationDefaultCost: res.certificationDefaultCost ? formatNumberAsGlobalSettingsModule(res.certificationDefaultCost, 2) : '',
                        inspectionDefaultCost: res.inspectionDefaultCost ? formatNumberAsGlobalSettingsModule(res.inspectionDefaultCost, 2) : '',
                        verificationDefaultCost: res.verificationDefaultCost ? formatNumberAsGlobalSettingsModule(res.verificationDefaultCost, 2) : '',
                        calibrationDefaultVendorId: res.calibrationDefaultVendorId ? getObjectById('value', res.calibrationDefaultVendorId, this.allVendorsList) : null,
                        certificationDefaultVendorId: res.certificationDefaultVendorId ? getObjectById('value', res.certificationDefaultVendorId, this.allVendorsList) : null,
                        inspectionDefaultVendorId: res.inspectionDefaultVendorId ? getObjectById('value', res.inspectionDefaultVendorId, this.allVendorsList) : null,
                        verificationDefaultVendorId: res.verificationDefaultVendorId ? getObjectById('value', res.verificationDefaultVendorId, this.allVendorsList) : null,
                        maintenanceDefaultVendorId: res.maintenanceDefaultVendorId ? getObjectById('value', res.maintenanceDefaultVendorId, this.allVendorsList) : null,
                        warrantyDefaultVendorId: res.warrantyDefaultVendorId ? getObjectById('value', res.warrantyDefaultVendorId, this.allVendorsList) : null,

                        assetType: res.assetTypeName,
                        isSerialized: res.isSerialized ? res.isSerialized : false,
                        calibrationRequired: res.calibrationRequired ? res.calibrationRequired : false,
                        certificationRequired: res.certificationRequired ? res.certificationRequired : false,
                        inspectionRequired: res.inspectionRequired ? res.inspectionRequired : false,
                        verificationRequired: res.verificationRequired ? res.verificationRequired : false,
                        assetIsMaintenanceReqd: res.assetIsMaintenanceReqd ? res.assetIsMaintenanceReqd : false,
                        isWarrantyRequired: res.isWarrantyRequired ? res.isWarrantyRequired : false,
                        inventoryStatusId: this.basicValue ? this.basicValue : 1,


                    };
                    this.currentAsset.inventoryNumber = this.originalAsset ? this.originalAsset.inventoryNumber : "Generating";

                    this.currentAsset.inventoryNumber = this.originalAsset ? this.originalAsset.inventoryNumber : "Generating";

                    if (type == "fromOnload") {
                        this.currentAsset.entryDate = this.originalAsset.entryDate ? this.originalAsset.entryDate : new Date(res.entryDate);
                        this.currentAsset.manufacturedDate = this.originalAsset.manufacturedDate ? this.originalAsset.manufacturedDate : new Date(res.manufacturedDate);
                        this.currentAsset.expirationDate = this.originalAsset.expirationDate ? this.originalAsset.expirationDate : new Date(res.expirationDate);
                        this.currentAsset.unitCost = this.originalAsset.unitCost ? this.originalAsset.unitCost : formatNumberAsGlobalSettingsModule(res.unitCost, 2);
                        this.currentAsset.installationCost = this.originalAsset.installationCost ? this.originalAsset.installationCost : formatNumberAsGlobalSettingsModule(res.installationCost, 2);
                        this.currentAsset.freight = this.originalAsset.freight ? this.originalAsset.freight : formatNumberAsGlobalSettingsModule(res.freight, 2);
                        this.currentAsset.insurance = this.originalAsset.insurance ? this.originalAsset.insurance : formatNumberAsGlobalSettingsModule(res.insurance, 2);
                        this.currentAsset.taxes = this.originalAsset.taxes ? this.originalAsset.taxes : formatNumberAsGlobalSettingsModule(res.taxes, 2);
                        this.currentAsset.residualPercentage = this.originalAsset.residualPercentage ? this.originalAsset.residualPercentage : formatNumberAsGlobalSettingsModule(res.residualPercentage, 2);
                        this.currentAsset.calibrationDefaultCost = this.originalAsset.calibrationDefaultCost ? this.originalAsset.calibrationDefaultCost : formatNumberAsGlobalSettingsModule(res.calibrationDefaultCost, 2);
                        this.currentAsset.certificationDefaultCost = this.originalAsset.certificationDefaultCost ? this.originalAsset.certificationDefaultCost : formatNumberAsGlobalSettingsModule(res.certificationDefaultCost, 2);
                        this.currentAsset.inspectionDefaultCost = this.originalAsset.inspectionDefaultCost ? this.originalAsset.inspectionDefaultCost : formatNumberAsGlobalSettingsModule(res.inspectionDefaultCost, 2);
                        this.currentAsset.verificationDefaultCost = this.originalAsset.verificationDefaultCost ? this.originalAsset.verificationDefaultCost : formatNumberAsGlobalSettingsModule(res.verificationDefaultCost, 2);
                        this.currentAsset.assetLocationId = this.originalAsset.assetLocationId ? this.originalAsset.assetLocationId : null;
                        this.currentAsset.defaultVendorId = res.defaultVendorId ? getObjectById('value', res.defaultVendorId, this.allVendorsList) : null;


                        this.currentAsset.calibrationDefaultVendorId = this.originalAsset.calibrationDefaultVendorId ? getObjectById('value', this.originalAsset.calibrationDefaultVendorId, this.allVendorsList) : null,
                            this.currentAsset.certificationDefaultVendorId = this.originalAsset.certificationDefaultVendorId ? getObjectById('value', this.originalAsset.certificationDefaultVendorId, this.allVendorsList) : null,
                            this.currentAsset.inspectionDefaultVendorId = this.originalAsset.inspectionDefaultVendorId ? getObjectById('value', this.originalAsset.inspectionDefaultVendorId, this.allVendorsList) : null,
                            this.currentAsset.verificationDefaultVendorId = this.originalAsset.verificationDefaultVendorId ? getObjectById('value', this.originalAsset.verificationDefaultVendorId, this.allVendorsList) : null,
                            this.currentAsset.maintenanceDefaultVendorId = this.originalAsset.maintenanceDefaultVendorId ? getObjectById('value', this.originalAsset.maintenanceDefaultVendorId, this.allVendorsList) : null,
                            this.currentAsset.warrantyDefaultVendorId = this.originalAsset.warrantyDefaultVendorId ? getObjectById('value', this.originalAsset.warrantyDefaultVendorId, this.allVendorsList) : null,


                            this.currentAsset.isSerialized = res.isSerialized ? res.isSerialized : false;
                        this.currentAsset.calibrationRequired = res.calibrationRequired ? res.calibrationRequired : false;
                        this.currentAsset.certificationRequired = res.certificationRequired ? res.certificationRequired : false;
                        this.currentAsset.inspectionRequired = res.inspectionRequired ? res.inspectionRequired : false;
                        this.currentAsset.verificationRequired = res.verificationRequired ? res.verificationRequired : false;
                        this.currentAsset.assetIsMaintenanceReqd = res.assetIsMaintenanceReqd ? res.assetIsMaintenanceReqd : false;
                        this.currentAsset.isWarrantyRequired = res.isWarrantyRequired ? res.isWarrantyRequired : false;
                        this.currentAsset.warrantyStartDate = this.originalAsset.warrantyStartDate ? this.originalAsset.warrantyStartDate : null;
                        this.currentAsset.warrantyEndDate = this.originalAsset.warrantyEndDate ? this.originalAsset.warrantyEndDate : null;
                        this.currentAsset.maintenanceFrequencyMonths = this.originalAsset.maintenanceFrequencyMonths ? this.originalAsset.maintenanceFrequencyMonths : res.maintenanceFrequencyMonths;
                        this.currentAsset.maintenanceFrequencyDays = this.originalAsset.maintenanceFrequencyDays ? this.originalAsset.maintenanceFrequencyDays : res.maintenanceFrequencyDays;
                        this.currentAsset.assetLife = this.originalAsset.assetLife ? this.originalAsset.assetLife : res.assetLife;
                        this.currentAsset.calibrationCurrencyId = this.originalAsset.calibrationCurrencyId ? this.originalAsset.calibrationCurrencyId : res.calibrationCurrencyId;
                        this.currentAsset.certificationCurrencyId = this.originalAsset.certificationCurrencyId ? this.originalAsset.certificationCurrencyId : res.certificationCurrencyId;
                        this.currentAsset.inspectionCurrencyId = this.originalAsset.inspectionCurrencyId ? this.originalAsset.inspectionCurrencyId : res.inspectionCurrencyId;
                        this.currentAsset.verificationCurrencyId = this.originalAsset.verificationCurrencyId ? this.originalAsset.verificationCurrencyId : res.verificationCurrencyId;
                        this.currentAsset.inventoryNumber = this.originalAsset.inventoryNumber ? this.originalAsset.inventoryNumber : "Generating";
                        this.currentAsset.inventoryStatusId = this.originalAsset.inventoryStatusId ? this.originalAsset.inventoryStatusId : res.inventoryStatusId;
                        this.currentAsset.assetStatusId = this.originalAsset.assetStatusId ? this.originalAsset.assetStatusId : res.assetStatusId;
                        this.currentAsset.unitOfMeasureName = this.originalAsset.unitOfMeasureName ? this.originalAsset.unitOfMeasureName : res.unitOfMeasureName;
                        this.currentAsset.serialNo = this.originalAsset.serialNo;
                        this.currentAsset.memo = this.originalAsset.memo;
                        this.currentAsset.warrantyMemo = this.originalAsset.warrantyMemo ? this.originalAsset.warrantyMemo : res.warrantyMemo;
                        this.currentAsset.warrantyStatusId = this.originalAsset.warrantyStatusId ? this.originalAsset.warrantyStatusId : res.warrantyStatusId;
                        this.currentAsset.calibrationMemo = this.originalAsset.calibrationMemo ? this.originalAsset.calibrationMemo : res.calibrationMemo;
                        this.currentAsset.certificationMemo = this.originalAsset.certificationMemo ? this.originalAsset.certificationMemo : res.certificationMemo;
                        this.currentAsset.inspectionMemo = this.originalAsset.inspectionMemo ? this.originalAsset.inspectionMemo : res.inspectionMemo;
                        this.currentAsset.verificationMemo = this.originalAsset.verificationMemo ? this.originalAsset.verificationMemo : res.verificationMemo;
                        this.currentAsset.assetCalibrationMemo = this.originalAsset.assetCalibrationMemo ? this.originalAsset.assetCalibrationMemo : res.assetCalibrationMemo;
                        // this.currentAsset.managementStructureId=  this.originalAsset.managementStructureId ? this.originalAsset.managementStructureId : res.managementStructureId;
                        if (this.originalAsset.managementStructureId != res.managementStructureId) {
                            this.currentAsset.managementStructureId = this.originalAsset.managementStructureId;
                        } else {
                            this.currentAsset.managementStructureId = res.managementStructureId
                        }
                        this.getManagementStructureDetails(this.currentAsset
                            ? this.currentAsset.managementStructureId
                            : null, this.authService.currentUser ? this.authService.currentUser.employeeId : 0);
                        this.getManagementStructureLevelIds(this.currentAsset ? this.currentAsset.managementStructureId : 0)

                    }
                    this.getTotalCost();
                    // this.openCapes();
                    if (type == 'fromHtml') {
                        setTimeout(() => {
                            this.isSpinnerVisible = false;
                        }, 1000);
                    } else {
                        this.isSpinnerVisible = true;

                    }
                }, 2000);
            }, err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }


    onChangeUnitCost() {
        this.currentAsset.unitCost = this.currentAsset.unitCost ? formatNumberAsGlobalSettingsModule(this.currentAsset.unitCost, 2) : '0.00';
    }
    onChangeInstallCost() {
        this.currentAsset.installationCost = this.currentAsset.installationCost ? formatNumberAsGlobalSettingsModule(this.currentAsset.installationCost, 2) : '0.00';
    }
    onChangeFreight() {
        this.currentAsset.freight = this.currentAsset.freight ? formatNumberAsGlobalSettingsModule(this.currentAsset.freight, 2) : '0.00';
    }
    onChangeInsurance() {
        this.currentAsset.insurance = this.currentAsset.insurance ? formatNumberAsGlobalSettingsModule(this.currentAsset.insurance, 2) : '0.00';
    }
    onChangeTaxes() {
        this.currentAsset.taxes = this.currentAsset.taxes ? formatNumberAsGlobalSettingsModule(this.currentAsset.taxes, 2) : '0.00';
    }
    getTotalCost() {
        const unitCost = this.currentAsset.unitCost ? parseFloat(this.currentAsset.unitCost.toString().replace(/\,/g, '')) : 0;
        const installationCost = this.currentAsset.installationCost ? parseFloat(this.currentAsset.installationCost.toString().replace(/\,/g, '')) : 0;
        const freight = this.currentAsset.freight ? parseFloat(this.currentAsset.freight.toString().replace(/\,/g, '')) : 0;
        const insurance = this.currentAsset.insurance ? parseFloat(this.currentAsset.insurance.toString().replace(/\,/g, '')) : 0;
        const taxes = this.currentAsset.taxes ? parseFloat(this.currentAsset.taxes.toString().replace(/\,/g, '')) : 0;
        const totalCost = unitCost + installationCost + freight + insurance + taxes;
        this.currentAsset.totalCost = formatNumberAsGlobalSettingsModule(totalCost, 2);
    }

    onChangeCalDefaultCost() {
        this.currentAsset.calibrationDefaultCost = this.currentAsset.calibrationDefaultCost ? formatNumberAsGlobalSettingsModule(this.currentAsset.calibrationDefaultCost, 2) : '0.00';
    }
    onChangeCertDefaultCost() {
        this.currentAsset.certificationDefaultCost = this.currentAsset.certificationDefaultCost ? formatNumberAsGlobalSettingsModule(this.currentAsset.certificationDefaultCost, 2) : '0.00';
    }
    onChangeInspDefaultCost() {
        this.currentAsset.inspectionDefaultCost = this.currentAsset.inspectionDefaultCost ? formatNumberAsGlobalSettingsModule(this.currentAsset.inspectionDefaultCost, 2) : '0.00';
    }
    onChangeVerDefaultCost() {
        this.currentAsset.verificationDefaultCost = this.currentAsset.verificationDefaultCost ? formatNumberAsGlobalSettingsModule(this.currentAsset.verificationDefaultCost, 2) : '0.00';
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    openCapesModel: any = false;
    openCapes() {
        this.openCapesModel = true;
        if (this.currentAsset.assetRecordId) {
            const assetRecordId = getValueFromObjectByKey('value', this.currentAsset.assetRecordId);
            this.assetService.getcapabilityListData(assetRecordId).subscribe(res => {
                this.allCapesInfo = res[0];
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }
    closeCpes() {
        this.openCapesModel = false;
    }
    selectedLegalEntity(legalEntityId) {
        this.businessUnitList = [];
        this.divisionList = [];
        this.departmentList = [];
        this.managementStructure.buId = 0;
        this.managementStructure.divisionId = 0;
        this.managementStructure.departmentId = 0;

        if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
            this.currentAsset.managementStructureId = legalEntityId;
            this.commonService.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.businessUnitList = res;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }



    selectedBusinessUnit(businessUnitId) {
        this.divisionList = [];
        this.departmentList = [];
        this.managementStructure.buId = businessUnitId;
        this.managementStructure.divisionId = 0;
        this.managementStructure.departmentId = 0;

        if (businessUnitId != 0 && businessUnitId != null && businessUnitId != undefined) {
            this.currentAsset.managementStructureId = businessUnitId;
            this.commonService.getManagementStructurelevelWithEmployee(businessUnitId, this.employeeId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.divisionList = res;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }
    selectedDivision(divisionUnitId) {
        this.departmentList = [];
        this.managementStructure.divisionId = divisionUnitId;
        this.managementStructure.departmentId = 0;

        if (divisionUnitId != 0 && divisionUnitId != null && divisionUnitId != undefined) {
            this.currentAsset.managementStructureId = divisionUnitId;
            this.commonService.getManagementStructurelevelWithEmployee(divisionUnitId, this.employeeId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.departmentList = res;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }
    selectedDepartment(departmentId) {
        this.managementStructure.departmentId = departmentId;
        if (departmentId != 0 && departmentId != null && departmentId != undefined) {
            this.currentAsset.managementStructureId = departmentId;
        }
    }

    onAddMemo(label) {
        this.disableEditor = true;
        if (label == 'Memo') {
            this.headerMemo = this.currentAsset.memo;
            this.memoLabel = label;
        }
        if (label == 'Tolerance Memo') {
            this.headerMemo = this.currentAsset.assetCalibrationMemo;
            this.memoLabel = label;
        }
        if (label == 'Calibration Memo') {
            this.headerMemo = this.currentAsset.calibrationMemo;
            this.memoLabel = label;
        }
        if (label == 'Certification Memo') {
            this.headerMemo = this.currentAsset.certificationMemo;
            this.memoLabel = label;
        }
        if (label == 'Inspection Memo') {
            this.headerMemo = this.currentAsset.inspectionMemo;
            this.memoLabel = label;
        }
        if (label == 'Verification Memo') {
            this.headerMemo = this.currentAsset.verificationMemo;
            this.memoLabel = label;
        }
        if (label == 'Maintenance Memo') {
            this.headerMemo = this.currentAsset.maintenanceMemo;
            this.memoLabel = label;
        }
        if (label == 'Warranty Memo') {
            this.headerMemo = this.currentAsset.warrantyMemo;
            this.memoLabel = label;
        }
        if (label == 'Document Memo') {
            this.headerMemo = this.documentInformation.docMemo;
            this.memoLabel = label;
        }
    }
    onSaveMemo() {

        this.disleUpdate = false;
        this.disableSaveForEdit = false;
        if (this.memoLabel == 'Memo') {
            this.currentAsset.memo = this.headerMemo;
        }
        if (this.memoLabel == 'Calibration Memo') {
            this.currentAsset.calibrationMemo = this.headerMemo;
        }
        if (this.memoLabel == 'Tolerance Memo') {
            this.currentAsset.assetCalibrationMemo = this.headerMemo;
        }

        if (this.memoLabel == 'Certification Memo') {
            this.currentAsset.certificationMemo = this.headerMemo;
        }
        if (this.memoLabel == 'Inspection Memo') {
            this.currentAsset.inspectionMemo = this.headerMemo;
        }
        if (this.memoLabel == 'Verification Memo') {
            this.currentAsset.verificationMemo = this.headerMemo;
        }
        if (this.memoLabel == 'Maintenance Memo') {
            this.currentAsset.maintenanceMemo = this.headerMemo;
        }
        if (this.memoLabel == 'Warranty Memo') {
            this.currentAsset.warrantyMemo = this.headerMemo;
        }
        if (this.memoLabel == 'Document Memo') {
            this.documentInformation.docMemo = this.headerMemo;
        }
        // this.disableEditor=true;
    }

    onChangeWarrantyEndDate() {
        if (this.currentAsset.warrantyEndDate) {
            if (this.currentDate > this.currentAsset.warrantyEndDate) {
                this.currentAsset.warrantyStatusId = 2;
            } else {
                this.currentAsset.warrantyStatusId = 3;
            }
        }

    }

    closeMyModel(type) {
        $(type).modal("hide");
        this.disableDocumentSave = true;
    }

    fileUpload(event) {
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
                if (this.sourceViewforDocumentList[i].fileName == file.name && this.sourceViewforDocumentList[i].typeId == 1) {
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
                this.formDataMain.append(file.name, file);
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
                typeId: 1,
                isFileFromServer: false,
                attachmentDetailId: 0,
            })
        }
    }

    removeFileMain(event) {
        this.formDataMain.delete(event.file.name)
    }
    removeFileWarr(event) {
        this.formDataWarr.delete(event.file.name)
    }
    removeFileInt(event) {
        this.formDataInt.delete(event.file.name)
    }

    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }

    addDocumentInformation(type, documentInformation) {
        this.disleUpdate = true;
        this.disableSaveForEdit = false;
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
                    typeId: 1,
                    fileSize: ((this.selectedFileAttachment[i].fileSize) / (1024 * 1024)).toFixed(2),
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
            this.index = 0;
            this.isEditButton = false;
            this.disableFileAttachmentSubmit == true;
            this.dismissDocumentPopupModelNew(type);
        }
        this.dismissDocumentPopupModelNew(type);
        this.sourceViewforDocumentList = [...this.sourceViewforDocumentList]
        // if (this.sourceViewforDocumentList.length > 0) {
        //     this.totalRecordNew = this.sourceViewforDocumentList.length;
        //     this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
        // }
        this.index = 0;
        this.isEditButton = false;
        this.disableFileAttachmentSubmit == true;;

        if (this.fileUploadInput) {
            this.fileUploadInput.clear()
        }
        // add 1
        if (this.isEditMode) {
            this.onUploadDocumentListMain();
        } else {
            if (this.updateDocuments == true) {
                this.alertService.showMessage("Success", `Updated Document Successfully.`, MessageSeverity.success);
            } else {
                this.alertService.showMessage("Success", `Upload Documents Successfully.`, MessageSeverity.success);
            }
        }
        // this.onUploadDocumentListWarranty();
        // this.onUploadDocumentListInt();
    }

    dismissDocumentPopupModelNew(type) {
        this.fileUploadInput.clear();
        this.fileUploadInputWarranty.clear();
        this.closeMyModel(type);
    }

    dateFilterForTableNew(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
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

    editCustomerDocument(rowdata, index = 0) {
        this.updateDocuments = true;
        this.disleUpdate = true;
        this.selectedFileAttachment = [];
        this.isEditButton = true;
        this.index = index;
        this.documentInformation = rowdata;
        if (rowdata.attachmentDetailId > 0) {
            this.toGetDocumentView(rowdata.attachmentDetailId);
        }
        else {
            this.sourceViewforDocument = rowdata;
        }
    }

    deleteAttachmentRow(rowdata, index, content) {
        this.selectedRowForDelete = rowdata;

        this.rowIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
    }

    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.sourceViewforDocumentAudit = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { })
    }

    openHistory(content, rowData) {
        this.alertService.startLoadingMessage();
        this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
            results => { this.onAuditHistoryLoadSuccessful(results, content) }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
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

    dismissModelNew() {
        this.isDeleteMode = false;
        this.modal.close();
    }

    deleteItemAndCloseModelNew() {
        let attachmentDetailId = this.selectedRowForDelete.attachmentDetailId;
        if (attachmentDetailId > 0) {
            this.commonService.GetAttachmentDeleteById(attachmentDetailId, this.userName).subscribe(() => {
                this.toGetDocumentsListNew(this.assetInventoryId);
                this.alertService.showMessage(
                    'Success',
                    `Deleted Attachment  Successfully`,
                    MessageSeverity.success
                );
                // })
                this.disableSaveForEdit = false;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
        else {
            this.sourceViewforDocumentList.splice(this.rowIndex, 1)
            this.sourceViewforDocumentList = [...this.sourceViewforDocumentList]
            // this.totalRecordNew = this.sourceViewforDocumentList.length;
            // this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
        }
        this.modal.close();
    }

    toGetDocumentView(id) {
        this.commonService.GetAttachment(id).subscribe(res => {
            this.sourceViewforDocument = res || [];
        })
    }

    toGetDocumentsListNew(id) {
        var moduleId = 54;

        this.commonService.GetDocumentsListNewAsset(id, moduleId, this.maitananceeletedList).subscribe(res => { //GetDocumentsListWithType
            this.sourceViewforDocumentList = res || [];
            this.allDocumentListOriginal = res;

            if (this.sourceViewforDocumentList.length > 0) {
                this.sourceViewforDocumentList.forEach(item => {
                    item["isFileFromServer"] = true;
                })
            }
            // this.totalRecordNew = this.sourceViewforDocumentList.length;
            // this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);

        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }

    private saveFailedHelper() {

    }



    addDocumentDetails() {
        // this.disleUpdate=true;
        this.updateDocuments = false;
        this.selectedFileAttachment = [];
        this.selectedFileAttachmentWarranty = [];
        this.index = 0;
        this.disableFileAttachmentSubmit = false;
        this.disableFileAttachmentSubmitWarranty = true;

        this.isEditButton = false;
        this.documentInformation = {
            docName: '',
            docMemo: '',
            docDescription: '',
            attachmentDetailId: 0
        }

    }

    dateFilterForTableWarranty(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            const data = [...this.sourceViewforDocumentListWarranty.filter(x => {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.sourceViewforDocumentListWarranty = data;
        } else {
            this.sourceViewforDocumentListWarranty = this.allDocumentListOriginalWarranty;
        }
    }
    updateDocuments = false;
    editCustomerDocumentWarranty(rowdata, index = 0) {
        this.updateDocuments = true;
        this.disleUpdate = true;
        this.selectedFileAttachment = [];
        this.selectedFileAttachmentWarranty = [];
        this.isEditButton = true;
        this.index = index;
        this.documentInformation = rowdata;
        if (rowdata.attachmentDetailId > 0) {
            this.toGetDocumentViewWarranty(rowdata.attachmentDetailId);
        }
        else {
            this.sourceViewforDocumentWarranty = rowdata;
        }
    }

    deleteAttachmentRowWarranty(rowdata, index, content) {
        this.selectedRowForDeleteWarranty = rowdata;
        this.rowIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
    }

    toGetDocumentViewWarranty(id) {
        this.commonService.GetAttachment(id).subscribe(res => {
            this.sourceViewforDocumentWarranty = res || [];
        })
    }

    deleteItemAndCloseModelWarranty() {
        let attachmentDetailId = this.selectedRowForDeleteWarranty.attachmentDetailId;
        if (attachmentDetailId > 0) {
            this.commonService.GetAttachmentDeleteById(attachmentDetailId, this.userName).subscribe(() => {
                this.toGetDocumentsListWarranty(this.assetInventoryId);
                this.alertService.showMessage(
                    'Success',
                    `Deleted Attachment  Successfully`,
                    MessageSeverity.success
                );
                // })
                this.disableSaveForEdit = false;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
        else {
            this.sourceViewforDocumentListWarranty.splice(this.rowIndex, 1)
            this.sourceViewforDocumentListWarranty = [...this.sourceViewforDocumentListWarranty]
            // this.totalRecordsWarranty = this.sourceViewforDocumentListWarranty.length;
            // this.totalPagesWarranty= Math.ceil(this.totalRecordsWarranty / this.pageSizeNew);

        }

        this.modal.close();
    }

    toGetDocumentsListWarranty(id) {
        var moduleId = 55;
        this.commonService.GetDocumentsListNewAsset(id, moduleId, this.warrentyDeletedList).subscribe(res => {
            this.sourceViewforDocumentListWarranty = res || [];
            this.allDocumentListOriginalWarranty = res;

            if (this.sourceViewforDocumentListWarranty.length > 0) {
                this.sourceViewforDocumentListWarranty.forEach(item => {
                    item["isFileFromServer"] = true;

                })
            }
            // this.totalRecordsWarranty = this.sourceViewforDocumentListWarranty.length;
            // this.totalPagesWarranty = Math.ceil(this.totalRecordsWarranty / this.pageSizeNew);


        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    fileUploadWarranty(event) {
        if (event.files.length === 0) {
            this.disableFileAttachmentSubmitWarranty = true;
        } else {
            this.disableFileAttachmentSubmitWarranty = false;
        }

        const filesSelectedTemp = [];
        this.selectedFileAttachmentWarranty = [];
        for (let file of event.files) {
            var flag = false;
            for (var i = 0; i < this.sourceViewforDocumentListWarranty.length; i++) {
                if (this.sourceViewforDocumentListWarranty[i].fileName == file.name && this.sourceViewforDocumentListWarranty[i].typeId == 2) {
                    flag = true;
                    this.alertService.showMessage(
                        'Duplicate',
                        `Already Exists this file `,
                        MessageSeverity.warn
                    );
                    this.disableFileAttachmentSubmitWarranty = true;
                    if (this.fileUploadInputWarranty) {
                        this.fileUploadInputWarranty.clear()
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
                this.formDataWarr.append(file.name, file);
            }
        }
        for (var i = 0; i < filesSelectedTemp.length; i++) {
            this.selectedFileAttachmentWarranty.push({

                docName: this.documentInformation.docName,
                docMemo: this.documentInformation.docMemo,
                docDescription: this.documentInformation.docDescription,
                createdBy: this.userName,
                updatedBy: this.userName,
                link: filesSelectedTemp[i].link,
                fileName: filesSelectedTemp[i].fileName,
                fileSize: filesSelectedTemp[i].fileSize,
                typeId: 2,
                isFileFromServer: false,
                attachmentDetailId: 0,
            })
        }
    }

    addDocumentInformationWarranty(type, documentInformation) {
        this.disableSaveForEdit = false;
        if (this.selectedFileAttachmentWarranty != []) {
            for (var i = 0; i < this.selectedFileAttachmentWarranty.length; i++) {
                this.sourceViewforDocumentListWarranty.push({

                    docName: documentInformation.docName,
                    docMemo: documentInformation.docMemo,
                    docDescription: documentInformation.docDescription,
                    link: this.selectedFileAttachmentWarranty[i].link,
                    fileName: this.selectedFileAttachmentWarranty[i].fileName,
                    isFileFromServer: false,
                    attachmentDetailId: 0,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    createdDate: Date.now(),
                    updatedDate: Date.now(),
                    typeId: 2,
                    fileSize: ((this.selectedFileAttachmentWarranty[i].fileSize) / (1024 * 1024)).toFixed(2),
                })
            }
        }

        if (documentInformation.attachmentDetailId > 0 || this.index > 0) {
            for (var i = 0; i <= this.sourceViewforDocumentListWarranty.length; i++) {
                if (this.sourceViewforDocumentListWarranty[i].attachmentDetailId > 0) {

                    if (this.sourceViewforDocumentListWarranty[i].attachmentDetailId == documentInformation.attachmentDetailId) {

                        this.sourceViewforDocumentListWarranty[i].docName = documentInformation.docName;
                        this.sourceViewforDocumentListWarranty[i].docMemo = documentInformation.docMemo;
                        this.sourceViewforDocumentListWarranty[i].docDescription = documentInformation.docDescription;
                        break;
                    }
                }
                else {
                    if (i == this.index) {
                        this.sourceViewforDocumentListWarranty[i].docName = documentInformation.docName;
                        this.sourceViewforDocumentListWarranty[i].docMemo = documentInformation.docMemo;
                        this.sourceViewforDocumentListWarranty[i].docDescription = documentInformation.docDescription;
                        break;
                    }
                }
            }
            this.index = 0;
            this.isEditButton = false;
            this.disableFileAttachmentSubmitWarranty == false;

            this.dismissDocumentPopupModelNew(type)
        }
        this.dismissDocumentPopupModelNew(type)
        this.sourceViewforDocumentListWarranty = [...this.sourceViewforDocumentListWarranty]
        // if (this.sourceViewforDocumentList.length > 0) {
        // this.totalRecordNew = this.sourceViewforDocumentList.length;
        // this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
        // }
        this.index = 0;
        this.isEditButton = false;
        this.disableFileAttachmentSubmit == true;;

        if (this.fileUploadInput) {
            this.fileUploadInput.clear()
        }
        if (this.isEditMode) {
            this.onUploadDocumentListWarranty();
        } else {
            if (this.updateDocuments == true) {
                this.alertService.showMessage("Success", `Updated Document Successfully.`, MessageSeverity.success);
            } else {
                this.alertService.showMessage("Success", `Upload Documents Successfully.`, MessageSeverity.success);
            }
        }
    }
    fileUploadInt(event) {
        if (event.files.length === 0) {
            this.disableFileAttachmentSubmitInt = true;
        } else {
            this.disableFileAttachmentSubmitInt = false;
        }

        const filesSelectedTemp = [];
        this.selectedFileAttachmentInt = [];
        for (let file of event.files) {
            var flag = false;
            for (var i = 0; i < this.sourceViewforDocumentListInt.length; i++) {
                if (this.sourceViewforDocumentListInt[i].fileName == file.name) {
                    // && this.sourceViewforDocumentListInt[i].typeId==3
                    flag = true;
                    this.alertService.showMessage(
                        'Duplicate',
                        `Already Exists this file `,
                        MessageSeverity.warn
                    );
                    this.disableFileAttachmentSubmitInt = true;
                    if (this.fileUploadInputInt) {
                        this.fileUploadInputInt.clear()
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
                this.formDataInt.append(file.name, file);
            }
        }
        for (var i = 0; i < filesSelectedTemp.length; i++) {
            this.selectedFileAttachmentInt.push({
                docName: this.documentInformation.docName,
                docMemo: this.documentInformation.docMemo,
                docDescription: this.documentInformation.docDescription,
                createdBy: this.userName,
                updatedBy: this.userName,
                link: filesSelectedTemp[i].link,
                fileName: filesSelectedTemp[i].fileName,
                fileSize: filesSelectedTemp[i].fileSize,
                typeId: 1,
                isFileFromServer: false,
                attachmentDetailId: 0,
            })
        }
    }
    addDocumentInformationInt(type, documentInformation) {
        this.disableSaveForEdit = false;
        if (this.selectedFileAttachmentInt != []) {
            for (var i = 0; i < this.selectedFileAttachmentInt.length; i++) {
                this.sourceViewforDocumentListInt.push({

                    docName: documentInformation.docName,
                    docMemo: documentInformation.docMemo,
                    docDescription: documentInformation.docDescription,
                    link: this.selectedFileAttachmentInt[i].link,
                    fileName: this.selectedFileAttachmentInt[i].fileName,
                    isFileFromServer: false,
                    attachmentDetailId: 0,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    createdDate: Date.now(),
                    updatedDate: Date.now(),
                    typeId: 3,
                    fileSize: ((this.selectedFileAttachmentInt[i].fileSize) / (1024 * 1024)).toFixed(2),
                })
            }
        }

        if (documentInformation.attachmentDetailId > 0 || this.index > 0) {
            for (var i = 0; i <= this.sourceViewforDocumentListInt.length; i++) {
                if (this.sourceViewforDocumentListInt[i].attachmentDetailId > 0) {

                    if (this.sourceViewforDocumentListInt[i].attachmentDetailId == documentInformation.attachmentDetailId) {

                        this.sourceViewforDocumentListInt[i].docName = documentInformation.docName;
                        this.sourceViewforDocumentListInt[i].docMemo = documentInformation.docMemo;
                        this.sourceViewforDocumentListInt[i].docDescription = documentInformation.docDescription;
                        break;

                    }
                }
                else {
                    if (i == this.index) {
                        this.sourceViewforDocumentListInt[i].docName = documentInformation.docName;
                        this.sourceViewforDocumentListInt[i].docMemo = documentInformation.docMemo;
                        this.sourceViewforDocumentListInt[i].docDescription = documentInformation.docDescription;
                        break;
                    }
                }
            }
            this.index = 0;
            this.isEditButton = false;
            this.disableFileAttachmentSubmitInt == true;
            this.dismissDocumentPopupModelNew(type);
        }
        this.dismissDocumentPopupModelNew(type);
        this.sourceViewforDocumentListInt = [...this.sourceViewforDocumentListInt]
        // }
        this.index = 0;
        setTimeout(() => {
            this.isEditButton = false;
        }, 1000)
        this.disableFileAttachmentSubmitInt == false;

        if (this.fileUploadInputInt) {
            this.fileUploadInputInt.clear()
        }
        // this.onUploadDocumentListMain();
        // this.onUploadDocumentListWarranty();
        if (this.isEditMode) {
            this.onUploadDocumentListInt();
        } else {
            if (this.updateDocuments == true) {
                this.alertService.showMessage("Success", `Updated Document Successfully.`, MessageSeverity.success);
            } else {
                this.alertService.showMessage("Success", `Upload Documents Successfully.`, MessageSeverity.success);
            }
        }
    }

    deleteItemAndCloseModelInt() {
        let attachmentDetailId = this.selectedRowForDeleteInt.attachmentDetailId;
        if (attachmentDetailId > 0) {
            this.commonService.GetAttachmentDeleteById(attachmentDetailId, this.userName).subscribe(() => {
                this.toGetDocumentsListInt(this.assetInventoryId);
                this.alertService.showMessage(
                    'Success',
                    `Deleted Attachment  Successfully`,
                    MessageSeverity.success
                );
                // })
                this.disableSaveForEdit = false;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
        else {
            this.sourceViewforDocumentListInt.splice(this.rowIndex, 1);
            this.sourceViewforDocumentListInt = [...this.sourceViewforDocumentListInt]
        }
        this.modal.close();
    }

    toGetDocumentsListInt(id) {
        var moduleId = 56;

        this.commonService.GetDocumentsListNewAsset(id, moduleId, this.intangibleDeletedList).subscribe(res => {
            this.sourceViewforDocumentListInt = res || [];
            this.allDocumentListOriginal = res;

            if (this.sourceViewforDocumentListInt.length > 0) {
                this.sourceViewforDocumentListInt.forEach(item => {
                    item["isFileFromServer"] = true;
                })
            }

        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }

    dateFilterForTableInt(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            const data = [...this.sourceViewforDocumentListInt.filter(x => {

                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.sourceViewforDocumentListInt = data;
        } else {
            this.sourceViewforDocumentListInt = this.allDocumentListOriginal;
        }
    }

    editCustomerDocumentInt(rowdata, index = 0) {
        this.updateDocuments = true;
        this.disleUpdate = true;
        this.selectedFileAttachmentInt = [];
        this.isEditButton = true;
        this.index = index;
        this.documentInformation = rowdata;
        if (rowdata.attachmentDetailId > 0) {
            this.toGetDocumentViewInt(rowdata.attachmentDetailId);
        }
        else {
            this.sourceViewforDocumentInt = rowdata;
        }
    }

    toGetDocumentViewInt(id) {
        this.commonService.GetAttachment(id).subscribe(res => {
            this.sourceViewforDocumentInt = res || [];
        })
    }

    deleteAttachmentRowInt(rowdata, index, content) {
        this.selectedRowForDeleteInt = rowdata;
        this.rowIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
    }

    onUploadDocumentListMain() {
        // file upload
        const vdata = {
            referenceId: this.assetInventoryId,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
            moduleId: 54,
        }
        for (var key in vdata) {
            this.formDataMain.append(key, vdata[key]);
        }

        if (this.sourceViewforDocumentList.length > 0) {
            const docList: any = [];
            for (var i = 0; i < this.sourceViewforDocumentList.length; i++) {
                docList.push({
                    docName: this.sourceViewforDocumentList[i].docName,
                    docMemo: this.sourceViewforDocumentList[i].docMemo,
                    docDescription: this.sourceViewforDocumentList[i].docDescription,
                    link: this.sourceViewforDocumentList[i].link,
                    fileName: this.sourceViewforDocumentList[i].fileName,
                    isFileFromServer: false,
                    attachmentDetailId: this.sourceViewforDocumentList[i].attachmentDetailId,
                    createdBy: this.sourceViewforDocumentList[i].createdBy,
                    updatedBy: this.sourceViewforDocumentList[i].updatedBy,
                    createdDate: this.sourceViewforDocumentList[i].createdDate,
                    updatedDate: this.sourceViewforDocumentList[i].updatedDate,
                    fileSize: this.sourceViewforDocumentList[i].fileSize,
                    moduleId: this.sourceViewforDocumentList[i].moduleId,
                    typeId: this.sourceViewforDocumentList[i].typeId,
                })
            }
            this.formDataMain.append('attachmentdetais', JSON.stringify(docList));

            this.commonService.uploadDocumentsEndpoint(this.formDataMain).subscribe(() => { //assetDocumentsEndpoint
                if (this.isEditMode) {
                    if (this.updateDocuments == true) {
                        this.alertService.showMessage("Success", `Updated Document Successfully.`, MessageSeverity.success);
                    } else {
                        this.alertService.showMessage("Success", `Upload Documents Successfully.`, MessageSeverity.success);
                    }
                }
                this.formDataMain = new FormData();
                this.toGetDocumentsListNew(this.assetInventoryId);
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }

    onUploadDocumentListWarranty() {
        // file upload
        const vdata = {
            referenceId: this.assetInventoryId,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
            moduleId: 55,
            //docName: this.sourceViewforDocumentList[0].docName,
        }
        for (var key in vdata) {
            this.formDataWarr.append(key, vdata[key]);
        }

        if (this.sourceViewforDocumentListWarranty.length > 0) {
            const docList: any = [];
            for (var i = 0; i < this.sourceViewforDocumentListWarranty.length; i++) {
                docList.push({
                    docName: this.sourceViewforDocumentListWarranty[i].docName,
                    docMemo: this.sourceViewforDocumentListWarranty[i].docMemo,
                    docDescription: this.sourceViewforDocumentListWarranty[i].docDescription,
                    link: this.sourceViewforDocumentListWarranty[i].link,
                    fileName: this.sourceViewforDocumentListWarranty[i].fileName,
                    isFileFromServer: false,
                    attachmentDetailId: this.sourceViewforDocumentListWarranty[i].attachmentDetailId,
                    createdBy: this.sourceViewforDocumentListWarranty[i].createdBy,
                    updatedBy: this.sourceViewforDocumentListWarranty[i].updatedBy,
                    createdDate: this.sourceViewforDocumentListWarranty[i].createdDate,
                    updatedDate: this.sourceViewforDocumentListWarranty[i].updatedDate,
                    fileSize: this.sourceViewforDocumentListWarranty[i].fileSize,
                    moduleId: this.sourceViewforDocumentListWarranty[i].moduleId,
                    typeId: this.sourceViewforDocumentListWarranty[i].typeId,
                })
            }
            this.formDataWarr.append('attachmentdetais', JSON.stringify(docList));

            this.commonService.uploadDocumentsEndpoint(this.formDataWarr).subscribe(() => {
                if (this.isEditMode) {
                    // this.alertService.showMessage("Success", `Upload Documents Successfully.`, MessageSeverity.success);
                    if (this.updateDocuments == true) {
                        this.alertService.showMessage("Success", `Updated Document Successfully.`, MessageSeverity.success);
                    } else {
                        this.alertService.showMessage("Success", `Upload Documents Successfully.`, MessageSeverity.success);
                    }
                }
                this.formDataWarr = new FormData();
                this.toGetDocumentsListWarranty(this.assetInventoryId);
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }

    onUploadDocumentListInt() {
        // file upload
        const vdata = {
            referenceId: this.assetInventoryId,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
            moduleId: 56,
        }
        for (var key in vdata) {
            this.formDataInt.append(key, vdata[key]);
        }
        if (this.sourceViewforDocumentListInt.length > 0) {
            const docList: any = [];
            for (var i = 0; i < this.sourceViewforDocumentListInt.length; i++) {
                docList.push({
                    docName: this.sourceViewforDocumentListInt[i].docName,
                    docMemo: this.sourceViewforDocumentListInt[i].docMemo,
                    docDescription: this.sourceViewforDocumentListInt[i].docDescription,
                    link: this.sourceViewforDocumentListInt[i].link,
                    fileName: this.sourceViewforDocumentListInt[i].fileName,
                    isFileFromServer: false,
                    attachmentDetailId: this.sourceViewforDocumentListInt[i].attachmentDetailId,
                    createdBy: this.sourceViewforDocumentListInt[i].createdBy,
                    updatedBy: this.sourceViewforDocumentListInt[i].updatedBy,
                    createdDate: this.sourceViewforDocumentListInt[i].createdDate,
                    updatedDate: this.sourceViewforDocumentListInt[i].updatedDate,
                    fileSize: this.sourceViewforDocumentListInt[i].fileSize,
                    moduleId: this.sourceViewforDocumentListInt[i].moduleId,
                    typeId: this.sourceViewforDocumentListInt[i].typeId,
                })
            }
            this.formDataInt.append('attachmentdetais', JSON.stringify(docList));

            this.commonService.uploadDocumentsEndpoint(this.formDataInt).subscribe(() => {
                if (this.isEditMode) {
                    if (this.updateDocuments == true) {
                        this.alertService.showMessage("Success", `Updated Document Successfully.`, MessageSeverity.success);
                    } else {
                        this.alertService.showMessage("Success", `Upload Documents Successfully.`, MessageSeverity.success);
                    }
                }
                this.formDataInt = new FormData();
                this.toGetDocumentsListInt(this.assetInventoryId);
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }
    disleUpdate: any = true;
    disableEditor: any = true;
    getmemo($event) {
        this.disableSaveForEdit = false;
    }
    getmemoInfo(eve) {
        this.disleUpdate = false;
    }
    editorgetmemo(ev) {
        this.disableEditor = false;
    }
    postData: any = {};
    onSaveAssetInventory() {
        this.postData = {};
        if (this.currentAsset.isTangible == true) {

            if (this.currentAsset.calibrationRequired == true && (this.currentAsset.calibrationFrequencyMonths == 0 && this.currentAsset.calibrationFrequencyDays == 0)) {
                this.alertService.showMessage("Warning", 'Months & Days Cant be Zero', MessageSeverity.warn);
                return;
            }
            if (this.currentAsset.certificationRequired == true && (this.currentAsset.certificationFrequencyMonths == 0 && this.currentAsset.certificationFrequencyDays == 0)) {
                this.alertService.showMessage("Warning", 'Months & Days Cant be Zero', MessageSeverity.warn);
                return;
            }
            if (this.currentAsset.inspectionRequired == true && (this.currentAsset.inspectionFrequencyMonths == 0 && this.currentAsset.inspectionFrequencyDays == 0)) {
                this.alertService.showMessage("Warning", 'Months & Days Cant be Zero', MessageSeverity.warn);
                return;
            }
            if (this.currentAsset.verificationRequired == true && (this.currentAsset.verificationFrequencyMonths == 0 && this.currentAsset.verificationFrequencyDays == 0)) {
                this.alertService.showMessage("Warning", 'Months & Days Cant be Zero', MessageSeverity.warn);
                return;
            }
            if (this.currentAsset.assetIsMaintenanceReqd == true && (this.currentAsset.maintenanceFrequencyMonths == 0 && this.currentAsset.maintenanceFrequencyDays == 0)) {
                this.alertService.showMessage("Warning", 'Months & Days Cant be Zero', MessageSeverity.warn);
                return;
            }

            this.postData = {
                ...this.currentAsset,
                // isSerialized:true,
                // serialNo:"444",

                assetInventoryId: this.assetInventoryId,
                assetRecordId: getValueFromObjectByKey('value', this.currentAsset.assetRecordId),
                entryDate: this.currentAsset.entryDate ? this.datePipe.transform(this.currentAsset.entryDate, "MM/dd/yyyy") : null,
                manufacturedDate: this.currentAsset.manufacturedDate ? this.datePipe.transform(this.currentAsset.manufacturedDate, "MM/dd/yyyy") : null,
                expirationDate: this.currentAsset.expirationDate ? this.datePipe.transform(this.currentAsset.expirationDate, "MM/dd/yyyy") : null,
                unitCost: this.currentAsset.unitCost ? parseFloat(this.currentAsset.unitCost.toString().replace(/\,/g, '')) : '0.00',
                installationCost: this.currentAsset.installationCost ? parseFloat(this.currentAsset.installationCost.toString().replace(/\,/g, '')) : '0.00',
                freight: this.currentAsset.freight ? parseFloat(this.currentAsset.freight.toString().replace(/\,/g, '')) : '0.00',
                insurance: this.currentAsset.insurance ? parseFloat(this.currentAsset.insurance.toString().replace(/\,/g, '')) : '0.00',
                taxes: this.currentAsset.taxes ? parseFloat(this.currentAsset.taxes.toString().replace(/\,/g, '')) : '0.00',
                totalCost: this.currentAsset.totalCost ? parseFloat(this.currentAsset.totalCost.toString().replace(/\,/g, '')) : '0.00',

                calibrationDefaultCost: this.currentAsset.calibrationDefaultCost ? this.currentAsset.calibrationDefaultCost.toString().replace(/\,/g, '') : '0.00',
                certificationDefaultCost: this.currentAsset.certificationDefaultCost ? this.currentAsset.certificationDefaultCost.toString().replace(/\,/g, '') : '0.00',
                inspectionDefaultCost: this.currentAsset.inspectionDefaultCost ? this.currentAsset.inspectionDefaultCost.toString().replace(/\,/g, '') : '0.00',
                verificationDefaultCost: this.currentAsset.verificationDefaultCost ? this.currentAsset.verificationDefaultCost.toString().replace(/\,/g, '') : '0.00',
                warrantyCompanyId: this.currentAsset.warrantyCompanyId ? getValueFromObjectByKey('value', this.currentAsset.warrantyCompanyId) : null,
                warrantyStartDate: this.currentAsset.warrantyStartDate ? this.datePipe.transform(this.currentAsset.warrantyStartDate, "MM/dd/yyyy") : null,
                warrantyEndDate: this.currentAsset.warrantyEndDate ? this.datePipe.transform(this.currentAsset.warrantyEndDate, "MM/dd/yyyy") : null,
                calibrationDefaultVendorId: this.currentAsset.calibrationDefaultVendorId ? getValueFromObjectByKey('value', this.currentAsset.calibrationDefaultVendorId) : null,
                certificationDefaultVendorId: this.currentAsset.certificationDefaultVendorId ? getValueFromObjectByKey('value', this.currentAsset.certificationDefaultVendorId) : null,
                inspectionDefaultVendorId: this.currentAsset.inspectionDefaultVendorId ? getValueFromObjectByKey('value', this.currentAsset.inspectionDefaultVendorId) : null,
                verificationDefaultVendorId: this.currentAsset.verificationDefaultVendorId ? getValueFromObjectByKey('value', this.currentAsset.verificationDefaultVendorId) : null,
                maintenanceDefaultVendorId: this.currentAsset.maintenanceDefaultVendorId ? getValueFromObjectByKey('value', this.currentAsset.maintenanceDefaultVendorId) : null,
                warrantyDefaultVendorId: this.currentAsset.warrantyDefaultVendorId ? getValueFromObjectByKey('value', this.currentAsset.warrantyDefaultVendorId) : null,
            }
        } else {
            this.postData = {
                ...this.currentAsset,
                assetInventoryId: this.assetInventoryId,
                assetRecordId: getValueFromObjectByKey('value', this.currentAsset.assetRecordId),
                entryDate: this.currentAsset.entryDate ? this.datePipe.transform(this.currentAsset.entryDate, "MM/dd/yyyy") : null,
            }
        }

        if (!this.isEditMode) {
            this.assetService.addAssetInventory(this.postData).subscribe(data => {
                if (data) {
                    this.uploadDocs.next(true);
                    this.currentAsset.updatedBy = this.userName;
                    this.assetInventoryId = data.assetInventoryId;
                    localStorage.setItem('commonId', this.assetInventoryId);
                    // this.onUploadDocumentListMain();
                    // this.onUploadDocumentListWarranty();
                    // this.onUploadDocumentListInt();
                    this.alertService.showMessage("Success", `Asset Inventory Created Successfully.`, MessageSeverity.success);
                    this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-inventory-listing`);

                }
                else {
                    this.alertService.showMessage("Failed", `Asset Inventory not created successfully.`, MessageSeverity.error);
                }
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
        else {
            this.assetService.updateAssetInventory(this.postData).subscribe(data => {
                if (data) {
                    this.uploadDocs.next(true);
                    this.disableSaveForEdit = true;
                    this.currentAsset.updatedBy = this.userName;
                    this.assetInventoryId = data.assetInventoryId;
                    this.alertService.showMessage("Success", `Asset Inventory Updated Successfully.`, MessageSeverity.success);
                }
                else {
                    this.alertService.showMessage("Failed", `Asset Inventory not Updated Successfully.`, MessageSeverity.error);
                }
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }

    onFilterAssetStatus(eve) {
        this.getAssetStatusList(eve);
    }
    assetStatusList: any = [];
    assetInventoryStatusList: any = [];
    basicValue: any;
    getAssetStatusList(value) {
        this.setEditArray = [];
        if (this.isEditMode == true && this.currentAsset.assetStatusId) {

            this.setEditArray.push(this.currentAsset.assetStatusId);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value;
        this.commonService.autoSuggestionSmartDropDownList('AssetStatus', 'AssetStatusId', 'Name', strText, true, 20, this.setEditArray.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.assetStatusList = res.map(x => {
                return {
                    ...x,
                    assetStatusId: x.value,
                    name: x.label
                }
            });
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });

    }

    getAssetInventoryStatusList() {
        if (this.isEditMode == true) {
            this.setEditArray = [];
            this.setEditArray.push(this.currentAsset.inventoryStatusId);
            const strText = '';
            this.commonService.autoSuggestionSmartDropDownList('AssetInventoryStatus', 'AssetInventoryStatusId', 'Status', strText, true, 0, this.setEditArray.join(), this.currentUserMasterCompanyId).subscribe(res => {
                this.assetInventoryStatusList = res;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        } else {
            this.commonService.smartDropDownList('AssetInventoryStatus', 'AssetInventoryStatusId', 'Status', 0).subscribe(res => {
                this.assetInventoryStatusList = res;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
        if (this.currentAsset.inventoryStatusId) {
            this.currentAsset.inventoryStatusId = this.currentAsset.inventoryStatusId
        } else {

            this.assetInventoryStatusList.forEach(element => {
                if (element.label == 'Available') {
                    this.currentAsset.inventoryStatusId = element.value;
                    this.basicValue = element.value;
                }
            });


        }



    }


    errorMessageHandler(log) {
        this.isSpinnerVisible = false;

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

    restorerecord: any = {};
    documentType: any;
    restore(content, rowData, type) {
        this.restorerecord = rowData;
        this.documentType = type;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { })
    }
    restoreRecord() {
        if (this.restorerecord && this.restorerecord.attachmentDetailId != undefined) {
            this.commonService.updatedeletedrecords('AttachmentDetails', 'AttachmentDetailId', this.restorerecord.attachmentDetailId).subscribe(res => {
                this.getDeleteListByStatus(true, this.documentType)
                this.disableSaveForEdit = false;
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
                this.modal.close();
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }
    dismissModel() {
        this.modal.close();
    }
    isDeletedDocumentlist: boolean = false;
    warrentyDeletedList: boolean = false;
    intangibleDeletedList: boolean = false;
    maitananceeletedList: boolean = false;
    getDeleteListByStatus(value, type) {
        this.isSpinnerVisible = true;
        if (type == 1) {
            this.maitananceeletedList = value;
            this.toGetDocumentsListNew(this.assetInventoryId);
        } else if (type == 2) {
            this.warrentyDeletedList = value;
            this.toGetDocumentsListWarranty(this.assetInventoryId);
        } else {
            this.intangibleDeletedList = value;
            this.toGetDocumentsListInt(this.assetInventoryId);
        }
        setTimeout(() => {
            this.isSpinnerVisible = false;
        }, 1000);
    }
    addNew() {
        this.route.navigateByUrl(`/assetmodule/assetpages/app-create-asset-inventory`);
        this.assetService.listCollection = {};
        this.assetService.isEditMode = false;
    }
    changeOfStatus() {
        this.disableSaveForEdit = false;
    }
    // modalIsMaintannce: NgbModalRef;
    // modalWarrenty: NgbModalRef;

    viewIsCertifiedModal(content) {
        this.modalIsMaintannce = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }
    closeIsCertifiedModal() {
        this.modalIsMaintannce.close()
    }



    viewVendorAuditModal(content) {
        this.modalWarrenty = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }


    closeVendorAuditModal() {
        this.modalWarrenty.close()
    }
}