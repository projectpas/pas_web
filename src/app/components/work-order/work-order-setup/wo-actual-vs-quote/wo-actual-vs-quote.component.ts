import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
declare var $: any;
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonService } from "../../../../services/common.service";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatNumberAsGlobalSettingsModule } from 'src/app/generic/autocomplete';
@Component({
  selector: 'app-wo-actual-vs-quote',
  templateUrl: './wo-actual-vs-quote.component.html',
  styleUrls: ['./wo-actual-vs-quote.component.scss'],
  encapsulation: ViewEncapsulation.None

})
/** WorkOrderDocuments component*/
export class WorkOrderActualVsQuoteComponent implements OnChanges, OnInit {
  @Input() isWorkOrder;
  @Output() refreshData = new EventEmitter();
  @Input() isView: boolean = false;
  @Input() isSubWorkOrder: any = false;
  @Input() subWOPartNoId;
  @Input() workOrderId;
  @Input() workFlowWorkOrderId;
  modal: NgbModalRef;
  isEdit: boolean = false;
  result:any={};
  modifiedResults:any={};
  constructor(private workOrderService: WorkOrderService, private authService: AuthService,
    private alertService: AlertService, private modalService: NgbModal, private cdRef: ChangeDetectorRef, private commonService: CommonService) {
  }
  originalList:any=[];
  totalWoPrice:any;
  totalWoQPrice:any;

  totalWoCost:any;
  totalWoQCost:any;

