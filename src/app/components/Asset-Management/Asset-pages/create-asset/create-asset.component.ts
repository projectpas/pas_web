import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AssetAttributeType } from '../../../../models/asset-attribute-type.model';
import { AssetAttributeTypeService } from '../../../../services/asset-attribute-type/asset-attribute-type.service';
import { AssetLocation } from '../../../../models/asset-location.model';
import { AssetLocationService } from '../../../../services/asset-location/asset-location.service';
import { AssetAcquisitionType } from '../../../../models/asset-acquisition-type.model';
import { AssetAcquisitionTypeService } from '../../../../services/asset-acquisition-type/asset-acquisition-type.service';
import { AssetService } from '../../../../services/asset/Assetservice';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { UnitOfMeasureService } from '../../../../services/unitofmeasure.service';
import { CurrencyService } from '../../../../services/currency.service';
import { AuthService } from '../../../../services/auth.service';
import { AssetIntangibleTypeService } from '../../../../services/asset-intangible-type/asset-intangible-type.service';
import { AssetIntangibleAttributeTypeService } from '../../../../services/asset-intangible-attribute-type/asset-intangible-attribute-type.service';
import { GlAccount } from '../../../../models/GlAccount.model';
import { GlAccountService } from '../../../../services/glAccount/glAccount.service';
import { AssetTypeService } from '../../../../services/asset-type/asset-type.service';
import { DepriciationMethodService } from '../../../../services/depriciation-method/depriciation.service';
import { DepriciationMethod } from '../../../../models/depriciation-method.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetIntangibleAttributeType } from '../../../../models/asset-intangible-attribute-type.model';
import { CommonService } from '../../../../services/common.service';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { ManufacturerService } from '../../../../services/manufacturer.service';
// declare var $ : any;
declare var $ : any;
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Location } from '@angular/common';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';
@Component({
    selector: 'app-create-asset',
    templateUrl: './create-asset.component.html',
    styleUrls: ['./create-asset.component.scss'],
    providers: [DatePipe]
})
export class CreateAssetComponent implements OnInit {
    @ViewChild("tabRedirectConfirmationModal",{static:false}) public tabRedirectConfirmationModal: ElementRef;
    userData: any = {};
    activeIndex: number;
    currentAsset: any = {};
    bulist: any[];
    allManagemtninfo: any[] = [];
    departmentList: any[] = [];
    divisionlist: any[] = [];
    selAssetLocationId: any;
    assetLocationList: AssetLocation[] = [];
    allreasn: any[] = [];
    acqallreasn: any[] = [];
    currentRow: AssetAttributeType;
    currentIntangibleRow: AssetIntangibleAttributeType;
    currentDate = new Date();
    active0: boolean;
    active1: boolean;
    active2: boolean;
    active3: boolean;
    BuData: boolean;
    DepData: boolean;
    divData: boolean;
    loadingIndicator: boolean;
    modal: NgbModalRef;
    maincompanylist: any[] = [];
    allManufacturerInfo: any[] = [];
    allUnitOfMeasureinfo: any[] = [];
    allCurrencyInfo: any[] = [];
    allAssetAttrInfo: any[] = [];
    allAssetIntanAttrInfo: any[] = [];
    allAssetLocations: any[] = [];
    allAssetAcquisitions: any[] = [];
    allAssetTypeInfo: any[] = [];
    allIntangibleInfo: any[] = [];
    allAssetLocationInfo: any[] = [];
    display: boolean = false;
    modelValue: boolean;
    isDepreciable: boolean = true;
    AssetAcquisitionTypeList: AssetAcquisitionType[] = [];
    isSaving: boolean;
    listCollection: any = {};
    recordExists: boolean = false;
    recordlocExists: boolean = false;
    recordacqExists: boolean = false;
    intangible: boolean;
    showLable: boolean;
    isDeleteMode: boolean;
    selectedColumns: any;
    cols: any;
    allAlternateAssetInfo: any[] = [];
    breadcrumbs: MenuItem[];
    allAssetParentInfo: any[] = [];
    disablelocSave: boolean;
    disableAcquisitionSave: boolean;
    DisabledMode: boolean;
    localCollection: any[];
    acqlocalCollection: any[];
    localCollectionExc: any[];
    managementStructureData: any = [];
    updateMode: boolean = false;
    allGlInfo: GlAccount[];
    currentSelectedIntangibleAssetType: any = {};
    selAssetAcquisitionTypeId: any;
    currentSelectedLocation: any = {};
    currentSelectedAssetType: any = {};
    currentSelectedAssetAttributeType: any = {};
    depriciationMethodList: DepriciationMethod[] = [];
    allAssets: any[] = [];
    auditHistory: any[];
    home: any;
    amortizationFrequencyList: any[] = [];
    depreciationFrequencyList: any[] = [];
    assetAcquisitionTypeList: any[] = [];
    GLAccountList: any[] = [];
    AssetId: any;
    managementValidCheck: boolean;
    static assetService;
    codeName: string = "";
    code: string = "";
    name: any = "";
    memo: any = "";
    selectedreason: any;
    assetLocationId: number = 0;
    public sourceAction: AssetLocation;
    private isDelete: boolean = false;
    isEditMode: boolean = false;
    disableSaveForEdit: boolean = false;
    public acqsourceAction: AssetAcquisitionType;
    newManufacturer =
        {
            name: "",
            masterCompanyId: this.authService.currentUser.masterCompanyId,
            isActive: true,
            isDelete: false,
            comments: "",
        }
    addnewManufacturer = { ...this.newManufacturer };
    disableSaveForShortName: boolean = false;
    disableSaveForUOM: boolean = false;
    ManufactList: any;
    ManufactureData: any;
    selectedRecordForEdit: any;
    legalEntityList: any;
    divisionList: any;
    nextOrPreviousTab: any;
    allowNextTab: boolean = false;
    disableSave: boolean;
    disableSaveDataAdd: any = false;
    setDateValidetoExpire: any;
    isSpinnerEnable: any = false;
    errorDisplay: any;

    isView:boolean=true;
    isCapeAdd:boolean=true;
    isDownload:boolean=true;
    isCapeDelete:boolean=true;
    isCapeUpdate:boolean=true;
    isCalibrationDownload:boolean=true;
    isMaintenanceDownload:boolean=true;
    isGeneralInfoAdd:boolean=true;
    isGeneralInfoUpdate:boolean=true;
    isNextVisible:Boolean=true;
    isCapeNextVisible: Boolean=true;
    isCalibrationNext: Boolean=true;
    isCalibrationPrev: Boolean=true;
    isMaintenancePrev: Boolean=true;

