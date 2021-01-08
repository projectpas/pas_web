/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AircraftModelComponent } from './aircraft-model.component';

let component: AircraftModelComponent;
let fixture: ComponentFixture<AircraftModelComponent>;

describe('aircraft-model component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AircraftModelComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AircraftModelComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});