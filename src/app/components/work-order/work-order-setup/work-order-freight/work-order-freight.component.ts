import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, OnChanges, ViewEncapsulation } from '@angular/core';
declare var $ : any;
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { AuthService } from '../../../../services/auth.service';
import { Freight } from '../../../../models/work-order-freight.model';
import { editValueAssignByCondition, getValueFromArrayOfObjectById, formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { CommonService } from '../../../../services/common.service';
import { getModuleIdByName } from '../../../../generic/enums';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditComponentComponent } from '../../../../shared/components/audit-component/audit-component.component';
@Component({
    selector: 'app-work-order-freight',
    templateUrl: './work-order-freight.component.html',
    styleUrls: ['./work-order-freight.component.css'],
    encapsulation: ViewEncapsulation.None
}) 
export class WorkOrderFreightComponent implements OnInit, OnChanges {
    @Input() workOrderFreightList;
    @Input() freightForm;
    @Input() savedWorkOrderData;
    @Output() saveFreightListForWO = new EventEmitter();
    @Output() updateFreightListForWo = new EventEmitter();
    @Output() refreshData = new EventEmitter();
    @Output() saveFreightsListDeletedStatus = new EventEmitter();
    @Input() view: boolean = false;
    @Input() subWorkOrderDetails;
    @Input() isWorkOrder;
    @Input() isQuote = false;
    @Input() markupList;
    @Input() isView: boolean = false;
    @Input() taskList: any = [];
    @Input() buildMethodDetails: any = {};
    @Input() isSubWorkOrder:any=false;
    @Input() subWOPartNoId;
    customerId: any;
    shipViaList: any;
    carrierList: any;
    mainEditingIndex: any;
    subEditingIndex: any;
    overAllMarkup: any;
    costPlusType: number = 0;
    modal: NgbModalRef;
    cols = [
        { field: 'shipVia', header: 'Ship Via',isRequired:true },
        { field: 'weight', header: 'Weight' ,isRequired:false},
        { field: 'uom', header: 'UOM',isRequired:false },
    ]

