import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { ActionService } from "../Workflow/ActionService"
import { ICharges } from "../Workflow/Charges";
import { IChargesCurrency } from "../Workflow/ChargesCurrency";
import { IChargesType } from "../Workflow/ChargesType";
import { CurrencyService } from "../services/currency.service";
import { VendorService } from "../services/vendor.service";
import { AlertService, MessageSeverity } from "../services/alert.service";
import { getObjectById, formatNumberAsGlobalSettingsModule } from "../generic/autocomplete";
import { CommonService } from "../services/common.service";
declare var $ : any;

@Component({
    selector: 'grd-charges',
    templateUrl: './Charges-Create.component.html',
    styleUrls: ['./Charges-Create.component.css']
})
export class ChargesCreateComponent implements OnInit, OnChanges {
    vendorCollection: any[] = [];
    ccRegex: RegExp = /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;
    vendorCodes: any[] = [];
    allVendors: any[] = [];
    @Input() workFlow: IWorkFlow;
    @Input() UpdateMode: boolean;
    @Input() isWorkOrder: boolean;
    @Input() isEdit = false;
    @Input() markupList;
    @Input() isQuote = false;
    @Input() editData;
    @Input() taskList: any = [];
    @Input() isWorkFlow: boolean = false;
    @Output() saveChargesListForWO = new EventEmitter();
    @Output() updateChargesListForWO = new EventEmitter();
    @Output() notify: EventEmitter<IWorkFlow> = new EventEmitter<IWorkFlow>();

    chargesTypes: any[] = [];
    chargesCurrency: any[] = [];
    row: any;
    isSpinnerVisible = false;
    errorMessage: string;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    roNumList: any[] = [];

    constructor(private vendorservice: VendorService, private actionService: ActionService, 
        private currencyService: CurrencyService, private alertService: AlertService, 
        private commonService: CommonService) {
    }

