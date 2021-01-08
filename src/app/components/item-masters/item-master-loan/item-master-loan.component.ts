import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemMasterService } from "../../../services/itemMaster.service";

@Component({
    selector: 'app-item-master-loan',
    templateUrl: './item-master-loan.component.html',
    styleUrls: ['./item-master-loan.component.scss']
})
/** item-master-loan component*/
export class ItemMasterLoanComponent implements OnInit, AfterViewInit {
    /** item-master-loan ctor */
	constructor(private router: Router, public itemMasterService: ItemMasterService) {

	}
	
	ngOnInit(): void {
		this.itemMasterService.currentUrl = '/itemmastersmodule/itemmasterpages/app-item-master-loan';
		this.itemMasterService.bredcrumbObj.next(this.itemMasterService.currentUrl);//Bread Crumb
	}

	ngAfterViewInit()
	{ }

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