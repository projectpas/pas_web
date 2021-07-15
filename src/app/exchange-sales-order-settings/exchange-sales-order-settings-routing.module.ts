
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExchangeSalesOrderSettingsComponent } from "./exchange-sales-order-settings.component";
import { CreateExchangeQuoteSettingsComponent } from "./create-exchange-quote-settings/create-exchange-quote-settings.component";
import { ExchangeQuoteSettingsListComponent } from "./exchange-quote-settings-list/exchange-quote-settings-list.component";

import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { CreateExchangeSalesOrderSettingsComponent } from './create-exchange-sales-order-settings/create-exchange-sales-order-settings.component';
import { ExchangeSalesOrderSettingsListComponent } from './exchange-sales-order-settings-list/exchange-sales-order-settings-list.component';
const salesOrderSettingsRoutes: Routes = [
	{
		path: 'exchangesalesordersettings',
		component: ExchangeSalesOrderSettingsComponent,
		children: [
			{ path: "app-create-exchange-quote-settings", component: CreateExchangeQuoteSettingsComponent, data: { title: "Create Exchange Quote Settings" } },
			{ path: "app-exchange-quote-settings-list", component: ExchangeQuoteSettingsListComponent, data: { title: "Exchange Quote Settings List" } },
			{ path: "app-create-exchange-sales-order-settings", component: CreateExchangeSalesOrderSettingsComponent, data: { title: "Create Exchange Sales Order Settings" } },
			{ path: "app-exchange-sales-order-settings-list", component: ExchangeSalesOrderSettingsListComponent, data: { title: "Exchange SO Settings List" } }
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(salesOrderSettingsRoutes)
	],
	exports: [
		RouterModule
	],
	providers: [
		AuthService, AuthGuard
	]
})
export class ExchangeSalesOrderSettingsRoutingModule { }