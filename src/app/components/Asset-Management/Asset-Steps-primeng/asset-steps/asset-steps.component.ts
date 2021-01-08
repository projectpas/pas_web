import { Component, OnInit } from '@angular/core';
//import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/components/common/message';
import { AssetService } from '../../../../services/asset/Assetservice';
@Component({
    selector: 'app-asset-steps',
    templateUrl: './asset-steps.component.html',
    styleUrls: ['./asset-steps.component.scss']
})
/** Asset-Steps component*/
export class AssetStepsComponent implements OnInit {
    ifvalue: boolean;
    generalcollection: any;
    collection: any;
    currentUrl: any;
    items: {}[];
    readonly = true;
    read = false;
    msgs: Message[] = [];
    activeIndex: number = 0;
    showComponentPTab: boolean;
    isDisabledSteps: boolean = false;
    isEditMode: boolean = false;
    AssetId:any;
    constructor(private router: ActivatedRoute, private route: Router, private assetService: AssetService) {
       // debugger
        this.currentUrl = this.route.url;
       // console.log(this.currentUrl);
        this.assetService.alertChangeObject$.subscribe(value => {
            this.showComponentPTab = value;
            this.currentUrl = this.route.url;
          //  console.log(this.currentUrl);

        });
        this.assetService.indexObjChangeObject$.subscribe(value => {
            this.activeIndex = value;

        });
    } 
    ngOnInit() {
        this.AssetId = this.router.snapshot.params['id'];
        console.log(this.AssetId);
		if (this.AssetId) {
			this.isDisabledSteps = false;
            this.isEditMode = true;
            this.assetService.isEditMode = true;
		}else{
            this.isDisabledSteps = true;
            this.isEditMode = false;
            this.assetService.isEditMode = false;
            this.assetService.listCollection = null;
        }
        //debugger
        this.showComponentPTab = this.assetService.ShowPtab;
        this.currentUrl = this.route.url;
        //console.log(this.currentUrl);
        if (this.assetService.listCollection != null && this.assetService.isEditMode == true) {
            this.isEditMode = true;
        }
        //
        if (this.currentUrl == '/assetmodule/assetpages/app-asset-listing') {
            this.showComponentPTab = false;
          //  console.log(this.showComponentPTab);
            this.activeIndex = 0;


        }
        else if (this.currentUrl == '/assetmodule/assetpages/app-create-asset') {
            this.activeIndex = 0;
            this.showComponentPTab = true;
            console.log(this.showComponentPTab);
            if(!this.isEditMode)
                this.isDisabledSteps = true;

        }
        if (this.currentUrl == '/assetmodule/assetpages/app-edit-asset') {
            this.activeIndex = 0;
            this.showComponentPTab = true;
            this.isDisabledSteps = false;
        }
        if (this.currentUrl == '/assetmodule/assetpages/app-asset-inventory-listing') {
            this.showComponentPTab = false;
            //  console.log(this.showComponentPTab);
            this.activeIndex = 0;


        }
        else if (this.currentUrl == '/assetmodule/assetpages/app-create-asset-inventory') {
            this.activeIndex = 0;
            this.showComponentPTab = true;
            console.log(this.showComponentPTab);
            if (!this.isEditMode)
                this.isDisabledSteps = true;

        }
        if (this.currentUrl == '/assetmodule/assetpages/app-edit-asset-inventory') {
            this.activeIndex = 0;
            this.showComponentPTab = true;
            this.isDisabledSteps = false;
        }
        else if (this.currentUrl == '/assetmodule/assetpages/app-asset-capes') {
            //	this.showComponentPTab = this.vendorService.ShowPtab;
            this.activeIndex = 1;
            this.showComponentPTab = true;
        }

        else if (this.currentUrl == '/assetmodule/assetpages/app-asset-calibration') {

            this.activeIndex = 2;
            this.showComponentPTab = true;
        }
        else if (this.currentUrl == '/assetmodule/assetpages/app-asset-maintenance-warranty') {

            this.activeIndex = 3;
            this.showComponentPTab = true;
        }
       


        this.items = [{
            label: 'General Information',
            step:1,
            index:0,
            command: (event: any) => {
                this.activeIndex = 0;
                this.msgs.length = 0;
                this.msgs.push({ severity: 'info', summary: 'Create Asset', detail: event.label });
                const { assetId } = this.AssetId;                    
                if(this.isEditMode)
                    this.route.navigateByUrl(`assetmodule/assetpages/app-edit-asset/${assetId}`);
                else
                    this.route.navigateByUrl('/assetmodule/assetpages/app-create-asset');

            }
        },
        {
            label: 'Capes',
            step:2,
            index:1,
            command: (event: any) => {
                if(!this.isDisabledSteps){
                    this.assetService.financial = true;
                    this.activeIndex = 1;
                    this.msgs.length = 0;
                    this.msgs.push({ severity: 'info', summary: 'Capes', detail: event.label });
                    const { assetId } = this.AssetId;                    
                        this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-capes/${assetId}`);
                }
                
            }
        },
        {
            label: 'Calibration',
            step:3,
            index:2,
            command: (event: any) => {
                if(!this.isDisabledSteps){
                this.activeIndex = 2;
                this.msgs.length = 0;
                this.msgs.push({ severity: 'info', summary: 'Calibration', detail: event.label });
                this.route.navigateByUrl('/assetmodule/assetpages/app-asset-calibration');
                }
            }
        },
        {
            label: 'Maintenance & Warranty',
            step:4,
            index:3,
            command: (event: any) => {
                if(!this.isDisabledSteps){
                this.activeIndex = 3;
                this.msgs.length = 0;
                this.msgs.push({ severity: 'info', summary: 'Maintenance & Warranty', detail: event.label });                
                this.route.navigateByUrl('/assetmodule/assetpages/app-asset-maintenance-warranty');
                }
            }
        },
        ];
    }

    changeTab(item) {
        console.log(item)
        this.AssetId = this.router.snapshot.params['id'];
        //const { assetId } = this.AssetId;
        if (item.index = 0) {
            this.activeIndex = 0;
            this.route.navigateByUrl(`/assetmodule/assetpages/app-edit-asset/as220`);
        }
        else if (item.index = 1) {
            this.activeIndex = 1;
            this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-capes/as220`);
        }
        else if (item.index = 2) {
            this.activeIndex = 2;
            this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-calibration/as220`);
        }
        else if (item.index = 3) {
            this.activeIndex = 3;
            this.route.navigateByUrl(`/assetmodule/assetpages/app-asset-maintenance-warranty/as220`);
        }
        
    }
}