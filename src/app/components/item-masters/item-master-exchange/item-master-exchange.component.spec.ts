/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ItemMasterExchangeComponent } from './item-master-exchange.component';

let component: ItemMasterExchangeComponent;
let fixture: ComponentFixture<ItemMasterExchangeComponent>;

describe('item-master-exchange component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ItemMasterExchangeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ItemMasterExchangeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});