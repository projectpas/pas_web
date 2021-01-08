// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';





import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { AuditHistory } from '../models/audithistory.model';
import { StocklineEndpoint } from './stockline-endpoint.service'
import { CustomPaginate } from '../models/custom-paginate';
import { StocklineListSalesFilter } from '../models/sales/StocklineListSalesFilter';
export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class StocklineService {


	listCollection: any;
	isEditMode: boolean;
	//isEditMode: boolean;

	enableExternal: boolean = false;
	generalCollection: any;
	financeCollection: any;
	ShowPtab: boolean = true;
	public static readonly roleAddedOperation: RolesChangedOperation = "add";
	public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
	public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

	private _rolesChanged = new Subject<RolesChangedEventArg>();
	public currentUrl = this.router.url;
	public alertObj = new Subject<any>();
	public alertChangeObject$ = this.alertObj.asObservable();
	public indexObj = new Subject<any>();
	public indexObjChangeObject$ = this.indexObj.asObservable();
	public bredcrumbObj = new Subject<any>();
	public bredcrumbObjChangeObject$ = this.bredcrumbObj.asObservable();
	isAdjustment: boolean;
	adjustmentCollection: any;

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private stocklineEndpoint: StocklineEndpoint) { }
	//For getting the stockline List

	getStockLineList(data) {
		return this.stocklineEndpoint.getStockLineListEndpoint(data);
	}

	getGlobalSearch(value, pageIndex, pageSize) {
		return this.stocklineEndpoint.getGlobalStockLineRecords<any>(value, pageIndex, pageSize);
	}

	updateActionforActive(action, login) {
		return this.stocklineEndpoint.getUpdatestockLineEndpointforActive(action, login);
	}

	getStockLineAdjustmentDatatypeList() {
		return forkJoin(
			this.stocklineEndpoint.getStockLineAdjustmentDatatypeDataEndpoint<any[]>());
	}

	getStockCompanyList() {
		return forkJoin(
			this.stocklineEndpoint.getStockLineCompanyListEndpoint<any[]>());
	}

	getManagemtentLengalEntityData() {
		return forkJoin(
			this.stocklineEndpoint.getManagemtentLengalEntityEndpoint<any[]>());
	}
	//For entering into the new stockline values
	newStockLine(sourceStockLine: any) {
		return this.stocklineEndpoint.getNewstockLineEndpoint<any>(sourceStockLine);
	}


	//For updating the stockline set up values
	updateStockSetupLine(sourceStockLine: any) {
		return this.stocklineEndpoint.getUpdatestockLineSetupEndpoint<any>(sourceStockLine, sourceStockLine.stockLineId);
	}

	updateStockAdjustmentToListIfExist(sourceStockLine: any) {
		return this.stocklineEndpoint.getUpdateStockAdjustmentToListIfExistEndpoint<any>(sourceStockLine, sourceStockLine.StockLineId);
	}

	updateStockLineAdjustmentToList(sourceStockLine: any) {
		return this.stocklineEndpoint.getUpdateStockLineAdjustmentToListEndpoint<any>(sourceStockLine, sourceStockLine.StockLineId);
	}

	getStocklineListById(stocklineId) {
		return this.stocklineEndpoint.getStockLineByIdEndpoint(stocklineId);
	}

	//For getting the stockline Adjustment values
	getStockLineAdjustmentList(stocklineId) {
		return this.stocklineEndpoint.getStockLineAdjustmentEndpoint<any>(stocklineId);
	}

	//For getting the stockline IntegrationPortal Get
	getStockLineIntegrationList(stocklineId: any) {
		return this.stocklineEndpoint.getStockLineIntegrationPortalByIdEndpoint<any>(stocklineId);
	}

	//For getting the stockline Adjustment values
	getStockLineTimeLifeList(timelifeId) {
		return this.stocklineEndpoint.getStockLineTimeLifeByIdEndpoint(timelifeId);
	}

	//will retrive Data of Bin List Based on Before Change
	getStockLineBinDateBeforeChange(shelfId) {
		return this.stocklineEndpoint.getBinDataFromShelfIdBeforeChange(shelfId);
	}



	//For entering into the new stocklineadjustment values of Part-A
	newStockLineAdjustment(sourceStockLineAdjustment: any) {
		return this.stocklineEndpoint.getNewstockLineAdjustmentEndpoint<any>(sourceStockLineAdjustment);
	}

	//for Update Time Life
	updateStockLineTimelife(sourceTimeLife: any) {
		return this.stocklineEndpoint.getUpdatestockLineTimeLifeEndpoint<any>(sourceTimeLife, sourceTimeLife.timeLifeCyclesId);
	}

	//For updating the stocklineadjustment values of Part-A
	updateStockLineAdjustment(sourceStockLine: any) {
		return this.stocklineEndpoint.getUpdatestockLineAdjustmentEndpoint<any>(sourceStockLine, sourceStockLine.stockLineId);
	}


	//For entering into the new stocklineadjustment values of Part-C
	newStockLineTimeLife(sourceStockLine: any) {
		return this.stocklineEndpoint.getNewstockLineTimeAdjustmentEndpoint<any>(sourceStockLine);
	}

	saveStocklineIntegrationPortalData(sourceIntegrationPortalData: any) {
		return this.stocklineEndpoint.saveStocklineIntegrationPortalDataEndpoint<any>(sourceIntegrationPortalData);
	}

	//updateItemMasterEndpoint(sourceStockLine: any) {
	//	return this.stocklineEndpoint.getUpdateItemMasterDetEndpoint<any>(sourceStockLine);
	//}

	//For updating the stocklineadjustment values of Part-C
	updateStockLineTimeAdjustment(sourceStockLine: any) {
		return this.stocklineEndpoint.getUpdatestockLineTimeAdjustmentEndpoint<any>(sourceStockLine, sourceStockLine);
	}

	//For updating the ItemMaster Part
	updateItemMasterPartPost(object: any) {
		return this.stocklineEndpoint.getUpdateItemMasterPartEndpoint<any>(object);
	}



	//for Stockline Adjustment Reason for Single Screen

	getStocklineAdjustmentreason() {
		return forkJoin(
			this.stocklineEndpoint.getStocklineAdjustmentReasonEndpoint<any>());
	}

	newStockLineAdjustmentReason(stocklineAdjustmentReason: any) {

		return this.stocklineEndpoint.getNewstockLineAdjustmentReasonEndpoint<any>(stocklineAdjustmentReason);
	}

	getUpdateStocklineAdjustmentReasonEndpoint(Object: any) {
		return this.stocklineEndpoint.getUpdateStocklineAdjustmentReasonEndpoint(Object);
	}

	deleteStocklineAdjustment(Object: any) {
		return this.stocklineEndpoint.getDeleteStocklineAdjustmentReasonEndpoin(Object);
	}

	getPOUnitCost(Object: any) {
		return this.stocklineEndpoint.getPOUnitCostEndpoint(Object);
	}

	getROUnitCost(Object: any) {
		return this.stocklineEndpoint.getROUnitCostEndpoint(Object);
	}

	getPurchaseOrderUnitCost(POId: any) {
		return this.stocklineEndpoint.getPurchaseOrderUnitCostEndpoint(POId);
	}

	getAllTagTypes() {
		return this.stocklineEndpoint.getAllTagTypes();
	}

	getRepairOrderUnitCost(ROId: any) {
		return this.stocklineEndpoint.getRepairOrderUnitCostEndpoint(ROId);
	}

	deleteIntegrationById(actionId: number) {
		return this.stocklineEndpoint.getDeleteIntegrationEndpoint(actionId);
	}

	search(searchParameters: any) {
		return this.stocklineEndpoint.searchItemMaster(searchParameters);
	}
	multiSearch(searchParameters: any) {
		return this.stocklineEndpoint.multiSearch(searchParameters);
	}

	getStockLineDetailsByStockLineId(stockLineId) {
		return this.stocklineEndpoint.getStockLineDetailsByStockLineId(stockLineId);
	}
	getWareHouseDataBySiteId(siteId) {
		return this.stocklineEndpoint.getWareHouseDataBySiteId(siteId);
	}
	getLocationDataByWarehouseId(warehouseId) {
		return this.stocklineEndpoint.getLocationDataByWarehouseId(warehouseId);
	}
	getShelfDataByLocationId(locationId) {
		return this.stocklineEndpoint.getShelfDataByLocationId(locationId);
	}
	getBinDataByShelfId(shelfId) {
		return this.stocklineEndpoint.getBinDataByShelfId(shelfId);
	}

	getStockLineReportViewList(payload) {
		return this.stocklineEndpoint.getStockLineReportViewList(payload);
	}

	downloadStockLineReport() {
		return this.stocklineEndpoint.downloadStockLineReport();
	}

	getStockLineDetailsById(stockLineId) {
		return this.stocklineEndpoint.getStockLineDetailsById(stockLineId);
	}

	getStockLineListing(data) {
		return this.stocklineEndpoint.getStockLineListingEndpoint(data);
	}

	getStockLineListOnGlobalSearch(data) {
		return this.stocklineEndpoint.getStockLineListOnGlobalSearchEndpoint(data);
	}

	getDataForPOROByStocklineId(id) {
		return this.stocklineEndpoint.getDataForPOROByStocklineId(id);
	}

	getStocklineAudit(id) {
		return this.stocklineEndpoint.getStocklineAudit(id);
	}

	getStocklineAdjList(id) {
		return this.stocklineEndpoint.getStocklineAdjList(id);
	}

	getStocklineAdjData(id, dataTypeId) {
		return this.stocklineEndpoint.getStocklineAdjData(id, dataTypeId);
	}

	getStockLineSalesListingEndpoint(data): Observable<CustomPaginate<StocklineListSalesFilter>> {
		return this.stocklineEndpoint.getStockLineSalesListingEndpoint(data);
	}
	downloadAllStockLineList(data) {
		return this.stocklineEndpoint.downloadAllStockLineList(data);
	}
}