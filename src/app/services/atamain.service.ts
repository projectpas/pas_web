// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { ATAMainEndpoint } from './atamain-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { ATAMain } from '../models/atamain.model';
import { AuditHistory } from '../models/audithistory.model';
import { ATAChapter } from '../models/atachapter.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class AtaMainService {
  public static readonly roleAddedOperation: RolesChangedOperation = "add";
  public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
  public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

  private _rolesChanged = new Subject<RolesChangedEventArg>();

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private ataMainEndpoint: ATAMainEndpoint) { }

  getAtaMainList(id?) {
    return Observable.forkJoin(
      this.ataMainEndpoint.getATAMainEndpoint<ATAChapter[]>(id));
  }
    getAllAtaMainList() {
        return Observable.forkJoin(
            this.ataMainEndpoint.getAllATAMainEndpoint<ATAChapter[]>());
    }
  newATAMain(ataMain) {
    return this.ataMainEndpoint.getNewATAMainEndpoint<ATAChapter>(ataMain);
  }

  historyATAMain(ataChapterId: number) {
    return this.ataMainEndpoint.getHistoryATAMainEndpoint<any[]>(ataChapterId);
  }

  getATAMain(ataMainId?: number) {
    return this.ataMainEndpoint.getEditATAMainEndpoint<ATAChapter>(ataMainId);
  }

  updateATAMain(ataMain) {
    return this.ataMainEndpoint.getUpdateATAMainEndpoint(ataMain, ataMain.ataChapterId);
  }

  deleteATAMain(ataChapterId: number) {

    return this.ataMainEndpoint.getDeleteATAMainEndpoint(ataChapterId);
  }

  getAtaChapterAudit(ataChapterId: number) {
    return this.ataMainEndpoint.getAtaChapterAuditById<any>(ataChapterId);
  }
  getATASubDesc(Chid: number) {
    return this.ataMainEndpoint.getATASubByID<any>(Chid);
  }
  getMultiATASubDesc(Chapterids: string) {
    return this.ataMainEndpoint.getMultiATASubByID<any>(Chapterids);
  }
  getMultiAirCraftSubDesc(Chapterids: string) {
      return this.ataMainEndpoint.getMultiAirCraftSubDesc<any>(Chapterids);
  }
  ataChapterCustomUpload(file) {
      return this.ataMainEndpoint.ataChapterCustomUpload(file);
  }
  getATAMainDropdownList(masterCompanyId?) {
    return this.ataMainEndpoint.getATAMainDropdownList(masterCompanyId);
}
}