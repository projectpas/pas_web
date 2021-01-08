/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { GeneralLedgerCurrencyComponent } from './general-ledger-currency.component';

let component: GeneralLedgerCurrencyComponent;
let fixture: ComponentFixture<GeneralLedgerCurrencyComponent>;

describe('GeneralLedgerCurrency component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ GeneralLedgerCurrencyComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(GeneralLedgerCurrencyComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});