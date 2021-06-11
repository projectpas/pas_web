import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
declare var $: any;
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonService } from "../../../../services/common.service";
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditComponentComponent } from '../../../../shared/components/audit-component/audit-component.component';
@Component({
  selector: 'app-work-order-charges',
  templateUrl: './work-order-charges.component.html',
  styleUrls: ['./work-order-charges.component.scss'],
  encapsulation: ViewEncapsulation.None

})
/** WorkOrderDocuments component*/
export class WorkOrderChargesComponent implements OnChanges, OnInit {
  @Input() workOrderChargesList;
  @Input() workFlowObject;
  @Input() isWorkOrder;
  @Input() isQuote = false;
  @Input() isSummarizedView: boolean = false;
  @Input() isLoadWoCharges:any=false;
  @Output() refreshChargesWO = new EventEmitter();
  @Input() markupList;
  @Output() saveChargesListForWO = new EventEmitter();
  @Output() saveChargesListDeletedStatus = new EventEmitter();

  @Output() updateChargesListForWO = new EventEmitter();
  @Output() refreshData = new EventEmitter();
  @Output() createQuote = new EventEmitter();
  @Input() isView: boolean = false;
  // @Input() taskList: any = [];
  @Input() view: boolean = false;
  @Input() fromquote: boolean = false;
  @Input() buildMethodDetails: any = {};
  @Input() isSubWorkOrder: any = false;
  @Input() subWOPartNoId;
  currentDeletedstatus: boolean = false;
  roNumList: any[];
  pageIndex: number = 0;
  totalRecords: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  cols = [
    { field: 'chargeType', header: 'Charge Type' ,isRequired:true,width:"100px"},
    { field: 'glAccountName', header: 'Gl Account Name',isRequired:false ,width:"100px"},
    { field: 'description', header: 'Description',isRequired:false ,width:"220px"},
    { field: 'quantity', header: 'Qty',isRequired:true ,width:"50px"},
    { field: 'refNum', header: 'Ref Num',isRequired:false },
    { field: 'unitCost', header: 'Unit Cost',isRequired:true ,width:"60px"},
    { field: 'extendedCost', header: 'Extented Cost',isRequired:false ,width:"50px"},
    { field: 'vendorName', header: 'Vendor Name',isRequired:false ,width:"100px"},
  ]
  auditHistoryHeaders = [
    { field: 'taskName', header: 'Task' ,isRequired:true},
    { field: 'chargeType', header: 'Charge Type',isRequired:true },
    { field: 'glAccountName', header: 'Gl Account Name',isRequired:false },
    { field: 'description', header: 'Description',isRequired:false },
    { field: 'quantity', header: 'Qty',isRequired:true },
    { field: 'refNum', header: 'Ref Num',isRequired:false },
    { field: 'unitCost', header: 'Unit Cost',isRequired:true },
    { field: 'extendedCost', header: 'Extented Cost',isRequired:false },
    { field: 'vendorName', header: 'Vendor Name',isRequired:false },
    { field: 'isDeleted', header: 'Is Deleted',isRequired:false },
    { field: 'createdDate', header: 'Created Date',isRequired:false },
    { field: 'createdBy', header: 'Created By',isRequired:false },
    { field: 'updatedDate', header: 'Updated Date',isRequired:false },
    { field: 'updatedBy', header: 'Updated By',isRequired:false },
  ]

  auditHistoryQuoteHeaders= [
    { field: 'taskName', header: 'Task' ,isRequired:true},
    { field: 'chargeType', header: 'Charge Type',isRequired:true },
    { field: 'glAccountName', header: 'Gl Account Name',isRequired:false },
    { field: 'description', header: 'Description',isRequired:false },
    { field: 'quantity', header: 'Qty',isRequired:true },
    { field: 'refNum', header: 'Ref Num',isRequired:false },
    { field: 'unitCost', header: 'Unit Cost',isRequired:true },
    { field: 'extendedCost', header: 'Extented Cost',isRequired:false },
    { field: 'vendorName', header: 'Vendor Name',isRequired:false },
    { field: 'billingName', header: 'Billing Method',isRequired:false },
    { field: 'markUp', header: 'Mark Up',isRequired:false },
    { field: 'billingRate', header: 'Billing Rate',isRequired:false },
    { field: 'billingAmount', header: 'Billing Amount',isRequired:false },
    { field: 'isDeleted', header: 'Is Deleted',isRequired:false },
    { field: 'createdDate', header: 'Created Date',isRequired:false },
    { field: 'createdBy', header: 'Created By',isRequired:false },
    { field: 'updatedDate', header: 'Updated Date',isRequired:false },
    { field: 'updatedBy', header: 'Updated By',isRequired:false },
  ]
  modal: NgbModalRef;
  isEdit: boolean = false;
  editData: any;
  mainEditingIndex: number;
  subEditingIndex: number;
  costPlusType: number = 0;
  overAllMarkup: any;
  addNewCharges: boolean = false;
  workOrderChargesLists: any;
  chargesFlatRateBillingAmount: any;
  workOrderQuoteDetailsId: any;

