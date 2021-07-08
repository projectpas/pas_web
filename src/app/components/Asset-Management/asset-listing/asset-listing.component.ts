import { Component, OnInit, Input } from '@angular/core';
//import { AlertService } from '../../../services/alert.service';
import { AssetService } from '../../../services/asset/Assetservice';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fadeInOut } from '../../../services/animations';
import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { GlAccountService } from '../../../services/glAccount/glAccount.service';
import { VendorEndpointService } from '../../../services/vendor-endpoint.service';
import { Vendor } from '../../../models/vendor.model';
import { GlAccount } from '../../../models/GlAccount.model';
import { LegalEntityService } from '../../../services/legalentity.service';
import { AssetAttributeTypeService } from '../../../services/asset-attribute-type/asset-attribute-type.service';
import { AssetIntangibleAttributeTypeService } from '../../../services/asset-intangible-attribute-type/asset-intangible-attribute-type.service';
import { DepriciationMethodService } from '../../../services/depriciation-method/depriciation.service';
import { DepriciationMethod } from '../../../models/depriciation-method.model';
import { CommonService } from '../../../services/common.service';
import { ItemMasterCapabilitiesModel } from '../../../models/itemMasterCapabilities.model';
import { VendorService } from '../../../services/vendor.service';
import { AssetLocationService } from '../../../services/asset-location/asset-location.service';
// declare var $ : any;
declare var $ : any;
import { AuditHistory } from '../../../models/audithistory.model';
import { UnitOfMeasureService } from '../../../services/unitofmeasure.service';
import { listSearchFilterObjectCreation, formatNumberAsGlobalSettingsModule } from '../../../generic/autocomplete';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';
@Component({
    selector: 'app-asset-listing',
    templateUrl: './asset-listing.component.html',
    styleUrls: ['./asset-listing.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
/** Asset-listing component*/
export class AssetListingComponent implements OnInit {
    breadcrumbs: MenuItem[];
    @Input() isWorkOrder = false;
    @Input() assetsId;
    currentDeletedstatus: boolean = false;
    currentstatus: string = 'Active';
    isSpinnerVisible: boolean;
    selectedRows: any = [];
    isSaving: boolean;
    activeIndex: number;
    assetViewList: any = {};
    currentAsset: any = {};
    modal: NgbModalRef;
    historyModal: NgbModalRef;
    assetRecordId: number;
    private isDeleteMode: boolean = false;
    private isEditMode: boolean = false;
    manufacturerId: any;
    currencyId: any;
    glAccountId: any;
    Active: string;
    assetTypeToUpdate: any;
    unitOfMeasureId: any;
    assetTypeId: any;
    selectedColumn: any;
    lazyLoadEventData: any;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    totalRecords1: any;
    pageIndex1: number = 0;
    pageSize1: number = 10;
    data: any;
    totalPages1: number;
    updateMode: boolean = false;
    allManagemtninfo: any[] = [];
    bulist: any[] = [];
    departmentList: any[] = [];
    divisionlist: any[] = [];
    maincompanylist: any[] = [];
    allManufacturerInfo: any[] = [];
    managementStructureData: any = [];
    depriciationMethodList: DepriciationMethod[] = [];
    depreciationFrequencyList: any[] = [];
    assetAcquisitionTypeList: any[] = [];
    GLAccountList: any[] = [];
    allCapesInfo: ItemMasterCapabilitiesModel[] = [];
    allVendorInfo: Vendor[] = [];
    historyCols: any[] = [];
    historyData: any[] = [];
    selectedAsset: any;
    allAssetLocationInfo: any[] = [];
    allAssetLocations: any[] = [];
    assetwarrantystatusList: any[] = [];
    allUnitOfMeasureinfo: any[] = [];
    home: any;
    selectedOnly: boolean = false;
    targetData: any;
    pageNumber = 0;
    public auditHisory: AuditHistory[] = [];
    auditHistory: any[] = [];
    lazyLoadEventDataInput: any;
    status: string = 'active';
    loadingIndicator: boolean;
    allAssetInfo: any[] = [];
    allAssetInfoNew: any[] = [];
    selectedColumns: { field: string; header: string; }[];
    isSpinnerVisibleHistory:boolean=false;
    showhistorylist:boolean=false
    selectedCol: { field: string; header: string; }[];
    cols = [
        { field: 'name', header: 'Asset Name', colspan: '1' },
        { field: 'assetId', header: 'ID', colspan: '1' },
        { field: 'alternateAssetId', header: 'Alt Asset ID', colspan: '1' },
        { field: 'manufacturerName', header: 'Manufacturer', colspan: '1' },
        { field: 'isSerializedNew', header: 'Serialized', colspan: '1',width:"90px" },
        { field: 'calibrationRequiredNew', header: 'Calibrated', colspan: '1' ,width:"90px"},
        { field: 'assetClass', header: 'Asset Category', colspan: '1' },
        { field: 'deprAmort', header: 'Depr/Amort', colspan: '1',width:"100px" },
        // { field: 'companyName', header: 'Level 01', colspan: '1' },
        // { field: 'buName', header: 'Level 02', colspan: '1' },
        // { field: 'deptName', header: 'Level 03', colspan: '1' },
        // { field: 'divName', header: 'Level 04', colspan: '1' },
        { field: 'assetType', header: 'Asset Class', colspan: '1' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },
    ]; 
    cols1 = [
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'captypedescription', header: 'Capability Type' },
        { field: 'manufacturer', header: 'Aircraft Manufacturer' },
        { field: 'modelname', header: 'Models' },
        { field: 'dashnumber', header: 'Dash Number' },
    ];
    public isActive: boolean = false;
    public isActiveView: boolean = false;
    isAdd:boolean=true;
    isEdit:boolean=true;
    isDelete:boolean=true;
    isView:boolean=true;
    isDownload:boolean=true;
    isMaintenance:boolean=true;
    isCalibration:boolean=true;
    isCapes:boolean=true;
    isGeneralInformation:boolean=true;
    permissionAddCheck=[ModuleConstants.Asset_Create+'.'+PermissionConstants.Add,
                        ModuleConstants.Asset_GeneralInformation+'.'+PermissionConstants.Add,
                        ModuleConstants.Asset_Capes+'.'+PermissionConstants.Add,
                        ModuleConstants.Asset_Calibration+'.'+PermissionConstants.Add,
                        ModuleConstants.Asset_MaintenanceAndWarranty+'.'+PermissionConstants.Add];
    permissionUpdateCheck=[ModuleConstants.Asset_Create+'.'+PermissionConstants.Update,
                           ModuleConstants.Asset_GeneralInformation+'.'+PermissionConstants.Update,
                           ModuleConstants.Asset_Capes+'.'+PermissionConstants.Update,
                           ModuleConstants.Asset_Calibration+'.'+PermissionConstants.Update,
                           ModuleConstants.Asset_MaintenanceAndWarranty+'.'+PermissionConstants.Update];


    constructor(private alertService: AlertService, public assetService: AssetService, private _route: Router,
        private modalService: NgbModal, private glAccountService: GlAccountService,
        public assetattrService1: AssetAttributeTypeService, private vendorService: VendorService, public assetIntangibleService: AssetIntangibleAttributeTypeService,
        private vendorEndpointService: VendorEndpointService, private depriciationMethodService: DepriciationMethodService, private commonservice: CommonService,
        private legalEntityServices: LegalEntityService, private datePipe: DatePipe,
        private assetLocationService: AssetLocationService, private authService: AuthService, public unitService: UnitOfMeasureService
    ) {
        this.assetService.isEditMode = false;
        this.assetService.listCollection = null;
        this.isAdd=this.authService.checkPermission(this.permissionAddCheck);
        this.isEdit=this.authService.checkPermission(this.permissionUpdateCheck);
        this.isView=this.authService.checkPermission([ModuleConstants.Asset_List+'.'+PermissionConstants.View]);
        this.isActive=this.authService.checkPermission([ModuleConstants.Asset_Create+'.'+PermissionConstants.Update]);
        this.isDelete=this.authService.checkPermission([ModuleConstants.Asset_Create+'.'+PermissionConstants.Delete]);
        this.isDownload=this.authService.checkPermission([ModuleConstants.Asset_List+'.'+PermissionConstants.Download])
        this.isGeneralInformation=this.authService.checkPermission([ModuleConstants.Asset_GeneralInformation+'.'+PermissionConstants.View]);
        this.isCapes=this.authService.checkPermission([ModuleConstants.Asset_Capes+'.'+PermissionConstants.View]);
        this.isCalibration=this.authService.checkPermission([ModuleConstants.Asset_Calibration+'.'+PermissionConstants.View]);
        this.isMaintenance=this.authService.checkPermission([ModuleConstants.Asset_MaintenanceAndWarranty+'.'+PermissionConstants.View]);
       
    }
    ngOnInit(): void {
        this.breadcrumbs = [
            { label: 'Asset' },
            { label: 'Asset List' },
        ];
        this.isSpinnerVisible = true;
        this.selectedColumns = this.cols;
        this.activeIndex = 0;
        this.assetService.ShowPtab = false;
        this.assetService.alertObj.next(this.assetService.ShowPtab); //steps
        this.assetService.indexObj.next(this.activeIndex);
        if (this.isWorkOrder) {
            this.assetService.getAssetsById(this.assetsId,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.openView('', res[0]); 
                }, err => {
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                })
            }
        }
    loadEventData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        if (event.first < 1) { event.first = 0 }
    }
    closeDeleteModal() {
        $("#downloadConfirmation").modal("hide");
    }
    async getList(data) {
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.assetService.getAssetCapesAll(PagingData, this.assetRecordId).subscribe(res => {
            this.data = res;
            this.allCapesInfo = this.data;
            this.totalRecords1 = this.data.length;
            this.totalPages1 = Math.ceil(this.totalRecords1 / this.pageSize);
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }

    geListByStatus(status) {
        this.selectedRows = [];
        this.status = status;
        this.currentstatus = status;
        this.pageNumber = 0;
        this.lazyLoadEventDataInput.first = 0;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.loadData(PagingData);
    }
    getDeleteListByStatus(value) {
        this.selectedRows = [];
        this.currentDeletedstatus = true;
        this.pageNumber = 0;
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        if (value == true) {
            this.currentstatus = this.currentstatus;
            this.status = this.status;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.loadData(PagingData);
        } else {
            this.currentDeletedstatus = false;
            this.currentstatus = this.currentstatus;
            this.status = this.status;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.loadData(PagingData);
        }
    }
    publicationPagination(event: { first: any; rows: number }) {
        this.loadData(event);
    }
    restorerecord: any = {};
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    restoreRecord() {
        this.commonservice.updatedeletedrecords('Asset', 'AssetRecordId', this.restorerecord.assetRecordId,).subscribe(res => {
            this.modal.close();
            this.getDeleteListByStatus(true)
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    private loadData(data) {
        this.pageIndex = parseInt(data.first) / data.rows;
        this.pageSize = data.rows;
        if (this.pageIndex < 1) {
            this.pageIndex = this.pageIndex * 10;
        }
        data.first = this.pageIndex;
        this.lazyLoadEventDataInput = data;
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete
        data.filters['status'] = this.status ? this.status : 'Active';
        data.filters.masterCompanyId= this.authService.currentUser.masterCompanyId;
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.isSpinnerVisible = true;
        this.assetService.getAssetNewList(PagingData).subscribe(
            results => {
                this.onDataLoadSuccessful(results);
                this.totalRecords = results.totalRecordsCount;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            }
        );
        this.historyCols = [
            { field: 'overview', header: 'Changes Overview', width: '150px' },
            { field: 'updatedBy', header: 'Last Updated By', width: '100px' },
            { field: 'updatedDate', header: 'Last Updated Time', width: '100px' },
        ];
    }
    globalFilterValue: any;
    // filterGlobal(value, type) {
    //     this.globalFilterValue = value;
    //     this.isSpinnerVisible = true;
    //     this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters };
    //     const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
    //     const isdelete = this.currentDeletedstatus ? true : false;
    //     PagingData.filters.isDeleted = isdelete
    //     PagingData.filters['status'] = this.status ? this.status : 'Active';
    //     PagingData.filters['global'] = value;
    //     PagingData.globalFilter = value;
    //     this.assetService.getAssetListGlobalFilter(PagingData).subscribe(
    //         results => {
    //             this.onDataLoadSuccessful(results);
    //         },
    //         error => this.onDataLoadFailed(error)
    //     );
    // }
    private onDataLoadSuccessful(allWorkFlows) {
        this.isSpinnerVisible = false;
        this.allAssetInfo = [];
        this.allAssetInfo = allWorkFlows.results;
       this.allAssetInfo.forEach(x=>{
         if(x.assetClass=='Tangible' ){
    x.deprAmort=x.isDepreciable==true ? 'yes' :'No';
         }
         if(x.assetClass=='Intangible' ){
                x.deprAmort=x.isAmortizable==true? 'yes' :'No';
                     }
            x.createdDate=x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy h:mm a'): '';
						x.updatedDate=x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy h:mm a'): '';
        
                              })
        this.allAssetInfoOriginal = this.allAssetInfo
        this.lazyLoadEventDataInput.first = allWorkFlows.first;
    }
    private onDataLoadFailed(error: any) {
        this.isSpinnerVisible = false;

    }

    public navigateTogeneralInfo() {
        this.assetService.isEditMode = false;
        this.assetService.enableExternal = false;
        this._route.navigateByUrl('assetmodule/assetpages/app-create-asset');

    }
    getAuditHistoryById(rowData) {
        this.assetService.getAssetCapesAudit(rowData.assetCapesId).subscribe(res => {
            this.auditHistory = res;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
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

    openAssetToEdit(row) {
        this.assetService.isEditMode = true;
        this.isSaving = true;
        this.assetService.listCollection = row;
        const { assetId } = row;
        this._route.navigateByUrl(`assetmodule/assetpages/app-edit-asset/${row.assetRecordId}`);
    }
    openAssetToAdjustment(row) {
        this.assetService.listCollection = row;
        const { assetId } = row;
        this._route.navigateByUrl(`assetmodule/assetpages/app-asset-adjustment/${row.assetRecordId}`);
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    removeAsset(): void {
        this.assetService.remove(this.assetService.listCollection.assetRecordId).subscribe(response => {
            this.alertService.showMessage("Success", `Asset removed successfully.`, MessageSeverity.success);
            this.modal.close();
            const lazyEvent = this.lazyLoadEventDataInput;
            this.loadData({
                ...lazyEvent,
                filters: {
                    ...lazyEvent.filters,
                    status: this.status
                }
            }) 
               }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });

    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    toggleIsActive(asset: any, e) {
        if (e.checked == false) {
            this.assetTypeToUpdate = asset;
            this.Active = "In Active";
            this.assetTypeToUpdate.isActive == false;
            this.assetService.updateAssetListing(asset.assetRecordId, this.Active, this.userName).subscribe(asset => {
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);

                const pageIndex = parseInt(this.lazyLoadEventDataInput.first);
                this.pageIndex = pageIndex;
                this.pageSize = this.lazyLoadEventDataInput.rows;
                this.lazyLoadEventDataInput.first = pageIndex >= 1 ? pageIndex : 0;

                this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status, isDeleted: this.currentDeletedstatus };
                const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }

                const lazyEvent = this.lazyLoadEventDataInput;
                this.loadData(PagingData)
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
        else {
            this.assetTypeToUpdate = asset;
            this.Active = "Active";
            this.assetTypeToUpdate.isActive == true;
            this.assetService.updateAssetListing(asset.assetRecordId, this.Active, this.userName).subscribe(asset => {
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
                const lazyEvent = this.lazyLoadEventDataInput;
                this.loadData({
                    ...lazyEvent,
                    filters: {
                        ...lazyEvent.filters,
                        status: this.status
                    }
                })
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }

    openDelete(content, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.assetService.listCollection = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });

    }
    // openHistory(content, row) {

    //     this.assetService.listCollection = row;
    //     this.selectedAsset = row.assetId;
    //     this.historyData = [
    //         { overview: 'Asset Description, Manufacturer', updatedBy: 'Shabbir', updatedTime: '02-01-2019 10:20:50' },
    //         { overview: 'UOM, Asset Location', updatedBy: 'Roger A', updatedTime: '02-01-2019 10:20:50' },
    //     ];
    //     this.historyModal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    //     this.historyModal.result.then(() => {

    //     }, () => { })
    // }

    openHistory(row) {
        this.auditHistory = [];
          if(row && row.assetRecordId !=undefined){
              this.isSpinnerVisibleHistory=true;
          this.assetService.GetAuditDataByAssetList(row.assetRecordId).subscribe(res => {
    
          if(res && res.length !=0){
              this.showhistorylist=true;
              this.auditHistory = res;
            //   this.auditHistory = res.map(x => {
            //       return {
            //           ...x,
            //        //unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '',
            //     //   residualPercentage: x.residualPercentage ? formatNumberAsGlobalSettingsModule(x.residualPercentage, 2) : '',
            //     //   installationCost: x.installationCost ? formatNumberAsGlobalSettingsModule(x.installationCost, 2) : '',
            //     //   freight: x.freight ? formatNumberAsGlobalSettingsModule(x.freight, 2) : '',
            //     //   insurance: x.insurance ? formatNumberAsGlobalSettingsModule(x.insurance, 2) : '',
            //     //   taxes: x.taxes ? formatNumberAsGlobalSettingsModule(x.taxes, 2) : '',
            //     //   totalCost: x.totalCost ? formatNumberAsGlobalSettingsModule(x.totalCost, 2) : '',
            //     //   calibrationDefaultCost: x.calibrationDefaultCost ? formatNumberAsGlobalSettingsModule(x.calibrationDefaultCost, 2) : '',
            //     //   certificationDefaultCost: x.certificationDefaultCost ? formatNumberAsGlobalSettingsModule(x.certificationDefaultCost, 2) : '',
            //     //   inspectionDefaultCost: x.inspectionDefaultCost ? formatNumberAsGlobalSettingsModule(x.inspectionDefaultCost, 2) : '',
            //     //   verificationDefaultCost: x.verificationDefaultCost ? formatNumberAsGlobalSettingsModule(x.verificationDefaultCost, 2) : '',
            //       }
            //   });
              //this.isIntangible = this.auditHistory[0].isIntangible;
          }else{
              this.showhistorylist=false;
          }
           
              this.isSpinnerVisibleHistory=false;
          },err=>{
              this.isSpinnerVisibleHistory=false;
              this.isSpinnerVisible = false;
              this.showhistorylist=false;
              const errorLog = err;
               this.errorMessageHandler(errorLog);
          })
      }
      }
    dismissHistoryModel() {

        $("#assetInvAudit").modal("hide");
        //this.historyModal.close();
    }

    loadDepricationMethod() {
        this.depriciationMethodService.getAll().subscribe(depriciationmethods => {
            this.depriciationMethodList = depriciationmethods[0].columnData;

        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }
    getDefaultVendorName(id) {
        for (let i = 0; i < this.allVendorInfo.length; i++) {
            if (id == this.allVendorInfo[i].vendorId)
                return this.allVendorInfo[i].vendorName;
        }
    }
    getwarrantystatus(id) {
        for (let i = 0; i < this.assetwarrantystatusList.length; i++) {
            if (id == this.assetwarrantystatusList[i].value)
                return this.assetwarrantystatusList[i].label;
        }
    }
    openViewData(content, row) {
        this.assetViewList = row;
        this.assetViewList.showIsActive=this.assetViewList.isActive;
        this.assetViewList.depreOrIntang = row.isDepreciable == true ? 'Tangible' : 'Intangible';
        this.assetViewList.manufacturerName = row.manufacturer ? row.manufacturer.name : "";
        this.assetViewList.currencyId = row.currency ? row.currency.code : '';
        this.assetViewList.calibrationDefaultCost = row.calibrationDefaultCost ? formatNumberAsGlobalSettingsModule(row.calibrationDefaultCost, 2) : "";
        this.assetViewList.certificationDefaultCost = row.certificationDefaultCost ? formatNumberAsGlobalSettingsModule(row.certificationDefaultCost, 2) : "";
        this.assetViewList.inspectionDefaultCost = row.inspectionDefaultCost ? formatNumberAsGlobalSettingsModule(row.inspectionDefaultCost, 2) : "";
        this.assetViewList.verificationDefaultCost = row.verificationDefaultCost ? formatNumberAsGlobalSettingsModule(row.verificationDefaultCost, 2) : "";
        this.assetViewList.residualPer = row.residualPer ? formatNumberAsGlobalSettingsModule(row.residualPer, 2) : "";
        this.assetViewList.unitOfMeasureId = this.getUOMName(row.unitOfMeasureId);
        this.assetViewList.assetTypeId = row.assetType ? row.assetType.assetTypeName : "";
        this.assetRecordId = row.assetRecordId;
        this.selectedCol = this.cols1;
        this.assetViewList.unitCost = row.unitCost ? formatNumberAsGlobalSettingsModule(row.unitCost, 2) : "";
       if (!this.isWorkOrder) {
            this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, windowClass: 'assetMange' });

        }
    }
    isSpinnerVisibleView: boolean = false;
    submittedAlready = false;
    openView(content, row) {
        if (this.submittedAlready) {
            return false;
        }
        else {
            this.submittedAlready = true;
            this.isSpinnerVisibleView = true;
            this.assetService.getByAssetId(row.assetRecordId).subscribe(res => {
                setTimeout(() => {
                    this.submittedAlready = false;
                    this.isSpinnerVisibleView = false;
                }, 1500);
                this.openViewData(content, Object.assign({}, ...res));
            }, err => {
                this.isSpinnerVisibleView = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }

    }

    getDeprFrequencyName(id) {
        for (let i = 0; i < this.depreciationFrequencyList.length; i++) {
            if (id == this.depreciationFrequencyList[i].value)
                return this.depreciationFrequencyList[i].label;
        }
    }
    getUOMName(id) {
        for (let i = 0; i < this.allUnitOfMeasureinfo.length; i++) {
            if (id == this.allUnitOfMeasureinfo[i].unitOfMeasureId)
                return this.allUnitOfMeasureinfo[i].shortName;
        }
    }
    getGLAccountName(id) {
        for (let i = 0; i < this.GLAccountList.length; i++) {
            if (id == this.GLAccountList[i].glAccountId)
                return this.GLAccountList[i].accountName;
        }
    }
    getGLAccountCode(id) {
        for (let i = 0; i < this.GLAccountList.length; i++) {
            if (id == this.GLAccountList[i].glAccountId)
                return this.GLAccountList[i].accountCode;
        }
    }
    onSuccessfulAssetType(audits: any[]) {
        if (audits && audits[0]) {
            this.assetViewList.assetAttributeTypeId = audits[0].assetAttributeTypeId;
            this.assetViewList.assetAttributeTypeName = audits[0].assetAttributeTypeName;
            this.assetViewList.conventionType = audits[0].conventionType;
            this.assetViewList.depreciationMethod = audits[0].depreciationMethod;
            this.assetViewList.residualPercentage = audits[0].residualPercentage ? formatNumberAsGlobalSettingsModule(audits[0].residualPercentage, 2) : "";
            this.assetViewList.residualValue = audits[0].residualValue;
            this.assetViewList.assetLife = audits[0].assetLife;
            this.assetViewList.depreciationFrequencyId = audits[0].depreciationFrequencyId;
            this.assetViewList.acquiredGLAccountId = audits[0].acquiredGLAccountId;
           this.assetViewList.deprExpenseGLAccountId = audits[0].deprExpenseGLAccountId;
           this.assetViewList.adDepsGLAccountId = audits[0].adDepsGLAccountId;
            this.assetViewList.assetSale = audits[0].assetSale;
            this.assetViewList.assetWriteOff = audits[0].assetWriteOff;
           this.assetViewList.assetWriteDown = audits[0].assetWriteDown;
            this.assetViewList.createdBy = audits[0].createdBy;
            this.assetViewList.updatedBy = audits[0].updatedBy;
            this.assetViewList.createdDate = audits[0].createdDate;
            this.assetViewList.updatedDate = audits[0].updatedDate;
            this.assetViewList.isDelete = audits[0].isDelete;
            this.assetViewList.isActive = audits[0].isActive;
        }
    }
    openAllCollapse() {
        $('#step1').collapse('show');
        $('#step2').collapse('show');
        $('#step3').collapse('show');
        $('#step4').collapse('show');
    }
    closeAllCollapse() {
        $('#step1').collapse('hide');
        $('#step2').collapse('hide');
        $('#step3').collapse('hide');
        $('#step4').collapse('hide');
    }
    getAssetAcquisitionTypeList() {
        this.commonservice.smartDropDownList('AssetAcquisitionType', 'AssetAcquisitionTypeId','Name' ,'','',0,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.assetAcquisitionTypeList = res;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    getDepreciationFrequencyList() {
        this.commonservice.smartDropDownList('AssetDepreciationFrequency', 'AssetDepreciationFrequencyId','Name' ,'','',0,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.depreciationFrequencyList = res;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }

   exportCSV(dt) {
        this.isSpinnerVisible = true;
        const isdelete = this.currentDeletedstatus ? true : false;
        let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "status": this.currentstatus, "isDeleted": isdelete }, "globalFilter": "" }
        PagingData.globalFilter = this.globalFilterValue ? this.globalFilterValue : '';
        let filters = Object.keys(dt.filters);
        filters.forEach(x => {
            PagingData.filters[x] = dt.filters[x].value;
        })
        this.assetService.downloadAllAssetList(PagingData).subscribe(
            results => {
                this.loadingIndicator = false;
                dt._value = results['results'].map(x => {
                    return {
                        ...x,
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                        updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
                    }
                });
                dt.exportCSV();
                dt.value = this.allAssetInfo;
                this.isSpinnerVisible = false;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            }
        );
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
    allAssetInfoOriginal: any = [];
    dateObject: any = {}
    dateFilterForTable(date, field) {
        this.dateObject = {}
        date = moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
        if (date != "" && moment(date, 'MM/DD/YYYY', true).isValid()) {
            if (field == 'createdDate') {
                this.dateObject = { 'createdDate': date }
            } else if (field == 'updatedDate') {
                this.dateObject = { 'updatedDate': date }
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.loadData(PagingData);
        } else {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate) {
                delete this.lazyLoadEventDataInput.filters.createdDate;
            }
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate) {
                delete this.lazyLoadEventDataInput.filters.updatedDate;
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.loadData(PagingData);
        }
    }
}