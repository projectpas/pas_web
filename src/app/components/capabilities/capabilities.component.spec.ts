/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CapabilitiesComponent } from './capabilities.component';

let component: CapabilitiesComponent;
let fixture: ComponentFixture<CapabilitiesComponent>;

describe('Capabilities component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CapabilitiesComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CapabilitiesComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});