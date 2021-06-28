// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable, Inject } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { LocalStoreManager } from './local-store-manager.service';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { DBkeys } from './db-Keys';
import { JwtHelper } from './jwt-helper';
import { Utilities } from './utilities';
import { LoginResponse, AccessToken } from '../models/login-response.model';
import { User } from '../models/user.model';
import { UserLogin } from '../models/user-login.model';
import { Permission, PermissionNames, PermissionValues } from '../models/permission.model';
import { UserRole, ModuleHierarchyMaster, RolePermission } from '../components/user-role/ModuleHierarchyMaster.model';
import { UserRoleService } from '../components/user-role/user-role-service';
import { AccountService } from './account.service';
import { CommonService } from './common.service';
import { decode } from 'punycode';
import { BehaviorSubject } from 'rxjs';
// import { AccountService } from "../services/account.service";

@Injectable()
export class AuthService {
    public get loginUrl() { return this.configurations.loginUrl; }

    public get homeUrl() { return this.configurations.homeUrl; }

    public loginRedirectUrl: string;

    public logoutRedirectUrl: string;

    public reLoginDelegate: () => void;

    private previousIsLoggedInCheck = false;

    private _loginStatus = new Subject<boolean>();

    public ModuleInfo: BehaviorSubject<Array<ModuleHierarchyMaster>> = new BehaviorSubject([]);
    private defaultEmployeeDetails= new Subject<any>()
    constructor(private router: Router, private configurations: ConfigurationService, private endpointFactory: EndpointFactory, private localStorage: LocalStoreManager,private userRoleService:UserRoleService ,private commonService:CommonService) {
        this.initializeLoginStatus();
    }

    private initializeLoginStatus() {
        this.localStorage.getInitEvent().subscribe(() => {
            this.reevaluateLoginStatus();
        });
    }

    public SetMenuInfo(newValue: ModuleHierarchyMaster[]): void {
        this.ModuleInfo.next(Object.assign([], newValue));
        this.localStorage.saveSyncedSessionData(newValue, "UserRoleModule");
      }
    //  public  removeMenuInfo() {
    //     this.ModuleInfo.next([]);
    //   }

    gotoPage(page: string, preserveParams = true) {

        let navigationExtras: NavigationExtras = {
            queryParamsHandling: preserveParams ? "merge" : "", preserveFragment: preserveParams
        };


        this.router.navigate([page], navigationExtras);
    }

    redirectLoginUser() {
        let redirect = this.loginRedirectUrl && this.loginRedirectUrl != '/' && this.loginRedirectUrl != ConfigurationService.defaultHomeUrl ? this.loginRedirectUrl : this.homeUrl;
        this.loginRedirectUrl = null;

        let urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
        let urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');

        let navigationExtras: NavigationExtras = {
            fragment: urlParamsAndFragment.secondPart,
            queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
            queryParamsHandling: "merge"
        };

        this.router.navigate([urlAndParams.firstPart], navigationExtras);
    }

    redirectLogoutUser() {
        let redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
        this.logoutRedirectUrl = null;
        //window.location.href=redirect;
        this.router.navigate([redirect]);
    }

    redirectForLogin() {
        this.loginRedirectUrl = this.router.url;
        this.router.navigate([this.loginUrl]);
    }

    reLogin() {
        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);

