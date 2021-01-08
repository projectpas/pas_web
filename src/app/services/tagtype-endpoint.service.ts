
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
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

		return this.http.get<any>(this.tagTypeUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getTagTypeEndpoint());
			}));
	}

	addTagTypeEndpoint<T>(tagType: any): Observable<T> {

        return this.http.post<any>(this._tagTypeNewUrl, JSON.stringify(tagType), this.getRequestHeaders())
			.pipe(catchError(error => {
                return this.handleError(error, () => this.addTagTypeEndpoint(tagType));
			}));
	}

	updateTagTypeEndpoint<T>(tagType: any): Observable<T> {
		let endpointUrl = `${this._tagTypeEditUrl}`;

        return this.http.post<any>(endpointUrl, JSON.stringify(tagType), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateTagTypeEndpoint(tagType));
            }));
	}


	removeTagTypeEndpoint<T>(tagTypeId: number): Observable<T> {
        let endpointUrl = `${this._deleteTagType}/${tagTypeId}`;

		return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
                return this.handleError(error, () => this.removeTagTypeEndpoint(tagTypeId));
			}));
	}

}