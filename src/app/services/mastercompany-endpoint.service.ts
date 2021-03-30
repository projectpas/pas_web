
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

import { environment } from 'src/environments/environment';
@Injectable()
export class MasterCompanyEndpoint extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/MasterCompany/Get";
    // private readonly _workflowActionsNewUrl: string = "/api/WorkflowAction/Get";
    private readonly _actionsUrlNew: string = "/api/MasterCompany/actions";
    get actionsUrl() { return environment.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getMasterCompanyEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.actionsUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getMasterCompanyEndpoint());
            });
    }

}