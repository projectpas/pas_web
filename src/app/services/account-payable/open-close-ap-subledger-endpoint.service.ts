import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class AccountPaybleAPSubLedgerEndPointService extends EndpointFactory {


    private readonly addURL: string = "/api/AccountingCalendar/addCalendarData";

    get add() { return this.configurations.baseUrl + this.addURL; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }


    addCalendar<T>(calendarObj: any): Observable<T> {
        let endpointUrl = this.add;
        return this.http.post<any>(endpointUrl, JSON.stringify(calendarObj), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addCalendar(calendarObj));
            }));
    }



}