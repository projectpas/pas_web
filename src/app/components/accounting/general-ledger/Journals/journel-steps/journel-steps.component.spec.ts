/// <reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { JournelStepsComponent } from './journel-steps.component';

let component: JournelStepsComponent;
let fixture: ComponentFixture<JournelStepsComponent>;

describe('journel-steps component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ JournelStepsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(JournelStepsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});