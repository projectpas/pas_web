import { Injectable } from "@angular/core";
import { ITask } from "./Action";
import { IActionAttrbutes } from "./ActionAttributes";

import { Observable,forkJoin } from "rxjs";
import { tap, catchError } from "rxjs/operators"
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { IChargesType } from "./ChargesType";
import { IChargesCurrency } from "./ChargesCurrency";
import { ICharges } from "./Charges";
import { IEquipmentAssetType } from "./EquipmentAssetType";
import { IExpertiseType } from "./ExpertiseType";
import { IMaterialCondition } from "./MaterialCondition";
import { IMaterialMandatory } from "./MaterialMandatory";
import { IMaterialUOM } from "./MaterialUOM";
import { IPublicationType } from "./PublicationType";
import { IPublicationAircraftManufacturer } from "./PublicationAircraftManufacturer";
import { IPublicationModel } from "./PublicationModel";
import { IPublicationStatus } from "./PublicationStatus";
import { IExclusionEstimatedOccurance } from "./ExclusionEstimatedOccurance";
import { IWorkFlow } from "./WorkFlow";
import { IDirections } from "./Directions";
import { IEquipmentList } from "./EquipmentList";
import { IExclusion } from "./Exclusion";
import { IExpertise } from "./Expertise";
import { IMaterialList } from "./MaterialList";
import { IMeasurement } from "./Measurement";
import { IPublication, IDashNumbers } from "./Publication";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { ActionEndpoint } from "./action-endpoint.service";
import { Action } from "../models/action.model";
import { TaskAttribute } from "../models/taskattribute.model";


@Injectable()
export class ActionService {

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private actionEndpoint: ActionEndpoint) {
    }

    GetExclusionEstimatedOccurance() {
        return this.actionEndpoint.GetExclusionEstimatedOccurance<IExclusionEstimatedOccurance[]>();
    }

    GetPublicationStatus() {
        return this.actionEndpoint.GetPublicationStatus<IPublicationStatus[]>();
    }

    GetPublicationModel(aircraftTypeId) {
        return this.actionEndpoint.GetPublicationModel<any[]>(aircraftTypeId);
    }

    GetDashNumbersByModelId(modelId: number) {
        return this.actionEndpoint.GetDashNumberByModelIdURL<any[]>(modelId);
    }

    RemoveWorkFlow(workFlowId: number) {
        return this.actionEndpoint.removeWorkFlow<any[]>(workFlowId);
    }

    getLocations() {
        return this.actionEndpoint.getLocations<any[]>();
    }

    GetPublicationAircraftManufacturer() {
        return this.actionEndpoint.GetPublicationAircraftManufacturer<any[]>();
    }

    GetPublicationType() {
        return this.actionEndpoint.GetPublicationType<IPublicationType[]>();
    }

    GetMaterialUOM() {
        return this.actionEndpoint.GetMaterialUOM<IMaterialUOM[]>();
    }

    GetMaterialMandatory() {
        return this.actionEndpoint.GetMaterialMandatory<IMaterialMandatory[]>();
    }

    GetMaterialCondition() {
        return this.actionEndpoint.GetMaterialCondition<IMaterialCondition[]>();
    }

    GetExpertiseType() {
        return this.actionEndpoint.GetExpertiseType<any[]>();
    }

    GetEmployeeExpertiseType() {
        return this.actionEndpoint.getEmployeeExpertiseType<any[]>();
    }

    getEquipmentAssetType() {
        return this.actionEndpoint.getEquipmentAssetType<IEquipmentAssetType[]>();
    }

    getChargesCurrency() {
        return this.actionEndpoint.getChargesCurrency<IChargesCurrency[]>();
    }

    getChargesType() {
        return this.actionEndpoint.getChargesType<any[]>();
    }
    getCharges() {
        return this.actionEndpoint.getCharges();
    }

    getActionAttributes() {
        return this.actionEndpoint.getActionAttributes<TaskAttribute[]>();
    }

    getActions() {
        return this.actionEndpoint.getActions<any>();
    }

    addAction(action: ITask) {
        return this.actionEndpoint.addAction<ITask>(action);
    }

    addWorkFlowHeader(workflowData: any) {
        return this.actionEndpoint.addWorkFlowHeader<any>(workflowData);
    }

    getNewWorkFlow(workflowData: any) {
        return this.actionEndpoint.getNewWorkFlow<any>(workflowData);
    }

    getWorkFlow(workflowid: string) {
        return forkJoin(
            this.actionEndpoint.getWorkFlow<any>(workflowid));
    }

    getWorkFlowWithMaterialList(workflowid: string) {
        return forkJoin(
            this.actionEndpoint.getWorkFlowWithMaterialList<any>(workflowid));
    }

    toggleState(workflowId: number) {
        return forkJoin(
            this.actionEndpoint.toggleState<any>(workflowId));
    }
}