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
    isSpinnerVisible: boolean = false;
    cols = [
        { field: 'shipVia', header: 'Ship Via',isRequired:true },
        { field: 'weight', header: 'Weight' ,isRequired:false,width:"60px"},
        { field: 'uom', header: 'UOM',isRequired:false },
    ]

    auditHistoryHeaders = [
        { field: 'taskName', header: 'Task',isRequired:false },
        { field: 'shipVia', header: 'Ship Via',isRequired:true },
        { field: 'weight', header: 'Weight',isRequired:false },
        { field: 'uom', header: 'UOM',isRequired:false },
        { field: 'length', header: 'Length',isRequired:false },
        { field: 'height', header: 'Height',isRequired:false },
        { field: 'width', header: 'Width',isRequired:false },
        { field: 'dimensionUOM', header: 'Dimension UOM',isRequired:false },
        { field: 'currency', header: 'Currency',isRequired:false },
        { field: 'amount', header: 'Amount',isRequired:true },
        { field: 'isDeleted', header: 'Is Deleted',isRequired:false },
        { field: 'memo', header: 'Memo',isRequired:false },
        { field: 'createdDate', header: 'Created Date',isRequired:false },
        { field: 'createdBy', header: 'Created By',isRequired:false },
        { field: 'updatedDate', header: 'Updated Date',isRequired:false },
        { field: 'updatedBy', header: 'Updated By',isRequired:false },
      ]
      auditHistoryQuoteHeaders = [
        { field: 'taskName', header: 'Task',isRequired:false },
        { field: 'shipVia', header: 'Ship Via',isRequired:true },
        { field: 'weight', header: 'Weight',isRequired:false },
        { field: 'uom', header: 'UOM',isRequired:false },
     { field: 'length', header: 'Length',isRequired:false },
        { field: 'height', header: 'Height',isRequired:false },
        { field: 'width', header: 'Width',isRequired:false },
        { field: 'dimensionUomName', header: 'Dimension UOM',isRequired:false },
        { field: 'currency', header: 'Currency',isRequired:false },
        { field: 'amount', header: 'Amount',isRequired:true },
        { field: 'memo', header: 'Memo',isRequired:false },
        { field: 'billingName', header: 'Billing Method',isRequired:false },
        { field: 'markUp', header: 'Mark Up',isRequired:false },
        { field: 'billingAmount', header: 'Billing Amount',isRequired:false },
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
       // this.getShipViaByCustomerId();
        this.getshipvia();
        this.getUOMList('');
        this.getCurrencyList('');
        // this.getCarrierList();
        this.getTaskList();
        if (this.workOrderFreightList && this.workOrderFreightList.length > 0 && this.workOrderFreightList[0].headerMarkupId) {
            this.costPlusType = this.workOrderFreightList[0].markupFixedPrice;
            this.overAllMarkup = Number(this.workOrderFreightList[0].headerMarkupId);
        }
        if(this.buildMethodDetails){
            if(this.buildMethodDetails['freightBuildMethod'] == null || this.buildMethodDetails['freightBuildMethod'] == undefined)
            {
                this.costPlusType = 1;
            }else{
                this.costPlusType = this.buildMethodDetails['freightBuildMethod'];
            }
           
            if(this.buildMethodDetails['freightFlatBillingAmount']){
                this.freightFlatBillingAmount = this.formateCurrency(this.buildMethodDetails['freightFlatBillingAmount']);
            }
        }
    }
    originalList:any=[]
    ngOnChanges() {
        this.originalList=this.workOrderFreightList;
        // console.log("hello",this.originalList)
        // if(this.originalList && this.originalList[0] && this.originalList[0].workOrderQuoteDetailsId !=undefined){
        //     this.disableFrt=true;
        // }else{
        // }
        this.disableFrt=false;
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
        
        if(this.buildMethodDetails)
        {
            if(this.buildMethodDetails['freightBuildMethod'] == null || this.buildMethodDetails['freightBuildMethod'] == undefined)
            {
                this.costPlusType = 1;
            }else{
                this.costPlusType = this.buildMethodDetails['freightBuildMethod'];
            }
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
        this.commonService.autoSuggestionSmartDropDownList('UnitOfMeasure', 'UnitOfMeasureId', 'ShortName',strText,true,20,this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
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
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code',strText,true,20,this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.currencyList = res;
        },err => {			
    })
}
    // getCarrierList() {
    //     this.commonService.smartDropDownList('Carrier', 'CarrierId', 'Description').subscribe(res => {
    //         this.carrierList = res;
    //     })
    // }
    getShipViaByCustomerId() {
     this.commonService.getShipViaDetailsByModule(getModuleIdByName('Customer'), this.subWorkOrderDetails ? this.subWorkOrderDetails.customerId : this.customerId,this.authService.currentUser.masterCompanyId).subscribe(res => {
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

        newFreight = { ...newFreight, taskId: taskId[0].taskId }
        this.freightForm = [newFreight];

    }
    addNewRow() { 
        let newFreight = new Freight();
        const taskId = this.taskList.filter(x => x.description === 'shipping');

        newFreight = { ...newFreight, taskId: taskId[0].taskId }
        this.freightForm = [...this.freightForm, newFreight];
    }
    disableUpdate:boolean=true;
    editData:any={};
    edit(rowData, mainIndex, subIndex) {
        this.editData=rowData;
        this.mainEditingIndex = mainIndex;
        this.subEditingIndex = subIndex;
        this.isEdit = true;
        rowData.amount=rowData.amount? this.formateCurrency( rowData.amount) : '0.00';

        let newFreight = new Freight();
        newFreight = { ...rowData }
        this.freightForm = [newFreight];


       // this.freightForm = [rowData];
        this.getCurrencyList('');
       this.getUOMList('');
       this.getTaskList();
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

        if(this.freightForm.length ==0)
        {
            this.disableUpdate=true;
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
                    //billingMethodId:this.costPlusType? this.costPlusType :0,
                    //markupPercentageId: this.overAllMarkup ? this.overAllMarkup : 0,
                    // currency: x.currencyId ? getValueFromArrayOfObjectById('label', 'value', x.currencyId, this.currencyList) : '',
                }
            });
            if (this.isEdit) {
                this.workOrderFreightList[this.mainEditingIndex][this.subEditingIndex] = this.freightForm[0];
                $('#addNewFreight').modal('hide');
                this.isEdit = false;
                this.markupChanged(this.workOrderFreightList[this.mainEditingIndex][this.subEditingIndex],'row')
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
        this.disableFrt=false;
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
                      "CreatedBy":this.userName,
                      "UpdatedBy":this.userName,
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

        this.saveFreightListForWO.emit(result);
        this.buildMethodDetails['freightBuildMethod'] =this.costPlusType;
        this.buildMethodDetails['freightFlatBillingAmount']=this.freightFlatBillingAmount;
        this.disableFrt=true;
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
// if(this.currentRow.workOrderFreightId !=null){
    this.currentRow.isDeleted = true;
// }
           //this.refreshData.emit();
           this.modal.close();
            this.isEdit = false;
            this.disableFrt=false;
        }
        else {
            this.isSpinnerVisible = true;
            const workOrderFreightId  = this.isSubWorkOrder ? this.currentRow.subWorkOrderFreightId :this.currentRow.workOrderFreightId;
            this.workOrderService.deleteWorkOrderFreightList(workOrderFreightId, this.userName,this.isSubWorkOrder).subscribe(res => {
                this.refreshData.emit();
                this.isSpinnerVisible = false;
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
                // if(this.costPlusType == 3){
                //     x.billingAmount = '0.00';
                //     this.freightFlatBillingAmount = '0.00';
                // }
                if(Number(this.costPlusType) == 1){
                    this.overAllMarkup = '';
                }
              }
            )
        }

        this.getTotalBillingAmount();
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
                    if (material.amount && !material.isDeleted) {
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
        const table= this.isSubWorkOrder ? 'SubWorkOrderFreight':'WorkOrderFreight';
        const columnId=this.isSubWorkOrder ? 'SubWorkOrderFreightId':'WorkOrderFreightId';
        const currentId=this.isSubWorkOrder ? this.restorerecord.subWorkOrderFreightId :this.restorerecord.workOrderFreightId
        this.isSpinnerVisible= true
      this.commonService.updatedeletedrecords(table, columnId, currentId).subscribe(res => {
        this.saveFreightsListDeletedStatus.emit(this.currentDeletedstatus);
        this.isSpinnerVisible= false
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
        if(this.isQuote){
  if(rowData.workOrderQuoteFreightId){
    this.workOrderService.getquoteFreightsHistory(rowData.workOrderQuoteFreightId).subscribe(res => {
        this.historyData = res;
//         this.historyData = res.forEach(element => {
//             element.amount=element.amount ?  formatNumberAsGlobalSettingsModule(element.amount, 2) : '0.00';
//             element.billingAmount=element.billingAmount ?  formatNumberAsGlobalSettingsModule(element.billingAmount, 2) : '0.00';
//            element.markUp=element.markUp ?  formatNumberAsGlobalSettingsModule(element.markUp, 2) : '0.00';
//    });
        this.triggerHistory();

      })
  }else{
    this.historyData = [];
    this.triggerHistory();
  }
  this.auditHistoryHeaders=this.auditHistoryQuoteHeaders;
        }else{
        this.workOrderService.getFreightHistory(this.isSubWorkOrder, this.isSubWorkOrder == true ? rowData.subWorkOrderFreightId : rowData.workOrderFreightId).subscribe(res => {
          this.historyData = res.reverse();
          this.auditHistoryHeaders=this.auditHistoryHeaders;
          this.triggerHistory();
        })
        }
      }
      triggerHistory(){
       
      this.modal = this.modalService.open(AuditComponentComponent, { size: 'lg', backdrop: 'static', keyboard: false,windowClass: 'assetMange' });
      this.modal.componentInstance.auditHistoryHeader=[];
      this.modal.componentInstance.auditHistoryHeader = this.auditHistoryHeaders;
        this.modal.componentInstance.auditHistory = this.historyData;
    
      }
      disableFrt:boolean=false;
      getValidFrt(){
          this.disableFrt=false;
      }
      
 
      getTaskList() {  
        this.setEditArray=[]; 
 
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
            })
    }
 

    allowNumberOnly(evt) {
  
        // Only ASCII charactar in that range allowed
        var ASCIICode = (evt.which) ? evt.which : evt.keyCode
        if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
            return false;
        return true;
    }
    shipViaId: number = 0;
    getShipViaId(event) {
        this.shipViaId = event;
    }

    IsAddShipVia: boolean = false;
    ShipViaEditID: number;
    shipviaindex;
    isEditModeShipVia: boolean = false;

    onEditShipVia(value, id, index) {
        this.shipviaindex = index;
        if (value == 'Add') {
            this.ShipViaEditID = 0;
        }
        else {
            this.ShipViaEditID = id;
            this.isEditModeShipVia = true;
        }
        this.IsAddShipVia = true;
    }

    RefreshAfterAddShipVia(ShippingViaId) {
        if (ShippingViaId != undefined || ShippingViaId > 0) {
            this.isSpinnerVisible = true;
            this.commonService.getShipVia(this.authService.currentUser.masterCompanyId).subscribe(response => {
                this.isSpinnerVisible = false;
                this.setShipViaList(response);
                this.freightForm[this.shipviaindex].shipViaId = ShippingViaId;
                //this.isEnableUpdateButton = false;
            }, error => this.isSpinnerVisible = false);
        }
        this.IsAddShipVia = false;
        $('#AddShipVia').modal('hide');
    }
    getshipvia()
    {
        this.commonService.getShipVia(this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.setShipViaList(res);
        })
    }
    setShipViaList(res) {
        if (res && res.length > 0) {
            this.shipViaList = res.map(x => {
                return {
                    label: x.name,
                    value: x.shippingViaId
                }
            });
        } else {
            this.shipViaList = [];
        }
    }
}