import { Component, OnInit, Input } from '@angular/core';
import { IExchangeQuote } from "../../../../../../models/exchange/IExchangeQuote.model";

@Component({
  selector: 'app-exchange-customer-details',
  templateUrl: './exchange-customer-details.component.html',
  styleUrls: ['./exchange-customer-details.component.scss']
})
export class ExchangeCustomerDetailsComponent {
  @Input() customer: any;
  @Input() exchangeQuote: IExchangeQuote;
  constructor() {
    this.customer = {
      customerName: '',
      customerCode: '',
      promisedDate: ''
    }
   }

  ngOnInit() {
  }

}
