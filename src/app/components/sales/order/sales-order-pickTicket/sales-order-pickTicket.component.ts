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
              .t0 td {
                 
                border: 1px solid #999; 
                -webkit-print-color-adjust: exact; 
                
                    }
                    .t1 .td1, .t1 .td3 {
                        padding-right: 30px;
                    }
                    .t1 .td2{
                        padding-right: 100px;
                    }
                    .t4 th, .t3 th{
                        background: #4298ff;  
                        -webkit-print-color-adjust: exact; 
                        color: #FFF;
                        
                        padding: 5px;
                    }
                    .t4 th{
                     border: 1px solid #999;
     
                    }
                   .t4 td{
                        border: 1px solid #999;
                        padding: 5px; 
                        -webkit-print-color-adjust: exact; 
                
                    }
                   .logo{
                     width: 30px;
                     height: 10px;
                   }
                   table{
                     font-size: 12px !important;
                   }

                   .first-block {
                    position: relative;
                    min-height: 1px;
                    float: left;
                    padding-right: 2px;
                    padding-left: 2px;
                    width: 50%;
                    text-align: left;
                    }
                
                    .first-block-right {
                    position: relative;
                    min-height: 1px;
                    float: right;
                    padding-right: 2px;
                    padding-left: 2px;
                    width: 50%;
                    text-align: left;
                    top:8px;
                    }
                
                    .first-block-4 {
                    position: relative;
                    min-height: 1px;
                    float: left;
                    padding-right: 2px;
                    width: 70%;
                    padding-left: 2px;
                    }
                
                    .first-block-address {
                    margin-right: 20px;
                    text-align: left
                    }

                   .second-block {
                    position: relative;
                    min-height: 1px;
                    float: left;
                    padding-right: 2px;
                    width: 49%;
                    padding-left: 2px;
                    box-sizing: border-box;
                    }
                
                    .second-block-div {
                    margin: 2px 0;
                    position: relative;
                    min-height: 1px;
                    float: left;
                    padding-right: 2px;
                    padding-left: 2px;
                    width: 100%;
                    }

                    second-block-label {
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
                    
                    .clear {
                        clear: both;
                    }

                    .top{
                        top:5px;
                    }
              </style>
            </head>
        <body onload="window.print();window.close()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();
      }
}