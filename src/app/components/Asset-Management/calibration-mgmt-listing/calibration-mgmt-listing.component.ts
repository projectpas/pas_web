import { EmployeeService } from './../../../services/employee.service';
import { FinancialStatementMappingComponent } from './../../financial-statement-mapping/financial-statement-mapping.component';
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
import { CalibrationMgmt } from '../../../models/calibration-mgmt.model'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs'
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';

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
    { field: 'assetId', header: 'Asset Identification', colspan: '1' },
    { field: 'assetName', header: 'Asset Name', colspan: '1' },
    { field: 'altAssetId', header: 'Alt Asset ID', colspan: '1' },
    { field: 'serialNum', header: 'Ser Num', colspan: '1' },
    { field: 'controlName', header: 'Cntrl Num', colspan: '1' },
    { field: 'itemtype', header: 'Item Type', colspan: '1' },
    { field: 'companyName', header: 'Level 01', colspan: '1' },
    { field: 'buName', header: 'Level 02', colspan: '1' },
    { field: 'deptName', header: 'Level 03', colspan: '1' },
    { field: 'divName', header: 'Level 04', colspan: '1' },
    { field: 'assetClass', header: 'Asset Type', colspan: '1' },
    { field: 'certifyType', header: 'Certify Type', colspan: '1' },
    { field: 'uOM', header: 'UOM', colspan: '1' },
    { field: 'qty', header: 'Qty', colspan: '1' },
    { field: 'currencyName', header: 'Curr', colspan: '1' },
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
private onDestroy$: Subject<void> = new Subject<void>();
isSaving: boolean;
activeIndex: number;
assetViewList: any = {};
currentAsset: any = {};
CalibrationId:number=0;
modal: NgbModalRef;
isscheduleprocess:boolean=false;
historyModal: NgbModalRef;
private isDeleteMode: boolean = false;
private isEditMode: boolean = false;
selectedRows:any=[];
allcalibrationbyidInfo: any = [];
manufacturerId: any;
currencyId: any;
Calibrationtype:string = 'Calibration';
glAccountId: any;
defultselectsch
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
Certifytype:string='Calibration';
allManagemtninfo: any[] = [];
bulist: any[] = [];
departmentList: any[] = [];
divisionlist: any[] = [];
maincompanylist: any[] = [];
allManufacturerInfo: any[] = [];
managementStructureData: any = [];
globalFilterValue: any;
selectvendororemp:string;
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
disableUpdate:boolean=true;
targetData: any;
allVendorInfo:any=[];
allemployeeInfo:any=[];
employeeList: any;
currentDate = new Date();
disableSaveForEdit: boolean = true;
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
    calibrationForm : any = {};
    viewcalibrationForm : any = {};
    CalibrationProcessHisory: any[];
    isSecurityAdd:boolean=true;
    isSecurityEdit:boolean=true;
    isSecurityDelete:boolean=true;
    isSecurityView:boolean=true;
    isSecurityDownload:boolean=true;
    isSecurityActive:boolean=true;

  constructor(
    private alertService: AlertService, public assetService: AssetService, private _route: Router,
        private modalService: NgbModal, private glAccountService: GlAccountService,
        public assetattrService1: AssetAcquisitionTypeService, private vendorService: VendorService,
        private vendorEndpointService: VendorEndpointService, private depriciationMethodService: DepriciationMethodService, private commonservice: CommonService,
        private datePipe: DatePipe,
        private assetLocationService: AssetLocationService, private authService: AuthService, public unitService: UnitOfMeasureService, private commonService: CommonService,
  ) {
    this.isSecurityAdd=this.authService.checkPermission([ModuleConstants.AssetMaintenance+'.'+PermissionConstants.Add]);
    this.isSecurityEdit=this.authService.checkPermission([ModuleConstants.AssetMaintenance+'.'+PermissionConstants.Update]);
    this.isSecurityView=this.authService.checkPermission([ModuleConstants.AssetMaintenance+'.'+PermissionConstants.View]);
    this.isSecurityActive=this.authService.checkPermission([ModuleConstants.AssetMaintenance+'.'+PermissionConstants.Update]);
    this.isSecurityDelete=this.authService.checkPermission([ModuleConstants.AssetMaintenance+'.'+PermissionConstants.Delete]);
    this.isSecurityDownload=this.authService.checkPermission([ModuleConstants.AssetMaintenance+'.'+PermissionConstants.Download])
   }

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
  this.getCurrencyList('');
  this.vendorList('');
  this.getAllEmployees('');
  }

  private loadData(data) {
    this.lazyLoadEventDataInput = data;
    const isdelete=this.currentDeletedstatus ? true:false;
    data.filters.isDeleted=isdelete
        data.filters['status'] = this.status ? this.status : 'Active';
        data.filters['certifytype'] = this.Certifytype ? this.Certifytype : 'calibration';
        data.filters.masterCompanyId= this.authService.currentUser.masterCompanyId;
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
           
           x.inservicesdate=x.inservicesdate ?  this.datePipe.transform(x.inservicesdate, 'MM/dd/yyyy h:mm a'): '';
           x.lastCalibrationDate=x.lastCalibrationDate ?  this.datePipe.transform(x.lastCalibrationDate, 'MM/dd/yyyy h:mm a'): '';
           x.nextCalibrationDate=x.nextCalibrationDate ?  this.datePipe.transform(x.nextCalibrationDate, 'MM/dd/yyyy h:mm a'): '';
           
           x.calibrationDate=x.calibrationDate ?  this.datePipe.transform(x.calibrationDate, 'MM/dd/yyyy h:mm a'): '';
           x.lastcheckedindate=x.lastcheckedindate ?  this.datePipe.transform(x.lastcheckedindate, 'MM/dd/yyyy h:mm a'): '';
       
           x.lastcheckedoutdate=x.lastcheckedoutdate ?  this.datePipe.transform(x.lastcheckedoutdate, 'MM/dd/yyyy h:mm a'): '';
       
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
setEditArray:any=[];
isEdit: boolean = false;
unitOfMeasureList: any = [];
currencyList: any = [];
private getCurrencyList(value) {
 
    this.setEditArray=[];
    this.setEditArray.push(0);
    // if(this.isEdit==true){
    //     this.freightForm.forEach(element => {
    //     if(element.currencyId){
    //         this.setEditArray.push(element.currencyId); 
    //     }
    //     });
    // }else{
    //     this.setEditArray.push(0);
    // }
        const strText= value ? value:'';
    this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code',strText,true,20,this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
        this.currencyList = res;
    },err => {			
})
}

