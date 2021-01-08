import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-item-master-setup',
    templateUrl: './item-master-setup.component.html',
    styleUrls: ['./item-master-setup.component.scss']
})
/** item-master-setup component*/
export class ItemMasterSetupComponent {
	
	constructor(private router: Router) {
	
	}
	
	stock()
	{
		this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-stock');
	}

	nonStock()
	{
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


	
}