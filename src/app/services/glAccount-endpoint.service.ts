import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class GLAccountEndpoint extends EndpointFactory {

    private readonly _glAcountLiteUrl: string = "/api/glaccount/basic";

    get glAccountLiteUrl() { return this.configurations.baseUrl + this._glAcountLiteUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getGLAccountBasicList<T>(): Observable<T> {
        return this.http.get<T>(this._glAcountLiteUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getGLAccountBasicList());
            });
    }

    
}