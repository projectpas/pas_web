import { Component, OnInit, AfterViewInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
declare var $ : any;
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";

@Component({
    selector: 'app-financial-statement-mapping',
    templateUrl: './financial-statement-mapping.component.html',
	styleUrls: ['./financial-statement-mapping.component.scss'],
	animations: [fadeInOut]
})
/** FinancialStatementMapping component*/
export class FinancialStatementMappingComponent implements OnInit, AfterViewInit{
    /** FinancialStatementMapping ctor */
	ngOnInit() :void
	{
		this.breadCrumb.currentUrl = '/singlepages/singlepages/app-financial-statement-mapping';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
	}
	constructor(private breadCrumb: SingleScreenBreadcrumbService) {

	}
	ngAfterViewInit() { }
}