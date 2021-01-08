/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { StockLineSetupComponent } from './stock-line-setup.component';

let component: StockLineSetupComponent;
let fixture: ComponentFixture<StockLineSetupComponent>;

describe('stock-line-setup component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ StockLineSetupComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(StockLineSetupComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});