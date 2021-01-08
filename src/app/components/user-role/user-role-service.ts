// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable,forkJoin } from 'rxjs';
import { UserRoleEndPointService } from './user-role-endpoint.service';
import { ModuleHierarchyMaster, UserRole, User, UserRoleMapper } from './ModuleHierarchyMaster.model';

@Injectable()
export class UserRoleService {

    constructor(
        private router: Router,
        private http: HttpClient,
        private userRoleEndpoint: UserRoleEndPointService) { }

    getAllModuleHierarchies() {
        return forkJoin(
            this.userRoleEndpoint.getAllModuleHierarchies<ModuleHierarchyMaster[]>());
    }

    add(userRole: UserRole) {
        return this.userRoleEndpoint.addUserRole<UserRole>(userRole);
    }

    update(userRole: UserRole) {
        return this.userRoleEndpoint.updateUserRole<UserRole>(userRole);
    }

    getAllUsers() {
        return forkJoin(
            this.userRoleEndpoint.getAllUsers<User[]>());
    }

    getAllUserRole() {
        return forkJoin(
            this.userRoleEndpoint.getAllUserRole<UserRole[]>());
    }
    
    getUserRoleByUserId(userId:string) {
        return forkJoin(
            this.userRoleEndpoint.getUserRolesByUserId<UserRole[]>(userId));
    }

    assignRoleToUser(userRoleMapper: UserRoleMapper[]) {
        return this.userRoleEndpoint.assignRolesToUser<UserRoleMapper[]>(userRoleMapper);
    }

    getGlobalData(masterCompanyId: number) 
    {
        return forkJoin(
            this.userRoleEndpoint.getSavedCountryDataEndPoint<any>(masterCompanyId));
        // return this.accountEndpoint.getSavedCountryDataEndPoint<any>(masterCompanyId);
    }
}