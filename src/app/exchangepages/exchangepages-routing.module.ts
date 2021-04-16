import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { ExchangepagesComponent } from "./exchangepages.component";
import { ExchangeQuoteListComponent } from "../components/exchange-quote/exchange-quote-list/exchange-quote-list.component";
import { ExchangeQuoteCreateComponent } from "../components/exchange-quote/exchange-quote-create/exchange-quote-create.component";
import { ExchangeQuoteComponent } from "../components/exchange-quote/exchange-quote/exchange-quote.component";
import{ExchangeQuoteApprovalRuleComponent} from '../components/exchange-quote/shared/components/exchange-quote-approval-rule/exchange-quote-approval-rule.component';

const exchangepagesRoute: Routes = [
  {
    path: '',
    component: ExchangepagesComponent
  },
  {
    path: "exchangepages",
    component: ExchangepagesComponent,
    children: [
      { path: "exchange-quote", component: ExchangeQuoteComponent },
      {
        path: "exchange-quote-create/:customerId",
        component: ExchangeQuoteCreateComponent
      },
      {
        path: "exchange-quote-edit/:customerId/:id",
        component: ExchangeQuoteCreateComponent
      },
      {
        path: "exchange-quote-list",
        component: ExchangeQuoteListComponent,
        data: { title: "Exchange Quote List" }
      },
      { 
        path: "app-exchange-quote-approval-rule", 
        component: ExchangeQuoteApprovalRuleComponent, 
        data: { title: "Exchange Quote Approval Rule"} 
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(exchangepagesRoute)],
  exports: [RouterModule],
  providers: []
})
export class ExchangepagesRoutingRoutes { }