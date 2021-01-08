/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { PurchaseSetupComponent } from './purchase-setup.component';

let component: PurchaseSetupComponent;
let fixture: ComponentFixture<PurchaseSetupComponent>;

describe('purchase-setup component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PurchaseSetupComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(PurchaseSetupComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});