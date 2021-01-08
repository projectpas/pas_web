/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorContactsComponent } from './vendor-contacts.component';

let component: VendorContactsComponent;
let fixture: ComponentFixture<VendorContactsComponent>;

describe('VendorContacts component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorContactsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorContactsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});