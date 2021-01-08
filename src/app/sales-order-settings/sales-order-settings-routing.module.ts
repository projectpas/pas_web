
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SalesOrderSettingsComponent } from "./sales-order-settings.component";
import { CreateSalesQuoteSettingsComponent } from "./create-sales-quote-settings/create-sales-quote-settings.component";
import { SalesQuoteSettingsListComponent } from "./sales-quote-settings-list/sales-quote-settings-list.component";

import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { CreateSalesOrderSettingsComponent } from './create-sales-order-settings/create-sales-order-settings.component';
import { SalesOrderSettingsListComponent } from './sales-order-settings-list/sales-order-settings-list.component';
const salesOrderSettingsRoutes: Routes = [
	{
		path: 'salesordersettings',
		component: SalesOrderSettingsComponent,
		children: [
			{ path: "app-create-sales-quote-settings", component: CreateSalesQuoteSettingsComponent, data: { title: "Create SO Quote Settings" } },
			{ path: "app-sales-quote-settings-list", component: SalesQuoteSettingsListComponent, data: { title: "Sales Quote Settings List" } },
			{ path: "app-create-sales-order-settings", component: CreateSalesOrderSettingsComponent, data: { title: "Create Sales Order Settings" } },
			{ path: "app-sales-order-settings-list", component: SalesOrderSettingsListComponent, data: { title: "SO Settings List" } }
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
export class SalesOrderSettingsRoutingModule { }