import { Component, OnInit, Input, EventEmitter } from "@angular/core";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NavigationExtras } from "@angular/router";
import { SalesOrderService } from "../../../../services/salesorder.service";
import { SalesOrderCopyParameters } from "../models/salesorder-copy-parameters";
import { environment } from "../../../../../environments/environment";
import { SalesOrderShippingLabelView } from "../../../../models/sales/SalesOrderShippingLabelView";
import { ISalesOrderCopyParameters } from "../models/isalesorder-copy-parameters";

@Component({
    selector: "app-sales-order-shipping-label",
    templateUrl: "./sales-order-shipping-label.component.html",
    styleUrls: ["./sales-order-shipping-label.component.scss"]
})
export class SalesShippingLabelComponent implements OnInit {
    @Input('modal-reference') modalReference: NgbModalRef;
    @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
    @Input() salesOrderView: SalesOrderShippingLabelView;
    salesOrderCopyParameters: ISalesOrderCopyParameters;
    salesOrderShipping: any = [];
    todayDate: Date = new Date();
    salesOrderpartConditionDescription: any;
    salesOrderId: number;
    salesOrderPartId: number;
    soShippingId: number;
    endPointURL: any;
    isPrint: boolean = false;

    constructor(private salesOrderService: SalesOrderService) {
        this.salesOrderCopyParameters = new SalesOrderCopyParameters();
    }

    ngOnInit() {
        this.endPointURL = environment.baseUrl;
        this.getSalesPickTicketView();
    }

    getSalesPickTicketView() {
        this.salesOrderService.getShippingLabelPrint(this.salesOrderId, this.salesOrderPartId, this.soShippingId).subscribe(res => {
            this.salesOrderShipping = res[0].soShippingLabelViewModel;
        })
    }

    close() {
        if (this.modalReference) {
            this.modalReference.close();
        }
    }

    updateServiceClass() {
        this.salesOrderService.updateShipping(this.salesOrderShipping.serviceClass, this.soShippingId).subscribe(res => {
            this.printContent();
        })
    }

    print(): void {
        this.isPrint = true;
        setTimeout(() => {
            this.updateServiceClass();    
        }, 100);
    }

    printContent() {
        let printContents, popupWin;
        printContents = document.getElementById('soShippingLabel').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Print tab</title>
              <style>
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