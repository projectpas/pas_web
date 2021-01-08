
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { QuickAppProMaterialModule } from "../modules/material.module";

import { RolesPagesRoutingModule } from "./rolespages-routing.module";

import { RolespagesComponent } from "./rolespages.component";


import { RolesListComponent } from "../components/roles/roles-list/roles-list.component";
import { RolesListByModuleComponent } from "../components/roles/roles-list-by-module/roles-list-by-module.component";
import { RolesSetupComponent } from "../components/roles/roles-setup/roles-setup.component";
import { RolesManagementStructureComponent } from "../components/roles/roles-management-structure/roles-management-structure.component";

import { CommonModule } from '@angular/common'; //<-- This one
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';


import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from "primeng/autocomplete";
import { GMapModule } from 'primeng/gmap';
import { AddActionsDialogComponent } from '../components/dialogs/add-actions-dialog/add-actions-dialog.component';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TreeTableModule } from "primeng/treetable";
import { TreeModule } from 'primeng/tree';
import { UserRolesSetupComponent } from "../components/user-role/user-role-setup.component";
import { UserRoleService } from "../components/user-role/user-role-service";
import { UserRoleEndPointService } from "../components/user-role/user-role-endpoint.service";
import { UserRolesMappingComponent } from "../components/user-role/user-role-mapping.component";
import { EditUserRolesComponent } from "../components/user-role/edit-user-roles.component";

@NgModule({
	imports: [
		FlexLayoutModule,
		FormsModule, ReactiveFormsModule,
		QuickAppProMaterialModule,
		TranslateModule,
		CommonModule,
		TableModule,
		ButtonModule,
		SelectButtonModule,
		InputTextModule,
		MultiSelectModule,
		RolesPagesRoutingModule,
		InputSwitchModule,
		CheckboxModule,
		AutoCompleteModule,
		GMapModule
        , RadioButtonModule, FileUploadModule, TreeTableModule, TreeModule  
	],
	declarations: [
		RolespagesComponent,
		RolesListComponent,
		RolesListByModuleComponent,
		RolesSetupComponent,
        RolesManagementStructureComponent,
        UserRolesSetupComponent,
        UserRolesMappingComponent,
        EditUserRolesComponent
	],
    providers: [
        UserRoleEndPointService,
        UserRoleService
	],
	entryComponents: [
	],


})
export class RolesPagesModule {

}