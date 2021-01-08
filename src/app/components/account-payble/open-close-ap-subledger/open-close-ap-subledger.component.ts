import { Component, OnInit } from '@angular/core';
import { AccountCalenderService } from '../../../services/account-calender/accountcalender.service';
import { AlertService } from '../../../services/alert.service';
import { LegalEntityService } from '../../../services/legalentity.service';

@Component({
    selector: 'app-open-close-ap-subledger',
    templateUrl: './open-close-ap-subledger.component.html',
    styleUrls: ['./open-close-ap-subledger.component.scss']
})
/** open-close-ap-subledger component*/
export class OpenCloseApSubledgerComponent implements OnInit {
    /** open-close-ap-subledger ctor */
    calendarArray: any = {};
    finalCalendarArry: any = [];
    completeCalendarData: any[] = [];
    currentApledgerObj: any = {};
    companyList: any[] = [];
    constructor(private legalEntityservice:LegalEntityService,private calendarService: AccountCalenderService, private alertService:AlertService) {

    }
    setIsUpdate(value, obj) {
        if (value == 3) {

        }
        else {
            obj.isUpdate = true;
        }

    }
    //based on Ledger and fiscalyear and legal entity query////
    ngOnInit() {
        this.loadCompaniesData();
    }
    private loadCompaniesData() {
        this.legalEntityservice.getEntityList().subscribe(entitydata => {
            this.companyList = entitydata[0];
        });
    }
    loadAccountCalendarData() {
         this.calendarService.getAll().subscribe(data => {
             this.completeCalendarData = data[0];
                   

            for (let i = 0; i < this.completeCalendarData.length; i++) {             
                // if (this.completeCalendarData[i].name == this.currentApledgerObj.ledgerName && this.completeCalendarData[i].fiscalYear == this.currentApledgerObj.fiscalYear && this.completeCalendarData[i].legalEntityId==this.currentApledgerObj.legalEntityId) {
                if (this.completeCalendarData[i].fiscalYear == this.currentApledgerObj.fiscalYear && this.completeCalendarData[i].legalEntityId == this.currentApledgerObj.legalEntityId) {
                    this.setFromDate(this.completeCalendarData[i]);
                    this.seToDate(this.completeCalendarData[i]);
                    this.finalCalendarArry.push(this.completeCalendarData[i]);
                }

            }
            this.calendarArray = JSON.parse(JSON.stringify(this.finalCalendarArry));;
            console.log(this.completeCalendarData);
        })
        
    }
    setFromDate(completeObj) {

        let fromDate = new Date(completeObj.fromDate);
        let todaysDate = new Date();
        let currentYear = todaysDate.getFullYear();
        let currentMonth = (1 + todaysDate.getMonth()).toString();
        let formatMonth = currentMonth.length > 1 ? currentMonth : '0' + currentMonth;
        var year = fromDate.getFullYear();
        let month = (1 + fromDate.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = fromDate.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        completeObj.fromDate = year + '-' + month + '-' + day;
        if (completeObj.isUpdate == false || completeObj.isUpdate == null) {
            if (year == currentYear) {
                if (formatMonth == month) {
                    completeObj.status = 1;
                }
                else if (formatMonth > month) {
                    completeObj.status = 2;
                }
                else if (formatMonth < month) {
                    completeObj.status = 4;
                }
            }
            else {
                completeObj.status = 4;
            }
        }
        else {

        }
    }
    seToDate(completeObj) {
        let fromDate = new Date(completeObj.toDate);
        var year = fromDate.getFullYear();
        var month = (1 + fromDate.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = fromDate.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        completeObj.toDate = year + '-' + month + '-' + day;
    }
    saveCalendar() {
     
        if (this.finalCalendarArry && this.finalCalendarArry.length > 0) {
            for (let i = 0; i < this.finalCalendarArry.length; i++) {
                if (this.finalCalendarArry[i].status == 3) {
                    this.finalCalendarArry[i].isUpdate = true;
                }
            }
            this.calendarService.add(this.finalCalendarArry).subscribe(data => {
                this.alertService.showMessage('Calendar data updated successfully.');
            })
        }
    }
    getDataBasedonYear() {
        this.finalCalendarArry = [];
        this.loadAccountCalendarData();
    }
}