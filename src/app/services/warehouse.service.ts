import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable ,  Subject ,forkJoin} from "rxjs";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { WarehouseEndpoint } from "./warehouse-endpoint.service";
import { AuthService } from "./auth.service";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { Warehouse } from "../models/warehouse.model";
import { AuditHistory } from "../models/audithistory.model";

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = {
  roles: Role[] | string[];
  operation: RolesChangedOperation;
};

@Injectable()
export class WarehouseService {
  listCollection: any;
  isEditMode: boolean = false;
  public static readonly roleAddedOperation: RolesChangedOperation = "add";
  public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
  public static readonly roleModifiedOperation: RolesChangedOperation =   "modify";



  private _rolesChanged = new Subject<RolesChangedEventArg>();

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private warehouseEndpoint: WarehouseEndpoint
  ) {}

  getWarehouseList() {
    return forkJoin(
      this.warehouseEndpoint.getWarehouseEndpoint<Warehouse[]>()
    );
  }

  //getCountrylist() {
  //	return forkJoin(
  //		this.siteEndpoint.getcountryListEndpoint<any[]>());
  //}

  newWarehouse(warehouse: Warehouse) {
    return this.warehouseEndpoint.getNewWarehouseEndpoint<Warehouse>(warehouse);
  }

  historyWarehouse(warehouseId: number) {
    return forkJoin(
      this.warehouseEndpoint.getHistoryWarehouseEndpoint<AuditHistory[]>(
        warehouseId
      )
    );
  }

  getWarehouse(warehouseId?: number) {
    return this.warehouseEndpoint.getEditWarehouseEndpoint<Warehouse>(
      warehouseId
    );
  }

  getWarehouseStock(siteId?: number) {
    return this.warehouseEndpoint.getWarehouseStockSiteEndpoint<Warehouse[]>(
      siteId
    );
  }

  updateWarehouse(warehouse: Warehouse) {
    return this.warehouseEndpoint.getUpdateWarehouseEndpoint(
      warehouse,
      warehouse.warehouseId
    );
  }

  deleteWarehouse(warehouseId: number) {
    return this.warehouseEndpoint.getDeleteWarehouseEndpoint(warehouseId);
  }

  deleteManagementWarehouse(data: any) {
    return this.warehouseEndpoint.getDeleteManagementWarehouseEndpoint(
      data[0].data.warehouseId
    );
  }

  getAddressDate(warehouseId: any) {
    return this.warehouseEndpoint.getAddressDataWarehouseEndpoint(warehouseId);
  }

  newManagementWareHouse(data: any) {
    return this.warehouseEndpoint.getnewManagementWareHouseData<any>(data);
  }

  getManagementWarehouseEditData(warehouseId?: number) {
    return this.warehouseEndpoint.getManagementWarehouseEditEndpoint<any>(
      warehouseId
    );
  }

  getManagementSiteData(siteId?: number) {
    return this.warehouseEndpoint.getManagementSiteEndpoint<any>(siteId);
  }

  deleteManagementWareHouse(data: any) {
    return this.warehouseEndpoint.getDeleteManagementWarehouseEndpoint(
      data[0].data.warehouseId
    );
  }

  getWarehouseAudit(warehouseId: number) {
    return this.warehouseEndpoint.getWarehouseAuditById<any>(warehouseId);
  }

  bulkUpload(file: any): Observable<object> {
    return this.warehouseEndpoint.bulkUpload(file);
    }

    getSearchData(serverSidePagesData: any) {
        return forkJoin(
            this.warehouseEndpoint.SearchData<any[]>(serverSidePagesData));
    }
}