  constructor(private workOrderService: WorkOrderService, private authService: AuthService,
    private alertService: AlertService, private modalService: NgbModal, private cdRef: ChangeDetectorRef, private commonService: CommonService) {


  }
  originalList:any=[];
  ngOnChanges() { 
    this.isLoadWoCharges=this.isLoadWoCharges;
    this.originalList=this.workOrderChargesList;
    console.log(this.originalList)
    // if(this.workOrderChargesList && this.workOrderChargesList[0].workOrderQuoteDetailsId !=0){
    //   this.disableCrg=true;
    // }else{
    //   this.disableCrg=false;
    // }

    if (this.workOrderChargesList && this.workOrderChargesList.length > 0 && this.workOrderChargesList[0].headerMarkupId) {
      this.costPlusType = Number(this.workOrderChargesList[0].markupFixedPrice);
      this.overAllMarkup = this.workOrderChargesList[0].headerMarkupId;
    }
    if (this.workOrderChargesList) {
      this.workOrderChargesLists =[];
      this.workOrderChargesLists = this.workOrderChargesList.reduce(function (r, a) {
        r[a.taskId] = r[a.taskId] || [];
        r[a.taskId].push(a);
        return r;
      }, Object.create(null));
      this.workOrderChargesList = [];
      for (let x in this.workOrderChargesLists) {
        this.workOrderChargesList.push(this.workOrderChargesLists[x]);
      }
    }
    if (this.workOrderChargesList && this.workOrderChargesList.length > 0) {
      this.totalRecords = this.workOrderChargesList.length;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    } else {
      this.totalRecords = 0;
      this.totalPages = 0;
    }
    this.fromquote = this.fromquote;
    if (this.fromquote == true) {
      this.addNewCharges = true;
    }
    if (this.buildMethodDetails) {

      if(this.buildMethodDetails['chargesBuildMethod'] == null || this.buildMethodDetails['chargesBuildMethod'] == 0|| this.buildMethodDetails['chargesBuildMethod'] == undefined)
      {
          this.costPlusType = 1;
          this.tmchange();
      }else{
          this.costPlusType = this.buildMethodDetails['chargesBuildMethod'];
      }

      if(this.isLoadWoCharges)
      {
        this.tmchange();
      }
      this.chargesFlatRateBillingAmount = this.buildMethodDetails['chargesFlatBillingAmount'];
    
    }
  }
  ngOnInit() {
if(!this.isSummarizedView){
  this.getRONumberList();
  this.getTaskList(); 
  this.originalList=this.workOrderChargesList;
}

    if (this.workOrderChargesList && this.workOrderChargesList.length > 0 && this.workOrderChargesList[0].markupFixedPrice) {
      this.costPlusType = Number(this.workOrderChargesList[0].markupFixedPrice);
      this.overAllMarkup = this.workOrderChargesList[0].headerMarkupId;
    }
    // if (!this.isQuote) {
    //   this.cols = [...this.cols, { field: 'extendedPrice', header: 'Extended Price' }, { field: 'unitPrice', header: 'Unit Price' },]
    // }
    if (this.buildMethodDetails) {
      this.workOrderQuoteDetailsId=this.buildMethodDetails['workOrderQuoteDetailsId'];
      if(this.buildMethodDetails['chargesBuildMethod'] == null || this.buildMethodDetails['chargesBuildMethod'] == 0|| this.buildMethodDetails['chargesBuildMethod'] == undefined)
      {
          this.costPlusType = 1;
          this.tmchange();
      }else{
          this.costPlusType = this.buildMethodDetails['chargesBuildMethod'];
      }

      if(this.isLoadWoCharges)
      {
        this.tmchange();
      }
    
      this.chargesFlatRateBillingAmount = this.buildMethodDetails['chargesFlatBillingAmount'];
      if(this.buildMethodDetails.workOrderQuoteDetailsId !=0){
      this.disableCrg=true;
    }else{
      this.disableCrg=false;
    }
    }
    else{
      this.disableCrg=false;
    }
  }
  loadCharges(){
    this.refreshChargesWO.emit(true);
  }
  get userName(): string {
    return this.authService.currentUser ? this.authService.currentUser.userName : "";
  }

