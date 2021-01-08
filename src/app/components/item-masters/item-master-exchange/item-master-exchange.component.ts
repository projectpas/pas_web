import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemMasterService } from "../../../services/itemMaster.service";

@Component({
    selector: 'app-item-master-exchange',
    templateUrl: './item-master-exchange.component.html',
    styleUrls: ['./item-master-exchange.component.scss']
})
/** item-master-exchange component*/
export class ItemMasterExchangeComponent implements OnInit, AfterViewInit {
    /** item-master-exchange ctor */
	constructor(private router: Router, public itemMasterService: ItemMasterService) {

	}
	ngOnInit(): void {
		this.itemMasterService.currentUrl = '/itemmastersmodule/itemmasterpages/app-item-master-exchange';
		this.itemMasterService.bredcrumbObj.next(this.itemMasterService.currentUrl);//Bread Crumb
	}
	ngAfterViewInit()
	{
	}

	// Temporery Item Master Radiuo Route
	stock() {
		this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-stock');
	}

	nonStock() {
		this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-non-stock');
	}
	equipment() {
		this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-equipment');
	}
	exchange() {
		this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-exchange');
	}
	loan() {
		this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-loan');
	}

	// Temporery Item Master Radiuo Route End
}