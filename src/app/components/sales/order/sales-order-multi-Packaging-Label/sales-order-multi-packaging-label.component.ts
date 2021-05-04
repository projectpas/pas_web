import { Component, OnInit, Input, EventEmitter } from "@angular/core";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NavigationExtras } from "@angular/router";
import { SalesOrderService } from "../../../../services/salesorder.service";
import { SalesOrderCopyParameters } from "../models/salesorder-copy-parameters";
import { environment } from "../../../../../environments/environment";
import { SalesOrderShippingLabelView } from "../../../../models/sales/SalesOrderShippingLabelView";
import { ISalesOrderCopyParameters } from "../models/isalesorder-copy-parameters";
import { AuthService } from "../../../../services/auth.service";

@Component({
  selector: "app-sales-order-multi-packaging-label",
  templateUrl: "./sales-order-multi-packaging-label.component.html",
  styleUrls: ["./sales-order-multi-packaging-label.component.scss"]
})
export class SalesOrderMultiPackagingLabelComponent implements OnInit {
  @Input('modal-reference') modalReference: NgbModalRef;
  @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
  @Input() salesOrderView: SalesOrderShippingLabelView;
  salesOrderCopyParameters: ISalesOrderCopyParameters;
  salesOrderShipping: any = [];
  todayDate: Date = new Date();
  salesOrderpartConditionDescription: any;
  salesOrderId: number;
  salesOrderPartId: number;
  soPickTicketId: number;
  packagingSlipId: number;
  endPointURL: any;
  isPrint: boolean = false;
  salesOrder: any = [];
  parts: any = [];
  management: any = {};
  isSpinnerVisible: boolean = false;

  constructor(private salesOrderService: SalesOrderService, private authService: AuthService) {
    this.salesOrderCopyParameters = new SalesOrderCopyParameters();
  }

  ngOnInit() {
    this.endPointURL = environment.baseUrl;
    this.getSalesPickTicketView();
  }

  getSalesPickTicketView() {
    this.isSpinnerVisible = true;
    this.salesOrderService.getPackagingSlipPrint(this.salesOrderId, this.salesOrderPartId, this.soPickTicketId, this.packagingSlipId).subscribe(res => {
      this.salesOrder = res[0].packagingLabelViewModel;
      this.parts = res[0].packagingLabelPartViewModel;
      this.management = res[0].managementStructureHeaderData;
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    })
  }

