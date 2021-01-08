import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as $ from 'jquery'
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-work-order-exclusions',
  templateUrl: './work-order-exclusions.component.html',
  styleUrls: ['./work-order-exclusions.component.scss'],

})
/** WorkOrderDocuments component*/
export class WorkOrderExclusionsComponent implements OnInit, OnChanges {
  @Input() workOrderExclusionsList;
  @Input() workFlowObject;
  @Input() isWorkOrder;
  @Input() markupList;
  @Output() saveExclusionsListForWO = new EventEmitter();
  @Output() updateExclusionsListForWO = new EventEmitter();
  @Output() refreshData = new EventEmitter();
  @Input() isQuote = false;
  @Input() isView: boolean = false;
  @Input() taskList: any = [];
  @Input() view: boolean = false; 
  // @Input() fromquote:boolean=false;
  @Input() addNewExclusion: boolean = false; 
  isEdit: boolean = false;
  editData: any;
  mainEditingIndex: number;
  subEditingIndex: number;
  overAllMarkup: any;
  costPlusType: number = 0;
  workOrderExclusionsLists: any;
  cols = [
    
    { field: 'epn', header: 'EPN' },
    { field: 'epnDescription', header: 'EPN Description' },
    { field: 'quantity', header: 'Qty' },
    { field: 'unitCost', header: 'Unit Cost' },
    { field: 'extendedCost', header: 'Extended Cost' },
    { field: 'memo', header: 'Memo' }
  ];
  exclusionsFlatBillingAmount: any;

  constructor(private workOrderService: WorkOrderService, private authService: AuthService,
    private alertService: AlertService, private cdRef: ChangeDetectorRef) {


  }

  ngOnInit() {
    if (this.workOrderExclusionsList && this.workOrderExclusionsList.length > 0 && this.workOrderExclusionsList[0].headerMarkupId) {
      this.costPlusType = this.workOrderExclusionsList[0].markupFixedPrice;
      this.overAllMarkup = Number(this.workOrderExclusionsList[0].headerMarkupId);
    }
    // this.fromquote=this.fromquote;
    // if(this.fromquote==true){
    //   this.addNewExclusion = true;
    // }
  } 

  ngOnChanges(changes: SimpleChanges) {
    if (this.workOrderExclusionsList && this.workOrderExclusionsList.length > 0 && this.workOrderExclusionsList[0].headerMarkupId) {
      this.costPlusType = this.workOrderExclusionsList[0].markupFixedPrice;
      this.overAllMarkup = Number(this.workOrderExclusionsList[0].headerMarkupId);
    }
    if(this.workOrderExclusionsList){
      if(this.workOrderExclusionsList[0] && this.workOrderExclusionsList[0].length){
        let temp = [];
        this.workOrderExclusionsList.forEach(
          arr =>{
            temp = [...temp, ...arr];
          }
        )
        this.workOrderExclusionsList = temp;
      }
      this.workOrderExclusionsLists = this.workOrderExclusionsList.reduce(function (r, a) {
        r[a.taskId] = r[a.taskId] || [];
        r[a.taskId].push(a);
        return r;
      }, Object.create(null));
      this.workOrderExclusionsList = [];
      for(let x in this.workOrderExclusionsLists){
        // this.workOrderExclusionsList = [...this.workOrderExclusionsList, ...this.workOrderExclusionsLists[x].map(da=>{ return {...da, taskId:x}})]
        this.workOrderExclusionsList.push(this.workOrderExclusionsLists[x]);
      }
    }

    
    // console.log("work order changes",changes);
    // if(changes.fromquote && changes.fromquote.currentValue==true){
    //   this.addNewExclusion = true;
    // }
    // this.fromquote=this.fromquote;
    // if(this.fromquote==true){
    //   this.addNewExclusion = true;
    // }
  }


  get userName(): string {
    return this.authService.currentUser ? this.authService.currentUser.userName : "";
  }



