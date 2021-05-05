import { Component, OnInit, Input } from '@angular/core';
import { ExchangeQuoteView } from "../../../../../models/exchange/ExchangeQuoteView";
@Component({
  selector: 'app-exchange-quote-agreement-template',
  templateUrl: './exchange-quote-agreement-template.component.html',
  styleUrls: ['./exchange-quote-agreement-template.component.scss']
})
export class ExchangeQuoteAgreementTemplateComponent implements OnInit {
  @Input() exchangeQuoteView: ExchangeQuoteView;
  constructor() { }

  ngOnInit() {
    console.log("exchangeQuoteView",this.exchangeQuoteView);
  }

}
