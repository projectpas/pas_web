
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class CrmEndpoint extends EndpointFactory {

    private readonly _dealNamesUrl: string = "/api/crm/deal/dealNamesList";
    private readonly _actionCrmUrlAll: string = "/api/crm/list";
    private readonly _actionDealUrlAll: string = "/api/crm/deal/list";
    private readonly _actionLeadUrlAll: string = "/api/crm/Lead/list";
    private readonly _actionOpportunityUrlAll: string = "/api/crm/opportunity/list";
    private readonly _crmUrlNew: string = "/api/crm/create";
    private readonly _crmUrlUpdate: string = "/api/crm/update";

    private readonly _dealUrlNew: string = "/api/crm/deal/create";
    private readonly _dealUrlUpdate: string = "/api/crm/deal/update";
    
    private readonly _leadUrlNew: string = "/api/crm/lead/create";
    private readonly _leadUrlUpdate: string = "/api/crm/lead/update";

    private readonly _opportunityUrlNew: string = "/api/crm/opportunity/create";
    private readonly _opportunityUrlUpdate: string = "/api/crm/opportunity/update";


    get getDealNamesUrl() { return this.configurations.baseUrl + this._dealNamesUrl; }
   

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

  
    getAllCrmList(data) {
        return this.http.post(this._actionCrmUrlAll, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllCrmList(data));
            });
    }
   
    getAllDealList(data) {
        return this.http.post(this._actionDealUrlAll, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllDealList(data));
            });
    }
    getAllLeadList(data) {
        return this.http.post(this._actionLeadUrlAll, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllLeadList(data));
            });
    }

    getAllOpportunityList(data){
        return this.http.post(this._actionOpportunityUrlAll, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllOpportunityList(data));
            });
    }

    


    getNewCrmEndpoint<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._crmUrlNew, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}
   
    getUpdateCrmEndpoint<T>(roleObject: any, csrId: number): Observable<T> {
        let endpointUrl = `${this._crmUrlUpdate}/${roleObject.csrId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateCrmEndpoint(roleObject, csrId));
            });

    }

   
    getNewDealEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._dealUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewDealEndpoint(userObject));
            });
    }
   
    getUpdateDealEndpoint<T>(roleObject: any, customerId: number): Observable<T> {
        let endpointUrl = `${this._dealUrlUpdate}/${roleObject.customerId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateDealEndpoint(roleObject, customerId));
            });

    }

    getNewLeadEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._leadUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewLeadEndpoint(userObject));
            });
    }
   
    getUpdateLeadEndpoint<T>(roleObject: any, customerId: number): Observable<T> {
        let endpointUrl = `${this._leadUrlUpdate}/${roleObject.customerId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateLeadEndpoint(roleObject, customerId));
            });

    }

    getNewOpportunityEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._opportunityUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewOpportunityEndpoint(userObject));
            });
    }
   
    getUpdateOpportunityEndpoint<T>(roleObject: any, customerId: number): Observable<T> {
        let endpointUrl = `${this._opportunityUrlUpdate}/${roleObject.customerId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateOpportunityEndpoint(roleObject, customerId));
            });

    }


    getDealNames<T>(): Observable<T> {

        return this.http.get<T>(this.getDealNamesUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDealNames());
            });
    }

}