  totalWoMargin:any;
  totalWoQMargin:any;
  isSpinnerVisible: boolean = false;
  ngOnChanges() { 
  }
  ngOnInit() {
 this.getWOActualVsSummaryData();
  }
  getWOActualVsSummaryData(){
    this.isSpinnerVisible=true;
    this.workOrderService.getWOActualVsSummary(this.workOrderId,this.workFlowWorkOrderId,this.isSubWorkOrder).subscribe(res => {
console.log("res for actual vs qte",res)
this.isSpinnerVisible=false;
this.result=res;
this.modifiedResults={...res,
  materialPrice : res.materialPrice? formatNumberAsGlobalSettingsModule(res.materialPrice, 2) : '0.00',
  labourPrice: res.labourPrice? formatNumberAsGlobalSettingsModule(res.labourPrice, 2) : '0.00',
  miscChargesPrice: res.miscChargesPrice? formatNumberAsGlobalSettingsModule(res.miscChargesPrice, 2) : '0.00',
  quoteMaterialPrice : res.quoteMaterialPrice? formatNumberAsGlobalSettingsModule(res.quoteMaterialPrice, 2) : '0.00',
  quoteLabourPrice :res.quoteLabourPrice? formatNumberAsGlobalSettingsModule(res.quoteLabourPrice, 2) : '0.00',
  quoteMiscChargesPrice :res.quoteMiscChargesPrice? formatNumberAsGlobalSettingsModule(res.quoteMiscChargesPrice, 2) : '0.00',
  materialCost : res.materialCost? formatNumberAsGlobalSettingsModule(res.materialCost, 2) : '0.00',
  labourCost : res.labourCost? formatNumberAsGlobalSettingsModule(res.labourCost, 2) : '0.00',
  miscCharges : res.miscCharges? formatNumberAsGlobalSettingsModule(res.miscCharges, 2) : '0.00',
  quoteMaterialCost : res.quoteMaterialCost? formatNumberAsGlobalSettingsModule(res.quoteMaterialCost, 2) : '0.00',
  quoteLabourCost:  res.quoteLabourCost? formatNumberAsGlobalSettingsModule(res.quoteLabourCost, 2) : '0.00',
  quoteMiscCharges : res.quoteMiscCharges? formatNumberAsGlobalSettingsModule(res.quoteMiscCharges, 2) : '0.00',
  marginMaterialCost : res.marginMaterialCost? formatNumberAsGlobalSettingsModule(res.marginMaterialCost, 2) : '0.00',
  marginLabourCost : res.marginLabourCost? formatNumberAsGlobalSettingsModule(res.marginLabourCost, 2) : '0.00',
  marginMiscCharges:  res.marginMiscCharges? formatNumberAsGlobalSettingsModule(res.marginMiscCharges, 2) : '0.00',
  marginQuoteMaterialCost : res.marginQuoteMaterialCost? formatNumberAsGlobalSettingsModule(res.marginQuoteMaterialCost, 2) : '0.00',
  marginQuoteLabourCost:  res.marginQuoteLabourCost? formatNumberAsGlobalSettingsModule(res.marginQuoteLabourCost, 2) : '0.00',
  marginQuoteMiscCharges : res.marginQuoteMiscCharges? formatNumberAsGlobalSettingsModule(res.marginQuoteMiscCharges, 2) : '0.00'
};
  this.totalWoPrice=
  (this.result.materialPrice? parseFloat(this.result.materialPrice.toString().replace(/\,/g, '')) : 0) +
   (this.result.labourPrice? parseFloat(this.result.labourPrice.toString().replace(/\,/g, '')) : 0) + 
   (this.result.miscChargesPrice? parseFloat(this.result.miscChargesPrice.toString().replace(/\,/g, '')) : 0)

   this.totalWoPrice=   this.totalWoPrice? formatNumberAsGlobalSettingsModule(this.totalWoPrice, 2) : '0.00';

  this.totalWoQPrice=
  (this.result.quoteMaterialPrice? parseFloat(this.result.quoteMaterialPrice.toString().replace(/\,/g, '')) : 0) +
  (this.result.quoteLabourPrice? parseFloat(this.result.quoteLabourPrice.toString().replace(/\,/g, '')) : 0) + 
  (this.result.quoteMiscChargesPrice? parseFloat(this.result.quoteMiscChargesPrice.toString().replace(/\,/g, '')) : 0)
  this.totalWoQPrice=   this.totalWoQPrice? formatNumberAsGlobalSettingsModule(this.totalWoQPrice, 2) : '0.00';
  



  this.totalWoCost=
  (this.result.materialCost? parseFloat(this.result.materialCost.toString().replace(/\,/g, '')) : 0) +
   (this.result.labourCost? parseFloat(this.result.labourCost.toString().replace(/\,/g, '')) : 0) + 
   (this.result.miscCharges? parseFloat(this.result.miscCharges.toString().replace(/\,/g, '')) : 0)

   this.totalWoCost=   this.totalWoCost? formatNumberAsGlobalSettingsModule(this.totalWoCost, 2) : '0.00';

  this.totalWoQCost=
  (this.result.quoteMaterialCost? parseFloat(this.result.quoteMaterialCost.toString().replace(/\,/g, '')) : 0) +
  (this.result.quoteLabourCost? parseFloat(this.result.quoteLabourCost.toString().replace(/\,/g, '')) : 0) + 
  (this.result.quoteMiscCharges? parseFloat(this.result.quoteMiscCharges.toString().replace(/\,/g, '')) : 0)
  

  this.totalWoQCost=   this.totalWoQCost? formatNumberAsGlobalSettingsModule(this.totalWoQCost, 2) : '0.00';


  this.totalWoMargin=
  (this.result.marginMaterialCost? parseFloat(this.result.marginMaterialCost.toString().replace(/\,/g, '')) : 0) +
   (this.result.marginLabourCost? parseFloat(this.result.marginLabourCost.toString().replace(/\,/g, '')) : 0) + 
   (this.result.marginMiscCharges? parseFloat(this.result.marginMiscCharges.toString().replace(/\,/g, '')) : 0)

   this.totalWoMargin=   this.totalWoMargin? formatNumberAsGlobalSettingsModule(this.totalWoMargin, 2) : '0.00';

  this.totalWoQMargin=
  (this.result.marginQuoteMaterialCost? parseFloat(this.result.marginQuoteMaterialCost.toString().replace(/\,/g, '')) : 0) +
  (this.result.marginQuoteLabourCost? parseFloat(this.result.marginQuoteLabourCost.toString().replace(/\,/g, '')) : 0) + 
  (this.result.marginQuoteMiscCharges? parseFloat(this.result.marginQuoteMiscCharges.toString().replace(/\,/g, '')) : 0)
  

  this.totalWoQMargin=   this.totalWoQMargin? formatNumberAsGlobalSettingsModule(this.totalWoQMargin, 2) : '0.00';





    },err=>{
      this.isSpinnerVisible=false;
    })
}
}