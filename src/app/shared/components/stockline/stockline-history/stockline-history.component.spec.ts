/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { StocklineHistoryComponent } from './stockline-history.component';

let component: StocklineHistoryComponent;
let fixture: ComponentFixture<StocklineHistoryComponent>;

describe('StocklineHistoryComponent component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ StocklineHistoryComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(StocklineHistoryComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});