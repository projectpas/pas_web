import { Component } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { PageHeaderComponent } from '../../../../shared/page-header.component';
import * as $ from 'jquery';

@Component({
    selector: 'app-work-order-shipping',
    templateUrl: './work-order-shipping.component.html',
    styleUrls: ['./work-order-shipping.component.scss'],
    animations: [fadeInOut]
})
/** WorkOrderShipping component*/
export class WorkOrderShippingComponent {
    /** WorkOrderShipping ctor */
    constructor() {

    }
}