
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkOrderSettingsComponent } from "./work-order-settings.component";


import { CreateWorkOrderSettingsComponent } from "./create-work-order-settings/create-work-order-settings.component";
import { WorkOrderSettingsListComponent } from "./work-order-settings-list/work-order-settings-list.component";
import { CreateWOQuoteSettingsComponent } from "./create-wo-quote-settings/create-wo-quote-settings.component";
import { WOQuoteSettingsListComponent } from "./wo-quote-settings-list/wo-quote-settings-list.component";

import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
const workOrderSettingsRoutes: Routes = [
	{
		path: 'workordersettings',
		component: WorkOrderSettingsComponent,
		children: [
			{ path: "app-work-order-settings-list", component: WorkOrderSettingsListComponent, data: { title: "Work Order Settings List" } },
			{ path: "app-create-work-order-settings", component: CreateWorkOrderSettingsComponent, data: { title: "Create Work Order Settings" } },
			{ path: "app-create-work-order-settings/edit/:id", component: CreateWorkOrderSettingsComponent, data: { title: "Edit Work Order Settings" } },
			{ path: "app-create-wo-quote-settings", component: CreateWOQuoteSettingsComponent, data: { title: "Create WO Quote Settings" } },
			{ path: "app-wo-quote-settings-list", component: WOQuoteSettingsListComponent, data: { title: "WO Quote Settings List" } }

		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(workOrderSettingsRoutes)
	],
	exports: [
		RouterModule
	],
	providers: [
		AuthService, AuthGuard
	]
})
export class WorkOrderSettingsRoutingModule { }