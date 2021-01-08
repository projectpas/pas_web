/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AddVendorCapabilitiesComponent } from './add-vendor-capabilities.component';

let component: AddVendorCapabilitiesComponent;
let fixture: ComponentFixture<AddVendorCapabilitiesComponent>;

describe('add-vendor-capabilities component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AddVendorCapabilitiesComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AddVendorCapabilitiesComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});