import { Component } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { PageHeaderComponent } from '../../../shared/page-header.component';
declare var $ : any;

@Component({
    selector: 'app-account-setup',
    templateUrl: './account-setup.component.html',
    styleUrls: ['./account-setup.component.scss'],
    animations: [fadeInOut]
})
/** AccountSetup component*/
export class AccountSetupComponent {
    /** AccountSetup ctor */
    constructor() {
        $(document).ready(function () {

        });
    }
}