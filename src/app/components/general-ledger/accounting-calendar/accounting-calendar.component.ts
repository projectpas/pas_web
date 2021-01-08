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
    selector: 'app-accounting-calendar',
    templateUrl: './accounting-calendar.component.html',
    styleUrls: ['./accounting-calendar.component.scss'],
    animations: [fadeInOut]
})
/** AccountingCalendar component*/
export class AccountingCalendarComponent implements OnInit {
    /** AccountingCalendar ctor */
    calendarArray: any[] = [];
    currentCalendarObj: any = {};
    selectedPeriod: any;
    showTable: boolean;
    showCheckBox: boolean = false;
    showManual: boolean = false;
    period: number = 1;
    selectedName: any;
    display: boolean = false; //prime ng Model
    showCalendarMonths: boolean;
    showFiscal: boolean;
    showDefualt: boolean = true;
    completeCalendarData: any[] = [];
    isBoolean: boolean = false;
    ledgerNameObjectData: any[];
    ledgerNameObject: any[];
    public minDate: any;
    entitiesObj: any[] = [];
    routeData: any;
    editedData: any;
    editedData1: any;
    editCalendarPage: boolean = false;
    displayShowButton: boolean = true;
    pageTitle: String = "Create Accounting Calendar";
    home: any;
    breadcrumbs: MenuItem[];

    constructor(private legalEntityservice: LegalEntityService, private route: ActivatedRoute, private router: Router,
            private accountListingService: AccountListingService, private calendarService: AccountCalenderService, private authService: AuthService, private alertService:AlertService) {
        //this.currentCalendarObj.fromDate = new Date('2019-01-01');
    }
    //add Legal Entity///
    ngOnInit() {        

        let date = new Date();
        let year = date.getFullYear();
        this.minDate= new Date(year + '-' + '01-01');
       
        //this.loadCompaniesData();
        this.currentCalendarObj.fiscalYear = year;
        this.currentCalendarObj.fromDate = new Date('01-01' + '-' + year );
        this.currentCalendarObj.toDate= new Date('12-31' + '-' + year );
        this.getLedgerObject()

        this.editedData = this.calendarService.editedDetailsObject.subscribe(result => {
            console.log('result :', result)
            if (result && Object.keys(result).length) {
                this.editCalendarPage = true;
                this.loadEditCalendarData(result);
            }
        });

        this.breadcrumbs = [
            { label: 'Accounting' },
            { label: this.editCalendarPage ? 'Accounting Calendar Edit' : 'Create Accounting Calendar' },
        ];
    }
    
    loadEditCalendarData(value) {
        const data = value;
        this.pageTitle = "Accounting Calendar Edit"
        this.currentCalendarObj.ledgername = {
            id: value.name,
            name: value.name
        };            
        this.currentCalendarObj.ledgerdescription = value.description;
        this.currentCalendarObj.entityId = value.legalEntityId;
        let year = value.fiscalYear;
        this.currentCalendarObj.fiscalYear = year;
        this.currentCalendarObj.fromDate = new Date('01-01' + '-' + year);
        this.currentCalendarObj.toDate = new Date('12-31' + '-' + year);
        this.currentCalendarObj.periodType = value.periodName;
        this.currentCalendarObj.noOfPeriods = value.period;
        //this.addCalendar()
        this.showTable = true;
        this.calendarArray = value['data']
    }

    setSelectedAttribute(value) {
        this.selectedPeriod = value;
    }
    private loadCompaniesData() {
        this.legalEntityservice.getEntityList().subscribe(entitydata => {
            this.entitiesObj = entitydata[0];
            let entityObj = {}
            let entityCollection = []
            if (this.entitiesObj) {
                const x = this.entitiesObj.filter((o, index) => {
                    entityObj = {
                        label: this.entitiesObj[index]['name'],
                        value: this.entitiesObj[index]['legalEntityId']
                    }
                    entityCollection.push(entityObj)
                })
            }            
            this.entitiesObj = entityCollection
        });
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }


