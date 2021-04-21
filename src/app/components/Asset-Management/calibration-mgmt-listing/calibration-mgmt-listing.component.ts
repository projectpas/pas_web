import { AuthService } from './../../../services/auth.service';
import { Component, OnInit, Input, NgModule } from '@angular/core';
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
declare var $ : any;
import { formatNumberAsGlobalSettingsModule,listSearchFilterObjectCreation } from '../../../generic/autocomplete';
import { ConfigurationService } from '../../../services/configuration.service';

import { AssetLocationService } from './../../../services/asset-location/asset-location.service';
import { DatePipe } from '@angular/common';
import { DepriciationMethodService } from './../../../services/depriciation-method/depriciation.service';
import { DepreciationIntervals } from './../../../models/depriciationIntervals.model';
import { VendorEndpointService } from './../../../services/vendor-endpoint.service';
import { VendorService } from './../../../services/vendor.service';
import { AssetAcquisitionTypeService } from './../../../services/asset-acquisition-type/asset-acquisition-type.service';
import { GlAccountService } from './../../../services/glAccount/glAccount.service';
import { UnitOfMeasureService } from 'src/app/services/unitofmeasure.service';
import * as moment from 'moment';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-calibration-mgmt-listing',
  templateUrl: './calibration-mgmt-listing.component.html',
  styleUrls: ['./calibration-mgmt-listing.component.scss'],
  animations: [fadeInOut],
  providers:[DatePipe]
})
export class CalibrationMgmtListingComponent implements OnInit {

  breadcrumbs: MenuItem[];

  cols = [
    { field: 'assetId', header: 'Asset ID', colspan: '1' },
    { field: 'assetName', header: 'Asset Name', colspan: '1' },
    { field: 'altAssetId', header: 'Alt Asset ID', colspan: '1' },
    { field: 'serialNum', header: 'Serial Num', colspan: '1' },
    { field: 'controlName', header: 'Control Num', colspan: '1' },
    { field: 'itemtype', header: 'Item Type', colspan: '1' },
    { field: 'companyName', header: 'Level 01', colspan: '1' },
    { field: 'buName', header: 'Level 02', colspan: '1' },
    { field: 'deptName', header: 'Level 03', colspan: '1' },
    { field: 'divName', header: 'Level 04', colspan: '1' },
    { field: 'assetType', header: 'Asset Type', colspan: '1' },
    { field: 'certifyType', header: 'Certify Type', colspan: '1' },
    { field: 'uOM', header: 'UOM', colspan: '1' },
    { field: 'qty', header: 'Qty', colspan: '1' },
    { field: 'currencyName', header: 'Currency', colspan: '1' },
    { field: 'unitCost', header: 'Updated Cost', colspan: '1' },
    { field: 'inservicesdate', header: 'In Service Date', colspan: '1' },
    { field: 'assetStatus', header: 'Asset Status', colspan: '1' },
    { field: 'lastCalibrationDate', header: 'Last Calibration Date', colspan: '1' },
    { field: 'lastcalibrationby', header: 'Last Calibrated by', colspan: '1' },
    { field: 'lastcalibrationmemo', header: 'Last Calibration Notes', colspan: '1' },
    { field: 'nextCalibrationDate', header: 'Next Calibration Date', colspan: '1' },
    { field: 'lastcheckedinby', header: 'Last Checked IN By', colspan: '1' },
    { field: 'lastcheckedindate', header: 'Last Checked IN Date', colspan: '1' },
    { field: 'lastcheckedinmemo', header: 'Last Checked IN Memo', colspan: '1' },
    { field: 'lastcheckedoutdate', header: 'Last Checked OUT Date', colspan: '1' },
    { field: 'lastcheckedoutby', header: 'Last Checked OUT By', colspan: '1' },
    { field: 'lastcheckedoutmemo', header: 'Last Checked OUT Memo', colspan: '1' },
    { field: 'locations', header: 'Locaton' , colspan: '1'},
    // { field: 'createdDate', header: 'Created Date' },
    // { field: 'createdBy', header: 'Created By' },
    // { field: 'updatedDate', header: 'Updated Date' },
    // { field: 'updatedBy', header: 'Updated By' },
    // { field: 'updatedBy', header: 'Locaton' },
]; 
isSaving: boolean;
activeIndex: number;
assetViewList: any = {};
currentAsset: any = {};
modal: NgbModalRef;
historyModal: NgbModalRef;
private isDeleteMode: boolean = false;
private isEditMode: boolean = false;
selectedRows:any=[];
manufacturerId: any;
currencyId: any;
Calibrationtype:string = 'Calibration';
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
//depriciationMethodList: DepriciationMethod[] = [];
depreciationFrequencyList: any[] = [];
assetAcquisitionTypeList: any[] = [];
GLAccountList: any[] = [];
//allCapesInfo: ItemMasterCapabilitiesModel[] = [];
//allVendorInfo: Vendor[] = [];
historyData: any[] = [];
selectedAsset: any;
allAssetLocationInfo: any[] = [];
allAssetLocations: any[] = [];
assetwarrantystatusList: any[] = [];
allUnitOfMeasureinfo: any[] = [];
lazyLoadEventData: any;
pageNumber = 0;
home: any;
isIntangible: any;
auditHistory: any[] = [];
lazyLoadEventDataInput: any;
status: string = 'active';
currentDeletedstatus:boolean=false;
currentstatus: string = 'Active';
selectedOnly: boolean = false;
targetData: any;
    /** Asset-listing ctor */
    loadingIndicator: boolean;
    allcalibrationinfo: any[] = [];
    allcalibrationinfoNew: any[] = [];
    // cols: { field: string; header: string; colspan: string }[];
    cols1: { field: string; header: string; }[];
    selectedColumns: { field: string; header: string; }[];
    selectedCapesColumns: { field: string; header: string; }[];
    selectedCol: { field: string; header: string; }[];
    data: any;
    managementStructure: any = {};
    isSpinnerVisible: boolean = true;

