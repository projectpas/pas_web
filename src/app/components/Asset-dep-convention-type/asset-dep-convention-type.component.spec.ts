/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetDepConventionTypeComponent } from './asset-dep-convention-type.component';

let component: AssetDepConventionTypeComponent;
let fixture: ComponentFixture<AssetDepConventionTypeComponent>;

describe('AssetDepConventionType component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AssetDepConventionTypeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetDepConventionTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});