import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, SortEvent, MenuItem } from 'primeng/api';

import { fadeInOut } from '../../../services/animations';
import { AccountCalenderService } from '../../../services/account-calender/accountcalender.service';
import { AuthService } from '../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { LegalEntityService } from '../../../services/legalentity.service';
import { AccountListingService } from '../../../services/account-listing/account-listing.service'

@Component({
    selector: 'app-open-close-ledger',
    templateUrl: './open-close-ledger.component.html',    
    animations: [fadeInOut]
})

export class OpenCloseLedgerComponent implements OnInit {

    currentCalendarObj: any = []
    calendarArray: any[] = [];
    showManual: boolean = false;
    selectedPeriod: any;
    period;
    showCheckBox: boolean;
    isBoolean: boolean;
    calendarStatus: any[]
    ledgerNameObjectData: any;
    ledgerNameObject: any;
    showTable: boolean;
    calendarContentDisabled: boolean = true;
    home: any;
    breadcrumbs: MenuItem[];

    constructor(private legalEntityservice: LegalEntityService, private route: ActivatedRoute, private router: Router,
        private accountListingService: AccountListingService, private calendarService: AccountCalenderService, private authService: AuthService, private alertService: AlertService) {
        //this.currentCalendarObj.fromDate = new Date('2019-01-01');
    }

