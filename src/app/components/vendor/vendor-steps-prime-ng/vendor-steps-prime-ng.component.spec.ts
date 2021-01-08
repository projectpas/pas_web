/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorStepsPrimeNgComponent } from './vendor-steps-prime-ng.component';

let component: VendorStepsPrimeNgComponent;
let fixture: ComponentFixture<VendorStepsPrimeNgComponent>;

describe('vendor-steps-primeNG component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorStepsPrimeNgComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorStepsPrimeNgComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});