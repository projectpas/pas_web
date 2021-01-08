import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import {catchError} from 'rxjs/operators'
import { EndpointFactory } from "./endpoint-factory.service";
import { ConfigurationService } from "./configuration.service";
import { Site } from "../models/site.model";
import {of} from 'rxjs';
import { AnalysisComponent } from "../components/work-order/work-order-setup/work-order-summarizedview/components/analysis/analysis.component";
@Injectable()
export class SiteEndpoint extends EndpointFactory {
  private readonly _actionsUrl: string = "/api/Site/Get";
  private readonly _actionsManagemetUrl: string = "/api/Site/GetMangementSite";
  private readonly _actionsUrlNew: string = "/api/Site/sitesAdd";
  private readonly _actionsUrlUpdate: string = "/api/Site/sitesUpdate";
  private readonly _actionsUrlDelete: string = "/api/Site/sitesDelete";
  private readonly _actionsUrlAuditHistory: string =
    "/api/Site/ataauditHistoryById";
  private readonly _actionsUrlManagementPost: string =
    "/api/Site/managementSitesPost";
  private readonly getSiteAuditDataById: string = "/api/Site/audits";

  //private readonly _countryUrl: string = "/api/Site/GetcountryList";
  //private readonly _countryUrlNew: string = "api/Site/postCountryList";

    private readonly bulkSiteUpload: string = "/api/site/bulkupload";
    private readonly searchUrl: string = "/api/site/search";

  get actionsUrl() {
    return this.configurations.baseUrl + this._actionsUrl;
  }
  get actionsMangementSiteUrl() {
    return this.configurations.baseUrl + this._actionsManagemetUrl;
  }

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    injector: Injector
  ) {
    super(http, configurations, injector);
  }

  getSiteEndpoint<T>() {
return this.http
      .get(this.actionsUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getSiteEndpoint());
      }));
  }
  getManagementSiteEditEndpoint<T>(siteId: number): Observable<T> {
    let endpointUrl = `${this._actionsManagemetUrl}/${siteId}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () =>
          this.getManagementSiteEditEndpoint(siteId)
        );
      }));
  }
  getNewSiteEndpoint<T>(userObject: any): Observable<T> {
    return this.http
      .post<any>(
        this._actionsUrlNew,
        JSON.stringify(userObject),
        this.getRequestHeaders()
      ).pipe(
        catchError(error => {
        return this.handleError(error, () =>
          this.getNewSiteEndpoint(userObject)
        );
      }));
  }

  //new ManagementSie table entereing

  getnewManagementSiteData<T>(userObject: any): Observable<T> {
    // debugger;
    return this.http
      .post<any>(
        this._actionsUrlManagementPost,
        JSON.stringify(userObject),
        this.getRequestHeaders()
      ).pipe(
        catchError(error => {
        return this.handleError(error, () =>
          this.getnewManagementSiteData(userObject)
        );
      }));
  }

  getHistorySiteEndpoint<T>(siteId: number): Observable<T> {
    let endpointUrl = `${this._actionsUrlAuditHistory}/${siteId}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders()).pipe(
        catchError(error => {
        return this.handleError(error, () =>
          this.getHistorySiteEndpoint(siteId)
        );
      }));
  }

  getEditSiteEndpoint<T>(siteId?: number) {
    let endpointUrl = siteId
      ? `${this._actionsUrlNew}/${siteId}`
      : this._actionsUrlNew;

    return this.http
      .get(endpointUrl, this.getRequestHeaders()).pipe(
        catchError(error => {
        return this.handleError(error, () => this.getEditSiteEndpoint(siteId));
      }));
  }

  getUpdateSiteEndpoint(roleObject: any, siteId: number) {
    let endpointUrl = `${this._actionsUrlUpdate}/${siteId}`;
    return this.http
      .put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () =>
          this.getUpdateSiteEndpoint(roleObject, siteId)
        );
      }));
  }

  getUpdateManagementSiteEndpoint(
    roleObject: any,
    siteId: number
  ) {
    let endpointUrl = `${this._actionsUrlManagementPost}/${siteId}`;
    return this.http
      .put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () =>
          this.getUpdateManagementSiteEndpoint(roleObject, siteId)
        );
      }));
  }

  getDeleteSiteEndpoint(siteId: number) {
    let endpointUrl = `${this._actionsUrlDelete}/${siteId}`;

    return this.http
      .delete(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () =>
          this.getDeleteSiteEndpoint(siteId)
        );
      }));
  }

  //Delete management Site Before Edit
  getDeleteManagementSiteEndpoint(siteId: number) {
    let endpointUrl = `${this._actionsUrlManagementPost}/${siteId}`;
    return this.http
      .delete(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () =>
          this.getDeleteManagementSiteEndpoint(siteId)
        );
      }));
  }

  getSiteAuditById<T>(siteId: number) {
    let endpointUrl = `${this.getSiteAuditDataById}/${siteId}`;

    return this.http
      .get(endpointUrl, this.getRequestHeaders()).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getSiteAuditById(siteId));
      }));
  }

  bulkUpload<T>(file: any): Observable<object> {
    return this.http.post(this.bulkSiteUpload, file);
    }

    SearchData<T>(paginationOption: any) {
        let endpointUrl = this.searchUrl;
        return this.http.post(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.SearchData(paginationOption));
            }));
    }
   
}
