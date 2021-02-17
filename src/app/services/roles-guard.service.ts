﻿// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad, Route, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRoleService } from '../components/user-role/user-role-service';
import { AlertService, MessageSeverity } from './alert.service';


@Injectable()
export class RolesGuardService implements CanActivate, CanActivateChild, CanLoad {
    constructor(private alertService: AlertService,private arouter: ActivatedRoute, private authService: AuthService, private router: Router, private userRoleService: UserRoleService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        debugger;
        var moduleName = route.data["name"];
        var isTab = route.data["isTab"];
        var hasAccess = this.authService.checkUserAccessByModuleName(moduleName);

        this.arouter.params.subscribe(async val => {
            var checksec = await this.authService.CheckSecurity(this.authService.ModuleInfo, state.url);
            if (!checksec) {
                this.router.navigate(['/unauthorized-access']);
                return false;
            }
          });

        if (hasAccess)
        {
            return true;
        }
        else
        {
            if (isTab != undefined && isTab)
            {
                this.alertService.showMessage('Unauthorised', 'You are not authorised to access this page.', MessageSeverity.error);
            }
            else {
                this.router.navigate(['/unauthorized-access']);
            }

            return false;
        }
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        return false;
    }



}