import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../../../services/vendor.service';

@Component({
  selector: 'app-ro-approval-rule',
  templateUrl: './ro-approval-rule.component.html',
  styleUrls: ['./ro-approval-rule.component.css']
})
export class RoApprovalRuleComponent implements OnInit {

  moduleType:any  = 'RO'; 

  constructor(private vendorService: VendorService) { 
    this.vendorService.ShowPtab = false;
		this.vendorService.alertObj.next(this.vendorService.ShowPtab);
		this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-ro-approval-rule';
		this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
  }

  ngOnInit() {
  }

}
