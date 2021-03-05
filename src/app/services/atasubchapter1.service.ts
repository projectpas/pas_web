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

import { ATASubChapter1Endpoint } from './atasubchapter1-endpoint.service';

import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { ATASubChapter } from '../models/atasubchapter.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class AtaSubChapter1Service {
	public static readonly roleAddedOperation: RolesChangedOperation = "add";
	public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
	public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

	private _rolesChanged = new Subject<RolesChangedEventArg>();

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private ataSubChapter1Endpoint: ATASubChapter1Endpoint) { }

	getAtaSubChapter1List(id?) {
		return Observable.forkJoin(
			this.ataSubChapter1Endpoint.getATASubChapter1Endpoint<ATASubChapter[]>(id));
	}

	newATASubChapter1(ataSubChapter) {
		return this.ataSubChapter1Endpoint.getNewATASubChapter1Endpoint<ATASubChapter>(ataSubChapter);
	}

	historyATASubChapter1(ataSubChapterId: number) {
		return this.ataSubChapter1Endpoint.getHistoryATASubChapter1Endpoint<any[]>(ataSubChapterId);
	}

	getATASubChapter1(ataSubChapterId?: number) {
		return this.ataSubChapter1Endpoint.getEditATASubChapter1Endpoint<ATASubChapter>(ataSubChapterId);
	}

	updateATASubChapter1(atasubchapter) {
		return this.ataSubChapter1Endpoint.getUpdateATASubChapter1Endpoint(atasubchapter, atasubchapter.ataSubChapterId);
	}

	deleteATASubChapter1(ataSubChapterId: number) {

		return this.ataSubChapter1Endpoint.getDeleteATASubChapter1Endpoint(ataSubChapterId);

	}

	getAtaSubChapterAudit(ataSubChapterId: number) {
		return this.ataSubChapter1Endpoint.getATASubChapterAuditById<any[]>(ataSubChapterId);
	}

	getATASubChapterListByATAChapterId(ataChapterId: number) {
		return Observable.forkJoin(
			this.ataSubChapter1Endpoint.getAtaSubChaptersListByAtaChapterId<ATASubChapter[]>(ataChapterId));
    }
    getAtaSubChaptersList() {
        return Observable.forkJoin(
            this.ataSubChapter1Endpoint.getAtaSubChaptersList<ATASubChapter[]>());
    }
    

}