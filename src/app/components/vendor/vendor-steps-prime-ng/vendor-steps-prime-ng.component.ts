import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Message } from 'primeng/components/common/message';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorService } from '../../../services/vendor.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';


@Component({
	selector: 'app-vendor-steps-prime-ng',
	templateUrl: './vendor-steps-prime-ng.component.html',
	styleUrls: ['./vendor-steps-prime-ng.component.scss']
})
/** vendor-steps-primeNG component*/
export class VendorStepsPrimeNgComponent implements OnInit {
	activeMenuItem: number = 1;
	//currentTab: string = 'General';
	ifvalue: boolean;
	generalcollection: any;
	collection: any;
	currentUrl: any;
	isDisabledSteps = false;
	vendorId:any;
	items: MenuItem[];
	msgs: Message[] = [];
	breadcrumbs: MenuItem[];
	showComponentPTab: boolean;
	editMode: boolean = false;
	isEditMode:boolean =false;
	isView:boolean=true;
	constructor(private router: ActivatedRoute,
		private _changeDetectionRef: ChangeDetectorRef,
		private route: Router, public vendorService: VendorService,private authService:AuthService) {
			this.isView=this.authService.checkPermission([ModuleConstants.VendorsList+'.'+PermissionConstants.View]);
		if(this.vendorService.vendorId){
			this.vendorId = this.vendorService.vendorId;
		}
		this.vendorService.activeStep.subscribe(activeIndex => {
			this.changeStep(activeIndex);
		})
	}

	isShowTab(value){
		
		var isShow=this.authService.ShowTab('Create Vendor',value);
		return isShow;
	
	}
	ngOnInit() {
		if(this.vendorService.vendorId){
			this.vendorId = this.vendorService.vendorId;
		}
		if (this.vendorService.isEditMode) {
			this.isDisabledSteps = true;
		}
		this.breadcrumbs = [
			{ label: 'Vendor' },
		];
		if (this.vendorId) {
			this.editMode = true;
			this.breadcrumbs = [...this.breadcrumbs, {
				 label: this.vendorService.isEditMode==true ? 'Edit Vendor' : 'Create Vendor' 
			}]
		}else{
			this.breadcrumbs = [...this.breadcrumbs, {
				label: this.vendorService.isEditMode==true ? 'Edit Vendor' : 'Create Vendor' 
		   }]
		} 

		// if(localStorage.getItem('currentTab')){
        //     this.changeStep(localStorage.getItem('currentTab'))
        // } else{
        // }

		if(this.route.url.includes('app-vendor-general-information')){
			this.activeMenuItem = 1;
		}else if(this.route.url.includes('app-vendor-capes')){
			this.activeMenuItem = 2;
		}else if(this.route.url.includes('app-vendor-contacts')){
			this.activeMenuItem = 3;
		}else if(this.route.url.includes('app-vendor-ata')){
			this.activeMenuItem = 4;
		}else if(this.route.url.includes('app-vendor-financial-information')){
			this.activeMenuItem = 5;
		}else if(this.route.url.includes('app-vendor-billing-information')){
			this.activeMenuItem = 6;
		}else if(this.route.url.includes('app-vendor-payment-information')){
			this.activeMenuItem =7;
		}else if(this.route.url.includes('app-vendor-shipping-information')){
			this.activeMenuItem = 8;
		}else if(this.route.url.includes('app-vendor-warnings')){
			this.activeMenuItem = 9;
		}else if(this.route.url.includes('app-vendor-memo')){
			this.activeMenuItem = 10;
		}else if(this.route.url.includes('app-vendor-documents')){
			this.activeMenuItem = 11;
		}
	}
	
	changeStep(value) {
		const vendorId = (this.vendorService.listCollection && this.vendorService.listCollection != undefined && this.vendorService.listCollection.vendorId) ? this.vendorService.listCollection.vendorId : this.vendorId;
		const newvendorId= vendorId ? vendorId : this.router.snapshot.params['id'];
		if (value == 1) {
			this.activeMenuItem = 1;
			this.route.navigateByUrl(`/vendorsmodule/vendorpages/app-vendor-general-information/${newvendorId}`);
		}

		else if (value == 2) {
			this.activeMenuItem = 2;
			this.route.navigateByUrl(`/vendorsmodule/vendorpages/app-vendor-capes/${newvendorId}`);
		}
		else if (value == 3) {

			this.activeMenuItem = 3;
			this.route.navigateByUrl(`/vendorsmodule/vendorpages/app-vendor-contacts/${newvendorId}`);
		}
		else if (value == 4) {
			this.activeMenuItem = 4;
			this.route.navigateByUrl(`/vendorsmodule/vendorpages/app-vendor-ata/${newvendorId}`);
		}
		else if (value == 5) {

			this.activeMenuItem = 5;
			this.route.navigateByUrl(`/vendorsmodule/vendorpages/app-vendor-financial-information/${newvendorId}`);
		}
		else if (value == 6) {

			this.activeMenuItem = 6;
			this.route.navigateByUrl(`/vendorsmodule/vendorpages/app-vendor-billing-information/${newvendorId}`);
		}
		else if (value == 7) {

			this.activeMenuItem = 7;
			this.route.navigateByUrl(`/vendorsmodule/vendorpages/app-vendor-payment-information/${newvendorId}`);
		}
		else if (value == 8) {

			this.activeMenuItem = 8;
			this.route.navigateByUrl(`/vendorsmodule/vendorpages/app-vendor-shipping-information/${newvendorId}`);
		}
		else if (value == 9) {

			this.activeMenuItem = 9;
			this.route.navigateByUrl(`/vendorsmodule/vendorpages/app-vendor-warnings/${newvendorId}`);
		}
		else if (value == 10) {

			this.activeMenuItem = 10;
			this.route.navigateByUrl(`/vendorsmodule/vendorpages/app-vendor-memo/${newvendorId}`);
		}
		else if (value == 11) {

			this.activeMenuItem = 11;
			this.route.navigateByUrl(`/vendorsmodule/vendorpages/app-vendor-documents/${newvendorId}`);
		}
	}
}