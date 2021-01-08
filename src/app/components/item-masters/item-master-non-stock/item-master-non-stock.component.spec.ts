/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ItemMasterNonStockComponent } from './item-master-non-stock.component';

let component: ItemMasterNonStockComponent;
let fixture: ComponentFixture<ItemMasterNonStockComponent>;

describe('item-master-non-stock component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ItemMasterNonStockComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ItemMasterNonStockComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});