/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorEmailsComponent } from './vendor-emails.component';

let component: VendorEmailsComponent;
let fixture: ComponentFixture<VendorEmailsComponent>;

describe('VendorEmails component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorEmailsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorEmailsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});