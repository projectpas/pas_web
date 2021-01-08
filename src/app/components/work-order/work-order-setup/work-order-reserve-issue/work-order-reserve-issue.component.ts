import { Component } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { PageHeaderComponent } from '../../../../shared/page-header.component';
import * as $ from 'jquery';

@Component({
    selector: 'app-work-order-reserve-issue',
    templateUrl: './work-order-reserve-issue.component.html',
    styleUrls: ['./work-order-reserve-issue.component.scss'],
    animations: [fadeInOut]
})
/** WorkOrderReserveIssue component*/
export class WorkOrderReserveIssueComponent {
    /** WorkOrderReserveIssue ctor */
    constructor() {

    }
}