// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { ProductsComponent } from "./components/products/products.component";
import { OrdersComponent } from "./components/orders/orders.component";
import { SettingsComponent } from "./settings/settings.component";
import { AboutComponent } from "./components/about/about.component";
//import { SearchPoRoComponent } from "./components/receiving/po-ro/search-po-ro/search-po-ro.component";
//import { PoRoSetupComponent } from "./components/receiving/po-ro/po-ro-setup/po-ro-setup.component";
//import { PoSetupComponent } from "./components/receiving/po-ro/po-setup/po-setup.component";
//import { RoSetupComponent } from "./components/receiving/po-ro/ro-setup/ro-setup.component";
//import { ReceivingPoComponent } from "./components/receiving/po-ro/receiving-po/receiving-po.component";
//import { ReceivingRoComponent } from "./components/receiving/po-ro/receiving-ro/receiving-ro.component";
//import { ReceivingPoGridComponent } from "./components/receiving/po-ro/receiving-po-grid/receiving-po-grid.component";
//import { ReceivingRoGridComponent } from "./components/receiving/po-ro/receiving-ro-grid/receiving-ro-grid.component";
import { RmaComponent } from "./components/receiving/rma/rma.component";
import { SalesOrderComponent } from "./components/receiving/sales-order/sales-order.component";
import { ShippingComponent } from "./components/receiving/shipping/shipping.component";
//import { CapabilitiesComponent } from "./components/capabilities/capabilities.component";
import { LicTypeComponent } from "./components/lic-type/lic-type.component";
import { OwnerComponent } from "./components/owner/owner.component";
import { PlatformComponent } from "./components/platform/platform.component";
import { SupervisorComponent } from "./components/supervisor/supervisor.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { UserEditorComponent } from './admin/user-editor.component';
import { UserListComponent } from './admin/user-list.component';
import { UnauthorizedAccessComponent } from './unauthorizedaccess/unauthorized-access.component';
import { UpdatepasswordComponent } from './components/updatepassword/updatepassword.component';
//import { PoRoSetupComponent } from './components/receiving/po-ro/po-ro-setup/po-ro-setup.component';
//import { PoSetupComponent } from './components/receiving/po-ro/po-setup/po-setup.component';
//import { ReceivingPoComponent } from './components/receiving/po-ro/receiving-po/receiving-po.component';
//import { ReceivingRoComponent } from './components/receiving/po-ro/receiving-ro/receiving-ro.component';
//import { SinglePgesModule } from './singlepages/singlepages.module';
//import { CustomerPgesModule } from './customerpages/customerpages.module';
//import { WorkOrderPagesModule } from './workorderpages/workorderpages.module';



