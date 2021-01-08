import { Component } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { Message } from 'primeng/components/common/message';

import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { VendorService } from '../services/vendor.service';

import { BreadcrumbModule } from 'primeng/breadcrumb'; //Bread Crumb
import { AppComponent } from '../app.component';
import { AppTranslationService } from '../services/app-translation.service';

@Component({
	selector: 'quickapp-pro-vendor',
	templateUrl: './vendorpages.component.html'
})
/** Vendorpages component*/
export class VendorpagesComponent {
	//matSpinner: boolean=true;
	otherurl: any;
	currentUrl: string;
	isVisible :Boolean = true;
	public items: MenuItem[];
	home: MenuItem;
	constructor(private router: ActivatedRoute, private route: Router, public vendorService: VendorService,
		private appComponent: AppComponent, private appTranslationService: AppTranslationService) {
		this.vendorService.bredcrumbObjChangeObject$.subscribe(value => {
			this.otherurl = value;
			this.loadmethod(this.otherurl);
		});
	}
	//Bread Crumb Start
	ngOnInit() {
		this.currentUrl = this.route.url;
		this.loadmethod(this.currentUrl)
	}
	ngOnDestroy() {
	}
	loadmethod(url) {
		this.isVisible = false;
		this.currentUrl = url;
		if (this.currentUrl) {
			if (this.currentUrl == '/vendorsmodule/vendorpages/app-vendors-list') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Vendors List' }
				];
				this.isVisible = false;
			}

			else if (this.currentUrl == '/vendorsmodule/vendorpages/app-vendor-general-information/edit') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Vendor' + "'" + ' General Information' }
				];
				this.isVisible = true;
			}

			else if (this.currentUrl == '/vendorsmodule/vendorpages/app-vendor-general-information') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Vendor' + "'" + ' General Information' }
				];
				this.isVisible = true;
			} 

			else if (this.currentUrl == '/vendorsmodule/vendorpages/app-vendor-capes') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Capabilities' }
				];
				this.isVisible = true;
			}

			else if (this.currentUrl == '/vendorsmodule/vendorpages/app-vendor-contacts') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Contacts' }
				];
				this.isVisible = true;
			}

			else if (this.currentUrl == '/vendorsmodule/vendorpages/app-vendor-financial-information') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Financial Information' }
				];
				this.isVisible = true;
			}

			else if (this.currentUrl == '/vendorsmodule/vendorpages/app-vendor-payment-information') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Payment Information' }
				];
				this.isVisible = true;
			}

			else if (this.currentUrl == '/vendorsmodule/vendorpages/app-vendor-billing-information') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Billing Information' }
				];
				this.isVisible = true;
			}
			else if (this.currentUrl == '/vendorsmodule/vendorpages/app-vendor-shipping-information') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Shipping Information' }
				];
				this.isVisible = true;
			}

			else if (this.currentUrl == '/vendorsmodule/vendorpages/app-vendor-warnings') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Warnings' }
				];
				this.isVisible = true;
			}

			else if (this.currentUrl == '/vendorsmodule/vendorpages/app-vendor-memo') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'Memo' }
				];
				this.isVisible = true;
			}

			else if (this.currentUrl == '/vendorsmodule/vendorpages/app-vendor-emails') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'Vendor Emails' }
				];
				this.isVisible = false;

			}

			else if (this.currentUrl == '/vendorsmodule/vendorpages/app-vendor-conversations') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'Conversations' }
				];
				this.isVisible = false;

			}

			else if (this.currentUrl == 'vendorsmodule/vendorpages/app-create-po') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'Create PO' }
				];
				this.isVisible = false;

			}
			else if (this.currentUrl == 'vendorsmodule/vendorpages/app-polist') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'PO List' }
				];
				this.isVisible = false;

			}
			else if (this.currentUrl == 'vendorsmodule/vendorpages/app-purchase-setup') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'PO Setup' }
				];
				this.isVisible = false;

			}
			else if (this.currentUrl == 'vendorsmodule/vendorpages/app-vendor-capabilities-list') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'Capabilities-list' }
				];
				this.isVisible = false;

			}
			else if (this.currentUrl == 'vendorsmodule/vendorpages/app-add-vendor-capabilities') {
				this.items = [
					{ label: 'Add Vendor' },
					{ label: 'capabilities' }
				];
				this.isVisible = false;

			}
			else if (this.currentUrl == 'vendorsmodule/vendorpages/app-po-settings') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'PO Setting' }
				];
				this.isVisible = false;

			}
		}
		if (this.otherurl) {
			if (this.otherurl == '/vendorsmodule/vendorpages/app-vendors-list') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Vendors List' }
				];
				this.isVisible = false;

			}

			else if (this.otherurl == '/vendorsmodule/vendorpages/app-vendor-general-information') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Vendor' + "'s" + ' General Information' }
				];
			}

			else if (this.otherurl == '/vendorsmodule/vendorpages/app-vendor-capes') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Capabilities' }
				];
			}

			else if (this.otherurl == '/vendorsmodule/vendorpages/app-vendor-contacts') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Contacts' }
				];
			}

			else if (this.otherurl == 'vendorsmodule/vendorpages/app-vendor-financial-information') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Financial Information' }
				];
			}

			else if (this.otherurl == '/vendorsmodule/vendorpages/app-vendor-payment-information') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Payment Information' }
				];
			}

			else if (this.otherurl == '/vendorsmodule/vendorpages/app-vendor-shipping-information') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Shipping Information' }
				];
			}

			else if (this.otherurl == '/vendorsmodule/vendorpages/app-vendor-warnings') {
				this.items = [
					{ label: 'Vendor', url: '/vendorsmodule/vendorpages/app-vendors-list' },
					{ label: 'Warnings' }
				];
			}

			else if (this.otherurl == '/vendorsmodule/vendorpages/app-vendor-memo') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'Memo' }
				];
			}

			else if (this.otherurl == '/vendorsmodule/vendorpages/app-vendor-documents') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'Documents' }
				];
			}

			else if (this.otherurl == '/vendorsmodule/vendorpages/app-vendor-emails') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'Emails' }
				];
				this.isVisible = false;

			}

			else if (this.otherurl == '/vendorsmodule/vendorpages/app-vendor-conversations') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'Conversations' }
				];
				this.isVisible = false;

			}
			else if (this.otherurl == 'vendorsmodule/vendorpages/app-create-po') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'Create PO' }
				];
				this.isVisible = false;

			}
			else if (this.otherurl == 'vendorsmodule/vendorpages/app-create-po') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'Create PO' }
				];
				this.isVisible = false;

			}
			else if (this.otherurl == 'vendorsmodule/vendorpages/app-polist') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'PO List' }
				];
				this.isVisible = false;

			}
			else if (this.otherurl == 'vendorsmodule/vendorpages/app-purchase-setup') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'PO Setup' }
				];
				this.isVisible = false;

			}
			else if (this.currentUrl == 'vendorsmodule/vendorpages/app-vendor-capabilities-list') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'Capabilities-list' }
				];
				this.isVisible = false;

			}
			else if (this.currentUrl == 'vendorsmodule/vendorpages/app-add-vendor-capabilities') {
				this.items = [
					{ label: 'Add Vendor' },
					{ label: 'capabilities' }
				];
				this.isVisible = false;

			}
			else if (this.currentUrl == 'vendorsmodule/vendorpages/app-po-settings') {
				this.items = [
					{ label: 'Vendor' },
					{ label: 'PO Setting' }
				];
				this.isVisible = false;

			}
		}
	}
}