  closeAddNew() {
    this.addNewCharges = false;
    this.isEdit = false;
    this.editData = undefined;
  }
  createNew() {
    this.isEdit = false;
    this.editData = undefined;
    this.addNewCharges = true;
    this.workFlowObject.charges = [{}];
    this.workFlowObject.charges[0]['taskId']="";
    // if (this.taskList) {
    //   this.taskList.forEach(
    //     task => {
    //       if (task.description == "Assemble") {
    //         this.workFlowObject.charges[0]['taskId'] = task.taskId;
    //       }
    //     }
    //   )
    // }
  }
  edit(rowData, mainInd, subInd) {
    rowData.workflowChargeTypeId = rowData.chargesTypeId;
    // rowData.refNum = rowData.referenceNo;
    this.mainEditingIndex = mainInd;
    this.subEditingIndex = subInd;
    this.createNew();
    this.cdRef.detectChanges();
    this.isEdit = true;
    this.addNewCharges = true;
    this.editData = rowData; 
    console.log("edit dataaaa",this.editData)
    this.getTaskList();
  }
  currentRow: any = {};
  openDelete(content, row) {
    this.currentRow = row;
    this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    this.modal.result.then(() => {

    }, () => { })
  }

  dismissModel() {
    this.modal.close();
  }
  delete() {
    if (this.isQuote) {
      this.currentRow.isDeleted = true;
      this.modal.close();
      this.isEdit = false;
      this.disableCrg=false;
      //this.refreshData.emit();
      // this.workOrderChargesList[i].isDeleted = true;
    } else {
      const chargesId = this.isSubWorkOrder == true ? this.currentRow.subWorkOrderChargesId : this.currentRow.workOrderChargesId;
      this.workOrderService.deleteWorkOrderChargesByChargesId(chargesId, this.userName, this.isSubWorkOrder).subscribe(res => {
        this.refreshData.emit();
        this.alertService.showMessage(
          '',
          'Deleted WorkOrder Charges Successfully',
          MessageSeverity.success
        );
        this.modal.close();
      })
    }
    this.disableCrg=false;
  }
  calculatebCost(value,currentObj): void {
    setTimeout(() => {
      currentObj.billingAmount = value ? formatNumberAsGlobalSettingsModule(value, 2) : '0.00';
    }, 500);
  }
  getDeleteListByStatus(value) {
    if (value == true) {
      this.currentDeletedstatus = true;
    } else {
      this.currentDeletedstatus = false;
    }
    this.saveChargesListDeletedStatus.emit(this.currentDeletedstatus);
  }
  restoreRecord() {
    const table= this.isSubWorkOrder ? 'SubWorkOrderCharges':'WorkOrderCharges';
    const columnId=this.isSubWorkOrder ? 'SubWorkOrderChargesId':'WorkOrderChargesId';
    const currentId=this.isSubWorkOrder ? this.restorerecord.subWorkOrderChargesId :this.restorerecord.workOrderChargesId
    this.commonService.updatedeletedrecords(table, columnId, currentId).subscribe(res => {
      this.saveChargesListDeletedStatus.emit(this.currentDeletedstatus);
      this.modal.close();
      this.alertService.showMessage("Success", `Record was Restored Successfully.`, MessageSeverity.success);
    });
  }
  restorerecord: any = {};
  historyData: any = [];
  restore(content, rowData) {
    this.restorerecord = rowData;
    this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
  }
  getAuditHistoryById(rowData) {
    if(this.isQuote){
      if(rowData.workOrderQuoteChargesId){
      this.workOrderService.getquoteChargesHistory(rowData.workOrderQuoteChargesId).subscribe(res => {
        this.historyData = res
      //   this.historyData = res.forEach(element => {
      //     element.billingAmount=element.billingAmount ?  formatNumberAsGlobalSettingsModule(element.billingAmount, 2) : '0.00';
      //     element.billingRate=element.billingRate ?  formatNumberAsGlobalSettingsModule(element.billingRate, 2) : '0.00';
      //     element.markUp=element.markUp ?  formatNumberAsGlobalSettingsModule(element.markUp, 2) : '0.00';
      //     element.unitCost=element.unitCost ?  formatNumberAsGlobalSettingsModule(element.unitCost, 2) : '0.00';
      //     element.extendedCost=element.extendedCost ?  formatNumberAsGlobalSettingsModule(element.extendedCost, 2) : '0.00';
      // });
      this.auditHistoryHeaders=this.auditHistoryQuoteHeaders;
  this.triggerHistory();
      })
    }else{
      this.historyData = [];
      this.auditHistoryHeaders=this.auditHistoryQuoteHeaders;
      this.triggerHistory();
    }

    }else{
      this.workOrderService.getChargesHistory(this.isSubWorkOrder, this.isSubWorkOrder == true ? rowData.subWorkOrderChargesId : rowData.workOrderChargesId).subscribe(res => {
        this.historyData = res.reverse();
        this.historyData.forEach(element => {
          element.billingAmount=element.billingAmount ?  formatNumberAsGlobalSettingsModule(element.billingAmount, 2) : '0.00';
          element.billingRate=element.billingRate ?  formatNumberAsGlobalSettingsModule(element.billingRate, 2) : '0.00';
          element.markUp=element.markUp ?  formatNumberAsGlobalSettingsModule(element.markUp, 2) : '0.00';
          element.unitCost=element.unitCost ?  formatNumberAsGlobalSettingsModule(element.unitCost, 2) : '0.00';
          element.extendedCost=element.extendedCost ?  formatNumberAsGlobalSettingsModule(element.extendedCost, 2) : '0.00';
      });
        this.auditHistoryHeaders=this.auditHistoryHeaders;
  this.triggerHistory();
      })
    }


  }
  triggerHistory(){

  this.modal = this.modalService.open(AuditComponentComponent, { size: 'lg', backdrop: 'static', keyboard: false,windowClass: 'assetMange' });
    this.modal.componentInstance.auditHistoryHeader = this.auditHistoryHeaders;
    this.modal.componentInstance.auditHistory = this.historyData;

  }
  saveChargesList(event) {

    event['charges'].forEach(
      x => {
        x.billingAmount = Number(x.extendedCost.toString().split(',').join('')).toFixed(2);
        x.billingMethodId=this.costPlusType? this.costPlusType :0;
        x.markupPercentageId= this.overAllMarkup ? this.overAllMarkup : 0;
        x.chargesTypeId= x.workflowChargeTypeId;
      }
    )
    this.saveChargesListForWO.emit(event);
    $('#addNewCharges').modal('hide');
      this.disableCrg=false;
    
  setTimeout(() => {
    this.getValidCrg()
  }, 2000);
  }