  markupChanged(matData, type) {
    try {
      this.markupList.forEach((markup) => {
        if (type == 'row' && markup.value == matData.markUpPercentageId) {
          matData.billingRate = (Number(matData.unitCost.split(',').join('')) + ((Number(matData.unitCost.split(',').join('')) / 100) * Number(markup.label))).toFixed(2);
          matData['billingAmount'] = (Number(matData['billingRate']) * Number(matData.quantity)).toFixed(2);
        }
        else if (type == 'all' && markup.value == this.overAllMarkup) {
          this.workOrderExclusionsList.forEach((data) => {
            data.forEach((mData)=>{
              if (mData.billingMethodId && Number(mData.billingMethodId) == 1) {
                mData.markUpPercentageId = Number(this.overAllMarkup);
                mData.billingRate = (Number(mData.unitCost.toString().split(',').join('')) + ((Number(mData.unitCost.toString().split(',').join('')) / 100) * Number(markup.label))).toFixed(2)
                mData['billingAmount'] = (Number(mData['billingRate']) * Number(mData.quantity)).toFixed(2);
              }
            })
          })
        }
      })

      // this.markupList.forEach((markup) => {
      //   if (markup.value == matData.markUpPercentageId) {
      //     matData.chargesCostPlus = (matData.extendedCost) + (((matData.extendedCost) / 100) * Number(markup.label))
      //   }
      // })
    }
    catch (e) {
      console.log(e);
    }
  }

  tmchange() {
    for (let mData of this.workOrderExclusionsList) {
      mData.forEach(
        (x)=>{
          x.billingMethodId = this.costPlusType;
          x.markUpPercentageId = '';
          x.billingAmount = x.extendedCost;
          if(Number(this.costPlusType) == 1){
            this.overAllMarkup = '';
          }
        }
      )
    }
  }
  closeAddNew() {
    this.addNewExclusion = false;
    this.isEdit = false;
    this.editData = undefined;
  }

  createNew() {
    this.isEdit = false;
    this.editData = undefined;
    this.addNewExclusion = true;
    this.workFlowObject.exclusions = [{}];
    this.cdRef.detectChanges();
    if (this.taskList) {
      this.taskList.forEach(
        task => {
          if (task.description == "Assemble") {
            this.workFlowObject.exclusions[0]['taskId'] = task.taskId;
          }
        }
      )
    }
  }
  edit(rowData, mainIndex, subIndex) {
    this.mainEditingIndex = mainIndex;
    this.subEditingIndex = subIndex;
    this.createNew();
    this.cdRef.detectChanges();
    this.isEdit = true;
    this.addNewExclusion = true;
    this.editData = { ...rowData, estimtPercentOccurrance: rowData.estimtPercentOccurranceId };


  }
  delete(rowData, i) {
    if (this.isQuote) {
      rowData.isDeleted = true;
      // this.workOrderExclusionsList[i].isDeleted = true;
    }
    else {
      const { workOrderExclusionsId } = rowData;
      this.workOrderService.deleteWorkOrderExclusionByExclusionId(workOrderExclusionsId, this.userName).subscribe(res => {
        this.refreshData.emit();
        this.alertService.showMessage(
          '',
          'Deleted WorkOrder Exclusion Successfully',
          MessageSeverity.success
        );

      })
    }
  }

  saveExclusionsList(event) {
    if (!this.workOrderExclusionsList) {
      this.workOrderExclusionsList = [];
    }
    event['exclusions'].forEach(
      x=>{
        x.billingAmount = x.extendedCost;
      }
    )
    if (this.isQuote) {
      let temp = [];
      this.workOrderExclusionsList.forEach((x)=>{
        temp = [...temp, ...x];
      })
      temp = [...temp, ...event['exclusions'].map(x => { return { ...x, epn: x.partNumber, epnDescription: x.partDescription, markupFixedPrice: this.costPlusType, headerMarkupId: Number(this.overAllMarkup) } })];

      this.workOrderExclusionsLists = temp.reduce(function (r, a) {
        r[a.taskId] = r[a.taskId] || [];
        r[a.taskId].push(a);
        return r;
      }, Object.create(null));
      this.workOrderExclusionsList = [];
      for(let x in this.workOrderExclusionsLists){
        // this.workOrderExclusionsList = [...this.workOrderExclusionsList, ...this.workOrderExclusionsLists[x].map(da=>{ return {...da, taskId:x}})]
        this.workOrderExclusionsList.push(this.workOrderExclusionsLists[x]);
      }
      
      $('#addNewExclusions').modal('hide');
      // this.addNewExclusion = true;
    }
    else {
      this.saveExclusionsListForWO.emit(event);
      $('#addNewExclusions').modal('hide');
      // this.addNewExclusion = true;
    }
  }