@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: "", component: HomeComponent, canActivate: [AuthGuard], data: { title: "Home" } },
            { path: "login", component: LoginComponent, data: { title: "Login" } },
            { path: "registration", component: UserEditorComponent, data: { title: "Registration" } },
            { path: "userlist", component: UserListComponent, data: { title: "User List" } },
            { path: "products", component: ProductsComponent, canActivate: [AuthGuard], data: { title: "Products" } },
            { path: "orders", component: OrdersComponent, canActivate: [AuthGuard], data: { title: "Orders" } },
            { path: "settings", component: SettingsComponent, canActivate: [AuthGuard], data: { title: "Settings" } },
            { path: "about", component: AboutComponent, data: { title: "About Us" } },
            { path: "unauthorized-access", component: UnauthorizedAccessComponent, data: { title: "Unauthorized Access" } },
            //{ path: "singlescreens", loadChildren: './components/actions/actionslazymodule#ActionsLazyModule' },
            { path: "rolesmodule", loadChildren: './rolespages/rolespages.module#RolesPagesModule' },
            { path: "workordersettingsmodule", loadChildren: './work-order-settings/work-order-settings.module#WorkOrderSettingsModule' },
            { path: "salesordersettingsmodule", loadChildren: './sales-order-settings/sales-order-settings.module#SalesOrderSettingsModule' },
            { path: "singlepages", loadChildren: './singlepages/singlepages.module#SinglePgesModule' },
            { path: "customersmodule", loadChildren: './customerpages/customerpages.module#CustomerPagesModule' },
            { path: "accountmodule", loadChildren: './accounting-pages/accountingpages.module#AccountingPagesModule' },
            //{ path: "vendorsmodule", loadChildren: './vendorpages/vendorpages.module#VendorPagesModule' },
            { path: "vendorsmodule", loadChildren: './vendorpages/vendorpages.module#VendorPagesModule', canLoad: [AuthGuard] },
            { path: "employeesmodule", loadChildren: './employeepages/employeepages.module#EmployeepagesModule' },
            { path: "itemmastersmodule", loadChildren: './itemmasterpages/itemmasterpages.module#ItemmasterpagesModule' },
            { path: "stocklinemodule", loadChildren: './stocklinepages/stocklinepages.module#StocklinePagesModule' },
            { path: "workordersmodule", loadChildren: './workorderpages/workorderpages.module#WorkOrderPagesModule' },
            { path: "receivingmodule", loadChildren: './receivingpages/receivingpages.module#ReceivingPagesModule' },
            { path: "generalledgermodule", loadChildren: './generalledgerpages/generalledgerpages.module#GeneralledgerPageModule' },
            { path: "workflowmodule", loadChildren: './workflowpages/workflowpages.module#WorkFlowPagesModule' },
            { path: "assetmodule", loadChildren: './assetmanagement/assetmanagement.module#AssetmanagementModule' },
            { path: "accountreceivable", loadChildren: './accounts-receivable/accountsreceivable.module#AccountsreceivableModule' },
            //{ path: "mastermodule", loadChildren: './mastermaintanacepages/mastermaintanacepages.module#MastermaintanceModule' },
            { path: "accountpayble", loadChildren: './accounts-payble-pages/accounts-payble.module#AccountsPaybleModule' },
            {
                path: "salesmodule",
                loadChildren: "./salespages/salespages.module#SalesPagesModule"
            },
            //{ path: "app-receiving-search-po-ro", component: SearchPoRoComponent, data: { title: "Search PO-RO" } },
            //{ path: "app-receiving-po-ro-setup", component: PoRoSetupComponent, data: { title: "PO-RO Setup" } },
            //{ path: "app-receiving-po-setup", component: PoSetupComponent, data: { title: "PO Setup" } },
            //{ path: "app-receiving-ro-setup", component: RoSetupComponent, data: { title: "RO Setup" } },
            //{ path: "app-receiving-po", component: ReceivingPoComponent, data: { title: "Receiving PO" } },
            //{ path: "app-receiving-ro", component: ReceivingRoComponent, data: { title: "Receiving RO" } },
            //{ path: "app-receiving-po-grid", component: ReceivingPoGridComponent, data: { title: "Receiving PO Grid" } },
            //{ path: "app-receiving-ro-grid", component: ReceivingRoGridComponent, data: { title: "Receiving RO Grid" } },
            { path: "app-receiving-rma", component: RmaComponent, data: { title: "RMA" } },
            { path: "app-receiving-sales-order", component: SalesOrderComponent, data: { title: "Sales Order" } },
            { path: "app-receiving-shipping", component: ShippingComponent, data: { title: "Shipping" } },
            //{ path: "app-stockline", component: StocklineComponent, data: { title: "Stockline" } },
            //{ path: "app-capabilities", component: CapabilitiesComponent, data: { title: "Capabilities" } },
            { path: "app-lic-type", component: LicTypeComponent, data: { title: "Lic Type" } },
            { path: "app-owner", component: OwnerComponent, data: { title: "Owner" } },
            { path: "app-platform", component: PlatformComponent, data: { title: "Platform" } },
            { path: "app-supervisor", component: SupervisorComponent, data: { title: "Supervisor" } },
            { path: "home", redirectTo: "/", pathMatch: "full" },
            {path:"updatepassword",component:UpdatepasswordComponent,data: { title: "UpdatePassword" } },
            { path: "**", component: NotFoundComponent, data: { title: "Page Not Found" } },
        ], {
            preloadingStrategy: PreloadAllModules
        })
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthService, AuthGuard
    ]
})
export class AppRoutingModule { }