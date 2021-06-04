import { Component, OnInit,Input,OnChanges,Output,EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { WorkOrderService } from 'src/app/services/work-order/work-order.service';
declare var $: any;
import * as moment from 'moment';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { AlertService,MessageSeverity } from 'src/app/services/alert.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-woq-form',
  templateUrl: './woq-form.component.html',
  styleUrls: ['./woq-form.component.scss'],
  providers:[DatePipe]
})
export class WoqFromComponent implements OnInit,OnChanges {

  @Input() workOrderPartNumberId;
  @Input() workOrderId;
  @Input() isView;
  @Input() workFlowWorkOrderId;
  @Output() Workorderprint = new EventEmitter();
  //ReleaseData: any;
  workOrderprintData: any = [];
  isSpinnerVisible: boolean = true;
  modal: NgbModalRef;
  private onDestroy$: Subject<void> = new Subject<void>();
  Printeddate1 : string;
  Printeddate2 : string;
  Issave: boolean = true;
  isconfirmsave : boolean = true;
  constructor(
    private authService: AuthService,
    private acRouter: ActivatedRoute,
    private router: Router,
    private workOrderService: WorkOrderService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
  ) 
  {}

  ngOnInit() 
  {
    this.workOrderPartNumberId=0;
    $('#woReleaseFromDiv').modal('show');
  
      this.GetWorkOrderQoutePrintFormData();
    
  }
    

  ngOnChanges() 
  {
  
  }

  get userName(): string {
    return this.authService.currentUser ? this.authService.currentUser.userName : "";
}

get currentUserMasterCompanyId(): number {
    return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
}

close()
{
    this.Workorderprint.emit();
}

GetWorkOrderQoutePrintFormData() {
  this.isSpinnerVisible = true;
  this.workOrderService.GetWorkOrderQoutePrintFormData(this.workOrderId,this.workOrderPartNumberId,this.workFlowWorkOrderId).subscribe(res => {
      this.workOrderprintData = res[0];
     // this.getWorkOrderCharges();
      //this.onWorkOrderPrintLoad.emit();
      this.isSpinnerVisible = false;
  }, error => {
      this.isSpinnerVisible = false;
  })
}



  handleError(err) {
    this.isSpinnerVisible = false;
}
  

  print(): void {
    this.Workorderprint.emit();
    //this.CreateUpdateReleasedata();
   // this.updateRelreaseList.emit();
    let printContents, popupWin;
    printContents = document.getElementById('woReleaseFrom').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          table {
            width: 100.6%;
           overflow: auto !important;
          }
          
          table thead {
           background: #808080;
          }
          
          table thead tr {
           /* background: #0d57b0 !important; */
          
          }
          
          table,
          thead,
          td {
           border: 1px solid black;
           border-collapse: collapse;
          }
          
          table,
          thead,
          th {
           border: 1px solid black;
           border-collapse: collapse;
          }
          .table-border-right tr td{
            border-right:1px solid black !important;
          }
          table thead tr th {
            /* background: #0d57b0 !important; */
           padding: 5px !important;
           color: #000;
           letter-spacing: 0.3px;
           font-size: 10.5px;
           text-transform: capitalize;
           z-index: 1;
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
            // border-right: 1px solid black !important;
           font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
             font-size: 10.5px !important;
             font-weight: 700;
           max-width: 100px;
           letter-spacing: 0.1px;
           border: 0
          }
          .td-width-25{
            width:25%;
          }
          h4 {
           padding: 5px;
           display: inline-block;
           font-size: 14px;
           font-weight: 600;
           width: 100%;
           margin: 0;
          }
          
          hr {
           margin-top: 10px;
           margin-bottom: 10px;
           border: 0;
           border-top: 1px solid #e0e0e0;
           height: 0;
           box-sizing: content-box;
          }
          
          .first-block-name {
           margin-right: 20px
          }
          
          .first-block-sold-to {
           position: relative;
           min-height: 142px;
           height: auto;
           float: left;
           padding-right: 2px;
            /* border-right: 1px solid black; */
           background: #fff;
           width: 100%;
          
          }
          
          .first-block-ship-to {
           position: relative;
           min-height: 140px;
           height: auto;
           padding-right: 2px;
            /* border-right: 1px solid black; */
           background: #fff;
           width: 100%;
          
          }
          .text-right{
          text-align:right;
          }
          .border-none{
           border:none;
          }
          .label-margin{
           margin-left:-25px;
          }
          
          .first-block-sold {
           position: relative;
           min-height: 140px;
           height:auto;
           float: left;
           border-right:1px solid black;
           padding-right: 2px;
           padding-left: 2px;
           width: 50%;
          }
          
          .first-block-ship {
           position: relative;
           min-height: 1px;
           float: right;
           padding-right: 2px;
           padding-left: 2px;
           width:50%;
          }
          .font-12{
          font-size:12px;
          }
          .address-block {
           position: relative;
           min-height: 1px;
           float: left;
           padding-right: 2px;
            /* border: 1px solid black; */
           width: 100%;
           padding-left: 2px;
          }
          
          .first-block-address {
           margin-right: 20px;
           text-align: left
          }
          
          
          .second-block {
           position: relative;
           height:auto;min-height:161px;
           margin-top:-2px;
           float: left;
           padding-right: 2px;
          // width: 35%;
          width:29%;
          
            /* border-left:1px solid black;
              margin-left: 16%; */
           padding-left: 2px;
           box-sizing: border-box;
          }
          
          .second-block-div {
           margin: 2px 0;
           position: relative;
           display: flex;
          
           min-height: 1px;
          
           width: 100%;
          }
          
          .second-block-label {
           position: relative;
           min-height: 1px;
           float: left;
           padding-right: 2px;
           padding-left: 2px;
           width: 38.33333333%;
           font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
             font-size: 10.5px !important;
             font-weight: 700;
           text-transform: capitalize;
           margin-bottom: 0;
           text-align: left;
          }
          
          .clear {
           clear: both;
          }
          
          .form-div {
            /* top: 6px; */
           position: relative;
           font-weight: normal;
           font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            /* margin-top: 10px; */
          }
          
          .image {
           border: 1px solid #000;
            /* padding: 5px; */
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
           width:100%;
           font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
             font-size: 10.5px !important;
             font-weight: 700;
           padding-right: 2px;
           padding-left: 2px;
            /* width: 38.33333333%; */
           text-transform: capitalize;
           margin-bottom: 0;
           text-align: left;
          }
          .border-top{
            border-top:1px solid black !important;
          }
          .align-top{
            vertical-align:top;
          }
          .top-table-alignment{
            margin-bottom: -3px;
              width: 102%;
              margin-left: -7px !important;
          }
          .border{
            border:1px solid black !important;
          }
          
          .very-first-block {
           position: relative;
           min-height: 200px;
           height:auto;
           border-right:1px solid black;
           float: left;
          //  padding-right: 2px;
          //  padding-left: 2px;
           width: 70% !important;
          }
          
          .logo {
           padding-top: 10px;
            /* height:110px;
            width:300px; */
           height:auto;
           max-width:100%;
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
             margin-top: -2px;
             height: auto;
             min-height: 140px;
          }
          
          .parttable th {
          //  background: #fff !important;
           background: #f4f4f4 !important;
           color: #000 !important;
           -webkit-print-color-adjust: exact;
          }
          .border-bottom{
           border-bottom:1px solid black !important;
          }
          .table-margins{
            /* margin-top:20px; */
           margin-top:-5px;
           margin-left:-3px;
          }
          .invoice-border{border-bottom: 1px solid;
             min-height: 200px;
             height: auto;}
  
              </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