  updateChargesList(event) {
    this.disableCrg=false;
    if (this.isQuote && this.isEdit) {
      event.charges[0].chargesTypeId=event.charges[0].workflowChargeTypeId;
      this.workOrderChargesList[this.mainEditingIndex][this.subEditingIndex] = event.charges[0];

      this.markupChanged(this.workOrderChargesList[this.mainEditingIndex][this.subEditingIndex],'row')
      $('#addNewCharges').modal('hide');
      this.isEdit = false;
    }
    else {
      this.updateChargesListForWO.emit(event);
      $('#addNewCharges').modal('hide');
      this.isEdit = false;
    }
    setTimeout(() => {
      this.getValidCrg()
    }, 2000);
  }

  getTaskName(id) {
    let result = '';
    this.taskList.forEach(
      x => {
        if (id == x.taskId) {
          result = x.description;
        }
      }
    )
    return result;
  }

  createChargeQuote() {
    let WorkOrderQuoteTask = [];
    this.workOrderChargesList.forEach(
      (taskCharge) => {
        this.taskList.forEach(
          (task) => {
            if (task.taskId == taskCharge[0].taskId) {
              WorkOrderQuoteTask.push(
                {
                  "WorkOrderQuoteTaskId": 0,
                  "TaskId": task.taskId,
                  "ChargesCost": this.getTotalTaskUnitCost(taskCharge),
                  "ChargesBilling": this.getTotalTaskBillingAmount(taskCharge),
                  "ChargesRevenue": this.getTotalTaskBillingAmount(taskCharge),
                  "masterCompanyId": this.authService.currentUser.masterCompanyId,
                  "CreatedBy": this.userName,
                  "UpdatedBy": this.userName,
                  "CreatedDate": new Date().toDateString(),
                  "UpdatedDate": new Date().toDateString(),
                  "IsActive": true,
                  "IsDeleted": false
                }
              )
            }
          }
        )
      }
    )
    let temp = this.workOrderChargesList;
    let sendData = []
    for (let index = 0; index < temp.length; index++) {
      sendData = [...sendData, ...temp[index]];

    }
    sendData = sendData.map(charge => {
      return { ...charge, markupFixedPrice: this.costPlusType, headerMarkupId: Number(this.overAllMarkup) }
    })
    let result = { 'data': sendData, 'taskSum': WorkOrderQuoteTask, 'chargesFlatRateBillingAmount': this.chargesFlatRateBillingAmount, 'ChargesBuildMethod': this.costPlusType }
    this.createQuote.emit(result);

    this.buildMethodDetails['chargesBuildMethod'] =this.costPlusType;
    this.buildMethodDetails['chargesFlatBillingAmount']=this.chargesFlatRateBillingAmount;

    this.disableCrg=true;
  }

