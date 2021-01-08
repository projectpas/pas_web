
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { AccountPaybleAPSubLedgerEndPointService } from './open-close-ap-subledger-endpoint.service';



@Injectable()
export class AccountPaybleAPSubLedgerService {


    constructor(private calendarEndpointService: AccountPaybleAPSubLedgerEndPointService) {
    }


    add(calendarObj: any) {
        return this.calendarEndpointService.addCalendar<any>(calendarObj);
    }


}