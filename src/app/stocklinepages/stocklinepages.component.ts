import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Message } from 'primeng/components/common/message';

import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { VendorService } from '../services/vendor.service';

import { BreadcrumbModule } from 'primeng/breadcrumb'; //Bread Crumb
import { AppComponent } from '../app.component';
import { AppTranslationService } from '../services/app-translation.service';
import { StocklineService } from '../services/stockline.service';

@Component({
	selector: 'app-stocklinepages',
	templateUrl: './stocklinepages.component.html',
	styleUrls: ['./stocklinepages.component.scss']
})
/** stocklinepages component*/
export class StocklinepagesComponent {
	otherurl: any;
	currentUrl: string;

	public items: MenuItem[];
	home: MenuItem;
	/** stocklinepages ctor */
	constructor(private router: ActivatedRoute, private route: Router, private stockLineService: StocklineService,
		private appComponent: AppComponent, private appTranslationService: AppTranslationService) {

		this.stockLineService.bredcrumbObjChangeObject$.subscribe(value => {
			//debugger
			this.otherurl = value;
			this.loadmethod(this.otherurl);

		});
	}
	ngOnInit() {
		this.currentUrl = this.route.url;
		this.loadmethod(this.currentUrl)

	}
	loadmethod(url) {

		this.currentUrl = url;
		if (this.currentUrl) {
			if (this.currentUrl == '/stocklinemodule/stocklinepages/app-stock-line-list') {
				this.items = [
					{ label: 'Stock Line' },
					{ label: 'Stock Line-List' }
				];
			}
			else if (this.currentUrl == '/stocklinemodule/stocklinepages/app-stock-line-setup') {
				this.items = [
					{ label: 'StockLine' },
					{ label: 'StockLine-Create ' }
				];
			}
			else if (this.currentUrl == '/stocklinemodule/stocklinepages/app-stock-line-setup') {
				this.items = [
					{ label: 'Stock Line' },
					{ label: 'StockLine-Create ' }
				];
			}
			else if (this.currentUrl == '/stocklinemodule/stocklinepages/app-stock-line-edit') {
				this.items = [
					{ label: 'Stock Line' },
					{ label: 'StockLine-Edit ' }
				];
			}
			else if (this.currentUrl == '/stocklinemodule/stocklinepages/app-stock-adjustment')
			{
			this.items = [
				{ label: 'Stock Line' },
				{ label: 'Stock Line Adjustment' }
				];
			}
		}
		

		if (this.otherurl) {
			if (this.currentUrl == '/stocklinemodule/stocklinepages/app-stock-line-list') {
				this.items = [
					{ label: 'Stock Line' },
					{ label: 'Stock Line-List' }
				];
			}
			else if (this.otherurl == '/stocklinemodule/stocklinepages/app-stock-line-setup') {
				this.items = [
					{ label: 'Stock Line' },
					{ label: (window.location.href.includes('edit'))?'Edit Stock Line':'Create Stock Line' }
				];
			}
			else if (this.otherurl == '/stocklinemodule/stocklinepages/app-stock-line-edit') {
				this.items = [
					{ label: 'Stock Line' },
					{ label: 'Stock Line-Edit' }
				];
			}
			else if (this.currentUrl == '/stocklinemodule/stocklinepages/app-stock-adjustment') {
				this.items = [
					{ label: 'Stock Line' },
					{ label: 'Stock Line Adjustment' }
				];
			}
		}
	}
}