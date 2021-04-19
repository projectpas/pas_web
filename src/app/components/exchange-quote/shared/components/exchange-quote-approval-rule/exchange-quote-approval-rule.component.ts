import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exchange-quote-approval-rule',
  templateUrl: './exchange-quote-approval-rule.component.html',
  styleUrls: ['./exchange-quote-approval-rule.component.scss']
})
export class ExchangeQuoteApprovalRuleComponent implements OnInit {
  moduleType:any  = 'ExchangeQuote'; 
	id: number;
  constructor() { }

  ngOnInit() {
  }

}
