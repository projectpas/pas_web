import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, OnChanges, ViewEncapsulation } from '@angular/core';
declare var $ : any;
import { AlertService, MessageSeverity } from '../../../../../services/alert.service';
import { SalesQuoteService } from '../../../../../services/salesquote.service';
import { AuthService } from '../../../../../services/auth.service';
import { CommonService } from '../../../../../services/common.service';
import { getModuleIdByName } from '../../../../../generic/enums';
import { editValueAssignByCondition, getValueFromArrayOfObjectById, formatNumberAsGlobalSettingsModule, formatStringToNumber } from '../../../../../generic/autocomplete';
import { SalesOrderFreight } from '../../../../../models/sales/SalesOrderFreight';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from "@angular/forms";

@Component({
    selector: 'app-sales-order-quote-freight',
    templateUrl: './sales-order-quote-freight.component.html',
    styleUrls: ['./sales-order-quote-freight.component.css'],
    encapsulation: ViewEncapsulation.None

})
export class SalesOrderQuoteFreightComponent implements OnInit, OnChanges {
    @Input() salesOrderFreightList = [];
    @Input() freightForm;
    @Input() customerId;
    @Input() salesOrderQuoteId: any;;
    @Output() saveFreightListForSO = new EventEmitter();
    @Output() updateFreightListForSO = new EventEmitter();
    @Output() refreshData = new EventEmitter();
    @Input() view: boolean = false;
    @Input() isQuote = false;
    @Input() markupList;
    @Input() isView: boolean = false;
    @Input() buildMethodDetails: any = {};
    selectedRowForDelete;
    selectedRowIndexForDelete;
    deleteModal: NgbModalRef;
    modal: NgbModalRef;
    shipViaList: any;
    mainEditingIndex: any;
    subEditingIndex: any;
    overAllMarkup: any='';
    costPlusType: number = 0;
    isUpdate: boolean = false;
    cols = [
        { field: 'shipVia', header: 'Ship Via' },
        { field: 'weight', header: 'Weight' },
        { field: 'uom', header: 'UOM' }
    ]
    isEdit: boolean = false;
    unitOfMeasureList: any = [];
    currencyList: any = [];
    salesOrderFreightLists: any;
    freightFlatBillingAmount: any;
    isSpinnerVisible = false;
    constructor(private salesOrderQuoteService: SalesQuoteService,
        private authService: AuthService,
        private alertService: AlertService,
        private commonService: CommonService,
        private modalService: NgbModal,
        private cdRef: ChangeDetectorRef) {
    }
    ngOnInit() {
        if (this.freightForm) {
            let newFreight = new SalesOrderFreight();
            newFreight.amount = this.formateCurrency(newFreight.amount);
            newFreight.salesOrderQuoteId = this.salesOrderQuoteId;
            this.freightForm = [...this.freightForm, new SalesOrderFreight()];

        }
        if (this.salesOrderFreightList && this.salesOrderFreightList.length > 0 && this.salesOrderFreightList[0].headerMarkupId) {
            this.costPlusType = this.salesOrderFreightList[0].markupFixedPrice;
            this.overAllMarkup = Number(this.salesOrderFreightList[0].headerMarkupId);
            this.overAllMarkup=this.overAllMarkup? this.overAllMarkup :'';
        }
        this.isView = this.isView ? this.isView :false;
    }

