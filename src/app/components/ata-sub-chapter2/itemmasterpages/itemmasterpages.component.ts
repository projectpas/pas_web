//import { Component } from "@angular/core";
//import { BreadcrumbModule } from 'primeng/breadcrumb'; //Bread Crumb
//import { StepsModule } from 'primeng/steps';
//import { MenuItem } from 'primeng/api';
//import { Message } from 'primeng/components/common/message';
//import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
//import { ItemMasterService } from "../services/itemMaster.service";
//@Component({
//	selector: 'quickapp-pro-itemmaster',
//	templateUrl: './itemmasterpages.component.html'
//})
//export class ItemmasterPagesComponent {

//	otherurl: any;
//	currentUrl: string;

//	public items: MenuItem[];
//	home: MenuItem;

//	constructor(private router: ActivatedRoute, private route: Router, private itemMasterService: ItemMasterService) {
//		this.itemMasterService.bredcrumbObjChangeObject$.subscribe(value => {
//			//debugger
//			this.otherurl = value;
//			this.loadmethod(this.otherurl);

//		});

//	}

//	ngOnInit() {
//		this.currentUrl = this.route.url;
//		this.loadmethod(this.currentUrl)

//	}

//	loadmethod(url) {

//		this.currentUrl = url;
//		if (this.currentUrl) {
//			if (this.currentUrl == '/itemmastersmodule/itemmasterpages/app-item-master-list') {
//				this.items = [
//					{ label: 'Item Master' },
//					{ label: 'List' }
//				];
//			}
//			else if (this.currentUrl == '/itemmastersmodule/itemmasterpages/app-item-master-stock') {
//				this.items = [
//					{ label: 'Item Master' },
//					{ label: 'Stock' }
//				];
//			}

//			else if (this.currentUrl == '/itemmastersmodule/itemmasterpages/app-item-master-non-stock') {
//				this.items = [
//					{ label: 'Item Master' },
//					{ label: 'Non Stock' }
//				];
//			}

//			else if (this.currentUrl == '/itemmastersmodule/itemmasterpages/app-item-master-equipment') {
//				this.items = [
//					{ label: 'Item Master' },
//					{ label: 'Equipment' }
//				];
//			}

//			else if (this.currentUrl == '/itemmastersmodule/itemmasterpages/app-item-master-exchange') {
//				this.items = [
//					{ label: 'Item Master' },
//					{ label: 'Exchange' }
//				];
//			}

//			else if (this.currentUrl == '/itemmastersmodule/itemmasterpages/app-item-master-loan') {
//				this.items = [
//					{ label: 'Item Master' },
//					{ label: 'Loan' }
//				];
//			}
//		}
//		if (this.otherurl) {
//			if (this.currentUrl == '/itemmastersmodule/itemmasterpages/app-item-master-list') {
//				this.items = [
//					{ label: 'Item Master' },
//					{ label: 'List' }
//				];
//			}
//			if (this.currentUrl == '/itemmastersmodule/itemmasterpages/app-item-master-stock') {
//				this.items = [
//					{ label: 'Item Master' },
//					{ label: 'Stock' }
//				];
//			}

//			else if (this.currentUrl == '/itemmastersmodule/itemmasterpages/app-item-master-non-stock') {
//				this.items = [
//					{ label: 'Item Master' },
//					{ label: 'Non Stock' }
//				];
//			}

//			else if (this.currentUrl == '/itemmastersmodule/itemmasterpages/app-item-master-equipment') {
//				this.items = [
//					{ label: 'Item Master' },
//					{ label: 'Equipment' }
//				];
//			}

//			else if (this.currentUrl == '/itemmastersmodule/itemmasterpages/app-item-master-exchange') {
//				this.items = [
//					{ label: 'Item Master' },
//					{ label: 'Exchange' }
//				];
//			}

//			else if (this.currentUrl == '/itemmastersmodule/itemmasterpages/app-item-master-loan') {
//				this.items = [
//					{ label: 'Item Master' },
//					{ label: 'Loan' }
//				];
//			}

//		}
//	}

//}