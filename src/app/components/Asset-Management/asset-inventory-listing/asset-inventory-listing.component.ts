import { Component, OnInit, Input } from '@angular/core';
//import { AlertService } from '../../../services/alert.service';
import { AssetService } from '../../../services/asset/Assetservice';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fadeInOut } from '../../../services/animations';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { Vendor } from '../../../models/vendor.model';
import { DepriciationMethod } from '../../../models/depriciation-method.model';
import { CommonService } from '../../../services/common.service';
import { ItemMasterCapabilitiesModel } from '../../../models/itemMasterCapabilities.model';
// declare var $ : any; 
declare var $: any;
import { listSearchFilterObjectCreation, formatNumberAsGlobalSettingsModule } from '../../../generic/autocomplete';
import { ConfigurationService } from '../../../services/configuration.service';
import * as moment from 'moment';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';
@Component({
    selector: 'app-asset-inventory-listing',
    templateUrl: './asset-inventory-listing.component.html',
    styleUrls: ['./asset-inventory-listing.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
/** Asset-listing component*/
export class AssetInventoryListingComponent implements OnInit {
    @Input() isWorkOrder = false;
    allDocumentsListColumns: any[] = [

        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'docMemo', header: 'Memo' },

        { field: "fileName", header: "File Name" },
        { field: 'fileSize', header: 'File Size' },

        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'CreatedBy' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'UpdatedBy' },
        { field: 'download', header: 'Actions' },
        // { field: 'delete', header: 'Delete' },
    ];
    allDocumentsList: any = [];
    allDocumentsListWarranty: any = [];
    sourceViewforDocumentAudit: any = [];

    isSaving: boolean;
    activeIndex: number;
    assetViewList: any = {};
    currentAsset: any = {};
    modal: NgbModalRef;
    adjAuditHistoryList: any = [];
    adjAuditHistoryData: any = [];
    historyModal: NgbModalRef;
    private isDeleteMode: boolean = false;
    private isEditMode: boolean = false;
    selectedRows: any = [];
    manufacturerId: any;
    currencyId: any;
    glAccountId: any;
    Active: string;
    assetTypeToUpdate: any;
    unitOfMeasureId: any;
    assetTypeId: any;
    selectedColumn: any;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    totalRecords1: any;
    pageIndex1: number = 0;
    pageSize1: number = 10;
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
    historyData: any[] = [];
    selectedAsset: any;
    allAssetLocationInfo: any[] = [];
    allAssetLocations: any[] = [];
    assetwarrantystatusList: any[] = [];
    allUnitOfMeasureinfo: any[] = [];
    lazyLoadEventData: any;
    pageNumber = 0;
    home: any;
    breadcrumbs: MenuItem[];
    auditHistory: any[] = [];
    lazyLoadEventDataInput: any;
    status: string = 'active';
    currentDeletedstatus: boolean = false;
    currentstatus: string = 'Active';
    selectedOnly: boolean = false;
    targetData: any;
    cols = [
        { field: 'inventoryNumber', header: 'Inventory Num', colspan: '1' },
        { field: 'name', header: 'Asset Name', colspan: '1' },
        { field: 'assetId', header: 'Asset ID', colspan: '1' },
        { field: 'alternateAssetId', header: 'Alt Asset ID', colspan: '1' },
        { field: 'manufacturerName', header: 'Manufacturer', colspan: '1' },
        { field: 'serialNumber', header: 'Ser Num', colspan: '1' },
        { field: 'calibrationRequiredNew', header: 'Calibrated', colspan: '1' },
        { field: 'assetStatus', header: 'Asset Status', colspan: '1' },

        { field: 'inventoryStatus', header: 'Inventory Status', colspan: '1' },
        //{ field: 'managementStrName', header: 'Management Structure', colspan: '4' },
        /*{ field: 'buName', header: 'BU' },
        { field: 'deptName', header: 'Div' },
        { field: 'divName', header: 'Dept' },*/
        { field: 'assetClass', header: 'Asset Category', colspan: '1' },
        { field: 'assetType', header: 'Asset Class', colspan: '1' },
        { field: 'companyName', header: 'Level 01', colspan: '1' },
        { field: 'buName', header: 'Level 02', colspan: '1' },
        { field: 'deptName', header: 'Level 03', colspan: '1' },
        { field: 'divName', header: 'Level 04', colspan: '1' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },
        //{ field: 'assetStatus', header: 'Status', colspan: '1' },
    ];

    historyCols = [
        { field: 'overview', header: 'Changes Overview', width: '150px' },
        { field: 'updatedBy', header: 'Last Updated By', width: '100px' },
        { field: 'updatedTime', header: 'Last Updated Time', width: '100px' },
    ];
    /** Asset-listing ctor */
    loadingIndicator: boolean;
    allAssetInfo: any[] = [];
    allAssetInfoNew: any[] = [];
    // cols: { field: string; header: string; colspan: string }[];
    cols1: { field: string; header: string; }[];
    selectedColumns: { field: string; header: string; }[];
    selectedCapesColumns: { field: string; header: string; }[];
    selectedCol: { field: string; header: string; }[];
    data: any;
    managementStructure: any = {};
    isSpinnerVisible: boolean = true;
    customerDocumentsColumns = [
        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'docMemo', header: 'Memo' },
        { field: 'fileName', header: 'File Name' },
        { field: 'fileSize', header: 'File Size' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },
    ];
    selectedColumnsDoc = this.customerDocumentsColumns;
    pageSizeNew: number = 3;
    sourceViewforDocumentList: any = [];
    allDocumentListOriginal: any = [];
    sourceViewforDocumentListWarranty: any = [];
    allDocumentListOriginalWarranty: any = [];
    sourceViewforDocumentListInt: any = [];
    allDocumentListOriginalInt: any = [];
    capesCols = [
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'captypedescription', header: 'Capability Type' },
        { field: 'manufacturer', header: 'Aircraft Manufacturer' },
        { field: 'modelname', header: 'Models' },
        { field: 'dashnumber', header: 'Dash Number' }
    ];
    capesSelectedColumns = this.capesCols;
    isIntangible: any;
    maintanancemoduleName='AssetInventoryMaintenanceFile';
    warrantymoduleName='AssetInventoryWarrantyFile';
    intangiblemoduleName='AssetInventoryIntangibleFile';
    public isActive: boolean = false;
    public isActiveView: boolean = false;
    isAdd:boolean=true;
    isEdit:boolean=true;
    isDelete:boolean=true;
    isView:boolean=true;
    isDownload:boolean=true;
    constructor(private alertService: AlertService, private authService: AuthService, private datePipe: DatePipe,   private commonService: CommonService,public assetService: AssetService, private _route: Router, private modalService: NgbModal, private commonservice: CommonService, private configurations: ConfigurationService) {
        this.isAdd=this.authService.checkPermission([ModuleConstants.Asset_Inventory_Create+'.'+PermissionConstants.Add]);
        this.isEdit=this.authService.checkPermission([ModuleConstants.Asset_Inventory_Create+'.'+PermissionConstants.Update]);
        this.isView=this.authService.checkPermission([ModuleConstants.Asset_Inventory_List+'.'+PermissionConstants.View]);
        this.isActive=this.authService.checkPermission([ModuleConstants.Asset_Inventory_Create+'.'+PermissionConstants.Update]);
        this.isDelete=this.authService.checkPermission([ModuleConstants.Asset_Inventory_Create+'.'+PermissionConstants.Delete]);
        this.isDownload=this.authService.checkPermission([ModuleConstants.Asset_Inventory_List+'.'+PermissionConstants.Download])
    }

    ngOnInit(): void {
        this.breadcrumbs = [
            { label: 'Asset Inventory' },
            { label: 'Asset Inventory List' },
        ];
        this.activeIndex = 0;
        this.assetService.ShowPtab = false;
        this.assetService.alertObj.next(this.assetService.ShowPtab); //steps
        this.assetService.indexObj.next(this.activeIndex);
        this.selectedColumns = this.cols;
    }

    changePage(event: { first: any; rows: number }) {
        const pageIndex = (event.first / event.rows);
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
    allAssetInfoOriginal: any = [];
    private onDataLoadSuccessful(allWorkFlows) {
        this.isSpinnerVisible = false;
        this.allAssetInfo = allWorkFlows.results;

        this.allAssetInfo.forEach(x => {

            x.createdDate = x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy h:mm a') : '';
            x.updatedDate = x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy h:mm a') : '';

        })
        this.allAssetInfoOriginal = this.allAssetInfo;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.totalRecords = allWorkFlows.totalRecordsCount;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    closeDeleteModal() {
        $("#downloadConfirmation").modal("hide");
    }

    geListByStatus(status) {
        this.status = status;
        this.selectedRows = [];
        this.pageNumber = 0;
        this.pageIndex = 0;
        this.lazyLoadEventDataInput.first = this.pageIndex;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status, pageIndex: 1 };
        // const PagingData = { ...this.lazyLoadEventDataInput, filters:{status: status,pageIndex: 1} }
        this.loadData(this.lazyLoadEventDataInput);
    }
    getDeleteListByStatus(value) {
        this.selectedRows = [];
        this.currentDeletedstatus = true;
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.status = status;
        if (value == true) {

            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.loadData(PagingData);
        } else {
            this.currentDeletedstatus = false;

            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.loadData(PagingData);
        }
    }

    onDataLoad(event: { first: any; rows: number }) {
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows; //10
        event.first = pageIndex;
        this.currentstatus = this.currentstatus ? this.currentstatus : "Active"
        this.loadData(event);
    }

    private loadData(data) {
        this.lazyLoadEventDataInput = data;
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete
        data.filters['status'] = this.status ? this.status : 'Active';
        data.globalFilter = data.globalFilter ? data.globalFilter : '';
        data.filters.masterCompanyId = this.authService.currentUser.masterCompanyId;
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.isSpinnerVisible = true;
        this.assetService.getAssetInventoryList(PagingData).subscribe(
            results => {
                this.onDataLoadSuccessful(results[0])
            }, err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            }
        );



    }
    dateObject: any = {}
    dateFilterForTable(date, field) {
        this.dateObject = {}
        date = moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY')

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
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.loadData(PagingData);
        }

    }

    public navigateTogeneralInfo() {
        this.assetService.isEditMode = false;
        this.assetService.enableExternal = false;
        this._route.navigateByUrl('assetmodule/assetpages/app-create-asset-inventory');

    }


    openAssetToEdit(row) {
        this.assetService.isEditMode = true;
        this.isSaving = true;
        // this.assetService.currentAssetId = row.assetRecordId;
        this.assetService.listCollection = row;
        const { assetId } = row;
        this._route.navigateByUrl(`assetmodule/assetpages/app-edit-asset-inventory/${row.assetInventoryId}`);
    }
    openAssetToAdjustment(row) {

        // this.assetService.currentAssetId = row.assetRecordId;
        this.assetService.listCollection = row;
        const { assetId } = row;
        this._route.navigateByUrl(`assetmodule/assetpages/app-asset-adjustment/${row.assetInventoryId}`);
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    removeAsset(): void {
        this.pageNumber = 0;
        if (this.assetService.listCollection && this.assetService.listCollection.assetInventoryId != undefined) {
            this.assetService.removeAssetInventory(this.assetService.listCollection.assetInventoryId).subscribe(response => {
                //this.alertService.showMessage("Asset removed successfully.");
                this.alertService.showMessage("Success", `Asset Inventory removed successfully.`, MessageSeverity.success);
                this.modal.close();
                this.status = this.status;
                this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters };
                const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                this.loadData(PagingData);
            }, err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });

        }
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    toggleIsActive(asset: any, e) {
        this.pageNumber = 0;
        if (e.checked == false) {
            this.assetTypeToUpdate = asset;
            this.Active = "In Active";
            this.assetTypeToUpdate.isActive == false;
            if (asset && asset.assetInventoryId != undefined) {
                this.assetService.updateAssetInventoryListing(asset.assetInventoryId, this.Active, this.userName).subscribe(asset => {
                    this.alertService.showMessage("Success", `Asset Inventory Type updated successfully.`, MessageSeverity.success);
                    this.status = this.status;
                    this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters };
                    const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                    this.loadData(PagingData);
                }, err => {
                    this.isSpinnerVisible = false;
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                })
            }
        }
        else {
            this.assetTypeToUpdate = asset;
            this.Active = "Active";
            this.assetTypeToUpdate.isActive == true;
            if (asset && asset.assetInventoryId != undefined) {
                this.assetService.updateAssetInventoryListing(asset.assetInventoryId, this.Active, this.userName).subscribe(asset => {
                    this.alertService.showMessage("Success", `Asset Inventory Type updated successfully.`, MessageSeverity.success);
                    // this.assetService.getAssetInventoryList().subscribe(assets => {
                    //     this.allAssetInfo = assets[0];
                    //     //this.loadManagementdata();
                    //     //this.loadData();
                    // });
                    this.status = this.status;
                    this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters };
                    const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                    this.loadData(PagingData);
                }, err => {
                    this.isSpinnerVisible = false;
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                })
            }
        }
    }

    openDelete(content, row) {
        this.pageNumber = 0;
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.assetService.listCollection = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { })
    }
    isSpinnerVisibleHistory: boolean = false;
    showhistorylist: boolean = false
    openHistory(row) {
        this.isIntangible = null;
        if (row && row.assetInventoryId != undefined) {
            this.isSpinnerVisibleHistory = true;
            this.assetService.getAuditDataByInventoryId(row.assetInventoryId).subscribe(res => {

                if (res && res.length != 0) {
                    this.showhistorylist = true;
                    this.auditHistory = res.map(x => {
                        return {
                            ...x,
                            unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '',
                            residualPercentage: x.residualPercentage ? formatNumberAsGlobalSettingsModule(x.residualPercentage, 2) : '',
                            installationCost: x.installationCost ? formatNumberAsGlobalSettingsModule(x.installationCost, 2) : '',
                            freight: x.freight ? formatNumberAsGlobalSettingsModule(x.freight, 2) : '',
                            insurance: x.insurance ? formatNumberAsGlobalSettingsModule(x.insurance, 2) : '',
                            taxes: x.taxes ? formatNumberAsGlobalSettingsModule(x.taxes, 2) : '',
                            totalCost: x.totalCost ? formatNumberAsGlobalSettingsModule(x.totalCost, 2) : '',
                            calibrationDefaultCost: x.calibrationDefaultCost ? formatNumberAsGlobalSettingsModule(x.calibrationDefaultCost, 2) : '',
                            certificationDefaultCost: x.certificationDefaultCost ? formatNumberAsGlobalSettingsModule(x.certificationDefaultCost, 2) : '',
                            inspectionDefaultCost: x.inspectionDefaultCost ? formatNumberAsGlobalSettingsModule(x.inspectionDefaultCost, 2) : '',
                            verificationDefaultCost: x.verificationDefaultCost ? formatNumberAsGlobalSettingsModule(x.verificationDefaultCost, 2) : '',
                        }
                    });
                    this.isIntangible = this.auditHistory[0].isIntangible;
                } else {
                    this.showhistorylist = false;
                }

                this.isSpinnerVisibleHistory = false;
            }, err => {
                this.isSpinnerVisibleHistory = false;
                this.isSpinnerVisible = false;
                this.showhistorylist = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
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

    viewSelectedRowdbl(rowData) {
        this.openView(rowData);
        $('#invView').modal('show');
    }

    assetInventoryId: any;
    openView(row) {

        this.isSpinnerVisibleHistory = true;
        if (row && row.assetInventoryId != undefined) {
            this.assetService.getByInventoryId(row.assetInventoryId).subscribe(res => {
                if (res) {
                    this.currentAsset = {
                        ...res,
                        isTangible: !res.isIntangible,
                        entryDate: res.entryDate ? new Date(res.entryDate) : null,
                        manufacturedDate: res.manufacturedDate ? new Date(res.manufacturedDate) : null,
                        expirationDate: res.expirationDate ? new Date(res.expirationDate) : null,
                        unitCost: res.unitCost ? formatNumberAsGlobalSettingsModule(res.unitCost, 2) : '',
                        installationCost: res.installationCost ? formatNumberAsGlobalSettingsModule(res.installationCost, 2) : '',
                        freight: res.freight ? formatNumberAsGlobalSettingsModule(res.freight, 2) : '',
                        insurance: res.insurance ? formatNumberAsGlobalSettingsModule(res.insurance, 2) : '',
                        taxes: res.taxes ? formatNumberAsGlobalSettingsModule(res.taxes, 2) : '',
                        totalCost: res.totalCost ? formatNumberAsGlobalSettingsModule(res.totalCost, 2) : '',
                        calibrationDefaultCost: res.calibrationDefaultCost ? formatNumberAsGlobalSettingsModule(res.calibrationDefaultCost, 2) : '',
                        certificationDefaultCost: res.certificationDefaultCost ? formatNumberAsGlobalSettingsModule(res.certificationDefaultCost, 2) : '',
                        inspectionDefaultCost: res.inspectionDefaultCost ? formatNumberAsGlobalSettingsModule(res.inspectionDefaultCost, 2) : '',
                        verificationDefaultCost: res.verificationDefaultCost ? formatNumberAsGlobalSettingsModule(res.verificationDefaultCost, 2) : '',
                        warrantyStartDate: res.warrantyStartDate ? new Date(res.warrantyStartDate) : null,
                        warrantyEndDate: res.warrantyEndDate ? new Date(res.warrantyEndDate) : null,
                    };
                }



                this.assetInventoryId = row.assetInventoryId
                setTimeout(() => {
                    this.isSpinnerVisibleHistory = false;
                }, 1000)
            }, err => {
                this.isSpinnerVisibleHistory = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }

    getManagementStructureCodes(id) {
        if (id) {
            this.commonService.getManagementStructureCodes(id).subscribe(res => {
                if (res.Level1) {
                    this.managementStructure.level1 = res.Level1;
                } else {
                    this.managementStructure.level1 = '-';
                }
                if (res.Level2) {
                    this.managementStructure.level2 = res.Level2;
                } else {
                    this.managementStructure.level2 = '-';
                }
                if (res.Level3) {
                    this.managementStructure.level3 = res.Level3;
                } else {
                    this.managementStructure.level3 = '-';
                }
                if (res.Level4) {
                    this.managementStructure.level4 = res.Level4;
                } else {
                    this.managementStructure.level4 = '-';
                }
                this.isSpinnerVisible = false;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }
    toGetDocumentsListNew(id) {
        var moduleId = 54;
        if (id) {
            this.commonService.GetDocumentsListNewAsset(id, moduleId, this.maitananceeletedList, this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.sourceViewforDocumentList = res || [];
                this.allDocumentListOriginal = res;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }
    toGetDocumentsListWarranty(id) {
        var moduleId = 55;
        if (id) {
            this.commonService.GetDocumentsListNewAsset(id, moduleId, this.warrentyDeletedList, this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.sourceViewforDocumentListWarranty = res || [];
                this.allDocumentListOriginalWarranty = res;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }
    toGetDocumentsListInt(id) {
        var moduleId = 56;
        if (id) {
            this.commonService.GetDocumentsListNewAsset(id, moduleId, this.intangibleDeletedList, this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.sourceViewforDocumentListInt = res || [];
                this.allDocumentListOriginalInt = res;

            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }

    dateFilterForTableNew(date, field) {
        if (date == '' || date == undefined) {
            this.sourceViewforDocumentList = this.allDocumentListOriginal;
        }
        this.sourceViewforDocumentList = this.allDocumentListOriginal;
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
    dateFilterForTableWarranty(date, field) {
        if (date == '' || date == undefined) {
            this.sourceViewforDocumentListWarranty = this.allDocumentListOriginalWarranty;
        }
        this.sourceViewforDocumentListWarranty = this.allDocumentListOriginalWarranty;
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

    dateFilterForTableInt(date, field) {
        if (date == '' || date == undefined) {
            this.sourceViewforDocumentListInt = this.allDocumentListOriginalInt;
        }
        this.sourceViewforDocumentList = this.allDocumentListOriginalInt;
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
            this.sourceViewforDocumentListInt = this.allDocumentListOriginalInt;
        }
    }

    openHistoryDoc(content, rowData) {
        this.alertService.startLoadingMessage();
        if (rowData && rowData.attachmentDetailId != undefined) {
            this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
                results => {
                    this.onAuditHistoryLoadSuccessful(results, content)
                }, err => {
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                }
            );
        }
    }
    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.sourceViewforDocumentAudit = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { })
    }

    getColorCodeForHistoryMain(i, field, value) {
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

    openCapes() {
        if (this.currentAsset.assetRecordId) {
            this.assetService.getcapabilityListData(this.currentAsset.assetRecordId).subscribe(res => {
                this.allCapesInfo = res[0];
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    downloadFileUpload(rowData) {

        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }
    onCloseView() {
        $('#invView').modal('hide');
        // this.modal.close();
    }

    AssethistoryCloseView() {
        $('#AssetAdjAudit').modal('hide');
        // this.modal.close();
    }

    getColorCodeForassetinvAdjHistory(i, field, value) {
        const data = this.adjAuditHistoryList;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    openAssetInventoryAdj(row) {
        this.assetService.getAssetInventoryAdjList(row.assetInventoryId).subscribe(res => {
            this.adjAuditHistoryList = res;
        }, error => this.errorMessageHandler(error))
    }

    restorerecord: any = {};
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { })
    }
    restoreRecord() {
        if (this.restorerecord && this.restorerecord.assetInventoryId != undefined) {
            this.commonService.updatedeletedrecords('AssetInventory', 'AssetInventoryId', this.restorerecord.assetInventoryId,).subscribe(res => {
                this.getDeleteListByStatus(true)
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
                this.modal.close();
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }
    exportCSV(dt) {
        this.isSpinnerVisible = true;
        const isdelete = this.currentDeletedstatus ? true : false;
        let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "status": this.currentstatus, "isDeleted": isdelete }, "globalFilter": "" }
        this.assetService.downloadAllAssetInventoryList(PagingData).subscribe(
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
    parsedText(text) {

        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }

    errorMessageHandler(log) {
        this.isSpinnerVisible = false;
    }

    isDeletedDocumentlist: boolean = false;
    warrentyDeletedList: boolean = false;
    intangibleDeletedList: boolean = false;
    maitananceeletedList: boolean = false;
    getDeleteListByStatusAttachments(value, type) {

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
    }
    currentAssetRecord: any = {};
    editInventoryStatus(currentRecord) {
        console.log("current record", currentRecord)
        this.currentAssetRecord = currentRecord;
        this.disabledInventoryStatus = true;
        this.getAssetInventoryStatusList();
    }
    updateInventoryStatus() {
        this.currentAssetRecord.updatedBy = 'admin';
        this.assetService.updateAssetInventoryStatus(this.currentAssetRecord).subscribe(res => {
            this.alertService.showMessage("Success", `Asset Inventory Status updated successfully.`, MessageSeverity.success);
            setTimeout(() => {
                this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters };
                const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                this.loadData(PagingData);
            }, 1000);

        });

    }
    getActiveStatus() {
        this.disabledInventoryStatus = false;
    }
    closeStatusModel() {
        $("#assetInventoryStatus").modal("hide");
    }
    disabledInventoryStatus: boolean = true;
    assetInventoryStatusList: any = [];
    setEditArray: any = [];
    getAssetInventoryStatusList() {
        this.setEditArray = [];
        this.setEditArray.push(this.currentAsset.inventoryStatusId);
        const strText = '';
        this.commonService.autoSuggestionSmartDropDownList('AssetInventoryStatus', 'AssetInventoryStatusId', 'Status', strText, true, 0, this.setEditArray.join(), this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.assetInventoryStatusList = res;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }
}