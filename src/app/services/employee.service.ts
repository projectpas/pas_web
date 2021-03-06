﻿﻿// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { EmployeeEndpoint } from './employee-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { AuditHistory } from '../models/audithistory.model';
import { EmployeeLeaveType } from '../models/EmployeeLeaveTypeModel';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class EmployeeService {
    employeeCollection: any;
    listCollection: any;
    employeeId: any;
    isEditMode: boolean;
    employeeObject: any[];
    //isEditMode: boolean;
    generalCollection: any;
    financeCollection: any;
    ShowPtab: boolean = true;
    leaveObj: any[];
    structureData: any[];
    legalEnityList = [];
    employeeStored: any;
    workFlowIdData: any;
    isDisbaleTabs = false;
    enableUpdateButton: boolean = false;
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();
    public currentUrl = this.router.url;
    public alertObj = new Subject<any>();
    public alertChangeObject$ = this.alertObj.asObservable();
    public indexObj = new Subject<any>();
    public indexObjChangeObject$ = this.indexObj.asObservable();
    public bredcrumbObj = new Subject<any>();
    public bredcrumbObjChangeObject$ = this.bredcrumbObj.asObservable();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private employeeEndpoint: EmployeeEndpoint) { }

    getEmployeeList() {
        return Observable.forkJoin(
            this.employeeEndpoint.getEmployeeEndpoint<any[]>());
    }

    getEmployeeCommonData(managementStructureId) {
        return Observable.forkJoin(
            this.employeeEndpoint.getEmployeeCommonEndpoint<any[]>(managementStructureId));
    }
    getEmployeeNamesList(mastercompanyId) {
        return Observable.forkJoin(
            this.employeeEndpoint.getEmployeeNamesEndpoint<any[]>(mastercompanyId));
    }

    getEmployeeListforView(employeeId: any) {
        return Observable.forkJoin(
            this.employeeEndpoint.getEmployeeEndpointforView<any[]>(employeeId));
    }
    newActionforLeave(action: EmployeeLeaveType) {
        return this.employeeEndpoint.getNewLeaveEndpoint<EmployeeLeaveType>(action);
    }

    getshift() {
        return Observable.forkJoin(
            this.employeeEndpoint.getshiftEndpoint<any[]>());
    }
    getCountries() {
        return Observable.forkJoin(
            this.employeeEndpoint.getCountriesEndpoint<any[]>());
    }
    getEmployeeLeaveType() {
        return Observable.forkJoin(
            this.employeeEndpoint.getEmployeeLeaveTypeEndpoint<any[]>());
    }

    getEmployeeTrainingType() {
        return Observable.forkJoin(
            this.employeeEndpoint.getEmployeeTrainingTypeEndpoint<any[]>());
    }
    //getCertificationList(employeeLicensure: any) {
    //    return Observable.forkJoin(
    //        this.employeeEndpoint.getCerEmployeeEndpoint<any>(employeeLicensure));
    //}
    getCertificationList(employeeLicensureId: any) {
        return Observable.forkJoin(
            this.employeeEndpoint.getCerEmployeeEndpoint<any>(employeeLicensureId));
    }
    getTrainingList(employeeTrainingId: any) {
        return Observable.forkJoin(
            this.employeeEndpoint.getTrainEmployeeEndpoint<any>(employeeTrainingId));
    }
    getTrainingTypes() {
        return Observable.forkJoin(
            this.employeeEndpoint.getTrainingType<any>());
    }

    newAddCertification(employee: any) {
        return this.employeeEndpoint.getNewCertification<any>(employee);
    }
    getEmployeeCertifications(employee: any) {
        return this.employeeEndpoint.getEmployeeCertifications<any>(employee);
    }
    AddRolesData(roles: any) {
        return this.employeeEndpoint.addRolesData<any>(roles);
    }
    deleteRolesByRoleId(roleId: any) {
        return this.employeeEndpoint.deleteRoleData<any>(roleId);
    }
    newAddTraining(employee: any) {
        return this.employeeEndpoint.getNewTrainingEndpoint<any>(employee);
    }


    newAddEmployee(employee: any) {
        return this.employeeEndpoint.getNewEmployeeEndpoint<any>(employee);
    }

    employeeLeavetypeAdd(employee: any) {
        return this.employeeEndpoint.employeeLeavetypeAdd<any>(employee);
    }
    employeeLeavetypeRemove(employee: any) {
        return this.employeeEndpoint.employeeLeavetypeRemove<any>(employee);
    }
    employeeshifttypeRemove(employee: any) {
        return this.employeeEndpoint.employeeshifttypeRemove<any>(employee);
    }
    employeeShifttypeAdd(employee: any) {
        return this.employeeEndpoint.employeeShifttypeAdd<any>(employee);
    }

    updateEmployee(action: any) {
        return this.employeeEndpoint.getUpdateEmployeeEndpoint(action, action.employeeId);
    }

    updateEmployeeDetails(employee: any) {
        return this.employeeEndpoint.updateEmployeeListDetails(employee);
    }

    updateCertificationDetails(employee: any) {
        return this.employeeEndpoint.updateCertificationListDetails(employee);
    }


    updateTrainingDetails(employee: any) {
        return this.employeeEndpoint.updateTrainingListDetails(employee);
    }

    deleteEmployee(employeeId: any) {

        return this.employeeEndpoint.getDeleteEmployeeEndpoint(employeeId);

    }
    historyEmployee(employeeId: number) {
        return Observable.forkJoin(this.employeeEndpoint.getHistoryEmployeeEndpoint<AuditHistory[]>(employeeId));
    }

    getRolesSetupData() {
        return Observable.forkJoin(
            this.employeeEndpoint.getRolesSetupEntityData<any[]>());
    }

    getUserRolelevel() {
        return Observable.forkJoin(
            this.employeeEndpoint.getUserRolelevelList<any[]>());
    }
    updateActionforActive(action: any) {
        return this.employeeEndpoint.getUpdatecustomerEndpointforActive(action, action.employeeId);
    }

    getemployeeshiftsList(action: any) {
        return Observable.forkJoin(
            this.employeeEndpoint.getemployeeshiftsList<any[]>(action));
    }
    Addmultileaves(action: any) {
        return this.employeeEndpoint.getMultileaves<any>(action);
    }
    AddShifts(action: any) {
        return this.employeeEndpoint.getShifts<any>(action);
    }


    getmultileaves(employeeId: any) {
        return this.employeeEndpoint.getleavedata<any[]>(employeeId);
    }

    getAllEmployeesInfo() {
        this.employeeEndpoint.getAllEmployeesInfo<any[]>();
    }
    getEmployeeDataById(employeeId: any) {
        return this.employeeEndpoint.getEmployeeDataById<any>(employeeId);
    }
    getAllRolesOfEmployee(masterCompanyId?) {
        return this.employeeEndpoint.getAllRolesOfEmployee<any>(masterCompanyId);
    }
    storeEmployeeRoles(data: any) {
        return this.employeeEndpoint.storeEmployeeRoles<any>(data);
    }
    getStoredEmployeeRoles(employeeId: any) {
        return this.employeeEndpoint.getEmployeeRoles(employeeId);
    }
    storeEmployeeManagementStructure(data: any) {
        return this.employeeEndpoint.storeEmployeeManagementStructure<any>(data);
    }
    getStoredEmployeeManagementStructure(employeeId: any) {
        return this.employeeEndpoint.getStoredEmployeeManagementStructure(employeeId);
    }

    getEmployeeAuditDetails(employeeId: any) {
        return this.employeeEndpoint.getEmployeeAuditDetailsEndPoint(employeeId);
    }


    getAllEmployeeList(data) {
        return Observable.forkJoin(
            this.employeeEndpoint.getAllEmployeeList(data));
    }

    //employeeListGlobalSearch(filterText, pageNumber, pageSize) {
    //    return this.employeeEndpoint.employeeListGlobalSearch(filterText, pageNumber, pageSize);
    //}
    employeeListGlobalSearch(data) {
        return Observable.forkJoin(
            this.employeeEndpoint.employeeListGlobalSearch(data));
    }
    updateEmployeeMemo(employeeId: any, memo: any) {
        return this.employeeEndpoint.getEmployeeUpdateMemoEndpoint(employeeId, memo);
    }

    // uploadEmployeeTrainingDoc(action: any) {
    //     return this.employeeEndpoint.uploadEmployeeTrainingDocEndpoint<any>(action);
    // }

    toGetEmployeeDetailsByEmpId(employeeId: any) {
        return this.employeeEndpoint.toGetEmployeeDetailsByEmpIdEndPoint(employeeId);
    }

    downloadAllEmployeeList(employeeId) {
        return this.employeeEndpoint.downloadAllEmployeeList(employeeId);
    }

    updateEmployeePassword(password, employeeID, currentpassword) {
        return this.employeeEndpoint.getUpdateEmployeePasswordEndpoint(password, employeeID, currentpassword);
    }

    forgotPassword(email: any, masterCompanyId) {
        return this.employeeEndpoint.forgotPasswordEndpoint<any>(email, masterCompanyId);
    }

    resetPassword(user: any) {
        return this.employeeEndpoint.resetPasswordEndpoint<any>(user);
    }
}