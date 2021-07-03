import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ViewEncapsulation } from '@angular/core';
declare var $: any;
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';
import { AuthService } from '../../../../../../services/auth.service';
import { CommonService } from '../../../../../../services/common.service';
import { getValueFromArrayOfObjectById, formatNumberAsGlobalSettingsModule, formatStringToNumber } from '../../../../../../generic/autocomplete';
import { SOFreight } from '../../../../../../models/sales/SOFreight';
import { SalesOrderService } from '../../../../../../services/salesorder.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from "@angular/forms";

@Component({
    selector: 'app-sales-order-freight',
    templateUrl: './sales-order-freight.component.html',
    styleUrls: ['./sales-order-freight.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SalesOrderFreightComponent implements OnInit, OnChanges {
    @Input() salesOrderFreightList = [];
    @Input() freightForm;
    @Input() customerId;
    @Input() salesOrderQuoteId: any;
    @Input() salesOrderId: any;
    @Output() saveFreightListForSO = new EventEmitter();
    @Output() updateFreightListForSO = new EventEmitter();
    @Output() refreshData = new EventEmitter();
    @Input() view: boolean = false;
    @Input() isQuote = false;
    salesOrderPartsList = [];
    markupList: any = [];
    @Input() isView: boolean = false;
    shipViaList: any = [];
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
    deleteModal: NgbModalRef;
    selectedRowForDelete;
    selectedRowIndexForDelete;
    storedData: any = [];
    deletedStatusInfo: boolean = false;
    restorerecord: any = {}
    deletedrowIndex: any;
    isUpdate: boolean = false;

    constructor(private salesOrdeService: SalesOrderService,
        private authService: AuthService,
        private alertService: AlertService,
        private commonService: CommonService,
        private modalService: NgbModal) {
    }

    ngOnInit() {
        if (this.freightForm) {
            let newFreight = new SOFreight();
            newFreight.amount = this.formateCurrency(newFreight.amount);
            newFreight.salesOrderQuoteId = this.salesOrderQuoteId;
            newFreight.salesOrderId = this.salesOrderId;
            this.freightForm = [...this.freightForm, new SOFreight()];
        }

        if (this.salesOrderFreightList && this.salesOrderFreightList.length > 0 && this.salesOrderFreightList[0].headerMarkupId) {
            this.costPlusType = this.salesOrderFreightList[0].markupFixedPrice;
            this.overAllMarkup = Number(this.salesOrderFreightList[0].headerMarkupId);
        }
        this.isView = this.isView ? this.isView : false;
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

    arrayEmplsit: any = [];
    arrayUnitOfMeasureList: any = [];
    arrayCurrencyList: any = [];
    arrayPercentList: any = [];

    refresh(isView) {
        this.isSpinnerVisible = true;
        this.arrayEmplsit.push(0);
        this.arrayUnitOfMeasureList.push(0);
        this.arrayCurrencyList.push(0);
        this.arrayPercentList.push(0);
        forkJoin(this.salesOrdeService.getSalesOrderFreights(this.salesOrderId, 0),
            this.commonService.getShipVia(this.currentUserMasterCompanyId),
            this.commonService.autoSuggestionSmartDropDownList('UnitOfMeasure', 'UnitOfMeasureId', 'shortName', '', true, 20, this.arrayUnitOfMeasureList.join(), this.currentUserMasterCompanyId),
            this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', '', true, 20, this.arrayCurrencyList.join(), this.currentUserMasterCompanyId),
            this.commonService.autoSuggestionSmartDropDownList("[Percent]", "PercentId", "PercentValue", '', true, 200, this.arrayPercentList.join(), this.currentUserMasterCompanyId),
            this.salesOrdeService.getSalesOrderParts(this.salesOrderId, this.deletedStatusInfo)).subscribe(response => {
                this.isSpinnerVisible = false;
                this.setFreightsData(response[0]);
                this.setShipViaList(response[1]);
                this.unitOfMeasureList = response[2];
                this.currencyList = response[3];
                this.markupList = response[4];
                this.setPartsData(response[5]);
            }, error => this.isSpinnerVisible = false);
    }

    setPartsData(res) {
        if (res && res.length > 0) {
            this.salesOrderPartsList = res;
            this.isUpdate = true;
        } else {
            this.salesOrderPartsList = [];
            this.isUpdate = false;
        }
    }

    refreshFreightsOnSaveOrDelete(fromDelete = false) {
        this.isSpinnerVisible = true;
        this.salesOrderFreightList = [];
        this.salesOrdeService.getSalesOrderFreights(this.salesOrderId, this.deletedStatusInfo).subscribe(res => {
            this.isSpinnerVisible = false;
            //Handeling offline Records also
            if (this.storedData && this.storedData.length != 0) {
                if (this.deletedStatusInfo == true) {
                    this.deletedStatusInfo = true;
                    this.storedData.forEach(element => {
                        if (element.isDeleted == true && element.salesOrderFreightId == 0) {
                            res.push(element);
                        }
                    });
                } else {
                    this.deletedStatusInfo = false;
                    this.storedData.forEach(element => {
                        if (element.isDeleted == false && element.salesOrderFreightId == 0) {
                            res.push(element)
                        }
                    });
                }
                this.setFreightsData(res);
            } else {
                this.setFreightsData(res);
            }

            if (fromDelete) {
                this.getTotalBillingAmount();
                //this.updateFreightListForSO.emit(this.freightFlatBillingAmount);
                this.updateFreightListForSO.emit(this.salesOrderFreightList);
            }
        }, error => {
            this.isSpinnerVisible = false;
        })
    }

    onBlurFlatBillingAmout() {
        this.freightFlatBillingAmount = (this.freightFlatBillingAmount) ? this.formateCurrency(this.freightFlatBillingAmount) : '0.00'
    }

    setFreightsData(res) {
        //if (res && res.length > 0) {
        if (res) {
            this.salesOrderFreightList = res.salesOrderFreights;
            //this.costPlusType = res[0].headerMarkupId;
            this.costPlusType = res.freightBuildMethod;
            //this.overAllMarkup = res[0].headerMarkupPercentageId;
            if (res.salesOrderFreights && res.salesOrderFreights.length > 0) {
                this.overAllMarkup = res.salesOrderFreights[0].headerMarkupPercentageId;
            }
            this.freightFlatBillingAmount = this.formateCurrency(res.freightFlatBillingAmount);
            // if (Number(this.costPlusType) == 3) {
            //     this.freightFlatBillingAmount = res[0].markupFixedPrice;
            // }
            this.isUpdate = true;
        } else {
            this.salesOrderFreightList = [];
            this.isUpdate = false;
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
        let newFreight = new SOFreight();
        newFreight.amount = this.formateCurrency(newFreight.amount);
        newFreight.salesOrderQuoteId = this.salesOrderQuoteId;
        newFreight.salesOrderId = this.salesOrderId;
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

    parsedText(text) {
        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }

    edit(rowData, mainIndex) {
        this.mainEditingIndex = mainIndex;
        this.isEdit = true;
        rowData.amount = this.formateCurrency(rowData.amount);
        this.freightForm = [rowData];
        this.isEnableUpdateButton = false;
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

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    saveFreightList() {
        this.freightForm = this.freightForm.map(x => {
            return {
                ...x,
                uom: x.uomId ? getValueFromArrayOfObjectById('label', 'value', x.uomId, this.unitOfMeasureList) : '',
                dimensionUOM: x.dimensionUOMId ? getValueFromArrayOfObjectById('label', 'value', x.dimensionUOMId, this.unitOfMeasureList) : '',
                currency: x.currencyId ? getValueFromArrayOfObjectById('label', 'value', x.currencyId, this.currencyList) : '',
                billingAmount: this.formateCurrency(x.amount),
                masterCompanyId: this.currentUserMasterCompanyId,
                partNumber: x.salesOrderPartId ? getValueFromArrayOfObjectById('partNumber', 'salesOrderPartId', x.salesOrderPartId, this.salesOrderPartsList) : ''
            }
        });
        if (this.isEdit) {
            if (this.costPlusType == 1) {
                this.markupChanged(this.freightForm[0], 'row');
            }
            this.salesOrderFreightList[this.mainEditingIndex] = this.freightForm[0];
            $('#addNewFreight').modal('hide');
            $('#AddShipVia').modal('hide');
            this.isEdit = false;
        }
        else {
            let temp = [];
            if (this.salesOrderFreightList != undefined) {
                this.salesOrderFreightList.forEach((x) => {
                    if (typeof x[Symbol.iterator] === 'function')
                        temp = [...temp, ...x];
                    else
                        temp = [...temp, x];
                });
            }
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
            $('#AddShipVia').modal('hide');
        }
        this.isEnableUpdateButton = true;
        this.isSaveChargesDesabled = false;
        this.storedData = [...this.salesOrderFreightList];
    }

    createFreightsQuote() {
        let temp = this.salesOrderFreightList;
        let sendData = [];
        for (let index = 0; index < temp.length; index++) {
            if (typeof temp[index][Symbol.iterator] === 'function')
                sendData = [...sendData, ...temp[index]];
            else
                sendData = [...sendData, temp[index]];
        }
        sendData = sendData.map((f) => {
            return { ...f, headerMarkupId: Number(this.costPlusType), headerMarkupPercentageId: this.overAllMarkup, markupFixedPrice: this.freightFlatBillingAmount }
        })
        let result = { 'salesOrderFreights': sendData, 'freightFlatBillingAmount': this.formateCurrency(this.freightFlatBillingAmount), 'freightBuildMethod': this.costPlusType, 'salesOrderId': this.salesOrderId }
        this.isSpinnerVisible = true;
        this.salesOrdeService.createFreight(result).subscribe(result => {
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
                'Success',
                'Sales Order Freights saved successfully',
                MessageSeverity.success
            );
            this.refreshFreightsOnSaveOrDelete();
            //this.saveFreightListForSO.emit(this.freightFlatBillingAmount);
            this.salesOrdeService.getSalesOrderFreights(this.salesOrderId, this.deletedStatusInfo).subscribe(response => {
                if (response.salesOrderFreights && response.salesOrderFreights.length > 0) {
                    this.salesOrderFreightList = response.salesOrderFreights;
                    //this.saveFreightListForSO.emit(this.salesOrderFreightList);
                    this.saveFreightListForSO.emit(response);
                }
            }, error => { });
        }, error => {
            this.isSpinnerVisible = false;
        })
        this.isSaveChargesDesabled = true;
        this.storedData = [];
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
            x.headerMarkupPercentageId = this.overAllMarkup;
            x.headerMarkupId = this.costPlusType;
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

    freightAudiHistory: any = [];
    openInterShipViaHistory(content, rowData) {
        if (rowData && rowData.salesOrderFreightId) {
            this.salesOrdeService.getSOFreightsHistory(rowData.salesOrderFreightId).subscribe(
                results => this.onAuditInterShipViaHistoryLoadSuccessful(results, content), error => {
                    this.isSpinnerVisible = false;
                });
        }
    }

    private onAuditInterShipViaHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        for (let x of auditHistory) {
            x.billingAmount = this.formateCurrency(Number(x.billingAmount.toString().replace(/\,/g, '')));
            x.amount = this.formateCurrency(Number(x.amount.toString().replace(/\,/g, '')));
        }

        this.freightAudiHistory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, windowClass: 'assetMange' });
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

    openDelete(content, rowData, rowIndex) {
        this.selectedRowForDelete = rowData;
        this.selectedRowIndexForDelete = rowIndex;
        this.deleteModal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
    }

    dismissModel() {
        this.deleteModal.close();
    }

    dismissModelAlett() {
        this.deleteModal.close();
    }

    delete() {
        this.isSpinnerVisible = true;
        this.deleteModal.close();
        if (!this.selectedRowForDelete.salesOrderFreightId) {
            this.selectedRowForDelete.isDeleted = true;
            this.isSpinnerVisible = false;
            if (this.storedData && this.storedData.length != 0) {
                this.storedData.forEach(element => {
                    if (
                        JSON.stringify(element) === JSON.stringify(this.selectedRowForDelete)
                    ) {
                        element.isDeleted = true;
                        this.salesOrderFreightList.splice(this.selectedRowIndexForDelete, 1);
                    }
                });
            }
            else {
                this.salesOrderFreightList.splice(this.selectedRowIndexForDelete, 1);
            }
            this.storedData = [...this.storedData];
            this.alertService.showMessage(
                '',
                'Deleted Sales Order Freight Successfully',
                MessageSeverity.success
            );
        } else {
            let salesOrderFreightId = this.selectedRowForDelete.salesOrderFreightId;
            this.salesOrdeService.deletesalesOrderFreightList(salesOrderFreightId, this.userName).subscribe(res => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    '',
                    'Deleted Sales Order Freight Successfully',
                    MessageSeverity.success
                );
                this.refreshFreightsOnSaveOrDelete(true);
            }, error => {
                this.isSpinnerVisible = false;
            })
        }
        $('#addNewFreight').modal('hide');
        this.isEdit = false;
        this.isSaveChargesDesabled = false;
    }

    getDeleteListByStatus(value) {
        this.deletedStatusInfo = value ? value : false;
        this.refreshFreightsOnSaveOrDelete();
    }

    restore(content, rowData, index) {
        this.restorerecord = rowData;
        this.deletedrowIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    restoreRecord() {
        if (this.restorerecord && this.restorerecord.salesOrderFreightId > 0) {
            this.commonService.updatedeletedrecords('SalesOrderFreight', 'salesOrderFreightId', this.restorerecord.salesOrderFreightId,).subscribe(res => {
                this.refreshFreightsOnSaveOrDelete();
                this.modal.close();
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            }, err => {
            });
        } else {
            this.restorerecord.isDeleted = false;
            this.salesOrderFreightList.splice(this.deletedrowIndex, 1);
            this.storedData.forEach(element => {
                if (
                    JSON.stringify(element) === JSON.stringify(this.restorerecord)
                ) {
                    element.isDeleted = false;
                }
            });
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            this.modal.close();
        }
    }

    isEnableUpdateButton: boolean = true;
    enableUpdate() {
        this.isEnableUpdateButton = false;
    }

    isSaveChargesDesabled: boolean = true;
    validated() {
        this.isSaveChargesDesabled = false;
    }

    deleteRow(index, form: NgForm): void {
        this.freightForm.splice(index, 1);
    }

    dismissModelAlettRestore() { }

    formatStringToNumberGlobal(val) {
        let tempValue = Number(val.toString().replace(/\,/g, ''));
        return formatStringToNumber(tempValue);
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
            this.commonService.getShipVia(this.currentUserMasterCompanyId).subscribe(response => {
                this.isSpinnerVisible = false;
                this.setShipViaList(response);
                this.freightForm[this.shipviaindex].shipViaId = ShippingViaId;
                this.isEnableUpdateButton = false;
            }, error => this.isSpinnerVisible = false);
        }
        this.IsAddShipVia = false;
        $('#AddShipVia').modal('hide');
    }
}