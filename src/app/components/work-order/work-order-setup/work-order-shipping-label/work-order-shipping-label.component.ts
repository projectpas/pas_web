import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { WorkOrderService } from 'src/app/services/work-order/work-order.service';
declare var $: any;
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-work-order-shipping-label',
  templateUrl: './work-order-shipping-label.component.html',
  styleUrls: ['./work-order-shipping-label.component.scss']
})
export class WorkOrderShippingLabelComponent implements OnInit {


  @Input() workOrderId;
  @Input() workOrderPartId;
  @Input() woShippingId;
  @Output() Updateshippingpopup = new EventEmitter();

  workOrderShipping: any = [];
  todayDate: Date = new Date();
  workOrderpartConditionDescription: any;
  // workOrderId: number;
  // workOrderPartId: number;
  // woShippingId: number;
  endPointURL: any;
  isPrint: boolean = false;

  constructor(
    private authService: AuthService,
    private acRouter: ActivatedRoute,
    private router: Router,
    private workOrderService: WorkOrderService,
  ) 
  {}

  ngOnInit() 
  {
    this.endPointURL = environment.baseUrl;
    $('#ShippingSlipDiv').modal('show');
    //this.GetWorkorderReleaseFromData();
    this.getSalesOrderShippingLabel();
  }

  getSalesOrderShippingLabel() {
    this.workOrderService.getShippingLabelPrint(this.workOrderId, this.workOrderPartId, this.woShippingId).subscribe(res => {
        this.workOrderShipping = res[0].woShippingLabelViewModel;
    })
}

updateServiceClass() {
  this.workOrderService.updateShipping(this.workOrderShipping.serviceClass, this.woShippingId).subscribe(res => {
      //this.printContent();
  })
}
close()
{
  $('#ShippingSlipDiv').modal('hide');
  this.Updateshippingpopup.emit();
}


// print(): void {
//   this.isPrint = true;
//   setTimeout(() => {
//       this.updateServiceClass();    
//   }, 100);
// }

print() {
  let printContents, popupWin;
  this.Updateshippingpopup.emit();
  printContents = document.getElementById('soShippingLabel').innerHTML;
  popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  popupWin.document.open();
  popupWin.document.write(`
    <html>
      <head>
        <title>Print tab</title>
        <style>
        @page { size: auto;  margin: 0mm; }
              
        @media print
{
@page {
margin-top: 0;
margin-bottom: 0;
}

@page {size: landscape}
} 
              input {
                width: 56%;
                background: #fff;
                border: 1px Solid
              }
              
              h4{padding: 5px; display: inline-block; font-size: 14px; font-weight: normal; width: 100%; margin: 0;}
  
              
              h5 {
                font-family: inherit;
                font-weight: 500;
                line-height: 1.1;
                color: inherit;
                background: #fff;
                padding: 5px;
                font-size: 14px;
                margin-bottom: 15px;
                margin: 0 !important;
                padding: 5px;
                text-align: center
              }
              
              hr {
                margin-top: 10px;
                margin-bottom: 10px;
                border: 0;
                border-top: 1px solid #e0e0e0;
                height: 0;
                box-sizing: content-box;
              }
              
              .first-block {
                position: relative;
                min-height: 1px;
                float: left;
                padding-right: 2px;
                padding-left: 2px;
                width: 66.66666667%;
              }
              .input-width{width:60px !important}
              .sold-block-div{margin: 0px 0;position: relative;display:flex;min-height: 1px;width: 100%;}
              
              .first-block-label {
                position: relative;
                min-height: 1px;
                float: left;
                padding-right: 2px;
                padding-left: 2px;
                 width: 38.33333333%;
                 font-size:10.5px !important;
  
                 font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
             font-weight:700;
                text-transform: capitalize;
                margin-bottom: 0;
                text-align: left;
              }
              bold-word{
                font-size:12.5px !important;
              }
              
              .first-block-4 {
                position: relative;
                min-height: 1px;
                float: left;
                padding-right: 2px;
                padding-left: 2px;
              }
              
              
              
              .first-block-address {
                margin-right: 20px;
                text-align: left
              }
              
              
              .first-block-quotation {
                margin-right: 20px;
                text-align: left;
                margin-top: 10px;
              }
              
              .first-block-name {
                margin-right: 20px
              }
              
              .second-block {
                position: relative;
                min-height: 1px;
                float: left;
                padding-right: 2px;
                width: 32.33333333%;
                padding-left: 2px;
                box-sizing: border-box;
              }
              .second-block-div{
                margin-bottom: 0px;
                position: relative;display:flex;
                min-height: 1px;
                width: 100%;}
            
              
              .second-block-label {
                position: relative;
                min-height: 1px;
                float: left;
                font-size:10.5px !important;
   
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                padding-right: 2px;
                padding-left: 2px;
                font-weight:700;
                width: 38.33333333%;
                text-transform: capitalize;
                margin-bottom: 0;
                margin-top: 5px;
              }
              
              .second-block-value {
                position: relative;
                min-height: 1px;
                width: 58.33333333%;
                float: left;
                padding-right: 2px;
                padding-left: 2px;
                margin-top: 4px;
              }
              
              .clear {
                clear: both;
              }
              
              .form-div {
                // top: 6px;
                position: relative;
                font-weight: normal;
                // margin-top: 10px;
                font-weight: normal;
                font-size:12.5
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
              }
              
              .image {
                border: 1px solid #000;
                width: 100%;
                display: block;
                // padding: 5px;
                // margin-top:20px;
                // margin-bottom:10px;
              }
              
              .mtop20 {
                margin-top: 20px;
              }
              
              .logo-block {
                margin: auto;
                text-align: center
              }
              
              .pdf-block {
                width: 800px;
                margin: auto;
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                font-weight:normal;
                border: 1px solid #ccc;
                padding: 25px 15px;
              }
              
              .table-text {
                border: 1px solid #ccc;
                padding: 5px;
                height: 150px;
              }
              
              .barcode-name {
                margin: 0 0 10px;
              }
              
              
              .input-field-border {
                width: 88px;
                border-radius: 0px !important;
                background: #fff;
                border: none;
                border-bottom: 1px solid black;
              }
              
              .pick-ticket-header {
                border: 1px solid black;
                text-align: left;
                // background: #0d57b0 !important;
                color: #000 !important;
                -webkit-print-color-adjust: exact;
              }
             
              }
              
              .div-height {
                min-height: 500px;
                height: auto
              }
              </style>
      </head>
  <body onload="window.print();window.close()">${printContents}</body>
    </html>`
  );
  popupWin.document.close();
 
  setTimeout(() => {
      this.isPrint = false;  
  }, 2000);
}

}
