import { Component } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { PageHeaderComponent } from '../../../shared/page-header.component';
declare var $ : any;

@Component({
    selector: 'app-open-close-period',
    templateUrl: './open-close-period.component.html',
    styleUrls: ['./open-close-period.component.scss'],
    animations: [fadeInOut]
})
/** OpenClosePeriod component*/
export class OpenClosePeriodComponent {
    /** OpenClosePeriod ctor */
    constructor() {
        $(document).ready(function () {

            $(".mfgdate-block").hide();
            $("#mfgdate-input").change(function () { if (this.checked) { $(".mfgdate-block").show(); } else { $(".mfgdate-block").hide(); } });
            $(".expdate-block").hide();
            $("#expdate-input").change(function () { if (this.checked) { $(".expdate-block").show(); } else { $(".expdate-block").hide(); } });
            $(".timelife-block").hide();


            $("#timelife-input").change(function () { if (this.checked) { $(this).parents(".form-group").addClass("bg-grey"); $(".timelife-block").show().addClass("bg-grey"); } else { $(this).parents(".form-group").removeClass("bg-grey"); $(".timelife-block").hide().removeClass("bg-grey"); } });

            $(".lifetime-block").hide();
            $(function () {
                $('input[name="lifetimeradio"]').on('click', function () {
                    if ($(this).val() == 'lifetimeyes') { $(".lifetime-block").show(); }
                    else { $(".lifetime-block").hide(); }
                });
            });


            $('.table-details').hide();
            $('#fiscalyear').change(function () {
                if ($(this).val() == '2018') { $('.table-details').show(); } else { $('.table-details').hide(); }
            });

            $('.table-details1').hide();
            $('#fiscalyear').change(function () {
                if ($(this).val() == '2019') { $('.table-details1').show(); } else { $('.table-details1').hide(); }
            });

            $('.table-details2').hide();
            $('#fiscalyear').change(function () {
                if ($(this).val() == '2020') { $('.table-details2').show(); } else { $('.table-details2').hide(); }
            });

            $('.table-details3').hide();
            $('#fiscalyear').change(function () {
                if ($(this).val() == '2021') { $('.table-details3').show(); } else { $('.table-details3').hide(); }
            });

            /*$(".table-details").hide();
            $(".view-table-btn").click(function(){ $(".table-details").show(); });*/


            $(".add-work-order").hide();
            $(".cwo-btn").click(function () { $(".add-work-order").show(); $(".add-customer-work").hide(); });
           
            $(".cparent-input").hide();
            $("#cparent").change(function () { if (this.checked) { $(".cparent-input").show(); } else { $(".cparent-input").hide(); } });
            $(".time-remaining").hide();
            $("#time-remaining-input").change(function () { if (this.checked) { $(".time-remaining").show(); } else { $(".time-remaining").hide(); } });
            $(".time-").hide();
            $("#rpma").change(function () { if (this.checked) { $(".rpma-input").show(); } else { $(".rpma-input").hide(); } });
            $(".phb-input").hide();
            $("#phbc").change(function () { if (this.checked) { $(".phb-input").show(); } else { $(".phb-input").hide(); } });
            $(".tax-certificate").hide();
            $("#tax").change(function () { if (this.checked) { $(".tax-certificate").show(); } else { $(".tax-certificate").hide(); } });
            $("#cmaddress1").change(function () { $("#cbaddress1").val($("#cmaddress1").val()); $("#csaddress1").val($("#cmaddress1").val()); });
            $("#cmaddress2").change(function () { $("#cbaddress2").val($("#cmaddress2").val()); $("#csaddress2").val($("#cmaddress2").val()); });
            $("#cmaddress3").change(function () { $("#cbaddress3").val($("#cmaddress3").val()); $("#csaddress3").val($("#cmaddress3").val()); });
            $("#cmcity").change(function () { $("#cbcity").val($("#cmcity").val()); $("#cscity").val($("#cmcity").val()); });
            $("#cmstate").change(function () { $("#cbstate").val($("#cmstate").val()); $("#csstate").val($("#cmstate").val()); });
            $("#cmpostal").change(function () { $("#cbpostal").val($("#cmpostal").val()); $("#cspostal").val($("#cmpostal").val()); });
            $("#cmcountry").change(function () { $("#cbcountry").val($("#cmcountry").val()); $("#cscountry").val($("#cmcountry").val()); });
            $("#cmname").change(function () { $("#csname").val($("#cmname").val()); });
            $("#custname").change(function () { $("#ownername").val($("#custname").val()); });


            $(".serialized-block").hide();
            $(".serialized-checkbox").change(function () { if (this.checked) { $(this).parents(".form-group").addClass("bg-grey"); $(".serialized-block").show().addClass("bg-grey"); } else { $(this).parents(".form-group").removeClass("bg-grey"); $(".serialized-block").hide().removeClass("bg-grey"); } });

            /*$(".serialized-block").hide();
            $("input[name='pn']").bind("click", function(event){
                      $('.pndetails').show(400);
                       return false;
            
                    }); */
            /*$(".vbill-map").hide();
            $("#vbill-map-check").change(function() {if(this.checked) {$(".vbill-map").show();}else {$(".vbill-map").hide();}});
            $(".vship-map").hide();
            $("#vship-map-check").change(function() {if(this.onclick) {$(".vship-map").show();}else {$(".vship-map").hide();}});*/
            $('[data-toggle="tooltip"]').tooltip();

            $('.traceable-inputs').hide();
            $('#traceable-selection').change(function () {
                if ($(this).val() != '') { $('.traceable-inputs').show(); } else { $('.traceable-inputs').hide(); }
            });
            $('.obtain-inputs-customer').hide(); $('.obtain-inputs-vendor').hide(); $('.obtain-inputs-other').hide();
            $('#obtain-selection').change(function () {
                if ($(this).val() === 'Customer') { $('.obtain-inputs-customer').show(); } else { $('.obtain-inputs-customer').hide(); }
                if ($(this).val() === 'Vendor') { $('.obtain-inputs-vendor').show(); } else { $('.obtain-inputs-vendor').hide(); }
                if ($(this).val() === 'Other') { $('.obtain-inputs-other').show(); } else { $('.obtain-inputs-other').hide(); }
            });

            $('.obtain-inputs').hide();
            $('#obtain-selection').change(function () {
                if ($(this).val() != '') { $('.obtain-inputs').show(); } else { $('.obtain-inputs').hide(); }
            });
            $('#obtain-selection').change(function () {
                if ($(this).val() === 'Customer') $('.obtain-placeholder').prop('placeholder', 'Customer Name');
                if ($(this).val() === 'Vendor') $('.obtain-placeholder').prop('placeholder', 'Vendor Name');
                if ($(this).val() === 'Other') $('.obtain-placeholder').prop('placeholder', 'Other Name');
            });

        });
    }
}