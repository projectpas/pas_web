// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Component, AfterViewInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { Params, ActivatedRoute, NavigationExtras, Router } from '@angular/router';
declare var $ : any;
import { AppComponent } from '../../app.component';
@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [fadeInOut]
})
export class HomeComponent implements AfterViewInit {

    constructor(public appcomponent: AppComponent, public configurations: ConfigurationService, private router: ActivatedRoute, private route: Router) {

    }
    customerModule() {
        this.appcomponent.setStep(1);
        //this.configurations.configObj.next("1");
        this.route.navigateByUrl('/customersmodule/customerpages/app-customers-list');
    }
    itemMasterModule() {
        this.appcomponent.setStep(5);
        //this.configurations.configObj.next("1");
        this.route.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-list');
    }


    vendorModule() {
        this.appcomponent.setStep(3);
        this.route.navigateByUrl('/vendorsmodule/vendorpages/app-vendors-list');
    }
    employeeModule() {
        this.appcomponent.setStep(6);
        this.route.navigateByUrl('/employeesmodule/employeepages/app-employees-list');
    }
    stocklineModule() {
        this.appcomponent.setStep(2);
        this.route.navigateByUrl('/stocklinemodule/stocklinepages/app-stock-line-list');
    }
    roleModule() {
        this.appcomponent.setStep(0);
        this.route.navigateByUrl('/rolesmodule/rolespages/app-roles-list');
    }

    ngAfterViewInit() {
    }

}
