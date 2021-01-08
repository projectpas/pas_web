﻿/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { WorkflowCreateComponent } from './workflow-create.component';

let component: WorkflowCreateComponent;
let fixture: ComponentFixture<WorkflowCreateComponent>;

describe('workflow-create component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WorkflowCreateComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(WorkflowCreateComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});