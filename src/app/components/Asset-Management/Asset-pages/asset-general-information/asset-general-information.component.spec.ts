/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetGeneralInformationComponent } from './asset-general-information.component';

let component: AssetGeneralInformationComponent;
let fixture: ComponentFixture<AssetGeneralInformationComponent>;

describe('asset-general-information component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AssetGeneralInformationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetGeneralInformationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});