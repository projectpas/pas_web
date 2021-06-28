// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { NgModule } from "@angular/core";
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { RoleListComponent } from "./role-list.component";
import { EditRoleDialogComponent } from "./edit-role-dialog.component";
import { RoleEditorComponent } from './role-editor.component';
import { UserListComponent } from "./user-list.component";
import { EditUserDialogComponent } from "./edit-user-dialog.component";
import { GlobalSettingsComponent } from "./global-settings/global-settings.component";
import { PoApprovalComponent } from './po-approval/po-approval.component';
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { SelectButtonModule } from "primeng/selectbutton";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { InputSwitchModule } from "primeng/inputswitch";
import { CheckboxModule } from "primeng/checkbox";
import { AutoCompleteModule } from "primeng/autocomplete";
import { BreadcrumbModule } from 'primeng/breadcrumb'; //bread crumb
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from 'primeng/dropdown';
import { AccountService } from "../services/account.service";
import { POApprovalService } from "../services/po-approval.service";
import { GlAccountEndpointService } from "../services/glAccount/glAccount-endpoint.service";
import { BulkEmailComponent } from "./bulk-email/bulk-email.component";
import { FileUploadModule } from "primeng/fileupload";
import { EditorModule } from "primeng/editor";
import { DatePipe } from "@angular/common";
import { SalesQuoteService } from "../services/salesquote.service";
import { SalesQuoteEndpointService } from "../services/salesquote-endpoint.service";
import { LogViewerListComponent } from "./log-viewer/log-viewer-list.component";
import { LoggerService } from "../services/logger.service";
import { LoggerEndpointService } from "../services/logger-endpoint.service copy";
import { CalendarModule } from "primeng/calendar";
import { AppSharedModule } from "../app-shared.module";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        AdminRoutingModule,
        TableModule,
        ButtonModule,
        SelectButtonModule,
        InputTextModule,
        MultiSelectModule,
        InputSwitchModule,
        CheckboxModule,
        AutoCompleteModule,
        BreadcrumbModule,
        DropdownModule,
        FileUploadModule,
        EditorModule,
        CalendarModule,
        AppSharedModule
    ],
    declarations: [
        AdminComponent,
        RoleListComponent,
        EditRoleDialogComponent,
        RoleEditorComponent,
        UserListComponent,
        EditUserDialogComponent,
        GlobalSettingsComponent,
        BulkEmailComponent,
        PoApprovalComponent,
        LogViewerListComponent,
    ],
    providers: [
        GlAccountEndpointService,
        AccountService,
        POApprovalService,
        DatePipe,
        SalesQuoteService,
        SalesQuoteEndpointService,
        LoggerService,
        LoggerEndpointService
    ],
    entryComponents: [
        EditUserDialogComponent,
        EditRoleDialogComponent
    ]
})
export class AdminModule {

} 