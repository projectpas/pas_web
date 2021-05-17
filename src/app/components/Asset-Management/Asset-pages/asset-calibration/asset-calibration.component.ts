import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AssetService } from '../../../../services/asset/Assetservice';
import { VendorService } from '../../../../services/vendor.service';
//import { AlertService } from '../../../../services/alert.service';
import { Vendor } from '../../../../models/vendor.model';
import { AuthService } from '../../../../services/auth.service';
import { GlAccount } from '../../../../models/GlAccount.model';
import { GlAccountService } from '../../../../services/glAccount/glAccount.service';
//import { Router } from '@angular/router';
import { Currency } from '../../../../models/currency.model';
import { CurrencyService } from '../../../../services/currency.service';
import { AlertService, DialogType, MessageSeverity } from '../../../../services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formatNumberAsGlobalSettingsModule, getObjectById } from '../../../../generic/autocomplete';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.service';
// declare var $ : any;
declare var $ : any;
import { MenuItem } from 'primeng/api';
@Component({
    selector: 'app-asset-calibration',
    templateUrl: './asset-calibration.component.html',
    styleUrls: ['./asset-calibration.component.scss']
})
/** asset-calibration component*/
export class AssetCalibrationComponent implements OnInit {
    @ViewChild("tabRedirectConfirmationModal3",{static:false}) public tabRedirectConfirmationModal3: ElementRef;
    // allGlInfo: GlAccount[];
    allGlInfo:any=[];
    allVendorInfo:any=[];
    currentCalibration: any = {};
    showLable: boolean;
    modal: NgbModalRef;
    calibrationRequired: boolean;
    certificationRequired: boolean;
    inspectionRequired: boolean;
    verificationRequired: boolean;
    currentAsset: any;
    loadingIndicator: boolean;
    local: any; 
    activeIndex: number;
    localCollection: any;
    home: any;
    allCurrencyInfo: Currency[];
    AssetId: any;
    breadcrumbs: MenuItem[];
    static assetService;
    nextOrPreviousTab: any;
    disableSaveForEdit:boolean=false;
    constructor(private router: ActivatedRoute, public assetService: AssetService, private vendorService: VendorService, private alertService: AlertService,
        private authService: AuthService,private commonService: CommonService,
        private modalService: NgbModal, private glAccountService: GlAccountService, private route: Router, private currencyService: CurrencyService) {
        this.AssetId = this.router.snapshot.params['id'];
        this.activeIndex = 2;
    }
    ngOnInit(): void {
        if( this.assetService.isEditMode == false){

            this.breadcrumbs = [
                { label: 'Asset' },
                { label: 'Create Asset' },
            ];
        }else{

            this.breadcrumbs = [
                { label: 'Asset' },
                { label: 'Edit Asset' },
            ];
        }

        this.AssetId = this.router.snapshot.params['id'];
        this.disableSaveForEdit=true;
            this.GetAssetData(this.AssetId);

        this.assetService.bredcrumbObj.next(this.assetService.currentUrl);
        // this.glList('');
        // this.CurrencyData();
    }
    isSpinnerVisible:boolean=false;
    private GetAssetData(assetid) {

        this.isSpinnerVisible=true;
     if(assetid !=undefined){
        this.assetService.getByAssetId(assetid).subscribe(
            results => {this.onassetdataSuccessful(results)},err => {			
                const errorLog = err;
                this.errorMessageHandler(errorLog);}
        );
     }
    }
    private onassetdataSuccessful(getAssetData: any[]) {
        this.activeIndex = 2;
        this.assetService.indexObj.next(this.activeIndex);


        this.assetService.listCollection = getAssetData[0];
        this.localCollection=this.assetService.listCollection;
        this.currentCalibration=getAssetData[getAssetData.length - 1];
        this.isSpinnerVisible=false;
        if(this.currentCalibration.assetCal==true){
            this.assetService.isEditMode = true;
        }
        this.currentCalibration.assetRecordId=getAssetData[0].assetRecordId;
        this.vendorList('');
        this.setAutocompleteOnLoad(this.currentCalibration);
        this.currentCalibration.verificationDefaultCost= this.currentCalibration.verificationDefaultCost ? formatNumberAsGlobalSettingsModule(this.currentCalibration.verificationDefaultCost, 2) : "0.00";
        this.currentCalibration.calibrationDefaultCost= this.currentCalibration.calibrationDefaultCost ? formatNumberAsGlobalSettingsModule(this.currentCalibration.calibrationDefaultCost, 2) : "0.00";
        this.currentCalibration.certificationDefaultCost= this.currentCalibration.certificationDefaultCost ? formatNumberAsGlobalSettingsModule(this.currentCalibration.certificationDefaultCost, 2) : "0.00";
        this.currentCalibration.inspectionDefaultCost= this.currentCalibration.inspectionDefaultCost ? formatNumberAsGlobalSettingsModule(this.currentCalibration.inspectionDefaultCost, 2) : "0.00";
        if (this.currentCalibration.calibrationRequired == false) {
            this.currentCalibration.calibrationDefaultCost = "0.00";
        }

        if (this.currentCalibration.certificationRequired == false) {
            this.currentCalibration.certificationDefaultCost = "0.00";
        }
        if (this.currentCalibration.inspectionRequired == false) {
            this.currentCalibration.inspectionDefaultCost = "0.00";
        }
        if (this.currentCalibration.verificationRequired == false) {
            this.currentCalibration.verificationDefaultCost = "0.00";
        }
   
        this.glList('');
        this.CurrencyData();
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    setvaliDate($event) {
        this.disableSaveForEdit=false;
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
    glList(value) {
        this.setEditArray = [];
        if (this.assetService.isEditMode == true) {
            this.setEditArray.push(this.currentCalibration.calibrationGlAccountId ? this.currentCalibration.calibrationGlAccountId.glAccountId : 0,
                this.currentCalibration.certificationGlAccountId ? this.currentCalibration.certificationGlAccountId.glAccountId : 0,
                this.currentCalibration.inspectionGlaAccountId ? this.currentCalibration.inspectionGlaAccountId.glAccountId : 0,
                this.currentCalibration.verificationGlAccountId ? this.currentCalibration.verificationGlAccountId.glAccountId : 0
                );
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.getAutoCompleteDropDownsByCodeWithName('GLAccount', 'GLAccountId', 'AccountName', 'AccountCode', strText, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.allGlInfo = res.map(x => {
                        return {
                            glAccountId:x.value,
                            name: x.label
                        }
                    });
                    this.allGlInfoFilter=this.allGlInfo;

        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });


    }
    changeOfTab(value) {
        const { assetId } = this.AssetId;
        if (this.assetService.isEditMode == true) {
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
    setEditArray:any=[];
    private CurrencyData() {
 
        this.setEditArray=[];
        if(this.assetService.isEditMode==true){
            this.setEditArray.push(this.currentCalibration.certificationCurrencyId,this.currentCalibration.inspectionCurrencyId,this.currentCalibration.calibrationCurrencyId,this.currentCalibration.verificationCurrencyId); 
        }else{
            this.setEditArray.push(0);
        }
            const strText='';
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code',strText,true,20,this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.allCurrencyInfo = res;
        },err => {			
            const errorLog = err;
            this.errorMessageHandler(errorLog);});
    }
    finalData:any={};
    errorDisplay:any;
    saveCalibration() {
        
        this.finalData={};
        this.currentCalibration.createdBy = this.userName;
        this.currentCalibration.updatedBy = this.userName;
        this.currentCalibration.masterCompanyId = this.authService.currentUser.masterCompanyId;
        if (this.currentCalibration.calibrationRequired == false) {
            this.currentCalibration.calibrationDefaultVendorId = null;
            this.currentCalibration.calibrationDefaultCost = "0.00";
            this.currentCalibration.calibrationCurrencyId = null;
            this.currentCalibration.calibrationGlAccountId = null;
            this.currentCalibration.calibrationMemo = null;
        }else if (this.currentCalibration.certificationRequired == false) {
            this.currentCalibration.certificationDefaultVendorId = null;
            this.currentCalibration.certificationDefaultCost = "0.00";
            this.currentCalibration.certificationCurrencyId = null;
            this.currentCalibration.certificationGlAccountId = null;
            this.currentCalibration.certificationMemo = null;
        } else if (this.currentCalibration.inspectionRequired == false) {
            this.currentCalibration.inspectionDefaultVendorId = null;
            this.currentCalibration.inspectionDefaultCost = "0.00";
            this.currentCalibration.inspectionCurrencyId = null;
            this.currentCalibration.inspectionGlaAccountId = null;
            this.currentCalibration.inspectionMemo = null;
        }  else  if (this.currentCalibration.verificationRequired == false) {
            this.currentCalibration.verificationDefaultVendorId = null;
            this.currentCalibration.verificationDefaultCost = "0.00";
            this.currentCalibration.verificationCurrencyId = null;
            this.currentCalibration.verificationGlAccountId = null;
            this.currentCalibration.verificationMemo = null;
        }

        this.currentCalibration.verificationFrequencyMonths= this.currentCalibration.verificationFrequencyMonths?  this.currentCalibration.verificationFrequencyMonths :0;
        this.currentCalibration.verificationFrequencyDays=this.currentCalibration.verificationFrequencyDays?this.currentCalibration.verificationFrequencyDays:0;
        this.currentCalibration.inspectionFrequencyMonths=this.currentCalibration.inspectionFrequencyMonths?this.currentCalibration.inspectionFrequencyMonths:0;
        this.currentCalibration.inspectionFrequencyDays=this.currentCalibration.inspectionFrequencyDays?this.currentCalibration.inspectionFrequencyDays:0;
        this.currentCalibration.certificationFrequencyMonths=this.currentCalibration.certificationFrequencyMonths?this.currentCalibration.certificationFrequencyMonths:0;
        this.currentCalibration.certificationFrequencyDays=this.currentCalibration.certificationFrequencyDays?this.currentCalibration.certificationFrequencyDays:0;
        this.currentCalibration.calibrationFrequencyMonths=this.currentCalibration.calibrationFrequencyMonths?this.currentCalibration.calibrationFrequencyMonths:0;
        this.currentCalibration.calibrationFrequencyDays=this.currentCalibration.calibrationFrequencyDays?this.currentCalibration.calibrationFrequencyDays:0;
        if (this.currentCalibration.calibrationRequired == true && (this.currentCalibration.calibrationFrequencyMonths==0 && this.currentCalibration.calibrationFrequencyDays==0)){
            this.alertService.showMessage("Warning",'Calibration Months & Days Cant be Zero', MessageSeverity.warn);
        return;
        }
        if (this.currentCalibration.certificationRequired == true && (this.currentCalibration.certificationFrequencyMonths==0 && this.currentCalibration.certificationFrequencyDays==0)){
            this.alertService.showMessage("Warning",'Certification Months & Days Cant be Zero', MessageSeverity.warn);
            return;
        }
        if (this.currentCalibration.inspectionRequired == true && (this.currentCalibration.inspectionFrequencyMonths==0 && this.currentCalibration.inspectionFrequencyDays==0)){
            this.alertService.showMessage("Warning",'Inspection Months & Days Cant be Zero', MessageSeverity.warn);
            return;
        }
        if (this.currentCalibration.verificationRequired == true && (this.currentCalibration.verificationFrequencyMonths==0 && this.currentCalibration.verificationFrequencyDays==0)){
            this.alertService.showMessage("Warning",' Verification Months & Days Cant be Zero', MessageSeverity.warn);
            return;
        }

        this.currentCalibration.updatedBy = this.userName;
        this.currentCalibration.masterCompanyId = this.authService.currentUser.masterCompanyId;
        this.currentCalibration.calibrationCurrencyId=this.currentCalibration.calibrationCurrencyId ==0 ? null : this.currentCalibration.calibrationCurrencyId;
        this.currentCalibration.inspectionCurrencyId=this.currentCalibration.inspectionCurrencyId ==0 ? null : this.currentCalibration.inspectionCurrencyId;
        this.currentCalibration.certificationCurrencyId=this.currentCalibration.certificationCurrencyId ==0 ? null : this.currentCalibration.certificationCurrencyId;
        this.currentCalibration.verificationCurrencyId=this.currentCalibration.verificationCurrencyId ==0 ? null : this.currentCalibration.verificationCurrencyId;
        this.currentCalibration.assetRecordId=this.assetService.listCollection.assetRecordId;
        
        this.currentCalibration.assetCalibrationMin=this.currentCalibration.assetCalibrationMin =="" ? null : this.currentCalibration.assetCalibrationMin;
        this.currentCalibration.assetCalibrationMinTolerance=this.currentCalibration.assetCalibrationMinTolerance ="" ? null :this.currentCalibration.assetCalibrationMinTolerance;
        this.currentCalibration.assetCalibratonMax=this.currentCalibration.assetCalibratonMax ="" ? null :this.currentCalibration.assetCalibratonMax;
        this.currentCalibration.assetCalibrationMaxTolerance=this.currentCalibration.assetCalibrationMaxTolerance ="" ? null :this.currentCalibration.assetCalibrationMaxTolerance;
        this.currentCalibration.assetCalibrationExpected=this.currentCalibration.assetCalibrationExpected ="" ? null :this.currentCalibration.assetCalibrationExpected;
        this.currentCalibration.assetCalibrationExpectedTolerance=this.currentCalibration.assetCalibrationExpectedTolerance ="" ? null :this.currentCalibration.assetCalibrationExpectedTolerance;
        this.finalData={...this.currentCalibration};
        if (this.currentCalibration.assetCal==true) { 
         
   this.finalData.calibrationDefaultVendorId=this.finalData.calibrationDefaultVendorId ? this.finalData.calibrationDefaultVendorId.vendorId : null;
this.finalData.certificationDefaultVendorId=this.finalData.certificationDefaultVendorId ? this.finalData.certificationDefaultVendorId.vendorId : null;
this.finalData.inspectionDefaultVendorId=this.finalData.inspectionDefaultVendorId ? this.finalData.inspectionDefaultVendorId.vendorId : null;
this.finalData.verificationDefaultVendorId=this.finalData.verificationDefaultVendorId ? this.finalData.verificationDefaultVendorId.vendorId : null;
this.finalData.calibrationGlAccountId=this.finalData.calibrationGlAccountId ? this.finalData.calibrationGlAccountId.glAccountId : null;
this.finalData.certificationGlAccountId=this.finalData.certificationGlAccountId ? this.finalData.certificationGlAccountId.glAccountId : null;
this.finalData.inspectionGlaAccountId=this.finalData.inspectionGlaAccountId ? this.finalData.inspectionGlaAccountId.glAccountId : null;
this.finalData.verificationGlAccountId=this.finalData.verificationGlAccountId ? this.finalData.verificationGlAccountId.glAccountId : null;
this.isSpinnerVisible=true;
this.assetService.updateAssetCalibration(this.finalData).subscribe(data => {
    this.disableSaveForEdit=true;
                this.currentCalibration.updatedBy = this.userName;
                this.currentCalibration.assetCal=true;
                data.assetCal=true;
                this.localCollection = data;
               setTimeout(() => {
                this.isSpinnerVisible=false;
               }, 1200);
                // this.assetService.listCollection = this.localCollection;
              this.alertService.showMessage("Success", `Asset calibration updated successfully.`, MessageSeverity.success);
        },err => {			
            const errorLog = err;
            this.isSpinnerVisible=false;
            this.errorMessageHandler(errorLog);})
        }  else  {
            
this.finalData.calibrationDefaultVendorId=this.finalData.calibrationDefaultVendorId ? this.finalData.calibrationDefaultVendorId.vendorId : null;
this.finalData.certificationDefaultVendorId=this.finalData.certificationDefaultVendorId ? this.finalData.certificationDefaultVendorId.vendorId : null;
this.finalData.inspectionDefaultVendorId=this.finalData.inspectionDefaultVendorId ? this.finalData.inspectionDefaultVendorId.vendorId : null;
this.finalData.verificationDefaultVendorId=this.finalData.verificationDefaultVendorId ? this.finalData.verificationDefaultVendorId.vendorId : null; 
this.finalData.calibrationGlAccountId=this.finalData.calibrationGlAccountId ? this.finalData.calibrationGlAccountId.glAccountId : null;
this.finalData.certificationGlAccountId=this.finalData.certificationGlAccountId ? this.finalData.certificationGlAccountId.glAccountId : null;
this.finalData.inspectionGlaAccountId=this.finalData.inspectionGlaAccountId ? this.finalData.inspectionGlaAccountId.glAccountId : null;
this.finalData.verificationGlAccountId=this.finalData.verificationGlAccountId ? this.finalData.verificationGlAccountId.glAccountId : null;
this.isSpinnerVisible=true;
this.assetService.addAssetCalibration(this.finalData).subscribe(data => {
    this.disableSaveForEdit=true;
    setTimeout(() => {
        this.isSpinnerVisible=false;
       }, 1200);
                this.alertService.showMessage("Success", `Asset Calibration  created successfully`, MessageSeverity.success);
                this.currentCalibration.updatedBy = this.userName;
                this.currentCalibration.assetCal=true;
                data.assetCal=true;
                this.assetService.isEditMode=true;
                this.localCollection = data;
           },err => {	
            this.isSpinnerVisible=false;		
            const errorLog = err;
            this.errorMessageHandler(errorLog);})
        }

    }

    validateDates(value,obj,type){
        if(value && (value <0 || value >31)){
            value='';
            if(type==1){
                obj.calibrationFrequencyDays=null;
                this.alertService.showMessage("Warning",'Calibration Days Cant greater than 31 days', MessageSeverity.warn);
            }else if(type==2){
                obj.certificationFrequencyDays=null;
                this.alertService.showMessage("Warning",'Certification Days Cant greater than 31 days', MessageSeverity.warn);
            }else if(type==3){
                obj.inspectionFrequencyDays=null;
                this.alertService.showMessage("Warning",'Inspection Days Cant greater than 31 days', MessageSeverity.warn);
            }else if(type==4){
                obj.verificationFrequencyDays=null;
                this.alertService.showMessage("Warning",'Verification Days Cant greater than 31 days', MessageSeverity.warn);
            }
           
        }
    }

    formatToGlobal(obj){
        obj.verificationDefaultCost= obj.verificationDefaultCost ? formatNumberAsGlobalSettingsModule(obj.verificationDefaultCost, 2) :"0.00";
        obj.calibrationDefaultCost= obj.calibrationDefaultCost ? formatNumberAsGlobalSettingsModule(obj.calibrationDefaultCost, 2) :"0.00";
        obj.certificationDefaultCost= obj.certificationDefaultCost ? formatNumberAsGlobalSettingsModule(obj.certificationDefaultCost, 2) :"0.00";
        obj.inspectionDefaultCost= obj.inspectionDefaultCost ? formatNumberAsGlobalSettingsModule(obj.inspectionDefaultCost, 2) :"0.00";
    }
    nextClick(nextOrPrevious) {
        this.nextOrPreviousTab = nextOrPrevious;
        let content = this.tabRedirectConfirmationModal3;
    this.modal = this.modalService.open(content, { size: "sm" });
    }
    dismissModel() {
      this.modal.close();
    }
    datadissmiss:boolean=false;
    redirectdismissModel(){
        this.datadissmiss=true;
        this.redirectToTab();
    }
    redirectToTab(){
        if(!this.disableSaveForEdit  && !this.datadissmiss){
            this.saveCalibration();
        }
        this.dismissModel();
if(this.nextOrPreviousTab=='Next'){
    this.activeIndex = 3;
    this.assetService.indexObj.next(this.activeIndex);
    this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-maintenance-warranty/${this.localCollection.assetRecordId}`);

}else{
    this.activeIndex = 1;
    this.assetService.indexObj.next(this.activeIndex);
    this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-capes/${this.localCollection.assetRecordId}`);
}
this.datadissmiss=false;
    }
    allVendorInfoFilter:any=[];
    allGlInfoFilter:any=[];
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
    filterWarentyGl(event) {
		this.allGlInfoFilter = this.allGlInfo;
		if (event.query !== undefined && event.query !== null) {
            this.glList(event.query);
        }else{
            this.glList('');
        }
			const vendors = [...this.allGlInfo.filter(x => {
				return x.name.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.allGlInfoFilter = vendors;
		
    }
    filterWarentyVendor2(event) {
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
    filterWarentyGl2(event) {
		this.allGlInfoFilter = this.allGlInfo;
		if (event.query !== undefined && event.query !== null) {
            this.glList(event.query);
        }else{
            this.glList('');
        }
			const vendors = [...this.allGlInfo.filter(x => {
				return x.name.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.allGlInfoFilter = vendors;
	
    }
    filterWarentyVendor3(event) {

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
    filterWarentyGl3(event) {
		this.allGlInfoFilter = this.allGlInfo;
		if (event.query !== undefined && event.query !== null) {
            this.glList(event.query);
        }else{
            this.glList('');
        }
			const vendors = [...this.allGlInfo.filter(x => {
				return x.name.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.allGlInfoFilter = vendors;
	
    } 
    filterWarentyVendor4(event) {
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
    filterWarentyGl4(event) {
		this.allGlInfoFilter = this.allGlInfo;
		if (event.query !== undefined && event.query !== null) {
            this.glList(event.query);
        }else{
            this.glList('');
        }
			const vendors = [...this.allGlInfo.filter(x => {
				return x.name.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.allGlInfoFilter = vendors;
	
    }
    currentData:any={};
    setAutocompleteOnLoad(collection){

collection.calibrationGlAccountId= collection.calibrationGlAccountId ==0 ? null : {glAccountId:collection.calibrationGlAccountId,name:collection.calibrationGlAccount};
collection.certificationGlAccountId=collection.certificationGlAccountId ==0 ? null :{glAccountId:collection.certificationGlAccountId,name:collection.certificationGlAccount};
collection.inspectionGlaAccountId= collection.inspectionGlaAccountId ==0 ? null :{glAccountId:collection.inspectionGlaAccountId,name:collection.inspectionGlAccount};
collection.verificationGlAccountId= collection.verificationGlAccountId ==0 ? null :{glAccountId:collection.verificationGlAccountId,name:collection.verificationGlAccount};
collection.calibrationDefaultVendorId=collection.calibrationDefaultVendorId ==0 ? null : {vendorId:collection.calibrationDefaultVendorId,name:collection.calibrationVendor};
collection.certificationDefaultVendorId= collection.certificationDefaultVendorId ==0 ? null :{vendorId:collection.certificationDefaultVendorId,name:collection.certificationVendor};
collection.inspectionDefaultVendorId=collection.inspectionDefaultVendorId ==0 ? null : {vendorId:collection.inspectionDefaultVendorId,name:collection.inspectionVendor};
collection.verificationDefaultVendorId= collection.verificationDefaultVendorId ==0 ? null :{vendorId:collection.verificationDefaultVendorId,name:collection.verificationVendor};
}
memoType:any;
onAddTextAreaInfo(material,type) {
    this.disableEditor=true;
    this.textAreaInfo = material;
    this.memoType=type;
}
textAreaInfo: any;
disableEditor:any=true;
editorgetmemo(ev){
    this.disableEditor=false;
                }
onSaveTextAreaInfo(memo) { 
    this.disableSaveForEdit=false;
    if (memo) {
        this.textAreaInfo = memo;
        if(this.memoType==1){
            this.currentCalibration.calibrationMemo = memo;

        }else if(this.memoType==2){
            this.currentCalibration.certificationMemo = memo;
        } else if(this.memoType==3){
            this.currentCalibration.inspectionMemo = memo;
        } else if(this.memoType==4){
            this.currentCalibration.verificationMemo = memo;
        } else if(this.memoType==5){
            this.currentCalibration.assetCalibrationMemo = memo;
        } 
    }
    $("#textarea-popup").modal("hide");
}
onCloseTextAreaInfo() {
    $("#textarea-popup").modal("hide");
}

verificationMethod(){
    this.currentCalibration.verificationFrequencyMonths=0;
    this.currentCalibration.verificationFrequencyDays=0;
    this.currentCalibration.verificationDefaultVendorId=null;
    this.currentCalibration.verificationDefaultCost= "0.00";
    this.currentCalibration.verificationCurrencyId=null;
    this.currentCalibration.verificationGlAccountId=null;
    this.currentCalibration.verificationMemo="";
}
inspectionMethod(){
    this.currentCalibration.inspectionFrequencyMonths=0
    this.currentCalibration.inspectionFrequencyDays=0
    this.currentCalibration.inspectionDefaultVendorId=null;
    this.currentCalibration.inspectionDefaultCost= "0.00";
    this.currentCalibration.inspectionCurrencyId=null;
    this.currentCalibration.inspectionGlaAccountId=null;
    this.currentCalibration.inspectionMemo="";
}

ceretificationMethod(){
    this.currentCalibration.certificationFrequencyMonths=0
    this.currentCalibration.certificationFrequencyDays=0
    this.currentCalibration.certificationDefaultVendorId=null;
    this.currentCalibration.certificationDefaultCost= "0.00";
    this.currentCalibration.certificationCurrencyId=null;
    this.currentCalibration.certificationGlAccountId=null;
    this.currentCalibration.certificationMemo="";
}
calibrationMethod(){
    this.currentCalibration.calibrationFrequencyMonths=0
    this.currentCalibration.calibrationFrequencyDays=0
    this.currentCalibration.calibrationDefaultVendorId=null;
    this.currentCalibration.calibrationDefaultCost= "0.00";
    this.currentCalibration.calibrationCurrencyId=null;
    this.currentCalibration.calibrationGlAccountId=null;
    this.currentCalibration.calibrationMemo="";
    this.currentCalibration.assetCalibrationMin="";
    this.currentCalibration.assetCalibrationMinTolerance="";
    this.currentCalibration.assetCalibratonMax="";
    this.currentCalibration.assetCalibrationMaxTolerance="";
    this.currentCalibration.assetCalibrationExpected="";
    this.currentCalibration.assetCalibrationExpectedTolerance="";
    this.currentCalibration.assetCalibrationMemo="";
}




errorMessageHandler(log) {
    this.isSpinnerVisible=false;
}
parsedText(text) {
    
if(text){
    const dom = new DOMParser().parseFromString(
        '<!doctype html><body>' + text,
        'text/html');
        const decodedString = dom.body.textContent;
        return decodedString;
}
  }
}
