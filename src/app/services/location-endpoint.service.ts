import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";

import { EndpointFactory } from "./endpoint-factory.service";
import { ConfigurationService } from "./configuration.service";
import {catchError} from 'rxjs/operators';
@Injectable()
export class LocationEndpoint extends EndpointFactory {
  private readonly _actionsUrl: string = "/api/Location/Get";
  private readonly _actionsUrlNew: string = "/api/Location/locationPost";
  private readonly __managementWarwhouseURL: string =
    "/api/Location/GetManagementWareHouse";
  private readonly _actionsManagemetUrl: string =
    "/api/Location/GetMangementLocation"; //change
  private readonly _actionsUrlNew1: string = "/api/Location/GetAddress";
  private readonly _actionsUrlNew2: string = "/api/Location/GetWarehouse";
  private readonly _actionLOcationStock: string =
    "/api/Location/GetLocationStockData";
  private readonly _actionsUrlAuditHistory: string =
    "/api/Location/ataauditHistoryById";
  private readonly _actionsUrlManagementPost: string =
    "/api/Location/managementLocationPost"; //change

  private readonly getLocationDataAuditById: string = "/api/Location/audits";
  //private readonly _countryUrl: string = "/api/Site/GetcountryList";
  //private readonly _countryUrlNew: string = "api/Site/postCountryList";
  private readonly bulkLocationUpload = "/api/location/bulkupload";

  get actionsUrl() {
    return this.configurations.baseUrl + this._actionsUrl;
  }

  get actionsMangementLocationUrl() {
    return this.configurations.baseUrl + this._actionsManagemetUrl;
  } //change

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    injector: Injector
  ) {
    super(http, configurations, injector);
  }

  getLocationStockEndpoint<T>(locationId: number): Observable<T> {
    let endpointUrl = `${this._actionLOcationStock}/${locationId}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getLocationStockEndpoint(locationId)
        );
      }));
  }

  getLocationEndpoint<T>(): Observable<T> {
    return this.http
      .get<any>(this.actionsUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getLocationEndpoint());
      }));
  }

  getManagementWareHouseEndpoint<T>(wareHouseID: any): Observable<T> {
    let endpointUrl = `${this.__managementWarwhouseURL}/${wareHouseID}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getManagementWareHouseEndpoint(wareHouseID)
        );
      }));
  }

  //edit data ManagementSite Data Retrive based on location id
  getManagementLocationEditEndpoint<T>(locationId: number): Observable<T> {
    let endpointUrl = `${this._actionsManagemetUrl}/${locationId}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getManagementLocationEditEndpoint(locationId)
        );
      }));
  }

  getnewManagementLocationData<T>(userObject: any): Observable<T> {
    return this.http
      .post<any>(
        this._actionsUrlManagementPost,
        JSON.stringify(userObject),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getnewManagementLocationData(userObject)
        );
      }));
  }

  //Delete management Location Before Edit
  getDeleteManagementLocationEndpoint<T>(locationId: number): Observable<T> {
    let endpointUrl = `${this._actionsUrlManagementPost}/${locationId}`;
    return this.http
      .delete<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getDeleteManagementLocationEndpoint(locationId)
        );
      }));
  }

  getNewLocationEndpoint<T>(userObject: any): Observable<T> {
    return this.http
      .post<any>(
        this._actionsUrlNew,
        JSON.stringify(userObject),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getNewLocationEndpoint(userObject)
        );
      }));
  }

  //getcountryListEndpoint<T>(): Observable<T> {

  //	return this.http.get<T>(this.countryUrl, this.getRequestHeaders())
  //		.catch(error => {
  //			return this.handleError(error, () => this.getcountryListEndpoint());
  //		});
  //}

  getHistoryLocationEndpoint<T>(locationId: number): Observable<T> {
    let endpointUrl = `${this._actionsUrlAuditHistory}/${locationId}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getHistoryLocationEndpoint(locationId)
        );
      }));
  }

  getEditLocationEndpoint<T>(locationId?: number): Observable<T> {
    let endpointUrl = locationId
      ? `${this._actionsUrlNew}/${locationId}`
      : this._actionsUrlNew;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getEditLocationEndpoint(locationId)
        );
      }));
  }

  getUpdateLocationEndpoint<T>(
    roleObject: any,
    locationId: number
  ): Observable<T> {
    let endpointUrl = `${this._actionsUrlNew}/${locationId}`;

    return this.http
      .put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getUpdateLocationEndpoint(roleObject, locationId)
        );
      }));
  }

  getDeleteLocationEndpoint<T>(locationId: number): Observable<T> {
    let endpointUrl = `${this._actionsUrlNew}/${locationId}`;

    return this.http
      .delete<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getDeleteLocationEndpoint(locationId)
        );
      }));
  }

  getAddressDataWarehouseEndpoint<T>(locationId: any): Observable<T> {
    let endpointUrl = `${this._actionsUrlNew1}/${locationId}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getAddressDataWarehouseEndpoint(locationId)
        );
      }));
  }

  getWareHouseDataEndpoint<T>(locationId: any): Observable<T> {
    let endpointUrl = `${this._actionsUrlNew2}/${locationId}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getWareHouseDataEndpoint(locationId)
        );
      }));
  }

  getLocationAuditById<T>(locationId: number): Observable<T> {
    let endpointUrl = `${this.getLocationDataAuditById}/${locationId}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getLocationAuditById(locationId)
        );
      }));
  }

  bulkUpload(file: any): Observable<object> {
    return this.http.post(this.bulkLocationUpload, file);
  }
}
