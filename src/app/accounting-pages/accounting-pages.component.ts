import { Component } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb'; //Bread Crumb
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { Message } from 'primeng/components/common/message';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';

@Component({
    selector: 'app-accounting-pages',
    templateUrl: './accounting-pages.component.html',
    styleUrls: ['./accounting-pages.component.scss']
})
/** AccountingPages component*/
export class AccountingPagesComponent {
    /** AccountingPages ctor */
    constructor() {

    }
}