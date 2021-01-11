import { Component } from '@angular/core';
import { fadeInOut } from '../../../../../services/animations';
import { PageHeaderComponent } from '../../../../../shared/page-header.component';
declare var $ : any;

@Component({
    selector: 'app-work-order-equipment-check-in-out',
    templateUrl: './work-order-equipment-check-in-out.component.html',
    styleUrls: ['./work-order-equipment-check-in-out.component.scss'],
    animations: [fadeInOut]
})
/** WorkOrderEquipmentCheckInOut component*/
export class WorkOrderEquipmentCheckInOutComponent {
    /** WorkOrderEquipmentCheckInOut ctor */
    constructor() {
        $(document).ready(function () {
            $(".consultant-setup").hide();
            $(function () {
                $('input[name="emp-consultant"]').on('click', function () {
                    if ($(this).val() == 'Consultant') { $(".consultant-setup").show(); $(".employee-setup").hide(); $(".save-btn").show(); $(".nxt-btn").hide(); $(".step3-nav").hide(); }
                    else { $(".employee-setup").show(); $(".consultant-setup").hide(); $(".save-btn").hide(); $(".nxt-btn").show(); $(".step3-nav").show(); }
                });
            });

            $(".lhourpay-block").hide(); $(".certification-block").hide();
            $("#lhourpay-checkbox").change(function () { if (this.checked) { $(".lhourpay-block").show(); } else { $(".lhourpay-block").hide(); } });
            $("#certification-radio").change(function () { if (this.checked) { $(".certification-block").show(); } else { $(".certification-block").hide(); } });

            /* Hourly Rate with 2 decimals */
            $(function () {
                $('input.amount').on('input', function () {
                    this.value = this.value
                        .replace(/[^\d.]/g, '')             // numbers and decimals only
                        .replace(/(^[\d]{4})[\d]/g, '$1')   // not more than 4 digits at the beginning
                        .replace(/(\..*)\./g, '$1')         // decimal can't exist more than once
                        .replace(/(\.[\d]{2})./g, '$1');    // not more than 2 digits after decimal
                });
            });
            /* End Hourly Rate with 2 decimals */

            $(".shiftsingle-block").hide(); $(".shiftmultiple-block").hide();
            $('input[name="shift"]').click(function () { if ($(this).attr('id') == 'shiftsingle') { $('.shiftsingle-block').show(); $('.shiftmultiple-block').hide(); } else { $('.shiftmultiple-block').show(); $('.shiftsingle-block').hide(); } });

            $(".hourpay-block").hide(); $(".salarypay-block").hide();
            $('input[name="paytype"]').click(function () { if ($(this).attr('id') == 'hourpay') { $('.hourpay-block').show(); $('.salarypay-block').hide(); } else { $('.salarypay-block').show(); $('.hourpay-block').hide(); } });

            /*$("#cparent").change(function() {if(this.checked) {$(".cparent-input").show();}else {$(".cparent-input").hide();}});*/



            $(".cparent-input").hide();
            $("#cparent").change(function () { if (this.checked) { $(".cparent-input").show(); } else { $(".cparent-input").hide(); } });
            $(".rpma-input").hide();
            $("#rpma").change(function () { if (this.checked) { $(".rpma-input").show(); } else { $(".rpma-input").hide(); } });
            $(".vbill-map").hide();
            $("#vbill-map-check").change(function () { if (this.checked) { $(".vbill-map").show(); } else { $(".vbill-map").hide(); } });
            $(".vship-map").hide();
            $("#vship-map-check").change(function () { if (this.checked) { $(".vship-map").show(); } else { $(".vship-map").hide(); } });
            $('[data-toggle="tooltip"]').tooltip();
            
                
                    $(".add").click(function () {
                        $(".hide-model").hide();
                        $(".fade .in").hide();
                    });
                
               
                        /* Amount decimals */
                        $(function () {
                            $('input.cost').on('input', function () {
                                this.value = this.value
                                    .replace(/(\.[\d]{3})./g, '$1');    // not more than 3 digits after decimal
                            });
                        });
            /* End Amount decimals */
            
        });
    }
}