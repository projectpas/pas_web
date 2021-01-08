// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';


import { ATASubChapter2Endpoint } from './atasubchapter2-endpoint.service';

import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { ATASubChapter2 } from '../models/atasubchapter2.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class AtaSubChapter2Service {
	public static readonly roleAddedOperation: RolesChangedOperation = "add";
	public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
	public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

	private _rolesChanged = new Subject<RolesChangedEventArg>();

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private ataSubChapter2Endpoint: ATASubChapter2Endpoint) { }

	getAtaSubChapter2List() {
		return forkJoin(
			this.ataSubChapter2Endpoint.getATASubChapter2Endpoint<ATASubChapter2[]>());
	}

	newATASubChapter2(ataSubChapter2: ATASubChapter2) {
		return this.ataSubChapter2Endpoint.getNewATASubChapter2Endpoint<ATASubChapter2>(ataSubChapter2);
	}

	historyATASubChapter2(ataSubChapter2Id: number) {
		return forkJoin(this.ataSubChapter2Endpoint.getHistoryATASubChapter2Endpoint<AuditHistory[]>(ataSubChapter2Id));
	}

	getATASubChapter2(ataSubChapter2Id?: number) {
		return this.ataSubChapter2Endpoint.getEditATASubChapter2Endpoint<ATASubChapter2>(ataSubChapter2Id);
	}

	updateATASubChapter2(ataSubChapter2: ATASubChapter2) {
		return this.ataSubChapter2Endpoint.getUpdateATASubChapter2Endpoint(ataSubChapter2, ataSubChapter2.ataSubChapter2Id);
	}

	deleteATASubChapter2(ataSubChapter2Id: number) {

		return this.ataSubChapter2Endpoint.getDeleteATASubChapter2Endpoint(ataSubChapter2Id);

	}

}