    ngOnInit(): void {
        this.loadAllVendors();
        if (this.isWorkOrder) {
            this.row = this.workFlow.charges[0];
            if (this.isEdit) {
                this.workFlow.charges = [];
                const data = {
                    ...this.editData,

                    vendorId: this.editData.vendorId,
                    vendorName: this.editData.vendorName, vendor: {
                        vendorId: this.editData.vendorId,
                        vendorName: this.editData.vendorName
                    }
                }
                this.workFlow.charges.push(data);
                this.reCalculate()
            } else {
                this.workFlow.charges = [];
                this.workFlow.qtySummation = 0;
                this.workFlow.extendedCostSummation = 0;
                this.workFlow.totalChargesCost = 0;

                this.row = this.workFlow.charges[0];
                this.row.isShowDelete = (this.workFlow.charges && this.workFlow.charges.length != 0) ? true : false

                this.workFlow.charges = [];
                this.addRow();
            }
        } else {
            this.row = this.workFlow.charges[0];
            if (this.row == undefined) {
                this.row = {};
            } else {
                this.row.isShowDelete = (this.workFlow.charges && this.workFlow.charges.length != 0) ? true : false
            }
            this.row.taskId = this.workFlow.taskId;
            if (this.workFlow.charges.length > 0) {
                this.workFlow.charges.forEach((charge, index) => {
                    this.workFlow.charges[index].vendor = {
                        vendorId: this.workFlow.charges[index].vendorId,
                        vendorName: this.workFlow.charges[index].vendorName
                    }
                })
            }

        }
        this.isSpinnerVisible = true;
        let chargesIds = [];
        if (this.UpdateMode) {
            chargesIds = this.workFlow.charges.reduce((acc, x) => {
                return chargesIds.push(acc.chargeId);
            }, 0)
        }
        this.commonService.autoSuggestionSmartDropDownList('Charge', 'ChargeId', 'ChargeType', '', true, 20, chargesIds)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.chargesTypes = res.map(x => {
                    return {
                        ...x,
                        chargeId: x.value,
                        chargeType: x.label
                    }
                });
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    ngOnChanges(): void {
        if (this.workFlow) {
            if (this.workFlow.charges.length > 0) {
                this.workFlow.charges = this.workFlow.charges.map(x => {
                    return {
                        ...x,
                        quantity: x.quantity ? formatNumberAsGlobalSettingsModule(x.quantity, 0) : '0',
                        unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
                        extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00',
                        unitPrice: x.unitPrice ? formatNumberAsGlobalSettingsModule(x.unitPrice, 2) : '0.00',
                        extendedPrice: x.extendedPrice ? formatNumberAsGlobalSettingsModule(x.extendedPrice, 2) : '0.00'
                    }
                })
            }
        }
        if (this.UpdateMode) {
            this.reCalculate();
        }
        if (!this.isWorkFlow) {
            this.workFlow.charges = [];
            this.addRow();
        }
    }

    reCalculate() {

        this.calculateQtySummation();
        this.calculateExtendedCostSummation();
        this.calculateExtendedPriceSummation();
    }

    filterVendor(event) {

        this.vendorCollection = this.allVendors.filter(x => {
            if (x.vendorName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                return x;
            }
        });
    }

    onTaskChange(task) {
        this.taskList.forEach((t) => {
            if (t.taskId == task.taskId) {
                task['taskName'] = t.description;
            }
        })
    }

    onChargeTypeChange(event, charge): void {
        console.log("eveene",event, charge)
        this.isSpinnerVisible = true;
        var isTypeExist = this.workFlow.charges.filter(x => x.workflowChargeTypeId == charge.workflowChargeTypeId && x.taskId == this.workFlow.taskId);
        this.chargesTypes.forEach((ct) => {
            if (ct.chargeId == charge.workflowChargeTypeId) {
                charge.chargeType = ct.chargeType;

                this.commonService.getChargeData(charge.workflowChargeTypeId)
                    .subscribe(
                        res => {
                            this.isSpinnerVisible = false;
                            if (res) {
                                charge.memo = res.memo;
                                charge.glAccountName = res.glAccountName;
                            }
                        }, error => {
                            this.isSpinnerVisible = false;
                        });
            } else {
                this.isSpinnerVisible = false;
            }
        })
        if (isTypeExist.length > 1) {
            event.target.value = '0';
            charge.workflowChargeTypeId = "0";
            this.alertService.showMessage("Work Flow", "Type is already in use in Charges List.", MessageSeverity.error);
        }
    }

    private loadAllVendors() {
        this.isSpinnerVisible = true;
        let arrayVendlsit = []
        if (this.UpdateMode) {
            arrayVendlsit = this.workFlow.charges.reduce((acc, x) => {
                return arrayVendlsit.push(acc.vendorId);
            }, 0)
        }
        this.vendorservice.getVendorNameCodeListwithFilter('', 20, arrayVendlsit).subscribe(res => {
            this.allVendors = res.map(x => {
                this.isSpinnerVisible = false;
                return {
                    vendorId: x.vendorId,
                    vendorName: x.vendorName
                }
            });
            this.vendorCollection = this.allVendors;
        }, error => {
            this.isSpinnerVisible = false;
        });
    }

    onVendorSelected(charge, event) {
        if (charge.vendor != undefined) {
            charge.vendorId = charge.vendor.vendorId;
            charge.vendorName = charge.vendor.vendorName;
        }
        else {
            charge.vendorId = '';
            charge.vendorName = '';
        }
    }

    addRow(): void {
        var newRow = Object.assign({}, this.row);
        newRow.workflowChargesListId = "0";
        newRow.vendor = {};
        if (this.taskList) {
            this.taskList.forEach(
                task => {
                    if (task.description == "Assemble") {
                        newRow.taskId = task.taskId;
                    }
                }
            )
        }
        newRow.currencyId = "0";
        newRow.description = "";
        newRow.extendedCost = "0.00";
        newRow.extendedPrice = "0.00";
        newRow.forexRate = "";
        newRow.quantity = "";
        newRow.roNum = "";
        newRow.refNum = "";
        newRow.invoiceNum = "";
        newRow.unitCost = "0.00";
        newRow.unitPrice = "0.00";
        newRow.vendorUnitPrice = "";
        newRow.vendorId = "";
        newRow.vendorName = "";
        newRow.workflowChargeTypeId = "0";
        newRow.isDelete = false;
        newRow.isShowDelete = (this.workFlow.charges && this.workFlow.charges.length != 0) ? true : false
        this.workFlow.charges.push(newRow);

        if (this.workFlow.charges && this.workFlow.charges.length < 1) {
            this.workFlow.charges.forEach(element => {
                element.isShowDelete = false;
            });
        }
    }

    // calculate row wise extended cost
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
        //this.calculateExtendedPriceSummation();
    }

