/// <reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ScheduleComponent } from './schedule.component';

let component: ScheduleComponent;
let fixture: ComponentFixture<ScheduleComponent>;

describe('schedule component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ScheduleComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ScheduleComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});