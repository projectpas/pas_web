import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery';
// import { AlertService, MessageSeverity } from '../../../../../services/alert.service';
// import { WorkOrderService } from '../../../../../services/work-order/work-order.service';
// import { AuthService } from '../../../../../services/auth.service';
// import { CommonService } from '../../../../../services/common.service';
// import { formatNumberAsGlobalSettingsModule, getValueByFieldFromArrayofObject, getValueFromArrayOfObjectById, getObjectById, editValueAssignByCondition } from '../../../../../generic/autocomplete';
// import { SalesQuoteService } from '../../../../../services/salesquote.service';
// import { SalesOrderQuoteCharge } from '../../../../../models/sales/SalesOrderQuoteCharge';
// import { getModuleIdByName } from '../../../../../generic/enums';
// import { ActionService } from '../../../../../Workflow/ActionService';
// import { VendorService } from '../../../../../services/vendor.service';
import { forkJoin } from 'rxjs';
import { SalesOrderService } from '../../../../../../services/salesorder.service';
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';
import { AuthService } from '../../../../../../services/auth.service';
import { CommonService } from '../../../../../../services/common.service';
import { SalesOrderQuoteCharge } from '../../../../../../models/sales/SalesOrderQuoteCharge';
import { ActionService } from '../../../../../../Workflow/ActionService';
import { VendorService } from '../../../../../../services/vendor.service';
import { getModuleIdByName } from '../../../../../../generic/enums';
import { formatNumberAsGlobalSettingsModule, getValueByFieldFromArrayofObject, getValueFromArrayOfObjectById, getObjectById, editValueAssignByCondition } from '../../../../../../generic/autocomplete';
import { SalesOrderCharge } from '../../../../../../models/sales/SalesOrderCharge';



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
  markupList = [];
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
  // currencyList: any = [];
  salesOrderChargesLists: any;
  chargesFlatBillingAmount: any;
  isSpinnerVisible = false;
  chargesTypes = [];
  vendorCollection: any[] = [];
  allVendors = [];

  constructor(private salesOrderService: SalesOrderService,
    private authService: AuthService,
    private alertService: AlertService,
    private commonService: CommonService,
    private actionService: ActionService,
    private cdRef: ChangeDetectorRef,
    private vendorService: VendorService) {
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
    console.log(this.salesOrderChargesList);
    if (this.salesOrderChargesList && this.salesOrderChargesList.length > 0 && this.salesOrderChargesList[0].headerMarkupId) {
      this.costPlusType = this.salesOrderChargesList[0].markupFixedPrice;
      this.overAllMarkup = Number(this.salesOrderChargesList[0].headerMarkupId);
    }
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

  refresh(isView) {
    // this.isView = isView;
    this.isSpinnerVisible = true;
    forkJoin(this.salesOrderService.getSalesQuoteCharges(this.salesOrderId, 0),
      this.actionService.getCharges(),
      this.vendorService.getVendorsForDropdown(),
      this.commonService.smartDropDownList("[Percent]", "PercentId", "PercentValue")
    ).subscribe(res => {
      this.isSpinnerVisible = false;
      this.setChargesData(res[0]);
      this.chargesTypes = res[1];
      this.allVendors = res[2];
      this.markupList = res[3];
      this.setVendors();
    }, error => this.onDataLoadError(error));
  }

  refreshOnDataSaveOrEditORDelete(fromDelete = false) {
    this.isSpinnerVisible = true;
    this.salesOrderService.getSalesQuoteCharges(this.salesOrderId, 0).subscribe(res => {
      this.isSpinnerVisible = false;
      this.setChargesData(res);
      if (fromDelete) {
        this.getTotalBillingAmount();
        this.updateChargesListForSO.emit(this.chargesFlatBillingAmount);
      }
    }, error => this.onDataLoadError(error))

  }

  setChargesData(res) {
    if (res && res.length > 0) {
      this.salesOrderChargesList = res;
      this.setVendors();
      this.costPlusType = res[0].headerMarkupId;
      this.overAllMarkup = res[0].headerMarkupPercentageId;
      if (Number(this.costPlusType) == 3) {
        this.chargesFlatBillingAmount = res[0].markupFixedPrice;
      }
    } else {
      this.salesOrderChargesList = [];
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
    console.log(this.chargeForm);

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
    this.mainEditingIndex = mainIndex;
    this.isEdit = true;
    rowData.unitCost = this.formateCurrency(rowData.unitCost);
    rowData.extendedCost = this.formateCurrency(rowData.extendedCost);
    this.chargeForm = [rowData];
  }
  memoIndex;
  onAddTextAreaInfo(material, index) {
    this.memoIndex = index;
    console.log("memolist", material, index);
    this.textAreaInfo = material.memo;
  }
  textAreaInfo: any;
  onSaveTextAreaInfo(memo) {
    if (memo) {
      this.textAreaInfo = memo;
      console.log("hello cjkf", this.chargeForm)
      this.chargeForm[this.memoIndex].memo = this.textAreaInfo;
      console.log("index", this.chargeForm);
    }
    $("#textarea-popupFreight").modal("hide");
  }
  onCloseTextAreaInfo() {
    $("#textarea-popupFreight").modal("hide");
  }
  saveFreightList() {
    this.chargeForm = this.chargeForm.map(x => {
      return {
        ...x,
        billingAmount: this.formateCurrency(x.extendedCost),
        billingRate: this.formateCurrency(x.unitCost)
      }
    });
    if (this.isEdit) {
      if (this.costPlusType == 1) {
        this.markupChanged(this.chargeForm[0], 'row');
      }
      this.salesOrderChargesList[this.mainEditingIndex] = this.chargeForm[0];

      $('#addNewCharges').modal('hide');
      this.isEdit = false;
    }
    else {
      let temp = [];
      this.salesOrderChargesList.forEach((x) => {
        temp = [...temp, ...x];
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
  }

  createChargesQuote() {
    let temp = this.salesOrderChargesList;
    let sendData = []
    for (let index = 0; index < temp.length; index++) {
      sendData = [...sendData, ...temp[index]];

    }
    sendData = sendData.map((f) => {
      return {
        ...f, headerMarkupId: Number(this.costPlusType), headerMarkupPercentageId: this.overAllMarkup, markupFixedPrice: this.chargesFlatBillingAmount,
        vendorId: editValueAssignByCondition("vendorId", f.vendor)
      }
    })
    let result = { 'data': sendData, 'chargesFlatBillingAmount': this.formateCurrency(this.chargesFlatBillingAmount), 'FreightBuildMethod': this.costPlusType }
    this.isSpinnerVisible = true;
    this.salesOrderService.createSOQCharge(sendData).subscribe(result => {
      this.isSpinnerVisible = false;
      this.alertService.showMessage(
        '',
        'Created Sales Order Charge Successfully',
        MessageSeverity.success
      );
      this.refreshOnDataSaveOrEditORDelete();
      this.saveChargesListForSO.emit(this.chargesFlatBillingAmount);
    }, error => this.onDataLoadError(error))
  }

  delete(rowData, rowIndex) {

    if (!rowData.salesOrderChargesId) {
      rowData.isDeleted = true;
      this.salesOrderChargesList.splice(rowIndex, 1);
    } else {
      let salesOrderChargesId = rowData.salesOrderChargesId;
      this.salesOrderService.deletesalesOrderChargesList(salesOrderChargesId, this.userName).subscribe(res => {
        // this.updateChargesListForSO.emit(this.chargesFlatBillingAmount);
        this.alertService.showMessage(
          '',
          'Deleted Sales Order Charge Successfully',
          MessageSeverity.success
        );
        this.refreshOnDataSaveOrEditORDelete(true);
      }, error => this.onDataLoadError(error))
    }

    $('#addNewCharges').modal('hide');
    this.isEdit = false;

  }

  onDataLoadError(error) {
    this.isSpinnerVisible = false;
    let errorMessage = '';
    if (error.message) {
      errorMessage = error.message;
    }
    this.alertService.resetStickyMessage();
    this.alertService.showStickyMessage("Sales Order", errorMessage, MessageSeverity.error, error);
    // this.alertService.showMessage(error);
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
      console.log(e);
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
    this.vendorCollection = this.allVendors;
    const vendors = [
      ...this.allVendors.filter(x => {
        return x.vendorName.toLowerCase().includes(event.query.toLowerCase());
      })
    ];
    this.vendorCollection = vendors;
  }

  setVendors() {
    for (var charge of this.salesOrderChargesList) {
      var vendor = this.allVendors.filter(x => x.vendorId == charge.vendorId)[0];
      if (vendor != undefined) {
        console.log('Test')
        charge.vendor = {
          vendorId: vendor.vendorId,
          vendorName: vendor.vendorName
        };
      }
    }
  }
}