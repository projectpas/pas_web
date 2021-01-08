/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { TaxTypeComponent } from './tax-type.component';

let component: TaxTypeComponent;
let fixture: ComponentFixture<TaxTypeComponent>;

describe('tax-type component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ TaxTypeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(TaxTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});