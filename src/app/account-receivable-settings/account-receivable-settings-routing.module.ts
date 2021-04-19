import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ARSettingsComponent } from "./account-receivable-settings.component";
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { CreateARSettingsComponent } from './create-account-receivable-settings/create-account-receivable-settings.component';
import { ARSettingsListComponent } from './account-receivable-settings-list/account-receivable-settings-list.component';
const accountreceivableSettingsRoutes: Routes = [
	{
		path: 'arsettings',
		component: ARSettingsComponent,
		children: [
			{ path: "app-create-account-receivable-settings", component: CreateARSettingsComponent, data: { title: "Create AR Settings" } },
			{ path: "app-account-receivable-settings-list", component: ARSettingsListComponent, data: { title: "AR Settings List" } }
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(accountreceivableSettingsRoutes)
	],
	exports: [
		RouterModule
	],
	providers: [
		AuthService, AuthGuard
	]
})
export class ARSettingsRoutingModule { }