    auditHistoryHeaders = [
        { field: 'taskName', header: 'Task',isRequired:false },
        { field: 'shipVia', header: 'Ship Via',isRequired:true },
        { field: 'weight', header: 'Gl Account Name',isRequired:false },
        { field: 'uom', header: 'Description',isRequired:false },
        { field: 'length', header: 'Qty',isRequired:false },
        { field: 'height', header: 'Ref Num',isRequired:false },
        { field: 'width', header: 'Unit Cost',isRequired:false },
        { field: 'dimensionUOM', header: 'Extented Cost',isRequired:false },
        { field: 'currency', header: 'Vendor Name',isRequired:false },
        { field: 'amount', header: 'Vendor Name',isRequired:true },
        { field: 'memo', header: 'Vendor Name',isRequired:false },
        { field: 'isDeleted', header: 'Is Deleted',isRequired:false },
        { field: 'createdDate', header: 'Created Date',isRequired:false },
        { field: 'createdBy', header: 'Created By',isRequired:false },
        { field: 'updatedDate', header: 'Updated Date',isRequired:false },
        { field: 'updatedBy', header: 'Updated By',isRequired:false },
      ]
    isEdit: boolean = false;
    unitOfMeasureList: any = [];
    currencyList: any = [];
    workOrderFreightLists: any;
    freightFlatBillingAmount: any;
    currentDeletedstatus:boolean=false;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number = 0;
    pageSize: number = 10;
    constructor(private workOrderService: WorkOrderService,
        private authService: AuthService,
        private alertService: AlertService,
        private commonService: CommonService,private modalService: NgbModal,
        private cdRef: ChangeDetectorRef) {
    }
    ngOnInit() {
        if (this.freightForm) {
            this.freightForm = [...this.freightForm, new Freight()];
        }
        this.customerId = editValueAssignByCondition('customerId', this.savedWorkOrderData.customerId);
        this.getShipViaByCustomerId();
        this.getUOMList('');
        this.getCurrencyList('');
        this.getCarrierList();
        if (this.workOrderFreightList && this.workOrderFreightList.length > 0 && this.workOrderFreightList[0].headerMarkupId) {
            this.costPlusType = this.workOrderFreightList[0].markupFixedPrice;
            this.overAllMarkup = Number(this.workOrderFreightList[0].headerMarkupId);
        }
        if(this.buildMethodDetails){
            this.costPlusType = this.buildMethodDetails['freightBuildMethod'];
            if(this.buildMethodDetails['freightFlatBillingAmount']){
                this.freightFlatBillingAmount = this.formateCurrency(this.buildMethodDetails['freightFlatBillingAmount']);
            }
        }
    }
    ngOnChanges() {
        if (this.workOrderFreightList && this.workOrderFreightList.length > 0 && this.workOrderFreightList[0].headerMarkupId) {
            this.costPlusType = this.workOrderFreightList[0].markupFixedPrice;
            this.overAllMarkup = Number(this.workOrderFreightList[0].headerMarkupId);
        }
        if(this.workOrderFreightList){
            this.workOrderFreightLists = this.workOrderFreightList.reduce(function (r, a) {
              r[a.taskId] = r[a.taskId] || [];
              r[a.taskId].push(a);
              return r;
            }, Object.create(null));
            this.workOrderFreightList = [];
            for(let x in this.workOrderFreightLists){
              this.workOrderFreightList.push(this.workOrderFreightLists[x]);
            }
            if (this.workOrderFreightList && this.workOrderFreightList.length > 0) {
                this.totalRecords = this.workOrderFreightList.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            } else {
                this.totalRecords = 0;
                this.totalPages = 0;
            }
        }
        if(this.buildMethodDetails){
            this.costPlusType = this.buildMethodDetails['freightBuildMethod'];
            if(this.buildMethodDetails['freightFlatBillingAmount']){
                this.freightFlatBillingAmount = this.formateCurrency(this.buildMethodDetails['freightFlatBillingAmount']);
            }
        }
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    onFilterUomAction(value){
        this.getUOMList(value)
    }
    setEditArray:any=[];
    private getUOMList(value) { 
        this.setEditArray=[];
        if(this.isEdit==true){
            this.freightForm.forEach(element => {
            if(element.uomId){
                this.setEditArray.push(element.uomId); 
            }
            if(element.dimensionUOMId){
                this.setEditArray.push(element.dimensionUOMId); 
            }
            });
        }else{
            this.setEditArray.push(0);
        }
            const strText= value ? value:'';
        this.commonService.autoSuggestionSmartDropDownList('UnitOfMeasure', 'UnitOfMeasureId', 'ShortName',strText,true,20,this.setEditArray.join()).subscribe(res => {
            this.unitOfMeasureList = res;
        },err => {			
    })
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
    onFilterAction(value){
        this.getCurrencyList(value)
    }
    private getCurrencyList(value) {
 
        this.setEditArray=[];
        if(this.isEdit==true){
            this.freightForm.forEach(element => {
            if(element.currencyId){
                this.setEditArray.push(element.currencyId); 
            }
            });
        }else{
            this.setEditArray.push(0);
        }
            const strText= value ? value:'';
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code',strText,true,20,this.setEditArray.join()).subscribe(res => {
            this.currencyList = res;
        },err => {			
    })
}
    getCarrierList() {
        this.commonService.smartDropDownList('Carrier', 'CarrierId', 'Description').subscribe(res => {
            this.carrierList = res;
        })
    }
    getShipViaByCustomerId() {
     this.commonService.getShipViaDetailsByModule(getModuleIdByName('Customer'), this.subWorkOrderDetails ? this.subWorkOrderDetails.customerId : this.customerId).subscribe(res => {
            this.shipViaList = res.map(x => {
                return {
                    label: x.name,
                    value: x.shippingViaId
                }
            });
        })
    }
    createNew() { 
        this.isEdit = false;
        let newFreight = new Freight();
        newFreight.isShowDelete=false;
        newFreight.amount = this.formateCurrency(newFreight.amount);
        const taskId = this.taskList.filter(x => x.description.toLowerCase() == 'shipping');
        console.log("taskId",taskId)
        newFreight = { ...newFreight, taskId: taskId[0].taskId }
        this.freightForm = [newFreight];

    }
    addNewRow() { 
        let newFreight = new Freight();
        const taskId = this.taskList.filter(x => x.description === 'shipping');
        console.log("taskId",taskId)
        newFreight = { ...newFreight, taskId: taskId[0].taskId }
        this.freightForm = [...this.freightForm, newFreight];
    }
    disableUpdate:boolean=true;
    edit(rowData, mainIndex, subIndex) {
        this.mainEditingIndex = mainIndex;
        this.subEditingIndex = subIndex;
        this.isEdit = true;
        rowData.amount=rowData.amount? this.formateCurrency( rowData.amount) : '0.00';
        this.freightForm = [rowData];
        this.getCurrencyList('');
       this.getUOMList('');
       this.disableUpdate=true;
    }
    checkAmount(){
        var result = false;
        for (let data in this.freightForm) {
          this.freightForm.forEach(
            data => {
              if (data.amount <= 0 ) {
                result = true; 
              }
            }
          )
        }
        return result;
      }
    getActive(){
        this.disableUpdate=false;
    }
    deleteRow(index): void {
        if (this.freightForm[index].workOrderFreightId == undefined || this.freightForm[index].workOrderFreightId == "0" || this.freightForm[index].workOrderFreightId == "") {
            this.freightForm.splice(index, 1);
        }
        else {
            this.freightForm.isDelete = true;
        }
    }
    memoIndex;
    onAddTextAreaInfo(material, index) {
        this.memoIndex = index;
        this.textAreaInfo = material.memo;
    }
    textAreaInfo: any;
    onSaveTextAreaInfo(memo) {
        if (memo) {
            this.textAreaInfo = memo;
            this.freightForm[this.memoIndex].memo = this.textAreaInfo;
            this.disableUpdate=false;
        }
        $("#textarea-popupFreight").modal("hide");
    }
    onCloseTextAreaInfo() {
        $("#textarea-popupFreight").modal("hide");
    }
    saveFreightList() {
        if (!this.isQuote) {
            if (this.isEdit) {
                // if(this.isQuote){
                //     this.saveFreightListForWO.emit(this.freightForm);
                //     $('#addNewFreight').modal('hide');
                //     this.isEdit = false;
                // }
                // else{

                this.updateFreightListForWo.emit(this.freightForm);
                $('#addNewFreight').modal('hide');
                this.isEdit = false;
                // }
            } else {
                this.saveFreightListForWO.emit(this.freightForm);
                $('#addNewFreight').modal('hide');
            }
        }
        else {
            // for Quote Save and Update
            this.freightForm = this.freightForm.map(x => {
                return {
                    ...x,
                    uom: x.uomId ? getValueFromArrayOfObjectById('label', 'value', x.uomId, this.unitOfMeasureList) : '',
                    dimensionUOM: x.dimensionUOMId ? getValueFromArrayOfObjectById('label', 'value', x.dimensionUOMId, this.unitOfMeasureList) : '',
                    currency: x.currencyId ? getValueFromArrayOfObjectById('label', 'value', x.currencyId, this.currencyList) : '',
                    billingAmount: this.formateCurrency(x.amount),
                    billingMethodId:this.costPlusType? this.costPlusType :0,
                    markupPercentageId: this.overAllMarkup ? this.overAllMarkup : 0,
                    // currency: x.currencyId ? getValueFromArrayOfObjectById('label', 'value', x.currencyId, this.currencyList) : '',
                }
            });
            if (this.isEdit) {
                this.workOrderFreightList[this.mainEditingIndex][this.subEditingIndex] = this.freightForm[0];
                $('#addNewFreight').modal('hide');
                this.isEdit = false;
            }
            else {    
                let temp = [];
                this.workOrderFreightList.forEach((x)=>{
                    temp = [...temp, ...x];
                })
                temp = [...temp, ...this.freightForm];

                this.workOrderFreightLists = temp.reduce(function (r, a) {
                    r[a.taskId] = r[a.taskId] || [];
                    r[a.taskId].push(a);
                    return r;
                }, Object.create(null));
                this.workOrderFreightList = [];
                for(let x in this.workOrderFreightLists){
                   this.workOrderFreightList.push(this.workOrderFreightLists[x]);
                }
                $('#addNewFreight').modal('hide');
            }
        }
    }

