import { Component, OnInit, AfterViewInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
declare var $ : any;
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
@Component({
    selector: 'app-journal-approvals',
    templateUrl: './journal-approvals.component.html',
	styleUrls: ['./journal-approvals.component.scss'],
	animations: [fadeInOut]
})
/** JournalApprovals component*/
export class JournalApprovalsComponent implements OnInit, AfterViewInit {
    /** JournalApprovals ctor */
	ngOnInit()
	{
		this.breadCrumb.currentUrl = '/singlepages/singlepages/app-journal-approvals';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
	}
	constructor(private breadCrumb: SingleScreenBreadcrumbService) {

	}

	ngAfterViewInit() { }
}