/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { WorkOrderListComponent } from './work-order-list.component';

let component: WorkOrderListComponent;
let fixture: ComponentFixture<WorkOrderListComponent>;

describe('WorkOrderList component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WorkOrderListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(WorkOrderListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});