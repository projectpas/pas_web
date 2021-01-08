/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AccountingCalendarComponent } from './accounting-calendar.component';

let component: AccountingCalendarComponent;
let fixture: ComponentFixture<AccountingCalendarComponent>;

describe('AccountingCalendar component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AccountingCalendarComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AccountingCalendarComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});