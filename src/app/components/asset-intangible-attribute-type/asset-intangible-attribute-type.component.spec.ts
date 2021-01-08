/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetIntangibleAttributeTypeComponent } from './asset-intangible-attribute-type.component';

let component: AssetIntangibleAttributeTypeComponent;
let fixture: ComponentFixture<AssetIntangibleAttributeTypeComponent>;

describe('AssetIntangibleType component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AssetIntangibleAttributeTypeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetIntangibleAttributeTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});