// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




import { DefaultMessageEndpoint } from './defaultmessage-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { DefaultMessage } from '../models/defaultmessage.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class DefaultMessageService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private defaultmessageEndpoint: DefaultMessageEndpoint) { }

    getDefaultMessageList() {
        return forkJoin(
            this.defaultmessageEndpoint.getDefaultMessageEndpoint<DefaultMessage[]>());
    }
    newDefaultMessage(defaultMessage: DefaultMessage) {
        return this.defaultmessageEndpoint.getNewDefaultMessageEndpoint<DefaultMessage>(defaultMessage);
    }

    historyDefaultMessage(defaultMessageId: number) {
        return forkJoin(this.defaultmessageEndpoint.getHistoryDefaultMessageEndpoint<AuditHistory[]>(defaultMessageId));
    }

    getDefaultMessage(defaultMessageId?: number) {
        return this.defaultmessageEndpoint.getEditDefaultMessageEndpoint<DefaultMessage>(defaultMessageId);
    }

    updateDefaultMessage(defaultmessage: DefaultMessage) {
        return this.defaultmessageEndpoint.getUpdateDefaultMessageEndpoint(defaultmessage, defaultmessage.defaultMessageId);
    }

    deleteDefaultMessage(defaultMessageId: number) {

        return this.defaultmessageEndpoint.getDeleteDefaultMessageEndpoint(defaultMessageId);

    }
    getAudit(defaultMessageId: number) {
        return this.defaultmessageEndpoint.getDefaultAudit<any[]>(defaultMessageId);
    }

    getServerPages(serverSidePagesData: any)
    {
        return forkJoin(
            this.defaultmessageEndpoint.getDefaultMessageRecords<DefaultMessage[]>(serverSidePagesData));
    }
}

