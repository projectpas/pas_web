/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ItemMasterExchangeLoanComponent } from './item-master-exch-loan.component';

let component: ItemMasterExchangeLoanComponent;
let fixture: ComponentFixture<ItemMasterExchangeLoanComponent>;

describe('item-master-exch-loan component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ItemMasterExchangeLoanComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ItemMasterExchangeLoanComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});