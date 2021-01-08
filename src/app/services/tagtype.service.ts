import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




import { TagTypeEndpointService } from './tagtype-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Action } from '../models/action.model';
import { AuditHistory } from '../models/audithistory.model';
import { TagType } from '../models/tagtype.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class TagTypeService {
	public static readonly roleAddedOperation: RolesChangedOperation = "add";
	public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
	public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

	private _rolesChanged = new Subject<RolesChangedEventArg>();

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private tagTypeEndpoint: TagTypeEndpointService) { }

	getAll() {
		return forkJoin(
			this.tagTypeEndpoint.getTagTypeEndpoint<TagType[]>());
	}

	add(tagType: TagType) {
        return this.tagTypeEndpoint.addTagTypeEndpoint<TagType>(tagType);
	}

	update(tagType: TagType) {
        return this.tagTypeEndpoint.updateTagTypeEndpoint<TagType>(tagType);
	}

    remove(tagTypeId: number) {
        return this.tagTypeEndpoint.removeTagTypeEndpoint(tagTypeId);
    }
   
}