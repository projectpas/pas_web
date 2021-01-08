import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "./endpoint-factory.service";
import { ConfigurationService } from "./configuration.service";

@Injectable()
export class ShelfEndpoint extends EndpointFactory {
  private readonly _actionsUrl: string = "/api/Shelf/Get";
  private readonly _actionsManagemetUrl: string =
    "/api/Shelf/GetMangementShelf";
  private readonly __managementLocationURL: string =
    "/api/Shelf/GetManagementLocation";
  private readonly _actionsUrlNew: string = "/api/Shelf/shelfPost";
  private readonly _actionsUrlNew1: string = "/api/Shelf/GetAddress";
  private readonly _actionsUrlNew2: string = "/api/Shelf/GetWarehouse";
  private readonly _actionsUrlNew3: string = "/api/Shelf/GetLocations";
  private readonly _actionsUrlStock: string = "/api/Shelf/GetAllShelfStockData";
  private readonly _actionsUrlAuditHistory: string =
    "/api/Shelf/ataauditHistoryById";
  private readonly _actionsUrlManagementPost: string =
    "/api/Shelf/managementShelfPost"; //change
  private readonly getShelfAuditById: string = "/api/Shelf/audits";
  //private readonly _countryUrl: string = "/api/Site/GetcountryList";
  //private readonly _countryUrlNew: string = "api/Site/postCountryList";
  private readonly bulkShelfUpload = "/api/shelf/bulkupload";

  get actionsUrl() {
    return this.configurations.baseUrl + this._actionsUrl;
  }
  get actionsMangementShelfUrl() {
    return this.configurations.baseUrl + this._actionsManagemetUrl;
  } //change

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    injector: Injector
  ) {
    super(http, configurations, injector);
  }

  getShelfEndpoint<T>(): Observable<T> {
    return this.http
      .get<T>(this.actionsUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.getShelfEndpoint());
      });
  }

  getShelfStockEndpoint<T>(locationID: any): Observable<T> {
    let endpointUrl = `${this._actionsUrlStock}/${locationID}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () =>
          this.getShelfStockEndpoint(locationID)
        );
      });
  }

  getManagementLocationEndpoint<T>(locationID: any): Observable<T> {
    let endpointUrl = `${this.__managementLocationURL}/${locationID}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () =>
          this.getManagementLocationEndpoint(locationID)
        );
      });
  }

  getnewManagementShelfData<T>(userObject: any): Observable<T> {
    return this.http
      .post<T>(
        this._actionsManagemetUrl,
        JSON.stringify(userObject),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleError(error, () =>
          this.getnewManagementShelfData(userObject)
        );
      });
  }

  //edit data ManagementSite Data Retrive based on location id
  getManagementShelfEditEndpoint<T>(shelfId: number): Observable<T> {
    let endpointUrl = `${this._actionsManagemetUrl}/${shelfId}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () =>
          this.getManagementShelfEditEndpoint(shelfId)
        );
      });
  }

  //Delete management Location Before Edit
  getDeleteManagementShelfEndpoint<T>(shelfId: number): Observable<T> {
    let endpointUrl = `${this._actionsUrlManagementPost}/${shelfId}`;
    return this.http
      .delete<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () =>
          this.getDeleteManagementShelfEndpoint(shelfId)
        );
      });
  }

  getNewShelfEndpoint<T>(userObject: any): Observable<T> {
    return this.http
      .post<T>(
        this._actionsUrlNew,
        JSON.stringify(userObject),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleError(error, () =>
          this.getNewShelfEndpoint(userObject)
        );
      });
  }

  //getcountryListEndpoint<T>(): Observable<T> {

  //	return this.http.get<T>(this.countryUrl, this.getRequestHeaders())
  //		.catch(error => {
  //			return this.handleError(error, () => this.getcountryListEndpoint());
  //		});
  //}

  getHistoryShelfEndpoint<T>(shelfId: number): Observable<T> {
    let endpointUrl = `${this._actionsUrlAuditHistory}/${shelfId}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () =>
          this.getHistoryShelfEndpoint(shelfId)
        );
      });
  }

  getEditShelfEndpoint<T>(shelfId?: number): Observable<T> {
    let endpointUrl = shelfId
      ? `${this._actionsUrlNew}/${shelfId}`
      : this._actionsUrlNew;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () =>
          this.getEditShelfEndpoint(shelfId)
        );
      });
  }

  getUpdateShelfEndpoint<T>(roleObject: any, shelfId: number): Observable<T> {
    let endpointUrl = `${this._actionsUrlNew}/${shelfId}`;

    return this.http
      .put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () =>
          this.getUpdateShelfEndpoint(roleObject, shelfId)
        );
      });
  }

  getDeleteShelfEndpoint<T>(shelfId: number): Observable<T> {
    let endpointUrl = `${this._actionsUrlNew}/${shelfId}`;

    return this.http
      .delete<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () =>
          this.getDeleteShelfEndpoint(shelfId)
        );
      });
  }

  getAddressDataWarehouseEndpoint<T>(shelfId: any): Observable<T> {
    let endpointUrl = `${this._actionsUrlNew1}/${shelfId}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () =>
          this.getAddressDataWarehouseEndpoint(shelfId)
        );
      });
  }

  getWareHouseDataEndpoint<T>(shelfId: any): Observable<T> {
    let endpointUrl = `${this._actionsUrlNew2}/${shelfId}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () =>
          this.getWareHouseDataEndpoint(shelfId)
        );
      });
  }

  getLocationDataEndpoint<T>(shelfId: any): Observable<T> {
    let endpointUrl = `${this._actionsUrlNew3}/${shelfId}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () =>
          this.getLocationDataEndpoint(shelfId)
        );
      });
  }

  getShelfDataAuditById<T>(shelfId: number): Observable<T> {
    let endpointUrl = `${this.getShelfAuditById}/${shelfId}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () =>
          this.getShelfDataAuditById(shelfId)
        );
      });
  }

  bulkUpload(file: any): Observable<object> {
    return this.http.post(this.bulkShelfUpload, file);
  }
}
