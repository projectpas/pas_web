
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



import { AccountPaybleARSubLedgerEndPointService } from './open-close-ar-subledger-endpoint.service';



@Injectable()
export class AccountPaybleARSubLedgerService {


    constructor(private calendarEndpointService: AccountPaybleARSubLedgerEndPointService) {
    }


    add(calendarObj: any) {
        return this.calendarEndpointService.addCalendar<any>(calendarObj);
    }


}