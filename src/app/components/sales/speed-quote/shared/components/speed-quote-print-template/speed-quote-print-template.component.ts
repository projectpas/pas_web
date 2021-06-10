import { Component, OnInit, Input } from '@angular/core';
import { SpeedQuoteView } from "../../../../../../models/sales/SpeedQuoteView";
import { SpeedQuoteService } from "../../../../../../services/speedquote.service";
import { environment } from "../../../../../../../environments/environment";
import { CustomerService } from "../../../../../../services/customer.service";
@Component({
  selector: 'app-speed-quote-print-template',
  templateUrl: './speed-quote-print-template.component.html',
  styleUrls: ['./speed-quote-print-template.component.scss']
})
export class SpeedQuotePrintTemplateComponent implements OnInit {
  @Input() salesQuoteView: SpeedQuoteView;
  speedQuote: any = {};
  parts: any = [];
  management: any = {};
  endPointURL: any;
  todayDate: Date = new Date();
  customerAddress: any = {};
  constructor(private speedQuoteService: SpeedQuoteService,private customerService: CustomerService,) { }

  ngOnInit() {
    this.endPointURL = environment.baseUrl;
    this.getSpeedQuoteView();
    this.getCustomerById(this.salesQuoteView.speedQuote.customerId);
  }

  getSpeedQuoteView(){
    this.speedQuoteService.getPrintview(this.salesQuoteView.speedQuote.speedQuoteId).subscribe(res => {
      if (res) {
        this.salesQuoteView = res && res.length ? res[0] : null;
        this.salesQuoteView = res[0];
        this.speedQuote = res[0].speedQuote;
        this.parts = res[0].parts;
        this.management = res[0].managementStructureHeaderData;
        console.log("parts", this.parts);
      }
    });
  }

  getCustomerById(customerId) {
    this.customerService.getCustomerdataById(customerId).subscribe(res => {
      this.customerAddress = res[0]
    })
  }

}
