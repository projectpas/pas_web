import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AlertService } from '../../../../services/alert.service';

@Component({
    selector: 'app-po-approval',
    templateUrl: './po-approval.component.html',
    styleUrls: ['./po-approval.component.scss']
})
export class PoApprovalComponent implements OnInit {

	isApproverlist: boolean = true;
	breadcrumbs: MenuItem[];
    home: any;
	constructor(private alertService: AlertService) {
	
	}
	ngOnInit() {
	this.breadcrumbs = [
				{ label: 'Purchase Order' },
				{ label: 'Purchase Order Approval List' },
			];
		}
	
}