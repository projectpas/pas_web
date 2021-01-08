/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { LeadsListComponent } from './leads-list.component';

let component: LeadsListComponent;
let fixture: ComponentFixture<LeadsListComponent>;

describe('LeadsList component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LeadsListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(LeadsListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});