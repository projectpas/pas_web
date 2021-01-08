/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { WorkOrderAnalysisComponent } from './work-order-analysis.component';

let component: WorkOrderAnalysisComponent;
let fixture: ComponentFixture<WorkOrderAnalysisComponent>;

describe('WorkOrderAnalysis component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WorkOrderAnalysisComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(WorkOrderAnalysisComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});