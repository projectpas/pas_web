/// <reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { WorkOrderEquipmentCheckInOutComponent } from './work-order-equipment-check-in-out.component';

let component: WorkOrderEquipmentCheckInOutComponent;
let fixture: ComponentFixture<WorkOrderEquipmentCheckInOutComponent>;

describe('WorkOrderEquipmentCheckInOut component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WorkOrderEquipmentCheckInOutComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(WorkOrderEquipmentCheckInOutComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});