  markupChanged(matData, type) {
    try {
      this.markupList.forEach((markup) => {
        if (type == 'row' && markup.value == matData.markupPercentageId) {
          matData['billingRate'] = formatNumberAsGlobalSettingsModule((Number(matData['unitCost'].toString().split(',').join(''))) + ((Number(matData['unitCost'].toString().split(',').join('')) / 100) * Number(markup.label)), 2);
          matData['billingAmount'] = formatNumberAsGlobalSettingsModule(Number(matData['billingRate'].toString().split(',').join('')) * Number(matData.quantity), 2);

        }
        else if (type == 'all' && markup.value == this.overAllMarkup) {
          this.workOrderChargesList.forEach((data) => {
            data.forEach((mData) => {
              if (mData.billingMethodId && Number(mData.billingMethodId) == 1) {
                mData.markupPercentageId = this.overAllMarkup;
                mData['billingRate'] = formatNumberAsGlobalSettingsModule(Number(mData['unitCost'].toString().split(',').join('')) + ((Number(mData['unitCost'].toString().split(',').join('')) / 100) * Number(markup.label)), 2);
                mData['billingAmount'] = formatNumberAsGlobalSettingsModule(Number(mData['billingRate'].toString().split(',').join('')) * Number(mData.quantity), 2);
              
              }
            })
          })
        }
      })
    }
    catch (e) {
    }
  }

  tmchange() {
    let billingMethodId = Number(this.costPlusType);
    for (let mData of this.workOrderChargesList) {
      mData.forEach(
        (x) => {
          x.billingMethodId = (billingMethodId == 3) ? '' : billingMethodId;
          x.markupPercentageId = '';
          x.billingRate = x.unitCost;
          x.billingAmount = x.extendedCost;
          // if (this.costPlusType == 3) {
          //   x.billingAmount = 0.00;
          //   this.chargesFlatRateBillingAmount = 0.00;
          // }
          if (Number(this.costPlusType) == 1) {
            this.overAllMarkup = '';
          }
        }
      )
    }

    this.getTotalBillingAmount();
  }

  getTotalQuantity() {
    let totalQuantity = 0;
    if (this.workOrderChargesList) {
      this.workOrderChargesList.forEach(
        (material) => {
          totalQuantity += this.getTotalTaskQuantity(material);
        }
      )
    }
    return totalQuantity
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
    return totalQuantity
  }

