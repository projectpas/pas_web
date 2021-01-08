
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

import {catchError} from 'rxjs/operators';
@Injectable()
export class MasterCompanyEndpoint extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/MasterCompany/Get";
    // private readonly _workflowActionsNewUrl: string = "/api/WorkflowAction/Get";
    private readonly _actionsUrlNew: string = "/api/MasterCompany/actions";
    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getMasterCompanyEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.actionsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getMasterCompanyEndpoint());
            }));
    }

}