    constructor(private router: ActivatedRoute, private glAccountService: GlAccountService, private modalService: NgbModal, private activeModal: NgbActiveModal, private intangibleTypeService: AssetIntangibleTypeService, private route: Router, public assetService: AssetService, private legalEntityServices: LegalEntityService, private alertService: AlertService, public itemMasterservice: ItemMasterService,
        public unitService: UnitOfMeasureService, private datePipe: DatePipe,
        private commonService: CommonService, private location: Location,
        public currencyService: CurrencyService, public assetTypeService: AssetTypeService, private depriciationMethodService: DepriciationMethodService, private authService: AuthService, public assetattrService1: AssetAttributeTypeService, public assetIntangibleService: AssetIntangibleAttributeTypeService, private commonservice: CommonService, private assetLocationService: AssetLocationService, private AssetAcquisitionTypeService: AssetAcquisitionTypeService, public manufacturerService: ManufacturerService) {
        this.sourceAction = new AssetLocation();
        if (this.currentAsset.expirationDate) {
            this.currentAsset.expirationDate = new Date(this.currentAsset.expirationDate).toLocaleDateString();
        }
        if (this.currentAsset.manufacturedDate) {
            this.currentAsset.manufacturedDate = new Date(this.currentAsset.manufacturedDate).toLocaleDateString();
        }
        if (this.currentAsset.entryDate) {
            this.currentAsset.entryDate = new Date(this.currentAsset.entryDate).toLocaleDateString();
        }
        else {
            this.currentAsset.entryDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toLocaleDateString();
        }

        this.isView=this.authService.checkPermission([ModuleConstants.Asset_List+'.'+PermissionConstants.View]);
        this.isCapeAdd=this.authService.checkPermission([ModuleConstants.Asset_Capes+'.'+PermissionConstants.Add]);
        this.isDownload=this.authService.checkPermission([ModuleConstants.Asset_Capes+'.'+PermissionConstants.Download]);
        this.isCapeUpdate=this.authService.checkPermission([ModuleConstants.Asset_Capes+'.'+PermissionConstants.Update]);
        this.isCapeDelete=this.authService.checkPermission([ModuleConstants.Asset_Capes+'.'+PermissionConstants.Delete]);
        this.isCalibrationDownload=this.authService.checkPermission([ModuleConstants.Asset_Calibration+'.'+PermissionConstants.Download]);
        this.isMaintenanceDownload=this.authService.checkPermission([ModuleConstants.Asset_MaintenanceAndWarranty+'.'+PermissionConstants.Download]);
        this.isGeneralInfoAdd=this.authService.checkPermission([ModuleConstants.Asset_GeneralInformation+'.'+PermissionConstants.Add]);
        this.isGeneralInfoUpdate=this.authService.checkPermission([ModuleConstants.Asset_GeneralInformation+'.'+PermissionConstants.Update]);
        this.isNextVisible=this.authService.ShowTab('Create Asset','Capes');
        this.isCapeNextVisible=this.authService.ShowTab('Create Asset','Calibration');
        this.isCalibrationNext=this.authService.ShowTab('Create Asset','Maintenance & Warranty');
        this.isCalibrationPrev=this.authService.ShowTab('Create Asset','Capes');
        this.isMaintenancePrev=this.authService.ShowTab('Create Asset','Calibration');
    }

