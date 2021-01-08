/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorShippingInformationComponent } from './vendor-shipping-information.component';

let component: VendorShippingInformationComponent;
let fixture: ComponentFixture<VendorShippingInformationComponent>;

describe('VendorShippingInformation component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorShippingInformationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorShippingInformationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});