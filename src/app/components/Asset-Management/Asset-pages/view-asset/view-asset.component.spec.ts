/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ViewAssetComponent } from './view-asset.component';

let component: ViewAssetComponent;
let fixture: ComponentFixture<ViewAssetComponent>;

describe('Asset-listing component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ViewAssetComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ViewAssetComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});