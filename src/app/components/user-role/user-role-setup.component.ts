import { MessageService } from "primeng/api";
import { AuthService } from "../../services/auth.service";
import { AlertService, MessageSeverity } from "../../services/alert.service";
import { OnInit, Component } from "@angular/core";
import { fadeInOut } from "../../services/animations";
import { UserRoleService } from "./user-role-service";
import { ModuleHierarchyMaster, UserRole, RolePermission, PermissionMaster } from "./ModuleHierarchyMaster.model";
import { single } from "rxjs/operators";
import { Role } from "../../models/role.model";
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-roles-setup',
    templateUrl: './user-role-setup.component.html',
    styleUrls: [],
    animations: [fadeInOut]
})

export class UserRolesSetupComponent implements OnInit {
    public moduleHierarchy: ModuleHierarchyMaster[];
    public sortedHierarchy: ModuleHierarchyMaster[] = [];
    public selectedHierarchy: ModuleHierarchyMaster[] = [];
    public currentUserRole: UserRole;
    public pages: ModuleHierarchyMaster[];
    public pagesToHide: ModuleHierarchyMaster[];
    public permissionMaster: PermissionMaster[];
    public removePermission: RolePermission[] = [];
    form1: FormGroup;
    roleForm = new FormGroup({
        name: new FormControl('name', Validators.required),
        description: new FormControl('description')
    });
    constructor(fb: FormBuilder, private messageService: MessageService, private authService: AuthService, private alertService: AlertService, private userRoleService: UserRoleService) {
        this.roleForm = fb.group({
            'name': [null, Validators.compose([Validators.required])],
            'description': [null]
        });
    }
    get name() {
        return this.roleForm.get('name');
    }
    get description() {
        return this.roleForm.get('description');
    }
    ngOnInit(): void {
        this.getAllModuleHierarchies();
        this.getAllPermission();
        this.currentUserRole = new UserRole();
        this.currentUserRole.rolePermissions = [];
        this.pages = [];
    }

    getAllModuleHierarchies(): void {
        this.userRoleService.getAllModuleHierarchies().subscribe(data => {
            console.log(data[0]);
            this.moduleHierarchy = data[0];
            this.sortModules();
        });
    }

    getAllPermission() {
        this.userRoleService.getAllPermission().subscribe(data => {
            this.permissionMaster = data[0];
            console.log(this.permissionMaster);
        })
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
console.log(this.sortedHierarchy)
    }