    createFreightsQuote() {
        let WorkOrderQuoteTask = [];
        this.workOrderFreightList.forEach(
          (taskCharge)=>{
            this.taskList.forEach(
              (task)=>{
                if(task.taskId == taskCharge[0].taskId){
                  WorkOrderQuoteTask.push(
                    {
                      "WorkOrderQuoteTaskId":0,
                      "TaskId":task.taskId,
                      "taskName":task.description ? task.description :task.label,
                      "FreightCost":this.getTotalTaskAmount(taskCharge),
                      "FreightBilling":this.getTotalTaskBillingAmount(taskCharge),
                      "FreightRevenue":this.getTotalTaskBillingAmount(taskCharge),
                      "masterCompanyId":this.authService.currentUser.masterCompanyId,
                      "CreatedBy":"admin",
                      "UpdatedBy":"admin",
                      "CreatedDate":new Date().toDateString(),
                      "UpdatedDate":new Date().toDateString(),
                      "IsActive":true,
                      "IsDeleted":false,
                 
                    }
                  )
                }
              }
            )
          }
        )

        let temp = this.workOrderFreightList;
        let sendData = []
        for (let index = 0; index < temp.length; index++) {
            sendData = [...sendData, ...temp[index]];
        }
        sendData = sendData.map((f) => {
            return { ...f, headerMarkupId: Number(this.overAllMarkup), markupFixedPrice: this.costPlusType }
        })
        let result = {'data': sendData, 'taskSum': WorkOrderQuoteTask, 'freightFlatBillingAmount': this.formateCurrency(this.freightFlatBillingAmount), 'FreightBuildMethod': this.costPlusType}
      console.log("emitzz")
        this.saveFreightListForWO.emit(result);
    }
    currentRow:any={};
    openDelete(content, row) {
  this.currentRow=row;
      this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
      this.modal.result.then(() => { 
      }, () => {  })
  }
  dismissModel() {
    this.modal.close();
  }
    delete() {
        if (this.isQuote) {
            this.currentRow.isDeleted = true;
            $('#addNewFreight').modal('hide');
            this.isEdit = false;
        }
        else {
            const workOrderFreightId  = this.isSubWorkOrder ? this.currentRow.subWorkOrderFreightId :this.currentRow.workOrderFreightId;
            this.workOrderService.deleteWorkOrderFreightList(workOrderFreightId, this.userName,this.isSubWorkOrder).subscribe(res => {
                this.refreshData.emit();
                this.alertService.showMessage(
                    '',
                    'Deleted WorkOrder Freight Successfully',
                    MessageSeverity.success
                );
            })
        }
        this.modal.close();
    }
    markupChanged(matData, type) {
        try {
            this.markupList.forEach((markup) => {
                if (type == 'row' && markup.value == matData.markupPercentageId) {
                    matData.billingAmount = this.formateCurrency(Number(matData.amount.toString().replace(/\,/g,'')) + ((Number(matData.amount.toString().replace(/\,/g,'')) / 100) * Number(markup.label)))
                }
                else if (type == 'all' && markup.value == this.overAllMarkup) {
                    this.workOrderFreightList.forEach((data) => {
                        data.forEach(
                            (mData)=>{
                                if (mData.billingMethodId && Number(mData.billingMethodId) == 1) {
                                    mData.markupPercentageId = Number(this.overAllMarkup);
                                    mData.billingAmount = this.formateCurrency(Number(mData.amount.toString().replace(/\,/g,'')) + ((Number(mData.amount.toString().replace(/\,/g,'')) / 100) * Number(markup.label)));
                                }
                            }
                        )
                    })
                }
            })
        }
        catch (e) {
        }
    }

