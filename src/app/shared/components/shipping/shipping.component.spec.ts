/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ShippingComponent } from './shipping.component';

let component: ShippingComponent;
let fixture: ComponentFixture<ShippingComponent>;

describe('ShippingComponent component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ShippingComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ShippingComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});