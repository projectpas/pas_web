/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CapabilityTypeComponent } from './capability-type.component';

let component: CapabilityTypeComponent;
let fixture: ComponentFixture<CapabilityTypeComponent>;

describe('CapabilityType component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CapabilityTypeComponent],
            imports: [BrowserModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CapabilityTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});