/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ConditionsComponent } from './conditions.component';

let component: ConditionsComponent;
let fixture: ComponentFixture<ConditionsComponent>;

describe('Conditions component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ConditionsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ConditionsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});