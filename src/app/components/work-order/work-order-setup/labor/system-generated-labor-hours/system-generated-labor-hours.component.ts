import { Component } from '@angular/core';
import { fadeInOut } from '../../../../../services/animations';
import { PageHeaderComponent } from '../../../../../shared/page-header.component';
declare var $ : any;

@Component({
    selector: 'app-system-generated-labor-hours',
    templateUrl: './system-generated-labor-hours.component.html',
    styleUrls: ['./system-generated-labor-hours.component.scss'],
    animations: [fadeInOut]
})
/** SystemGeneratedLaborHours component*/
export class SystemGeneratedLaborHoursComponent {
    /** SystemGeneratedLaborHours ctor */
    constructor() {
        $(document).ready(function () {
            $(".flat-data").hide();
                $('input[type=radio][name=billing-options]').change(function () {
                    if (this.value == 'cost') {
                        $(".flat-data").hide(); $(".cost-data").show();
                    }
                    else if (this.value == 'flat') {
                        $(".flat-data").show(); $(".cost-data").hide();
                    }
                });
        });
    }
}