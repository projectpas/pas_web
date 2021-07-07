import { MessageService } from "primeng/api";
import { AuthService } from "../../services/auth.service";
import { AlertService, MessageSeverity } from "../../services/alert.service";
import { OnInit, Component } from "@angular/core";
import { fadeInOut } from "../../services/animations";
import { UserRoleService } from "./user-role-service";
import { ModuleHierarchyMaster, UserRole, RolePermission, User, PermissionMaster } from "./ModuleHierarchyMaster.model";
import { single } from "rxjs/operators";
import { Role } from "../../models/role.model";
import { roleModulesEnum } from '../../enum/rolemodules.enum';
import { ActivatedRoute } from '@angular/router';

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
    constructor(private router: ActivatedRoute,private messageService: MessageService, private authService: AuthService, private alertService: AlertService, private userRoleService: UserRoleService) {
        this.id = this.router.snapshot.params['id'];
    }

    ngOnInit(): void {
        this.getAllModuleHierarchies();
        this.getAllUserRoles();
        this.getAllPermission();
        this.currentUserRole = new UserRole();
        this.currentUserRole.rolePermissions = [];
        this.pages = [];
        this.currentUserRole.id = 0;
        this.isSpinnerVisible = false;
        if (this.id > 0) {
            this.currentUserRole.id = this.id;
            setTimeout(() => {
                this.userRoleChanged();
            },1500);
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

    getAllPermission() {
        this.userRoleService.getAllPermission().subscribe(data => {
            this.permissionMaster = data[0];            
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

    getAllUserRoles() {
        return this.userRoleService.getAllUserRole(this.currentUserMasterCompanyId).subscribe(result => {
            this.userRoles = result[0];
        });
    }

    userRoleChanged(): void {        
        this.isSpinnerVisible=true;
        this.sortModules();        
        this.currentUserRole.rolePermissions = [];
        if ( this.currentUserRole.id != undefined && this.currentUserRole.id != 0 ) {
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
                    for(let role of rolePermission){ 
                    modules.rolePermission.permissionID=role.permissionID;
                    switch (role.permissionID) {
                        case 1:
                            modules.rolePermission.canAdd = true;
                            break;
                        case 2:
                            modules.rolePermission.canView= true;
                            break;
                        case 3:
                             modules.rolePermission.canUpdate= true;
                            break;
                        case 4:
                             modules.rolePermission.canDelete= true;
                            break;
                        case 5:
                             modules.rolePermission.canAssign= true;
                            break;
                        case 6:
                             modules.rolePermission.canApprove= true;
                            break;
                        case 7:
                             modules.rolePermission.canUpload= true;
                            break;
                        case 8:
                             modules.rolePermission.canDownload= true;
                            break;
                        case 9:
                             modules.rolePermission.canReport= true;
                            break;
                        case 10:
                             modules.rolePermission.canRun= true;
                            break;
                        case 11:
                             modules.rolePermission.canReportView= true;
                            break;
                        case 12:
                             modules.rolePermission.canReportDelete= true;
                            break;
                        case 13:
                             modules.rolePermission.canPrint= true;
                            break;
                        default:
                            break;
                    }
                    role.id = 0;
                    this.currentUserRole.rolePermissions.push(Object.assign({}, role));
                    this.setCorrospondingValue(modules,role.permissionID, true);
                    }
                }
                else {
                    modules.rolePermission.canAdd = false;
                    modules.rolePermission.canUpdate = false;
                    modules.rolePermission.canDelete = false;
                    modules.rolePermission.canView = false;
                }
            }
            this.isSpinnerVisible=false;
        }
        else{
            this.isSpinnerVisible=false;
        }
        this.enableDisableViewPermission(null,false);
    }
    
    setPermissionByType(currentModule: ModuleHierarchyMaster, type: string, value: boolean) {
        if (value == true) {
            currentModule.rolePermission.permissionID = +type;
        }
        else {
           // currentModule.rolePermission.permissionId = 0;
        }
        this.setCorrospondingValue(currentModule,+type, value);
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
            if (module.parentId != null && module.hasChildren) {
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
            
            if (currentModule.hasChildren) {
                this.setPermissionByType(currentModule, type, value);
                this.pages = [];
                this.hasPages(currentModule, type, value);
                for (let page of this.pages) {
                    this.setModuleHierarchyPermission(page,type,value);
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
                        var rolePermissionData=Object.assign({}, currentModule.rolePermission);
                        rolePermissionData.permissionID=2;
                        rolePermissionData.moduleHierarchyMasterId = currentModule.id;
                        this.currentUserRole.rolePermissions.push(rolePermissionData);
                        this.setCorrospondingValue(currentModule,rolePermissionData.permissionID,value);
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
                this.setModuleHierarchyPermission(currentModule,type,value);
                if (currentModule.parentId != null)
                    this.checkParentModule(currentModule,currentModule.parentId,type,value);
            }
        
        this.enableDisableViewPermission(currentModule,value);
    }

    enableDisableViewPermission(currentModule,value){
       let genInfoCount : number = 0
       if(currentModule != null){
            this.sortedHierarchy.filter(function (module) {
                if(module.parentId != null && (currentModule.parentId == module.parentId)){
                    if(module.displayOrder != null && module.displayOrder == 0){
                        genInfoCount = genInfoCount +1;
                    }
                }
         });
       }
       this.sortedHierarchy.filter(function (module) {
                if(genInfoCount >0){
                    if(module.parentId != null && (currentModule.parentId == module.parentId)){
                        if(module.displayOrder != null && module.displayOrder == 0 && value){
                            module.rolePermission.canView = true;
                        }
                    }
                }
                if(module.rolePermission.canAdd || module.rolePermission.canUpdate || module.rolePermission.canDelete){
                    module.rolePermission.canView = true;
                    module.rolePermission.isDisabled = true;
                }else {
                    module.rolePermission.isDisabled = false;
                }
            return module
        });
    }

    setModuleHierarchyPermission(currentModule: ModuleHierarchyMaster,type,value:boolean=true): void {
        // var permission = this.currentUserRole.rolePermissions.filter(function (permission: RolePermission) {
        //     return permission.moduleHierarchyMasterId == currentModule.id && permission.permissionID == currentModule.rolePermission.permissionID;
        // })[0];   
        var permission = this.currentUserRole.rolePermissions.filter(function (permission: RolePermission) {
            return permission.moduleHierarchyMasterId == currentModule.id && permission.permissionID == type;
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
            currentRolePermission.userRoleId = this.currentUserRole.id;
            currentRolePermission.moduleHierarchyMasterId = currentModule.id;
            currentRolePermission.id = 0;
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
    }

    hasPages(currentModule: ModuleHierarchyMaster, type: string, checkedValue: boolean) {
        var modules = this.sortedHierarchy.filter(function (module: ModuleHierarchyMaster) {
            return module.parentId == currentModule.id;
        });
        if (modules != undefined && modules.length > 0) {
            for (let module of modules) {
                this.setPermissionByType(module, type, checkedValue);
                this.pages.push(module);
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

    UpdateUserRole(): void {
    this.isSpinnerVisible=true;
        let userRoleID = this.currentUserRole.id
        this.currentUserRole.rolePermissions = [];
        let arrayData :any = [];
        this.sortedHierarchy.filter(function (module) {
            let e = module.rolePermission;
          if(e.canAdd ||e.canView ||e.canUpdate ||e.canDelete ||e.canAssign ||e.canApprove ||e.canUpload ||e.canDownload ||e.canReport || e.canRun ||e.canReportView ||e.canReportDelete  ||e.canPrint ){
            if(e.canAdd != undefined && e.canAdd != null && e.canAdd){
                let moduleObj :any ={};
                moduleObj.CanAdd = e.canAdd;
                moduleObj.id = 0
                moduleObj.moduleHierarchyMasterId  = module.id ;
                moduleObj.permissionID = 1 ;
                moduleObj.userRoleId= userRoleID;
                moduleObj.CanView = false;
                moduleObj.CanUpdate  = false;
                moduleObj.CanDelete = false;
                moduleObj.Reports = false;
                moduleObj.CanUpload = false;
                moduleObj.CanDownload = false;
                arrayData.push(moduleObj);
            }
            if(e.canView != undefined && e.canView != null && e.canView){
                let moduleObj :any ={};
                moduleObj.CanAdd = false;
                moduleObj.id = 0
                moduleObj.moduleHierarchyMasterId  = module.id ;
                moduleObj.permissionID = 2 ;
                moduleObj.userRoleId= userRoleID;
                moduleObj.CanView = e.canView;
                moduleObj.CanUpdate  = false;
                moduleObj.CanDelete = false;
                moduleObj.Reports = false;
                moduleObj.CanUpload = false;
                moduleObj.CanDownload = false;
                arrayData.push(moduleObj);
            }
            if(e.canUpdate != undefined && e.canUpdate != null && e.canUpdate){
                let moduleObj :any ={};
                moduleObj.CanAdd = false;
                moduleObj.id = 0
                moduleObj.moduleHierarchyMasterId  = module.id ;
                moduleObj.permissionID = 3 ;
                moduleObj.userRoleId= userRoleID;
                moduleObj.CanView = false;
                moduleObj.CanUpdate  = e.canUpdate;
                moduleObj.CanDelete = false;
                moduleObj.Reports = false;
                moduleObj.CanUpload = false;
                moduleObj.CanDownload = false;
                arrayData.push(moduleObj);
            }
            if(e.canDelete != undefined && e.canDelete != null && e.canDelete){
                let moduleObj :any ={};
                moduleObj.CanAdd = false;
                moduleObj.id = 0
                moduleObj.moduleHierarchyMasterId  = module.id ;
                moduleObj.permissionID = 4 ;
                moduleObj.userRoleId= userRoleID;
                moduleObj.CanView = false;
                moduleObj.CanUpdate  = false;
                moduleObj.CanDelete = e.canDelete;
                moduleObj.Reports = false;
                moduleObj.CanUpload = false;
                moduleObj.CanDownload = false;
                arrayData.push(moduleObj);
            }
            if(e.canReport != undefined && e.canReport != null && e.canReport){
                let moduleObj :any ={};
                moduleObj.CanAdd = false;
                moduleObj.id = 0
                moduleObj.moduleHierarchyMasterId  = module.id ;
                moduleObj.permissionID = 9 ;
                moduleObj.userRoleId= userRoleID;
                moduleObj.CanView = false;
                moduleObj.CanUpdate  = false;
                moduleObj.CanDelete = false;
                moduleObj.Reports = e.canReport;
                moduleObj.CanUpload = false;
                moduleObj.CanDownload = false;
                arrayData.push(moduleObj);
            }
            if(e.canUpload != undefined && e.canUpload != null && e.canUpload){
                let moduleObj :any ={};
                moduleObj.CanAdd = false;
                moduleObj.id = 0
                moduleObj.moduleHierarchyMasterId  = module.id ;
                moduleObj.permissionID = 7 ;
                moduleObj.userRoleId= userRoleID;
                moduleObj.CanView = false;
                moduleObj.CanUpdate  = false;
                moduleObj.CanDelete = false;
                moduleObj.Reports = false;
                moduleObj.CanUpload = e.canUpload;
                moduleObj.CanDownload = false;
                arrayData.push(moduleObj);
            }
            if(e.canDownload != undefined && e.canDownload != null && e.canDownload){
                let moduleObj :any ={};
                moduleObj.CanAdd = false;
                moduleObj.id = 0
                moduleObj.moduleHierarchyMasterId  = module.id ;
                moduleObj.permissionID = 8 ;
                moduleObj.userRoleId= userRoleID;
                moduleObj.CanView = false;
                moduleObj.CanUpdate  = false;
                moduleObj.CanDelete = false;
                moduleObj.Reports = false;
                moduleObj.CanUpload = false;
                moduleObj.CanDownload = e.canDownload;
                arrayData.push(moduleObj);
            }
          }
     });

     this.currentUserRole.rolePermissions = arrayData;
        this.isSpinnerVisible=false;
        this.userRoleService.update(this.currentUserRole).subscribe(
            result => {
                this.alertService.showMessage('User Role', this.currentUserRole.name + ' Role updated successfully.', MessageSeverity.success);
                for (let module of this.sortedHierarchy) {
                    this.resetRolePermission(module.rolePermission);
                }
                var roleId = this.currentUserRole.id;
                this.currentUserRole = new UserRole();
                this.currentUserRole.id = roleId;
                this.currentUserRole.rolePermissions = [];
                this.pages = [];
                this.userRoleService.getAllUserRole(this.currentUserMasterCompanyId).subscribe(result => {
                    this.userRoles = result[0];
                    this.userRoleChanged();
                });
                this.isSpinnerVisible=false;
            },
            error => {
                this.isSpinnerVisible=false;
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

    addcount : number
    viewcount : number
    updatecount : number
    deletecount : number
    canAssign : number
    canApprove : number
    canUpload:number
    canDownload:number
    canReport : number
    canRun : number
    canReportView : number
    canReportDelete : number
    canPrint : number   
    checkParentModule(currentModule: ModuleHierarchyMaster,parentId:any, type: string, checkedValue: boolean) {
        this.addcount = 0;
        this.viewcount = 0;
        this.updatecount = 0;
        this.deletecount = 0;
        this.canAssign = 0;
        this.canApprove = 0;
        this.canUpload = 0;
        this.canDownload = 0;
        this.canReport = 0;
        this.canRun = 0;
        this.canReportView = 0;
        this.canReportDelete = 0;
        this.canPrint = 0;
        
        var childlist = this.sortedHierarchy.filter(function (module) {
            return module.parentId == parentId
        });              
        if (childlist != undefined && childlist.length > 0) {
            for (let i=0;i<childlist.length;i++) {
                if(type == roleModulesEnum.canAdd){
                    if(childlist[i].rolePermission.canAdd === true){
                        this.addcount+=1; 
                    }                                
                }
                if(type == roleModulesEnum.canView){
                    if(childlist[i].rolePermission.canView === true){
                        this.viewcount+=1; 
                    }                                
                }
                if(type == roleModulesEnum.canUpdate){
                    if(childlist[i].rolePermission.canUpdate === true){
                        this.updatecount+=1; 
                    }                                
                }
                if(type == roleModulesEnum.canDelete){
                    if(childlist[i].rolePermission.canDelete === true){
                        this.deletecount+=1; 
                    }                                
                }
                if(type == roleModulesEnum.canAssign){
                    if(childlist[i].rolePermission.canAssign === true){
                        this.canAssign+=1; 
                    }                                
                }
                if(type == roleModulesEnum.canApprove){
                    if(childlist[i].rolePermission.canApprove === true){
                        this.canApprove+=1; 
                    }                                
                }
                if(type == roleModulesEnum.canUpload){
                    if(childlist[i].rolePermission.canUpload === true){
                        this.canUpload+=1; 
                    }                                
                }
                if(type == roleModulesEnum.canDownload){
                    if(childlist[i].rolePermission.canDownload === true){
                        this.canDownload+=1; 
                    }                                
                }
                if(type == roleModulesEnum.canReport){
                    if(childlist[i].rolePermission.canReport === true){
                        this.canReport+=1; 
                    }                                
                }
                if(type == roleModulesEnum.canRun){
                    if(childlist[i].rolePermission.canRun === true){
                        this.canRun+=1; 
                    }                                
                }
                if(type == roleModulesEnum.canReportView){
                    if(childlist[i].rolePermission.canReportView === true){
                        this.canReportView+=1; 
                    }                                
                }
                if(type == roleModulesEnum.canReportDelete){
                    if(childlist[i].rolePermission.canReportDelete === true){
                        this.canReportDelete+=1; 
                    }                                
                }
                if(type == roleModulesEnum.canPrint){
                    if(childlist[i].rolePermission.canPrint === true){
                        this.canPrint+=1; 
                    }                                
                }
            }           
            if(this.addcount == childlist.length){  
                this.checkparent(currentModule,parentId,type);                                                                                          
            }
            if(this.viewcount == childlist.length){                
                this.checkparent(currentModule,parentId,type);               
            }
            if(this.updatecount == childlist.length){                
                this.checkparent(currentModule,parentId,type);                
            }
            if(this.deletecount == childlist.length){                
                this.checkparent(currentModule,parentId,type);              
            }
            if(this.canAssign == childlist.length){                
                this.checkparent(currentModule,parentId,type);              
            }
            if(this.canApprove == childlist.length){                
                this.checkparent(currentModule,parentId,type);              
            }
            if(this.canUpload == childlist.length){                
                this.checkparent(currentModule,parentId,type);              
            }
            if(this.canDownload == childlist.length){                
                this.checkparent(currentModule,parentId,type);              
            }
            if(this.canReport == childlist.length){                
                this.checkparent(currentModule,parentId,type);              
            }
            if(this.canRun == childlist.length){                
                this.checkparent(currentModule,parentId,type);              
            }
            if(this.canReportView == childlist.length){                
                this.checkparent(currentModule,parentId,type);              
            }
            if(this.canReportDelete == childlist.length){                
                this.checkparent(currentModule,parentId,type);              
            }
            if(this.canPrint == childlist.length){                
                this.checkparent(currentModule,parentId,type);              
            }
        }
    }

    
}

