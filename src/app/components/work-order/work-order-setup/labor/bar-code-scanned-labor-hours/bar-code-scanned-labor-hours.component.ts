import { Component } from '@angular/core';
import { fadeInOut } from '../../../../../services/animations';
import { PageHeaderComponent } from '../../../../../shared/page-header.component';
import * as $ from 'jquery';

@Component({
    selector: 'app-bar-code-scanned-labor-hours',
    templateUrl: './bar-code-scanned-labor-hours.component.html',
    styleUrls: ['./bar-code-scanned-labor-hours.component.scss'],
    animations: [fadeInOut]
})
/** BarCodeScannedLaborHours component*/
export class BarCodeScannedLaborHoursComponent {
    /** BarCodeScannedLaborHours ctor */
    constructor() {

    }
}