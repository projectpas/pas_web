/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { StockLineListComponent } from './stock-line-list.component';

let component: StockLineListComponent;
let fixture: ComponentFixture<StockLineListComponent>;

describe('stock-line-list component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ StockLineListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(StockLineListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});