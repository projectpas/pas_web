import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { SalesOrderService } from "../../../../services/salesorder.service";
import { ISalesOrderView } from "../../../../models/sales/ISalesOrderView";
import { SalesOrderPickTicketView } from "../../../../models/sales/SalesOrderPickTicketView";
import { SalesOrderView } from "../../../../models/sales/SalesOrderView";
import { ISalesOrderCopyParameters } from "../models/isalesorder-copy-parameters";
import { SalesOrderCopyParameters } from "../models/salesorder-copy-parameters";
import { environment } from 'src/environments/environment';

@Component({
    selector: "app-sales-order-pickTicket",
    templateUrl: "./sales-order-pickTicket.component.html",
    styleUrls: ["./sales-order-pickTicket.component.scss"]
})
export class SalesOrderpickTicketComponent implements OnInit {
    @Input('modal-reference') modalReference: NgbModalRef;
    @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
    @Input() salesOrderoView: SalesOrderPickTicketView;
    //@Input() salesOrderView: SalesOrderView; 
    salesOrderCopyParameters: ISalesOrderCopyParameters;
    salesOrder: any = [];
    todayDate: Date = new Date();
    parts: any = [];
    management: any = {};
    salesOrderpartConditionDescription: any;
    salesOrderId: number;
    salesOrderPartId: number;
    soPickTicketId:number;
    endPointURL:any;
    constructor(private modalService: NgbModal, private salesOrderService: SalesOrderService,
        private router: Router) {
        this.salesOrderCopyParameters = new SalesOrderCopyParameters();
    }

    ngOnInit() {
        this.endPointURL = environment.baseUrl;
        this.getSalesPickTicketView();
    }

    getSalesPickTicketView() {
        //this.salesOrderService.getPickTicket(this.salesOrderId).subscribe(res => {
        this.salesOrderService.getPickTicketPrint(this.salesOrderId,this.soPickTicketId).subscribe(res => {
            this.salesOrderoView = res[0];

            this.salesOrder = res[0].soPickTicketViewModel;
            this.parts = res[0].soPickTicketPartViewModel;
            this.management = res[0].managementStructureHeaderData;
            console.log(this.parts);
            console.log(this.salesOrder);
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
        printContents = document.getElementById('soPickTicket').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Print tab</title>
              <style>
              table { width: 1000px;overflow: auto !important;}        
  table thead { background: #808080;}    
  table thead tr{background: #0d57b0 !important;}  
  table, thead, td {
  border: 1px solid black;
  border-collapse: collapse;
} 
table, thead, th {
  border: 1px solid black;
  border-collapse: collapse;
} 
  table thead tr th {background: #0d57b0 !important;padding: 5px!important;color: #fff;letter-spacing: 0.3px; font-size: 10px;text-transform: capitalize; z-index: 1;} 
  table tbody{   overflow-y: auto; max-height: 500px;  }
  table tbody tr td{ background: #fff; padding: 2px;line-height: 22px;color: #333;
   font-size: 11.5px !important; letter-spacing: 0.1px;}
  h4{padding: 5px; display: inline-block; font-size: 14px; font-weight: 600; width: 100%; margin: 0;}
  
  hr{margin-top: 10px; margin-bottom: 10px;border: 0;border-top: 1px solid #e0e0e0; height: 0; box-sizing: content-box;}
  
  .first-block-name{margin-right: 20px} 
  .first-block-sold-to {position: relative;min-height: 1px;height:155px;float: left;padding-right: 2px; border: 1px solid black;background: #fff;width: 100%; padding-left: 2px;}
  .first-block-ship-to {position: relative;min-height: 1px;height:155px;padding-right: 2px; border: 1px solid black;background: #fff;width: 100%; padding-left: 2px;}
  .first-block-sold {position: relative; min-height: 1px; float: left;padding-right: 2px;padding-left: 2px;width: 50%;}
  .first-block-ship {position: relative; min-height: 1px; float: right;padding-right: 2px; padding-left: 2px;width: 48%;}
  .address-block {position: relative;min-height: 1px;float: left;padding-right: 2px;border: 1px solid black; padding-left: 2px;}
  .first-block-address{margin-right: 20px;text-align: left}
  

  .second-block {position: relative;min-height: 1px;  float: left;padding-right: 2px;width: 49.33333333%;padding-left: 2px;box-sizing: border-box;}
  .second-block-div{margin: 2px 0;position: relative;display:flex;min-height: 1px; padding-left: 50px;width: 100%;}
  .second-block-label{position: relative; min-height: 1px;float: left;padding-right: 2px;padding-left: 2px;width: 38.33333333%;text-transform: capitalize;margin-bottom: 0;text-align: left; }
  .clear{clear: both;}
  .form-div{top: 6px; position: relative;font-weight: normal; margin-top: 10px;}
  .image{border: 1px solid #ccc; padding: 5px; width:100%;}
  .logo-block { margin: auto; text-align: center }
  .pdf-block { width: 800px; margin: auto; border: 1px solid #ccc;padding: 25px 15px; } 
                            
  .picked-by{position: relative;float: left;width:48%}
  .confirmed-by{position: relative;float: right;width:48%}       
  .first-part{position:relative;display:inline;float:left;width:50%}   
  .seond-part{position:relative;display:flex;float:right;width:24%}  
.input-field-border{width: 88px; border-radius:0px !important;border: none; border-bottom: 1px solid black;}

.pick-ticket-header{border: 1px solid black;text-align: center; background: #0d57b0 !important;color: #fff !important;-webkit-print-color-adjust: exact; }
.first-block-label {
    position: relative;
    min-height: 1px;
    float: left;
    padding-right: 2px;
    padding-left: 2px;
    width: 38.33333333%;
    text-transform: capitalize;
    margin-bottom: 0;
    text-align: left;
}
.logo{margin-top: 10px;}
.sold-block-div{margin: 2px 0;position: relative;display:flex;min-height: 1px;width: 100%;}
.ship-block-div{margin: 2px 0;position: relative;display:flex;min-height: 1px;width: 100%;}
.parttable th{background: #0d57b0 !important;color: #fff !important;-webkit-print-color-adjust: exact; }
              </style>
            </head>
        <body onload="window.print();window.close()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();
      }
}