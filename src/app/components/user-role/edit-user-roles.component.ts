import { MessageService } from "primeng/api";
import { AuthService } from "../../services/auth.service";
import { AlertService, MessageSeverity } from "../../services/alert.service";
import { OnInit, Component } from "@angular/core";
import { fadeInOut } from "../../services/animations";
import { UserRoleService } from "./user-role-service";
import { ModuleHierarchyMaster, UserRole, RolePermission, User } from "./ModuleHierarchyMaster.model";
import { single } from "rxjs/operators";
import { Role } from "../../models/role.model";
import { roleModulesEnum } from '../../enum/rolemodules.enum';

@Component({
    selector: 'edit-app-roles',
    templateUrl: './edit-user-roles.component.html',
    styleUrls: [],
    animations: [fadeInOut]
})

export class EditUserRolesComponent implements OnInit {
    public moduleHierarchy: ModuleHierarchyMaster[];
    public sortedHierarchy: ModuleHierarchyMaster[] = [];
    public selectedHierarchy: ModuleHierarchyMaster[] = [];
    public currentUserRole: UserRole;
    public pages: ModuleHierarchyMaster[];
    public pagesToHide: ModuleHierarchyMaster[];
    public userRoles: UserRole[] = [];
    public permissionMaster: PermissionMaster[];
    isSpinnerVisible: Boolean = true;
    id: number;

    constructor(private messageService: MessageService,private router: ActivatedRoute, private authService: AuthService, private alertService: AlertService, private userRoleService: UserRoleService) {
        this.id = this.router.snapshot.params['id'];
    }

