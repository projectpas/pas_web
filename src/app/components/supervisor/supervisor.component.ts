import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import * as $ from 'jquery';

@Component({
    selector: 'app-supervisor',
    templateUrl: './supervisor.component.html',
    styleUrls: ['./supervisor.component.scss'],
    animations: [fadeInOut]
})
/** Supervisor component*/
export class SupervisorComponent {
    /** Supervisor ctor */
    constructor() {
        $(document).ready(function () {

        });
    }
}