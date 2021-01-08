// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




import { AccountEndpoint } from './account-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Permission, PermissionNames, PermissionValues } from '../models/permission.model';
import { UserEdit } from '../models/user-edit.model';

import {mergeMap,tap} from 'rxjs/operators';
export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class AccountService
{
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private accountEndpoint: AccountEndpoint) { }

    getUser(userId?: string)
    {
        return this.accountEndpoint.getUserEndpoint<User>(userId);
    }

    getUserAndRoles(userId?: string)
    {
        return forkJoin(
            this.accountEndpoint.getUserEndpoint<User>(userId),
            this.accountEndpoint.getRolesEndpoint<Role[]>());
    }

    getUsers(page?: number, pageSize?: number)
    {
        return this.accountEndpoint.getUsersEndpoint<User[]>(page, pageSize);
    }

    getUsersAndRoles(page?: number, pageSize?: number)
    {

        return forkJoin(
            this.accountEndpoint.getUsersEndpoint<User[]>(page, pageSize),
            this.accountEndpoint.getRolesEndpoint<Role[]>());
    }

    updateUser(user: UserEdit)
    {
        if (user.id)
        {
            return this.accountEndpoint.getUpdateUserEndpoint(user, user.id);
        }
        else
        {
            return this.accountEndpoint.getUserByUserNameEndpoint<User>(user.userName)
                .pipe(mergeMap(foundUser =>
                {
                    user.id = foundUser.id;
                    return this.accountEndpoint.getUpdateUserEndpoint(user, user.id)
                }));
        }
    }

    newUser(user: UserEdit)
    {
        return this.accountEndpoint.getNewUserEndpoint<User>(user);
    }

    getUserPreferences()
    {
        return this.accountEndpoint.getUserPreferencesEndpoint<string>();
    }

    updateUserPreferences(configuration: string)
    {
        return this.accountEndpoint.getUpdateUserPreferencesEndpoint(configuration);
    }

    deleteUser(userOrUserId: string | User): Observable<User>
    {
        if (typeof userOrUserId === 'string' || userOrUserId instanceof String)
        {
            return this.accountEndpoint.getDeleteUserEndpoint<User>(<string>userOrUserId)
                .pipe(tap(data => this.onRolesUserCountChanged(data.roles)));
        }
        else
        {
            if (userOrUserId.id)
            {
                return this.deleteUser(userOrUserId.id);
            }
            else
            {
                return this.accountEndpoint.getUserByUserNameEndpoint<User>(userOrUserId.userName)
                    .pipe(mergeMap(user => this.deleteUser(user.id)));
            }
        }
    }

    unblockUser(userId: string)
    {
        return this.accountEndpoint.getUnblockUserEndpoint(userId);
    }

    userHasPermission(permissionValue: PermissionValues): boolean
    {
        return this.permissions.some(p => p == permissionValue);
    }

    refreshLoggedInUser()
    {
        return this.authService.refreshLogin();
    }

    getRoles(page?: number, pageSize?: number)
    {

        return this.accountEndpoint.getRolesEndpoint<Role[]>(page, pageSize);
    }

    getRolesAndPermissions(page?: number, pageSize?: number)
    {

        return forkJoin(
            this.accountEndpoint.getRolesEndpoint<Role[]>(page, pageSize),
            this.accountEndpoint.getPermissionsEndpoint<Permission[]>());
    }

    updateRole(role: Role)
    {
        if (role.id)
        {
            return this.accountEndpoint.getUpdateRoleEndpoint(role, role.id)
                .pipe(tap(data => this.onRolesChanged([role], AccountService.roleModifiedOperation)));
        }
        else
        {
            return this.accountEndpoint.getRoleByRoleNameEndpoint<Role>(role.name)
                .pipe(mergeMap(foundRole =>
                {
                    role.id = foundRole.id;
                    return this.accountEndpoint.getUpdateRoleEndpoint(role, role.id)
                })
                ,tap(data => this.onRolesChanged([role], AccountService.roleModifiedOperation)));
        }
    }

    newRole(role: Role)
    {
        return this.accountEndpoint.getNewRoleEndpoint<Role>(role)
            .pipe(tap(data => this.onRolesChanged([role], AccountService.roleAddedOperation)));
    }

    deleteRole(roleOrRoleId: string | Role): Observable<Role>
    {

        if (typeof roleOrRoleId === 'string' || roleOrRoleId instanceof String)
        {
            return this.accountEndpoint.getDeleteRoleEndpoint<Role>(<string>roleOrRoleId)
                .pipe(tap(data => this.onRolesChanged([data], AccountService.roleDeletedOperation)));
        }
        else
        {

            if (roleOrRoleId.id)
            {
                return this.deleteRole(roleOrRoleId.id);
            }
            else
            {
                return this.accountEndpoint.getRoleByRoleNameEndpoint<Role>(roleOrRoleId.name)
                    .pipe(mergeMap(role => this.deleteRole(role.id)));
            }
        }
    }

    getPermissions()
    {

        return this.accountEndpoint.getPermissionsEndpoint<Permission[]>();
    }

    private onRolesChanged(roles: Role[] | string[], op: RolesChangedOperation)
    {
        this._rolesChanged.next({ roles: roles, operation: op });
    }

    onRolesUserCountChanged(roles: Role[] | string[])
    {
        return this.onRolesChanged(roles, AccountService.roleModifiedOperation);
    }

    getRolesChangedEvent(): Observable<RolesChangedEventArg>
    {
        return this._rolesChanged.asObservable();
    }

    get permissions(): PermissionValues[]
    {
        return this.authService.userPermissions;
    }

    get currentUser()
    {
        return this.authService.currentUser;
    }

    //Global Settings 
    getCountriesList()
    {
        return this.accountEndpoint.getCountriesListEndPoint<any>();
    }
    getCountrySpecificData(countryId) 
    {
        return this.accountEndpoint.getCountrySpecificDataEndPoint<any>(countryId);
    }
    getSavedCountryData(masterCompanyId) 
    {
        return this.accountEndpoint.getSavedCountryDataEndPoint<any>(masterCompanyId);
    }
    getGlobalData(masterCompanyId: number) 
    {
        return forkJoin(
            this.accountEndpoint.getSavedCountryDataEndPoint<any>(masterCompanyId));
        // return this.accountEndpoint.getSavedCountryDataEndPoint<any>(masterCompanyId);
    }
    saveCountryLevelGlobalSettings(data) 
    {
        return this.accountEndpoint.saveCountryLevelGlobalSettingsEndPoint<any>(data);
    }
}