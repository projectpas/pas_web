/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { WorkflowListComponent } from './workflow-list.component';

let component: WorkflowListComponent;
let fixture: ComponentFixture<WorkflowListComponent>;

describe('workflow-list component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WorkflowListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(WorkflowListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});