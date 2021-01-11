import { Component } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { PageHeaderComponent } from '../../../shared/page-header.component';
declare var $ : any;

@Component({
    selector: 'app-rma',
    templateUrl: './rma.component.html',
    styleUrls: ['./rma.component.scss'],
    animations: [fadeInOut]
})
/** rma component*/
export class RmaComponent {
    /** rma ctor */
    constructor() {
        $(document).ready(function () {

        });
    }
}