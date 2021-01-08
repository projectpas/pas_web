/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetAttributeTypeComponent } from './asset-attribute-type.component';

let component: AssetAttributeTypeComponent;
let fixture: ComponentFixture<AssetAttributeTypeComponent>;

describe('Asset Attribute Type component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AssetAttributeTypeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetAttributeTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});