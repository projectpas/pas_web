import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable ,  Subject,forkJoin } from "rxjs";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { ShelfEndpoint } from "./shelf-endpoint.service";
import { AuthService } from "./auth.service";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { Shelf } from "../models/shelf.model";
import { AuditHistory } from "../models/audithistory.model";

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = {
  roles: Role[] | string[];
  operation: RolesChangedOperation;
};

@Injectable()
export class ShelfService {
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
    private shelfEndpoint: ShelfEndpoint
  ) {}

  getShelfList() {
    return forkJoin(this.shelfEndpoint.getShelfEndpoint<Shelf[]>());
  }

  getManagementLocationData(locationId?: number) {
    return this.shelfEndpoint.getManagementLocationEndpoint<any>(locationId);
  }

  //getCountrylist() {
  //	return forkJoin(
  //		this.siteEndpoint.getcountryListEndpoint<any[]>());
  //}

  newShelf(shelf: Shelf) {
    return this.shelfEndpoint.getNewShelfEndpoint<Shelf>(shelf);
  }

  newManagementShelf(data: any) {
    return this.shelfEndpoint.getnewManagementShelfData<any>(data);
  }
  historyShelf(shelfId: number) {
    return forkJoin(
      this.shelfEndpoint.getHistoryShelfEndpoint<AuditHistory[]>(shelfId)
    );
  }

  getShelf(shelfId?: number) {
    return this.shelfEndpoint.getEditShelfEndpoint<Shelf>(shelfId);
  }

  updateShelf(shelf: Shelf) {
    return this.shelfEndpoint.getUpdateShelfEndpoint(shelf, shelf.shelfId);
  }

  getShelfStock(shelfId: number) {
    return this.shelfEndpoint.getShelfStockEndpoint(shelfId);
  }

  deleteShelf(shelfId: number) {
    return this.shelfEndpoint.getDeleteShelfEndpoint(shelfId);
  }

  getAddressDate(shelfId: any) {
    return this.shelfEndpoint.getAddressDataWarehouseEndpoint(shelfId);
  }

  getWareHouseDate(shelfId: any) {
    return this.shelfEndpoint.getWareHouseDataEndpoint(shelfId);
  }

  getLocationDate(shelfId: any) {
    return this.shelfEndpoint.getLocationDataEndpoint(shelfId);
  }

  getManagementShelfEditData(shelfId?: number) {
    return this.shelfEndpoint.getManagementShelfEditEndpoint<any>(shelfId);
  }

  deleteManagementShelf(data: any) {
    return this.shelfEndpoint.getDeleteManagementShelfEndpoint(
      data[0].data.shelfId
    );
  }

  getShelfAudit(shelfId: number) {
    return this.shelfEndpoint.getShelfDataAuditById<any>(shelfId);
  }

  bulkUpload(file: any): Observable<object> {
    return this.shelfEndpoint.bulkUpload(file);
  }
}
