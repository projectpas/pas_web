import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PartDetail } from "../../models/part-detail";
import { CommonService } from '../../../../../../services/common.service';
import { ItemMasterSearchQuery } from "../../../models/item-master-search-query";
import { formatStringToNumber } from "../../../../../../generic/autocomplete";
import { SpeedQuoteService } from "../../../../../../services/speedquote.service";
@Component({
  selector: 'app-speed-quote-margin',
  templateUrl: './speed-quote-margin.component.html',
  styleUrls: ['./speed-quote-margin.component.scss']
})
export class SpeedQuoteMarginComponent implements OnInit {
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
  partData:any[];
  constructor(private commonservice: CommonService,private speedQuoteService: SpeedQuoteService,) {
    
   }

  ngOnInit() {
    this.prevQntity = this.part.quantityFromThis;
    this.getPercents();
    //this.calculate();
    console.log("psrt",this.part);

    

    this.speedQuoteService.getItemMasterDataConditionWise(this.part.partId).subscribe(
      results => {
        console.log("results",results);
        this.partData =  results;
        console.log("psrt1",this.partData);
        this.calculate();
      }, error => {
        //this.isSpinnerVisible = false;
      }
    );
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
    this.part.quantityFromThis = this.prevQntity;
    event.preventDefault();
    this.close.emit(true);
  }

  onSave(event: Event): void {
    event.preventDefault();
    console.log("Save",this.partData);
    //this.save.emit(this.part);
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
    if (this.part) {
      this.calculatePart();
    }
  }

  calculatePart() {
    try {
      for(let i=0 ; i< this.partData.length; i++){
        this.partData[i].marginAmountPerUnit = +(Number(this.partData[i].unitSalePrice) - Number(this.partData[i].unitCost)).toFixed(2);
        if (Number(this.partData[i].unitSalePrice) > 0) {
          this.partData[i].marginPercentagePerUnit = +((Number(this.partData[i].marginAmountPerUnit) / Number(this.partData[i].unitSalePrice)) * 100).toFixed(2);
        } else {
          this.partData[i].marginPercentagePerUnit = 0;
        }
        this.partData[i].salesPriceExtended = Number(this.partData[i].unitSalePrice) * Number(this.part.quantityFromThis);
        this.partData[i].unitCostExtended = +(Number(this.partData[i].unitCost) * Number(this.part.quantityFromThis)).toFixed(2);
        this.partData[i].marginAmountExtended = +((Number(this.partData[i].salesPriceExtended) - Number(this.partData[i].unitCostExtended))).toFixed(2);
        if (Number(this.partData[i].salesPriceExtended) > 0) {
          this.partData[i].marginPercentageExtended = +((Number(this.partData[i].marginAmountExtended) / Number(this.partData[i].salesPriceExtended)) * 100).toFixed(2);
        } else {
          this.partData[i].marginPercentageExtended = 0;
        }
      }
    }
    catch (e) {
    }
  }

  // calculatePart() {
  //   try {
  //     this.part.salesPriceExtended = Number(this.part.salesPricePerUnit) * Number(this.part.quantityFromThis);
  //     this.part.markupPerUnit = + (Number(this.part.salesPricePerUnit) * (Number(this.part.markUpPercentage) / 100)).toFixed(2);
  //     this.part.markupExtended = + (Number(this.part.markupPerUnit) * Number(this.part.quantityFromThis)).toFixed(2);
  //     this.part.salesDiscountPerUnit = + ((Number(this.part.salesDiscount) / 100) * (Number(this.part.salesPricePerUnit) + Number(this.part.markupPerUnit))).toFixed(2);
  //     this.part.salesDiscountExtended = +(Number(this.part.salesDiscountPerUnit) * Number(this.part.quantityFromThis)).toFixed(2);
  //     this.part.netSalesPricePerUnit = +(Number(this.part.salesPricePerUnit) + Number(this.part.markupPerUnit) - Number(this.part.salesDiscountPerUnit)).toFixed(2);
  //     this.part.netSalesPriceExtended = +(Number(this.part.salesPriceExtended) + Number(this.part.markupExtended) - Number(this.part.salesDiscountExtended)).toFixed(2);
  //     this.part.taxAmount = +((Number(this.part.netSalesPriceExtended) / 100) * Number(this.part.taxPercentage)).toFixed(2);
  //     this.part.marginAmountPerUnit = +(Number(this.part.netSalesPricePerUnit) - Number(this.part.unitCostPerUnit)).toFixed(2);
  //     this.part.marginAmountExtended = +((Number(this.part.marginAmountPerUnit) * Number(this.part.quantityFromThis)) + Number(this.part.misc)).toFixed(2);
  //     this.part.unitCostExtended = +(Number(this.part.unitCostPerUnit) * Number(this.part.quantityFromThis)).toFixed(2);
  //     if (Number(this.part.netSalesPricePerUnit) > 0) {
  //       this.part.marginPercentagePerUnit = +((Number(this.part.marginAmountPerUnit) / Number(this.part.netSalesPricePerUnit)) * 100).toFixed(2);
  //     } else {
  //       this.part.marginPercentagePerUnit = 0;
  //     }
  //     if (Number(this.part.netSalesPriceExtended) > 0) {
  //       this.part.marginPercentageExtended = +((Number(this.part.marginAmountExtended) / Number(this.part.netSalesPriceExtended)) * 100).toFixed(2);
  //     } else {
  //       this.part.marginPercentageExtended = 0;
  //     }
  //     this.part.grossSalePrice = Number(this.part.salesPriceExtended) + Number(this.part.markupExtended);
  //     this.part.grossSalePricePerUnit = Number(this.part.salesPricePerUnit) + Number(this.part.markupPerUnit);
  //     this.part.totalSales = +(Number(this.part.netSalesPriceExtended) + Number(this.part.taxAmount)).toFixed(2);
  //   }
  //   catch (e) {
  //   }
  // }

  onChangeQuantityFromThis(event) {
    let qtyEntered = event.target.value;
    if (Number(this.part.quantityFromThis) != 0) {
      if (this.part['qtyRemainedToQuote']) {
        this.invalidQuantityenteredForQuantityFromThis = this.part.quantityFromThis > this.part.quantityToBeQuoted && Number(this.part.quantityFromThis) > Number(this.part['qtyRemainedToQuote']);
      }
      else if (qtyEntered > this.part.qtyAvailable || qtyEntered > this.part.quantityRequested) {
        this.invalidQuantityenteredForQuantityFromThis = true;
      }
      else if (Number(this.part.quantityFromThis) < 0)
      {
        this.invalidQuantityenteredForQuantityFromThis = true;
      }
      else {
        this.invalidQuantityenteredForQuantityFromThis = this.part.quantityFromThis > this.part.quantityToBeQuoted;
      }
    } else {
      this.invalidQuantityenteredForQuantityFromThis = true;
    }
  }

}