  updateExclusionsList(event) {
    if (this.isQuote && this.isEdit) {
      this.workOrderExclusionsList[this.mainEditingIndex][this.subEditingIndex] = event.exclusions[0];
      $('#addNewExclusions').modal('hide');
      this.isEdit = false;
    }
    else {
      this.updateExclusionsListForWO.emit(event);
      $('#addNewExclusions').modal('hide');
      this.isEdit = false;
    }
  }

  saveQuotation() {
    // task.masterCompany.masterCompanyId
    let WorkOrderQuoteTask = [];
    this.workOrderExclusionsList.forEach(
      (taskCharge)=>{
        this.taskList.forEach(
          (task)=>{
            if(task.taskId == taskCharge[0].taskId){
              WorkOrderQuoteTask.push(
                {
                  "WorkOrderQuoteTaskId":0,
                  "TaskId":task.taskId,
                  "ExclusionsCost":this.getTotalTaskUnitCost(taskCharge),
                  "ExclusionsBilling":this.getTotalTaskBillingAmount(taskCharge),
                  "ExclusionsRevenue":this.getTotalTaskBillingAmount(taskCharge),
                  "masterCompanyId":this.authService.currentUser.masterCompanyId,
                  "CreatedBy":"admin",
                  "UpdatedBy":"admin",
                  "CreatedDate":new Date().toDateString(),
                  "UpdatedDate":new Date().toDateString(),
                  "IsActive":true,
                  "IsDeleted":false
                }
              )
            }
          }
        )
      }
    )
    let temp = this.workOrderExclusionsList;
    let sendData = []
    for (let index = 0; index < temp.length; index++) {
      sendData = [...sendData, ...temp[index]];
      
    }
    sendData = sendData.map(exc => {
      return { ...exc, headerMarkupId: Number(this.overAllMarkup), markupFixedPrice: this.costPlusType, }
    })
    let result = {'data': sendData, 'taskSum': WorkOrderQuoteTask}
    this.saveExclusionsListForWO.emit(result);
  }
  getTotalQuantity() {
    let totalQuantity = 0;
    if (this.workOrderExclusionsList) {
      this.workOrderExclusionsList.forEach(
        (material) => {
          totalQuantity += Number(this.getTotalTaskQuantity(material));
        }
      )
    }
    return totalQuantity;
  }

  getTotalTaskQuantity(tData) {
    let totalQuantity = 0;
    if (tData) {
      tData.forEach(
        (material) => {
          if (material.quantity && !material.isDeleted) {
            totalQuantity += Number(material.quantity);
          }
        }
      )
    }
    return totalQuantity;
  }

  getTotalUnitCost() {
    let total = 0;
    if (this.workOrderExclusionsList) {
      this.workOrderExclusionsList.forEach(
        (material) => {
          total += Number(this.getTotalTaskUnitCost(material));
        }
      )
    }
    return total.toFixed(2);
  }
  
  getTotalTaskUnitCost(tData) {
    let total = 0;
    if (tData) {
      tData.forEach(
        (material) => {
          if (material.extendedCost && !material.isDeleted) {
            let cost = material.extendedCost.toString().split(',').join('');
            total += Number(cost);
          }
        }
      )
    }
    return total.toFixed(2);
  }

  getTotalBillingRate() {
    let total = 0;
    if (this.workOrderExclusionsList) {
      this.workOrderExclusionsList.forEach(
        (material) => {
          total += Number(this.getTotalTaskBillingRate(material));
        }
      )
    }
    return total.toFixed(2);
  }

  getTotalTaskBillingRate(tData) {
    let total = 0;
    if (tData) {
      tData.forEach(
        (material) => {
          if (material.billingRate && !material.isDeleted) {
            total += Number(material.billingRate);
          }
        }
      )
    }
    return total.toFixed(2);
  }

  getTotalBillingAmount() {
    let total = 0;
    if (this.workOrderExclusionsList) {
      this.workOrderExclusionsList.forEach(
        (material) => {
          total += Number(this.getTotalTaskBillingAmount(material));
        }
      )
    }
    return total.toFixed(2);
  }

  getTotalTaskBillingAmount(tData) {
    let total = 0;
    if (tData) {
      tData.forEach(
        (material) => {
          if (material.billingAmount && !material.isDeleted) {
            let amount = material.billingAmount.toString().split(',').join('');
            total += Number(amount);
          }
        }
      )
    }
    return total.toFixed(2);
  }

  //   saveChargesList(event){
  //     this.saveChargesListForWO.emit(event);
  //     $('#addNewCharges').modal('hide');
}