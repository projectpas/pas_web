/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorGeneralInformationComponent } from './vendor-general-information.component';

let component: VendorGeneralInformationComponent;
let fixture: ComponentFixture<VendorGeneralInformationComponent>;

describe('VendorGeneralInformation component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorGeneralInformationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorGeneralInformationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});