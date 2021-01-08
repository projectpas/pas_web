/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorClassificationComponent } from './vendor-classification.component';

let component: VendorClassificationComponent;
let fixture: ComponentFixture<VendorClassificationComponent>;

describe('VendorClassification component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorClassificationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorClassificationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});