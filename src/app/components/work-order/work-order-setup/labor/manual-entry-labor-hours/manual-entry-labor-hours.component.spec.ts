/// <reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ManualEntryLaborHoursComponent } from './manual-entry-labor-hours.component';

let component: ManualEntryLaborHoursComponent;
let fixture: ComponentFixture<ManualEntryLaborHoursComponent>;

describe('ManualEntryLaborHours component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ManualEntryLaborHoursComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ManualEntryLaborHoursComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});