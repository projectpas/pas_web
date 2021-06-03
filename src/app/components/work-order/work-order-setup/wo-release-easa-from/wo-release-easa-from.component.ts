import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
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
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-wo-release-easa-from',
  templateUrl: './wo-release-easa-from.component.html',
  styleUrls: ['./wo-release-easa-from.component.css'],
  providers:[DatePipe]
})
export class WoReleaseEasaFromComponent implements OnInit {

  @Input() workOrderPartNumberId;
  @Input() workOrderId;
  @Input() releaseFromId;
  @Input() isView;
  @Input() isEdit;
  @Input() ReleaseDataForm;
  @Output() updateRelreaseList = new EventEmitter();
  ReleaseData : any = {};
  //ReleaseData: any;
  isSpinnerVisible: boolean = false;
  Issave: boolean = true;
  isconfirmsave : boolean = true;
  currentDate = new Date();
  Printeddate1 : string;
  Printeddate2 : string;
  modal: NgbModalRef;
  endPointURL: any;
  private onDestroy$: Subject<void> = new Subject<void>();
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
    this.endPointURL = environment.baseUrl;
    $('#woReleaseEasaFromDiv').modal('show');
    
    if(this.isEdit || this.isView)
    {
      this.BindData(this.ReleaseDataForm);
    }else
    {
      this.GetWorkorderReleaseFromData();
    }
  }
  

get userName(): string {
    return this.authService.currentUser ? this.authService.currentUser.userName : "";
}

get currentUserMasterCompanyId(): number {
    return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
}
onDate(e)
{
  console.log(e)

let d = new Date(e);
let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
console.log(`${da}/${mo}/${ye}`);
this.Printeddate2 =`${da}/${mo}/${ye}`;

  //this.Printeddate2 =moment(e).format('D/ MMMM/ YYYY'); 
}

onDate1(e)
{
  console.log(e)

let d = new Date(e);
let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
console.log(`${da}-${mo}-${ye}`);
  this.Printeddate1 =`${da}/${mo}/${ye}`; //moment(e).format('D/ MMMM/ YYYY'); 
}

onBlurMethod(e) {
  console.log(e.target.value)
}


BindData(response)
{
  this.ReleaseData = response;


  var date = new Date(this.ReleaseData.date);  
  var dateformatted = moment(date).format('D/ MMMM/ YYYY');  

  this.ReleaseData.date=date;

  var date2 = new Date(this.ReleaseData.date2);  
  var date2formatted = moment(date2).format('D/ MMMM/ YYYY');   

  this.ReleaseData.date2=date2;

let d = new Date(date);
let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
this.Printeddate1 =`${da}/${mo}/${ye}`;

let d1 = new Date(date);
let ye1 = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d1);
let mo1 = new Intl.DateTimeFormat('en', { month: 'short' }).format(d1);
let da1 = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d1);
this.Printeddate2 =`${da1}/${mo1}/${ye1}`;

  // this.Printeddate1 =moment(date).format('D/ MMMM/ YYYY'); 
  // this.Printeddate2 =moment(date2).format('D/ MMMM/ YYYY'); 
  this.ReleaseData.printedName=this.userName;
  this.ReleaseData.printedName2=this.userName;
}


  GetWorkorderReleaseFromData()
  {
    this.isSpinnerVisible = true;
    this.workOrderService
      .GetWorkorderReleaseEasaFromData(this.workOrderId,this.workOrderPartNumberId)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.BindData(response);

      }, error => {
        this.isSpinnerVisible = false;
      });

  }

  onsave()
  {
    this.isconfirmsave = true;
    if(new Date(this.ReleaseData.date) <=  new Date(this.ReleaseData.receivedDate))
    {
      this.isconfirmsave = false;
      this.alertService.showMessage(
        '',
        'Please Select Date greater than ReceivedDate',
        MessageSeverity.warn
    );

    }

    if(new Date(this.ReleaseData.date2) <=  new Date(this.ReleaseData.receivedDate))
    {
      this.isconfirmsave = false;
      this.alertService.showMessage(
        '',
        'Please Select Date greater than ReceivedDate',
        MessageSeverity.warn
    );

    }

    if(this.isconfirmsave)
    { 
      this.Issave = false;
      this.CreateUpdateReleasedata();
    }
  }

  close()
  {
    this.updateRelreaseList.emit();
  }

  CreateUpdateReleasedata()
  {
            this.isSpinnerVisible = true;
            this.ReleaseData.masterCompanyId= this.authService.currentUser.masterCompanyId;
            this.ReleaseData.createdBy= this.userName;
            this.ReleaseData.updatedBy= this.userName;
            this.ReleaseData.createdDate= new Date();
            this.ReleaseData.updatedDate= new Date();
            this.ReleaseData.isActive= true;
            this.ReleaseData.isDeleted= false;
            this.ReleaseData.is8130from= false;
            this.ReleaseData.isClosed= false;
            if(this.isEdit)
            {
              this.ReleaseData.ReleaseFromId=this.releaseFromId;
            }
            else{
              this.ReleaseData.ReleaseFromId=0;
            }
            this.ReleaseData.workOrderPartNoId=this.workOrderPartNumberId;
            this.ReleaseData.WorkorderId=this.workOrderId;
    this.workOrderService.CreateUpdateReleasefrom(this.ReleaseData).pipe(takeUntil(this.onDestroy$)).subscribe(
      result => {
          this.isSpinnerVisible = false;
          this.isEdit = true;
       
          this.alertService.showMessage(
              '',
              '9130 form Added Succesfully',
              MessageSeverity.success
          );
      },
      err => {
          this.handleError(err);
      }
  );
  }
  handleError(err) {
    this.isSpinnerVisible = false;
}
  print(): void {
   
    //this.CreateUpdateReleasedata();
    this.updateRelreaseList.emit();
    let printContents, popupWin;
    printContents = document.getElementById('woReleaseEasaFrom').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
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
     padding: 2px;line-height: 22px;
     height:22px;color: #333;
    //  border-right:1px solid black !important;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-weight;normal;
    font-size: 12.5px !important;max-width:100%; letter-spacing: 0.1px;border:0}

  h4{padding: 5px; display: inline-block; font-size: 14px; font-weight: normal; width: 100%; margin: 0;}
  
  .very-first-block {position: relative; min-height: 1px; float: left;padding-right: 2px;padding-left: 2px;
    width: 50%;}
  .first-block-name{margin-right: 20px} 
  .first-block-sold-to {
    position: relative;
    min-height: 82px;
    height: auto;
    float: left;
    padding-right: 2px;
    border-right: 1px solid black;
    background: #fff;
    width: 100%;
    margin-top:-2px
   
  }
  
  .first-block-ship-to {
    position: relative;
    min-height: 80px;
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
    border-left:1px solid black;
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
    font-size:12.5px !important;
   
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
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
    width: 48%
  }
  
  .confirmed-by {
    position: relative;
    float: right;
    width: 48%
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
    font-size:12.5px !important;
  
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    text-transform: capitalize;
    margin-bottom: 0;
    text-align: left;
  }
  
  .very-first-block {
    position: relative;
    min-height: 1px;
    float: left;
    padding-right: 2px;
    padding-left: 2px;
    width: 57% !important;
  }
  
  .logo {
     padding-top: 10px;
    height:70px;
    width:220px;
  
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
      // margin-top: -2px;
      height: auto;
      min-height: 120px;
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
    margin-top:20px;margin-left:-1px
  }
  .invoice-border{border-bottom: 1px solid;
      min-height: 120px;
      height: auto;}
  
              </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();

   
  }

}