  close() {
    if (this.modalReference) {
      this.modalReference.close();
    }
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  printContent() {
    let printContents, popupWin;
    printContents = document.getElementById('PackagingSlip').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
          <html>
            <head>
              <title>Print tab</title>
              <style>
              table {
                width: 1000px;
                overflow: auto !important;
              }
              
              table thead {
                background: #0d57b0 !important;
                -webkit-print-color-adjust: exact;
              }
              
              table thead tr {
                background-color: #0d57b0 !important;
                -webkit-print-color-adjust: exact;
              }
              
              table,
              thead,
              td {
                border: white;
                border-collapse: collapse;
              }
              
              table,
              thead,
              th {
                border: 1px solid black;
                border-collapse: collapse;
              }
              
              table thead tr th {
                background-color: #0d57b0 !important;
                padding: 5px !important;
                color: #fff;
                letter-spacing: 0.3px;
                font-size: 10px;
                text-transform: capitalize;
                z-index: 1;
                -webkit-print-color-adjust: exact;
              }
              
              table tbody {
                overflow-y: auto;
                max-height: 500px;
              }
              
              table tbody tr td {
                background: #fff;
                padding: 2px;
                line-height: 22px;
                height: 22px;
                color: #333;
                font-size: 11.5px !important;
                letter-spacing: 0.1px;
                -webkit-print-color-adjust: exact;
              }
              
              h4 {
                padding: 5px;
                display: inline-block;
                font-size: 14px;
                font-weight: 600;
                width: 100%;
                margin: 0;
              }
              h5 {
                text-align: center;
                background-color: #0d57b0 !important;
                color: #fff;
                margin-left: 14%
                -webkit-print-color-adjust: exact;
              }
              
              hr {
                margin-top: 10px;
                margin-bottom: 10px;
                border: 0;
                border-top: 1px solid #e0e0e0;
                height: 0;
                box-sizing: content-box;
                -webkit-print-color-adjust: exact;
              }
              
              .first-block {
                position: relative;
                border: 1px solid black;
                min-height: 1px;
                float: left;
                padding-right: 2px;
                padding-left: 2px;
                width: 66.66666667%;
              }
              
              .first-block-4 {
                position: relative;
                min-height: 1px;
                float: left;
                padding-right: 2px;
                padding-left: 2px;
              }
              
              .border-transparent {
                border-block-color: white;
                -webkit-print-color-adjust: exact;
              }
              
              .first-block-name {
                margin-right: 20px
              }
              
              .first-block-sold-to {
                position: relative;
                min-height: 200px;
                float: left;
                padding-right: 2px;
                border: 1px solid black;
                background: #fff;
                width: 100%;
                padding-left: 2px;
              }
              
              .first-block-ship-to {
                position: relative;
                min-height: 200px;
                padding-right: 2px;
                border: 1px solid black;
                background: #fff;
                width: 100%;
                padding-left: 2px;
                -webkit-print-color-adjust: exact;
              }
              
              .first-block-sold {
                position: relative;
                min-height: 1px;
                float: left;
                padding-right: 2px;
                padding-left: 2px;
                width: 50%;
                margin-top: 10px;
              }
              
              .first-block-ship {
                position: relative;
                min-height: 1px;
                float: right;
                padding-right: 2px;
                padding-left: 2px;
                width: 48%;
                margin-top: 10px
              }
              
              .address-block {
                position: relative;
                min-height: 1px;
                float: left;
                padding-right: 2px;
                border: 1px solid black;
                width: 100%;
                padding-left: 2px;
              }
              
              .text-right {
                text-align: right
              }
              
              .second-block {
                position: relative;
                min-height: 1px;
                float: left;
                padding-right: 2px;
                width: 49.33333333%;
                padding-left: 2px;
                box-sizing: border-box;
              }
              
              .second-block-div {
                margin: 2px 0;
                position: relative;
                display: flex;
                min-height: 1px;
                padding-left: 50px;
                width: 100%;
              }
              
              .second-block-label {
                position: relative;
                min-height: 1px;
                float: left;
                padding-right: 2px;
                padding-left: 2px;
                width: 38.33333333%;
                text-transform: capitalize;
                margin-bottom: 0;
                -webkit-print-color-adjust: exact;
              }
              
              .clear {
                clear: both;
              }
              
              .form-div {
                top: 6px;
                position: relative;
                font-weight: normal;
                margin-top: 10px;
              }
              
              .image {
                border: 1px solid #ccc;
                padding: 5px;
                -webkit-print-color-adjust: exact;
              }
              
              .logo-block {
                margin: auto;
                text-align: center
              }
              
              .pdf-block {
                width: 800px;
                margin: auto;
                border: 1px solid #ccc;
                padding: 25px 15px;
              }
              
              .very-first-block {
                position: relative;
                min-height: 1px;
                float: left;
                padding-right: 2px;
                padding-left: 2px;
                width: 50%;
              }
              first-block-label {
                position: relative;
                min-height: 1px;
                float: left;
                padding-right: 2px;
                padding-left: 2px;
                // width: 38.33333333%;
                text-transform: capitalize;
                margin-bottom: 0;
                text-align: left;
                -webkit-print-color-adjust: exact;
              }
              .packaging-slip-header {
                line-height: 25px;
                margin-left: 42%;
                -webkit-print-color-adjust: exact;
              }
              </style>
            </head>
        <body onload="window.print();window.close()">${printContents}</body>
          </html>`
    );
    popupWin.document.close();
  }
}