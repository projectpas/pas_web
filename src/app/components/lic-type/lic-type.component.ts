import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import * as $ from 'jquery';

@Component({
    selector: 'app-lic-type',
    templateUrl: './lic-type.component.html',
    styleUrls: ['./lic-type.component.scss'],
    animations: [fadeInOut]
})
/** LicType component*/
export class LicTypeComponent {
    /** LicType ctor */
    constructor() {
        $(document).ready(function () {

        });
    }
}