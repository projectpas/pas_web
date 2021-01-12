import { Component } from '@angular/core';
import { fadeInOut } from '../../../../../services/animations';
import { PageHeaderComponent } from '../../../../../shared/page-header.component';
declare var $ : any;

@Component({
    selector: 'app-manual-entry-labor-hours',
    templateUrl: './manual-entry-labor-hours.component.html',
    styleUrls: ['./manual-entry-labor-hours.component.scss'],
    animations: [fadeInOut]
})
/** ManualEntryLaborHours component*/
export class ManualEntryLaborHoursComponent {
    /** ManualEntryLaborHours ctor */
    constructor() {
        $(document).ready(function () {
            $(".labor-inout-hrs-block").hide(); $(".labor-hrs-scan-block").hide();
                $('input[type=radio][name=labor-blocks-input]').change(function () {
                    if (this.value == 'labor-block1') {
                        $(".labor-inout-hrs-block").hide(); $(".labor-hrs-block").show(); $(".labor-hrs-scan-block").hide();
                    }
                    else if (this.value == 'labor-block2') {
                        $(".labor-inout-hrs-block").show(); $(".labor-hrs-block").hide(); $(".labor-hrs-scan-block").hide();
                    }
                    else if (this.value == 'labor-block3') {
                        $(".labor-inout-hrs-block").hide(); $(".labor-hrs-block").hide(); $(".labor-hrs-scan-block").show();
                    }
                });
            

            $(".flat-data").hide();
                $('input[type=radio][name=billing-options]').change(function () {
                    if (this.value == 'cost') {
                        $(".flat-data").hide(); $(".cost-data").show();
                    }
                    else if (this.value == 'flat') {
                        $(".flat-data").show(); $(".cost-data").hide();
                    }
                });
            
            $(function () {
                $('input.decimals2').on('input', function () {
                    this.value = this.value
                        .replace(/[^\d.]/g, '')             // numbers and decimals only
                        .replace(/(^[\d]{2})[\d]/g, '$1')   // not more than 4 digits at the beginning
                        .replace(/(\..*)\./g, '$1')         // decimal can't exist more than once
                        .replace(/(\.[\d]{2})./g, '$1');    // not more than 2 digits after decimal
                });
                $('input.time').on('input', function () {
                    this.value = this.value
                        .replace(/[^\d.]/g, '')             // numbers and decimals only
                        .replace(/(^[\d]{2})[\d]/g, '$1')   // not more than 4 digits at the beginning
                        .replace(/(\..*)\./g, '$1')         // decimal can't exist more than once
                        .replace(/(\.[\d]{2})./g, '$1');    // not more than 2 digits after decimal
                });
            });

                    $(".labor-inout-hrs-block").hide();
                    $(".labor-inout-hrs-btn").click(function () {
                        $(".labor-inout-hrs-block").show(); $(".labor-hrs-block").hide();
                    });
                    $(".labor-hrs-btn").click(function () {
                        $(".labor-hrs-block").show(); $(".labor-inout-hrs-block").hide();
                    });
            
        });
    }
}