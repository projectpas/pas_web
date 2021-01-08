import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable ,  Subject,forkJoin } from "rxjs";

import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { SiteEndpoint } from "./site-endpoint.service";
import { AuthService } from "./auth.service";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { Site } from "../models/site.model";
import { AuditHistory } from "../models/audithistory.model";

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = {
  roles: Role[] | string[];
  operation: RolesChangedOperation;
};

@Injectable()
export class SiteService {
  listCollection: any;
  isEditMode: boolean = false;
  public static readonly roleAddedOperation: RolesChangedOperation = "add";
  public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
  public static readonly roleModifiedOperation: RolesChangedOperation =
    "modify";

  private _rolesChanged = new Subject<RolesChangedEventArg>();
  siteManagementArray: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private siteEndpoint: SiteEndpoint
  ) {}

  getSiteList():Observable<Site[]> {
    return forkJoin(this.siteEndpoint.getSiteEndpoint<Site[]>());
  }

  newSite(site: any) {
    return this.siteEndpoint.getNewSiteEndpoint<any>(site);
  }

  //for new Management Site Data and Edit Also
  newManagementSite(data: any) {
    return this.siteEndpoint.getnewManagementSiteData<any>(data);
  }

  historySite(siteId: number) {
    return forkJoin(
      this.siteEndpoint.getHistorySiteEndpoint<AuditHistory[]>(siteId)
    );
  }

  getSite(siteId?: number) {
    return this.siteEndpoint.getEditSiteEndpoint<Site>(siteId);
  }

  updateManagementSite(
    data: any //Update Management SIte
  ) {
    for (let i = 0; i <= data.length; i++) {
      return this.siteEndpoint.getUpdateManagementSiteEndpoint(
        data,
        data[i].data.siteId
      );
    }
  }

  updateSite(site: Site) {
    return this.siteEndpoint.getUpdateSiteEndpoint(site, site.siteId);
  }

  deleteSite(siteId: number) {
    return this.siteEndpoint.getDeleteSiteEndpoint(siteId);
  }
  getManagementSiteEditData(siteId?: number) {
    return this.siteEndpoint.getManagementSiteEditEndpoint<any>(siteId);
  }

  //Delete management SIte while  Edit

  deleteManagementSite(data: any) {
    return this.siteEndpoint.getDeleteManagementSiteEndpoint(
      data[0].data.siteId
    );
  }

  getSiteAudit(siteId: number) {
    return this.siteEndpoint.getSiteAuditById<any>(siteId);
  }

  bulkUpload(file: any): Observable<object> {
    return this.siteEndpoint.bulkUpload(file);
    }

    getSearchData(serverSidePagesData: any) {
        return forkJoin(
            this.siteEndpoint.SearchData<any[]>(serverSidePagesData));
    }
}
