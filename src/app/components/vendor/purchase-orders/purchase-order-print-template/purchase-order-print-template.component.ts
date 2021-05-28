import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from "../../../../services/auth.service";
import { environment } from "../../../../../environments/environment";
import { PurchaseOrderService } from '../../../../services/purchase-order.service';
declare var $: any;
import { formatNumberAsGlobalSettingsModule, editValueAssignByCondition } from '../../../../generic/autocomplete';

@Component({
  selector: 'app-purchase-order-print-template',
  templateUrl: './purchase-order-print-template.component.html',
  styleUrls: ['./purchase-order-print-template.component.scss']
})
export class PurchaseOrderPrintTemplateComponent implements OnInit {

  isSpinnerVisible: boolean = false;
  @Input() referenceId: any;
  poHeaderAdd: any = {};
  poPartsList: any = [];
  vendorInfo:any = {};
  
  constructor(
    private purchaseOrderService: PurchaseOrderService,
  ) { }

  ngOnInit() {
    
    this.getPrintPurchaseOrderData(this.referenceId);
  }

  getPrintPurchaseOrderData(PurchseOrderId){
    this.isSpinnerVisible = true;
    this.purchaseOrderService.getPrintPurchaseOrderData(PurchseOrderId).subscribe(res => {
      this.isSpinnerVisible = false;      
      this.poHeaderAdd = {
        ...res[0],
        shippingCost: res[0].shippingCost ? formatNumberAsGlobalSettingsModule(res[0].shippingCost, 2) : '0.00',
        handlingCost: res[0].handlingCost ? formatNumberAsGlobalSettingsModule(res[0].handlingCost, 2) : '0.00',
        printdate: new Date(),
        itemcount: res[1].length
      };
      this.vendorInfo = res[2];      
      res[1].map(x => {
        const partList = {
          ...x,
          unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
          vendorListPrice: x.vendorListPrice ? formatNumberAsGlobalSettingsModule(x.vendorListPrice, 2) : '0.00',
          discountPercentValue: x.discountPercentValue ? formatNumberAsGlobalSettingsModule(x.discountPercentValue, 2) : '0.00',
          discountPerUnit: x.discountPerUnit ? formatNumberAsGlobalSettingsModule(x.discountPerUnit, 2) : '0.00',
          discountAmount: x.discountAmount ? formatNumberAsGlobalSettingsModule(x.discountAmount, 2) : '0.00',
          extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00',
          foreignExchangeRate: x.foreignExchangeRate ? formatNumberAsGlobalSettingsModule(x.foreignExchangeRate, 5) : '0.00',
          //purchaseOrderSplitParts: this.getPurchaseOrderSplit(x)
        }
        this.poPartsList.push(partList);
      });
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  getTotalExtCost(array) {
    let totalExtCost = 0;
    if (array) {
      array.map(x => {
        x.tempExtCost = x.extendedCost ? parseFloat(x.extendedCost.toString().replace(/\,/g, '')) : 0;
        totalExtCost += x.tempExtCost;
      })
      totalExtCost = totalExtCost ? formatNumberAsGlobalSettingsModule(totalExtCost, 2) : '0.00';
    }
    return totalExtCost;
  }

}