
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { AccountPaybleARSubLedgerEndPointService } from './open-close-ar-subledger-endpoint.service';



@Injectable()
export class AccountPaybleARSubLedgerService {


    constructor(private calendarEndpointService: AccountPaybleARSubLedgerEndPointService) {
    }


    add(calendarObj: any) {
        return this.calendarEndpointService.addCalendar<any>(calendarObj);
    }


}