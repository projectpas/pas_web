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
  @Input() markupList;
  @Output() saveChargesListForWO = new EventEmitter();
  @Output() saveChargesListDeletedStatus = new EventEmitter();

  @Output() updateChargesListForWO = new EventEmitter();
  @Output() refreshData = new EventEmitter();
  @Output() createQuote = new EventEmitter();
  @Input() isView: boolean = false;
  @Input() taskList: any = [];
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
    { field: 'chargeType', header: 'Charge Type' ,isRequired:true},
    { field: 'glAccountName', header: 'Gl Account Name',isRequired:false },
    { field: 'description', header: 'Description',isRequired:false },
    { field: 'quantity', header: 'Qty',isRequired:true },
    { field: 'refNum', header: 'Ref Num',isRequired:false },
    { field: 'unitCost', header: 'Unit Cost',isRequired:true },
    { field: 'extendedCost', header: 'Extented Cost',isRequired:false },
    { field: 'vendorName', header: 'Vendor Name',isRequired:false },
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

  constructor(private workOrderService: WorkOrderService, private authService: AuthService,
    private alertService: AlertService, private modalService: NgbModal, private cdRef: ChangeDetectorRef, private commonService: CommonService) {


  }

  ngOnChanges() {
    if (this.workOrderChargesList && this.workOrderChargesList.length > 0 && this.workOrderChargesList[0].headerMarkupId) {
      this.costPlusType = Number(this.workOrderChargesList[0].markupFixedPrice);
      this.overAllMarkup = this.workOrderChargesList[0].headerMarkupId;
    }
    if (this.workOrderChargesList) {
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
      this.costPlusType = this.buildMethodDetails['chargesBuildMethod'];
      this.chargesFlatRateBillingAmount = this.buildMethodDetails['chargesFlatBillingAmount'];
    }
  }
  ngOnInit() {
    this.getRONumberList();
    if (this.workOrderChargesList && this.workOrderChargesList.length > 0 && this.workOrderChargesList[0].markupFixedPrice) {
      this.costPlusType = Number(this.workOrderChargesList[0].markupFixedPrice);
      this.overAllMarkup = this.workOrderChargesList[0].headerMarkupId;
    }
    // if (!this.isQuote) {
    //   this.cols = [...this.cols, { field: 'extendedPrice', header: 'Extended Price' }, { field: 'unitPrice', header: 'Unit Price' },]
    // }
    if (this.buildMethodDetails) {
      this.costPlusType = this.buildMethodDetails['chargesBuildMethod'];
      this.chargesFlatRateBillingAmount = this.buildMethodDetails['chargesFlatBillingAmount'];
    }
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
    if (this.taskList) {
      this.taskList.forEach(
        task => {
          if (task.description == "Assemble") {
            this.workFlowObject.charges[0]['taskId'] = task.taskId;
          }
        }
      )
    }
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
    this.commonService.updatedeletedrecords('WorkOrderCharges', 'WorkOrderChargesId', this.restorerecord.workOrderChargesId).subscribe(res => {
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
    this.workOrderService.getChargesHistory(this.isSubWorkOrder, this.isSubWorkOrder == true ? rowData.subWorkOrderChargesId : rowData.workOrderChargesId).subscribe(res => {
      this.historyData = res.reverse();
      this.auditHistoryHeaders=this.auditHistoryHeaders;
      // this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
   
      this.modal = this.modalService.open(AuditComponentComponent, { size: 'lg', backdrop: 'static', keyboard: false,windowClass: 'assetMange' });
      this.modal.componentInstance.auditHistoryHeader = this.auditHistoryHeaders;
      this.modal.componentInstance.auditHistory = this.historyData;
      
      this.modal.result.then(() => {
      }, () => { })
    })

  }
  saveChargesList(event) {
    event['charges'].forEach(
      x => {
        x.billingAmount = Number(x.extendedCost.toString().split(',').join('')).toFixed(2);
      }
    )
    this.saveChargesListForWO.emit(event);
    $('#addNewCharges').modal('hide');
  }

  updateChargesList(event) {
    if (this.isQuote && this.isEdit) {
      this.workOrderChargesList[this.mainEditingIndex][this.subEditingIndex] = event.charges[0];
      $('#addNewCharges').modal('hide');
      this.isEdit = false;
    }
    else {
      this.updateChargesListForWO.emit(event);
      $('#addNewCharges').modal('hide');
      this.isEdit = false;
    }
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
                  "CreatedBy": "admin",
                  "UpdatedBy": "admin",
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
  }

  markupChanged(matData, type) {
    try {
      this.markupList.forEach((markup) => {
        if (type == 'row' && markup.value == matData.markupPercentageId) {
          matData['billingRate'] = formatNumberAsGlobalSettingsModule((Number(matData['unitCost'].toString().split(',').join(''))) + ((Number(matData['unitCost'].toString().split(',').join('')) / 100) * Number(markup.label)), 0);
          matData['billingAmount'] = formatNumberAsGlobalSettingsModule(Number(matData['billingRate'].toString().split(',').join('')) * Number(matData.quantity), 0);
        }
        else if (type == 'all' && markup.value == this.overAllMarkup) {
          this.workOrderChargesList.forEach((data) => {
            data.forEach((mData) => {
              if (mData.billingMethodId && Number(mData.billingMethodId) == 1) {
                mData.markupPercentageId = this.overAllMarkup;
                mData['billingRate'] = formatNumberAsGlobalSettingsModule(Number(mData['unitCost'].toString().split(',').join('')) + ((Number(mData['unitCost'].toString().split(',').join('')) / 100) * Number(markup.label)), 0);
                mData['billingAmount'] = formatNumberAsGlobalSettingsModule(Number(mData['billingRate'].toString().split(',').join('')) * Number(mData.quantity), 0);
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
          x.billingRate = 0;
          x.billingAmount = x.extendedCost;
          if (this.costPlusType == 3) {
            x.billingAmount = 0.00;
            this.chargesFlatRateBillingAmount = 0.00;
          }
          if (Number(this.costPlusType) == 1) {
            this.overAllMarkup = '';
          }
        }
      )
    }
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
    const newTotal = total ? formatNumberAsGlobalSettingsModule(total, 0) : '0';
    return newTotal + '.00'
  }

  getTotalTaskUnitCost(tData) {
    let total = 0;
    if (tData) {
     
      tData.forEach(
        (material) => {
          if (material.extendedCost) {
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
    this.chargesFlatRateBillingAmount = total.toFixed(2);
    const newTotal = total ? formatNumberAsGlobalSettingsModule(total, 0) : '0';
    return newTotal + '.00'
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
    const newTotal = total ? formatNumberAsGlobalSettingsModule(total, 0) : '0';

    return newTotal + '.00';
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
    return value ? formatNumberAsGlobalSettingsModule(value, 0) : '0.00';
  }
  getPageCount(totalNoofRecords, pageSize) {
    return Math.ceil(totalNoofRecords / pageSize)
  }
  pageIndexChange(event) {
    this.pageSize = event.rows;
  }
}
