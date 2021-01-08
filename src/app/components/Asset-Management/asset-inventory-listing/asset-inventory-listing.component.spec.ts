/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetInventoryListingComponent } from './asset-inventory-listing.component';

let component: AssetInventoryListingComponent;
let fixture: ComponentFixture<AssetInventoryListingComponent>;

describe('asset-inventory-listing component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AssetInventoryListingComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetInventoryListingComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});