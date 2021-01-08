/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetCalibrationComponent } from './asset-calibration.component';

let component: AssetCalibrationComponent;
let fixture: ComponentFixture<AssetCalibrationComponent>;

describe('asset-calibration component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AssetCalibrationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetCalibrationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});