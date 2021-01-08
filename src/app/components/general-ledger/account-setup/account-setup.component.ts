import { Component } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { PageHeaderComponent } from '../../../shared/page-header.component';
import * as $ from 'jquery';

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