    ngOnInit(): void {
        this.getAllModuleHierarchies();
        this.getAllUserRoles();
        this.currentUserRole = new UserRole();
        this.currentUserRole.rolePermissions = [];
        this.pages = [];
        this.currentUserRole.id = 0;
        this.isSpinnerVisible = false;
        if (this.id > 0) {
            this.currentUserRole.id = this.id;
            setTimeout(() => {
                this.userRoleChanged();
            },1000);
        }
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    getAllModuleHierarchies(): void {
        this.userRoleService.getAllModuleHierarchies().subscribe(data => {
            this.moduleHierarchy = data[0];
            this.sortModules();
        });
    }

    sortModules(): void {
        this.sortedHierarchy = [];
        var parentModules = this.moduleHierarchy.filter(function (module) {
            return module.parentId == null;
        });

        if (parentModules != undefined && parentModules.length > 0) {
            for (let parentModule of parentModules) {
                parentModule.level = 0;
                parentModule.visible = true;
                parentModule.rolePermission = new RolePermission();
                parentModule.rolePermission.canAdd = false;
                parentModule.rolePermission.canView = false;
                parentModule.rolePermission.canDelete = false;
                parentModule.rolePermission.canUpdate = false;
                this.sortedHierarchy.push(parentModule);
                this.hasChild(parentModule);
            }
        }

    }
    
    hasChild(currentModule: ModuleHierarchyMaster) {
        var modules = this.moduleHierarchy.filter(function (module: ModuleHierarchyMaster) {
            return module.parentId == currentModule.id;
        });
        if (modules != undefined && modules.length > 0) {
            currentModule.hasChildren = true;
            for (let module of modules) {
                module.level = currentModule.level + 1;
                module.visible = true;
                module.parentId = currentModule.id;
                module.rolePermission = new RolePermission();
                this.resetRolePermission(module.rolePermission);
                this.sortedHierarchy.push(module);
                this.hasChild(module);
            }
        }
    }

    resetRolePermission(rolePermission: RolePermission): void {
        rolePermission.canAdd = false;
        rolePermission.canView = false;
        rolePermission.canDelete = false;
        rolePermission.canUpdate = false;
    }

    showChildModules(currentModule: ModuleHierarchyMaster, event): void {
        if (!currentModule.isPage) {
            var visible = false;
            var target = event.target.localName == 'td' ? event.target.children[0] : event.target;
            if (target.classList.contains('fa-caret-down')) {
                target.classList.remove('fa-caret-down');
                target.classList.add('fa-caret-right');
                visible = true;
            }
            else {
                target.classList.remove('fa-caret-right');
                target.classList.add('fa-caret-down');
            }
            if (visible) {
                var selectedModule = this.sortedHierarchy.filter(function (filteredModule: ModuleHierarchyMaster) {
                    return filteredModule.parentId == currentModule.id;
                });
                selectedModule.forEach(function (module) {
                    module.visible = visible;
                });
            }
            else {
                this.pagesToHide = [];
                this.loadAllChildModule(currentModule.id);
                this.pagesToHide.forEach(function (module) {
                    module.visible = visible;
                });
            }
        }
    }

    getAllUserRoles() {
        return this.userRoleService.getAllUserRole(this.currentUserMasterCompanyId).subscribe(result => {
            this.userRoles = result[0];
        });
    }

    userRoleChanged(): void {        
        this.isSpinnerVisible=true;        
        this.sortModules();        
        this.currentUserRole.rolePermissions = [];

        if (this.currentUserRole.id != 0) {
            let userRoleId: number = this.currentUserRole.id;
            let selectedUserRole: UserRole = this.userRoles.filter(function (userRole: UserRole) {
                return userRole.id == userRoleId;
            })[0];

            this.currentUserRole.name = selectedUserRole.name;
            for (let modules of this.sortedHierarchy) {

                let rolePermission: RolePermission[] = selectedUserRole.rolePermissions.filter(function (rolePermission) {
                    return rolePermission.moduleHierarchyMasterId == modules.id;
                });

                if (rolePermission != undefined && rolePermission.length > 0) {
                    modules.rolePermission.canAdd = rolePermission[0].canAdd;
                    modules.rolePermission.canUpdate = rolePermission[0].canUpdate;
                    modules.rolePermission.canDelete = rolePermission[0].canDelete;
                    modules.rolePermission.canView = rolePermission[0].canView;
                    rolePermission[0].id = 0;
                    
                    this.currentUserRole.rolePermissions.push(Object.assign({}, rolePermission[0]));
                }
                else {
                    modules.rolePermission.canAdd = false;
                    modules.rolePermission.canUpdate = false;
                    modules.rolePermission.canDelete = false;
                    modules.rolePermission.canView = false;
                }
            }
        }
    }
    
    setPermissionByType(currentModule: ModuleHierarchyMaster, type: string, value: boolean) {
        if (type == 'canView')
            currentModule.rolePermission.canView = value;
        if (type == 'canAdd')
            currentModule.rolePermission.canAdd = value;
        if (type == 'canUpdate')
            currentModule.rolePermission.canUpdate = value;
        if (type == 'canDelete')
            currentModule.rolePermission.canDelete = value;
    }

    uncheckAllParentModule(parentId, type: string): void {
        var parentModule = this.sortedHierarchy.filter(function (module) {
            return (module.id == parentId && module.isPage == false);
        })[0];

        this.setPermissionByType(parentModule, type, false);
        if (parentModule.parentId != null) {
            this.uncheckAllParentModule(parentModule.parentId, type);
        }
    }

    loadAllChildModule(parentId): void {
        var parentModules = this.sortedHierarchy.filter(function (module) {
            return module.parentId == parentId;
        });
        for (let module of parentModules) {
            this.pagesToHide.push(module);
            if (module.parentId != null && !module.isPage) {
                this.loadAllChildModule(module.id);
            }
        }
    }

    permissionChecked(event, currentModule: ModuleHierarchyMaster, type: string): void {
        var value = event.target.checked;

        if (value == false) {
            this.setPermissionByType(currentModule, type, value);
            if (currentModule.parentId != null)
                this.uncheckAllParentModule(currentModule.parentId, type);
        }

        if (!currentModule.isPage) {
            this.setPermissionByType(currentModule, type, value);
            this.pages = [];
            this.hasPages(currentModule, type, value);
            for (let page of this.pages) {
                this.setModuleHierarchyPermission(page);
            }
        }
        else {
            this.setPermissionByType(currentModule, type, value);
            this.setModuleHierarchyPermission(currentModule);
        }
        console.log(this.currentUserRole.rolePermissions);
    }

    setModuleHierarchyPermission(currentModule: ModuleHierarchyMaster): void {

        var permission = this.currentUserRole.rolePermissions.filter(function (permission: RolePermission) {
            return permission.moduleHierarchyMasterId == currentModule.id;
        })[0];

        if (permission != undefined) {
            var currentRolePermission = Object.assign({}, currentModule.rolePermission);
            currentRolePermission.moduleHierarchyMasterId = currentModule.id;
            var permissionIndex = this.currentUserRole.rolePermissions.indexOf(permission)
            this.updatePermission(this.currentUserRole.rolePermissions[permissionIndex], currentModule.rolePermission);
        }
        else {
            var currentRolePermission = Object.assign({}, currentModule.rolePermission);
            currentRolePermission.userRoleId = this.currentUserRole.id;
            currentRolePermission.moduleHierarchyMasterId = currentModule.id;
            currentRolePermission.id = 0;
            this.currentUserRole.rolePermissions.push(currentRolePermission);
        }

    }

    updatePermission(previousPermission: RolePermission, latestPermission: RolePermission): void {
        previousPermission.canView = latestPermission.canView;
        previousPermission.canAdd = latestPermission.canAdd;
        previousPermission.canUpdate = latestPermission.canUpdate;
        previousPermission.canDelete = latestPermission.canDelete;
    }

    hasPages(currentModule: ModuleHierarchyMaster, type: string, checkedValue: boolean) {
        var modules = this.sortedHierarchy.filter(function (module: ModuleHierarchyMaster) {
            return module.parentId == currentModule.id;
        });
        if (modules != undefined && modules.length > 0) {
            for (let module of modules) {
                this.setPermissionByType(module, type, checkedValue);
                if (module.isPage) {
                    this.pages.push(module);
                }
                this.hasPages(module, type, checkedValue);
            }
        }
    }

    UpdateUserRole(): void {
        this.userRoleService.update(this.currentUserRole).subscribe(
            result => {
                this.alertService.showMessage('User Role', this.currentUserRole.name + ' Role updated successfully.', MessageSeverity.success);
                for (let module of this.sortedHierarchy) {
                    this.resetRolePermission(module.rolePermission);
                }
                this.currentUserRole = new UserRole();
                this.currentUserRole.id = 0;
                this.currentUserRole.rolePermissions = [];
                this.pages = [];
                this.userRoleService.getAllUserRole(this.currentUserMasterCompanyId).subscribe(result => {
                    this.userRoles = result[0];
                });
            },
            error => {
                // var message = '';
                // if (error.error.constructor == Array) {
                //     message = error.error[0].errorMessage;
                // }
                // else {
                //     message = error.error.Message;
                // } 
                this.isSpinnerVisible=false;
               // this.alertService.showMessage('User Role', message, MessageSeverity.error);
            }
        );

    }

    checkparent(currentModule,parentId,type){        
        var parentModule = this.sortedHierarchy.filter(function (module) {
            return (module.id == parentId && module.hasChildren == true);
        })[0];        
        this.setPermissionByType(parentModule, type, true);                        
        if(currentModule.rolePermission.permissionID == 1 || currentModule.rolePermission.permissionID == 2 || currentModule.rolePermission.permissionID == 3 || currentModule.rolePermission.permissionID == 4){           
            this.setCorrospondingValue(parentModule,2,true);  
        }
    }

    }
}