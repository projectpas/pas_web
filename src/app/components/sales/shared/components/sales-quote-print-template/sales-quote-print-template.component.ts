import { Component, Input, OnInit } from "@angular/core";
import { SalesQuoteView } from "../../../../../models/sales/SalesQuoteView";
import { CustomerService } from "../../../../../services/customer.service";
import { SalesQuoteService } from "../../../../../services/salesquote.service";

@Component({
  selector: "app-sales-quote-print-template",
  templateUrl: "./sales-quote-print-template.component.html",
  styleUrls: ["./sales-quote-print-template.component.css"]
})
export class SalesQuotePrintTemplateComponent implements OnInit {
  @Input() salesQuoteView: SalesQuoteView;
  salesQuote: any = {};
  customerAddress: any = {};
  todayDate: Date = new Date();
  parts: any = [];
  subtotal: number = 0;
  totalAmount: number = 0;

  constructor(private customerService: CustomerService, private salesQuoteService: SalesQuoteService) {
  }

  ngOnInit() {
    this.getSalesQuoteView();
    this.getCustomerById(this.salesQuoteView.salesOrderQuote.customerId);
  }

  getCustomerById(customerId) {
    this.customerService.getCustomerdataById(customerId).subscribe(res => {
      this.customerAddress = res[0]
    })
  }
  
  getSalesQuoteView() {
    this.salesQuoteService.getview(this.salesQuoteView.salesOrderQuote.salesOrderQuoteId).subscribe(res => {
      this.salesQuoteView = res[0];
      this.salesQuote = this.salesQuoteView.salesOrderQuote;
      this.parts = this.salesQuoteView.parts;
      if (this.parts.length > 0) {
        for (let i = 0; i < this.parts.length; i++) {
          this.subtotal = this.subtotal + this.parts[i].totalSales;
          this.totalAmount = this.subtotal
        }
      }
    })
  }
}