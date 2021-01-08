
import { Component } from "@angular/core";
import { BreadcrumbModule } from 'primeng/breadcrumb'; //Bread Crumb
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { Message } from 'primeng/components/common/message';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { ReceivingCustomerWorkService } from "../services/receivingcustomerwork.service";



@Component({

	selector: 'quickapp-pro-receiving',
	templateUrl: './receivingpages.component.html'


})
/** Vendorpages component*/
export class ReceivingpagesComponent {

	

	constructor(private router: ActivatedRoute, private route: Router, private receivingCustomerWorkService: ReceivingCustomerWorkService) {
		
	}

	ngOnInit() {
		

	}

	

}