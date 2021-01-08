/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AccountReportsComponent } from './account-reports.component';

let component: AccountReportsComponent;
let fixture: ComponentFixture<AccountReportsComponent>;

describe('AccountReports component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AccountReportsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AccountReportsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});