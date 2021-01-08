import { Component, OnInit, AfterViewInit } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { AssetService } from '../../../../services/asset/Assetservice';

@Component({
    selector: 'app-asset-general-information',
    templateUrl: './asset-general-information.component.html',
    styleUrls: ['./asset-general-information.component.scss']
})
/** asset-general-information component*/
export class AssetGeneralInformationComponent implements OnInit, AfterViewInit {
    ngAfterViewInit(): void {
        throw new Error("Method not implemented.");
    }
   
    activeIndex: number;
    constructor(private assetService: AssetService) {

    }

    ngOnInit(): void
    {
        this.assetService.currentUrl = '/assetmodule/assetpages/app-asset-general-information';
        this.assetService.bredcrumbObj.next(this.assetService.currentUrl);
        //steps Code  Start
        this.assetService.ShowPtab = true;
        this.assetService.alertObj.next(this.assetService.ShowPtab); //steps
        this.activeIndex = 0;
    }
}