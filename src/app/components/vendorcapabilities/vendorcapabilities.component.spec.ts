/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorcapabilitiesComponent } from './vendorcapabilities.component';

let component: VendorcapabilitiesComponent;
let fixture: ComponentFixture<VendorcapabilitiesComponent>;

describe('vendorcapabilities component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorcapabilitiesComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorcapabilitiesComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});