        if (this.reLoginDelegate) {
            this.reLoginDelegate();
        }
        else {
            this.redirectForLogin();
        }
    }

    refreshLogin() {
        return this.endpointFactory.getRefreshLoginEndpoint<LoginResponse>()
            .map(response => this.processLoginResponse(response, this.rememberMe));
    }

    login(user: UserLogin) {

        if (this.isLoggedIn)
            this.logout();

        return this.endpointFactory.getLoginEndpoint<LoginResponse>(user.userName, user.password, user.masterCompanyId)
            .map(response => this.processLoginResponse(response, user.rememberMe));
    }

    employeeDetailsByEmpId(id: number) {
        return this.endpointFactory.employeeDetailsByEmpId(id);
    }



    public checkUserAccessByModuleName(moduleName: string): boolean {
        let modules: ModuleHierarchyMaster[] = this.getAllModulesNameFromLocalStorage();
        var selectedModules = modules.filter(function (module) {
            return module.moduleCode == moduleName;
        });

        if (selectedModules != undefined && selectedModules.length > 0) {
            let moduleId: number = selectedModules[0].id;
            let userRoles: UserRole[] = this.getUserRoleWithPermissionFromLocalStorage();
            var isAllowedToAccess = false;
            for (let userRole of userRoles) {
                var userAssignedModules = userRole.rolePermissions.filter(function (role: RolePermission) {
                    return role.moduleHierarchyMasterId == moduleId;
                });

                if (userAssignedModules != undefined && userAssignedModules.length > 0) {
                    if (userAssignedModules[0].canAdd || userAssignedModules[0].canUpdate || userAssignedModules[0].canDelete || userAssignedModules[0].canView) {
                        isAllowedToAccess = true;
                        break;
                    }
                }
            }
            return isAllowedToAccess;
        }
        else {
            return false;
        }
    }

    public isPermissibleAction(moduleName: string, permissionType: string): boolean {

        let modules: ModuleHierarchyMaster[] = this.getAllModulesNameFromLocalStorage();
        var selectedModules = modules.filter(function (module) {
            return module.moduleCode == moduleName;
        });

        if (selectedModules != undefined && selectedModules.length > 0) {
            let moduleId: number = selectedModules[0].id;
            let userRoles: UserRole[] = this.getUserRoleWithPermissionFromLocalStorage();
            for (let userRole of userRoles) {
                var userAssignedModules = userRole.rolePermissions.filter(function (role: RolePermission) {
                    return role.moduleHierarchyMasterId == moduleId;
                });
                if (userAssignedModules != undefined && userAssignedModules.length > 0) {
                    if (userAssignedModules[0][permissionType] != undefined && userAssignedModules[0][permissionType]) {
                        return true;
                    }
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    }

    private processLoginResponse(response: LoginResponse, rememberMe: boolean) {

        let accessToken = response.access_token;

        if (accessToken == null) {
            throw new Error("Received accessToken was empty");

        }

        let refreshToken = response.refresh_token || this.refreshToken;
        let expiresIn = response.expires_in;

        let tokenExpiryDate = new Date();
        tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);

        let accessTokenExpiry = tokenExpiryDate;

        let jwtHelper = new JwtHelper();
        let decodedAccessToken = <AccessToken>jwtHelper.decodeToken(response.access_token);

        let permissions: PermissionValues[] = Array.isArray(decodedAccessToken.permission) ? decodedAccessToken.permission : [decodedAccessToken.permission];


        if (!this.isLoggedIn) {
            this.configurations.import(decodedAccessToken.configuration);
        }

        let user = new User(
            decodedAccessToken.sub,
            decodedAccessToken.name,
            decodedAccessToken.fullname,
            decodedAccessToken.email,
            decodedAccessToken.jobtitle,
            decodedAccessToken.phone_number,
            Array.isArray(decodedAccessToken.role) ? decodedAccessToken.role : [decodedAccessToken.role],
            decodedAccessToken.employeeId,
            decodedAccessToken.managementStructureId,
            decodedAccessToken.masterCompanyId,
            decodedAccessToken.legalEntityId,
            decodedAccessToken.firstName,
            decodedAccessToken.lastName
        );

        user.isEnabled = true;
        user.isResetPassword = decodedAccessToken.isResetPassword;
        user.roleName = decodedAccessToken.roleName;
        user.permissionName = Array.isArray(decodedAccessToken.permissionName) ? decodedAccessToken.permissionName : [decodedAccessToken.permissionName];
        user.roleID = decodedAccessToken.roleID;
        this.saveUserDetails(user, permissions, accessToken, refreshToken, accessTokenExpiry, rememberMe);
        this.getUserRolePermissionByUserId(user.id);
        this.loadAllModulesNameToLocalStorage();
        this.reevaluateLoginStatus(user);
        this.loadGlobalSettings();
        this.getEmployeeDetails(user);
        this.getManagementstructureDetails(user);
        return user;
    }

    private saveUserDetails(user: User, permissions: PermissionValues[], accessToken: string, refreshToken: string, expiresIn: Date, rememberMe: boolean) {
        if (rememberMe) {
            this.localStorage.savePermanentData(accessToken, DBkeys.ACCESS_TOKEN);
            this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN);
            this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
            this.localStorage.savePermanentData(permissions, DBkeys.USER_PERMISSIONS);
            this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER);
        }
        else {
            this.localStorage.saveSyncedSessionData(accessToken, DBkeys.ACCESS_TOKEN);
            this.localStorage.saveSyncedSessionData(refreshToken, DBkeys.REFRESH_TOKEN);
            this.localStorage.saveSyncedSessionData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
            this.localStorage.saveSyncedSessionData(permissions, DBkeys.USER_PERMISSIONS);
            this.localStorage.saveSyncedSessionData(user, DBkeys.CURRENT_USER);
        }

        this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
    }

    private loadAllModulesNameToLocalStorage() {
        this.userRoleService.getAllModuleHierarchies().subscribe(result => {
            this.localStorage.saveSyncedSessionData(result[0], DBkeys.Module_Hierarchy);
        });
    }

    public loadGlobalSettings() {
        this.userRoleService.getGlobalData(DBkeys.MASTER_COMPANY_ID).subscribe(results => {
            return this.localStorage.savePermanentData(results[0], DBkeys.GLOBAL_SETTINGS)
        })
    }
    getEmployeeDetails(user) {
        if (user && user.employeeId) {
            this.commonService.getEmployeeData(user.masterCompanyId, user.employeeId).subscribe((results: any) => {
                const employee: any = results;
                employee.label = results.name;
                employee.value = results.employeeId;
                this.localStorage.savePermanentData(employee, DBkeys.EMPLOYEE);
                // return this.defaultEmployeeDetails.next(results);
            })
        }
    }
    getManagementstructureDetails(user) {
        if (user && user.managementStructureId) {
            this.commonService.getManagementStructureData(1, user.managementStructureId).subscribe(results => {
                this.localStorage.savePermanentData(results, DBkeys.MANAGEMENTSTRUCTURE);
                // return this.defaultEmployeeDetails.next(results);
            })
        }
    }
    get currentEmployee() {
        let employee = this.localStorage.getDataObject<any>(DBkeys.EMPLOYEE);
        return employee;
    }
    get currentManagementStructure() {

        let managementStructure = this.localStorage.getDataObject<any>(DBkeys.MANAGEMENTSTRUCTURE);
        return managementStructure;
    }
    get currentUserLocalId() {

        let global_object = this.localStorage.getDataObject<any>(DBkeys.GLOBAL_SETTINGS);
        return global_object.cultureName;
    }
    public getAllModulesNameFromLocalStorage(): ModuleHierarchyMaster[] {
        return this.localStorage.getData(DBkeys.Module_Hierarchy);
    }

    private getUserRolePermissionByUserId(userId: string) {
        this.userRoleService.getUserRoleByUserId(userId).subscribe(roles => {
            this.saveUserRoleWithPermission(roles[0]);
        },
            error => {
                console.log('Error while retreiving roles.');
            });
    }

    public getUserRoleWithPermissionFromLocalStorage() {
        return this.localStorage.getData(DBkeys.User_Role_Permission);
    }

    private saveUserRoleWithPermission(userRole: UserRole[]) {
        this.localStorage.saveSyncedSessionData(userRole, DBkeys.User_Role_Permission);
    }

    logout(): void {
        this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
        this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
        this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
        this.localStorage.deleteData(DBkeys.CURRENT_USER);
        this.localStorage.deleteData(DBkeys.User_Role_Permission);
        this.localStorage.deleteData(DBkeys.GLOBAL_SETTINGS);
        this.localStorage.deleteData(DBkeys.EMPLOYEE);
        this.localStorage.deleteData(DBkeys.MANAGEMENTSTRUCTURE);
        this.localStorage.deleteData("UserRoleModule");
        this.configurations.clearLocalChanges();

        this.reevaluateLoginStatus();
    }

    private reevaluateLoginStatus(currentUser?: User) {
        let user = currentUser || this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
        let isLoggedIn = user != null;

        if (this.previousIsLoggedInCheck != isLoggedIn) {
            setTimeout(() => {
                this._loginStatus.next(isLoggedIn);
            });
        }

        this.previousIsLoggedInCheck = isLoggedIn;
    }

    getLoginStatusEvent(): Observable<boolean> {
        return this._loginStatus.asObservable();
    }

    get currentUser(): User {

        let user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
        this.reevaluateLoginStatus(user);

        return user;
    }

    get userPermissions(): PermissionValues[] {
        return this.localStorage.getDataObject<PermissionValues[]>(DBkeys.USER_PERMISSIONS) || [];
    }

    get accessToken(): string {

        this.reevaluateLoginStatus();
        return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
    }

    get accessTokenExpiryDate(): Date {

        this.reevaluateLoginStatus();
        return this.localStorage.getDataObject<Date>(DBkeys.TOKEN_EXPIRES_IN, true);
    }

    get isSessionExpired(): boolean {
        if (this.accessTokenExpiryDate == null) {
            return true;
        }

        return this.accessTokenExpiryDate.valueOf() <= new Date().valueOf();
    }

    get refreshToken(): string {

        this.reevaluateLoginStatus();
        return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
    }

    get isLoggedIn(): boolean {
        return this.currentUser != null;
    }

    get userRole():string{
        if(this.currentUser!=null){
            return this.currentUser.roleName;
        }
    }

    get rememberMe(): boolean {
        return this.localStorage.getDataObject<boolean>(DBkeys.REMEMBER_ME) == true;
    }

    public async CheckSecurity(MenuInfo: BehaviorSubject<ModuleHierarchyMaster[]>, linkToCheck: string):Promise<Boolean> {
        
        let Menus =this.getModuleByUserRole();// MenuInfo.getValue();
        linkToCheck = linkToCheck.toLocaleLowerCase();
        let isAllowed:Boolean = false;
        if(Menus.length == 0){
          let roleID =this.currentUser.roleID;
          Menus= await this.getRolestypes(roleID);
        }
        Menus.forEach(el => {
          if(el.RouterLink && el.RouterLink.toLocaleLowerCase().indexOf(linkToCheck) != -1)
          {
            isAllowed = true;
          }
        });
        return isAllowed;
      }

      public async getRolestypes(roleID:string): Promise<Array<ModuleHierarchyMaster>> {
        return new Promise((resolve) => {
            this.userRoleService.getUserMenuByRoleId(roleID).subscribe(data=>{
                resolve(data[0]);
               
            })
        });
      }

      public getModuleByUserRole(){
        return  this.localStorage.getData("UserRoleModule");
      }

      public checkPermission(permissionName:string[]):boolean{
        let isAllowed:boolean = false;
        if(this.currentUser && this.currentUser.permissionName!=null){
            
            let getData=this.currentUser.permissionName.filter((value)=>
                permissionName.includes(value));
            isAllowed=getData.length>0;
        }
        
        return isAllowed;
      }

      public ShowTab(moduleName:string, tabName: string):Boolean {         
        let Menus = this.getModuleByUserRole();
        tabName = tabName.toLocaleLowerCase();
        let isAllowed:Boolean = false;
        if(this.currentUser.userName!='admin'){
            var parentModule = Menus.filter(function(value){
                return value.Name == moduleName;
            });
            if(parentModule!=undefined && parentModule.length > 0){           
                Menus.forEach(el => {
                    if(el.ParentID == parentModule[0].ID && el.Name.toLocaleLowerCase().indexOf(tabName) != -1 && (el.PermissionID==1||el.PermissionID==3)){                    
                        isAllowed = true;
                        return isAllowed;
                    }
                });
            }
        }
        else {
            isAllowed=true;
        }
        return isAllowed;
      }

    get userRole():string{
        if(this.currentUser!=null){
            return this.currentUser.roleName;
        }
    }
}