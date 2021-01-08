import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { LocationEndpoint } from "./location-endpoint.service";
import { AuthService } from "./auth.service";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { Location } from "../models/location.model";
import { AuditHistory } from "../models/audithistory.model";

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = {
  roles: Role[] | string[];
  operation: RolesChangedOperation;
};

@Injectable()
export class LocationService {
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
    private locationEndpoint: LocationEndpoint
  ) {}

  getLocationList() {
    return Observable.forkJoin(
      this.locationEndpoint.getLocationEndpoint<Location[]>()
    );
  }

  newManagementSite(data: any) {
    return this.locationEndpoint.getnewManagementLocationData<any>(data);
  }

  getManagementWareHouseData(wareHouseId?: number) {
    return this.locationEndpoint.getManagementWareHouseEndpoint<any>(
      wareHouseId
    );
  }

  //getCountrylist() {
  //	return Observable.forkJoin(
  //		this.siteEndpoint.getcountryListEndpoint<any[]>());
  //}

  newLocation(location: Location) {
    return this.locationEndpoint.getNewLocationEndpoint<Location>(location);
  }

  historyLocation(locationId: number) {
    return Observable.forkJoin(
      this.locationEndpoint.getHistoryLocationEndpoint<AuditHistory[]>(
        locationId
      )
    );
  }

  getLocationStock(locationId?: number) {
    return this.locationEndpoint.getLocationStockEndpoint<Location>(locationId);
  }

  getLocation(locationId?: number) {
    return this.locationEndpoint.getEditLocationEndpoint<Location>(locationId);
  }

  updateLocation(location: Location) {
    return this.locationEndpoint.getUpdateLocationEndpoint(
      location,
      location.locationId
    );
  }

  deleteLocation(locationId: number) {
    return this.locationEndpoint.getDeleteLocationEndpoint(locationId);
  }

  getAddressDate(locationId: any) {
    return this.locationEndpoint.getAddressDataWarehouseEndpoint(locationId);
  }

  getWareHouseDate(locationId: any) {
    return this.locationEndpoint.getWareHouseDataEndpoint(locationId);
  }

  getManagementLocationEditData(locationId?: number) {
    return this.locationEndpoint.getManagementLocationEditEndpoint<any>(
      locationId
    );
  }

  deleteManagementLocation(data: any) {
    return this.locationEndpoint.getDeleteManagementLocationEndpoint(
      data[0].data.locationId
    );
  }

  getLocationAudit(locationId: number) {
    return this.locationEndpoint.getLocationAuditById<any>(locationId);
  }

  bulkUpload(file: any): Observable<object> {
    return this.locationEndpoint.bulkUpload(file);
  }
}