  getTotalUnitCost() { 
    let total = 0;
    if (this.workOrderChargesList) {
      this.workOrderChargesList.forEach(
        (material) => {
          total += Number(this.getTotalTaskUnitCost(material).toString().split(',').join(''));
        }
      )
    }
    const newTotal = total ? formatNumberAsGlobalSettingsModule(total, 2) : '0';
    return newTotal;
  }
  parsedText(text) {
    if (text) {
      const dom = new DOMParser().parseFromString(
        '<!doctype html><body>' + text,
        'text/html');
      const decodedString = dom.body.textContent;
      return decodedString;
    }
  }
  getTotalTaskUnitCost(tData) {
    let total = 0;
    if (tData) {
     
      tData.forEach(
        (material) => {
          if (material.extendedCost && !material.isDeleted) {
            total +=parseFloat(material.extendedCost)
            // total +=   parseFloat(material.extendedCost.toString().replace(/\,/g, ''));
            // total += Number(material.extendedCost.toString().split(',').join(''));
          }
        }
      )
    } 
    const newTotal = total ? formatNumberAsGlobalSettingsModule(total, 0) : '0.00';
    return total.toFixed(2);
  }

  getTotalTaskUnitCost1(tData) {
    let total = 0;
    if (tData) {
     
      tData.forEach(
        (material) => {
          if (material.extendedCost && !material.isDeleted) {
            // total +=parseFloat(material.extendedCost)
            total +=   parseFloat(material.extendedCost.toString().replace(/\,/g, ''));
            // total += Number(material.extendedCost.toString().split(',').join(''));
          }
        }
      )
    } 
    const newTotal = total ? formatNumberAsGlobalSettingsModule(total, 2) : '0.00';
    return total ? formatNumberAsGlobalSettingsModule(total, 2) : '0.00';
  }
  getTotalBillingRate() {
    let total = 0;
    if (this.workOrderChargesList) {
      this.workOrderChargesList.forEach(
        (material) => {
          if (material.billingRate && !material.isDeleted) {
            total += Number(material.billingRate.toString().split(',').join(''));
          }
        }
      )
    }
    return total ? formatNumberAsGlobalSettingsModule(total, 0) : '0.00';
  }
  getTotalBillingAmount() {
    let total = 0;
    if (this.workOrderChargesList) {
      this.workOrderChargesList.forEach(
        (material) => {
          total += Number(this.getTotalTaskBillingAmount(material).toString().split(',').join(''));
        }
      )
    }
    this.chargesFlatRateBillingAmount = total ? formatNumberAsGlobalSettingsModule(total, 2) : '0.00';
    const newTotal = total ? formatNumberAsGlobalSettingsModule(total, 2) : '0.00';
    return newTotal;
  }

  getTotalTaskBillingAmount(tData) {
    let total = 0;
    if (tData) {
      tData.forEach(
        (material) => {
          if (material.billingAmount && !material.isDeleted) {
            total += Number(material.billingAmount.toString().split(',').join(''));
          }
        }
      )
    }
    const newTotal = total ? formatNumberAsGlobalSettingsModule(total, 2) : '0.00';

    return newTotal;
  }

  getRONumberList() {
    if (this.roNumList && this.roNumList.length == 0) {
      this.commonService.smartDropDownList('RepairOrder', 'RepairOrderId', 'RepairOrderNumber')
        .subscribe(
          (res: any[]) => {
            this.roNumList = res;
          }
        )
    }
  }

  formateCurrency(value) {
    return value ? formatNumberAsGlobalSettingsModule(value, 2) : '0.00';
  }
  getPageCount(totalNoofRecords, pageSize) {
    return Math.ceil(totalNoofRecords / pageSize)
  }
  pageIndexChange(event) {
    this.pageSize = event.rows;
  }
  disableCrg:boolean=false;
  getValidCrg(){
      this.disableCrg=false;
  }
  setEditArray:any=[];
  taskList:any=[];
  getTaskList() {  
    this.setEditArray=[]; 
    // console.log("taskId edit data",this.editData)
    // this.isEdit = true;
    // this.addNewCharges = true; 
    if(this.isEdit){
      this.setEditArray.push(this.editData.taskId ? this.editData.taskId : 0);
    }else{
      this.setEditArray.push(0)
    }
    const strText = '';
    this.commonService.autoSuggestionSmartDropDownList('Task', 'TaskId', 'Description', strText, true,  0, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
     this.taskList = res.map(x => {
            return {
                id: x.value,
                description: x.label.toLowerCase(),
                taskId: x.value,
                label:x.label.toLowerCase(),
            }
        });

    },
        err => {
            // this.handleError(err);
        })
}
}