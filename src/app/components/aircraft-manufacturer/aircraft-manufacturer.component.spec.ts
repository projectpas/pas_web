/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AircraftManufacturerComponent } from './aircraft-manufacturer.component';

let component: AircraftManufacturerComponent;
let fixture: ComponentFixture<AircraftManufacturerComponent>;

describe('aircraft-manufacturer component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AircraftManufacturerComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AircraftManufacturerComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});