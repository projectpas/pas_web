/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { WorkOrderReserveIssueComponent } from './work-order-reserve-issue.component';

let component: WorkOrderReserveIssueComponent;
let fixture: ComponentFixture<WorkOrderReserveIssueComponent>;

describe('WorkOrderReserveIssue component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WorkOrderReserveIssueComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(WorkOrderReserveIssueComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});