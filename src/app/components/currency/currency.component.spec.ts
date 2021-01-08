/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CurrencyComponent } from './currency.component';

let component: CurrencyComponent;
let fixture: ComponentFixture<CurrencyComponent>;

describe('Currency component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CurrencyComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CurrencyComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});