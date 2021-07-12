// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class WorkFlowEndpoint extends EndpointFactory {
	private readonly _workflowActionsUrl: string =environment.baseUrl+ "/api/WorkflowAction/Get";
	private readonly _workflowUrl: string =environment.baseUrl+ "/api/WorkflowAction/GetWorkFlows";
	private readonly _workflowListUrl: string =environment.baseUrl+ "/api/WorkflowAction/GetAllWorkFlows";
	public readonly _workFlowMaterialTypes =environment.baseUrl+ "/api/WorkflowAction/GetMaterialType";
	private readonly _actionAttributes: string =environment.baseUrl+ "/api/WorkflowAction/GetActionAttributes";
	private readonly _workflowactionAttributes: string = environment.baseUrl+"/api/WorkflowAction/GetWorkflowActionAttributes";
	private readonly _workflowMaterail: string =environment.baseUrl+ "/api/WorkflowAction/GetWorkflowMaterail";
	private readonly _workflowEquipmet: string =environment.baseUrl+ "/api/WorkflowAction/GetWorkflowequipment";
	private readonly _workflowExpertise: string =environment.baseUrl+ "/api/WorkflowAction/GetWorkflowExpertise";
	private readonly _workflowCharge: string =environment.baseUrl+ "/api/WorkflowAction/GetWorkflowCharge";
	private readonly _workflowActionsNewUrl: string =environment.baseUrl+ "/api/WorkflowAction/Get";
	private readonly _saveMaterialList: string =environment.baseUrl+ "/api/WorkflowAction/SaveMaterialList";
	private readonly _saveChargeList: string =environment.baseUrl+ "/api/WorkflowAction/SaveChargeList";
	private readonly _saveEquipment: string =environment.baseUrl+ "/api/WorkflowAction/SaveEquipment";
	private readonly _saveExclusions: string =environment.baseUrl+ "/api/WorkflowAction/SaveExclusions";
	private readonly _saveExpertise: string = environment.baseUrl+"/api/WorkflowAction/SaveExpertise";
	private readonly _addWorkFlow: string =environment.baseUrl+ "/api/WorkflowAction/AddWorkFlow";
	private readonly _addworkFlowactionattributes: string =environment.baseUrl+ "/api/WorkflowAction/AddWorkFlowActionAttributes";
	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
		super(http, configurations, injector);
	}
	getNewWorkFlowEndpoint<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._workflowActionsNewUrl, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewWorkFlowEndpoint(userObject));
			});
	}
	addMatList<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._saveMaterialList, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewWorkFlowEndpoint(userObject));
			});
	}
	addchargelist<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._saveChargeList, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewWorkFlowEndpoint(userObject));
			});
	}
	addEquipmentList<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._saveEquipment, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewWorkFlowEndpoint(userObject));
			});
	}
	addExclusionsList<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._saveExclusions, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewWorkFlowEndpoint(userObject));
			});
	}
	addExpertiseList<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._saveExpertise, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewWorkFlowEndpoint(userObject));
			});
	}
	addWorkflowdetails<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._addWorkFlow, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewWorkFlowEndpoint(userObject));
			});
	}
	addWorkflowactionattributes<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._addworkFlowactionattributes, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewWorkFlowEndpoint(userObject));
			});
	}
	getWorkFlowEndpoint<T>(): Observable<T> {
		return this.http.get<T>(this._workflowUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getWorkFlowEndpoint());
			});
	}
	getAllWorkFlowListEndpoint(data) {
		return this.http.post(this._workflowListUrl, JSON.stringify(data), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getAllWorkFlowListEndpoint(data));
			});
	}
	getWorkFlowActions<T>(): Observable<T> {
		return this.http.get<T>(this._workflowActionsUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getWorkFlowEndpoint());
			});
	}
	getMaterialTypes<T>(): Observable<T> {
		return this.http.get<T>(this._workFlowMaterialTypes, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getWorkFlowEndpoint());
			});
	}
	getworkflowActionAttributesCollection<T>(workflowId: number): Observable<T> {
		let url = `${this._workflowactionAttributes}/${workflowId}`;

		return this.http.get<T>(url, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getWorkFlowEndpoint());
			});
	}
	getworkflowMaterailCollection<T>(): Observable<T> {
		return this.http.get<T>(this._workflowMaterail, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getWorkFlowEndpoint());
			});
	}
	getworkflowEquipmentCollection<T>(): Observable<T> {
		return this.http.get<T>(this._workflowEquipmet, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getWorkFlowEndpoint());
			});
	}
	getPublicationsByItemMasterId(itemMasterId) {
		return this.http.get<any>(`${environment.baseUrl}/api/Publication/publicationlistbyitemmasterId/${itemMasterId}`)
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getChargeListcollection());
		});
	}
	getChargeListcollection<T>(): Observable<T> {
		return this.http.get<T>(this._workflowCharge, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getChargeListcollection());
			});
	}
	getworkflowExpertiseCollection<T>(): Observable<T> {
		return this.http.get<T>(this._workflowExpertise, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getworkflowExpertiseCollection());
			});
	}
	getActionAttributesCollection<T>(): Observable<T> {
		return this.http.get<T>(this._actionAttributes, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getActionAttributesCollection());
			});
	}
	getWorkFlowDataById(workFlowId) { 
		return this.http.get<any>(`${environment.baseUrl}/api/workflow/getWorkFlow/${workFlowId}`)
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getWorkFlowDataById(workFlowId));
		});
	}
	getWorkFlowDataByIdForEdit(workFlowId,masterCompanyId?) {
		return this.http.get<any>(`${environment.baseUrl}/api/workflowAction/GetWorkFlowbyIdforEdit?workFlowId=${workFlowId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :0}`)
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getWorkFlowDataByIdForEdit(workFlowId,masterCompanyId));
		});
	}

	getemployeeExpertiseById(id) {
		return this.http.get<any>(`${environment.baseUrl}/api/workflow/getEmployeeExpertiseById/${id}`)
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getemployeeExpertiseById(id));
		});
	}


	workflowAuditHistoryList(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workflow/GetWorkFlowAuditList?wfwoId=${id}`,this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.workflowAuditHistoryList(id));
        });
    }
	getPublicationsByItemMasterIdDetails(id,idList,mcid){
            return this.http.get<any>(`${this.configurations.baseUrl}/api/Common/AutoCompleteDropdownsPublicationByItemMaster?searchText=&startWith=&ItemMasterId=${id}&count=0&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${mcid !== undefined ? mcid : 1}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getPublicationsByItemMasterIdDetails(id,idList,mcid));
		  });
	}

}