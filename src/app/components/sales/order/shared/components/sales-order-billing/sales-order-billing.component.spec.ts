/// <reference path="../../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { SalesOrderBillingComponent } from './sales-order-billing.component';

let component: SalesOrderBillingComponent;
let fixture: ComponentFixture<SalesOrderBillingComponent>;

describe('WorkOrderBilling component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SalesOrderBillingComponent],
            imports: [BrowserModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(SalesOrderBillingComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});