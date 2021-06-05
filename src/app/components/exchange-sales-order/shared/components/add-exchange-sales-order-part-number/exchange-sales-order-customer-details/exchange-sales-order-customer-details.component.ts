import { Component, OnInit, Input } from '@angular/core';
import { IExchangeSalesOrder } from 'src/app/models/exchange/IExchangeSalesOrder.model';
@Component({
  selector: 'app-exchange-sales-order-customer-details',
  templateUrl: './exchange-sales-order-customer-details.component.html',
  styleUrls: ['./exchange-sales-order-customer-details.component.scss']
})
export class ExchangeSalesOrderCustomerDetailsComponent implements OnInit {
  @Input() customer: any;
  @Input() exchangeQuote: IExchangeSalesOrder;
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
