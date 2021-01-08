import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class GLAccountEndpoint extends EndpointFactory {

    private readonly _glAcountLiteUrl: string = "/api/glaccount/basic";

    get glAccountLiteUrl() { return this.configurations.baseUrl + this._glAcountLiteUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getGLAccountBasicList<T>(): Observable<T> {
        return this.http.get<any>(this._glAcountLiteUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getGLAccountBasicList());
            }));
    }

    
}