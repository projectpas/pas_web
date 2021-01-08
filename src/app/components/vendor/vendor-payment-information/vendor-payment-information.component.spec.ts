/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorPaymentInformationComponent } from './vendor-payment-information.component';

let component: VendorPaymentInformationComponent;
let fixture: ComponentFixture<VendorPaymentInformationComponent>;

describe('VendorPaymentInformation component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorPaymentInformationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorPaymentInformationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});