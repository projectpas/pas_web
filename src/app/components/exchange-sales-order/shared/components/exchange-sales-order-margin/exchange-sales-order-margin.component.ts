import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { PartDetail } from "../../models/part-detail";
import { CommonService } from '../../../../../services/common.service';
import { ItemMasterSearchQuery } from "../../../models/item-master-search-query";
import { formatStringToNumber } from "../../../../../generic/autocomplete";
import { ExchangeSalesOrderScheduleBilling } from "../../models/exchangeSalesOrderScheduleBilling";
import { AuthService } from "../../../../../services/auth.service";
import * as moment from 'moment';
import {
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { editValueAssignByCondition, getValueFromArrayOfObjectById, getObjectByValue, getObjectById, formatNumberAsGlobalSettingsModule, getValueFromObjectByKey } from '../../../../../generic/autocomplete';
@Component({
  selector: 'app-exchange-sales-order-margin',
  templateUrl: './exchange-sales-order-margin.component.html',
  styleUrls: ['./exchange-sales-order-margin.component.scss']
})
export class ExchangeSalesOrderMarginComponent implements OnInit {
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() save: EventEmitter<PartDetail> = new EventEmitter<PartDetail>();
  @Input() part: PartDetail;
  @Input() display: boolean;
  @Input() isEdit: boolean;
  query: ItemMasterSearchQuery;
  percentage: any[] = [];
  invalidQuantityenteredForQuantityFromThis: boolean = false;
  @ViewChild("errorMessagePop", { static: false }) public errorMessagePop: ElementRef;
  errorModal: NgbModalRef;
  currencyArr: any[] = [];
  isDisable: boolean = false;
  constructor(private commonservice: CommonService, private modalService: NgbModal, private authService: AuthService,) { }

  ngOnInit() {
    this.getPercents();
    this.calculate();
    this.getCurrency();
    this.isDisable = false;
    if (this.part.exchangeQuotePartId > 0) {
      this.isDisable = true;
      this.part.entryDate = new Date(this.part.entryDate);
      this.part.billingStartDate = new Date(this.part.billingStartDate);
      this.part.coreDueDate = new Date(this.part.coreDueDate);
      setTimeout(() => {
        this.setSchesuleBilling(this.part.exchangeSalesOrderScheduleBilling.length);
      }, 500);
    }
  }
  formatStringToNumberGlobal(val) {
    return formatStringToNumber(val)
  }

  getPercents() {
    this.commonservice.smartDropDownList('[Percent]', 'PercentId', 'PercentValue',this.authService.currentUser.masterCompanyId).subscribe(res => {
      this.percentage = res;
      //console.log("this.percentage" , this.percentage);
    })
  }
  getCurrency() {
    this.commonservice.smartDropDownList('[Currency]', 'CurrencyId', 'Code',this.authService.currentUser.masterCompanyId).subscribe(res => {
      this.currencyArr = res;
      // this.part.exchangeCurrencyId = getValueFromArrayOfObjectById(
      //   'label',
      //   'value',
      //   this.part.exchangeCurrencyId,
      //   this.currencyArr
      // ),
      //this.part.exchangeCurrencyId = getObjectById('value', this.part.exchangeCurrencyId, this.currencyArr);
      console.log("this.currencyArr", this.currencyArr);
    })
  }

  onClose(event: Event): void {
    event.preventDefault();
    this.close.emit(true);
  }

  onSave(event: Event): void {
    event.preventDefault();
    this.save.emit(this.part);
    console.log("this.part", this.part);
  }

  showPartNumberModal() {
    var btnPartDetail: any = document.querySelector("#addPartNumber");
    if (btnPartDetail) {
      btnPartDetail.click();
    }
  }

  calculate() {
    if (this.part) {
      this.calculatePart();
    }
  }

  calculatePart() {
    try {
      this.part.salesPriceExtended = Number(this.part.salesPricePerUnit) * Number(this.part.quantityFromThis);
      this.part.markupPerUnit = + (Number(this.part.salesPricePerUnit) * (Number(this.part.markUpPercentage) / 100)).toFixed(2);
      this.part.markupExtended = + (Number(this.part.markupPerUnit) * Number(this.part.quantityFromThis)).toFixed(2);
      this.part.salesDiscountPerUnit = + ((Number(this.part.salesDiscount) / 100) * (Number(this.part.salesPricePerUnit) + Number(this.part.markupPerUnit))).toFixed(2);
      this.part.salesDiscountExtended = +(Number(this.part.salesDiscountPerUnit) * Number(this.part.quantityFromThis)).toFixed(2);
      this.part.netSalesPricePerUnit = +(Number(this.part.salesPricePerUnit) + Number(this.part.markupPerUnit) - Number(this.part.salesDiscountPerUnit)).toFixed(2);
      this.part.netSalesPriceExtended = +(Number(this.part.salesPriceExtended) + Number(this.part.markupExtended) - Number(this.part.salesDiscountExtended)).toFixed(2);
      this.part.taxAmount = +((Number(this.part.netSalesPriceExtended) / 100) * Number(this.part.taxPercentage)).toFixed(2);
      this.part.marginAmountPerUnit = +(Number(this.part.netSalesPricePerUnit) - Number(this.part.unitCostPerUnit)).toFixed(2);
      this.part.marginAmountExtended = +(Number(this.part.marginAmountPerUnit) * Number(this.part.quantityFromThis)).toFixed(2);
      this.part.unitCostExtended = +(Number(this.part.unitCostPerUnit) * Number(this.part.quantityFromThis)).toFixed(2);
      if (Number(this.part.netSalesPricePerUnit) > 0) {
        this.part.marginPercentagePerUnit = +((Number(this.part.marginAmountPerUnit) / Number(this.part.netSalesPricePerUnit)) * 100).toFixed(2);
      } else {
        this.part.marginPercentagePerUnit = 0;
      }
      if (Number(this.part.netSalesPriceExtended) > 0) {
        this.part.marginPercentageExtended = +((Number(this.part.marginAmountExtended) / Number(this.part.netSalesPriceExtended)) * 100).toFixed(2);
      } else {
        this.part.marginPercentageExtended = 0;
      }
      this.part.grossSalePrice = Number(this.part.salesPriceExtended) + Number(this.part.markupExtended);
      this.part.grossSalePricePerUnit = Number(this.part.salesPricePerUnit) + Number(this.part.markupPerUnit);
      this.part.totalSales = +(Number(this.part.netSalesPriceExtended) + Number(this.part.taxAmount)).toFixed(2);
      this.part.estOfFeeBilling = this.part.estOfFeeBilling;
    }
    catch (e) {
    }
  }

  onChangeQuantityFromThis(event) {
    if (Number(this.part.quantityFromThis) != 0) {
      if (this.part['qtyRemainedToQuote']) {
        this.invalidQuantityenteredForQuantityFromThis = this.part.quantityFromThis > this.part.quantityToBeQuoted && Number(this.part.quantityFromThis) > Number(this.part['qtyRemainedToQuote']);
      }
      else {
        this.invalidQuantityenteredForQuantityFromThis = this.part.quantityFromThis > this.part.quantityToBeQuoted;
      }
    } else {
      this.invalidQuantityenteredForQuantityFromThis = true;
    }
  }
  sBilling: any = [];
  isScheduleBilling: boolean = false;
  errorMessages: any[] = [];
  addSchesuleBilling(event) {
    //debugger;
    event.preventDefault();
    console.log("event", event.target.value);
    let count = event.target.value;
    this.errorMessages = [];
    let haveError = false;
    if (this.part.estOfFeeBilling <= 0) {
      this.errorMessages.push("Please enter Est of fee belling");
      haveError = true;
    }
    if (this.part.billingIntervalDays <= 0) {
      this.errorMessages.push("Please enter billing interval days");
      haveError = true;
    }
    if (haveError) {
      let content = this.errorMessagePop;
      this.errorModal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
      //this.display = true;
    }
    else {
      this.part.exchangeSalesOrderScheduleBilling = [];
      for (let i = 0; i < count; i++) {
        let scheduleBillingObject = new ExchangeSalesOrderScheduleBilling();
        if (i == 0) {
          scheduleBillingObject = {
            ...scheduleBillingObject,
            periodicBillingAmount: this.part.exchangeListPrice,
            scheduleBillingDate: this.part.billingStartDate,
            cogs: getValueFromArrayOfObjectById(
              'label',
              'value',
              this.part.cogs,
              this.percentage
            ),
            cogsAmount: (this.part.exchangeListPrice * getValueFromArrayOfObjectById('label', 'value', this.part.cogs, this.percentage)) / 100,
          }
        }
        else {
          let newDate = new Date(this.part.exchangeSalesOrderScheduleBilling[i - 1].scheduleBillingDate);
          newDate.setDate(new Date(this.part.exchangeSalesOrderScheduleBilling[i - 1].scheduleBillingDate).getDate() + Number(this.part.billingIntervalDays));
          scheduleBillingObject = {
            ...scheduleBillingObject,
            periodicBillingAmount: this.part.exchangeListPrice,
            scheduleBillingDate: newDate,
            cogs: getValueFromArrayOfObjectById(
              'label',
              'value',
              this.part.cogs,
              this.percentage
            ),
            cogsAmount: (this.part.exchangeListPrice * getValueFromArrayOfObjectById('label', 'value', this.part.cogs, this.percentage)) / 100,
          }
        }
        //console.log(scheduleBillingObject);
        this.sBilling.push(scheduleBillingObject);
        //console.log(this.sBilling);
        this.isScheduleBilling = true;
        this.part.exchangeSalesOrderScheduleBilling.push(scheduleBillingObject);
        console.log(this.part.exchangeSalesOrderScheduleBilling);
      }
    }
  }

  addSchesuleBillingIntervalDays() {
    this.errorMessages = [];
    let haveError = false;
    if (this.part.estOfFeeBilling <= 0) {
      this.errorMessages.push("Please enter Est of fee belling");
      haveError = true;
    }
    if (this.part.billingIntervalDays <= 0) {
      this.errorMessages.push("Please enter billing interval days");
      haveError = true;
    }
    if (haveError) {
      let content = this.errorMessagePop;
      this.errorModal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
      //this.display = true;
    }
    else {
      this.part.exchangeSalesOrderScheduleBilling = [];
      for (let i = 0; i < this.part.estOfFeeBilling; i++) {
        let scheduleBillingObject = new ExchangeSalesOrderScheduleBilling();
        if (i == 0) {
          scheduleBillingObject = {
            ...scheduleBillingObject,
            periodicBillingAmount: this.part.exchangeListPrice,
            scheduleBillingDate: this.part.billingStartDate,
            cogs: getValueFromArrayOfObjectById(
              'label',
              'value',
              this.part.cogs,
              this.percentage
            ),
            cogsAmount: (this.part.exchangeListPrice * getValueFromArrayOfObjectById('label', 'value', this.part.cogs, this.percentage)) / 100,
          }
        }
        else {
          let newDate = new Date(this.part.exchangeSalesOrderScheduleBilling[i - 1].scheduleBillingDate);
          newDate.setDate(new Date(this.part.exchangeSalesOrderScheduleBilling[i - 1].scheduleBillingDate).getDate() + Number(this.part.billingIntervalDays));
          scheduleBillingObject = {
            ...scheduleBillingObject,
            periodicBillingAmount: this.part.exchangeListPrice,
            scheduleBillingDate: newDate,
            cogs: getValueFromArrayOfObjectById(
              'label',
              'value',
              this.part.cogs,
              this.percentage
            ),
            cogsAmount: (this.part.exchangeListPrice * getValueFromArrayOfObjectById('label', 'value', this.part.cogs, this.percentage)) / 100,
          }
        }
        //console.log(scheduleBillingObject);
        this.sBilling.push(scheduleBillingObject);
        //console.log(this.sBilling);
        this.isScheduleBilling = true;
        this.part.exchangeSalesOrderScheduleBilling.push(scheduleBillingObject);
        console.log(this.part.exchangeSalesOrderScheduleBilling);
      }
    }
  }
  closeErrorMessage() {
    this.errorModal.close();
  }

  calculateCOGS(i) {
    this.part.exchangeSalesOrderScheduleBilling[i].cogsAmount = (this.part.exchangeSalesOrderScheduleBilling[i].periodicBillingAmount * Number(this.part.exchangeSalesOrderScheduleBilling[i].cogs) / 100);
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
  memoPopupContent: any;
  memoPopupValue: any;
  disableSaveMemo: boolean = true;
  onClickRemarktext(value) {
    if (value == 'remarkText') {
      this.memoPopupContent = this.part.remarkText;
      this.disableSaveMemo = true;
    }
    this.memoPopupValue = value;
  }

  enableSaveMemo() {
    this.disableSaveMemo = false;
  }
  onClickPopupSave() {
    if (this.memoPopupValue == 'remarkText') {
      this.part.remarkText = this.memoPopupContent;
    }
    this.memoPopupContent = '';
  }
  schedulebilling: any[];
  setSchesuleBilling(event) {
    let count = event;
    if (this.part.estOfFeeBilling > 0 && this.part.billingIntervalDays > 0) {
      this.schedulebilling = this.part.exchangeSalesOrderScheduleBilling;
      this.part.exchangeSalesOrderScheduleBilling = [];
      for (let i = 0; i < count; i++) {
        let scheduleBillingObject = new ExchangeSalesOrderScheduleBilling();
        let newDate = new Date(this.schedulebilling[i].scheduleBillingDate);
        scheduleBillingObject = {
          ...scheduleBillingObject,
          exchangeSalesOrderScheduleBillingId: this.schedulebilling[i].exchangeSalesOrderScheduleBillingId,
          periodicBillingAmount: this.schedulebilling[i].periodicBillingAmount,
          scheduleBillingDate: newDate,
          cogs: getValueFromArrayOfObjectById(
            'label',
            'value',
            this.schedulebilling[i].cogs,
            this.percentage
          ),
          cogsAmount: this.schedulebilling[i].cogsAmount,
        }
        this.isScheduleBilling = true;
        this.part.exchangeSalesOrderScheduleBilling.push(scheduleBillingObject);
        console.log(this.part.exchangeSalesOrderScheduleBilling);
      }
    }
  }
}