    ngOnInit() {
        this.selectedPeriod = 12;
        this.calendarStatus = ['Current', 'Open', 'Future JE', 'Closed', 'Never Opened']
        this.getLedgerObject()

        this.breadcrumbs = [
            { label: 'Accounting' },
            { label: 'Open / Close Ledger' },
        ];
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    loadLedgerNames(event) {
        if (this.ledgerNameObjectData) {
            this.ledgerNameObject = [...this.ledgerNameObjectData.filter(x => {                
                return x.name.toLowerCase().includes(event.query.toLowerCase())
            })]
        }
    }

    getLedgerObject() {
        this.accountListingService.getLedgerData().subscribe(
            datalist => {
                console.log('getLedgerData :', JSON.stringify(datalist))
                let obj = {}
                let collection = []
                const x = datalist.filter((o, index) => {
                    if (datalist[index]['ledgerName']) {
                        obj = {
                            id: datalist[index]['ledgerName'],
                            name: datalist[index]['ledgerName']
                        }
                        collection.push(obj)
                    }                    
                })                
                this.ledgerNameObjectData = collection
            })
    }

    showCalendar() {      
        if (!this.currentCalendarObj.fiscalYear && !this.currentCalendarObj.ledgername) {
            return;
        }
        var year = this.currentCalendarObj.fiscalYear;        
        this.currentCalendarObj.fromDate = new Date('01-01' + '-' + year);
        this.currentCalendarObj.toDate = new Date('12-31' + '-' + year);
        this.calendarArray = [];
        var date2 = new Date(this.currentCalendarObj.fromDate);
        var date1 = new Date(this.currentCalendarObj.toDate);
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (dayDifference == 365 || dayDifference == 364) {    
            this.showTable = true;
            this.calendarArray = [];
            var date = new Date(this.currentCalendarObj.fromDate);
            var month = date.getMonth();
            if (this.selectedPeriod == 12) {
                this.period = 1;
                let setBool;
                for (let i = 0; i < this.selectedPeriod; i++) {
                    this.calendarArray.push(this.loaddefualtObj(month, setBool));
                    month++;
                    if (month == 12) {
                        month = 0;
                        setBool = true;
                    }
                }

            }
            if (this.selectedPeriod == 13) {
                this.period = 1;
                let setBool;
                this.showCheckBox = true;
                for (let i = 0; i < this.selectedPeriod; i++) {
                    this.calendarArray.push(this.loaddefualtObj(month, setBool));
                    month++;
                    if (month == 12) {
                        month = 0;
                        setBool = true;
                    }
                }
            }
            if (this.selectedPeriod == 16) {
                this.period = 1;
                this.showCheckBox = true;
                let setBool;
                for (let i = 0; i < this.selectedPeriod; i++) {
                    if (this.calendarArray.length == 3) {
                        month = month - 1;
                    }
                    if (this.calendarArray.length == 7) {
                        month = month - 1;
                    }
                    if (this.calendarArray.length == 11) {
                        month = month - 1;
                    }
                    this.calendarArray.push(this.loaddefualtObj(month, setBool));
                    month++;
                    if (month == 12) {
                        month = 0;
                        setBool = true;
                    }

                }
            }
            if (this.selectedPeriod == 'Manual') {
                this.period = 1;
                let setBool = false;
                this.calendarArray.push(this.loaddefualtObj(month, setBool));
            }           
        }
        else {
            this.alertService.showMessage("Please select valid start date and end date");
        }        
        
    }

    setAdjustingPeriod(selectedObj, selectedIndex) {
        let index = selectedIndex - 1;
        selectedObj.toDate = this.calendarArray[index].toDate;
        selectedObj.fromDate = this.calendarArray[index].toDate;
        var months = ["Select", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "APJ-PD"];
        if (selectedObj.isAdjustPeriod == true) {
            selectedObj.fiscalName = months[13];
            selectedObj.periodName = selectedObj.fiscalName + ' - ' + this.currentCalendarObj.fiscalYear;
            this.calendarArray[selectedIndex].isAdjustPeriod = selectedObj.isAdjustPeriod;
        }
        else {
            selectedObj.fiscalName = months[0];
            selectedObj.periodName = "";
            this.calendarArray[selectedIndex].isAdjustPeriod = false;
        }

    }

    loaddefualtObj(selectedMonth, bool) {        
        if (selectedMonth == 0 && bool == true) {
            this.isBoolean = true;
        }
        if (this.selectedPeriod == '12' || this.selectedPeriod == '13') {
            this.showManual = false;
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            if (this.period <= 3) {
                this.currentCalendarObj.quarter = 1;
            }
            if (this.period >= 4 && this.period <= 6) {
                this.currentCalendarObj.quarter = 2;
            }
            if (this.period >= 7 && this.period <= 9) {
                this.currentCalendarObj.quarter = 3;
            }
            if (this.period >= 10 && this.period <= 13) {
                this.currentCalendarObj.quarter = 4;
            }
            if (this.calendarArray.length <= 11) {
                let month = selectedMonth + 1;
                let status = this.setCalendarStatus(month, this.currentCalendarObj.fiscalYear);
                if (status != 'Closed') {
                    this.calendarContentDisabled = false
                }
                
                if (month <= 9) {
                    if (this.isBoolean) {
                        var fiscalYear = Number(this.currentCalendarObj.fiscalYear) + 1;
                    }
                    else {
                        var fiscalYear = Number(this.currentCalendarObj.fiscalYear);
                    }
                    //  var fromdate = new Date(fiscalYear + '-' + '0' + month + '-' + '01');
                    var fromdate = new Date('0' + month + '-' + '01' + '-' + fiscalYear);
                    var date = new Date(fromdate);
                    if (this.isBoolean) {
                        var year = date.getFullYear() + 1;
                    }
                    else {
                        var year = date.getFullYear();
                    }
                    var year = date.getFullYear();
                    var lastmonth = date.getMonth();
                    //var lastday = new Date(year, lastmonth + 1, 0).getDate();
                    //var toDate = new Date(year + '-' + '0' + month + '-' + lastday);

                    var lastday = new Date(year, lastmonth + 1, 0).getDate();
                    var toDate = new Date('0' + month + '-' + lastday + '-' + year);

                }
                else {
                    let status = this.setCalendarStatus(month, this.currentCalendarObj.fiscalYear);
                    //   var fromdate = new Date(this.currentCalendarObj.fiscalYear + '-' + month + '-' + '01');
                    var fromdate = new Date(month + '-' + '01' + '-' + this.currentCalendarObj.fiscalYear);
                    var date = new Date(fromdate);
                    var year = date.getFullYear();
                    var lastmonth = date.getMonth();
                    //var lastday = new Date(year, lastmonth + 1, 0).getDate();
                    //var toDate = new Date(year + '-' + month + '-' + lastday);

                    var lastday = new Date(year, lastmonth + 1, 0).getDate();
                    var toDate = new Date(month + '-' + lastday + '-' + year);
                }

                let defualtCalendarObj = {
                    status: status,
                    fiscalName: months[selectedMonth],
                    fiscalYear: this.currentCalendarObj.fiscalYear,
                    period: this.period,
                    quater: this.currentCalendarObj.quarter,
                    fromDate: fromdate,
                    toDate: toDate,
                    periodName: months[selectedMonth] + ' ' + this.currentCalendarObj.fiscalYear,
                    name: this.currentCalendarObj.ledgername.name,
                    entityId: this.currentCalendarObj.entityId,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    isAdjustPeriod: false,
                    legalEntityId: this.currentCalendarObj.legalEntityId
                }
                this.period++;
                return defualtCalendarObj;
            }
            else {
                let month = selectedMonth + 1;
                
                if (month <= 9) {

                    //   var fromdate = new Date(this.currentCalendarObj.fiscalYear + '-' + '0' + month + '-' + '01');
                    var fromdate = new Date('0' + month + '-' + '01' + '-' + this.currentCalendarObj.fiscalYear);
                    var date = new Date(fromdate);
                    var year = date.getFullYear();
                    var lastmonth = date.getMonth();
                    //var lastday = new Date(year, lastmonth + 1, 0).getDate();
                    //var toDate = new Date(year + '-' + '0' + month + '-' + lastday);
                    var lastday = new Date(year, lastmonth + 1, 0).getDate();
                    var toDate = new Date('0' + month + '-' + lastday + '-' + year);

                }
                else {
                    // var fromdate = new Date(this.currentCalendarObj.fiscalYear + '-' + month + '-' + '01');
                    var fromdate = new Date(month + '-' + '01' + '-' + this.currentCalendarObj.fiscalYear);
                    var date = new Date(fromdate);
                    var year = date.getFullYear();
                    var lastmonth = date.getMonth();
                    //var lastday = new Date(year, lastmonth + 1, 0).getDate();
                    //var toDate = new Date(year + '-' + month + '-' + lastday);

                    var lastday = new Date(year, lastmonth + 1, 0).getDate();
                    var toDate = new Date(month + '-' + lastday + '-' + year);
                }

                let defualtCalendarObj = {

                    fiscalName: 'ADJ - PD ',
                    fiscalYear: this.currentCalendarObj.fiscalYear,
                    period: this.period,
                    quater: this.currentCalendarObj.quarter,
                    fromDate: this.calendarArray[11].toDate,
                    toDate: this.calendarArray[11].toDate,
                    periodName: 'ADJ - PD -' + ' ' + this.currentCalendarObj.fiscalYear,
                    name: this.currentCalendarObj.ledgername.name,
                    entityId: this.currentCalendarObj.entityId,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    adjusting: 'yes',
                    isAdjustPeriod: true,
                    legalEntityId: this.currentCalendarObj.legalEntityId
                }
                this.period++;
                return defualtCalendarObj;
            }
        }
        else if (this.selectedPeriod == '16') {

            this.showManual = false;
            var monthData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            if (this.period <= 4) {
                this.currentCalendarObj.quarter = 1;
            }
            if (this.period >= 5 && this.period <= 8) {
                this.currentCalendarObj.quarter = 2;
            }
            if (this.period >= 9 && this.period <= 12) {
                this.currentCalendarObj.quarter = 3;
            }
            if (this.period >= 13 && this.period <= 16) {
                this.currentCalendarObj.quarter = 4;
            }
            let month = selectedMonth + 1;
            if (month <= 9) {
                if (this.isBoolean) {
                    var fiscalYear = Number(this.currentCalendarObj.fiscalYear) + 1;
                }
                else {
                    var fiscalYear = Number(this.currentCalendarObj.fiscalYear);
                }
                // var fromdate = new Date(fiscalYear + '-' + '0' + month + '-' + '01');
                var fromdate = new Date('0' + month + '-' + '01' + '-' + fiscalYear);
                var date = new Date(fromdate);
                if (this.isBoolean) {
                    var year = date.getFullYear() + 1;
                }
                else {
                    var year = date.getFullYear();
                }
                var year = date.getFullYear();
                var lastmonth = date.getMonth();
                //var lastday = new Date(year, lastmonth + 1, 0).getDate();
                //var toDate = new Date(year + '-' + '0' + month + '-' + lastday);
                var lastday = new Date(year, lastmonth + 1, 0).getDate();
                var toDate = new Date('0' + month + '-' + lastday + '-' + year);


            }
            else {
                // var fromdate = new Date(this.currentCalendarObj.fiscalYear + '-' + month + '-' + '01');
                var fromdate = new Date(month + '-' + '01' + '-' + this.currentCalendarObj.fiscalYear);
                var date = new Date(fromdate);
                var year = date.getFullYear();
                var lastmonth = date.getMonth();
                //var lastday = new Date(year, lastmonth + 1, 0).getDate();
                //var toDate = new Date(year + '-' + month + '-' + lastday);

                var lastday = new Date(year, lastmonth + 1, 0).getDate();
                var toDate = new Date(month + '-' + lastday + '-' + year);
            }

            if (this.calendarArray.length == 3) {
                var fiscalName = 'ADJ - PD -' + this.calendarArray[0].fiscalName + '-' + this.calendarArray[2].fiscalName;
                let defualtCalendarObj = {
                    fiscalName: fiscalName,
                    fiscalYear: this.currentCalendarObj.fiscalYear,
                    period: this.period,
                    quater: this.currentCalendarObj.quarter,
                    fromDate: toDate,
                    toDate: toDate,
                    periodName: fiscalName + ' - ' + this.currentCalendarObj.fiscalYear,
                    name: this.currentCalendarObj.ledgername.name,
                    entityId: this.currentCalendarObj.entityId,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    adjusting: 'yes',
                    isAdjustPeriod: true,
                    legalEntityId: this.currentCalendarObj.legalEntityId

                }
                this.period++;

                return defualtCalendarObj;
            }
            else if (this.calendarArray.length == 7) {
                var fiscalName = 'ADJ - PD -' + this.calendarArray[4].fiscalName + '-' + this.calendarArray[6].fiscalName;
                let defualtCalendarObj = {
                    fiscalName: fiscalName,
                    fiscalYear: this.currentCalendarObj.fiscalYear,
                    period: this.period,
                    quater: this.currentCalendarObj.quarter,
                    fromDate: toDate,
                    toDate: toDate,
                    periodName: fiscalName + ' - ' + this.currentCalendarObj.fiscalYear,
                    name: this.currentCalendarObj.ledgername.name,
                    entityId: this.currentCalendarObj.entityId,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    adjusting: 'yes',
                    isAdjustPeriod: true,
                    legalEntityId: this.currentCalendarObj.legalEntityId

                }
                this.period++;
                return defualtCalendarObj;
            }
            else if (this.calendarArray.length == 11) {
                var fiscalName = 'ADJ - PD -' + this.calendarArray[8].fiscalName + '-' + this.calendarArray[10].fiscalName;
                let defualtCalendarObj = {
                    fiscalName: fiscalName,
                    fiscalYear: this.currentCalendarObj.fiscalYear,
                    period: this.period,
                    quater: this.currentCalendarObj.quarter,
                    fromDate: toDate,
                    toDate: toDate,
                    periodName: fiscalName + ' - ' + this.currentCalendarObj.fiscalYear,
                    name: this.currentCalendarObj.ledgername.name,
                    legalEntityId: this.currentCalendarObj.legalEntityId,
                    description: this.currentCalendarObj.description,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    adjusting: 'yes',
                    isAdjustPeriod: true


                }
                this.period++;
                return defualtCalendarObj;
            }
            else if (this.calendarArray.length == 15) {
                var fiscalName = 'ADJ - PD -' + this.calendarArray[12].fiscalName + '-' + this.calendarArray[14].fiscalName;
                let defualtCalendarObj = {
                    fiscalName: fiscalName,
                    fiscalYear: this.currentCalendarObj.fiscalYear,
                    period: this.period,
                    quater: this.currentCalendarObj.quarter,
                    fromDate: this.calendarArray[14].toDate,
                    toDate: this.calendarArray[14].toDate,
                    periodName: fiscalName + ' - ' + this.currentCalendarObj.fiscalYear,
                    name: this.currentCalendarObj.ledgername.name,
                    entityId: this.currentCalendarObj.entityId,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    adjusting: 'yes',
                    isAdjustPeriod: true,
                    legalEntityId: this.currentCalendarObj.legalEntityId

                }
                this.period++;
                return defualtCalendarObj;
            }
            else {
                let defualtCalendarObj = {
                    fiscalName: monthData[selectedMonth],
                    fiscalYear: this.currentCalendarObj.fiscalYear,
                    period: this.period,
                    quater: this.currentCalendarObj.quarter,
                    fromDate: fromdate,
                    toDate: toDate,
                    periodName: monthData[selectedMonth] + ' - ' + this.currentCalendarObj.fiscalYear,
                    name: this.currentCalendarObj.ledgername.name,
                    entityId: this.currentCalendarObj.entityId,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    isAdjustPeriod: false,
                    legalEntityId: this.currentCalendarObj.legalEntityId

                }
                this.period++;
                return defualtCalendarObj;
            }
        }
        else {

            this.showManual = true;
            var months = ["Select", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "APJ-PD"];
            var qtr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            let defualtCalendarObj = {
                fiscalNameData: months,
                fiscalYear: this.currentCalendarObj.fiscalYear,
                period: this.period,
                quaterData: qtr,
                fromDate: fromdate,
                toDate: toDate,
                periodName: '',
                name: this.currentCalendarObj.ledgername.name,
                entityId: this.currentCalendarObj.entityId,
                createdBy: this.userName,
                updatedBy: this.userName,
                isAdjustPeriod: false,
                legalEntityId: this.currentCalendarObj.legalEntityId

            }

            return defualtCalendarObj;
        }       
    }

    setCalendarStatus(month, year) {        
        var date = new Date();
        var currentYear = date.getFullYear();
        var currentMonth = date.getMonth() + 1;
        
        if (year == currentYear) {
            if (currentMonth < month) {
                return 'Never Opened'
            }

            if (currentMonth == month) {
                return 'Current'
            }

            if (currentMonth > month) {
                return 'Closed'
            }
        }
        if (year < currentYear) {
            return 'Closed'
        }

        if (year > currentYear) {
            return 'Future JE'
        }
    }

    saveCalendar() {

        let date = new Date(this.currentCalendarObj.fromDate);
        let year = date.getFullYear();
        let addDetails = false;
        let showDiff = true;
        var name;
        //this.loadCompaniesData();
        if (this.calendarArray && this.calendarArray.length > 0) {
            let index = 0;

            for (let i = 0; i < this.calendarArray.length; i++) {
                index = i + 1;
                if (this.calendarArray[i].adjusting && this.calendarArray[i].adjusting == 'yes') {

                } else {
                    if (this.calendarArray.length == index) {
                        break;
                    }
                    else {

                        var date2 = new Date(this.calendarArray[i].toDate);
                        let newDate = this.calendarArray[index].fromDate;
                        var date1 = new Date(newDate);
                        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                        var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        if (dayDifference > 1) {
                            this.alertService.showMessage("Please Enter valid dates");
                            showDiff = false;
                            break;
                        }
                    }

                }
                name = this.calendarArray[i].name;
            }
        }
    }

    addPeriod() {}

    changeStatus(obj, objStatus) {}

    setDate(obj, row_no) {}

    addPeriodName(obj, fiscalName) {}

    deleteRow(row_no) {}
}