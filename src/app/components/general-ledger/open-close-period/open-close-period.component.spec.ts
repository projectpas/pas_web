/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { OpenClosePeriodComponent } from './open-close-period.component';

let component: OpenClosePeriodComponent;
let fixture: ComponentFixture<OpenClosePeriodComponent>;

describe('OpenClosePeriod component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ OpenClosePeriodComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(OpenClosePeriodComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});