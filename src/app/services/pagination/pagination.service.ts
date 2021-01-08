import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject} from 'rxjs';




@Injectable()
export class PaginationService
{
   
    constructor(
        private router: Router,
        private http: HttpClient) { }

    getMessages(Data: any)
    {
        return Data;
    }
}