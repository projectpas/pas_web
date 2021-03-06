import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
declare var $: any;
import { forkJoin } from 'rxjs/observable/forkJoin';
import { SalesOrderService } from '../../../../../../services/salesorder.service';
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';
import { AuthService } from '../../../../../../services/auth.service';
import { CommonService } from '../../../../../../services/common.service';
import { ActionService } from '../../../../../../Workflow/ActionService';
import { VendorService } from '../../../../../../services/vendor.service';
import { formatNumberAsGlobalSettingsModule, editValueAssignByCondition, formatStringToNumber } from '../../../../../../generic/autocomplete';
import { SalesOrderCharge } from '../../../../../../models/sales/SalesOrderCharge';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from "@angular/forms";

@Component({
    selector: 'app-sales-order-charges',
    templateUrl: './sales-order-charges.component.html',
    styleUrls: ['./sales-order-charges.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SalesOrderChargesComponent implements OnChanges, OnInit {
    @Input() salesOrderChargesList = [];
    @Input() chargeForm;
    @Input() customerId;
    @Input() salesOrderQuoteId: any;
    @Input() salesOrderId: any;
    @Output() saveChargesListForSO = new EventEmitter();
    @Output() updateChargesListForSO = new EventEmitter();
    @Output() refreshData = new EventEmitter();
    @Input() view: boolean = false;
    @Input() isQuote = false;
    @Input() isView: boolean = false;
    salesOrderPartsList = [];
    markupList: any = [];
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
    salesOrderChargesLists: any;
    chargesFlatBillingAmount: any;
    isSpinnerVisible = false;
    chargesTypes = [];
    vendorCollection: any[] = [];
    allVendors = [];
    chargesAudiHistory: any = [];
    modal: NgbModalRef;
    deleteModal: NgbModalRef;
    selectedRowForDelete;
    selectedRowIndexForDelete;
    storedData: any = [];
    deletedStatusInfo: any = false;
    restorerecord: any = {};
    deletedrowIndex: any;
    isEnableUpdateButton: boolean = true;
    isSaveChargesDesabled: boolean = true;
    frieghtsCreateForm: any;
    isUpdate: boolean = false;

    constructor(private salesOrderService: SalesOrderService,
        private authService: AuthService,
        private alertService: AlertService,
        private commonService: CommonService,
        private actionService: ActionService,
        private vendorService: VendorService,
        private modalService: NgbModal) {
    }

    ngOnInit() {
        if (this.chargeForm) {
            let newCharge = new SalesOrderCharge();
            newCharge.unitCost = this.formateCurrency(newCharge.unitCost);
            newCharge.extendedCost = this.formateCurrency(newCharge.extendedCost);
            newCharge.salesOrderQuoteId = this.salesOrderQuoteId;
            newCharge.salesOrderId = this.salesOrderId;
            this.chargeForm = [...this.chargeForm, new SalesOrderCharge()];
        }
        if (this.salesOrderChargesList && this.salesOrderChargesList.length > 0 && this.salesOrderChargesList[0].headerMarkupId) {
            this.costPlusType = this.salesOrderChargesList[0].markupFixedPrice;
            this.overAllMarkup = Number(this.salesOrderChargesList[0].headerMarkupId);
        }
        this.isView = this.isView ? this.isView : false;
    }

    ngOnChanges() {
        if (this.salesOrderChargesList && this.salesOrderChargesList.length > 0 && this.salesOrderChargesList[0].headerMarkupId) {
            this.costPlusType = this.salesOrderChargesList[0].headerMarkupId;
            this.overAllMarkup = Number(this.salesOrderChargesList[0].headerMarkupPercentageId);
        }
        if (this.salesOrderChargesList) {
            this.salesOrderChargesList = [];
            for (let x in this.salesOrderChargesLists) {
                this.salesOrderChargesList.push(this.salesOrderChargesLists[x]);
            }
        }
    }

    arrayVendlsit: any = [];
    arrayPercentList: any = [];

    refresh(isView) {
        this.arrayVendlsit = [];
        this.arrayPercentList.push(0);
        this.isSpinnerVisible = true;
        forkJoin(this.salesOrderService.getSalesQuoteCharges(this.salesOrderId, this.deletedStatusInfo),
            this.actionService.getCharges(),
            this.commonService.autoSuggestionSmartDropDownList("[Percent]", "PercentId", "PercentValue", '', true, 200, this.arrayPercentList.join(), this.currentUserMasterCompanyId),
            this.salesOrderService.getSalesOrderParts(this.salesOrderId, this.deletedStatusInfo)
        ).subscribe(res => {
            this.isSpinnerVisible = false;
            this.setChargesData(res[0]);
            this.chargesTypes = res[1];
            this.markupList = res[2];
            this.setVendors();
            this.vendorList('');
            this.setPartsData(res[3]);
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

    private vendorList(value) {
        this.arrayVendlsit = [];
        if (this.isEdit == true) {
            this.salesOrderChargesList.forEach(element => {
                this.arrayVendlsit.push(element.vendorId);
            });
        }
        this.arrayVendlsit.push(0);
        this.isSpinnerVisible = true;
        this.vendorService.getVendorNameCodeListwithFilter(value, 20, this.arrayVendlsit.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.allVendors = res.map(x => {
                return {
                    vendorId: x.vendorId,
                    vendorName: x.vendorName
                }
            });
            this.vendorCollection = this.allVendors;
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        })
    }

    refreshOnDataSaveOrEditORDelete(fromDelete = false) {
        this.isSpinnerVisible = true;
        this.salesOrderChargesList = [];
        this.salesOrderService.getSalesQuoteCharges(this.salesOrderId, this.deletedStatusInfo).subscribe(res => {
            this.isSpinnerVisible = false;
            //Handeling offline Records also
            if (this.storedData && this.storedData.length != 0) {
                if (this.deletedStatusInfo == true) {
                    this.deletedStatusInfo = true;
                    this.storedData.forEach(element => {
                        if (element.isDeleted == true && element.salesOrderQuoteChargesId == 0) {
                            res.push(element);
                        }
                    });
                } else {
                    this.deletedStatusInfo = false;
                    this.storedData.forEach(element => {
                        if (element.isDeleted == false && element.salesOrderQuoteChargesId == 0) {
                            res.push(element)
                        }
                    });
                }
                this.setChargesData(res);
            } else {
                this.setChargesData(res);
            }
            if (fromDelete) {
                this.getTotalBillingAmount();
                //this.updateChargesListForSO.emit(this.chargesFlatBillingAmount);
                this.updateChargesListForSO.emit(this.salesOrderChargesList);
            }
        }, error => {
            this.isSpinnerVisible = false;
        })
    }

    setChargesData(res) {
        //if (res && res.length > 0) {
        if (res) {
            this.salesOrderChargesList = res.salesOrderCharges;
            this.setVendors();
            //this.costPlusType = res[0].headerMarkupId;
            this.costPlusType = res.chargesBuildMethod;
            //this.overAllMarkup = res[0].headerMarkupPercentageId;
            if (res.salesOrderCharges.length > 0) {
                this.overAllMarkup = res.salesOrderCharges[0].headerMarkupPercentageId;
            }
            this.chargesFlatBillingAmount = this.formateCurrency(res.chargesFlatBillingAmount);
            // if (Number(this.costPlusType) == 3) {
            //     this.chargesFlatBillingAmount = res[0].markupFixedPrice;
            // }
            this.isUpdate = true;
        } else {
            this.salesOrderChargesList = [];
            this.isUpdate = false;
        }
        this.chargeForm = [];
        this.salesOrderChargesLists = [];
    }

    get userName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.userName
            : "";
    }

    createNew() {
        this.isEdit = false;
        let newCharge = this.getNewChargeObject();
        this.chargeForm = [newCharge];
    }

    getNewChargeObject() {
        let newCharge = new SalesOrderCharge();
        newCharge.unitCost = this.formateCurrency(newCharge.unitCost);
        newCharge.extendedCost = this.formateCurrency(newCharge.extendedCost);
        newCharge.salesOrderQuoteId = this.salesOrderQuoteId;
        newCharge.salesOrderId = this.salesOrderId;
        newCharge.billingMethodId = this.costPlusType;
        newCharge.createdBy = this.userName;
        newCharge.createdDate = new Date();
        newCharge.updatedBy = this.userName;
        newCharge.updatedDate = new Date();
        newCharge.headerMarkupPercentageId = this.overAllMarkup;
        newCharge.headerMarkupId = this.costPlusType;
        newCharge.unitCost = this.formateCurrency(Number(newCharge.unitCost.toString().replace(/\,/g, '')));
        newCharge.billingRate = this.formateCurrency(Number(newCharge.unitCost.toString().replace(/\,/g, '')));
        newCharge.extendedCost = this.formateCurrency(Number(newCharge.extendedCost.toString().replace(/\,/g, '')));
        newCharge.billingAmount = this.formateCurrency(Number(newCharge.extendedCost.toString().replace(/\,/g, '')));
        return newCharge;
    }

    addNewRow() {
        let newCharge = this.getNewChargeObject();
        this.chargeForm = [...this.chargeForm, newCharge];
    }

    edit(rowData, mainIndex) {
        this.isEnableUpdateButton = true;
        this.mainEditingIndex = mainIndex;
        this.isEdit = true;
        rowData.unitCost = this.formateCurrency(rowData.unitCost);
        rowData.extendedCost = this.formateCurrency(rowData.extendedCost);
        this.chargeForm = [rowData];
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
            this.chargeForm[this.memoIndex].memo = this.textAreaInfo;
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

    saveChargesList() {
        this.chargeForm = this.chargeForm.map(x => {
            return {
                ...x,
                billingAmount: this.formateCurrency(x.extendedCost),
                billingRate: this.formateCurrency(x.unitCost),
                masterCompanyId: this.currentUserMasterCompanyId
            }
        });
        if (this.isEdit) {
            if (this.costPlusType == 1) {
                this.markupChanged(this.chargeForm[0], 'row');
            }
            this.salesOrderChargesList[this.mainEditingIndex] = this.chargeForm[0];

            $('#addNewCharges').modal('hide');
            this.isEdit = true;
        }
        else {
            let temp = [];
            this.salesOrderChargesList.forEach((x) => {
                if (typeof x[Symbol.iterator] === 'function')
                    temp = [...temp, ...x];
                else
                    temp = [...temp, x];
            })
            temp = [...temp, ...this.chargeForm];
            this.salesOrderChargesLists = temp;
            this.salesOrderChargesList = [];
            for (let x in this.salesOrderChargesLists) {
                this.salesOrderChargesList.push(this.salesOrderChargesLists[x]);
            }
            if (this.costPlusType == 1) {
                this.markupChanged({}, 'all');
            }
            $('#addNewCharges').modal('hide');
        }
        this.isEnableUpdateButton = true;
        this.isSaveChargesDesabled = false;
        this.storedData = [...this.salesOrderChargesList];
    }

    createChargesQuote() {
        let temp = this.salesOrderChargesList;
        let sendData = [];

        for (let index = 0; index < temp.length; index++) {
            if (typeof temp[index][Symbol.iterator] === 'function')
                sendData = [...sendData, ...temp[index]];
            else
                sendData = [...sendData, temp[index]];
        }
        sendData = sendData.map((f) => {
            return {
                ...f, headerMarkupId: Number(this.costPlusType), headerMarkupPercentageId: this.overAllMarkup, markupFixedPrice: this.chargesFlatBillingAmount,
                vendorId: editValueAssignByCondition("vendorId", f.vendor)
            }
        })

        let result = { 'salesOrderCharges': sendData, 'chargesFlatBillingAmount': this.formateCurrency(this.chargesFlatBillingAmount), 'chargesBuildMethod': this.costPlusType, 'salesOrderId': this.salesOrderId }
        this.isSpinnerVisible = true;
        this.salesOrderService.createSOCharge(result).subscribe(result => {
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
                'Success',
                'Created Sales Order Charge Successfully',
                MessageSeverity.success
            );
            this.refreshOnDataSaveOrEditORDelete();
            //this.saveChargesListForSO.emit(this.chargesFlatBillingAmount);
            this.salesOrderService.getSalesQuoteCharges(this.salesOrderId, this.deletedStatusInfo).subscribe(response => {
                if (response.salesOrderCharges && response.salesOrderCharges.length > 0) {
                    this.salesOrderChargesList = response.salesOrderCharges;
                    //this.saveChargesListForSO.emit(this.salesOrderChargesList);
                    this.saveChargesListForSO.emit(response);
                }
            }, error => { });
        }, error => this.isSpinnerVisible = false)
        this.isSaveChargesDesabled = true;
        this.storedData = [];
    }

    delete() {
        this.deleteModal.close();
        this.isSpinnerVisible = true;
        if (!this.selectedRowForDelete.salesOrderChargesId) {
            this.selectedRowForDelete.isDeleted = true;
            this.isSpinnerVisible = false;
            if (this.storedData && this.storedData.length != 0) {
                this.storedData.forEach(element => {
                    if (
                        JSON.stringify(element) === JSON.stringify(this.selectedRowForDelete)
                    ) {
                        element.isDeleted = true;
                        this.salesOrderChargesList.splice(this.selectedRowIndexForDelete, 1);
                    }
                });
            }
            else {
                this.salesOrderChargesList.splice(this.selectedRowIndexForDelete, 1);
            }
            this.storedData = [...this.storedData];
            this.alertService.showMessage(
                '',
                'Deleted Sales Order Quote Freight Successfully',
                MessageSeverity.success
            );
        } else {
            let salesOrderChargesId = this.selectedRowForDelete.salesOrderChargesId;
            this.salesOrderService.deletesalesOrderChargesList(salesOrderChargesId, this.userName).subscribe(res => {
                this.alertService.showMessage(
                    '',
                    'Deleted Sales Order Charge Successfully',
                    MessageSeverity.success
                );
                this.isSpinnerVisible = false;
                this.refreshOnDataSaveOrEditORDelete(true);
            }, error => {
                this.isSpinnerVisible = false;
            })
        }
        $('#addNewCharges').modal('hide');
        this.isEdit = false;
        this.isSaveChargesDesabled = false;
    }

    markupChanged(matData, type) {
        try {
            this.markupList.forEach((markup) => {
                if (type == 'row' && markup.value == matData.markupPercentageId) {
                    matData.billingAmount = this.formateCurrency(Number(matData.extendedCost.toString().replace(/\,/g, '')) + ((Number(matData.extendedCost.toString().replace(/\,/g, '')) / 100) * Number(markup.label)))
                    matData.billingRate = this.formateCurrency(Number(matData.unitCost.toString().replace(/\,/g, '')) + ((Number(matData.unitCost.toString().replace(/\,/g, '')) / 100) * Number(markup.label)))
                }
                else if (type == 'all' && markup.value == this.overAllMarkup) {
                    this.salesOrderChargesList.forEach((mData) => {
                        if (mData.billingMethodId && Number(mData.billingMethodId) == 1) {
                            mData.markupPercentageId = Number(this.overAllMarkup);
                            mData.headerMarkupId = Number(this.costPlusType);
                            mData.billingAmount = this.formateCurrency(Number(mData.extendedCost.toString().replace(/\,/g, '')) + ((Number(mData.extendedCost.toString().replace(/\,/g, '')) / 100) * Number(markup.label)));
                            mData.billingRate = this.formateCurrency(Number(mData.unitCost.toString().replace(/\,/g, '')) + ((Number(mData.unitCost.toString().replace(/\,/g, '')) / 100) * Number(markup.label)))
                        }
                    })
                }
            })
        }
        catch (e) {
        }
    }

    tmchange() {
        for (let x of this.salesOrderChargesList) {
            x.billingMethodId = this.costPlusType;
            x.headerMarkupPercentageId = this.overAllMarkup;
            x.markupPercentageId = '';
            x.billingRate = '0.00';
            x.billingAmount = this.formateCurrency(Number(x.extendedCost.toString().replace(/\,/g, '')));
            if (this.costPlusType == 3) {
                x.billingAmount = '0.00';
                this.chargesFlatBillingAmount = '0.00';
            }
            this.overAllMarkup = '';
            x.headerMarkupPercentageId = this.overAllMarkup;
        }
    }

    getTotalAmount() {
        let total = 0;
        if (this.salesOrderChargesList) {
            this.salesOrderChargesList.forEach(
                (material) => {
                    total += Number(this.getTotalTaskAmount(material));
                }
            )
        }
        return this.formateCurrency(total);
    }

    getTotalTaskAmount(charge) {
        let total = 0;
        if (charge.extendedCost && !charge.isDeleted) {
            total += Number(charge.extendedCost.toString().replace(/\,/g, ''));
        }
        return total.toFixed(2);
    }

    getTotalBillingAmount() {
        let total = 0;
        if (this.salesOrderChargesList) {
            this.salesOrderChargesList.forEach(
                (material) => {
                    total += Number(this.getTotalTaskBillingAmount(material));
                }
            )
        }
        this.chargesFlatBillingAmount = total.toFixed(2);
        return this.formateCurrency(total);
    }

    getTotalTaskBillingAmount(charge) {
        let total = 0;
        if (charge.billingAmount && !charge.isDeleted) {
            total += Number(charge.billingAmount.toString().replace(/\,/g, ''));
        }
        return total.toFixed(2);
    }

    formateCurrency(amount) {
        return amount ? formatNumberAsGlobalSettingsModule(amount, 2) : '0.00';
    }

    // sum of extended cost 
    calculateExtendedCostSummation() {
        var charges = this.salesOrderChargesList.filter(x => x.isDelete != true);
        let totalExtendedCost = charges.reduce((acc, x) => {
            return acc + parseFloat(x.extendedCost == undefined || x.extendedCost === '' ? 0 : x.extendedCost.toString().replace(/\,/g, ''))
        }, 0);
        return totalExtendedCost;
    }

    calculateExtendedCost(charge): void {
        charge.unitCost = charge.unitCost ? formatNumberAsGlobalSettingsModule(charge.unitCost, 2) : '';
        var value = (parseFloat(charge.quantity.toString().replace(/\,/g, '')) * parseFloat(charge.unitCost.toString().replace(/\,/g, '')));
        if (value > 0) {
            charge.extendedCost = formatNumberAsGlobalSettingsModule(value, 2);
        }
        else {
            charge.extendedCost = "0.00";
        }
        this.calculateExtendedCostSummation();
    }

    filterVendor(event) {
        if (event && event.query != undefined) {
            this.vendorList(event.query)
        } else {
            this.vendorList('');
        }
    }

    setVendors() {
        for (var charge of this.salesOrderChargesList) {
            var vendor = this.allVendors.filter(x => x.vendorId == charge.vendorId)[0];
            if (vendor != undefined) {
                charge.vendor = {
                    vendorId: vendor.vendorId,
                    vendorName: vendor.vendorName
                };
            }
        }
    }

    openInterShipViaHistory(content, rowData) {
        if (rowData && rowData.salesOrderChargesId) {
            this.isSpinnerVisible = true;
            this.salesOrderService.getSOChargesHistory(rowData.salesOrderChargesId).subscribe(
                results => {
                    this.onAuditInterShipViaHistoryLoadSuccessful(results, content);
                    this.isSpinnerVisible = false;
                }, error => {
                    this.isSpinnerVisible = false;
                });
        }
    }

    private onAuditInterShipViaHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        for (let x of auditHistory) {
            x.unitCost = this.formateCurrency(Number(x.unitCost.toString().replace(/\,/g, '')));
            x.billingAmount = this.formateCurrency(Number(x.billingAmount.toString().replace(/\,/g, '')));
            x.extendedCost = this.formateCurrency(Number(x.extendedCost.toString().replace(/\,/g, '')));
        }
        this.chargesAudiHistory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, windowClass: 'assetMange' });
    }

    dismissModelHistory() {
        this.modal.close();
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.chargesAudiHistory;
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

    getDeleteListByStatus(value) {
        this.deletedStatusInfo = value ? value : false;
        this.refreshOnDataSaveOrEditORDelete();
    }

    restore(content, rowData, index) {
        this.restorerecord = rowData;
        this.deletedrowIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    dismissModelAlett() {
        this.modal.close();
    }

    restoreRecord() {
        if (this.restorerecord && this.restorerecord.salesOrderChargesId > 0) {
            this.isSpinnerVisible = true;
            this.commonService.updatedeletedrecords('SalesOrderCharges', 'SalesOrderChargesId', this.restorerecord.salesOrderChargesId).subscribe(res => {
                this.isSpinnerVisible = false;
                this.refreshOnDataSaveOrEditORDelete();
                this.modal.close();
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            }, err => {
                this.isSpinnerVisible = false;
            });
        } else {
            this.restorerecord.isDeleted = false;
            this.salesOrderChargesList.splice(this.deletedrowIndex, 1);
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

    deleteRow(index, form: NgForm): void {
        this.chargeForm.splice(index, 1);
    }

    enableUpdate() {
        this.isEnableUpdateButton = false;
    }

    validated() {
        this.isSaveChargesDesabled = false;
    }

    formatStringToNumberGlobal(val) {
        let tempValue = Number(val.toString().replace(/\,/g, ''));
        return formatStringToNumber(tempValue);
    }
}