/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { StocklineViewComponent } from './stockline-view.component';

let component: StocklineViewComponent;
let fixture: ComponentFixture<StocklineViewComponent>;

describe('StocklineViewComponent component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ StocklineViewComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(StocklineViewComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});