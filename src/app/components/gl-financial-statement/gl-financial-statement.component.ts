import { Component, OnInit, AfterViewInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
declare var $ : any;
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
@Component({
    selector: 'app-gl-financial-statement',
    templateUrl: './gl-financial-statement.component.html',
	styleUrls: ['./gl-financial-statement.component.scss'],
	animations: [fadeInOut]
})
/** GlFinancialStatement component*/
export class GlFinancialStatementComponent implements OnInit, AfterViewInit{
	/** GlFinancialStatement ctor */
	ngOnInit() :void
	{
		this.breadCrumb.currentUrl = '/singlepages/singlepages/app-gl-financial-statement';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
	}
	constructor(private breadCrumb: SingleScreenBreadcrumbService) {

	}
	ngAfterViewInit() { }
}