  constructor(
    private alertService: AlertService, public assetService: AssetService, private _route: Router,
        private modalService: NgbModal, private glAccountService: GlAccountService,
        public assetattrService1: AssetAcquisitionTypeService, private vendorService: VendorService,
        private vendorEndpointService: VendorEndpointService, private depriciationMethodService: DepriciationMethodService, private commonservice: CommonService,
        private datePipe: DatePipe,
        private assetLocationService: AssetLocationService, private authService: AuthService, public unitService: UnitOfMeasureService
  ) { }

  ngOnInit() {

    this.breadcrumbs = [
      { label: 'Asset Management' },
      { label: 'Calibration Management' },
  ];
  this.activeIndex = 0;
  this.assetService.ShowPtab = false;
  this.assetService.alertObj.next(this.assetService.ShowPtab); //steps
  this.assetService.indexObj.next(this.activeIndex);
  this.selectedColumns = this.cols;
  }

  private loadData(data) {
    this.lazyLoadEventDataInput = data;
    const isdelete=this.currentDeletedstatus ? true:false;
    data.filters.isDeleted=isdelete
        data.filters['status'] = this.status ? this.status : 'Active';
        data.globalFilter= data.globalFilter ? data.globalFilter : '';
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
      this.isSpinnerVisible=true;
    this.assetService.GetCalibarationMgmtList(PagingData).subscribe(
        results =>{
            this.onDataLoadSuccessful(results[0])
        },err=>{
            this.isSpinnerVisible = false;
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        }
    );

}
allCalibrationinfoOriginal:any=[];
private onDataLoadSuccessful(allWorkFlows) {
    this.isSpinnerVisible = false;
    this.allcalibrationinfo = allWorkFlows.results;

    this.allcalibrationinfo.forEach(x=>{

           x.createdDate=x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy h:mm a'): '';
                       x.updatedDate=x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy h:mm a'): '';
       
                             })
    this.allCalibrationinfoOriginal=this.allcalibrationinfo;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.totalRecords = allWorkFlows.totalRecordsCount;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
}
onDataLoad(event: { first: any; rows: number }) {
  const pageIndex = parseInt(event.first) / event.rows;
  this.pageIndex = pageIndex;
  this.pageSize = event.rows; //10
  event.first = pageIndex;
  this.currentstatus=this.currentstatus ? this.currentstatus :"Active"
  this.loadData(event);
}

dateObject:any={}
dateFilterForTable(date, field) {
this.dateObject={}
    date=moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY')

if(date !="" && moment(date, 'MM/DD/YYYY',true).isValid()){
if(field=='createdDate'){
    this.dateObject={'createdDate':date}
}else if(field=='updatedDate'){
    this.dateObject={'updatedDate':date}
}

this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters ,...this.dateObject};
const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
this.loadData(PagingData); 
}else{

this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,...this.dateObject};
if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate){
    delete this.lazyLoadEventDataInput.filters.createdDate;
}
if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate){
    delete this.lazyLoadEventDataInput.filters.updatedDate;
}
    const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
    this.loadData(PagingData); 
}
  
}
viewSelectedRowdbl(rowData) {
  this.openView(rowData);
  $('#invView').modal('show');
}
assetInventoryId:any;
openView(row) {
    
    this.isSpinnerVisibleHistory = true;
    if(row && row.assetInventoryId !=undefined){
    this.assetService.getByInventoryId(row.assetInventoryId).subscribe(res => {
       if(res){
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

      
        
        this.assetInventoryId=row.assetInventoryId
        setTimeout(()=>{
            this.isSpinnerVisibleHistory = false;
        },1000)
    },err=>{
        this.isSpinnerVisibleHistory = false;
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
          if(asset && asset.assetInventoryId !=undefined){
          this.assetService.updateAssetInventoryListing(asset.assetInventoryId, this.Active,this.userName).subscribe(asset => {
              this.alertService.showMessage("Success", `Asset Inventory Type updated successfully.`, MessageSeverity.success);
              this.status=this.status;
              this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters };
              const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
              this.loadData(PagingData);
          },err=>{
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
          if(asset && asset.assetInventoryId !=undefined){
          this.assetService.updateAssetInventoryListing(asset.assetInventoryId, this.Active,this.userName).subscribe(asset => {
              this.alertService.showMessage("Success", `Asset Inventory Type updated successfully.`, MessageSeverity.success);
              // this.assetService.getAssetInventoryList().subscribe(assets => {
              //     this.allAssetInfo = assets[0];
              //     //this.loadManagementdata();
              //     //this.loadData();
              // });
              this.status=this.status;
              this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters };
              const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
              this.loadData(PagingData);
          },err=>{
              this.isSpinnerVisible = false;
              const errorLog = err;
              this.errorMessageHandler(errorLog);
          })
      }
  }
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

restorerecord:any={};
restore(content, rowData) {
    this.restorerecord = rowData;
    this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    this.modal.result.then(() => {
    }, () => {  })
}

dismissModel() {
    this.isDeleteMode = false;
    this.isEditMode = false;
    this.modal.close();
}

  openDelete(content, row) {
      this.pageNumber = 0;
      this.isEditMode = false;
      this.isDeleteMode = true;
      this.assetService.listCollection = row;
      this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
      this.modal.result.then(() => {
      }, () => {  })
  }
  isSpinnerVisibleHistory:boolean=false;
  showhistorylist:boolean=false
  openHistory(row) {
      this.isIntangible = null;
      if(row && row.assetInventoryId !=undefined){
          this.isSpinnerVisibleHistory=true;
      this.assetService.getAuditDataByInventoryId(row.assetInventoryId).subscribe(res => {

      if(res && res.length !=0){
          this.showhistorylist=true;
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

geListByStatus(status) {
  this.status = status;
  this.selectedRows=[];
 this.pageNumber = 0;
  this.pageIndex = 0;
  this.lazyLoadEventDataInput.first = this.pageIndex;
  this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status, pageIndex: 1 }; 
  // const PagingData = { ...this.lazyLoadEventDataInput, filters:{status: status,pageIndex: 1} }
  this.loadData(this.lazyLoadEventDataInput);
}
getDeleteListByStatus(value){
  this.selectedRows=[];
  this.currentDeletedstatus=true;
  const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
  this.pageIndex = pageIndex;
  this.pageSize = this.lazyLoadEventDataInput.rows;
  this.lazyLoadEventDataInput.first = pageIndex;
  this.status = status;
  if(value==true){

      this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters};
      const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
      this.loadData(PagingData);
  }else{
      this.currentDeletedstatus=false;

      this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters };
      const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
      this.loadData(PagingData);
  }
}
public navigateTogeneralInfo() {
  this.assetService.isEditMode = false;
  this.assetService.enableExternal = false;
  this._route.navigateByUrl('assetmodule/assetpages/app-create-asset-inventory');

}

errorMessageHandler(log) {
  this.isSpinnerVisible=false;
}



}
