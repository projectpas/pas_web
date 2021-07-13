﻿export class ModuleHierarchyMaster {
    id: number;
    name: string;
    parentId: number;
    isPage: boolean;
    displayOrder: number;
    moduleCode: string;
    level: number;
    hasChildren: boolean;
    visible: boolean;
    isMenu:boolean;
    moduleIcon:string;
    routerLink:string;
    //children: ModuleHierarchyMaster[];
    permissionID:number;
    rolePermission: RolePermission;
    
}

export class UserRole {
    id: number;
    name: string;
    memo: string;
    rolePermissions: RolePermission[];
    masterCompanyId:number = null
}

export class RolePermission {
    id: number;
    userRoleId: number;
    moduleHierarchyMasterId: number;
    reports: boolean;
    permissionID:number;
    isSelect:boolean;
    canAdd: boolean;
    canView: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canAssign:boolean;
    canApprove:boolean;
    canUpload:boolean;
    canDownload:boolean;
    canReport:boolean;
    canRun:boolean;
    canReportView:boolean;
    canReportDelete:boolean;
    canPrint:boolean;
    isDisabled:boolean = false;
    isAddDisabled:boolean = false;
}

export class UserRoleMapper {
    id: number;
    userId: string;
    userRoleId: number;
}

export class User {
    id: number;
    userName: string;
    fullName: string;
    email: string;
    jobTitle: string;
    phoneNumber: string;
    configuration: string;
    isEnabled: boolean;
    isLockedOut: boolean;
}

export class PermissionMaster {
    permissionID: number;
    permissionName: string;
    parentID: number;
}