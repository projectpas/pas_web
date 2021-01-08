import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

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