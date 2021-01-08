/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { WorkPerformedComponent } from './work-performed.component';

let component: WorkPerformedComponent;
let fixture: ComponentFixture<WorkPerformedComponent>;

describe('WorkPerformed component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WorkPerformedComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(WorkPerformedComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});