import { Component } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { PageHeaderComponent } from '../../../../shared/page-header.component';
import * as $ from 'jquery';

@Component({
    selector: 'app-work-order-memo',
    templateUrl: './work-order-memo.component.html',
    styleUrls: ['./work-order-memo.component.scss'],
    animations: [fadeInOut]
})
/** WorkOrderMemo component*/
export class WorkOrderMemoComponent {
    /** WorkOrderMemo ctor */
    constructor() {
        $(document).ready(function () {            
            $('[data-toggle="tooltip"]').tooltip();
            $('.status input:checkbox').change(function () {
                if ($(this).is(":checked")) {
                    $(this).parents("span").attr("data-original-title", "Active").tooltip('show');
                } else { $(this).parents("span").attr("data-original-title", "In-Active").tooltip('show'); }
            });            
        });
    }
}