import { Component, OnInit, Input, EventEmitter, ViewEncapsulation } from "@angular/core";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NavigationExtras } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { ISalesOrderCopyParameters } from '../../../sales/order/models/isalesorder-copy-parameters';

@Component({
  selector: 'app-work-order-pickticketprint',
  templateUrl: './work-order-pickticketprint.component.html',
  styleUrls: ['./work-order-pickticketprint.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WorkOrderPickticketprintComponent implements OnInit {
  @Input('modal-reference') modalReference: NgbModalRef;
  @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
  @Input() salesOrderView: any;
  salesOrderCopyParameters: ISalesOrderCopyParameters;
  workOrder: any = [];
  todayDate: Date = new Date();
  parts: any = [];
  management: any = {};
  workOrderpartConditionDescription: any;
  workOrderId: number;
  workOrderPartId: number;
  woPickTicketId: number;
  endPointURL: any;

  constructor(private workOrderService: WorkOrderService) { }

  ngOnInit() {
    this.endPointURL = environment.baseUrl;
    this.getSalesPickTicketView();
  }

  getSalesPickTicketView() {
    this.workOrderService.getPickTicketPrint(this.workOrderId, this.workOrderPartId, this.woPickTicketId).subscribe(res => {
      this.salesOrderView = res[0];
      this.workOrder = res[0].woPickTicketViewModel;
      this.parts = res[0].woPickTicketPartViewModel;
      this.management = res[0].managementStructureHeaderData;
    })
  }

  close() {
    if (this.modalReference) {
      this.modalReference.close();
    }
  }

  copy() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        cp: this.salesOrderCopyParameters.copyParts,
        cia: this.salesOrderCopyParameters.copyInternalApprovals
      }
    };
    this.onConfirm.emit(navigationExtras);
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('woPickTicket').innerHTML;
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
            
              // @page {size: landscape}
              @page {size: portrait}
            } 
            span {
              /* font-weight: normal; */
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
              font-size: 10.5px !important;
              font-weight: 700;
            }
                        table {font-size:12px !important}        
            table thead { background: #808080;}    
             
            table, thead, td {
            border: 1px solid black;
            border-collapse: collapse;
          } 
          table, thead, th {
            border: 1px solid black;
            border-collapse: collapse;
          } 
          .border-none{
            border:none;
          }
            table thead tr th 
            {
              //   background: #0d57b0 !important;
                padding: 5px!important;color: #fff;letter-spacing: 0.3px;font-weight:bold;
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                 font-size: 12.5px;text-transform: capitalize; z-index: 1;} 
            table tbody{   overflow-y: auto; max-height: 500px;  }
            table tbody tr td{ background: #fff;
               padding: 2px;
              //  line-height: 22px;
              //  height:22px;
              line-height:17px;
              height:17px;
               color: #333;
              //  border-right:1px solid black !important;
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-weight;normal;
              font-size: 12.5px !important;max-width:100%; letter-spacing: 0.1px;border:0}
            h4{padding: 5px; display: inline-block; font-size: 14px; font-weight: normal; width: 100%; margin: 0;}
            
            // .very-first-block {position: relative; height:auto;border-right:1px solid black; min-height: 1px; float: left;padding-right: 2px;padding-left: 2px;
              width: 50%;}
            .first-block-name{margin-right: 20px} 
            .first-block-sold-to {
              position: relative;
              min-height: 82px;
              height: auto;
              float: left;
              padding-bottom:5px;
              padding-right: 2px;
              border-right: 1px solid black;
              background: #fff;
              width: 100%;
              margin-top:-2px
             
            }
            
            .first-block-ship-to {
              position: relative;
              min-height: 80px;
              padding-bottom:5px;
              height: auto;
              padding-right: 2px;
              border-right: 1px solid black;
              background: #fff;
              width: 100%;
            
            }
            
            .first-block-sold {
              position: relative;
              min-height: 120px;
              height:auto;
              float: left;
              border-right:1px solid black;
              padding-right: 2px;
              padding-left: 2px;
              margin-left:-1px;
              width: 50%;
            }
            
            .first-block-ship {
              position: relative;
              min-height: 1px;
              float: right;
              padding-right: 2px;
             
              width: 49%;
            }
            
            .address-block {
              position: relative;
              min-height: 1px;
              float: left;
              height:auto;
              padding-right: 2px;
              // border: 1px solid black;
              width: 100%;
              padding-left: 2px;
            }
            
            .first-block-address {
              margin-right: 20px;
              text-align: left
            }
            
            
            .second-block {
              position: relative;
              min-height: 120px;
              float: left;
              padding-right: 2px;
              width: 42%;
            height:auto;
              // border-left:1px solid black;
                // margin-left: 16%;
              padding-left: 2px;
              box-sizing: border-box;
            }
            
            .second-block-div {
              margin: 2px 0;
              position: relative;
              display: flex;
            
              min-height: 1px;
              height:auto
             
              width: 100%;
            }
            .label{
              font-weight:500;
            }
            
            .second-block-label {
              position: relative;
              min-height: 1px;
              float: left;
              padding-right: 2px;
              padding-left: 2px;
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                  font-size: 10.5px !important;
                  font-weight: 700;
              
                  width: 38.33333333%;
                  text-transform: capitalize;
                  margin-bottom: 0;
                  text-align: left;
            }
            
            .clear {
              clear: both;
            }
            
            .form-div {
              // top: 6px;
              position: relative;
              font-weight: normal;
              font-size:12.5
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
              // margin-top: 10px;
             
            }
            span {
              font-weight: normal;
              font-size: 12.5px !important;
          }
            
            .image {
              border: 1px solid #000;
              // padding: 5px;
              width: 100%;
              display: block;
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
            
            .picked-by {
              position: relative;
              float: left;
              width: 48%;
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
              font-size: 10.5px !important;
              font-weight: 700;
            }
            
            .confirmed-by {
              position: relative;
              float: right;
              width: 48%;
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
              font-size: 10.5px !important;
              font-weight: 700;
            }
            
            .first-part {
              position: relative;
              display: inline;
              float: left;
              width: 50%
            }
            
            .seond-part {
              position: relative;
              display: flex;
              float: right;
              width: 24%
            }
            
            .input-field-border {
              width: 88px;
              border-radius: 0px !important;
              border: none;
              border-bottom: 1px solid black;
            }
            
            .border-transparent {
              border-block-color: white;
            }
            
            .pick-ticket-header {
              border: 1px solid black;
              text-align: center;
              background: #0d57b0 !important;
              color: #fff !important;
              -webkit-print-color-adjust: exact;
            }
            
            .first-block-label {
              position: relative;
              min-height: 1px;
              float: left;
              padding-right: 2px;
              padding-left: 2px;
              // width: 38.33333333%;
              font-size:10.5px !important;
            
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
              font-weight: 700;
          
              text-transform: capitalize;
              margin-bottom: 0;
              text-align: left;
            }
            
            .very-first-block {
              position: relative;
              min-height: 121px;
              float: left;
              height:auto;
             border-right:1px solid black;
              padding-right: 2px;
              padding-left: 2px;
              width: 57% !important;
            }
            
            .logo {
              padding-top: 10px;
                  // height:70px;
                  // width:220px;
                  height:auto;
                  max-width:100%;
                  padding-bottom:10px;
            }
            
            .sold-block-div {
              margin: 2px 0;
              position: relative;
              display: flex;
              min-height: 1px;
              width: 100%;
            }
            
            .ship-block-div {
              margin: 2px 0;
              position: relative;
              display: flex;
              min-height: 1px;
              width: 100%;
            }
            .first-block-sold-bottom{
              border-bottom: 1px solid black;
                  position:relative;
                  min-height:1px;
                  height:auto;
                  width:100%;
                  float:left;
                    // margin-top: -2px;
                   // min-height: 120px;
            }
            
            .parttable th {
              background: #fff !important;
              color: #000 !important;
              -webkit-print-color-adjust: exact;
            }
            .border-bottom{
              border-bottom:1px solid black !important;
            }
            .table-margins{
                  margin-top:-1px;margin-left:0px
                }
            .invoice-border{
              border-bottom: 1px solid;
                  position:relative;
                    // min-height: 119px;
                    min-height:1px;
                    height: auto;
                    width:100%;
                  float:left;}
            
                        </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}