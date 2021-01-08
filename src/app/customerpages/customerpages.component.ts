import { Component } from "@angular/core";
// import { BreadcrumbModule } from 'primeng/breadcrumb'; //Bread Crumb
import { MenuItem } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from "../services/customer.service";
@Component({
	selector: "quickapp-pro-customer",
	templateUrl: './customerpages.component.html'
})
export class CustomerPagesComponent {
	otherurl: any;
	currentUrl: string;

	public items: MenuItem[];
	home: MenuItem;

	constructor(private router: ActivatedRoute, private route: Router, private customerService: CustomerService) {
	}

	ngOnInit() {}
	
}