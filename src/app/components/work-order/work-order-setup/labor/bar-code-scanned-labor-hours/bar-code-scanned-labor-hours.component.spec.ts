/// <reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { BarCodeScannedLaborHoursComponent } from './bar-code-scanned-labor-hours.component';

let component: BarCodeScannedLaborHoursComponent;
let fixture: ComponentFixture<BarCodeScannedLaborHoursComponent>;

describe('BarCodeScannedLaborHours component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ BarCodeScannedLaborHoursComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(BarCodeScannedLaborHoursComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});