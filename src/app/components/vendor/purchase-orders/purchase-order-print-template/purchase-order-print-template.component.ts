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
  managementStructureHeaderData:any = {};
  
  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private authService: AuthService
  ) { }

  ngOnInit() {    
    this.getPrintPurchaseOrderData(this.referenceId);
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  getPrintPurchaseOrderData(PurchseOrderId){
    this.isSpinnerVisible = true;
    this.purchaseOrderService.getPrintPurchaseOrderData(PurchseOrderId).subscribe(res => {
      this.isSpinnerVisible = false;      
      this.poHeaderAdd = {
        ...res[0],
        shippingCost: res[0].shippingCost ? formatNumberAsGlobalSettingsModule(res[0].shippingCost, 2) : '0.00',
        handlingCost: res[0].handlingCost ? formatNumberAsGlobalSettingsModule(res[0].handlingCost, 2) : '0.00',
        shippingandhandlingCost : res[0].shippingCost + res[0].handlingCost ? formatNumberAsGlobalSettingsModule(res[0].shippingCost + res[0].handlingCost , 2) : '0.00',
        printdate: new Date(),
        itemcount: res[1].length
      };
      this.vendorInfo = res[2]; 
      this.managementStructureHeaderData = res[3];  
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
      this.getTotalExtCost();      
      this.finaltotals();          
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  totalExtCost: any;
  getTotalExtCost() {
		this.totalExtCost = 0;
		this.poPartsList.map(x => {
			x.tempExtCost = x.extendedCost ? parseFloat(x.extendedCost.toString().replace(/\,/g, '')) : 0;
			this.totalExtCost += x.tempExtCost;
		})
		this.totalExtCost = this.totalExtCost ? formatNumberAsGlobalSettingsModule(this.totalExtCost, 2) : '0.00';
  }
  
  finaltotal:any;
  finaltotals(){
    this.finaltotal = 0;
    let txc  = this.totalExtCost.replace(",", "");
    let shc = this.poHeaderAdd.shippingandhandlingCost.replace(",","");    
    this.finaltotal = (parseFloat(txc) + parseFloat(shc)) ? formatNumberAsGlobalSettingsModule((parseFloat(txc) + parseFloat(shc)),2) : '0.00';   
  }

}
