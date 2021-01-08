/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ItemMasterStockComponent } from './item-master-stock.component';

let component: ItemMasterStockComponent;
let fixture: ComponentFixture<ItemMasterStockComponent>;

describe('item-master-stock component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ItemMasterStockComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ItemMasterStockComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});