import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
// import { VendorProcess1099Service } from '../../services/vendorprocess1099.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { validateRecordExistsOrNot, editValueAssignByCondition, getObjectById, selectedValueValidate, getObjectByValue } from '../../generic/autocomplete';
import { Table } from 'primeng/table';
import { ConfigurationService } from '../../services/configuration.service';


@Component({
    selector: 'app-caps-report',
    templateUrl: './caps-report.component.html',
    styleUrls: ['./caps-report.component.scss'],
    animations: [fadeInOut]
})
/** Vendor Classification component*/
export class CapsReportComponent implements OnInit {
    
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private configurations: ConfigurationService,
        private authService: AuthService,
        private alertService: AlertService
       
    ) {

    }


    ngOnInit(): void {
        
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-caps-report';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

 

   
  
 
   
   
   
}