    ngOnChanges() {
        if (this.salesOrderFreightList && this.salesOrderFreightList.length > 0 && this.salesOrderFreightList[0].headerMarkupId) {
            this.costPlusType = this.salesOrderFreightList[0].headerMarkupId;
            this.overAllMarkup = Number(this.salesOrderFreightList[0].headerMarkupPercentageId);
            this.overAllMarkup=this.overAllMarkup? this.overAllMarkup :'';
        }
        if (this.salesOrderFreightList) {
            this.salesOrderFreightList = [];
            for (let x in this.salesOrderFreightLists) {
                this.salesOrderFreightList.push(this.salesOrderFreightLists[x]);
            }
        }
    }
 
restorerecord: any = {}

dismissModelAlett() {
    this.deleteModal.close();
}
dismissModelAlettRestore() {
    this.modal.close();
}
    deletedStatusInfo:boolean=false;
    arrayEmplsit:any=[];
    refresh(isview) {
        this.isSpinnerVisible = true;
        this.arrayEmplsit.push(0);
        forkJoin(this.salesOrderQuoteService.getSalesQuoteFreights(this.salesOrderQuoteId,this.deletedStatusInfo),
            //this.commonService.getShipViaDetailsByModuleActiveInactive(getModuleIdByName('Customer'), this.customerId, this.arrayEmplsit.join())
            this.commonService.getShipVia()
            ).subscribe(response => {
                this.isSpinnerVisible = false;
                this.setFreightsData(response[0]);
                this.setShipViaList(response[1]);
            }, 
            error => {
                this.isSpinnerVisible = false;
            })
            this.getunitOfMeasureList('');
            this.CurrencyData('');
    }

