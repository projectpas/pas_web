import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';
import { Observable } from 'rxjs';
import { EndpointFactory } from '../../services/endpoint-factory.service';
import { UserRole, UserRoleMapper } from './ModuleHierarchyMaster.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserRoleEndPointService extends EndpointFactory {

    private readonly getAllModuleURL: string = environment.baseUrl + "/api/userrolepermission/getAllModuleHierarchy";
    private readonly addUserRoleURL: string = environment.baseUrl + "/api/userrolepermission/addUserRole";
    private readonly updateUserRoleURL: string = environment.baseUrl + "/api/userrolepermission/updateUserRole";
    private readonly getAllUsersURL: string = environment.baseUrl + "/api/account/users";
    private readonly getAllUserRolesURL: string = environment.baseUrl + "/api/userrolepermission/getAllUserRole";
    private readonly assignRoleToUserURL: string = environment.baseUrl + "/api/userrolepermission/assignRoleToUser";
    private readonly getUserRolesByUserIdURL: string = environment.baseUrl + "/api/userrolepermission/getUserRolesByUserId";
    private readonly getSavedCountryDataURL: string = environment.baseUrl + "/api/globalsettings/globalsettings?masterCompanyId="
    private readonly getSavedEmployeeDataURL: string = environment.baseUrl + "/api/common/loginuserdetails"
    private readonly getAllPermissionURL: string = environment.baseUrl + "/api/userrolepermission/getPermission";
    private readonly getUserMenuByRoleIdURL: string = environment.baseUrl + "/api/userrolepermission/geMenuListByRoleID";
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    getAllModuleHierarchies<T>(): Observable<T> {
        return this.http.get<T>(this.getAllModuleURL, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getAllModuleHierarchies());
        });
    }

    getAllPermission<T>(): Observable<T> {
        return this.http.get<T>(this.getAllPermissionURL, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getAllPermission());
        });
    }
    
    addUserRole<T>(userRole: UserRole): Observable<T> {
        let endpointUrl = this.addUserRoleURL;

        return this.http.post<T>(endpointUrl, JSON.stringify(userRole), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addUserRole(userRole));
            });
    }

    updateUserRole<T>(userRole: UserRole): Observable<T> {
        let endpointUrl = this.updateUserRoleURL;

        return this.http.post<T>(endpointUrl, JSON.stringify(userRole), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateUserRole(userRole));
            });
    }

    getAllUsers<T>(): Observable<T> {
        return this.http.get<T>(this.getAllUsersURL, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getAllUsers());
        });
    }

    getAllUserRole<T>(masterCompanyId): Observable<T> {
        let endPointURL = `${this.getAllUserRolesURL}/${masterCompanyId!==undefined?masterCompanyId:1}`;
        return this.http.get<T>(endPointURL, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getAllUserRole(masterCompanyId));
        });
    }

    assignRolesToUser<T>(userRoleMapper : UserRoleMapper[]): Observable<T> {
        return this.http.post<T>(this.assignRoleToUserURL, JSON.stringify(userRoleMapper), this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.assignRolesToUser(userRoleMapper));
        });
    }
    
    getUserRolesByUserId<T>(userId: string): Observable<T> {
        let endpointUrl = `${this.getUserRolesByUserIdURL}/${userId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getUserRolesByUserId(userId));
        });
    }
    getSavedCountryDataEndPoint<T>(masterCompanyId: number): Observable<T> {
        let endpointUrl = `${this.getSavedCountryDataURL}${masterCompanyId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getSavedCountryDataEndPoint(masterCompanyId));
        });
    }

    getUserMenuByRoleId<T>(roleID: string): Observable<T> {
        let endpointUrl = `${this.getUserMenuByRoleIdURL}/${roleID}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getUserMenuByRoleId(roleID));
        });
    }
//     getEmployeeData(masterCompanyId:any,employeeId:any) {
//         let endpointUrl = `${this.getSavedEmployeeDataURL}?masterCompanyId=${masterCompanyId}&employeeId=${employeeId}`;
//         return this.http.get<T>(endpointUrl, this.getRequestHeaders()).catch(error => {
//             return this.handleError(error, () => this.getEmployeeData(masterCompanyId,employeeId));
//        });
// }
}
