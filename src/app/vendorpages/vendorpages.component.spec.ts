/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorpagesComponent } from './vendorpages.component';

let component: VendorpagesComponent;
let fixture: ComponentFixture<VendorpagesComponent>;

describe('Vendorpages component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorpagesComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorpagesComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});