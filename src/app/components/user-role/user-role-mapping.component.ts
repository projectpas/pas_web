import { MessageService } from "primeng/api";
import { AuthService } from "../../services/auth.service";
import { AlertService, MessageSeverity } from "../../services/alert.service";
import { OnInit, Component } from "@angular/core";
import { fadeInOut } from "../../services/animations";
import { UserRoleService } from "./user-role-service";
import { ModuleHierarchyMaster, UserRole, RolePermission, User, UserRoleMapper } from "./ModuleHierarchyMaster.model";
import { single } from "rxjs/operators";
import { Role } from "../../models/role.model";

@Component({
    selector: 'app-roles-mapping',
    templateUrl: './user-role-mapping.component.html',
    styleUrls: [],
    animations: [fadeInOut]
})

export class UserRolesMappingComponent implements OnInit {
    public UserRoles: UserRole[];
    public Users: User[];
    public selectedRoles: UserRole[];
    public selectedUserId: string;
    public pageTitle: string = "User Role Mapping";
    constructor(private messageService: MessageService, private authService: AuthService, private alertService: AlertService, private userRoleService: UserRoleService) {
    }

    ngOnInit(): void {
        this.loadUserAndRoles();
        this.selectedUserId = "0";
    }

    loadUserAndRoles(): void {
        this.getAllUsers().subscribe(users => {
            this.Users = users[0];
            this.getAllUserRoles().subscribe(roles => {
                this.UserRoles = roles[0];
            });
        });
    }

    getAllUsers() {
        return this.userRoleService.getAllUsers();
    }

    getAllUserRoles() {
        return this.userRoleService.getAllUserRole();
    }

    onUserChange(selectedValue:string) {
        this.selectedUserId = selectedValue;
        this.getUserRoleByUserId();
    }

    getUserRoleByUserId(): void {
        this.userRoleService.getUserRoleByUserId(this.selectedUserId).subscribe(
            result => { 
                this.selectedRoles = [];
                for (let resultUserRole of result[0]) {
                    var role = this.UserRoles.filter(function (userRole) {
                        return userRole.id == resultUserRole.id;
                    })[0];
                    this.selectedRoles.push(role);
                }
                
            },
            error => {
                var message = '';
                if (error.error.constructor == Array) {
                    message = error.error[0].errorMessage;
                }
                else {
                    message = error.error.Message;
                }
                this.alertService.showMessage(this.pageTitle, message, MessageSeverity.error);
            }
        );
    }

    assignRole(): void {
        if (this.selectedUserId != "0") {
            if (this.selectedRoles.length > 0) {
                let roleMapper: UserRoleMapper[] = [];

                for (let role of this.selectedRoles) {
                    let userRoleMapper = new UserRoleMapper();
                    userRoleMapper.userId = this.selectedUserId;
                    userRoleMapper.userRoleId = role.id;
                    roleMapper.push(userRoleMapper);
                }

                this.userRoleService.assignRoleToUser(roleMapper).subscribe(
                    result => {
                        this.alertService.showMessage(this.pageTitle, "Roles assigned successfully", MessageSeverity.success);
                        this.selectedUserId = "0";
                        this.selectedRoles = [];
                    },
                    error => {
                        var message = '';
                        if (error.error.constructor == Array) {
                            message = error.error[0].errorMessage;
                        }
                        else {
                            message = error.error.Message;
                        }
                        this.alertService.showMessage(this.pageTitle, message, MessageSeverity.error);
                    });
            }
            else {
                this.alertService.showMessage("User Role Mapping", "Atleast one role needs to be assigned", MessageSeverity.error);
            }
        }
        else {
            this.alertService.showMessage("User Role Mapping", "Please select User Name", MessageSeverity.error);
        }
       
    }


}