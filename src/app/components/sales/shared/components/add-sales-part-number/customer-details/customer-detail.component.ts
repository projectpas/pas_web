import { Component, Input } from "@angular/core";
import { ISalesQuote } from "../../../../../../models/sales/ISalesQuote.model";

@Component({
  selector: "app-customer-detail",
  templateUrl: "./customer-detail.component.html",
  styleUrls: ["./customer-detail.component.scss"]
})
export class CustomerDetailComponent {
  @Input() customer: any;
  @Input() salesQuote: ISalesQuote;
  constructor() {
    this.customer = {
      customerName: '',
      customerCode: '',
      promisedDate: ''
    }
  }
}