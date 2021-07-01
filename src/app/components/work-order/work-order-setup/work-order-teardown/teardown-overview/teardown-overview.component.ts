import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit } from '@angular/core';
import { WorkOrderService } from '../../../../../services/work-order/work-order.service';
declare var $ : any;

@Component({
  selector: 'app-teardown-overview',
  templateUrl: './teardown-overview.component.html',
  styleUrls: ['./teardown-overview.component.scss']
})

export class TeardownOverviewComponent implements OnInit {
  description:any;
    @Input() workFlowWorkOrderId1;
    @Input() isSubWorkOrder:boolean=false;
    @Input() subWOPartNoId:any;
    saveTearDownData:any={};
    isSpinnerVisible = false;
    newSaveTearDownData={
      isRemovalReasons:false,
      isPmaDerBulletins:false,
      isPreliinaryReview:false,
      isPreAssmentResults:false,
      isDiscovery:false,
      isPreAssemblyInspection:false,
      isWorkPerformed:false,
      isTestDataUsed:false,
      isBulletinsModification:false,
      isFinalTest:false,
      isFinalInspection:false,
      isAdditionalComments:false
    }
    moduleNameeRemoval:any='RemovalReasons';
    moduleNameePrellinary:any='PreliinaryReview';
    moduleNameePreAssesment:any='Pre-AssessmentResults';
    moduleNameeTearDescovery:any='TeardownDiscovery';
    moduleNameePreAssembly:any='PreAssemblyInspection';
    constructor(private workOrderService: WorkOrderService,) {}  

    ngOnInit() {
      if(this.workFlowWorkOrderId1){
        this.getTearDownData();
      }
    } 

    ngOnChanges(changes: SimpleChanges) {
        this.getTearDownData();
     }

    ExpandAllCustomerDetailsModel() {
      $('#step1').collapse('show');
      $('#step2').collapse('show');
      $('#step3').collapse('show'); 
      $('#step4').collapse('show');
      $('#step5').collapse('show');
      $('#step6').collapse('show');
      $('#step7').collapse('show');
      $('#step8').collapse('show');
      $('#step9').collapse('show');
      $('#step10').collapse('show');
      $('#step11').collapse('show');
      $('#step12').collapse('show');
  }

  CloseAllCustomerDetailsModel() {
      $('#step1').collapse('hide');
      $('#step2').collapse('hide');
      $('#step3').collapse('hide');
      $('#step4').collapse('hide');
      $('#step5').collapse('hide');
      $('#step6').collapse('hide');
      $('#step7').collapse('hide');
      $('#step8').collapse('hide');
      $('#step9').collapse('hide');
      $('#step10').collapse('hide');
      $('#step11').collapse('hide');
      $('#step12').collapse('hide');
  } 

  getTearDownData(){
      if(this.workFlowWorkOrderId1){
        if(this.isSubWorkOrder==true){
          this.workFlowWorkOrderId1=this.subWOPartNoId;
        }
        this.isSpinnerVisible=true;
        this.workOrderService.getworkOrderTearDownViewData(this.workFlowWorkOrderId1,this.isSubWorkOrder).subscribe(res => {
       
       if(res !=null){
         this.saveTearDownData=res;
        }else{
          this.saveTearDownData= this.newSaveTearDownData;
        } 
        this.isSpinnerVisible = false;
      }, err => {
        this.isSpinnerVisible = false;
    })
    }
  }
}  

