/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetTypeComponent } from './asset-type.component';

let component: AssetTypeComponent;
let fixture: ComponentFixture<AssetTypeComponent>;

describe('AssetType component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AssetTypeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});