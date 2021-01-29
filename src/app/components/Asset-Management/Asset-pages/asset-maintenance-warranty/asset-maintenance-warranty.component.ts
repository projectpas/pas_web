import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { AssetService } from '../../../../services/asset/Assetservice';
import { AuthService } from '../../../../services/auth.service';
import { GlAccountService } from '../../../../services/glAccount/glAccount.service';
import { VendorService } from '../../../../services/vendor.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// declare var $ : any;
declare var $ : any;
import { MenuItem } from 'primeng/api';
@Component({
    selector: 'app-asset-maintenance-warranty',
    templateUrl: './asset-maintenance-warranty.component.html',
    styleUrls: ['./asset-maintenance-warranty.component.scss']
})
/** asset-maintenance-warranty component*/
export class AssetMaintenanceWarrantyComponent implements OnInit {

    @ViewChild("tabRedirectConfirmationModal4",{static:false}) public tabRedirectConfirmationModal4: ElementRef;
    currentMaintenance: any = {};
    disableSaveForEdit:boolean=false; 
    activeIndex: number;
    showLable: boolean;
    local: any;
    isSpinnerVisible:boolean=false;
    modal: NgbModalRef;
    allGlInfo: any=[];
    allVendorInfo:any=[];
    AssetId: any;
    static assetService;
    breadcrumbs: MenuItem[];
    home: any;
    isSaving: boolean;
    @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
    formData = new FormData()
    nextOrPreviousTab: any;
    /** asset-maintenance-warranty ctor */
    constructor(private router: ActivatedRoute, public assetService: AssetService, private vendorService: VendorService, private route: Router,
        private authService: AuthService,
        private modalService: NgbModal, private alertService: AlertService, private glAccountService: GlAccountService, private commonservice: CommonService, ) {
        this.AssetId = this.router.snapshot.params['id'];
        this.activeIndex = 3;
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
        this.getModuleListForVendorOther();
        this.AssetId = this.router.snapshot.params['id'];
            if(this.AssetId){
            this.GetAssetData(this.AssetId);
            }
        this.disableSaveForEdit=true;
        this.activeIndex = 3;
        this.glList('');
        this.vendorList('');
    }
    private GetAssetData(assetid) {
        this.isSpinnerVisible=true;
        if(assetid !=undefined){
        this.assetService.getByAssetId(assetid).subscribe(
            results =>{ this.onassetdataSuccessful(results)},err => {			
                const errorLog = err;
                this.errorMessageHandler(errorLog);}
        );
            }
    }
    private onassetdataSuccessful(getAssetData: any[]) {
        this.activeIndex = 3;
        this.assetService.indexObj.next(this.activeIndex);
        this.assetService.listCollection=getAssetData[0];
        this.currentMaintenance = getAssetData[getAssetData.length - 1];
        this.isSpinnerVisible=false; 
        this.currentMaintenance.assetRecordId=getAssetData[0].assetRecordId;
        if(this.assetService.listCollection.assetMain==true){
            this.assetService.isEditMode=true;
        }
        this.assetService.listCollection.assetRecordId=getAssetData[0].assetRecordId;
        this.setAutocompleteOnLoad(this.currentMaintenance);
      if(this.currentMaintenance.warrantyDefaultVendorId !=0 || this.currentMaintenance.warrantyDefaultVendorId !=null){
            this.warrantyCompanySelectList.forEach(element => {
                if(element.moduleName =='Vendor'){
                    this.currentMaintenance.warrantyCompanySelectId=element.moduleId;
                    this.setWarrenty(element.moduleId);
                }
            });
        }else{ 
            this.warrantyCompanySelectList.forEach(element => {
                if(element.moduleName =='Other'){
                    this.currentMaintenance.warrantyCompanySelectId=element.moduleId;
                    this.setWarrenty(element.moduleId);
                }
            });
        }
        this.glList('');
    }
    getmemo($event) {
        this.disableSaveForEdit=false;
            }
    warrantyCompanySelectList:any=[];
    getModuleListForVendorOther() {
        this.commonservice.getModuleListForVendorOther().subscribe(res => {
            this.warrantyCompanySelectList = res;
        },err => {			
            const errorLog = err;
            this.errorMessageHandler(errorLog);})
    }
    isShowVendorDropDown:boolean=false;
    isShowOtherTextBox:boolean=false;
    currentValue:any;
    setWarrenty(value){
        

        this.currentMaintenance.warrantyCompanySelectId=value;
        this.currentValue='';
        this.warrantyCompanySelectList.forEach(element => {
            if(element.moduleId==value){
                this.currentValue=element.moduleName;
            }
        });

        if(this.currentValue=='Vendor'){
            this.isShowVendorDropDown=true;
            this.isShowOtherTextBox=false;
        }else if (this.currentValue=='Others'){
            this.isShowOtherTextBox=true;
            this.isShowVendorDropDown=false;
        }
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    removeFile(event) {
        this.formData.delete(event.file.name)

    }
    finalData:any={};
    errorDisplay:any;
    saveWarrenty() {
        this.finalData={};
        this.currentMaintenance.createdBy = this.userName;
        this.currentMaintenance.updatedBy = this.userName;

        this.currentMaintenance.masterCompanyId =this.authService.currentUser.masterCompanyId; 
       if (this.currentMaintenance.assetMain==true) {
            this.currentMaintenance.updatedBy = this.userName;
            this.currentMaintenance.masterCompanyId = this.authService.currentUser.masterCompanyId;
            this.isSaving = true;
            if (this.currentMaintenance.assetIsMaintenanceReqd == false || this.currentMaintenance.isDepreciable == false) {
                this.currentMaintenance.assetMaintenanceIsContract = false;
                this.currentMaintenance.assetMaintenanceContractFile = "";
                this.currentMaintenance.maintenanceFrequencyMonths = 0;
                this.currentMaintenance.maintenanceFrequencyDays = 0;
                this.currentMaintenance.maintenanceMemo = "";
                this.currentMaintenance.maintenanceDefaultVendorId = null;
                this.currentMaintenance.maintenanceGLAccountid = null;
          
            }
            this.currentMaintenance.maintenanceFrequencyMonths=this.currentMaintenance.maintenanceFrequencyMonths ? this.currentMaintenance.maintenanceFrequencyMonths:0;
            this.currentMaintenance.maintenanceFrequencyDays=this.currentMaintenance.maintenanceFrequencyDays ? this.currentMaintenance.maintenanceFrequencyDays :0;
            if (this.currentMaintenance.isWarrantyRequired == false || this.currentMaintenance.isDepreciable == false) {
                this.currentMaintenance.warranty = "";
                this.currentMaintenance.warrantyCompany = "";
                this.currentMaintenance.warrantyStatus = "";
                this.currentMaintenance.warrantyDefaultVendorId = null;
                this.currentMaintenance.warrantyGLAccountId = null;
            }
            if (this.currentMaintenance.assetIsMaintenanceReqd == true && (this.currentMaintenance.maintenanceFrequencyMonths==0 && this.currentMaintenance.maintenanceFrequencyDays==0)){
                this.alertService.showMessage("Warning",'Maintenance Months & Days Cant be Zero', MessageSeverity.warn);
           
           return;
         }
            this.finalData={...this.currentMaintenance} 
            this.finalData.maintenanceFrequencyDays=this.finalData.maintenanceFrequencyDays!=null ? this.finalData.maintenanceFrequencyDays : 0;
            this.finalData.maintenanceFrequencyMonths=this.finalData.maintenanceFrequencyMonths !=null? this.finalData.maintenanceFrequencyMonths : 0;
            this.finalData.warrantyDefaultVendorId=this.finalData.warrantyDefaultVendorId ? this.finalData.warrantyDefaultVendorId.vendorId : null;
            this.finalData.warrantyGLAccountId=this.finalData.warrantyGLAccountId ? this.finalData.warrantyGLAccountId.glAccountId : null;
            this.finalData.maintenanceGLAccountId=this.finalData.maintenanceGLAccountId ? this.finalData.maintenanceGLAccountId.glAccountId :null;
            this.finalData.maintenanceDefaultVendorId=this.finalData.maintenanceDefaultVendorId ? this.finalData.maintenanceDefaultVendorId.vendorId :null;
               this.isSpinnerVisible=true;
            this.assetService.updateAssetMaintance(this.finalData).subscribe(data => {
                    this.disableSaveForEdit=true;
                    this.currentMaintenance.updatedBy = this.userName;
                    setTimeout(() => {
                        this.isSpinnerVisible=false;
                       }, 1200);
                  this.alertService.showMessage("Success", `Asset Maintenance updated successfully.`, MessageSeverity.success);
                },err => {		
                    this.isSpinnerVisible=false;	
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);})
        }  else {
            this.finalData={...this.currentMaintenance}
            this.finalData.warrantyDefaultVendorId=this.finalData.warrantyDefaultVendorId ? this.finalData.warrantyDefaultVendorId.vendorId : null;
            this.finalData.warrantyGLAccountId=this.finalData.warrantyGLAccountId ? this.finalData.warrantyGLAccountId.glAccountId :null;
            this.finalData.maintenanceGLAccountId=this.finalData.maintenanceGLAccountId ? this.finalData.maintenanceGLAccountId.glAccountId :null;
            this.finalData.maintenanceDefaultVendorId=this.finalData.maintenanceDefaultVendorId ? this.finalData.maintenanceDefaultVendorId.vendorId :null;
           
            this.finalData.maintenanceFrequencyDays=this.finalData.maintenanceFrequencyDays!=null ? this.finalData.maintenanceFrequencyDays : 0;
            this.finalData.maintenanceFrequencyMonths=this.finalData.maintenanceFrequencyMonths !=null? this.finalData.maintenanceFrequencyMonths : 0;
            if (this.finalData.assetIsMaintenanceReqd == true && (this.finalData.maintenanceFrequencyMonths==0 && this.finalData.maintenanceFrequencyDays==0)){
                this.alertService.showMessage("Warning",'Maintenance Months & Days Cant be Zero', MessageSeverity.warn);
           
           return;
         }
         this.isSpinnerVisible=true;
            this.assetService.addAssetMaintance(this.finalData).subscribe(data => {
                this.currentMaintenance.assetMain=true;
        setTimeout(() => {
            this.isSpinnerVisible=false;
           }, 1200);
   this.alertService.showMessage("Success", `Asset Maintanance & Warrenty created successfully`, MessageSeverity.success);
                    this.currentMaintenance.updatedBy = this.userName;
                   
                    this.activeIndex = 3;
                },err => {		
                    this.isSpinnerVisible=false;	
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);})
            }
    }
    addNew(){
        this.route.navigateByUrl('assetmodule/assetpages/app-create-asset');
        this.assetService.listCollection={};
        this.assetService.isEditMode = false;
    }
    validateDates(value,obj){
        if(value && (value <0 || value >31)){
            value='';
                obj.maintenanceFrequencyDays=null;
          
            this.alertService.showMessage("Warning",'Maintanance Days Cant greater than 31 days', MessageSeverity.warn);
        }
    }
    changeOfTab(value) {
        if (this.assetService.isEditMode == true || this.currentMaintenance.assetMain==true) {
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
    glList(value) {
        this.setEditArray = [];
        if (this.assetService.isEditMode == true) {
            this.setEditArray.push(this.currentMaintenance.warrantyGLAccountId !=null ? this.currentMaintenance.warrantyGLAccountId.glAccountId : 0,
                this.currentMaintenance.maintenanceGLAccountId !=null  ? this.currentMaintenance.maintenanceGLAccountId.glAccountId : 0
                );
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonservice.getAutoCompleteDropDownsByCodeWithName('GLAccount', 'GLAccountId', 'AccountName', 'AccountCode', strText, 20, this.setEditArray.join()).subscribe(res => {
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
    arrayVendlsit:any=[];
    private vendorList(value) {
            this.arrayVendlsit.push(); 
        this.vendorService.getVendorNameCodeListwithFilter(value,20,this.arrayVendlsit.join()).subscribe(res => {
            
            this.allVendorInfo = res.map(x => {
                return {
                    vendorId: x.vendorId,
                    name: x.vendorName
                }
            }); 
            this.allVendorInfoFilter= this.allVendorInfo;
        },err => {			
            const errorLog = err;
            this.errorMessageHandler(errorLog);})
    }
    backClick(nextOrPrevious) {
        this.nextOrPreviousTab = nextOrPrevious;
        let content = this.tabRedirectConfirmationModal4;
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
        if(!this.disableSaveForEdit && !this.datadissmiss){
            this.saveWarrenty();
        }
        this.dismissModel();
        this.activeIndex = 2;
        this.assetService.indexObj.next(this.activeIndex);
        this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-calibration/${this.assetService.listCollection.assetRecordId}`);
        this.datadissmiss=false;
    }

 
    allVendorInfoFilter:any=[];
    allGlInfoFilter:any=[];
    filterWarentyVendor(event) {

        this.allVendorInfoFilter = this.allVendorInfo;
		if (event.query !== undefined && event.query !== null) {
            this.vendorList(event.query)
        }else{
            this.vendorList('')
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
            this.vendorList('')
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
    
   setAutocompleteOnLoad(currentMaintenance){ 
currentMaintenance.warrantyDefaultVendorId= currentMaintenance.warrantyDefaultVendorId==0 ? null :{vendorId:currentMaintenance.warrantyDefaultVendorId,name:currentMaintenance.warrantyVendor};
currentMaintenance.maintenanceDefaultVendorId= currentMaintenance.maintenanceDefaultVendorId==0 ? null :{vendorId:currentMaintenance.maintenanceDefaultVendorId,name:currentMaintenance.maintenanceVendor};
currentMaintenance.maintenanceGLAccountId=currentMaintenance.maintenanceGLAccountId ==0 ? null :{glAccountId:currentMaintenance.maintenanceGLAccountId,name:currentMaintenance.maintenanceGlAccount};
currentMaintenance.warrantyGLAccountId=currentMaintenance.warrantyGLAccountId ==0 ? null :{glAccountId:currentMaintenance.warrantyGLAccountId,name:currentMaintenance.warrantyGlACoount};
}
onAddTextAreaInfo(material) {
    this.textAreaInfo = material;
    this.disableEditor=true;
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
        this.currentMaintenance.maintenanceMemo = memo;
    }
    $("#textarea-popup").modal("hide");
}
onCloseTextAreaInfo() {
    $("#textarea-popup").modal("hide");
}

warrentyCheckBoxHndl(warrenty){
    this.currentMaintenance.warrantyCompany="";
    this.currentMaintenance.warrantyDefaultVendorId=null;
    this.currentMaintenance.warrantyGLAccountId=null;
                if(warrenty==false){
this.disableSaveForEdit=false;
    }
}
maintannaceCheckBoxHndl(maintanance){

    this.currentMaintenance.maintenanceFrequencyMonths=0;
    this.currentMaintenance.maintenanceFrequencyDays=0;
    this.currentMaintenance.maintenanceDefaultVendorId=null;
    this.currentMaintenance.maintenanceGLAccountId=null;
    this.currentMaintenance.maintenanceMemo="";
                            if(maintanance==false){
        this.disableSaveForEdit=false;
            }
}

errorMessageHandler(log) {
    this.isSpinnerVisible=false;
    this.alertService.showMessage(
        'Error',
        log,
        MessageSeverity.error
    ); 
//     var msg = '';

//     if( typeof log.error == 'string' ) {
//         this.alertService.showMessage(
//             'Error',
//             log.error,
//             MessageSeverity.error
//         ); 

//     }else{
    

//       if (log.error && log.error.errors.length > 0) {
//                 for (let i = 0; i < log.error.errors.length; i++){
//                     msg = msg + log.error.errors[i].message + '<br/>'
//                 }
//             }
//             this.alertService.showMessage(
//                 log.error.message,
//                 msg,
//                 MessageSeverity.error
//             );
       
// }
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