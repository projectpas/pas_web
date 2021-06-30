import { Component, OnInit, Input } from '@angular/core';
import { SpeedQuoteView } from "../../../../../../models/sales/SpeedQuoteView";
import { SpeedQuoteService } from "../../../../../../services/speedquote.service";
import { environment } from "../../../../../../../environments/environment";
import { CustomerService } from "../../../../../../services/customer.service";
@Component({
  selector: 'app-speed-quote-printing-template',
  templateUrl: './speed-quote-printing-template.component.html',
  styleUrls: ['./speed-quote-printing-template.component.scss']
})
export class SpeedQuotePrintingTemplateComponent implements OnInit {
  @Input() salesQuoteView: SpeedQuoteView;
  speedQuote: any = {};
  parts: any = [];
  management: any = {};
  endPointURL: any;
  todayDate: Date = new Date();
  customerAddress: any = {};
  exclusionParts: any = [];
  @Input() speedQuotePrintCriteraObj:any;
  constructor(private speedQuoteService: SpeedQuoteService,private customerService: CustomerService,) { }

  ngOnInit() {
    this.endPointURL = environment.baseUrl;
    this.getSpeedQuoteView();
    this.getCustomerById(this.salesQuoteView.speedQuote.customerId);
    console.log("speedQuotePrintCriteraObj",this.speedQuotePrintCriteraObj);
  }

  getSpeedQuoteView(){
    this.speedQuoteService.getPrintview(this.salesQuoteView.speedQuote.speedQuoteId).subscribe(res => {
      if (res) {
        this.salesQuoteView = res && res.length ? res[0] : null;
        this.salesQuoteView = res[0];
        this.speedQuote = res[0].speedQuote;
        this.parts = res[0].parts;
        this.management = res[0].managementStructureHeaderData;
        this.exclusionParts = res[0].exclusionParts;
        console.log("parts", this.parts);
      }
    });
  }

  getCustomerById(customerId) {
    this.customerService.getCustomerdataById(customerId).subscribe(res => {
      this.customerAddress = res[0]
    })
  }

  getFormattedNotes(notes) {
    if (notes != undefined) {
      return notes.replace(/<[^>]*>/g, '');
    }
  }

}
