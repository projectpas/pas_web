/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CreditTermsComponent } from './credit-terms.component';

let component: CreditTermsComponent;
let fixture: ComponentFixture<CreditTermsComponent>;

describe('CreditTerms component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CreditTermsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CreditTermsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});