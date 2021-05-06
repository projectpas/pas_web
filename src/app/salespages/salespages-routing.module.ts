// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SalesPagesComponent } from "./salespages.component";
import { SalesQuoteListComponent } from "../components/sales/quotes/sales-quote-list/sales-quote-list.component";
import { SalesQuoteCreateComponent } from "../components/sales/quotes/sales-quote-create/sales-quote-create.component";
import { SalesQuoteComponent } from "../components/sales/quotes/sales-quote/sales-quote-component";
import { SalesOrderListComponent } from "../components/sales/order/sales-order-list/sales-order-list.component";
import { SalesOrderCreateComponent } from "../components/sales/order/sales-order-create/sales-order-create.component";
import { SalesOrderComponent } from "../components/sales/order/sales-order/sales-order-component";
import { SalesOrderConfirmationListComponent } from "../components/sales/order/sales-order-confirmation-list/sales-order-confirmation-list.component";
import { SOQApprovalRuleComponent } from "../components/sales/quotes/shared/components/soq-approval-rule/soq-approval-rule.component";
import { SOApprovalRuleComponent } from "../components/sales/order/shared/components/so-approval-rule/so-approval-rule.component";
import { SpeedQuoteListComponent } from "../components/sales/speed-quote/speed-quote-list/speed-quote-list.component";
import { SpeedQuoteComponent } from "../components/sales/speed-quote/speed-quote/speed-quote-component";
import { SpeedQuoteCreateComponent } from "../components/sales/speed-quote/speed-quote-create/speed-quote-create.component";

const salesPagesRoutes: Routes = [
  {
    path: '',
    component: SalesPagesComponent
  },
  {
    path: "salespages",
    component: SalesPagesComponent,
    children: [
      { path: "sales-quote", component: SalesQuoteComponent },
      {
        path: "sales-quote-create/:customerId",
        component: SalesQuoteCreateComponent
      },
      {
        path: "sales-quote-edit/:customerId/:id",
        component: SalesQuoteCreateComponent
      },
      { path: "sales-quote-edit/:id", component: null },
      {
        path: "sales-quote-list",
        component: SalesQuoteListComponent,
        data: { title: "Sales Quote List" }
      },
      { path: "sales-order", component: SalesOrderComponent },
      {
        path: "sales-order-create/:customerId",
        component: SalesOrderCreateComponent
      },
      {
        path: "sales-order-edit/:customerId/:id",
        component: SalesOrderCreateComponent
      },
      {
        path: "sales-order-copy/:customerId/:id",
        component: SalesOrderCreateComponent
      },
      { path: "sales-order-edit/:id", component: null },
      {
        path: "sales-order-list",
        component: SalesOrderListComponent,
        data: { title: "Sales Order List" }
      },
      {
        path: "sales-order-confirmation-list",
        component: SalesOrderConfirmationListComponent,
        data: { title: "SO Confirmation List" }
      },
      {
        path: "app-soq-approval-rule",
        component: SOQApprovalRuleComponent,
        data: { title: "Sales Order Quote Approval Rule" }
      },
      {
        path: "app-so-approval-rule",
        component: SOApprovalRuleComponent,
        data: { title: "Sales Order Approval Rule" }
      },
      { path: "speed-quote", component: SpeedQuoteComponent },
      {
        path: "speed-quote-list",
        component: SpeedQuoteListComponent,
        data: { title: "Speed Quote List" }
      },
      {
        path: "speed-quote-create/:customerId",
        component: SpeedQuoteCreateComponent
      },
      {
        path: "speed-quote-edit/:customerId/:id",
        component: SpeedQuoteCreateComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(salesPagesRoutes)],
  exports: [RouterModule],
  providers: []
})
export class SalesPagesRoutingModule { }
