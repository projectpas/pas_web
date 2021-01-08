import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery';
import { AlertService, MessageSeverity } from '../../../../../services/alert.service';
import { WorkOrderService } from '../../../../../services/work-order/work-order.service';
import { AuthService } from '../../../../../services/auth.service';
import { CommonService } from '../../../../../services/common.service';
import { formatNumberAsGlobalSettingsModule, getValueByFieldFromArrayofObject, getValueFromArrayOfObjectById, getObjectById, editValueAssignByCondition } from '../../../../../generic/autocomplete';
import { SalesQuoteService } from '../../../../../services/salesquote.service';
import { SalesOrderQuoteCharge } from '../../../../../models/sales/SalesOrderQuoteCharge';
import { getModuleIdByName } from '../../../../../generic/enums';
import { ActionService } from '../../../../../Workflow/ActionService';
import { VendorService } from '../../../../../services/vendor.service';
import { forkJoin } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-sales-order-quote-charges',
  templateUrl: './sales-order-quote-charges.component.html',
  styleUrls: ['./sales-order-quote-charges.component.scss'],
  encapsulation: ViewEncapsulation.None

})

export class SalesOrderQuoteChargesComponent implements OnChanges, OnInit {
  @Input() salesOrderChargesList = [];
  @Input() chargeForm;
  @Input() customerId;
  @Input() salesOrderQuoteId: any;;
  @Output() saveChargesListForSO = new EventEmitter();
  @Output() updateChargesListForSO = new EventEmitter();
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
  // currencyList: any = [];
  salesOrderChargesLists: any;
  chargesFlatBillingAmount: any;
  isSpinnerVisible = false;
  chargesTypes = [];
  vendorCollection: any[] = [];
  allVendors = [];

  selectedRowForDelete;
  selectedRowIndexForDelete;
  deleteModal: NgbModalRef;
  modal: NgbModalRef;
  constructor(private salesOrderQuoteService: SalesQuoteService,
    private authService: AuthService,
    private alertService: AlertService,
    private commonService: CommonService,
    private actionService: ActionService,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private vendorService: VendorService) {
  }
  ngOnInit() {
    if (this.chargeForm) {
      let newFreight = new SalesOrderQuoteCharge();
      newFreight.unitCost = this.formateCurrency(newFreight.unitCost);
      newFreight.salesOrderQuoteId = this.salesOrderQuoteId;
      this.chargeForm = [...this.chargeForm, new SalesOrderQuoteCharge()];
    }
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
    this.isView = isView;
    this.isSpinnerVisible = true;
    forkJoin(this.salesOrderQuoteService.getSalesQuoteCharges(this.salesOrderQuoteId),
      this.actionService.getCharges(),
      this.vendorService.getVendorsForDropdown()
    ).subscribe(res => {
      this.isSpinnerVisible = false;
      this.setChargesData(res[0]);
      this.chargesTypes = res[1];
      this.allVendors = res[2];
      this.setVendors();
    }, error => {
      this.isSpinnerVisible = false;
      const errorLog = error;
      this.onDataLoadFailed(errorLog)
    });
  }

  refreshOnDataSaveOrEditORDelete(fromDelete = false) {
    this.isSpinnerVisible = true;
    this.salesOrderQuoteService.getSalesQuoteCharges(this.salesOrderQuoteId).subscribe(res => {
      this.isSpinnerVisible = false;
      this.setChargesData(res);
      if (fromDelete) {
        this.getTotalBillingAmount();
        this.updateChargesListForSO.emit(this.chargesFlatBillingAmount);
      }
    }, error => {
      this.isSpinnerVisible = false;
      const errorLog = error;
      this.onDataLoadFailed(errorLog)
    })

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
    let newFreight = this.getNewChargeObject();
    this.chargeForm = [newFreight];

  }

  getNewChargeObject() {
    let newFreight = new SalesOrderQuoteCharge();
    newFreight.unitCost = this.formateCurrency(newFreight.unitCost);
    newFreight.extendedCost = this.formateCurrency(newFreight.extendedCost);
    newFreight.salesOrderQuoteId = this.salesOrderQuoteId;
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
    this.salesOrderQuoteService.createSOQCharge(sendData).subscribe(result => {
      this.isSpinnerVisible = false;
      this.alertService.showMessage(
        '',
        'Created Sales Order Charge Successfully',
        MessageSeverity.success
      );
      this.refreshOnDataSaveOrEditORDelete();
      this.saveChargesListForSO.emit(this.chargesFlatBillingAmount);
    }, error => {
      this.isSpinnerVisible = false;
      const errorLog = error;
      this.onDataLoadFailed(errorLog)
    })
  }

  delete() {
    this.deleteModal.close();
    this.isSpinnerVisible = true;
    if (!this.selectedRowForDelete.salesOrderQuoteChargesId) {
      this.selectedRowForDelete.isDeleted = true;
      this.isSpinnerVisible = false;
      this.salesOrderChargesList.splice(this.selectedRowIndexForDelete, 1);
    } else {
      let salesOrderQuoteChargesId = this.selectedRowForDelete.salesOrderQuoteChargesId;
      this.salesOrderQuoteService.deletesalesOrderChargesList(salesOrderQuoteChargesId, this.userName).subscribe(res => {
        this.alertService.showMessage(
          '',
          'Deleted Sales Order Charge Successfully',
          MessageSeverity.success
        );
        this.isSpinnerVisible = false;
        this.refreshOnDataSaveOrEditORDelete(true);
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      })
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
    this.alertService.showStickyMessage("SO Quote", errorMessage, MessageSeverity.error, error);
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
        charge.vendor = {
          vendorId: vendor.vendorId,
          vendorName: vendor.vendorName
        };
      }
    }
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
  chargesAudiHistory:any=[];
  openInterShipViaHistory(content, rowData) {
      if(rowData && rowData.salesOrderQuoteChargesId){
      this.salesOrderQuoteService.getSOQChargesHistory(rowData.salesOrderQuoteChargesId).subscribe(
          results => this.onAuditInterShipViaHistoryLoadSuccessful(results, content),error => {
              this.isSpinnerVisible = false;
              const errorLog = error;
              this.onDataLoadFailed(errorLog)
          });
      }
  }
  private onAuditInterShipViaHistoryLoadSuccessful(auditHistory, content) {
      this.alertService.stopLoadingMessage();
      this.chargesAudiHistory = auditHistory;
      this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false,windowClass:'assetMange' });

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
}