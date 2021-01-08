/// <reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { SystemGeneratedLaborHoursComponent } from './system-generated-labor-hours.component';

let component: SystemGeneratedLaborHoursComponent;
let fixture: ComponentFixture<SystemGeneratedLaborHoursComponent>;

describe('SystemGeneratedLaborHours component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SystemGeneratedLaborHoursComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(SystemGeneratedLaborHoursComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});