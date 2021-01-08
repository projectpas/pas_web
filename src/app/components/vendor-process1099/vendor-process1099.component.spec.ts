/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorProcess1099Component } from './vendor-process1099.component';

let component: VendorProcess1099Component;
let fixture: ComponentFixture<VendorProcess1099Component>;

describe('VendorProcess1099 component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VendorProcess1099Component],
            imports: [BrowserModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorProcess1099Component);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});