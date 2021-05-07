import { Component, Input } from '@angular/core';
import { ISalesQuote } from "../../../../../../../src/app/models/sales/ISalesQuote.model";

@Component({
  selector: 'app-wo-customer-detail',
  templateUrl: './wo-customer-detail.component.html',
  styleUrls: ['./wo-customer-detail.component.scss']
})
export class WoCustomerDetailComponent{
  @Input() customer: any;
  @Input() workorderdetails: ISalesQuote;
  constructor() {
    this.customer = {
      customerName: '',
      customerCode: '',
      promisedDate: ''
    }
  }
}