    tmchange() {
        for (let mData of this.workOrderFreightList) {
            mData.forEach(
              (x)=>{
                x.billingMethodId = this.costPlusType;
                x.markupPercentageId = '';
                x.billingAmount = this.formateCurrency(Number(x.amount.toString().replace(/\,/g,'')));
                if(this.costPlusType == 3){
                    x.billingAmount = '0.00';
                    this.freightFlatBillingAmount = '0.00';
                }
                if(Number(this.costPlusType) == 1){
                    this.overAllMarkup = '';
                }
              }
            )
        }
    }

    getTotalAmount() {
        let total = 0;
        if (this.workOrderFreightList) {
            this.workOrderFreightList.forEach(
                (material) => {
                        total += Number(this.getTotalTaskAmount(material));
                }
            )
        }
        return this.formateCurrency(total);
    }

    getTotalTaskAmount(tData) {
        let total = 0;
        if (tData) {
            tData.forEach(
                (material) => {
                    if (material.amount) {
                        total += Number(material.amount.toString().replace(/\,/g,''));
                    }
                }
            )
        }
        return total.toFixed(2);
    }

    //   getTotalBillingRate() {
    //     let total = 0;
    //     if(this.workOrderFreightList){
    //       this.workOrderFreightList.forEach(
    //         (material) => {
    //           if (material.billingRate) {
    //             total += Number(material.billingRate);
    //           }
    //         }
    //       )
    //     }
    //     return total;
    //   }

