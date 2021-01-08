/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorBillingInformationComponent } from './vendor-billing-information.component';

let component: VendorBillingInformationComponent;
let fixture: ComponentFixture<VendorBillingInformationComponent>;

describe('VendorBillingInformation component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorBillingInformationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorBillingInformationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});