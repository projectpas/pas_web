import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { GLAccountCategory } from '../../models/gl-account-category.model';
import {catchError} from 'rxjs/operators';
@Injectable()
export class GLAccountCategoryEndpointService extends EndpointFactory {

    private readonly item: string = "GLAccountCategory";
    private readonly getAllItemsEndPointTemplate: string = "getAll";
    private readonly getItemByIdEndPointTemplate: string = "getById";
    private readonly addItemEndPointTemplate: string = "add";
    private readonly _glaccountcategoryUrlNew: string = "/api/GLAccountCategory/update";
    private readonly updateItemEndPointTemplate: string = "update";
    private readonly removeItemByIdEndPointTemplate: string = "removeById";
    private readonly getItemAuditByIdEndPointTemplate: string = "audit";
    private readonly bulkUploadEndPointTemplate: string = "bulkUpload";


    get getAll() { return `${this.configurations.baseUrl}/api/${this.item}/${this.getAllItemsEndPointTemplate}`; }
    get getById() { return `${this.configurations.baseUrl}/api/${this.item}/${this.getItemByIdEndPointTemplate}`; }
    get add() { return `${this.configurations.baseUrl}/api/${this.item}/${this.addItemEndPointTemplate}`; }
  //  get update() { return `${this.configurations.baseUrl}/api/${this.item}/${this.updateItemEndPointTemplate}`; }
    get removeById() { return `${this.configurations.baseUrl}/api/${this.item}/${this.removeItemByIdEndPointTemplate}`; }
    get getAudit() { return `${this.configurations.baseUrl}/api/${this.item}/${this.getItemAuditByIdEndPointTemplate}`; }
    get bulkUpload() { return `${this.configurations.baseUrl}/api/${this.item}/${this.bulkUploadEndPointTemplate}`; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    addItem<T>(userObject: any): Observable<T> {
        let endpointUrl = this.add;
        return this.http.post<any>(endpointUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addItem(userObject));
            }));
    }

    bulkItemUpload(file: any): Observable<object> {
        return this.http.post(this.bulkUpload, file);
    }

    getAllItems<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllItems());
            }));
    }

    getItemAudit<T>(id: number): Observable<T> {
        let endpointUrl = `${this.getAudit}/${id}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getItemAudit(id));
            }));
    }

    getItemById<T>(id: number): Observable<T> {
        let endpointUrl = `${this.getById}/${id}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getItemById(id));
            }));
    }

    removeItemById<T>(id: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${id}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.removeItemById(id));
            }));
    }

    updateItem<T>(action: any, glAccountCategoryId: number): Observable<T> {
      //  let endpointUrl = this.update;
        let endpointUrl = `${this._glaccountcategoryUrlNew}/${glAccountCategoryId}`
        return this.http.put<any>(endpointUrl, JSON.stringify(action), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateItem(action, glAccountCategoryId));
            }));
    }
}
