/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetDisposalSaleComponent } from './asset-disposal-sale.component';

let component: AssetDisposalSaleComponent;
let fixture: ComponentFixture<AssetDisposalSaleComponent>;

describe('Asset-Disposal-Sale component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AssetDisposalSaleComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetDisposalSaleComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});