    // calculate row wise extended price
    calculateExtendedPrice(charge) {
        charge.unitPrice = charge.unitPrice ? formatNumberAsGlobalSettingsModule(charge.unitPrice, 2) : '';
        var value = parseFloat(charge.quantity.toString().replace(/\,/g, '')) * parseFloat(charge.unitPrice.toString().replace(/\,/g, ''));
        if (value > 0) {
            charge.extendedPrice = formatNumberAsGlobalSettingsModule(value, 2);
        }
        else {
            charge.extendedPrice = "0.00";
        }
        this.calculateExtendedPriceSummation();
    }

    validateQuantity(event, charges): void {
        if (event.target.value != '') {
            charges.quantity = formatNumberAsGlobalSettingsModule(charges.quantity, 0);
        }
    }

    // sum of the qty
    calculateQtySummation() {
        var charges = this.workFlow.charges.filter(x => x.isDelete != true);
        this.workFlow.qtySummation = charges.reduce((acc, x) => {
            return acc + parseFloat(x.quantity == undefined || x.quantity === '' ? 0 : x.quantity)
        }, 0);

        this.workFlow.qtySummation = this.workFlow.qtySummation ? formatNumberAsGlobalSettingsModule(this.workFlow.qtySummation, 2) : '0.00';
    }

    // sum of extended cost 
    calculateExtendedCostSummation() {
        var charges = this.workFlow.charges.filter(x => x.isDelete != true);
        this.workFlow.extendedCostSummation = charges.reduce((acc, x) => {
            return acc + parseFloat(x.extendedCost == undefined || x.extendedCost === '' ? 0 : x.extendedCost.toString().replace(/\,/g, ''))
        }, 0);

        this.workFlow.extendedCostSummation = this.workFlow.extendedCostSummation ? formatNumberAsGlobalSettingsModule(this.workFlow.extendedCostSummation, 2) : '0.00';
    }

    // sum of extended price
    calculateExtendedPriceSummation() {
        var charges = this.workFlow.charges.filter(x => x.isDelete != true);
        this.workFlow.totalChargesCost = charges.reduce((acc, x) => {
            //return acc + parseFloat(x.extendedPrice == undefined || x.extendedPrice === '' ? 0 : x.extendedPrice.toString().replace(/\,/g, ''))
            return acc + parseFloat(x.extendedCost == undefined || x.extendedCost === '' ? 0 : x.extendedCost.toString().replace(/\,/g, ''))
        }, 0);

        this.workFlow.totalChargesCost = formatNumberAsGlobalSettingsModule(this.workFlow.totalChargesCost, 2);
    }

    deleteRow(index): void {
        if (this.workFlow.charges[index].workflowChargesListId == undefined || this.workFlow.charges[index].workflowChargesListId == "0" || this.workFlow.charges[index].workflowChargesListId == "") {
            this.workFlow.charges.splice(index, 1);
        }
        else {
            this.workFlow.charges[index].isDelete = true;
        }
        this.reCalculate();
    }

    saveChargesWorkOrder() {
        this.saveChargesListForWO.emit(this.workFlow)
        this.workFlow.charges = [];
        this.addRow();
        this.workFlow.qtySummation = 0;
        this.workFlow.extendedCostSummation = 0;
        this.workFlow.totalChargesCost = 0;
    }

    updateChargesWorkOrder() {
        this.updateChargesListForWO.emit(this.workFlow);
        this.workFlow.charges = [];
        this.addRow();
        this.workFlow.qtySummation = 0;
        this.workFlow.extendedCostSummation = 0;
        this.workFlow.totalChargesCost = 0;
    }

    markupChanged(matData) {
        try {
            this.markupList.forEach((markup) => {
                if (markup.value == matData.markupPercentageId) {
                    matData.chargesCostPlus = (matData.extendedPrice) + (((matData.extendedPrice) / 100) * Number(markup.label))
                }
            })
        }
        catch (e) {
        }
    }

    getTotalCostPlusAmount() {
        let total = 0;
        this.workFlow.charges.forEach(
            (material) => {
                if (material.chargesCostPlus) {
                    total += material.chargesCostPlus;
                }
            }
        )
        return total;
    }

    close() {
        this.isEdit = false;
        this.editData = undefined;
        this.workFlow.charges = [];
        this.workFlow.qtySummation = 0;
        this.workFlow.totalChargesCost = 0;
        this.workFlow.extendedCostSummation = 0;
        $('#addNewCharges').modal('hide');
    }

    onDataLoadFailed(log) {
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
}