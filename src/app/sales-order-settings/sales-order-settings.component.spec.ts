/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { SalesOrderSettingsComponent } from './sales-order-settings.component';

let component: SalesOrderSettingsComponent;
let fixture: ComponentFixture<SalesOrderSettingsComponent>;

describe('work-order-settings component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SalesOrderSettingsComponent],
            imports: [BrowserModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(SalesOrderSettingsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});