    loaddefualtObj(selectedMonth,bool) {

        if (selectedMonth == 0 && bool==true) {
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

                    var lastday = new Date(year,lastmonth + 1, 0).getDate();
                    var toDate = new Date('0' + month + '-' + lastday + '-' + year);

                }
                else {
                 //   var fromdate = new Date(this.currentCalendarObj.fiscalYear + '-' + month + '-' + '01');
                    var fromdate = new Date( month + '-' + '01' + '-' + this.currentCalendarObj.fiscalYear);
                    var date = new Date(fromdate);
                    var year = date.getFullYear();
                    var lastmonth = date.getMonth();
                    //var lastday = new Date(year, lastmonth + 1, 0).getDate();
                    //var toDate = new Date(year + '-' + month + '-' + lastday);

                    var lastday = new Date(year,lastmonth + 1, 0).getDate();
                    var toDate = new Date( month + '-' + lastday + '-' + year);
                }

                let defualtCalendarObj = {

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
                    var lastday = new Date(year,lastmonth + 1, 0).getDate();
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

                    var lastday = new Date(year,lastmonth + 1, 0).getDate();
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
                var lastday = new Date(year,lastmonth + 1, 0).getDate();
                var toDate = new Date('0' + month + '-' + lastday + '-' + year);


            }
            else {
               // var fromdate = new Date(this.currentCalendarObj.fiscalYear + '-' + month + '-' + '01');
                var fromdate = new Date( month + '-' + '01' + '-' + this.currentCalendarObj.fiscalYear);
                var date = new Date(fromdate);
                var year = date.getFullYear();
                var lastmonth = date.getMonth();
                //var lastday = new Date(year, lastmonth + 1, 0).getDate();
                //var toDate = new Date(year + '-' + month + '-' + lastday);

                var lastday = new Date(year,lastmonth + 1, 0).getDate();
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
                    periodName: fiscalName+ ' - ' + this.currentCalendarObj.fiscalYear,
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
            var months = ["Select","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec","APJ-PD"];
            var qtr = [1, 2, 3,4,5,6,7,8,9,10,11,12];
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
                isAdjustPeriod:false,
                legalEntityId: this.currentCalendarObj.legalEntityId

            }

            return defualtCalendarObj;
        }

    }
    setAdjustingPeriod(selectedObj,selectedIndex) {
        let index = selectedIndex-1;
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
    addCalendar() {
        this.isBoolean = false;

        if (!(this.currentCalendarObj.ledgername && this.currentCalendarObj.fiscalYear && this.currentCalendarObj.fromDate && this.currentCalendarObj.toDate && this.currentCalendarObj.periodType
            && this.currentCalendarObj.entityId && this.currentCalendarObj.noOfPeriods)) {
            this.display = true;
        }

        if (!this.display) {
            if (this.editCalendarPage) {
                this.selectedPeriod = this.currentCalendarObj.noOfPeriods
            }

            this.calendarArray = [];
            var date2 = new Date(this.currentCalendarObj.fromDate);
            var date1 = new Date(this.currentCalendarObj.toDate);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (dayDifference == 365 || dayDifference==364) {
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
                             setBool= true;
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
                    this.calendarArray.push(this.loaddefualtObj(month,setBool));
                }
            }
            else {
                this.alertService.showMessage("Please select valid start date and end date");
            }
        }
        else {

        }
    }
    deleteRow(index) {
        this.calendarArray.splice(index, 1);
    }
    setMonthDate() {

        if (!isNaN(new Date('01-01' + '-' + this.currentCalendarObj.fiscalYear).getTime())
            && typeof (this.currentCalendarObj.fiscalYear) != 'undefined' && this.currentCalendarObj.fiscalYear) {
            this.currentCalendarObj.fromDate = new Date('01-01' + '-' + this.currentCalendarObj.fiscalYear);
        //this.currentCalendarObj.toDate = "";
        this.currentCalendarObj.toDate = new Date('12-31' + '-' + this.currentCalendarObj.fiscalYear);
        };
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
        if (showDiff) {
            if (this.completeCalendarData.length > 0) {
                for (let i = 0; i < this.completeCalendarData.length; i++) {
                    if (year == this.completeCalendarData[i].fiscalYear && name == this.completeCalendarData[i].name) {
                        addDetails = true;
                        this.alertService.showMessage("Calendar Year already Exists!");
                        break;

                    }

                }
                if (!addDetails) {
                    this.calendarService.add(this.calendarArray).subscribe(data => {
                        this.alertService.showMessage("Success", 'Calendar data added successfully.', MessageSeverity.success);                       
                        this.router.navigateByUrl('/generalledgermodule/generalledgerpage/app-account-listing-calendar');
                    })
                }
            }
            else {
                
                this.calendarService.add(this.calendarArray).subscribe(data => {
                    this.alertService.showMessage("Success", 'Calendar data added successfully.', MessageSeverity.success);
                    this.router.navigateByUrl('/generalledgermodule/generalledgerpage/app-account-listing-calendar');
                })
            }
        }

    }
    addPeriodName(obj, selectedName) {
        let selectedMonth;
        var months = ["Select","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (let i = 0; i < months.length; i++){
            if (selectedName == months[i]) {
                selectedMonth = i;
            }
        }
        let month = selectedMonth;
        if (month <= 9) {

            var fromdate = new Date(this.currentCalendarObj.fiscalYear + '-' + '0' + month + '-' + '01');
            var date = new Date(fromdate);
            var year = date.getFullYear();
            var lastmonth = date.getMonth();
            var lastday = new Date(year, lastmonth + 1, 0).getDate();
            var toDate = new Date(year + '-' + '0' + month + '-' + lastday);
            obj.fromDate = fromdate;
            obj.toDate = toDate;

        }
        else {
            var fromdate = new Date(this.currentCalendarObj.fiscalYear + '-' + month + '-' + '01');
            var date = new Date(fromdate);
            var year = date.getFullYear();
            var lastmonth = date.getMonth();
            var lastday = new Date(year, lastmonth + 1, 0).getDate();
            var toDate = new Date(year + '-' + month + '-' + lastday);
            obj.fromDate = fromdate;
            obj.toDate = toDate;
        }
        obj["periodName"] = selectedName + ' - ' + obj.fiscalYear
    }
    setDate(obj,index) {

        let nextIndex = index + 1;
        let yourDate = new Date(obj.toDate.getTime() + (1000 * 60 * 60 * 24));
        if (this.calendarArray[nextIndex] && obj.adjusting != 'yes') {
            if (this.calendarArray[nextIndex].adjusting == 'yes') {
                this.calendarArray[nextIndex].fromDate = obj.toDate;
                this.calendarArray[nextIndex].toDate = obj.toDate;
            } else {
                this.calendarArray[nextIndex].fromDate = new Date(yourDate);
                //this.calendarArray[nextIndex].toDate = new Date(yourDate);
            }

        }



    }
    addPeriod() {
        //debugger;
        if (this.calendarArray && this.calendarArray.length > 0) {

        }
        this.period++;
        this.calendarArray.push(this.loaddefualtObj(this.selectedPeriod,false));
    }
    showNumofPeriods(event) {
       // debugger;
        if (event == 'Calendar Months') {
            this.showFiscal = false;
            this.showCalendarMonths = true;
            this.showDefualt = false;
        }
        else if (event == 'Fiscal Month') {
            this.showCalendarMonths = false;
            this.showFiscal = true;
            this.showDefualt = false;
        }
        else if (event == 'Select') {
            this.showDefualt = true;
            this.showCalendarMonths = false;
            this.showFiscal = false;
        }
    }

    getLedgerObject(){
         this.accountListingService.getLedgerData().subscribe(
            datalist=> {
                console.log('getLedgerData :', JSON.stringify(datalist))
                 let obj = {}
                 let collection = []
                const x = datalist.filter((o, index) => {
                    if (datalist[index]['ledgerName'] && datalist[index]['parentId']) {
                        obj = {
                            id: datalist[index]['parentId'],
                            name: datalist[index]['ledgerName']
                        }
                        collection.push(obj)
                    }                  
                })
            this.ledgerNameObjectData = collection
            })
    }

    loadLedgerNames(event){
        if(this.ledgerNameObjectData){
            this.ledgerNameObject = [...this.ledgerNameObjectData.filter(x => {
                return x.name.toLowerCase().includes(event.query.toLowerCase())
            })]
        }
    }

    loadEntityByParentId(event) {
        if (Object.keys(event).length) {
            this.accountListingService.getEntitiesByParentId(event.id).subscribe(entitydata => {
                if (entitydata) {
                    var entityObj = {}
                    var entityCollection = []
                    const x = entitydata.filter((o, index) => {
                        entityObj = {
                            label: entitydata[index]['name'],
                            value: entitydata[index]['legalEntityId']
                        }
                        entityCollection.push(entityObj)
                    })
                    this.entitiesObj = entityCollection
                }
            });
        }
    }
    isEmptyOrSpaces(str) {
        return !str || str.trim() === '';
    }

    ngOnDestroy() {
       // this.routeData.unsubscribe();
        this.editedData.unsubscribe();
        this.calendarService.emitCalendarDetails([]);
    }
}