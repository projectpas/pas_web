/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { LeadSourceComponent } from './lead-source.component';

let component: LeadSourceComponent;
let fixture: ComponentFixture<LeadSourceComponent>;

describe('lead-source component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LeadSourceComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(LeadSourceComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});