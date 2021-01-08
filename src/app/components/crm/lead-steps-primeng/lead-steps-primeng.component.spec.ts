/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { LeadStepsPrimengComponent } from './lead-steps-primeng.component';

let component: LeadStepsPrimengComponent;
let fixture: ComponentFixture<LeadStepsPrimengComponent>;

describe('lead-steps-primeng component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LeadStepsPrimengComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(LeadStepsPrimengComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});