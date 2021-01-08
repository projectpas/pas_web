import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { EndpointFactory } from "./endpoint-factory.service";
import { ConfigurationService } from "./configuration.service";

@Injectable()
export class WarehouseEndpoint extends EndpointFactory {
    private readonly _actionsUrl: string = "/api/Warehouse/Get";
    private readonly _actionsUrlNew: string = "/api/Warehouse/wareHousePost";
    private readonly __managementSiteURL: string =
        "/api/Warehouse/GetManagementSite";
    private readonly _managementUrlNew: string =
        "/api/Warehouse/managementWareHousePost";
    private readonly _actionsManagemetUrl: string =
        "/api/Warehouse/GetMangementWarehouse"; //change
    private readonly _actionsWarehouseUrl: string =
        "/api/Warehouse/GetAllWareHouseData"; //change
    private readonly _actionsUrlNew1: string = "/api/Warehouse/GetAddress";
    private readonly _actionsUrlAuditHistory: string =
        "/api/Warehouse/ataauditHistoryById";
    private readonly getWarehouseDataAuditById: string = "/api/Warehouse/audits";

    //private readonly _countryUrl: string = "/api/Site/GetcountryList";
    private readonly bulkSiteUpload = "/api/warehouse/bulkupload";

    private readonly searchUrl: string = "/api/warehouse/search";

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

    getWarehouseEndpoint<T>(): Observable<T> {
        return this.http
            .get<T>(this.actionsUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getWarehouseEndpoint());
            });
    }

    getManagementSiteEndpoint<T>(siteID: any): Observable<T> {
        let endpointUrl = `${this.__managementSiteURL}/${siteID}`;

        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getManagementSiteEndpoint(siteID)
                );
            });
    }

    getWarehouseStockSiteEndpoint<T>(siteID: any): Observable<T> {
        let endpointUrl = `${this._actionsWarehouseUrl}/${siteID}`;

        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getWarehouseStockSiteEndpoint(siteID)
                );
            });
    }

    getNewWarehouseEndpoint<T>(userObject: any): Observable<T> {
        return this.http
            .post<T>(
                this._actionsUrlNew,
                JSON.stringify(userObject),
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getNewWarehouseEndpoint(userObject)
                );
            });
    }

    getnewManagementWareHouseData<T>(userObject: any): Observable<T> {
        return this.http
            .post<T>(
                this._managementUrlNew,
                JSON.stringify(userObject),
                this.getRequestHeaders()
            )
            .catch(error => {
                return this.handleError(error, () =>
                    this.getnewManagementWareHouseData(userObject)
                );
            });
    }

    //edit data ManagementSite Data Retrive based on location id
    getManagementWarehouseEditEndpoint<T>(warehouseId: number): Observable<T> {
        let endpointUrl = `${this._actionsManagemetUrl}/${warehouseId}`;

        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getManagementWarehouseEditEndpoint(warehouseId)
                );
            });
    }

    //getcountryListEndpoint<T>(): Observable<T> {

    //	return this.http.get<T>(this.countryUrl, this.getRequestHeaders())
    //		.catch(error => {
    //			return this.handleError(error, () => this.getcountryListEndpoint());
    //		});
    //}

    getHistoryWarehouseEndpoint<T>(warehouseId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${warehouseId}`;

        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getHistoryWarehouseEndpoint(warehouseId)
                );
            });
    }

    getEditWarehouseEndpoint<T>(warehouseId?: number): Observable<T> {
        let endpointUrl = warehouseId
            ? `${this._actionsUrlNew}/${warehouseId}`
            : this._actionsUrlNew;

        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getEditWarehouseEndpoint(warehouseId)
                );
            });
    }

    getUpdateWarehouseEndpoint<T>(
        roleObject: any,
        warehouseId: number
    ): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${warehouseId}`;

        return this.http
            .put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getUpdateWarehouseEndpoint(roleObject, warehouseId)
                );
            });
    }

    getDeleteWarehouseEndpoint<T>(warehouseId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${warehouseId}`;

        return this.http
            .delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getDeleteWarehouseEndpoint(warehouseId)
                );
            });
    }

    getDeleteManagementWarehouseEndpoint<T>(warehouseId: number): Observable<T> {
        let endpointUrl = `${this._managementUrlNew}/${warehouseId}`;

        return this.http
            .delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getDeleteManagementWarehouseEndpoint(warehouseId)
                );
            });
    }

    getAddressDataWarehouseEndpoint<T>(siteID: any): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew1}/${siteID}`;

        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getAddressDataWarehouseEndpoint(siteID)
                );
            });
    }
    getWarehouseAuditById<T>(warehouseId: number): Observable<T> {
        let endpointUrl = `${this.getWarehouseDataAuditById}/${warehouseId}`;

        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                    this.getWarehouseAuditById(warehouseId)
                );
            });
    }

    bulkUpload(file: any): Observable<object> {
        return this.http.post(this.bulkSiteUpload, file);
    }


    SearchData<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.searchUrl;
        return this.http.post<T>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.SearchData(paginationOption));
            });
    }
}