    getTotalBillingAmount() {
        let total = 0;
        if (this.workOrderFreightList) {
            this.workOrderFreightList.forEach(
                (material) => {
                        total += Number(this.getTotalTaskBillingAmount(material));
                }
            )
        }
        this.freightFlatBillingAmount = total.toFixed(2);
        return this.formateCurrency(total);
    }

    getTotalTaskBillingAmount(tData) {
        let total = 0;
        if (tData) {
            tData.forEach(
                (material) => {
                    if (material.billingAmount && !material.isDeleted) {
                        total += Number(material.billingAmount.toString().replace(/\,/g,''));
                    }
                }
            )
        }
        return total.toFixed(2);
    }

    formateCurrency(amount){
        return amount ? formatNumberAsGlobalSettingsModule(amount, 2) : '0.00';
    }
    getDeleteListByStatus(value) {
        if (value == true) {
         this.currentDeletedstatus = true;
       } else {
            this.currentDeletedstatus = false;
       }
       this.saveFreightsListDeletedStatus.emit(this.currentDeletedstatus);
    }
    restoreRecord() {
      this.commonService.updatedeletedrecords('WorkOrderFreight', 'WorkOrderFreightId', this.restorerecord.workOrderFreightId).subscribe(res => {
        this.saveFreightsListDeletedStatus.emit(this.currentDeletedstatus);
          this.modal.close();
          this.alertService.showMessage("Success", `Record was Restored Successfully.`, MessageSeverity.success);
      });
    }
    
    restorerecord:any={};
    restore(content, rowData) {
      this.restorerecord = rowData;
      this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    pageIndexChange(event) {
      this.pageSize = event.rows;
    }
    historyData: any = [];
    getAuditHistoryById(rowData) {
        this.workOrderService.getFreightHistory(this.isSubWorkOrder, this.isSubWorkOrder == true ? rowData.subWorkOrderFreightId : rowData.workOrderFreightId).subscribe(res => {
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
}