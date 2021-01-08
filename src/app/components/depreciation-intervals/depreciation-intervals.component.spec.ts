/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { DepreciationIntervalsComponent } from './depreciation-intervals.component';

let component: DepreciationIntervalsComponent;
let fixture: ComponentFixture<DepreciationIntervalsComponent>;

describe('Depreciation-Intervals component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DepreciationIntervalsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(DepreciationIntervalsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});