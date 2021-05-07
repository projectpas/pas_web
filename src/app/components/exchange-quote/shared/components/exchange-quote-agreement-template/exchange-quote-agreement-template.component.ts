import { Component, OnInit, Input } from '@angular/core';
import { ExchangeQuoteView } from "../../../../../models/exchange/ExchangeQuoteView";
import { ExchangequoteService } from "../../../../../services/exchangequote.service";
import { CustomerService } from "../../../../../services/customer.service";
@Component({
  selector: 'app-exchange-quote-agreement-template',
  templateUrl: './exchange-quote-agreement-template.component.html',
  styleUrls: ['./exchange-quote-agreement-template.component.scss']
})
export class ExchangeQuoteAgreementTemplateComponent implements OnInit {
  @Input() exchangeQuoteView: ExchangeQuoteView;
  exchangeQuote: any = {};
  todayDate: Date = new Date();
  parts: any = [];
  constructor(private customerService: CustomerService, private exchangequoteService: ExchangequoteService) { }

  ngOnInit() {
    this.getExchangeQuoteView();
    console.log("exchangeQuoteView",this.exchangeQuoteView);
  }

  getExchangeQuoteView() {
    this.exchangequoteService.getview(this.exchangeQuoteView.exchangeOrderQuote.exchangeQuoteId).subscribe(res => {
      this.exchangeQuoteView = res[0];
      this.exchangeQuote = this.exchangeQuoteView.exchangeOrderQuote;
      this.parts = this.exchangeQuoteView.parts;
    })
  }

}
