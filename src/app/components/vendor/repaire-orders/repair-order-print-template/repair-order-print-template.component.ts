import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from "../../../../services/auth.service";
import { RepairOrderService } from '../../../../services/repair-order.service';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';


@Component({
  selector: 'app-repair-order-print-template',
  templateUrl: './repair-order-print-template.component.html',
  styleUrls: ['./repair-order-print-template.component.scss']
})
export class RepairOrderPrintTemplateComponent implements OnInit {

  isSpinnerVisible: boolean = false;
  @Input() referenceId: any;
  roHeaderAdd: any = {};
  roPartsList: any = [];
  vendorInfo:any = {};
  managementStructureHeaderData:any = {};

  constructor(
    private repairOrderService: RepairOrderService,    
    private authService: AuthService,
  ) { }

  ngOnInit() {    
    this.getPrintRepairOrderData(this.referenceId);
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  getPrintRepairOrderData(RepairOrderId){
    this.isSpinnerVisible = true;
    this.repairOrderService.getPrintRepairOrderData(RepairOrderId).subscribe(res => {
      this.isSpinnerVisible = false;      
      this.roHeaderAdd = {
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
          discountPercent: x.discountPercent ? formatNumberAsGlobalSettingsModule(x.discountPercent, 2) : '0.00',
          discountPerUnit: x.discountPerUnit ? formatNumberAsGlobalSettingsModule(x.discountPerUnit, 2) : '0.00',
          discountAmount: x.discountAmount ? formatNumberAsGlobalSettingsModule(x.discountAmount, 2) : '0.00',
          extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00',
          foreignExchangeRate: x.foreignExchangeRate ? formatNumberAsGlobalSettingsModule(x.foreignExchangeRate, 5) : '0.00',
          //repairOrderSplitParts: this.getRepairOrderSplit(x)
        }
        this.roPartsList.push(partList);
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
		this.roPartsList.map(x => {
			x.tempExtCost = x.extendedCost ? parseFloat(x.extendedCost.toString().replace(/\,/g, '')) : 0;
			this.totalExtCost += x.tempExtCost;
		})
		this.totalExtCost = this.totalExtCost ? formatNumberAsGlobalSettingsModule(this.totalExtCost, 2) : '0.00';
  }
  
  finaltotal:any;
  finaltotals(){
    this.finaltotal = 0;
    let txc  = this.totalExtCost.replace(",", "");
    let shc = this.roHeaderAdd.shippingandhandlingCost.replace(",",""); 
    this.finaltotal = (parseFloat(txc) + parseFloat(shc)) ? formatNumberAsGlobalSettingsModule((parseFloat(txc) + parseFloat(shc)),2) : '0.00';   
  }


}
