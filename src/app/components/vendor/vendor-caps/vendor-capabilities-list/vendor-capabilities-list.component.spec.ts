/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorCapabilitiesListComponent } from './vendor-capabilities-list.component';

let component: VendorCapabilitiesListComponent;
let fixture: ComponentFixture<VendorCapabilitiesListComponent>;

describe('vendor-capabilities-list component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorCapabilitiesListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorCapabilitiesListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});