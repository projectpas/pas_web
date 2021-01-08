/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { StockLineEditComponent } from './stock-line-edit.component';

let component: StockLineEditComponent;
let fixture: ComponentFixture<StockLineEditComponent>;

describe('stock-line-edit component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ StockLineEditComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(StockLineEditComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});