enableSave() {

this.isSaving =true;
this.disableSaveForEdit =false;
    if(this.calibrationForm.IsVendororEmployee == "vendor" && (this.calibrationForm.VendorId == "" || this.calibrationForm.VendorId == undefined ||  this.calibrationForm.VendorId == null))
    {
        this.isSaving =false;
        this.disableSaveForEdit = true;

    }

    if(this.calibrationForm.IsVendororEmployee == "employee" && (this.calibrationForm.EmployeeId == "" || this.calibrationForm.EmployeeId == undefined || this.calibrationForm.EmployeeId == null))
    {
        this.isSaving =false;
        this.disableSaveForEdit = true;

    }

    if(this.calibrationForm.CalibrationDate == "" || this.calibrationForm.CalibrationDate == undefined  || this.calibrationForm.CalibrationDate == null)
    {
        this.isSaving =false;
        this.disableSaveForEdit = true;

    }

    if(this.calibrationForm.UnitCost == "" || this.calibrationForm.UnitCost == undefined  || this.calibrationForm.UnitCost == null)
    {
        this.isSaving =false;
        this.disableSaveForEdit = true;
    }

    if(this.calibrationForm.currencyId == "" || this.calibrationForm.currencyId == undefined  || this.calibrationForm.currencyId == null)
    {
        this.isSaving =false;
        this.disableSaveForEdit = true;
    }

    if(this.isSaving)
    {
        this.disableSaveForEdit = false;
    }
    else
    {
        this.disableSaveForEdit = true;
    }
}
onFilterAction(value){
    this.getCurrencyList(value)
}
getActive(){
    this.disableUpdate=false;
}
editorgetmemo(ev) {
   // this.disableEditor = false;
}
viewSelectedRowdbl(rowData) {
  this.openView(rowData);
  $('#invView').modal('show');
}
closeDeleteModal() {
    $("#editcalibration").modal("hide");
}
closedownloadConfirmationModal() {
    $("#downloadConfirmation").modal("hide");
}
closeviewModal() {
    $("#viewcalibration").modal("hide");
}

