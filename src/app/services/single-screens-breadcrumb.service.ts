import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject} from 'rxjs';



import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };


@Injectable()
export class SingleScreenBreadcrumbService
{	
	public currentUrl = this.router.url;

	public alertObj = new Subject<any>();
	public alertChangeObject$ = this.alertObj.asObservable(); // for Validation

	

	public indexObj = new Subject<any>();//Steps
	public indexObjChangeObject$ = this.indexObj.asObservable(); // Index and steps

	public bredcrumbObj = new Subject<any>();
	public bredcrumbObjChangeObject$ = this.bredcrumbObj.asObservable(); // Bread Crumb

	public static readonly roleAddedOperation: RolesChangedOperation = "add";
	public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
	public static readonly roleModifiedOperation: RolesChangedOperation = "modify";
	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
	)

		{
			let currentUrl = this.router.url;
		}
}