    isShowTab(value){
		var isShow=this.authService.ShowTab('Create Asset',value);
		return isShow;
	}
    ngOnInit() {
        if (this.assetService.isEditMode == false) {

            this.breadcrumbs = [
                { label: 'Asset' },
                { label: 'Create Asset' },
            ];
        } else {

            this.breadcrumbs = [
                { label: 'Asset' },
                { label: 'Edit Asset' },
            ];
        } 
        this.activeIndex = 0;
        let id = this.assetService.listCollection ? this.assetService.listCollection.assetRecordId : null;
        this.AssetId = this.router.snapshot.params['id'] ? this.router.snapshot.params['id'] : id;
        this.getAssetListForAssetId('')
        this.getAssetsList(1);
        if (this.AssetId) {
            this.disableSaveForEdit = true;
            this.GetAssetData(this.AssetId);
            this.allowNextTab = true;
            this.DisabledMode = true;
            this.isEditMode = true;
            this.assetService.currentUrl = '/assetmodule/assetpages/app-edit-asset';
        } else {
            this.AssetAttData('');
            this.manufacturerdata('');
            this.unitOfMeasureList('');
            this.assetLocationData('');
            this.AcquisitionloadData('');
            this.CurrencyData('');
            this.disableSaveDataAdd = true;
            this.DisabledMode = false;
            this.isEditMode = false;
            this.assetService.listCollection = null;
            this.assetService.currentUrl = '/assetmodule/assetpages/app-create-asset';
            this.currentAsset.unitCost = "0.00";
            this.currentAsset.controlNumber = 'Creating';
            this.getManagementStructureDetails(this.authService.currentUser
                ? this.authService.currentUser.managementStructureId
                : null, this.authService.currentUser ? this.authService.currentUser.employeeId : 0);
        }
        if (this.currentAsset.isIntangible == true) {
            this.currentAsset.isTangible = false;
            this.currentAsset.isdepreciable = false;
            this.currentAsset.isAmortizable = true;
            this.AssetIntanAttData('');
        }
        else {
            this.currentAsset.isTangible = true;
            this.currentAsset.isdepreciable = true;
            this.currentAsset.isAmortizable = false;
        }
        if (this.assetService.listCollection != null && this.isEditMode == true) {
            this.showLable = true;
            this.currentAsset = this.assetService.listCollection;
            this.updateMode = true;
            this.disableSaveForEdit = true;
            if (this.currentAsset.isIntangible == true) {
                this.currentAsset.isTangible = false;
                this.currentAsset.isIntangible = true;
                this.active0 = true;
                this.active1 = false;
                this.active2 = false;
                this.active3 = false;
            }
            else {
                this.currentAsset.isTangible = true;
                this.currentAsset.isIntangible = false;
                this.active0 = true;
                this.active1 = true;
                this.active2 = true;
                this.active3 = true;
            }
        }
        else {
            this.active0 = true;
            this.active1 = true;
            this.active2 = true;
            this.active3 = true;
            this.onDepreciable('onload');
        }
        this.assetService.bredcrumbObj.next(this.assetService.currentUrl);
        this.assetService.ShowPtab = true;
        this.assetService.alertObj.next(this.assetService.ShowPtab); //steps
  
    }
    onAddTextAreaInfo(material) {
        this.disableEditor = true;
        this.textAreaInfo = material.memo;
    }
    textAreaInfo: any;
    disableEditor: any = true;
    editorgetmemo(ev) {
        this.disableEditor = false;
    }
    onSaveTextAreaInfo(memo) {
        this.disableSaveForEdit = false
        if (memo) {
            this.textAreaInfo = memo;
            this.currentAsset.memo = memo;
        }
        $("#textarea-popup").modal("hide");
    }
    onCloseTextAreaInfo() {
        $("#textarea-popup").modal("hide"); 
    }
    async GetAssetData(assetid) {
        if (assetid == undefined) assetid = this.assetService.listCollection.assetRecordId;
        this.isSpinnerEnable = true;
        if (assetid != undefined) {
            this.assetService.getByAssetId(assetid).subscribe(
                results => {

                    this.onassetdataSuccessful({ ...results[0], ...results[1] })
                }, err => {
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                }
            );
        }
    }
    async onassetdataSuccessful(getAssetData) {
        getAssetData.alternateAssetRecordId = { assetRecordId: getAssetData.alternateAssetRecordId, assetId: getAssetData.alternateAssetName };
        getAssetData.assetParentRecordId = { assetRecordId: getAssetData.assetParentRecordId, assetId: getAssetData.assetParentName };
        getAssetData.assetId = { label: getAssetData.assetId, value: getAssetData.assetRecordId };
        getAssetData.entryDate=getAssetData.entryDate !=null ? new Date(getAssetData.entryDate):null;
        getAssetData.manufacturedDate=getAssetData.manufacturedDate !=null  ? new Date(getAssetData.manufacturedDate):null;
        getAssetData.expirationDate=getAssetData.expirationDate !=null ? new Date(getAssetData.expirationDate):null;
        this.getManagementStructureDetails(getAssetData
            ? getAssetData.managementStructureId
            : null, this.authService.currentUser ? this.authService.currentUser.employeeId : 0);
        this.allowNextTab = true;

        setTimeout(() => {
            this.isSpinnerEnable = false;
        }, 1200);
        this.isEditMode = true;
        this.activeIndex = 0;
        this.assetService.indexObj.next(this.activeIndex);
        this.assetService.listCollection = getAssetData;
        this.showLable = true;
        this.currentAsset = this.assetService.listCollection;
        this.currentAsset.unitCost = this.currentAsset.unitCost ? formatNumberAsGlobalSettingsModule(this.currentAsset.unitCost, 2) : '0.00';
        this.updateMode = true;
        if (this.currentAsset.isIntangible == true) {
            this.active0 = true;
            this.active1 = false;
            this.active2 = false;
            this.active3 = false;
            this.currentAsset.isTangible = false;
            this.currentAsset.isIntangible = true;
            this.getAssetsList(2);
            this.AssetIntanAttData('');
            this.showItemEdit(this.currentAsset.assetIntangibleTypeId);
        }
        else {
            this.getAssetsList(1);
            this.active0 = true;
            this.active1 = true;
            this.active2 = true;
            this.active3 = true;
            this.currentAsset.isTangible = true;
            this.currentAsset.isIntangible = false;
            this.showItemEdit(this.currentAsset.tangibleClassId);
            this.AssetAttData('');
            this.manufacturerdata('');
            this.unitOfMeasureList('');
            this.assetLocationData('');
            this.AcquisitionloadData('');
            this.CurrencyData('');
        }
 
        this.assetService.bredcrumbObj.next(this.assetService.currentUrl);
        this.assetService.ShowPtab = true;
        this.assetService.alertObj.next(this.assetService.ShowPtab); //steps
        this.activeIndex = 0;
    }

