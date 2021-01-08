/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { TaskAttributesComponent } from './task-attributes.component';

let component: TaskAttributesComponent;
let fixture: ComponentFixture<TaskAttributesComponent>;

describe('ActionAttributes component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaskAttributesComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(TaskAttributesComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});