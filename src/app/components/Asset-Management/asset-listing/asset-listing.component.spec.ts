/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetListingComponent } from './asset-listing.component';

let component: AssetListingComponent;
let fixture: ComponentFixture<AssetListingComponent>;

describe('Asset-listing component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AssetListingComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetListingComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});