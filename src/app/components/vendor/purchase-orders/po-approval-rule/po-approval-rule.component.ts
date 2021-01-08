import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../../../services/vendor.service';

@Component({
  selector: 'app-po-approval-rule',
  templateUrl: './po-approval-rule.component.html',
  styleUrls: ['./po-approval-rule.component.css']
})
export class PoApprovalRuleComponent implements OnInit {
  moduleType:any  = 'PO'; 
	id: number;

  constructor( public vendorService: VendorService) { 
   
    this.vendorService.ShowPtab = false;
		this.vendorService.alertObj.next(this.vendorService.ShowPtab);
		this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-purchase-setup';
		this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
  }

  ngOnInit() {
    
  }

}
