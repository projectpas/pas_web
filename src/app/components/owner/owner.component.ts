import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
declare var $ : any;

@Component({
    selector: 'app-owner',
    templateUrl: './owner.component.html',
    styleUrls: ['./owner.component.scss'],
    animations: [fadeInOut]
})
/** Owner component*/
export class OwnerComponent {
    /** Owner ctor */
    constructor() {
        $(document).ready(function () {

        });
    }
}