// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from "./admin.component";
import { RoleListComponent } from './role-list.component';
import { UserListComponent } from './user-list.component';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { GlobalSettingsComponent } from './global-settings/global-settings.component';
import { PoApprovalComponent } from './po-approval/po-approval.component';
import { BulkEmailComponent } from './bulk-email/bulk-email.component';

const adminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            {
                path: 'users',
                component: UserListComponent,
                data: { title: "Admin | Users" }
            },
            {
                path: 'roles',
                component: RoleListComponent,
                data: { title: "Admin | Roles" }
            },
            {
                path: 'bulk-email',
                component: BulkEmailComponent,
                data: { title: "Admin | Bulk Email" }
            },
            {
                path: 'global-settings',
                component: GlobalSettingsComponent,
                data: { title: "Admin | Global Settings" }
            },
            {
                path: 'po-approvals',
                component: PoApprovalComponent,
                data: { title: "Admin | Approval Rule" }
            }            
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthService, AuthGuard
    ]
})
export class AdminRoutingModule { }