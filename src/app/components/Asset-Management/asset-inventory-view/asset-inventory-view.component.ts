import { Component, OnInit, AfterViewInit, ViewChild, Input, ContentChildren } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { CommonService } from '../../../services/common.service';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
declare var $ : any;
// import { ConfigurationService } from '../../../../services/configuration.service';
// import { DBkeys } from '../../../../services/db-Keys';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { formatNumberAsGlobalSettingsModule } from '../../../generic/autocomplete';
import { AssetService } from '../../../services/asset/Assetservice';

@Component({
    selector: 'app-asset-inventory-view',
    templateUrl: './asset-inventory-view.component.html',
    styleUrls: ['./asset-inventory-view.component.scss'],
    animations: [fadeInOut]
})

export class AssetInventoryViewComponent implements OnInit {
    @Input() assetInventoryId;
    isSpinnerVisibleHistory:boolean=false;
    currentAsset:any={};
    maintanancemoduleName='AssetInventoryMaintenanceFile';
    warrantymoduleName='AssetInventoryWarrantyFile';
    intangiblemoduleName='AssetInventoryIntangibleFile';
    constructor(private commonService: CommonService,
         private activeModal: NgbActiveModal,public assetService: AssetService,
        private alertService: AlertService,
        private modalService: NgbModal,
    ) {}
    ngOnInit(): void {
        this.getAssetinventory();
    }

    getAssetinventory() {
        this.isSpinnerVisibleHistory = true;
        if(this.assetInventoryId !=undefined){
        this.assetService.getByInventoryId(this.assetInventoryId).subscribe(res => {
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

          
            
            this.assetInventoryId=this.assetInventoryId;
            setTimeout(()=>{
                this.isSpinnerVisibleHistory = false;
            },1000)
        },err=>{
            this.isSpinnerVisibleHistory = false;
            const errorLog = err;
        });
    }
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
      dismissModel() {
        this.activeModal.close();
    }
}