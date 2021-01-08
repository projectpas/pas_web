/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { WorkOrderCompleteMaterialListComponent } from './work-order-complete-material-list.component';

let component: WorkOrderCompleteMaterialListComponent;
let fixture: ComponentFixture<WorkOrderCompleteMaterialListComponent>;

describe('WorkOrderCompleteMaterialList component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WorkOrderCompleteMaterialListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(WorkOrderCompleteMaterialListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});