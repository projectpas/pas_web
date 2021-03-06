import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { PartDetail } from "../../models/part-detail";
import { CommonService } from '../../../../../services/common.service';
import { ItemMasterSearchQuery } from "../../../quotes/models/item-master-search-query";
import { formatStringToNumber } from "../../../../../generic/autocomplete";
import { AuthService } from "../../../../../services/auth.service";

@Component({
  selector: "app-sales-margin",
  templateUrl: "./sales-margin.component.html",
  styleUrls: ["./sales-margin.component.css"]
})
export class SalesMarginComponent implements OnInit {
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() searchAnotherPN: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() save: EventEmitter<PartDetail> = new EventEmitter<PartDetail>();
  @Input() part: PartDetail;
  @Input() display: boolean;
  @Input() isEdit: boolean;
  query: ItemMasterSearchQuery;
  percentage: any[] = [];
  invalidQuantityenteredForQuantityFromThis: boolean = false;
  prevQntity = 0;
  markUpPercentage: any;
  salesDiscount: any;

  constructor(private commonservice: CommonService,private authService: AuthService) {
  }

  ngOnInit() {
    this.prevQntity = this.part.quantityFromThis;
    this.markUpPercentage = Number(this.part.markUpPercentage).toFixed(2).toString();
    this.salesDiscount = Number(this.part.salesDiscount).toFixed(2).toString();
    this.getPercents();
    this.calculate();
  }

  formatStringToNumberGlobal(val) {
    return formatStringToNumber(val)
  }

  getPercents() {
    this.commonservice.smartDropDownList('[Percent]', 'PercentId', 'PercentValue',this.authService.currentUser.masterCompanyId).subscribe(res => {
      this.percentage = res;
    })
  }

  onClose(event: Event): void {
    this.part.quantityFromThis = this.prevQntity;
    this.part.quantityToBeQuoted = Number(this.part.quantityFromThis);
    this.part.quantityAlreadyQuoted = Number(this.part.quantityFromThis);
    this.isEdit = false;
    event.preventDefault();
    this.close.emit(true);
  }

  onSave(event: Event): void {
    if (this.part && !this.invalidQuantityenteredForQuantityFromThis) {
      this.calculatePart();
    }
    if (!this.isEdit) {
      let isInvalid = this.validateInput();
      if (!isInvalid) {
        event.preventDefault();
        this.save.emit(this.part);
      }
    }
    else {
      event.preventDefault();
      this.save.emit(this.part);
    }
  }

  onSearchAnotherPN(event: Event): void {
    event.preventDefault();
    this.searchAnotherPN.emit(true);
  }

  showPartNumberModal() {
    var btnPartDetail: any = document.querySelector("#addPartNumber");
    if (btnPartDetail) {
      btnPartDetail.click();
    }
  }

  calculate() {
    if (this.part && !this.invalidQuantityenteredForQuantityFromThis) {
      this.calculatePart();
    }
  }

  calculatePart() {
    try {
      this.part.markUpPercentage = Number(this.markUpPercentage);
      this.part.salesDiscount = Number(this.salesDiscount);

      this.part.salesPriceExtended = Number(this.part.salesPricePerUnit) * Number(this.part.quantityFromThis);
      this.part.markupPerUnit = + (Number(this.part.salesPricePerUnit) * (Number(this.part.markUpPercentage) / 100)).toFixed(2);
      this.part.markupExtended = + (Number(this.part.markupPerUnit) * Number(this.part.quantityFromThis)).toFixed(2);
      this.part.salesDiscountPerUnit = + ((Number(this.part.salesDiscount) / 100) * (Number(this.part.salesPricePerUnit) + Number(this.part.markupPerUnit))).toFixed(2);
      this.part.salesDiscountExtended = +(Number(this.part.salesDiscountPerUnit) * Number(this.part.quantityFromThis)).toFixed(2);
      this.part.netSalesPricePerUnit = +(Number(this.part.salesPricePerUnit) + Number(this.part.markupPerUnit) - Number(this.part.salesDiscountPerUnit)).toFixed(2);
      this.part.netSalesPriceExtended = +(Number(this.part.salesPriceExtended) + Number(this.part.markupExtended) - Number(this.part.salesDiscountExtended)).toFixed(2);
      this.part.taxAmount = +((Number(this.part.netSalesPriceExtended) / 100) * Number(this.part.taxPercentage)).toFixed(2);
      this.part.marginAmountPerUnit = +(Number(this.part.netSalesPricePerUnit) - Number(this.part.unitCostPerUnit)).toFixed(2);
      //this.part.marginAmountExtended = +((Number(this.part.marginAmountPerUnit) * Number(this.part.quantityFromThis)) + Number(this.part.misc)).toFixed(2);
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
    }
    catch (e) {
    }
  }

  validateInput() {
    if (Number(this.part.quantityFromThis) != 0) {
      if (this.part['qtyRemainedToQuote']) {
        this.invalidQuantityenteredForQuantityFromThis = this.part.quantityFromThis > this.part.quantityToBeQuoted && Number(this.part.quantityFromThis) > Number(this.part['qtyRemainedToQuote']);
      }
      else if (Number(this.part.quantityFromThis) < 0) {
        this.invalidQuantityenteredForQuantityFromThis = true;
      }
      else {
        this.invalidQuantityenteredForQuantityFromThis = this.part.quantityFromThis > this.part.quantityToBeQuoted || (this.part.stockLineId != null && this.part.quantityFromThis > this.part.qtyAvailable);
      }
    } else {
      this.invalidQuantityenteredForQuantityFromThis = true;
    }

    return this.invalidQuantityenteredForQuantityFromThis;
  }

  onChangeQuantityFromThis(event) {

    if (Number(this.part.quantityFromThis) != 0) {
      if (this.part['qtyRemainedToQuote']) {
        this.invalidQuantityenteredForQuantityFromThis = this.part.quantityFromThis > this.part.quantityToBeQuoted && Number(this.part.quantityFromThis) > Number(this.part['qtyRemainedToQuote']);
      }
      else if (Number(this.part.quantityFromThis) < 0) {
        this.invalidQuantityenteredForQuantityFromThis = true;
      }
      else {
        this.invalidQuantityenteredForQuantityFromThis = this.part.quantityFromThis > this.part.quantityToBeQuoted || (this.part.stockLineId != null && this.part.quantityFromThis > this.part.qtyAvailable);
      }
    } else {
      this.invalidQuantityenteredForQuantityFromThis = true;
    }
  }
}