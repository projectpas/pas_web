import { Component } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { PageHeaderComponent } from '../../../shared/page-header.component';
declare var $ : any;

@Component({
    selector: 'app-account-reports',
    templateUrl: './account-reports.component.html',
    styleUrls: ['./account-reports.component.scss'],
    animations: [fadeInOut]
})
/** AccountReports component*/
export class AccountReportsComponent {
    /** AccountReports ctor */
    constructor() {
        $(document).ready(function () {

        });
    }
}