/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { VendorsListComponent } from './vendors-list.component';

let component: VendorsListComponent;
let fixture: ComponentFixture<VendorsListComponent>;

describe('VendorsList component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VendorsListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(VendorsListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});