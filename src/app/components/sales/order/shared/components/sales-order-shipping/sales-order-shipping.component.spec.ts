/// <reference path="../../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { SalesOrderShippingComponent } from './sales-order-shipping.component';

let component: SalesOrderShippingComponent;
let fixture: ComponentFixture<SalesOrderShippingComponent>;

describe('WorkOrderShipping component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SalesOrderShippingComponent],
            imports: [BrowserModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(SalesOrderShippingComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});