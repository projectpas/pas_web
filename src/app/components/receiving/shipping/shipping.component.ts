import { Component } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { PageHeaderComponent } from '../../../shared/page-header.component';
declare var $ : any;

@Component({
    selector: 'app-shipping',
    templateUrl: './shipping.component.html',
    styleUrls: ['./shipping.component.scss'],
    animations: [fadeInOut]
})
/** Shipping component*/
export class ShippingComponent {
    /** Shipping ctor */
    constructor() {
        $(document).ready(function () {

        });
    }
}