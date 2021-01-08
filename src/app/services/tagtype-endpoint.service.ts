
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class TagTypeEndpointService extends EndpointFactory {


	private readonly _tagTypeUrl: string = "/api/TagType/Get";
    private readonly _tagTypeNewUrl: string = "/api/TagType/add";
    private readonly _tagTypeEditUrl: string = "/api/TagType/update";
    private readonly _deleteTagType: string = "/api/TagType/remove";

	get tagTypeUrl() { return this.configurations.baseUrl + this._tagTypeUrl; }

	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

		super(http, configurations, injector);
	}

	getTagTypeEndpoint<T>(): Observable<T> {

		return this.http.get<T>(this.tagTypeUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getTagTypeEndpoint());
			});
	}

	addTagTypeEndpoint<T>(tagType: any): Observable<T> {

        return this.http.post<T>(this._tagTypeNewUrl, JSON.stringify(tagType), this.getRequestHeaders())
			.catch(error => {
                return this.handleError(error, () => this.addTagTypeEndpoint(tagType));
			});
	}

	updateTagTypeEndpoint<T>(tagType: any): Observable<T> {
		let endpointUrl = `${this._tagTypeEditUrl}`;

        return this.http.post<T>(endpointUrl, JSON.stringify(tagType), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.updateTagTypeEndpoint(tagType));
            });
	}


	removeTagTypeEndpoint<T>(tagTypeId: number): Observable<T> {
        let endpointUrl = `${this._deleteTagType}/${tagTypeId}`;

		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
                return this.handleError(error, () => this.removeTagTypeEndpoint(tagTypeId));
			});
	}

}