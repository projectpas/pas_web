import { Component, Input, OnInit } from "@angular/core";
import { CustomerService } from "../../../../services/customer.service";
import { SalesOrderService } from "../../../../services/salesorder.service";
import { AuthService } from "../../../../services/auth.service";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-sales-order-print-template",
  templateUrl: "./sales-order-print-template.component.html",
  styleUrls: ["./sales-order-print-template.component.css"]
})
export class SalesOrderPrintTemplateComponent implements OnInit {
  @Input() salesOrderView: any;
  salesOrder: any = {};
  customerAddress: any = {};
  todayDate: Date = new Date();
  parts: any = [];
  subtotal: number = 0;
  totalAmount: number = 0;
  endPointURL: any;
  isSpinnerVisible: boolean = false;

  constructor(private customerService: CustomerService,
    private salesOrderService: SalesOrderService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.endPointURL = environment.baseUrl;
    this.getSalesOrderView();
    this.getCustomerById(this.salesOrderView.salesOrder.customerId);
  }

  getCustomerById(customerId) {
    this.isSpinnerVisible = true;
    this.customerService.getCustomerdataById(customerId).subscribe(res => {
      this.customerAddress = res[0];
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    })
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  getSalesOrderView() {
    this.isSpinnerVisible = true;
    this.salesOrderService.getPrintview(this.salesOrderView.salesOrder.salesOrderId).subscribe(res => {
      this.salesOrderView = res[0];
      this.salesOrder = this.salesOrderView.salesOrder;
      this.parts = this.salesOrderView.salesOrderListToPrint;
      if (this.parts.length > 0) {
        for (let i = 0; i < this.parts.length; i++) {
          this.subtotal = this.subtotal + this.parts[i].totalSales;
          this.totalAmount = this.subtotal
        }
      }
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    })
  }

  getFormattedNotes(notes) {
    if (notes != undefined) {
      return notes.replace(/<[^>]*>/g, '');
    }
  }
}