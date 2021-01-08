import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { PartDetail } from "../../models/part-detail";
import { SalesQuoteService } from "../../../../../services/salesquote.service";
import { CommonService } from '../../../../../services/common.service';
import { ItemMasterSearchQuery } from "../../../quotes/models/item-master-search-query";
import { formatNumberAsGlobalSettingsModule, formatStringToNumber } from "../../../../../generic/autocomplete";

@Component({
  selector: "app-sales-margin",
  templateUrl: "./sales-margin.component.html",
  styleUrls: ["./sales-margin.component.css"]
})
export class SalesMarginComponent implements OnInit {
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() save: EventEmitter<PartDetail> = new EventEmitter<PartDetail>();
  @Input() part: PartDetail;
  @Input() display: boolean;
  @Input() isEdit: boolean;

  query: ItemMasterSearchQuery;
  percentage: any[] = [];
  invalidQuantityenteredForQuantityFromThis: boolean = false;
  constructor(private salesQuoteService: SalesQuoteService, private commonservice: CommonService, ) {

  }

  ngOnInit() {
    console.log(this.part, "this.part+++++++++++")
    this.getPercents();
    this.calculate();
    // this.part.quantityRequested = formatNumberAsGlobalSettingsModule(this.part.quantityRequested, 2)
    // this.part.quantityAlreadyQuoted = formatNumberAsGlobalSettingsModule(this.part.quantityAlreadyQuoted, 2)
    // this.part.quantityFromThis = formatNumberAsGlobalSettingsModule(this.part.quantityFromThis, 2)
    // this.part.quantityToBeQuoted = formatNumberAsGlobalSettingsModule(this.part.quantityToBeQuoted, 2)
    /* for (let i = 1; i <= 10; i++) {
       this.percentage.push({ value: i.toString(), text: i.toString() });
     }*/
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
    //this.showPartNumberModal();
  }


  onSave(event: Event): void {
    // this.part.quantityRequested = formatStringToNumber(this.part.quantityRequested)
    // this.part.quantityAlreadyQuoted = formatStringToNumber(this.part.quantityAlreadyQuoted)
    // this.part.quantityFromThis = formatStringToNumber(this.part.quantityFromThis)
    // this.part.quantityToBeQuoted = formatStringToNumber(this.part.quantityToBeQuoted)
    // this.part.QuantityToBeQuoted = formatStringToNumber(this.part.QuantityToBeQuoted)
    event.preventDefault();
    this.save.emit(this.part);
    // this.showPartNumberModal();
  }

  showPartNumberModal() {
    var btnPartDetail: any = document.querySelector("#addPartNumber");
    if (btnPartDetail) {
      btnPartDetail.click();
    }
  }

  calculate() {
    if (this.part) {
      console.log(this.part);
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
      // let taxAmountPerUnit = ((Number(this.part.netSalesPricePerUnit) / 100) * Number(this.part.taxPercentage)).toFixed(2);
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
      // this.part.marginPercentagePerUnit = +((Number(this.part.netSalesPricePerUnit) / 100) * Number(this.part.marginAmountPerUnit)).toFixed(2);
      // this.part.marginPercentageExtended = +((Number(this.part.netSalesPriceExtended) / 100) * Number(this.part.marginAmountExtended)).toFixed(2);

      this.part.grossSalePrice = Number(this.part.salesPriceExtended) + Number(this.part.markupExtended);
      this.part.grossSalePricePerUnit = Number(this.part.salesPricePerUnit) + Number(this.part.markupPerUnit);
      // this.part.freight = 0.00;
      // this.part.misc = 0.00;
      // this.part.totalSales = +(Number(this.part.netSalesPriceExtended) + Number(this.part.taxAmount) + Number(this.part.freight) + Number(this.part.misc)).toFixed(2);
      this.part.totalSales = +(Number(this.part.netSalesPriceExtended) + Number(this.part.taxAmount)).toFixed(2);
    }
    catch (e) {
      console.log(e);
    }
  }

  onChangeQuantityFromThis(event) {
    if (Number(this.part.quantityFromThis) != 0) {
      if (this.part['qtyRemainedToQuote']) {
        this.invalidQuantityenteredForQuantityFromThis = this.part.quantityFromThis > this.part.quantityToBeQuoted && Number(this.part.quantityFromThis) > Number(this.part['qtyRemainedToQuote']);
      }
      else {
        // this.invalidQuantityenteredForQuantityFromThis = this.part.quantityFromThis > this.part.quantityToBeQuoted && this.part.quantityFromThis > this.part.qtyAvailable;
        this.invalidQuantityenteredForQuantityFromThis = this.part.quantityFromThis > this.part.quantityToBeQuoted;
      }
    } else {
      this.invalidQuantityenteredForQuantityFromThis = true;
    }


  }
}