    onFilterUom(value) {
        this.getunitOfMeasureList(value);
    }
    setEditArray:any=[];
     getunitOfMeasureList(value) {
        this.setEditArray=[];
        if (this.isEdit == true) {
            this.setEditArray.push(this.freightForm[0].dimensionUOMId ? this.freightForm[0].dimensionUOMId : 0,
                this.freightForm[0].uomId ? this.freightForm[0].uomId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('UnitOfMeasure', 'UnitOfMeasureId', 'shortName', strText, true, 20, this.setEditArray.join()).subscribe(res => {
            this.unitOfMeasureList = res;

        }, err => {
            this.isSpinnerVisible = false;
        });
    }
    onFilterCurrency(value) {
        this.CurrencyData(value);
    }
   CurrencyData(value) {
        this.setEditArray = [];
        if (this.isEdit == true) {
            this.setEditArray.push(this.freightForm[0].currencyId ? this.freightForm[0].currencyId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', strText, true, 20, this.setEditArray.join()).subscribe(res => {
            this.currencyList = res;
        }, err => {
            this.isSpinnerVisible = false;
            const errorLog = err;
        });
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
    get userName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.userName
            : "";
    }

    createNew() {
        this.isEdit = false;
        let newFreight = this.getNewFreightObject();
        this.freightForm = [newFreight];

    }

    getNewFreightObject() {
        let newFreight = new SalesOrderFreight();
        newFreight.amount = this.formateCurrency(newFreight.amount);
        newFreight.salesOrderQuoteId = this.salesOrderQuoteId;
        newFreight.billingMethodId = this.costPlusType;
        newFreight.createdBy = this.userName;
        newFreight.createdDate = new Date();
        newFreight.updatedBy = this.userName;
        newFreight.updatedDate = new Date();
        newFreight.headerMarkupPercentageId = this.overAllMarkup;
        newFreight.headerMarkupId = this.costPlusType;
        newFreight.billingAmount = this.formateCurrency(Number(newFreight.amount.toString().replace(/\,/g, '')));
        return newFreight;
    }

    addNewRow() {
        let newFreight = this.getNewFreightObject();
        newFreight.billingAmount = this.formateCurrency(Number(newFreight.amount.toString().replace(/\,/g, '')));
        this.freightForm = [...this.freightForm, newFreight];
    }

    edit(rowData, mainIndex) {
        this.isEnableUpdateButton=true;
        this.mainEditingIndex = mainIndex;
        this.isEdit = true;
        rowData.amount = this.formateCurrency(rowData.amount);
        this.freightForm = [rowData];
    }
    memoIndex;
    onAddTextAreaInfo(material, index) {
        this.memoIndex = index;
        this.textAreaInfo = material.memo;
    }
    textAreaInfo: any;
    onSaveTextAreaInfo(memo) {
        this.isEnableUpdateButton=false;
        if (memo) {
            this.textAreaInfo = memo;
            this.freightForm[this.memoIndex].memo = this.textAreaInfo;
        }
        $("#textarea-popupFreight").modal("hide");
    }
    onCloseTextAreaInfo() {
        $("#textarea-popupFreight").modal("hide");
    }


    createFreightsQuote() {
        let temp = this.salesOrderFreightList;
        let sendData = []
        for (let index = 0; index < temp.length; index++) {
            if (typeof temp[index][Symbol.iterator] === 'function')
                sendData = [...sendData, ...temp[index]];
            else
                sendData = [...sendData, temp[index]];                
        }
        sendData = sendData.map((f) => {
            return { ...f, headerMarkupId: Number(this.costPlusType), headerMarkupPercentageId: this.overAllMarkup, markupFixedPrice: this.freightFlatBillingAmount }
        })
        let result = { 'data': sendData, 'freightFlatBillingAmount': this.formateCurrency(this.freightFlatBillingAmount), 'FreightBuildMethod': this.costPlusType }
        this.isSpinnerVisible = true;
        this.salesOrderQuoteService.createFreight(sendData).subscribe(result => {
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
                '',
                'SO Quote Freight saved successfully',
                MessageSeverity.success
            );
            this.refreshFreightsOnSaveOrDelete();
            this.saveFreightListForSO.emit(this.freightFlatBillingAmount);
        },
        error => {
            this.isSpinnerVisible = false;
        })
        this.isSaveChargesDesabled=true;
        this.storedData=[];
    }

    markupChanged(matData, type) {
        try {
            this.markupList.forEach((markup) => {
                if (type == 'row' && markup.value == matData.markupPercentageId) {
                    matData.billingAmount = this.formateCurrency(Number(matData.amount.toString().replace(/\,/g, '')) + ((Number(matData.amount.toString().replace(/\,/g, '')) / 100) * Number(markup.label)))
                }
                else if (type == 'all' && markup.value == this.overAllMarkup) {
                    this.salesOrderFreightList.forEach((mData) => {
                        if (mData.billingMethodId && Number(mData.billingMethodId) == 1) {
                            mData.markupPercentageId = Number(this.overAllMarkup);
                            mData.headerMarkupId = Number(this.costPlusType);
                            mData.billingAmount = this.formateCurrency(Number(mData.amount.toString().replace(/\,/g, '')) + ((Number(mData.amount.toString().replace(/\,/g, '')) / 100) * Number(markup.label)));
                        }
                    })
                }
            })
        }
        catch (e) {
        }
    }

    tmchange() {
        for (let x of this.salesOrderFreightList) {
            x.billingMethodId = this.costPlusType;
            x.headerMarkupId = this.costPlusType;
            x.headerMarkupPercentageId = this.overAllMarkup;
            x.markupPercentageId = '';
            x.billingAmount = this.formateCurrency(Number(x.amount.toString().replace(/\,/g, '')));
            if (this.costPlusType == 3) {
                x.billingAmount = '0.00';
                this.freightFlatBillingAmount = '0.00';
            }
            this.overAllMarkup = '';
            x.headerMarkupPercentageId = this.overAllMarkup;
        }
    }

    getTotalAmount() {
        let total = 0;
        if (this.salesOrderFreightList) {
            this.salesOrderFreightList.forEach(
                (material) => {
                    total += Number(this.getTotalTaskAmount(material));
                }
            )
        }
        return this.formateCurrency(total);
    }

    getTotalTaskAmount(freight) {
        let total = 0;
        if (freight.amount && !freight.isDeleted) {
            total += Number(freight.amount.toString().replace(/\,/g, ''));
        }
        return total.toFixed(2);
    }

    getTotalBillingAmount() {
        let total = 0;
        if (this.salesOrderFreightList) {
            this.salesOrderFreightList.forEach(
                (material) => {
                    total += Number(this.getTotalTaskBillingAmount(material));
                }
            )
        }
        this.freightFlatBillingAmount = total.toFixed(2);
        return this.formateCurrency(total);
    }

    getTotalTaskBillingAmount(freight) {
        let total = 0;
        if (freight.billingAmount && !freight.isDeleted) {
            total += Number(freight.billingAmount.toString().replace(/\,/g, ''));
        }
        return total.toFixed(2);
    }

    formateCurrency(amount) {
        return amount ? formatNumberAsGlobalSettingsModule(amount, 2) : '0.00';
    }

    openDelete(content, rowData, rowIndex) {
        this.selectedRowForDelete = rowData;
        this.selectedRowIndexForDelete = rowIndex;
        this.deleteModal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
    }

    dismissModel() {
        this.deleteModal.close();
    }

    freightAudiHistory:any=[];
    openInterShipViaHistory(content, rowData) {
        if(rowData && rowData.salesOrderQuoteFreightId){
        this.salesOrderQuoteService.getSOQFreightsHistory(rowData.salesOrderQuoteFreightId).subscribe(
            results => this.onAuditInterShipViaHistoryLoadSuccessful(results, content),error => {
                this.isSpinnerVisible = false;
            });
        }
    }
    private onAuditInterShipViaHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();


        this.freightAudiHistory = auditHistory;

        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false,windowClass:'assetMange' });

    }
    dismissModelHistory() {
        this.modal.close();
    }
    getColorCodeForHistory(i, field, value) {
        const data = this.freightAudiHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    isEnableUpdateButton:boolean=true;
    enableUpdate(){
      this.isEnableUpdateButton=false;
    }

    isSaveChargesDesabled:boolean=true;
    validated(){
      this.isSaveChargesDesabled=false;
    }
    deleteRow(index, form: NgForm): void {
        this.freightForm.splice(index, 1);
    }
    formatStringToNumberGlobal(val) {
        let tempValue = Number(val.toString().replace(/\,/g, ''));
        return formatStringToNumber(tempValue)
      }
      storedData:any=[];
      deletedrowIndex:any;
      restore(content, rowData,index) {
          this.restorerecord = rowData;
          this.deletedrowIndex=index;
          this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
      }
      
      restoreRecord() {
        if(this.restorerecord && this.restorerecord.salesOrderQuoteFreightId>0){
        this.commonService.updatedeletedrecords('SalesOrderQuoteFreight','SalesOrderQuoteFreightId',this.restorerecord.salesOrderQuoteFreightId, ).subscribe(res => {
                    this.refreshFreightsOnSaveOrDelete();
                this.modal.close();
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            }, err => {
                const errorLog = err;
            });
        }
        else {
            this.restorerecord.isDeleted = false;
            this.salesOrderFreightList.splice(this.deletedrowIndex, 1);
            this.storedData.forEach(element => {
            if(
                JSON.stringify(element) === JSON.stringify(this.restorerecord)
                ) {
                element.isDeleted=false;
    
            }
        });
        this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        this.modal.close();
        }
    }
      delete() {
        this.isSpinnerVisible = true;
        this.deleteModal.close();
        if (!this.selectedRowForDelete.salesOrderQuoteFreightId) {
            this.selectedRowForDelete.isDeleted = true;
            this.isSpinnerVisible = false;
            if(this.storedData && this.storedData.length !=0){
            this.storedData.forEach(element => {
                if(
                 JSON.stringify(element) === JSON.stringify(this.selectedRowForDelete)
                 ) {
                 element.isDeleted=true;
                 this.salesOrderFreightList.splice(this.selectedRowIndexForDelete, 1);
                }
            });
        }
        else{
            this.salesOrderFreightList.splice(this.selectedRowIndexForDelete, 1);
        }
            this.storedData=[...this.storedData];
            this.alertService.showMessage(
                '',
                'Deleted Sales Order Quote Freight Successfully',
                MessageSeverity.success
            );
        } else {
            let salesOrderQuoteFreightId = this.selectedRowForDelete.salesOrderQuoteFreightId;
            this.salesOrderQuoteService.deletesalesOrderFreightList(salesOrderQuoteFreightId, this.userName).subscribe(res => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    '',
                    'Deleted Sales Order Quote Freight Successfully',
                    MessageSeverity.success
                );
                this.refreshFreightsOnSaveOrDelete(true);
            }, error => {
                this.isSpinnerVisible = false;
            })
        }
        $('#addNewFreight').modal('hide');
        this.isEdit = false;
        this.isSaveChargesDesabled=false;
    }
    getDeleteListByStatus(value){
        this.deletedStatusInfo=value ? value :false;
        this.refreshFreightsOnSaveOrDelete();
    }
    refreshFreightsOnSaveOrDelete(fromDelete = false) {
        this.isSpinnerVisible = true;
        this.salesOrderFreightList=[];
        this.salesOrderQuoteService.getSalesQuoteFreights(this.salesOrderQuoteId,this.deletedStatusInfo).subscribe(res => {
            this.isSpinnerVisible = false;
//Handeling offline Records also
           if( this.storedData &&  this.storedData.length!=0){
               if (this.deletedStatusInfo == true ) {
                this.deletedStatusInfo = true;
                this.storedData.forEach(element => {
                    if (element.isDeleted == true && element.salesOrderQuoteFreightId==0) {
                        res.push(element);
                    }
                });
            } else {
                this.deletedStatusInfo = false;
                this.storedData.forEach(element => {
                    if (element.isDeleted == false && element.salesOrderQuoteFreightId==0) {
                        res.push(element)
                    }
                });
            }
               this.setFreightsData(res);
           }else{
            this.setFreightsData(res);
           }
     
            if (fromDelete) {
                this.getTotalBillingAmount();
                this.updateFreightListForSO.emit(this.freightFlatBillingAmount);
            }
        }, 
        error => {
            this.isSpinnerVisible = false;
        })
    }
    setFreightsData(res) {
        if (res && res.length > 0) {
            this.salesOrderFreightList = res;
            this.costPlusType = res[0].headerMarkupId;
            this.overAllMarkup = res[0].headerMarkupPercentageId;
            if (Number(this.costPlusType) == 3) {
                this.freightFlatBillingAmount = res[0].markupFixedPrice;
            }
            this.isUpdate = true;
        } else {
            this.salesOrderFreightList = [];
            this.isUpdate = false;
        }
        this.freightForm = [];
        this.salesOrderFreightLists = [];
    }
    saveFreightList() {
        this.freightForm = this.freightForm.map(x => {
            return {
                ...x,
                uom: x.uomId ? getValueFromArrayOfObjectById('label', 'value', x.uomId, this.unitOfMeasureList) : '',
                dimensionUOM: x.dimensionUOMId ? getValueFromArrayOfObjectById('label', 'value', x.dimensionUOMId, this.unitOfMeasureList) : '',
                currency: x.currencyId ? getValueFromArrayOfObjectById('label', 'value', x.currencyId, this.currencyList) : '',
                billingAmount: this.formateCurrency(x.amount)
            }
        });
        if (this.isEdit) {
            if (this.costPlusType == 1) {
                this.markupChanged(this.freightForm[0], 'row');
            }
            this.salesOrderFreightList[this.mainEditingIndex] = this.freightForm[0];
            $('#addNewFreight').modal('hide');
            this.isEdit = false;
        }
        else {
            let temp = [];
            this.salesOrderFreightList.forEach((x) => {
                if(typeof x[Symbol.iterator] === 'function')
                    temp = [...temp, ...x];
                else
                    temp = [...temp, x];
            })
            temp = [...temp, ...this.freightForm];
            this.salesOrderFreightLists = temp;
            this.salesOrderFreightList = [];
            for (let x in this.salesOrderFreightLists) {
                this.salesOrderFreightList.push(this.salesOrderFreightLists[x]);
            }
            if (this.costPlusType == 1) {
                this.markupChanged({}, 'all');
            }
            $('#addNewFreight').modal('hide');
        }
        this.isEnableUpdateButton=true;
        this.isSaveChargesDesabled=false;
        this.storedData=[...this.salesOrderFreightList];
    }

    openFreight(content) {
        this.modal = this.modalService.open(content, { size: 'xl', backdrop: 'static', keyboard: false });
    }
}