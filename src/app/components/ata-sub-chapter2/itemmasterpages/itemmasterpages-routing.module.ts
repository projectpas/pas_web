//import { NgModule } from '@angular/core';
//import { RouterModule, Routes } from '@angular/router';
//import { ItemmasterPagesComponent } from "./itemmasterpages.component";
//import { ItemMasterListComponent } from "../components/item-masters/item-master-list/item-master-list.component";
//import { ItemMasterSetupComponent } from "../components/item-masters/item-master-setup/item-master-setup.component";
//import { ItemMasterStockComponent } from "../components/item-masters/item-master-stock/item-master-stock.component";
//import { ItemMasterNonStockComponent } from "../components/item-masters/item-master-non-stock/item-master-non-stock.component";
//import { ItemMasterEquipmentComponent } from "../components/item-masters/item-master-equipment/item-master-equipment.component";
//import { ItemMasterExchangeComponent } from "../components/item-masters/item-master-exchange/item-master-exchange.component";
//import { ItemMasterLoanComponent } from "../components/item-masters/item-master-loan/item-master-loan.component";

//import { AuthService } from '../services/auth.service';
//import { AuthGuard } from '../services/auth-guard.service';

//const itemmasterPagesRoutes: Routes = [
//	{
//		path: 'itemmasterpages',
//		component: ItemmasterPagesComponent,
//		children: [
//			{ path: "app-item-master-list", component: ItemMasterListComponent, data: { title: "ItemMaster's List" } },
//			{ path: "app-item-master-setup", component: ItemMasterSetupComponent, data: { title: "Item Master's Setup" } },
//			{ path: "app-item-master-stock", component: ItemMasterStockComponent, data: { title: "Item Master's Stock" } },
//			{ path: "app-item-master-non-stock", component: ItemMasterNonStockComponent, data: { title: "Item Master's Non Stock" } },
//			{ path: "app-item-master-equipment", component: ItemMasterEquipmentComponent, data: { title: "Item Master's Equipment" } },
//			{ path: "app-item-master-exchange", component: ItemMasterExchangeComponent, data: { title: "Item Master's Exchange" } },
//			{ path: "app-item-master-loan", component: ItemMasterLoanComponent, data: { title: "Item Master's Loan" } },
			
//		]
//	}
//];

//@NgModule({
//	imports: [
//		RouterModule.forChild(itemmasterPagesRoutes)
//	],
//	exports: [
//		RouterModule
//	],
//	providers: [
//		AuthService, AuthGuard
//	]
//})
//export class ItemmasterpagesRoutingModule { }