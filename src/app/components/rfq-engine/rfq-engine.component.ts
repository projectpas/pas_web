import { Component, OnInit, AfterViewInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
declare var $ : any;
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
@Component({
    selector: 'app-rfq-engine',
    templateUrl: './rfq-engine.component.html',
	styleUrls: ['./rfq-engine.component.scss'],
	animations: [fadeInOut]
})
/** RfqEngine component*/
export class RfqEngineComponent implements OnInit, AfterViewInit {
    /** RfqEngine ctor */
	ngOnInit() {

		this.breadCrumb.currentUrl = '/singlepages/singlepages/app-rfq-engine';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
	}
	constructor(private breadCrumb: SingleScreenBreadcrumbService) {

	}
	ngAfterViewInit() { }
}