    resetRolePermission(rolePermission: RolePermission): void {
        rolePermission.canAdd = false;
        rolePermission.canView = false;
        rolePermission.canDelete = false;
        rolePermission.canUpdate = false;
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

    showChildModules(currentModule: ModuleHierarchyMaster, event): void {
        if (currentModule.hasChildren) {
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
                    var k=document.getElementsByClassName('cls'+currentModule.id);
                    for (let index = 0; index < k.length; index++) {
                        const element = k[index];
                        element.classList.remove('fa-caret-right');
                        element.classList.add('fa-caret-down');
                        
                    }
                });
            }
        }
    }

    setPermissionByType(currentModule: ModuleHierarchyMaster, type: string, value: boolean, isUncheck: boolean = true) {
        // if (type == 'canView')
        //     currentModule.rolePermission.canView = value;
        // if (type == 'canAdd')
        //     currentModule.rolePermission.canAdd = value;
        // if (type == 'canUpdate')
        //     currentModule.rolePermission.canUpdate = value;
        // if (type == 'canDelete')
        //     currentModule.rolePermission.canDelete = value;

        // if (value == true) {
       
        if (value == true) {
            currentModule.rolePermission.permissionID = +type;
        }
        else {
           // currentModule.rolePermission.permissionId = 0;
        }
        //if(currentModule.parentId!=null && currentModule.isPage){
        // if (isUncheck) {
        //     if (currentModule.hasChildren) {
        //         this.sortedHierarchy.filter(b => b.parentId == currentModule.id).forEach(a => {
        //             a.rolePermission.permissionId = +type;
        //         });
        //     }
        // }
        this.setCorrospondingValue(currentModule,+type, value);
        // }
        // if(currentModule.parentId!=null && currentModule.isPage){
        // if (isUncheck) {
        //     if (currentModule.hasChildren) {
        //         this.sortedHierarchy.filter(b => b.parentId == currentModule.id || b.id == currentModule.id).forEach(a => {
        //             this.setCorrospondingValue(a, value);
        //         });
        //     }
        // }
        // else {
        //     this.sortedHierarchy.filter(b => {
        //         if (b.id == currentModule.id)
        //             this.setCorrospondingValue(b, value);
        //     });
        // }

        // }  //this.currentUserRole.rolePermissions.push(currentModule.rolePermission)
        //currentModule.rolePermission.isSelect = value;
        //}
        // else {
        //     currentModule.rolePermission.permissionId = null;
        //     currentModule.rolePermission.isSelect = value;
        // }
        this.sortedHierarchy = [...this.sortedHierarchy];
    }

    setCorrospondingValue(val,type, value) {
        switch (type) {
            case 1:
                val.rolePermission.canAdd = value;
                break;
            case 2:
                val.rolePermission.canView = value;
                break;
            case 3:
                val.rolePermission.canUpdate = value;
                break;
            case 4:
                val.rolePermission.canDelete = value;
                break;
            case 5:
                val.rolePermission.canAssign = value;
                break;
            case 6:
                val.rolePermission.canApprove = value;
                break;
            case 7:
                val.rolePermission.canUpload = value;
                break;
            case 8:
                val.rolePermission.canDownload = value;
                break;
            case 9:
                val.rolePermission.canReport = value;
                break;
            case 10:
                val.rolePermission.canRun = value;
                break;
            case 11:
                val.rolePermission.canReportView = value;
                break;
            case 12:
                val.rolePermission.canReportDelete = value;
                break;
            case 13:
                val.rolePermission.canPrint = value;
                break;
            default:
                break;
        }
    }

    uncheckAllParentModule(parentId, type: string): void {
        var parentModule = this.sortedHierarchy.filter(function (module) {
            return (module.id == parentId && module.hasChildren == true);
        })[0];
        this.setPermissionByType(parentModule, type, false, false);
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
            if (module.parentId != null && module.hasChildren) {
                this.loadAllChildModule(module.id);
            }
        }
    }

    permissionChecked(event, currentModule: ModuleHierarchyMaster, type: string): void {
        var value = event.target.checked;
        console.log("Test");
        if (value == false) {
            this.setPermissionByType(currentModule, type, value);
            if (currentModule.parentId != null)
                this.uncheckAllParentModule(currentModule.parentId, type);
        }

        if (currentModule.hasChildren) {
            this.setPermissionByType(currentModule, type, value);
            
            this.pages = [];
            this.hasPages(currentModule, type, value);
            //this.currentUserRole.rolePermissions=this.currentUserRole.rolePermissions.filter(i=>i.permissionId!==+type);
            for (let page of this.pages) {
                this.setModuleHierarchyPermission(page,value);
            }
            if(value==true && (currentModule.parentId==null || currentModule.hasChildren)){
                var currentRolePermission = Object.assign({}, currentModule.rolePermission);
                currentRolePermission.moduleHierarchyMasterId = currentModule.id;
                this.currentUserRole.rolePermissions.push(currentRolePermission);
                var viewPermission= this.currentUserRole.rolePermissions.filter(function (permission: RolePermission) {
                    return permission.moduleHierarchyMasterId == currentModule.id && permission.permissionID == 2;
                })[0];
    
                if(viewPermission==undefined){
                if(currentModule.rolePermission.permissionID==1 || currentModule.rolePermission.permissionID==3||currentModule.rolePermission.permissionID==4){
                    var rolepermissionData=Object.assign({}, currentModule.rolePermission);
                    rolepermissionData.permissionID=2;
                    rolepermissionData.moduleHierarchyMasterId = currentModule.id;
                    this.currentUserRole.rolePermissions.push(rolepermissionData);
                    this.setCorrospondingValue(currentModule,rolepermissionData.permissionID,value);
                }
            }
            }
            else{
                this.currentUserRole.rolePermissions=this.currentUserRole.rolePermissions.filter(i=>i.moduleHierarchyMasterId!==currentModule.id);
                if(currentModule.parentId!=null){
                this.currentUserRole.rolePermissions=this.currentUserRole.rolePermissions.filter(i=>i.moduleHierarchyMasterId!==currentModule.parentId);
                }
            }
        }
        else {
            this.setPermissionByType(currentModule, type, value);
            this.setModuleHierarchyPermission(currentModule, value);
        }
        //this.currentUserRole.rolePermissions.push(currentModule.rolePermission);
        console.log(this.currentUserRole.rolePermissions);
    }

    setModuleHierarchyPermission(currentModule: ModuleHierarchyMaster,value:boolean=true): void {

        var permission = this.currentUserRole.rolePermissions.filter(function (permission: RolePermission) {
            return permission.moduleHierarchyMasterId == currentModule.id && permission.permissionID == currentModule.rolePermission.permissionID;
        })[0];

        if (permission != undefined) {
            var currentRolePermission = Object.assign({}, currentModule.rolePermission);
            currentRolePermission.moduleHierarchyMasterId = currentModule.id;
            var permissionIndex = this.currentUserRole.rolePermissions.indexOf(permission)
            if(value==false){
            this.currentUserRole.rolePermissions[permissionIndex].permissionID=0;
            this.currentUserRole.rolePermissions=this.currentUserRole.rolePermissions.filter(i=>i.permissionID!=0);
            }
            //this.updatePermission(this.currentUserRole.rolePermissions[permissionIndex], currentModule.rolePermission);
        }
        else {
            var currentRolePermission = Object.assign({}, currentModule.rolePermission);
            currentRolePermission.moduleHierarchyMasterId = currentModule.id;
            this.currentUserRole.rolePermissions.push(currentRolePermission);

            var viewPermission= this.currentUserRole.rolePermissions.filter(function (permission: RolePermission) {
                return permission.moduleHierarchyMasterId == currentModule.id && permission.permissionID == 2;
            })[0];

            if(viewPermission==undefined){
            if(currentModule.rolePermission.permissionID==1 || currentModule.rolePermission.permissionID==3||currentModule.rolePermission.permissionID==4){
                var rolePermissionData=Object.assign({}, currentModule.rolePermission);
                rolePermissionData.permissionID=2;
                rolePermissionData.moduleHierarchyMasterId = currentModule.id;
                this.currentUserRole.rolePermissions.push(rolePermissionData);
                this.setCorrospondingValue(currentModule,rolePermissionData.permissionID,value);
            }
        }
        }

    }

    updatePermission(previousPermission: RolePermission, latestPermission: RolePermission): void {
        previousPermission.canView = latestPermission.canView;
        previousPermission.canAdd = latestPermission.canAdd;
        previousPermission.canUpdate = latestPermission.canUpdate;
        previousPermission.canDelete = latestPermission.canDelete;
        if(latestPermission.permissionID==0){
        this.currentUserRole.rolePermissions=this.currentUserRole.rolePermissions.filter(i=>i.permissionID!=0);
        }
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

    getChecked(module, permissionId) {
        let valToReturn: Boolean;
        switch (permissionId) {
            case 1:
                valToReturn = module.rolePermission.canAdd;
                break;
            case 2:
                valToReturn = module.rolePermission.canView;
                break;
            case 3:
                valToReturn = module.rolePermission.canUpdate;
                break;
            case 4:
                valToReturn = module.rolePermission.canDelete;
                break;
            case 5:
                valToReturn = module.rolePermission.canAssign;
                break;
            case 6:
                valToReturn = module.rolePermission.canApprove;
                break;
            case 7:
                valToReturn = module.rolePermission.canUpload;
                break;
            case 8:
                valToReturn = module.rolePermission.canDownload;
                break;
            case 9:
                valToReturn = module.rolePermission.canReport;
                break;
            case 10:
                valToReturn = module.rolePermission.canRun;
                break;
            case 11:
                valToReturn = module.rolePermission.canReportView;
                break;
            case 12:
                valToReturn = module.rolePermission.canReportDelete;
                break;
            case 13:
                valToReturn = module.rolePermission.canPrint;
                break;
            default:
                break;
        }
        return valToReturn;
    }

    addUserRole(): void {

        this.currentUserRole.name = this.roleForm.value.name;
        this.currentUserRole.memo = this.roleForm.value.description;
        console.log(this.currentUserRole.name);
        console.log(this.currentUserRole.memo);
        //return;
        if (this.currentUserRole.name == null) {
            this.alertService.showMessage(
                "Validation Failed",
                "Role Name is require",
                MessageSeverity.error
            );
            return;
        }

        this.userRoleService.add(this.currentUserRole).subscribe(
            result => {
                this.alertService.showMessage('User Role', this.currentUserRole.name + ' Role added successfully.', MessageSeverity.success);
                for (let module of this.sortedHierarchy) {
                    this.resetRolePermission(module.rolePermission);
                }
                this.currentUserRole = new UserRole();
                this.currentUserRole.rolePermissions = [];
                this.pages = [];
            },
            error => {
                this.alertService.showMessage('User Role', error, MessageSeverity.error);
            }
        );

    }
}