/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { PurchaseOrderComponent } from './purchase-order.component';

let component: PurchaseOrderComponent;
let fixture: ComponentFixture<PurchaseOrderComponent>;

describe('purchase-order component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PurchaseOrderComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(PurchaseOrderComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});