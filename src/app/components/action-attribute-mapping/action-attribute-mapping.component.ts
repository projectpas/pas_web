import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { AuthService } from '../../services/auth.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-action-attribute-mapping',
    templateUrl: './action-attribute-mapping.component.html',
	styleUrls: ['./action-attribute-mapping.component.scss'],
	animations: [fadeInOut]
})
/** ActionAttributeMapping component*/
export class ActionAttributeMappingComponent implements OnInit, AfterViewInit {
    /** ActionAttributeMapping ctor */
	ngOnInit() : void
	{
		
		this.breadCrumb.currentUrl = '/singlepages/singlepages/app-action-attribute-mapping';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
	}
	
	constructor(private breadCrumb: SingleScreenBreadcrumbService) {

	}
	ngAfterViewInit() {
	}
}