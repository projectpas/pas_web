import { Component, OnInit, Input } from '@angular/core';
import { ISpeedQuote } from "../../../../../../../models/sales/ISpeedQuote.model";
@Component({
  selector: 'app-speed-quote-custpmer-details',
  templateUrl: './speed-quote-custpmer-details.component.html',
  styleUrls: ['./speed-quote-custpmer-details.component.scss']
})
export class SpeedQuoteCustpmerDetailsComponent{
  @Input() customer: any;
  @Input() salesQuote: ISpeedQuote;
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
