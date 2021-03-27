
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RolespagesComponent } from "./rolespages.component";

import { RolesListComponent } from "../components/roles/roles-list/roles-list.component";
import { RolesListByModuleComponent } from "../components/roles/roles-list-by-module/roles-list-by-module.component";
import { RolesSetupComponent } from "../components/roles/roles-setup/roles-setup.component";
import { RolesManagementStructureComponent } from "../components/roles/roles-management-structure/roles-management-structure.component";

import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { UserRolesSetupComponent } from '../components/user-role/user-role-setup.component';
import { UserRolesMappingComponent } from '../components/user-role/user-role-mapping.component';
import { EditUserRolesComponent } from '../components/user-role/edit-user-roles.component';
const rolesPagesRoutes: Routes = [
	{
		path: 'rolespages',
		component: RolespagesComponent,
		children: [
			
			{ path: "app-roles-list", component: RolesListComponent, data: { title: "Roles List" } },
			{ path: "app-roles-list-by-module", component: RolesListByModuleComponent, data: { title: "Roles List By Module" } },
            { path: "app-roles-setup", component: UserRolesSetupComponent, data: { title: "Roles Setup" } },
            { path: "edit-app-roles", component: EditUserRolesComponent, data: { title: "Edit Roles" } },
            { path: "app-roles-management-structure", component: RolesManagementStructureComponent, data: { title: "Roles Management Structure" } },
            { path: "app-roles-mapping", component: UserRolesMappingComponent, data:{ title: "User Role Management" } }
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(rolesPagesRoutes)
	],
	exports: [
		RouterModule
	],
	providers: [
		AuthService, AuthGuard
	]
})
export class RolesPagesRoutingModule { }