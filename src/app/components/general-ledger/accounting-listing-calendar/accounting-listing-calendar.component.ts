import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { LazyLoadEvent, SortEvent, MenuItem } from 'primeng/api';

import { fadeInOut } from '../../../services/animations';
import { AccountCalenderService } from '../../../services/account-calender/accountcalender.service';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { LegalEntityService } from '../../../services/legalentity.service';
import { AccountListingService } from '../../../services/account-listing/account-listing.service'

import { TableModule, Table } from 'primeng/table';

@Component({
    selector: 'app-accounting-listing-calendar',
    templateUrl: './accounting-listing-calendar.component.html',
    styleUrls: ['./accounting-listing-calendar.component.scss'],
    animations: [fadeInOut]
})
/** AccountingCalendar component*/
export class AccountingListingCalendarComponent implements OnInit {
    totalRecords: number = 0;
    totalPages: number = 0;
    headers = [
        { field: 'name', header: 'Ledger Name' },
        { field: 'description', header: 'Ledger Description' },
        { field: 'fiscalYear', header: 'Fiscal Year' },
        { field: 'startDate', header: 'Start Date' },       
        { field: 'endDate', header: 'End Date' },
        { field: 'period', header: 'Period' },
        { field: 'periodName', header: 'Period Type' }
    ]
    selectedColumns = this.headers;
    data: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    @ViewChild('dt',{static:false})
    private table: Table;
    lazyLoadEventData: any;
    home: any;
    breadcrumbs: MenuItem[];

    filterKeysByValue: object = {};

    constructor(private legalEntityservice: LegalEntityService,
        private route: ActivatedRoute,
        private router: Router,        
        private accountListingService: AccountListingService,
        private calendarService: AccountCalenderService,
        private authService: AuthService,
        private alertService: AlertService) {
        
    }
   
    ngOnInit() {
        this.breadcrumbs = [
            { label: 'Accounting' },
            { label: 'Account Calendar List' },
        ];
    }

    getCalendarData(data: any) {
        
        this.calendarService.getCalendarListData().subscribe(
            datalist => {               
                var calendarResponseData = datalist[0]; 
                var resultArr = []
                for (var i = 0; i < calendarResponseData.length; i++) {
                    var calendarArr = calendarResponseData[i]['calendarListData'] 
                    let startDate = calendarArr[0].fromDate;
                    let endDate = calendarArr[calendarArr.length - 1].toDate;
                    var arraylist = []                   
                    var results = calendarArr.reduce((p, e) => {
                        let data = {}
                        data = {
                            fiscalName: e.fiscalName,
                            fiscalYear: e.fiscalYear,
                            period: e.period,
                            quater: e.quater,
                            fromDate: new Date(e.fromDate),
                            toDate: new Date(e.toDate),
                            periodName: e.periodName,
                            name: e.name,
                            entityId: e.entityId,
                            createdBy: e.createdBy,
                            updatedBy: e.updatedBy,
                            isAdjustPeriod: e.isAdjustPeriod,
                            accountingCalendarId: e.accountingCalendarId
                        }
                        let calendarList = {}
                        calendarList = {
                            "name": e.name,
                            "description": e.description,
                            "legalEntityId": e.legalEntityId,
                            "fiscalYear": e.fiscalYear,
                            "startDate": startDate,
                            "endDate": endDate,
                            "period": e.period,
                            "periodName": e.periodName,
                            "createdBy": e.createdBy,
                            "updatedBy": e.updatedBy,
                            "updatedDate": e.updatedDate,
                            "createdDate": e.createdDate
                        }
                        p[e.fiscalName] = e
                        p[e.fiscalName]['data'] = data
                        p[e.fiscalName]['calendarList'] = calendarList
                        return p;
                    }, {});
                    var dataList = []
                    Object.keys(results).map(function (key, index) {
                        arraylist.push(results[key]['data']);
                        dataList['calendarList'] = results[key]['calendarList'];
                    });
                    dataList['calendarList']['data'] = arraylist
                    resultArr[i] = dataList	
                }
               
                var calendarData = resultArr.map((item) => {
                    return item['calendarList']
                })
                if (data && data.sortField) {
                    if (data.sortOrder == -1)
                        calendarData = this.sortCalendarData(calendarData, data.sortField, false);
                }
                this.data = calendarData;                
                if (calendarData.length > 0) {
                    this.totalRecords = calendarData.filter(items => items).length;
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                }
            },
            error => {
                console.log('error in getting information')
            }
        );
    }

    sortCalendarData(array, key, descendingOrder = true) {        
        if (key == 'fiscalYear' || key == 'period') {
            return this.calendarService.sortBy(array, {
                prop: key,
                desc: descendingOrder
            });
        } else if (key == 'startDate' || key == 'endDate') {
            return this.calendarService.sortBy(array, {
                prop: key,
                desc: descendingOrder,
                parser: function (item) {
                    return new Date(item);
                }
            });
        } else {
            return this.calendarService.sortBy(array, {
                prop: key,
                desc: descendingOrder,
                parser: function (item) {
                    return item.toLowerCase();
                }
            });
        }
    }

    loadCalendarList(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.getCalendarData(event)
        console.log(event);
    }

    editCalendarData(rowData) {
        //var selectedRow = rowData['data']
        this.calendarService.emitCalendarDetails(rowData);        
        this.router.navigate(['/generalledgermodule/generalledgerpage/app-accounting-calendar']);
        //const params = JSON.stringify(data)
        //this.router.navigate(['/generalledgermodule/generalledgerpage/app-accounting-calendar'], { queryParams: { calendarSelectedData: params}, skipLocationChange: true, replaceUrl: false });        
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    ngOnDestroy() {
        
    }

    viewSelectedRow(rowData) {}

    getAuditHistoryById(rowData) {}
}