closecalibartionviewModal() {
    $("#CalibartionmgmtList").modal("hide");
}

Updatetcalibartion()
{
        this.assetService.UpdatecalibartionMgmt(this.allcalibrationbyidInfo).pipe(takeUntil(this.onDestroy$)).subscribe(res => {

            this.alertService.showMessage("Success", `Calibration Process Update successfully.`, MessageSeverity.success);
            $("#CalibartionmgmtList").modal("hide");
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
 

}

  filterEmployee(event): void {
    if (event.query !== undefined && event.query !== null) {
        this.getAllEmployees(event.query);
    } else {
        this.getAllEmployees('');
    }
}
  arrayContactlist: any = []
  getAllEmployees(strText = '') {
      this.arrayContactlist.push(0);
      this.commonService.autoCompleteSmartDropDownEmployeeList('firstName', strText, true, this.arrayContactlist.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
          this.employeeList = res.map(x => {
              return {
                  ...x,
                  employeeId: x.value,
                  name: x.label
              }
          });

      }, err => {
         // this.errorMessageHandler();
      })
  }
  formatToGlobal(obj) {
    if(this.calibrationForm.UnitCost <0)
    {
        this.calibrationForm.UnitCost=0; 
    }

    this.calibrationForm.UnitCost = this.calibrationForm.UnitCost ? formatNumberAsGlobalSettingsModule(this.calibrationForm.UnitCost, 2) : '0.00';

}

  savecalibrationprocess()
  {
      this.calibrationForm.createdBy = this.userName;
      this.calibrationForm.updatedBy = this.userName;


      //this.calibrationForm.LastCalibrationDate=this.calibrationForm.CalibrationDate
      //this.calibrationForm.NextCalibrationDate=this.calibrationForm.CalibrationDate
      this.calibrationForm.LastCalibrationBy=this.userName;
      this.calibrationForm.masterCompanyId = this.authService.currentUser.masterCompanyId;
      this.calibrationForm.EmployeeId=this.calibrationForm.EmployeeId ? this.calibrationForm.EmployeeId.employeeId : null;
      this.calibrationForm.VendorId=this.calibrationForm.VendorId ? this.calibrationForm.VendorId.vendorId : null;

   
        this.isSpinnerVisible = true;
        this.assetService.addcalibrationManagment(this.calibrationForm).subscribe(data => {
            this.isSpinnerVisible = false;
            this.isEditMode = true;
            this.alertService.showMessage("Success", `Calibration Process successfully.`, MessageSeverity.success);
            $("#editcalibration").modal("hide");
            this.loadData(this.lazyLoadEventDataInput);
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    

  }
assetInventoryId:any;

get userName(): string {
  return this.authService.currentUser ? this.authService.currentUser.userName : "";
}
  toggleIsActive(calibration: any, e) {
      this.pageNumber = 0;
      if (e.checked == false) {
          this.Active = "In Active";
          let newcalibration = new CalibrationMgmt();
          newcalibration=calibration;
          newcalibration.IsActive == false;
          newcalibration.CalibrationId == calibration.calibrationId;
          this.isSpinnerVisible = true;
          this.assetService.addcalibrationManagment(newcalibration).subscribe(data => {
              this.isSpinnerVisible = false;
              this.isEditMode = true;
              this.alertService.showMessage("Success", `Calibration updated successfully.`, MessageSeverity.success);
          }, err => {
              const errorLog = err;
              this.errorMessageHandler(errorLog);
          })
  }
      else {
          this.Active = "Active";
         
          this.assetTypeToUpdate.isActive == true;
          let newcalibration = new CalibrationMgmt();
          newcalibration=calibration;
          newcalibration.IsActive == true;
          newcalibration.CalibrationId == calibration.calibrationId;
          this.isSpinnerVisible = true;
          this.assetService.addcalibrationManagment(newcalibration).subscribe(data => {
              this.isSpinnerVisible = false;
              this.isEditMode = true;
              this.alertService.showMessage("Success", `Calibration updated successfully.`, MessageSeverity.success);
          }, err => {
              const errorLog = err;
              this.errorMessageHandler(errorLog);
          })
  }
  }
  openView(row) {
 // this.assetService.isEditMode = true;
  
     let newcalibration = new CalibrationMgmt();
     newcalibration.IsDeleted=false;
     newcalibration.AssetRecordId=row.assetRecordId
     newcalibration.IsActive=true;
     newcalibration.CalibrationId=row.calibrationId;
     newcalibration.AssetId=row.assetId;
     newcalibration.AssetName=row.assetName;
     newcalibration.AltAssetId=row.altAssetId;
     newcalibration.SerialNum=row.serialNum;
     newcalibration.Location=row.location;
     newcalibration.AcquisitionType=row.acquisitionType;
     newcalibration.ControlName=row.controlName;
     newcalibration.LastCalibrationDate=row.lastCalibrationDate;
     newcalibration.NextCalibrationDate=row.nextCalibrationDate;
     newcalibration.LastCalibrationBy=row.lastCalibrationBy;
     newcalibration.CertifyType=row.certifyType;
     newcalibration.IsVendor=row.isVendor;
     newcalibration.IsEmployee=row.isEmployee
     newcalibration.ScheduleIsVendor=true;
     newcalibration.ScheduleIsEmployee=false;
     newcalibration.VendorId=row.vendorId;
     newcalibration.EmployeeId=row.employeeId

     newcalibration.LastCalibrationBy=row.lastCalibrationBy;
     newcalibration.CertifyType=row.certifyType;
     newcalibration.IsVendor=row.isVendor;
     newcalibration.IsEmployee=row.isEmployee
     newcalibration.ScheduleIsVendor=true;
     newcalibration.ScheduleIsEmployee=false;
     newcalibration.VendorId=row.vendorId;
     newcalibration.EmployeeId=row.employeeId;

     newcalibration.Qty=row.qty;
	 newcalibration.UpdatedCost =row.updatedCost;
	 newcalibration.Inservicedate=row.inservicedate;;
	 newcalibration.AssetStatus=row.assetStatus;;
	 newcalibration.Itemtype =row.itemtype;;
	 newcalibration.AssetType =row.assetType;;
	 newcalibration.AssetClass =row.assetClass;;
	 newcalibration.UOM =row.uOM;;
	 newcalibration.Inservicesdate =row.inservicesdate;;
	 newcalibration.lastcalibrationmemo =row.lastcalibrationmemo;;
	 newcalibration.lastcheckedinby =row.lastcheckedinby;;
	 newcalibration.lastcheckedindate =row.lastcheckedindate;;
	 newcalibration.lastcheckedinmemo =row.lastcheckedinmemo;;
	 newcalibration.lastcheckedoutby =row.lastcheckedoutby;;
	 newcalibration.lastcheckedoutdate =row.lastcheckedoutdate;;
	 newcalibration.lastcheckedoutmemo =row.lastcheckedoutmemo;;
	 newcalibration.CompanyName =row.companyName;;
	 newcalibration.BuName =row.buName;;
	 newcalibration.DeptName =row.deptName;;
	 newcalibration.DivName =row.divName;;
     newcalibration.CurrencyId=0;
     newcalibration.Memo=row.memo;
     //newcalibration.UnitCost = this.formateCurrency(newcalibration.UnitCost);

      newcalibration = { ...newcalibration }
      this.viewcalibrationForm = newcalibration;
  $("#viewcalibration").modal("show");
  this.assetService.listCollection = row;
  const { assetId } = row;
}



  openAssetToEdit(row) {
   // this.assetService.isEditMode = true;
    
       let newcalibration = new CalibrationMgmt();
       newcalibration.IsDeleted=false;
       newcalibration.AssetRecordId=row.assetRecordId
       newcalibration.IsActive=true;
       this.CalibrationId=row.calibrationId;
       //newcalibration.CalibrationId=row.calibrationId;
       newcalibration.AssetId=row.assetId;
       newcalibration.AssetName=row.assetName;
       newcalibration.AltAssetId=row.altAssetId;
       newcalibration.SerialNum=row.serialNum;
       newcalibration.Location=row.location;
       newcalibration.AcquisitionType=row.acquisitionType;
       newcalibration.ControlName=row.controlName;
       newcalibration.LastCalibrationDate=row.lastCalibrationDate;
       newcalibration.NextCalibrationDate=row.nextCalibrationDate;
       newcalibration.LastCalibrationBy=row.lastCalibrationBy;
       newcalibration.CertifyType=row.certifyType;
    //    newcalibration.IsVendor=row.scheduleIsVendor;
    //    newcalibration.IsEmployee=row.scheduleIsEmployee;
       newcalibration.IsVendororEmployee=row.isVendororEmployee;
      // newcalibration.ScheduleIsEmployee=row.scheduleIsEmployee;
       newcalibration.VendorId=row.vendorId;
       newcalibration.EmployeeId=row.employeeId;

       if(newcalibration.LastCalibrationBy == null || newcalibration.LastCalibrationBy == "")
       {
         newcalibration.LastCalibrationBy= "NA";
       }

       if(newcalibration.IsVendororEmployee =="vendor")
       {
        this.isvendor=true;
        this.selectvendororemp="vendor1"
       }else
       {
        newcalibration.IsVendororEmployee="employee";
           this.isemployee=true;
           this.selectvendororemp="employee1"
       }


    //    if (row.calibrationDate) 
    //    {
    //     newcalibration.CalibrationDate1 = new Date(row.calibrationDate).toLocaleDateString();
    // }
    // else {
    //     newcalibration.CalibrationDate1 = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toLocaleDateString();
    // }
       //newcalibration.CalibrationDate='';
       newcalibration.CurrencyId=0;
       newcalibration.Memo='';
       //newcalibration.UnitCost = this.formateCurrency(newcalibration.UnitCost);

        newcalibration = { ...newcalibration }
        this.calibrationForm = newcalibration;
    $("#editcalibration").modal("show");
    // this.assetService.currentAssetId = row.assetRecordId;
    this.assetService.listCollection = row;
    const { assetId } = row;
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
textAreaInfo: any;
disableEditor: any = true;
onAddTextAreaInfo(material) {
    this.disableEditor = true;
    this.textAreaInfo = material.memo;
}
onCloseTextAreaInfo() {
    $("#textarea-popup").modal("hide"); 
}
onSaveTextAreaInfo(memo) {
    if (memo) {
        this.textAreaInfo = memo;
        this.calibrationForm.memo = memo;
    }
    $("#textarea-popup").modal("hide");
}
getmemo($event) {
    this.disableEditor= false;
}
isvendor:boolean=false;
isemployee:boolean=false;
checkedvendor(ScheduleIsVendor)
{
    this.isvendor=true;
    this.isemployee=false;
    //this.calibrationForm.ScheduleIsVendor=true
    //this.calibrationForm.ScheduleIsEmployee=false
}
checkedemployee(ScheduleIsEmployee)
{
    this.isvendor=false;
    this.isemployee=true;
    //this.calibrationForm.ScheduleIsVendor=false
    //this.calibrationForm.ScheduleIsEmployee=true


}
formateCurrency(amount){
    return amount ? formatNumberAsGlobalSettingsModule(amount, 2) : '0.00';
}
showscheduleprocess()
{
    this.isscheduleprocess=true;
}

allVendorInfoFilter:any=[];
filterWarentyVendor(event) {
    this.allVendorInfoFilter = this.allVendorInfo;
    if (event.query !== undefined && event.query !== null) {
        this.vendorList(event.query)
    }else{
        this.vendorList('');
    }
        const vendors = [...this.allVendorInfo.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.allVendorInfoFilter = vendors;

}
arrayVendlsit:any=[];
private vendorList(value) {
    this.arrayVendlsit.push(0); 
this.vendorService.getVendorNameCodeListwithFilter(value,20,this.arrayVendlsit.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
    this.allVendorInfo = res.map(x => {
        return {
            vendorId: x.vendorId,
            name: x.vendorName
        }
    }); 
    this.allVendorInfoFilter = this.allVendorInfo;
},err => {			
    const errorLog = err;
    this.errorMessageHandler(errorLog);})
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
    this.auditHistory = [];
      if(row && row.assetRecordId !=undefined){
          this.isSpinnerVisibleHistory=true;
      this.assetService.getAuditDataBycalibrationId(row.assetRecordId).subscribe(res => {

      if(res && res.length !=0){
          this.showhistorylist=true;
          this.auditHistory = res.map(x => {
              return {
                  ...x,
               unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '',
            //   residualPercentage: x.residualPercentage ? formatNumberAsGlobalSettingsModule(x.residualPercentage, 2) : '',
            //   installationCost: x.installationCost ? formatNumberAsGlobalSettingsModule(x.installationCost, 2) : '',
            //   freight: x.freight ? formatNumberAsGlobalSettingsModule(x.freight, 2) : '',
            //   insurance: x.insurance ? formatNumberAsGlobalSettingsModule(x.insurance, 2) : '',
            //   taxes: x.taxes ? formatNumberAsGlobalSettingsModule(x.taxes, 2) : '',
            //   totalCost: x.totalCost ? formatNumberAsGlobalSettingsModule(x.totalCost, 2) : '',
            //   calibrationDefaultCost: x.calibrationDefaultCost ? formatNumberAsGlobalSettingsModule(x.calibrationDefaultCost, 2) : '',
            //   certificationDefaultCost: x.certificationDefaultCost ? formatNumberAsGlobalSettingsModule(x.certificationDefaultCost, 2) : '',
            //   inspectionDefaultCost: x.inspectionDefaultCost ? formatNumberAsGlobalSettingsModule(x.inspectionDefaultCost, 2) : '',
            //   verificationDefaultCost: x.verificationDefaultCost ? formatNumberAsGlobalSettingsModule(x.verificationDefaultCost, 2) : '',
              }
          });
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
  OpemCalibartionMgmtList(AssetRecordId)
  {
    this.GetCalibartionListByID(AssetRecordId)
  }

//   private onCapesLoaded(allCapes: CalibrationMgmt[]) {
//     this.allCapesInfo = allCapes;
// }
updaterowcalibartion(caldata)
{
    caldata.isedit=true;
}

  GetCalibartionListByID(AssetRecordId) {
    if (AssetRecordId !=0) {
        this.assetService.getCalibartionListByID(AssetRecordId).subscribe(
            results => { 
                this.allcalibrationbyidInfo= results[0]

                this.allcalibrationbyidInfo = results[0].map(x => {
                    return {
                        ...x,
                     unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '',
                     createdDate:  new Date(x.createdDate),
                     calibrationDate:  new Date(x.calibrationDate),
                     isedit:false,
                     createdDate1 :x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy h:mm a'): '',
                     calibrationDate1 :x.calibrationDate ?  this.datePipe.transform(x.calibrationDate, 'MM/dd/yyyy h:mm a'): '',
                  //   residualPercentage: x.residualPercentage ? formatNumberAsGlobalSettingsModule(x.residualPercentage, 2) : '',
                  //   installationCost: x.installationCost ? formatNumberAsGlobalSettingsModule(x.installationCost, 2) : '',
                  //   freight: x.freight ? formatNumberAsGlobalSettingsModule(x.freight, 2) : '',
                  //   insurance: x.insurance ? formatNumberAsGlobalSettingsModule(x.insurance, 2) : '',
                  //   taxes: x.taxes ? formatNumberAsGlobalSettingsModule(x.taxes, 2) : '',
                  //   totalCost: x.totalCost ? formatNumberAsGlobalSettingsModule(x.totalCost, 2) : '',
                  //   calibrationDefaultCost: x.calibrationDefaultCost ? formatNumberAsGlobalSettingsModule(x.calibrationDefaultCost, 2) : '',
                  //   certificationDefaultCost: x.certificationDefaultCost ? formatNumberAsGlobalSettingsModule(x.certificationDefaultCost, 2) : '',
                  //   inspectionDefaultCost: x.inspectionDefaultCost ? formatNumberAsGlobalSettingsModule(x.inspectionDefaultCost, 2) : '',
                  //   verificationDefaultCost: x.verificationDefaultCost ? formatNumberAsGlobalSettingsModule(x.verificationDefaultCost, 2) : '',
                    }
                });

              
                //this.onCapesLoaded(results[0]) 
            
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            }
        );

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

  exportCSV(dt) {
    this.isSpinnerVisible = true;
    const isdelete = this.currentDeletedstatus ? true : false;
    let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "status": this.currentstatus, "isDeleted": isdelete }, "globalFilter": "" }
    PagingData.globalFilter = this.globalFilterValue ? this.globalFilterValue : '';
    let filters = Object.keys(dt.filters);
    filters['certifytype'] = this.Certifytype ? this.Certifytype : 'calibration';
    filters.forEach(x => {
        PagingData.filters[x] = dt.filters[x].value;
    })
    PagingData.filters['certifytype'] = this.Certifytype ? this.Certifytype : 'calibration';
    this.assetService.downloadAllCalibrationList(PagingData).subscribe(
        results => {
            this.loadingIndicator = false;
            dt._value = results['results'].map(x => {
                return {
                    ...x,
                    createdDate:x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy h:mm a'): '',
                    updatedDate:x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy h:mm a'): '',
            
                    lastCalibrationDate:x.lastCalibrationDate ?  this.datePipe.transform(x.lastCalibrationDate, 'MM/dd/yyyy h:mm a'): '',
                    nextCalibrationDate:x.nextCalibrationDate ?  this.datePipe.transform(x.nextCalibrationDate, 'MM/dd/yyyy h:mm a'): '',
            
                    calibrationDate:x.calibrationDate ?  this.datePipe.transform(x.calibrationDate, 'MM/dd/yyyy h:mm a'): '',
                    lastcheckedindate:x.lastcheckedindate ?  this.datePipe.transform(x.lastcheckedindate, 'MM/dd/yyyy h:mm a'): '',
        
                    lastcheckedoutdate:x.lastcheckedoutdate ?  this.datePipe.transform(x.lastcheckedoutdate, 'MM/dd/yyyy h:mm a'): '',
                
                }
            });
            dt.exportCSV();
            dt.value = this.allcalibrationinfo;
            this.isSpinnerVisible = false;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        }
    );
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

geListBycertifytype(Certifytype) {
    this.Certifytype = Certifytype;
    this.selectedRows=[];
   this.pageNumber = 0;
    this.pageIndex = 0;
    this.lazyLoadEventDataInput.first = this.pageIndex;
    this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, Certifytype: Certifytype, pageIndex: 1 }; 
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
