// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject, forkJoin} from 'rxjs';

import { WorkFlowEndpoint } from './workflow-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { WorkFlowAction } from '../models/work-flow-action.model';
import { UserEdit } from '../models/user-edit.model';

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
	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private workflowEndpoint: WorkFlowEndpoint) { }


	getWorkFlows() {

		return forkJoin(
			this.workflowEndpoint.getWorkFlowEndpoint<any[]>());
	}

	getWorkFlowActions() {

		return forkJoin(
			this.workflowEndpoint.getWorkFlowActions<any[]>());
	}

	getMaterialType() {

		return forkJoin(
			this.workflowEndpoint.getMaterialTypes<any[]>());
	}

	getWorkflowActionAttributes(workflowId: number) {

		return forkJoin(
			this.workflowEndpoint.getworkflowActionAttributesCollection<any[]>(workflowId));
	}

	getWorkFlowMaterial() {

		return forkJoin(
			this.workflowEndpoint.getworkflowMaterailCollection<any[]>());
	}

	getWorkFlowEquipmentList() {

		return forkJoin(
			this.workflowEndpoint.getworkflowEquipmentCollection<any[]>());
	}
	getChargeList() {

		return forkJoin(
			this.workflowEndpoint.getChargeListcollection<any[]>());
	}

	getWorkflowExpertise() {

		return forkJoin(
			this.workflowEndpoint.getworkflowExpertiseCollection<any[]>());
	}

	getActionAttributes() {

		return forkJoin(
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
	getWorkFlowDataByIdForEdit(workFlowId) {
		return this.workflowEndpoint.getWorkFlowDataByIdForEdit(workFlowId);
	}
	getPublicationsByItemMasterId(itemMasterId) {
		return this.workflowEndpoint.getPublicationsByItemMasterId(itemMasterId);
	}

}