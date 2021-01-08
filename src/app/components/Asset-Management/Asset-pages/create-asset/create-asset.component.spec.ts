/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CreateAssetComponent } from './create-asset.component';

let component: CreateAssetComponent;
let fixture: ComponentFixture<CreateAssetComponent>;

describe('create-asset component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CreateAssetComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CreateAssetComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});