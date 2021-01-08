import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';


import { GLAccountClassEndpoint } from './glaccountclass-endpoint.service';
import { GlAccount } from '../models/GlAccount.model';
import { GLAccountClass } from '../models/glaccountclass.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class GLAccountClassService {
	public static readonly roleAddedOperation: RolesChangedOperation = "add";
	public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
	public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

	private _rolesChanged = new Subject<RolesChangedEventArg>();

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private glaccountclassEndpoint: GLAccountClassEndpoint) { }

    getGlAccountClassList() {
		return Observable.forkJoin(
			this.glaccountclassEndpoint.getGLAccountclassEndpoint<any>());
	}

	historyGlAccountClass(GLAccountClassId: number) {
		return Observable.forkJoin(this.glaccountclassEndpoint.getHistoryGLAccountClassIdEndpoint<any>(GLAccountClassId));
	}

	newGlAccountClass(action: any) {
		return this.glaccountclassEndpoint.getNewGatecodeEndpoint<any>(action);
	}

	getGlAccountClass(GLAccountClassId?: number) {
		return this.glaccountclassEndpoint.getEditGLAccountClassEndpoint<any>(GLAccountClassId);
	}

	updateGlAccountClass(action) {
		return this.glaccountclassEndpoint.getUpdateGLAccountClassEndpoint(action, action.glAccountClassId);
	}

	deleteGlAccountClass(glAccountClassId: number) {

		return this.glaccountclassEndpoint.getDeleteGLAccountClassIdEndpoint(glAccountClassId);
    }

    getGlAudit(glAccountClassId: number) {
        return this.glaccountclassEndpoint.getGlAccountAudit<any[]>(glAccountClassId);
    }

    getServerPages(serverSidePagesData: any) {
        return Observable.forkJoin(
            this.glaccountclassEndpoint.getGlAccountRecords<GLAccountClass[]>(serverSidePagesData));
    }

    GLAccountClassCustomUpload(file) {
        return this.glaccountclassEndpoint.GLAccountClassCustomUpload(file);
    }
	downloadAllGlList(glAccountClassId) {
		return this.glaccountclassEndpoint.downloadAllGlList(glAccountClassId);
	}
}