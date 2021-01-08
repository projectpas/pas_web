/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { TaxRateComponent } from './tax-rate.component';

let component: TaxRateComponent;
let fixture: ComponentFixture<TaxRateComponent>;

describe('TaxRate component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ TaxRateComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(TaxRateComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});