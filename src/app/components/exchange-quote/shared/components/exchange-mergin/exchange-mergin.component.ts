import { Component, OnInit, Input, Output, EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { PartDetail } from "../models/part-detail";
import { CommonService } from '../../../../../services/common.service';
import { ItemMasterSearchQuery } from "../../../models/item-master-search-query";
import { formatStringToNumber } from "../../../../../generic/autocomplete";
import { ExchangeQuoteScheduleBilling } from "../models/ExchangeQuoteScheduleBilling";
import * as moment from 'moment';
import {
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'app-exchange-mergin',
  templateUrl: './exchange-mergin.component.html',
  styleUrls: ['./exchange-mergin.component.scss']
})
export class ExchangeMerginComponent implements OnInit {
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() save: EventEmitter<PartDetail> = new EventEmitter<PartDetail>();
  @Input() part: PartDetail;
  @Input() display: boolean;
  @Input() isEdit: boolean;
  query: ItemMasterSearchQuery;
  percentage: any[] = [];
  invalidQuantityenteredForQuantityFromThis: boolean = false;
  @ViewChild("errorMessagePop",{static: false}) public errorMessagePop: ElementRef;
  errorModal: NgbModalRef;
  constructor(private commonservice: CommonService,private modalService: NgbModal) { }

  ngOnInit() {
    this.getPercents();
    this.calculate();
  }

  formatStringToNumberGlobal(val) {
    return formatStringToNumber(val)
  }

  getPercents() {
    this.commonservice.smartDropDownList('[Percent]', 'PercentId', 'PercentValue').subscribe(res => {
      this.percentage = res;
    })
  }

  onClose(event: Event): void {
    event.preventDefault();
    this.close.emit(true);
  }

  onSave(event: Event): void {
    event.preventDefault();
    this.save.emit(this.part);
    console.log("this.part" , this.part);
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
  sBilling:any=[];
  isScheduleBilling:boolean=false;
  errorMessages: any[] = [];
  addSchesuleBilling(event){
    debugger;
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
      this.part.exchangeQuoteScheduleBilling = [];
      for (let i = 0; i < count; i++) {
        let scheduleBillingObject = new ExchangeQuoteScheduleBilling();
        if (i == 0) {
          scheduleBillingObject = {
            ...scheduleBillingObject,
            periodicBillingAmount: this.part.exchangeListPrice,
            scheduleBillingDate: this.part.billingStartDate,
          }
        }
        else{
          let newDate = new Date();
          newDate.setDate(this.part.exchangeQuoteScheduleBilling[i-1].scheduleBillingDate.getDate() + Number(this.part.billingIntervalDays));
          scheduleBillingObject = {
            ...scheduleBillingObject,
            periodicBillingAmount: this.part.exchangeListPrice,
            scheduleBillingDate: newDate,
          }
        }
        //console.log(scheduleBillingObject);
        this.sBilling.push(scheduleBillingObject);
        //console.log(this.sBilling);
        this.isScheduleBilling = true;
        this.part.exchangeQuoteScheduleBilling.push(scheduleBillingObject);
        console.log(this.part.exchangeQuoteScheduleBilling);
      }
    }
  }
  closeErrorMessage() {
    this.errorModal.close();
  }
}
