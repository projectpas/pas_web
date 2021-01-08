
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



import { AccountPaybleAPSubLedgerEndPointService } from './open-close-ap-subledger-endpoint.service';



@Injectable()
export class AccountPaybleAPSubLedgerService {


    constructor(private calendarEndpointService: AccountPaybleAPSubLedgerEndPointService) {
    }


    add(calendarObj: any) {
        return this.calendarEndpointService.addCalendar<any>(calendarObj);
    }


}