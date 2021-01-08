import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, OnChanges, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery';
import { AlertService, MessageSeverity } from '../../../../../services/alert.service';
import { SalesQuoteService } from '../../../../../services/salesquote.service';
import { AuthService } from '../../../../../services/auth.service';
import { CommonService } from '../../../../../services/common.service';
import { getModuleIdByName } from '../../../../../generic/enums';
import { editValueAssignByCondition, getValueFromArrayOfObjectById, formatNumberAsGlobalSettingsModule } from '../../../../../generic/autocomplete';
import { SalesOrderFreight } from '../../../../../models/sales/SalesOrderFreight';
import { forkJoin } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


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
    shipViaList: any;
    mainEditingIndex: any;
    subEditingIndex: any;
    overAllMarkup: any;
    costPlusType: number = 0;
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
    modal: NgbModalRef;
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
        }
    }

    ngOnChanges() {
        if (this.salesOrderFreightList && this.salesOrderFreightList.length > 0 && this.salesOrderFreightList[0].headerMarkupId) {
            this.costPlusType = this.salesOrderFreightList[0].headerMarkupId;
            this.overAllMarkup = Number(this.salesOrderFreightList[0].headerMarkupPercentageId);
        }
        if (this.salesOrderFreightList) {
            this.salesOrderFreightList = [];
            for (let x in this.salesOrderFreightLists) {
                this.salesOrderFreightList.push(this.salesOrderFreightLists[x]);
            }
        }
    }

    refresh(isview) {
        this.isView = isview;
        this.isSpinnerVisible = true;
        forkJoin(this.salesOrderQuoteService.getSalesQuoteFreights(this.salesOrderQuoteId),
            this.commonService.getShipViaDetailsByModule(getModuleIdByName('Customer'), this.customerId),
            this.commonService.smartDropDownList('UnitOfMeasure', 'UnitOfMeasureId', 'ShortName'),
            this.commonService.smartDropDownList('Currency', 'CurrencyId', 'Code')).subscribe(response => {
                this.isSpinnerVisible = false;
                this.setFreightsData(response[0]);
                this.setShipViaList(response[1]);
                this.unitOfMeasureList = response[2];
                this.currencyList = response[3];

            }, error => {
                this.isSpinnerVisible = false;
                const errorLog = error;
                this.onDataLoadFailed(errorLog)
            })

    }

    refreshFreightsOnSaveOrDelete(fromDelete = false) {
        this.isSpinnerVisible = true;
        this.salesOrderQuoteService.getSalesQuoteFreights(this.salesOrderQuoteId).subscribe(res => {
            this.isSpinnerVisible = false;
            this.setFreightsData(res);
            if (fromDelete) {
                this.getTotalBillingAmount();
                this.updateFreightListForSO.emit(this.freightFlatBillingAmount);
            }
        }, error => {
            this.isSpinnerVisible = false;
            const errorLog = error;
            this.onDataLoadFailed(errorLog)
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
        } else {
            this.salesOrderFreightList = [];
        }
        this.freightForm = [];
        this.salesOrderFreightLists = [];
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
        if (memo) {
            this.textAreaInfo = memo;
            this.freightForm[this.memoIndex].memo = this.textAreaInfo;
        }
        $("#textarea-popupFreight").modal("hide");
    }
    onCloseTextAreaInfo() {
        $("#textarea-popupFreight").modal("hide");
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
                temp = [...temp, ...x];
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
    }

    createFreightsQuote() {
        let temp = this.salesOrderFreightList;
        let sendData = []
        for (let index = 0; index < temp.length; index++) {
            sendData = [...sendData, ...temp[index]];

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
        }, error => {
            this.isSpinnerVisible = false;
            const errorLog = error;
            this.onDataLoadFailed(errorLog)
        })
    }
    onDataLoadFailed(log) {
        // this.isSpinnerVisible = false;
        const errorLog = log;
        var msg = '';
        if (errorLog.message) {
            if (errorLog.error && errorLog.error.errors.length > 0) {
                for (let i = 0; i < errorLog.error.errors.length; i++) {
                    msg = msg + errorLog.error.errors[i].message + '<br/>'
                }
            }
            this.alertService.showMessage(
                errorLog.error.message,
                msg,
                MessageSeverity.error
            );
        }
        else {
            this.alertService.showMessage(
                'Error',
                log.error,
                MessageSeverity.error
            );
        }
    }
    delete() {
        this.isSpinnerVisible = true;
        this.deleteModal.close();
        if (!this.selectedRowForDelete.salesOrderQuoteFreightId) {
            this.selectedRowForDelete.isDeleted = true;
            this.isSpinnerVisible = false;
            this.salesOrderFreightList.splice(this.selectedRowIndexForDelete, 1);
        } else {
            let salesOrderQuoteFreightId = this.selectedRowForDelete.salesOrderQuoteFreightId;
            this.salesOrderQuoteService.deletesalesOrderFreightList(salesOrderQuoteFreightId, this.userName).subscribe(res => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    '',
                    'Deleted Sales Order Freight Successfully',
                    MessageSeverity.success
                );
                this.refreshFreightsOnSaveOrDelete(true);
            }, error => {
                this.isSpinnerVisible = false;
                const errorLog = error;
                this.onDataLoadFailed(errorLog)
            })
        }
        $('#addNewFreight').modal('hide');
        this.isEdit = false;
    }

    onDataLoadError(error) {
        this.isSpinnerVisible = false;
        let errorMessage = '';
        if (error.message) {
            errorMessage = error.message;
        }
        this.alertService.resetStickyMessage();
        this.alertService.showStickyMessage("SO Quote", errorMessage, MessageSeverity.error, error);
        // this.alertService.showMessage(error);
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
        this.deleteModal.result.then(
            () => {
            },
            () => {
            }
        );
    }

    dismissModel() {
        this.deleteModal.close();
    }
    freightAudiHistory:any=[];
    openInterShipViaHistory(content, rowData) {
        console.log("rowData",rowData)
        if(rowData && rowData.salesOrderQuoteFreightId){
        this.salesOrderQuoteService.getSOQFreightsHistory(rowData.salesOrderQuoteFreightId).subscribe(
            results => this.onAuditInterShipViaHistoryLoadSuccessful(results, content),error => {
                this.isSpinnerVisible = false;
                const errorLog = error;
                this.onDataLoadFailed(errorLog)
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
}