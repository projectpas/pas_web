/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetAdjustmentComponent } from './asset-adjustment.component';

let component: AssetAdjustmentComponent;
let fixture: ComponentFixture<AssetAdjustmentComponent>;

describe('asset-adjustment component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AssetAdjustmentComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetAdjustmentComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});