/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { StockAdjustmentComponent } from './stock-adjustment.component';

let component: StockAdjustmentComponent;
let fixture: ComponentFixture<StockAdjustmentComponent>;

describe('stock-adjustment component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ StockAdjustmentComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(StockAdjustmentComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});