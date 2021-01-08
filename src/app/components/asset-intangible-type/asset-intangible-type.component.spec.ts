/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetIntangibleTypeComponent } from './asset-intangible-type.component';

let component: AssetIntangibleTypeComponent;
let fixture: ComponentFixture<AssetIntangibleTypeComponent>;

describe('AssetIntangibleType component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AssetIntangibleTypeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetIntangibleTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});