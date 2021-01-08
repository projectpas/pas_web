
import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { AccountCalenderEndpointService } from './accountcalender-endpoint.service';



@Injectable()
export class AccountCalenderService {
    
    public editedDetailsObject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
   
    constructor(private calendarEndpointService: AccountCalenderEndpointService) {
    }

   
    add(calendarObj: any) {
        return this.calendarEndpointService.addCalendar<any>(calendarObj);
    }

    getAll() {
        return Observable.forkJoin(
            this.calendarEndpointService.getCalendarData<any[]>());
    }

    getCalendarListData() {
        return Observable.forkJoin(
            this.calendarEndpointService.getCalendarListData<any[]>());
    }

    emitCalendarDetails(obj: any) {
        this.editedDetailsObject.next(obj);       
    }

    sortBy = (function () {
        var toString = Object.prototype.toString,
            parse = function (x) { return x; },
            getItem = function (x) {
                var isObject = x != null && typeof x === "object";
                var isProp = isObject && this.prop in x;
                return this.parser(isProp ? x[this.prop] : x);
            };

        return function sortby(array, cfg) {
            if (!(array instanceof Array && array.length)) return [];
            if (toString.call(cfg) !== "[object Object]") cfg = {};
            if (typeof cfg.parser !== "function") cfg.parser = parse;
            cfg.desc = !!cfg.desc ? -1 : 1;
            return array.sort(function (a, b) {
                a = getItem.call(cfg, a);
                b = getItem.call(cfg, b);
                return cfg.desc * (a < b ? -1 : +(a > b));
            });
        };
    }());
}