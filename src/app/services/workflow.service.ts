// ===============================
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

import { WorkFlowEndpoint } from './workflow-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { WorkFlowAction } from '../models/work-flow-action.model';
import { UserEdit } from '../models/user-edit.model';
import { masterCompanyId } from '../common-masterData/mastercompany-details';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class WorkFlowtService {
	public static readonly roleAddedOperation: RolesChangedOperation = "add";
	public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
	public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

	private _rolesChanged = new Subject<RolesChangedEventArg>();
	public listCollection: any;
	public enableUpdateMode: boolean = false;
	public currentWorkFlowId: number;
	public bredcrumbObj = new Subject<any>();
	public bredcrumbObjChangeObject$ = this.bredcrumbObj.asObservable();

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private workflowEndpoint: WorkFlowEndpoint) { }


	getWorkFlows() {

		return Observable.forkJoin(
			this.workflowEndpoint.getWorkFlowEndpoint<any[]>());
	}

	getAllWorkFlowList(data) {
        return Observable.forkJoin(
            this.workflowEndpoint.getAllWorkFlowListEndpoint(data));
    }

	getWorkFlowActions() {

		return Observable.forkJoin(
			this.workflowEndpoint.getWorkFlowActions<any[]>());
	}

	getMaterialType() {

		return Observable.forkJoin(
			this.workflowEndpoint.getMaterialTypes<any[]>());
	}

	getWorkflowActionAttributes(workflowId: number) {

		return Observable.forkJoin(
			this.workflowEndpoint.getworkflowActionAttributesCollection<any[]>(workflowId));
	}

	getWorkFlowMaterial() {

		return Observable.forkJoin(
			this.workflowEndpoint.getworkflowMaterailCollection<any[]>());
	}

	getWorkFlowEquipmentList() {

		return Observable.forkJoin(
			this.workflowEndpoint.getworkflowEquipmentCollection<any[]>());
	}
	getChargeList() {

		return Observable.forkJoin(
			this.workflowEndpoint.getChargeListcollection<any[]>());
	}

	getWorkflowExpertise() {

		return Observable.forkJoin(
			this.workflowEndpoint.getworkflowExpertiseCollection<any[]>());
	}

	getActionAttributes() {

		return Observable.forkJoin(
			this.workflowEndpoint.getActionAttributesCollection<any[]>());
	}

	newWorkFlow(workFlowAction: WorkFlowAction) {
		return this.workflowEndpoint.getNewWorkFlowEndpoint<WorkFlowAction>(workFlowAction);
	}

	addMaterialListdata(mateListObj: any) {
		return this.workflowEndpoint.addMatList<any>(mateListObj);
	}

	addchargelist(chargeListObj: any) {
		return this.workflowEndpoint.addchargelist<any>(chargeListObj);
	}

	addEquipment(chargeListObj: any) {
		return this.workflowEndpoint.addEquipmentList<any>(chargeListObj);
	}

	addExclsuion(chargeListObj: any) {
		return this.workflowEndpoint.addExclusionsList<any>(chargeListObj);
	}

	addExpertise(chargeListObj: any) {
		return this.workflowEndpoint.addExpertiseList<any>(chargeListObj);
	}

	addWorkFlow(workFlow: any) {
		return this.workflowEndpoint.addWorkflowdetails<any>(workFlow);
	}

	addWorkFlowActionAttributes(workFlow: any) {
		return this.workflowEndpoint.addWorkflowactionattributes<any>(workFlow);
	}

	getWorkFlowDataById(workFlowId) {
		return this.workflowEndpoint.getWorkFlowDataById(workFlowId);
	}
	getWorkFlowDataByIdForEdit(workFlowId,masterCompanyId) {
		return this.workflowEndpoint.getWorkFlowDataByIdForEdit(workFlowId,masterCompanyId);
	}
	getPublicationsByItemMasterId(itemMasterId) {
		return this.workflowEndpoint.getPublicationsByItemMasterId(itemMasterId);
	}
	getemployeeExpertiseById(id) {
		return this.workflowEndpoint.getemployeeExpertiseById(id);
	}
	
}