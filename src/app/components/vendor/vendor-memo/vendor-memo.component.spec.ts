/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorMemoComponent } from './vendor-memo.component';

let component: VendorMemoComponent;
let fixture: ComponentFixture<VendorMemoComponent>;

describe('VendorMemo component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorMemoComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorMemoComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});