    originalAssetTypes: any = [];
    onFilterTangible(value) {
        this.AssetAttData(value);
    }
    AssetAttData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.currentAsset.tangibleClassId ? this.currentAsset.tangibleClassId : 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('AssetAttributeType', 'TangibleClassId', 'AssetAttributeTypeName', strText, true, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.allAssetTypeInfo = res.map(x => {
                    return {
                        ...x,
                        tangibleClassId: x.value,
                        name: x.label
                    }
                }, err => {
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                });
                this.originalAssetTypes = this.allAssetTypeInfo;
            }
        })
        this.selectedColumns = this.cols;
    }
    onFilterIntangible(value) {
        this.AssetIntanAttData(value);
    }
    AssetIntanAttData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.currentAsset.tangibleClassId ? this.currentAsset.tangibleClassId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.getAutoCompleteDropDownsByTwoTables('AssetIntangibleAttributeType', 'AssetIntangibleType', 'AssetIntangibleTypeId', 'AssetIntangibleName', strText, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.allIntangibleInfo = res.map(x => {
                    return {
                        ...x,
                        assetIntangibleTypeId: x.value,
                        assetIntangibleName: x.label
                    }
                })
            }

        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    allAssetList: any = [];
    getAssetListForAssetId(value) {
        this.setEditArray = [];
        if (this.AssetId != undefined && this.AssetId != null) {

            this.setEditArray.push(this.AssetId ? this.AssetId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('Asset', 'AssetRecordId', 'AssetId', strText, true, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.allAssetList = res;
     if(value){
        this.allAssetList.forEach(element => {
             if(element.label ==value){
                this.showExistMsg = true; 
             }else{
                this.showExistMsg = false;
             }
         });
     }
     
     
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }

    assetIdHandler(event) {
        if (event) {
            if (event.target.value != "") {
                this.showExistMsg = false;
                this.disableSaveForEdit = false;
            }
        }
    }
    filterAssetId(event) {
        this.localCollection = this.allAssetList;
        if (event.query !== undefined && event.query !== null) {
            this.getAssetListForAssetId(event.query);
            const assetFilter = [...this.allAssetList.filter(x => {
                return x.label.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.localCollection = assetFilter;
        } {
            this.showExistMsg = false;
        }
    }
    tableColumnName: any;
    tableColumnFilter: any;
    getAssetsList(type) {
        if (type == 1) {
            this.tableColumnName = 'IsTangible';
        } else {
            this.tableColumnName = 'IsIntangible';
        }
        // this.filterAssetIdInEdit('',null);
        this.selectedColumns = this.cols;
    }
    localCollectionExcAlter:any=[];
    localCollectionExcParent:any=[];
    filterAssetIdInEdit(value,type) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            let id1 = this.currentAsset.alternateAssetRecordId ? this.currentAsset.alternateAssetRecordId : 0;
            let id2 = this.currentAsset.assetParentRecordId ? this.currentAsset.assetParentRecordId : 0;
            this.setEditArray.push(id1, id2);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonservice.getAssetListBasedOnType('Asset', 'AssetRecordId', 'AssetId', strText, this.tableColumnName, 1, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            const newResp = res.map(x => {
                return {
                    ...x,
                    assetRecordId: x.value,
                    assetId: x.label
                }
            });
            this.allAlternateAssetInfo = newResp;
            this.allAssetParentInfo = newResp;
            this.localCollectionExcAlter = this.allAlternateAssetInfo;
            this.localCollectionExcParent = this.allAssetParentInfo;
            if (this.allAssetParentInfo != null && this.allAssetParentInfo != undefined) {
                for (let i = 0; i < this.allAssetParentInfo.length; i++) {
                    if (this.allAssetParentInfo[i].assetId.toLowerCase() == this.AssetId) {
                        this.allAssetParentInfo.splice(i, 1);
                    }
                }
            }
            // this.localCollectionExc=newResp;

            if ( this.currentAsset.alternateAssetRecordId !=null && this.currentAsset.alternateAssetRecordId !=undefined && this.currentAsset.alternateAssetRecordId !="") {

                
                    for (let i = 0; i < this.allAssetParentInfo.length; i++) {
                        if (this.allAssetParentInfo[i].assetRecordId == this.currentAsset.alternateAssetRecordId.assetRecordId) {
                            this.allAssetParentInfo.splice(i, 1);
                        }
                    }
                    this.localCollectionExcParent = this.allAssetParentInfo;
                }

            if ((this.currentAsset.assetParentRecordId !=null && this.currentAsset.assetParentRecordId !=undefined && this.currentAsset.assetParentRecordId !="")) {
 
                for (let i = 0; i < this.allAlternateAssetInfo.length; i++) {
                    if (this.allAlternateAssetInfo[i].assetRecordId == this.currentAsset.assetParentRecordId.assetRecordId) {
                        this.allAlternateAssetInfo.splice(i, 1);
                    }
                }
                this.localCollectionExcAlter = this.allAlternateAssetInfo;
            }

        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    filterExcAltAssetId(event) {

        this.localCollectionExc = this.allAlternateAssetInfo;

        if (event.query !== undefined && event.query !== null) {
            this.filterAssetIdInEdit(event.query,1);
        }else{
                this.filterAssetIdInEdit('',1); 
            }        
    }

    filterExcParentAssetId(event) {
        this.localCollectionExc = this.allAssetParentInfo;
        if (event.query !== undefined && event.query !== null) {
            this.filterAssetIdInEdit(event.query,2);
        }else{
                this.filterAssetIdInEdit('',2); 
            }
  
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    showExistMsg: any = false;
    onAssetIdselection(event) {
        this.showExistMsg = true;
        this.disableSaveForEdit = false;
    }
    showItemEdit(rowData): void {
        if (this.currentAsset.isIntangible == false || this.currentAsset.isIntangible == undefined) {
            this.currentSelectedAssetAttributeType = {};
            this.currentRow = rowData as AssetAttributeType;
            if (rowData != undefined) {
                this.assetattrService1.getByAssetTypeId(rowData).subscribe(
                    audits => {
                        this.currentSelectedAssetAttributeType = audits[0];
                        this.currentSelectedAssetAttributeType.residualPercentage = this.currentSelectedAssetAttributeType.residualPercentage ? formatNumberAsGlobalSettingsModule(this.currentSelectedAssetAttributeType.residualPercentage, 2) : '0.00';
                      
                    }, err => {
                        const errorLog = err;
                        this.errorMessageHandler(errorLog);
                    }
                );
            }
        }
        else {
            this.currentSelectedIntangibleAssetType = {};
            this.currentIntangibleRow = rowData as AssetIntangibleAttributeType;
            if (rowData != undefined) {
                this.assetIntangibleService.getById(rowData).subscribe(
                    audits => {
                        this.currentSelectedIntangibleAssetType = audits[0][0];
                    },err => {			
                        const errorLog = err;
                        this.errorMessageHandler(errorLog);}
                );
            }
        }
    }
    open(content) {
        this.recordlocExists = false;
        this.disablelocSave = true;
        this.isSaving = true;
        this.sourceAction = new AssetLocation();
        this.sourceAction.isActive = true;
        this.code = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });

    }
    openacquisition(content) {
        this.recordacqExists = false;
        this.disableAcquisitionSave = true;
        this.isSaving = true;
        this.acqsourceAction = new AssetAcquisitionType();
        this.acqsourceAction.isActive = true;
        this.codeName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });

    }
    acqpartnmId(event) {
        for (let i = 0; i < this.acqallreasn.length; i++) {
            if (event == this.acqallreasn[i][0].codeName) {
                this.selectedreason = event;
                this.recordacqExists = true;
                this.disableAcquisitionSave = true;
                this.selAssetAcquisitionTypeId = this.acqallreasn[i][0].AssetAcquisitionTypeId;
                this.selectedreason = event;
                break;
            }
            else {
                this.recordacqExists = false;
                this.disableAcquisitionSave = false;
            }
        }
    }
    eventHandler(event) {
        let value = event.target.value.toLowerCase();
        if (this.selectedreason) {
            if (value == this.selectedreason.toLowerCase()) {
                this.disableSave = true;
                this.recordExists = true;
            }
            else {
                this.disableSave = false;
                this.recordExists = false;
            }
        }
    }
    dismissModel() {
        this.modal.close();
    }

    onFilterAcqution(value) {
        this.AcquisitionloadData(value);
    }
    setEditArray: any = [];
    private AcquisitionloadData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.currentAsset.assetAcquisitionTypeId ? this.currentAsset.assetAcquisitionTypeId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('AssetAcquisitionType', 'AssetAcquisitionTypeId', 'Name', strText, true, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.AssetAcquisitionTypeList = res.map(x => {
                return {
                    ...x,
                    assetAcquisitionTypeId: x.value,
                    name: x.label
                }
            });
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }
    getLegalEntity() {
        this.commonService.getLegalEntityList().subscribe(res => {
            this.legalEntityList = res;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    get employeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }
    getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
        empployid = empployid == 0 ? this.employeeId : empployid;
        editMSID = this.isEditMode ? editMSID = id : 0;
        this.commonService.getManagmentStrctureData(id, empployid, editMSID,this.authService.currentUser.masterCompanyId).subscribe(response => {
            if (response) {
                const result = response;
                if (result[0] && result[0].level == 'Level1') {
                    this.maincompanylist = result[0].lstManagmentStrcture;
                    this.currentAsset.companyId = result[0].managementStructureId;
                    this.currentAsset.managementStructureId = result[0].managementStructureId;
                    this.currentAsset.buisinessUnitId = 0;
                    this.currentAsset.divisionId = 0;
                    this.currentAsset.departmentId = 0;
                    this.bulist = [];
                    this.divisionlist = [];
                    this.departmentList = [];
                } else {
                    this.currentAsset.companyId = 0;
                    this.currentAsset.buisinessUnitId = 0;
                    this.currentAsset.divisionId = 0;
                    this.currentAsset.departmentId = 0;
                    this.maincompanylist = [];
                    this.bulist = [];
                    this.divisionlist = [];
                    this.departmentList = [];
                }

                if (result[1] && result[1].level == 'Level2') {
                    this.bulist = result[1].lstManagmentStrcture;
                    this.currentAsset.buisinessUnitId = result[1].managementStructureId;
                    this.currentAsset.managementStructureId = result[1].managementStructureId;
                    this.currentAsset.divisionId = 0;
                    this.currentAsset.departmentId = 0;
                    this.divisionlist = [];
                    this.departmentList = [];
                } else {
                    if (result[1] && result[1].level == 'NEXT') {
                        this.bulist = result[1].lstManagmentStrcture;
                    }
                    this.currentAsset.buisinessUnitId = 0;
                    this.currentAsset.divisionId = 0;
                    this.currentAsset.departmentId = 0;
                    this.divisionlist = [];
                    this.departmentList = [];
                }

                if (result[2] && result[2].level == 'Level3') {
                    this.divisionlist = result[2].lstManagmentStrcture;
                    this.currentAsset.divisionId = result[2].managementStructureId;
                    this.currentAsset.managementStructureId = result[2].managementStructureId;
                    this.currentAsset.departmentId = 0;
                    this.departmentList = [];
                } else {
                    if (result[2] && result[2].level == 'NEXT') {
                        this.divisionlist = result[2].lstManagmentStrcture;
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
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }
    selectedLegalEntity(legalEntityId) {
        if (legalEntityId) {
            this.currentAsset.companyId = legalEntityId;
            this.currentAsset.managementStructureId = legalEntityId;
            this.commonService.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId,0,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.bulist = res;
                this.currentAsset.buisinessUnitId = 0;
                this.currentAsset.divisionId = 0;
                this.currentAsset.departmentId = 0;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }
    selectedBusinessUnit(businessUnitId) {
        if (businessUnitId) {
            this.currentAsset.buisinessUnitId = businessUnitId;
            this.currentAsset.managementStructureId = businessUnitId;
            this.commonService.getManagementStructurelevelWithEmployee(businessUnitId, this.employeeId,0,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.divisionlist = res;
                this.currentAsset.divisionId = 0;
                this.currentAsset.departmentId = 0;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }
    selectedDivision(divisionId) {
        if (divisionId) {
            this.currentAsset.divisionId = divisionId;
            this.currentAsset.managementStructureId = divisionId;
            this.commonService.getManagementStructurelevelWithEmployee(divisionId, this.employeeId,0,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.departmentList = res;
                this.currentAsset.departmentId = 0;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }
    selectedDepartment(departmentId) {
        if (departmentId) {
            this.currentAsset.departmentId = departmentId;
            this.currentAsset.managementStructureId = departmentId;
        }
    }
    onFilterManufacturer(value) {
        this.manufacturerdata(value);
    }
    private manufacturerdata(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.currentAsset.manufacturerId ? this.currentAsset.manufacturerId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('Manufacturer ', 'ManufacturerId', 'Name', strText, true, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.allManufacturerInfo = res;
            this.ManufactureData = res;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }

    onFilterUom(value) {
        this.unitOfMeasureList(value);
    }
    private unitOfMeasureList(value) {
        if (this.isEditMode == true) {
            this.setEditArray.push(this.currentAsset.unitOfMeasureId ? this.currentAsset.unitOfMeasureId : 0);
        } else {
            this.setEditArray.push(0);
            if (this.assetService.currentUrl == '/assetmodule/assetpages/app-create-asset') {
                this.currentAsset.unitOfMeasureId = this.getuom("Eaches");
            }
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('UnitOfMeasure', 'UnitOfMeasureId', 'shortName', strText, true, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.allUnitOfMeasureinfo = res;

        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }
    onFilterCurrency(value) {
        this.unitOfMeasureList(value);
    }
    private CurrencyData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.currentAsset.currencyId ? this.currentAsset.currencyId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', strText, true, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.allCurrencyInfo = res;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }
    onFilterLocation(value) { 
        this.assetLocationData(value);
    }
    assetLocationData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.currentAsset.assetLocationId ? this.currentAsset.assetLocationId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.getAutoCompleteDropDownsByCodeWithName('AssetLocation', 'AssetLocationId', 'Name', 'Code', strText, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.allAssetLocations = res;

        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });


    }
    changeOfTab(value) {
        this.AssetId = this.assetService.listCollection ? this.assetService.listCollection.assetRecordId : this.AssetId;
        if (this.isEditMode == true) {
            this.DisabledMode = true;
            if (value === 'General') {
                this.activeIndex = 0;
                this.route.navigateByUrl(`assetmodule/assetpages/app-edit-asset/${this.AssetId}`);
            } else if (value === 'Capes') {
                this.activeIndex = 1;
                this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-capes/${this.AssetId}`);
            } else if (value === 'Calibration') {
                this.activeIndex = 2;
                this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-calibration/${this.AssetId}`);
            } else if (value == "Maintenance") {
                this.activeIndex = 3;
                this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-maintenance-warranty/${this.AssetId}`);
            }
        }
    }
    getAmortizationFrequencyList() {
        this.commonservice.smartDropDownList('AssetAmortizationInterval', 'AssetAmortizationIntervalId', 'AssetAmortizationIntervalCode','','',0,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.amortizationFrequencyList = res;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    getDepreciationFrequencyList() {
        this.commonservice.smartDropDownList('AssetDepreciationFrequency', 'AssetDepreciationFrequencyId', 'Name','','',0,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.depreciationFrequencyList = res;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    onIsDepreciable() {
        this.currentAsset.isdepreciable = true;
        this.currentAsset.isNonDepreciable = false;
    }
    onIsNonDepreciable() {
        this.currentAsset.isNonDepreciable = true;
        this.currentAsset.isdepreciable = false;
    }
    onIsAmortizable() {
        this.currentAsset.isAmortizable = true;
        this.currentAsset.isNonAmortizable = false;
    }
    onIsNonAmortizable() {
        this.currentAsset.isNonAmortizable = true;
        this.currentAsset.isAmortizable = false;
    }
    onDepreciable(type) {
        if (type == 'html') {
            this.AssetAttData('');
            this.getAssetsList(1);
            this.currentAsset.assetIntangibleTypeId = null;
            this.currentSelectedIntangibleAssetType.amortizationMethod = "";
            this.currentSelectedIntangibleAssetType.intangibleLife = "";
            this.currentSelectedIntangibleAssetType.amortFrequency = "";
            this.currentSelectedIntangibleAssetType.amortExpenseGL = "";
            this.currentSelectedIntangibleAssetType.accAmortDeprGL = "";
            this.currentSelectedIntangibleAssetType.intangibleGL = "";
            this.currentSelectedIntangibleAssetType.intangibleWriteDownGL = "";
            this.currentSelectedIntangibleAssetType.intangibleWriteOffGL = "";
            this.currentAsset.isAmortizable = false;
            this.currentAsset.isNonAmortizable = false;
            this.currentAsset.isdepreciable = true;
        }
        this.active0 = true;
        this.active1 = true;
        this.active2 = true;
        this.active3 = true;
        this.currentAsset.isTangible = true;
        this.currentAsset.isIntangible = false;

    }
    onIntangible(type) {
        this.getAssetsList(2);
        this.active0 = true;
        this.active1 = false;
        this.active2 = false;
        this.active3 = false;
        this.currentAsset.isIntangible = true;
        this.currentAsset.isTangible = false;
        this.currentAsset.isAmortizable = true;
        this.currentAsset.assetParentRecordId = null;
        this.currentAsset.assetLocationId = "";
        this.currentAsset.manufacturerId = "";
        this.currentAsset.isSerialized = false;
        this.currentAsset.currencyId = "";
        this.currentAsset.memo = "";
        this.currentAsset.unitOfMeasureId = this.getuom("Eaches");
        this.currentAsset.unitCost = "";
        this.currentAsset.model = "";
        this.currentAsset.controlNumber = "Creating";
        this.currentAsset.assetAcquisitionTypeId = "";
        this.currentAsset.manufacturedDate = "";
        this.currentAsset.expirationDate = "";
        this.currentAsset.isdepreciable = false;
        this.currentAsset.isNonDepreciable = false;
        this.currentAsset.isAmortizable = true;
        this.currentAsset.asset_Location = "";
        this.currentAsset.tangibleClassId = 0;
        this.currentSelectedAssetType.selectedObj = "";
        this.currentSelectedAssetAttributeType.depreciationMethodName = "";
        this.currentSelectedAssetAttributeType.residualPercentage = "";
        this.currentSelectedAssetAttributeType.assetLife = "";
        this.currentSelectedAssetAttributeType.deprFrequency = "";
        this.currentSelectedAssetAttributeType.acquiredGL = "";
        this.currentSelectedAssetAttributeType.deprExpenseGL = "";
        this.currentSelectedAssetAttributeType.adDeprGL = "";
        this.currentSelectedAssetAttributeType.saleGL = "";
        this.currentSelectedAssetAttributeType.writeOffGL = "";
        this.currentSelectedAssetAttributeType.writeDownGL = "";
        this.AssetIntanAttData('');
        this.showItemEdit(this.currentAsset.assetIntangibleTypeId);
        if (this.AssetId) {
            this.isEditMode = true;
        } else {
            this.isEditMode = false;
        }
    }
    onClearAltId() {
        this.currentAsset.alternateAssetRecordId = undefined;
    }
    onClearParentId() {
        this.currentAsset.assetParentRecordId = undefined;
    }
    showExistMsgForAsset:any=false;
    showExistMsgForAssetParent:any=false;
    onAssetParentAlt(value,type){
        
        if (this.currentAsset.alternateAssetRecordId != null && this.currentAsset.assetParentRecordId != null) {
            if (this.currentAsset.alternateAssetRecordId.assetRecordId == this.currentAsset.assetParentRecordId.assetRecordId) {
              if(type==1){
                  this.showExistMsgForAsset=true;
              }else{
                this.showExistMsgForAssetParent=true;
              }
            }else{
                this.showExistMsgForAsset=false;
              this.showExistMsgForAssetParent=false; 
            }
        }
    }
    saveAsset(): void {
        if (this.currentAsset.isIntangible == false && this.currentAsset.expirationDate != null) {
            if (this.currentAsset.expirationDate < moment(this.currentDate).format('MM/DD/YYYY')) {
                this.isSaving = false;
                this.alertService.showMessage("", `Expiration Date can't before current Date please Update.`, MessageSeverity.error);
                return;
            }
        }
        if (this.currentAsset.isIntangible == false && this.currentAsset.entryDate && this.currentAsset.manufacturedDate && (this.currentAsset.entryDate < this.currentAsset.manufacturedDate)) {
            if (moment(this.currentAsset.entryDate).format('MM/DD/YYYY') < moment(this.currentAsset.manufacturedDate).format('MM/DD/YYYY')) {
                this.isSaving = false;
                this.alertService.showMessage("", `Manufatured date cannot be later than Entry date.`, MessageSeverity.error);
                return;
            }
        }
        // if (this.currentAsset.isIntangible == true) {
        //     if (!(this.currentAsset.assetId && this.currentAsset.name && this.currentAsset.assetIntangibleTypeId
        //         && this.currentAsset.companyId
        //     )) {
        //         this.display = true;
        //         this.modelValue = true;
        //         this.alertService.showMessage(
        //             'Warning',
        //             `Please Enter (*) Mandatory Fields  `,
        //             MessageSeverity.warn
        //         );
        //     }
        // }
    
        if (this.currentAsset.isDepreciable == true) {
            if (this.currentAsset.assetId != null && this.currentAsset.assetParentRecordId != null) {
                if (this.currentAsset.assetId == this.currentAsset.assetParentRecordId) {
                    this.isSaving = false;
                    this.alertService.showMessage("", `Asset Parent cannot be equal to Asset ID.`, MessageSeverity.error);
                    return;
                }
            }
            if (this.currentAsset.alternateAssetRecordId != null && this.currentAsset.assetParentRecordId != null) {
                if (this.currentAsset.alternateAssetRecordId == this.currentAsset.assetParentRecordId) {
                    this.isSaving = false;
                    this.alertService.showMessage("", `Asset Parent and Alternate Asset can't be same.`, MessageSeverity.error);
                    return;
                }
            }
        }
        if (this.currentAsset.alternateAssetRecordId != null && this.currentAsset.assetId != null) {
            if (this.currentAsset.alternateAssetRecordId == this.currentAsset.assetId) {
                this.isSaving = false;
                this.alertService.showMessage("", `Asset Id and Alternate Asset Id can't be same.`, MessageSeverity.error);
                return;
            }
        }
        if (this.currentAsset.isDepreciable == true) {
            if (!(this.currentAsset.assetId && this.currentAsset.name && this.currentAsset.unitOfMeasureId
                && this.currentAsset.currencyId && this.currentAsset.tangibleClassId && this.currentAsset.assetAcquisitionTypeId
                && this.currentAsset.companyId
            )) {
                this.display = true;
                this.modelValue = true;
                this.alertService.showMessage(
                    'Warning',
                    `Please Enter (*) Mandatory Fields  `,
                    MessageSeverity.warn
                );
            }
        }
        if ((this.currentAsset.assetId && this.currentAsset.name && this.currentAsset.assetIntangibleTypeId)
            || (this.currentAsset.assetId && this.currentAsset.name && this.currentAsset.unitOfMeasureId
                && this.currentAsset.currencyId && this.currentAsset.tangibleClassId && this.currentAsset.assetAcquisitionTypeId
                && this.currentAsset.companyId)) {
            this.isSaving = true;
            if (!this.currentAsset.assetRecordId) {
                this.currentAsset.createdBy = this.userName;
                this.currentAsset.updatedBy = this.userName;
                this.currentAsset.masterCompanyId = this.authService.currentUser.masterCompanyId;
                this.currentAsset.isActive = true;
                if (this.currentAsset.isIntangible == true) {
                    this.currentAsset.isTangible = false;
                    this.currentAsset.isSerialized = false;
                    this.currentAsset.isdepreciable = false;
                    this.currentAsset.isNonDepreciable = false;
                    delete this.currentAsset.assetType;
                    delete this.currentAsset.currency;
                    delete this.currentAsset.manufacturer;
                    delete this.currentAsset.unitOfMeasure;
                    delete this.currentAsset.assetLocationId;
                }
                if (this.currentAsset.isTangible == true) {
                    this.currentAsset.isAmortizable = false;
                    this.currentAsset.isNonAmortizable = false;
                    this.currentAsset.isIntangible = false;
                    this.currentSelectedIntangibleAssetType.selectedAssetObj = {};
                    this.currentAsset.assetIntangibleTypeId = "";
                }
                var d = new Date(this.currentAsset.entryDate);
                d.setMinutes(d.getMinutes() + 480);
                this.currentAsset.entryDate = d;
                const expdate = new Date(this.currentAsset.expirationDate);
                expdate.setMinutes(expdate.getMinutes() + 480);
                this.currentAsset.expirationDate = expdate;
                const manDate = new Date(this.currentAsset.manufacturedDate);
                manDate.setMinutes(manDate.getMinutes() + 480);
                this.currentAsset.manufacturedDate = manDate;

                if (this.currentAsset && this.currentAsset.isIntangible == false) {
                    const newData = { ...this.currentAsset };
                    newData.alternateAssetRecordId = newData.alternateAssetRecordId ? newData.alternateAssetRecordId.assetRecordId : 0;
                    newData.assetParentRecordId = newData.assetParentRecordId ? newData.assetParentRecordId.assetRecordId : 0;
                    this.isSpinnerEnable = true;
                    this.assetService.addAsset(newData).subscribe(data => {
                        this.isSpinnerEnable = false;
                        this.isEditMode = true;
                        this.disableSaveForEdit = true;
                        this.currentAsset.alternateAssetRecordId = { assetRecordId: data.alternateAssetRecordId, assetId: data.alternateAssetName };
                        this.currentAsset.assetParentRecordId = { assetRecordId: data.assetParentRecordId, assetId: data.assetParentName };
                        this.currentAsset.assetRecordId = data.assetRecordId;
                        this.allowNextTab = true;
                        this.currentAsset.updatedBy = this.userName;
                        this.listCollection = data;
                        this.assetService.generalCollection = this.listCollection;
                        this.assetService.listCollection = data;
                        this.alertService.showMessage("Success", `Asset Created successfully.`, MessageSeverity.success);
                        const { assetId } = data;
                        if (this.currentAsset.isIntangible == true) {
                            this.activeIndex = 1;
                            this.assetService.indexObj.next(this.activeIndex);
                            // this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-listing`);
                        } else {
                            this.location.replaceState(`assetmodule/assetpages/app-edit-asset/${data.assetRecordId}`);
                        }
                    }, err => {
                        this.currentAsset.manufacturedDate = this.currentAsset.manufacturedDate ? this.currentAsset.manufacturedDate : null;
                        this.currentAsset.expirationDate = this.currentAsset.expirationDate ? this.currentAsset.expirationDate : null;
                        const errorLog = err;
                        this.errorMessageHandler(errorLog);
                    })
                } else {
                    if (this.currentAsset) {
                        const newData = { ...this.currentAsset };
                        newData.alternateAssetRecordId = newData.alternateAssetRecordId ? newData.alternateAssetRecordId.assetRecordId : 0;
                        this.assetService.addAssetIntangible(newData).subscribe(data => {
                            this.allowNextTab = true;
                            this.currentAsset.updatedBy = this.userName;
                            this.listCollection = data;
                            this.assetService.generalCollection = this.listCollection;
                            this.assetService.listCollection = data;
                            // this.location.replaceState(`assetmodule/assetpages/app-edit-asset/${data.assetRecordId}`);
                            this.alertService.showMessage("Success", `Asset Created successfully.`, MessageSeverity.success);
                            const { assetId } = data;
                            if (this.currentAsset.isIntangible == true) {
                                this.activeIndex = 1;
                                this.assetService.indexObj.next(this.activeIndex);
                                this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-listing`);
                            }
                        }, err => {
                            const errorLog = err;
                            this.errorMessageHandler(errorLog);
                        })
                    }
                }
            }
            else {
                this.currentAsset.updatedBy = this.userName;
                this.currentAsset.masterCompanyId = this.authService.currentUser.masterCompanyId;
                if (this.currentAsset.isIntangible == true) {
                    this.currentAsset.isTangible = false;
                    this.currentAsset.isSerialized = false;
                    this.currentAsset.assetLocationId = "";
                    this.currentAsset.manufacturerId = "";
                    this.currentAsset.isSerialized = false;
                    this.currentAsset.currencyId = "";
                    this.currentAsset.memo = "";
                    this.currentAsset.unitOfMeasureId = "";
                    this.currentAsset.unitCost = "";
                    this.currentAsset.model = "";
                    this.currentAsset.assetAcquisitionTypeId = "";
                    this.currentAsset.manufacturedDate = "";
                    this.currentAsset.expirationDate = "";
                    this.currentAsset.isdepreciable = false;
                    this.currentAsset.isNonDepreciable = false;
                    this.currentAsset.asset_Location = "";
                    this.currentAsset.tangibleClassId = 0;
                    this.currentSelectedAssetType.selectedObj = "";
                    delete this.currentAsset.assetType;
                    delete this.currentAsset.currency;
                    delete this.currentAsset.manufacturer;
                    delete this.currentAsset.unitOfMeasure;
                }
                if (this.currentAsset.isTangible == true) {
                    this.currentAsset.isIntangible = false;
                    this.currentAsset.isAmortizable = false;
                    this.currentAsset.isNonAmortizable = false;
                    this.currentSelectedIntangibleAssetType.selectedAssetObj = {};
                    this.currentAsset.assetIntangibleTypeId = "";
                    delete this.currentAsset.assetType;
                    delete this.currentAsset.currency;
                    delete this.currentAsset.manufacturer;
                    delete this.currentAsset.unitOfMeasure;
                }
                if (this.currentAsset.isIntangible == false) {
                    var d = new Date(this.currentAsset.entryDate);
                    d.setMinutes(d.getMinutes() + 480);
                    this.currentAsset.entryDate = d;
                    const newData = { ...this.currentAsset };
                    newData.alternateAssetRecordId = newData.alternateAssetRecordId ? newData.alternateAssetRecordId.assetRecordId : 0;
                    newData.assetParentRecordId = newData.assetParentRecordId ? newData.assetParentRecordId.assetRecordId : 0;
                    if (typeof newData.assetId === 'string' || newData.assetId instanceof String){
                        newData.assetId = newData.assetId ? newData.assetId : '';
                    }else{
                        newData.assetId = newData.assetId ? newData.assetId.label : '';
                    }
                    this.isSpinnerEnable = true;
                    this.assetService.updateAsset(newData).subscribe((data: any) => {
                        this.isSpinnerEnable = false;
                        this.currentAsset.updatedBy = this.userName;
                        this.listCollection = data;
                        this.disableSaveForEdit = true;
                        this.assetService.listCollection = this.listCollection
                        this.assetService.generalCollection = this.listCollection;
                        this.alertService.showMessage("Success", `Asset Updated successfully.`, MessageSeverity.success);
                        const { assetId } = this.listCollection;
                    }, err => {
                        const errorLog = err;
                        this.errorMessageHandler(errorLog);
                    })
                }
                else {
                    var d = new Date(this.currentAsset.entryDate);
                    d.setMinutes(d.getMinutes() + 480);
                    this.currentAsset.entryDate = d;
                    const newData = { ...this.currentAsset };
                    newData.alternateAssetRecordId = newData.alternateAssetRecordId ? newData.alternateAssetRecordId.assetRecordId : 0;
                    if (typeof newData.assetId === 'string' || newData.assetId instanceof String){
                        newData.assetId = newData.assetId ? newData.assetId : '';
                    }else{
                        newData.assetId = newData.assetId ? newData.assetId.label : '';
                    }
                    this.assetService.updateAssetIntangible(newData).subscribe(data => {
                        // this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-listing`);
                        this.currentAsset.updatedBy = this.userName;
                        this.listCollection = data;
                        this.assetService.generalCollection = this.listCollection;
                        this.alertService.showMessage("Success", `Asset Updated successfully.`, MessageSeverity.success);
                        this.currentAsset = this.assetService.listCollection;
                        const { assetId } = this.listCollection;
                    }, err => {
                        const errorLog = err;
                        this.errorMessageHandler(errorLog);
                    })
                }
            }
        }
    }
    // getSelectedIntangible(selectedObj) {
    //     this.currentSelectedIntangibleAssetType = Object.assign({}, this.allIntangibleInfo.filter(function (intangible) {
    //         return intangible.assetIntangibleTypeId == selectedObj;
    //     })[0]);

    // }
    getSelectedLocation(selectedObj) {
        this.currentSelectedLocation = Object.assign({}, this.allAssetLocations.filter(function (location) {
            return location.assetLocationId == selectedObj;
        })[0]);;
    }
    getSelectedAssetType(selectedAssetObj) {
        this.currentSelectedAssetType = Object.assign({}, this.allAssetTypeInfo.filter(function (asset) {
            return asset.tangibleClassId == selectedAssetObj;
        })[0]);;
    }
    nextClick(nextOrPrevious) {
        this.nextOrPreviousTab = nextOrPrevious;
        let content = this.tabRedirectConfirmationModal;
        this.modal = this.modalService.open(content, { size: "sm" });

    }
    dismissModelRedirect() {
        this.currentAsset = this.assetService.listCollection;
        this.activeIndex = 1;
        this.assetService.indexObj.next(this.activeIndex);
        const { assetRecordId } = this.currentAsset;
        this.dismissModel()
        this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-capes/${assetRecordId}`);
    }
    redirectToTab() {
        this.dismissModel();
        this.currentAsset = this.assetService.listCollection;
        this.activeIndex = 1;
        this.assetService.indexObj.next(this.activeIndex);
        const { assetRecordId } = this.currentAsset;
        if (!this.disableSaveForEdit) {
            this.saveAsset()
        }
        this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-capes/${assetRecordId}`);
    }
    getmemo($event) {
        this.disableSaveForEdit = false;
        this.disableSaveForShortName = false;
        this.disableSaveForUOM = false;
    }
    getuom(name) {
        for (let i = 0; i < this.allUnitOfMeasureinfo.length; i++) {
            if (name == this.allUnitOfMeasureinfo[i].label)
                return this.allUnitOfMeasureinfo[i].value;
        }
    }
    formatToGlobal(obj) {
        if(obj.unitCost <0)
        {
            obj.unitCost=0; 
        }

        obj.unitCost = obj.unitCost ? formatNumberAsGlobalSettingsModule(obj.unitCost, 2) : '0.00';

    }
    errorMessageHandler(log) {
        this.isSpinnerEnable = false;
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
    omit_special_char(event){   
   var k;  
   k = event.charCode;  
   return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57) || k == 45 || k == 95 ); 
}
addNew(){
    this.route.navigateByUrl('/assetmodule/assetpages/app-create-asset');
    this.assetService.listCollection={};
    this.assetService.isEditMode = false;
}
}
