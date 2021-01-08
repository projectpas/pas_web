/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { PriorityComponent } from './priority.component';

let component: PriorityComponent;
let fixture: ComponentFixture<PriorityComponent>;

describe('Priority component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PriorityComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(PriorityComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});