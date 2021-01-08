import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';
import { Observable } from 'rxjs';
import { EndpointFactory } from '../../services/endpoint-factory.service';
import { UserRole, UserRoleMapper } from './ModuleHierarchyMaster.model';


@Injectable()
export class UserRoleEndPointService extends EndpointFactory {

    private readonly getAllModuleURL: string = "api/userrolepermission/getAllModuleHierarchy";
    private readonly addUserRoleURL: string = "api/userrolepermission/addUserRole";
    private readonly updateUserRoleURL: string = "api/userrolepermission/updateUserRole";
    private readonly getAllUsersURL: string = "api/account/users";
    private readonly getAllUserRolesURL: string = "api/userrolepermission/getAllUserRole";
    private readonly assignRoleToUserURL: string = "api/userrolepermission/assignRoleToUser";
    private readonly getUserRolesByUserIdURL: string = "api/userrolepermission/getUserRolesByUserId";
    private readonly getSavedCountryDataURL: string = "api/globalsettings/globalsettings?masterCompanyId="
    private readonly getSavedEmployeeDataURL: string = "api/common/loginuserdetails"
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    getAllModuleHierarchies<T>(): Observable<T> {
        return this.http.get<T>(this.getAllModuleURL, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.getAllModuleHierarchies());
        });
    }
    
    addUserRole<T>(userRole: UserRole): Observable<T> {
        let endpointUrl = this.addUserRoleURL;

        return this.http.post<T>(endpointUrl, JSON.stringify(userRole), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.addUserRole(userRole));
            });
    }

    updateUserRole<T>(userRole: UserRole): Observable<T> {
        let endpointUrl = this.updateUserRoleURL;

        return this.http.post<T>(endpointUrl, JSON.stringify(userRole), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.updateUserRole(userRole));
            });
    }

    getAllUsers<T>(): Observable<T> {
        return this.http.get<T>(this.getAllUsersURL, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.getAllUsers());
        });
    }

    getAllUserRole<T>(): Observable<T> {
        return this.http.get<T>(this.getAllUserRolesURL, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.getAllUserRole());
        });
    }

    assignRolesToUser<T>(userRoleMapper : UserRoleMapper[]): Observable<T> {
        return this.http.post<T>(this.assignRoleToUserURL, JSON.stringify(userRoleMapper), this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.assignRolesToUser(userRoleMapper));
        });
    }
    
    getUserRolesByUserId<T>(userId: string): Observable<T> {
        let endpointUrl = `${this.getUserRolesByUserIdURL}/${userId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.getUserRolesByUserId(userId));
        });
    }
    getSavedCountryDataEndPoint<T>(masterCompanyId: number): Observable<T> {
        let endpointUrl = `${this.getSavedCountryDataURL}${masterCompanyId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders()).catch(error => {
            return this.handleError(error, () => this.getSavedCountryDataEndPoint(masterCompanyId));
        });
    }
//     getEmployeeData(masterCompanyId:any,employeeId:any) {
//         let endpointUrl = `${this.getSavedEmployeeDataURL}?masterCompanyId=${masterCompanyId}&employeeId=${employeeId}`;
//         return this.http.get<T>(endpointUrl, this.getRequestHeaders()).catch(error => {
//             return this.handleError(error, () => this.getEmployeeData(masterCompanyId,employeeId));
//        });
// }
}
