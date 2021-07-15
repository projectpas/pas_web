import { Component, OnInit, Input, Output, EventEmitter, OnChanges,ViewEncapsulation } from '@angular/core';
declare var $: any;
import { AlertService, MessageSeverity } from '../../../../../services/alert.service';
import { AuthService } from '../../../../../services/auth.service';
import { CommonService } from '../../../../../services/common.service';
import { formatNumberAsGlobalSettingsModule, editValueAssignByCondition, formatStringToNumber } from '../../../../../generic/autocomplete';
import { ExchangeSalesOrderService } from "../../../../../services/exchangesalesorder.service";
import { ExchangeSalesOrderCharge } from '../../../../../models/exchange/ExchangeSalesOrderCharge';
import { ActionService } from '../../../../../Workflow/ActionService';
import { VendorService } from '../../../../../services/vendor.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from "@angular/forms";
@Component({
  selector: 'app-exchange-sales-order-charges',
  templateUrl: './exchange-sales-order-charges.component.html',
  styleUrls: ['./exchange-sales-order-charges.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExchangeSalesOrderChargesComponent implements OnChanges, OnInit {
  @Input() exchangeQuoteChargesList = [];
  @Input() chargeForm;
  @Input() customerId;
  @Input() exchangeQuoteId: any;;
  @Output() saveChargesListForSO = new EventEmitter<{amount:number, cost:number}>();
  @Output() updateChargesListForSO = new EventEmitter<{amount:number, cost:number}>();
  @Output() refreshData = new EventEmitter();
  @Input() view: boolean = false;
  @Input() isQuote = false;
  @Input() markupList;
  @Input() isView: boolean = false;
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
  exchangeQuoteChargesLists: any;
  chargesFlatBillingAmount: any;
  isSpinnerVisible = false;
  chargesTypes = [];
  vendorCollection: any[] = [];
  allVendors = [];
  selectedRowForDelete;
  selectedRowIndexForDelete;
  deleteModal: NgbModalRef;
  modal: NgbModalRef;
  isUpdate: boolean = false;
  frieghtsCreateForm: any;
  storedData: any = [];
  chargesFlatExtendedCost: any;
  constructor(private exchangeSalesOrderService: ExchangeSalesOrderService,
    private authService: AuthService,
    private alertService: AlertService,
    private commonService: CommonService,
    private actionService: ActionService,
    private modalService: NgbModal,
    private vendorService: VendorService) { }

  ngOnInit() {
    if (this.chargeForm) {
      let newFreight = new ExchangeSalesOrderCharge();
      newFreight.unitCost = this.formateCurrency(newFreight.unitCost);
      newFreight.exchangeSalesOrderId = this.exchangeQuoteId;
      this.chargeForm = [...this.chargeForm, new ExchangeSalesOrderCharge()];
    }
    if (this.exchangeQuoteChargesList && this.exchangeQuoteChargesList.length > 0 && this.exchangeQuoteChargesList[0].headerMarkupId) {
      this.costPlusType = this.exchangeQuoteChargesList[0].markupFixedPrice;
      this.overAllMarkup = Number(this.exchangeQuoteChargesList[0].headerMarkupId);
    }
    this.isView = this.isView ? this.isView : false;
  }
  ngOnChanges() {
    if (this.exchangeQuoteChargesList && this.exchangeQuoteChargesList.length > 0 && this.exchangeQuoteChargesList[0].headerMarkupId) {
      this.costPlusType = this.exchangeQuoteChargesList[0].headerMarkupId;
      this.overAllMarkup = Number(this.exchangeQuoteChargesList[0].headerMarkupPercentageId);
    }
    if (this.exchangeQuoteChargesList) {
      this.exchangeQuoteChargesList = [];
      for (let x in this.exchangeQuoteChargesLists) {
        this.exchangeQuoteChargesList.push(this.exchangeQuoteChargesLists[x]);
      }
    }
  }
  arrayPercentList: any = [];
  refresh(isView) {
    this.isSpinnerVisible = true;
    this.arrayPercentList.push(0);
    forkJoin(this.exchangeSalesOrderService.getExchangeSalesOrderCharges(this.exchangeQuoteId, this.deletedStatusInfo),
      this.actionService.getCharges(),
      this.commonService.autoSuggestionSmartDropDownList("[Percent]", "PercentId", "PercentValue", '', true, 200, this.arrayPercentList.join(), this.currentUserMasterCompanyId)
    ).subscribe(res => {
      this.isSpinnerVisible = false;
      this.setChargesData(res[0]);
      this.setVendors();
      this.markupList = res[2];
    }, error => {
      this.isSpinnerVisible = false;
    });
    this.getChargesDatya('');
    this.vendorList('');
  }
  setEditArray: any = [];
  getChargesDatya(value) {
    this.setEditArray = [];
    if (this.isEdit == true) {
      this.setEditArray.push(this.chargeForm[0].chargesTypeId ? this.chargeForm[0].chargesTypeId : 0);
    } else {
      this.setEditArray.push(0);
    }
    const strText = value ? value : '';
    this.commonService.autoSuggestionSmartDropDownList('Charge', 'ChargeId', 'ChargeType', strText, true, 20, this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
      this.chargesTypes = res.map(x => {
        return {
          chargeType: x.label,
          chargeId: x.value
        }
      });
    },
      err => {
        this.isSpinnerVisible = false;
      });
  }
  deletedStatusInfo: any = false;
  getDeleteListByStatus(value) {
    this.deletedStatusInfo = value ? value : false;
    this.refreshOnDataSaveOrEditORDelete();
  }

  restorerecord: any = {}
  setChargesData(res) {
    if (res && res.length > 0) {
      this.exchangeQuoteChargesList = res;
      this.setVendors();
      this.costPlusType = res[0].headerMarkupId;
      this.overAllMarkup = res[0].headerMarkupPercentageId;
      if (Number(this.costPlusType) == 3) {
        this.chargesFlatBillingAmount = res[0].markupFixedPrice;
      }
      this.isUpdate = true;
    } else {
      this.exchangeQuoteChargesList = [];
      this.isUpdate = false;
    }
    this.chargeForm = [];
    this.exchangeQuoteChargesLists = [];
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }
  get currentUserMasterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : null;
  }
  createNew() {
    this.isEdit = false;
    let newFreight = this.getNewChargeObject();
    this.chargeForm = [newFreight];
  }
  getNewChargeObject() {
    let newFreight = new ExchangeSalesOrderCharge();
    newFreight.unitCost = this.formateCurrency(newFreight.unitCost);
    newFreight.extendedCost = this.formateCurrency(newFreight.extendedCost);
    newFreight.exchangeSalesOrderId = this.exchangeQuoteId;
    newFreight.billingMethodId = this.costPlusType;
    newFreight.createdBy = this.userName;
    newFreight.createdDate = new Date();
    newFreight.updatedBy = this.userName;
    newFreight.updatedDate = new Date();
    newFreight.headerMarkupPercentageId = this.overAllMarkup;
    newFreight.headerMarkupId = this.costPlusType;
    newFreight.unitCost = this.formateCurrency(Number(newFreight.unitCost.toString().replace(/\,/g, '')));
    newFreight.billingRate = this.formateCurrency(Number(newFreight.unitCost.toString().replace(/\,/g, '')));
    newFreight.extendedCost = this.formateCurrency(Number(newFreight.extendedCost.toString().replace(/\,/g, '')));
    newFreight.billingAmount = this.formateCurrency(Number(newFreight.extendedCost.toString().replace(/\,/g, '')));
    return newFreight;
  }
  addNewRow() {
    let newFreight = this.getNewChargeObject();
    this.chargeForm = [...this.chargeForm, newFreight];
  }

  edit(rowData, mainIndex) {
    this.isEnableUpdateButton = true;
    this.mainEditingIndex = mainIndex;
    this.isEdit = true;
    rowData.unitCost = this.formateCurrency(rowData.unitCost);
    rowData.extendedCost = this.formateCurrency(rowData.extendedCost);
    this.chargeForm = [rowData];
    this.vendorList('');
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

  saveFreightList() {
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
      this.exchangeQuoteChargesList[this.mainEditingIndex] = this.chargeForm[0];

      $('#addNewCharges').modal('hide');
      this.isEdit = false;
    }
    else {
      let temp = [];
      this.exchangeQuoteChargesList.forEach((x) => {
        if (typeof x[Symbol.iterator] === 'function')
          temp = [...temp, ...x];
        else
          temp = [...temp, x];
      })
      temp = [...temp, ...this.chargeForm];
      this.exchangeQuoteChargesLists = temp;
      this.exchangeQuoteChargesList = [];
      for (let x in this.exchangeQuoteChargesLists) {
        this.exchangeQuoteChargesList.push(this.exchangeQuoteChargesLists[x]);
      }
      if (this.costPlusType == 1) {
        this.markupChanged({}, 'all');
      }
      $('#addNewCharges').modal('hide');
    }
    this.isEnableUpdateButton = true;
    this.isSaveChargesDesabled = false;
    this.storedData = [...this.exchangeQuoteChargesList];
  }

  createChargesQuote() {
    let temp = this.exchangeQuoteChargesList;
    let sendData = []
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
    let result = { 'data': sendData, 'chargesFlatBillingAmount': this.formateCurrency(this.chargesFlatBillingAmount), 'FreightBuildMethod': this.costPlusType }
    this.isSpinnerVisible = true;
    this.exchangeSalesOrderService.createExchangeSalesOrderCharge(sendData).subscribe(result => {
      this.isSpinnerVisible = false;
      this.alertService.showMessage(
        '',
        'Created Exchange Sales Order Charge Successfully',
        MessageSeverity.success
      );
      this.refreshOnDataSaveOrEditORDelete();
      //this.saveChargesListForSO.emit(this.chargesFlatBillingAmount);
      this.saveChargesListForSO.emit({amount:this.chargesFlatBillingAmount, cost:this.chargesFlatExtendedCost});
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
          matData.billingAmount = this.formateCurrency(Number(matData.extendedCost.toString().replace(/\,/g, '')) + ((Number(matData.extendedCost.toString().replace(/\,/g, '')) / 100) * Number(markup.label)))
          matData.billingRate = this.formateCurrency(Number(matData.unitCost.toString().replace(/\,/g, '')) + ((Number(matData.unitCost.toString().replace(/\,/g, '')) / 100) * Number(markup.label)))
        }
        else if (type == 'all' && markup.value == this.overAllMarkup) {
          this.exchangeQuoteChargesList.forEach((mData) => {
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
    for (let x of this.exchangeQuoteChargesList) {
      x.billingMethodId = this.costPlusType;
      x.headerMarkupId = this.costPlusType;
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
    if (this.exchangeQuoteChargesList) {
      this.exchangeQuoteChargesList.forEach(
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
    if (this.exchangeQuoteChargesList) {
      this.exchangeQuoteChargesList.forEach(
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
    var charges = this.exchangeQuoteChargesList.filter(x => x.isDelete != true);
    let totalExtendedCost = charges.reduce((acc, x) => {
      return acc + parseFloat(x.extendedCost == undefined || x.extendedCost === '' ? 0 : x.extendedCost.toString().replace(/\,/g, ''))
    }, 0);
    this.chargesFlatExtendedCost = totalExtendedCost;
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

  dismissModelAlett() {
    this.modal.close();
  }

  openDelete(content, rowData, rowIndex) {
    this.selectedRowForDelete = rowData;
    this.selectedRowIndexForDelete = rowIndex;
    this.deleteModal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
  }

  dismissModel() {
    this.deleteModal.close();
  }

  chargesAudiHistory: any = [];
  openInterShipViaHistory(content, rowData) {
    if (rowData && rowData.exchangeSalesOrderChargesId) {
      this.exchangeSalesOrderService.getExchangeSalesOrderChargesHistory(rowData.exchangeSalesOrderChargesId).subscribe(
        results => this.onAuditInterShipViaHistoryLoadSuccessful(results, content), error => {
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

  isEnableUpdateButton: boolean = true;
  enableUpdate() {
    this.isEnableUpdateButton = false;
  }

  isSaveChargesDesabled: boolean = true;
  validated() {
    this.isSaveChargesDesabled = false;
  }

  deleteRow(index, form: NgForm): void {
    this.chargeForm.splice(index, 1);
  }
  arrayVendlsit: any = [];

  private vendorList(value) {
    this.arrayVendlsit = [];
    if (this.isEdit == true) {
      this.exchangeQuoteChargesList.forEach(element => {
        this.arrayVendlsit.push(element.vendorId);
      });
    }
    this.arrayVendlsit.push(0);
    this.vendorService.getVendorNameCodeListwithFilter(value, 20, this.arrayVendlsit.join(),this.currentUserMasterCompanyId).subscribe(res => {
      this.allVendors = res.map(x => {
        return {
          vendorId: x.vendorId,
          vendorName: x.vendorName
        }
      });
      this.vendorCollection = this.allVendors;
    }, err => {
      this.isSpinnerVisible = false;
    })
  }

  filterVendor(event) {
    if (event && event.query != undefined) {
      this.vendorList(event.query)
    } else {
      this.vendorList('');
    }
  }

  setVendors() {
    for (var charge of this.exchangeQuoteChargesList) {
      var vendor = this.allVendors.filter(x => x.vendorId == charge.vendorId)[0];
      if (vendor != undefined) {
        charge.vendor = {
          vendorId: vendor.vendorId,
          vendorName: vendor.vendorName
        };
      }
    }
  }

  formatStringToNumberGlobal(val) {
    let tempValue = Number(val.toString().replace(/\,/g, ''));
    return formatStringToNumber(tempValue)
  }

  refreshOnDataSaveOrEditORDelete(fromDelete = false) {
    this.isSpinnerVisible = true;
    this.exchangeQuoteChargesList = [];
    this.exchangeSalesOrderService.getExchangeSalesOrderCharges(this.exchangeQuoteId, this.deletedStatusInfo).subscribe(res => {
      this.isSpinnerVisible = false;
      //Handeling offline Records also
      if (this.storedData && this.storedData.length != 0) {
        if (this.deletedStatusInfo == true) {
          this.deletedStatusInfo = true;
          this.storedData.forEach(element => {
            if (element.isDeleted == true && element.exchangeSalesOrderChargesId == 0) {
              res.push(element);
            }
          });
        }
        else {
          this.deletedStatusInfo = false;
          this.storedData.forEach(element => {
            if (element.isDeleted == false && element.exchangeSalesOrderChargesId == 0) {
              res.push(element)
            }
          });
        }
        this.setChargesData(res);
      }
      else {
        this.setChargesData(res);
      }
      if (fromDelete) {
        this.getTotalBillingAmount();
        //this.updateChargesListForSO.emit(this.chargesFlatBillingAmount,this.chargesFlatExtendedCost);
        this.updateChargesListForSO.emit({amount:this.chargesFlatBillingAmount, cost:this.chargesFlatExtendedCost});
      }
    }, error => {
      this.isSpinnerVisible = false;
    })
  }

  delete() {
    this.deleteModal.close();
    this.isSpinnerVisible = true;
    if (!this.selectedRowForDelete.exchangeSalesOrderChargesId) {
      this.selectedRowForDelete.isDeleted = true;
      this.isSpinnerVisible = false;
      if (this.storedData && this.storedData.length != 0) {
        this.storedData.forEach(element => {
          if (
            JSON.stringify(element) === JSON.stringify(this.selectedRowForDelete)
          ) {
            element.isDeleted = true;
            this.exchangeQuoteChargesList.splice(this.selectedRowIndexForDelete, 1);
          }
        });
      }
      else {
        this.exchangeQuoteChargesList.splice(this.selectedRowIndexForDelete, 1);
      }
      this.storedData = [...this.storedData];
      this.alertService.showMessage(
        '',
        'Deleted Exchange Sales Order Charge Successfully',
        MessageSeverity.success
      );
    } else {
      let exchangeSalesOrderChargesId = this.selectedRowForDelete.exchangeQuoteSalesOrderChargesId;
      this.exchangeSalesOrderService.deleteexchangeSalesOrderChargesList(exchangeSalesOrderChargesId, this.userName).subscribe(res => {
        this.alertService.showMessage(
          '',
          'Deleted Exchange Sales Order Charge Successfully',
          MessageSeverity.success
        );
        this.isSpinnerVisible = false;
        this.refreshOnDataSaveOrEditORDelete(true);
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
      })
    }

    $('#addNewCharges').modal('hide');
    this.isEdit = false;
    this.isSaveChargesDesabled = false;
  }

  restoreRecord() {
    if (this.restorerecord && this.restorerecord.exchangeSalesOrderChargesId > 0) {
      this.commonService.updatedeletedrecords('ExchangeSalesOrderCharges', 'ExchangeSalesOrderChargesId', this.restorerecord.exchangeSalesOrderChargesId).subscribe(res => {
        this.refreshOnDataSaveOrEditORDelete();
        this.modal.close();
        this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
      },
        err => {
          this.isSpinnerVisible = false;
        });
    }
    else {
      this.restorerecord.isDeleted = false;
      this.exchangeQuoteChargesList.splice(this.deletedrowIndex, 1);
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

  deletedrowIndex: any;
  restore(content, rowData, index) {
    this.restorerecord = rowData;
    this.deletedrowIndex = index;
    this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
  }
}