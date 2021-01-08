import { Component } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { PageHeaderComponent } from '../../../shared/page-header.component';
import * as $ from 'jquery';

@Component({
    selector: 'app-sales-order',
    templateUrl: './sales-order.component.html',
    styleUrls: ['./sales-order.component.scss'],
    animations: [fadeInOut]
})
/** SalesOrder component*/
export class SalesOrderComponent {
    /** SalesOrder ctor */
    constructor() {
        $(document).ready(function () {

        });
    }
}