﻿import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';

@Injectable()
export class AccountCalenderEndpointService extends EndpointFactory {

    
    private readonly addURL: string = "/api/AccountingCalendar/addCalendarData";
    private readonly getAllURL: string = "/api/AccountingCalendar/getAllCalendarListData";
    //private readonly getCalendarListURL: string = "/dist/assets/data/accountlisting.json";
    private readonly getCalendarListURL: string = "/api/AccountingCalendar/getAllCalendarListData";
    
    get add() { return this.configurations.baseUrl + this.addURL; }
    get getAll() { return this.configurations.baseUrl + this.getAllURL; }
    get getCalendarList() { return this.configurations.baseUrl + this.getCalendarListURL; }
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

   
    addCalendar<T>(calendarObj: any): Observable<T> {
        let endpointUrl = this.add;

        return this.http.post<T>(endpointUrl, JSON.stringify(calendarObj), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.addCalendar(calendarObj));
            });
    }

    getCalendarData<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getCalendarData());
            });
    }

    getCalendarListData<T>(): Observable<T> {
        let endpointUrl = this.getCalendarList;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getCalendarListData());
            });
    }

}