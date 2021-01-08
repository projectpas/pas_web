/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { EditVendorCapabilitiesComponent } from './edit-vendor-capabilities.component';

let component: EditVendorCapabilitiesComponent;
let fixture: ComponentFixture<EditVendorCapabilitiesComponent>;

describe('edit-vendor-capabilities component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditVendorCapabilitiesComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(EditVendorCapabilitiesComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});