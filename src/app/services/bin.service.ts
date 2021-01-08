import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable ,  Subject,forkJoin } from "rxjs";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { BinEndpoint } from "./bin-endpoint.service";
import { AuthService } from "./auth.service";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { Shelf } from "../models/shelf.model";
import { AuditHistory } from "../models/audithistory.model";
import { Bin } from "../models/bin.model";
import { Warehouse } from "../models/warehouse.model";
import { MyLocation } from "../models/location.model";

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = {
  roles: Role[] | string[];
  operation: RolesChangedOperation;
};

@Injectable()
export class BinService {
  listCollection: any;
  isEditMode: boolean = false;
  public static readonly roleAddedOperation: RolesChangedOperation = "add";
  public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
  public static readonly roleModifiedOperation: RolesChangedOperation =
    "modify";

  private _rolesChanged = new Subject<RolesChangedEventArg>();

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private binEndpoint: BinEndpoint
  ) {}

  getBinList() {
    return forkJoin(this.binEndpoint.getBinEndpoint<Bin[]>());
  }

  getManagementShelfData(shelfID?: number) {
    return this.binEndpoint.getManagementShelfEndpoint<any>(shelfID);
  }

  newManagementBin(data: any) {
    return this.binEndpoint.getnewManagementBinData<any>(data);
  }

  //getCountrylist() {
  //	return forkJoin(
  //		this.siteEndpoint.getcountryListEndpoint<any[]>());
  //}

  newBin(bin: Bin) {
    return this.binEndpoint.getNewBinEndpoint<Bin>(bin);
  }

  historyBin(binId: number) {
    return forkJoin(
      this.binEndpoint.getHistoryBinEndpoint<AuditHistory[]>(binId)
    );
  }

  getBin(binId?: number) {
    return this.binEndpoint.getEditBinEndpoint<Bin>(binId);
  }

  updateBin(bin: Bin) {
    return this.binEndpoint.getUpdateBinEndpoint(bin, bin.binId);
  }

  deleteBin(binId: number) {
    return this.binEndpoint.getDeleteBinEndpoint(binId);
  }

  getAddressDate(binId: any) {
    return this.binEndpoint.getAddressDataWarehouseEndpoint(binId);
  }

  getWareHouseDate(binId: any) {
    return this.binEndpoint.getWareHouseDataEndpoint(binId);
  }

  getWareHouseBySiteId(siteId: number) {
    return this.binEndpoint.getWareHouseBySiteIdEndpoint<Warehouse[]>(siteId);
  }

  getLocationDate(binId: any) {
    return this.binEndpoint.getLocationDataEndpoint(binId);
  }

  getLocationByWareHouseId(wareHouseId: number) {
    return this.binEndpoint.getLocationByWareHouseIdEndpoint<MyLocation[]>(
      wareHouseId
    );
  }

  getShelfDate(binId: any) {
    return this.binEndpoint.getShelfDataEndpoint(binId);
  }

  getShelfByLocationId(locationId: number) {
    return this.binEndpoint.getShelfByLocationIdEndpoint<Shelf[]>(locationId);
  }

  getBinDataById(binId: any) {
    return this.binEndpoint.getBinDataEndpoint(binId);
  }

  getBinByShelfId(shelfId: number) {
    return this.binEndpoint.getBinByShelfIdEndpoint<Bin[]>(shelfId);
  }

  getManagementBinEditData(binId?: number) {
    return this.binEndpoint.getManagementBinEditEndpoint<any>(binId);
  }

  deleteManagementBin(data: any) {
    return this.binEndpoint.getDeleteManagementBinEndpoint(data[0].data.binId);
  }

  deleteManagementBinById(binId: any) {
    return this.binEndpoint.getDeleteManagementBinEndpoint(binId);
  }

  getBinAudit(binId: number) {
    return this.binEndpoint.getBinAuditDataById<any>(binId);
  }
}
