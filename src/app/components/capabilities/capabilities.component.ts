import { Component, OnInit, AfterViewInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
declare var $ : any;
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";

@Component({
    selector: 'app-capabilities',
    templateUrl: './capabilities.component.html',
    styleUrls: ['./capabilities.component.scss'],
    animations: [fadeInOut]
})
/** Capabilities component*/
export class CapabilitiesComponent implements OnInit, AfterViewInit{
    /** Capabilities ctor */

	
	ngOnInit() :void{
		this.breadCrumb.currentUrl = '/singlepages/singlepages/app-capabilities';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
	}
	constructor(private breadCrumb: SingleScreenBreadcrumbService, ) {
	}
	ngAfterViewInit() { }
}