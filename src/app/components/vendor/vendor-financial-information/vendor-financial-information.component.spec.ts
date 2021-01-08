/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorFinancialInformationComponent } from './vendor-financial-information.component';

let component: VendorFinancialInformationComponent;
let fixture: ComponentFixture<VendorFinancialInformationComponent>;

describe('VendorFinancialInformation component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorFinancialInformationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorFinancialInformationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});